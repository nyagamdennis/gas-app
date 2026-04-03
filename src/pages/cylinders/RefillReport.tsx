// @ts-nocheck
import React, { useState, useEffect } from "react"
import { useMediaQuery, useTheme } from "@mui/material"
import AdminsFooter from "../../components/AdminsFooter"
import Navbar from "../../components/ui/mobile/admin/Navbar"
import api from "../../../utils/api"
import RealTimeIndicator from "../../components/sales/RealTimeIndicator"

const RefillReport = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const getTodayDateString = () => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  }

  const [selectedDate, setSelectedDate] = useState(getTodayDateString())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [refillData, setRefillData] = useState(null) // new state

  // Advanced Features
  const [batchMode, setBatchMode] = useState(false)
  const [selectedBatchItems, setSelectedBatchItems] = useState([])
  const [lastUpdated, setLastUpdated] = useState(null)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [realTimeEnabled, setRealTimeEnabled] = useState(false)
  const [dataVersion, setDataVersion] = useState(0)

  useEffect(() => {
    const fetchRefills = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await api.get(`/inventory/reports/refills/`, {
          params: { date: selectedDate },
        })
        console.log("Refill data for", selectedDate, ":", response.data)
        setRefillData(response.data) // store data
      } catch (err) {
        console.error("Failed to fetch refills:", err)
        setError(
          err.response?.data?.message || err.message || "An error occurred",
        )
        setRefillData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchRefills()
  }, [selectedDate])

  // Helper to format time (HH:MM)
  const formatTime = (timeString) => {
    if (!timeString) return ""
    return timeString.substring(0, 5) // "08:12"
  }

  return (
    <div>
      {isMobile ? (
        <div className="min-h-screen bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-gray-800 flex flex-col font-sans">
          <Navbar
            headerMessage={"ERP"}
            headerText={"Manage your operations with style and clarity"}
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

          <main className="flex-grow m-2 p-1">
            {/* Date picker */}
            <div className="bg-white rounded-lg shadow p-4 mb-4">
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Select Date
              </label>
              <input
                type="date"
                id="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {loading && (
                <p className="text-sm text-gray-500 mt-2">Loading...</p>
              )}
              {error && (
                <p className="text-sm text-red-500 mt-2">Error: {error}</p>
              )}
            </div>

            {/* Data display */}
            {refillData && (
              <div className="space-y-3">
                {/* Summary */}
                <div className="bg-white rounded-lg shadow p-3 flex justify-between items-center">
                  <span className="font-semibold">Total Records</span>
                  <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                    {refillData.total_records}
                  </span>
                </div>

                {/* Items list */}
                {refillData.items && refillData.items.length > 0 ? (
                  refillData.items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-lg shadow p-4 border-l-4 border-indigo-500"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                          {item.receipt_number}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTime(item.refill_time)}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-gray-500">From</p>
                          <p className="font-medium">{item.from_location}</p>
                          <p className="text-xs text-gray-400">
                            {item.from_location_type}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">To</p>
                          <p className="font-medium">{item.to_location}</p>
                          <p className="text-xs text-gray-400">
                            {item.to_location_type}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">{item.cylinder}</p>
                          <p className="text-xs text-gray-500">
                            Cylinder ID: {item.cylinder_id}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-indigo-700">
                            {item.empty_cylinder_quantity}
                          </p>
                          <p className="text-xs text-gray-500">Empty</p>
                        </div>
                      </div>
                      {item.full_cylinder_quantity > 0 && (
                        <div className="mt-1 text-xs text-green-600">
                          Full: {item.full_cylinder_quantity}
                        </div>
                      )}
                      {item.product && item.product_quantity > 0 && (
                        <div className="mt-1 text-xs text-blue-600">
                          {item.product}: {item.product_quantity}
                        </div>
                      )}
                      <div className="mt-2 text-xs text-gray-400">
                        By: {item.transferred_by}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                    No refill records for this date.
                  </div>
                )}
              </div>
            )}
          </main>
          <footer>
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

export default RefillReport
