"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { InvoiceFormData } from "./invoice-form"
import Image from "next/image"

interface InvoiceCoverProps {
  formData: InvoiceFormData
  total: number
  invoiceNumber: string
  invoiceDate: string
}

export function InvoiceCover({ formData, total, invoiceNumber, invoiceDate }: InvoiceCoverProps) {

  const formatNumber = (num: number) => {
    return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ar-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (!formData) {
    return null
  }

  return (
    <div className="mb-2 print:mb-1">
      <Card className="relative overflow-hidden print:shadow-none  max-w-xl mx-auto">
        <CardContent className="p-3 sm:p-4 print:p-2 flex flex-col items-center">
          {/* اللوجو في المنتصف */}
          <div className="flex flex-col items-center justify-center mb-2">
            <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center mb-1">
              <Image
                src="/main-logo.png"
                alt="شعار الشركة"
                width={96}
                height={96}
                className="rounded-lg w-full h-full object-contain"
              />
            </div>
            <h1 className="text-lg sm:text-xl font-handicrafts text-gray-800 mb-0.5">عرض سعر الكتروني</h1>
              {/* <span className="text-xs text-gray-500 font-handicrafts">عرض سعر الكتروني</span> */}
          </div>

          {/* إبراز رقم عرض السعر */}
          <div className="w-full flex justify-center mb-2">
            <div className="bg-primary/10 border border-primary rounded-lg px-4 py-1 text-center">
              <span className="text-xs text-gray-600 font-handicrafts px-2">رقم عرض السعر: </span>
              <span className="font-bold font-handicrafts text-primary text-base ml-2">{invoiceNumber}</span>
            </div>
          </div>

          {/* معلومات الشركة والعميل */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2 print:gap-1 mb-2">
            {/* معلومات الشركة */}
            <div className="bg-white/80 rounded-lg p-2 print:bg-white border border-gray-100">
              <h3 className="font-handicrafts text-gray-800 mb-1 text-xs">معلومات الشركة</h3>
              <div className="space-y-0.5 text-xs">
                <p className="font-handicrafts">{formData.companyName}</p>
                <p className="text-gray-600">{formData.companyAddress}</p>
                <p className="text-gray-600" dir="ltr">الهاتف: {formData.companyPhone}</p>
                <p className="text-gray-600">البريد الإلكتروني: {formData.companyEmail}</p>
                <p className="text-gray-600">السجل الضريبي: <span dir="ltr">645934917</span></p>
              </div>
            </div>
            {/* معلومات العميل */}
            <div className="bg-white/80 rounded-lg p-2 print:bg-white border border-gray-100">
              <h3 className="font-handicrafts text-gray-800 mb-1 text-xs">معلومات العميل</h3>
              <div className="space-y-0.5 text-xs">
                <p className="font-handicrafts">{formData.clientName}</p>
                <p className="text-gray-600">{formData.clientAddress}</p>
                <p className="text-gray-600" dir="ltr">الهاتف: {formData.clientPhone}</p>
                {formData.clientEmail && formData.clientEmail.trim() !== "" && (
                  <p className="text-gray-600">البريد الإلكتروني: {formData.clientEmail}</p>
                )}
              </div>
            </div>
          </div>

          {/* معلومات إضافية: التاريخ والمبلغ */}
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1">
              <span className="text-gray-500 font-handicrafts">التاريخ:</span>
              <span className="font-handicrafts text-gray-800">{formatDate(invoiceDate)}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-500 font-handicrafts">المبلغ الإجمالي:</span>
              {/* المبلغ الإجمالي بعد خصم الدفعة المقدمة من كل عنصر */}
              <span className="font-handicrafts text-primary text-sm">{formatNumber(total)} {formData.currency}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-500 font-handicrafts"> موقعنا الالكتروني</span>
              <span className="font-handicrafts text-primary text-sm"><a href="https://fashne.net" target="_blank" rel="noopener noreferrer"> fashne.net</a></span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
