// @ts-nocheck
import React, { useEffect, useState } from "react"
import { useMediaQuery, useTheme } from "@mui/material"
import { useNavigate } from "react-router-dom"
import planStatus from "../../features/planStatus/planStatus"
import BadgeIcon from "@mui/icons-material/Badge"

import { set } from "cookies"
import PaymentIcon from "@mui/icons-material/Payment"
import AdminsFooter from "../../components/AdminsFooter"
import Navbar from "../../components/ui/mobile/admin/Navbar"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  addVehicle,
  fetchVehicles,
  getAllVehicles,
} from "../../features/deliveries/vehiclesSlice"
import {
  fetchEmployees,
  selectAllEmployees,
} from "../../features/employees/employeesSlice"
import { toast, ToastContainer } from "react-toastify"
import CircularProgress from "@mui/material/CircularProgress"

const Delivery = () => {
  const dispatch = useAppDispatch()
  const theme = useTheme()
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

  const matches = useMediaQuery("(min-width:600px)")
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [vehicleType, setVehicleType] = useState("MOTORBIKE") // Default to motorbike
  const [numberPlate, setNumberPlate] = useState("")
  const [engineCC, setEngineCC] = useState("")
  const [driver, setDriver] = useState("")
  const [conductor, setConductor] = useState("")
  const [vehicles, setVehicles] = useState([]) // List of vehicles from the database
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const all_vehicles = useAppSelector(getAllVehicles)
  const all_employees = useAppSelector(selectAllEmployees)
  console.log("All employees from Redux:", all_employees)
  console.log("All vehicles from Redux:", all_vehicles)

  const handleShowForm = () => {
    setShowForm((prev) => {
      const newShowForm = !prev // Toggle the form visibility
      if (newShowForm) {
        // Fetch employees when the form is shown
        dispatch(fetchEmployees({ businessId }))
      }
      return newShowForm
    })
  }

  useEffect(() => {
    if (!businessId) return

    // Always fetch vehicles
    dispatch(fetchVehicles({ businessId }))

    // Only fetch employees when the add form is visible
    if (showForm) {
      // alert("Fetching employees...")
      dispatch(fetchEmployees({ businessId }))
    }
  }, [dispatch, businessId])

  useEffect(() => {
    // Replace this with an API call to fetch vehicles
    setVehicles([
      {
        id: 1,
        type: "motorbike",
        numberPlate: "KAA 123A",
        engineCC: "150",
        driver: "John Doe",
      },
      {
        id: 2,
        type: "vehicle",
        numberPlate: "KBB 456B",
        engineCC: "2000",
        driver: "Jane Smith",
        conductor: "Mike Johnson",
      },
    ])
  }, [])

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true) // Set submitting to true
    const formData = {
      business: businessId,
      type_of_vehicle: vehicleType,
      vehicle_number: numberPlate,
      engine_capacity: engineCC,
      driver: driver,
      conductor: vehicleType === "VEHICLE" ? conductor : undefined, // Only include conductor for normal vehicles
    }
    console.log("Form Data to be sent:", formData)
    try {
      await dispatch(addVehicle(formData)).unwrap()
      toast.success("Vehicle added successfully!")
      // Clear the form fields
      setVehicleType("MOTORBIKE")
      setNumberPlate("")
      setEngineCC("")
      setDriver("")
      setConductor("")
    } catch (error: any) {
      toast.error(error || "Failed to add vehicle. Please try again.")
    } finally {
      setSubmitting(false) // Reset submitting to false
    }
  }

  const handleUpdateVehicle = (vehicle) => {
    // Logic to update the vehicle
    // For example, open a modal with the vehicle's details pre-filled
    console.log("Update vehicle:", vehicle)
  }

  const handleDeleteVehicle = (id) => {
    // Logic to delete the vehicle
    // For example, make an API call to delete the vehicle from the database
    setVehicles((prev) => prev.filter((vehicle) => vehicle.id !== id))
    console.log("Deleted vehicle with ID:", id)
  }

  return (
    <div>
      {isMobile ? (
        <div className="min-h-screen bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-gray-800 flex flex-col font-sans">
          <Navbar
            headerMessage={"ERP"}
            headerText={"Manage your operations with style and clarity"}
          />
          <ToastContainer />
          <main className="flex-grow m-2 p-1">
            <div>
              <h2 className="text-xl font-bold mb-4">
                Manage Delivery Vehicles
              </h2>

              <div className="flex justify-end mb-2">
                {(showForm && (
                  <button
                    onClick={handleShowForm}
                    className="bg-blue-500 text-white rounded-md px-2 "
                  >
                    Add <ArrowDropUpIcon />
                  </button>
                )) || (
                  <button
                    onClick={handleShowForm}
                    className="bg-blue-500 text-white rounded-md px-2 "
                  >
                    Add <ArrowDropDownIcon />
                  </button>
                )}
              </div>

              {/* Form for adding vehicles */}
              <form
                onSubmit={handleAddVehicle}
                className={`space-y-4 bg-white p-4 rounded-lg transition-all shadow-md ${
                  showForm ? "block" : "hidden"
                }`}
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle Type<span className="text-red-500">*</span>
                  </label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="MOTORBIKE">Motorbike</option>
                    <option value="VEHICLE">Normal Vehicle</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number Plate<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={numberPlate}
                    onChange={(e) => setNumberPlate(e.target.value)}
                    placeholder="Enter number plate"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Engine CC
                  </label>
                  <input
                    type="number"
                    value={engineCC}
                    onChange={(e) => setEngineCC(e.target.value)}
                    placeholder="Enter engine CC"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Driver
                  </label>
                  <select
                    value={driver}
                    onChange={(e) => setDriver(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Driver</option>
                    {all_employees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.first_name} {employee.last_name}
                      </option>
                    ))}
                  </select>
                </div>

                {vehicleType === "VEHICLE" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Conductor
                    </label>
                    <select
                      value={conductor}
                      onChange={(e) => setConductor(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Conductor</option>
                      {all_employees.map((employee) => (
                        <option key={employee.id} value={employee.id}>
                          {employee.first_name} {employee.last_name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting} // Disable the button while submitting
                  className={`w-full py-2 px-4 rounded-md transition ${
                    submitting
                      ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {submitting ? (
                    <div className="flex items-center justify-center">
                      <CircularProgress size={20} className="text-white mr-2" />
                      Adding...
                    </div>
                  ) : (
                    "Add Vehicle"
                  )}
                </button>
              </form>
            </div>

            {/* List of available vehicles */}
            {/* List of available vehicles */}
            <h3 className="text-lg font-bold mt-6 mb-4">Available Vehicles</h3>
            <div className="space-y-4">
              {all_vehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="p-4 bg-white rounded-lg shadow-md flex-col space-y-2 justify-between items-center"
                >
                  <div>
                    <p className="text-sm">
                      <strong>Type:</strong> {vehicle.type_of_vehicle}
                    </p>
                    <p className="text-sm">
                      <strong>Number Plate:</strong> {vehicle.number}
                    </p>
                    <p className="text-sm">
                      <strong>Engine CC:</strong> {vehicle.engine_capacity}
                    </p>
                    <p className="text-sm">
                      <strong>Driver:</strong> {vehicle.driver?.first_name}{" "}
                    </p>
                    {vehicle.type_of_vehicle === "VEHICLE" && (
                      <p className="text-sm">
                        <strong>Conductor:</strong> {vehicle.conductor?.first_name}{" "}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {/* Update Button */}
                    <button
                      onClick={() => handleUpdateVehicle(vehicle)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition"
                    >
                      Update
                    </button>
                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteVehicle(vehicle.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </main>
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

export default Delivery
