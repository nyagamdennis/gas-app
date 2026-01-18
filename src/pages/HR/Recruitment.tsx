// @ts-nocheck
import React, { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { useNavigate } from "react-router-dom"
import Navbar from "../../components/ui/mobile/admin/Navbar"
import AdminsFooter from "../../components/AdminsFooter"
import { useMediaQuery, useTheme } from "@mui/material"
import planStatus from "../../features/planStatus/planStatus"
import {
  fetchEmployees,
  addEmployee,
  selectAllEmployees,
  getEmployeesStatus,
  selectAddEmployeeStatus,
  selectAddEmployeeError,
  clearAddEmployeeStatus,
} from "../../features/employees/employeesSlice"
import { CircularProgress } from "@mui/material"

// Role options
const ROLE_OPTIONS = [
  { value: "SHOP_ATTENDANT", label: "Shop Attendant", icon: "🏪" },
  { value: "DELIVERY_GUY", label: "Delivery Person", icon: "🚚" },
  { value: "STORE_MAN", label: "Store Manager", icon: "📦" },
  { value: "SECURITY", label: "Security", icon: "🛡️" },
  { value: "TRUCK_DRIVER", label: "Truck Driver", icon: "🚛" },
  { value: "CONDUCTOR", label: "Conductor", icon: "🎫" },
  { value: "SALES_PERSON", label: "Sales Person", icon: "💼" },
]

// Gender options
const GENDER_OPTIONS = [
  { value: "MALE", label: "Male", icon: "👨" },
  { value: "FEMALE", label: "Female", icon: "👩" },
  { value: "OTHER", label: "Other", icon: "👤" },
]

const Recruitment = () => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const { businessId } = planStatus()

  // Redux state
  const employees = useAppSelector(selectAllEmployees)
  const employeesStatus = useAppSelector(getEmployeesStatus)
  const addEmployeeStatus = useAppSelector(selectAddEmployeeStatus)
  const addEmployeeError = useAppSelector(selectAddEmployeeError)

  // Local state
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    gender: "MALE",
    id_number: "",
    email: "",
    phone_number: "",
    role: "SHOP_ATTENDANT",
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [showEmployeeModal, setShowEmployeeModal] = useState(false)

  // Fetch employees on component mount
  useEffect(() => {
    if (businessId) {
      dispatch(fetchEmployees({ businessId }))
    }
  }, [dispatch, businessId])

  // Clear add employee status when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearAddEmployeeStatus())
    }
  }, [dispatch])

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!businessId) {
      alert("Business ID is required")
      return
    }

    try {
      await dispatch(addEmployee(formData)).unwrap()

      // Reset form
      setFormData({
        first_name: "",
        last_name: "",
        gender: "MALE",
        id_number: "",
        email: "",
        phone_number: "",
        role: "SHOP_ATTENDANT",
      })

      setShowAddForm(false)
      dispatch(fetchEmployees({ businessId }))
    } catch (error) {
      console.error("Failed to add employee:", error)
    }
  }

  // Filter employees based on search and filter
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      searchTerm === "" ||
      employee.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.phone_number.includes(searchTerm) ||
      employee.id_number.includes(searchTerm)

    const matchesRole = filterRole === "" || employee.role === filterRole

    return matchesSearch && matchesRole
  })

  // Get role label and icon
  const getRoleInfo = (role) => {
    const roleOption = ROLE_OPTIONS.find((r) => r.value === role)
    return roleOption || { label: role, icon: "👤" }
  }

  // Get gender icon
  const getGenderIcon = (gender) => {
    const genderOption = GENDER_OPTIONS.find((g) => g.value === gender)
    return genderOption?.icon || "👤"
  }

  // View employee details
  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee)
    setShowEmployeeModal(true)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-gray-800 font-sans">
      <Navbar
        headerMessage={"ERP"}
        headerText={"Manage your operations with style and clarity"}
      />

      <main className="flex-grow m-2 p-1 mb-20">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg shadow-lg mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1 flex items-center">
                <span className="mr-2">👥</span>
                Recruitment
              </h1>
              <p className="text-purple-100 text-sm">
                Add and manage employees
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 transition shadow-md"
            >
              {showAddForm ? "− Cancel" : "+ Add Employee"}
            </button>
          </div>
        </div>

        {/* Success/Error Messages */}
        {addEmployeeStatus === "succeeded" && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4 rounded-lg">
            <p className="text-green-700 font-medium">
              ✓ Employee added successfully!
            </p>
          </div>
        )}

        {addEmployeeStatus === "failed" && addEmployeeError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-lg">
            <p className="text-red-700 font-medium">✗ {addEmployeeError}</p>
          </div>
        )}

        {/* Add Employee Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">➕</span>
              New Employee
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    required
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
                    placeholder="John"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    required
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                  className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
                >
                  {GENDER_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.icon} {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ID Number
                </label>
                <input
                  type="text"
                  name="id_number"
                  value={formData.id_number}
                  onChange={handleInputChange}
                  required
                  className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
                  placeholder="12345678"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
                  placeholder="john.doe@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  required
                  className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
                  placeholder="+254712345678"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                  className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
                >
                  {ROLE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.icon} {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={addEmployeeStatus === "loading"}
                className={`w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 rounded-lg font-semibold ${
                  addEmployeeStatus === "loading"
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:from-purple-600 hover:to-purple-700 active:scale-95"
                } transition-all duration-200 shadow-md`}
              >
                {addEmployeeStatus === "loading" ? (
                  <span className="flex items-center justify-center">
                    <CircularProgress
                      size={20}
                      className="mr-2"
                      style={{ color: "white" }}
                    />
                    Adding Employee...
                  </span>
                ) : (
                  "Add Employee"
                )}
              </button>
            </form>
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="space-y-3">
            <div>
              <input
                type="text"
                placeholder="🔍 Search by name, email, phone, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
              />
            </div>

            <div>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
              >
                <option value="">All Roles</option>
                {ROLE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.icon} {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Employees List */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Employees ({filteredEmployees.length})
          </h2>

          {employeesStatus === "loading" ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mb-4"></div>
              <p className="text-gray-600 font-medium">Loading employees...</p>
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 opacity-30">👥</div>
              <p className="text-gray-500 text-lg mb-2">
                {searchTerm || filterRole
                  ? "No employees found"
                  : "No employees yet"}
              </p>
              <p className="text-gray-400 text-sm">
                {searchTerm || filterRole
                  ? "Try adjusting your search or filters"
                  : "Add your first employee to get started"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredEmployees.map((employee) => {
                const roleInfo = getRoleInfo(employee.role)
                return (
                  <div
                    key={employee.id}
                    className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                    onClick={() => handleViewEmployee(employee)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                            {employee.first_name.charAt(0)}
                            {employee.last_name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-800">
                              {employee.first_name} {employee.last_name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {roleInfo.icon} {roleInfo.label}
                            </p>
                          </div>
                        </div>

                        <div className="text-sm text-gray-600 space-y-1">
                          <p>📧 {employee.email}</p>
                          <p>📞 {employee.phone_number}</p>
                          <p>🆔 {employee.id_number}</p>
                        </div>

                        <div className="flex gap-2 mt-2">
                          <span className="bg-white px-3 py-1 rounded-full text-xs font-medium text-gray-700 border border-gray-300">
                            {getGenderIcon(employee.gender)} {employee.gender}
                          </span>
                          {employee.status && (
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                employee.status === "ACTIVE"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {employee.status === "ACTIVE"
                                ? "✓ Active"
                                : "✗ Inactive"}
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

      {/* Employee Details Modal */}
      {showEmployeeModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white bg-opacity-30 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {selectedEmployee.first_name.charAt(0)}
                  {selectedEmployee.last_name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">
                    {selectedEmployee.first_name} {selectedEmployee.last_name}
                  </h2>
                  <p className="text-purple-100">
                    {getRoleInfo(selectedEmployee.role).icon}{" "}
                    {getRoleInfo(selectedEmployee.role).label}
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">ID Number</p>
                  <p className="font-semibold text-gray-800">
                    {selectedEmployee.id_number}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Gender</p>
                  <p className="font-semibold text-gray-800">
                    {getGenderIcon(selectedEmployee.gender)}{" "}
                    {selectedEmployee.gender}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Email</p>
                  <p className="font-semibold text-gray-800">
                    {selectedEmployee.email}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Phone</p>
                  <p className="font-semibold text-gray-800">
                    {selectedEmployee.phone_number}
                  </p>
                </div>

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
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <button
                onClick={() => setShowEmployeeModal(false)}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg font-semibold transition"
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

export default Recruitment
