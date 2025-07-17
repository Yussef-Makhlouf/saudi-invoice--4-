"use client"

import { useState } from "react"
import { InvoiceForm } from "@/components/invoice-form"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 print:bg-white ">
      <div className="container mx-auto px-4 py-8">
        <InvoiceForm />
      </div>
    </div>
  )
}
