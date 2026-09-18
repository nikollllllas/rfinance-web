"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import Sidebar from "@/components/sidebar"
import { CategoriesProvider } from "@/components/categories-provider"

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isBareLayoutPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/preview")

  if (isBareLayoutPage) {
    return <>{children}</>
  }

  return (
    <CategoriesProvider>
      <Sidebar />
      <div className="min-h-screen bg-muted/40 pl-[var(--sidebar-width,256px)] transition-all duration-300">
        {children}
      </div>
    </CategoriesProvider>
  )
}
