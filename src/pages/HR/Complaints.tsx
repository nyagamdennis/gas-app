// @ts-nocheck
import React, { useEffect, useState } from "react"
import { useMediaQuery, useTheme } from "@mui/material"
import { useNavigate } from "react-router-dom"
import planStatus from "../../features/planStatus/planStatus"
import AdminsFooter from "../../components/AdminsFooter"
import Navbar from "../../components/ui/mobile/admin/Navbar"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const Complaints = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const { businessName, businessId } = planStatus()

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  // Sample data - replace with real data from API
  const [complaints, setComplaints] = useState([
    {
      id: 1,
      employee: "John Doe",
      role: "SHOP_ATTENDANT",
      type: "Harassment",
      status: "Open",
      priority: "High",
      submitted: "2024-01-15",
      against: "Manager",
      description: "Feeling harassed by manager during shift changes",
      resolution: "",
      assignedTo: "HR Manager",
      lastUpdated: "2024-01-15",
    },
    {
      id: 2,
      employee: "Jane Smith",
      role: "DELIVERY_GUY",
      type: "Work Conditions",
      status: "In Progress",
      priority: "Medium",
      submitted: "2024-01-14",
      against: "Company",
      description:
        "Delivery vehicle needs maintenance, brakes not working properly",
      resolution: "Vehicle scheduled for maintenance",
      assignedTo: "Operations Head",
      lastUpdated: "2024-01-14",
    },
    {
      id: 3,
      employee: "Mike Johnson",
      role: "STORE_MAN",
      type: "Discrimination",
      status: "Resolved",
      priority: "High",
      submitted: "2024-01-10",
      against: "Colleague",
      description: "Unfair treatment based on ethnic background",
      resolution: "Mediation conducted, sensitivity training scheduled",
      assignedTo: "HR Manager",
      lastUpdated: "2024-01-13",
    },
    {
      id: 4,
      employee: "Sarah Williams",
      role: "SECURITY",
      type: "Safety Concern",
      status: "Closed",
      priority: "High",
      submitted: "2024-01-08",
      against: "Facility",
      description: "Broken CCTV cameras in parking area",
      resolution: "Cameras repaired, additional lighting installed",
      assignedTo: "Facility Manager",
      lastUpdated: "2024-01-12",
    },
    {
      id: 5,
      employee: "David Brown",
      role: "TRUCK_DRIVER",
      type: "Payroll Issue",
      status: "Open",
      priority: "Medium",
      submitted: "2024-01-12",
      against: "Payroll Department",
      description: "Overtime hours not included in last paycheck",
      resolution: "",
      assignedTo: "Payroll Officer",
      lastUpdated: "2024-01-12",
    },
    {
      id: 6,
      employee: "Lisa Chen",
      role: "SALES_PERSON",
      type: "Workload",
      status: "Pending",
      priority: "Low",
      submitted: "2024-01-11",
      against: "Management",
      description: "Unrealistic sales targets affecting mental health",
      resolution: "Review meeting scheduled",
      assignedTo: "Sales Manager",
      lastUpdated: "2024-01-11",
    },
  ])

  const [filterStatus, setFilterStatus] = useState("")
  const [filterType, setFilterType] = useState("")
  const [filterPriority, setFilterPriority] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [showNewComplaint, setShowNewComplaint] = useState(false)
  const [showComplaintDetails, setShowComplaintDetails] = useState(false)
  const [selectedComplaint, setSelectedComplaint] = useState(null)
  const [newComplaint, setNewComplaint] = useState({
    type: "",
    against: "",
    description: "",
    priority: "Medium",
    anonymous: false,
  })

  const complaintTypes = [
    {
      value: "Harassment",
      label: "Harassment",
      icon: "🚫",
      color: "bg-red-100 text-red-700",
    },
    {
      value: "Discrimination",
      label: "Discrimination",
      icon: "⚖️",
      color: "bg-purple-100 text-purple-700",
    },
    {
      value: "Work Conditions",
      label: "Work Conditions",
      icon: "🏢",
      color: "bg-blue-100 text-blue-700",
    },
    {
      value: "Safety Concern",
      label: "Safety Concern",
      icon: "⚠️",
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      value: "Payroll Issue",
      label: "Payroll Issue",
      icon: "💰",
      color: "bg-green-100 text-green-700",
    },
    {
      value: "Workload",
      label: "Workload",
      icon: "📊",
      color: "bg-orange-100 text-orange-700",
    },
    {
      value: "Management",
      label: "Management",
      icon: "👔",
      color: "bg-gray-100 text-gray-700",
    },
    {
      value: "Other",
      label: "Other",
      icon: "📝",
      color: "bg-gray-100 text-gray-700",
    },
  ]

  const statusOptions = [
    {
      value: "Open",
      label: "Open",
      icon: "🟢",
      color: "bg-green-100 text-green-700",
    },
    {
      value: "In Progress",
      label: "In Progress",
      icon: "🟡",
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      value: "Pending",
      label: "Pending",
      icon: "🟠",
      color: "bg-orange-100 text-orange-700",
    },
    {
      value: "Resolved",
      label: "Resolved",
      icon: "🔵",
      color: "bg-blue-100 text-blue-700",
    },
    {
      value: "Closed",
      label: "Closed",
      icon: "⚫",
      color: "bg-gray-100 text-gray-700",
    },
  ]

  const priorityOptions = [
    {
      value: "High",
      label: "High",
      icon: "🔴",
      color: "bg-red-100 text-red-700",
    },
    {
      value: "Medium",
      label: "Medium",
      icon: "🟡",
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      value: "Low",
      label: "Low",
      icon: "🟢",
      color: "bg-green-100 text-green-700",
    },
  ]

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesStatus =
      filterStatus === "" || complaint.status === filterStatus
    const matchesType = filterType === "" || complaint.type === filterType
    const matchesPriority =
      filterPriority === "" || complaint.priority === filterPriority
    const matchesSearch =
      searchQuery === "" ||
      complaint.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.against.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesStatus && matchesType && matchesPriority && matchesSearch
  })

  const handleUpdateStatus = (complaintId, newStatus) => {
    setComplaints((prev) =>
      prev.map((comp) =>
        comp.id === complaintId ? { ...comp, status: newStatus } : comp,
      ),
    )
    toast.success(`Complaint status updated to ${newStatus}`)
  }

  const handleAssign = (complaintId, assignee) => {
    setComplaints((prev) =>
      prev.map((comp) =>
        comp.id === complaintId ? { ...comp, assignedTo: assignee } : comp,
      ),
    )
    toast.success(`Complaint assigned to ${assignee}`)
  }

  const handleViewDetails = (complaint) => {
    setSelectedComplaint(complaint)
    setShowComplaintDetails(true)
  }

  const handleSubmitComplaint = () => {
    const newId = complaints.length + 1
    setComplaints((prev) => [
      {
        id: newId,
        employee: "Anonymous Employee",
        role: "Anonymous",
        type: newComplaint.type,
        status: "Open",
        priority: newComplaint.priority,
        submitted: new Date().toISOString().split("T")[0],
        against: newComplaint.against,
        description: newComplaint.description,
        resolution: "",
        assignedTo: "Unassigned",
        lastUpdated: new Date().toISOString().split("T")[0],
      },
      ...prev,
    ])

    toast.success("Complaint submitted successfully!")
    setShowNewComplaint(false)
    setNewComplaint({
      type: "",
      against: "",
      description: "",
      priority: "Medium",
      anonymous: false,
    })
  }

  const handleExport = () => {
    toast.info("Complaints report exported successfully!")
  }

  // Calculate statistics
  const openCount = complaints.filter((c) => c.status === "Open").length
  const inProgressCount = complaints.filter(
    (c) => c.status === "In Progress",
  ).length
  const highPriorityCount = complaints.filter(
    (c) => c.priority === "High",
  ).length
  const resolvedCount = complaints.filter(
    (c) => c.status === "Resolved" || c.status === "Closed",
  ).length
  const harassmentCount = complaints.filter(
    (c) => c.type === "Harassment",
  ).length

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
          <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-lg shadow-lg mb-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <h1 className="text-2xl font-bold text-white mb-1 flex items-center">
                  <span className="mr-2">⚠️</span>
                  Employee Complaints
                </h1>
                <p className="text-red-100 text-sm">
                  Manage and resolve employee grievances
                </p>
              </div>
              <button
                onClick={() => setShowNewComplaint(true)}
                className="bg-white text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-red-50 transition shadow-md"
              >
                📝 File Complaint
              </button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600 mb-1">
                    Open Complaints
                  </div>
                  <div className="text-2xl font-bold text-red-600">
                    {openCount}
                  </div>
                </div>
                <span className="text-2xl">🟢</span>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600 mb-1">
                    High Priority
                  </div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {highPriorityCount}
                  </div>
                </div>
                <span className="text-2xl">🔴</span>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600 mb-1">In Progress</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {inProgressCount}
                  </div>
                </div>
                <span className="text-2xl">🟡</span>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Resolved</div>
                  <div className="text-2xl font-bold text-green-600">
                    {resolvedCount}
                  </div>
                </div>
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="🔍 Search complaints..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition"
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
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition"
                >
                  <option value="">All Types</option>
                  {complaintTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition"
                >
                  <option value="">All Priority</option>
                  {priorityOptions.map((priority) => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
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

          {/* Complaints List */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Employee Complaints ({filteredComplaints.length})
              </h2>
              <span className="text-sm text-gray-500">Last 30 days</span>
            </div>

            {filteredComplaints.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4 opacity-30">⚠️</div>
                <p className="text-gray-500 text-lg mb-2">
                  No complaints found
                </p>
                <p className="text-gray-400 text-sm mb-4">
                  Try adjusting your filters or file a new complaint
                </p>
                <button
                  onClick={() => setShowNewComplaint(true)}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition"
                >
                  📝 File Complaint
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredComplaints.map((complaint) => {
                  const status = statusOptions.find(
                    (s) => s.value === complaint.status,
                  )
                  const type = complaintTypes.find(
                    (t) => t.value === complaint.type,
                  )
                  const priority = priorityOptions.find(
                    (p) => p.value === complaint.priority,
                  )
                  return (
                    <div
                      key={complaint.id}
                      className={`border-2 rounded-lg p-4 hover:shadow-md transition cursor-pointer ${
                        complaint.status === "Open"
                          ? "border-green-200 bg-gradient-to-r from-green-50 to-emerald-50"
                          : complaint.status === "In Progress"
                          ? "border-yellow-200 bg-gradient-to-r from-yellow-50 to-amber-50"
                          : complaint.status === "Pending"
                          ? "border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50"
                          : complaint.status === "Resolved"
                          ? "border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50"
                          : "border-gray-200 bg-gradient-to-r from-gray-50 to-slate-50"
                      }`}
                      onClick={() => handleViewDetails(complaint)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div
                              className={`w-10 h-10 ${
                                complaint.priority === "High"
                                  ? "bg-red-500"
                                  : complaint.priority === "Medium"
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                              } rounded-full flex items-center justify-center text-white font-bold`}
                            >
                              {complaint.employee.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-800">
                                {complaint.employee}
                              </h3>
                              <p className="text-sm text-gray-600">
                                🏢 {complaint.role}
                              </p>
                            </div>
                          </div>

                          <div className="text-sm text-gray-600 mb-2">
                            <p className="font-medium mb-1">
                              Against: {complaint.against}
                            </p>
                            <p className="truncate">
                              📝 {complaint.description}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2 mt-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                status?.color || "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {status?.icon} {complaint.status}
                            </span>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                priority?.color || "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {priority?.icon} {complaint.priority}
                            </span>
                            <span className="bg-white px-3 py-1 rounded-full text-xs font-medium text-gray-700 border border-gray-300">
                              {type?.icon} {complaint.type}
                            </span>
                            {complaint.assignedTo && (
                              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                                👤 {complaint.assignedTo}
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

        {/* New Complaint Modal */}
        {showNewComplaint && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6">
                <h2 className="text-2xl font-bold flex items-center">
                  <span className="mr-2">📝</span>
                  File New Complaint
                </h2>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto flex-1">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Complaint Type
                    </label>
                    <select
                      value={newComplaint.type}
                      onChange={(e) =>
                        setNewComplaint((prev) => ({
                          ...prev,
                          type: e.target.value,
                        }))
                      }
                      className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition"
                    >
                      <option value="">Select Complaint Type</option>
                      {complaintTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.icon} {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Against (Person/Department)
                    </label>
                    <input
                      type="text"
                      value={newComplaint.against}
                      onChange={(e) =>
                        setNewComplaint((prev) => ({
                          ...prev,
                          against: e.target.value,
                        }))
                      }
                      className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition"
                      placeholder="e.g., Manager, HR Department, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Priority
                    </label>
                    <div className="flex gap-2">
                      {priorityOptions.map((priority) => (
                        <button
                          key={priority.value}
                          type="button"
                          onClick={() =>
                            setNewComplaint((prev) => ({
                              ...prev,
                              priority: priority.value,
                            }))
                          }
                          className={`flex-1 border-2 rounded-lg p-3 text-center transition ${
                            newComplaint.priority === priority.value
                              ? `${priority.color
                                  .replace("bg-", "border-")
                                  .replace(" text-", " border-")}`
                              : "border-gray-300 hover:border-red-500"
                          }`}
                        >
                          <div className="text-2xl mb-1">{priority.icon}</div>
                          <div className="text-sm font-medium">
                            {priority.label}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newComplaint.description}
                      onChange={(e) =>
                        setNewComplaint((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition"
                      rows="4"
                      placeholder="Please provide detailed information about your complaint..."
                    ></textarea>
                  </div>

                  <div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newComplaint.anonymous}
                        onChange={(e) =>
                          setNewComplaint((prev) => ({
                            ...prev,
                            anonymous: e.target.checked,
                          }))
                        }
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">
                        File anonymously
                      </span>
                    </label>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
                    <p className="text-yellow-700 text-sm">
                      <span className="font-bold">Note:</span> All complaints
                      are treated confidentially. Retaliation against employees
                      who file complaints is strictly prohibited.
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowNewComplaint(false)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitComplaint}
                    disabled={!newComplaint.type || !newComplaint.description}
                    className={`flex-1 py-3 rounded-lg font-semibold transition ${
                      !newComplaint.type || !newComplaint.description
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600 text-white"
                    }`}
                  >
                    Submit Complaint
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Complaint Details Modal */}
        {showComplaintDetails && selectedComplaint && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white bg-opacity-30 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {selectedComplaint.employee.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {selectedComplaint.employee}
                    </h2>
                    <p className="text-red-100">🏢 {selectedComplaint.role}</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto flex-1">
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Complaint Type</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">
                        {
                          complaintTypes.find(
                            (t) => t.value === selectedComplaint.type,
                          )?.icon
                        }
                      </span>
                      <p className="font-bold text-gray-800">
                        {selectedComplaint.type}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Against</p>
                    <p className="font-bold text-gray-800">
                      👤 {selectedComplaint.against}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Status</p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          statusOptions.find(
                            (s) => s.value === selectedComplaint.status,
                          )?.color || "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {
                          statusOptions.find(
                            (s) => s.value === selectedComplaint.status,
                          )?.icon
                        }{" "}
                        {selectedComplaint.status}
                      </span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Priority</p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          priorityOptions.find(
                            (p) => p.value === selectedComplaint.priority,
                          )?.color || "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {
                          priorityOptions.find(
                            (p) => p.value === selectedComplaint.priority,
                          )?.icon
                        }{" "}
                        {selectedComplaint.priority}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Description</p>
                    <p className="font-semibold text-gray-800">
                      📝 {selectedComplaint.description}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Assigned To</p>
                    <p className="font-semibold text-gray-800">
                      👤 {selectedComplaint.assignedTo}
                    </p>
                  </div>

                  {selectedComplaint.resolution && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Resolution</p>
                      <p className="font-semibold text-gray-800">
                        ✅ {selectedComplaint.resolution}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Submitted</p>
                      <p className="font-semibold text-gray-800">
                        📅 {selectedComplaint.submitted}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Last Updated</p>
                      <p className="font-semibold text-gray-800">
                        📅 {selectedComplaint.lastUpdated}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Update Status</p>
                    <div className="flex gap-2 flex-wrap">
                      {statusOptions.map((status) => (
                        <button
                          key={status.value}
                          onClick={() =>
                            handleUpdateStatus(
                              selectedComplaint.id,
                              status.value,
                            )
                          }
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            selectedComplaint.status === status.value
                              ? `${status.color} ring-2 ring-offset-1`
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {status.icon} {status.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Assign To</p>
                    <select
                      onChange={(e) =>
                        handleAssign(selectedComplaint.id, e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition"
                    >
                      <option value="">Select assignee</option>
                      <option value="HR Manager">HR Manager</option>
                      <option value="Operations Head">Operations Head</option>
                      <option value="Facility Manager">Facility Manager</option>
                      <option value="Department Head">Department Head</option>
                    </select>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">
                      Add Resolution Notes
                    </p>
                    <textarea
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition text-sm"
                      rows="3"
                      placeholder="Add resolution details..."
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowComplaintDetails(false)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      toast.success("Complaint updated successfully!")
                      setShowComplaintDetails(false)
                    }}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition"
                  >
                    Save Changes
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
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-8 rounded-2xl shadow-xl mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
                <span className="mr-3">⚠️</span>
                Employee Complaints Management
              </h1>
              <p className="text-red-100">
                Handle employee grievances and ensure a safe work environment
                for {businessName}
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => navigate("/hr/complaints/reports")}
                className="bg-white bg-opacity-20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-30 transition shadow-lg"
              >
                📊 View Reports
              </button>
              <button
                onClick={() => setShowNewComplaint(true)}
                className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-red-50 transition shadow-lg"
              >
                📝 File New Complaint
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Open Complaints",
              value: openCount,
              icon: "🟢",
              color: "text-green-600",
              bg: "bg-green-50",
              trend: "+2",
            },
            {
              label: "High Priority",
              value: highPriorityCount,
              icon: "🔴",
              color: "text-red-600",
              bg: "bg-red-50",
              trend: "+1",
            },
            {
              label: "Resolved This Month",
              value: resolvedCount,
              icon: "✅",
              color: "text-blue-600",
              bg: "bg-blue-50",
              trend: "+5",
            },
            {
              label: "Harassment Cases",
              value: harassmentCount,
              icon: "🚫",
              color: "text-purple-600",
              bg: "bg-purple-50",
              trend: "0",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className={`${stat.bg} rounded-xl shadow-lg p-6 hover:shadow-xl transition`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <div className="flex items-baseline gap-2">
                    <p className={`text-3xl font-bold ${stat.color}`}>
                      {stat.value}
                    </p>
                    <span className="text-sm text-gray-500">{stat.trend}</span>
                  </div>
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
              onClick={() => setFilterStatus("Open")}
              className="bg-green-50 hover:bg-green-100 text-green-700 p-4 rounded-lg font-semibold transition flex flex-col items-center justify-center"
            >
              <span className="text-2xl mb-2">🟢</span>
              <span>Review Open</span>
            </button>
            <button
              onClick={() => setFilterPriority("High")}
              className="bg-red-50 hover:bg-red-100 text-red-700 p-4 rounded-lg font-semibold transition flex flex-col items-center justify-center"
            >
              <span className="text-2xl mb-2">🔴</span>
              <span>High Priority</span>
            </button>
            <button
              onClick={handleExport}
              className="bg-gray-50 hover:bg-gray-100 text-gray-700 p-4 rounded-lg font-semibold transition flex flex-col items-center justify-center"
            >
              <span className="text-2xl mb-2">📥</span>
              <span>Export Reports</span>
            </button>
            <button
              onClick={() => navigate("/hr/complaints/policy")}
              className="bg-blue-50 hover:bg-blue-100 text-blue-700 p-4 rounded-lg font-semibold transition flex flex-col items-center justify-center"
            >
              <span className="text-2xl mb-2">📋</span>
              <span>View Policy</span>
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-2">
              <input
                type="text"
                placeholder="🔍 Search complaints by employee, description, or against..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition"
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
              className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition"
            >
              <option value="">All Types</option>
              {complaintTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-4 mt-4">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition"
            >
              <option value="">All Priority</option>
              {priorityOptions.map((priority) => (
                <option key={priority.value} value={priority.value}>
                  {priority.label}
                </option>
              ))}
            </select>
            <button
              onClick={() => toast.info("Bulk actions coming soon!")}
              className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-gray-600 hover:to-gray-700 transition flex items-center gap-2"
            >
              📦 Bulk Actions
            </button>
            <button
              onClick={() => navigate("/hr/complaints/settings")}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition flex items-center gap-2"
            >
              ⚙️ Settings
            </button>
          </div>
        </div>

        {/* Complaints List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Employee Complaints ({filteredComplaints.length})
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-gray-500">
                Showing complaints from last 30 days
              </span>
            </div>
          </div>

          {filteredComplaints.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-8xl mb-6 opacity-20">⚠️</div>
              <h3 className="text-2xl text-gray-500 mb-4">
                No complaints found
              </h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                No complaints match your filters. Try adjusting your search
                criteria or file a new complaint.
              </p>
              <button
                onClick={() => setShowNewComplaint(true)}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition text-lg"
              >
                📝 File New Complaint
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
                      Against
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Priority
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Assigned To
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredComplaints.map((complaint) => {
                    const status = statusOptions.find(
                      (s) => s.value === complaint.status,
                    )
                    const type = complaintTypes.find(
                      (t) => t.value === complaint.type,
                    )
                    const priority = priorityOptions.find(
                      (p) => p.value === complaint.priority,
                    )
                    return (
                      <tr
                        key={complaint.id}
                        className="border-t border-gray-100 hover:bg-gray-50 transition"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold">
                              {complaint.employee.charAt(0)}
                            </div>
                            <div>
                              <span className="font-semibold block">
                                {complaint.employee}
                              </span>
                              <span className="text-sm text-gray-600">
                                🏢 {complaint.role}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span>{type?.icon}</span>
                            <span className="text-gray-600">
                              {complaint.type}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-gray-600">
                            👤 {complaint.against}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              status?.color || "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {status?.icon} {complaint.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              priority?.color || "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {priority?.icon} {complaint.priority}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-gray-600">
                            👤 {complaint.assignedTo}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleViewDetails(complaint)}
                              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition"
                            >
                              View
                            </button>
                            {complaint.status === "Open" && (
                              <button
                                onClick={() =>
                                  handleUpdateStatus(
                                    complaint.id,
                                    "In Progress",
                                  )
                                }
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg font-semibold transition"
                                title="Start Progress"
                              >
                                🟡
                              </button>
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
      {showNewComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-8">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-8">
              <h2 className="text-3xl font-bold flex items-center">
                <span className="mr-3">📝</span>
                File New Complaint
              </h2>
            </div>
            <div className="p-8 overflow-y-auto flex-1">
              {/* ... same content as mobile modal but with larger spacing ... */}
            </div>
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="flex gap-4">
                <button
                  onClick={() => setShowNewComplaint(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-4 rounded-lg font-semibold transition text-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitComplaint}
                  disabled={!newComplaint.type || !newComplaint.description}
                  className={`flex-1 py-4 rounded-lg font-semibold transition text-lg ${
                    !newComplaint.type || !newComplaint.description
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600 text-white"
                  }`}
                >
                  Submit Complaint
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

export default Complaints
