// @ts-nocheck
import React, { useEffect, useRef, useState } from "react"
import SendIcon from "@mui/icons-material/Send"
import CircularProgress from "@mui/material/CircularProgress"
import Box from "@mui/material/Box"

import { useAppDispatch, useAppSelector } from "../app/hooks"
import {
  fetchLocations,
  selectAllLocations,
} from "../features/location/locationSlice"
import AdminsFooter from "../components/AdminsFooter"
import api from "../../utils/api"

const AdminSms = () => {
  const messageTextareaRef = useRef<HTMLTextAreaElement | null>(null)

  const locations = useAppSelector(selectAllLocations)
  const dispatch = useAppDispatch()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [showError, setShowError] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")

  useEffect(() => {
    dispatch(fetchLocations())
  }, [dispatch])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = {
        selected_group: selectedGroup,
        selected_location: selectedLocation,
        message: messageTextareaRef.current?.value,
      }

     
      const response = await api.post("/sendbulksms/", formData)

      if (response.status === 201) {
        if (messageTextareaRef.current) messageTextareaRef.current.value = ""
        setShowAlert(true)
        setTimeout(() => setShowAlert(false), 5000)
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        setShowError(true)
        setTimeout(() => setShowError(false), 5000)
      } else {
        console.error("SMS send failed:", error)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800 font-sans">
      <main className="flex-grow px-4 pt-6 pb-20">
        <div className="max-w-xl mx-auto bg-white shadow-md rounded-xl p-6">
          <h2 className="text-2xl font-bold text-center mb-4 text-blue-700">
            Send Bulk SMS
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Group Selector */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                Select Recipient Group:
              </label>
              <select
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => setSelectedGroup(e.target.value)}
              >
                <option value="">-- Choose Group --</option>
                <option value="all">All Groups</option>
                <option value="wholesale">Wholesale Customers</option>
                <option value="retail">Retail Customers</option>
                <option value="debtors">Debtors</option>
                <option value="employees">Employees</option>
              </select>
            </div>

            {/* Location Selector */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                Select Customer Location:
              </label>
              <select
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) =>
                  setSelectedLocation(e.target.value || "all")
                }
              >
                <option value="">-- All Locations --</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Message Input */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                Message:
              </label>
              <textarea
                ref={messageTextareaRef}
                required
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-lg text-black focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg flex items-center gap-2 transition"
              >
                {isSubmitting ? (
                  <Box sx={{ display: "flex" }}>
                    <CircularProgress size={20} className="text-white" />
                  </Box>
                ) : (
                  <>
                    Send <SendIcon fontSize="small" />
                  </>
                )}
              </button>
            </div>

            {/* Alerts */}
            {showAlert && (
              <div className="text-green-600 text-sm text-center">
                Message sent successfully!
              </div>
            )}
            {showError && (
              <div className="text-red-600 text-sm text-center">
                Unauthorized. Please log in again.
              </div>
            )}
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto">
        <AdminsFooter />
      </footer>
    </div>
  )
}

export default AdminSms
