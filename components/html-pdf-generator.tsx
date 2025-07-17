"use client"

import html2pdf from 'html2pdf.js'
import type { InvoiceFormData, InvoiceItem } from "./invoice-form"

interface HTMLPDFGeneratorProps {
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

// دالة إنشاء HTML للفاتورة
const createInvoiceHTML = (props: HTMLPDFGeneratorProps): string => {
  const { formData, items, vat, total, pageSize = 'A4' } = props
  
  return `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>فاتورة ${formData.invoiceNumber}</title>
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
        
        .invoice-container {
          max-width: 210mm;
          margin: 0 auto;
          padding: 20mm;
          background: white;
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
        
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .invoice-container {
            padding: 0;
            margin: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <!-- رأس الفاتورة -->
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

        <!-- معلومات العميل -->
        <div class="client-section">
          <div class="section-title">معلومات العميل</div>
          <div class="client-info">${formData.clientName}</div>
          <div class="client-info">${formData.clientAddress}</div>
          <div class="client-info">${formData.clientCity}</div>
          <div class="client-info">الهاتف: ${formData.clientPhone}</div>
          <div class="client-info">البريد الإلكتروني: ${formData.clientEmail}</div>
          ${formData.clientVatNumber ? `<div class="client-info">الرقم الضريبي: ${formData.clientVatNumber}</div>` : ''}
        </div>

        <!-- جدول البنود -->
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

        <!-- المجاميع -->
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

        <!-- شروط الدفع والملاحظات -->
        ${(formData.paymentTerms || formData.notes) ? `
          <div class="terms-section">
            <div class="section-title">شروط الدفع والملاحظات</div>
            ${formData.paymentTerms ? `<div class="terms-text">${formData.paymentTerms}</div>` : ''}
            ${formData.notes ? `<div class="terms-text">${formData.notes}</div>` : ''}
          </div>
        ` : ''}

        <!-- التذييل -->
        <div class="footer">
          <div class="footer-text">شكراً لتعاملكم معنا</div>
          
          <div class="footer-text">© 2024 ${formData.companyName}. جميع الحقوق محفوظة.</div>
        </div>
      </div>
    </body>
    </html>
  `
}

// دالة إنشاء PDF باستخدام html2pdf.js
export const generateHTMLPDF = async (props: HTMLPDFGeneratorProps): Promise<Blob> => {
  const { pageSize = 'A4' } = props
  
  try {
    // إنشاء HTML للفاتورة
    const htmlContent = createInvoiceHTML(props)
    
    // إنشاء عنصر HTML مؤقت
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = htmlContent
    document.body.appendChild(tempDiv)
    
    // إعدادات html2pdf
    const options = {
      margin: [10, 10, 10, 10],
      filename: `invoice-${props.formData.invoiceNumber}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      },
      jsPDF: { 
        unit: 'mm', 
        format: pageSize.toLowerCase(), 
        orientation: 'portrait',
        compress: true
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    }
    
    // إنشاء PDF
    const pdf = await html2pdf().from(tempDiv).set(options).outputPdf('blob')
    
    // تنظيف العنصر المؤقت
    document.body.removeChild(tempDiv)
    
    return pdf
  } catch (error) {
    console.error('خطأ في إنشاء PDF:', error)
    throw new Error('فشل في إنشاء ملف PDF')
  }
}

// دالة إرسال الفاتورة عبر البريد الإلكتروني
export const sendInvoiceEmail = async (props: HTMLPDFGeneratorProps): Promise<void> => {
  try {
    // إنشاء PDF
    const pdfBlob = await generateHTMLPDF(props)
    
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