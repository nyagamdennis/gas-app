// @ts-nocheck
// src/utils/api.ts

import axios from 'axios'

// Add type declaration for ImportMetaEnv
interface ImportMetaEnv {
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

import jwtDecode from 'jwt-decode'
import { store } from '../src/app/store'
import { refreshAccessToken, logout } from '../src/features/auths/authSlice'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.request.use(async (config) => {
  const state = store.getState()
  const token = state.auth.accessToken
  if (!token || !config.headers) return config

  const { exp } = jwtDecode<{ exp: number }>(token)
  const now = Date.now() / 1000

  // If token expires in next 2 mins
  if (exp - now < 120) {
    try {
      // Dispatch refresh and wait
      await store.dispatch(refreshAccessToken() as any)

      const newToken = store.getState().auth.accessToken
      if (newToken) {
        config.headers.Authorization = `Bearer ${newToken}`
      }
    } catch (e) {
      store.dispatch(logout())
      throw e
    }
  } else {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default api
