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
    // عرض الأرقام بالإنجليزية
    return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 print:bg-white " id="invoice-container">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6 print:hidden">
        <div className="w-full flex items-center justify-between">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center gap-2 border-primary text-primary hover:bg-primary hover:text-white "
          >
            <ArrowLeft className="h-4 w-4" />
            رجوع
          </Button>

          <div className="flex gap-2 items-center">
            <Button
              variant="outline"
              onClick={handlePrint}
              className="flex items-center gap-2 border-primary text-white bg-primary "
            >
              <Printer className="h-4 w-4" />
              طباعة
            </Button>
          </div>
        </div>
      </div>

      {/* Invoice Preview */}
      <div className="w-full p-2 print:p-0">
        <Card className="bg-white shadow-lg print:shadow-none">
          <CardContent className="p-2 print:p-2">
            {/* غلاف العرض سعر الكتروني */}
            <InvoiceCover 
              formData={formData}
              total={total}

              invoiceNumber={formData.invoiceNumber}
              invoiceDate={formData.invoiceDate}
            />

            {/* Items Table */}
            <div className="mb-2 print:mb-2">
              <div className="flex items-center gap-2 mb-2 print:mb-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <h2 className="text-xl font-handicrafts text-primary">تفاصيل الخدمات</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200 rounded-lg overflow-hidden shadow-sm print:shadow-none">
                  <thead>
                    <tr className="bg-gradient-to-r from-primary to-primary/90 text-white">
                      <th className="border border-gray-200 p-4 text-right text-sm">الوصف</th>
                      <th className="border border-gray-200 p-4 text-center text-sm">الكمية</th>
                      <th className="border border-gray-200 p-4 text-center  text-sm">السعر النهائي</th>
                      <th className="border border-gray-200 p-4 text-center  text-sm">الخصم</th>
                      <th className="border border-gray-200 p-4 text-center  text-sm">السعر بعد الخصم</th>
                      <th className="border border-gray-200 p-4 text-center  text-sm">الدفعة المقدمة</th>
                      <th className="border border-gray-200 p-4 text-center  text-sm">المبلغ المتبقي</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={item.id} className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100 print:hover:bg-transparent`}>
                        <td className="border border-gray-200 p-4 text-right  text-sm whitespace-pre-wrap">{item.description}</td>
                        <td className="border border-gray-200 p-4 text-center  text-sm">{item.quantity}</td>
                        <td className="border border-gray-200 p-4 text-center -bold text-sm text-primary">{formatNumber(item.total)}</td>
                        <td className="border border-gray-200 p-4 text-center  text-sm text-red-600">
                          {item.discount}%
                        </td>
                        <td className="border border-gray-200 p-4 text-center -bold text-sm text-primary">
                          {formatNumber(item.total * (1 - item.discount / 100))}
                        </td>
                        <td className="border border-gray-200 p-4 text-center -bold text-sm text-green-600">
                          {formatNumber(item.advancePayment)}
                        </td>
                        <td className="border border-gray-200 p-4 text-center -bold text-sm text-orange-600">
                          {formatNumber(item.remainingAmount)}
                        </td>
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
                <h2 className="text-xl font-handicrafts text-primary">الإجمالي</h2>
              </div>
              <div className="flex justify-center">
                <div className="relative w-full max-w-md mx-auto">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-primary text-white rounded-full p-3 shadow-lg flex items-center justify-center" style={{zIndex:2}}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 10c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z" /></svg>
                  </div>
                  <div className="bg-gradient-to-r from-primary/10 to-primary/20 border border-primary/30 p-8 pt-12 rounded-2xl shadow-lg flex flex-col items-center">
                    <p className="font-handicrafts text-primary text-lg mb-2">الإجمالي الكلي</p>
                    {/* الإجمالي الكلي بعد خصم الدفعة المقدمة من كل عنصر */}
                    <p className="font-bold text-4xl text-primary mb-1">{formatNumber(total)} {formData.currency}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Terms and Notes */}
            {(formData.paymentTerms || formData.notes) && (
              <div className="mb-8 print:mb-8">
                <div className="flex items-center gap-2 mb-4 print:mb-4">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <h2 className="text-xl font-handicrafts text-primary">شروط الدفع والملاحظات</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:gap-6">
                  {formData.paymentTerms && (
                    <Card className="border-primary/20 print:border-primary/20">
                      <CardContent className="p-4 print:p-4">
                        <h3 className="font-handicrafts text-primary mb-2 flex items-center gap-2">
                          <div className="w-1 h-1 bg-primary rounded-full"></div>
                          شروط الدفع
                        </h3>
                        <p className=" text-sm text-neutral-grey">{formData.paymentTerms}</p>
                      </CardContent>
                    </Card>
                  )}
                  {formData.notes && (
                    <Card className="border-primary/20 print:border-primary/20">
                      <CardContent className="p-4 print:p-4">
                        <h3 className="font-handicrafts text-primary mb-2 flex items-center gap-2">
                          <div className="w-1 h-1 bg-primary rounded-full"></div>
                          ملاحظات
                        </h3>
                        <p className=" text-sm text-neutral-grey">{formData.notes}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}

            {/* QR Code Section */}
            {/* <div className="mb-8 print:mb-8">
              <div className="flex items-center gap-2 mb-4 print:mb-4">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <h2 className="text-xl font-handicrafts text-primary">ترخيص النشاط التجاري</h2>
              </div>
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 p-4 sm:p-6 print:p-6 rounded-lg">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                  <div className="text-center sm:text-right flex-1">
                    <h3 className="font-handicrafts text-primary text-base sm:text-lg mb-2">مسح للتحقق من الترخيص</h3>
                    <p className="text-sm text-gray-600 font-handicrafts mb-2">ترخيص النشاط التجاري</p>
                    <p className="text-xs text-gray-500 font-handicrafts">استخدم كاميرا هاتفك لمسح الرمز والتحقق من صحة الترخيص</p>
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
            </div> */}

            {/* Footer */}
            <div className="text-center pt-8 print:pt-8 border-t border-gray-200" dir="ltr">
              <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 print:p-6 rounded-lg" dir="ltr">
                <p className="text-primary font-handicrafts text-lg mb-2">شكراً لتعاملكم معنا</p>
                <p className="text-neutral-grey font-handicrafts text-xs" dir="ltr">  {formData.companyName}. جميع الحقوق محفوظة. © 2025</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
