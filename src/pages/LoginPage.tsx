// @ts-nocheck
import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ClipLoader } from "react-spinners"
import {
  login,
  selectAuthError,
  selectAuthLoading,
  selectDecodedUserFromToken,
  selectIsAuthenticated,
  userEmployee,
  userOwner,
} from "../features/auths/authSlice"
import { useAppSelector } from "../app/hooks"
import { useDispatch } from "react-redux"
import { IoPerson } from "react-icons/io5"
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md"
import Alert from "@mui/material/Alert"
import getApiUrl from "../getApiUrl"

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errMsg, setErrMsg] = useState("")
  const [passVisibility, setPasswordVisibility] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const apiUrl = getApiUrl()

  const isLoading = useAppSelector(selectAuthLoading)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const userIsOwner = useAppSelector(userOwner)
  const userIsEmployee = useAppSelector(userEmployee)
  const userData = useAppSelector(selectDecodedUserFromToken)

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    try {
      await dispatch(login({ email, password }))
    } catch (error: any) {
      setErrMsg(error?.response?.data?.detail || "Login failed. Please try again.")
    }
  }

  
  useEffect(() => {
    if (isAuthenticated) {
      if (userIsOwner) {
        navigate(userData?.business === null ? "/settings" : "/admins", { replace: true })
      } else if (userIsEmployee) {
        navigate("/myprofile", { replace: true })
      }
    }
  }, [isAuthenticated, userIsOwner, userIsEmployee])

  return (
    <section className="h-screen flex items-center justify-center bg-gradient-to-br from-green-200 via-white to-green-100">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-[95%] sm:w-[400px] space-y-5">
        <h1 className="text-3xl font-bold text-center text-gray-800">Login</h1>

        {errMsg && <Alert severity="error">{errMsg}</Alert>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email/Phone Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Email or Phone"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-3 py-2 rounded-md shadow-sm pr-10"
              required
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
              className="w-full border px-3 py-2 rounded-md shadow-sm pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setPasswordVisibility(!passVisibility)}
              className="absolute right-3 top-2.5 text-gray-400"
            >
              {passVisibility ? <MdOutlineVisibility /> : <MdOutlineVisibilityOff />}
            </button>
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end text-sm">
            <Link to="/forgot-password" className="text-green-500 hover:underline">
              Forgot Password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!email || !password || isLoading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md shadow disabled:opacity-50"
          >
            {isLoading ? <ClipLoader size={20} color="#fff" /> : "Login"}
          </button>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link to="/register" className="text-green-500 hover:underline font-medium">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </section>
  )
}

export default LoginPage
