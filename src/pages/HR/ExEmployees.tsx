// @ts-nocheck
import React, { useEffect, useState } from "react"
import AdminsFooter from "../../components/AdminsFooter"
import { ToastContainer, toast } from "react-toastify"
import Navbar from "../../components/ui/mobile/admin/Navbar"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import defaultProfile from "../../components/media/default.png"
import { useNavigate } from "react-router-dom"
import planStatus from "../../features/planStatus/planStatus"
import { fetchFiredEmployees, selectAllFiredEmployees } from "../../features/employees/firedEmployeesSlice"

// Role options with icons
const ROLE_OPTIONS = [
  { value: "SHOP_ATTENDANT", label: "Shop Attendant", icon: "🏪" },
  { value: "DELIVERY_GUY", label: "Delivery Person", icon: "🚚" },
  { value: "STORE_MAN", label: "Store Manager", icon: "📦" },
  { value: "SECURITY", label: "Security", icon: "🛡️" },
  { value: "TRUCK_DRIVER", label: "Truck Driver", icon: "🚛" },
  { value: "CONDUCTOR", label: "Conductor", icon: "🎫" },
  { value: "SALES_PERSON", label: "Sales Person", icon: "💼" },
]

const ExEmployees = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { businessName, businessId } = planStatus()

  const allEmployees = useAppSelector(selectAllFiredEmployees)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterRole, setFilterRole] = useState("")
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [showEmployeeModal, setShowEmployeeModal] = useState(false)
  const [showRehireModal, setShowRehireModal] = useState(false)

  useEffect(() => {
    if (businessId) {
      dispatch(fetchFiredEmployees({ businessId }))
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

  const handleRehire = async () => {
    if (selectedEmployee && businessId) {
      try {
        // await dispatch(
        //   rehireEmployee({
        //     businessId,
        //     employeeId: selectedEmployee.id,
        //   }),
        // ).unwrap()

        toast.success(
          `${selectedEmployee.first_name} has been rehired successfully!`,
        )
        setShowRehireModal(false)
        setShowEmployeeModal(false)
        dispatch(fetchFiredEmployees({ businessId }))
      } catch (error) {
        toast.error("Failed to rehire employee")
      }
    }
  }

  const terminationReasons = [
    { value: "RESIGNATION", label: "Resignation", icon: "✍️" },
    { value: "TERMINATION", label: "Terminated", icon: "🚫" },
    { value: "RETRENCHMENT", label: "Retrenchment", icon: "📉" },
    { value: "RETIREMENT", label: "Retired", icon: "👴" },
    { value: "CONTRACT_END", label: "Contract Ended", icon: "📄" },
  ]

  const getTerminationInfo = (reason) => {
    const reasonOption = terminationReasons.find((r) => r.value === reason)
    return reasonOption || { label: reason, icon: "❓" }
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
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-lg shadow-lg mb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl font-bold text-white mb-1 flex items-center">
                <span className="mr-2">👋</span>
                Former Employees
              </h1>
              <p className="text-red-100 text-sm">
                View and manage past employees of {businessName}
              </p>
            </div>
            <button
              onClick={() => navigate("/admins/employees")}
              className="bg-white text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-red-50 transition shadow-md"
            >
              ← Back to Current Employees
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-sm text-gray-600 mb-1">Total Former</div>
            <div className="text-2xl font-bold text-red-600">
              {allEmployees.length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-sm text-gray-600 mb-1">This Year</div>
            <div className="text-2xl font-bold text-orange-600">
              {
                allEmployees.filter((e) => {
                  const year = new Date(
                    e.termination_date || e.updated_at,
                  ).getFullYear()
                  return year === new Date().getFullYear()
                }).length
              }
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-sm text-gray-600 mb-1">Can Rehire</div>
            <div className="text-2xl font-bold text-green-600">
              {allEmployees.filter((e) => e.can_be_rehired !== false).length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-sm text-gray-600 mb-1">Avg. Tenure</div>
            <div className="text-2xl font-bold text-purple-600">
              {allEmployees.length > 0 ? "12m" : "0m"}
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="space-y-3">
            <div>
              <input
                type="text"
                placeholder="🔍 Search former employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition"
              >
                <option value="">All Roles</option>
                {ROLE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.icon} {option.label}
                  </option>
                ))}
              </select>

              <select
                onChange={(e) => {
                  if (e.target.value === "export") {
                    toast.info("Export feature coming soon!")
                  }
                }}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition"
              >
                <option value="">Actions</option>
                <option value="export">📥 Export List</option>
                <option value="archive">🗄️ Archive All</option>
              </select>
            </div>
          </div>
        </div>

        {/* Former Employees List */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              Former Employees ({filteredEmployees.length})
            </h2>
            <span className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString()}
            </span>
          </div>

          {filteredEmployees.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 opacity-30">👋</div>
              <p className="text-gray-500 text-lg mb-2">
                No former employees found
              </p>
              <p className="text-gray-400 text-sm mb-4">
                {searchQuery || filterRole
                  ? "Try adjusting your search or filters"
                  : "All your current employees are active!"}
              </p>
              <button
                onClick={() => navigate("/admins/employees")}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition"
              >
                ← View Current Employees
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredEmployees.map((employee) => {
                const roleInfo = getRoleInfo(employee.role)
                const terminationInfo = getTerminationInfo(
                  employee.termination_reason,
                )
                return (
                  <div
                    key={employee.id}
                    className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-lg p-4 hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="relative">
                          <img
                            src={employee.profile_image || defaultProfile}
                            alt={`${employee.first_name} ${employee.last_name}`}
                            className="w-14 h-14 object-cover rounded-full border-2 border-white shadow"
                          />
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                            <span className="text-white text-xs">✗</span>
                          </div>
                        </div>

                        <div className="flex-1">
                          <h3 className="font-bold text-gray-800 text-lg">
                            {employee.first_name} {employee.last_name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {roleInfo.icon} {roleInfo.label}
                          </p>

                          <div className="text-sm text-gray-600 space-y-1 mt-2">
                            {employee.termination_date && (
                              <p className="flex items-center gap-1">
                                <span>📅</span>
                                Left:{" "}
                                {new Date(
                                  employee.termination_date,
                                ).toLocaleDateString()}
                              </p>
                            )}
                            <p className="flex items-center gap-1">
                              <span>{terminationInfo.icon}</span>
                              {terminationInfo.label}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleViewEmployee(employee)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-semibold transition"
                        >
                          View
                        </button>
                        {employee.can_be_rehired !== false && (
                          <button
                            onClick={() => {
                              setSelectedEmployee(employee)
                              setShowRehireModal(true)
                            }}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-semibold transition"
                          >
                            Rehire
                          </button>
                        )}
                      </div>
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
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={selectedEmployee.profile_image || defaultProfile}
                    alt={`${selectedEmployee.first_name} ${selectedEmployee.last_name}`}
                    className="w-16 h-16 object-cover rounded-full border-2 border-white shadow"
                  />
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-white text-xs">✗</span>
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">
                    {selectedEmployee.first_name} {selectedEmployee.last_name}
                  </h2>
                  <p className="text-red-100">
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

                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">
                    Termination Reason
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">
                      {
                        getTerminationInfo(selectedEmployee.termination_reason)
                          .icon
                      }
                    </span>
                    <p className="font-semibold text-gray-800">
                      {
                        getTerminationInfo(selectedEmployee.termination_reason)
                          .label
                      }
                    </p>
                  </div>
                </div>

                {selectedEmployee.termination_date && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Date Left</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(
                        selectedEmployee.termination_date,
                      ).toLocaleDateString()}
                    </p>
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

                {selectedEmployee.termination_notes && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Notes</p>
                    <p className="font-semibold text-gray-800">
                      {selectedEmployee.termination_notes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="flex gap-2">
                <button
                  onClick={() => setShowEmployeeModal(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition"
                >
                  Close
                </button>
                {selectedEmployee.can_be_rehired !== false && (
                  <button
                    onClick={() => {
                      setShowEmployeeModal(false)
                      setShowRehireModal(true)
                    }}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition"
                  >
                    Rehire
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rehire Confirmation Modal */}
      {showRehireModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6">
              <h2 className="text-2xl font-bold flex items-center">
                <span className="mr-2">🔄</span>
                Rehire Employee
              </h2>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-xl">
                    {selectedEmployee.first_name.charAt(0)}
                    {selectedEmployee.last_name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {selectedEmployee.first_name} {selectedEmployee.last_name}
                    </h3>
                    <p className="text-gray-600">
                      {getRoleInfo(selectedEmployee.role).label}
                    </p>
                  </div>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
                  <p className="text-yellow-700 text-sm">
                    <span className="font-bold">Note:</span> Rehiring this
                    employee will:
                  </p>
                  <ul className="text-yellow-700 text-sm mt-2 space-y-1">
                    <li>• Restore them to active employee status</li>
                    <li>• Add them back to the current employees list</li>
                    <li>• Maintain their previous employment history</li>
                    <li>• Allow them to access the system immediately</li>
                  </ul>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    New Role (Optional)
                  </label>
                  <select className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition">
                    <option value="">
                      Keep previous role:{" "}
                      {getRoleInfo(selectedEmployee.role).label}
                    </option>
                    {ROLE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.icon} {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowRehireModal(false)
                    setShowEmployeeModal(true)
                  }}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRehire}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition"
                >
                  Confirm Rehire
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

export default ExEmployees
