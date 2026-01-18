// @ts-nocheck
import React, { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { Link, useNavigate } from "react-router-dom"
import AdminsFooter from "../../components/AdminsFooter"
import planStatus from "../../features/planStatus/planStatus"
import Navbar from "../../components/ui/mobile/admin/Navbar"
import { toast, ToastContainer } from "react-toastify"
import {
  fetchEmployees,
  selectAllEmployees,
} from "../../features/employees/employeesSlice"
import defaultProfile from "../../components/media/default.png"
import { WhatsappShareButton, WhatsappIcon } from "react-share"

// Role options with icons (same as Recruitment)
const ROLE_OPTIONS = [
  { value: "SHOP_ATTENDANT", label: "Shop Attendant", icon: "🏪" },
  { value: "DELIVERY_GUY", label: "Delivery Person", icon: "🚚" },
  { value: "STORE_MAN", label: "Store Manager", icon: "📦" },
  { value: "SECURITY", label: "Security", icon: "🛡️" },
  { value: "TRUCK_DRIVER", label: "Truck Driver", icon: "🚛" },
  { value: "CONDUCTOR", label: "Conductor", icon: "🎫" },
  { value: "SALES_PERSON", label: "Sales Person", icon: "💼" },
]

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
  const [searchQuery, setSearchQuery] = useState("")
  const [filterRole, setFilterRole] = useState("")
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [showEmployeeModal, setShowEmployeeModal] = useState(false)

  useEffect(() => {
    if (businessId) {
      dispatch(fetchEmployees({ businessId }))
    }
  }, [dispatch, businessId])

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

    return matchesSearch && matchesRole
  })

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee)
    setShowEmployeeModal(true)
  }

  const inviteLink = `/register?ref=${encodeURIComponent(
    btoa(JSON.stringify({ id: businessId, name: businessName })),
  )}`

  const copyToClipboard = () => {
    const url = window.location.origin + inviteLink
    navigator.clipboard.writeText(url)
    toast.success("Link copied to clipboard!")
  }

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
                View, manage, and organize your workforce
              </p>
            </div>
            <Link
              to="/hr/recruitment"
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition shadow-md inline-block"
            >
              + Add New Employee
            </Link>
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
            <div className="text-sm text-gray-600 mb-1">Limit</div>
            <div className="text-2xl font-bold text-purple-600">
              {employeeLimit}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-sm text-gray-600 mb-1">Plan</div>
            <div className="text-xl font-bold text-green-600">{planName}</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-sm text-gray-600 mb-1">Available</div>
            <div className="text-2xl font-bold text-green-600">
              {employeeLimit - allEmployees.length}
            </div>
          </div>
        </div>

        {/* Invite Section */}
        {allEmployees.length < employeeLimit && (
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-lg p-4 mb-4">
            <h2 className="text-lg font-bold mb-2 flex items-center">
              <span className="mr-2">📨</span>
              Invite Employees
            </h2>
            <p className="text-green-100 text-sm mb-3">
              Share this link to invite employees to join your business
            </p>

            <div className="space-y-3">
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <p className="text-sm font-medium mb-1">Invitation Link:</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={window.location.origin + inviteLink}
                    readOnly
                    className="flex-1 bg-white bg-opacity-30 text-white px-3 py-2 rounded text-sm font-mono"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="bg-white text-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-green-50 transition text-sm"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const url = window.location.origin + inviteLink
                    if (navigator.share) {
                      navigator.share({
                        title: "Join My Business",
                        text: "Register as an employee for our business",
                        url: url,
                      })
                    } else {
                      copyToClipboard()
                    }
                  }}
                  className="bg-white text-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-green-50 transition text-sm flex-1"
                >
                  Share
                </button>

                <WhatsappShareButton
                  url={window.location.origin + inviteLink}
                  title="Register here:"
                  className="flex-1"
                >
                  <button className="w-full bg-white text-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-green-50 transition text-sm flex items-center justify-center gap-2">
                    <span>WhatsApp</span>
                    <span>📱</span>
                  </button>
                </WhatsappShareButton>
              </div>
            </div>
          </div>
        )}

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
            <span className="text-sm text-gray-500">
              {allEmployees.length}/{employeeLimit} used
            </span>
          </div>

          {filteredEmployees.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 opacity-30">👥</div>
              <p className="text-gray-500 text-lg mb-2">
                {searchQuery || filterRole
                  ? "No employees found"
                  : "No employees yet"}
              </p>
              <p className="text-gray-400 text-sm mb-4">
                {searchQuery || filterRole
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
                return (
                  <div
                    key={employee.id}
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                    onClick={() => handleViewEmployee(employee)}
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
                        </div>

                        <div className="flex-1">
                          <h3 className="font-bold text-gray-800 text-lg">
                            {employee.first_name} {employee.last_name}
                          </h3>
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
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/admins/employees/${employee.id}`)
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-semibold transition"
                      >
                        Manage
                      </button>
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
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
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
                </div>
                <div>
                  <h2 className="text-2xl font-bold">
                    {selectedEmployee.first_name} {selectedEmployee.last_name}
                  </h2>
                  <p className="text-blue-100">
                    {getRoleInfo(selectedEmployee.role).icon}{" "}
                    {getRoleInfo(selectedEmployee.role).label}
                  </p>
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
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    navigate(`/admins/employees/${selectedEmployee.id}`)
                  }
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition"
                >
                  Manage Employee
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

      <footer className="fixed bottom-0 left-0 right-0">
        <AdminsFooter />
      </footer>
    </div>
  )
}

export default Employee
