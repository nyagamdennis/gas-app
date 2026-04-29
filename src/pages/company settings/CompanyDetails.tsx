// @ts-nocheck
import React, { useEffect, useState, useRef } from "react"
import { useMediaQuery, useTheme } from "@mui/material"
import { useAppSelector } from "../../app/hooks"
import { Alert, Snackbar, Skeleton } from "@mui/material"
import Navbar from "../../components/ui/mobile/admin/Navbar"
import AdminsFooter from "../../components/AdminsFooter"
import api from "../../../utils/api"
import RealTimeIndicator from "../../components/sales/RealTimeIndicator"
import {
  Business,
  CameraAlt,
  Email,
  Inventory,
  KeyboardArrowUp,
  LocationOn,
  Notifications,
} from "@mui/icons-material"
import {
  CheckCircle,
  Phone,
  Save,
  Shield,
  Trash2,
  UserPlus,
  Users,
  XCircle,
} from "lucide-react"

// Employee interface
interface Employee {
  id: number
  name: string
  email: string
  phone: string
  role: string // Role name (e.g. "Sales Manager")
  department: string
  status: "active" | "inactive" | "pending"
  permissions: string[]
  lastActive: string
}

// Role definition
interface Role {
  id: string
  name: string
  description: string
  defaultPermissions: string[] // Permission IDs
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
      <KeyboardArrowUp />
    </button>
  )
}

const CompanyDetails = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const { businessId } = useAppSelector((state) => state.planStatus)

  const fileInputRef = useRef(null)

  // Tab state
  const [activeTab, setActiveTab] = useState<"company" | "employees">("company")

  // --- Company details state ---
  const [companyName, setCompanyName] = useState("")
  const [logo, setLogo] = useState("")
  const [location, setLocation] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [logoFile, setLogoFile] = useState(null)
  const [logoPreview, setLogoPreview] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0)

  // --- Notification settings state ---
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [lowStockThreshold, setLowStockThreshold] = useState(10)

  // --- Loading & error states ---
  const [loadingInitial, setLoadingInitial] = useState(false)
  const [error, setError] = useState(null)
  const [submittingCompany, setSubmittingCompany] = useState(false)
  const [submittingNotifications, setSubmittingNotifications] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  // RealTimeIndicator state
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [dataVersion, setDataVersion] = useState(0)

  // --- Role definitions ---
  const roles: Role[] = [
    {
      id: "admin",
      name: "System Administrator",
      description: "Full system access and configuration",
      defaultPermissions: [
        "view_dashboard",
        "view_sales",
        "edit_sales",
        "manage_customers",
        "view_inventory",
        "update_stock",
        "manage_suppliers",
        "view_finance",
        "manage_invoices",
        "process_payments",
        "view_deliveries",
        "manage_vehicles",
        "track_inventory",
        "view_reports",
        "generate_reports",
        "manage_users",
        "system_settings",
        "view_audit_logs",
      ],
    },
    {
      id: "sales_manager",
      name: "Sales Manager",
      description: "Full access to sales and customer management",
      defaultPermissions: [
        "view_sales",
        "edit_sales",
        "manage_customers",
        "view_inventory",
        "view_deliveries",
        "view_reports",
        "generate_reports",
      ],
    },
    {
      id: "delivery_supervisor",
      name: "Delivery Supervisor",
      description: "Manage deliveries and vehicle tracking",
      defaultPermissions: [
        "view_deliveries",
        "manage_vehicles",
        "track_inventory",
        "view_inventory",
      ],
    },
    {
      id: "inventory_clerk",
      name: "Inventory Clerk",
      description: "Stock management and updates",
      defaultPermissions: [
        "view_inventory",
        "update_stock",
        "manage_suppliers",
        "view_reports",
      ],
    },
    {
      id: "accountant",
      name: "Accountant",
      description: "Financial operations and reporting",
      defaultPermissions: [
        "view_finance",
        "manage_invoices",
        "process_payments",
        "view_reports",
        "generate_reports",
      ],
    },
  ]

  // --- Employee management state ---
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

  const [availablePermissions] = useState([
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
  ])

  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    roleId: "", // Store role ID instead of role name
    department: "",
    permissions: [] as string[],
  })
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  )
  const [selectedEmployeeRoleId, setSelectedEmployeeRoleId] = useState("")
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false)
  const [showEditPermissionsModal, setShowEditPermissionsModal] =
    useState(false)
  const [showRoleTemplates, setShowRoleTemplates] = useState(false)

  // Helper: Get role object by ID
  const getRoleById = (roleId: string) => roles.find((r) => r.id === roleId)

  // Helper: Get role object by name (for existing employees)
  const getRoleByName = (roleName: string) =>
    roles.find((r) => r.name === roleName)

  // Apply role default permissions
  const applyRolePermissions = (roleId: string): string[] => {
    const role = getRoleById(roleId)
    return role ? [...role.defaultPermissions] : []
  }

  // --- Employee helpers ---
  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.email || !newEmployee.roleId) return
    const role = getRoleById(newEmployee.roleId)
    const employee: Employee = {
      id: employees.length + 1,
      name: newEmployee.name,
      email: newEmployee.email,
      phone: newEmployee.phone,
      role: role?.name || "",
      department: newEmployee.department,
      status: "pending",
      permissions: newEmployee.permissions.length
        ? newEmployee.permissions
        : applyRolePermissions(newEmployee.roleId),
      lastActive: new Date().toISOString().split("T")[0] + " 00:00",
    }
    setEmployees([...employees, employee])
    setNewEmployee({
      name: "",
      email: "",
      phone: "",
      roleId: "",
      department: "",
      permissions: [],
    })
    setShowAddEmployeeModal(false)
    setSnackbar({ open: true, message: "Employee added", severity: "success" })
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

  const handleDeleteEmployee = (id: number) => {
    if (window.confirm("Are you sure you want to remove this employee?")) {
      setEmployees(employees.filter((e) => e.id !== id))
      setSnackbar({ open: true, message: "Employee removed", severity: "info" })
    }
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

  const handleApplyRoleToEmployee = (employeeId: number, roleId: string) => {
    const role = getRoleById(roleId)
    if (!role) return
    setEmployees(
      employees.map((emp) =>
        emp.id === employeeId
          ? {
              ...emp,
              role: role.name,
              permissions: [...role.defaultPermissions],
            }
          : emp,
      ),
    )
    setSnackbar({
      open: true,
      message: `Role "${role.name}" applied to employee`,
      severity: "success",
    })
  }

  // --- Fetch company data ---
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      if (!businessId) return
      setLoadingInitial(true)
      setError(null)
      try {
        const response = await api.get(`company/details/${businessId}/`)
        const data = response.data
        setCompanyName(data.name || "")
        setLogo(data.logo || "")
        setLocation(data.location || "")
        setEmail(data.email || "")
        setPhone(data.phone || "")
        setLogoPreview(data.logo || "")
        setEmailNotifications(data.email_notifications ?? true)
        setSmsNotifications(data.sms_notifications ?? false)
        setLowStockThreshold(data.low_stock_threshold ?? 10)
        setLastUpdated(new Date().toLocaleTimeString())
      } catch (err) {
        console.error("Failed to fetch company details:", err)
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load company details",
        )
      } finally {
        setLoadingInitial(false)
      }
    }
    fetchCompanyDetails()
  }, [businessId])

  // --- Logo handling ---
  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      setSnackbar({
        open: true,
        message: "Please select an image file",
        severity: "warning",
      })
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setSnackbar({
        open: true,
        message: "Image size must be less than 2MB",
        severity: "warning",
      })
      return
    }
    setLogoFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setLogoPreview(reader.result)
    reader.readAsDataURL(file)
  }

  const handleClearLogo = () => {
    setLogoFile(null)
    setLogoPreview(logo || "")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  // --- Submit handlers ---
  const handleSubmitCompany = async (e) => {
    e.preventDefault()
    setSubmittingCompany(true)
    setSnackbar({ ...snackbar, open: false })
    setUploadProgress(0)

    try {
      const payload = { name: companyName, location, email, phone }
      let response
      if (logoFile) {
        const formData = new FormData()
        Object.keys(payload).forEach((key) =>
          formData.append(key, payload[key]),
        )
        formData.append("logo", logoFile)
        response = await api.post(`/company/create/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            )
            setUploadProgress(percent)
          },
        })
      } else {
        if (logo) payload.logo = logo
        response = await api.post(`/company/create/`, payload)
      }
      const updated = response.data
      setCompanyName(updated.name || "")
      setLogo(updated.logo || "")
      setLocation(updated.location || "")
      setEmail(updated.email || "")
      setPhone(updated.phone || "")
      setLogoPreview(updated.logo || "")
      setLogoFile(null)
      setLastUpdated(new Date().toLocaleTimeString())
      setDataVersion((prev) => prev + 1)
      setSnackbar({
        open: true,
        message: "Company information updated successfully",
        severity: "success",
      })
    } catch (err) {
      console.error("Failed to update company info:", err)
      setSnackbar({
        open: true,
        message: err.response?.data?.message || err.message || "Update failed",
        severity: "error",
      })
    } finally {
      setSubmittingCompany(false)
      setUploadProgress(0)
    }
  }

  const handleSubmitNotifications = async (e) => {
    e.preventDefault()
    setSubmittingNotifications(true)
    setSnackbar({ ...snackbar, open: false })

    try {
      const payload = {
        email_notifications: emailNotifications,
        sms_notifications: smsNotifications,
        low_stock_threshold: lowStockThreshold,
      }
      const response = await api.post(`/company/create/`, payload)
      const updated = response.data
      setEmailNotifications(updated.email_notifications ?? emailNotifications)
      setSmsNotifications(updated.sms_notifications ?? smsNotifications)
      setLowStockThreshold(updated.low_stock_threshold ?? lowStockThreshold)
      setLastUpdated(new Date().toLocaleTimeString())
      setDataVersion((prev) => prev + 1)
      setSnackbar({
        open: true,
        message: "Notification settings updated successfully",
        severity: "success",
      })
    } catch (err) {
      console.error("Failed to update notification settings:", err)
      setSnackbar({
        open: true,
        message: err.response?.data?.message || err.message || "Update failed",
        severity: "error",
      })
    } finally {
      setSubmittingNotifications(false)
    }
  }

  // --- Render functions ---
  const renderEmployeesTab = () => (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h2 className="text-2xl font-bold text-gray-900">
          Employee Management
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowRoleTemplates(!showRoleTemplates)}
            className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
          >
            <Shield size={18} /> Role Templates
          </button>
          <button
            onClick={() => setShowAddEmployeeModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <UserPlus size={18} /> Add Employee
          </button>
        </div>
      </div>

      {/* Role Templates Section (collapsible) */}
      {showRoleTemplates && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Shield size={20} /> Predefined Roles
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Select a role to view its default permissions
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roles.map((role) => (
              <div
                key={role.id}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-gray-800">{role.name}</h4>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    Template
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{role.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {role.defaultPermissions.slice(0, 5).map((permId) => {
                    const perm = availablePermissions.find(
                      (p) => p.id === permId,
                    )
                    return (
                      perm && (
                        <span
                          key={permId}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                        >
                          {perm.name}
                        </span>
                      )
                    )
                  })}
                  {role.defaultPermissions.length > 5 && (
                    <span className="text-xs text-gray-500">
                      +{role.defaultPermissions.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <Users className="text-blue-600" size={24} />
            <span className="text-2xl font-bold">{employees.length}</span>
          </div>
          <h3 className="font-semibold text-gray-900">Total Employees</h3>
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
          <h3 className="font-semibold text-gray-900">Active Employees</h3>
          <p className="text-sm text-gray-600 mt-1">Currently working</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <Shield className="text-purple-600" size={24} />
            <span className="text-2xl font-bold">
              {availablePermissions.length}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900">Available Permissions</h3>
          <p className="text-sm text-gray-600 mt-1">System access levels</p>
        </div>
      </div>

      {/* Employees Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Employee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Permissions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Last Active
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">
                    {employee.name}
                  </div>
                  <div className="text-sm text-gray-500">{employee.email}</div>
                  <div className="text-sm text-gray-500">{employee.phone}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium">{employee.role}</div>
                  <div className="text-sm text-gray-500">
                    {employee.department}
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
                    {getPermissionCountByCategory(employee)["Sales"] && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        Sales: {getPermissionCountByCategory(employee)["Sales"]}
                      </span>
                    )}
                    {getPermissionCountByCategory(employee)["Inventory"] && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                        Inventory:{" "}
                        {getPermissionCountByCategory(employee)["Inventory"]}
                      </span>
                    )}
                    {getPermissionCountByCategory(employee)["Finance"] && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                        Finance:{" "}
                        {getPermissionCountByCategory(employee)["Finance"]}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setSelectedEmployee(employee)
                      const roleObj = getRoleByName(employee.role)
                      setSelectedEmployeeRoleId(roleObj?.id || "")
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
                        const roleObj = getRoleByName(employee.role)
                        setSelectedEmployeeRoleId(roleObj?.id || "")
                        setShowEditPermissionsModal(true)
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Edit permissions"
                    >
                      <Shield size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteEmployee(employee.id)}
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
  )

  const renderCompanyTab = () => (
    <div className="space-y-8">
      {/* Company Information Form (unchanged) */}
      <form onSubmit={handleSubmitCompany} className="space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Company Information
          </h3>
          <p className="text-sm text-gray-500">
            Basic details about your business
          </p>
        </div>
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-28 h-28 rounded-full border-4 border-blue-200 overflow-hidden bg-gray-100 shadow-md">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Company Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Business style={{ fontSize: 48 }} />
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={handleUploadClick}
              className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition"
            >
              <CameraAlt fontSize="small" />
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            className="hidden"
          />
          {logoFile && (
            <div className="flex items-center mt-2 space-x-2">
              <span className="text-xs text-gray-500">{logoFile.name}</span>
              <button
                type="button"
                onClick={handleClearLogo}
                className="text-red-500 text-xs hover:underline"
              >
                Clear
              </button>
            </div>
          )}
          <p className="text-xs text-gray-400 mt-1">
            Click camera icon to upload (max 2MB)
          </p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center">
              <Business className="mr-1 text-blue-500" fontSize="small" />{" "}
              Company Name
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
              required
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center">
              <LocationOn className="mr-1 text-red-500" fontSize="small" />{" "}
              Location / Address
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center">
              <Email className="mr-1 text-green-500" fontSize="small" /> Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center">
              <Phone className="mr-1 text-purple-500" fontSize="small" /> Phone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
            />
          </div>
        </div>
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
        <button
          type="submit"
          disabled={submittingCompany}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {submittingCompany ? (
            <>Saving Company Info...</>
          ) : (
            <>
              <Save size={18} className="mr-2" /> Save Company Information
            </>
          )}
        </button>
      </form>

      {/* Notification Settings Form (unchanged) */}
      <form
        onSubmit={handleSubmitNotifications}
        className="space-y-6 pt-6 border-t border-gray-200"
      >
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <Notifications className="mr-2 text-blue-500" /> Notification &
            Alert Settings
          </h3>
          <p className="text-sm text-gray-500">
            Configure how your business receives alerts
          </p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <label className="font-medium text-gray-700">
                Email Notifications
              </label>
              <p className="text-xs text-gray-500">
                Send email notifications for important events
              </p>
            </div>
            <button
              type="button"
              onClick={() => setEmailNotifications(!emailNotifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                emailNotifications ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  emailNotifications ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <label className="font-medium text-gray-700">
                SMS Notifications
              </label>
              <p className="text-xs text-gray-500">
                Send SMS notifications for urgent alerts
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSmsNotifications(!smsNotifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                smsNotifications ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  smsNotifications ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div>
                <label className="font-medium text-gray-700 flex items-center">
                  <Inventory
                    className="mr-1 text-orange-500"
                    fontSize="small"
                  />{" "}
                  Low Stock Threshold
                </label>
                <p className="text-xs text-gray-500">
                  Minimum cylinder quantity before low stock alert
                </p>
              </div>
              <input
                type="number"
                min="0"
                value={lowStockThreshold}
                onChange={(e) =>
                  setLowStockThreshold(parseInt(e.target.value) || 0)
                }
                className="w-24 px-3 py-1 border border-gray-300 rounded-lg text-center focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
              />
            </div>
          </div>
        </div>
        <button
          type="submit"
          disabled={submittingNotifications}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:from-green-600 hover:to-green-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {submittingNotifications ? (
            <>Saving Notifications...</>
          ) : (
            <>
              <Save size={18} className="mr-2" /> Save Notification Settings
            </>
          )}
        </button>
      </form>
    </div>
  )

  // Mobile-only view
  if (!isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 text-center">
          <p className="text-6xl mb-4">💻</p>
          <p className="text-2xl font-bold text-gray-800 mb-2">
            Desktop View Coming Soon
          </p>
          <p className="text-gray-600">
            Please use a mobile device or resize your browser window
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-gray-800 flex flex-col font-sans">
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Navbar
        headerMessage="Company & Employee Settings"
        headerText="Manage your business information and team"
      />

      <div className="prevent-overflow">
        <RealTimeIndicator
          enabled={autoRefresh}
          lastUpdated={lastUpdated}
          dataVersion={dataVersion}
          onToggle={() => setAutoRefresh(!autoRefresh)}
        />
      </div>

      <main className="flex-grow p-4 pb-24">
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab("company")}
              className={`px-4 py-2 font-medium text-sm transition-colors ${
                activeTab === "company"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-blue-500"
              }`}
            >
              <Business fontSize="small" className="inline mr-1" /> Company
              Details
            </button>
            <button
              onClick={() => setActiveTab("employees")}
              className={`px-4 py-2 font-medium text-sm transition-colors ${
                activeTab === "employees"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-blue-500"
              }`}
            >
              <Users size={18} className="inline mr-1" /> Employees
            </button>
          </div>

          {loadingInitial && activeTab === "company" && (
            <div className="space-y-4">
              <Skeleton
                variant="circular"
                width={80}
                height={80}
                className="mx-auto"
              />
              <Skeleton variant="text" height={40} />
              <Skeleton variant="text" height={40} />
              <Skeleton variant="text" height={40} />
            </div>
          )}
          {error && activeTab === "company" && (
            <div className="text-center py-8 bg-red-50 rounded-lg">
              <p className="text-red-500 font-medium">{error}</p>
            </div>
          )}
          {activeTab === "company" &&
            !loadingInitial &&
            !error &&
            renderCompanyTab()}
          {activeTab === "employees" && renderEmployeesTab()}
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0">
        <AdminsFooter />
      </footer>
      <ScrollTop />

      {/* Add Employee Modal with Role Selection */}
      {showAddEmployeeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newEmployee.email}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, email: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={newEmployee.phone}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, phone: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role (Position)
                    </label>
                    <select
                      value={newEmployee.roleId}
                      onChange={(e) => {
                        const roleId = e.target.value
                        setNewEmployee({
                          ...newEmployee,
                          roleId,
                          permissions: applyRolePermissions(roleId),
                        })
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500"
                    >
                      <option value="">Select a role</option>
                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500"
                    >
                      <option value="">Select dept</option>
                      <option>Sales</option>
                      <option>Logistics</option>
                      <option>Finance</option>
                      <option>Warehouse</option>
                      <option>Admin</option>
                    </select>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  {newEmployee.roleId && (
                    <p>
                      Permissions will be set based on the selected role. You
                      can edit them later.
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-8 flex justify-end gap-3">
                <button
                  onClick={() => setShowAddEmployeeModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddEmployee}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
                >
                  <UserPlus size={18} /> Add Employee
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Permissions Modal with Role Change Option */}
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

              {/* Role selector */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role (Position)
                </label>
                <div className="flex gap-3">
                  <select
                    value={selectedEmployeeRoleId}
                    onChange={(e) => setSelectedEmployeeRoleId(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500"
                  >
                    <option value="">Select a role</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        selectedEmployeeRoleId &&
                        window.confirm(
                          "Changing the role will replace permissions with the role's defaults. Continue?",
                        )
                      ) {
                        handleApplyRoleToEmployee(
                          selectedEmployee.id,
                          selectedEmployeeRoleId,
                        )
                        setShowEditPermissionsModal(false)
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Apply Role
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Select a role and click "Apply Role" to replace permissions
                  with role defaults.
                </p>
              </div>

              {/* Permissions checklist */}
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
                  {selectedEmployee.permissions.length} permissions granted
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowEditPermissionsModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setShowEditPermissionsModal(false)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
                  >
                    <Save size={18} /> Save Changes
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

export default CompanyDetails;