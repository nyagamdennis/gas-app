import axios from "axios"
import jwtDecode from "jwt-decode"
import { store } from "../src/app/store"
import { refreshAccessToken, logout } from "../src/features/auths/authSlice"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

let isRefreshing = false
let refreshPromise: Promise<any> | null = null

// ======================
// REQUEST INTERCEPTOR
// ======================
api.interceptors.request.use(async (config) => {
  const token = store.getState().auth.accessToken

  if (!token || !config.headers) return config

  try {
    const { exp } = jwtDecode<{ exp: number }>(token)
    const now = Date.now() / 1000

    if (exp - now < 120) {
      // Refresh if token will expire in < 2min
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
    }

    const newToken = store.getState().auth.accessToken
    if (newToken) {
      config.headers.Authorization = `Bearer ${newToken}`
    }

    if (config.data && !(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json"
    }
  } catch (e) {
    store.dispatch(logout())
    throw e
  }

  return config
})

// ======================
// RESPONSE INTERCEPTOR
// ======================
api.interceptors.response.use(
  (response) => response, // pass through if OK
  async (error) => {
    const originalRequest = error.config

    // Only handle 401 (Unauthorized) once
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
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
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return api(originalRequest) // 🔁 retry the request
        }
      } catch (err) {
        // Refresh failed → logout user
        store.dispatch(logout())
        return Promise.reject(err)
      }
    }

    return Promise.reject(error)
  },
)

export default api