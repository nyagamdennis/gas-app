// @ts-nocheck
import React, { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { ClipLoader } from "react-spinners"
import MailOutlineIcon from "@mui/icons-material/MailOutline"
import LocalPhoneIcon from "@mui/icons-material/LocalPhone"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import Alert from "@mui/material/Alert"
import api from "../../utils/api"


const RegisterPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const refData = searchParams.get("ref")
  let businessInfo = null

  try {
    businessInfo = JSON.parse(atob(decodeURIComponent(refData)))
  } catch (err) {
    console.warn("Invalid referral data", err)
  }


  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setLoading] = useState(false)
  const [successful, setSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [countdown, setCountdown] = useState(3)
  const [passVisibility, setPasswordVisibility] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      setLoading(false)
      return
    }

    const formData = new FormData()
    formData.append("email", email)
    formData.append("password", password)
    formData.append("phone_number", phone)

    if (businessInfo !== null){
      formData.append('businessId', businessInfo.id)
    }

    try {
      await api.post("/users/register/", formData)
      // await axios.post(`${apiUrl}/users/register/`, formData)

      setSuccess(true)
      setSuccessMessage("Registration successful! Redirecting to login...")

      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            navigate("/login", {
              state: { successMessage: "Registration successful. Please log in." },
            })
          }
          return prev - 1
        })
      }, 1000)
    } catch (error: any) {
      console.error("Registration error:", error)
      setError(
        error.response?.data?.error || "An error occurred during registration."
      )
    } finally {
      setLoading(false)
    }
  }


  return (
    <section className="h-screen flex items-center justify-center bg-gradient-to-br from-green-200 via-white to-green-100">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-[95%] sm:w-[400px] space-y-4">
        <h1 className="text-2xl font-bold text-center text-gray-800">Register</h1>
        {businessInfo && (
          <p className="text-center text-sm text-gray-600 mb-2">
            You're registering under <strong>{businessInfo.name}</strong>
          </p>
        )}

        {error && <Alert severity="error">{error}</Alert>}
        {successful && (
          <Alert severity="success">
            {successMessage} (Redirecting in {countdown}s)
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Email */}
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full border px-3 py-2 rounded-md shadow-sm pr-10"
              required
            />
            <MailOutlineIcon className="absolute right-3 top-2.5 text-gray-400" />
          </div>

          {/* Phone */}
          <div className="relative">
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone"
              className="w-full border px-3 py-2 rounded-md shadow-sm pr-10"
              required
            />
            <LocalPhoneIcon className="absolute right-3 top-2.5 text-gray-400" />
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={passVisibility ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full border px-3 py-2 rounded-md shadow-sm pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setPasswordVisibility(!passVisibility)}
              className="absolute right-3 top-2.5 text-gray-400"
            >
              {passVisibility ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={passVisibility ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="w-full border px-3 py-2 rounded-md shadow-sm pr-10"
              required
            />
          </div>

          {/* Terms */}
          <div className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4 text-green-600"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              required
            />
            <span className="text-gray-600">
              I agree to the{" "}
              <Link to="#" className="text-green-500 underline">
                Terms
              </Link>{" "}
              &{" "}
              <Link to="#" className="text-green-500 underline">
                Privacy Policy
              </Link>
            </span>
          </div>

          <button
            type="submit"
            disabled={!email || !phone || !password || !confirmPassword || !termsAccepted || isLoading}
            className="w-full bg-green-600 text-white py-2 rounded-md shadow hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? <ClipLoader size={20} color="#fff" /> : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-2">
          Already have an account?{" "}
          <Link to="/login" className="text-green-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </section>
  )
}

export default RegisterPage
