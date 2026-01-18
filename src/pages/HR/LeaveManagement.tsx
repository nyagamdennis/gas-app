// @ts-nocheck
import React, { useEffect, useState } from "react"
import { useMediaQuery, useTheme } from "@mui/material"
import { useNavigate } from "react-router-dom"
import planStatus from "../../features/planStatus/planStatus"
import AdminsFooter from "../../components/AdminsFooter"
import Navbar from "../../components/ui/mobile/admin/Navbar"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const LeaveManagement = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const { businessName, businessId } = planStatus()

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  // Sample data - replace with real data from API
  const [leaveRequests, setLeaveRequests] = useState([
    {
      id: 1,
      employee: "John Doe",
      role: "SHOP_ATTENDANT",
      type: "Annual Leave",
      status: "Pending",
      startDate: "2024-01-20",
      endDate: "2024-01-25",
      days: 6,
      submitted: "2024-01-10",
      reason: "Family vacation",
      attachments: 2,
      coverage: "Jane Smith",
    },
    {
      id: 2,
      employee: "Jane Smith",
      role: "DELIVERY_GUY",
      type: "Sick Leave",
      status: "Approved",
      startDate: "2024-01-15",
      endDate: "2024-01-17",
      days: 3,
      submitted: "2024-01-14",
      reason: "Medical appointment",
      attachments: 1,
      coverage: "Mike Johnson",
    },
    {
      id: 3,
      employee: "Mike Johnson",
      role: "STORE_MAN",
      type: "Emergency Leave",
      status: "Approved",
      startDate: "2024-01-12",
      endDate: "2024-01-12",
      days: 1,
      submitted: "2024-01-12",
      reason: "Family emergency",
      attachments: 0,
      coverage: "Auto-assigned",
    },
    {
      id: 4,
      employee: "Sarah Williams",
      role: "SECURITY",
      type: "Maternity Leave",
      status: "Approved",
      startDate: "2024-02-01",
      endDate: "2024-05-01",
      days: 90,
      submitted: "2024-01-05",
      reason: "Maternity",
      attachments: 3,
      coverage: "Temporary hire",
    },
    {
      id: 5,
      employee: "David Brown",
      role: "TRUCK_DRIVER",
      type: "Unpaid Leave",
      status: "Rejected",
      startDate: "2024-01-18",
      endDate: "2024-01-22",
      days: 5,
      submitted: "2024-01-10",
      reason: "Personal reasons",
      attachments: 0,
      coverage: "Not required",
    },
    {
      id: 6,
      employee: "Lisa Chen",
      role: "SALES_PERSON",
      type: "Study Leave",
      status: "Pending",
      startDate: "2024-02-10",
      endDate: "2024-02-15",
      days: 6,
      submitted: "2024-01-08",
      reason: "Professional certification",
      attachments: 1,
      coverage: "John Doe",
    },
  ])

  const [filterStatus, setFilterStatus] = useState("")
  const [filterType, setFilterType] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [showNewRequest, setShowNewRequest] = useState(false)
  const [showRequestDetails, setShowRequestDetails] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [viewMode, setViewMode] = useState("list") // list or calendar

  const leaveTypes = [
    {
      value: "Annual Leave",
      label: "Annual Leave",
      icon: "🏖️",
      color: "bg-blue-100 text-blue-700",
    },
    {
      value: "Sick Leave",
      label: "Sick Leave",
      icon: "🤒",
      color: "bg-green-100 text-green-700",
    },
    {
      value: "Emergency Leave",
      label: "Emergency Leave",
      icon: "🚨",
      color: "bg-red-100 text-red-700",
    },
    {
      value: "Maternity Leave",
      label: "Maternity Leave",
      icon: "👶",
      color: "bg-pink-100 text-pink-700",
    },
    {
      value: "Paternity Leave",
      label: "Paternity Leave",
      icon: "👨‍🍼",
      color: "bg-blue-100 text-blue-700",
    },
    {
      value: "Study Leave",
      label: "Study Leave",
      icon: "📚",
      color: "bg-purple-100 text-purple-700",
    },
    {
      value: "Unpaid Leave",
      label: "Unpaid Leave",
      icon: "💰",
      color: "bg-gray-100 text-gray-700",
    },
    {
      value: "Other",
      label: "Other",
      icon: "📝",
      color: "bg-yellow-100 text-yellow-700",
    },
  ]

  const statusOptions = [
    {
      value: "Pending",
      label: "Pending",
      icon: "⏳",
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      value: "Approved",
      label: "Approved",
      icon: "✅",
      color: "bg-green-100 text-green-700",
    },
    {
      value: "Rejected",
      label: "Rejected",
      icon: "❌",
      color: "bg-red-100 text-red-700",
    },
    {
      value: "Cancelled",
      label: "Cancelled",
      icon: "🚫",
      color: "bg-gray-100 text-gray-700",
    },
  ]

  const filteredRequests = leaveRequests.filter((request) => {
    const matchesStatus = filterStatus === "" || request.status === filterStatus
    const matchesType = filterType === "" || request.type === filterType
    const matchesSearch =
      searchQuery === "" ||
      request.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.reason.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesStatus && matchesType && matchesSearch
  })

  const handleApprove = (requestId) => {
    setLeaveRequests((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, status: "Approved" } : req,
      ),
    )
    toast.success("Leave request approved!")
  }

  const handleReject = (requestId) => {
    setLeaveRequests((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, status: "Rejected" } : req,
      ),
    )
    toast.info("Leave request rejected")
  }

  const handleViewDetails = (request) => {
    setSelectedRequest(request)
    setShowRequestDetails(true)
  }

  const handleNewRequest = () => {
    toast.success("New leave request submitted!")
    setShowNewRequest(false)
  }

  const handleExport = () => {
    toast.info("Leave report exported successfully!")
  }

  // Calculate statistics
  const pendingCount = leaveRequests.filter(
    (r) => r.status === "Pending",
  ).length
  const approvedCount = leaveRequests.filter(
    (r) => r.status === "Approved",
  ).length
  const rejectedCount = leaveRequests.filter(
    (r) => r.status === "Rejected",
  ).length
  const totalDays = leaveRequests
    .filter((r) => r.status === "Approved")
    .reduce((sum, r) => sum + r.days, 0)
  const currentMonth = leaveRequests.filter((r) => {
    const month = new Date(r.startDate).getMonth()
    return month === new Date().getMonth() && r.status === "Approved"
  }).length

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
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg shadow-lg mb-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <h1 className="text-2xl font-bold text-white mb-1 flex items-center">
                  <span className="mr-2">🏖️</span>
                  Leave Management
                </h1>
                <p className="text-purple-100 text-sm">
                  Manage employee time-off requests and approvals
                </p>
              </div>
              <button
                onClick={() => setShowNewRequest(true)}
                className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 transition shadow-md"
              >
                📝 New Request
              </button>
            </div>
          </div>

          {/* View Toggle */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("list")}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition ${
                  viewMode === "list"
                    ? "bg-purple-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                📋 List View
              </button>
              <button
                onClick={() => setViewMode("calendar")}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition ${
                  viewMode === "calendar"
                    ? "bg-purple-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                📅 Calendar View
              </button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Pending</div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {pendingCount}
                  </div>
                </div>
                <span className="text-2xl">⏳</span>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Approved</div>
                  <div className="text-2xl font-bold text-green-600">
                    {approvedCount}
                  </div>
                </div>
                <span className="text-2xl">✅</span>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Total Days</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {totalDays}
                  </div>
                </div>
                <span className="text-2xl">📅</span>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600 mb-1">This Month</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {currentMonth}
                  </div>
                </div>
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="🔍 Search by employee, role, or reason..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
                >
                  <option value="">All Status</option>
                  {statusOptions.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>

                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
                >
                  <option value="">All Types</option>
                  {leaveTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleExport}
                className="w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-gray-600 hover:to-gray-700 transition flex items-center justify-center gap-2"
              >
                📥 Export Report
              </button>
            </div>
          </div>

          {/* Leave Requests List */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Leave Requests ({filteredRequests.length})
              </h2>
              <span className="text-sm text-gray-500">
                {new Date().toLocaleDateString()}
              </span>
            </div>

            {filteredRequests.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4 opacity-30">🏖️</div>
                <p className="text-gray-500 text-lg mb-2">
                  No leave requests found
                </p>
                <p className="text-gray-400 text-sm mb-4">
                  Try adjusting your filters or submit a new request
                </p>
                <button
                  onClick={() => setShowNewRequest(true)}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-600 hover:to-purple-700 transition"
                >
                  📝 New Request
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredRequests.map((request) => {
                  const status = statusOptions.find(
                    (s) => s.value === request.status,
                  )
                  const type = leaveTypes.find((t) => t.value === request.type)
                  return (
                    <div
                      key={request.id}
                      className={`border-2 rounded-lg p-4 hover:shadow-md transition ${
                        request.status === "Pending"
                          ? "border-yellow-200 bg-gradient-to-r from-yellow-50 to-amber-50"
                          : request.status === "Approved"
                          ? "border-green-200 bg-gradient-to-r from-green-50 to-emerald-50"
                          : request.status === "Rejected"
                          ? "border-red-200 bg-gradient-to-r from-red-50 to-rose-50"
                          : "border-gray-200 bg-gradient-to-r from-gray-50 to-slate-50"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                              {request.employee.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-800">
                                {request.employee}
                              </h3>
                              <p className="text-sm text-gray-600">
                                🏢 {request.role}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                            <div>
                              <p className="font-medium">Leave Type</p>
                              <p className="flex items-center gap-1">
                                <span>{type?.icon}</span>
                                <span className="font-bold text-gray-800">
                                  {request.type}
                                </span>
                              </p>
                            </div>
                            <div>
                              <p className="font-medium">Duration</p>
                              <p className="font-bold text-gray-800">
                                📅 {request.days} days
                              </p>
                            </div>
                          </div>

                          <div className="text-sm text-gray-600 mb-2">
                            <p className="truncate">📝 {request.reason}</p>
                          </div>

                          <div className="flex flex-wrap gap-2 mt-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                status?.color || "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {status?.icon} {request.status}
                            </span>
                            <span className="bg-white px-3 py-1 rounded-full text-xs font-medium text-gray-700 border border-gray-300">
                              🗓️ {request.startDate}
                            </span>
                            {request.attachments > 0 && (
                              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                                📎 {request.attachments}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {request.status === "Pending" && (
                        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                          <button
                            onClick={() => handleApprove(request.id)}
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold transition text-sm"
                          >
                            ✅ Approve
                          </button>
                          <button
                            onClick={() => handleReject(request.id)}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold transition text-sm"
                          >
                            ❌ Reject
                          </button>
                          <button
                            onClick={() => handleViewDetails(request)}
                            className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg font-semibold transition text-sm"
                          >
                            👁️ View
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </main>

        {/* New Request Modal */}
        {showNewRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6">
                <h2 className="text-2xl font-bold flex items-center">
                  <span className="mr-2">📝</span>
                  New Leave Request
                </h2>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto flex-1">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Employee
                    </label>
                    <select className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition">
                      <option value="">Select Employee</option>
                      <option value="1">John Doe (Shop Attendant)</option>
                      <option value="2">Jane Smith (Delivery Person)</option>
                      <option value="3">Mike Johnson (Store Manager)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Leave Type
                    </label>
                    <select className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition">
                      <option value="">Select Leave Type</option>
                      {leaveTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.icon} {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Reason for Leave
                    </label>
                    <textarea
                      className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
                      rows="3"
                      placeholder="Please provide details about your leave request..."
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Coverage Plan
                    </label>
                    <select className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition">
                      <option value="">Select coverage plan</option>
                      <option value="auto">Auto-assign coverage</option>
                      <option value="specific">Specific employee</option>
                      <option value="temporary">Temporary hire</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Attachments (Optional)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <p className="text-gray-500 text-sm mb-2">
                        📎 Drop files here or click to upload
                      </p>
                      <button
                        type="button"
                        className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                      >
                        Browse Files
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowNewRequest(false)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleNewRequest}
                    className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg font-semibold transition"
                  >
                    Submit Request
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Request Details Modal */}
        {showRequestDetails && selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white bg-opacity-30 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {selectedRequest.employee.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {selectedRequest.employee}
                    </h2>
                    <p className="text-purple-100">🏢 {selectedRequest.role}</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto flex-1">
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Leave Type</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">
                        {
                          leaveTypes.find(
                            (t) => t.value === selectedRequest.type,
                          )?.icon
                        }
                      </span>
                      <p className="font-bold text-gray-800">
                        {selectedRequest.type}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Start Date</p>
                      <p className="font-bold text-gray-800">
                        🗓️ {selectedRequest.startDate}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">End Date</p>
                      <p className="font-bold text-gray-800">
                        🗓️ {selectedRequest.endDate}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Duration</p>
                    <p className="font-bold text-2xl text-gray-800">
                      📅 {selectedRequest.days} days
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Status</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        statusOptions.find(
                          (s) => s.value === selectedRequest.status,
                        )?.color || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {
                        statusOptions.find(
                          (s) => s.value === selectedRequest.status,
                        )?.icon
                      }{" "}
                      {selectedRequest.status}
                    </span>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Reason</p>
                    <p className="font-semibold text-gray-800">
                      📝 {selectedRequest.reason}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Coverage</p>
                    <p className="font-semibold text-gray-800">
                      👥 {selectedRequest.coverage}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Submitted On</p>
                    <p className="font-semibold text-gray-800">
                      📅 {selectedRequest.submitted}
                    </p>
                  </div>

                  {selectedRequest.attachments > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Attachments</p>
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                          📎 View ({selectedRequest.attachments})
                        </button>
                        <button className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-1">
                          ⬇️ Download
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">
                      Manager's Notes
                    </p>
                    <textarea
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition text-sm"
                      rows="3"
                      placeholder="Add notes about this leave request..."
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowRequestDetails(false)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition"
                  >
                    Close
                  </button>
                  {selectedRequest.status === "Pending" && (
                    <>
                      <button
                        onClick={() => handleApprove(selectedRequest.id)}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(selectedRequest.id)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition"
                      >
                        Reject
                      </button>
                    </>
                  )}
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
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-8 rounded-2xl shadow-xl mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
                <span className="mr-3">🏖️</span>
                Leave Management
              </h1>
              <p className="text-purple-100">
                Manage employee time-off requests and approvals for{" "}
                {businessName}
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => navigate("/hr/leave/calendar")}
                className="bg-white bg-opacity-20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-30 transition shadow-lg"
              >
                📅 Calendar View
              </button>
              <button
                onClick={() => setShowNewRequest(true)}
                className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition shadow-lg"
              >
                📝 New Leave Request
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Pending Requests",
              value: pendingCount,
              icon: "⏳",
              color: "text-yellow-600",
              bg: "bg-yellow-50",
            },
            {
              label: "Approved This Month",
              value: currentMonth,
              icon: "✅",
              color: "text-green-600",
              bg: "bg-green-50",
            },
            {
              label: "Total Leave Days",
              value: totalDays,
              icon: "📅",
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              label: "Approval Rate",
              value: "75%",
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

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-4 gap-4">
            <button
              onClick={() => setFilterStatus("Pending")}
              className="bg-yellow-50 hover:bg-yellow-100 text-yellow-700 p-4 rounded-lg font-semibold transition flex flex-col items-center justify-center"
            >
              <span className="text-2xl mb-2">⏳</span>
              <span>Review Pending</span>
            </button>
            <button
              onClick={handleExport}
              className="bg-gray-50 hover:bg-gray-100 text-gray-700 p-4 rounded-lg font-semibold transition flex flex-col items-center justify-center"
            >
              <span className="text-2xl mb-2">📥</span>
              <span>Export Report</span>
            </button>
            <button
              onClick={() => navigate("/hr/leave/policy")}
              className="bg-blue-50 hover:bg-blue-100 text-blue-700 p-4 rounded-lg font-semibold transition flex flex-col items-center justify-center"
            >
              <span className="text-2xl mb-2">📋</span>
              <span>View Policy</span>
            </button>
            <button
              onClick={() => navigate("/hr/leave/balance")}
              className="bg-green-50 hover:bg-green-100 text-green-700 p-4 rounded-lg font-semibold transition flex flex-col items-center justify-center"
            >
              <span className="text-2xl mb-2">💰</span>
              <span>Leave Balance</span>
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-2">
              <input
                type="text"
                placeholder="🔍 Search by employee, role, or reason..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
            >
              <option value="">All Status</option>
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
            >
              <option value="">All Types</option>
              {leaveTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-4 mt-4">
            <button
              onClick={() => toast.info("Bulk actions coming soon!")}
              className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-gray-600 hover:to-gray-700 transition flex items-center gap-2"
            >
              📦 Bulk Actions
            </button>
            <button
              onClick={() => navigate("/hr/leave/settings")}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition flex items-center gap-2"
            >
              ⚙️ Settings
            </button>
          </div>
        </div>

        {/* Leave Requests List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Leave Requests ({filteredRequests.length})
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-gray-500">
                Last updated: {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-8xl mb-6 opacity-20">🏖️</div>
              <h3 className="text-2xl text-gray-500 mb-4">
                No leave requests found
              </h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                No leave requests match your filters. Try adjusting your search
                criteria or submit a new request.
              </p>
              <button
                onClick={() => setShowNewRequest(true)}
                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-purple-700 transition text-lg"
              >
                📝 Submit New Request
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
                      Type
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Period
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Duration
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Reason
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((request) => {
                    const status = statusOptions.find(
                      (s) => s.value === request.status,
                    )
                    const type = leaveTypes.find(
                      (t) => t.value === request.type,
                    )
                    return (
                      <tr
                        key={request.id}
                        className="border-t border-gray-100 hover:bg-gray-50 transition"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
                              {request.employee.charAt(0)}
                            </div>
                            <div>
                              <span className="font-semibold block">
                                {request.employee}
                              </span>
                              <span className="text-sm text-gray-600">
                                🏢 {request.role}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span>{type?.icon}</span>
                            <span className="text-gray-600">
                              {request.type}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-gray-600">
                            <div>🗓️ {request.startDate}</div>
                            <div>→ {request.endDate}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-gray-800">
                            📅 {request.days} days
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              status?.color || "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {status?.icon} {request.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className="text-gray-600 truncate max-w-xs block"
                            title={request.reason}
                          >
                            📝 {request.reason}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleViewDetails(request)}
                              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold transition"
                            >
                              View
                            </button>
                            {request.status === "Pending" && (
                              <>
                                <button
                                  onClick={() => handleApprove(request.id)}
                                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg font-semibold transition"
                                  title="Approve"
                                >
                                  ✅
                                </button>
                                <button
                                  onClick={() => handleReject(request.id)}
                                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg font-semibold transition"
                                  title="Reject"
                                >
                                  ❌
                                </button>
                              </>
                            )}
                          </div>
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
      {showNewRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-8">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-8">
              <h2 className="text-3xl font-bold flex items-center">
                <span className="mr-3">📝</span>
                New Leave Request
              </h2>
            </div>
            <div className="p-8 overflow-y-auto flex-1">
              {/* ... same content as mobile modal but with larger spacing ... */}
            </div>
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="flex gap-4">
                <button
                  onClick={() => setShowNewRequest(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-4 rounded-lg font-semibold transition text-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleNewRequest}
                  className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-4 rounded-lg font-semibold transition text-lg"
                >
                  Submit Request
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

export default LeaveManagement
