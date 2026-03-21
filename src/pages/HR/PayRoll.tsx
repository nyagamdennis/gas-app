// @ts-nocheck
import React, { useEffect, useState } from "react"
import { useMediaQuery, useTheme } from "@mui/material"
import { useNavigate } from "react-router-dom"
import planStatus from "../../features/planStatus/planStatus"
import AdminsFooter from "../../components/AdminsFooter"
import Navbar from "../../components/ui/mobile/admin/Navbar"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import api from "../../../utils/api"

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
  const [employeesData, setEmployeesData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  useEffect(() => {
    api
      .get("payroll/employees/payroll-summary/")
      .then((res) => {
        setEmployeesData(res.data)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setError("Failed to load payroll data")
        setLoading(false)
        toast.error("Could not fetch employee data")
      })
  }, [])

  // ---------- Data States ----------
  // Compute employees list with derived fields
  const employees = employeesData.map((item) => {
    const emp = item.employee
    const salaryStruct = item.salary_structure
    const baseSalary = salaryStruct ? parseFloat(salaryStruct.basic_salary) : 0
    const advances = item.total_advances || 0
    const otherDeductions =
      (item.total_expenses || 0) +
      (item.total_losses || 0) +
      (item.total_deficits || 0)
    const netPay = baseSalary - advances - otherDeductions

    // Determine role from assigned_to
    let role = "Unassigned"
    if (emp.assigned_to?.type) {
      role = emp.assigned_to.type
    }

    return {
      id: emp.id,
      name: `${emp.first_name} ${emp.last_name}`,
      role,
      baseSalary,
      advances,
      otherDeductions,
      netPay: netPay > 0 ? netPay : 0,
    }
  })

  const [payrolls, setPayrolls] = useState([
    {
      id: 1,
      employeeId: 1,
      employeeName: "John Doe",
      role: "SHOP_ATTENDANT",
      baseSalary: 25000,
      advances: 5000,
      deductions: 1000,
      netPay: 19000,
      status: "Paid",
      date: "2024-01-10",
      month: "January",
    },
    {
      id: 2,
      employeeId: 2,
      employeeName: "Jane Smith",
      role: "DELIVERY_GUY",
      baseSalary: 30000,
      advances: 2000,
      deductions: 500,
      netPay: 27500,
      status: "Pending",
      date: "2024-01-10",
      month: "January",
    },
  ])

  // UI States
  const [activeTab, setActiveTab] = useState("employees")
  const [filterMonth, setFilterMonth] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [showProcessPayroll, setShowProcessPayroll] = useState(false)
  const [showSetSalaryModal, setShowSetSalaryModal] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [newSalary, setNewSalary] = useState("")
  const [showPayrollDetails, setShowPayrollDetails] = useState(false)
  const [selectedPayroll, setSelectedPayroll] = useState(null)

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

  // Filter employees
  const filteredEmployees = employees.filter(
    (emp) =>
      searchQuery === "" ||
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Filter payrolls (mock)
  const filteredPayrolls = payrolls.filter((payroll) => {
    const matchesMonth = filterMonth === "" || payroll.month === filterMonth
    const matchesStatus = filterStatus === "" || payroll.status === filterStatus
    const matchesSearch =
      searchQuery === "" ||
      payroll.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payroll.role.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesMonth && matchesStatus && matchesSearch
  })

  // Statistics from real data
  const totalEmployees = employees.length
  const totalNetPayroll = employees.reduce((sum, e) => sum + e.netPay, 0)
  const totalDeductions = employees.reduce(
    (sum, e) => sum + e.advances + e.otherDeductions,
    0,
  )
  const totalAdvances = employees.reduce((sum, e) => sum + e.advances, 0)

  // Handlers
  const handleSetSalary = (employee) => {
    // Navigate to employee payment page for full salary structure
    navigate(`/hr/employee-payment/${employee.id}`)
  }

  const handleNavigateToEmployee = (employeeId) => {
    navigate(`/hr/employee-payment/${employeeId}`)
  }

  const handleProcessPayroll = () => {
    // In real app, you'd create payroll records for current month
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0]">
        <Navbar headerMessage="Loading..." headerText="Please wait" />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </main>
        <footer>
          <AdminsFooter />
        </footer>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0]">
        <Navbar headerMessage="Error" headerText="Payroll data" />
        <main className="flex-grow p-6">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Retry
            </button>
          </div>
        </main>
        <footer>
          <AdminsFooter />
        </footer>
      </div>
    )
  }

  if (isMobile) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-gray-800 font-sans">
        <Navbar
          headerMessage={"ERP"}
          headerText={"Manage your operations with style and clarity"}
        />
        <ToastContainer />

        <main className="flex-grow m-2 p-1 mb-20">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg shadow-lg mb-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <h1 className="text-2xl font-bold text-white mb-1 flex items-center">
                  <span className="mr-2">💰</span>
                  Payroll Management
                </h1>
                <p className="text-green-100 text-sm">
                  Manage employee salaries and payments
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
              <div className="text-sm text-gray-600 mb-1">Employees</div>
              <div className="text-2xl font-bold text-blue-600">
                {totalEmployees}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="text-sm text-gray-600 mb-1">
                Total Net Payroll
              </div>
              <div className="text-2xl font-bold text-green-600">
                KES {totalNetPayroll.toLocaleString()}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="text-sm text-gray-600 mb-1">Total Deductions</div>
              <div className="text-2xl font-bold text-red-600">
                KES {totalDeductions.toLocaleString()}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="text-sm text-gray-600 mb-1">Advances</div>
              <div className="text-2xl font-bold text-orange-600">
                KES {totalAdvances.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex bg-white rounded-lg shadow-md p-1 mb-4">
            <button
              onClick={() => setActiveTab("employees")}
              className={`flex-1 py-3 rounded-md font-semibold transition ${
                activeTab === "employees"
                  ? "bg-green-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              👥 Employees
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex-1 py-3 rounded-md font-semibold transition ${
                activeTab === "history"
                  ? "bg-green-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              📜 Payroll History
            </button>
          </div>

          {/* Search */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <input
              type="text"
              placeholder="🔍 Search by name or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
            />
          </div>

          {/* Content based on active tab */}
          {activeTab === "employees" ? (
            // Employees List
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Employees ({filteredEmployees.length})
              </h2>
              {filteredEmployees.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No employees found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredEmployees.map((emp) => (
                    <div
                      key={emp.id}
                      className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                              {emp.name.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-800">
                                {emp.name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                🏢 {emp.role}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="bg-white p-2 rounded">
                              <span className="text-gray-500">Base Salary</span>
                              <p className="font-semibold">
                                KES {emp.baseSalary.toLocaleString()}
                              </p>
                            </div>
                            <div className="bg-white p-2 rounded">
                              <span className="text-gray-500">Advances</span>
                              <p className="font-semibold text-orange-600">
                                KES {emp.advances.toLocaleString()}
                              </p>
                            </div>
                            <div className="bg-white p-2 rounded">
                              <span className="text-gray-500">
                                Other Deductions
                              </span>
                              <p className="font-semibold text-red-600">
                                KES {emp.otherDeductions.toLocaleString()}
                              </p>
                            </div>
                            <div className="bg-white p-2 rounded">
                              <span className="text-gray-500">Net Pay</span>
                              <p className="font-semibold text-green-600">
                                KES {emp.netPay.toLocaleString()}
                              </p>
                            </div>
                          </div>

                          <div className="mt-3 flex gap-2">
                            <button
                              onClick={() => handleSetSalary(emp)}
                              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-semibold transition"
                            >
                              ✏️ Set Salary
                            </button>
                            <button
                              onClick={() => handleNavigateToEmployee(emp.id)}
                              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-3 rounded-lg text-sm font-semibold transition"
                            >
                              👁️ Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // Payroll History (still mock)
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Payroll History ({filteredPayrolls.length})
                </h2>
                <select
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value)}
                  className="border-2 border-gray-300 rounded-lg px-3 py-1 text-sm focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
                >
                  <option value="">All Months</option>
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>

              {filteredPayrolls.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No payroll records found</p>
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
                        className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4 cursor-pointer hover:shadow-md"
                        onClick={() => handleViewDetails(payroll)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                                {payroll.employeeName.charAt(0)}
                              </div>
                              <div>
                                <h3 className="font-bold text-gray-800">
                                  {payroll.employeeName}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  🏢 {payroll.role}
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-gray-500">Net Pay</span>
                                <p className="font-bold text-gray-800">
                                  KES {payroll.netPay.toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <span className="text-gray-500">Month</span>
                                <p className="text-gray-800">
                                  📅 {payroll.month}
                                </p>
                              </div>
                            </div>

                            <div className="flex gap-2 mt-3">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${status?.color}`}
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
          )}
        </main>

        {/* Process Payroll Modal */}
        {showProcessPayroll && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6">
                <h2 className="text-2xl font-bold flex items-center">
                  <span className="mr-2">💸</span>
                  Process Payroll
                </h2>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  This will generate payroll for all active employees for the
                  current month.
                </p>
                <div className="bg-yellow-50 p-3 rounded-lg mb-4">
                  <p className="text-yellow-700 text-sm">
                    Total estimated net pay:{" "}
                    <strong>KES {totalNetPayroll.toLocaleString()}</strong>
                  </p>
                </div>
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

        {/* Payroll Details Modal (simplified) */}
        {showPayrollDetails && selectedPayroll && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
                <h2 className="text-2xl font-bold">Payroll Details</h2>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-2">
                  <span className="font-semibold">Employee:</span>{" "}
                  {selectedPayroll.employeeName}
                </p>
                <p className="text-gray-700 mb-2">
                  <span className="font-semibold">Month:</span>{" "}
                  {selectedPayroll.month}
                </p>
                <p className="text-gray-700 mb-2">
                  <span className="font-semibold">Net Pay:</span> KES{" "}
                  {selectedPayroll.netPay.toLocaleString()}
                </p>
                <p className="text-gray-700 mb-2">
                  <span className="font-semibold">Status:</span>{" "}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      statusOptions.find(
                        (s) => s.value === selectedPayroll.status,
                      )?.color
                    }`}
                  >
                    {selectedPayroll.status}
                  </span>
                </p>
                <button
                  onClick={() => setShowPayrollDetails(false)}
                  className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold"
                >
                  Close
                </button>
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

  // Desktop View (simplified – you can expand similarly)
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-gray-800 font-sans">
      <Navbar
        headerMessage={"ERP"}
        headerText={"Manage your operations with style and clarity"}
      />
      <ToastContainer />
      <main className="flex-grow p-6">
        <h1 className="text-3xl font-bold mb-6">Desktop View Coming Soon</h1>
      </main>
      <footer>
        <AdminsFooter />
      </footer>
    </div>
  )
}

export default PayRoll
