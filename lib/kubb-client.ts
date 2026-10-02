"use client"

import {
  axiosInstance,
  setConfig,
} from "@kubb/plugin-client/clients/axios"

export const kubbClientConfig = {
  baseURL: "/api",
}

let didRegisterInterceptor = false

export const initKubbClient = () => {
  setConfig(kubbClientConfig)
  axiosInstance.defaults.baseURL = "/api"

  if (didRegisterInterceptor) {
    return
  }
  didRegisterInterceptor = true

  // Sessão revogada/expirada: a API limpa o cookie no logout e voltamos pro login.
  axiosInstance.interceptors.response.use(undefined, async (error) => {
    const url: string = error?.config?.url ?? ""
    if (error?.response?.status === 401 && !url.includes("/auth/")) {
      await fetch("/api/v1/auth/logout", { method: "POST" }).catch(() => undefined)
      window.location.href = "/login"
    }
    return Promise.reject(error)
  })
}
