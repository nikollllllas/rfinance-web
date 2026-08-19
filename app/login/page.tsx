"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, Check, Eye, EyeOff, Loader2, LockKeyhole, Mail } from "lucide-react"
import { useAuthControllerLogin } from "@/lib/api/auth/hooks/use-auth-controller-login"
import { setAuthTokenCookie } from "@/lib/auth/token-cookie"
import { getApiErrorMessage } from "@/lib/errors/get-api-error-message"
import { kubbClientConfig } from "@/lib/kubb-client"
import { AuthInput } from "@/components/auth/auth-input"
import { AuthShell } from "@/components/auth/auth-shell"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const loginMutation = useAuthControllerLogin({
    client: kubbClientConfig,
  })

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const payload = await loginMutation.mutateAsync({
        data: { email, password },
      })
      if (
        payload &&
        typeof payload === "object" &&
        "accessToken" in payload &&
        typeof (payload as { accessToken: unknown }).accessToken === "string"
      ) {
        setAuthTokenCookie((payload as { accessToken: string }).accessToken)
      }

      router.replace("/")
      router.refresh()
    } catch (err) {
      setError(getApiErrorMessage(err, "Erro de conexão. Tente novamente."))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthShell title="Bem-vindo de volta" subtitle="Entre na sua conta pra continuar organizando suas finanças.">
      <form className="flex flex-col gap-[18px]" onSubmit={handleLogin}>
        <div className="flex flex-col gap-[7px]">
          <label className="text-[13px] font-medium text-foreground/80" htmlFor="login-email">
            Email
          </label>
          <AuthInput
            id="login-email"
            type="email"
            icon={<Mail className="h-[17px] w-[17px]" />}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="seu@email.com"
            required
          />
        </div>

        <div className="flex flex-col gap-[7px]">
          <div className="flex items-center justify-between">
            <label className="text-[13px] font-medium text-foreground/80" htmlFor="login-password">
              Senha
            </label>
            <Link
              href="/forgot-password"
              className="text-[12.5px] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Esqueci minha senha
            </Link>
          </div>
          <AuthInput
            id="login-password"
            type={isPasswordVisible ? "text" : "password"}
            icon={<LockKeyhole className="h-[17px] w-[17px]" />}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Sua senha"
            required
            rightSlot={
              <button
                type="button"
                onClick={() => setIsPasswordVisible((current) => !current)}
                className="text-muted-foreground hover:text-foreground"
                aria-label={isPasswordVisible ? "Ocultar senha" : "Mostrar senha"}
              >
                {isPasswordVisible ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
              </button>
            }
          />
        </div>

        <label className="group mt-0.5 flex cursor-pointer select-none items-center gap-[9px]">
          <input type="checkbox" defaultChecked className="peer sr-only" />
          <span className="flex h-[17px] w-[17px] flex-shrink-0 items-center justify-center rounded-[5px] bg-muted transition-colors group-hover:bg-muted-foreground/30 peer-checked:bg-success peer-checked:group-hover:bg-success/85 peer-focus-visible:ring-2 peer-focus-visible:ring-success peer-focus-visible:ring-offset-2">
            <Check className="h-[11px] w-[11px] text-white" strokeWidth={3} />
          </span>
          <span className="text-[13.5px] text-muted-foreground transition-colors group-hover:text-foreground">
            Manter conectado por 30 dias
          </span>
        </label>

        {error ? (
          <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <Button className="mt-2.5 h-12 w-full rounded-xl text-[14.5px]" disabled={isLoading} type="submit">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Entrando...
            </>
          ) : (
            <>
              Entrar
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </AuthShell>
  )
}
