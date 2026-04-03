// @ts-nocheck
import React, { useEffect, useState } from "react"
import { useMediaQuery, useTheme } from "@mui/material"
import { useAppSelector } from "../../app/hooks"
import { Alert, Snackbar, Skeleton } from "@mui/material"
import Navbar from "../../components/ui/mobile/admin/Navbar"
import AdminsFooter from "../../components/AdminsFooter"
import api from "../../../utils/api"
import RealTimeIndicator from "../../components/sales/RealTimeIndicator"

const CompanyVerify = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const { businessId } = useAppSelector((state) => state.planStatus)

  // Company data
  const [loading, setLoading] = useState(false)
  const [companyEmail, setCompanyEmail] = useState("")
  const [companyPhone, setCompanyPhone] = useState("")
  const [emailVerified, setEmailVerified] = useState(false)
  const [phoneVerified, setPhoneVerified] = useState(false)

  // Verification states
  const [emailCodeSent, setEmailCodeSent] = useState(false)
  const [phoneCodeSent, setPhoneCodeSent] = useState(false)
  const [emailCode, setEmailCode] = useState("")
  const [phoneCode, setPhoneCode] = useState("")
  const [emailSending, setEmailSending] = useState(false)
  const [phoneSending, setPhoneSending] = useState(false)
  const [emailVerifying, setEmailVerifying] = useState(false)
  const [phoneVerifying, setPhoneVerifying] = useState(false)
   // Advanced Features
    const [batchMode, setBatchMode] = useState(false)
    const [selectedBatchItems, setSelectedBatchItems] = useState([])
    const [lastUpdated, setLastUpdated] = useState(null)
    const [autoRefresh, setAutoRefresh] = useState(false)
    const [realTimeEnabled, setRealTimeEnabled] = useState(false)
    const [dataVersion, setDataVersion] = useState(0)
  

  // Snackbar feedback
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  // Fetch company details on mount
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      if (!businessId) return
      setLoading(true)
      try {
        const response = await api.get(`/companies/${businessId}/`)
        const data = response.data
        setCompanyEmail(data.email || "")
        setCompanyPhone(data.phone || "")
        setEmailVerified(data.email_verified || false)
        setPhoneVerified(data.phone_verified || false)
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
        setLoading(false)
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
      await api.post(`/companies/${businessId}/send-email-verification/`)
      setEmailCodeSent(true)
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
      await api.post(`/companies/${businessId}/verify-email/`, {
        code: emailCode,
      })
      setEmailVerified(true)
      setEmailCodeSent(false)
      setEmailCode("")
      setSnackbar({
        open: true,
        message: "Email verified successfully",
        severity: "success",
      })
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
      await api.post(`/companies/${businessId}/send-phone-verification/`)
      setPhoneCodeSent(true)
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
      await api.post(`/companies/${businessId}/verify-phone/`, {
        code: phoneCode,
      })
      setPhoneVerified(true)
      setPhoneCodeSent(false)
      setPhoneCode("")
      setSnackbar({
        open: true,
        message: "Phone verified successfully",
        severity: "success",
      })
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
            headerText={"Verify your company contact details"}
          />
          {/* Real-time Indicator */}
                      <div className="prevent-overflow">
                        <RealTimeIndicator
                          enabled={autoRefresh}
                          lastUpdated={lastUpdated}
                          dataVersion={dataVersion}
                          onToggle={() => setAutoRefresh(!autoRefresh)}
                        />
                      </div>

          <main className="flex-grow p-4 pb-24">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="mr-2">✅</span>
                Email & Phone Verification
              </h2>

              {loading ? (
                <div className="space-y-4">
                  <Skeleton
                    variant="rectangular"
                    height={150}
                    className="rounded-lg"
                  />
                  <Skeleton
                    variant="rectangular"
                    height={150}
                    className="rounded-lg"
                  />
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Email verification card */}
                  <div className="border-2 border-gray-200 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg flex items-center">
                        <span className="mr-2">📧</span> Email
                      </h3>
                      {emailVerified ? (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                          Verified
                        </span>
                      ) : (
                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
                          Not Verified
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      {companyEmail || "No email set"}
                    </p>

                    {!emailVerified && (
                      <div className="space-y-3">
                        {!emailCodeSent ? (
                          <button
                            onClick={handleSendEmailCode}
                            disabled={emailSending || !companyEmail}
                            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition"
                          >
                            {emailSending
                              ? "Sending..."
                              : "Send Verification Code"}
                          </button>
                        ) : (
                          <>
                            <input
                              type="text"
                              value={emailCode}
                              onChange={(e) => setEmailCode(e.target.value)}
                              placeholder="Enter 6-digit code"
                              className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={handleVerifyEmail}
                                disabled={emailVerifying}
                                className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition"
                              >
                                {emailVerifying ? "Verifying..." : "Verify"}
                              </button>
                              <button
                                onClick={() => setEmailCodeSent(false)}
                                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition"
                              >
                                Cancel
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Phone verification card */}
                  <div className="border-2 border-gray-200 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg flex items-center">
                        <span className="mr-2">📞</span> Phone
                      </h3>
                      {phoneVerified ? (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                          Verified
                        </span>
                      ) : (
                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
                          Not Verified
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      {companyPhone || "No phone set"}
                    </p>

                    {!phoneVerified && (
                      <div className="space-y-3">
                        {!phoneCodeSent ? (
                          <button
                            onClick={handleSendPhoneCode}
                            disabled={phoneSending || !companyPhone}
                            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition"
                          >
                            {phoneSending
                              ? "Sending..."
                              : "Send Verification Code"}
                          </button>
                        ) : (
                          <>
                            <input
                              type="text"
                              value={phoneCode}
                              onChange={(e) => setPhoneCode(e.target.value)}
                              placeholder="Enter 6-digit code"
                              className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={handleVerifyPhone}
                                disabled={phoneVerifying}
                                className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition"
                              >
                                {phoneVerifying ? "Verifying..." : "Verify"}
                              </button>
                              <button
                                onClick={() => setPhoneCodeSent(false)}
                                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition"
                              >
                                Cancel
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
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

export default CompanyVerify
