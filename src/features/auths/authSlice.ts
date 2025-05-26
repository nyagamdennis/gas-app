/* eslint-disable prettier/prettier */
import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import jwt_decode from "jwt-decode"
import cookies from "cookies-js"
import api from "../../../utils/api"

interface User {
  email: string
  first_name: string
  last_name: string
  phone_number: number
  role: string
  is_owner: boolean
  is_employee: boolean
  business: []
  employee_id: string
}

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isLoading: boolean
  error: string | null
  isAuthenticated: boolean
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

if (userCookie && accessTokenCookie && accessRefreshCookie) {
  try {
    user = JSON.parse(userCookie)
    accessToken = accessTokenCookie
    refreshToken = accessRefreshCookie
  } catch (e) {
    console.log("l")
  }
}

const initialState: AuthState = {
  user,
  accessToken,
  refreshToken,
  isLoading: false,
  error: null,
  isAuthenticated: !!accessToken,
}


import { createSelector } from "@reduxjs/toolkit"
import { RootState } from "../../app/store" // adjust path as needed
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
      const decoded: any = jwt_decode(accessToken)
      const now = Date.now() / 1000

      // If token is about to expire in next 2 minutes
      if (decoded.exp - now < 120) {
        await dispatch(refreshAccessToken())
      } else {
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
      cookies.set("refreshToken", refreshToken, { expires: timers })
      cookies.set("user", JSON.stringify(user), { expires: timers })
      cookies.set("accessToken", accessToken, { expires: timers })
    },
    loginFailure: (state, action) => {
      state.isLoading = false
      state.error = action.payload
      console.log("Login failure ", action.payload)
    },
    logoutSuccess: (state) => {
      state.user = null
      state.accessToken = null
      state.isAuthenticated = false
      cookies.expire("user")
      cookies.expire("accessToken")
      cookies.expire("refreshToken")
    },
  },
})

export const { loginStart, loginFailure, loginSuccess, logoutSuccess } =
  authSlice.actions

export const login = (credentials: any) => async (dispatch: any) => {
  try {
    dispatch(loginStart())
    // const response = await axios.post(`${apiUrl}/users/token/`, credentials)
    const response = await api.post("users/token/", credentials)
    const accessToken = response.data.access
    const refreshToken = response.data.refresh
    const decodedToken: any = jwt_decode(accessToken)
    // const user = decodedToken;

    const user: User = {
      email: decodedToken.email,
      first_name: decodedToken.first_name,
      last_name: decodedToken.last_name,
      phone_number: decodedToken.phone_number,
      role: decodedToken.role, // Extract role
      is_owner: decodedToken.is_owner,
      is_employee: decodedToken.is_employee,
      business: decodedToken.business,
      employee_id: decodedToken.employee_id,
    }

    

    dispatch(loginSuccess({ user, accessToken, refreshToken }))

    
   

    const timer = 240
    const intervalId = setInterval(() => {
      dispatch(refreshAccessToken())
    }, timer * 1000)
    dispatch({ type: "SET_INTERVAL_ID", payload: intervalId })
    // new change=> return the response data here // return a promise so as it can be waited in the component
    return response.data
  } catch (error: any) {
    const message = error.response?.data?.detail || "An unknown error occurred."
    dispatch(loginFailure(message))
    throw error // re-throw the error
  }
}

export const logout = () => (dispatch: any) => {
  dispatch(logoutSuccess())
}

export const refreshAccessToken =
  () => async (dispatch: any, getState: any) => {
    try {
      const newrefreshToken = cookies.get("refreshToken")

      // const response = await axios.post(`${apiUrl}/users/token/refresh/`, {
      //   refresh: newrefreshToken,
      // })
      const response = await api.post("users/token/refresh/", {refresh: newrefreshToken})
      const accessToken = response.data.access
      const refreshToken = response.data.refresh
      const decodedToken = jwt_decode(accessToken)
      const user = decodedToken

      dispatch(loginSuccess({ user, accessToken, refreshToken }))
    } catch (error) {
      alert(error)
      dispatch(logout())
    }
  }

// export const selectDecodedUserFromToken = (state: { auth: AuthState }) => {
//   const token = state.auth.accessToken
//   if (!token) return null

//   try {
//     return jwt_decode(token) as User
//   } catch (error) {
//     return null
//   }
// }
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
  }
)

// Memoized selector for user data
export const selectUserData = createSelector(
  (state: RootState) => state.auth.user,
  (user) => (user ? { ...user, employee_id: user.employee_id } : null),
)

export const selectUserRole = (state: { auth: AuthState }) =>
  state.auth.user?.role || "guest"

export const userOwner = (state: { auth: AuthState }) =>
  state.auth.user?.is_owner
export const userEmployee = (state: { auth: AuthState }) =>
  state.auth.user?.is_employee

export const exportedUserData = (state: { auth: AuthState }) =>
  state.auth.user;

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
// Export the user data for external use


export default authSlice.reducer
