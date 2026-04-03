// @ts-nocheck
import React, { useEffect, useState } from "react"
import { useMediaQuery, useTheme } from "@mui/material"
import { useNavigate } from "react-router-dom"
import planStatus from "../../features/planStatus/planStatus"
import BadgeIcon from "@mui/icons-material/Badge"
import LocalShippingIcon from "@mui/icons-material/LocalShipping"
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler"
import SaveIcon from "@mui/icons-material/Save"
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar"
import PersonIcon from "@mui/icons-material/Person"
import EngineeringIcon from "@mui/icons-material/Engineering"
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber"
import SpeedIcon from "@mui/icons-material/Speed"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import AddIcon from "@mui/icons-material/Add"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import ExpandLessIcon from "@mui/icons-material/ExpandLess"
// import BadgeIcon from "@mui/icons-material/Badge"
import { set } from "cookies"
import PaymentIcon from "@mui/icons-material/Payment"
import AdminsFooter from "../../components/AdminsFooter"
import Navbar from "../../components/ui/mobile/admin/Navbar"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  addVehicle,
  deleteVehicle,
  fetchVehicles,
  getAllVehicles,
} from "../../features/deliveries/vehiclesSlice"
import {
  fetchEmployees,
  selectAllEmployees,
} from "../../features/employees/employeesSlice"
import { toast, ToastContainer } from "react-toastify"
import CircularProgress from "@mui/material/CircularProgress"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import Slide from "@mui/material/Slide"
import { TransitionProps } from "@mui/material/transitions"
import RealTimeIndicator from "../../components/sales/RealTimeIndicator"

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />
})

const Deliveries = () => {
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
  const [delting, setDeleting] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [deleteVehicleNumber, setDeleteVehicleNumber] = useState("")
  const [deleteVehicleType, setDeleteVehicleType] = useState("")
  const [openAssignedModal, setOpenAssignedModal] = useState(false)
  const [selectedEmployeeForModal, setSelectedEmployeeForModal] = useState(null)
  const [open, setOpen] = React.useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editVehicle, setEditVehicle] = useState(null)
  const [editVehicleType, setEditVehicleType] = useState("MOTORBIKE")
  const [editNumberPlate, setEditNumberPlate] = useState("")
  const [editEngineCC, setEditEngineCC] = useState("")
  const [editDriver, setEditDriver] = useState("")
  const [editConductor, setEditConductor] = useState("")
  const [editing, setEditing] = useState(false)
  // Advanced Features
  const [batchMode, setBatchMode] = useState(false)
  const [selectedBatchItems, setSelectedBatchItems] = useState([])
  const [lastUpdated, setLastUpdated] = useState(null)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [realTimeEnabled, setRealTimeEnabled] = useState(false)
  const [dataVersion, setDataVersion] = useState(0)

  const all_vehicles = useAppSelector(getAllVehicles)
  const all_employees = useAppSelector(selectAllEmployees)

  const handleShowForm = () => {
    setShowForm((prev) => {
      const newShowForm = !prev
      if (newShowForm) {
        dispatch(fetchEmployees({ businessId }))
      }
      return newShowForm
    })
  }

  useEffect(() => {
    if (!businessId) return

    dispatch(fetchVehicles({ businessId }))

    if (showForm) {
      dispatch(fetchEmployees({ businessId }))
    }
  }, [dispatch, businessId])

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const formData = {
      business: businessId,
      type_of_vehicle: vehicleType,
      number_plate: numberPlate,
      engine_size: engineCC,
      driver: driver,
      conductor: vehicleType === "VEHICLE" ? conductor : undefined,
    }
    try {
      await dispatch(addVehicle(formData)).unwrap()
      toast.success("Vehicle added successfully!")
      setVehicleType("MOTORBIKE")
      setNumberPlate("")
      setEngineCC("")
      setDriver("")
      setConductor("")
      setShowForm(false)
    } catch (error: any) {
      toast.error(error || "Failed to add vehicle. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleOpenDeleteVehicle = (id, vehicle_number, type_of_vehicle) => {
    setDeleteId(id)
    setDeleteVehicleNumber(vehicle_number)
    setDeleteVehicleType(type_of_vehicle)
    setOpen(true)
  }

  const handleDeleteThisVehicle = async () => {
    setDeleting(true)

    try {
      await dispatch(deleteVehicle(deleteId)).unwrap()
      toast.success("Vehicle deleted successfully!")
      setOpen(false)
      setDeleting(false)
    } catch (error) {
      setDeleting(false)
      toast.error(error || "Failed to delete vehicle. Please try again.")
    }
  }

  const getVehicleIcon = (type) => {
    return type === "MOTORBIKE" ? <TwoWheelerIcon /> : <DirectionsCarIcon />
  }

  const getVehicleColor = (type) => {
    return type === "MOTORBIKE" ? "bg-blue-500" : "bg-purple-500"
  }

  const getVehicleBgColor = (type) => {
    return type === "MOTORBIKE" ? "bg-blue-50" : "bg-purple-50"
  }

  const handleEmployeeSelection = (employee, setter) => {
    if (employee?.assigned_to?.type && employee?.assigned_to?.name) {
      setSelectedEmployeeForModal(employee)
      setOpenAssignedModal(true)
    }
    setter(employee.id) // Still allow selection, just inform
  }

  const getEmployeeDisplayText = (employee) => {
    const name = `${employee.first_name} ${employee.last_name}`
    if (employee.assigned_to?.type && employee.assigned_to?.name) {
      return `${name} (Assigned to ${employee.assigned_to.type}: ${employee.assigned_to.name})`
    }
    return name
  }

  // For filtering options:
  // Driver options: exclude the selected conductor
  const driverOptions = all_employees.filter(
    (emp) => emp.id !== Number(conductor),
  )
  // Conductor options: exclude the selected driver (and only show if vehicle type is VEHICLE)
  const conductorOptions = all_employees.filter(
    (emp) => emp.id !== Number(driver),
  )

  const handleEditClick = (vehicle) => {
    setEditVehicle(vehicle)
    setEditVehicleType(vehicle.type_of_vehicle)
    setEditNumberPlate(vehicle.number_plate)
    setEditEngineCC(vehicle.engine_size)
    setEditDriver(vehicle.driver?.id || "")
    setEditConductor(vehicle.conductor?.id || "")
    setEditOpen(true)
  }

  const handleUpdateVehicle = (vehicle) => {
    handleEditClick(vehicle)
  }

  const handleEditDriverChange = (empId) => {
    const employee = all_employees.find((emp) => emp.id === Number(empId))
    if (employee) {
      if (employee?.assigned_to?.type && employee?.assigned_to?.name) {
        setSelectedEmployeeForModal(employee)
        setOpenAssignedModal(true)
      }
      setEditDriver(employee.id)
    } else {
      setEditDriver(empId)
    }
  }

  const handleEditConductorChange = (empId) => {
    const employee = all_employees.find((emp) => emp.id === Number(empId))
    if (employee) {
      if (employee?.assigned_to?.type && employee?.assigned_to?.name) {
        setSelectedEmployeeForModal(employee)
        setOpenAssignedModal(true)
      }
      setEditConductor(employee.id)
    } else {
      setEditConductor(empId)
    }
  }

  const driverOptionsEdit = all_employees.filter(
    (emp) => emp.id !== Number(editConductor),
  )

  const conductorOptionsEdit = all_employees.filter(
    (emp) => emp.id !== Number(editDriver),
  )

  const handleEditSubmit = async () => {
    setEditing(true)
    const formData = {
      id: editVehicle.id,
      business: businessId,
      type_of_vehicle: editVehicleType,
      number_plate: editNumberPlate,
      engine_size: editEngineCC,
      driver: editDriver,
      conductor: editVehicleType === "VEHICLE" ? editConductor : undefined,
    }
    try {
      await dispatch(updateVehicle(formData)).unwrap()
      toast.success("Vehicle updated successfully!")
      setEditOpen(false)
      // Refresh vehicles list
      dispatch(fetchVehicles({ businessId }))
    } catch (error: any) {
      toast.error(error || "Failed to update vehicle. Please try again.")
    } finally {
      setEditing(false)
    }
  }
  return (
    <div>
      {isMobile ? (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 text-gray-800 flex flex-col font-sans">
          <Navbar
            headerMessage={"Delivery Fleet"}
            headerText={"Manage your delivery vehicles and drivers"}
          />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />

          {/* Real-time Indicator */}
          <div className="prevent-overflow">
            <RealTimeIndicator
              enabled={autoRefresh}
              lastUpdated={lastUpdated}
              dataVersion={dataVersion}
              onToggle={() => setAutoRefresh(!autoRefresh)}
            />
          </div>

          <main className="flex-grow p-4 pb-20">
            {/* Header with Stats */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <LocalShippingIcon className="text-blue-600 text-2xl" />
                <h1 className="text-2xl font-bold text-gray-900">
                  Vehicle Fleet
                </h1>
              </div>
              <p className="text-gray-600">
                Manage all your delivery vehicles and assign drivers
              </p>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Vehicles</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {all_vehicles.length}
                      </p>
                    </div>
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <LocalShippingIcon className="text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Active Drivers</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {all_vehicles.filter((v) => v.driver).length}
                      </p>
                    </div>
                    <div className="p-2 bg-green-100 rounded-lg">
                      <PersonIcon className="text-green-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Add Vehicle Button */}
            <div className="mb-6">
              <button
                onClick={handleShowForm}
                className="w-full py-4 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                <AddIcon />
                {showForm ? "Close Form" : "Add New Vehicle"}
              </button>
            </div>

            {/* Add Vehicle Form */}
            <div
              className={`transition-all duration-300 transform ${
                showForm ? "block" : "hidden"
              }`}
            >
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <AddIcon className="text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Add New Vehicle
                    </h2>
                    <p className="text-gray-600 text-sm">
                      Enter vehicle details below
                    </p>
                  </div>
                </div>

                <form onSubmit={handleAddVehicle} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className=" text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <DirectionsCarIcon
                          className="text-gray-500"
                          size={18}
                        />
                        Vehicle Type
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => setVehicleType("MOTORBIKE")}
                          className={`flex-1 py-3 px-4 rounded-lg border-2 flex items-center justify-center gap-2 transition-all ${
                            vehicleType === "MOTORBIKE"
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-200 bg-white text-gray-700 hover:border-blue-300"
                          }`}
                        >
                          <TwoWheelerIcon />
                          Motorbike
                        </button>
                        <button
                          type="button"
                          onClick={() => setVehicleType("VEHICLE")}
                          className={`flex-1 py-3 px-4 rounded-lg border-2 flex items-center justify-center gap-2 transition-all ${
                            vehicleType === "VEHICLE"
                              ? "border-purple-500 bg-purple-50 text-purple-700"
                              : "border-gray-200 bg-white text-gray-700 hover:border-purple-300"
                          }`}
                        >
                          <DirectionsCarIcon />
                          Vehicle
                        </button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className=" text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <ConfirmationNumberIcon
                        className="text-gray-500"
                        size={18}
                      />
                      Number Plate
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={numberPlate}
                      onChange={(e) => setNumberPlate(e.target.value)}
                      placeholder="e.g., KAA 123A"
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-colors"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className=" text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <SpeedIcon className="text-gray-500" size={18} />
                        Engine Capacity
                      </label>
                      <input
                        type="number"
                        value={engineCC}
                        onChange={(e) => setEngineCC(e.target.value)}
                        placeholder="e.g., 150"
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className=" text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <PersonIcon className="text-gray-500" size={18} />
                        Driver
                      </label>
                      <select
                        value={driver}
                        onChange={(e) => {
                          const empId = e.target.value
                          const employee = all_employees.find(
                            (emp) => emp.id === Number(empId),
                          )
                          if (employee) {
                            handleEmployeeSelection(employee, setDriver)
                          } else {
                            setDriver(empId)
                          }
                        }}
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-colors bg-white"
                        required
                      >
                        <option value="">Select Driver</option>
                        {driverOptions.map((employee) => (
                          <option key={employee.id} value={employee.id}>
                            {getEmployeeDisplayText(employee)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {vehicleType === "VEHICLE" && (
                    <div>
                      <label className=" text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <EngineeringIcon className="text-gray-500" size={18} />
                        Conductor
                      </label>
                      <select
                        value={conductor}
                        onChange={(e) => {
                          const empId = e.target.value
                          const employee = all_employees.find(
                            (emp) => emp.id === Number(empId),
                          )
                          if (employee) {
                            handleEmployeeSelection(employee, setConductor)
                          } else {
                            setConductor(empId)
                          }
                        }}
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-colors bg-white"
                        required
                      >
                        <option value="">Select Conductor</option>
                        {conductorOptions.map((employee) => (
                          <option key={employee.id} value={employee.id}>
                            {getEmployeeDisplayText(employee)}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className={`w-full py-4 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                      submitting
                        ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl"
                    }`}
                  >
                    {submitting ? (
                      <>
                        <CircularProgress size={20} className="text-white" />
                        Adding Vehicle...
                      </>
                    ) : (
                      <>
                        <LocalShippingIcon />
                        Add Vehicle to Fleet
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Vehicles List */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Your Vehicles
                  </h2>
                  <p className="text-gray-600 text-sm">
                    All registered delivery vehicles
                  </p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                  {all_vehicles.length} vehicles
                </span>
              </div>

              {all_vehicles.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <LocalShippingIcon className="text-gray-300 text-6xl mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    No Vehicles Yet
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Add your first delivery vehicle to get started
                  </p>
                  <button
                    onClick={handleShowForm}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all"
                  >
                    Add First Vehicle
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {all_vehicles.map((vehicle) => (
                    <div
                      key={vehicle.id}
                      className={`p-5 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md ${
                        vehicle.type_of_vehicle === "MOTORBIKE"
                          ? "bg-gradient-to-r from-blue-50 to-white"
                          : "bg-gradient-to-r from-purple-50 to-white"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div
                            className={`p-3 rounded-xl ${getVehicleColor(
                              vehicle.type_of_vehicle,
                            )} text-white`}
                          >
                            {getVehicleIcon(vehicle.type_of_vehicle)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-gray-900">
                                {vehicle.number_plate}
                              </h3>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  vehicle.type_of_vehicle === "MOTORBIKE"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-purple-100 text-purple-700"
                                }`}
                              >
                                {vehicle.type_of_vehicle === "MOTORBIKE"
                                  ? "Motorbike"
                                  : "Vehicle"}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-3">
                              <div className="flex items-center gap-2">
                                <SpeedIcon className="text-gray-400 text-sm" />
                                <span className="text-sm text-gray-600">
                                  Engine:
                                </span>
                                <span className="text-sm font-medium text-gray-900">
                                  {vehicle.engine_size} CC
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <PersonIcon className="text-gray-400 text-sm" />
                                <span className="text-sm text-gray-600">
                                  Driver:
                                </span>
                                <span className="text-sm font-medium text-gray-900">
                                  {vehicle.driver?.first_name}{" "}
                                  {vehicle.driver?.last_name}
                                </span>
                              </div>

                              {vehicle.type_of_vehicle === "VEHICLE" &&
                                vehicle.conductor && (
                                  <div className="flex items-center gap-2 col-span-2">
                                    <EngineeringIcon className="text-gray-400 text-sm" />
                                    <span className="text-sm text-gray-600">
                                      Conductor:
                                    </span>
                                    <span className="text-sm font-medium text-gray-900">
                                      {vehicle.conductor?.first_name}{" "}
                                      {vehicle.conductor?.last_name}
                                    </span>
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleUpdateVehicle(vehicle)}
                            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                            title="Edit vehicle"
                          >
                            <EditIcon />
                          </button>
                          <button
                            onClick={() =>
                              handleOpenDeleteVehicle(
                                vehicle.id,
                                vehicle.vehicle_number,
                                vehicle.type_of_vehicle,
                              )
                            }
                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                            title="Delete vehicle"
                            disabled={delting}
                          >
                            <DeleteIcon />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            PaperProps={{
              style: {
                borderRadius: "16px",
                padding: "8px",
              },
            }}
          >
            <DialogTitle className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${getVehicleColor(
                  deleteVehicleType,
                )} text-white`}
              >
                {deleteVehicleType === "MOTORBIKE" ? (
                  <TwoWheelerIcon />
                ) : (
                  <DirectionsCarIcon />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Delete Vehicle
                </h2>
                <p className="text-gray-600 text-sm">
                  Are you sure you want to delete this vehicle?
                </p>
              </div>
            </DialogTitle>
            <DialogContent>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 my-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <DeleteIcon className="text-red-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-red-800">
                      Warning: This action cannot be undone
                    </p>
                    <p className="text-red-600 text-sm mt-1">
                      Vehicle{" "}
                      <span className="font-bold">{deleteVehicleNumber}</span>{" "}
                      will be permanently removed from your fleet.
                    </p>
                  </div>
                </div>
              </div>
            </DialogContent>
            <DialogActions className="px-6 pb-6">
              <Button
                onClick={handleClose}
                className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteThisVehicle}
                disabled={delting}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all flex items-center gap-2"
              >
                {delting ? (
                  <>
                    <CircularProgress size={20} className="text-white" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <DeleteIcon />
                    Delete Vehicle
                  </>
                )}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Assigned Employee Info Modal */}
          <Dialog
            open={openAssignedModal}
            onClose={() => setOpenAssignedModal(false)}
            TransitionComponent={Transition}
            keepMounted
            PaperProps={{
              style: {
                borderRadius: "16px",
                padding: "8px",
              },
            }}
          >
            <DialogTitle className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <PersonIcon className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Employee Assignment
                </h2>
                <p className="text-gray-600 text-sm">
                  This employee is already assigned
                </p>
              </div>
            </DialogTitle>
            <DialogContent>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 my-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <BadgeIcon className="text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-yellow-800">
                      {selectedEmployeeForModal?.first_name}{" "}
                      {selectedEmployeeForModal?.last_name}
                    </p>
                    <p className="text-yellow-700 text-sm mt-1">
                      This employee is currently assigned to{" "}
                      <span className="font-bold">
                        {selectedEmployeeForModal?.assigned_to?.type}:{" "}
                        {selectedEmployeeForModal?.assigned_to?.name}
                      </span>
                      .<br />
                      You can still assign them to this vehicle, but please
                      verify if this is intended.
                    </p>
                  </div>
                </div>
              </div>
            </DialogContent>
            <DialogActions className="px-6 pb-6">
              <Button
                onClick={() => setOpenAssignedModal(false)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all"
              >
                OK
              </Button>
            </DialogActions>
          </Dialog>
          {/* Edit Vehicle Modal */}
          <Dialog
            open={editOpen}
            onClose={() => setEditOpen(false)}
            TransitionComponent={Transition}
            keepMounted
            PaperProps={{
              style: {
                borderRadius: "16px",
                padding: "8px",
                maxWidth: "500px",
                width: "90%",
                margin: "16px",
              },
            }}
          >
            <DialogTitle className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <EditIcon className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Edit Vehicle
                </h2>
                <p className="text-gray-600 text-sm">Update vehicle details</p>
              </div>
            </DialogTitle>
            <DialogContent>
              <form className="space-y-5 mt-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <DirectionsCarIcon className="text-gray-500" size={18} />
                      Vehicle Type
                    </label>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => setEditVehicleType("MOTORBIKE")}
                        className={`flex-1 py-3 px-4 rounded-lg border-2 flex items-center justify-center gap-2 transition-all ${
                          editVehicleType === "MOTORBIKE"
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-200 bg-white text-gray-700 hover:border-blue-300"
                        }`}
                      >
                        <TwoWheelerIcon />
                        Motorbike
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditVehicleType("VEHICLE")}
                        className={`flex-1 py-3 px-4 rounded-lg border-2 flex items-center justify-center gap-2 transition-all ${
                          editVehicleType === "VEHICLE"
                            ? "border-purple-500 bg-purple-50 text-purple-700"
                            : "border-gray-200 bg-white text-gray-700 hover:border-purple-300"
                        }`}
                      >
                        <DirectionsCarIcon />
                        Vehicle
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <ConfirmationNumberIcon
                      className="text-gray-500"
                      size={18}
                    />
                    Number Plate
                  </label>
                  <input
                    type="text"
                    value={editNumberPlate}
                    onChange={(e) => setEditNumberPlate(e.target.value)}
                    placeholder="e.g., KAA 123A"
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-colors"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <SpeedIcon className="text-gray-500" size={18} />
                      Engine Capacity
                    </label>
                    <input
                      type="number"
                      value={editEngineCC}
                      onChange={(e) => setEditEngineCC(e.target.value)}
                      placeholder="e.g., 150"
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <PersonIcon className="text-gray-500" size={18} />
                      Driver
                    </label>
                    <select
                      value={editDriver}
                      onChange={(e) => handleEditDriverChange(e.target.value)}
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-colors bg-white"
                      required
                    >
                      <option value="">Select Driver</option>
                      {driverOptionsEdit.map((employee) => (
                        <option key={employee.id} value={employee.id}>
                          {getEmployeeDisplayText(employee)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {editVehicleType === "VEHICLE" && (
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <EngineeringIcon className="text-gray-500" size={18} />
                      Conductor
                    </label>
                    <select
                      value={editConductor}
                      onChange={(e) =>
                        handleEditConductorChange(e.target.value)
                      }
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-colors bg-white"
                      required
                    >
                      <option value="">Select Conductor</option>
                      {conductorOptionsEdit.map((employee) => (
                        <option key={employee.id} value={employee.id}>
                          {getEmployeeDisplayText(employee)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </form>
            </DialogContent>
            <DialogActions className="px-6 pb-6">
              <Button
                onClick={() => setEditOpen(false)}
                className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditSubmit}
                disabled={editing}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all flex items-center gap-2"
              >
                {editing ? (
                  <>
                    <CircularProgress size={20} className="text-white" />
                    Saving...
                  </>
                ) : (
                  <>
                    <SaveIcon />
                    Save Changes
                  </>
                )}
              </Button>
            </DialogActions>
          </Dialog>

          <footer className="mt-auto">
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

export default Deliveries
