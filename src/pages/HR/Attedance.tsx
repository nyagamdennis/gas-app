// @ts-nocheck
import React, { useEffect, useState } from "react"
import { useMediaQuery, useTheme } from "@mui/material"
import { useNavigate } from "react-router-dom"
import planStatus from "../../features/planStatus/planStatus"
import AdminsFooter from "../../components/AdminsFooter"
import Navbar from "../../components/ui/mobile/admin/Navbar"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import {
  CheckCircleOutline,
  Schedule,
  WarningAmber,
  AccessTime,
  CalendarToday,
  Groups,
  TimerOff,
  Download,
  FilterList,
  Search,
} from "@mui/icons-material"

const Attendance = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const { businessName, businessId } = planStatus()

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  // Sample data - replace with real data from API
  const [attendance, setAttendance] = useState([
    {
      id: 1,
      employee: "John Doe",
      role: "SHOP_ATTENDANT",
      status: "Present",
      checkIn: "08:00 AM",
      checkOut: "05:00 PM",
      hours: "9",
      date: "2024-01-15",
      late: false,
    },
    {
      id: 2,
      employee: "Jane Smith",
      role: "DELIVERY_GUY",
      status: "Present",
      checkIn: "08:15 AM",
      checkOut: "05:00 PM",
      hours: "8.75",
      date: "2024-01-15",
      late: true,
    },
    {
      id: 3,
      employee: "Mike Johnson",
      role: "STORE_MAN",
      status: "Absent",
      checkIn: "-",
      checkOut: "-",
      hours: "0",
      date: "2024-01-15",
      late: false,
    },
    {
      id: 4,
      employee: "Sarah Williams",
      role: "SECURITY",
      status: "Present",
      checkIn: "07:45 AM",
      checkOut: "07:45 PM",
      hours: "12",
      date: "2024-01-15",
      late: false,
    },
    {
      id: 5,
      employee: "David Brown",
      role: "TRUCK_DRIVER",
      status: "On Leave",
      checkIn: "-",
      checkOut: "-",
      hours: "0",
      date: "2024-01-15",
      late: false,
    },
    {
      id: 6,
      employee: "Lisa Chen",
      role: "SALES_PERSON",
      status: "Half Day",
      checkIn: "08:00 AM",
      checkOut: "12:00 PM",
      hours: "4",
      date: "2024-01-15",
      late: false,
    },
  ])

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  )
  const [filterStatus, setFilterStatus] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [showMarkAttendance, setShowMarkAttendance] = useState(false)
  const [showAttendanceDetails, setShowAttendanceDetails] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  const statusOptions = [
    {
      value: "Present",
      label: "Present",
      icon: "✅",
      color: "bg-green-100 text-green-700",
    },
    {
      value: "Absent",
      label: "Absent",
      icon: "❌",
      color: "bg-red-100 text-red-700",
    },
    {
      value: "Late",
      label: "Late",
      icon: "⏰",
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      value: "On Leave",
      label: "On Leave",
      icon: "🏖️",
      color: "bg-blue-100 text-blue-700",
    },
    {
      value: "Half Day",
      label: "Half Day",
      icon: "⏳",
      color: "bg-orange-100 text-orange-700",
    },
  ]

  const filteredAttendance = attendance.filter((record) => {
    const matchesStatus = filterStatus === "" || record.status === filterStatus
    const matchesSearch =
      searchQuery === "" ||
      record.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.role.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDate = record.date === selectedDate

    return matchesStatus && matchesSearch && matchesDate
  })

  const handleMarkAttendance = (type) => {
    toast.success(`${type} marked successfully!`)
    setShowMarkAttendance(false)
  }

  const handleViewDetails = (record) => {
    setSelectedRecord(record)
    setShowAttendanceDetails(true)
  }

  const handleExport = () => {
    toast.info("Attendance report exported successfully!")
  }

  // Calculate statistics
  const presentCount = attendance.filter((a) => a.status === "Present").length
  const absentCount = attendance.filter((a) => a.status === "Absent").length
  const lateCount = attendance.filter((a) => a.late).length
  const onLeaveCount = attendance.filter((a) => a.status === "On Leave").length
  const totalHours = attendance.reduce((sum, a) => sum + parseFloat(a.hours), 0)

  if (isMobile) {
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
                  <span className="mr-2">📊</span>
                  Attendance Tracking
                </h1>
                <p className="text-blue-100 text-sm">
                  Monitor and manage employee attendance
                </p>
              </div>
              <button
                onClick={() => setShowMarkAttendance(true)}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition shadow-md"
              >
                📝 Mark Attendance
              </button>
            </div>
          </div>

          {/* Current Time & Date */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Today is</div>
                <div className="text-2xl font-bold text-blue-600">
                  {currentTime.toLocaleDateString("en-US", { weekday: "long" })}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Current Time</div>
                <div className="text-2xl font-bold text-gray-800">
                  {currentTime.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
              />
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Present</div>
                  <div className="text-2xl font-bold text-green-600">
                    {presentCount}
                  </div>
                </div>
                <span className="text-2xl">✅</span>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Absent</div>
                  <div className="text-2xl font-bold text-red-600">
                    {absentCount}
                  </div>
                </div>
                <span className="text-2xl">❌</span>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Late</div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {lateCount}
                  </div>
                </div>
                <span className="text-2xl">⏰</span>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600 mb-1">On Leave</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {onLeaveCount}
                  </div>
                </div>
                <span className="text-2xl">🏖️</span>
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

              <div className="grid grid-cols-2 gap-3">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                >
                  <option value="">All Status</option>
                  {statusOptions.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleExport}
                  className="w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-gray-600 hover:to-gray-700 transition flex items-center justify-center gap-2"
                >
                  📥 Export
                </button>
              </div>
            </div>
          </div>

          {/* Attendance List */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Today's Attendance ({filteredAttendance.length})
              </h2>
              <span className="text-sm text-gray-500">
                Total Hours: {totalHours}
              </span>
            </div>

            {filteredAttendance.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4 opacity-30">📊</div>
                <p className="text-gray-500 text-lg mb-2">
                  No attendance records found
                </p>
                <p className="text-gray-400 text-sm mb-4">
                  Try adjusting your filters or mark attendance for today
                </p>
                <button
                  onClick={() => setShowMarkAttendance(true)}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition"
                >
                  📝 Mark Attendance
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAttendance.map((record) => {
                  const status = statusOptions.find(
                    (s) => s.value === record.status,
                  )
                  return (
                    <div
                      key={record.id}
                      className={`border-2 rounded-lg p-4 hover:shadow-md transition cursor-pointer ${
                        record.status === "Present"
                          ? "border-green-200 bg-gradient-to-r from-green-50 to-emerald-50"
                          : record.status === "Absent"
                          ? "border-red-200 bg-gradient-to-r from-red-50 to-rose-50"
                          : record.status === "Late"
                          ? "border-yellow-200 bg-gradient-to-r from-yellow-50 to-amber-50"
                          : record.status === "On Leave"
                          ? "border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50"
                          : "border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50"
                      }`}
                      onClick={() => handleViewDetails(record)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                              {record.employee.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-800">
                                {record.employee}
                              </h3>
                              <p className="text-sm text-gray-600">
                                🏢 {record.role}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                            <div>
                              <p className="font-medium">Check In</p>
                              <p
                                className={`font-bold ${
                                  record.checkIn !== "-"
                                    ? "text-gray-800"
                                    : "text-gray-400"
                                }`}
                              >
                                {record.checkIn}
                              </p>
                            </div>
                            <div>
                              <p className="font-medium">Check Out</p>
                              <p
                                className={`font-bold ${
                                  record.checkOut !== "-"
                                    ? "text-gray-800"
                                    : "text-gray-400"
                                }`}
                              >
                                {record.checkOut}
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-2 mt-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                status?.color || "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {status?.icon} {record.status}
                            </span>
                            <span className="bg-white px-3 py-1 rounded-full text-xs font-medium text-gray-700 border border-gray-300">
                              ⏱️ {record.hours}h
                            </span>
                            {record.late && (
                              <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium">
                                ⏰ Late
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-2xl">👁️</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </main>

        {/* Mark Attendance Modal */}
        {showMarkAttendance && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
                <h2 className="text-2xl font-bold flex items-center">
                  <span className="mr-2">📝</span>
                  Mark Attendance
                </h2>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto flex-1">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Select Employee
                    </label>
                    <select className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition">
                      <option value="">Select Employee</option>
                      {attendance.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.employee}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Status
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {statusOptions.map((status) => (
                        <button
                          key={status.value}
                          type="button"
                          onClick={() => handleMarkAttendance(status.label)}
                          className="border-2 border-gray-300 rounded-lg p-3 hover:border-blue-500 transition text-center"
                        >
                          <div className="text-2xl mb-1">{status.icon}</div>
                          <div className="text-sm font-medium">
                            {status.label}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      defaultValue={new Date().toISOString().slice(0, 16)}
                      className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                    />
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
                    <p className="text-yellow-700 text-sm">
                      <span className="font-bold">Note:</span> Marking
                      attendance will override any existing records for today.
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowMarkAttendance(false)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleMarkAttendance("Manual")}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Attendance Details Modal */}
        {showAttendanceDetails && selectedRecord && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white bg-opacity-30 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {selectedRecord.employee.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {selectedRecord.employee}
                    </h2>
                    <p className="text-blue-100">🏢 {selectedRecord.role}</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto flex-1">
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Date</p>
                    <p className="font-semibold text-gray-800">
                      📅 {selectedRecord.date}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Status</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        statusOptions.find(
                          (s) => s.value === selectedRecord.status,
                        )?.color || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {
                        statusOptions.find(
                          (s) => s.value === selectedRecord.status,
                        )?.icon
                      }{" "}
                      {selectedRecord.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Check In</p>
                      <p
                        className={`font-bold text-lg ${
                          selectedRecord.checkIn !== "-"
                            ? "text-gray-800"
                            : "text-gray-400"
                        }`}
                      >
                        {selectedRecord.checkIn}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Check Out</p>
                      <p
                        className={`font-bold text-lg ${
                          selectedRecord.checkOut !== "-"
                            ? "text-gray-800"
                            : "text-gray-400"
                        }`}
                      >
                        {selectedRecord.checkOut}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Total Hours</p>
                    <p className="font-bold text-2xl text-gray-800">
                      ⏱️ {selectedRecord.hours} hours
                    </p>
                  </div>

                  {selectedRecord.late && (
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Late Arrival</p>
                      <p className="font-semibold text-gray-800">
                        ⏰ 15 minutes late
                      </p>
                    </div>
                  )}

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Remarks</p>
                    <textarea
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition text-sm"
                      rows="3"
                      placeholder="Add remarks about this attendance record..."
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowAttendanceDetails(false)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      toast.success("Attendance updated successfully!")
                      setShowAttendanceDetails(false)
                    }}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition"
                  >
                    Update
                  </button>
                </div>
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

  // Desktop View
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-gray-800 font-sans">
      <Navbar
        headerMessage={"ERP"}
        headerText={"Manage your operations with style and clarity"}
      />
      <ToastContainer />

      <main className="flex-grow p-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-8 rounded-2xl shadow-xl mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
                <span className="mr-3">📊</span>
                Attendance Management
              </h1>
              <p className="text-blue-100">
                Track and manage employee attendance for {businessName}
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => navigate("/hr/attendance/history")}
                className="bg-white bg-opacity-20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-30 transition shadow-lg"
              >
                📅 View History
              </button>
              <button
                onClick={() => setShowMarkAttendance(true)}
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition shadow-lg"
              >
                📝 Mark Attendance
              </button>
            </div>
          </div>
        </div>

        {/* Current Stats Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-2">
                Today's Overview
              </h2>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Present: {presentCount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Absent: {absentCount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>Late: {lateCount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>On Leave: {onLeaveCount}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-800">
                {currentTime.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <div className="text-sm text-gray-600">
                {currentTime.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Total Present",
              value: presentCount,
              icon: "✅",
              color: "text-green-600",
              bg: "bg-green-50",
            },
            {
              label: "Total Absent",
              value: absentCount,
              icon: "❌",
              color: "text-red-600",
              bg: "bg-red-50",
            },
            {
              label: "Working Hours",
              value: totalHours,
              icon: "⏱️",
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              label: "Attendance Rate",
              value: "85%",
              icon: "📈",
              color: "text-purple-600",
              bg: "bg-purple-50",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className={`${stat.bg} rounded-xl shadow-lg p-6 hover:shadow-xl transition`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className={`text-3xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                </div>
                <span className="text-4xl">{stat.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-2">
              <input
                type="text"
                placeholder="🔍 Search employees by name or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
            >
              <option value="">All Status</option>
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="flex-1 border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
              />
            </div>
          </div>

          <div className="flex gap-4 mt-4">
            <button
              onClick={handleExport}
              className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-gray-600 hover:to-gray-700 transition flex items-center gap-2"
            >
              📥 Export Report
            </button>
            <button
              onClick={() => toast.info("Advanced filters coming soon!")}
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-purple-700 transition flex items-center gap-2"
            >
              ⚙️ Advanced Filters
            </button>
            <button
              onClick={() => navigate("/hr/attendance/settings")}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition flex items-center gap-2"
            >
              ⚙️ Settings
            </button>
          </div>
        </div>

        {/* Attendance List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Today's Attendance ({filteredAttendance.length})
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-gray-500">
                Last updated:{" "}
                {currentTime.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>

          {filteredAttendance.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-8xl mb-6 opacity-20">📊</div>
              <h3 className="text-2xl text-gray-500 mb-4">
                No attendance records for today
              </h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                No attendance records match your filters. Try adjusting your
                search criteria or mark attendance for employees.
              </p>
              <button
                onClick={() => setShowMarkAttendance(true)}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition text-lg"
              >
                📝 Mark Attendance
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Employee
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Role
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Check In
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Check Out
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Hours
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttendance.map((record) => {
                    const status = statusOptions.find(
                      (s) => s.value === record.status,
                    )
                    return (
                      <tr
                        key={record.id}
                        className="border-t border-gray-100 hover:bg-gray-50 transition"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                              {record.employee.charAt(0)}
                            </div>
                            <span className="font-semibold">
                              {record.employee}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-gray-600">
                            🏢 {record.role}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              status?.color || "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {status?.icon} {record.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`font-bold ${
                              record.checkIn !== "-"
                                ? "text-gray-800"
                                : "text-gray-400"
                            }`}
                          >
                            {record.checkIn}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`font-bold ${
                              record.checkOut !== "-"
                                ? "text-gray-800"
                                : "text-gray-400"
                            }`}
                          >
                            {record.checkOut}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-gray-800">
                            ⏱️ {record.hours}h
                          </span>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleViewDetails(record)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Modals (same as mobile but larger for desktop) */}
      {showMarkAttendance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-8">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-8">
              <h2 className="text-3xl font-bold flex items-center">
                <span className="mr-3">📝</span>
                Mark Attendance
              </h2>
            </div>
            <div className="p-8 overflow-y-auto flex-1">
              {/* ... same content as mobile modal but with larger spacing ... */}
            </div>
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="flex gap-4">
                <button
                  onClick={() => setShowMarkAttendance(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-4 rounded-lg font-semibold transition text-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleMarkAttendance("Manual")}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-lg font-semibold transition text-lg"
                >
                  Save Attendance
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-8">
        <AdminsFooter />
      </footer>
    </div>
  )
}

export default Attendance
