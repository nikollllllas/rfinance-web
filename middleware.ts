import { NextResponse, type NextRequest } from "next/server"
import { AUTH_COOKIE_NAME } from "@/lib/auth/constants"

const publicPaths = ["/login", "/forgot-password", "/reset-password"]

export const middleware = (request: NextRequest) => {
  const { pathname } = request.nextUrl
  const isStaticPath =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes(".")
  const isPublicPath =
    publicPaths.includes(pathname) || pathname.startsWith("/preview")

  if (isStaticPath) {
    return NextResponse.next()
  }

  // A API faz sua própria autenticação; o middleware roda antes do rewrite
  // pro backend e não deve bloquear rotas públicas como /api/v1/auth/login.
  if (pathname.startsWith("/api/")) {
    return NextResponse.next()
  }

  // Acessível logado ou deslogado: o gate de consentimento linka pra cá mesmo autenticado.
  if (pathname === "/privacidade") {
    return NextResponse.next()
  }

  // Token emitido pela API externa; o middleware só exige presença (validação no backend).
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value
  if (!token || token.length === 0) {
    if (isPublicPath) {
      return NextResponse.next()
    }
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
