import axios from "axios"
import jwtDecode from "jwt-decode"
import { store } from "../src/app/store"
import { refreshAccessToken, logout } from "../src/features/auths/authSlice"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

let isRefreshing = false
let refreshPromise: Promise<any> | null = null

api.interceptors.request.use(async (config) => {
  const token = store.getState().auth.accessToken

  if (!token || !config.headers) return config

  try {
    const { exp } = jwtDecode<{ exp: number }>(token)
    const now = Date.now() / 1000

    if (exp - now < 120) {

      if (!isRefreshing) {
        isRefreshing = true
        refreshPromise = store
          .dispatch(refreshAccessToken() as any)
          .unwrap()
          .finally(() => {
            isRefreshing = false
          })
      }

      await refreshPromise

      const newToken = store.getState().auth.accessToken
      if (newToken) {
        config.headers.Authorization = `Bearer ${newToken}`
      }
    } else {
      config.headers.Authorization = `Bearer ${token}`
    }

    if (
      config.data &&
      typeof config.data !== "undefined" &&
      !(config.data instanceof FormData)
    ) {
      config.headers["Content-Type"] = "application/json"
    }
  } catch (e) {
    store.dispatch(logout())
    throw e
  }

  return config
})

export default api
