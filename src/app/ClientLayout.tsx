"use client"

import type React from "react"
import { Toaster } from "@/components/ui/sonner"
import { useDataStore } from "@/lib/data-store"
import { AuthProvider } from "@/lib/auth-supabase"
import { useEffect } from "react"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { initializeData } = useDataStore()

  useEffect(() => {
    // Only initialize data on the client
    if (typeof window !== 'undefined') {
      initializeData()
    }
  }, [initializeData])

  return (
    <AuthProvider>
      {children}
      <Toaster />
    </AuthProvider>
  )
}
