// @ts-nocheck
import React, { useEffect, useState } from "react"
import AdminsFooter from "../../components/AdminsFooter"
import { Link, useNavigate } from "react-router-dom"
import planStatus from "../../features/planStatus/planStatus"
import { useMediaQuery, useTheme } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { toast, ToastContainer } from "react-toastify"
import Navbar from "../../components/ui/mobile/admin/Navbar"
import Skeleton from "@mui/material/Skeleton"
import {
  fetchOtherProducts,
  selectAllOtherProducts,
} from "../../features/store/productsSlice"
import { assignOthers } from "../../features/assigns/assignsOthersSlice"
import {
  fetchSalesTeamShops,
  getSalesTeamStatus,
  selectAllSalesTeamShops,
} from "../../features/salesTeam/salesTeamSlice"
import {
  fetchStore,
  getStoreStatus,
  selectAllStore,
} from "../../features/store/storeSlice"
import {
  fetchSalesTeamVehicle,
  selectAllSalesTeamVehicle,
} from "../../features/salesTeam/salesTeamVehicleSlice"
import LocalMallIcon from "@mui/icons-material/LocalMall"
import InventoryIcon from "@mui/icons-material/Inventory"
import WarningIcon from "@mui/icons-material/Warning"
import StorefrontIcon from "@mui/icons-material/Storefront"

const AssignProducts = () => {
  const theme = useTheme()
  const navigate = useNavigate()
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
  const [activeTab, setActiveTab] = useState("shops")

  const products = useAppSelector(selectAllOtherProducts)
  const fetchingStoreStatus = useAppSelector(getStoreStatus)
  const store = useAppSelector(selectAllStore)
  const allSalesTeamShops = useAppSelector(selectAllSalesTeamShops)
  const allSalesVehicles = useAppSelector(selectAllSalesTeamVehicle)
  const fetchingSalesteamStatus = useAppSelector(getSalesTeamStatus)

  const [showSummary, setShowSummary] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [selectedTeamType, setSelectedTeamType] = useState("")
  const [assignments, setAssignments] = useState([])
  const [loadingAssign, setLoadingAssign] = useState(false)
  const [storeId, setStoreId] = useState("")
  const [storeName, setStoreName] = useState("")

  useEffect(() => {
    dispatch(fetchSalesTeamShops())
    dispatch(fetchSalesTeamVehicle())
    dispatch(fetchStore({ businessId }))
    dispatch(fetchOtherProducts({ businessId }))
  }, [dispatch, businessId])

  useEffect(() => {
    if (storeId) {
      dispatch(fetchOtherProducts({ storeId }))
    }
  }, [dispatch, storeId])

  useEffect(() => {
    if (fetchingStoreStatus === "succeeded" && store.length === 1 && !storeId) {
      setStoreId(store[0].id.toString())
      setStoreName(store[0].name)
    }
  }, [fetchingStoreStatus, store, storeId])

  const handleSelectTeam = (team, type) => {
    setSelectedTeam(team)
    setSelectedTeamType(type)
    setAssignments([]) // Reset assignments when team changes
  }

  const getTeamDisplayName = (team, type) => {
    return type === "vehicle" ? team.number_plate : team.name
  }

  const handleBack = () => {
    setSelectedTeam(null)
    setSelectedTeamType("")
    setAssignments([])
  }

  const handleInputChange = (productId, value, maxQuantity) => {
    const numericValue = parseInt(value, 10) || 0

    // Validate that assignment doesn't exceed available quantity
    const validatedValue = Math.min(numericValue, maxQuantity)

    setAssignments((prev) => {
      const updated = [...prev]
      const index = updated.findIndex((item) => item.productId === productId)

      if (index !== -1) {
        if (validatedValue > 0) {
          updated[index] = { productId, assigned_quantity: validatedValue }
        } else {
          updated.splice(index, 1) // Remove item if quantity is 0
        }
      } else if (validatedValue > 0) {
        updated.push({ productId, assigned_quantity: validatedValue })
      }

      return updated
    })
  }

  const handleShowSummary = () => {
    setShowSummary(true)
  }

  const handleConfirmAssign = async () => {
    // Validate assignments exist
    if (!assignments || assignments.length === 0) {
      toast.error("No products selected for assignment")
      return
    }

    // Validate team selection
    if (!selectedTeam?.id) {
      toast.error("Please select a destination team")
      return
    }

    // Build items array from assignments
    const items = assignments
      .filter((item) => item.assigned_quantity > 0) // Only items with quantity
      .map((item) => ({
        product_id: item.productId,
        quantity: item.assigned_quantity,
      }))

    // Validate items
    if (items.length === 0) {
      toast.error("No cylinders with valid quantities to transfer")
      return
    }

    // Determine destination type
    const toLocationType = selectedTeamType === "shop" ? "SHOP" : "VEHICLE"

    // Build bulk transfer payload
    const bulkPayload = {
      from_location_type: "STORE" as const,
      from_location_id: storeId,
      to_location_type: toLocationType,
      to_location_id: selectedTeam.id,
      notes: "Weekly stock replenishment",
      products: items,
    }
    setLoadingAssign(true)

    try {
      // Dispatch bulk transfer
      const result = await dispatch(assignOthers(bulkPayload)).unwrap()
      const totalTransferred =
        result?.summary?.total_items_transferred ||
        result?.transfers?.length || 0

      toast.success(
        `Successfully transferred ${totalTransferred} product types`,
      )

      console.log("Bulk transfer result:", result)
      const receipt_number = result?.receipt?.receipt_number || "TEMP-XXXXXX"
      // Navigate to success page
      const teamName =
        selectedTeamType === "vehicle"
          ? selectedTeam.number_plate
          : selectedTeam.name

      navigate(`/admins/afterassignproducts/${receipt_number}`, {
        state: {
          salesTeamName: teamName,
          salesTeamType: selectedTeamType,
          transferSummary: result.summary,
        },
      })
    } catch (error: any) {
      toast.error("Failed to transfer product(s). Please try again.")

      // Handle specific error types
      if (Array.isArray(error)) {
        // Multiple validation errors from items
        error.forEach((err, index) => {
          toast.error(`Item ${index + 1}: ${err}`)
        })
      } else if (typeof error === "string") {
        toast.error(error)
      } else if (error?.message) {
        toast.error(error.message)
      } else {
        toast.error("Failed to transfer cylinders. Please try again.")
      }
    } finally {
      setLoadingAssign(false)
    }
  }

  const getAssignmentSummary = () => {
    return assignments.map((item) => {
      const productData = products.find((p) => p.product?.id === item.productId)
      return {
        productId: item.productId,
        assigned_quantity: item.assigned_quantity,
        productData,
      }
    })
  }

  const renderTeamCard = (team, type) => {
    const isShop = type === "shop"
    const bgColor = isShop ? "bg-blue-50" : "bg-green-50"
    const borderColor = isShop ? "border-blue-500" : "border-green-500"
    const textColor = isShop ? "text-blue-600" : "text-green-600"
    const hoverColor = isShop ? "hover:bg-blue-100" : "hover:bg-green-100"
    const icon = isShop ? "🏪" : "🚚"
    const displayName = getTeamDisplayName(team, type)

    return (
      <div
        key={team.id}
        className={`${bgColor} border-2 ${borderColor} rounded-lg shadow-lg p-4 cursor-pointer ${hoverColor} transition-all duration-200 hover:shadow-xl`}
        onClick={() => handleSelectTeam(team, type)}
      >
        <div className="flex items-start justify-between mb-2">
          <h3 className={`text-lg font-bold ${textColor} flex-1`}>
            {displayName}
          </h3>
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="space-y-1">
          {isShop ? (
            <p className="text-sm text-gray-600">
              <span className="font-medium">Type:</span>{" "}
              {team.type_of_sales_team?.name || "N/A"}
            </p>
          ) : (
            <>
              {team.driver && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Driver:</span>{" "}
                  {team.driver?.first_name} {team.driver?.last_name}
                </p>
              )}
              <p className="text-sm text-gray-600">
                <span className="font-medium">Plate:</span> {team.number_plate}
              </p>
            </>
          )}
          <p
            className={`text-xs font-semibold ${textColor} uppercase tracking-wide`}
          >
            {isShop ? "Shop Team" : "Vehicle Team"}
          </p>
        </div>
      </div>
    )
  }

  const SummaryModal = () => {
    const summaryData = getAssignmentSummary()
    const selectedStore = store.find((s) => s.id.toString() === storeId)

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6">
            <h2 className="text-2xl font-bold mb-2">Assignment Summary</h2>
            <p className="text-purple-100">Review before confirming</p>
          </div>

          <div className="p-6 overflow-y-auto flex-1">
            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">
                Assigning To:
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-gray-800">
                    {getTeamDisplayName(selectedTeam, selectedTeamType)}
                  </p>
                  <p
                    className={`text-sm ${
                      selectedTeamType === "shop"
                        ? "text-blue-600"
                        : "text-green-600"
                    }`}
                  >
                    {selectedTeamType === "shop"
                      ? "🏪 Shop Team"
                      : "🚚 Vehicle Team"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">From Store:</p>
                  <p className="font-medium text-gray-800">
                    {storeName || (selectedStore && selectedStore.name)
                      ? storeName || selectedStore.name
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-gray-700 mb-3">
                Selected Products:
              </h3>
              <div className="space-y-3">
                {summaryData.map((item) => (
                  <div
                    key={item.productId}
                    className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-purple-300 transition"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl">📦</span>
                          <div>
                            <p className="font-semibold text-gray-800">
                              {item.productData?.product?.name ||
                                "Unknown Product"}
                            </p>
                            <p className="text-sm text-gray-600">
                              Available: {item.productData?.quantity || 0} units
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-purple-600">
                          {item.assigned_quantity}
                        </p>
                        <p className="text-xs text-gray-500">units</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <p className="font-semibold text-gray-700">Total Products:</p>
                <p className="text-2xl font-bold text-purple-600">
                  {summaryData.reduce(
                    (sum, item) => sum + item.assigned_quantity,
                    0,
                  )}
                </p>
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="font-semibold text-gray-700">Total Items:</p>
                <p className="text-lg font-medium text-gray-800">
                  {summaryData.length} product
                  {summaryData.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 p-4 bg-gray-50 flex gap-3">
            <button
              onClick={() => setShowSummary(false)}
              className="flex-1 bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              disabled={loadingAssign}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmAssign}
              className={`flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold ${
                loadingAssign
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:from-purple-600 hover:to-purple-700 active:scale-95"
              } transition-all duration-200`}
              disabled={loadingAssign}
            >
              {loadingAssign ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Confirming...
                </span>
              ) : (
                "✓ Confirm Assignment"
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {isMobile ? (
        <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] text-gray-800 flex flex-col font-sans">
          <Navbar
            headerMessage={"ERP"}
            headerText={"Assign products to sales teams"}
          />
          <ToastContainer />
          <main className="flex-grow m-2 p-1">
            <div className="">
              {!selectedTeam ? (
                <div>
                  <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                    Select a Sales Team
                  </h2>

                  <div className="flex mb-6 bg-white rounded-lg shadow-md overflow-hidden">
                    <button
                      onClick={() => setActiveTab("shops")}
                      className={`flex-1 py-3 px-4 font-semibold transition-all duration-200 ${
                        activeTab === "shops"
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      🏪 Shop Teams ({allSalesTeamShops.length})
                    </button>
                    <button
                      onClick={() => setActiveTab("vehicles")}
                      className={`flex-1 py-3 px-4 font-semibold transition-all duration-200 ${
                        activeTab === "vehicles"
                          ? "bg-green-500 text-white"
                          : "bg-white text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      🚚 Vehicle Teams ({allSalesVehicles.length})
                    </button>
                  </div>

                  {fetchingSalesteamStatus === "loading" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[...Array(4)].map((_, index) => (
                        <div
                          key={index}
                          className="bg-white border border-gray-300 rounded-lg shadow-md p-5 space-y-4 animate-pulse"
                        >
                          <Skeleton variant="text" height={28} width="60%" />
                          <Skeleton variant="text" height={20} width="80%" />
                          <Skeleton variant="text" height={20} width="40%" />
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === "shops" &&
                    fetchingSalesteamStatus === "succeeded" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {allSalesTeamShops.length === 0 ? (
                          <div className="col-span-2 text-center p-8 bg-white rounded-lg shadow-md">
                            <p className="text-gray-500 mb-2">
                              No shop sales teams available.
                            </p>
                            <Link
                              to="/createteam"
                              className="text-blue-600 hover:underline font-medium"
                            >
                              Create a new shop team
                            </Link>
                          </div>
                        ) : (
                          allSalesTeamShops.map((team) =>
                            renderTeamCard(team, "shop"),
                          )
                        )}
                      </div>
                    )}

                  {activeTab === "vehicles" &&
                    fetchingSalesteamStatus === "succeeded" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {allSalesVehicles.length === 0 ? (
                          <div className="col-span-2 text-center p-8 bg-white rounded-lg shadow-md">
                            <p className="text-gray-500 mb-2">
                              No vehicle sales teams available.
                            </p>
                            <Link
                              to="/createteam"
                              className="text-green-600 hover:underline font-medium"
                            >
                              Create a new vehicle team
                            </Link>
                          </div>
                        ) : (
                          allSalesVehicles.map((team) =>
                            renderTeamCard(team, "vehicle"),
                          )
                        )}
                      </div>
                    )}

                  {fetchingSalesteamStatus === "failed" && (
                    <div className="col-span-2 text-center p-8 bg-red-50 rounded-lg shadow-md">
                      <p className="text-red-500 font-medium">
                        Failed to load sales teams. Please try again later.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className="mb-4">
                    <button
                      onClick={handleBack}
                      className="mb-3 flex items-center text-blue-600 hover:text-blue-800 font-medium transition"
                    >
                      <span className="mr-2">←</span> Back to Teams
                    </button>
                    <div
                      className={`p-4 rounded-lg ${
                        selectedTeamType === "shop"
                          ? "bg-blue-50 border-2 border-blue-500"
                          : "bg-green-50 border-2 border-green-500"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-xl font-bold text-gray-800">
                            Assign Products to{" "}
                            {getTeamDisplayName(selectedTeam, selectedTeamType)}
                          </h2>
                          <p
                            className={`text-sm mt-1 font-medium ${
                              selectedTeamType === "shop"
                                ? "text-blue-600"
                                : "text-green-600"
                            }`}
                          >
                            {selectedTeamType === "shop"
                              ? "🏪 Shop Team"
                              : "🚚 Vehicle Team"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <LocalMallIcon className="text-purple-600" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <StorefrontIcon className="text-gray-500" />
                      Select Store to Assign From
                    </label>
                    <select
                      className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
                      value={storeId}
                      onChange={(e) => {
                        setStoreId(e.target.value)
                        setStoreName(
                          e.target.options[e.target.selectedIndex].text,
                        )
                        setAssignments([])
                      }}
                    >
                      <option value="">-- Select a store --</option>
                      {store.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} Store
                        </option>
                      ))}
                    </select>
                  </div>

                  {!storeId ? (
                    <div className="text-center p-8 bg-white rounded-lg shadow-md">
                      <div className="text-6xl mb-4 opacity-30">📦</div>
                      <p className="text-gray-500 text-lg">
                        Please select a store to view available products
                      </p>
                    </div>
                  ) : (
                    <div>
                      {products.length === 0 ? (
                        <div className="text-center p-8 bg-white rounded-lg shadow-md">
                          <div className="text-6xl mb-4 opacity-30">📭</div>
                          <p className="text-gray-500 mb-2 text-lg">
                            No products available in this store.
                          </p>
                          <p className="text-gray-400 text-sm mb-4">
                            Add products to the store first
                          </p>
                          <Link
                            to="/admins/store"
                            className="text-purple-600 hover:underline font-medium"
                          >
                            Manage store inventory
                          </Link>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {products.map((product) => (
                            <div
                              key={product.id}
                              className="bg-white p-4 rounded-lg shadow-md border-l-4 border-purple-500"
                            >
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-purple-100 rounded-lg">
                                    <LocalMallIcon className="text-purple-600" />
                                  </div>
                                  <div>
                                    <h3 className="text-lg font-bold text-gray-800">
                                      {product.product?.name ||
                                        "Unnamed Product"}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                      Product ID: {product.product?.id || "N/A"}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className="text-right">
                                    <div className="flex items-center gap-2">
                                      <InventoryIcon className="text-green-500" />
                                      <span className="text-2xl font-bold text-green-600">
                                        {product.quantity || 0}
                                      </span>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                      Available
                                    </p>
                                  </div>
                                  {product.spoiled_product_quantity > 0 && (
                                    <div className="text-right">
                                      <div className="flex items-center gap-2">
                                        <WarningIcon className="text-red-500" />
                                        <span className="text-sm font-bold text-red-600">
                                          {product.spoiled_product_quantity}
                                        </span>
                                      </div>
                                      <p className="text-xs text-gray-500">
                                        Spoiled
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="mt-4">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                  Assign Quantity (Max: {product.quantity || 0})
                                </label>
                                <div className="flex items-center gap-3">
                                  <input
                                    type="number"
                                    min="0"
                                    max={product.quantity || 0}
                                    placeholder="0"
                                    className="flex-1 border-2 border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 rounded-lg px-4 py-3 text-center text-lg outline-none transition"
                                    onChange={(e) =>
                                      handleInputChange(
                                        product.product?.id,
                                        e.target.value,
                                        product.quantity || 0,
                                      )
                                    }
                                  />
                                  <div className="text-sm text-gray-500">
                                    units
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-6 text-center sticky bottom-0 bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] pt-4 pb-2">
                    {products.length > 0 &&
                      storeId &&
                      assignments.length > 0 && (
                        <button
                          className={`w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-lg shadow-lg font-semibold text-lg ${
                            assignments.length === 0
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:from-purple-600 hover:to-purple-700 active:scale-95"
                          } transition-all duration-200`}
                          onClick={handleShowSummary}
                          disabled={assignments.length === 0}
                        >
                          Review Assignment (
                          {assignments.reduce(
                            (sum, item) => sum + item.assigned_quantity,
                            0,
                          )}{" "}
                          units)
                        </button>
                      )}
                  </div>
                </div>
              )}
            </div>
          </main>

          {showSummary && <SummaryModal />}
          <footer>
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

export default AssignProducts
