"use client"

import { useState } from "react"
import { format, formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarDays, CreditCard, Loader2, PieChart, UserX, Wallet } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DeleteAccountDialog } from "@/components/delete-account-dialog"
import { useAuthControllerMe } from "@/lib/api/auth/hooks/use-auth-controller-me"
import { useCategoriesControllerList } from "@/lib/api/categories/hooks/use-categories-controller-list"
import { parseCurrentUser } from "@/lib/auth/current-user"
import { kubbClientConfig } from "@/lib/kubb-client"

export default function AccountPage() {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const meQuery = useAuthControllerMe({ client: kubbClientConfig })
  const categoriesQuery = useCategoriesControllerList({ client: kubbClientConfig })
  const user = parseCurrentUser(meQuery.data)
  const categories = categoriesQuery.data ?? []

  // A listagem de categorias já traz quantas transações e orçamentos usam cada uma.
  const stats = [
    { label: "Transações", icon: CreditCard, value: categories.reduce((sum, c) => sum + c.transactionCount, 0) },
    { label: "Categorias", icon: PieChart, value: categories.length },
    { label: "Orçamentos", icon: Wallet, value: categories.reduce((sum, c) => sum + c.budgetCount, 0) },
  ]
  const createdAt = user?.createdAt ? new Date(user.createdAt) : null

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
        <div className="flex h-14 items-center px-4 md:px-6">
          <span className="text-lg font-semibold">Minha conta</span>
        </div>
      </header>

      <main className="flex-1 space-y-4 p-4 md:p-6">
        {meQuery.isLoading ? (
          <div className="flex h-[50vh] items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : !user ? (
          <div className="rounded-md border border-destructive p-4 text-center text-destructive">
            Não foi possível carregar seus dados. Por favor, tente novamente.
          </div>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {user.name}
                  {user.role === "ADMIN" && <Badge variant="secondary">Administrador</Badge>}
                </CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </CardHeader>
              {createdAt && (
                <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  Membro desde {format(createdAt, "d 'de' MMMM 'de' yyyy", { locale: ptBR })} (
                  {formatDistanceToNow(createdAt, { locale: ptBR, addSuffix: true })})
                </CardContent>
              )}
            </Card>

            <div className="grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <Card key={stat.label}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold tabular-nums">
                      {categoriesQuery.isLoading || categoriesQuery.isError ? "—" : stat.value.toLocaleString("pt-BR")}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {categoriesQuery.isError && (
              <p className="text-sm text-destructive">Não foi possível carregar os totais. Tente novamente mais tarde.</p>
            )}

            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="text-destructive">Excluir conta</CardTitle>
                <CardDescription>
                  Apaga definitivamente sua conta e todas as suas transações, categorias e orçamentos.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" onClick={() => setIsDeleteOpen(true)}>
                  <UserX className="mr-2 h-4 w-4" />
                  Excluir minha conta
                </Button>
              </CardContent>
            </Card>
            <DeleteAccountDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen} />
          </>
        )}
      </main>
    </div>
  )
}
