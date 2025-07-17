"use client"

import html2pdf from 'html2pdf.js'
import type { InvoiceFormData, InvoiceItem } from "./invoice-form"

interface SimplePDFGeneratorProps {
  formData: InvoiceFormData
  items: InvoiceItem[]
  vat: number
  total: number
  pageSize?: 'A4' | 'A5' | 'Letter'
}

// دالة إنشاء PDF من العنصر الموجود كما هو
export const generateSimplePDF = async (elementId: string, filename: string): Promise<Blob> => {
  try {
    const element = document.getElementById(elementId)
    if (!element) {
      throw new Error('العنصر غير موجود')
    }

    // إعدادات html2pdf للحصول على الصفحة كما هي
    const options = {
      margin: [10, 10, 10, 10] as [number, number, number, number],
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    }
    
    // إنشاء PDF من العنصر كما هو
    const pdf = await html2pdf().from(element).set(options).outputPdf('blob')
    
    return pdf
  } catch (error) {
    console.error('خطأ في إنشاء PDF:', error)
    throw new Error('فشل في إنشاء ملف PDF')
  }
}

// دالة إرسال البريد الإلكتروني مع PDF
export const sendSimpleInvoiceEmail = async (elementId: string, props: SimplePDFGeneratorProps): Promise<void> => {
  try {
    // إنشاء PDF من العنصر الموجود
    const pdfBlob = await generateSimplePDF(elementId, `invoice-${props.formData.invoiceNumber}.pdf`)
    
    // إنشاء رابط للتحميل
    const url = URL.createObjectURL(pdfBlob)
    
    // إنشاء رابط البريد الإلكتروني
    const subject = encodeURIComponent(`فاتورة رقم ${props.formData.invoiceNumber}`)
    const body = encodeURIComponent(`
مرحباً،

مرفق الفاتورة رقم ${props.formData.invoiceNumber}.

شكراً لتعاملكم معنا.

مع تحيات،
${props.formData.companyName}
    `)
    
    // فتح تطبيق البريد الإلكتروني
    window.open(`mailto:${props.formData.clientEmail}?subject=${subject}&body=${body}`)
    
    // تنظيف الرابط
    setTimeout(() => {
      URL.revokeObjectURL(url)
    }, 1000)
    
  } catch (error) {
    console.error('خطأ في إرسال البريد الإلكتروني:', error)
    throw new Error('فشل في إرسال البريد الإلكتروني')
  }
} 