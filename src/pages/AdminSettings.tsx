import React, { useState, useEffect } from "react"
import { useMediaQuery, useTheme } from "@mui/material"
import {
  Users,
  UserPlus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Save,
  Shield,
  Settings as SettingsIcon,
} from "lucide-react"
import Navbar from "../components/ui/mobile/admin/Navbar"
import AdminsFooter from "../components/AdminsFooter"
import { ToastContainer } from "react-toastify"
import { KeyboardArrowUp } from "@mui/icons-material"
import RealTimeIndicator from "../components/sales/RealTimeIndicator"

// Employee interface
interface Employee {
  id: number
  name: string
  email: string
  phone: string
  role: string
  department: string
  status: "active" | "inactive" | "pending"
  permissions: string[]
  lastActive: string
}

// Simplified System Settings
interface SystemSetting {
  id: number
  name: string
  value: string | boolean | number
  type: "text" | "boolean" | "number"
  description: string
}

// Scroll to top button
const ScrollTop = () => {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const toggle = () => setVisible(window.scrollY > 300)
    window.addEventListener("scroll", toggle)
    return () => window.removeEventListener("scroll", toggle)
  }, [])
  if (!visible) return null
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-20 right-4 z-40 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
    >
      <KeyboardArrowUp size={20} />
    </button>
  )
}

const AdminSettings = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  // Tabs
  const [activeTab, setActiveTab] = useState<"employees" | "system">(
    "employees",
  )

  // Employees data (static mock)
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "+1234567890",
      role: "Sales Manager",
      department: "Sales",
      status: "active",
      permissions: ["view_sales", "edit_sales", "manage_customers"],
      lastActive: "2024-01-15 14:30",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+1234567891",
      role: "Delivery Supervisor",
      department: "Logistics",
      status: "active",
      permissions: ["view_deliveries", "manage_vehicles", "track_inventory"],
      lastActive: "2024-01-15 10:15",
    },
    {
      id: 3,
      name: "Bob Wilson",
      email: "bob@example.com",
      phone: "+1234567892",
      role: "Accountant",
      department: "Finance",
      status: "active",
      permissions: ["view_finance", "manage_invoices", "process_payments"],
      lastActive: "2024-01-14 16:45",
    },
    {
      id: 4,
      name: "Alice Johnson",
      email: "alice@example.com",
      phone: "+1234567893",
      role: "Inventory Clerk",
      department: "Warehouse",
      status: "inactive",
      permissions: ["view_inventory", "update_stock"],
      lastActive: "2024-01-10 09:20",
    },
  ])

  // System settings (only what we need)
  const [systemSettings, setSystemSettings] = useState<SystemSetting[]>([
    {
      id: 1,
      name: "Company Name",
      value: "Gas Refill Distributors Ltd",
      type: "text",
      description: "Your company name displayed throughout the system",
    },
    {
      id: 2,
      name: "Email Notifications",
      value: true,
      type: "boolean",
      description: "Send email notifications for important events",
    },
    {
      id: 3,
      name: "SMS Notifications",
      value: false,
      type: "boolean",
      description: "Send SMS notifications for urgent alerts",
    },
    {
      id: 4,
      name: "Low Stock Threshold",
      value: 10,
      type: "number",
      description: "Minimum cylinder quantity before low stock alert",
    },
  ])

  // Available permissions list (for employee permission editing)
  const availablePermissions = [
    { id: "view_dashboard", name: "View Dashboard", category: "General" },
    { id: "view_sales", name: "View Sales", category: "Sales" },
    { id: "edit_sales", name: "Edit Sales", category: "Sales" },
    { id: "manage_customers", name: "Manage Customers", category: "Sales" },
    { id: "view_inventory", name: "View Inventory", category: "Inventory" },
    { id: "update_stock", name: "Update Stock", category: "Inventory" },
    { id: "manage_suppliers", name: "Manage Suppliers", category: "Inventory" },
    { id: "view_finance", name: "View Finance", category: "Finance" },
    { id: "manage_invoices", name: "Manage Invoices", category: "Finance" },
    { id: "process_payments", name: "Process Payments", category: "Finance" },
    { id: "view_deliveries", name: "View Deliveries", category: "Logistics" },
    { id: "manage_vehicles", name: "Manage Vehicles", category: "Logistics" },
    { id: "track_inventory", name: "Track Inventory", category: "Logistics" },
    { id: "view_reports", name: "View Reports", category: "Reports" },
    { id: "generate_reports", name: "Generate Reports", category: "Reports" },
    { id: "manage_users", name: "Manage Users", category: "Admin" },
    { id: "system_settings", name: "System Settings", category: "Admin" },
    { id: "view_audit_logs", name: "View Audit Logs", category: "Admin" },
  ]

  // State for modals
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    department: "",
    permissions: [] as string[],
  })
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  )
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false)
  const [showEditPermissionsModal, setShowEditPermissionsModal] =
    useState(false)

  // Handlers
  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.email) return
    const employee: Employee = {
      id: employees.length + 1,
      name: newEmployee.name,
      email: newEmployee.email,
      phone: newEmployee.phone,
      role: newEmployee.role,
      department: newEmployee.department,
      status: "pending",
      permissions: newEmployee.permissions,
      lastActive: new Date().toISOString().split("T")[0] + " 00:00",
    }
    setEmployees([...employees, employee])
    setNewEmployee({
      name: "",
      email: "",
      phone: "",
      role: "",
      department: "",
      permissions: [],
    })
    setShowAddEmployeeModal(false)
  }

  const handleTogglePermission = (employeeId: number, permissionId: string) => {
    setEmployees(
      employees.map((emp) => {
        if (emp.id === employeeId) {
          if (emp.permissions.includes(permissionId)) {
            return {
              ...emp,
              permissions: emp.permissions.filter((p) => p !== permissionId),
            }
          } else {
            return { ...emp, permissions: [...emp.permissions, permissionId] }
          }
        }
        return emp
      }),
    )
  }

  const handleUpdateSetting = (
    id: number,
    value: string | boolean | number,
  ) => {
    setSystemSettings((settings) =>
      settings.map((setting) =>
        setting.id === id ? { ...setting, value } : setting,
      ),
    )
  }

  const getStatusColor = (status: Employee["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPermissionCountByCategory = (employee: Employee) => {
    const counts: Record<string, number> = {}
    employee.permissions.forEach((permId) => {
      const perm = availablePermissions.find((p) => p.id === permId)
      if (perm) {
        counts[perm.category] = (counts[perm.category] || 0) + 1
      }
    })
    return counts
  }

  // RealTimeIndicator state (restored)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [dataVersion, setDataVersion] = useState(0)

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0]">
      <ToastContainer />
      <div className="prevent-overflow">
        <RealTimeIndicator
          enabled={autoRefresh}
          lastUpdated={lastUpdated}
          dataVersion={dataVersion}
          onToggle={() => setAutoRefresh(!autoRefresh)}
        />
      </div>
      <Navbar
        headerMessage="Admin Settings"
        headerText="Manage employees and system configuration"
      />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Admin Settings
                </h1>
                <p className="text-gray-600 mt-2">
                  Manage employees, permissions, and basic system settings
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-gray-200 bg-white rounded-t-xl px-4">
              <button
                onClick={() => setActiveTab("employees")}
                className={`px-4 py-3 font-medium flex items-center gap-2 transition-colors ${
                  activeTab === "employees"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Users size={20} />
                Employees
              </button>
              <button
                onClick={() => setActiveTab("system")}
                className={`px-4 py-3 font-medium flex items-center gap-2 transition-colors ${
                  activeTab === "system"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <SettingsIcon size={20} />
                System Settings
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-b-xl shadow-lg p-6">
            {activeTab === "employees" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Employee Management
                  </h2>
                  <button
                    onClick={() => setShowAddEmployeeModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <UserPlus size={20} />
                    Add Employee
                  </button>
                </div>

                {/* Stats cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  <div className="bg-blue-50 p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <Users className="text-blue-600" size={24} />
                      <span className="text-2xl font-bold">
                        {employees.length}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900">
                      Total Employees
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Active and inactive staff
                    </p>
                  </div>
                  <div className="bg-green-50 p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <CheckCircle className="text-green-600" size={24} />
                      <span className="text-2xl font-bold">
                        {employees.filter((e) => e.status === "active").length}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900">
                      Active Employees
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Currently working
                    </p>
                  </div>
                  <div className="bg-purple-50 p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <Shield className="text-purple-600" size={24} />
                      <span className="text-2xl font-bold">
                        {availablePermissions.length}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900">
                      Available Permissions
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      System access levels
                    </p>
                  </div>
                </div>

                {/* Employees table */}
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Employee
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Permissions
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Active
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {employees.map((employee) => (
                        <tr key={employee.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-medium text-gray-900">
                                {employee.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {employee.email}
                              </div>
                              <div className="text-sm text-gray-500">
                                {employee.phone}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-medium">{employee.role}</div>
                              <div className="text-sm text-gray-500">
                                {employee.department}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                employee.status,
                              )}`}
                            >
                              {employee.status.charAt(0).toUpperCase() +
                                employee.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {getPermissionCountByCategory(employee)[
                                "Sales"
                              ] && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                  Sales:{" "}
                                  {
                                    getPermissionCountByCategory(employee)[
                                      "Sales"
                                    ]
                                  }
                                </span>
                              )}
                              {getPermissionCountByCategory(employee)[
                                "Inventory"
                              ] && (
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                                  Inventory:{" "}
                                  {
                                    getPermissionCountByCategory(employee)[
                                      "Inventory"
                                    ]
                                  }
                                </span>
                              )}
                              {getPermissionCountByCategory(employee)[
                                "Finance"
                              ] && (
                                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                                  Finance:{" "}
                                  {
                                    getPermissionCountByCategory(employee)[
                                      "Finance"
                                    ]
                                  }
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => {
                                setSelectedEmployee(employee)
                                setShowEditPermissionsModal(true)
                              }}
                              className="text-blue-600 text-sm mt-2 hover:text-blue-800"
                            >
                              Edit permissions
                            </button>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {employee.lastActive}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setSelectedEmployee(employee)
                                  setShowEditPermissionsModal(true)
                                }}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                title="Edit permissions"
                              >
                                <Shield size={18} />
                              </button>
                              <button
                                className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg"
                                title="Edit employee"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                title="Remove employee"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "system" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  System Configuration
                </h2>
                <div className="space-y-6">
                  {systemSettings.map((setting) => (
                    <div
                      key={setting.id}
                      className="border border-gray-200 rounded-lg p-6"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {setting.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {setting.description}
                          </p>
                        </div>
                        <div className="w-full md:w-auto">
                          {setting.type === "boolean" ? (
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() =>
                                  handleUpdateSetting(
                                    setting.id,
                                    !setting.value,
                                  )
                                }
                                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                                  setting.value ? "bg-blue-600" : "bg-gray-300"
                                }`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                    setting.value
                                      ? "translate-x-6"
                                      : "translate-x-1"
                                  }`}
                                />
                              </button>
                              <span className="text-sm font-medium">
                                {setting.value ? "Enabled" : "Disabled"}
                              </span>
                            </div>
                          ) : (
                            <input
                              type={setting.type}
                              value={setting.value as string | number}
                              onChange={(e) =>
                                handleUpdateSetting(
                                  setting.id,
                                  setting.type === "number"
                                    ? parseFloat(e.target.value)
                                    : e.target.value,
                                )
                              }
                              className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <AdminsFooter />
      <ScrollTop />

      {/* Add Employee Modal */}
      {showAddEmployeeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Add New Employee
                </h3>
                <button
                  onClick={() => setShowAddEmployeeModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XCircle className="text-gray-500" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={newEmployee.name}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={newEmployee.email}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, email: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                    placeholder="employee@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={newEmployee.phone}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, phone: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                    placeholder="+1234567890"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <select
                      value={newEmployee.role}
                      onChange={(e) =>
                        setNewEmployee({ ...newEmployee, role: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                    >
                      <option value="">Select role</option>
                      <option value="Sales Manager">Sales Manager</option>
                      <option value="Delivery Supervisor">
                        Delivery Supervisor
                      </option>
                      <option value="Accountant">Accountant</option>
                      <option value="Inventory Clerk">Inventory Clerk</option>
                      <option value="System Admin">System Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    <select
                      value={newEmployee.department}
                      onChange={(e) =>
                        setNewEmployee({
                          ...newEmployee,
                          department: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                    >
                      <option value="">Select department</option>
                      <option value="Sales">Sales</option>
                      <option value="Logistics">Logistics</option>
                      <option value="Finance">Finance</option>
                      <option value="Warehouse">Warehouse</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-end gap-3">
                <button
                  onClick={() => setShowAddEmployeeModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddEmployee}
                  disabled={!newEmployee.name || !newEmployee.email}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <UserPlus size={18} />
                  Add Employee
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Permissions Modal */}
      {showEditPermissionsModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Edit Permissions
                  </h3>
                  <p className="text-gray-600 mt-1">
                    Configure access for {selectedEmployee.name}
                  </p>
                </div>
                <button
                  onClick={() => setShowEditPermissionsModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XCircle className="text-gray-500" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto pr-2">
                {Object.entries(
                  availablePermissions.reduce((acc, perm) => {
                    if (!acc[perm.category]) acc[perm.category] = []
                    acc[perm.category].push(perm)
                    return acc
                  }, {} as Record<string, typeof availablePermissions>),
                ).map(([category, perms]) => (
                  <div
                    key={category}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <h4 className="font-semibold text-gray-900 mb-3">
                      {category}
                    </h4>
                    <div className="space-y-2">
                      {perms.map((perm) => (
                        <label
                          key={perm.id}
                          className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                        >
                          <div>
                            <div className="font-medium">{perm.name}</div>
                            <div className="text-sm text-gray-500">
                              {perm.id}
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={selectedEmployee.permissions.includes(
                              perm.id,
                            )}
                            onChange={() =>
                              handleTogglePermission(
                                selectedEmployee.id,
                                perm.id,
                              )
                            }
                            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex justify-between items-center pt-6 border-t border-gray-200">
                <div>
                  <span className="text-gray-600">
                    {selectedEmployee.permissions.length} permissions granted
                  </span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowEditPermissionsModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setShowEditPermissionsModal(false)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Save size={18} />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminSettings
