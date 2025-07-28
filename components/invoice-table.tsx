"use client"

import { useState } from "react"
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash2, Edit, FileText, Receipt } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { InvoiceItem } from "./invoice-form"

interface InvoiceTableProps {
  items: InvoiceItem[]
  setItems: (items: InvoiceItem[]) => void
}

interface NewItemForm {
  description: string
  quantity: number
  total: string
  discount: string
  advancePayment: string
}

export function InvoiceTable({ items, setItems }: InvoiceTableProps) {
  const [isAddingItem, setIsAddingItem] = useState(false)
  const [editingItem, setEditingItem] = useState<InvoiceItem | null>(null)
  const [newItem, setNewItem] = useState<NewItemForm>({
    description: "",
    quantity: 1,
    total: "",
    discount: "",
    advancePayment: "",
  })

  const formatNumber = (num: number) => {
    return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const columnHelper = createColumnHelper<InvoiceItem>()

  // التحقق من وجود خصم في أي بند
  const hasDiscount = items.some(item => item.discount > 0)

  const columns = [
    columnHelper.accessor("description", {
      header: "وصف الخدمة",
      cell: (info: any) => (
        <div className="min-w-[320px] max-w-[450px]">
          <div className="font-handicrafts font-medium text-gray-800 leading-relaxed arabic-text whitespace-pre-wrap">
            {info.getValue()}
          </div>
        </div>
      ),
    }),
    columnHelper.accessor("quantity", {
      header: "الكمية",
      cell: (info: any) => (
        <div className="text-center font-handicrafts text-gray-700 bg-blue-50 py-2.5 px-4 rounded-lg border border-blue-100">
          {info.getValue().toLocaleString("en-US")}
        </div>
      ),
    }),
    columnHelper.accessor("total", {
      header: "السعر النهائي",
      cell: (info: any) => (
        <div className="text-right font-handicrafts text-lg font-semibold text-gray-900">
          {formatNumber(info.getValue())} ريال
        </div>
      ),
    }),
    columnHelper.accessor("discount", {
      header: "الخصم",
      cell: (info: any) => (
        <div className="text-center">
          {info.getValue() > 0 ? (
            <span className="bg-red-50 text-red-600 px-3 py-1.5 text-sm font-handicrafts rounded-lg border border-red-200">
              {info.getValue().toLocaleString("en-US")}%
            </span>
          ) : (
            <span className="text-gray-400 text-sm">-</span>
          )}
        </div>
      ),
    }),
    columnHelper.accessor((row) => row.total * (1 - row.discount / 100), {
      id: "priceAfterDiscount",
      header: "السعر بعد الخصم",
      cell: (info: any) => (
        <div className="text-right font-handicrafts text-lg font-semibold text-green-700">
          {formatNumber(info.getValue())} ريال
        </div>
      ),
    }),
    // إظهار الدفعة المقدمة والمبلغ المتبقي بشكل دائم
    columnHelper.accessor("advancePayment", {
      header: "الدفعة المقدمة",
      cell: (info: any) => (
        <div className="text-right font-handicrafts text-blue-700 font-medium">
          {formatNumber(info.getValue())} ريال
        </div>
      ),
    }),
    columnHelper.accessor("remainingAmount", {
      header: "المبلغ المتبقي",
      cell: (info: any) => (
        <div className="text-right font-handicrafts text-orange-700 font-medium">
          {formatNumber(info.getValue())} ريال
        </div>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "الإجراءات",
      cell: (info: any ) => (
        <div className="flex gap-2 justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditingItem(info.row.original)}
            className="hover:bg-blue-50 hover:border-blue-300 border-gray-200 font-handicrafts text-blue-600 hover:text-blue-700 transition-colors"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => removeItem(info.row.original.id)}
            className="hover:bg-red-50 hover:border-red-300 border-gray-200 font-handicrafts text-red-600 hover:text-red-700 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    }),
  ]

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const addItem = () => {
    if (!newItem.description || !newItem.quantity || !newItem.total) return

    const total = parseFloat(newItem.total) || 0
    const discount = parseFloat(newItem.discount) || 0
    const advancePayment = parseFloat(newItem.advancePayment) || 0
    const priceAfterDiscount = total * (1 - discount / 100)
    const remainingAmount = priceAfterDiscount - advancePayment
    
    const item: InvoiceItem = {
      id: Date.now().toString(),
      description: newItem.description,
      quantity: newItem.quantity,
      // unitPrice: 0, // سيتم تجاهله في العرض
      discount,
      total,
      advancePayment,
      remainingAmount,
    }

    setItems([...items, item])
    setNewItem({
      description: "",
      quantity: 1,
      total: "",
      discount: "",
      advancePayment: "",
    })
    setIsAddingItem(false)
  }

  const updateItem = () => {
    if (!editingItem) return

    const priceAfterDiscount = editingItem.total * (1 - editingItem.discount / 100)
    const remainingAmount = priceAfterDiscount - editingItem.advancePayment
    const updatedItem = { ...editingItem, remainingAmount }

    setItems(items.map((item) => (item.id === editingItem.id ? updatedItem : item)))
    setEditingItem(null)
  }

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  return (
    <div className="space-y-8" dir="rtl">
      {/* Header Section */}
      <div className="flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-3 rounded-lg">
            <Receipt className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-handicrafts font-semibold text-gray-800">البنود</h3>
            <p className="text-gray-600 font-handicrafts text-sm mt-1">
              إدارة بنود الفاتورة والخدمات المقدمة
            </p>
          </div>
        </div>
        <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-8 font-handicrafts font-medium shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg">
              <Plus className="h-5 w-5 ml-2" />
              إضافة بند جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="pb-6">
              <DialogTitle className="text-2xl font-handicrafts font-semibold text-gray-800">إضافة بند جديد</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-6">
              <div className="md:col-span-3">
                <Label htmlFor="description" className="text-sm font-handicrafts text-gray-700 font-medium mb-3 block">
                  وصف الخدمة
                </Label>
                <Textarea
                  id="description"
                  value={newItem.description || ""}
                  onChange={(e: any) => setNewItem({ ...newItem, description: e.target.value })}
                  placeholder="اكتب وصف الخدمة هنا... يمكنك الكتابة في أكثر من سطر"
                  className="min-h-[120px] border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-right arabic-text font-handicrafts resize-none rounded-lg"
                />
              </div>
              <div>
                <Label htmlFor="quantity" className="text-sm font-handicrafts text-gray-700 font-medium mb-3 block">
                  الكمية
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={newItem.quantity}
                  onChange={(e: any) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                  className="h-14 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-right font-handicrafts rounded-lg"
                />
              </div>
              <div>
                <Label htmlFor="total" className="text-sm font-handicrafts text-gray-700 font-medium mb-3 block">
                  السعر النهائي
                </Label>
                <Input
                  id="total"
                  type="number"
                  step="0.01"
                  min="0"
                  value={newItem.total}
                  onChange={(e: any) => setNewItem({ ...newItem, total: e.target.value })}
                  className="h-14 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-right font-handicrafts rounded-lg"
                />
              </div>
              <div>
                <Label htmlFor="discount" className="text-sm font-handicrafts text-gray-700 font-medium mb-3 block">
                  الخصم (%) (اختياري)
                </Label>
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  max="100"
                  value={newItem.discount}
                  onChange={(e: any ) => setNewItem({ ...newItem, discount: e.target.value })}
                  className="h-14 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-right font-handicrafts rounded-lg"
                />
              </div>
              <div>
                <Label htmlFor="advancePayment" className="text-sm font-handicrafts text-gray-700 font-medium mb-3 block">
                  الدفعة المقدمة
                </Label>
                <Input
                  id="advancePayment"
                  type="number"
                  step="0.01"
                  min="0"
                  value={newItem.advancePayment}
                  onChange={(e: any) => setNewItem({ ...newItem, advancePayment: e.target.value })}
                  className="h-14 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-right font-handicrafts rounded-lg"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={addItem}
                  className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-handicrafts font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  إضافة البند
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Item Dialog */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-6">
            <DialogTitle className="text-2xl font-handicrafts font-semibold text-gray-800">تعديل البند</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-6">
              <div className="md:col-span-3">
                <Label htmlFor="edit-description" className="text-sm font-handicrafts text-gray-700 font-medium mb-3 block">
                  وصف الخدمة
                </Label>
                <Textarea
                  id="edit-description"
                  value={editingItem.description || ""}
                  onChange={(e: any) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="min-h-[120px] border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-right arabic-text font-handicrafts resize-none rounded-lg"
                />
              </div>
              <div>
                <Label htmlFor="edit-quantity" className="text-sm font-handicrafts text-gray-700 font-medium mb-3 block">
                  الكمية
                </Label>
                <Input
                  id="edit-quantity"
                  type="number"
                  min="1"
                  value={editingItem.quantity}
                  onChange={(e: any) => setEditingItem({ ...editingItem, quantity: Number(e.target.value) })}
                  className="h-14 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-right font-handicrafts rounded-lg"
                />
              </div>
              <div>
                <Label htmlFor="edit-total" className="text-sm font-handicrafts text-gray-700 font-medium mb-3 block">
                  السعر النهائي
                </Label>
                <Input
                  id="edit-total"
                  type="number"
                  step="0.01"
                  min="0"
                  value={editingItem.total}
                  onChange={(e: any) => setEditingItem({ ...editingItem, total: Number(e.target.value) })}
                  className="h-14 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-right font-handicrafts rounded-lg"
                />
              </div>
              <div>
                <Label htmlFor="edit-discount" className="text-sm font-handicrafts text-gray-700 font-medium mb-3 block">
                  الخصم (%) (اختياري)
                </Label>
                <Input
                  id="edit-discount"
                  type="number"
                  min="0"
                  max="100"
                  value={editingItem.discount}
                  onChange={(e: any) => setEditingItem({ ...editingItem, discount: Number(e.target.value) })}
                  className="h-14 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-right font-handicrafts rounded-lg"
                />
              </div>
              <div>
                <Label htmlFor="edit-advancePayment" className="text-sm font-handicrafts text-gray-700 font-medium mb-3 block">
                  الدفعة المقدمة
                </Label>
                <Input
                  id="edit-advancePayment"
                  type="number"
                  step="0.01"
                  min="0"
                  value={editingItem.advancePayment}
                  onChange={(e: any) => setEditingItem({ ...editingItem, advancePayment: Number(e.target.value) })}
                  className="h-14 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-right font-handicrafts rounded-lg"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={updateItem}
                  className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-handicrafts font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  حفظ التعديلات
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Table Section */}
      {items.length > 0 ? (
        <Card className="border-0 shadow-lg bg-white rounded-xl overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id} className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className="font-handicrafts text-gray-700 py-6 px-6 text-sm font-semibold text-right"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.map((row, index) => (
                    <TableRow
                      key={row.id}
                      className={`hover:bg-blue-50/50 transition-all duration-200 ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="py-6 px-6 border-b border-gray-100">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-0 shadow-lg bg-white rounded-xl">
          <CardContent className="text-center py-20">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-8">
              <FileText className="h-14 w-14 text-blue-400" />
            </div>
            <div className="flex flex-col items-center justify-center">
              <h3 className="text-2xl font-handicrafts font-semibold text-gray-800 mb-3">لا يوجد بنود</h3>
              <p className="text-gray-600 mb-8 font-handicrafts text-lg">ابدأ بإضافة البند الأول لفاتورتك</p>
              <Button 
                onClick={() => setIsAddingItem(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 font-handicrafts font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="h-5 w-5 ml-2" />
                إضافة أول بند
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
