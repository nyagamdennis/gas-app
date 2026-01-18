// @ts-nocheck

import React, { useEffect, useState } from "react"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp"

import { useNavigate } from "react-router-dom"
import Skeleton from "@mui/material/Skeleton"
import { fetchSalesTeamShops, selectAllSalesTeamShops } from "../../features/salesTeam/salesTeamSlice"
import { fetchSalesTeamVehicle, selectAllSalesTeamVehicle } from "../../features/salesTeam/salesTeamVehicleSlice"
import { fetchEmployees, selectAllEmployees } from "../../features/employees/employeesSlice"
import api from "../../../utils/api"
import Navbar from "../../components/ui/mobile/admin/Navbar"
import AdminsFooter from "../../components/AdminsFooter"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { fetchStore } from "../../features/store/storeSlice"
import planStatus from "../../features/planStatus/planStatus"

const CollectOtherProducts = () => {
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [selectedTeamType, setSelectedTeamType] = useState(null)
  const [activeTab, setActiveTab] = useState("shops")
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const allSalesShop = useAppSelector(selectAllSalesTeamShops)
  const allSalesVehicle = useAppSelector(selectAllSalesTeamVehicle)
  const employees = useAppSelector(selectAllEmployees)

  const [showStacked, setShowStacked] = useState<boolean>(false)
  const [loadingReturnAll, setLoadingReturnAll] = useState(false)
  const [loadingReturnSpoiled, setLoadingReturnSpoiled] = useState(false)
  const [assignedProducts, setAssignedProducts] = useState([])
  const [selectedEmployee, setSelectedEmployee] = useState({})
  const [selectedEmployeeSpoiled, setSelectedEmployeeSpoiled] = useState({})
  const [selectedEmployeeLessPay, setSelectedEmployeeLessPay] = useState({})
  const [losses, setLosses] = useState({})
  const [lesses, setLesses] = useState({})
  const [spoiled, setSpoiled] = useState({})
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState({})
  const [loadingLosses, setLoadingLosses] = useState({})
  const [showEmployeeSpoiledDropdown, setShowEmployeeSpoiledDropdown] =
    useState({})
  const [loadingSpoiled, setLoadingSpoiled] = useState({})
  const [showEmployeeLessPayDropdown, setShowEmployeeLessPayDropdown] =
    useState({})
  const [loadingLessPay, setLoadingLessPay] = useState({})
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
    if (selectedTeam) {
      dispatch(fetchStore({ businessId }))
    }
  }, [selectedTeam, businessId, dispatch])

  const hasProducts = assignedProducts.length > 0
  // inventory/vehicles/2/products/
  // inventory/shop/3/products/

  useEffect(() => {
    if (selectedTeam) {
      setLoading(true)
      const endpoint =
        selectedTeamType === "vehicle"
          ? `/inventory/vehicles/${selectedTeam.id}/products/`
          : `/inventory/shops/${selectedTeam.id}/products/`

      api
        .get(endpoint)
        .then((response) => setAssignedProducts(response.data))
        .catch((error) =>
          console.error("Error fetching assigned products:", error),
        )
        .finally(() => setLoading(false))
    }
  }, [selectedTeam, selectedTeamType])

  const getTeamDisplayName = (team, type) => {
    return type === "vehicle" ? team.number_plate : team.name
  }

  const handleSelectTeam = (team, type) => {
    setSelectedTeam(team)
    setSelectedTeamType(type)
    setAssignedProducts([])
    setShowStacked(false)
  }

  const handleBack = () => {
    setSelectedTeam(null)
    setSelectedTeamType(null)
    setAssignedProducts([])
    setShowStacked(false)
  }

  const handleShowStacked = () => {
    setShowStacked(!showStacked)
  }

  const handleReturnAllProducts = () => {
    setLoadingReturnAll(true)
    const payload = assignedProducts.map((product) => ({ id: product.id }))

    api
      .post("/return-all-assigned-products/", payload)
      .then(() =>
        navigate(`/admins/printallcollect-products/${selectedTeam?.id}`, {
          state: {
            salesTeamName: getTeamDisplayName(selectedTeam, selectedTeamType),
            salesTeamType: selectedTeamType,
          },
        }),
      )
      .catch((error) => console.error("Error in product Collection.", error))
      .finally(() => setLoadingReturnAll(false))
  }

  const handleReturnSpoiledProducts = () => {
    setLoadingReturnSpoiled(true)
    const payload = assignedProducts.map((product) => ({ id: product.id }))

    api
      .post("/return-spoiled-products/", payload)
      .then(() =>
        navigate(`/admins/printcollect-products/${selectedTeam?.id}`, {
          state: {
            salesTeamName: getTeamDisplayName(selectedTeam, selectedTeamType),
            salesTeamType: selectedTeamType,
          },
        }),
      )
      .catch((error) =>
        console.error("Error in spoiled product collection.", error),
      )
      .finally(() => setLoadingReturnSpoiled(false))
  }

  const handleToggleDropdown = (productId) => {
    setShowEmployeeDropdown((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }))
  }

  const handleSpoiledToggleDropdown = (productId) => {
    setShowEmployeeSpoiledDropdown((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }))
  }

  const handleLessPayToggleDropdown = (productId) => {
    setShowEmployeeLessPayDropdown((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }))
  }

  const handleSelectEmployee = (productId, employeeId) => {
    setSelectedEmployee((prev) => ({
      ...prev,
      [productId]: employeeId,
    }))
    setShowEmployeeDropdown((prev) => ({
      ...prev,
      [productId]: false,
    }))
  }

  const handleSelectEmployeeSpoiled = (productId, employeeId) => {
    setSelectedEmployeeSpoiled((prev) => ({
      ...prev,
      [productId]: employeeId,
    }))
    setShowEmployeeSpoiledDropdown((prev) => ({
      ...prev,
      [productId]: false,
    }))
  }

  const handleSelectEmployeeLessPay = (productId, employeeId) => {
    setSelectedEmployeeLessPay((prev) => ({
      ...prev,
      [productId]: employeeId,
    }))
    setShowEmployeeLessPayDropdown((prev) => ({
      ...prev,
      [productId]: false,
    }))
  }

  const handleLossChange = (productId, field, value) => {
    setLosses((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: parseInt(value, 10) || 0,
      },
    }))
  }

  const handleSpoiledChange = (productId, field, value) => {
    setSpoiled((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: parseInt(value, 10) || 0,
      },
    }))
  }

  const handleLessPayChange = (productId, field, value) => {
    setLesses((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: parseInt(value, 10) || 0,
      },
    }))
  }

  const handleSubmitLosses = (productId) => {
    const lossData = losses[productId]
    const employeeId = selectedEmployee[productId]

    if (!lossData) return
    setLoadingLosses((prev) => ({ ...prev, [productId]: true }))

    const payload = {
      sales_team_id: selectedTeam.id,
      losses: [
        {
          product_id: productId,
          missing_products: lossData.missing_products || 0,
          employee_id: employeeId,
        },
      ],
    }

    api
      .post("/report-product-losses/", payload)
      .then((response) => {
        setAssignedProducts((prev) =>
          prev.map((product) =>
            product.id === productId
              ? {
                  ...product,
                  missing_products:
                    (product.missing_products || 0) +
                    (lossData.missing_products || 0),
                }
              : product,
          ),
        )
        setLosses((prev) => ({
          ...prev,
          [productId]: { missing_products: 0 },
        }))
      })
      .catch((error) => console.error("Error reporting product losses:", error))
      .finally(() =>
        setLoadingLosses((prev) => ({ ...prev, [productId]: false })),
      )
  }

  const handleSubmitSpoiled = (productId) => {
    const spoiledData = spoiled[productId]
    const employeeId = selectedEmployeeSpoiled[productId]

    if (!spoiledData) return
    setLoadingSpoiled((prev) => ({ ...prev, [productId]: true }))

    const payload = {
      sales_team_id: selectedTeam.id,
      spoiled: [
        {
          product_id: productId,
          spoiled: spoiledData.spoiled || 0,
          employee_id: employeeId,
        },
      ],
    }

    api
      .post("/report-product-spoiled/", payload)
      .then((response) => {
        setAssignedProducts((prev) =>
          prev.map((product) =>
            product.id === productId
              ? {
                  ...product,
                  spoiled: (product.spoiled || 0) + (spoiledData.spoiled || 0),
                }
              : product,
          ),
        )
        setSpoiled((prev) => ({
          ...prev,
          [productId]: { spoiled: 0 },
        }))
      })
      .catch((error) =>
        console.error("Error reporting spoiled products:", error),
      )
      .finally(() =>
        setLoadingSpoiled((prev) => ({ ...prev, [productId]: false })),
      )
  }

  const handleSubmitLessPay = (productId) => {
    const lessData = lesses[productId]
    const employeeId = selectedEmployeeLessPay[productId]

    if (!lessData) return
    setLoadingLessPay((prev) => ({ ...prev, [productId]: true }))

    const payload = {
      sales_team_id: selectedTeam.id,
      lesses: [
        {
          product_id: productId,
          less_pay: lessData.less_pay || 0,
          employee_id: employeeId,
        },
      ],
    }

    api
      .post("/report-product-less-pay/", payload)
      .then((response) => {
        setAssignedProducts((prev) =>
          prev.map((product) =>
            product.id === productId
              ? {
                  ...product,
                  less_pay: (product.less_pay || 0) + (lessData.less_pay || 0),
                }
              : product,
          ),
        )
        setLesses((prev) => ({ ...prev, [productId]: { less_pay: 0 } }))
      })
      .catch((error) =>
        console.error("Error reporting product less pay:", error),
      )
      .finally(() =>
        setLoadingLessPay((prev) => ({ ...prev, [productId]: false })),
      )
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

  return (
    <div className="bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] min-h-screen flex flex-col">
      <Navbar
        headerMessage={"ERP"}
        headerText={"Collect other products from sales teams"}
      />

      <main className="flex-grow m-2 p-1">
        {!selectedTeam ? (
          <div>
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
              Select a Sales Team collect from
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
                  Collect Products from{" "}
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
            ) : assignedProducts.length > 0 ? (
              <>
                {/* Summary Table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gradient-to-r from-blue-100 to-blue-200">
                          <th className="border border-gray-300 px-3 py-2 text-left font-semibold">
                            Product Name
                          </th>
                          <th className="border border-gray-300 px-3 py-2 text-center font-semibold">
                            Assigned Qty
                          </th>
                          <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-green-600">
                            Retail Sold
                          </th>
                          <th className="border border-gray-300 px-3 py-2 text-center font-semibold">
                            Wholesale Sold
                          </th>
                          <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-red-600">
                            Missing
                          </th>
                          <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-red-600">
                            Spoiled
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {assignedProducts.map((product) => (
                          <tr
                            key={product.id}
                            className="hover:bg-gray-50 transition"
                          >
                            <td className="border border-gray-300 px-3 py-2">
                              {product?.product?.name || "N/A"}
                            </td>
                            <td className="border border-gray-300 px-3 py-2 text-center font-medium">
                              {product?.assigned_quantity || 0}
                            </td>
                            <td className="border border-gray-300 px-3 py-2 text-center font-bold text-green-600">
                              {product.retail_sold || 0}
                            </td>
                            <td className="border border-gray-300 px-3 py-2 text-center">
                              {product.wholesale_sold || 0}
                            </td>
                            <td className="border border-gray-300 px-3 py-2 text-center text-red-600">
                              {product.missing_products || 0}
                              {(product.less_pay || 0) > 0 && (
                                <span className="text-orange-500 ml-2">
                                  -{product.less_pay}
                                </span>
                              )}
                            </td>
                            <td className="border border-gray-300 px-3 py-2 text-center text-red-600">
                              {product.spoiled || 0}
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
                    {assignedProducts.map((product) => (
                      <div
                        key={product.id}
                        className="bg-white border-2 border-blue-200 rounded-lg shadow-lg p-4"
                      >
                        <div className="mb-4 pb-3 border-b-2 border-gray-200">
                          <h3 className="text-lg font-bold text-blue-600 flex items-center">
                            <span className="mr-2">📦</span>
                            {product?.product?.name || "Unknown Product"}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Category: {product.product?.category?.name || "N/A"}
                          </p>
                        </div>

                        {/* Product Stats */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="bg-green-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 font-medium">
                              Retail Sold
                            </p>
                            <p className="text-2xl font-bold text-green-600">
                              {product.retail_sold || 0}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 font-medium">
                              Wholesale Sold
                            </p>
                            <p className="text-2xl font-bold text-gray-600">
                              {product.wholesale_sold || 0}
                            </p>
                          </div>
                          <div className="bg-red-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 font-medium">
                              Missing
                            </p>
                            <p className="text-2xl font-bold text-red-600">
                              {product.missing_products || 0}
                            </p>
                          </div>
                          <div className="bg-orange-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 font-medium">
                              Spoiled
                            </p>
                            <p className="text-2xl font-bold text-orange-600">
                              {product.spoiled || 0}
                            </p>
                          </div>
                        </div>

                        {/* Loss Stats (if any) */}
                        {((product.missing_products || 0) > 0 ||
                          (product.spoiled || 0) > 0 ||
                          (product.less_pay || 0) > 0) && (
                          <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                            <p className="text-xs font-semibold text-yellow-800 mb-2">
                              Recorded Issues:
                            </p>
                            {(product.missing_products || 0) > 0 && (
                              <p className="text-sm text-gray-700">
                                ❌ Missing Products:{" "}
                                <span className="font-bold text-red-600">
                                  {product.missing_products}
                                </span>
                              </p>
                            )}
                            {(product.spoiled || 0) > 0 && (
                              <p className="text-sm text-gray-700">
                                🗑️ Spoiled Products:{" "}
                                <span className="font-bold text-orange-600">
                                  {product.spoiled}
                                </span>
                              </p>
                            )}
                            {(product.less_pay || 0) > 0 && (
                              <p className="text-sm text-gray-700">
                                💰 Less Payment:{" "}
                                <span className="font-bold text-purple-600">
                                  {product.less_pay}
                                </span>
                              </p>
                            )}
                          </div>
                        )}

                        {/* Action Forms */}
                        <div className="grid grid-cols-1 gap-4">
                          {/* Missing Products Form */}
                          <form
                            onSubmit={(e) => {
                              e.preventDefault()
                              if (
                                selectedEmployee[product.id] &&
                                (losses[product.id]?.missing_products || 0) > 0
                              ) {
                                handleSubmitLosses(product.id)
                              }
                            }}
                            className="bg-red-50 p-3 rounded-lg border border-red-200"
                          >
                            <label className="block text-sm font-semibold text-red-800 mb-2">
                              Report Missing Products
                              {selectedEmployee[product.id] && (
                                <span className="text-blue-600 ml-1">
                                  (
                                  {
                                    filteredEmployees.find(
                                      (emp) =>
                                        emp.id === selectedEmployee[product.id],
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
                                max={product.assigned_quantity}
                                className="flex-1 p-2 border-2 border-gray-300 rounded-md focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
                                placeholder="Quantity"
                                value={
                                  losses[product.id]?.missing_products || ""
                                }
                                onChange={(e) =>
                                  handleLossChange(
                                    product.id,
                                    "missing_products",
                                    e.target.value,
                                  )
                                }
                              />
                              <button
                                type="button"
                                onClick={() => handleToggleDropdown(product.id)}
                                className="p-2 bg-white border-2 border-gray-300 rounded-md hover:bg-gray-50"
                              >
                                <KeyboardArrowDownIcon />
                              </button>
                              {showEmployeeDropdown[product.id] && (
                                <div className="absolute top-full left-0 mt-1 z-10 w-full bg-white border-2 border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                                  {filteredEmployees.map((employee) => (
                                    <div
                                      key={employee.id}
                                      className={`p-3 cursor-pointer hover:bg-blue-50 transition ${
                                        selectedEmployee[product.id] ===
                                        employee.id
                                          ? "bg-blue-100 font-semibold"
                                          : ""
                                      }`}
                                      onClick={() =>
                                        handleSelectEmployee(
                                          product.id,
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
                                loadingLosses[product.id] ||
                                !selectedEmployee[product.id] ||
                                !(losses[product.id]?.missing_products > 0)
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              disabled={
                                !selectedEmployee[product.id] ||
                                !(losses[product.id]?.missing_products > 0) ||
                                loadingLosses[product.id]
                              }
                            >
                              {loadingLosses[product.id]
                                ? "Processing..."
                                : "Report Missing Products"}
                            </button>
                          </form>

                          {/* Spoiled Products Form */}
                          <form
                            onSubmit={(e) => {
                              e.preventDefault()
                              if (
                                selectedEmployeeSpoiled[product.id] &&
                                (spoiled[product.id]?.spoiled || 0) > 0
                              ) {
                                handleSubmitSpoiled(product.id)
                              }
                            }}
                            className="bg-orange-50 p-3 rounded-lg border border-orange-200"
                          >
                            <label className="block text-sm font-semibold text-orange-800 mb-2">
                              Report Spoiled Products
                              {selectedEmployeeSpoiled[product.id] && (
                                <span className="text-blue-600 ml-1">
                                  (
                                  {
                                    filteredEmployees.find(
                                      (emp) =>
                                        emp.id ===
                                        selectedEmployeeSpoiled[product.id],
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
                                max={product.assigned_quantity}
                                className="flex-1 p-2 border-2 border-gray-300 rounded-md focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                                placeholder="Quantity"
                                value={spoiled[product.id]?.spoiled || ""}
                                onChange={(e) =>
                                  handleSpoiledChange(
                                    product.id,
                                    "spoiled",
                                    e.target.value,
                                  )
                                }
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  handleSpoiledToggleDropdown(product.id)
                                }
                                className="p-2 bg-white border-2 border-gray-300 rounded-md hover:bg-gray-50"
                              >
                                <KeyboardArrowDownIcon />
                              </button>
                              {showEmployeeSpoiledDropdown[product.id] && (
                                <div className="absolute top-full left-0 mt-1 z-10 w-full bg-white border-2 border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                                  {filteredEmployees.map((employee) => (
                                    <div
                                      key={employee.id}
                                      className={`p-3 cursor-pointer hover:bg-blue-50 transition ${
                                        selectedEmployeeSpoiled[product.id] ===
                                        employee.id
                                          ? "bg-blue-100 font-semibold"
                                          : ""
                                      }`}
                                      onClick={() =>
                                        handleSelectEmployeeSpoiled(
                                          product.id,
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
                                loadingSpoiled[product.id] ||
                                !selectedEmployeeSpoiled[product.id] ||
                                !(spoiled[product.id]?.spoiled > 0)
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              disabled={
                                !selectedEmployeeSpoiled[product.id] ||
                                !(spoiled[product.id]?.spoiled > 0) ||
                                loadingSpoiled[product.id]
                              }
                            >
                              {loadingSpoiled[product.id]
                                ? "Processing..."
                                : "Report Spoiled Products"}
                            </button>
                          </form>

                          {/* Less Payment Form */}
                          <form
                            onSubmit={(e) => {
                              e.preventDefault()
                              if (
                                selectedEmployeeLessPay[product.id] &&
                                (lesses[product.id]?.less_pay || 0) > 0
                              ) {
                                handleSubmitLessPay(product.id)
                              }
                            }}
                            className="bg-yellow-50 p-3 rounded-lg border border-yellow-200"
                          >
                            <label className="block text-sm font-semibold text-yellow-800 mb-2">
                              Report Less Payment
                              {selectedEmployeeLessPay[product.id] && (
                                <span className="text-blue-600 ml-1">
                                  (
                                  {
                                    filteredEmployees.find(
                                      (emp) =>
                                        emp.id ===
                                        selectedEmployeeLessPay[product.id],
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
                                max={product.assigned_quantity}
                                className="flex-1 p-2 border-2 border-gray-300 rounded-md focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none"
                                placeholder="Amount"
                                value={lesses[product.id]?.less_pay || ""}
                                onChange={(e) =>
                                  handleLessPayChange(
                                    product.id,
                                    "less_pay",
                                    e.target.value,
                                  )
                                }
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  handleLessPayToggleDropdown(product.id)
                                }
                                className="p-2 bg-white border-2 border-gray-300 rounded-md hover:bg-gray-50"
                              >
                                <KeyboardArrowDownIcon />
                              </button>
                              {showEmployeeLessPayDropdown[product.id] && (
                                <div className="absolute top-full left-0 mt-1 z-10 w-full bg-white border-2 border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                                  {filteredEmployees.map((employee) => (
                                    <div
                                      key={employee.id}
                                      className={`p-3 cursor-pointer hover:bg-blue-50 transition ${
                                        selectedEmployeeLessPay[product.id] ===
                                        employee.id
                                          ? "bg-blue-100 font-semibold"
                                          : ""
                                      }`}
                                      onClick={() =>
                                        handleSelectEmployeeLessPay(
                                          product.id,
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
                                loadingLessPay[product.id] ||
                                !selectedEmployeeLessPay[product.id] ||
                                !(lesses[product.id]?.less_pay > 0)
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              disabled={
                                !selectedEmployeeLessPay[product.id] ||
                                !(lesses[product.id]?.less_pay > 0) ||
                                loadingLessPay[product.id]
                              }
                            >
                              {loadingLessPay[product.id]
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
                    onClick={handleReturnAllProducts}
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
                      "Return All Products"
                    )}
                  </button>
                  <button
                    className={`bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold px-6 py-3 rounded-lg shadow-lg transition-all ${
                      loadingReturnSpoiled
                        ? "opacity-50 cursor-not-allowed"
                        : "active:scale-95"
                    }`}
                    onClick={handleReturnSpoiledProducts}
                    disabled={loadingReturnSpoiled}
                  >
                    {loadingReturnSpoiled ? (
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
                      "Return Spoiled Products Only"
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center p-12 bg-white rounded-lg shadow-md">
                <div className="text-6xl mb-4">📦</div>
                <p className="text-gray-500 text-lg">
                  No products assigned to this team yet.
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

export default CollectOtherProducts
