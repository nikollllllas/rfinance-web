"use client"

import { client } from "@/lib/api/.kubb/client"

client.setConfig({ baseURL: "/api" })

let didRegisterInterceptor = false

export const initKubbClient = () => {
  if (didRegisterInterceptor) {
    return
  }
  didRegisterInterceptor = true

  client.interceptors.error.use(async (error) => {
    const url = error.config?.url ?? ""
    if (error.response?.status === 401 && !url.includes("/auth/")) {
      await fetch("/api/v1/auth/logout", { method: "POST" }).catch(() => undefined)
      window.location.href = "/login"
    }
    return error
  })
}
