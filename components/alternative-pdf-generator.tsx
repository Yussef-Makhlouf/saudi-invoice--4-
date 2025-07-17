"use client"

import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import type { InvoiceFormData, InvoiceItem } from "./invoice-form"

interface AlternativePDFGeneratorProps {
  formData: InvoiceFormData
  items: InvoiceItem[]
  vat: number
  total: number
  pageSize?: 'A4' | 'A5' | 'Letter'
}

// دالة تنسيق الأرقام باللغة العربية
const formatNumber = (num: number) => {
  return num.toLocaleString("ar-SA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// دالة تنسيق التاريخ باللغة العربية
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// دالة إنشاء عنصر HTML للفاتورة
const createInvoiceElement = (props: AlternativePDFGeneratorProps): HTMLElement => {
  const { formData, items, vat, total } = props
  
  const container = document.createElement('div')
  container.style.cssText = `
    width: 210mm;
    min-height: 297mm;
    padding: 20mm;
    background: white;
    font-family: 'Cairo', sans-serif;
    direction: rtl;
    color: #333;
    line-height: 1.6;
    position: absolute;
    left: -9999px;
    top: 0;
  `
  
  container.innerHTML = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;500;600;700;800;900&display=swap');
      
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: 'Cairo', sans-serif;
        direction: rtl;
        background: white;
        color: #333;
        line-height: 1.6;
      }
      
      .header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 2px solid #1375bd;
      }
      
      .company-info {
        flex: 1;
        text-align: right;
      }
      
      .company-name {
        font-size: 24px;
        font-weight: 700;
        color: #1375bd;
        margin-bottom: 10px;
      }
      
      .company-details {
        font-size: 12px;
        color: #666;
        margin-bottom: 5px;
      }
      
      .invoice-details {
        flex: 1;
        background: #f8f9fa;
        padding: 15px;
        border-radius: 8px;
        text-align: center;
      }
      
      .invoice-title {
        font-size: 18px;
        font-weight: 700;
        color: #1375bd;
        margin-bottom: 10px;
      }
      
      .invoice-info {
        font-size: 11px;
        color: #333;
        margin-bottom: 3px;
      }
      
      .client-section {
        margin-bottom: 30px;
        padding: 20px;
        background: #f8f9fa;
        border-radius: 8px;
      }
      
      .section-title {
        font-size: 16px;
        font-weight: 700;
        color: #1375bd;
        margin-bottom: 15px;
        text-align: right;
      }
      
      .client-info {
        font-size: 12px;
        color: #333;
        margin-bottom: 5px;
        text-align: right;
      }
      
      .items-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 30px;
      }
      
      .items-table th {
        background: #1375bd;
        color: white;
        padding: 12px;
        font-size: 12px;
        font-weight: 700;
        text-align: center;
        border: 1px solid #1375bd;
      }
      
      .items-table td {
        padding: 12px;
        font-size: 11px;
        border: 1px solid #e0e0e0;
        text-align: center;
      }
      
      .items-table tr:nth-child(even) {
        background: #f8f9fa;
      }
      
      .description-cell {
        text-align: right;
        font-weight: 500;
      }
      
      .totals-section {
        margin-bottom: 30px;
        padding: 20px;
        background: #f8f9fa;
        border-radius: 8px;
        text-align: right;
      }
      
      .total-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        font-size: 12px;
      }
      
      .total-label {
        color: #666;
      }
      
      .total-value {
        font-weight: 700;
        color: #1375bd;
      }
      
      .grand-total {
        font-size: 16px;
        font-weight: 700;
        color: #1375bd;
        border-top: 2px solid #1375bd;
        padding-top: 10px;
        margin-top: 10px;
      }
      
      .terms-section {
        margin-bottom: 30px;
        padding: 20px;
        background: #f8f9fa;
        border-radius: 8px;
      }
      
      .terms-text {
        font-size: 11px;
        color: #333;
        line-height: 1.5;
        text-align: right;
      }
      
      .footer {
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid #e0e0e0;
        text-align: center;
      }
      
      .footer-text {
        font-size: 10px;
        color: #666;
        text-align: center;
      }
    </style>
    
    <div class="header">
      <div class="company-info">
        <div class="company-name">${formData.companyName}</div>
        <div class="company-details">${formData.companyAddress}</div>
        <div class="company-details">${formData.companyCity}, المملكة العربية السعودية</div>
        <div class="company-details">الهاتف: ${formData.companyPhone}</div>
        <div class="company-details">البريد الإلكتروني: ${formData.companyEmail}</div>
        <div class="company-details">الرقم الضريبي: ${formData.vatNumber}</div>
        <div class="company-details">رقم السجل التجاري: ${formData.crNumber}</div>
      </div>
      
      <div class="invoice-details">
        <div class="invoice-title">فاتورة</div>
        <div class="invoice-info">رقم الفاتورة: ${formData.invoiceNumber}</div>
        <div class="invoice-info">تاريخ الفاتورة: ${formatDate(formData.invoiceDate)}</div>
        <div class="invoice-info">تاريخ الاستحقاق: ${formatDate(formData.dueDate)}</div>
        <div class="invoice-info">العملة: ${formData.currency}</div>
      </div>
    </div>

    <div class="client-section">
      <div class="section-title">معلومات العميل</div>
      <div class="client-info">${formData.clientName}</div>
      <div class="client-info">${formData.clientAddress}</div>
      <div class="client-info">${formData.clientCity}</div>
      <div class="client-info">الهاتف: ${formData.clientPhone}</div>
      <div class="client-info">البريد الإلكتروني: ${formData.clientEmail}</div>
      ${formData.clientVatNumber ? `<div class="client-info">الرقم الضريبي: ${formData.clientVatNumber}</div>` : ''}
    </div>

    <table class="items-table">
      <thead>
        <tr>
          <th>الوصف</th>
          <th>الكمية</th>
          <th>سعر الوحدة</th>
          <th>الخصم</th>
          <th>المجموع</th>
        </tr>
      </thead>
      <tbody>
        ${items.map(item => `
          <tr>
            <td class="description-cell">${item.description}</td>
            <td>${item.quantity}</td>
            <td>${formatNumber(item.unitPrice)}</td>
            <td>${formatNumber(item.discount)}</td>
            <td>${formatNumber(item.total)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="totals-section">
      <div class="total-row">
        <span class="total-label">الضريبة (15%):</span>
        <span class="total-value">${formatNumber(vat)} ${formData.currency}</span>
      </div>
      <div class="total-row grand-total">
        <span class="total-label">الإجمالي:</span>
        <span class="total-value">${formatNumber(total)} ${formData.currency}</span>
      </div>
    </div>

    ${(formData.paymentTerms || formData.notes) ? `
      <div class="terms-section">
        <div class="section-title">شروط الدفع والملاحظات</div>
        ${formData.paymentTerms ? `<div class="terms-text">${formData.paymentTerms}</div>` : ''}
        ${formData.notes ? `<div class="terms-text">${formData.notes}</div>` : ''}
      </div>
    ` : ''}

    <div class="footer">
      <div class="footer-text">شكراً لتعاملكم معنا</div>
      <div class="footer-text">تم إنشاء هذه الفاتورة بواسطة نظام إدارة الفواتير المتقدم</div>
      <div class="footer-text">© 2024 ${formData.companyName}. جميع الحقوق محفوظة.</div>
    </div>
  `
  
  return container
}

// دالة إنشاء PDF باستخدام jsPDF و html2canvas
export const generateAlternativePDF = async (props: AlternativePDFGeneratorProps): Promise<Blob> => {
  const { pageSize = 'A4' } = props
  
  try {
    // إنشاء عنصر HTML للفاتورة
    const invoiceElement = createInvoiceElement(props)
    document.body.appendChild(invoiceElement)
    
    // انتظار تحميل الخطوط
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // تحويل HTML إلى canvas
    const canvas = await html2canvas(invoiceElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 210 * 5.90551, // تحويل mm إلى px
      height: 297 * 5.90551,
    })
    
    // إنشاء PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: pageSize.toLowerCase(),
      compress: true
    })
    
    // إضافة الصورة إلى PDF
    const imgData = canvas.toDataURL('image/jpeg', 0.95)
    const imgWidth = 210
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    
    pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight)
    
    // تنظيف العنصر المؤقت
    document.body.removeChild(invoiceElement)
    
    // تحويل إلى Blob
    const pdfBlob = pdf.output('blob')
    return pdfBlob
    
  } catch (error) {
    console.error('خطأ في إنشاء PDF:', error)
    throw new Error('فشل في إنشاء ملف PDF')
  }
}

// دالة إرسال الفاتورة عبر البريد الإلكتروني
export const sendAlternativeInvoiceEmail = async (props: AlternativePDFGeneratorProps): Promise<void> => {
  try {
    // إنشاء PDF
    const pdfBlob = await generateAlternativePDF(props)
    
    // إنشاء رابط للتحميل
    const url = URL.createObjectURL(pdfBlob)
    
    // إنشاء رابط البريد الإلكتروني مع المرفق
    const subject = encodeURIComponent(`فاتورة رقم ${props.formData.invoiceNumber}`)
    const body = encodeURIComponent(`
مرحباً،

مرفق الفاتورة رقم ${props.formData.invoiceNumber} بتاريخ ${formatDate(props.formData.invoiceDate)}.

المبلغ الإجمالي: ${formatNumber(props.total)} ${props.formData.currency}

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