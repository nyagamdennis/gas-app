// @ts-nocheck
import React, { useEffect, useState } from "react"
import { useMediaQuery, useTheme } from "@mui/material"
import { useNavigate } from "react-router-dom"
import planStatus from "../../features/planStatus/planStatus"
import AdminsFooter from "../../components/AdminsFooter"
import Navbar from "../../components/ui/mobile/admin/Navbar"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const PayRoll = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const {
    businessName,
    businessId,
    subscriptionPlan,
    employeeLimit,
    planName,
  } = planStatus()

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  // Sample data - replace with real data from API
  const [payrolls, setPayrolls] = useState([
    {
      id: 1,
      employee: "John Doe",
      role: "SHOP_ATTENDANT",
      amount: "25,000",
      status: "Paid",
      date: "2024-01-10",
      month: "January",
    },
    {
      id: 2,
      employee: "Jane Smith",
      role: "DELIVERY_GUY",
      amount: "30,000",
      status: "Pending",
      date: "2024-01-10",
      month: "January",
    },
    {
      id: 3,
      employee: "Mike Johnson",
      role: "STORE_MAN",
      amount: "45,000",
      status: "Paid",
      date: "2023-12-25",
      month: "December",
    },
    {
      id: 4,
      employee: "Sarah Williams",
      role: "SECURITY",
      amount: "28,000",
      status: "Failed",
      date: "2023-12-25",
      month: "December",
    },
    {
      id: 5,
      employee: "David Brown",
      role: "TRUCK_DRIVER",
      amount: "35,000",
      status: "Paid",
      date: "2023-11-30",
      month: "November",
    },
  ])

  const [filterMonth, setFilterMonth] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [showProcessPayroll, setShowProcessPayroll] = useState(false)
  const [selectedPayroll, setSelectedPayroll] = useState(null)
  const [showPayrollDetails, setShowPayrollDetails] = useState(false)

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const statusOptions = [
    { value: "Paid", label: "Paid", color: "bg-green-100 text-green-700" },
    {
      value: "Pending",
      label: "Pending",
      color: "bg-yellow-100 text-yellow-700",
    },
    { value: "Failed", label: "Failed", color: "bg-red-100 text-red-700" },
    {
      value: "Processing",
      label: "Processing",
      color: "bg-blue-100 text-blue-700",
    },
  ]

  const filteredPayrolls = payrolls.filter((payroll) => {
    const matchesMonth = filterMonth === "" || payroll.month === filterMonth
    const matchesStatus = filterStatus === "" || payroll.status === filterStatus
    const matchesSearch =
      searchQuery === "" ||
      payroll.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payroll.role.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesMonth && matchesStatus && matchesSearch
  })

  const handleProcessPayroll = () => {
    // Simulate payroll processing
    toast.success("Payroll processing initiated!")
    setShowProcessPayroll(false)
  }

  const handleViewDetails = (payroll) => {
    setSelectedPayroll(payroll)
    setShowPayrollDetails(true)
  }

  const handleExport = () => {
    toast.info("Export feature coming soon!")
  }

  // Calculate statistics
  const totalPaid = payrolls
    .filter((p) => p.status === "Paid")
    .reduce((sum, p) => sum + parseInt(p.amount.replace(/,/g, "")), 0)
  const totalPending = payrolls
    .filter((p) => p.status === "Pending")
    .reduce((sum, p) => sum + parseInt(p.amount.replace(/,/g, "")), 0)
  const totalEmployees = payrolls.length
  const paidEmployees = payrolls.filter((p) => p.status === "Paid").length

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
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg shadow-lg mb-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <h1 className="text-2xl font-bold text-white mb-1 flex items-center">
                  <span className="mr-2">💰</span>
                  Payroll Management
                </h1>
                <p className="text-green-100 text-sm">
                  Process and manage employee salaries
                </p>
              </div>
              <button
                onClick={() => setShowProcessPayroll(true)}
                className="bg-white text-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-green-50 transition shadow-md"
              >
                💸 Process Payroll
              </button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="text-sm text-gray-600 mb-1">Total Payroll</div>
              <div className="text-2xl font-bold text-green-600">
                KES {totalPaid.toLocaleString()}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="text-sm text-gray-600 mb-1">Pending</div>
              <div className="text-2xl font-bold text-yellow-600">
                KES {totalPending.toLocaleString()}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="text-sm text-gray-600 mb-1">Employees</div>
              <div className="text-2xl font-bold text-blue-600">
                {totalEmployees}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="text-sm text-gray-600 mb-1">Paid</div>
              <div className="text-2xl font-bold text-purple-600">
                {paidEmployees}
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
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <select
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
                >
                  <option value="">All Months</option>
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
                >
                  <option value="">All Status</option>
                  {statusOptions.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
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

          {/* Payroll List */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Payroll History ({filteredPayrolls.length})
              </h2>
              <span className="text-sm text-gray-500">
                {new Date().toLocaleDateString()}
              </span>
            </div>

            {filteredPayrolls.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4 opacity-30">💰</div>
                <p className="text-gray-500 text-lg mb-2">
                  No payroll records found
                </p>
                <p className="text-gray-400 text-sm mb-4">
                  Try adjusting your filters or process new payroll
                </p>
                <button
                  onClick={() => setShowProcessPayroll(true)}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition"
                >
                  💸 Process Payroll
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredPayrolls.map((payroll) => {
                  const status = statusOptions.find(
                    (s) => s.value === payroll.status,
                  )
                  return (
                    <div
                      key={payroll.id}
                      className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                      onClick={() => handleViewDetails(payroll)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                              {payroll.employee.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-800">
                                {payroll.employee}
                              </h3>
                              <p className="text-sm text-gray-600">
                                🏢 {payroll.role}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                            <div>
                              <p className="font-medium">Amount</p>
                              <p className="text-lg font-bold text-gray-800">
                                KES {payroll.amount}
                              </p>
                            </div>
                            <div>
                              <p className="font-medium">Month</p>
                              <p className="text-gray-800">
                                📅 {payroll.month}
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-2 mt-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                status?.color || "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {payroll.status}
                            </span>
                            <span className="bg-white px-3 py-1 rounded-full text-xs font-medium text-gray-700 border border-gray-300">
                              📅 {payroll.date}
                            </span>
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

        {/* Process Payroll Modal */}
        {showProcessPayroll && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6">
                <h2 className="text-2xl font-bold flex items-center">
                  <span className="mr-2">💸</span>
                  Process Payroll
                </h2>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto flex-1">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Select Month
                    </label>
                    <select className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition">
                      <option value="">Select Month</option>
                      {months.map((month) => (
                        <option key={month} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Payment Date
                    </label>
                    <input
                      type="date"
                      className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
                    />
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
                    <p className="text-yellow-700 text-sm">
                      <span className="font-bold">Note:</span> Processing
                      payroll will calculate salaries for all active employees
                      for the selected month.
                    </p>
                  </div>

                  <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                    <p className="text-green-700 text-sm font-bold">
                      Total Estimated Payroll: KES 150,000
                    </p>
                    <p className="text-green-600 text-xs mt-1">
                      For 5 active employees
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowProcessPayroll(false)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleProcessPayroll}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition"
                  >
                    Process
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payroll Details Modal */}
        {showPayrollDetails && selectedPayroll && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white bg-opacity-30 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {selectedPayroll.employee.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {selectedPayroll.employee}
                    </h2>
                    <p className="text-green-100">🏢 {selectedPayroll.role}</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto flex-1">
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Amount</p>
                    <p className="font-bold text-gray-800 text-2xl">
                      KES {selectedPayroll.amount}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Status</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        statusOptions.find(
                          (s) => s.value === selectedPayroll.status,
                        )?.color || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {selectedPayroll.status}
                    </span>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Month</p>
                    <p className="font-semibold text-gray-800">
                      📅 {selectedPayroll.month}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Payment Date</p>
                    <p className="font-semibold text-gray-800">
                      {selectedPayroll.date}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Payment Method</p>
                    <p className="font-semibold text-gray-800">
                      💳 Bank Transfer
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Reference ID</p>
                    <p className="font-semibold text-gray-800 font-mono">
                      PAY-{selectedPayroll.id.toString().padStart(4, "0")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowPayrollDetails(false)}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition"
                  >
                    Close
                  </button>
                  {selectedPayroll.status === "Pending" && (
                    <button
                      onClick={() => {
                        toast.success("Payment marked as completed!")
                        setShowPayrollDetails(false)
                      }}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition"
                    >
                      Mark as Paid
                    </button>
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
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-8 rounded-2xl shadow-xl mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
                <span className="mr-3">💰</span>
                Payroll Management
              </h1>
              <p className="text-green-100">
                Process and manage employee salaries for {businessName}
              </p>
            </div>
            <button
              onClick={() => setShowProcessPayroll(true)}
              className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition shadow-lg text-lg"
            >
              💸 Process Payroll
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Total Payroll",
              value: `KES ${totalPaid.toLocaleString()}`,
              icon: "💰",
              color: "text-green-600",
            },
            {
              label: "Pending",
              value: `KES ${totalPending.toLocaleString()}`,
              icon: "⏳",
              color: "text-yellow-600",
            },
            {
              label: "Total Employees",
              value: totalEmployees,
              icon: "👥",
              color: "text-blue-600",
            },
            {
              label: "This Month",
              value: "KES 75,000",
              icon: "📅",
              color: "text-purple-600",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className={`text-3xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                </div>
                <span className="text-3xl">{stat.icon}</span>
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
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
              />
            </div>
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
            >
              <option value="">All Months</option>
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
            >
              <option value="">All Status</option>
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
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
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition flex items-center gap-2"
            >
              ⚙️ Advanced Filters
            </button>
          </div>
        </div>

        {/* Payroll List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Payroll History ({filteredPayrolls.length})
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-gray-500">
                Last updated: {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>

          {filteredPayrolls.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-8xl mb-6 opacity-20">💰</div>
              <h3 className="text-2xl text-gray-500 mb-4">
                No payroll records found
              </h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                No payroll records match your filters. Try adjusting your search
                criteria or process new payroll.
              </p>
              <button
                onClick={() => setShowProcessPayroll(true)}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition text-lg"
              >
                💸 Process New Payroll
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
                      Amount
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Month
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayrolls.map((payroll) => {
                    const status = statusOptions.find(
                      (s) => s.value === payroll.status,
                    )
                    return (
                      <tr
                        key={payroll.id}
                        className="border-t border-gray-100 hover:bg-gray-50 transition"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">
                              {payroll.employee.charAt(0)}
                            </div>
                            <span className="font-semibold">
                              {payroll.employee}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-gray-600">
                            🏢 {payroll.role}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-gray-800">
                            KES {payroll.amount}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-gray-600">
                            📅 {payroll.month}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              status?.color || "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {payroll.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-gray-600">{payroll.date}</span>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleViewDetails(payroll)}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition"
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
      {/* Process Payroll Modal */}
      {showProcessPayroll && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-8">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-8">
              <h2 className="text-3xl font-bold flex items-center">
                <span className="mr-3">💸</span>
                Process Payroll
              </h2>
            </div>
            <div className="p-8 overflow-y-auto flex-1">
              {/* ... same content as mobile modal but with larger spacing ... */}
            </div>
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="flex gap-4">
                <button
                  onClick={() => setShowProcessPayroll(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-4 rounded-lg font-semibold transition text-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProcessPayroll}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-4 rounded-lg font-semibold transition text-lg"
                >
                  Process Payroll
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

export default PayRoll
