// @ts-nocheck
import React, { useEffect, useState, useRef } from "react"
import { useMediaQuery, useTheme } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { Alert, Snackbar, Skeleton } from "@mui/material"
import Navbar from "../../components/ui/mobile/admin/Navbar"
import AdminsFooter from "../../components/AdminsFooter"
import api from "../../../utils/api"
import {
    refreshAccessToken,
  selectEmailIsVerified,
  selectPhoneIsVerified,
  selectUserEmail,
  selectUserPhone,
} from "../../features/auths/authSlice"
import { Email, Phone, Verified, AccessTime } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"

const ProfileVerify = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const { businessId } = useAppSelector((state) => state.planStatus)

  
  const emailIsVerified = useAppSelector(selectEmailIsVerified)
  const phoneIsVerified = useAppSelector(selectPhoneIsVerified)
  const userEmail = useAppSelector(selectUserEmail)
  const userPhone = useAppSelector(selectUserPhone)

  // Company data (override with user data from auth slice)
  const [companyEmail, setCompanyEmail] = useState(userEmail || "")
  const [companyPhone, setCompanyPhone] = useState(userPhone || "")
  const [emailVerified, setEmailVerified] = useState(emailIsVerified || false)
  const [phoneVerified, setPhoneVerified] = useState(phoneIsVerified || false)

  // Verification states
  const [emailCodeSent, setEmailCodeSent] = useState(false)
  const [phoneCodeSent, setPhoneCodeSent] = useState(false)
  const [emailCode, setEmailCode] = useState("")
  const [phoneCode, setPhoneCode] = useState("")
  const [emailSending, setEmailSending] = useState(false)
  const [phoneSending, setPhoneSending] = useState(false)
  const [emailVerifying, setEmailVerifying] = useState(false)
  const [phoneVerifying, setPhoneVerifying] = useState(false)

  // Timer states (60 seconds)
  const [emailTimer, setEmailTimer] = useState(0)
  const [phoneTimer, setPhoneTimer] = useState(0)
  const emailTimerRef = useRef(null)
  const phoneTimerRef = useRef(null)

  // Snackbar feedback
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (emailTimerRef.current) clearInterval(emailTimerRef.current)
      if (phoneTimerRef.current) clearInterval(phoneTimerRef.current)
    }
  }, [])

  // Start email countdown
  const startEmailTimer = () => {
    setEmailTimer(60)
    if (emailTimerRef.current) clearInterval(emailTimerRef.current)
    emailTimerRef.current = setInterval(() => {
      setEmailTimer((prev) => {
        if (prev <= 1) {
          clearInterval(emailTimerRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // Start phone countdown
  const startPhoneTimer = () => {
    setPhoneTimer(60)
    if (phoneTimerRef.current) clearInterval(phoneTimerRef.current)
    phoneTimerRef.current = setInterval(() => {
      setPhoneTimer((prev) => {
        if (prev <= 1) {
          clearInterval(phoneTimerRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // Fetch company details on mount (optional – you may not need if already in auth slice)
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      if (!businessId) return
      // setLoading(true) – if you have loading state
      try {
        const response = await api.get(`/companies/${businessId}/`)
        const data = response.data
        setCompanyEmail(data.email || companyEmail)
        setCompanyPhone(data.phone || companyPhone)
        setEmailVerified(data.email_verified || emailVerified)
        setPhoneVerified(data.phone_verified || phoneVerified)
      } catch (err) {
        console.error("Failed to fetch company details:", err)
        setSnackbar({
          open: true,
          message:
            err.response?.data?.message ||
            err.message ||
            "Failed to load company details",
          severity: "error",
        })
      } finally {
        // setLoading(false)
      }
    }

    fetchCompanyDetails()
  }, [businessId])

  // Send email verification code
  const handleSendEmailCode = async () => {
    if (!companyEmail) {
      setSnackbar({
        open: true,
        message: "No email address set",
        severity: "warning",
      })
      return
    }
    setEmailSending(true)
    try {
      await api.post(`auth/verify-email/send/`, { email: companyEmail })
      setEmailCodeSent(true)
      startEmailTimer()
      setSnackbar({
        open: true,
        message: "Verification code sent to email",
        severity: "success",
      })
    } catch (err) {
      setSnackbar({
        open: true,
        message:
          err.response?.data?.message || err.message || "Failed to send code",
        severity: "error",
      })
    } finally {
      setEmailSending(false)
    }
  }

  // Verify email code
  const handleVerifyEmail = async () => {
    if (!emailCode.trim()) {
      setSnackbar({
        open: true,
        message: "Please enter the verification code",
        severity: "warning",
      })
      return
    }
    setEmailVerifying(true)
    try {
      await api.post(`auth/verify-email/`, { token: emailCode })
      setEmailVerified(true)
      setEmailCodeSent(false)
      setEmailCode("")
      if (emailTimerRef.current) clearInterval(emailTimerRef.current)
      setEmailTimer(0)
      setSnackbar({
        open: true,
        message: "Email verified successfully",
        severity: "success",
      })
      await dispatch(refreshAccessToken())
    } catch (err) {
      setSnackbar({
        open: true,
        message:
          err.response?.data?.message || err.message || "Verification failed",
        severity: "error",
      })
    } finally {
      setEmailVerifying(false)
    }
  }

  // Send phone verification code
  const handleSendPhoneCode = async () => {
    if (!companyPhone) {
      setSnackbar({
        open: true,
        message: "No phone number set",
        severity: "warning",
      })
      return
    }
    setPhoneSending(true)
    try {
      await api.post(`auth/verify-sms/send/`, { phone: companyPhone }) // include phone if needed
      setPhoneCodeSent(true)
      startPhoneTimer()
      setSnackbar({
        open: true,
        message: "Verification code sent to phone",
        severity: "success",
      })
    } catch (err) {
      setSnackbar({
        open: true,
        message:
          err.response?.data?.message || err.message || "Failed to send code",
        severity: "error",
      })
    } finally {
      setPhoneSending(false)
    }
  }

  // Verify phone code
  const handleVerifyPhone = async () => {
    if (!phoneCode.trim()) {
      setSnackbar({
        open: true,
        message: "Please enter the verification code",
        severity: "warning",
      })
      return
    }
    setPhoneVerifying(true)
    try {
      await api.post(`auth/verify-sms/`, { token: phoneCode })
      setPhoneVerified(true)
      setPhoneCodeSent(false)
      setPhoneCode("")
      if (phoneTimerRef.current) clearInterval(phoneTimerRef.current)
      setPhoneTimer(0)
      setSnackbar({
        open: true,
        message: "Phone verified successfully",
        severity: "success",
      })
      await dispatch(refreshAccessToken())
    } catch (err) {
      setSnackbar({
        open: true,
        message:
          err.response?.data?.message || err.message || "Verification failed",
        severity: "error",
      })
    } finally {
      setPhoneVerifying(false)
    }
  }

  // Format phone number for display (partial mask)
  const formatPhone = (phone) => {
    if (!phone) return ""
    if (phone.length > 8) {
      return phone.slice(0, 4) + "****" + phone.slice(-4)
    }
    return phone
  }

  return (
    <div>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {isMobile ? (
        <div className="min-h-screen bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-gray-800 flex flex-col font-sans">
          <Navbar
            headerMessage={"Verification"}
            headerText={"Verify your contact details"}
          />

          <main className="flex-grow p-4 pb-24">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Verified className="mr-2 text-green-600" />
                Email & Phone Verification
              </h2>

              <div className="space-y-6">
                {/* Email verification card */}
                <div
                  className={`border-2 rounded-xl p-5 transition-all ${
                    emailVerified
                      ? "border-green-200 bg-green-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg flex items-center">
                      <Email className="mr-2 text-blue-500" fontSize="small" />
                      Email
                    </h3>
                    {emailVerified ? (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                        <Verified fontSize="inherit" className="mr-1" />
                        Verified
                      </span>
                    ) : (
                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
                        Not Verified
                      </span>
                    )}
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg mb-4">
                    <p className="text-sm font-medium text-gray-700">
                      {companyEmail || "No email set"}
                    </p>
                  </div>

                  {!emailVerified && (
                    <div className="space-y-3">
                      {!emailCodeSent ? (
                        <button
                          onClick={handleSendEmailCode}
                          disabled={emailSending || !companyEmail}
                          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition flex items-center justify-center"
                        >
                          {emailSending ? (
                            <>
                              <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Sending...
                            </>
                          ) : (
                            "Send Verification Code"
                          )}
                        </button>
                      ) : (
                        <>
                          <div className="relative">
                            <input
                              type="text"
                              value={emailCode}
                              onChange={(e) => setEmailCode(e.target.value)}
                              placeholder="Enter 6-digit code"
                              maxLength={6}
                              className="w-full border-2 border-gray-300 rounded-lg p-3 pl-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-center tracking-widest text-lg"
                              autoFocus
                            />
                            <AccessTime
                              className="absolute left-3 top-3 text-gray-400"
                              fontSize="small"
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <button
                              onClick={handleSendEmailCode}
                              disabled={emailSending || emailTimer > 0}
                              className="text-sm text-blue-600 hover:underline disabled:text-gray-400 disabled:no-underline"
                            >
                              {emailTimer > 0
                                ? `Resend in ${emailTimer}s`
                                : "Resend code"}
                            </button>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setEmailCodeSent(false)}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={handleVerifyEmail}
                                disabled={
                                  emailVerifying || emailCode.length < 6
                                }
                                className="px-6 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-medium rounded-lg transition"
                              >
                                {emailVerifying ? "Verifying..." : "Verify"}
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Phone verification card */}
                <div
                  className={`border-2 rounded-xl p-5 transition-all ${
                    phoneVerified
                      ? "border-green-200 bg-green-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg flex items-center">
                      <Phone
                        className="mr-2 text-purple-500"
                        fontSize="small"
                      />
                      Phone
                    </h3>
                    {phoneVerified ? (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                        <Verified fontSize="inherit" className="mr-1" />
                        Verified
                      </span>
                    ) : (
                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
                        Not Verified
                      </span>
                    )}
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg mb-4">
                    <p className="text-sm font-medium text-gray-700">
                      {companyPhone
                        ? formatPhone(companyPhone)
                        : "No phone set"}
                    </p>
                  </div>

                  {!phoneVerified && (
                    <div className="space-y-3">
                      {!phoneCodeSent ? (
                        <button
                          onClick={handleSendPhoneCode}
                          disabled={phoneSending || !companyPhone}
                          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition flex items-center justify-center"
                        >
                          {phoneSending ? (
                            <>
                              <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Sending...
                            </>
                          ) : (
                            "Send Verification Code"
                          )}
                        </button>
                      ) : (
                        <>
                          <div className="relative">
                            <input
                              type="text"
                              value={phoneCode}
                              onChange={(e) => setPhoneCode(e.target.value)}
                              placeholder="Enter 6-digit code"
                              maxLength={6}
                              className="w-full border-2 border-gray-300 rounded-lg p-3 pl-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-center tracking-widest text-lg"
                              autoFocus
                            />
                            <AccessTime
                              className="absolute left-3 top-3 text-gray-400"
                              fontSize="small"
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <button
                              onClick={handleSendPhoneCode}
                              disabled={phoneSending || phoneTimer > 0}
                              className="text-sm text-blue-600 hover:underline disabled:text-gray-400 disabled:no-underline"
                            >
                              {phoneTimer > 0
                                ? `Resend in ${phoneTimer}s`
                                : "Resend code"}
                            </button>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setPhoneCodeSent(false)}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={handleVerifyPhone}
                                disabled={
                                  phoneVerifying || phoneCode.length < 6
                                }
                                className="px-6 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-medium rounded-lg transition"
                              >
                                {phoneVerifying ? "Verifying..." : "Verify"}
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>

          <footer className="fixed bottom-0 left-0 right-0">
            <AdminsFooter />
          </footer>
        </div>
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 text-center">
            <p className="text-6xl mb-4">💻</p>
            <p className="text-2xl font-bold text-gray-800 mb-2">
              Desktop View Coming Soon
            </p>
            <p className="text-gray-600">
              Please use a mobile device or resize your browser window
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileVerify
