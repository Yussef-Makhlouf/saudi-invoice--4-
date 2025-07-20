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
      const subject = encodeURIComponent(`عرض سعر الكتروني رقم ${formData.invoiceNumber}`)
      const body = encodeURIComponent(`
مرحباً،

مرفق العرض سعر الكتروني رقم ${formData.invoiceNumber} بتاريخ ${formatDate(formData.invoiceDate)}.

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
            {/* غلاف العرض سعر الكتروني */}
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
                      {items.some(item => item.advancePayment > 0) && (
                        <th className="border border-gray-200 p-4 text-center font-cairo-bold text-sm">الدفعة المقدمة</th>
                      )}
                      {items.some(item => item.advancePayment > 0) && (
                        <th className="border border-gray-200 p-4 text-center font-cairo-bold text-sm">المبلغ المتبقي</th>
                      )}
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
                        {item.advancePayment > 0 && (
                          <td className="border border-gray-200 p-4 text-center font-cairo-bold text-sm text-green-600">
                            {formatNumber(item.advancePayment)}
                          </td>
                        )}
                        {item.advancePayment > 0 && (
                          <td className="border border-gray-200 p-4 text-center font-cairo-bold text-sm text-orange-600">
                            {formatNumber(item.remainingAmount)}
                          </td>
                        )}
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

            {/* QR Code Section */}
            <div className="mb-8 print:mb-8">
              <div className="flex items-center gap-2 mb-4 print:mb-4">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <h2 className="text-xl font-cairo-bold text-primary">ترخيص النشاط التجاري</h2>
              </div>
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 p-4 sm:p-6 print:p-6 rounded-lg">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                  <div className="text-center sm:text-right flex-1">
                    <h3 className="font-cairo-bold text-primary text-base sm:text-lg mb-2">مسح للتحقق من الترخيص</h3>
                    <p className="text-sm text-gray-600 font-cairo-medium mb-2">ترخيص النشاط التجاري</p>
                    <p className="text-xs text-gray-500 font-cairo-medium">
                      استخدم كاميرا هاتفك لمسح الرمز والتحقق من صحة الترخيص
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 bg-white rounded-lg border-2 border-primary/30 p-2 print:p-2 shadow-sm">
                      <img 
                        src="/license.jpg" 
                        alt="QR Code - ترخيص النشاط التجاري" 
                        className="w-full h-full object-contain rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

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
    </div>
  )
}
