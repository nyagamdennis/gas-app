// @ts-nocheck
import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ClipLoader } from "react-spinners"
import {
  login,
  selectLoginStatus,
  selectLoginError,
  selectIsLoginLoading,
  resetLoginStatus,
} from "../features/auths/authSlice"
import { useAppSelector, useAppDispatch } from "../app/hooks"
import { IoPerson } from "react-icons/io5"
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md"
import Alert from "@mui/material/Alert"
import { setSubscriptionFromLogin } from "../features/plans/planStatusSlice"

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passVisibility, setPasswordVisibility] = useState(false)

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  // 🔥 Use selectors
  const loginStatus = useAppSelector(selectLoginStatus)
  const loginError = useAppSelector(selectLoginError)
  const isLoading = useAppSelector(selectIsLoginLoading)

  const email_or_phone = email

  // 🔥 Define role arrays
  const adminRoles = ["SUPER_ADMIN", "COMPANY_ADMIN"]
  const employeeRoles = [
    "SHOP_ATTENDANT",
    "DELIVERY_GUY",
    "STORE_MAN",
    "SECURITY",
    "TRUCK_DRIVER",
    "CONDUCTOR",
    "SALES_PERSON",
  ]

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    // 🔥 Reset any previous status
    dispatch(resetLoginStatus())

    // 🔥 Dispatch login and wait for result
    const result = await dispatch(login({ email_or_phone, password }))

    // 🔥 Handle successful login
    if (result.success && result.user) {
      const userRole = result.user.role
      const loginData = result.data

      console.log("row data ", result)
      console.log("Login successful, user role:", userRole)
      // console.log("Login data company_id:", loginData.company_id)

      // 🔥 Store subscription data for admins
      if (adminRoles.includes(userRole)) {
        if (loginData.company_id || loginData.subscription) {
          try {
            await dispatch(
              setSubscriptionFromLogin(
                loginData
                // {
                // company_id: loginData.company_id,
                // subscription: loginData.subscription,
              // }
            ),
            )
            console.log("Subscription data stored successfully")
          } catch (error) {
            console.error("Failed to store subscription data:", error)
          }
        }
      }

      // 🔥 Redirect based on role
      if (adminRoles.includes(userRole)) {
        console.log("Redirecting admin to /admins")
        navigate("/admins", { replace: true })
      } else if (employeeRoles.includes(userRole)) {
        console.log("Redirecting employee to /sales")
        navigate("/sales", { replace: true })
      } else {
        console.log("Unknown role, redirecting to /unverified")
        navigate("/unverified", { replace: true })
      }
    } else if (!result.success) {
      // Login failed, error will be shown from Redux state
      console.error("Login failed:", result.error || loginError)
    }
  }

  // 🔥 Auto-reset error message after 5 seconds
  useEffect(() => {
    if (loginStatus === "failure") {
      const timer = setTimeout(() => {
        dispatch(resetLoginStatus())
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [loginStatus, dispatch])

  return (
    <section className="h-screen flex items-center justify-center bg-gradient-to-br from-green-200 via-white to-green-100">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-[95%] sm:w-[400px] space-y-5">
        <h1 className="text-3xl font-bold text-center text-gray-800">Login</h1>

        {/* 🔥 Show error from Redux state */}
        {loginStatus === "failure" && loginError && (
          <Alert severity="error">{loginError}</Alert>
        )}

        {/* 🔥 Show success message briefly before redirect */}
        {loginStatus === "success" && (
          <Alert severity="success">Login successful! Redirecting...</Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email/Phone Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Email or Phone"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-3 py-2 rounded-md shadow-sm pr-10 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
              disabled={isLoading}
            />
            <IoPerson className="absolute right-3 top-2.5 text-gray-400" />
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              type={passVisibility ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded-md shadow-sm pr-10 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setPasswordVisibility(!passVisibility)}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              disabled={isLoading}
            >
              {passVisibility ? (
                <MdOutlineVisibility />
              ) : (
                <MdOutlineVisibilityOff />
              )}
            </button>
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end text-sm">
            <Link
              to="/forgot-password"
              className="text-green-500 hover:underline"
              tabIndex={isLoading ? -1 : 0}
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!email || !password || isLoading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md shadow disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <ClipLoader size={20} color="#fff" />
                <span>Logging in...</span>
              </span>
            ) : (
              "Login"
            )}
          </button>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-green-500 hover:underline font-medium"
              tabIndex={isLoading ? -1 : 0}
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </section>
  )
}

export default LoginPage
