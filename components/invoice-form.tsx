"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { InvoiceTable } from "@/components/invoice-table"
import { InvoicePreview } from "@/components/invoice-preview"
import {  Save, Eye } from "lucide-react"
import Image from "next/image"
const invoiceSchema = z.object({
  // Company Information
  companyName: z.string().min(2, "اسم الشركة يجب أن يتكون من حرفين على الأقل"),
  companyAddress: z.string().min(3, "عنوان الشركة مطلوب"),
  companyPhone: z.string().min(10, "رقم هاتف صحيح مطلوب"),
  companyEmail: z.string().transform(val => val.trim()).pipe(z.string().email("بريد إلكتروني صحيح مطلوب")),
  // vatNumber: z.string().min(15, "الرقم الضريبي يجب أن يتكون من 15 رقماً"),
  crNumber: z.string().min(10, "رقم السجل الضريبي مطلوب"),

  // Client Information
  clientName: z.string().min(2, "اسم العميل مطلوب"),
  clientAddress: z.string().min(3, "عنوان العميل مطلوب"),
  clientPhone: z.string().min(10, "رقم هاتف العميل مطلوب"),
  clientEmail: z.string().transform(val => val.trim()).pipe(z.string().email("بريد إلكتروني صحيح للعميل مطلوب").or(z.literal(""))).optional(),
  clientVatNumber: z.string().optional(),

  // Invoice Details
  invoiceNumber: z.string().min(1, "رقم عرض السعر الكتروني مطلوب"),
  invoiceDate: z.string().min(1, "تاريخ عرض السعر الكتروني مطلوب"),
  dueDate: z.string().min(1, "تاريخ الاستحقاق مطلوب"),
  currency: z.string().default("SAR"),

  // Payment Terms
  paymentTerms: z.string().optional(),
    notes: z.string().optional(),
})

export type InvoiceFormData = z.infer<typeof invoiceSchema>

export interface InvoiceItem {
  id: string
  description: string 
  quantity: number
  discount: number
  total: number
  advancePayment: number  
  remainingAmount: number 
}

export function InvoiceForm() {
  const [items, setItems] = useState<InvoiceItem[]>([])
  const [showPreview, setShowPreview] = useState(false)

  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      companyName: "شركة الفشني للدعاية والاعلان والتسويق الالكتروني",   
      companyAddress: " مــصــر . الــمــنــيــا",
      companyPhone: "01111263618",
      companyEmail: "info@fashne.net",
      // vatNumber: " ",
      crNumber: "7039912352",
      clientName: " ", // تم تحديثه ليكون عربي فقط
      clientAddress: " ",
      clientPhone: " ",
      clientEmail: "",
      clientVatNumber: "",
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
      invoiceDate: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      currency: "SAR",
      paymentTerms: " ",
      notes: "",
    },
  })

  const onSubmit = (data: InvoiceFormData) => {
    console.log("Invoice Data:", data)
    console.log("Invoice Items:", items)
    setShowPreview(true)
  }

  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      const priceAfterDiscount = item.total * (1 - item.discount / 100)
      const afterAdvance = priceAfterDiscount - (item.advancePayment || 0)
      return sum + (afterAdvance > 0 ? afterAdvance : 0)
    }, 0)
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString("ar-SA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  if (showPreview) {
    return (
      <InvoicePreview
        formData={form.getValues()}
        items={items}
        vat={0}
        total={calculateTotal()}
        onBack={() => setShowPreview(false)}
      />
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 p-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex flex-col items-center gap-2 w-full">
            <Image src="/main-logo.png" alt="شعار الشركة" width={52} height={52} />
            <h1 className="text-2xl font-handicrafts text-primary text-center mt-2">عرض سعر الكتروني</h1>
            {/* <p className="text-neutral-grey mt-1 font-handicrafts text-center">نموذج عرض سعر الكتروني تابع لشركة الفشني للدعاية والاعلان والتسويق الالكتروني</p> */}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-2 border-primary text-primary hover:bg-primary hover:text-white font-handicrafts"
            >
              <Eye className="h-4 w-4 mr-2" />
              عرض
            </Button>
            <Button
              onClick={form.handleSubmit(onSubmit)}
              className="bg-primary hover:bg-primary/90 text-white font-handicrafts"
            >
              <Save className="h-4 w-4 mr-2" />
              حفظ
            </Button>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Company Information */}
          <Card className="border border-gray-200 bg-white">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <CardTitle className="flex items-center gap-3 text-xl text-neutral-grey font-handicrafts">
                <div className="h-3 w-3 bg-neutral-grey rounded-full"></div>
                تفاصيل الشركة
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-handicrafts text-neutral-grey">اسم الشركة</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="اسم الشركة"
                          {...field}
                          className="h-12 border-gray-300 focus:border-primary focus:ring-primary text-right font-handicrafts"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="companyAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-handicrafts text-neutral-grey">العنوان</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="العنوان"
                          {...field}
                          className="h-12 border-gray-300 focus:border-primary focus:ring-primary text-right font-handicrafts"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="companyPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-handicrafts text-neutral-grey">رقم الهاتف</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="رقم الهاتف"
                          {...field}
                          className="h-12 border-gray-300 focus:border-primary focus:ring-primary text-right font-handicrafts"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="companyEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-handicrafts text-neutral-grey">البريد الإلكتروني</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="البريد الإلكتروني"
                          {...field}
                          className="h-12 border-gray-300 focus:border-primary focus:ring-primary text-right font-handicrafts"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* <FormField
                  control={form.control}
                  name="vatNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-handicrafts text-neutral-grey">الرقم الضريبي</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="الرقم الضريبي"
                          {...field}
                          className="h-12 border-gray-300 focus:border-primary focus:ring-primary text-right font-handicrafts"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
                <FormField
                  control={form.control}
                  name="crNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-handicrafts text-neutral-grey">رقم السجل الضريبي</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="رقم السجل الضريبي"
                          {...field}
                          className="h-12 border-gray-300 focus:border-primary focus:ring-primary text-right font-handicrafts"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Client Information */}
          <Card className="border border-gray-200 bg-white">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <CardTitle className="flex items-center gap-3 text-xl text-neutral-grey font-handicrafts">
                <div className="h-3 w-3 bg-neutral-grey rounded-full"></div>
                تفاصيل العميل
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="clientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-handicrafts text-neutral-grey">اسم العميل</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="اسم العميل"
                          {...field}
                          className="h-12 border-gray-300 focus:border-primary focus:ring-primary text-right font-handicrafts"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="clientAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-handicrafts text-neutral-grey">عنوان العميل</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="عنوان العميل"
                          {...field}
                          className="h-12 border-gray-300 focus:border-primary focus:ring-primary text-right font-handicrafts"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="clientPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-handicrafts text-neutral-grey">هاتف العميل</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="هاتف العميل"
                          {...field}
                          className="h-12 border-gray-300 focus:border-primary focus:ring-primary text-right font-handicrafts"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="clientEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-handicrafts text-neutral-grey">بريد العميل الإلكتروني (اختياري)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="بريد العميل الإلكتروني"
                          {...field}
                          className="h-12 border-gray-300 focus:border-primary focus:ring-primary text-right font-handicrafts"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="clientVatNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-handicrafts text-neutral-grey">الرقم الضريبي للعميل (اختياري)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="الرقم الضريبي للعميل"
                          {...field}
                          className="h-12 border-gray-300 focus:border-primary focus:ring-primary text-right font-handicrafts"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Invoice Details */}
          <Card className="border border-gray-200 bg-white">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <CardTitle className="flex items-center gap-3 text-xl text-neutral-grey font-handicrafts">
                <div className="h-3 w-3 bg-neutral-grey rounded-full"></div>
                تفاصيل العرض سعر الكتروني
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <FormField
                  control={form.control}
                  name="invoiceNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-handicrafts text-neutral-grey">رقم عرض السعر الكتروني</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="رقم عرض السعر الكتروني"
                          {...field}
                          className="h-12 border-gray-300 focus:border-primary focus:ring-primary text-right font-handicrafts"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="invoiceDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-handicrafts text-neutral-grey">تاريخ عرض السعر الكتروني</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          className="h-12 border-gray-300 focus:border-primary focus:ring-primary text-right font-handicrafts"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-handicrafts text-neutral-grey">تاريخ الاستحقاق</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          className="h-12 border-gray-300 focus:border-primary focus:ring-primary text-right font-handicrafts"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-handicrafts text-neutral-grey">العملة</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 border-gray-300 focus:border-primary focus:ring-primary text-right font-handicrafts">
                            <SelectValue placeholder="اختر العملة" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="SAR">ريال سعودي (SAR)</SelectItem>
                          <SelectItem value="USD">دولار أمريكي (USD)</SelectItem>
                          <SelectItem value="EUR">يورو (EUR)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Items Table */}
          <InvoiceTable items={items} setItems={setItems} />

          {/* Payment Terms and Notes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border border-gray-200 bg-white">
              <CardHeader className="bg-gray-50 border-b border-gray-200">
                <CardTitle className="flex items-center gap-3 text-xl text-neutral-grey font-handicrafts">
                  <div className="h-3 w-3 bg-neutral-grey rounded-full"></div>
                  شروط الدفع
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <FormField
                  control={form.control}
                  name="paymentTerms"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="أدخل شروط الدفع..."
                          {...field}
                          className="min-h-[120px] border-gray-300 focus:border-primary focus:ring-primary text-right font-handicrafts"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="border border-gray-200 bg-white">
              <CardHeader className="bg-gray-50 border-b border-gray-200">
                <CardTitle className="flex items-center gap-3 text-xl text-neutral-grey font-handicrafts">
                  <div className="h-3 w-3 bg-neutral-grey rounded-full"></div>
                  ملاحظات إضافية
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="أدخل ملاحظات إضافية (اختياري)..."
                          {...field}
                          className="min-h-[120px] border-gray-300 focus:border-primary focus:ring-primary text-right font-handicrafts"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Summary */}
          <Card className="border border-gray-200 bg-white">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
                              <CardTitle className="flex items-center gap-3 text-xl text-neutral-grey font-handicrafts">
                  <div className="h-3 w-3 bg-neutral-grey rounded-full"></div>
                  ملخص العرض سعر الكتروني
                </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-handicrafts text-neutral-grey mb-2">عدد العناصر</h4>
                  <p className="text-2xl font-handicrafts text-primary">{items.length}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-handicrafts text-neutral-grey mb-2">المجموع الإجمالي</h4>
                  <p className="text-2xl font-handicrafts text-primary">
                    {formatNumber(calculateTotal())} {form.watch("currency")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  )
}
