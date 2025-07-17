"use client"

import { Document, Page, Text, View, StyleSheet, Font, pdf } from '@react-pdf/renderer'
import type { InvoiceFormData, InvoiceItem } from "./invoice-form"

// تسجيل خط Cairo للاستخدام في PDF
Font.register({
  family: 'Cairo',
  src: 'https://fonts.gstatic.com/s/cairo/v20/SLXVc1nY6HkvangtZmpcWmhzfH5lWWgcQyyS4J0.woff2',
})

// تعريف الأنماط للـ PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontFamily: 'Cairo',
    direction: 'rtl',
  },
  
  // صفحة الغلاف
  coverPage: {
    flexDirection: 'column',
    backgroundColor: '#1375bd',
    padding: 40,
    minHeight: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  
  // رأس الفاتورة
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottom: '2px solid #1375bd',
  },
  
  // معلومات الشركة
  companyInfo: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    flex: 1,
  },
  
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1375bd',
    marginBottom: 10,
    textAlign: 'right',
  },
  
  companyDetails: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 5,
    textAlign: 'right',
  },
  
  // تفاصيل الفاتورة
  invoiceDetails: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
  },
  
  invoiceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1375bd',
    marginBottom: 10,
    textAlign: 'center',
  },
  
  invoiceInfo: {
    fontSize: 11,
    color: '#333333',
    marginBottom: 3,
    textAlign: 'right',
  },
  
  // معلومات العميل
  clientSection: {
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1375bd',
    marginBottom: 15,
    textAlign: 'right',
  },
  
  clientInfo: {
    fontSize: 12,
    color: '#333333',
    marginBottom: 5,
    textAlign: 'right',
  },
  
  // جدول البنود
  table: {
    marginBottom: 30,
  },
  
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1375bd',
    padding: 10,
    borderRadius: 5,
  },
  
  tableHeaderCell: {
    flex: 1,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottom: '1px solid #e0e0e0',
  },
  
  tableRowEven: {
    backgroundColor: '#f8f9fa',
  },
  
  tableCell: {
    flex: 1,
    fontSize: 11,
    color: '#333333',
    textAlign: 'center',
  },
  
  descriptionCell: {
    flex: 2,
    fontSize: 11,
    color: '#333333',
    textAlign: 'right',
  },
  
  // المجاميع
  totalsSection: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    width: '50%',
  },
  
  totalLabel: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'right',
  },
  
  totalValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1375bd',
    textAlign: 'left',
  },
  
  grandTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1375bd',
    borderTop: '2px solid #1375bd',
    paddingTop: 10,
  },
  
  // شروط الدفع والملاحظات
  termsSection: {
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  
  termsText: {
    fontSize: 11,
    color: '#333333',
    lineHeight: 1.5,
    textAlign: 'right',
  },
  
  // التذييل
  footer: {
    marginTop: 'auto',
    paddingTop: 20,
    borderTop: '1px solid #e0e0e0',
    textAlign: 'center',
  },
  
  footerText: {
    fontSize: 10,
    color: '#666666',
    textAlign: 'center',
  },
  
  // صفحة الغلاف
  coverTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  
  coverSubtitle: {
    fontSize: 20,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 40,
  },
  
  coverInfo: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
  },
})

interface PDFGeneratorProps {
  formData: InvoiceFormData
  items: InvoiceItem[]
  vat: number
  total: number
  pageSize?: 'A4' | 'A5' | 'LETTER'
}

// مكون PDF الرئيسي
const InvoicePDF = ({ formData, items, vat, total, pageSize = 'A4' }: PDFGeneratorProps) => {
  const formatNumber = (num: number) => {
    return num.toLocaleString('ar-SA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <Document>
      {/* صفحة الغلاف */}
      <Page size={pageSize as any} style={styles.coverPage}>
        <Text style={styles.coverTitle}>نموذج فاتورة شركة القوس الماسي</Text>
        <Text style={styles.coverSubtitle}>نظام إدارة الفواتير المتقدم</Text>
        <Text style={styles.coverInfo}>رقم الفاتورة: {formData.invoiceNumber}</Text>
        <Text style={styles.coverInfo}>تاريخ الفاتورة: {formatDate(formData.invoiceDate)}</Text>
        <Text style={styles.coverInfo}>المبلغ الإجمالي: {formatNumber(total)} {formData.currency}</Text>
      </Page>

      {/* صفحة الفاتورة الرئيسية */}
      <Page size={pageSize as any} style={styles.page}>
        {/* رأس الفاتورة */}
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>{formData.companyName}</Text>
            <Text style={styles.companyDetails}>{formData.companyAddress}</Text>
            <Text style={styles.companyDetails}>{formData.companyCity}, المملكة العربية السعودية</Text>
            <Text style={styles.companyDetails}>الهاتف: {formData.companyPhone}</Text>
            <Text style={styles.companyDetails}>البريد الإلكتروني: {formData.companyEmail}</Text>
            <Text style={styles.companyDetails}>الرقم الضريبي: {formData.vatNumber}</Text>
            <Text style={styles.companyDetails}>رقم السجل التجاري: {formData.crNumber}</Text>
          </View>
          
          <View style={styles.invoiceDetails}>
            <Text style={styles.invoiceTitle}>فاتورة</Text>
            <Text style={styles.invoiceInfo}>رقم الفاتورة: {formData.invoiceNumber}</Text>
            <Text style={styles.invoiceInfo}>تاريخ الفاتورة: {formatDate(formData.invoiceDate)}</Text>
            <Text style={styles.invoiceInfo}>تاريخ الاستحقاق: {formatDate(formData.dueDate)}</Text>
            <Text style={styles.invoiceInfo}>العملة: {formData.currency}</Text>
          </View>
        </View>

        {/* معلومات العميل */}
        <View style={styles.clientSection}>
          <Text style={styles.sectionTitle}>معلومات العميل</Text>
          <Text style={styles.clientInfo}>{formData.clientName}</Text>
          <Text style={styles.clientInfo}>{formData.clientAddress}</Text>
          <Text style={styles.clientInfo}>{formData.clientCity}</Text>
          <Text style={styles.clientInfo}>الهاتف: {formData.clientPhone}</Text>
          <Text style={styles.clientInfo}>البريد الإلكتروني: {formData.clientEmail}</Text>
          {formData.clientVatNumber && (
            <Text style={styles.clientInfo}>الرقم الضريبي: {formData.clientVatNumber}</Text>
          )}
        </View>

        {/* جدول البنود */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>الوصف</Text>
            <Text style={styles.tableHeaderCell}>الكمية</Text>
            <Text style={styles.tableHeaderCell}>سعر الوحدة</Text>
            <Text style={styles.tableHeaderCell}>الخصم</Text>
            <Text style={styles.tableHeaderCell}>المجموع</Text>
          </View>
          
          {items.map((item, index) => (
            <View key={item.id} style={[styles.tableRow, index % 2 === 0 && styles.tableRowEven]}>
              <Text style={styles.descriptionCell}>{item.description}</Text>
              <Text style={styles.tableCell}>{item.quantity}</Text>
              <Text style={styles.tableCell}>{formatNumber(item.unitPrice)}</Text>
              <Text style={styles.tableCell}>{formatNumber(item.discount)}</Text>
              <Text style={styles.tableCell}>{formatNumber(item.total)}</Text>
            </View>
          ))}
        </View>

        {/* المجاميع */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>الضريبة (15%):</Text>
            <Text style={styles.totalValue}>{formatNumber(vat)} {formData.currency}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, styles.grandTotal]}>الإجمالي:</Text>
            <Text style={[styles.totalValue, styles.grandTotal]}>{formatNumber(total)} {formData.currency}</Text>
          </View>
        </View>

        {/* شروط الدفع والملاحظات */}
        {(formData.paymentTerms || formData.notes) && (
          <View style={styles.termsSection}>
            <Text style={styles.sectionTitle}>شروط الدفع والملاحظات</Text>
            {formData.paymentTerms && (
              <Text style={styles.termsText}>{formData.paymentTerms}</Text>
            )}
            {formData.notes && (
              <Text style={styles.termsText}>{formData.notes}</Text>
            )}
          </View>
        )}

        {/* التذييل */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>شكراً لتعاملكم معنا</Text>
          <Text style={styles.footerText}>تم إنشاء هذه الفاتورة بواسطة نظام إدارة الفواتير المتقدم</Text>
          <Text style={styles.footerText}>© 2024 شركة القوس الماسي للمقاولات. جميع الحقوق محفوظة.</Text>
        </View>
      </Page>
    </Document>
  )
}

// دالة لإنشاء PDF
export const generatePDF = async (props: PDFGeneratorProps): Promise<Blob> => {
  const { formData, items, vat, total, pageSize } = props
  
  try {
    const blob = await pdf(<InvoicePDF {...props} />).toBlob()
    return blob
  } catch (error) {
    console.error('خطأ في إنشاء PDF:', error)
    throw new Error('فشل في إنشاء ملف PDF')
  }
}

export default InvoicePDF 
