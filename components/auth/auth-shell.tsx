import type { ReactNode } from "react"
import { AuthVisualPanel } from "@/components/auth/auth-visual-panel"

type AuthShellProps = {
  title: string
  subtitle: string
  children: ReactNode
}

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <main className="relative flex min-h-screen w-full bg-background">
      {/* gradient seam between panels */}
      <div className="pointer-events-none absolute inset-y-0 left-[620px] z-10 hidden w-[30px] -translate-x-1/2 bg-gradient-to-r from-transparent via-[oklch(0.15_0.02_255/0.2)] to-transparent lg:block" />

      <div className="flex w-full flex-col px-6 py-12 sm:px-12 lg:w-[620px] lg:flex-none lg:px-24 lg:py-16">
        <div className="flex items-center gap-2.5">
          <div
            className="h-[30px] w-[30px] flex-shrink-0 rounded-[9px]"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.2 0.02 250) 0%, oklch(0.2 0.02 250) 50%, oklch(0.75 0.17 165) 50%, oklch(0.75 0.17 165) 100%)",
            }}
          />
          <span className="font-display text-[19px] font-bold tracking-tight text-foreground">RFinance</span>
        </div>

        <div className="flex flex-1 flex-col justify-center py-10 lg:max-w-[400px]">
          <h1 className="font-display mb-2.5 text-[32px] font-semibold leading-[1.12] tracking-tight text-foreground sm:text-[40px]">
            {title}
          </h1>
          <p className="mb-9 text-[15px] leading-relaxed text-muted-foreground">{subtitle}</p>

          {children}
        </div>

        <p className="text-xs text-muted-foreground">© 2026 RFinance</p>
      </div>

      <AuthVisualPanel />
    </main>
  )
}
