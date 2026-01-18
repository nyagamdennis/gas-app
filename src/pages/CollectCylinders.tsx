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
  const [assignments, setAssignments] = useState([])
  const [assignedCylinders, setAssignedCylinders] = useState([])
  const [showStacked, setShowStacked] = useState(false)
  const [loadingReturnAll, setLoadingReturnAll] = useState(false)
  const [loadingReturnSome, setLoadingReturnSome] = useState(false)
  const [losses, setLosses] = useState({})
  const [lesses, setLesses] = useState({})
  const [loadingLosses, setLoadingLosses] = useState({})
  const [loadingLossesFilled, setLoadingLossesFilled] = useState({})
  const [loadingLessPay, setLoadingLessPay] = useState({})
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState({})
  const [showEmployeeLessPayDropdown, setShowEmployeeLessPayDropdown] =
    useState({})
  const [showEmployeeFilledDropdown, setShowEmployeeFilledDropdown] = useState(
    {},
  )
  const [selectedEmployee, setSelectedEmployee] = useState({})
  const [selectedEmployeeFilled, setSelectedEmployeeFilled] = useState({})
  const [selectedEmployeeLessPay, setSelectedEmployeeLessPay] = useState({})
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

  useEffect(() => {
    if (selectedTeam) {
      setLoading(true)
      const endpoint =
        selectedTeamType === "vehicle"
          ? `/inventory/vehicles/${selectedTeam.id}/cylinders/`
          : `/inventory/shops/${selectedTeam.id}/cylinders/`

      api
        .get(endpoint)
        .then((response) => setAssignedCylinders(response.data))
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
    setShowStacked(false)
  }

  const handleBack = () => {
    setSelectedTeam(null)
    setSelectedTeamType(null)
    setAssignedCylinders([])
    setShowStacked(false)
  }

  const handleToggleDropdown = (cylinderId) => {
    setShowEmployeeDropdown((prev) => ({
      ...prev,
      [cylinderId]: !prev[cylinderId],
    }))
  }

  const handleFilledToggleDropdown = (cylinderId) => {
    setShowEmployeeFilledDropdown((prev) => ({
      ...prev,
      [cylinderId]: !prev[cylinderId],
    }))
  }

  const handleLessPayToggleDropdown = (cylinderId) => {
    setShowEmployeeLessPayDropdown((prev) => ({
      ...prev,
      [cylinderId]: !prev[cylinderId],
    }))
  }

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

  const handleSelectEmployeeFilled = (cylinderId, employeeId) => {
    setSelectedEmployeeFilled((prev) => ({
      ...prev,
      [cylinderId]: employeeId,
    }))
    setShowEmployeeFilledDropdown((prev) => ({
      ...prev,
      [cylinderId]: false,
    }))
  }

  const handleSelectEmployeeLessPay = (cylinderId, employeeId) => {
    setSelectedEmployeeLessPay((prev) => ({
      ...prev,
      [cylinderId]: employeeId,
    }))
    setShowEmployeeLessPayDropdown((prev) => ({
      ...prev,
      [cylinderId]: false,
    }))
  }

  const handleLossChange = (cylinderId, field, value) => {
    setLosses((prev) => ({
      ...prev,
      [cylinderId]: {
        ...prev[cylinderId],
        [field]: parseInt(value, 10) || 0,
      },
    }))
  }

  const handleLossFilledChange = (cylinderId, field, value) => {
    setLosses((prev) => ({
      ...prev,
      [cylinderId]: {
        ...prev[cylinderId],
        [field]: parseInt(value, 10) || 0,
      },
    }))
  }

  const handleLessPayChange = (cylinderId, field, value) => {
    setLesses((prev) => ({
      ...prev,
      [cylinderId]: {
        ...prev[cylinderId],
        [field]: parseInt(value, 10) || 0,
      },
    }))
  }

  const handleSubmitLosses = (cylinderId) => {
    const lossData = losses[cylinderId]
    const employeeId = selectedEmployee[cylinderId]

    if (!lossData) return
    setLoadingLosses((prev) => ({ ...prev, [cylinderId]: true }))

    const payload = {
      sales_team_id: selectedTeam.id,
      losses: [
        {
          cylinder_id: cylinderId,
          filled_lost: lossData.filled_lost || 0,
          empties_lost: lossData.empties_lost || 0,
          employee_id: employeeId,
        },
      ],
    }

    api
      .post("/report-cylinder-losses/", payload)
      .then((response) => {
        setAssignedCylinders((prev) =>
          prev.map((cylinder) =>
            cylinder.id === cylinderId
              ? {
                  ...cylinder,
                  filled_lost:
                    (cylinder.filled_lost || 0) + (lossData.filled_lost || 0),
                  empties_lost:
                    (cylinder.empties_lost || 0) + (lossData.empties_lost || 0),
                }
              : cylinder,
          ),
        )
        setLosses((prev) => ({
          ...prev,
          [cylinderId]: { filled_lost: 0, empties_lost: 0 },
        }))
      })
      .catch((error) =>
        console.error("Error reporting cylinder losses:", error),
      )
      .finally(() =>
        setLoadingLosses((prev) => ({ ...prev, [cylinderId]: false })),
      )
  }

  const handleSubmitMissingFilled = (cylinderId) => {
    const lossData = losses[cylinderId]
    const employeeId = selectedEmployeeFilled[cylinderId]

    if (!lossData) return
    setLoadingLossesFilled((prev) => ({ ...prev, [cylinderId]: true }))

    const payload = {
      sales_team_id: selectedTeam.id,
      losses: [
        {
          cylinder_id: cylinderId,
          filled_lost: lossData.filled_lost || 0,
          empties_lost: 0,
          employee_id: employeeId,
        },
      ],
    }

    api
      .post("/report-cylinder-losses/", payload)
      .then((response) => {
        setAssignedCylinders((prev) =>
          prev.map((cylinder) =>
            cylinder.id === cylinderId
              ? {
                  ...cylinder,
                  filled_lost:
                    (cylinder.filled_lost || 0) + (lossData.filled_lost || 0),
                }
              : cylinder,
          ),
        )
        setLosses((prev) => ({
          ...prev,
          [cylinderId]: { filled_lost: 0, empties_lost: 0 },
        }))
      })
      .catch((error) =>
        console.error("Error reporting cylinder losses:", error),
      )
      .finally(() =>
        setLoadingLossesFilled((prev) => ({ ...prev, [cylinderId]: false })),
      )
  }

  const handleSubmitLessPay = (cylinderId) => {
    const lessData = lesses[cylinderId]
    const employeeId = selectedEmployeeLessPay[cylinderId]

    if (!lessData) return
    setLoadingLessPay((prev) => ({ ...prev, [cylinderId]: true }))

    const payload = {
      sales_team_id: selectedTeam.id,
      lesses: [
        {
          cylinder_id: cylinderId,
          less_pay: lessData.less_pay,
          employee_id: employeeId,
        },
      ],
    }

    api
      .post("/report-less_pay/", payload)
      .then((response) => {
        setAssignedCylinders((prev) =>
          prev.map((cylinder) =>
            cylinder.id === cylinderId
              ? {
                  ...cylinder,
                  less_pay: (cylinder.less_pay || 0) + lessData.less_pay,
                }
              : cylinder,
          ),
        )
        setLesses((prev) => ({ ...prev, [cylinderId]: { less_pay: 0 } }))
      })
      .catch((error) =>
        console.error("Error reporting cylinder lesses:", error),
      )
      .finally(() =>
        setLoadingLessPay((prev) => ({ ...prev, [cylinderId]: false })),
      )
  }

  const handleReturnCylinders = () => {
    setLoadingReturnSome(true)
    const payload = assignedCylinders.map((cylinder) => ({ id: cylinder.id }))

    api
      .post("/return-assigned-cylinders/", payload)
      .then(() =>
        navigate(`/admins/printcollect/${selectedTeam?.id}`, {
          state: {
            salesTeamName: getTeamDisplayName(selectedTeam, selectedTeamType),
            salesTeamType: selectedTeamType,
          },
        }),
      )
      .catch((error) => console.error("Error in cylinder Collection.", error))
      .finally(() => setLoadingReturnSome(false))
  }

  const handleReturnAllCylinders = () => {
    setLoadingReturnAll(true)
    const payload = assignedCylinders.map((cylinder) => ({ id: cylinder.id }))

    api
      .post("/return-all-assigned-cylinders/", payload)
      .then(() =>
        navigate(`/admins/printallcollect/${selectedTeam?.id}`, {
          state: {
            salesTeamName: getTeamDisplayName(selectedTeam, selectedTeamType),
            salesTeamType: selectedTeamType,
          },
        }),
      )
      .catch((error) => console.error("Error in cylinder Collection.", error))
      .finally(() => setLoadingReturnAll(false))
  }

  const handleShowStacked = () => {
    setShowStacked(!showStacked)
  }





  const filteredEmployees = employees.filter((employee) => {
    // Support both possible keys from the backend (correct and misspelled)
    const assigned = employee.assigned_to || employee.asigned_to
    if (!assigned || !selectedTeam) return false

    // Use the selected team type (set when a team card is clicked) to
    // decide whether to match by shop_id or vehicle_id
    if (selectedTeamType === "vehicle") {
      return assigned.type === "Vehicle" && assigned.vehicle_id === selectedTeam.id
    }

    // Default to shop matching
    return assigned.type === "Shop" && assigned.shop_id === selectedTeam.id
  })

  console.log("filtered employees ", filteredEmployees)

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

  const groupCylindersByType = () => {
    const grouped = {}
    assignedCylinders.forEach((item) => {
      const typeName = item.cylinder?.cylinder_type?.name || "Unknown"
      if (!grouped[typeName]) {
        grouped[typeName] = []
      }
      grouped[typeName].push(item)
    })
    return grouped
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
                        {assignedCylinders.map((cylinder) => (
                          <tr
                            key={cylinder.id}
                            className="hover:bg-gray-50 transition"
                          >
                            <td className="border border-gray-300 px-3 py-2">
                              {cylinder.cylinder?.cylinder_type?.name || "N/A"}
                            </td>
                            <td className="border border-gray-300 px-3 py-2 text-center font-medium">
                              {cylinder.cylinder?.weight?.weight || "N/A"}kg
                            </td>
                            <td className="border border-gray-300 px-3 py-2 text-center font-bold text-green-600">
                              {cylinder.full_cylinder_quantity || 0}
                              {(cylinder.filled_lost || 0) > 0 && (
                                <span className="text-red-500 ml-2">
                                  -{cylinder.filled_lost}
                                </span>
                              )}
                              {(cylinder.less_pay || 0) > 0 && (
                                <span className="text-orange-500 ml-2">
                                  -{cylinder.less_pay}
                                </span>
                              )}
                            </td>
                            <td className="border border-gray-300 px-3 py-2 text-center">
                              {cylinder.empty_cylinder_quantity || 0}
                              {(cylinder.empties_lost || 0) > 0 && (
                                <span className="text-red-500 ml-2">
                                  -{cylinder.empties_lost}
                                </span>
                              )}
                              {(cylinder.less_pay || 0) > 0 && (
                                <span className="text-green-500 ml-2">
                                  +{cylinder.less_pay}
                                </span>
                              )}
                            </td>
                            <td className="border border-gray-300 px-3 py-2 text-center text-red-600">
                              {cylinder.spoiled_cylinder_quantity || 0}
                            </td>
                            <td className="border border-gray-300 px-3 py-2 text-center font-semibold">
                              {cylinder.total_quantity || 0}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Details Toggle */}
                <div className="flex justify-center mb-4">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md font-semibold flex items-center transition"
                    onClick={handleShowStacked}
                  >
                    {showStacked ? "Hide" : "Show"} Details
                    {showStacked ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                  </button>
                </div>

                {/* Detailed Cards */}
                {showStacked && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                    {assignedCylinders.map((cylinder) => (
                      <div
                        key={cylinder.id}
                        className="bg-white border-2 border-blue-200 rounded-lg shadow-lg p-4"
                      >
                        <div className="mb-4 pb-3 border-b-2 border-gray-200">
                          <h3 className="text-lg font-bold text-blue-600 flex items-center">
                            <span className="mr-2">🛢️</span>
                            {cylinder.cylinder?.cylinder_type?.name ||
                              "Unknown"}{" "}
                            - {cylinder.cylinder?.weight?.weight || "N/A"}kg
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Store: {cylinder.shop_name || "N/A"}
                          </p>
                        </div>

                        {/* Cylinder Stats */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="bg-green-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 font-medium">
                              Full Cylinders
                            </p>
                            <p className="text-2xl font-bold text-green-600">
                              {cylinder.full_cylinder_quantity || 0}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 font-medium">
                              Empty Cylinders
                            </p>
                            <p className="text-2xl font-bold text-gray-600">
                              {cylinder.empty_cylinder_quantity || 0}
                            </p>
                          </div>
                          <div className="bg-red-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 font-medium">
                              Spoiled
                            </p>
                            <p className="text-2xl font-bold text-red-600">
                              {cylinder.spoiled_cylinder_quantity || 0}
                            </p>
                          </div>
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 font-medium">
                              Total
                            </p>
                            <p className="text-2xl font-bold text-blue-600">
                              {cylinder.total_quantity || 0}
                            </p>
                          </div>
                        </div>

                        {/* Loss Stats (if any) */}
                        {((cylinder.filled_lost || 0) > 0 ||
                          (cylinder.empties_lost || 0) > 0 ||
                          (cylinder.less_pay || 0) > 0) && (
                          <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                            <p className="text-xs font-semibold text-yellow-800 mb-2">
                              Recorded Issues:
                            </p>
                            {(cylinder.filled_lost || 0) > 0 && (
                              <p className="text-sm text-gray-700">
                                ❌ Filled Lost:{" "}
                                <span className="font-bold text-red-600">
                                  {cylinder.filled_lost}
                                </span>
                              </p>
                            )}
                            {(cylinder.empties_lost || 0) > 0 && (
                              <p className="text-sm text-gray-700">
                                ❌ Empties Lost:{" "}
                                <span className="font-bold text-red-600">
                                  {cylinder.empties_lost}
                                </span>
                              </p>
                            )}
                            {(cylinder.less_pay || 0) > 0 && (
                              <p className="text-sm text-gray-700">
                                💰 Less Payment:{" "}
                                <span className="font-bold text-orange-600">
                                  {cylinder.less_pay}
                                </span>
                              </p>
                            )}
                          </div>
                        )}

                        {/* Action Forms */}
                        <div className="grid grid-cols-1 gap-4">
                          {/* Missing Empties Form */}
                          <form
                            onSubmit={(e) => {
                              e.preventDefault()
                              if (
                                selectedEmployee[cylinder.id] &&
                                (losses[cylinder.id]?.empties_lost || 0) > 0
                              ) {
                                handleSubmitLosses(cylinder.id)
                              }
                            }}
                            className="bg-red-50 p-3 rounded-lg border border-red-200"
                          >
                            <label className="block text-sm font-semibold text-red-800 mb-2">
                              Report Missing Empties
                              {selectedEmployee[cylinder.id] && (
                                <span className="text-blue-600 ml-1">
                                  (
                                  {
                                    filteredEmployees.find(
                                      (emp) =>
                                        emp.id ===
                                        selectedEmployee[cylinder.id],
                                    )?.first_name
                                  }
                                  )
                                </span>
                              )}
                            </label>
                            <div className="flex items-center space-x-2 mb-2 relative">
                              <input
                                type="number"
                                min={0}
                                max={cylinder.empty_cylinder_quantity}
                                className="flex-1 p-2 border-2 border-gray-300 rounded-md focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
                                placeholder="Quantity"
                                value={losses[cylinder.id]?.empties_lost || ""}
                                onChange={(e) =>
                                  handleLossChange(
                                    cylinder.id,
                                    "empties_lost",
                                    e.target.value,
                                  )
                                }
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  handleToggleDropdown(cylinder.id)
                                }
                                className="p-2 bg-white border-2 border-gray-300 rounded-md hover:bg-gray-50"
                              >
                                <KeyboardArrowDownIcon />
                              </button>
                              {showEmployeeDropdown[cylinder.id] && (
                                <div className="absolute top-full left-0 mt-1 z-10 w-full bg-white border-2 border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                                  {filteredEmployees.map((employee) => (
                                    <div
                                      key={employee.id}
                                      className={`p-3 cursor-pointer hover:bg-blue-50 transition ${
                                        selectedEmployee[cylinder.id] ===
                                        employee.id
                                          ? "bg-blue-100 font-semibold"
                                          : ""
                                      }`}
                                      onClick={() =>
                                        handleSelectEmployee(
                                          cylinder.id,
                                          employee.id,
                                        )
                                      }
                                    >
                                      {employee.first_name} {employee.last_name}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            <button
                              type="submit"
                              className={`w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md font-semibold transition ${
                                loadingLosses[cylinder.id] ||
                                !selectedEmployee[cylinder.id] ||
                                !(losses[cylinder.id]?.empties_lost > 0)
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              disabled={
                                !selectedEmployee[cylinder.id] ||
                                !(losses[cylinder.id]?.empties_lost > 0) ||
                                loadingLosses[cylinder.id]
                              }
                            >
                              {loadingLosses[cylinder.id]
                                ? "Processing..."
                                : "Report Missing Empties"}
                            </button>
                          </form>

                          {/* Missing Filled Form */}
                          <form
                            onSubmit={(e) => {
                              e.preventDefault()
                              if (
                                selectedEmployeeFilled[cylinder.id] &&
                                (losses[cylinder.id]?.filled_lost || 0) > 0
                              ) {
                                handleSubmitMissingFilled(cylinder.id)
                              }
                            }}
                            className="bg-orange-50 p-3 rounded-lg border border-orange-200"
                          >
                            <label className="block text-sm font-semibold text-orange-800 mb-2">
                              Report Missing Filled
                              {selectedEmployeeFilled[cylinder.id] && (
                                <span className="text-blue-600 ml-1">
                                  (
                                  {
                                    filteredEmployees.find(
                                      (emp) =>
                                        emp.id ===
                                        selectedEmployeeFilled[cylinder.id],
                                    )?.first_name
                                  }
                                  )
                                </span>
                              )}
                            </label>
                            <div className="flex items-center space-x-2 mb-2 relative">
                              <input
                                type="number"
                                min={0}
                                max={cylinder.full_cylinder_quantity}
                                className="flex-1 p-2 border-2 border-gray-300 rounded-md focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                                placeholder="Quantity"
                                value={losses[cylinder.id]?.filled_lost || ""}
                                onChange={(e) =>
                                  handleLossFilledChange(
                                    cylinder.id,
                                    "filled_lost",
                                    e.target.value,
                                  )
                                }
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  handleFilledToggleDropdown(cylinder.id)
                                }
                                className="p-2 bg-white border-2 border-gray-300 rounded-md hover:bg-gray-50"
                              >
                                <KeyboardArrowDownIcon />
                              </button>
                              {showEmployeeFilledDropdown[cylinder.id] && (
                                <div className="absolute top-full left-0 mt-1 z-10 w-full bg-white border-2 border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                                  {filteredEmployees.map((employee) => (
                                    <div
                                      key={employee.id}
                                      className={`p-3 cursor-pointer hover:bg-blue-50 transition ${
                                        selectedEmployeeFilled[cylinder.id] ===
                                        employee.id
                                          ? "bg-blue-100 font-semibold"
                                          : ""
                                      }`}
                                      onClick={() =>
                                        handleSelectEmployeeFilled(
                                          cylinder.id,
                                          employee.id,
                                        )
                                      }
                                    >
                                      {employee.first_name} {employee.last_name}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            <button
                              type="submit"
                              className={`w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md font-semibold transition ${
                                loadingLossesFilled[cylinder.id] ||
                                !selectedEmployeeFilled[cylinder.id] ||
                                !(losses[cylinder.id]?.filled_lost > 0)
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              disabled={
                                !selectedEmployeeFilled[cylinder.id] ||
                                !(losses[cylinder.id]?.filled_lost > 0) ||
                                loadingLossesFilled[cylinder.id]
                              }
                            >
                              {loadingLossesFilled[cylinder.id]
                                ? "Processing..."
                                : "Report Missing Filled"}
                            </button>
                          </form>

                          {/* Less Payment Form */}
                          <form
                            onSubmit={(e) => {
                              e.preventDefault()
                              if (
                                selectedEmployeeLessPay[cylinder.id] &&
                                (lesses[cylinder.id]?.less_pay || 0) > 0
                              ) {
                                handleSubmitLessPay(cylinder.id)
                              }
                            }}
                            className="bg-yellow-50 p-3 rounded-lg border border-yellow-200"
                          >
                            <label className="block text-sm font-semibold text-yellow-800 mb-2">
                              Report Less Payment
                              {selectedEmployeeLessPay[cylinder.id] && (
                                <span className="text-blue-600 ml-1">
                                  (
                                  {
                                    filteredEmployees.find(
                                      (emp) =>
                                        emp.id ===
                                        selectedEmployeeLessPay[cylinder.id],
                                    )?.first_name
                                  }
                                  )
                                </span>
                              )}
                            </label>
                            <div className="flex items-center space-x-2 mb-2 relative">
                              <input
                                type="number"
                                min={0}
                                max={
                                  (cylinder.full_cylinder_quantity || 0) +
                                  (cylinder.empty_cylinder_quantity || 0)
                                }
                                className="flex-1 p-2 border-2 border-gray-300 rounded-md focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none"
                                placeholder="Quantity"
                                value={lesses[cylinder.id]?.less_pay || ""}
                                onChange={(e) =>
                                  handleLessPayChange(
                                    cylinder.id,
                                    "less_pay",
                                    e.target.value,
                                  )
                                }
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  handleLessPayToggleDropdown(cylinder.id)
                                }
                                className="p-2 bg-white border-2 border-gray-300 rounded-md hover:bg-gray-50"
                              >
                                <KeyboardArrowDownIcon />
                              </button>
                              {showEmployeeLessPayDropdown[cylinder.id] && (
                                <div className="absolute top-full left-0 mt-1 z-10 w-full bg-white border-2 border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                                  {filteredEmployees.map((employee) => (
                                    <div
                                      key={employee.id}
                                      className={`p-3 cursor-pointer hover:bg-blue-50 transition ${
                                        selectedEmployeeLessPay[cylinder.id] ===
                                        employee.id
                                          ? "bg-blue-100 font-semibold"
                                          : ""
                                      }`}
                                      onClick={() =>
                                        handleSelectEmployeeLessPay(
                                          cylinder.id,
                                          employee.id,
                                        )
                                      }
                                    >
                                      {employee.first_name} {employee.last_name}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            <button
                              type="submit"
                              className={`w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-md font-semibold transition ${
                                loadingLessPay[cylinder.id] ||
                                !selectedEmployeeLessPay[cylinder.id] ||
                                !(lesses[cylinder.id]?.less_pay > 0)
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              disabled={
                                !selectedEmployeeLessPay[cylinder.id] ||
                                !(lesses[cylinder.id]?.less_pay > 0) ||
                                loadingLessPay[cylinder.id]
                              }
                            >
                              {loadingLessPay[cylinder.id]
                                ? "Processing..."
                                : "Report Less Payment"}
                            </button>
                          </form>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sticky bottom-2 bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] pt-4 pb-2">
                  <button
                    className={`bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-6 py-3 rounded-lg shadow-lg transition-all ${
                      loadingReturnAll
                        ? "opacity-50 cursor-not-allowed"
                        : "active:scale-95"
                    }`}
                    onClick={handleReturnAllCylinders}
                    disabled={loadingReturnAll}
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
                      loadingReturnSome
                        ? "opacity-50 cursor-not-allowed"
                        : "active:scale-95"
                    }`}
                    onClick={handleReturnCylinders}
                    disabled={loadingReturnSome}
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
