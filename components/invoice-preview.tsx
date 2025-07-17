"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Mail, Printer } from "lucide-react"
import { InvoiceCover } from "./invoice-cover"
import type { InvoiceFormData, InvoiceItem } from "./invoice-form"

interface InvoicePreviewProps {
  formData: InvoiceFormData
  items: InvoiceItem[]
  vat: number
  total: number
  onBack: () => void
}

export function InvoicePreview({ formData, items, vat, total, onBack }: InvoicePreviewProps) {
  const [isSendingEmail, setIsSendingEmail] = useState(false)

  const handlePrint = () => {
    window.print()
  }

  const handleEmail = async () => {
    try {
      setIsSendingEmail(true)
      
      // إنشاء رابط البريد الإلكتروني البسيط
      const subject = encodeURIComponent(`فاتورة رقم ${formData.invoiceNumber}`)
      const body = encodeURIComponent(`
مرحباً،

مرفق الفاتورة رقم ${formData.invoiceNumber} بتاريخ ${formatDate(formData.invoiceDate)}.

المبلغ الإجمالي: ${formatNumber(total)} ${formData.currency}

شكراً لتعاملكم معنا.

مع تحيات،
${formData.companyName}
      `)
      
      // فتح تطبيق البريد الإلكتروني
      window.open(`mailto:${formData.clientEmail}?subject=${subject}&body=${body}`)
      
    } catch (error) {
      console.error("Email sending failed:", error)
      alert("حدث خطأ أثناء إرسال البريد الإلكتروني")
    } finally {
      setIsSendingEmail(false)
    }
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString("ar-SA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen  bg-gray-50 print:bg-white " id="invoice-container">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6 print:hidden">
        <div className="w-full flex items-center justify-between">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center gap-2 border-primary text-primary hover:bg-primary hover:text-white font-cairo"
          >
            <ArrowLeft className="h-4 w-4" />
            رجوع
          </Button>

          <div className="flex gap-2 items-center">
            <Button
              variant="outline"
              onClick={handlePrint}
              className="flex items-center gap-2 border-primary text-white bg-primary  font-cairo"
            >
              <Printer className="h-4 w-4" />
              طباعة
            </Button>
          </div>
        </div>
      </div>

      {/* Invoice Preview */}
      <div className="w-full p-6 print:p-0">
        <Card className="bg-white shadow-lg print:shadow-none">
          <CardContent className="p-8 print:p-8">
            {/* غلاف الفاتورة */}
            <InvoiceCover 
              formData={formData}
              total={total}
              invoiceNumber={formData.invoiceNumber}
              invoiceDate={formData.invoiceDate}
            />

            {/* Items Table */}
            <div className="mb-8 print:mb-8">
              <div className="flex items-center gap-2 mb-4 print:mb-4">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <h2 className="text-xl font-cairo-bold text-primary">تفاصيل المنتجات/الخدمات</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200 rounded-lg overflow-hidden shadow-sm print:shadow-none">
                  <thead>
                    <tr className="bg-gradient-to-r from-primary to-primary/90 text-white">
                      <th className="border border-gray-200 p-4 text-right font-cairo-bold text-sm">الوصف</th>
                      <th className="border border-gray-200 p-4 text-center font-cairo-bold text-sm">الكمية</th>
                      <th className="border border-gray-200 p-4 text-center font-cairo-bold text-sm">سعر الوحدة</th>
                      <th className="border border-gray-200 p-4 text-center font-cairo-bold text-sm">السعر الإجمالي</th>
                      <th className="border border-gray-200 p-4 text-center font-cairo-bold text-sm">الخصم</th>
                      <th className="border border-gray-200 p-4 text-center font-cairo-bold text-sm">المجموع</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={item.id} className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100 print:hover:bg-transparent`}>
                        <td className="border border-gray-200 p-4 text-right font-cairo text-sm">{item.description}</td>
                        <td className="border border-gray-200 p-4 text-center font-cairo text-sm">{item.quantity}</td>
                        <td className="border border-gray-200 p-4 text-center font-cairo text-sm">{formatNumber(item.unitPrice)}</td>
                        <td className="border border-gray-200 p-4 text-center font-cairo text-sm">{formatNumber(item.quantity * item.unitPrice)}</td>
                        <td className="border border-gray-200 p-4 text-center font-cairo text-sm text-red-600">{formatNumber(item.discount)}</td>
                        <td className="border border-gray-200 p-4 text-center font-cairo-bold text-sm text-primary">{formatNumber(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals */}
            <div className="mb-8 print:mb-8">
              <div className="flex items-center gap-2 mb-4 print:mb-4">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <h2 className="text-xl font-cairo-bold text-primary">المجاميع</h2>
              </div>
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 p-6 print:p-6 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:gap-4">

                  <div className="text-center p-4 bg-white/50 rounded-lg print:bg-white/50">
                    <p className="font-cairo-bold text-neutral-grey text-sm mb-1">الضريبة (15%)</p>
                    <p className="font-cairo-bold text-lg text-secondary">{formatNumber(vat)} {formData.currency}</p>
                  </div>
                  <div className="text-center p-4 bg-primary/20 rounded-lg print:bg-primary/20 border-2 border-primary">
                    <p className="font-cairo-bold text-primary text-sm mb-1">الإجمالي</p>
                    <p className="font-cairo-bold text-2xl text-primary">{formatNumber(total)} {formData.currency}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Terms and Notes */}
            {(formData.paymentTerms || formData.notes) && (
              <div className="mb-8 print:mb-8">
                <div className="flex items-center gap-2 mb-4 print:mb-4">
                  <div className="w-2 h-2 bg-accent-blue-1 rounded-full"></div>
                  <h2 className="text-xl font-cairo-bold text-accent-blue-1">شروط الدفع والملاحظات</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:gap-6">
                  {formData.paymentTerms && (
                    <Card className="border-accent-blue-1/20 print:border-accent-blue-1/20">
                      <CardContent className="p-4 print:p-4">
                        <h3 className="font-cairo-bold text-accent-blue-1 mb-2 flex items-center gap-2">
                          <div className="w-1 h-1 bg-accent-blue-1 rounded-full"></div>
                          شروط الدفع
                        </h3>
                        <p className="font-cairo text-sm text-neutral-grey">{formData.paymentTerms}</p>
                      </CardContent>
                    </Card>
                  )}
                  {formData.notes && (
                    <Card className="border-accent-blue-2/20 print:border-accent-blue-2/20">
                      <CardContent className="p-4 print:p-4">
                        <h3 className="font-cairo-bold text-accent-blue-2 mb-2 flex items-center gap-2">
                          <div className="w-1 h-1 bg-accent-blue-2 rounded-full"></div>
                          ملاحظات
                        </h3>
                        <p className="font-cairo text-sm text-neutral-grey">{formData.notes}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="text-center pt-8 print:pt-8 border-t border-gray-200" >
              <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 print:p-6 rounded-lg" dir="ltr">
                <p className="text-primary font-cairo-bold text-lg mb-2">شكراً لتعاملكم معنا</p>
                <p className="text-neutral-grey font-cairo text-xs"> © 2025 {formData.companyName}. جميع الحقوق محفوظة.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="bg-white border-t border-gray-200 p-6 print:hidden">
        <div className="w-full flex flex-wrap gap-4 justify-center">
          <Button
            variant="outline"
            onClick={handleEmail}
            disabled={isSendingEmail}
            className="flex items-center gap-2 border-primary text-primary hover:bg-primary hover:text-white font-cairo"
          >
            <Mail className="h-4 w-4" />
            {isSendingEmail ? "جاري الإرسال..." : "إرسال بالبريد الإلكتروني"}
          </Button>
        </div>
      </div>
    </div>
  )
}
