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
import { WhatsappShareButton, WhatsappIcon } from "react-share"
import {
  fetchSalesTeamVehicle,
  selectAllSalesTeamVehicle,
} from "../../features/salesTeam/salesTeamVehicleSlice"
import {
  fetchSalesTeamShops,
  selectAllSalesTeamShops,
} from "../../features/salesTeam/salesTeamSlice"
import { fetchStore, selectAllStore } from "../../features/store/storeSlice"

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

  const allEmployees = useAppSelector(selectAllEmployees)
  console.log("all employees ", allEmployees)
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

  const filteredEmployees = allEmployees.filter((employee) => {
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
    setSelectedForAssignment(employee)
    setAssignmentStep(1)
    setShowAssignmentModal(true)
  }

  const handleAssignToLocation = async () => {
    const formData = {
      employee_id: selectedForAssignment.id,
    }
    if (assignmentType === "STORE") {
      formData.store_id = selectedLocation.id
    } else if (assignmentType === "VEHICLE") {
      formData.vehicle_id = selectedLocation.id
    } else if (assignmentType === "SHOP") {
      formData.shop_id = selectedLocation.id
    }
    const teamName = selectedLocation.name
    // Here you would typically make an API call
    try {
      await dispatch(assignEmployee({ formData, teamName }))
      toast.success(
        `Assigned ${selectedForAssignment.first_name} to ${selectedLocation.name}`,
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
    setAssignmentStep(1)
  }

  const handleChangeAssignToLocation = async () => {
    const formData = {
      employee_id: selectedForAssignment.id,
    }
    if (assignmentType === "STORE") {
      formData.store_id = selectedLocation.id
    } else if (assignmentType === "VEHICLE") {
      formData.vehicle_id = selectedLocation.id
    } else if (assignmentType === "SHOP") {
      formData.shop_id = selectedLocation.id
    }
    const teamName = selectedLocation.name

    // Here you would typically make an API call
    try {
      await dispatch(changeAssignEmployee({ formData, teamName }))
      toast.success(
        `Transferred ${selectedForAssignment.first_name} to ${selectedLocation.name}`,
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
                {isChangingAssignment && (
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
                      No other stores available for transfer
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
                      No other shops available for transfer
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
                      No other vehicles available for transfer
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assign as:
                  </label>
                  <div className="flex gap-2">
                    {["DRIVER", "CONDUCTOR"].map((role) => (
                      <button
                        key={role}
                        onClick={() => setVehicleRole(role)}
                        className={`flex-1 p-3 border-2 rounded-lg ${
                          vehicleRole === role
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <div className="font-semibold">
                          {role === "DRIVER" ? "👨‍✈️ Driver" : "🎫 Conductor"}
                        </div>
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
                      No other motorcycles available for transfer
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
                  {assignmentType === "VEHICLE" && (
                    <div className="mt-2">
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                        Role:{" "}
                        {vehicleRole === "DRIVER" ? "Driver" : "Conductor"}
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

  // Calculate statistics
  const assignedCount = allEmployees.filter(isEmployeeAssigned).length
  const unassignedCount = allEmployees.length - assignedCount

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-gray-800 font-sans">
      <Navbar
        headerMessage={"ERP"}
        headerText={"Manage your operations with style and clarity"}
      />
      <ToastContainer />

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
                      isAssigned
                        ? "bg-gradient-to-r from-green-50 to-blue-50 border-green-200"
                        : "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
                    }`}
                  >
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
                      </div>
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
                    <p className="text-xs text-gray-600 mb-1">Email</p>
                    <p className="font-semibold text-gray-800">
                      {selectedEmployee.email}
                    </p>
                  </div>
                )}

                {selectedEmployee.phone_number && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Phone</p>
                    <p className="font-semibold text-gray-800">
                      {selectedEmployee.phone_number}
                    </p>
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
