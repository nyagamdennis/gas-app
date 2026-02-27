// @ts-nocheck
import React, { useState, useEffect } from "react"
import AdminsFooter from "../../components/AdminsFooter"
import Navbar from "../../components/ui/mobile/admin/Navbar"
import { useMediaQuery, useTheme } from "@mui/material"
import api from "../../../utils/api"

const StoreCylinderAggregate = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  // Set default start date as per requirement
  const [startDate, setStartDate] = useState("2026-02-01")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await api.get("/inventory/reports/refills/", {
          params: {
            start_date: startDate,
            group_by_date: true,
          },
        })
        console.log("Aggregated refill data for", startDate, ":", response.data)
        setData(response.data)
      } catch (err) {
        console.error("Failed to fetch aggregated refills:", err)
        setError(
          err.response?.data?.message || err.message || "An error occurred",
        )
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [startDate])

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
          <main className="flex-grow m-2 p-1">
            {/* Date picker */}
            <div className="bg-white rounded-lg shadow p-4 mb-4">
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
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
            {data && (
              <div className="space-y-4">
                {/* Total records summary */}
                <div className="bg-white rounded-lg shadow p-3 flex justify-between items-center">
                  <span className="font-semibold">Total Records</span>
                  <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                    {data.total_records}
                  </span>
                </div>

                {/* Summary by date */}
                {data.summary_by_date && data.summary_by_date.length > 0 ? (
                  data.summary_by_date.map((dateSummary) => (
                    <div
                      key={dateSummary.date}
                      className="bg-white rounded-lg shadow overflow-hidden"
                    >
                      {/* Date header with summary */}
                      <div className="bg-indigo-50 px-4 py-3 border-b border-indigo-100">
                        <div className="flex justify-between items-center">
                          <h3 className="font-bold text-indigo-800">
                            {dateSummary.date}
                          </h3>
                          <div className="flex space-x-3 text-xs">
                            <span className="bg-indigo-200 text-indigo-800 px-2 py-1 rounded">
                              Refills: {dateSummary.total_refills}
                            </span>
                            <span className="bg-green-200 text-green-800 px-2 py-1 rounded">
                              Cylinders: {dateSummary.total_cylinders}
                            </span>
                            {dateSummary.total_products > 0 && (
                              <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded">
                                Products: {dateSummary.total_products}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Items list for this date */}
                      <div className="divide-y divide-gray-100">
                        {dateSummary.items && dateSummary.items.length > 0 ? (
                          dateSummary.items.map((item) => (
                            <div key={item.id} className="p-4 hover:bg-gray-50">
                              <div className="flex justify-between items-start mb-2">
                                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                                  {item.receipt_number}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {formatTime(item.refill_time)}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <p className="text-gray-500">From</p>
                                  <p className="font-medium">
                                    {item.from_location}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {item.from_location_type}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-500">To</p>
                                  <p className="font-medium">
                                    {item.to_location}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {item.to_location_type}
                                  </p>
                                </div>
                              </div>
                              <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between items-center">
                                <div>
                                  <p className="text-sm font-medium">
                                    {item.cylinder}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Cylinder ID: {item.cylinder_id}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-lg font-bold text-indigo-700">
                                    {item.empty_cylinder_quantity > 0
                                      ? item.empty_cylinder_quantity
                                      : item.full_cylinder_quantity}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {item.empty_cylinder_quantity > 0
                                      ? "Empty"
                                      : "Full"}
                                  </p>
                                </div>
                              </div>
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
                          <div className="p-4 text-center text-gray-500">
                            No items for this date.
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                    No refill records for the selected period.
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

export default StoreCylinderAggregate
