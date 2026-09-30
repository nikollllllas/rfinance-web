"use client"

import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { authControllerMeQueryKey, useAuthControllerMe } from "@/lib/api/auth/hooks/use-auth-controller-me"
import { useUsersControllerAcceptPrivacy } from "@/lib/api/users/hooks/use-users-controller-accept-privacy"
import { kubbClientConfig } from "@/lib/kubb-client"

export function PrivacyConsentGate() {
  const queryClient = useQueryClient()
  const meQuery = useAuthControllerMe({ client: kubbClientConfig })
  const accept = useUsersControllerAcceptPrivacy({ client: kubbClientConfig })
  const [error, setError] = useState(false)
  const user = (meQuery.data as { user?: { privacyAcceptedAt?: string | null } } | undefined)?.user
  const needsConsent = Boolean(user) && !user?.privacyAcceptedAt

  return (
    <Dialog open={needsConsent}>
      <DialogContent
        hideClose
        className="sm:max-w-[520px]"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Política de Privacidade</DialogTitle>
          <DialogDescription>
            Para continuar usando o RFinance, leia e aceite nossa{" "}
            <a href="/privacidade" target="_blank" rel="noreferrer" className="underline">Política de Privacidade</a>.
          </DialogDescription>
        </DialogHeader>
        {error && (
          <p className="text-sm text-destructive">Não foi possível registrar o aceite. Tente novamente.</p>
        )}
        <DialogFooter>
          <Button
            disabled={accept.isPending}
            onClick={async () => {
              try {
                setError(false)
                await accept.mutateAsync()
                await queryClient.invalidateQueries({ queryKey: authControllerMeQueryKey() })
              } catch {
                setError(true)
              }
            }}
          >
            Li e aceito
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
