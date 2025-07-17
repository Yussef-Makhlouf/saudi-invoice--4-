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

  // فحص وجود البيانات
  if (!formData) {
    return null
  }

  return (
    <div className="mb-6 print:mb-6">
      {/* غلاف الفاتورة العصري */}
      <Card className="relative overflow-hidden print:shadow-none">
        <CardContent className="p-0">
          {/* صورة الخلفية */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[url('/logoh.png')] bg-contain bg-no-repeat bg-center opacity-20"></div>
          </div>
          
          <div className="relative p-6 print:p-6">
            {/* الصف العلوي - الشعار والعنوان */}
            <div className="flex items-center justify-between mb-6 print:mb-6">
              {/* شعار الشركة */}
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="w-24 h-24 bg-white rounded-xl shadow-lg flex items-center justify-center print:bg-white">
                  <Image
                    src="/logov.png"
                    alt="شعار الشركة"
                    width={88}
                    height={88}
                    className="rounded-lg"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-cairo-bold text-gray-800">فاتورة</h1>
                  <p className="text-sm text-gray-600 font-cairo-medium">{formData.companyName}</p>
                </div>
              </div>

              {/* معلومات الفاتورة الأساسية */}
              <div className="text-left">
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 print:bg-white">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 font-cairo-medium">رقم الفاتورة:</span>
                      <p className="font-cairo-bold text-gray-800">{invoiceNumber}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 font-cairo-medium">تاريخ الفاتورة:</span>
                      <p className="font-cairo-bold text-gray-800">{formatDate(invoiceDate)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 font-cairo-medium">المبلغ الإجمالي:</span>
                      <p className="font-cairo-bold text-primary text-lg">{formatNumber(total)} {formData.currency}</p>
                    </div>
             
                  </div>
                </div>
              </div>
            </div>

            {/* معلومات العميل والشركة */}
            <div className="grid grid-cols-2 gap-6 print:gap-6">
              {/* معلومات الشركة */}
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 print:bg-white">
                <h3 className="font-cairo-bold text-gray-800 mb-3 text-sm">معلومات الشركة</h3>
                <div className="space-y-2 text-xs">
                  <p className="font-cairo-medium">{formData.companyName}</p>
                  <p className="text-gray-600">{formData.companyAddress}</p>
                  <p className="text-gray-600 " dir="ltr">الهاتف: {formData.companyPhone}</p>
                  <p className="text-gray-600">البريد الإلكتروني: {formData.companyEmail}</p>
                </div>
              </div>

              {/* معلومات العميل */}
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 print:bg-white">
                <h3 className="font-cairo-bold text-gray-800 mb-3 text-sm">معلومات العميل</h3>
                <div className="space-y-2 text-xs">
                  <p className="font-cairo-medium">{formData.clientName}</p>
                  <p className="text-gray-600">{formData.clientAddress}</p>
                  <p className="text-gray-600 " dir="ltr">الهاتف: {formData.clientPhone}</p>
                  <p className="text-gray-600">البريد الإلكتروني: {formData.clientEmail}</p>
                </div>
              </div>
            </div>

            {/* شريط الزخرفة السفلي */}
            <div className="mt-6 print:mt-6 h-1 bg-gradient-to-r from-primary via-primary/40 to-primary/40 rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
