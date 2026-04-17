/* eslint-disable prettier/prettier */
import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import jwt_decode from "jwt-decode"
import cookies from "cookies-js"
import api from "../../../utils/api"

interface User {
  user_id: string
  email: string
  first_name: string
  last_name: string
  phone_number: number
  role: string
  is_owner: boolean
  is_employee: boolean
  business: []
  employee_id: string
  email_is_verified?: boolean
  phone_is_verified?: boolean
  phone?: string
 
}

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isLoading: boolean
  error: string | null
  isAuthenticated: boolean
  // 🔥 NEW: Add status tracking
  loginStatus: "idle" | "loading" | "success" | "failure"
  loginError: string | null

  emailIsVerified: boolean
  phoneIsVerified: boolean
  phone: string | null
  email: string | null
}

interface LoginPayload {
  user: any
  accessToken: string
  refreshToken: string


}

const userCookie = cookies.get("user")
const accessTokenCookie = cookies.get("accessToken")
const accessRefreshCookie = cookies.get("refreshToken")

let user = null
let accessToken = null
let refreshToken = null

let emailIsVerified = false
let phoneIsVerified = false
let phone = null
let email = null



if (userCookie && accessTokenCookie && accessRefreshCookie) {
  try {
    user = JSON.parse(userCookie)
    accessToken = accessTokenCookie
    refreshToken = accessRefreshCookie

    const decoded: any = jwt_decode(accessToken)
    emailIsVerified = decoded?.email_is_verified ?? false
    phoneIsVerified = decoded?.phone_is_verified ?? false
    phone = decoded?.phone ?? null
    email = decoded?.email ?? null


  } catch (e) {
  }
}

const initialState: AuthState = {
  user,
  accessToken,
  refreshToken,
  isLoading: false,
  error: null,
  isAuthenticated: !!accessToken,
  // 🔥 NEW: Initialize status
  loginStatus: "idle",
  loginError: null,

  emailIsVerified,
  phoneIsVerified,
  phone,
  email,
}

import { createSelector } from "@reduxjs/toolkit"
import { RootState } from "../../app/store"
import {
  fetchEmployeeVerificationStatus,
  selectEmployeeVerified,
} from "../employees/employeeStatusSlice"
import { useEffect } from "react"

export const refreshAccessTokenIfExpired =
  () => async (dispatch: any, getState: any) => {
    const state = getState()
    const accessToken = state.auth.accessToken

    if (!accessToken) return

    try {
      const decodedToken: any = jwt_decode(accessToken)
      const now = Date.now() / 1000
      const user = {
        ...decodedToken,
        email_is_verified: decodedToken.email_is_verified,
        phone_is_verified: decodedToken.phone_is_verified,
        phone: decodedToken.phone,
      }
      if (decodedToken.exp - now < 120) {
        await dispatch(refreshAccessToken())
      }
    } catch (err) {
      dispatch(logout())
    }
  }

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true
      state.error = null
      state.loginStatus = "loading"
      state.loginError = null
    },
    loginSuccess: (state, action: PayloadAction<LoginPayload>) => {
      const timers = 60 * 86400
      const { user, accessToken, refreshToken } = action.payload
      state.user = user
      state.accessToken = accessToken
      state.refreshToken = refreshToken
      state.isLoading = false
      state.error = null
      state.isAuthenticated = true
      // 🔥 NEW: Set status to success
      state.loginStatus = "success"
      state.loginError = null

       state.emailIsVerified = user?.email_is_verified ?? false
       state.phoneIsVerified = user?.phone_is_verified ?? false
       state.phone = user?.phone ?? null
       state.email = user?.email ?? null

      cookies.set("refreshToken", refreshToken, { expires: timers })
      cookies.set("user", JSON.stringify(user), { expires: timers })
      cookies.set("accessToken", accessToken, { expires: timers })
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
      // 🔥 NEW: Set status to failure
      state.loginStatus = "failure"
      state.loginError = action.payload
    },
    // 🔥 NEW: Reset login status (useful after showing error)
    resetLoginStatus: (state) => {
      state.loginStatus = "idle"
      state.loginError = null
    },
    logoutSuccess: (state) => {
      state.user = null
      state.accessToken = null
      state.isAuthenticated = false
      // 🔥 NEW: Reset status on logout
      state.loginStatus = "idle"
      state.loginError = null

      state.emailIsVerified = false
      state.phoneIsVerified = false
      state.phone = null
      state.email = null

      cookies.expire("user")
      cookies.expire("accessToken")
      cookies.expire("refreshToken")

      sessionStorage.removeItem("notifications")
    },
  },
})

export const {
  loginStart,
  loginFailure,
  loginSuccess,
  logoutSuccess,
  resetLoginStatus, // 🔥 NEW: Export reset action
} = authSlice.actions

export const login = (credentials: any) => async (dispatch: any) => {
  try {
    dispatch(loginStart())
    const response = await api.post("auth/login/", credentials)
    const accessToken = response.data.access
    const refreshToken = response.data.refresh
    const decodedToken: any = jwt_decode(accessToken)

    const user: User = {
      user_id: decodedToken.user_id,
      email: decodedToken.email,
      first_name: decodedToken.first_name,
      last_name: decodedToken.last_name,
      phone_number: decodedToken.phone_number,
      role: decodedToken.role,
      is_owner: decodedToken.is_owner,
      is_employee: decodedToken.is_employee,
      business: decodedToken.business,
      employee_id: decodedToken.employee_id,

      email_is_verified: decodedToken.email_is_verified,
      phone_is_verified: decodedToken.phone_is_verified,
      phone: decodedToken.phone,
    }

    dispatch(
      loginSuccess({
        user,
        accessToken,
        refreshToken,
        
      }),
    )

    const timer = 240
    const intervalId = setInterval(() => {
      dispatch(refreshAccessToken())
    }, timer * 1000)
    dispatch({ type: "SET_INTERVAL_ID", payload: intervalId })

    // 🔥 NEW: Return both data and user info for redirect
    return {
      success: true,
      data: response.data,
      user,
    }
  } catch (error: any) {
    const message = error.response?.data?.detail || "An unknown error occurred."
    dispatch(loginFailure(message))
    // 🔥 NEW: Return error info
    return {
      success: false,
      error: message,
    }
  }
}

export const logout = () => (dispatch: any) => {
  dispatch(logoutSuccess())
}

export const refreshAccessToken =
  () => async (dispatch: any, getState: any) => {
    try {
      const newrefreshToken = cookies.get("refreshToken")

      const response = await api.post("/auth/token/refresh/", {
        refresh: newrefreshToken,
      })
      const accessToken = response.data.access
      const refreshToken = response.data.refresh
      const decodedToken: any = jwt_decode(accessToken)
      const user = {
        ...decodedToken,
        email_is_verified: decodedToken.email_is_verified,
        phone_is_verified: decodedToken.phone_is_verified,
        phone: decodedToken.phone,
      }

      dispatch(
        loginSuccess({
          user,
          accessToken,
          refreshToken,
          
        }),
      )
    } catch (error) {
      dispatch(logout())
    }
  }

const selectAccessToken = (state: { auth: AuthState }) => state.auth.accessToken

export const selectDecodedUserFromToken = createSelector(
  [selectAccessToken],
  (token) => {
    if (!token) return null

    try {
      return jwt_decode(token) as User
    } catch {
      return null
    }
  },
)

export const selectUserData = createSelector(
  (state: RootState) => state.auth.user,
  (user) => (user ? { ...user, user_id: user.user_id, employee_id: user.employee_id } : null),
)

export const selectUserRole = (state: { auth: AuthState }) =>
  state.auth.user?.role || "guest"

export const userOwner = (state: { auth: AuthState }) =>
  state.auth.user?.is_owner

export const userDataType = (state: { auth: AuthState }) => state.auth.user

export const userEmployee = (state: { auth: AuthState }) =>
  state.auth.user?.is_employee

export const exportedUserData = (state: { auth: AuthState }) => state.auth.user

export const selectUserStatus = createSelector(
  (state: RootState) => state.auth.user,
  (state: RootState) => userEmployee(state),
  (state: RootState) => userOwner(state),
  (state: RootState) => selectEmployeeVerified(state),
  (user, isEmployee, isOwner, isVerified) => {
    if (isEmployee && isVerified) {
      return "is_employee"
    } else if (isOwner) {
      return "is_owner"
    } else if (isEmployee && !isVerified) {
      return "unverified_employee"
    }
    return null
  },
)

export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.accessToken !== null

export const selectAuthLoading = (state: { auth: AuthState }) =>
  state.auth.isLoading

export const selectAuthError = (state: { auth: AuthState }) => state.auth.error

// 🔥 NEW: Selectors for login status
export const selectLoginStatus = (state: { auth: AuthState }) =>
  state.auth.loginStatus

export const selectLoginError = (state: { auth: AuthState }) =>
  state.auth.loginError

export const selectIsLoginLoading = (state: { auth: AuthState }) =>
  state.auth.loginStatus === "loading"

export const selectIsLoginSuccess = (state: { auth: AuthState }) =>
  state.auth.loginStatus === "success"

export const selectIsLoginFailure = (state: { auth: AuthState }) =>
  state.auth.loginStatus === "failure"


// ✅ ADD THESE selectors
export const selectEmailIsVerified = (state: { auth: AuthState }) =>
  state.auth.emailIsVerified

export const selectPhoneIsVerified = (state: { auth: AuthState }) =>
  state.auth.phoneIsVerified


export const selectUserEmail = (state: { auth: AuthState }) => state.auth.email

export const selectUserPhone = (state: { auth: AuthState }) => state.auth.phone
export default authSlice.reducer
