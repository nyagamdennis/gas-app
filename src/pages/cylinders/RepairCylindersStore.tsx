// @ts-nocheck
import React, { useEffect, useState } from "react"
import { useMediaQuery, useTheme } from "@mui/material"
import planStatus from "../../features/planStatus/planStatus"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { toast, ToastContainer } from "react-toastify"
import { Button, Skeleton, Alert, Snackbar } from "@mui/material"
import Navbar from "../../components/ui/mobile/admin/Navbar"
import { Link } from "react-router-dom"
import AdminsFooter from "../../components/AdminsFooter"
import {
  fetchStore,
  selectAllStore,
  getStoreStatus,
  getStoreError,
} from "../../features/store/storeSlice"
import {
  fetchStoreCylinders,
  selectAllStoreCylinders,
  getStoreCylindersStatus,
} from "../../features/store/storeCylindersSlice"
import api from "../../../utils/api"

const RepairCylindersStore = () => {
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const { businessId } = useAppSelector((state) => state.planStatus)

  const store = useAppSelector(selectAllStore)
  const storeCylinders = useAppSelector(selectAllStoreCylinders)
  const fetchingStoreStatus = useAppSelector(getStoreStatus)
  const fetchingCylindersStatus = useAppSelector(getStoreCylindersStatus)

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const [storeId, setStoreId] = useState("")
  const [repairData, setRepairData] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  // Fetch stores on component mount
  useEffect(() => {
    if (businessId) {
      dispatch(fetchStore({ businessId }))
    }
  }, [businessId, dispatch])

  // Auto-select store if only one exists
  useEffect(() => {
    if (fetchingStoreStatus === "succeeded" && store.length === 1 && !storeId) {
      setStoreId(store[0].id.toString())
    }
  }, [fetchingStoreStatus, store, storeId])

  // Fetch cylinders when store is selected
  useEffect(() => {
    if (storeId) {
      dispatch(fetchStoreCylinders({ storeId }))
      setRepairData({}) // Reset repair data when changing stores
    }
  }, [storeId, dispatch])

  // Group cylinders by type
  const groupedCylinders = storeCylinders.reduce((acc, item) => {
    const typeName = item.cylinder?.cylinder_type?.name || "Unknown"
    if (!acc[typeName]) {
      acc[typeName] = []
    }
    acc[typeName].push(item)
    return acc
  }, {})

  const handleRepairChange = (itemId, value) => {
    const numValue = parseInt(value) || 0
    setRepairData((prev) => ({
      ...prev,
      [itemId]: numValue,
    }))
  }

  const handleRepair = async () => {
    const payload = Object.entries(repairData)
      .filter(([_, quantity]) => quantity > 0)
      .map(([itemId, quantity]) => {
        const item = storeCylinders.find((c) => c.id === parseInt(itemId))
        return {
          id: item.id,
          cylinder: item.cylinder.id,
          repair_quantity: quantity,
        }
      })

    if (payload.length === 0) {
      setSnackbar({
        open: true,
        message: "Please enter repair quantities",
        severity: "warning",
      })
      return
    }

    console.log("Repair Payload:", payload)
    setSubmitting(true)

    try {
      // Replace with actual API endpoint
      // await api.post('/inventory/cylinders/repair/', { payload })

      // Simulate API call for now
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSnackbar({
        open: true,
        message: "Cylinders repaired successfully",
        severity: "success",
      })
      setRepairData({})

      // Refresh cylinder data
      if (storeId) {
        dispatch(fetchStoreCylinders({ storeId }))
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Failed to repair cylinders",
        severity: "error",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleWriteOff = async () => {
    const payload = Object.entries(repairData)
      .filter(([_, quantity]) => quantity > 0)
      .map(([itemId, quantity]) => {
        const item = storeCylinders.find((c) => c.id === parseInt(itemId))
        return {
          id: item.id,
          cylinder: item.cylinder.id,
          write_off_quantity: quantity,
        }
      })

    if (payload.length === 0) {
      setSnackbar({
        open: true,
        message: "Please enter write-off quantities",
        severity: "warning",
      })
      return
    }

    console.log("Write-off Payload:", payload)
    setSubmitting(true)

    try {
      // Replace with actual API endpoint
      // await api.post('/inventory/cylinders/writeoff/', { payload })

      // Simulate API call for now
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSnackbar({
        open: true,
        message: "Cylinders written off successfully",
        severity: "success",
      })
      setRepairData({})

      // Refresh cylinder data
      if (storeId) {
        dispatch(fetchStoreCylinders({ storeId }))
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Failed to write off cylinders",
        severity: "error",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <ToastContainer />
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
            headerMessage={"Cylinder Repair"}
            headerText={"Manage store cylinder repairs and write-offs"}
          />

          <main className="flex-grow p-4 pb-24">
            {/* Store Selection Header */}
            <div className="bg-white p-4 rounded-xl shadow-lg mb-4">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-1 flex items-center">
                  <span className="mr-2">🔧</span>
                  Repair Store Cylinders
                </h2>
                <p className="text-sm text-gray-600">
                  Select spoiled cylinders for repair or write-off
                </p>
              </div>

              {/* Store Selector */}
              <div className="w-full">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Store
                </label>
                <select
                  className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                  value={storeId}
                  onChange={(e) => setStoreId(e.target.value)}
                >
                  <option value="">-- Select a store --</option>
                  {store.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Loading State */}
            {fetchingCylindersStatus === "loading" && (
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <Skeleton variant="text" width="60%" height={30} />
                    <Skeleton
                      variant="rectangular"
                      height={120}
                      className="mt-3"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Empty State - No Store Selected */}
            {!storeId && fetchingCylindersStatus !== "loading" && (
              <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                <div className="text-6xl mb-4">🏪</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Select a Store
                </h3>
                <p className="text-gray-500">
                  Please select a store to view and repair cylinder inventory
                </p>
              </div>
            )}

            {/* Empty State - No Cylinders */}
            {storeId &&
              fetchingCylindersStatus === "succeeded" &&
              storeCylinders.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                  <div className="text-6xl mb-4">📦</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No Cylinders Found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    No cylinders are currently available in this store.
                  </p>
                  <Link
                    to="/cylinders/add"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Add cylinders to inventory →
                  </Link>
                </div>
              )}

            {/* Cylinder List */}
            {storeId &&
              fetchingCylindersStatus === "succeeded" &&
              Object.keys(groupedCylinders).length > 0 && (
                <div className="space-y-4">
                  {Object.entries(groupedCylinders).map(
                    ([typeName, cylinders]) => (
                      <div
                        key={typeName}
                        className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200 shadow-lg"
                      >
                        <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center">
                          <span className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm mr-2">
                            {typeName}
                          </span>
                        </h3>

                        {cylinders.map((item) => (
                          <div
                            key={item.id}
                            className="bg-white rounded-lg p-3 mb-3 shadow-sm"
                          >
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="font-semibold text-gray-800">
                                {item.cylinder?.weight?.weight || "N/A"}kg
                                Cylinder
                              </h4>
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                                {item.cylinder?.display_name || ""}
                              </span>
                            </div>

                            <div className="grid grid-cols-4 gap-2 mb-3 text-center">
                              <div className="bg-green-50 p-2 rounded-lg">
                                <div className="text-xs text-gray-600 mb-1">
                                  Filled
                                </div>
                                <div className="text-lg font-bold text-green-700">
                                  {item.full_cylinder_quantity || 0}
                                </div>
                              </div>
                              <div className="bg-blue-50 p-2 rounded-lg">
                                <div className="text-xs text-gray-600 mb-1">
                                  Empty
                                </div>
                                <div className="text-lg font-bold text-blue-700">
                                  {item.empty_cylinder_quantity || 0}
                                </div>
                              </div>
                              <div className="bg-red-50 p-2 rounded-lg">
                                <div className="text-xs text-gray-600 mb-1">
                                  Spoiled
                                </div>
                                <div className="text-lg font-bold text-red-700">
                                  {item.spoiled_cylinder_quantity || 0}
                                </div>
                              </div>
                              <div className="bg-gray-50 p-2 rounded-lg">
                                <div className="text-xs text-gray-600 mb-1">
                                  Total
                                </div>
                                <div className="text-lg font-bold text-gray-700">
                                  {item.total_quantity || 0}
                                </div>
                              </div>
                            </div>

                            {item.spoiled_cylinder_quantity > 0 && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Repair/Write-off Quantity
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  max={item.spoiled_cylinder_quantity}
                                  value={repairData[item.id] || ""}
                                  onChange={(e) =>
                                    handleRepairChange(item.id, e.target.value)
                                  }
                                  className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
                                  placeholder={`Max: ${item.spoiled_cylinder_quantity}`}
                                />
                              </div>
                            )}

                            {item.spoiled_cylinder_quantity === 0 && (
                              <div className="text-center py-2 bg-green-50 rounded-lg">
                                <p className="text-sm text-green-700 font-medium">
                                  ✓ No spoiled cylinders
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ),
                  )}
                </div>
              )}

            {/* Error State */}
            {fetchingCylindersStatus === "failed" && (
              <div className="text-center py-12 bg-red-50 rounded-xl shadow-lg">
                <div className="text-6xl mb-4">⚠️</div>
                <p className="text-red-500 font-medium text-lg">
                  Failed to load cylinder data. Please try again later.
                </p>
              </div>
            )}
          </main>

          {/* Fixed Bottom Action Bar */}
          {storeId &&
            fetchingCylindersStatus === "succeeded" &&
            storeCylinders.length > 0 &&
            storeCylinders.some((c) => c.spoiled_cylinder_quantity > 0) && (
              <div className="fixed bottom-14 left-0 right-0 bg-white border-t-2 border-gray-200 p-4 shadow-lg">
                <div className="flex gap-3 max-w-md mx-auto">
                  <button
                    onClick={handleWriteOff}
                    disabled={
                      submitting || Object.keys(repairData).length === 0
                    }
                    className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all duration-200 active:scale-95"
                  >
                    {submitting ? "Processing..." : "Write Off"}
                  </button>
                  <button
                    onClick={handleRepair}
                    disabled={
                      submitting || Object.keys(repairData).length === 0
                    }
                    className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all duration-200 active:scale-95"
                  >
                    {submitting ? "Processing..." : "Repair"}
                  </button>
                </div>
              </div>
            )}

          <footer className=" fixed bottom-0 left-0 right-0">
            <AdminsFooter />
          </footer>
        </div>
      ) : (
        <div className="p-8 min-h-screen bg-gray-100">
          <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-6">
              Desktop View Coming Soon
            </h2>
            <p className="text-gray-600">
              The desktop version of this feature is under development. Please
              use a mobile device for now.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default RepairCylindersStore
