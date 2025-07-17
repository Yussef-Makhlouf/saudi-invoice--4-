"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { InvoiceFormData } from "./invoice-form"

interface InvoiceInfoTablesProps {
  formData: InvoiceFormData
}

export function InvoiceInfoTables({ formData }: InvoiceInfoTablesProps) {
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:gap-6 mb-8 print:mb-8">
      {/* معلومات الشركة */}
      <Card className="border-primary/20 print:border-primary/20">
        <CardHeader className="pb-3 print:pb-3">
          <CardTitle className="text-lg font-cairo-bold text-primary flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            معلومات الشركة
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 print:pt-0">
          <div className="space-y-3 print:space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100 print:border-gray-100">
              <span className="font-cairo-bold text-neutral-grey text-sm">اسم الشركة:</span>
              <span className="font-cairo text-sm">{formData.companyName}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100 print:border-gray-100">
              <span className="font-cairo-bold text-neutral-grey text-sm">العنوان:</span>
              <span className="font-cairo text-sm text-left">{formData.companyAddress}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100 print:border-gray-100">
              <span className="font-cairo-bold text-neutral-grey text-sm">المدينة:</span>
              <span className="font-cairo text-sm">{formData.companyCity}, المملكة العربية السعودية</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100 print:border-gray-100">
              <span className="font-cairo-bold text-neutral-grey text-sm">الهاتف:</span>
              <span className="font-cairo text-sm" dir="ltr">{formData.companyPhone}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100 print:border-gray-100">
              <span className="font-cairo-bold text-neutral-grey text-sm">البريد الإلكتروني:</span>
              <span className="font-cairo text-sm">{formData.companyEmail}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100 print:border-gray-100">
              <span className="font-cairo-bold text-neutral-grey text-sm">الرقم الضريبي:</span>
              <span className="font-cairo text-sm">{formData.vatNumber}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="font-cairo-bold text-neutral-grey text-sm">رقم السجل التجاري:</span>
              <span className="font-cairo text-sm">{formData.crNumber}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* معلومات العميل */}
      <Card className="border-secondary/20 print:border-secondary/20">
        <CardHeader className="pb-3 print:pb-3">
          <CardTitle className="text-lg font-cairo-bold text-secondary flex items-center gap-2">
            <div className="w-2 h-2 bg-secondary rounded-full"></div>
            معلومات العميل
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 print:pt-0">
          <div className="space-y-3 print:space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100 print:border-gray-100">
              <span className="font-cairo-bold text-neutral-grey text-sm">اسم العميل:</span>
              <span className="font-cairo text-sm">{formData.clientName}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100 print:border-gray-100">
              <span className="font-cairo-bold text-neutral-grey text-sm">العنوان:</span>
              <span className="font-cairo text-sm text-left">{formData.clientAddress}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100 print:border-gray-100">
              <span className="font-cairo-bold text-neutral-grey text-sm">المدينة:</span>
              <span className="font-cairo text-sm">{formData.clientCity}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100 print:border-gray-100">
              <span className="font-cairo-bold text-neutral-grey text-sm">الهاتف:</span>
              <span className="font-cairo text-sm">{formData.clientPhone}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100 print:border-gray-100">
              <span className="font-cairo-bold text-neutral-grey text-sm">البريد الإلكتروني:</span>
              <span className="font-cairo text-sm">{formData.clientEmail}</span>
            </div>
            {formData.clientVatNumber && (
              <div className="flex justify-between items-center py-2">
                <span className="font-cairo-bold text-neutral-grey text-sm">الرقم الضريبي:</span>
                <span className="font-cairo text-sm">{formData.clientVatNumber}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* تفاصيل الفاتورة */}
      <Card className="border-accent-blue-1/20 print:border-accent-blue-1/20 lg:col-span-2">
        <CardHeader className="pb-3 print:pb-3">
          <CardTitle className="text-lg font-cairo-bold text-accent-blue-1 flex items-center gap-2">
            <div className="w-2 h-2 bg-accent-blue-1 rounded-full"></div>
            تفاصيل الفاتورة
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 print:pt-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print:gap-4">
            <div className="text-center p-3 bg-primary/5 rounded-lg print:bg-primary/5">
              <p className="font-cairo-bold text-neutral-grey text-sm mb-1">رقم الفاتورة</p>
              <p className="font-cairo-bold text-primary">{formData.invoiceNumber}</p>
            </div>
            <div className="text-center p-3 bg-secondary/5 rounded-lg print:bg-secondary/5">
              <p className="font-cairo-bold text-neutral-grey text-sm mb-1">تاريخ الفاتورة</p>
              <p className="font-cairo-bold text-secondary">{formatDate(formData.invoiceDate)}</p>
            </div>
            <div className="text-center p-3 bg-accent-blue-1/5 rounded-lg print:bg-accent-blue-1/5">
              <p className="font-cairo-bold text-neutral-grey text-sm mb-1">تاريخ الاستحقاق</p>
              <p className="font-cairo-bold text-accent-blue-1">{formatDate(formData.dueDate)}</p>
            </div>
            <div className="text-center p-3 bg-accent-blue-2/5 rounded-lg print:bg-accent-blue-2/5">
              <p className="font-cairo-bold text-neutral-grey text-sm mb-1">العملة</p>
              <p className="font-cairo-bold text-accent-blue-2">{formData.currency}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
