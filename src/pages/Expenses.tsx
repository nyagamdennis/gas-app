// @ts-nocheck
import React, { useEffect, useState } from "react"
import AdminsFooter from "../components/AdminsFooter"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { useMediaQuery, useTheme } from "@mui/material"
import DateDisplay from "../components/DateDisplay"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/ui/mobile/admin/Navbar"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import {
  approveExpense,
  attachExpenseToEmployee,
  createExpense,
  deleteExpense,
  fetchExpenseCategories,
  fetchExpenses,
  fetchExpenseSubCategories,
  fetchExpenseSummary,
  markExpenseAsPaid,
  rejectExpense,
  selectAllExpenses,
  selectExpenseCategories,
  selectExpenseSubCategories,
  selectExpenseSummary,
  updateExpense,
} from "../features/expenses/expensesSlice"
import {
  fetchEmployees,
  selectAllEmployees,
} from "../features/employees/employeesSlice"
import planStatus from "../features/planStatus/planStatus"

// ── Icons ────────────────────────────────────────────────────────────────────
const Icon = {
  Receipt: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
      />
    </svg>
  ),
  Plus: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
      />
    </svg>
  ),
  Search: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  ),
  Filter: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"
      />
    </svg>
  ),
  Edit: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </svg>
  ),
  Trash: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  ),
  Check: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  ),
  Close: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  ),
  Dots: () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 7a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 7a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
    </svg>
  ),
  Fuel: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 10h2l2-6h10l2 6h2v8a1 1 0 01-1 1H4a1 1 0 01-1-1v-8zm5 4h8"
      />
    </svg>
  ),
  Person: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  ),
  Warning: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  ),
  Payment: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
      />
    </svg>
  ),
  Car: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 17H3v-6l2-5h14l2 5v6h-2m-9 0h4m-6-3h8M7 11h10"
      />
    </svg>
  ),
  Shop: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  ),
}

// ── Reusable form input ───────────────────────────────────────────────────────
const Input = ({ label, ...props }) => (
  <div>
    {label && (
      <label className="block text-xs font-semibold text-gray-600 mb-1">
        {label}
      </label>
    )}
    <input
      {...props}
      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition text-sm"
    />
  </div>
)

const SelectInput = ({ label, children, ...props }) => (
  <div>
    {label && (
      <label className="block text-xs font-semibold text-gray-600 mb-1">
        {label}
      </label>
    )}
    <select
      {...props}
      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition text-sm bg-white"
    >
      {children}
    </select>
  </div>
)

const Textarea = ({ label, ...props }) => (
  <div>
    {label && (
      <label className="block text-xs font-semibold text-gray-600 mb-1">
        {label}
      </label>
    )}
    <textarea
      {...props}
      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition text-sm resize-none"
    />
  </div>
)

// ── Full-screen drawer/modal ──────────────────────────────────────────────────
const Drawer = ({
  open,
  onClose,
  title,
  titleColor = "bg-blue-600",
  children,
  footer,
}) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      <div
        className={`${titleColor} text-white px-4 py-3 flex items-center justify-between flex-shrink-0`}
      >
        <h2 className="text-base font-bold">{title}</h2>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-white/20 transition"
        >
          <Icon.Close />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">{children}</div>
      {footer && (
        <div className="p-4 border-t border-gray-200 flex-shrink-0 flex gap-3">
          {footer}
        </div>
      )}
    </div>
  )
}

// ── Confirm dialog ────────────────────────────────────────────────────────────
const ConfirmDialog = ({
  open,
  onClose,
  title,
  titleColor,
  message,
  onConfirm,
  loading,
  confirmLabel,
  confirmColor,
  children,
}) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
        <div className={`${titleColor} text-white px-4 py-3`}>
          <h3 className="font-bold text-base">{title}</h3>
        </div>
        <div className="p-4">
          {message && <p className="text-sm text-gray-600 mb-3">{message}</p>}
          {children}
        </div>
        <div className="px-4 pb-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 border-2 border-gray-300 rounded-lg text-gray-600 text-sm font-semibold hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 py-2 rounded-lg text-white text-sm font-semibold transition flex items-center justify-center ${confirmColor} disabled:opacity-60`}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Status badge ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    APPROVED: "bg-green-100 text-green-700",
    PENDING: "bg-yellow-100 text-yellow-700",
    REJECTED: "bg-red-100 text-red-700",
    PAID: "bg-blue-100 text-blue-700",
  }
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-bold ${
        map[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  )
}

// ── Type badge ────────────────────────────────────────────────────────────────
const TypeBadge = ({ type }) => {
  const map = {
    VEHICLE: "bg-blue-100 text-blue-700",
    MOTORBIKE: "bg-purple-100 text-purple-700",
    SHOP: "bg-green-100 text-green-700",
    OFFICE: "bg-yellow-100 text-yellow-700",
    STAFF: "bg-indigo-100 text-indigo-700",
    UTILITY: "bg-orange-100 text-orange-700",
  }
  const icons = {
    VEHICLE: <Icon.Car />,
    MOTORBIKE: "🏍️",
    SHOP: <Icon.Shop />,
    OFFICE: "🏢",
    STAFF: <Icon.Person />,
    UTILITY: "⚡",
  }
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${
        map[type] || "bg-gray-100 text-gray-600"
      }`}
    >
      <span className="flex items-center">{icons[type] || "📋"}</span> {type}
    </span>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
const Expenses = () => {
  const { businessId } = planStatus()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const dispatch = useAppDispatch()

  const expenses = useAppSelector(selectAllExpenses)
  const categories = useAppSelector(selectExpenseCategories)
  const subcategories = useAppSelector(selectExpenseSubCategories)
  const summary = useAppSelector(selectExpenseSummary)
  const employees = useAppSelector(selectAllEmployees)

  // ── Dialog open states ──────────────────────────────────────────────────
  const [openAdd, setOpenAdd] = useState(false)
  const [openUpdate, setOpenUpdate] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [openApprove, setOpenApprove] = useState(false)
  const [openReject, setOpenReject] = useState(false)
  const [openMarkPaid, setOpenMarkPaid] = useState(false)
  const [openAttach, setOpenAttach] = useState(false)
  const [openActions, setOpenActions] = useState(null)
  const [selectedExpense, setSelectedExpense] = useState(null)
  const [rejectionReason, setRejectionReason] = useState("")

  // ── UI state ────────────────────────────────────────────────────────────
  const [search, setSearch] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [activeFilter, setActiveFilter] = useState("ALL")
  const [filter, setFilter] = useState({
    expense_type: "ALL",
    category: "",
    status: "ALL",
  })

  // ── Loading ─────────────────────────────────────────────────────────────
  const [loading, setLoading] = useState({
    add: false,
    update: false,
    delete: false,
    approve: false,
    reject: false,
    markPaid: false,
    attach: false,
  })

  // ── Form states ─────────────────────────────────────────────────────────
  const blankExpense = {
    title: "",
    expense_type: "SHOP",
    category: "",
    subcategory: "",
    description: "",
    amount: "",
    tax_amount: "0",
    payment_method: "CASH",
    payment_reference: "",
    expense_date: new Date().toISOString().split("T")[0],
    receipt_number: "",
    notes: "",
  }
  const [expenseData, setExpenseData] = useState(blankExpense)
  const [updateData, setUpdateData] = useState({})
  const [deleteData, setDeleteData] = useState({ id: "", title: "" })
  const [attachData, setAttachData] = useState({
    expenseId: "",
    employeeId: "",
    deductionAmount: "",
    description: "",
  })

  useEffect(() => {
    dispatch(fetchExpenses())
    dispatch(fetchEmployees({ businessId }))
    dispatch(fetchExpenseCategories())
    dispatch(fetchExpenseSummary())
  }, [dispatch])

  useEffect(() => {
    if (expenseData.category)
      dispatch(fetchExpenseSubCategories(parseInt(expenseData.category)))
  }, [expenseData.category, dispatch])

  // ── Handlers ────────────────────────────────────────────────────────────
  const handleAdd = async (e) => {
    e.preventDefault()
    setLoading({ ...loading, add: true })
    try {
      const fd = new FormData()
      Object.entries(expenseData).forEach(
        ([k, v]) => v !== "" && fd.append(k, v.toString()),
      )
      fd.append("company", "1")
      await dispatch(createExpense(fd))
      toast.success("Expense added!")
      setOpenAdd(false)
      setExpenseData(blankExpense)
      dispatch(fetchExpenseSummary())
      dispatch(fetchExpenses())
    } catch (err) {
      toast.error(err.message || "Failed to add expense")
    } finally {
      setLoading({ ...loading, add: false })
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading({ ...loading, update: true })
    try {
      await dispatch(
        updateExpense({ id: parseInt(updateData.id), expenseData: updateData }),
      )
      toast.success("Expense updated!")
      setOpenUpdate(false)
      dispatch(fetchExpenseSummary())
      dispatch(fetchExpenses())
    } catch (err) {
      toast.error(err.message || "Failed to update")
    } finally {
      setLoading({ ...loading, update: false })
    }
  }

  const handleDelete = async () => {
    setLoading({ ...loading, delete: true })
    try {
      await dispatch(deleteExpense(parseInt(deleteData.id)))
      toast.success("Expense deleted!")
      setOpenDelete(false)
      dispatch(fetchExpenseSummary())
      dispatch(fetchExpenses())
    } catch (err) {
      toast.error(err.message || "Failed to delete")
    } finally {
      setLoading({ ...loading, delete: false })
    }
  }

  const handleApprove = async () => {
    setLoading({ ...loading, approve: true })
    try {
      await dispatch(approveExpense(selectedExpense.id))
      toast.success("Expense approved!")
      setOpenApprove(false)
      setOpenActions(null)
      dispatch(fetchExpenses())
    } catch (err) {
      toast.error(err.message || "Failed to approve")
    } finally {
      setLoading({ ...loading, approve: false })
    }
  }

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Rejection reason required")
      return
    }
    setLoading({ ...loading, reject: true })
    try {
      await dispatch(
        rejectExpense({
          id: selectedExpense.id,
          rejection_reason: rejectionReason,
        }),
      )
      toast.success("Expense rejected")
      setOpenReject(false)
      setRejectionReason("")
      setOpenActions(null)
      dispatch(fetchExpenses())
    } catch (err) {
      toast.error(err.message || "Failed to reject")
    } finally {
      setLoading({ ...loading, reject: false })
    }
  }

  const handleMarkPaid = async () => {
    setLoading({ ...loading, markPaid: true })
    try {
      await dispatch(markExpenseAsPaid(selectedExpense.id))
      toast.success("Marked as paid!")
      setOpenMarkPaid(false)
      setOpenActions(null)
      dispatch(fetchExpenses())
    } catch (err) {
      toast.error(err.message || "Failed")
    } finally {
      setLoading({ ...loading, markPaid: false })
    }
  }

  const handleAttach = async () => {
    if (!attachData.employeeId || !attachData.deductionAmount) {
      toast.error("Select employee and enter amount")
      return
    }
    setLoading({ ...loading, attach: true })
    try {
      await dispatch(
        attachExpenseToEmployee({
          expenseId: parseInt(attachData.expenseId),
          employeeId: parseInt(attachData.employeeId),
          deductionAmount: parseFloat(attachData.deductionAmount),
        }),
      )
      toast.success("Attached to employee!")
      setOpenAttach(false)
      setOpenActions(null)
      setAttachData({
        expenseId: "",
        employeeId: "",
        deductionAmount: "",
        description: "",
      })
      dispatch(fetchExpenses())
    } catch (err) {
      toast.error(err.message || "Failed")
    } finally {
      setLoading({ ...loading, attach: false })
    }
  }

  const openEditFor = (exp) => {
    setUpdateData({
      id: exp.id,
      title: exp.title,
      category: exp.category?.id || "",
      subcategory: exp.subcategory?.id || "",
      description: exp.description || "",
      amount: exp.amount,
      tax_amount: exp.tax_amount || "0",
      payment_method: exp.payment_method || "CASH",
      payment_reference: exp.payment_reference || "",
    })
    setOpenUpdate(true)
    setOpenActions(null)
  }

  // ── Filtering ───────────────────────────────────────────────────────────
  const statusTabs = ["ALL", "PENDING", "APPROVED", "PAID", "REJECTED"]
  const filtered = expenses.filter((exp) => {
    const q = search.toLowerCase()
    const matchSearch =
      !q ||
      exp.title.toLowerCase().includes(q) ||
      exp.description?.toLowerCase().includes(q)
    const matchType =
      filter.expense_type === "ALL" || exp.expense_type === filter.expense_type
    const matchCat =
      !filter.category || exp.category?.id?.toString() === filter.category
    const matchStatus = activeFilter === "ALL" || exp.status === activeFilter
    return matchSearch && matchType && matchCat && matchStatus
  })

  const totalFiltered = filtered.reduce(
    (s, e) => s + parseFloat(e.total_amount || 0),
    0,
  )

  const summaryStats = [
    {
      label: "Total",
      value: `KES ${summary?.summary?.total_amount?.toLocaleString() || 0}`,
      color: "text-blue-600",
      border: "border-blue-500",
      icon: "💰",
    },
    {
      label: "Count",
      value: summary?.summary?.count || 0,
      color: "text-green-600",
      border: "border-green-500",
      icon: "📋",
    },
    {
      label: "Average",
      value: `KES ${Math.round(
        summary?.summary?.average_amount || 0,
      ).toLocaleString()}`,
      color: "text-yellow-600",
      border: "border-yellow-500",
      icon: "📊",
    },
    {
      label: "Pending",
      value: summary?.summary?.pending_count || 0,
      color: "text-red-600",
      border: "border-red-500",
      icon: "⏳",
    },
  ]

  if (!isMobile)
    return (
      <div className="p-4">
        <p>Desktop view coming soon</p>
      </div>
    )

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-gray-800 flex flex-col font-sans">
      <ToastContainer position="top-center" />
      <Navbar
        headerMessage="Expenses"
        headerText="Track and manage company expenses"
      />

      <main className="flex-grow m-2 p-1 pb-24 space-y-4">
        {/* ── Header ── */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-1">
            <span>💸</span> Expense Management
          </h2>
          <p className="text-sm text-gray-500">
            Track, approve and manage all company expenses
          </p>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 gap-3">
          {summaryStats.map((s) => (
            <div
              key={s.label}
              className={`bg-white p-4 rounded-lg shadow-md border-l-4 ${s.border}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{s.label}</p>
                  <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                </div>
                <span className="text-3xl">{s.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Quick actions ── */}
        <div className="flex gap-2">
          <button
            onClick={() => setOpenAdd(true)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm shadow-md transition active:scale-95"
          >
            <Icon.Plus /> Add Expense
          </button>
          <button
            onClick={() => {
              const fuelCat = categories.find((c) => c.code === "FUEL")
              setExpenseData({
                ...blankExpense,
                expense_type: "VEHICLE",
                title: "Fuel Expense",
                category: fuelCat?.id?.toString() || "",
              })
              setOpenAdd(true)
            }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 border-2 border-blue-500 text-blue-600 rounded-lg font-semibold text-sm hover:bg-blue-50 transition"
          >
            <Icon.Fuel /> Quick Fuel
          </button>
          <button
            onClick={() => {
              setExpenseData({
                ...blankExpense,
                expense_type: "SHOP",
                title: "Shop Maintenance",
              })
              setOpenAdd(true)
            }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 border-2 border-green-500 text-green-600 rounded-lg font-semibold text-sm hover:bg-green-50 transition"
          >
            <Icon.Shop /> Shop
          </button>
        </div>

        {/* ── Search & filter ── */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex gap-2 mb-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                <Icon.Search />
              </div>
              <input
                type="text"
                placeholder="Search expenses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition text-sm"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-3 py-2.5 border-2 rounded-lg transition ${
                showFilters
                  ? "border-blue-500 bg-blue-50 text-blue-600"
                  : "border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Icon.Filter />
            </button>
          </div>

          {/* Status tabs */}
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
            {statusTabs.map((tab) => {
              const count =
                tab === "ALL"
                  ? expenses.length
                  : expenses.filter((e) => e.status === tab).length
              return (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                    activeFilter === tab
                      ? tab === "APPROVED"
                        ? "bg-green-500 text-white"
                        : tab === "PENDING"
                        ? "bg-yellow-500 text-white"
                        : tab === "REJECTED"
                        ? "bg-red-500 text-white"
                        : tab === "PAID"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-800 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {tab}
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-xs ${
                      activeFilter === tab
                        ? "bg-white/25 text-white"
                        : "bg-blue-500 text-white"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Advanced filters */}
          {showFilters && (
            <div className="mt-3 pt-3 border-t border-gray-100 space-y-3">
              <SelectInput
                label="Expense Type"
                value={filter.expense_type}
                onChange={(e) =>
                  setFilter({ ...filter, expense_type: e.target.value })
                }
              >
                <option value="ALL">All Types</option>
                {[
                  "VEHICLE",
                  "MOTORBIKE",
                  "SHOP",
                  "OFFICE",
                  "STAFF",
                  "UTILITY",
                  "MARKETING",
                  "MAINTENANCE",
                  "OTHER",
                ].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </SelectInput>
              <SelectInput
                label="Category"
                value={filter.category}
                onChange={(e) =>
                  setFilter({ ...filter, category: e.target.value })
                }
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </SelectInput>
              <button
                onClick={() => {
                  setFilter({
                    expense_type: "ALL",
                    category: "",
                    status: "ALL",
                  })
                  setActiveFilter("ALL")
                }}
                className="w-full py-2 border-2 border-gray-300 rounded-lg text-gray-600 text-sm font-semibold hover:bg-gray-50 transition"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* ── Results info ── */}
        <div className="flex items-center justify-between px-1">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">{filtered.length}</span> expenses ·
            KES {totalFiltered.toLocaleString()}
          </p>
        </div>

        {/* ── Expense cards ── */}
        {filtered.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow-md text-center">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-gray-500 text-lg font-medium mb-1">
              No expenses found
            </p>
            <p className="text-gray-400 text-sm mb-4">
              {search ? "Try adjusting your search" : "Add your first expense"}
            </p>
            <button
              onClick={() => setOpenAdd(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition"
            >
              + Add Expense
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((exp) => (
              <div
                key={exp.id}
                className={`bg-white rounded-lg shadow-md border-l-4 overflow-hidden ${
                  exp.status === "APPROVED"
                    ? "border-green-500"
                    : exp.status === "PAID"
                    ? "border-blue-500"
                    : exp.status === "REJECTED"
                    ? "border-red-500"
                    : "border-yellow-500"
                }`}
              >
                <div className="p-4">
                  {/* Card header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-sm font-bold text-gray-800">
                          {exp.title}
                        </h3>
                        {exp.employee_attachments?.length > 0 && (
                          <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                            👤 {exp.employee_attachments.length}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <TypeBadge type={exp.expense_type} />
                        <StatusBadge status={exp.status} />
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setOpenActions(openActions === exp.id ? null : exp.id)
                      }
                      className="p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-500 flex-shrink-0 ml-2"
                    >
                      <Icon.Dots />
                    </button>
                  </div>

                  {/* Card body */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-gray-50 rounded-lg p-2.5">
                      <p className="text-xs text-gray-500 mb-0.5">Amount</p>
                      <p className="text-base font-bold text-green-600">
                        KES {parseFloat(exp.total_amount).toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2.5">
                      <p className="text-xs text-gray-500 mb-0.5">Date</p>
                      <p className="text-sm font-semibold text-gray-700">
                        <DateDisplay date={exp.expense_date} />
                      </p>
                    </div>
                    {exp.category?.name && (
                      <div className="bg-gray-50 rounded-lg p-2.5">
                        <p className="text-xs text-gray-500 mb-0.5">Category</p>
                        <p className="text-sm font-semibold text-gray-700 truncate">
                          {exp.category.name}
                        </p>
                      </div>
                    )}
                    <div className="bg-gray-50 rounded-lg p-2.5">
                      <p className="text-xs text-gray-500 mb-0.5">Payment</p>
                      <p className="text-sm font-semibold text-gray-700">
                        {exp.payment_method}
                      </p>
                    </div>
                  </div>

                  {/* Location chips */}
                  {(exp.shop_name ||
                    exp.store_name ||
                    exp.vehicle_name ||
                    exp.motorbike_name) && (
                    <div className="flex gap-1.5 flex-wrap mb-3">
                      {exp.shop_name && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                          🏪 {exp.shop_name}
                        </span>
                      )}
                      {exp.store_name && (
                        <span className="px-2 py-0.5 bg-teal-100 text-teal-700 rounded-full text-xs font-semibold">
                          🏬 {exp.store_name}
                        </span>
                      )}
                      {exp.vehicle_name && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                          🚗 {exp.vehicle_name}
                        </span>
                      )}
                      {exp.motorbike_name && (
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                          🏍️ {exp.motorbike_name}
                        </span>
                      )}
                    </div>
                  )}

                  {exp.description && (
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                      {exp.description}
                    </p>
                  )}

                  {/* Actions panel */}
                  {openActions === exp.id && (
                    <div className="pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-400 font-semibold mb-2">
                        ACTIONS
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => openEditFor(exp)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-100 transition"
                        >
                          <Icon.Edit /> Edit
                        </button>
                        {exp.status === "PENDING" && (
                          <>
                            <button
                              onClick={() => {
                                setSelectedExpense(exp)
                                setOpenApprove(true)
                                setOpenActions(null)
                              }}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-semibold hover:bg-green-100 transition"
                            >
                              <Icon.Check /> Approve
                            </button>
                            <button
                              onClick={() => {
                                setSelectedExpense(exp)
                                setOpenReject(true)
                                setOpenActions(null)
                              }}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-100 transition"
                            >
                              <Icon.Warning /> Reject
                            </button>
                          </>
                        )}
                        {exp.status === "APPROVED" && (
                          <button
                            onClick={() => {
                              setSelectedExpense(exp)
                              setOpenMarkPaid(true)
                              setOpenActions(null)
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-100 transition"
                          >
                            <Icon.Payment /> Mark Paid
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setAttachData({
                              ...attachData,
                              expenseId: exp.id.toString(),
                            })
                            setOpenAttach(true)
                            setOpenActions(null)
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-semibold hover:bg-purple-100 transition"
                        >
                          <Icon.Person /> Attach
                        </button>
                        <button
                          onClick={() => {
                            setDeleteData({
                              id: exp.id.toString(),
                              title: exp.title,
                            })
                            setOpenDelete(true)
                            setOpenActions(null)
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-100 transition"
                        >
                          <Icon.Trash /> Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── FAB ── */}
      <button
        onClick={() => setOpenAdd(true)}
        className="fixed bottom-20 right-4 z-40 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center"
      >
        <Icon.Plus />
      </button>

      <footer className="text-white mt-4">
        <AdminsFooter />
      </footer>

      {/* ══ ADD DRAWER ══ */}
      <Drawer
        open={openAdd}
        onClose={() => {
          setOpenAdd(false)
          setExpenseData(blankExpense)
        }}
        title="Add New Expense"
        titleColor="bg-blue-600"
        footer={
          <>
            <button
              onClick={() => {
                setOpenAdd(false)
                setExpenseData(blankExpense)
              }}
              className="flex-1 py-2.5 border-2 border-gray-300 rounded-lg text-gray-600 font-semibold text-sm hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={loading.add}
              className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition flex items-center justify-center disabled:opacity-60"
            >
              {loading.add ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Save Expense"
              )}
            </button>
          </>
        }
      >
        <div className="space-y-4 mt-1">
          <Input
            label="Expense Title *"
            value={expenseData.title}
            onChange={(e) =>
              setExpenseData({ ...expenseData, title: e.target.value })
            }
            required
          />
          <SelectInput
            label="Expense Type *"
            value={expenseData.expense_type}
            onChange={(e) =>
              setExpenseData({ ...expenseData, expense_type: e.target.value })
            }
          >
            {[
              "VEHICLE",
              "MOTORBIKE",
              "SHOP",
              "OFFICE",
              "STAFF",
              "UTILITY",
              "MARKETING",
              "MAINTENANCE",
              "OTHER",
            ].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </SelectInput>
          <SelectInput
            label="Category *"
            value={expenseData.category}
            onChange={(e) =>
              setExpenseData({ ...expenseData, category: e.target.value })
            }
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </SelectInput>
          <SelectInput
            label="Subcategory"
            value={expenseData.subcategory}
            onChange={(e) =>
              setExpenseData({ ...expenseData, subcategory: e.target.value })
            }
          >
            <option value="">Select Subcategory</option>
            {subcategories.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </SelectInput>
          <Input
            label="Amount (KES) *"
            type="number"
            value={expenseData.amount}
            onChange={(e) =>
              setExpenseData({ ...expenseData, amount: e.target.value })
            }
            required
          />
          <Input
            label="Tax Amount (KES)"
            type="number"
            value={expenseData.tax_amount}
            onChange={(e) =>
              setExpenseData({ ...expenseData, tax_amount: e.target.value })
            }
          />
          <SelectInput
            label="Payment Method *"
            value={expenseData.payment_method}
            onChange={(e) =>
              setExpenseData({ ...expenseData, payment_method: e.target.value })
            }
          >
            {[
              ["CASH", "Cash"],
              ["MPESA", "M-Pesa"],
              ["BANK_TRANSFER", "Bank Transfer"],
              ["CHEQUE", "Cheque"],
              ["CREDIT_CARD", "Credit Card"],
            ].map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </SelectInput>
          <Input
            label="Payment Reference"
            value={expenseData.payment_reference}
            onChange={(e) =>
              setExpenseData({
                ...expenseData,
                payment_reference: e.target.value,
              })
            }
          />
          <Input
            label="Receipt Number"
            value={expenseData.receipt_number}
            onChange={(e) =>
              setExpenseData({ ...expenseData, receipt_number: e.target.value })
            }
          />
          <Input
            label="Expense Date"
            type="date"
            value={expenseData.expense_date}
            onChange={(e) =>
              setExpenseData({ ...expenseData, expense_date: e.target.value })
            }
          />
          <Textarea
            label="Description"
            rows={3}
            value={expenseData.description}
            onChange={(e) =>
              setExpenseData({ ...expenseData, description: e.target.value })
            }
          />
          <Textarea
            label="Notes"
            rows={2}
            value={expenseData.notes}
            onChange={(e) =>
              setExpenseData({ ...expenseData, notes: e.target.value })
            }
          />
        </div>
      </Drawer>

      {/* ══ UPDATE DRAWER ══ */}
      <Drawer
        open={openUpdate}
        onClose={() => setOpenUpdate(false)}
        title="Update Expense"
        titleColor="bg-yellow-500"
        footer={
          <>
            <button
              onClick={() => setOpenUpdate(false)}
              className="flex-1 py-2.5 border-2 border-gray-300 rounded-lg text-gray-600 font-semibold text-sm hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={loading.update}
              className="flex-1 py-2.5 bg-yellow-500 text-white rounded-lg font-semibold text-sm hover:bg-yellow-600 transition flex items-center justify-center disabled:opacity-60"
            >
              {loading.update ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Update"
              )}
            </button>
          </>
        }
      >
        <div className="space-y-4 mt-1">
          <Input
            label="Expense Title *"
            value={updateData.title || ""}
            onChange={(e) =>
              setUpdateData({ ...updateData, title: e.target.value })
            }
          />
          <SelectInput
            label="Category"
            value={updateData.category || ""}
            onChange={(e) =>
              setUpdateData({ ...updateData, category: e.target.value })
            }
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </SelectInput>
          <SelectInput
            label="Subcategory"
            value={updateData.subcategory || ""}
            onChange={(e) =>
              setUpdateData({ ...updateData, subcategory: e.target.value })
            }
          >
            <option value="">Select Subcategory</option>
            {subcategories.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </SelectInput>
          <Input
            label="Amount (KES) *"
            type="number"
            value={updateData.amount || ""}
            onChange={(e) =>
              setUpdateData({ ...updateData, amount: e.target.value })
            }
          />
          <Input
            label="Tax Amount (KES)"
            type="number"
            value={updateData.tax_amount || "0"}
            onChange={(e) =>
              setUpdateData({ ...updateData, tax_amount: e.target.value })
            }
          />
          <SelectInput
            label="Payment Method"
            value={updateData.payment_method || "CASH"}
            onChange={(e) =>
              setUpdateData({ ...updateData, payment_method: e.target.value })
            }
          >
            {[
              ["CASH", "Cash"],
              ["MPESA", "M-Pesa"],
              ["BANK_TRANSFER", "Bank Transfer"],
              ["CHEQUE", "Cheque"],
              ["CREDIT_CARD", "Credit Card"],
            ].map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </SelectInput>
          <Input
            label="Payment Reference"
            value={updateData.payment_reference || ""}
            onChange={(e) =>
              setUpdateData({
                ...updateData,
                payment_reference: e.target.value,
              })
            }
          />
          <Textarea
            label="Description"
            rows={3}
            value={updateData.description || ""}
            onChange={(e) =>
              setUpdateData({ ...updateData, description: e.target.value })
            }
          />
        </div>
      </Drawer>

      {/* ══ ATTACH TO EMPLOYEE DRAWER ══ */}
      <Drawer
        open={openAttach}
        onClose={() => setOpenAttach(false)}
        title="Attach to Employee"
        titleColor="bg-purple-600"
        footer={
          <>
            <button
              onClick={() => setOpenAttach(false)}
              className="flex-1 py-2.5 border-2 border-gray-300 rounded-lg text-gray-600 font-semibold text-sm hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleAttach}
              disabled={loading.attach}
              className="flex-1 py-2.5 bg-purple-600 text-white rounded-lg font-semibold text-sm hover:bg-purple-700 transition flex items-center justify-center disabled:opacity-60"
            >
              {loading.attach ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Attach"
              )}
            </button>
          </>
        }
      >
        <div className="space-y-4 mt-1">
          <p className="text-sm text-gray-500">
            Attach this expense to an employee for salary deduction.
          </p>
          <SelectInput
            label="Select Employee *"
            value={attachData.employeeId}
            onChange={(e) =>
              setAttachData({ ...attachData, employeeId: e.target.value })
            }
          >
            <option value="">Choose an employee</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.first_name} {e.last_name}
              </option>
            ))}
          </SelectInput>
          <Input
            label="Deduction Amount (KES) *"
            type="number"
            value={attachData.deductionAmount}
            onChange={(e) =>
              setAttachData({ ...attachData, deductionAmount: e.target.value })
            }
          />
          <Textarea
            label="Description (Optional)"
            rows={3}
            value={attachData.description}
            onChange={(e) =>
              setAttachData({ ...attachData, description: e.target.value })
            }
          />
        </div>
      </Drawer>

      {/* ══ CONFIRM DIALOGS ══ */}
      <ConfirmDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        title="Delete Expense"
        titleColor="bg-red-600"
        message={`Delete "${deleteData.title}"? This cannot be undone.`}
        onConfirm={handleDelete}
        loading={loading.delete}
        confirmLabel="Delete"
        confirmColor="bg-red-600 hover:bg-red-700"
      />

      <ConfirmDialog
        open={openApprove}
        onClose={() => setOpenApprove(false)}
        title="Approve Expense"
        titleColor="bg-green-600"
        message={`Approve "${selectedExpense?.title}"?`}
        onConfirm={handleApprove}
        loading={loading.approve}
        confirmLabel="Approve"
        confirmColor="bg-green-600 hover:bg-green-700"
      >
        <div className="bg-green-50 rounded-lg p-3 mb-2">
          <p className="text-sm font-semibold text-green-700">
            Amount: KES{" "}
            {selectedExpense
              ? parseFloat(selectedExpense.total_amount).toLocaleString()
              : 0}
          </p>
        </div>
      </ConfirmDialog>

      <ConfirmDialog
        open={openReject}
        onClose={() => {
          setOpenReject(false)
          setRejectionReason("")
        }}
        title="Reject Expense"
        titleColor="bg-red-600"
        message={`Reject "${selectedExpense?.title}"?`}
        onConfirm={handleReject}
        loading={loading.reject}
        confirmLabel="Reject"
        confirmColor="bg-red-600 hover:bg-red-700"
      >
        <Textarea
          label="Rejection Reason *"
          rows={3}
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          placeholder="Provide a reason..."
        />
      </ConfirmDialog>

      <ConfirmDialog
        open={openMarkPaid}
        onClose={() => setOpenMarkPaid(false)}
        title="Mark as Paid"
        titleColor="bg-blue-600"
        message={`Mark "${selectedExpense?.title}" as paid?`}
        onConfirm={handleMarkPaid}
        loading={loading.markPaid}
        confirmLabel="Mark Paid"
        confirmColor="bg-blue-600 hover:bg-blue-700"
      >
        <div className="bg-blue-50 rounded-lg p-3 mb-2">
          <p className="text-sm font-semibold text-blue-700">
            Amount: KES{" "}
            {selectedExpense
              ? parseFloat(selectedExpense.total_amount).toLocaleString()
              : 0}
          </p>
        </div>
      </ConfirmDialog>
    </div>
  )
}

export default Expenses
