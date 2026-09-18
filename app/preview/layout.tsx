"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PreviewSidebar } from "@/components/preview/preview-sidebar";

/**
 * Shell da rota pública /preview: barra fixa + sidebar estática, ambas sem
 * nenhuma chamada à API. As páginas filhas só recebem dados de lib/preview-fixtures.
 */
export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/40">
      <header className="fixed top-0 z-30 flex h-14 w-full items-center gap-3 border-b bg-background px-4">
        <span className="font-display text-lg font-bold tracking-tight">RFinance</span>
        <span className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
          <Sparkles className="h-3.5 w-3.5" />
          Prévia com dados fictícios
        </span>
        <Button asChild size="sm" className="ml-auto">
          <Link href="/login">Entrar</Link>
        </Button>
      </header>

      <PreviewSidebar />

      <div className="pl-[var(--sidebar-width,256px)] pt-14 transition-all duration-300">
        {children}
      </div>
    </div>
  );
}
