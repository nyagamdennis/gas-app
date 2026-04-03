// @ts-nocheck
import React, { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { useNavigate, useParams, Link } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import CircularProgress from "@mui/material/CircularProgress"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Tabs,
  Tab,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material"
import {
  CheckCircle,
  Cancel,
  Warning,
  TransferWithinAStation,
  Phone,
  Email,
  Badge,
  Work,
  LocationOn,
  CalendarToday,
  AccountCircle,
  AttachMoney,
  History,
  AccessTime,
  EventNote,
  Star,
  Assignment,
  TrendingUp,
  EventAvailable,
  Edit,
  Refresh,
} from "@mui/icons-material"

import Navbar from "../../components/ui/mobile/admin/Navbar"
import AdminsFooter from "../../components/AdminsFooter"
import defaultProfile from "../../components/media/default.png"
import {
  fetchSingleEmployee,
  terminateEmployee,
  employeeAttendance,
  employeeLeave,
  employeeReactivate,
  selectSingleEmployee,
  selectSingleEmployeeStatus,
  selectTerminationStatus,
  selectAttendanceData,
  selectAttendanceStatus,
  selectLeaveData,
  selectLeaveStatus,
  clearTerminationStatus,
  clearAttendanceStatus,
  clearLeaveStatus,
  clearReactivationStatus,
} from "../../features/employees/singleEmployeeSlice"
import RealTimeIndicator from "../../components/sales/RealTimeIndicator"

// Helper function to get team type display
const getTeamTypeDisplay = (type) => {
  switch (type) {
    case "VEHICLE":
      return { icon: "🚚", label: "Vehicle Team" }
    case "SHOP":
      return { icon: "🏪", label: "Shop Team" }
    case "STORE":
      return { icon: "🏬", label: "Store Team" }
    case "DELIVERY":
      return { icon: "🏍️", label: "Delivery Team" }
    default:
      return { icon: "👥", label: "Team" }
  }
}

// Helper function to get role icon
const getRoleIcon = (role) => {
  switch (role) {
    case "SHOP_ATTENDANT":
      return "🏪"
    case "DELIVERY_GUY":
      return "🏍️"
    case "STORE_MAN":
      return "📦"
    case "SECURITY":
      return "🛡️"
    case "TRUCK_DRIVER":
      return "🚛"
    case "CONDUCTOR":
      return "🎫"
    case "SALES_PERSON":
      return "💼"
    default:
      return "👤"
  }
}

const EmployeesProfileDetails = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  // Redux selectors
  const employee = useAppSelector(selectSingleEmployee)
  const status = useAppSelector(selectSingleEmployeeStatus)
  const terminationStatus = useAppSelector(selectTerminationStatus)
  const attendanceData = useAppSelector(selectAttendanceData)
  const attendanceStatus = useAppSelector(selectAttendanceStatus)
  const leaveData = useAppSelector(selectLeaveData)
  const leaveStatus = useAppSelector(selectLeaveStatus)


  // Advanced Features
    const [batchMode, setBatchMode] = useState(false)
    const [selectedBatchItems, setSelectedBatchItems] = useState([])
    const [lastUpdated, setLastUpdated] = useState(null)
    const [autoRefresh, setAutoRefresh] = useState(false)
    const [realTimeEnabled, setRealTimeEnabled] = useState(false)
    const [dataVersion, setDataVersion] = useState(0)
  
    
  // Local state
  const [activeTab, setActiveTab] = useState(0)
  const [terminateDialogOpen, setTerminateDialogOpen] = useState(false)
  const [reactivateDialogOpen, setReactivateDialogOpen] = useState(false)
  const [terminationData, setTerminationData] = useState({
    termination_reason: "",
    termination_date: new Date().toISOString().split("T")[0],
    notice_period_days: 30,
    final_settlement_amount: "",
    remarks: "",
  })
  const [reactivationData, setReactivationData] = useState({
    reactivation_reason: "",
  })

  useEffect(() => {
    if (id) {
      dispatch(fetchSingleEmployee(id))
    }

    return () => {
      dispatch(clearTerminationStatus())
      dispatch(clearAttendanceStatus())
      dispatch(clearLeaveStatus())
      dispatch(clearReactivationStatus())
    }
  }, [dispatch, id])

  useEffect(() => {
    if (id && activeTab === 1) {
      dispatch(employeeAttendance({ employeeId: id }))
    }
  }, [dispatch, id, activeTab])

  useEffect(() => {
    if (id && activeTab === 2) {
      dispatch(employeeLeave({ employeeId: id }))
    }
  }, [dispatch, id, activeTab])

  const handleTerminateEmployee = () => {
    if (!id) return

    dispatch(terminateEmployee({ employeeId: id, data: terminationData }))
      .unwrap()
      .then(() => {
        toast.success("Employee terminated successfully")
        setTerminateDialogOpen(false)
        setTerminationData({
          termination_reason: "",
          termination_date: new Date().toISOString().split("T")[0],
          notice_period_days: 30,
          final_settlement_amount: "",
          remarks: "",
        })
        dispatch(fetchSingleEmployee(id))
      })
      .catch((error) => {
        console.error("Failed to terminate employee:", error)
        toast.error("Failed to terminate employee")
      })
  }

  const handleReactivateEmployee = () => {
    if (!id) return

    dispatch(employeeReactivate({ employeeId: id, data: reactivationData }))
      .unwrap()
      .then(() => {
        toast.success("Employee reactivated successfully")
        setReactivateDialogOpen(false)
        setReactivationData({ reactivation_reason: "" })
        dispatch(fetchSingleEmployee(id))
      })
      .catch((error) => {
        console.error("Failed to reactivate employee:", error)
        toast.error("Failed to reactivate employee")
      })
  }

  const getStatusChip = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            <CheckCircle className="mr-1" fontSize="small" /> Active
          </span>
        )
      case "TERMINATED":
        return (
          <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
            <Cancel className="mr-1" fontSize="small" /> Terminated
          </span>
        )
      case "RESIGNED":
        return (
          <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
            <Warning className="mr-1" fontSize="small" /> Resigned
          </span>
        )
      case "TRANSFERRED":
        return (
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            <TransferWithinAStation className="mr-1" fontSize="small" />{" "}
            Transferred
          </span>
        )
      default:
        return (
          <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
            {status}
          </span>
        )
    }
  }

  const getAttendanceStatusChip = (status: string) => {
    switch (status) {
      case "PRESENT":
        return (
          <Chip
            label="Present"
            color="success"
            size="small"
            className="!text-xs"
          />
        )
      case "ABSENT":
        return (
          <Chip
            label="Absent"
            color="error"
            size="small"
            className="!text-xs"
          />
        )
      case "ON_LEAVE":
        return (
          <Chip
            label="On Leave"
            color="warning"
            size="small"
            className="!text-xs"
          />
        )
      default:
        return <Chip label={status} size="small" className="!text-xs" />
    }
  }

  const getLeaveStatusChip = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <Chip
            label="Approved"
            color="success"
            size="small"
            className="!text-xs"
          />
        )
      case "PENDING":
        return (
          <Chip
            label="Pending"
            color="warning"
            size="small"
            className="!text-xs"
          />
        )
      case "REJECTED":
        return (
          <Chip
            label="Rejected"
            color="error"
            size="small"
            className="!text-xs"
          />
        )
      default:
        return <Chip label={status} size="small" className="!text-xs" />
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-gray-800 font-sans">
        <Navbar
          headerMessage="Employee Details"
          headerText="Loading employee information..."
        />
        <div className="flex-grow flex items-center justify-center">
          <CircularProgress />
        </div>
        <footer className="fixed bottom-0 left-0 right-0">
          <AdminsFooter />
        </footer>
      </div>
    )
  }

  if (status === "failed" || !employee) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-gray-800 font-sans">
        <Navbar
          headerMessage="Employee Details"
          headerText="Employee not found"
        />
        <div className="prevent-overflow">
                  <RealTimeIndicator
                    enabled={autoRefresh}
                    lastUpdated={lastUpdated}
                    dataVersion={dataVersion}
                    onToggle={() => setAutoRefresh(!autoRefresh)}
                  />
                </div>
        <main className="flex-grow flex flex-col items-center justify-center p-4">
          <div className="text-center py-12">
            <div className="text-6xl mb-4 opacity-30">😞</div>
            <p className="text-gray-600 text-lg mb-2">
              Failed to load employee details
            </p>
            <button
              onClick={() => navigate("/admins/employees")}
              className="mt-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition"
            >
              ← Back to Employees
            </button>
          </div>
        </main>
        <footer className="fixed bottom-0 left-0 right-0">
          <AdminsFooter />
        </footer>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-gray-800 font-sans">
      {/* Header */}
      <Navbar
        headerMessage="Employee Details"
        headerText="View and manage employee information"
      />
      <ToastContainer />

      <main className="flex-grow m-2 p-1 mb-20">
        {/* Back Button */}
        <button
          onClick={() => navigate("/admins/employees")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow transition"
        >
          <ArrowBackIcon fontSize="small" />
          Back to Employees
        </button>

        {/* Employee Header Card */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg shadow-lg mb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <div className="relative">
                <img
                  src={employee.profile_image || defaultProfile}
                  alt={employee.full_name}
                  className="w-20 h-20 object-cover rounded-full border-4 border-white shadow-lg"
                />
                {employee.employment_status === "ACTIVE" && (
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">
                  {employee.full_name}
                </h1>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-blue-100 bg-blue-700 bg-opacity-30 px-3 py-1 rounded-full text-sm">
                    {getRoleIcon(employee.user_role)} {employee.user_role}
                  </span>
                  {getStatusChip(employee.employment_status)}
                  {employee.assigned_to?.name && (
                    <span className="text-blue-100 bg-blue-700 bg-opacity-30 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                      <LocationOn fontSize="small" />
                      Assigned to: {employee.assigned_to.name}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {employee.employment_status === "ACTIVE" ? (
                <button
                  onClick={() => setTerminateDialogOpen(true)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition shadow-md"
                  disabled={terminationStatus === "loading"}
                >
                  {terminationStatus === "loading" ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    "Terminate"
                  )}
                </button>
              ) : (
                <button
                  onClick={() => setReactivateDialogOpen(true)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition shadow-md"
                >
                  Reactivate
                </button>
              )}
              <Link
                to={`/admins/employees/${id}/edit`}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition shadow-md flex items-center gap-2"
              >
                <Edit fontSize="small" />
                Edit
              </Link>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4">
              <div className="text-sm text-blue-100 mb-1">
                Days Present (30d)
              </div>
              <div className="text-2xl font-bold text-white">
                {employee.attendance_summary?.last_30_days?.present || 0}
              </div>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4">
              <div className="text-sm text-blue-100 mb-1">Leave Requests</div>
              <div className="text-2xl font-bold text-white">
                {employee.leave_history?.length || 0}
              </div>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4">
              <div className="text-sm text-blue-100 mb-1">
                Performance Reviews
              </div>
              <div className="text-2xl font-bold text-white">
                {employee.reviews?.length || 0}
              </div>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4">
              <div className="text-sm text-blue-100 mb-1">Assignments</div>
              <div className="text-2xl font-bold text-white">
                {employee.assignment_history?.length || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-lg shadow-md mb-4">
          <div className="border-b">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab(0)}
                className={`flex-1 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                  activeTab === 0
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <AccountCircle fontSize="small" />
                  Overview
                </div>
              </button>
              <button
                onClick={() => setActiveTab(1)}
                className={`flex-1 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                  activeTab === 1
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <EventAvailable fontSize="small" />
                  Attendance
                </div>
              </button>
              <button
                onClick={() => setActiveTab(2)}
                className={`flex-1 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                  activeTab === 2
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <EventNote fontSize="small" />
                  Leave History
                </div>
              </button>
              <button
                onClick={() => setActiveTab(3)}
                className={`flex-1 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                  activeTab === 3
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Assignment fontSize="small" />
                  Assignments
                </div>
              </button>
              <button
                onClick={() => setActiveTab(4)}
                className={`flex-1 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                  activeTab === 4
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Star fontSize="small" />
                  Reviews
                </div>
              </button>
              <button
                onClick={() => setActiveTab(5)}
                className={`flex-1 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                  activeTab === 5
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <History fontSize="small" />
                  History
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-4">
          {activeTab === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Personal Information */}
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Badge /> Personal Information
                </h3>
                <div className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">ID Number</p>
                    <p className="font-semibold text-gray-800">
                      {employee.id_number || "Not provided"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Gender</p>
                    <p className="font-semibold text-gray-800">
                      {employee.gender || "Not specified"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Email</p>
                    <div className="flex items-center gap-2">
                      <Email fontSize="small" className="text-gray-500" />
                      <span className="font-semibold text-gray-800">
                        {employee.email}
                      </span>
                      {employee.email_verified && (
                        <CheckCircle
                          fontSize="small"
                          className="text-green-500"
                        />
                      )}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Phone</p>
                    <div className="flex items-center gap-2">
                      <Phone fontSize="small" className="text-gray-500" />
                      <span className="font-semibold text-gray-800">
                        {employee.phone_number || "Not provided"}
                      </span>
                      {employee.phone_verified && (
                        <CheckCircle
                          fontSize="small"
                          className="text-green-500"
                        />
                      )}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Date Joined</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(
                        employee.date_joined || employee.created_at || "",
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Permissions & Status */}
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Work /> Permissions & Status
                </h3>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {employee.can_perform_sales && (
                    <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      Can Perform Sales
                    </span>
                  )}
                  {employee.can_manage_inventory && (
                    <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      Can Manage Inventory
                    </span>
                  )}
                  {employee.can_manage_delivery && (
                    <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      Can Manage Delivery
                    </span>
                  )}
                  {employee.can_view_reports && (
                    <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      Can View Reports
                    </span>
                  )}
                </div>

                {/* Current Assignment */}
                {employee.assigned_to && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">
                      Current Assignment
                    </p>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">
                          {getTeamTypeDisplay(employee.assigned_to.type).icon}
                        </span>
                        <div>
                          <p className="font-bold text-gray-800">
                            {employee.assigned_to.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Type: {employee.assigned_to.type}
                          </p>
                        </div>
                      </div>
                      {employee.assigned_to.assigned_date && (
                        <p className="text-xs text-gray-500">
                          Assigned on:{" "}
                          {new Date(
                            employee.assigned_to.assigned_date,
                          ).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Recent Attendance Summary */}
              <div className="md:col-span-2 bg-white rounded-lg shadow-md p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <TrendingUp /> Recent Attendance (Last 30 Days)
                </h3>
                {employee.attendance_summary && (
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <div className="text-3xl font-bold text-green-600">
                        {employee.attendance_summary.last_30_days.present}
                      </div>
                      <div className="text-sm text-green-700">Present Days</div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg text-center">
                      <div className="text-3xl font-bold text-red-600">
                        {employee.attendance_summary.last_30_days.absent}
                      </div>
                      <div className="text-sm text-red-700">Absent Days</div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg text-center">
                      <div className="text-3xl font-bold text-yellow-600">
                        {employee.attendance_summary.last_30_days.on_leave}
                      </div>
                      <div className="text-sm text-yellow-700">Leave Days</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 1 && (
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">
                  Attendance Records
                </h3>
                <button
                  onClick={() =>
                    dispatch(employeeAttendance({ employeeId: id }))
                  }
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                >
                  <Refresh fontSize="small" />
                  Refresh
                </button>
              </div>

              {attendanceStatus === "loading" ? (
                <div className="flex justify-center p-8">
                  <CircularProgress />
                </div>
              ) : attendanceData ? (
                <>
                  {/* Statistics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {attendanceData.statistics?.attendance_rate || 0}%
                      </div>
                      <div className="text-sm text-gray-600">
                        Attendance Rate
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {attendanceData.statistics?.present_days || 0}
                      </div>
                      <div className="text-sm text-green-600">Present</div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {attendanceData.statistics?.absent_days || 0}
                      </div>
                      <div className="text-sm text-red-600">Absent</div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {attendanceData.statistics?.leave_days || 0}
                      </div>
                      <div className="text-sm text-yellow-600">On Leave</div>
                    </div>
                  </div>

                  {/* Attendance Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="text-left p-3 text-sm font-semibold text-gray-700 border-b">
                            Date
                          </th>
                          <th className="text-left p-3 text-sm font-semibold text-gray-700 border-b">
                            Status
                          </th>
                          <th className="text-left p-3 text-sm font-semibold text-gray-700 border-b">
                            Marked By
                          </th>
                          <th className="text-left p-3 text-sm font-semibold text-gray-700 border-b">
                            Remarks
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendanceData.attendance_records?.map(
                          (record, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="p-3 text-sm border-b">
                                {new Date(record.date).toLocaleDateString()}
                              </td>
                              <td className="p-3 text-sm border-b">
                                {getAttendanceStatusChip(record.status)}
                              </td>
                              <td className="p-3 text-sm border-b">
                                {record.marked_by || "System"}
                              </td>
                              <td className="p-3 text-sm border-b text-gray-600">
                                {record.remarks || "-"}
                              </td>
                            </tr>
                          ),
                        )}
                        {(!attendanceData.attendance_records ||
                          attendanceData.attendance_records.length === 0) && (
                          <tr>
                            <td
                              colSpan={4}
                              className="p-8 text-center text-gray-500"
                            >
                              No attendance records found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No attendance data available
                </div>
              )}
            </div>
          )}

          {activeTab === 2 && (
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">
                  Leave Requests
                </h3>
                <button
                  onClick={() => dispatch(employeeLeave({ employeeId: id }))}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                >
                  <Refresh fontSize="small" />
                  Refresh
                </button>
              </div>

              {leaveStatus === "loading" ? (
                <div className="flex justify-center p-8">
                  <CircularProgress />
                </div>
              ) : leaveData ? (
                <>
                  {/* Statistics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {leaveData.statistics?.total_requests || 0}
                      </div>
                      <div className="text-sm text-gray-600">
                        Total Requests
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {leaveData.statistics?.approved || 0}
                      </div>
                      <div className="text-sm text-green-600">Approved</div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {leaveData.statistics?.pending || 0}
                      </div>
                      <div className="text-sm text-yellow-600">Pending</div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {leaveData.statistics?.rejected || 0}
                      </div>
                      <div className="text-sm text-red-600">Rejected</div>
                    </div>
                  </div>

                  {/* Leave Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="text-left p-3 text-sm font-semibold text-gray-700 border-b">
                            Period
                          </th>
                          <th className="text-left p-3 text-sm font-semibold text-gray-700 border-b">
                            Reason
                          </th>
                          <th className="text-left p-3 text-sm font-semibold text-gray-700 border-b">
                            Status
                          </th>
                          <th className="text-left p-3 text-sm font-semibold text-gray-700 border-b">
                            Applied On
                          </th>
                          <th className="text-left p-3 text-sm font-semibold text-gray-700 border-b">
                            Reviewed By
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {leaveData.leave_requests?.map((leave, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="p-3 text-sm border-b">
                              {new Date(leave.start_date).toLocaleDateString()}{" "}
                              - {new Date(leave.end_date).toLocaleDateString()}
                            </td>
                            <td className="p-3 text-sm border-b">
                              {leave.reason}
                            </td>
                            <td className="p-3 text-sm border-b">
                              {getLeaveStatusChip(leave.status)}
                            </td>
                            <td className="p-3 text-sm border-b">
                              {new Date(leave.applied_on).toLocaleDateString()}
                            </td>
                            <td className="p-3 text-sm border-b">
                              {leave.reviewed_by || "Not reviewed"}
                            </td>
                          </tr>
                        ))}
                        {(!leaveData.leave_requests ||
                          leaveData.leave_requests.length === 0) && (
                          <tr>
                            <td
                              colSpan={5}
                              className="p-8 text-center text-gray-500"
                            >
                              No leave requests found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No leave data available
                </div>
              )}
            </div>
          )}

          {activeTab === 3 && (
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Assignment History
              </h3>

              {/* Assignment Table */}
              <div className="overflow-x-auto mb-6">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-3 text-sm font-semibold text-gray-700 border-b">
                        Type
                      </th>
                      <th className="text-left p-3 text-sm font-semibold text-gray-700 border-b">
                        Name
                      </th>
                      <th className="text-left p-3 text-sm font-semibold text-gray-700 border-b">
                        Assigned Date
                      </th>
                      <th className="text-left p-3 text-sm font-semibold text-gray-700 border-b">
                        Assigned By
                      </th>
                      <th className="text-left p-3 text-sm font-semibold text-gray-700 border-b">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {employee.assignment_history?.map((assignment, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="p-3 text-sm border-b">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs ${
                              assignment.type === "SHOP"
                                ? "bg-blue-100 text-blue-800"
                                : assignment.type === "VEHICLE"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {assignment.type}
                          </span>
                        </td>
                        <td className="p-3 text-sm border-b">
                          {assignment.name}
                        </td>
                        <td className="p-3 text-sm border-b">
                          {new Date(
                            assignment.assigned_date,
                          ).toLocaleDateString()}
                        </td>
                        <td className="p-3 text-sm border-b">
                          {assignment.assigned_by || "System"}
                        </td>
                        <td className="p-3 text-sm border-b">
                          {assignment.is_active ? (
                            <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                              Active
                            </span>
                          ) : (
                            <span className="inline-block px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                              Inactive
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {(!employee.assignment_history ||
                      employee.assignment_history.length === 0) && (
                      <tr>
                        <td
                          colSpan={5}
                          className="p-8 text-center text-gray-500"
                        >
                          No assignment history found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Transfer History */}
              {employee.transfer_history &&
                employee.transfer_history.length > 0 && (
                  <div>
                    <h4 className="text-md font-bold text-gray-800 mb-3">
                      Transfer History
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="text-left p-3 text-sm font-semibold text-gray-700 border-b">
                              Transfer Date
                            </th>
                            <th className="text-left p-3 text-sm font-semibold text-gray-700 border-b">
                              From
                            </th>
                            <th className="text-left p-3 text-sm font-semibold text-gray-700 border-b">
                              To
                            </th>
                            <th className="text-left p-3 text-sm font-semibold text-gray-700 border-b">
                              Transferred By
                            </th>
                            <th className="text-left p-3 text-sm font-semibold text-gray-700 border-b">
                              Reason
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {employee.transfer_history.map((transfer, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="p-3 text-sm border-b">
                                {new Date(
                                  transfer.transfer_date,
                                ).toLocaleDateString()}
                              </td>
                              <td className="p-3 text-sm border-b">
                                {transfer.from_type !== "NONE"
                                  ? `${transfer.from_type} (ID: ${transfer.from_id})`
                                  : "None"}
                              </td>
                              <td className="p-3 text-sm border-b">
                                {transfer.to_type} (ID: {transfer.to_id})
                              </td>
                              <td className="p-3 text-sm border-b">
                                {transfer.transferred_by || "System"}
                              </td>
                              <td className="p-3 text-sm border-b text-gray-600">
                                {transfer.reason || "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
            </div>
          )}

          {activeTab === 4 && (
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Performance Reviews
              </h3>
              {employee.reviews && employee.reviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {employee.reviews.map((review, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-4 rounded-lg hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className="text-xl">
                              {i < review.rating ? "⭐" : "☆"}
                            </span>
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.review_date).toLocaleDateString()}
                        </span>
                      </div>
                      {review.comments && (
                        <p className="text-gray-700 mb-3">{review.comments}</p>
                      )}
                      {review.reviewer && (
                        <p className="text-sm text-gray-500">
                          Reviewed by: {review.reviewer}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No performance reviews found
                </div>
              )}
            </div>
          )}

          {activeTab === 5 && (
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Employment History
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-3 text-sm font-semibold text-gray-700 border-b">
                        Period
                      </th>
                      <th className="text-left p-3 text-sm font-semibold text-gray-700 border-b">
                        Position
                      </th>
                      <th className="text-left p-3 text-sm font-semibold text-gray-700 border-b">
                        Department
                      </th>
                      <th className="text-left p-3 text-sm font-semibold text-gray-700 border-b">
                        Salary
                      </th>
                      <th className="text-left p-3 text-sm font-semibold text-gray-700 border-b">
                        Status
                      </th>
                      <th className="text-left p-3 text-sm font-semibold text-gray-700 border-b">
                        Reason for Change
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {employee.employment_history?.map((history, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="p-3 text-sm border-b">
                          {new Date(history.start_date).toLocaleDateString()}
                          {history.end_date &&
                            ` - ${new Date(
                              history.end_date,
                            ).toLocaleDateString()}`}
                        </td>
                        <td className="p-3 text-sm border-b">
                          {history.position || "-"}
                        </td>
                        <td className="p-3 text-sm border-b">
                          {history.department || "-"}
                        </td>
                        <td className="p-3 text-sm border-b">
                          {history.salary || "-"}
                        </td>
                        <td className="p-3 text-sm border-b">
                          {history.status === "ACTIVE" ? (
                            <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                              Active
                            </span>
                          ) : (
                            <span className="inline-block px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                              {history.status}
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-sm border-b text-gray-600">
                          {history.reason_for_change || "-"}
                        </td>
                      </tr>
                    ))}
                    {(!employee.employment_history ||
                      employee.employment_history.length === 0) && (
                      <tr>
                        <td
                          colSpan={6}
                          className="p-8 text-center text-gray-500"
                        >
                          No employment history found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Termination Dialog */}
      <Dialog
        open={terminateDialogOpen}
        onClose={() => setTerminateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="!bg-gradient-to-r !from-red-500 !to-red-600 !text-white">
          Terminate Employee
        </DialogTitle>
        <DialogContent className="!pt-6">
          <DialogContentText className="!mb-4">
            You are about to terminate <strong>{employee.full_name}</strong>.
            This action cannot be undone.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Termination Reason"
            type="text"
            fullWidth
            required
            value={terminationData.termination_reason}
            onChange={(e) =>
              setTerminationData({
                ...terminationData,
                termination_reason: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Termination Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={terminationData.termination_date}
            onChange={(e) =>
              setTerminationData({
                ...terminationData,
                termination_date: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Notice Period (Days)"
            type="number"
            fullWidth
            value={terminationData.notice_period_days}
            onChange={(e) =>
              setTerminationData({
                ...terminationData,
                notice_period_days: parseInt(e.target.value) || 0,
              })
            }
          />
          <TextField
            margin="dense"
            label="Final Settlement Amount"
            type="number"
            fullWidth
            value={terminationData.final_settlement_amount}
            onChange={(e) =>
              setTerminationData({
                ...terminationData,
                final_settlement_amount: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Remarks"
            type="text"
            fullWidth
            multiline
            rows={3}
            value={terminationData.remarks}
            onChange={(e) =>
              setTerminationData({
                ...terminationData,
                remarks: e.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <button
            onClick={() => setTerminateDialogOpen(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleTerminateEmployee}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={
              !terminationData.termination_reason ||
              terminationStatus === "loading"
            }
          >
            {terminationStatus === "loading" ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Confirm Termination"
            )}
          </button>
        </DialogActions>
      </Dialog>

      {/* Reactivation Dialog */}
      <Dialog
        open={reactivateDialogOpen}
        onClose={() => setReactivateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="!bg-gradient-to-r !from-green-500 !to-green-600 !text-white">
          Reactivate Employee
        </DialogTitle>
        <DialogContent className="!pt-6">
          <DialogContentText className="!mb-4">
            You are about to reactivate <strong>{employee.full_name}</strong>.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Reactivation Reason"
            type="text"
            fullWidth
            required
            value={reactivationData.reactivation_reason}
            onChange={(e) =>
              setReactivationData({
                reactivation_reason: e.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <button
            onClick={() => setReactivateDialogOpen(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleReactivateEmployee}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition disabled:opacity-50"
            disabled={!reactivationData.reactivation_reason}
          >
            Confirm Reactivation
          </button>
        </DialogActions>
      </Dialog>

      <footer className="fixed bottom-0 left-0 right-0">
        <AdminsFooter />
      </footer>
    </div>
  )
}

export default EmployeesProfileDetails
