"use client"

import { useEffect } from 'react'

interface PrintOptimizerProps {
  children: React.ReactNode
}

export function PrintOptimizer({ children }: PrintOptimizerProps) {
  useEffect(() => {
    // إضافة أنماط الطباعة المحسنة
    const style = document.createElement('style')
    style.textContent = `
      @media print {
        @page {
          size: A4 portrait;
          margin: 15mm;
        }
        
        body {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        
        .print-hidden {
          display: none !important;
        }
        
        .print-only {
          display: block !important;
        }
        
        .invoice-container {
          page-break-inside: avoid;
        }
        
        .invoice-table {
          page-break-inside: avoid;
        }
        
        .invoice-totals {
          page-break-inside: avoid;
        }
        
        .invoice-footer {
          page-break-inside: avoid;
        }
        
        /* تحسين الخطوط للطباعة */
        * {
          font-family: 'Cairo', sans-serif !important;
        }
        
        /* تحسين الألوان للطباعة */
        .bg-primary {
          background-color: #1375bd !important;
        }
        
        .text-primary {
          color: #1375bd !important;
        }
        
        .border-primary {
          border-color: #1375bd !important;
        }
        
        /* تحسين الجداول للطباعة */
        table {
          border-collapse: collapse !important;
        }
        
        th, td {
          border: 1px solid #e0e0e0 !important;
          padding: 8px !important;
        }
        
        th {
          background-color: #1375bd !important;
          color: white !important;
        }
        
        /* تحسين الأزرار للطباعة */
        button {
          display: none !important;
        }
        
        .print-button {
          display: none !important;
        }
        
        /* تحسين الصور للطباعة */
        img {
          max-width: 100% !important;
          height: auto !important;
        }
        
        /* تحسين التخطيط للطباعة */
        .print-layout {
          width: 100% !important;
          max-width: none !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        
        /* إخفاء العناصر غير الضرورية */
        .no-print {
          display: none !important;
        }
        
        /* تحسين النصوص للطباعة */
        .print-text {
          font-size: 12pt !important;
          line-height: 1.4 !important;
        }
        
        .print-title {
          font-size: 18pt !important;
          font-weight: bold !important;
        }
        
        .print-subtitle {
          font-size: 14pt !important;
          font-weight: bold !important;
        }
        
        /* تحسين المسافات للطباعة */
        .print-spacing {
          margin-bottom: 20px !important;
        }
        
        /* تحسين الألوان للطباعة */
        .print-color-primary {
          color: #1375bd !important;
        }
        
        .print-color-secondary {
          color: #018bd2 !important;
        }
        
        .print-color-text {
          color: #333333 !important;
        }
        
        .print-color-muted {
          color: #666666 !important;
        }
        
        /* تحسين الخلفيات للطباعة */
        .print-bg-primary {
          background-color: #1375bd !important;
        }
        
        .print-bg-secondary {
          background-color: #f8f9fa !important;
        }
        
        .print-bg-white {
          background-color: white !important;
        }
        
        /* تحسين الحدود للطباعة */
        .print-border {
          border: 1px solid #e0e0e0 !important;
        }
        
        .print-border-primary {
          border-color: #1375bd !important;
        }
        
        /* تحسين التخطيط للطباعة */
        .print-flex {
          display: flex !important;
        }
        
        .print-flex-col {
          flex-direction: column !important;
        }
        
        .print-flex-row {
          flex-direction: row !important;
        }
        
        .print-justify-between {
          justify-content: space-between !important;
        }
        
        .print-justify-center {
          justify-content: center !important;
        }
        
        .print-items-center {
          align-items: center !important;
        }
        
        .print-text-center {
          text-align: center !important;
        }
        
        .print-text-right {
          text-align: right !important;
        }
        
        .print-text-left {
          text-align: left !important;
        }
        
        /* تحسين الأحجام للطباعة */
        .print-w-full {
          width: 100% !important;
        }
        
        .print-h-full {
          height: 100% !important;
        }
        
        .print-min-h-screen {
          min-height: auto !important;
        }
        
        /* تحسين المسافات للطباعة */
        .print-p-0 {
          padding: 0 !important;
        }
        
        .print-p-4 {
          padding: 16px !important;
        }
        
        .print-p-6 {
          padding: 24px !important;
        }
        
        .print-p-8 {
          padding: 32px !important;
        }
        
        .print-m-0 {
          margin: 0 !important;
        }
        
        .print-m-4 {
          margin: 16px !important;
        }
        
        .print-m-6 {
          margin: 24px !important;
        }
        
        .print-m-8 {
          margin: 32px !important;
        }
        
        .print-mb-4 {
          margin-bottom: 16px !important;
        }
        
        .print-mb-6 {
          margin-bottom: 24px !important;
        }
        
        .print-mb-8 {
          margin-bottom: 32px !important;
        }
        
        .print-mt-4 {
          margin-top: 16px !important;
        }
        
        .print-mt-6 {
          margin-top: 24px !important;
        }
        
        .print-mt-8 {
          margin-top: 32px !important;
        }
        
        /* تحسين الظلال للطباعة */
        .print-shadow-none {
          box-shadow: none !important;
        }
        
        /* تحسين الحواف للطباعة */
        .print-rounded-none {
          border-radius: 0 !important;
        }
        
        .print-rounded {
          border-radius: 4px !important;
        }
        
        .print-rounded-lg {
          border-radius: 8px !important;
        }
        
        /* تحسين الخطوط للطباعة */
        .print-font-normal {
          font-weight: normal !important;
        }
        
        .print-font-bold {
          font-weight: bold !important;
        }
        
        .print-font-medium {
          font-weight: 500 !important;
        }
        
        /* تحسين الأحجام للطباعة */
        .print-text-xs {
          font-size: 10pt !important;
        }
        
        .print-text-sm {
          font-size: 12pt !important;
        }
        
        .print-text-base {
          font-size: 14pt !important;
        }
        
        .print-text-lg {
          font-size: 16pt !important;
        }
        
        .print-text-xl {
          font-size: 18pt !important;
        }
        
        .print-text-2xl {
          font-size: 20pt !important;
        }
        
        /* تحسين الاتجاه للطباعة */
        .print-rtl {
          direction: rtl !important;
        }
        
        .print-ltr {
          direction: ltr !important;
        }
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return <>{children}</>
}

// دالة لتحسين الطباعة
export const optimizeForPrint = () => {
  // إضافة فئة للطباعة
  document.body.classList.add('printing')
  
  // إزالة الفئة بعد الطباعة
  const removePrintClass = () => {
    document.body.classList.remove('printing')
  }
  
  // استماع لحدث الطباعة
  window.addEventListener('afterprint', removePrintClass)
  
  return () => {
    window.removeEventListener('afterprint', removePrintClass)
  }
}

// دالة لطباعة العنصر
export const printElement = (elementId: string) => {
  const element = document.getElementById(elementId)
  if (element) {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
          <meta charset="UTF-8">
          <title>طباعة العرض سعر الكتروني</title>
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
            
            @media print {
              @page {
                size: A4 portrait;
                margin: 15mm;
              }
              
              body {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
            }
          </style>
        </head>
        <body>
          ${element.outerHTML}
        </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.focus()
      printWindow.print()
    }
  }
} 