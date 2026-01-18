// @ts-nocheck
import React, { useEffect, useState } from "react"
import { useMediaQuery, useTheme } from "@mui/material"
import { Button, Skeleton, Alert, Snackbar } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  fetchStore,
  getStoreStatus,
  selectAllStore,
} from "../../features/store/storeSlice"
import {
  fetchStoreCylinders,
  getStoreCylindersStatus,
  selectAllStoreCylinders,
} from "../../features/store/storeCylindersSlice"
import CircularProgress from "@mui/material/CircularProgress"
import planStatus from "../../features/planStatus/planStatus"
import { toast, ToastContainer } from "react-toastify"
import AdminsFooter from "../../components/AdminsFooter"
import Navbar from "../../components/ui/mobile/admin/Navbar"
import { Link } from "react-router-dom"
import api from "../../../utils/api"

const RefillCylinders = () => {
  const [refillingCylinders, setRefillingCylinders] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const theme = useTheme()
  const dispatch = useAppDispatch()

  const {
    isPro,
    isTrial,
    isExpired,
    businessName,
    businessId,
    businessLogo,
    subscriptionPlan,
    employeeLimit,
    planName,
  } = planStatus()

  const matches = useMediaQuery("(min-width:600px)")
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [storeRefill, setStoreRefill] = useState([])
  const [storeId, setStoreId] = useState("")

  const storeStatus = useAppSelector(getStoreStatus)
  const fetchingStoreStatus = useAppSelector(getStoreStatus)
  const fetchingCylindersStatus = useAppSelector(getStoreCylindersStatus)
  const storeCylinders = useAppSelector(selectAllStoreCylinders)
  const store = useAppSelector(selectAllStore)

  console.log("Store Cylinders:", storeCylinders)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  useEffect(() => {
    if (businessId) {
      dispatch(fetchStore({ businessId }))
    }
  }, [dispatch, businessId])

  useEffect(() => {
    if (fetchingStoreStatus === "succeeded" && store.length === 1 && !storeId) {
      setStoreId(store[0].id.toString())
    }
  }, [fetchingStoreStatus, store, storeId])

  useEffect(() => {
    if (storeId) {
      dispatch(fetchStoreCylinders({ storeId }))
      setStoreRefill([])
    }
  }, [storeId, dispatch])

  const handleInputChange = (item, value) => {
    const quantity = parseInt(value, 10) || 0

    setStoreRefill((prev) => {
      const updated = [...prev]
      const index = updated.findIndex((refill) => refill.cylinderId === item.id)

      if (index !== -1) {
        if (quantity > 0) {
          updated[index] = {
            cylinderId: item.id,
            cylinder_id: item.cylinder.id,
            storeId: item.store,
            refill_quantity: quantity,
            cylinderName: item.cylinder?.display_name || "Unknown",
            cylinderType: item.cylinder?.cylinder_type?.name || "Unknown",
            weight: item.cylinder?.weight?.weight || 0,
            refill_price: item.cylinder?.depot_refill_price || 0,
          }
        } else {
          updated.splice(index, 1)
        }
      } else if (quantity > 0) {
        updated.push({
          cylinderId: item.id,
          cylinder_id: item.cylinder?.id,
          storeId: item.store,
          refill_quantity: quantity,
          cylinderName: item.cylinder?.display_name || "Unknown",
          cylinderType: item.cylinder?.cylinder_type?.name || "Unknown",
          weight: item.cylinder?.weight?.weight || 0,
          refill_price: item.cylinder?.depot_refill_price || 0,
        })
      }

      return updated
    })
  }

  const handleShowSummary = () => {
    if (storeRefill.length === 0) {
      toast.warning("Please select cylinders to refill")
      return
    }
    setShowSummary(true)
  }

  const handleAddRefill = async () => {
    if (storeRefill.length === 0) {
      toast.error("No cylinders selected for refill")
      return
    }

    setRefillingCylinders(true)

    console.log("Refill Payload:", storeRefill)
    const payload = storeRefill.map((item) => ({
      store_id: item.storeId,
      cylinder_id: item.cylinder_id,
      quantity: item.refill_quantity,
    }))

    try {
      await api.post("/inventory/refill/cylinders/", { payload })
      setRefillingCylinders(false)
      toast.success("Cylinders refilled successfully!")
      setShowSummary(false)
      setStoreRefill([])
      dispatch(fetchStoreCylinders({ storeId }))
    } catch (error) {
      setRefillingCylinders(false)
      toast.error(
        error?.response?.data?.message ||
          "Failed to refill cylinders. Please try again.",
      )
      console.error("Error refilling cylinders:", error)
    }
  }

  const groupedCylinders = storeCylinders.reduce((acc, item) => {
    const typeName = item.cylinder?.cylinder_type?.name || "Unknown"
    if (!acc[typeName]) {
      acc[typeName] = []
    }
    acc[typeName].push(item)
    return acc
  }, {})

  const calculateSummary = () => {
    const summary = storeRefill.reduce((acc, item) => {
      const key = `${item.weight}kg`
      if (!acc[key]) {
        acc[key] = {
          weight: item.weight,
          quantity: 0,
          totalPrice: 0,
        }
      }
      acc[key].quantity += item.refill_quantity
      acc[key].totalPrice += item.refill_quantity * item.refill_price
      return acc
    }, {})

    const grandTotal = Object.values(summary).reduce(
      (sum, entry) => sum + entry.totalPrice,
      0,
    )

    return { summary, grandTotal }
  }

  const { summary: weightSummary, grandTotal: grandTotalPrice } =
    calculateSummary()

  // Summary Modal Component
  const SummaryModal = () => {
    const selectedStore = store.find((s) => s.id.toString() === storeId)

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
            <h2 className="text-2xl font-bold mb-2">Refill Summary</h2>
            <p className="text-blue-100">Review before confirming</p>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto flex-1">
            {/* Store Info */}
            <div className="mb-6 bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">Store:</h3>
              <p className="text-lg font-bold text-gray-800">
                {selectedStore?.name || "Unknown"}
              </p>
            </div>

            {/* Cylinders List */}
            <div className="mb-4">
              <h3 className="font-semibold text-gray-700 mb-3">
                Cylinders to Refill:
              </h3>
              <div className="space-y-3">
                {storeRefill.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl">🛢️</span>
                          <div>
                            <p className="font-semibold text-gray-800">
                              {item.cylinderType}
                            </p>
                            <p className="text-sm text-gray-600">
                              {item.weight} kg - {item.cylinderName}
                            </p>
                            <p className="text-xs text-gray-500">
                              KES {item.refill_price.toLocaleString()} per
                              cylinder
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">
                          {item.refill_quantity}
                        </p>
                        <p className="text-xs text-gray-500">cylinders</p>
                        <p className="text-sm font-semibold text-green-600 mt-1">
                          KES{" "}
                          {(
                            item.refill_quantity * item.refill_price
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary by Weight */}
            <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-gray-700 mb-3">
                Summary by Weight:
              </h3>
              {Object.entries(weightSummary).map(([key, data]) => (
                <div
                  key={key}
                  className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {data.weight}kg Cylinders
                    </p>
                    <p className="text-sm text-gray-600">
                      {data.quantity} cylinders
                    </p>
                  </div>
                  <p className="text-lg font-bold text-green-600">
                    KES {data.totalPrice.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Grand Total */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-700">Grand Total:</p>
                  <p className="text-sm text-gray-600">
                    {storeRefill.reduce(
                      (sum, item) => sum + item.refill_quantity,
                      0,
                    )}{" "}
                    cylinders
                  </p>
                </div>
                <p className="text-3xl font-bold text-blue-600">
                  KES {grandTotalPrice.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-gray-200 p-4 bg-gray-50 flex gap-3">
            <button
              onClick={() => setShowSummary(false)}
              className="flex-1 bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              disabled={refillingCylinders}
            >
              Cancel
            </button>
            <button
              onClick={handleAddRefill}
              className={`flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold ${
                refillingCylinders
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:from-blue-600 hover:to-blue-700 active:scale-95"
              } transition-all duration-200`}
              disabled={refillingCylinders}
            >
              {refillingCylinders ? (
                <span className="flex items-center justify-center">
                  <CircularProgress
                    size={20}
                    className="mr-2"
                    style={{ color: "white" }}
                  />
                  Refilling...
                </span>
              ) : (
                "✓ Confirm Refill"
              )}
            </button>
          </div>
        </div>
      </div>
    )
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
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-gray-800 font-sans">
          <Navbar
            headerMessage={"ERP"}
            headerText={"Manage your operations with style and clarity"}
          />

          <main className="flex-grow m-2 p-1 mb-20">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg shadow-lg mb-4">
              <h1 className="text-2xl font-bold text-white mb-1 flex items-center">
                <span className="mr-2">🔧</span>
                Refill Cylinders
              </h1>
              <p className="text-blue-100 text-sm">
                Convert empty cylinders to filled
              </p>
            </div>

            {/* Store Selector */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-4">
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

            {/* Loading State */}
            {fetchingCylindersStatus === "loading" && (
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-lg shadow-md"
                  >
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
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <div className="text-6xl mb-4">🏪</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Select a Store
                </h3>
                <p className="text-gray-500">
                  Please select a store to view cylinders available for refill
                </p>
              </div>
            )}

            {/* Empty State - No Cylinders */}
            {storeId &&
              fetchingCylindersStatus === "succeeded" &&
              storeCylinders.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                  <div className="text-6xl mb-4">📦</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No Cylinders Found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    No cylinders available in this store.
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
                        className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500"
                      >
                        <h3 className="text-lg font-bold text-blue-600 mb-4 flex items-center">
                          <span className="mr-2">🛢️</span>
                          {typeName}
                        </h3>

                        {cylinders.map((item) => (
                          <div
                            key={item.id}
                            className="bg-gray-50 rounded-lg p-3 mb-3 border border-gray-200"
                          >
                            <div className="flex justify-between items-center mb-3">
                              <div>
                                <h4 className="font-semibold text-gray-800">
                                  {item.cylinder?.weight?.weight || "N/A"}kg
                                  Cylinder
                                </h4>
                                <p className="text-xs text-gray-600">
                                  {item.cylinder?.display_name || ""}
                                </p>
                                <p className="text-xs text-green-600 font-medium mt-1">
                                  Refill: KES{" "}
                                  {(
                                    item.cylinder?.depot_refill_price || 0
                                  ).toLocaleString()}
                                </p>
                              </div>
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
                              <div className="bg-blue-50 p-2 rounded-lg border-2 border-blue-300">
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
                              <div className="bg-gray-100 p-2 rounded-lg">
                                <div className="text-xs text-gray-600 mb-1">
                                  Total
                                </div>
                                <div className="text-lg font-bold text-gray-700">
                                  {item.total_quantity || 0}
                                </div>
                              </div>
                            </div>

                            {item.empty_cylinder_quantity > 0 ? (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Quantity to Refill
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  max={item.empty_cylinder_quantity}
                                  value={
                                    storeRefill.find(
                                      (r) => r.cylinderId === item.id,
                                    )?.refill_quantity || ""
                                  }
                                  onChange={(e) =>
                                    handleInputChange(item, e.target.value)
                                  }
                                  className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                                  placeholder={`Max: ${item.empty_cylinder_quantity}`}
                                />
                              </div>
                            ) : (
                              <div className="text-center py-2 bg-red-50 rounded-lg border border-red-200">
                                <p className="text-sm text-red-600 font-medium">
                                  ⚠️ No empty cylinders available
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
              <div className="text-center py-12 bg-red-50 rounded-lg shadow-md">
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
            storeCylinders.some((c) => c.empty_cylinder_quantity > 0) && (
              <div className="fixed bottom-10 left-0 right-0 bg-white border-t-2 border-gray-200 p-4 shadow-lg">
                <button
                  onClick={handleShowSummary}
                  disabled={storeRefill.length === 0}
                  className={`w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all duration-200 ${
                    storeRefill.length === 0
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:from-blue-600 hover:to-blue-700 active:scale-95"
                  }`}
                >
                  Review Refill
                  {storeRefill.length > 0 ? ` (${storeRefill.length})` : ""}
                </button>
              </div>
            )}

          {showSummary && <SummaryModal />}

          <footer className="fixed bottom-0 left-0 right-0">
            <AdminsFooter />
          </footer>
        </div>
      ) : (
        <div className="p-4">
          <p>Desktop view coming soon</p>
        </div>
      )}
    </div>
  )
}

export default RefillCylinders
