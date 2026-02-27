// @ts-nocheck
import React, { useEffect, useState, useRef } from "react"
import { useMediaQuery, useTheme } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { Alert, Snackbar, Skeleton } from "@mui/material"
import Navbar from "../../components/ui/mobile/admin/Navbar"
import AdminsFooter from "../../components/AdminsFooter"
import api from "../../../utils/api"
import {
  CameraAlt,
  Business,
  LocationOn,
  Email,
  Phone,
  Upload,
} from "@mui/icons-material"

const CompanyDetails = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const { businessId } = useAppSelector((state) => state.planStatus)

  const fileInputRef = useRef(null)

  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  // Form fields
  const [companyName, setCompanyName] = useState("")
  const [logo, setLogo] = useState("") // URL from server
  const [location, setLocation] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")

  // File upload state
  const [logoFile, setLogoFile] = useState(null)
  const [logoPreview, setLogoPreview] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0)

  // Fetch company details on mount
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      if (!businessId) return
      setLoading(true)
      setError(null)
      try {
        const response = await api.get(`/companies/${businessId}/`)
        const data = response.data
        setCompanyName(data.name || "")
        setLogo(data.logo || "")
        setLocation(data.location || "")
        setEmail(data.email || "")
        setPhone(data.phone || "")
        setLogoPreview(data.logo || "") // show existing logo as preview
      } catch (err) {
        console.error("Failed to fetch company details:", err)
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load company details",
        )
      } finally {
        setLoading(false)
      }
    }

    fetchCompanyDetails()
  }, [businessId])

  // Handle file selection
  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type and size (optional)
    if (!file.type.startsWith("image/")) {
      setSnackbar({
        open: true,
        message: "Please select an image file",
        severity: "warning",
      })
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      // 2MB limit
      setSnackbar({
        open: true,
        message: "Image size must be less than 2MB",
        severity: "warning",
      })
      return
    }

    setLogoFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setLogoPreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  // Clear selected logo
  const handleClearLogo = () => {
    setLogoFile(null)
    setLogoPreview(logo || "") // revert to existing logo URL
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  // Trigger file input click
  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // if (!businessId) return
    setSubmitting(true)
    setSnackbar({ ...snackbar, open: false })
    setUploadProgress(0)

    try {
      let response
      if (logoFile) {
        // If a new file is selected, send multipart/form-data
        const formData = new FormData()
        formData.append("name", companyName)
        formData.append("location", location)
        formData.append("email", email)
        formData.append("phone", phone)
        formData.append("logo", logoFile) // field name expected by backend

        response = await api.post(`/company/create/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            )
            setUploadProgress(percent)
          },
        })
      } else {
        // Otherwise send JSON (if logo is unchanged)
        const payload = {
          name: companyName,
          logo, // keep existing logo URL
          location,
          email,
          phone,
        }
        response = await api.post(`/company/create/`, payload)
      }

      // Update local state with new data
      const updated = response.data
      setCompanyName(updated.name || "")
      setLogo(updated.logo || "")
      setLocation(updated.location || "")
      setEmail(updated.email || "")
      setPhone(updated.phone || "")
      setLogoPreview(updated.logo || "")
      setLogoFile(null) // clear file selection

      setSnackbar({
        open: true,
        message: "Company details updated successfully",
        severity: "success",
      })
    } catch (err) {
      console.error("Failed to update company details:", err)
      setSnackbar({
        open: true,
        message: err.response?.data?.message || err.message || "Update failed",
        severity: "error",
      })
    } finally {
      setSubmitting(false)
      setUploadProgress(0)
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
            headerMessage={"Company Settings"}
            headerText={"Manage your company information"}
          />

          <main className="flex-grow p-4 pb-24">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Business className="mr-2 text-blue-600" />
                Company Details
              </h2>

              {loading ? (
                <div className="space-y-4">
                  <Skeleton
                    variant="circular"
                    width={80}
                    height={80}
                    className="mx-auto"
                  />
                  <Skeleton variant="text" height={40} />
                  <Skeleton variant="text" height={40} />
                  <Skeleton variant="text" height={40} />
                  <Skeleton variant="text" height={40} />
                </div>
              ) : error ? (
                <div className="text-center py-8 bg-red-50 rounded-lg">
                  <p className="text-red-500 font-medium">{error}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Logo upload area */}
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <div className="w-28 h-28 rounded-full border-4 border-blue-200 overflow-hidden bg-gray-100 shadow-md">
                        {logoPreview ? (
                          <img
                            src={logoPreview}
                            alt="Company Logo"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Business style={{ fontSize: 48 }} />
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={handleUploadClick}
                        className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition"
                      >
                        <CameraAlt fontSize="small" />
                      </button>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                    {logoFile && (
                      <div className="flex items-center mt-2 space-x-2">
                        <span className="text-xs text-gray-500">
                          {logoFile.name}
                        </span>
                        <button
                          type="button"
                          onClick={handleClearLogo}
                          className="text-red-500 text-xs hover:underline"
                        >
                          Clear
                        </button>
                      </div>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      Click camera icon to upload (max 2MB)
                    </p>
                  </div>

                  {/* Company Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center">
                      <Business
                        className="mr-1 text-blue-500"
                        fontSize="small"
                      />
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                      placeholder="e.g. ABC Gas Ltd."
                      required
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center">
                      <LocationOn
                        className="mr-1 text-red-500"
                        fontSize="small"
                      />
                      Location / Address
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                      placeholder="123 Main St, City"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center">
                      <Email className="mr-1 text-green-500" fontSize="small" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                      placeholder="info@company.com"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center">
                      <Phone
                        className="mr-1 text-purple-500"
                        fontSize="small"
                      />
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                      placeholder="+1234567890"
                    />
                  </div>

                  {/* Upload progress (if file selected) */}
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {submitting ? (
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
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </form>
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

export default CompanyDetails
