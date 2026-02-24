// @ts-nocheck
import React, { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { useNavigate } from "react-router-dom"
import {
  fetchSalesTeamShops,
  selectAllSalesTeamShops,
} from "../features/salesTeam/salesTeamSlice"
import { fetchStore, selectAllStore } from "../features/store/storeSlice"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp"
import {
  fetchEmployees,
  selectAllEmployees,
} from "../features/employees/employeesSlice"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import AdminNav from "../components/ui/AdminNav"
import AdminsFooter from "../components/AdminsFooter"
import planStatus from "../features/planStatus/planStatus"
import api from "../../utils/api"
import Navbar from "../components/ui/mobile/admin/Navbar"
import {
  fetchSalesTeamVehicle,
  selectAllSalesTeamVehicle,
} from "../features/salesTeam/salesTeamVehicleSlice"
import Skeleton from "@mui/material/Skeleton"
import { toast } from "react-toastify"

const CollectCylinders = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const allSalesShop = useAppSelector(selectAllSalesTeamShops)
  const allSalesVehicle = useAppSelector(selectAllSalesTeamVehicle)
  const store = useAppSelector(selectAllStore)
  const employees = useAppSelector(selectAllEmployees)
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [selectedTeamType, setSelectedTeamType] = useState(null)
  const [activeTab, setActiveTab] = useState("shops")
  const [assignedCylinders, setAssignedCylinders] = useState([])
  const [expandedRows, setExpandedRows] = useState({})
  const [loadingReturnAll, setLoadingReturnAll] = useState(false)
  const [loadingReturnSome, setLoadingReturnSome] = useState(false)
  const [selectedDestinationStore, setSelectedDestinationStore] = useState(null)

  // New state for loss reporting
  const [lossReports, setLossReports] = useState({})
  const [loadingLossReports, setLoadingLossReports] = useState({})
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState({})
  const [selectedEmployee, setSelectedEmployee] = useState({})

  // State for tracking expected vs actual counts
  const [expectedCounts, setExpectedCounts] = useState({})
  const [actualCounts, setActualCounts] = useState({})

  const [loading, setLoading] = useState(false)

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

  useEffect(() => {
    if (businessId) {
      dispatch(fetchSalesTeamShops())
      dispatch(fetchSalesTeamVehicle())
      dispatch(fetchEmployees())
    }
  }, [dispatch, businessId])

  useEffect(() => {
    if (selectedTeam && businessId) {
      dispatch(fetchStore({ businessId }))
    }
  }, [selectedTeam, businessId, dispatch])

  // Auto-select store if only one is available
  useEffect(() => {
    if (
      Array.isArray(store) &&
      store.length === 1 &&
      !selectedDestinationStore
    ) {
      setSelectedDestinationStore(store[0])
    }
  }, [store, selectedDestinationStore])

  useEffect(() => {
    if (selectedTeam) {
      setLoading(true)
      const endpoint =
        selectedTeamType === "vehicle"
          ? `/inventory/vehicles/${selectedTeam.id}/cylinders/`
          : `/inventory/shops/${selectedTeam.id}/cylinders/`

      api
        .get(endpoint)
        .then((response) => {
          setAssignedCylinders(response.data)
          // Reset states when new data is loaded
          setExpandedRows({})
          setLossReports({})
          setSelectedEmployee({})
          setShowEmployeeDropdown({})
          setExpectedCounts({})
          setActualCounts({})
        })
        .catch((error) =>
          console.error("Error fetching assigned cylinders:", error),
        )
        .finally(() => setLoading(false))
    }
  }, [selectedTeam, selectedTeamType])

  console.log("assigned cylinders ", assignedCylinders)

  const getTeamDisplayName = (team, type) => {
    return type === "vehicle" ? team.number_plate : team.name
  }

  const handleSelectTeam = (team, type) => {
    setSelectedTeam(team)
    setSelectedTeamType(type)
    setAssignedCylinders([])
    setExpandedRows({})
    setSelectedDestinationStore(null)
  }

  const handleBack = () => {
    setSelectedTeam(null)
    setSelectedTeamType(null)
    setAssignedCylinders([])
    setExpandedRows({})
    setSelectedDestinationStore(null)
  }

  // Toggle row expansion
  const toggleRowExpansion = (cylinderId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [cylinderId]: !prev[cylinderId],
    }))
  }

  // Handle row click - toggle expansion
  const handleRowClick = (cylinderId) => {
    toggleRowExpansion(cylinderId)
  }

  // Handle employee dropdown toggle
  const handleToggleDropdown = (cylinderId) => {
    setShowEmployeeDropdown((prev) => ({
      ...prev,
      [cylinderId]: !prev[cylinderId],
    }))
  }

  // Handle employee selection
  const handleSelectEmployee = (cylinderId, employeeId) => {
    setSelectedEmployee((prev) => ({
      ...prev,
      [cylinderId]: employeeId,
    }))
    setShowEmployeeDropdown((prev) => ({
      ...prev,
      [cylinderId]: false,
    }))
  }

  // Handle loss report changes
  const handleLossReportChange = (cylinderId, field, value) => {
    setLossReports((prev) => ({
      ...prev,
      [cylinderId]: {
        ...prev[cylinderId],
        [field]: parseInt(value, 10) || 0,
      },
    }))
  }

  // Handle expected/actual count changes
  const handleExpectedCountChange = (cylinderId, field, value) => {
    setExpectedCounts((prev) => ({
      ...prev,
      [cylinderId]: {
        ...prev[cylinderId],
        [field]: parseInt(value, 10) || 0,
      },
    }))
  }

  const handleActualCountChange = (cylinderId, field, value) => {
    setActualCounts((prev) => ({
      ...prev,
      [cylinderId]: {
        ...prev[cylinderId],
        [field]: parseInt(value, 10) || 0,
      },
    }))
  }

  // Calculate losses based on expected vs actual counts
  const calculateLossesFromCounts = (cylinderId) => {
    const cylinder = assignedCylinders.find((c) => c.id === cylinderId)
    if (!cylinder) return { filled_lost: 0, empties_lost: 0, less_pay: 0 }

    // Use only the user-entered values, don't fall back to cylinder quantities
    const expectedFull = expectedCounts[cylinderId]?.full_count || 0
    const expectedEmpty = expectedCounts[cylinderId]?.empty_count || 0
    const actualFull = actualCounts[cylinderId]?.full_count || 0
    const actualEmpty = actualCounts[cylinderId]?.empty_count || 0

    // Calculate differences: expected minus actual
    const filledLost = Math.max(0, expectedFull - actualFull)
    const emptiesLost = Math.max(0, expectedEmpty - actualEmpty)

    // For less_pay: if there's a shortage in empties AND we suspect money is missing
    // This would need business logic based on sales records
    const lessPay = 0 // To be calculated based on sales reconciliation

    return {
      filled_lost: filledLost,
      empties_lost: emptiesLost,
      less_pay: lessPay,
    }
  }

  // Report cylinder loss using the new API
  const handleReportLoss = (inventoryId) => {
    const lossData = lossReports[inventoryId]
    const employeeId = selectedEmployee[inventoryId]

    if (!lossData) {
      toast.error("Please enter loss details")
      return
    }

    if (!employeeId) {
      toast.error("Please select an employee")
      return
    }

    // Get the cylinder record to access the actual cylinder ID
    const cylinder = assignedCylinders.find((c) => c.id === inventoryId)
    if (!cylinder) {
      toast.error("Cylinder not found")
      return
    }

    // Determine loss type based on what's being reported
    let lossType = ""
    let quantity = 0
    let amount = null

    if (lossData.filled_lost > 0) {
      lossType = "FILLED"
      quantity = lossData.filled_lost
    } else if (lossData.empties_lost > 0) {
      lossType = "EMPTY"
      quantity = lossData.empties_lost
    } else if (lossData.less_pay > 0) {
      lossType = "LESS_PAY"
      quantity = lossData.less_pay
      // For less_pay, amount should be calculated based on cylinder price
      if (cylinder && cylinder.cylinder?.retail_refill_price) {
        amount = cylinder.cylinder.retail_refill_price * quantity
      } else {
        amount = 0 // Default amount if price not available
      }
    } else {
      toast.error("Please enter at least one loss quantity")
      return
    }

    setLoadingLossReports((prev) => ({ ...prev, [inventoryId]: true }))

    const payload = {
      location_type: selectedTeamType === "shop" ? "SHOP" : "VEHICLE",
      location_id: selectedTeam.id,
      cylinder_id: cylinder.cylinder.id,
      loss_type: lossType,
      quantity: quantity,
      amount: amount,
      employee_id: employeeId,
      notes: `Reported during collection from ${getTeamDisplayName(
        selectedTeam,
        selectedTeamType,
      )}`,
    }

    api
      .post("/inventory/losses/report/", payload)
      .then((response) => {
        toast.success("Loss reported successfully")

        const newLoss = response.data.loss

        // Update local state to reflect the loss
        setAssignedCylinders((prev) =>
          prev.map((cyl) =>
            cyl.id === cylinderId
              ? {
                  ...cyl,
                  // Update totals based on loss type
                  full_cylinder_quantity:
                    lossType === "FILLED"
                      ? Math.max(0, cyl.full_cylinder_quantity - quantity)
                      : cyl.full_cylinder_quantity,
                  empty_cylinder_quantity:
                    lossType === "EMPTY"
                      ? Math.max(0, cyl.empty_cylinder_quantity - quantity)
                      : cyl.empty_cylinder_quantity,
                  // Add to loss totals
                  filled_lost_total:
                    lossType === "FILLED"
                      ? (cyl.filled_lost_total || 0) + quantity
                      : cyl.filled_lost_total || 0,
                  empties_lost_total:
                    lossType === "EMPTY"
                      ? (cyl.empties_lost_total || 0) + quantity
                      : cyl.empties_lost_total || 0,
                  less_pay_total:
                    lossType === "LESS_PAY"
                      ? (cyl.less_pay_total || 0) + (amount || 0)
                      : cyl.less_pay_total || 0,
                  // Add new loss to recent_losses array
                  recent_losses: [newLoss, ...(cyl.recent_losses || [])],
                }
              : cyl,
          ),
        )

        // Clear the form
        setLossReports((prev) => ({
          ...prev,
          [cylinderId]: { filled_lost: 0, empties_lost: 0, less_pay: 0 },
        }))
      })
      .catch((error) => {
        console.error("Error reporting loss:", error)
        toast.error(error.response?.data?.message || "Failed to report loss")
      })
      .finally(() =>
        setLoadingLossReports((prev) => ({ ...prev, [cylinderId]: false })),
      )
  }

  // Report losses based on expected vs actual counts
  const handleReportLossesFromCounts = (cylinderId) => {
    const employeeId = selectedEmployee[cylinderId]

    if (!employeeId) {
      toast.error("Please select an employee")
      return
    }

    const losses = calculateLossesFromCounts(cylinderId)
    const cylinder = assignedCylinders.find((c) => c.id === cylinderId)

    if (!cylinder) {
      toast.error("Cylinder not found")
      return
    }

    if (!losses.filled_lost && !losses.empties_lost) {
      toast.error("No losses detected based on counts")
      return
    }

    setLoadingLossReports((prev) => ({ ...prev, [cylinderId]: true }))

    // Create multiple loss reports if needed
    const promises = []

    if (losses.filled_lost > 0) {
      const payload = {
        location_type: selectedTeamType === "shop" ? "SHOP" : "VEHICLE",
        location_id: selectedTeam.id,
        cylinder_id: cylinder.cylinder.id,
        loss_type: "FILLED",
        quantity: losses.filled_lost,
        employee_id: employeeId,
        notes: `Based on physical count from ${getTeamDisplayName(
          selectedTeam,
          selectedTeamType,
        )}`,
      }
      promises.push(api.post("/inventory/losses/report/", payload))
    }

    if (losses.empties_lost > 0) {
      const payload = {
        location_type: selectedTeamType === "shop" ? "SHOP" : "VEHICLE",
        location_id: selectedTeam.id,
        cylinder_id: cylinder.cylinder.id,
        loss_type: "EMPTY",
        quantity: losses.empties_lost,
        employee_id: employeeId,
        notes: `Based on physical count from ${getTeamDisplayName(
          selectedTeam,
          selectedTeamType,
        )}`,
      }
      promises.push(api.post("/inventory/losses/report/", payload))
    }

    if (promises.length === 0) {
      toast.error("No losses to report")
      setLoadingLossReports((prev) => ({ ...prev, [cylinderId]: false }))
      return
    }

    Promise.all(promises)
      .then((responses) => {
        // Extract loss data from all responses
        const newLosses = responses.map((response) => response.data.loss)

        toast.success("Losses reported successfully")

        // Update local state with new losses
        setAssignedCylinders((prev) =>
          prev.map((cyl) =>
            cyl.id === cylinderId
              ? {
                  ...cyl,
                  full_cylinder_quantity: Math.max(
                    0,
                    cyl.full_cylinder_quantity - losses.filled_lost,
                  ),
                  empty_cylinder_quantity: Math.max(
                    0,
                    cyl.empty_cylinder_quantity - losses.empties_lost,
                  ),
                  filled_lost_total:
                    (cyl.filled_lost_total || 0) + losses.filled_lost,
                  empties_lost_total:
                    (cyl.empties_lost_total || 0) + losses.empties_lost,
                  // Add new losses to the recent_losses array
                  recent_losses: [...newLosses, ...(cyl.recent_losses || [])],
                }
              : cyl,
          ),
        )

        // Clear counts
        setExpectedCounts((prev) => ({
          ...prev,
          [cylinderId]: { full_count: 0, empty_count: 0 },
        }))
        setActualCounts((prev) => ({
          ...prev,
          [cylinderId]: { full_count: 0, empty_count: 0 },
        }))
      })
      .catch((error) => {
        console.error("Error reporting losses:", error)
        toast.error(error.response?.data?.message || "Failed to report losses")
      })
      .finally(() =>
        setLoadingLossReports((prev) => ({ ...prev, [cylinderId]: false })),
      )
  }

  // POST /api/inventory/transfer/empty/all/
  // POST /api/inventory/transfer/empty/spoiled-only/
  // Handle return operations
  const handleReturnCylinders = () => {
    if (!selectedDestinationStore) {
      toast.error("Please select a destination store")
      return
    }
    setLoadingReturnSome(true)
    const payload = {
      location_type: selectedTeamType === "shop" ? "SHOP" : "VEHICLE",
      location_id: selectedTeam.id,
      destination_store_id: selectedDestinationStore.id,
    }
    api
      .post("/inventory/transfer/empty/spoiled-only/", payload)
      .then((response) => {
        toast.success(
          response.data.message || "Cylinders transferred successfully",
        )
        navigate(`/admins/printcollect/${selectedTeam?.id}`, {
          state: {
            salesTeamName: getTeamDisplayName(selectedTeam, selectedTeamType),
            salesTeamType: selectedTeamType,
            receiptData: response.data,
          },
        })
      })
      .catch((error) => {
        console.error("Error in cylinder Collection.", error)
        toast.error(
          error.response?.data?.message || "Failed to transfer cylinders",
        )
      })
      .finally(() => setLoadingReturnSome(false))
  }

  const handleReturnAllCylinders = () => {
    if (!selectedDestinationStore) {
      toast.error("Please select a destination store")
      return
    }
    setLoadingReturnAll(true)
    const payload = {
      location_type: selectedTeamType === "shop" ? "SHOP" : "VEHICLE",
      location_id: selectedTeam.id,
      destination_store_id: selectedDestinationStore.id,
    }
    api
      .post("/inventory/transfer/empty/all/", payload)
      .then((response) => {
        toast.success(
          response.data.message || "Cylinders transferred successfully",
        )
        navigate(`/admins/printallcollect/${selectedTeam?.id}`, {
          state: {
            salesTeamName: getTeamDisplayName(selectedTeam, selectedTeamType),
            salesTeamType: selectedTeamType,
            receiptData: response.data,
          },
        })
      })
      .catch((error) => {
        console.error("Error in cylinder Collection.", error)
        toast.error(
          error.response?.data?.message || "Failed to transfer cylinders",
        )
      })
      .finally(() => setLoadingReturnAll(false))
  }

  const filteredEmployees = employees.filter((employee) => {
    const assigned = employee.assigned_to || employee.asigned_to
    if (!assigned || !selectedTeam) return false

    if (selectedTeamType === "vehicle") {
      return (
        assigned.type === "Vehicle" && assigned.vehicle_id === selectedTeam.id
      )
    }

    return assigned.type === "Shop" && assigned.shop_id === selectedTeam.id
  })

  // Calculate display values for the table
  const calculateDisplayValues = (cylinder) => {
    const filledLost = cylinder.filled_lost_total || 0
    const emptiesLost = cylinder.empties_lost_total || 0
    const lessPay = cylinder.less_pay_total || 0

    // Original quantities
    const originalFull = cylinder.full_cylinder_quantity + filledLost
    const originalEmpty = cylinder.empty_cylinder_quantity + emptiesLost

    // For less_pay: if it's a filled cylinder not returned and money missing,
    // it should show as deducted from filled
    const lessPayAsFilled = Math.min(
      lessPay > 0 ? 1 : 0,
      originalFull - filledLost,
    )

    return {
      // Display: Original (Lost) = Remaining
      fullDisplay: `${originalFull} (${filledLost}) = ${cylinder.full_cylinder_quantity}`,
      emptyDisplay: `${originalEmpty} (${emptiesLost}) = ${cylinder.empty_cylinder_quantity}`,
      // For tooltip/details
      originalFull,
      originalEmpty,
      filledLost: filledLost + lessPayAsFilled,
      emptiesLost,
      lessPayAmount: lessPay,
      hasLessPay: lessPay > 0,
    }
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

  // Render expanded row details
  const renderExpandedRow = (cylinder) => {
    const isExpanded = expandedRows[cylinder.id]
    if (!isExpanded) return null

    const displayValues = calculateDisplayValues(cylinder)
    const lossReport = lossReports[cylinder.id] || {
      filled_lost: 0,
      empties_lost: 0,
      less_pay: 0,
    }
    const expectedCount = expectedCounts[cylinder.id] || {
      full_count: 0,
      empty_count: 0,
    }
    const actualCount = actualCounts[cylinder.id] || {
      full_count: 0,
      empty_count: 0,
    }

    return (
      <tr key={`details-${cylinder.id}`} className="bg-blue-50">
        <td colSpan="6" className="p-4 border border-gray-300">
          <div className="bg-white rounded-lg p-4 shadow-inner">
            <div className="mb-4 pb-3 border-b-2 border-gray-200">
              <h3 className="text-lg font-bold text-blue-600 flex items-center">
                <span className="mr-2">🛢️</span>
                {cylinder.cylinder?.cylinder_type?.name || "Unknown"} -{" "}
                {cylinder.cylinder?.weight?.weight || "N/A"}kg
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {selectedTeamType}:{" "}
                {getTeamDisplayName(selectedTeam, selectedTeamType)}
              </p>
            </div>

            {/* Current Status */}
            {/* <div className="bg-green-50 p-3 rounded-lg">
  <p className="text-xs text-gray-600 font-medium">Full ssCylinders</p>
  <p className="text-2xl font-bold text-green-600">
    {cylinder.full_cylinder_quantity || 0}
  </p>
  {cylinder.recent_losses && cylinder.recent_losses.some(loss => loss.loss_type === "FILLED") && (
    <div className="mt-1">
      <p className="text-xs text-red-600 font-medium">Recent Filled Losses:</p>
      {cylinder.recent_losses
        .filter(loss => loss.loss_type === "FILLED")
        .map((loss, idx) => (
          <p key={idx} className="text-xs text-red-600">
            • {loss.quantity} on {new Date(loss.created_at).toLocaleDateString()}
          </p>
        ))
      }
    </div>
  )}
</div> */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 font-medium">
                  Full Cylinders
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {cylinder.full_cylinder_quantity || 0}
                </p>
                <p className="text-xs text-red-600">
                  {cylinder?.recent_losses[0]?.loss_type === "FILLED" &&
                    `${cylinder?.recent_losses[0]?.quantity} lost`}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 font-medium">
                  Empty Cylinders
                </p>
                <p className="text-2xl font-bold text-gray-600">
                  {cylinder.empty_cylinder_quantity || 0}
                </p>
                <p className="text-xs text-red-600">
                  {/* {displayValues.emptiesLost} lost */}
                  {cylinder?.recent_losses[0]?.loss_type === "EMPTY" &&
                    `${cylinder?.recent_losses[0]?.quantity} loss`}
                </p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 font-medium">Spoiled</p>
                <p className="text-2xl font-bold text-red-600">
                  {cylinder.spoiled_cylinder_quantity || 0}
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 font-medium">Total</p>
                <p className="text-2xl font-bold text-blue-600">
                  {cylinder.total_quantity || 0}
                </p>
              </div>
            </div>

            {/* Loss Summary */}
            {((cylinder.filled_lost_total || 0) > 0 ||
              (cylinder.empties_lost_total || 0) > 0 ||
              (cylinder.less_pay_total || 0) > 0) && (
              <div>
                {renderLossDetails(cylinder)}
                {/* {(cylinder.filled_lost_total || 0) > 0 && (
                  <p className="text-sm text-gray-700">
                    ❌ Filled Lost:{" "}
                    <span className="font-bold text-red-600">
                      {cylinder.filled_lost_total}
                    </span>
                  </p>
                )}
                {(cylinder.empties_lost_total || 0) > 0 && (
                  <p className="text-sm text-gray-700">
                    ❌ Empties Lost:{" "}
                    <span className="font-bold text-red-600">
                      {cylinder.empties_lost_total}
                    </span>
                  </p>
                )}
                {(cylinder.less_pay_total || 0) > 0 && (
                  <p className="text-sm text-gray-700">
                    💰 Less Payment (Money Missing):{" "}
                    <span className="font-bold text-orange-600">
                      Ksh {cylinder.less_pay_total}
                    </span>
                  </p>
                )} */}
              </div>
            )}

            {/* Counting Method Form */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-800 mb-2">
                Physical Count Method
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Expected Full
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={displayValues.originalFull}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Expected"
                    value={expectedCount.full_count}
                    onChange={(e) =>
                      handleExpectedCountChange(
                        cylinder.id,
                        "full_count",
                        e.target.value,
                      )
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Expected Empty
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={displayValues.originalEmpty}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Expected"
                    value={expectedCount.empty_count}
                    onChange={(e) =>
                      handleExpectedCountChange(
                        cylinder.id,
                        "empty_count",
                        e.target.value,
                      )
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Actual Counted Full
                  </label>
                  <input
                    type="number"
                    min={0}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Actual"
                    value={actualCount.full_count}
                    onChange={(e) =>
                      handleActualCountChange(
                        cylinder.id,
                        "full_count",
                        e.target.value,
                      )
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Actual Counted Empty
                  </label>
                  <input
                    type="number"
                    min={0}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Actual"
                    value={actualCount.empty_count}
                    onChange={(e) =>
                      handleActualCountChange(
                        cylinder.id,
                        "empty_count",
                        e.target.value,
                      )
                    }
                  />
                </div>
              </div>
              <button
                onClick={() => handleReportLossesFromCounts(cylinder.id)}
                className={`w-full mt-2 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-md font-semibold transition ${
                  loadingLossReports[cylinder.id] ||
                  !selectedEmployee[cylinder.id]
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={
                  loadingLossReports[cylinder.id] ||
                  !selectedEmployee[cylinder.id]
                }
              >
                {loadingLossReports[cylinder.id]
                  ? "Processing..."
                  : "Report Losses from Count"}
              </button>
            </div>

            {/* Direct Loss Reporting Form */}
            <div className="grid grid-cols-1 gap-4">
              {/* Employee Selection */}
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <label className="block text-sm font-semibold text-blue-800 mb-2">
                  Assign Responsibility
                  {selectedEmployee[cylinder.id] && (
                    <span className="text-green-600 ml-1">
                      (Assigned:{" "}
                      {
                        filteredEmployees.find(
                          (emp) => emp.id === selectedEmployee[cylinder.id],
                        )?.first_name
                      }
                      )
                    </span>
                  )}
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => handleToggleDropdown(cylinder.id)}
                    className="w-full p-2 bg-white border-2 border-blue-300 rounded-md hover:bg-gray-50 flex justify-between items-center"
                  >
                    <span>
                      {selectedEmployee[cylinder.id]
                        ? filteredEmployees.find(
                            (emp) => emp.id === selectedEmployee[cylinder.id],
                          )?.first_name +
                          " " +
                          filteredEmployees.find(
                            (emp) => emp.id === selectedEmployee[cylinder.id],
                          )?.last_name
                        : "Select Employee"}
                    </span>
                    <KeyboardArrowDownIcon />
                  </button>
                  {showEmployeeDropdown[cylinder.id] && (
                    <div className="absolute top-full left-0 mt-1 z-10 w-full bg-white border-2 border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                      {filteredEmployees.map((employee) => (
                        <div
                          key={employee.id}
                          className={`p-3 cursor-pointer hover:bg-blue-50 transition ${
                            selectedEmployee[cylinder.id] === employee.id
                              ? "bg-blue-100 font-semibold"
                              : ""
                          }`}
                          onClick={() =>
                            handleSelectEmployee(cylinder.id, employee.id)
                          }
                        >
                          {employee.first_name} {employee.last_name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Loss Reporting Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleReportLoss(cylinder.id)
                }}
                className="bg-red-50 p-3 rounded-lg border border-red-200"
              >
                <h4 className="text-sm font-semibold text-red-800 mb-2">
                  Report Specific Loss
                </h4>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Filled Lost
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={cylinder.full_cylinder_quantity}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Qty"
                      value={lossReport.filled_lost}
                      onChange={(e) =>
                        handleLossReportChange(
                          cylinder.id,
                          "filled_lost",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Empty Lost
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={cylinder.empty_cylinder_quantity}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Qty"
                      value={lossReport.empties_lost}
                      onChange={(e) =>
                        handleLossReportChange(
                          cylinder.id,
                          "empties_lost",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Less Pay (Qty)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={
                        cylinder.full_cylinder_quantity +
                        cylinder.empty_cylinder_quantity
                      }
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Qty"
                      value={lossReport.less_pay}
                      onChange={(e) =>
                        handleLossReportChange(
                          cylinder.id,
                          "less_pay",
                          e.target.value,
                        )
                      }
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Empty not returned + money missing
                    </p>
                  </div>
                </div>
                <button
                  type="submit"
                  className={`w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md font-semibold transition ${
                    loadingLossReports[cylinder.id] ||
                    !selectedEmployee[cylinder.id] ||
                    (!lossReport.filled_lost &&
                      !lossReport.empties_lost &&
                      !lossReport.less_pay)
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={
                    loadingLossReports[cylinder.id] ||
                    !selectedEmployee[cylinder.id] ||
                    (!lossReport.filled_lost &&
                      !lossReport.empties_lost &&
                      !lossReport.less_pay)
                  }
                >
                  {loadingLossReports[cylinder.id]
                    ? "Processing..."
                    : "Report Loss"}
                </button>
              </form>
            </div>
          </div>
        </td>
      </tr>
    )
  }

  // Add this function to render loss details in the expanded row
  const renderLossDetails = (cylinder) => {
    if (!cylinder.recent_losses || cylinder.recent_losses.length === 0) {
      return null
    }

    return (
      <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
        <h4 className="text-sm font-semibold text-yellow-800 mb-2 flex items-center">
          <span className="mr-2">⚠️</span>
          Recent Loss Reports
        </h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {cylinder.recent_losses.map((loss, index) => (
            <div
              key={loss.id || index}
              className="p-2 bg-white rounded border border-gray-200"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-medium text-gray-700">
                    {loss.loss_type === "FILLED" && "🔴 Filled Cylinder Lost"}
                    {loss.loss_type === "EMPTY" && "⚫ Empty Cylinder Lost"}
                    {loss.loss_type === "LESS_PAY" && "💰 Less Payment"}
                  </p>
                  <p className="text-xs text-gray-600">
                    Qty: <span className="font-bold">{loss.quantity}</span>
                    {loss.amount && loss.amount !== "0.00" && (
                      <span className="ml-2">
                        Amount:{" "}
                        <span className="font-bold">Ksh {loss.amount}</span>
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500">
                    Responsible to:{" "}
                    {loss.employee_details?.full_name || "Unknown"}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      loss.status === "PENDING"
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {loss.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(loss.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {loss.notes && (
                <p className="text-xs text-gray-600 mt-1 italic">
                  "{loss.notes}"
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] min-h-screen flex flex-col">
      <Navbar
        headerMessage={"ERP"}
        headerText={"Collect cylinders from sales teams"}
      />

      <main className="flex-grow m-2 p-1">
        {!selectedTeam ? (
          <div>
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
              Select a Sales Team
            </h2>

            {/* Tab Navigation */}
            <div className="flex mb-6 bg-white rounded-lg shadow-md overflow-hidden">
              <button
                onClick={() => setActiveTab("shops")}
                className={`flex-1 py-3 px-4 font-semibold transition-all duration-200 ${
                  activeTab === "shops"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                🏪 Shop Teams ({allSalesShop.length})
              </button>
              <button
                onClick={() => setActiveTab("vehicles")}
                className={`flex-1 py-3 px-4 font-semibold transition-all duration-200 ${
                  activeTab === "vehicles"
                    ? "bg-green-500 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                🚚 Vehicle Teams ({allSalesVehicle.length})
              </button>
            </div>

            {/* Shop Teams Tab */}
            {activeTab === "shops" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allSalesShop.length === 0 ? (
                  <div className="col-span-2 text-center p-8 bg-white rounded-lg shadow-md">
                    <div className="text-6xl mb-4">🏪</div>
                    <p className="text-gray-500 mb-2">
                      No shop sales teams available.
                    </p>
                  </div>
                ) : (
                  allSalesShop.map((team) => renderTeamCard(team, "shop"))
                )}
              </div>
            )}

            {/* Vehicle Teams Tab */}
            {activeTab === "vehicles" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allSalesVehicle.length === 0 ? (
                  <div className="col-span-2 text-center p-8 bg-white rounded-lg shadow-md">
                    <div className="text-6xl mb-4">🚚</div>
                    <p className="text-gray-500 mb-2">
                      No vehicle sales teams available.
                    </p>
                  </div>
                ) : (
                  allSalesVehicle.map((team) => renderTeamCard(team, "vehicle"))
                )}
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* Header with Back Button */}
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
                <h2 className="text-xl font-bold text-gray-800">
                  Collect Cylinders from{" "}
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

            {/* Destination Store Selection */}
            <div className="mb-4 bg-white p-4 rounded-lg shadow-md border-l-4 border-yellow-400">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📍 Select Destination Store
              </label>
              <p className="text-xs text-gray-500 mb-3">
                {Array.isArray(store) && store.length === 1
                  ? "Only one store available - automatically selected"
                  : "Choose where the cylinders will be returned to"}
              </p>
              {!Array.isArray(store) || store.length === 0 ? (
                <p className="text-gray-500 text-sm">Loading stores...</p>
              ) : (
                <div>
                  <select
                    value={selectedDestinationStore?.id || ""}
                    onChange={(e) => {
                      const storeId = parseInt(e.target.value, 10)
                      const selected = store.find((s) => s.id === storeId)
                      setSelectedDestinationStore(selected || null)
                    }}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white text-gray-800 font-medium"
                    disabled={store.length === 1}
                  >
                    <option value="">
                      {store.length === 1
                        ? `${store[0].name} (Only store)`
                        : "Select a store..."}
                    </option>
                    {store.length > 1 &&
                      store.map((storeItem) => {
                        const locationName =
                          typeof storeItem.location === "object"
                            ? storeItem.location?.name || storeItem.location
                            : storeItem.location
                        return (
                          <option key={storeItem.id} value={storeItem.id}>
                            {storeItem.name}{" "}
                            {locationName ? `(${locationName})` : ""}
                          </option>
                        )
                      })}
                  </select>
                </div>
              )}
              {selectedDestinationStore && (
                <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200 text-sm flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="font-semibold text-blue-700">
                    Destination: {selectedDestinationStore.name}
                  </span>
                </div>
              )}
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-lg shadow-md"
                  >
                    <Skeleton variant="text" height={28} width="60%" />
                    <Skeleton
                      variant="rectangular"
                      height={150}
                      className="mt-3"
                    />
                  </div>
                ))}
              </div>
            ) : assignedCylinders.length > 0 ? (
              <>
                {/* Summary Table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gradient-to-r from-blue-100 to-blue-200">
                          <th className="border border-gray-300 px-3 py-2 text-left font-semibold">
                            Gas Type
                          </th>
                          <th className="border border-gray-300 px-3 py-2 text-center font-semibold">
                            Weight
                          </th>
                          <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-green-600">
                            Full
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
                        </tr>
                      </thead>
                      <tbody>
                        {assignedCylinders.map((cylinder) => {
                          const displayValues = calculateDisplayValues(cylinder)
                          return (
                            <React.Fragment key={cylinder.id}>
                              <tr
                                className={`hover:bg-gray-50 transition cursor-pointer ${
                                  expandedRows[cylinder.id] ? "bg-blue-50" : ""
                                }`}
                                onClick={() => handleRowClick(cylinder.id)}
                              >
                                <td className="border border-gray-300 px-3 py-2">
                                  <div className="flex items-center">
                                    <span className="mr-2">
                                      {expandedRows[cylinder.id] ? "▼" : "▶"}
                                    </span>
                                    {cylinder.cylinder?.cylinder_type?.name ||
                                      "N/A"}
                                  </div>
                                </td>
                                <td className="border border-gray-300 px-3 py-2 text-center font-medium">
                                  {cylinder.cylinder?.weight?.weight || "N/A"}kg
                                </td>
                                <td className="border border-gray-300 px-3 py-2 text-center font-bold text-green-600">
                                  <div className="flex flex-col">
                                    <span>{displayValues.fullDisplay}</span>
                                    {/* {displayValues.hasLessPay && (
                                      <span className="text-xs text-orange-600 font-medium">
                                        💰 Ksh {displayValues.lessPayAmount}
                                      </span>
                                    )} */}
                                  </div>
                                </td>
                                <td className="border border-gray-300 px-3 py-2 text-center">
                                  {displayValues.emptyDisplay}
                                </td>
                                <td className="border border-gray-300 px-3 py-2 text-center text-red-600">
                                  {cylinder.spoiled_cylinder_quantity || 0}
                                </td>
                                <td className="border border-gray-300 px-3 py-2 text-center font-semibold">
                                  {cylinder.total_quantity || 0}
                                </td>
                              </tr>
                              {renderExpandedRow(cylinder)}
                            </React.Fragment>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-2 bg-gray-50 text-xs text-gray-600 border-t">
                    <p>
                      <strong>Display Format:</strong> Original (Lost) =
                      Remaining
                    </p>
                    <p>
                      <strong>Less Pay: </strong>
                      Money missing
                    </p>
                  </div>
                </div>

                {/* Expand All / Collapse All buttons */}
                <div className="flex justify-between mb-4">
                  <button
                    onClick={() => {
                      const allExpanded = assignedCylinders.every(
                        (cyl) => expandedRows[cyl.id],
                      )
                      const newExpandedState = {}
                      assignedCylinders.forEach((cyl) => {
                        newExpandedState[cyl.id] = !allExpanded
                      })
                      setExpandedRows(newExpandedState)
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {assignedCylinders.every((cyl) => expandedRows[cyl.id])
                      ? "Collapse All"
                      : "Expand All"}
                  </button>
                  <p className="text-sm text-gray-600">
                    Click on any row to view details and report losses
                  </p>
                </div>

                {/* Action Buttons */}
                {!selectedDestinationStore && (
                  <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                    <p className="text-sm text-yellow-700">
                      ⚠️ Please select a destination store above to proceed with
                      cylinder collection
                    </p>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sticky bottom-2 bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] pt-4 pb-2">
                  <button
                    className={`bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-6 py-3 rounded-lg shadow-lg transition-all ${
                      loadingReturnAll || !selectedDestinationStore
                        ? "opacity-50 cursor-not-allowed"
                        : "active:scale-95"
                    }`}
                    onClick={handleReturnAllCylinders}
                    disabled={loadingReturnAll || !selectedDestinationStore}
                  >
                    {loadingReturnAll ? (
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
                        Processing...
                      </span>
                    ) : (
                      "Return All Cylinders"
                    )}
                  </button>
                  <button
                    className={`bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold px-6 py-3 rounded-lg shadow-lg transition-all ${
                      loadingReturnSome || !selectedDestinationStore
                        ? "opacity-50 cursor-not-allowed"
                        : "active:scale-95"
                    }`}
                    onClick={handleReturnCylinders}
                    disabled={loadingReturnSome || !selectedDestinationStore}
                  >
                    {loadingReturnSome ? (
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
                        Processing...
                      </span>
                    ) : (
                      "Return Empty & Spoiled"
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center p-12 bg-white rounded-lg shadow-md">
                <div className="text-6xl mb-4">📦</div>
                <p className="text-gray-500 text-lg">
                  No cylinders assigned to this team yet.
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="text-white">
        <AdminsFooter />
      </footer>
    </div>
  )
}

export default CollectCylinders
