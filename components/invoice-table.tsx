"use client"

import { useState } from "react"
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash2, Edit, FileText } from "lucide-react"
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
  unitPrice: string
  discount: string
}

export function InvoiceTable({ items, setItems }: InvoiceTableProps) {
  const [isAddingItem, setIsAddingItem] = useState(false)
  const [editingItem, setEditingItem] = useState<InvoiceItem | null>(null)
  const [newItem, setNewItem] = useState<NewItemForm>({
    description: "", // هذا الحقل سيحتوي على الوصف باللغة العربية فقط
    quantity: 1,
    unitPrice: "",
    discount: "",
  })

  const formatNumber = (num: number) => {
    return num.toLocaleString("ar-SA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const columnHelper = createColumnHelper<InvoiceItem>()

  const columns = [
    columnHelper.accessor("description", {
      header: "وصف الخدمة", // رأس العمود للوصف العربي
      cell: (info: any) => (
        <div className="min-w-[250px] max-w-[350px]">
          <div className="font-cairo font-medium text-neutral-grey leading-relaxed arabic-text">{info.getValue()}</div>
        </div>
      ),
    }),
    columnHelper.accessor("quantity", {
      header: "الكمية",
      cell: (info: any) => (
        <div className="text-center font-cairo font-semibold text-neutral-grey bg-secondary/20 py-2 px-3">
          {info.getValue().toLocaleString("ar-SA")}
        </div>
      ),
    }),
    columnHelper.accessor("unitPrice", {
      header: "سعر الوحدة",
      cell: (info: any) => (
        <div className="text-right font-cairo font-semibold text-neutral-grey">{formatNumber(info.getValue())}</div>
      ),
    }),
    columnHelper.accessor((row) => row.quantity * row.unitPrice, {
      id: "priceBeforeDiscount",
      header: "السعر قبل الخصم",
      cell: (info: any) => (
        <div className="text-right font-cairo font-semibold text-neutral-grey">{formatNumber(info.getValue())}</div>
      ),
    }),
    columnHelper.accessor("discount", {
      header: "الخصم",
      cell: (info: any) => (
        <div className="text-center">
          <span className="bg-primary/10 text-primary px-2 py-1 text-sm font-cairo font-medium">
            {info.getValue().toLocaleString("ar-SA")}%
          </span>
        </div>
      ),
    }),
    columnHelper.accessor("total", {
      header: "المجموع",
      cell: (info: any) => (
        <div className="text-right font-cairo font-bold text-lg text-primary">{formatNumber(info.getValue())}</div>
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
            className="hover:bg-secondary/20 hover:border-secondary border-gray-300 font-cairo"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => removeItem(info.row.original.id)}
            className="hover:bg-red-50 hover:border-red-300 hover:text-red-600 border-gray-300 font-cairo"
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
    if (!newItem.description || !newItem.quantity || !newItem.unitPrice) return

    const unitPrice = parseFloat(newItem.unitPrice) || 0
    const discount = parseFloat(newItem.discount) || 0
    const total = newItem.quantity * unitPrice * (1 - discount / 100)
    
    const item: InvoiceItem = {
      id: Date.now().toString(),
      description: newItem.description,
      quantity: newItem.quantity,
      unitPrice,
      discount,
      total,
    }

    setItems([...items, item])
    setNewItem({
      description: "",
      quantity: 1,
      unitPrice: "",
      discount: "",
    })
    setIsAddingItem(false)
  }

  const updateItem = () => {
    if (!editingItem) return

    const total = editingItem.quantity * editingItem.unitPrice * (1 - editingItem.discount / 100)
    const updatedItem = { ...editingItem, total }

    setItems(items.map((item) => (item.id === editingItem.id ? updatedItem : item)))
    setEditingItem(null)
  }

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-cairo-bold text-neutral-grey">البنود</h3>
        <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
          <DialogTrigger asChild>
            <Button className="bg-secondary hover:bg-secondary/90 text-white h-12 px-6 font-cairo-bold">
              <Plus className="h-4 w-4 mr-2" />
            إضافة بند
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-cairo-bold">إضافة بند</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div className="md:col-span-2">
                <Label htmlFor="description" className="text-sm font-cairo-bold text-gray-700">
                  وصف الخدمة
                </Label>
                <Textarea
                  id="description"
                  value={newItem.description || ""}
                  onChange={(e: any) => setNewItem({ ...newItem, description: e.target.value })}
                  placeholder="وصف الخدمة باللغة العربية"
                  className="mt-2 min-h-[80px] border-gray-300 focus:border-secondary focus:ring-secondary text-right arabic-text font-cairo"
                />
              </div>
              <div>
                <Label htmlFor="quantity" className="text-sm font-cairo-bold text-gray-700">
                  الكمية
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  value={newItem.quantity}
                  onChange={(e: any) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                  className="mt-2 h-12 border-gray-300 focus:border-secondary focus:ring-secondary text-right font-cairo"
                />
              </div>
              <div>
                <Label htmlFor="unitPrice" className="text-sm font-cairo-bold text-gray-700">
                  سعر الوحدة
                </Label>
                <Input
                  id="unitPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={newItem.unitPrice}
                  onChange={(e: any) => setNewItem({ ...newItem, unitPrice: e.target.value })}
                  className="mt-2 h-12 border-gray-300 focus:border-secondary focus:ring-secondary text-right font-cairo"
                />
              </div>
              <div>
                <Label htmlFor="discount" className="text-sm font-cairo-bold text-gray-700">
                  الخصم (%)
                </Label>
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  value={newItem.discount}
                  onChange={(e: any ) => setNewItem({ ...newItem, discount: e.target.value })}
                  className="mt-2 h-12 border-gray-300 focus:border-secondary focus:ring-secondary text-right font-cairo"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={addItem}
                  className="w-full h-12 bg-secondary hover:bg-secondary/90 text-white font-cairo-bold"
                >
                  إضافة بند
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Item Dialog */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-cairo-bold">تعديل بند</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div className="md:col-span-2">
                <Label htmlFor="edit-description" className="text-sm font-cairo-bold text-gray-700">
                  وصف الخدمة
                </Label>
                <Textarea
                  id="edit-description"
                  value={editingItem.description || ""}
                  onChange={(e: any) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="mt-2 min-h-[80px] border-gray-300 focus:border-primary focus:ring-primary text-right arabic-text font-cairo"
                />
              </div>
              <div>
                <Label htmlFor="edit-quantity" className="text-sm font-cairo-bold text-gray-700">
                  الكمية
                </Label>
                <Input
                  id="edit-quantity"
                  type="number"
                  min="0"
                  value={editingItem.quantity}
                  onChange={(e: any) => setEditingItem({ ...editingItem, quantity: Number(e.target.value) })}
                  className="mt-2 h-12 border-gray-300 focus:border-primary focus:ring-primary text-right font-cairo"
                />
              </div>
              <div>
                <Label htmlFor="edit-unitPrice" className="text-sm font-cairo-bold text-gray-700">
                  سعر الوحدة
                </Label>
                <Input
                  id="edit-unitPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={editingItem.unitPrice}
                  onChange={(e: any) => setEditingItem({ ...editingItem, unitPrice: Number(e.target.value) })}
                  className="mt-2 h-12 border-gray-300 focus:border-primary focus:ring-primary text-right font-cairo"
                />
              </div>
              <div>
                <Label htmlFor="edit-discount" className="text-sm font-cairo-bold text-gray-700">
                  الخصم (%)
                </Label>
                <Input
                  id="edit-discount"
                  type="number"
                  min="0"
                  value={editingItem.discount}
                  onChange={(e: any) => setEditingItem({ ...editingItem, discount: Number(e.target.value) })}
                  className="mt-2 h-12 border-gray-300 focus:border-primary focus:ring-primary text-right font-cairo"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={updateItem}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-cairo-bold"
                >
                  تعديل بند
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {items.length > 0 ? (
        <Card className="border border-gray-200 bg-white">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id} className="bg-gray-50 border-b-2 border-gray-200">
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className="font-cairo-bold text-neutral-grey py-4 px-6 text-sm text-right"
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
                      className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="py-4 px-6 border-b border-gray-100">
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
        <Card className="border border-gray-200 bg-white">
          <CardContent className="text-center py-16">
            <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="h-12 w-12 text-gray-400" />
            </div>
            <div className="flex flex-col items-center justify-center">
              <h3 className="text-xl font-cairo-bold text-neutral-grey mb-2 " >لا يوجد بنود</h3>
              <p className="text-gray-600 mb-6 font-cairo">ابدأ بإضافة البند الأول لفاتورتك</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
