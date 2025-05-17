// src/utils/api.ts
import axios from 'axios'
import jwtDecode from 'jwt-decode'
import { refreshAccessToken, logout } from '../src/features/auths/authSlice'
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
})

// before each request, make sure our access token isn’t about to expire
api.interceptors.request.use(async (config) => {
  const state = store.getState()
  const token = state.auth.accessToken
  if (!token) return config

  const { exp } = jwtDecode<{ exp: number }>(token)
  const now = Date.now() / 1000
  

  // if token expires in the next 2 minutes, refresh it first
  if (exp - now < 120) {
    try {
      await Store.dispatch(refreshAccessToken() as any)
      const newToken = getState().auth.accessToken
      if (newToken && config.headers) {
        config.headers.Authorization = `Bearer ${newToken}`
      }
    } catch (e) {
      // if refresh fails, log them out
      dispatch(logout())
      throw e
    }
  } else if (config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})
