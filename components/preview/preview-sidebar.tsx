"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { CreditCard, Home, LogIn, Menu, PieChart, Wallet, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useMediaQuery } from "@/hooks/use-mobile"

const routes = [
  { label: "Painel", icon: Home, href: "/preview" },
  { label: "Transações", icon: CreditCard, href: "/preview/transactions" },
  { label: "Orçamentos", icon: Wallet, href: "/preview/budgets" },
  { label: "Categorias", icon: PieChart, href: "/preview/categories" },
]

/** Réplica visual do Sidebar real, sem nenhuma chamada à API (sem useAuthControllerMe/logout). */
export function PreviewSidebar() {
  const pathname = usePathname()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--sidebar-width",
      isMobile ? "0px" : isCollapsed ? "64px" : "256px",
    )
  }, [isCollapsed, isMobile])

  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  const collapsed = !isMobile && isCollapsed

  return (
    <>
      {isMobile && !isMobileOpen && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileOpen(true)}
          className="fixed left-4 top-[68px] z-40 bg-background md:hidden"
          aria-label="Abrir menu"
        >
          <Menu className="h-4 w-4" />
        </Button>
      )}

      {isMobile && isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={cn(
          "fixed top-14 left-0 h-[calc(100vh-3.5rem)] border-r bg-background z-50 transition-transform duration-300",
          isMobile
            ? cn("w-64", isMobileOpen ? "translate-x-0" : "-translate-x-full")
            : cn("translate-x-0 transition-all", collapsed ? "w-16" : "w-64"),
        )}
      >
        <div className="flex flex-col h-full p-4">
          <div className="space-y-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                aria-label={route.label}
                title={route.label}
                className={cn(
                  "flex items-center py-3 px-3 text-sm font-medium rounded-lg transition-colors hover:bg-accent hover:text-accent-foreground",
                  pathname === route.href
                    ? "bg-success/15 text-foreground"
                    : "text-muted-foreground",
                  collapsed && "justify-center px-0",
                )}
              >
                <route.icon className={cn("h-5 w-5", pathname === route.href && "text-success")} />
                {!collapsed && <span className="ml-3">{route.label}</span>}
              </Link>
            ))}
          </div>

          <div className="mt-auto space-y-2">
            <ThemeToggle collapsed={collapsed} />
            <Button asChild variant="outline" className={cn("w-full justify-center gap-2", collapsed && "px-0")}>
              <Link href="/login">
                <LogIn className="h-4 w-4" />
                {!collapsed && <span>Entrar</span>}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
