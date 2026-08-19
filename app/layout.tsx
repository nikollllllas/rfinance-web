import type React from "react";
import "@/app/globals.css";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import AppShell from "@/components/app-shell";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";
import { QueryProvider } from "@/components/query-provider";
import { KubbProvider } from "@/components/kubb-provider";

const inter = Inter({ subsets: ["latin"] });
const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-display",
});

export const metadata = {
  title: "RFinance - Controle financeiro",
  description: "Controle financeiro da Rúbia",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className} ${bricolageGrotesque.variable}`}>
        <ThemeProvider>
          <QueryProvider>
            <KubbProvider>
              <AppShell>
                {children}
                <Toaster />
                <Analytics />
              </AppShell>
            </KubbProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
