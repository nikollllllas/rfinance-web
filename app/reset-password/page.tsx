"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, KeyRound, Loader2, LockKeyhole } from "lucide-react"
import { AuthInput } from "@/components/auth/auth-input"
import { AuthShell } from "@/components/auth/auth-shell"
import { Button } from "@/components/ui/button"
import { useAuthControllerResetPassword } from "@/lib/api/auth/hooks/use-auth-controller-reset-password"
import { getApiErrorMessage } from "@/lib/errors/get-api-error-message"
import { kubbClientConfig } from "@/lib/kubb-client"

export default function ResetPasswordPage() {
  const resetPasswordMutation = useAuthControllerResetPassword({
    client: kubbClientConfig,
  })
  const [token, setToken] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const isSubmitting = resetPasswordMutation.isPending

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const tokenFromUrl = new URLSearchParams(window.location.search).get("token")
    if (!tokenFromUrl) {
      return
    }

    setToken(tokenFromUrl)
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage("")
    setSuccessMessage("")

    if (password.length < 6) {
      setErrorMessage("A senha precisa ter no mínimo 6 caracteres.")
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage("As senhas não conferem.")
      return
    }

    try {
      await resetPasswordMutation.mutateAsync({
        data: {
          token,
          password,
        },
      })
      setSuccessMessage("Senha redefinida com sucesso. Faça login com sua nova senha.")
      setPassword("")
      setConfirmPassword("")
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Não foi possível redefinir a senha."))
    }
  }

  return (
    <AuthShell title="Redefinir senha" subtitle="Escolha uma nova senha pra sua conta.">
      <form className="flex flex-col gap-[18px]" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-[7px]">
          <label className="text-[13px] font-medium text-foreground/80" htmlFor="reset-password-token">
            Token de recuperação
          </label>
          <AuthInput
            id="reset-password-token"
            icon={<KeyRound className="h-[17px] w-[17px]" />}
            value={token}
            onChange={(event) => setToken(event.target.value)}
            placeholder="Cole aqui o token recebido"
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="flex flex-col gap-[7px]">
          <label className="text-[13px] font-medium text-foreground/80" htmlFor="reset-password-new">
            Nova senha
          </label>
          <AuthInput
            id="reset-password-new"
            type="password"
            minLength={6}
            icon={<LockKeyhole className="h-[17px] w-[17px]" />}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Mínimo de 6 caracteres"
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="flex flex-col gap-[7px]">
          <label className="text-[13px] font-medium text-foreground/80" htmlFor="reset-password-confirm">
            Confirmar nova senha
          </label>
          <AuthInput
            id="reset-password-confirm"
            type="password"
            minLength={6}
            icon={<LockKeyhole className="h-[17px] w-[17px]" />}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Repita a nova senha"
            required
            disabled={isSubmitting}
          />
        </div>

        {errorMessage ? (
          <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {errorMessage}
          </p>
        ) : null}
        {successMessage ? <p className="text-sm text-success">{successMessage}</p> : null}

        <Button className="mt-2.5 h-12 w-full rounded-xl text-[14.5px]" type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            "Redefinir senha"
          )}
        </Button>
      </form>

      <Button
        asChild
        variant="link"
        className="mt-4 px-0 text-muted-foreground transition-colors hover:text-foreground"
      >
        <Link href="/login">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao login
        </Link>
      </Button>
    </AuthShell>
  )
}
