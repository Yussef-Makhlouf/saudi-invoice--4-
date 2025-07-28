"use client"


import { InvoiceForm } from "@/components/invoice-form"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 print:bg-white ">
      <div className="container mx-auto px-2 py-2">
        <InvoiceForm />
      </div>
    </div>
  )
}
