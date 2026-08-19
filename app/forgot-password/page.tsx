"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Loader2, Mail } from "lucide-react"
import { AuthInput } from "@/components/auth/auth-input"
import { AuthShell } from "@/components/auth/auth-shell"
import { Button } from "@/components/ui/button"
import { useAuthControllerForgotPassword } from "@/lib/api/auth/hooks/use-auth-controller-forgot-password"
import { getApiErrorMessage } from "@/lib/errors/get-api-error-message"
import { kubbClientConfig } from "@/lib/kubb-client"

type ForgotPasswordResult = {
  message?: string
}

export default function ForgotPasswordPage() {
  const forgotPasswordMutation = useAuthControllerForgotPassword({
    client: kubbClientConfig,
  })
  const [email, setEmail] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const isSubmitting = forgotPasswordMutation.isPending

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage("")

    try {
      const response = (await forgotPasswordMutation.mutateAsync({ data: { email } })) as ForgotPasswordResult
      setSuccessMessage(
        response?.message ??
          "Se existir uma conta com este e-mail, enviaremos as instruções de recuperação.",
      )
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Não foi possível enviar a solicitação."))
    }
  }

  return (
    <AuthShell title="Esqueci minha senha" subtitle="Informe seu email pra receber as instruções de redefinição.">
      <form className="flex flex-col gap-[18px]" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-[7px]">
          <label className="text-[13px] font-medium text-foreground/80" htmlFor="forgot-password-email">
            Email
          </label>
          <AuthInput
            id="forgot-password-email"
            type="email"
            icon={<Mail className="h-[17px] w-[17px]" />}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="seu@email.com"
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
              Enviando...
            </>
          ) : (
            "Enviar instruções"
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
