// @ts-nocheck
import React, { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { Link, useNavigate } from "react-router-dom"
import AdminsFooter from "../../components/AdminsFooter"
import planStatus from "../../features/planStatus/planStatus"
import Navbar from "../../components/ui/mobile/admin/Navbar"
import { toast, ToastContainer } from "react-toastify"
import {
  assignEmployee,
  changeAssignEmployee,
  fetchEmployees,
  selectAllEmployees,
} from "../../features/employees/employeesSlice"
import defaultProfile from "../../components/media/default.png"
import { CircularProgress } from "@mui/material"
import {
  fetchSalesTeamVehicle,
  selectAllSalesTeamVehicle,
} from "../../features/salesTeam/salesTeamVehicleSlice"
import {
  fetchSalesTeamShops,
  selectAllSalesTeamShops,
} from "../../features/salesTeam/salesTeamSlice"
import { fetchStore, selectAllStore } from "../../features/store/storeSlice"
import api from "../../../utils/api"
import RealTimeIndicator from "../../components/sales/RealTimeIndicator"
import { selectEmployeeTeam } from "../../features/employees/employeesTeamSlice"
import { selectUserData, selectUserRole } from "../../features/auths/authSlice"

// Role options with icons
const ROLE_OPTIONS = [
  {
    value: "SHOP_ATTENDANT",
    label: "Shop Attendant",
    icon: "🏪",
    category: "shop",
  },
  {
    value: "DELIVERY_GUY",
    label: "Delivery Person",
    icon: "🏍️",
    category: "delivery",
  },
  { value: "STORE_MAN", label: "Store Manager", icon: "📦", category: "store" },
  { value: "SECURITY", label: "Security", icon: "🛡️", category: "general" },
  {
    value: "TRUCK_DRIVER",
    label: "Truck Driver",
    icon: "🚛",
    category: "vehicle",
  },
  { value: "CONDUCTOR", label: "Conductor", icon: "🎫", category: "vehicle" },
  {
    value: "SALES_PERSON",
    label: "Sales Person",
    icon: "💼",
    category: "shop",
  },
  { value: "MANAGER", label: "Manager", icon: "👔", category: "management" },
]

// Assignment type options
const ASSIGNMENT_TYPES = [
  {
    value: "STORE",
    label: "Store",
    icon: "🏬",
    description: "Assign to a store location",
  },
  {
    value: "SHOP",
    label: "Shop",
    icon: "🏪",
    description: "Assign to a retail shop",
  },
  {
    value: "VEHICLE",
    label: "Vehicle",
    icon: "🚚",
    description: "Assign to a vehicle",
  },
  {
    value: "DELIVERY",
    label: "Delivery",
    icon: "🏍️",
    description: "Assign as delivery person",
  },
]

// Helper function to get team type display
const getTeamTypeDisplay = (type) => {
  switch (type) {
    case "Vehicle":
      return { icon: "🚚", label: "Vehicle Team" }
    case "Shop":
      return { icon: "🏪", label: "Shop Team" }
    case "Store":
      return { icon: "🏬", label: "Store Team" }
    case "Delivery":
      return { icon: "🏍️", label: "Delivery Team" }
    default:
      return { icon: "👥", label: "Team" }
  }
}

// Helper function to check if employee is truly assigned
const isEmployeeAssigned = (employee) => {
  if (employee.role === "MANAGER") return false
  if (!employee.assigned_to) return false
  // Check if assigned_to has valid data (not null values)
  const { name, type } = employee.assigned_to
  return (
    name !== null && type !== null && name !== undefined && type !== undefined
  )
}

const Employee = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const {
    businessName,
    businessId,
    subscriptionPlan,
    employeeLimit,
    planName,
  } = planStatus()

  const myTeamData = useAppSelector(selectEmployeeTeam)
  const assignmentData = myTeamData?.[0]
  const userId = assignmentData?.user
  console.log("userId ", userId)

  const userRole = useAppSelector(selectUserRole)
  console.log("User Role:", userRole)
  console.log("User Role:", userRole)

  const userDataa = useAppSelector(selectUserData)
  console.log("User Data from Auth Slice:", userDataa?.user_id)
  const managerId = userDataa?.user_id

  // Advanced Features
  const [batchMode, setBatchMode] = useState(false)
  const [selectedBatchItems, setSelectedBatchItems] = useState([])
  const [lastUpdated, setLastUpdated] = useState(null)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [realTimeEnabled, setRealTimeEnabled] = useState(false)
  const [dataVersion, setDataVersion] = useState(0)

  const allEmployees = useAppSelector(selectAllEmployees)
  const allVehicles = useAppSelector(selectAllSalesTeamVehicle)
  const allShops = useAppSelector(selectAllSalesTeamShops)
  const allStores = useAppSelector(selectAllStore)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterRole, setFilterRole] = useState("")
  const [filterAssignment, setFilterAssignment] = useState("") // "assigned", "unassigned", ""
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [showEmployeeModal, setShowEmployeeModal] = useState(false)
  const [showAssignmentModal, setShowAssignmentModal] = useState(false)
  const [assignmentStep, setAssignmentStep] = useState(1)
  const [selectedForAssignment, setSelectedForAssignment] = useState(null)
  const [assignmentType, setAssignmentType] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [vehicleRole, setVehicleRole] = useState("DRIVER")
  // New state for shop and store assignment role
  const [assignmentRole, setAssignmentRole] = useState("")

  const [verifyingEmail, setVerifyingEmail] = useState(false)
  const [verifyingPhone, setVerifyingPhone] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [realData, setRealData] = useState({
    stores: [],
    shops: [],
    vehicles: [],
    motorcycles: [],
  })
  const [filteredOptions, setFilteredOptions] = useState({
    stores: [],
    shops: [],
    vehicles: [],
    motorcycles: [],
  })

  const [resendingIds, setResendingIds] = useState<Set<number>>(new Set())

  useEffect(() => {
    if (businessId) {
      dispatch(fetchEmployees({ businessId }))
    }
    dispatch(fetchSalesTeamShops())
    dispatch(fetchSalesTeamVehicle())
    dispatch(fetchStore())
  }, [dispatch, businessId])

  // Convert fetched data to usable format
  useEffect(() => {
    const formattedData = {
      stores: allStores.map((store) => ({
        id: store.id,
        name: store.name || "Unnamed Store",
        location: store.location?.name || "Location not specified",
        capacity: store.capacity || "Capacity not specified",
      })),
      shops: allShops.map((shop) => ({
        id: shop.id,
        name: shop.name || "Unnamed Shop",
        location: shop.location?.name || "Location not specified",
        type: shop.type_of_sales_team?.name || "Shop",
        status: "Active",
      })),
      vehicles: allVehicles.map((vehicle) => ({
        id: vehicle.id,
        type: "Vehicle",
        plate: vehicle.number_plate || "No Plate",
        capacity: "Not specified",
        status: "Available",
      })),
      motorcycles: [
        // Adding dummy motorcycle data since we don't have it from API
        {
          id: 1,
          type: "Bike",
          plate: "KMH 001",
          capacity: "2 cylinders",
          status: "Available",
        },
        {
          id: 2,
          type: "Bike",
          plate: "KMH 002",
          capacity: "2 cylinders",
          status: "Available",
        },
        {
          id: 3,
          type: "Bike",
          plate: "KMH 003",
          capacity: "2 cylinders",
          status: "In Delivery",
        },
      ],
    }
    setRealData(formattedData)
  }, [allStores, allShops, allVehicles])

  // Filter options to exclude current assignment when changing
  useEffect(() => {
    if (selectedForAssignment && isEmployeeAssigned(selectedForAssignment)) {
      const currentAssignment = selectedForAssignment.assigned_to
      const filtered = { ...realData }

      // Exclude current assignment based on type
      switch (currentAssignment.type) {
        case "STORE":
          filtered.stores = filtered.stores.filter(
            (store) =>
              store.id !== currentAssignment.store_id &&
              store.name !== currentAssignment.name,
          )
          break
        case "SHOP":
          filtered.shops = filtered.shops.filter(
            (shop) =>
              shop.id !== currentAssignment.shop_id &&
              shop.name !== currentAssignment.name,
          )
          break
        case "VEHICLE":
          filtered.vehicles = filtered.vehicles.filter(
            (vehicle) =>
              vehicle.id !== currentAssignment.vehicle_id &&
              vehicle.name !== currentAssignment.name,
          )
          break
        case "DELIVERY":
          filtered.motorcycles = filtered.motorcycles.filter(
            (bike) =>
              bike.id !== currentAssignment.vehicle_id &&
              bike.name !== currentAssignment.name,
          )
          break
      }

      setFilteredOptions(filtered)
    } else {
      setFilteredOptions(realData)
    }
  }, [selectedForAssignment, realData])

  const getRoleInfo = (role) => {
    const roleOption = ROLE_OPTIONS.find((r) => r.value === role)
    return roleOption || { label: role, icon: "👤" }
  }

  // If user is a manager, exclude managers from the list; otherwise show all employees
  const employeeList =
    userRole === "MANAGER"
      ? allEmployees.filter((emp) => emp.role !== "MANAGER")
      : allEmployees

  const filteredEmployees = employeeList.filter((employee) => {
    const matchesSearch =
      searchQuery === "" ||
      employee.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (employee.email &&
        employee.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (employee.phone_number && employee.phone_number.includes(searchQuery))

    const matchesRole = filterRole === "" || employee.role === filterRole

    // Filter by assignment status
    const matchesAssignment =
      filterAssignment === "" ||
      (filterAssignment === "assigned" && isEmployeeAssigned(employee)) ||
      (filterAssignment === "unassigned" && !isEmployeeAssigned(employee))

    return matchesSearch && matchesRole && matchesAssignment
  })

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee)
    setShowEmployeeModal(true)
  }

  const handleStartAssignment = (employee) => {
    if (employee.role === "MANAGER") {
      toast.error("Managers cannot be assigned to any shop, store, or vehicle.")
      return
    }
    setSelectedForAssignment(employee)
    setAssignmentStep(1)
    setAssignmentType("")
    setSelectedLocation("")
    setVehicleRole("DRIVER")
    setAssignmentRole("") // Reset assignment role
    setShowAssignmentModal(true)
  }

  const handleAssignToLocation = async () => {
    const formData = {
      employee_id: selectedForAssignment.id,
    }
    if (assignmentType === "STORE") {
      formData.store_id = selectedLocation.id
      formData.role = assignmentRole // e.g., "STORE_MAN" or "SECURITY"
    } else if (assignmentType === "VEHICLE") {
      formData.vehicle_id = selectedLocation.id
      // For vehicles, we use the selected vehicleRole (e.g., "TRUCK_DRIVER" or "CONDUCTOR")
      formData.role = vehicleRole
    } else if (assignmentType === "SHOP") {
      formData.shop_id = selectedLocation.id
      formData.role = assignmentRole // e.g., "SALES_PERSON" or "SHOP_ATTENDANT"
    } else if (assignmentType === "DELIVERY") {
      // For motorcycles, we'll assign as delivery person
      formData.vehicle_id = selectedLocation.id
      formData.role = "DELIVERY_GUY" // or we could have a separate role selection for motorcycles
    }

    const teamName = selectedLocation.name
    try {
      await dispatch(assignEmployee({ formData, teamName }))
      toast.success(
        `Assigned ${selectedForAssignment.first_name} to ${selectedLocation.name} as ${formData.role}`,
      )
    } catch (error) {
      console.error("error ", error)
      toast.error("error assigning employee ", error.message)
    }

    setShowAssignmentModal(false)
    // Reset all states
    setSelectedForAssignment(null)
    setAssignmentType("")
    setSelectedLocation("")
    setVehicleRole("DRIVER")
    setAssignmentRole("")
    setAssignmentStep(1)
  }
  const handleChangeAssignToLocation = async () => {
    const formData = {
      employee_id: selectedForAssignment.id,
    }
    if (assignmentType === "STORE") {
      formData.store_id = selectedLocation.id
      formData.role = assignmentRole
    } else if (assignmentType === "VEHICLE") {
      formData.vehicle_id = selectedLocation.id
      formData.role = vehicleRole
    } else if (assignmentType === "SHOP") {
      formData.shop_id = selectedLocation.id
      formData.role = assignmentRole
    } else if (assignmentType === "DELIVERY") {
      formData.vehicle_id = selectedLocation.id
      formData.role = "DELIVERY_GUY"
    }
    const teamName = selectedLocation.name

    try {
      await dispatch(changeAssignEmployee({ formData, teamName }))
      toast.success(
        `Transferred ${selectedForAssignment.first_name} to ${selectedLocation.name} as ${formData.role}`,
      )
    } catch (error) {
      console.error("error ", error)
      toast.error("error transferring employee ", error.message)
    }

    setShowAssignmentModal(false)
    // Reset all states
    setSelectedForAssignment(null)
    setAssignmentType("")
    setSelectedLocation("")
    setVehicleRole("DRIVER")
    setAssignmentRole("")
    setAssignmentStep(1)
  }

  const renderAssignmentStep = () => {
    // Use filtered options if employee is already assigned, otherwise use all options
    const dataToUse = isEmployeeAssigned(selectedForAssignment)
      ? filteredOptions
      : realData
    const isChangingAssignment = isEmployeeAssigned(selectedForAssignment)

    switch (assignmentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800">
              {isChangingAssignment
                ? "Change Assignment Type"
                : "Select Assignment Type"}
            </h3>
            {isChangingAssignment && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-3">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <span className="text-yellow-500">⚠️</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      <strong>Current Assignment:</strong>{" "}
                      {selectedForAssignment.assigned_to.type} -{" "}
                      {selectedForAssignment.assigned_to.name}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              {ASSIGNMENT_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => {
                    setAssignmentType(type.value)
                    setAssignmentStep(2)
                    setAssignmentRole("") // Reset role when changing type
                  }}
                  className="p-4 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-left"
                >
                  <div className="text-2xl mb-2">{type.icon}</div>
                  <div className="font-semibold">{type.label}</div>
                  <div className="text-xs text-gray-600 mt-1">
                    {type.description}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )

      case 2:
        switch (assignmentType) {
          case "STORE":
            return (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-800">
                  Select New Store
                </h3>
                {isChangingAssignment &&
                  selectedForAssignment.assigned_to.type === "STORE" && (
                    <div className="mb-3 p-2 bg-blue-50 rounded">
                      <p className="text-sm text-blue-700">
                        <span className="font-semibold">Current:</span>{" "}
                        {selectedForAssignment.assigned_to.name}
                      </p>
                      <p className="text-xs text-blue-600">
                        (Current store is excluded from the list below)
                      </p>
                    </div>
                  )}
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {dataToUse.stores.length > 0 ? (
                    dataToUse.stores.map((store) => (
                      <div
                        key={store.id}
                        onClick={() =>
                          setSelectedLocation({
                            id: store.id,
                            name: store.name,
                            type: "STORE",
                          })
                        }
                        className={`p-3 border-2 rounded-lg cursor-pointer transition ${
                          selectedLocation?.id === store.id &&
                          selectedLocation?.type === "STORE"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <div className="font-semibold">🏬 {store.name}</div>
                        <div className="text-sm text-gray-600">
                          {store.location}
                        </div>
                        <div className="text-xs text-gray-500">
                          Capacity: {store.capacity}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      No stores available. Please add a store first.
                    </div>
                  )}
                </div>

                {/* Store Role Selection */}
                {selectedLocation && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assign as:
                    </label>
                    <div className="flex gap-2">
                      {[
                        { value: "STORE_MAN", label: "📦 Store Manager" },
                        { value: "SECURITY", label: "🛡️ Security" },
                      ].map((role) => (
                        <button
                          key={role.value}
                          onClick={() => setAssignmentRole(role.value)}
                          className={`flex-1 p-3 border-2 rounded-lg ${
                            assignmentRole === role.value
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          <div className="font-semibold">{role.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => setAssignmentStep(1)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() =>
                      selectedLocation && assignmentRole && setAssignmentStep(3)
                    }
                    disabled={!selectedLocation || !assignmentRole}
                    className={`flex-1 px-4 py-2 rounded-lg font-semibold ${
                      selectedLocation && assignmentRole
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )

          case "SHOP":
            return (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-800">
                  Select New Shop
                </h3>
                {isChangingAssignment &&
                  selectedForAssignment.assigned_to.type === "SHOP" && (
                    <div className="mb-3 p-2 bg-blue-50 rounded">
                      <p className="text-sm text-blue-700">
                        <span className="font-semibold">Current:</span>{" "}
                        {selectedForAssignment.assigned_to.name}
                      </p>
                      <p className="text-xs text-blue-600">
                        (Current shop is excluded from the list below)
                      </p>
                    </div>
                  )}
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {dataToUse.shops.length > 0 ? (
                    dataToUse.shops.map((shop) => (
                      <div
                        key={shop.id}
                        onClick={() =>
                          setSelectedLocation({
                            id: shop.id,
                            name: shop.name,
                            type: "SHOP",
                          })
                        }
                        className={`p-3 border-2 rounded-lg cursor-pointer transition ${
                          selectedLocation?.id === shop.id &&
                          selectedLocation?.type === "SHOP"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <div className="font-semibold">🏪 {shop.name}</div>
                        <div className="text-sm text-gray-600">
                          {shop.location} • {shop.type}
                        </div>
                        <div className="text-xs text-gray-500">
                          Status: {shop.status}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      No shops available. Please add a shop first.
                    </div>
                  )}
                </div>

                {/* Shop Role Selection */}
                {selectedLocation && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assign as:
                    </label>
                    <div className="flex gap-2">
                      {[
                        { value: "SALES_PERSON", label: "💼 Sales Person" },
                        { value: "SHOP_ATTENDANT", label: "🏪 Shop Attendant" },
                      ].map((role) => (
                        <button
                          key={role.value}
                          onClick={() => setAssignmentRole(role.value)}
                          className={`flex-1 p-3 border-2 rounded-lg ${
                            assignmentRole === role.value
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          <div className="font-semibold">{role.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => setAssignmentStep(1)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() =>
                      selectedLocation && assignmentRole && setAssignmentStep(3)
                    }
                    disabled={!selectedLocation || !assignmentRole}
                    className={`flex-1 px-4 py-2 rounded-lg font-semibold ${
                      selectedLocation && assignmentRole
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )

          case "VEHICLE":
            return (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-800">
                  Select New Vehicle
                </h3>
                {isChangingAssignment &&
                  selectedForAssignment.assigned_to.type === "VEHICLE" && (
                    <div className="mb-3 p-2 bg-blue-50 rounded">
                      <p className="text-sm text-blue-700">
                        <span className="font-semibold">Current:</span>{" "}
                        {selectedForAssignment.assigned_to.name}
                      </p>
                      <p className="text-xs text-blue-600">
                        (Current vehicle is excluded from the list below)
                      </p>
                    </div>
                  )}
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {dataToUse.vehicles.length > 0 ? (
                    dataToUse.vehicles.map((vehicle) => (
                      <div
                        key={vehicle.id}
                        onClick={() =>
                          setSelectedLocation({
                            id: vehicle.id,
                            name: vehicle.plate,
                            type: "VEHICLE",
                          })
                        }
                        className={`p-3 border-2 rounded-lg cursor-pointer transition ${
                          selectedLocation?.id === vehicle.id &&
                          selectedLocation?.type === "VEHICLE"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <div className="font-semibold">
                          🚚 {vehicle.type} - {vehicle.plate}
                        </div>
                        <div className="text-sm text-gray-600">
                          Capacity: {vehicle.capacity}
                        </div>
                        <div
                          className={`text-xs ${
                            vehicle.status === "Available"
                              ? "text-green-600"
                              : "text-orange-600"
                          }`}
                        >
                          Status: {vehicle.status}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      No vehicles available. Please add a vehicle first.
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assign as:
                  </label>
                  <div className="flex gap-2">
                    {[
                      { value: "TRUCK_DRIVER", label: "👨‍✈️ Driver" },
                      { value: "CONDUCTOR", label: "🎫 Conductor" },
                    ].map((role) => (
                      <button
                        key={role.value}
                        onClick={() => setVehicleRole(role.value)}
                        className={`flex-1 p-3 border-2 rounded-lg ${
                          vehicleRole === role.value
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <div className="font-semibold">{role.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => setAssignmentStep(1)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => selectedLocation && setAssignmentStep(3)}
                    disabled={!selectedLocation}
                    className={`flex-1 px-4 py-2 rounded-lg font-semibold ${
                      selectedLocation
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )

          case "DELIVERY":
            return (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-800">
                  Select New Motorcycle
                </h3>
                {isChangingAssignment &&
                  selectedForAssignment.assigned_to.type === "DELIVERY" && (
                    <div className="mb-3 p-2 bg-blue-50 rounded">
                      <p className="text-sm text-blue-700">
                        <span className="font-semibold">Current:</span>{" "}
                        {selectedForAssignment.assigned_to.name}
                      </p>
                      <p className="text-xs text-blue-600">
                        (Current motorcycle is excluded from the list below)
                      </p>
                    </div>
                  )}
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {dataToUse.motorcycles.length > 0 ? (
                    dataToUse.motorcycles.map((bike) => (
                      <div
                        key={bike.id}
                        onClick={() =>
                          setSelectedLocation({
                            id: bike.id,
                            name: bike.plate,
                            type: "DELIVERY",
                          })
                        }
                        className={`p-3 border-2 rounded-lg cursor-pointer transition ${
                          selectedLocation?.id === bike.id &&
                          selectedLocation?.type === "DELIVERY"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <div className="font-semibold">
                          🏍️ {bike.type} - {bike.plate}
                        </div>
                        <div className="text-sm text-gray-600">
                          Capacity: {bike.capacity}
                        </div>
                        <div
                          className={`text-xs ${
                            bike.status === "Available"
                              ? "text-green-600"
                              : "text-orange-600"
                          }`}
                        >
                          Status: {bike.status}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      No motorcycles available. Please add a motorcycle first.
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setAssignmentStep(1)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => selectedLocation && setAssignmentStep(3)}
                    disabled={!selectedLocation}
                    className={`flex-1 px-4 py-2 rounded-lg font-semibold ${
                      selectedLocation
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )

          default:
            return null
        }

      case 3:
        const isChanging = isEmployeeAssigned(selectedForAssignment)
        // Determine which role to display based on assignment type
        let displayRole = ""
        if (assignmentType === "STORE" || assignmentType === "SHOP") {
          const roleOption = ROLE_OPTIONS.find(
            (r) => r.value === assignmentRole,
          )
          displayRole = roleOption
            ? `${roleOption.icon} ${roleOption.label}`
            : assignmentRole
        } else if (assignmentType === "VEHICLE") {
          const roleOption = ROLE_OPTIONS.find((r) => r.value === vehicleRole)
          displayRole = roleOption
            ? `${roleOption.icon} ${roleOption.label}`
            : vehicleRole
        } else if (assignmentType === "DELIVERY") {
          displayRole = "🏍️ Delivery Person"
        }
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800">
              {isChanging ? "Confirm Transfer" : "Confirm Assignment"}
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedForAssignment.profile_image || defaultProfile}
                    alt={selectedForAssignment.first_name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className="font-semibold">
                      {selectedForAssignment.first_name}{" "}
                      {selectedForAssignment.last_name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {getRoleInfo(selectedForAssignment.role).icon}{" "}
                      {getRoleInfo(selectedForAssignment.role).label}
                    </div>
                  </div>
                </div>

                {isChanging && (
                  <div className="border border-yellow-300 bg-yellow-50 p-3 rounded">
                    <div className="text-sm text-yellow-800 mb-1 font-semibold">
                      Current Assignment:
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">
                        {selectedForAssignment.assigned_to.type}:
                      </span>{" "}
                      {selectedForAssignment.assigned_to.name}
                    </div>
                  </div>
                )}

                <div className="border-t pt-3">
                  <div className="text-sm text-gray-600 mb-1">
                    {isChanging
                      ? "New Assignment Details:"
                      : "Assignment Details:"}
                  </div>
                  <div className="font-semibold text-lg">
                    {assignmentType === "STORE" && "🏬 Store"}
                    {assignmentType === "SHOP" && "🏪 Shop"}
                    {assignmentType === "VEHICLE" && "🚚 Vehicle"}
                    {assignmentType === "DELIVERY" && "🏍️ Delivery"}
                  </div>
                  <div className="text-gray-700">
                    {selectedLocation?.name || "No location selected"}
                  </div>
                  {displayRole && (
                    <div className="mt-2">
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                        Role: {displayRole}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setAssignmentStep(2)}
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-gray-400"
              >
                ← Back
              </button>
              <button
                onClick={
                  isChanging
                    ? handleChangeAssignToLocation
                    : handleAssignToLocation
                }
                className={`flex-1 px-4 py-2 rounded-lg font-semibold hover:bg-green-600 ${
                  isChanging
                    ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                    : "bg-green-500 text-white"
                }`}
              >
                {isChanging ? "🔄 Transfer Employee" : "✅ Confirm Assignment"}
              </button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  // Render assignment information for an employee
  const renderAssignmentInfo = (employee) => {
    const isAssigned = isEmployeeAssigned(employee)
    if (employee.role === "MANAGER") {
      return (
        <div className="mt-2">
          <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
            👔 Manager - No team assignment
          </span>
        </div>
      )
    }
    if (!isAssigned) {
      return (
        <div className="mt-2">
          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
            Not Assigned
          </span>
        </div>
      )
    }

    const teamType = getTeamTypeDisplay(employee.assigned_to.type)

    return (
      <div className="mt-2">
        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-600 flex items-center">
            {teamType.icon} Assigned to:
          </span>
          <span className="text-sm font-semibold text-blue-600">
            {employee.assigned_to.name}
          </span>
        </div>
        <div className="text-xs text-gray-500">
          Type: {teamType.label}
          {employee.assigned_to.vehicle_id &&
            ` • ID: ${employee.assigned_to.vehicle_id}`}
        </div>
      </div>
    )
  }

  const inviteLink = `/register?ref=${encodeURIComponent(
    btoa(JSON.stringify({ id: businessId, name: businessName })),
  )}`

  const copyToClipboard = () => {
    const url = window.location.origin + inviteLink
    navigator.clipboard.writeText(url)
    toast.success("Link copied to clipboard!")
  }

  const handleResendInvite = async (
    employeeId: number,
    employeeEmail: string,
  ) => {
    if (resendingIds.has(employeeId)) return
    setResendingIds((prev) => new Set(prev).add(employeeId))
    try {
      await api.post(`employees/employees/${employeeId}/invite/`)
      toast.success(`Invitation resent to ${employeeEmail}`)
    } catch (error) {
      console.error("Failed to resend invite:", error)
      toast.error("Failed to resend invite. Please try again.")
    } finally {
      setResendingIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(employeeId)
        return newSet
      })
    }
  }
  const handleMakeManager = async (employee) => {
    if (
      window.confirm(
        `Are you sure you want to make ${employee.first_name} ${employee.last_name} a Manager? This will remove any existing assignment.`,
      )
    ) {
      try {
        await api.post(`employees/employee/${employee.id}/manage/`, {
          role: "MANAGER",
          assigned_to: null,
        })
        toast.success(
          `${employee.first_name} ${employee.last_name} is now a Manager.`,
        )
        dispatch(fetchEmployees({ businessId }))
      } catch (error) {
        toast.error(
          "Failed to update role: " +
            (error.response?.data?.detail || error.message),
        )
      }
    }
  }

  const handleRemoveManager = async (employee) => {
    if (
      window.confirm(
        `Remove manager status from ${employee.first_name} ${employee.last_name}? They will become a Shop Attendant with no assignment.`,
      )
    ) {
      try {
        await api.patch(`employees/employee/${employee.id}/manage/`)
        toast.success(
          `${employee.first_name} ${employee.last_name} is no longer a Manager.`,
        )
        dispatch(fetchEmployees({ businessId }))
      } catch (error) {
        toast.error(
          "Failed to remove manager status: " +
            (error.response?.data?.detail || error.message),
        )
      }
    }
  }

  // Calculate statistics
  const assignedCount = allEmployees.filter(isEmployeeAssigned).length
  const unassignedCount = allEmployees.length - assignedCount

  useEffect(() => {
    // Separate vehicles and motorcycles based on type_of_vehicle
    const vehiclesList = allVehicles
      .filter((vehicle) => vehicle.type_of_vehicle === "VEHICLE")
      .map((vehicle) => ({
        id: vehicle.id,
        type: "Vehicle",
        plate: vehicle.number_plate || "No Plate",
        capacity: vehicle.engine_size
          ? `${vehicle.engine_size}cc`
          : "Not specified",
        status: vehicle.driver ? "Assigned" : "Available",
      }))

    const motorcyclesList = allVehicles
      .filter((vehicle) => vehicle.type_of_vehicle === "MOTORBIKE")
      .map((vehicle) => ({
        id: vehicle.id,
        type: "Motorbike",
        plate: vehicle.number_plate || "No Plate",
        capacity: vehicle.engine_size
          ? `${vehicle.engine_size}cc`
          : "Not specified",
        status: vehicle.driver ? "Assigned" : "Available",
      }))

    const formattedData = {
      stores: allStores.map((store) => ({
        id: store.id,
        name: store.name || "Unnamed Store",
        location: store.location?.name || "Location not specified",
        capacity: store.capacity || "Capacity not specified",
      })),
      shops: allShops.map((shop) => ({
        id: shop.id,
        name: shop.name || "Unnamed Shop",
        location: shop.location?.name || "Location not specified",
        type: shop.type_of_sales_team?.name || "Shop",
        status: "Active",
      })),
      vehicles: vehiclesList,
      motorcycles: motorcyclesList,
    }
    setRealData(formattedData)
  }, [allStores, allShops, allVehicles])

  const handleVerifyEmail = async (employee) => {
    setVerifyingEmail(true)
    try {
      await verifyEmployeeEmail(employee.id)
      // Update local employee data
      setSelectedEmployee((prev) => ({ ...prev, email_verified: true }))
      // Optionally refresh the employee list
      toast.success(
        `Email verified for ${employee.first_name} ${employee.last_name}`,
      )
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to verify email")
    } finally {
      setVerifyingEmail(false)
    }
  }

  const handleUnverifyEmail = async (employee) => {
    setVerifyingEmail(true)
    try {
      await unverifyEmployeeEmail(employee.id)
      setSelectedEmployee((prev) => ({ ...prev, email_verified: false }))
      toast.success(
        `Email unverified for ${employee.first_name} ${employee.last_name}`,
      )
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to unverify email")
    } finally {
      setVerifyingEmail(false)
    }
  }

  const handleVerifyPhone = async (employee) => {
    setVerifyingPhone(true)
    try {
      await verifyEmployeePhone(employee.id)
      setSelectedEmployee((prev) => ({ ...prev, phone_verified: true }))
      toast.success(
        `Phone verified for ${employee.first_name} ${employee.last_name}`,
      )
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to verify phone")
    } finally {
      setVerifyingPhone(false)
    }
  }

  const handleUnverifyPhone = async (employee) => {
    setVerifyingPhone(true)
    try {
      await unverifyEmployeePhone(employee.id)
      setSelectedEmployee((prev) => ({ ...prev, phone_verified: false }))
      toast.success(
        `Phone unverified for ${employee.first_name} ${employee.last_name}`,
      )
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to unverify phone")
    } finally {
      setVerifyingPhone(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-gray-800 font-sans">
      <Navbar
        headerMessage={"ERP"}
        headerText={"Manage your operations with style and clarity"}
      />
      <ToastContainer />
      <div className="prevent-overflow">
        <RealTimeIndicator
          enabled={autoRefresh}
          lastUpdated={lastUpdated}
          dataVersion={dataVersion}
          onToggle={() => setAutoRefresh(!autoRefresh)}
        />
      </div>

      <main className="flex-grow m-2 p-1 mb-20">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg shadow-lg mb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl font-bold text-white mb-1 flex items-center">
                <span className="mr-2">👥</span>
                Employees Management
              </h1>
              <p className="text-blue-100 text-sm">
                View, manage, and assign employees to teams
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                to="/hr/recruitment"
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition shadow-md inline-block"
              >
                + Add Employee
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-sm text-gray-600 mb-1">Total Employees</div>
            <div className="text-2xl font-bold text-blue-600">
              {allEmployees.length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-sm text-gray-600 mb-1">Assigned</div>
            <div className="text-2xl font-bold text-green-600">
              {assignedCount}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-sm text-gray-600 mb-1">Unassigned</div>
            <div className="text-2xl font-bold text-orange-600">
              {unassignedCount}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-sm text-gray-600 mb-1">Limit</div>
            <div className="text-2xl font-bold text-purple-600">
              {employeeLimit}
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="space-y-3">
            <div>
              <input
                type="text"
                placeholder="🔍 Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
              >
                <option value="">All Roles</option>
                {ROLE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.icon} {option.label}
                  </option>
                ))}
              </select>

              <select
                value={filterAssignment}
                onChange={(e) => setFilterAssignment(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
              >
                <option value="">All Employees</option>
                <option value="assigned">✅ Assigned</option>
                <option value="unassigned">⭕ Unassigned</option>
              </select>

              <Link
                to="/admins/ex-employees"
                className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-gray-600 hover:to-gray-700 transition text-center flex items-center justify-center gap-2"
              >
                <span>📋</span>
                Ex-Employees
              </Link>
            </div>
          </div>
        </div>

        {/* Employees List */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              Employees ({filteredEmployees.length})
            </h2>
            <div className="text-sm text-gray-500">
              <span className="text-green-600 mr-3">
                ✅ {assignedCount} assigned
              </span>
              <span className="text-orange-600">
                ⭕ {unassignedCount} unassigned
              </span>
            </div>
          </div>

          {filteredEmployees.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 opacity-30">👥</div>
              <p className="text-gray-500 text-lg mb-2">
                {searchQuery || filterRole || filterAssignment
                  ? "No employees found"
                  : "No employees yet"}
              </p>
              <p className="text-gray-400 text-sm mb-4">
                {searchQuery || filterRole || filterAssignment
                  ? "Try adjusting your search or filters"
                  : "Add your first employee to get started"}
              </p>
              <Link
                to="/hr/recruitment"
                className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition"
              >
                + Add Employee
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredEmployees.map((employee) => {
                const roleInfo = getRoleInfo(employee.role)
                const isAssigned = isEmployeeAssigned(employee)

                return (
                  <div
                    key={employee.id}
                    className={`border-2 rounded-lg p-4 hover:shadow-md transition ${
                      employee.role === "MANAGER"
                        ? "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-300"
                        : isAssigned
                        ? "bg-gradient-to-r from-green-50 to-blue-50 border-green-200"
                        : "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-800 text-lg">
                        {employee.first_name} {employee.last_name}
                      </h3>
                      {employee.role === "MANAGER" && (
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                          👔 Manager
                        </span>
                      )}
                      {isAssigned && !employee.role === "MANAGER" && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                          Assigned
                        </span>
                      )}
                    </div>

                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="relative">
                          <img
                            src={employee.profile_image || defaultProfile}
                            alt={`${employee.first_name} ${employee.last_name}`}
                            className="w-14 h-14 object-cover rounded-full border-2 border-white shadow"
                          />
                          {employee.status === "ACTIVE" && (
                            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                          {isAssigned && (
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                              <span className="text-xs text-white">✓</span>
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-800 text-lg">
                              {employee.first_name} {employee.last_name}
                            </h3>
                            {isAssigned && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                Assigned
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {roleInfo.icon} {roleInfo.label}
                          </p>

                          <div className="text-sm text-gray-600 space-y-1 mt-2">
                            {employee.email && (
                              <p className="flex items-center gap-1">
                                <span>📧</span>
                                {employee.email}
                                {employee.email_verified ? (
                                  <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                    Verified
                                  </span>
                                ) : (
                                  <span className="ml-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                                    Not Verified
                                  </span>
                                )}
                              </p>
                            )}
                            {employee.phone_number && (
                              <p className="flex items-center gap-1">
                                <span>📞</span>
                                {employee.phone_number}
                              </p>
                            )}
                          </div>

                          {/* Display assignment information */}
                          {renderAssignmentInfo(employee)}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        {employee.role !== "MANAGER" && (
                          <button
                            onClick={() => handleStartAssignment(employee)}
                            className={`px-3 py-1 rounded-lg text-sm font-semibold transition ${
                              isAssigned
                                ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                                : "bg-green-500 hover:bg-green-600 text-white"
                            }`}
                          >
                            {isAssigned ? "Change Team" : "Assign"}
                          </button>
                        )}

                        {employee.role !== "MANAGER" ? (
                          <button
                            onClick={() => handleMakeManager(employee)}
                            className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-lg text-sm font-semibold transition"
                          >
                            Make Manager
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRemoveManager(employee)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-semibold transition"
                          >
                            Remove Manager Status
                          </button>
                        )}

                        <button
                          onClick={() =>
                            navigate(`/admins/employees/${employee.id}`)
                          }
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-semibold transition"
                        >
                          Manage
                        </button>

                        <button
                          onClick={() => handleViewEmployee(employee)}
                          className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-lg text-sm font-semibold transition"
                        >
                          View
                        </button>

                        {!employee.email_verified && (
                          <button
                            onClick={() =>
                              handleResendInvite(employee.id, employee.email)
                            }
                            disabled={resendingIds.has(employee.id)}
                            className="px-3 py-1 rounded-lg text-sm font-semibold transition bg-blue-500 hover:bg-blue-600 text-white"
                          >
                            {resendingIds.has(employee.id) ? (
                              <CircularProgress
                                size={16}
                                style={{ color: "white" }}
                              />
                            ) : (
                              "Resend Invite"
                            )}
                          </button>
                        )}
                      </div>
                      {/* <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleStartAssignment(employee)}
                          className={`px-3 py-1 rounded-lg text-sm font-semibold transition ${
                            isAssigned
                              ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                              : "bg-green-500 hover:bg-green-600 text-white"
                          }`}
                        >
                          {isAssigned ? "Change Team" : "Assign"}
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/admins/employees/${employee.id}`)
                          }
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-semibold transition"
                        >
                          Manage
                        </button>
                        <button
                          onClick={() => handleViewEmployee(employee)}
                          className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-lg text-sm font-semibold transition"
                        >
                          View
                        </button>
                        {!employee.email_verified && (
                          <button
                            onClick={() =>
                              handleResendInvite(employee.id, employee.email)
                            }
                            disabled={isResending}
                            className={`px-3 py-1 rounded-lg text-sm font-semibold transition ${
                              isResending
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-blue-500 hover:bg-blue-600 text-white"
                            }`}
                          >
                            {isResending ? (
                              <CircularProgress
                                size={16}
                                style={{ color: "white" }}
                              />
                            ) : (
                              "Resend Invite"
                            )}
                          </button>
                        )}
                      </div> */}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      {/* Employee Details Modal */}
      {showEmployeeModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div
              className={`text-white p-6 ${
                isEmployeeAssigned(selectedEmployee)
                  ? "bg-gradient-to-r from-green-500 to-blue-600"
                  : "bg-gradient-to-r from-blue-500 to-blue-600"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={selectedEmployee.profile_image || defaultProfile}
                    alt={`${selectedEmployee.first_name} ${selectedEmployee.last_name}`}
                    className="w-16 h-16 object-cover rounded-full border-2 border-white shadow"
                  />
                  {selectedEmployee.status === "ACTIVE" && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                  {isEmployeeAssigned(selectedEmployee) && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                      <span className="text-xs text-white">✓</span>
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">
                    {selectedEmployee.first_name} {selectedEmployee.last_name}
                  </h2>
                  <p className="text-blue-100">
                    {getRoleInfo(selectedEmployee.role).icon}{" "}
                    {getRoleInfo(selectedEmployee.role).label}
                  </p>
                  {isEmployeeAssigned(selectedEmployee) && (
                    <div className="mt-1 text-sm bg-white bg-opacity-20 px-2 py-1 rounded">
                      ✅ Assigned to: {selectedEmployee.assigned_to.name}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-4">
                {selectedEmployee.id_number && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">ID Number</p>
                    <p className="font-semibold text-gray-800">
                      {selectedEmployee.id_number}
                    </p>
                  </div>
                )}

                {selectedEmployee.email && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Email</p>
                        <p className="font-semibold text-gray-800">
                          {selectedEmployee.email}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {selectedEmployee.email_verified ? (
                          <button
                            onClick={() =>
                              handleUnverifyEmail(selectedEmployee)
                            }
                            disabled={verifyingEmail}
                            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition disabled:opacity-50"
                          >
                            {verifyingEmail ? "..." : "Unverify"}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleVerifyEmail(selectedEmployee)}
                            disabled={verifyingEmail}
                            className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition disabled:opacity-50"
                          >
                            {verifyingEmail ? "..." : "Verify"}
                          </button>
                        )}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedEmployee.email_verified
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {selectedEmployee.email_verified
                        ? "Verified"
                        : "Not Verified"}
                    </span>
                  </div>
                )}

                {selectedEmployee.phone_number && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Phone</p>
                        <p className="font-semibold text-gray-800">
                          {selectedEmployee.phone_number}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {selectedEmployee.phone_verified ? (
                          <button
                            onClick={() =>
                              handleUnverifyPhone(selectedEmployee)
                            }
                            disabled={verifyingPhone}
                            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition disabled:opacity-50"
                          >
                            {verifyingPhone ? "..." : "Unverify"}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleVerifyPhone(selectedEmployee)}
                            disabled={verifyingPhone}
                            className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition disabled:opacity-50"
                          >
                            {verifyingPhone ? "..." : "Verify"}
                          </button>
                        )}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedEmployee.phone_verified
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {selectedEmployee.phone_verified
                        ? "Verified"
                        : "Not Verified"}
                    </span>
                  </div>
                )}
                {selectedEmployee.status && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Status</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        selectedEmployee.status === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {selectedEmployee.status === "ACTIVE"
                        ? "✓ Active"
                        : "✗ Inactive"}
                    </span>
                  </div>
                )}

                {selectedEmployee.date_joined && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Date Joined</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(
                        selectedEmployee.date_joined,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {isEmployeeAssigned(selectedEmployee) && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-xs text-gray-600 mb-1">
                      Current Assignment
                    </p>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">
                        {
                          getTeamTypeDisplay(selectedEmployee.assigned_to.type)
                            .icon
                        }
                      </span>
                      <p className="font-semibold text-blue-800">
                        {selectedEmployee.assigned_to.name}
                      </p>
                    </div>
                    <div className="text-sm text-gray-700">
                      Type: {selectedEmployee.assigned_to.type}
                      {selectedEmployee.assigned_to.vehicle_id && (
                        <span className="ml-2">
                          • ID: {selectedEmployee.assigned_to.vehicle_id}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                {selectedEmployee.email && !selectedEmployee.email_verified && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-xs text-gray-600 mb-2">
                      Invitation Status
                    </p>
                    <button
                      onClick={() =>
                        handleResendInvite(
                          selectedEmployee.id,
                          selectedEmployee.email,
                        )
                      }
                      disabled={resendingIds.has(selectedEmployee.id)}
                      className={`w-full py-2 rounded-lg font-semibold transition ${
                        resendingIds.has(selectedEmployee.id)
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-600 text-white"
                      }`}
                    >
                      {resendingIds.has(selectedEmployee.id) ? (
                        <span className="flex items-center justify-center gap-2">
                          <CircularProgress
                            size={18}
                            style={{ color: "white" }}
                          />
                          Sending...
                        </span>
                      ) : (
                        "Resend Invitation Email"
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="flex gap-2">
                <button
                  onClick={() => handleStartAssignment(selectedEmployee)}
                  className={`flex-1 py-3 rounded-lg font-semibold transition ${
                    isEmployeeAssigned(selectedEmployee)
                      ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                      : "bg-green-500 hover:bg-green-600 text-white"
                  }`}
                >
                  {isEmployeeAssigned(selectedEmployee)
                    ? "Change Assignment"
                    : "Assign Employee"}
                </button>
                <button
                  onClick={() => setShowEmployeeModal(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assignment Modal */}
      {showAssignmentModal && selectedForAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div
              className={`text-white p-6 ${
                isEmployeeAssigned(selectedForAssignment)
                  ? "bg-gradient-to-r from-yellow-500 to-orange-600"
                  : "bg-gradient-to-r from-green-500 to-green-600"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">
                    {isEmployeeAssigned(selectedForAssignment)
                      ? "Change Assignment"
                      : "Assign Employee"}
                  </h2>
                  <p className="text-white text-sm opacity-90">
                    {selectedForAssignment.first_name}{" "}
                    {selectedForAssignment.last_name}
                  </p>
                </div>
                <button
                  onClick={() => setShowAssignmentModal(false)}
                  className="text-white hover:text-gray-200 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1">
              {renderAssignmentStep()}
            </div>
          </div>
        </div>
      )}

      <footer className="fixed bottom-0 left-0 right-0">
        <AdminsFooter />
      </footer>
    </div>
  )
}

export default Employee
