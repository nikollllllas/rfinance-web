"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { CreditCard, Home, Menu, PieChart, Users, Wallet, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useMediaQuery } from "@/hooks/use-mobile"
import { useAuthControllerLogout } from "@/lib/api/auth/hooks/use-auth-controller-logout"
import { useAuthControllerMe } from "@/lib/api/auth/hooks/use-auth-controller-me"
import { clearAuthTokenCookie } from "@/lib/auth/token-cookie"
import { parseCurrentUser } from "@/lib/auth/current-user"
import { kubbClientConfig } from "@/lib/kubb-client"

type SidebarRoute = {
  label: string
  icon: typeof Home
  href: string
  adminOnly?: boolean
}

const routes: SidebarRoute[] = [
  {
    label: "Painel",
    icon: Home,
    href: "/",
  },
  {
    label: "Transações",
    icon: CreditCard,
    href: "/transactions",
  },
  {
    label: "Orçamentos",
    icon: Wallet,
    href: "/budgets",
  },
  {
    label: "Categorias",
    icon: PieChart,
    href: "/categories",
  },
  {
    label: "Usuários",
    icon: Users,
    href: "/admin/users",
    adminOnly: true,
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const meQuery = useAuthControllerMe({
    client: kubbClientConfig,
  })
  const currentUser = parseCurrentUser(meQuery.data)
  const isAdmin = currentUser?.role === "ADMIN"
  const visibleRoutes = routes.filter((route) => !route.adminOnly || isAdmin)
  const logoutMutation = useAuthControllerLogout({
    client: kubbClientConfig,
  })

  useEffect(() => {
    const savedState = localStorage.getItem("sidebarCollapsed")
    if (isMobile) {
      setIsCollapsed(false)
    } else if (savedState !== null) {
      setIsCollapsed(JSON.parse(savedState))
    }
  }, [isMobile])

  const toggleSidebar = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    if (!isMobile) {
      localStorage.setItem("sidebarCollapsed", JSON.stringify(newState))
    }
  }

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
          className="fixed left-4 top-4 z-40 bg-background md:hidden"
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
          "fixed top-0 left-0 h-screen border-r bg-background z-50 transition-transform duration-300",
          isMobile
            ? cn("w-64", isMobileOpen ? "translate-x-0" : "-translate-x-full")
            : cn("translate-x-0 transition-all", collapsed ? "w-16" : "w-64"),
        )}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-6">
            {!collapsed && (
              <Link href="/" className="flex items-center gap-2">
                <span
                  className="h-7 w-7 flex-shrink-0 rounded-[8px]"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(var(--foreground)) 0%, hsl(var(--foreground)) 50%, hsl(var(--success)) 50%, hsl(var(--success)) 100%)",
                  }}
                />
                <span className="font-display text-lg font-bold tracking-tight">RFinance</span>
              </Link>
            )}
            {collapsed && (
              <span
                className="h-7 w-7 mx-auto flex-shrink-0 rounded-[8px]"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(var(--foreground)) 0%, hsl(var(--foreground)) 50%, hsl(var(--success)) 50%, hsl(var(--success)) 100%)",
                }}
              />
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => (isMobile ? setIsMobileOpen(false) : toggleSidebar())}
              className="ml-auto"
              aria-label={isMobile ? "Fechar menu" : collapsed ? "Expandir menu lateral" : "Recolher menu lateral"}
            >
              {isMobile ? (
                <X className="h-4 w-4" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={cn("h-4 w-4 transition-transform", collapsed ? "rotate-180" : "rotate-0")}
                >
                  <title>{collapsed ? "Expandir menu lateral" : "Recolher menu lateral"}</title>
                  <path d="m15 6-6 6 6 6" />
                </svg>
              )}
            </Button>
          </div>

          <div className="space-y-1">
            {visibleRoutes
              .map((route) => (
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
            <Button
              variant="outline"
              className={cn("w-full justify-start", collapsed && "justify-center px-0")}
              onClick={async () => {
                try {
                  await logoutMutation.mutateAsync()
                } finally {
                  clearAuthTokenCookie()
                  window.location.href = "/login"
                }
              }}
            >
              {!collapsed && <span>Sair</span>}
              {collapsed && <span>⎋</span>}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
