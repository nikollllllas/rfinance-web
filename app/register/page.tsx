"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, Eye, EyeOff, Loader2, LockKeyhole, Mail, User } from "lucide-react"
import { useAuthControllerRegister } from "@/lib/api/auth/hooks/use-auth-controller-register"
import { getApiErrorMessage } from "@/lib/errors/get-api-error-message"
import { kubbClientConfig } from "@/lib/kubb-client"
import { AuthInput } from "@/components/auth/auth-input"
import { AuthShell } from "@/components/auth/auth-shell"
import { Button } from "@/components/ui/button"

// Mesmo mínimo do RegisterDto da API.
const MIN_PASSWORD_LENGTH = 6

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [error, setError] = useState("")
  const registerMutation = useAuthControllerRegister({
    client: kubbClientConfig,
  })

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("As senhas não conferem.")
      return
    }

    try {
      await registerMutation.mutateAsync({
        data: { name, email, password },
      })

      router.replace("/")
      router.refresh()
    } catch (err) {
      setError(getApiErrorMessage(err, "Não foi possível criar a conta. Tente novamente."))
    }
  }

  const isLoading = registerMutation.isPending

  return (
    <AuthShell title="Crie sua conta" subtitle="Já começamos com categorias prontas pra você organizar suas finanças.">
      <form className="flex flex-col gap-[18px]" onSubmit={handleRegister}>
        <div className="flex flex-col gap-[7px]">
          <label className="text-[13px] font-medium text-foreground/80" htmlFor="register-name">
            Nome
          </label>
          <AuthInput
            id="register-name"
            icon={<User className="h-[17px] w-[17px]" />}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Seu nome"
            autoComplete="name"
            required
          />
        </div>

        <div className="flex flex-col gap-[7px]">
          <label className="text-[13px] font-medium text-foreground/80" htmlFor="register-email">
            Email
          </label>
          <AuthInput
            id="register-email"
            type="email"
            icon={<Mail className="h-[17px] w-[17px]" />}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="seu@email.com"
            autoComplete="email"
            required
          />
        </div>

        <div className="flex flex-col gap-[7px]">
          <label className="text-[13px] font-medium text-foreground/80" htmlFor="register-password">
            Senha
          </label>
          <AuthInput
            id="register-password"
            type={isPasswordVisible ? "text" : "password"}
            icon={<LockKeyhole className="h-[17px] w-[17px]" />}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={`Mínimo de ${MIN_PASSWORD_LENGTH} caracteres`}
            autoComplete="new-password"
            minLength={MIN_PASSWORD_LENGTH}
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

        <div className="flex flex-col gap-[7px]">
          <label className="text-[13px] font-medium text-foreground/80" htmlFor="register-confirm">
            Confirmar senha
          </label>
          <AuthInput
            id="register-confirm"
            type={isPasswordVisible ? "text" : "password"}
            icon={<LockKeyhole className="h-[17px] w-[17px]" />}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Repita a senha"
            autoComplete="new-password"
            minLength={MIN_PASSWORD_LENGTH}
            required
          />
        </div>

        {error ? (
          <p
            role="alert"
            className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {error}
          </p>
        ) : null}

        <Button className="mt-2.5 h-12 w-full rounded-xl text-[14.5px]" disabled={isLoading} type="submit">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Criando conta...
            </>
          ) : (
            <>
              Criar conta
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>

        <p className="text-center text-[13.5px] text-muted-foreground">
          Já tem conta?{" "}
          <Link href="/login" className="font-medium text-foreground hover:underline">
            Entrar
          </Link>
        </p>

        <a href="/privacidade" className="text-xs text-muted-foreground underline">
          Política de Privacidade
        </a>
      </form>
    </AuthShell>
  )
}
