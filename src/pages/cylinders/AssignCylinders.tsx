// @ts-nocheck
import React, { useEffect, useState } from "react"
import { useMediaQuery, useTheme } from "@mui/material"
import Navbar from "../../components/ui/mobile/admin/Navbar"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import planStatus from "../../features/planStatus/planStatus"
import { useNavigate, Link } from "react-router-dom"
import {
  fetchSalesTeamShops,
  getSalesTeamStatus,
  selectAllSalesTeamShops,
} from "../../features/salesTeam/salesTeamSlice"
import {
  fetchStore,
  getStoreError,
  getStoreStatus,
  selectAllStore,
} from "../../features/store/storeSlice"
import {
  assignedCylindersUpdate,
  assignShopBulkCylinders,
  assignShopCylinders,
  assignVehicleCylinders,
} from "../../features/assigns/assignsSlice"
import Skeleton from "@mui/material/Skeleton"
import AdminsFooter from "../../components/AdminsFooter"
import {
  fetchSalesTeamVehicle,
  selectAllSalesTeamVehicle,
} from "../../features/salesTeam/salesTeamVehicleSlice"
import { selectAllCylindersWeight } from "../../features/cylinders/cylindersWeightSlice"
import {
  fetchStoreCylinders,
  getStoreCylindersStatus,
  selectAllStoreCylinders,
} from "../../features/store/storeCylindersSlice"
import { toast, ToastContainer } from "react-toastify"

const AssignCylinders = () => {
  const theme = useTheme()
  const matches = useMediaQuery("(min-width:600px)")
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

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

  const storeCylinder = useAppSelector(selectAllStoreCylinders)
  const storeCylinderStatus = useAppSelector(getStoreCylindersStatus)
  const storeCylinderWeight = useAppSelector(selectAllCylindersWeight)

  const allSalesTeamShops = useAppSelector(selectAllSalesTeamShops)
  const allSalesVehicles = useAppSelector(selectAllSalesTeamVehicle)
  const fetchingSalesteamStatus = useAppSelector(getSalesTeamStatus)
  const store = useAppSelector(selectAllStore)
  const fetchingStoreStatus = useAppSelector(getStoreStatus)
  const fetchingStoreError = useAppSelector(getStoreError)

  const [selectedTeam, setSelectedTeam] = useState(null)
  const [selectedTeamType, setSelectedTeamType] = useState(null)
  const [activeTab, setActiveTab] = useState("shops")
  const [storeId, setStoreId] = useState("")
  const [storeName, setStoreName] = useState("")
  // console.log("Selected Store Name:", storeName)
  const [assignments, setAssignments] = useState([])
  const [loadingAssign, setLoadingAssign] = useState(false)
  const [showSummary, setShowSummary] = useState(false)

  useEffect(() => {
    if (businessId) {
      dispatch(fetchSalesTeamShops())
      dispatch(fetchSalesTeamVehicle())
      dispatch(fetchStore({ businessId }))
    }
  }, [dispatch, businessId])

  useEffect(() => {
    if (storeId) {
      dispatch(fetchStoreCylinders({ storeId }))
    }
  }, [storeId, dispatch])

  const handleSelectTeam = (team, type) => {
    setSelectedTeam(team)
    setSelectedTeamType(type)
    setStoreId("")
    setAssignments([])
  }

  const handleInputChange = (cylinderId, value, maxQuantity) => {
    const inputValue = parseInt(value, 10)

    if (inputValue > maxQuantity) {
      alert(`Assigned quantity cannot exceed ${maxQuantity}`)
      return
    }

    setAssignments((prev) => {
      const updated = [...prev]
      const index = updated.findIndex((item) => item.cylinderId === cylinderId)

      if (index !== -1) {
        if (inputValue > 0) {
          updated[index] = {
            cylinderId,
            assigned_quantity: inputValue,
          }
        } else {
          updated.splice(index, 1)
        }
      } else if (inputValue > 0) {
        updated.push({
          cylinderId,
          assigned_quantity: inputValue,
        })
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
      toast.error("No cylinders selected for assignment")
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
        cylinder_id: item.cylinderId,
        full_quantity: item.assigned_quantity,
        empty_quantity: 0,
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
      items: items,
    }

    setLoadingAssign(true)

    try {
      // Dispatch bulk transfer
      const result = await dispatch(
        assignShopBulkCylinders(bulkPayload),
      ).unwrap()

      // Success notification
      toast.success(
        `Successfully transferred ${result.summary.total_items_transferred} cylinder types`,
      )
      console.log("Bulk transfer result:", result)
      const receipt_number = result.receipt.receipt_number
      // Navigate to success page
      const teamName =
        selectedTeamType === "vehicle"
          ? selectedTeam.number_plate
          : selectedTeam.name

          console.log("Receipt Number for Navigation:", receipt_number)
      navigate(`/admins/afterassign/${receipt_number}`, {
        state: {
          salesTeamName: teamName,
          salesTeamType: selectedTeamType,
          transferSummary: result.summary,
        },
      })
    } catch (error: any) {
      toast.error("Failed to transfer cylinders. Please try again.")
      // console.error("Bulk cylinder assignment error:", error)

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

  const validateBulkPayload = (payload: any): string[] => {
    const errors: string[] = []

    if (!payload.from_location_id) {
      errors.push("Source location is required")
    }

    if (!payload.to_location_id) {
      errors.push("Destination location is required")
    }

    if (
      payload.from_location_type === payload.to_location_type &&
      payload.from_location_id === payload.to_location_id
    ) {
      errors.push("Source and destination cannot be the same")
    }

    if (!payload.items || payload.items.length === 0) {
      errors.push("At least one cylinder must be selected")
    }

    // Check for duplicate cylinder_ids
    const cylinderIds = payload.items.map((item: any) => item.cylinder_id)
    const duplicates = cylinderIds.filter(
      (id: number, index: number) => cylinderIds.indexOf(id) !== index,
    )
    if (duplicates.length > 0) {
      errors.push(`Duplicate cylinders found: ${duplicates.join(", ")}`)
    }

    return errors
  }

  const handleBack = () => {
    setSelectedTeam(null)
    setSelectedTeamType(null)
    setStoreId("")
    setAssignments([])
  }

  const getTeamDisplayName = (team, type) => {
    return type === "vehicle" ? team.number_plate : team.name
  }

  const groupCylindersByType = () => {
    const grouped = {}

    storeCylinder.forEach((item) => {
      const typeName = item.cylinder?.cylinder_type?.name || "Unknown"
      if (!grouped[typeName]) {
        grouped[typeName] = []
      }
      grouped[typeName].push(item)
    })

    return grouped
  }

  const getAssignmentSummary = () => {
    return assignments.map((assignment) => {
      const cylinderData = storeCylinder.find(
        (item) => item.id === assignment.cylinderId,
      )
      return {
        ...assignment,
        cylinderData,
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
              {team.name && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Driver:</span> {team.name}
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
    const selectedStore = store.find((s) => s.id === storeId)

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
            <h2 className="text-2xl font-bold mb-2">Assignment Summary</h2>
            <p className="text-blue-100">Review before confirming</p>
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
                Selected Cylinders:
              </h3>
              <div className="space-y-3">
                {summaryData.map((item) => (
                  <div
                    key={item.cylinderId}
                    className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl">🛢️</span>
                          <div>
                            <p className="font-semibold text-gray-800">
                              {item.cylinderData?.cylinder?.cylinder_type
                                ?.name || "Unknown"}
                            </p>
                            <p className="text-sm text-gray-600">
                              {item.cylinderData?.cylinder?.weight?.weight ||
                                "N/A"}{" "}
                              kg
                              {item.cylinderData?.cylinder?.display_name &&
                                ` - ${item.cylinderData.cylinder.display_name}`}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">
                          {item.assigned_quantity}
                        </p>
                        <p className="text-xs text-gray-500">cylinders</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <p className="font-semibold text-gray-700">Total Cylinders:</p>
                <p className="text-2xl font-bold text-blue-600">
                  {summaryData.reduce(
                    (sum, item) => sum + item.assigned_quantity,
                    0,
                  )}
                </p>
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="font-semibold text-gray-700">Total Items:</p>
                <p className="text-lg font-medium text-gray-800">
                  {summaryData.length} type{summaryData.length !== 1 ? "s" : ""}
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
              className={`flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold ${
                loadingAssign
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:from-blue-600 hover:to-blue-700 active:scale-95"
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
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-gray-800 font-sans">
          <Navbar
            headerMessage={"ERP"}
            headerText={"Manage your operations with style and clarity"}
          />
          <main className="flex-grow m-2 p-1">
            <ToastContainer />
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
                            Assign Cylinders to{" "}
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
                      </div>
                    </div>
                  </div>

                  <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Select Store to Assign From
                    </label>
                    <select
                      className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
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
                      <div className="text-6xl mb-4">📦</div>
                      <p className="text-gray-500 text-lg">
                        Please select a store to view available cylinders
                      </p>
                    </div>
                  ) : (
                    <div>
                      {storeCylinderStatus === "loading" && (
                        <div className="grid grid-cols-1 gap-4">
                          {[...Array(3)].map((_, index) => (
                            <div
                              key={index}
                              className="mb-4 bg-white p-3 rounded-lg shadow-md"
                            >
                              <h3 className="text-lg font-semibold text-blue-600">
                                <Skeleton
                                  variant="text"
                                  sx={{ fontSize: "1rem" }}
                                />
                              </h3>
                              <div className="mt-3">
                                <Skeleton
                                  variant="rectangular"
                                  height={150}
                                  className="mt-2"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {storeCylinderStatus === "succeeded" &&
                        storeCylinder.length === 0 && (
                          <div className="text-center p-8 bg-white rounded-lg shadow-md">
                            <div className="text-6xl mb-4">🚫</div>
                            <p className="text-gray-500 mb-2 text-lg">
                              No cylinders available in this store.
                            </p>
                            <Link
                              to="/admins/store"
                              className="text-blue-600 hover:underline font-medium"
                            >
                              Manage store inventory
                            </Link>
                          </div>
                        )}

                      {storeCylinderStatus === "succeeded" &&
                        storeCylinder.length > 0 && (
                          <div className="space-y-4">
                            {Object.entries(groupCylindersByType()).map(
                              ([typeName, cylinders]) => (
                                <div
                                  key={typeName}
                                  className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500"
                                >
                                  <h3 className="text-lg font-bold text-blue-600 mb-4 flex items-center">
                                    <span className="mr-2">🛢️</span>
                                    {typeName}
                                  </h3>

                                  <div className="overflow-x-auto">
                                    <table className="w-full border text-sm">
                                      <thead>
                                        <tr className="bg-gradient-to-r from-blue-100 to-blue-200">
                                          <th className="border border-gray-300 px-3 py-2 text-left font-semibold">
                                            Weight
                                          </th>
                                          <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-green-600">
                                            Filled
                                          </th>
                                          <th className="border border-gray-300 px-3 py-2 text-center font-semibold">
                                            Empty
                                          </th>
                                          <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-red-600">
                                            Spoiled
                                          </th>
                                          <th className="border border-gray-300 px-3 py-2 text-center font-semibold">
                                            Total
                                          </th>
                                          <th className="border border-gray-300 px-3 py-2 text-center font-semibold">
                                            Assign
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {cylinders.map((item) => (
                                          <tr
                                            key={item.id}
                                            className="hover:bg-gray-50 transition"
                                          >
                                            <td className="border border-gray-300 px-3 py-2">
                                              <div className="font-medium">
                                                {item.cylinder?.weight
                                                  ?.weight || "N/A"}
                                                kg
                                              </div>
                                              <div className="text-xs text-gray-500">
                                                {item.cylinder?.display_name ||
                                                  ""}
                                              </div>
                                            </td>
                                            <td className="border border-gray-300 px-3 py-2 text-center font-bold text-green-600">
                                              {item.full_cylinder_quantity || 0}
                                            </td>
                                            <td className="border border-gray-300 px-3 py-2 text-center">
                                              {item.empty_cylinder_quantity ||
                                                0}
                                            </td>
                                            <td className="border border-gray-300 px-3 py-2 text-center text-red-600">
                                              {item.spoiled_cylinder_quantity ||
                                                0}
                                            </td>
                                            <td className="border border-gray-300 px-3 py-2 text-center font-semibold">
                                              {item.total_quantity || 0}
                                            </td>
                                            <td className="border border-gray-300 px-3 py-2 text-center">
                                              <input
                                                type="number"
                                                min="0"
                                                max={
                                                  item.full_cylinder_quantity
                                                }
                                                placeholder="0"
                                                className="w-20 border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded px-2 py-1 text-center outline-none transition"
                                                onChange={(e) =>
                                                  handleInputChange(
                                                    item.cylinder.id,
                                                    e.target.value,
                                                    item.full_cylinder_quantity,
                                                  )
                                                }
                                              />
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              ),
                            )}
                          </div>
                        )}

                      {storeCylinderStatus === "failed" && (
                        <div className="text-center p-8 bg-red-50 rounded-lg shadow-md">
                          <div className="text-6xl mb-4">⚠️</div>
                          <p className="text-red-500 font-medium text-lg">
                            Failed to load store data. Please try again later.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-6 text-center sticky bottom-0 bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] pt-4 pb-2">
                    {storeCylinderStatus === "succeeded" &&
                      storeCylinder.length > 0 &&
                      storeId && (
                        <button
                          className={`w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg shadow-lg font-semibold text-lg ${
                            assignments.length === 0
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:from-blue-600 hover:to-blue-700 active:scale-95"
                          } transition-all duration-200`}
                          onClick={handleShowSummary}
                          disabled={assignments.length === 0}
                        >
                          Review Assignment
                          {assignments.length > 0
                            ? ` (${assignments.length})`
                            : ""}
                        </button>
                      )}
                  </div>
                </div>
              )}
            </div>
          </main>

          {showSummary && <SummaryModal />}

          <footer className="text-white">
            <AdminsFooter />
          </footer>
        </div>
      ) : (
        <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0]">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Mobile View Only
            </h2>
            <p className="text-gray-600">
              The Assign Cylinders page is optimized for mobile devices. Please
              access this feature on a smartphone or tablet for the best
              experience.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default AssignCylinders
