// @ts-nocheck
import React, { useEffect, useRef, useState } from "react"
import { useMediaQuery, useTheme } from "@mui/material"
import planStatus from "../../features/planStatus/planStatus"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Navbar from "../../components/ui/mobile/admin/Navbar"
import AdminsFooter from "../../components/AdminsFooter"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Switch,
  FormControlLabel,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Collapse,
  Avatar,
  Badge,
} from "@mui/material"
import {
  Send,
  Email,
  Phone,
  Person,
  Business,
  History,
  CloudUpload,
  ContentCopy,
  Close,
  Add,
  Search,
  WhatsApp,
  Chat,
  CheckCircle,
  Warning,
  MoneyOff,
  Groups,
  FilterList,
  Schedule,
  Receipt,
} from "@mui/icons-material"
import api from "../../../utils/api"
import DateDisplay from "../../components/DateDisplay"
import {
  fetchLocations,
  selectAllLocations,
} from "../../features/location/locationSlice"
import {
  fetchCustomers,
  selectAllCustomers,
} from "../../features/customers/customerSlice"
import {
  fetchEmployees,
  selectAllEmployees,
} from "../../features/employees/employeesSlice"
import RealTimeIndicator from "../../components/sales/RealTimeIndicator"

// ── Inline SVG icons matching the app style ──────────────────────────────────
const Icons = {
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
  SMS: () => (
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
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  ),
  Email: () => (
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
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  ),
  WhatsApp: () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  ),
}

const ReachoutGroup = () => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const locations = useAppSelector(selectAllLocations)
  const customers = useAppSelector(selectAllCustomers)
  const employees = useAppSelector(selectAllEmployees)

  const messageTextareaRef = useRef<HTMLTextAreaElement | null>(null)

  const [activeCommType, setActiveCommType] = useState("SMS")
  const [activeTab, setActiveTab] = useState("compose") // compose | recipients | history
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showRecipientList, setShowRecipientList] = useState(false)
  const [message, setMessage] = useState("")
  const [subject, setSubject] = useState("")
  const [scheduleSend, setScheduleSend] = useState(false)
  const [scheduleDate, setScheduleDate] = useState("")
  const [scheduleTime, setScheduleTime] = useState("")
  const [attachments, setAttachments] = useState<File[]>([])
  const [messageHistory, setMessageHistory] = useState<any[]>([])
  const [openPreview, setOpenPreview] = useState(false)
  const [showAlert, setShowAlert] = useState(false)

  // Advanced Features
  const [batchMode, setBatchMode] = useState(false)
  const [selectedBatchItems, setSelectedBatchItems] = useState([])
  const [lastUpdated, setLastUpdated] = useState(null)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [realTimeEnabled, setRealTimeEnabled] = useState(false)
  const [dataVersion, setDataVersion] = useState(0)

  const messageTemplates = [
    {
      id: 1,
      name: "Payment Reminder",
      content:
        "Dear {name}, your payment of KES {amount} is due on {date}. Please make payment at your earliest convenience.",
    },
    {
      id: 2,
      name: "Debt Reminder",
      content:
        "Dear {name}, you have an outstanding balance of KES {amount}. Kindly settle this balance to continue enjoying our services.",
    },
    {
      id: 3,
      name: "New Product",
      content:
        "Exciting news! We have new products available. Visit us today to explore our latest offerings.",
    },
    {
      id: 4,
      name: "Service Update",
      content:
        "Important update: We have improved our services. Contact us for more details.",
    },
    {
      id: 5,
      name: "Thank You",
      content:
        "Dear {name}, thank you for your continued business. We appreciate your loyalty!",
    },
  ]

  // ── Computed stats ────────────────────────────────────────────────────────
  const debtorCount = customers.filter((c) => c.debt_summary !== null).length
  const stats = [
    {
      label: "Total Customers",
      value: customers.length,
      color: "text-blue-600",
      border: "border-blue-500",
      icon: "👥",
    },
    {
      label: "Total Employees",
      value: employees.length,
      color: "text-purple-600",
      border: "border-purple-500",
      icon: "👤",
    },
    {
      label: "Debtors",
      value: debtorCount,
      color: "text-yellow-600",
      border: "border-yellow-500",
      icon: "💰",
    },
    {
      label: "Locations",
      value: locations.length,
      color: "text-green-600",
      border: "border-green-500",
      icon: "📍",
    },
  ]

  useEffect(() => {
    dispatch(fetchLocations())
    dispatch(fetchCustomers({}))
    dispatch(fetchEmployees())
    loadMessageHistory()
  }, [dispatch])

  const loadMessageHistory = async () => {
    try {
      const res = await api.get("/communication-history/")
      if (res.status === 200) setMessageHistory(res.data)
    } catch {}
  }

  const handleGroupChange = (group: string) => {
    setSelectedGroup(group)
    if (group === "custom") {
      setShowRecipientList(true)
      return
    }

    let recipients: string[] = []
    if (group === "all") {
      recipients = [
        ...customers.map((c) => c.phone),
        ...employees.map((e) => e.phone_number || e.phone),
      ]
    } else if (group === "wholesale") {
      recipients = customers
        .filter((c) => c.sales === "WHOLESALE")
        .map((c) => c.phone)
    } else if (group === "retail") {
      recipients = customers
        .filter((c) => c.sales === "RETAIL")
        .map((c) => c.phone)
    } else if (group === "debtors") {
      // ✅ uses debt_summary (not old customer_debt)
      recipients = customers
        .filter((c) => c.debt_summary !== null)
        .map((c) => c.phone)
    } else if (group === "employees") {
      recipients = employees.map((e) => e.phone_number || e.phone)
    }
    setSelectedRecipients(recipients.filter(Boolean))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (!message || selectedRecipients.length === 0) return
    setIsSubmitting(true)
    try {
      const endpoints: Record<string, string> = {
        SMS: "/sendbulksms/",
        EMAIL: "/sendbulkemail/",
        WHATSAPP: "/sendbulkwhatsapp/",
      }
      const formData = new FormData()
      formData.append("selected_group", selectedGroup)
      formData.append("selected_location", selectedLocation)
      formData.append("message", message)
      formData.append("communication_type", activeCommType)
      formData.append("subject", subject)
      formData.append("recipients", JSON.stringify(selectedRecipients))
      if (scheduleSend && scheduleDate && scheduleTime) {
        formData.append("schedule_date", scheduleDate)
        formData.append("schedule_time", scheduleTime)
      }
      attachments.forEach((file, i) => formData.append(`attachment_${i}`, file))

      const res = await api.post(endpoints[activeCommType], formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      if (res.status === 201) {
        toast.success(
          `${activeCommType} sent to ${selectedRecipients.length} recipients!`,
        )
        setMessage("")
        setSubject("")
        setAttachments([])
        setSelectedRecipients([])
        setShowAlert(true)
        loadMessageHistory()
        setTimeout(() => setShowAlert(false), 5000)
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send message")
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredCustomers = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone?.toString().includes(searchQuery),
  )
  const filteredEmployees = employees.filter(
    (e) =>
      e.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.phone_number?.toString().includes(searchQuery),
  )

  const commTypes = [
    {
      type: "SMS",
      icon: <Icons.SMS />,
      color: "bg-blue-500",
      activeColor: "bg-blue-600",
    },
    {
      type: "EMAIL",
      icon: <Icons.Email />,
      color: "bg-yellow-500",
      activeColor: "bg-yellow-600",
    },
    {
      type: "WHATSAPP",
      icon: <Icons.WhatsApp />,
      color: "bg-green-500",
      activeColor: "bg-green-600",
    },
  ]

  const groups = [
    {
      value: "all",
      label: "All Contacts",
      icon: "👥",
      count: customers.length + employees.length,
    },
    {
      value: "retail",
      label: "Retail Customers",
      icon: "🛒",
      count: customers.filter((c) => c.sales === "RETAIL").length,
    },
    {
      value: "wholesale",
      label: "Wholesale Customers",
      icon: "🏭",
      count: customers.filter((c) => c.sales === "WHOLESALE").length,
    },
    {
      value: "debtors",
      label: "Customers with Debt",
      icon: "💰",
      count: debtorCount,
    },
    {
      value: "employees",
      label: "All Employees",
      icon: "👤",
      count: employees.length,
    },
    { value: "custom", label: "Custom Selection", icon: "✏️", count: null },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-gray-800 flex flex-col font-sans">
      <ToastContainer position="top-center" />
      <Navbar
        headerMessage="Communication Hub"
        headerText="Reach out to customers and employees efficiently"
      />

      <div className="prevent-overflow">
        <RealTimeIndicator
          enabled={autoRefresh}
          lastUpdated={lastUpdated}
          dataVersion={dataVersion}
          onToggle={() => setAutoRefresh(!autoRefresh)}
        />
      </div>
      <main className="flex-grow m-2 p-1 pb-4">
        {/* ── Header ── */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-1">
            <span>📢</span> Reach Out
          </h2>
          <p className="text-sm text-gray-500">
            Send SMS, Email or WhatsApp to your customers and employees
          </p>
        </div>

        {/* ── Stats Cards ── */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className={`bg-white p-4 rounded-lg shadow-md border-l-4 ${s.border}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{s.label}</p>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                </div>
                <span className="text-3xl">{s.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Nav Tabs ── */}
        <div className="bg-white rounded-lg shadow-md mb-4 overflow-hidden">
          <div className="flex border-b border-gray-200">
            {[
              { key: "compose", label: "Compose", icon: "✏️" },
              { key: "recipients", label: "Recipients", icon: "👥" },
              { key: "history", label: "History", icon: "📋" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-3 flex items-center justify-center gap-2 text-sm font-semibold transition-all ${
                  activeTab === tab.key
                    ? "border-b-2 border-blue-500 text-blue-600 bg-blue-50"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── COMPOSE TAB ── */}
        {activeTab === "compose" && (
          <div className="space-y-4">
            {/* Communication type picker */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-sm font-semibold text-gray-700 mb-3">
                Send via
              </p>
              <div className="flex gap-3">
                {commTypes.map(({ type, icon, color, activeColor }) => (
                  <button
                    key={type}
                    onClick={() => setActiveCommType(type)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                      activeCommType === type
                        ? `${activeColor} text-white shadow-md scale-105`
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {icon}
                    <span>{type}</span>
                    {selectedRecipients.length > 0 &&
                      activeCommType === type && (
                        <span className="bg-white bg-opacity-30 text-white text-xs px-1.5 py-0.5 rounded-full">
                          {selectedRecipients.length}
                        </span>
                      )}
                  </button>
                ))}
              </div>
            </div>

            {/* Group picker */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-sm font-semibold text-gray-700 mb-3">
                Send to group
              </p>
              <div className="grid grid-cols-2 gap-2">
                {groups.map((g) => (
                  <button
                    key={g.value}
                    onClick={() => handleGroupChange(g.value)}
                    className={`flex items-center gap-2 p-3 rounded-lg border-2 text-left transition-all ${
                      selectedGroup === g.value
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300 text-gray-700"
                    }`}
                  >
                    <span className="text-lg">{g.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate">
                        {g.label}
                      </p>
                      {g.count !== null && (
                        <p className="text-xs text-gray-500">
                          {g.count} contacts
                        </p>
                      )}
                    </div>
                    {selectedGroup === g.value && (
                      <span className="text-blue-500">✓</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Selected count badge */}
              {selectedRecipients.length > 0 && (
                <div className="mt-3 flex items-center justify-between p-2 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="text-sm text-blue-700 font-semibold">
                    ✓ {selectedRecipients.length} recipients selected
                  </span>
                  <button
                    onClick={() => setSelectedRecipients([])}
                    className="text-xs text-red-500 hover:text-red-700 font-medium"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>

            {/* Subject (email only) */}
            {activeCommType === "EMAIL" && (
              <div className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Subject
                </p>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter email subject..."
                  required
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition text-sm"
                />
              </div>
            )}

            {/* Templates */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-sm font-semibold text-gray-700 mb-3">
                Quick Templates
              </p>
              <div className="flex gap-2 flex-wrap">
                {messageTemplates.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setMessage(t.content)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all ${
                      message === t.content
                        ? "border-blue-500 bg-blue-500 text-white"
                        : "border-gray-300 text-gray-600 hover:border-blue-300 hover:text-blue-600"
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Message box */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-gray-700">Message</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">
                    {message.length} chars
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(message)
                      toast.success("Copied!")
                    }}
                    className="text-gray-400 hover:text-gray-600 transition"
                  >
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
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => setOpenPreview(true)}
                    className="text-blue-400 hover:text-blue-600 transition text-xs font-medium"
                  >
                    Preview
                  </button>
                </div>
              </div>
              <textarea
                ref={messageTextareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                required
                placeholder="Type your message here..."
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition text-sm resize-none"
              />
            </div>

            {/* Attachments (email/whatsapp) */}
            {(activeCommType === "EMAIL" || activeCommType === "WHATSAPP") && (
              <div className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Attachments
                </p>
                <label
                  htmlFor="file-upload"
                  className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition w-fit"
                >
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <span className="text-sm text-gray-500">Upload files</span>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    onChange={(e) => {
                      if (e.target.files)
                        setAttachments([
                          ...attachments,
                          ...Array.from(e.target.files),
                        ])
                    }}
                    className="hidden"
                  />
                </label>
                {attachments.length > 0 && (
                  <div className="mt-2 flex gap-2 flex-wrap">
                    {attachments.map((f, i) => (
                      <span
                        key={i}
                        className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-700"
                      >
                        📎 {f.name}
                        <button
                          onClick={() =>
                            setAttachments(
                              attachments.filter((_, j) => j !== i),
                            )
                          }
                          className="text-red-400 hover:text-red-600 ml-1"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Schedule */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    Schedule Send
                  </p>
                  <p className="text-xs text-gray-400">
                    Send at a specific date and time
                  </p>
                </div>
                <button
                  onClick={() => setScheduleSend(!scheduleSend)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    scheduleSend ? "bg-blue-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      scheduleSend ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              {scheduleSend && (
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Time
                    </label>
                    <input
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none text-sm"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              {showAlert && (
                <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700 text-sm">
                  <span>✓</span> Message sent successfully to{" "}
                  {selectedRecipients.length} recipients!
                </div>
              )}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setMessage("")
                    setSelectedRecipients([])
                    setAttachments([])
                  }}
                  className="flex-1 py-3 border-2 border-gray-300 rounded-lg text-gray-600 font-semibold text-sm hover:bg-gray-50 transition"
                >
                  Clear
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={
                    isSubmitting || !message || selectedRecipients.length === 0
                  }
                  className={`flex-1 py-3 rounded-lg font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all ${
                    isSubmitting || !message || selectedRecipients.length === 0
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg active:scale-95"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                      Sending...
                    </>
                  ) : (
                    <>
                      <Icons.SMS /> Send {activeCommType} (
                      {selectedRecipients.length})
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── RECIPIENTS TAB ── */}
        {activeTab === "recipients" && (
          <div className="space-y-4">
            {/* Search */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Icons.Search />
                </div>
                <input
                  type="text"
                  placeholder="Search by name or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                />
              </div>
            </div>

            {/* Selected recipients pill list */}
            {selectedRecipients.length > 0 && (
              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-700">
                    Selected ({selectedRecipients.length})
                  </p>
                  <button
                    onClick={() => setSelectedRecipients([])}
                    className="text-xs text-red-500 hover:text-red-700 font-medium"
                  >
                    Clear all
                  </button>
                </div>
                <div className="flex gap-2 flex-wrap max-h-32 overflow-y-auto">
                  {selectedRecipients.map((r, i) => (
                    <span
                      key={i}
                      className="flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs text-blue-700 font-medium"
                    >
                      {r}
                      <button
                        onClick={() =>
                          setSelectedRecipients(
                            selectedRecipients.filter((x) => x !== r),
                          )
                        }
                        className="text-blue-400 hover:text-red-500 ml-0.5"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Customers */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-700">
                  Customers ({filteredCustomers.length})
                </p>
                <button
                  onClick={() => {
                    const phones = filteredCustomers
                      .map((c) => c.phone)
                      .filter(Boolean)
                    setSelectedRecipients([
                      ...new Set([...selectedRecipients, ...phones]),
                    ])
                  }}
                  className="text-xs text-blue-500 hover:text-blue-700 font-medium"
                >
                  Add all
                </button>
              </div>
              <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
                {filteredCustomers.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 transition"
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                        c.sales === "WHOLESALE"
                          ? "bg-blue-500"
                          : "bg-purple-500"
                      }`}
                    >
                      {c.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {c.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {c.phone} · {c.sales}
                      </p>
                      {c.debt_summary && (
                        <p className="text-xs text-yellow-600 font-medium">
                          💰 Owes KES{" "}
                          {parseFloat(
                            c.debt_summary.total_remaining,
                          ).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        if (!selectedRecipients.includes(c.phone)) {
                          setSelectedRecipients([
                            ...selectedRecipients,
                            c.phone,
                          ])
                        }
                      }}
                      disabled={selectedRecipients.includes(c.phone)}
                      className={`px-2 py-1 rounded-lg text-xs font-semibold transition ${
                        selectedRecipients.includes(c.phone)
                          ? "bg-green-100 text-green-600 cursor-default"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                    >
                      {selectedRecipients.includes(c.phone) ? "✓" : "+ Add"}
                    </button>
                  </div>
                ))}
                {filteredCustomers.length === 0 && (
                  <p className="p-4 text-center text-sm text-gray-400">
                    No customers found
                  </p>
                )}
              </div>
            </div>

            {/* Employees */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-700">
                  Employees ({filteredEmployees.length})
                </p>
                <button
                  onClick={() => {
                    const phones = filteredEmployees
                      .map((e) => e.phone_number || e.phone)
                      .filter(Boolean)
                    setSelectedRecipients([
                      ...new Set([...selectedRecipients, ...phones]),
                    ])
                  }}
                  className="text-xs text-blue-500 hover:text-blue-700 font-medium"
                >
                  Add all
                </button>
              </div>
              <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
                {filteredEmployees.map((e) => (
                  <div
                    key={e.id}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 transition"
                  >
                    <div className="w-9 h-9 rounded-full bg-yellow-500 flex items-center justify-center text-white text-sm font-bold">
                      {(e.first_name || e.name)?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {e.first_name && e.last_name
                          ? `${e.first_name} ${e.last_name}`
                          : e.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {e.phone_number || e.phone}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        const phone = e.phone_number || e.phone
                        if (phone && !selectedRecipients.includes(phone)) {
                          setSelectedRecipients([...selectedRecipients, phone])
                        }
                      }}
                      disabled={selectedRecipients.includes(
                        e.phone_number || e.phone,
                      )}
                      className={`px-2 py-1 rounded-lg text-xs font-semibold transition ${
                        selectedRecipients.includes(e.phone_number || e.phone)
                          ? "bg-green-100 text-green-600 cursor-default"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                    >
                      {selectedRecipients.includes(e.phone_number || e.phone)
                        ? "✓"
                        : "+ Add"}
                    </button>
                  </div>
                ))}
                {filteredEmployees.length === 0 && (
                  <p className="p-4 text-center text-sm text-gray-400">
                    No employees found
                  </p>
                )}
              </div>
            </div>

            {/* Go to compose */}
            {selectedRecipients.length > 0 && (
              <button
                onClick={() => setActiveTab("compose")}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition flex items-center justify-center gap-2"
              >
                <Icons.SMS /> Compose message for {selectedRecipients.length}{" "}
                recipients →
              </button>
            )}
          </div>
        )}

        {/* ── HISTORY TAB ── */}
        {activeTab === "history" && (
          <div className="space-y-3">
            {messageHistory.length === 0 ? (
              <div className="bg-white p-12 rounded-lg shadow-md text-center">
                <div className="text-6xl mb-4">📋</div>
                <p className="text-gray-500 text-lg font-medium">
                  No message history yet
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Messages you send will appear here
                </p>
              </div>
            ) : (
              messageHistory.map((item, i) => (
                <div
                  key={i}
                  className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-400"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">
                        {item.type === "SMS"
                          ? "💬"
                          : item.type === "EMAIL"
                          ? "📧"
                          : "📱"}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {item.type} · {item.group}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.recipient_count} recipients
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${
                        item.status === "SENT"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {item.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    <DateDisplay date={item.created_at} />
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* Preview Dialog */}
      <Dialog
        open={openPreview}
        onClose={() => setOpenPreview(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ className: "rounded-lg" }}
      >
        <DialogTitle className="font-semibold bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <span>Message Preview</span>
            <IconButton
              size="small"
              onClick={() => setOpenPreview(false)}
              sx={{ color: "white" }}
            >
              <Close />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-400 mb-2 font-medium">
              {activeCommType} · {selectedRecipients.length} recipients
            </p>
            {subject && (
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Subject: {subject}
              </p>
            )}
            <p className="text-sm text-gray-800 whitespace-pre-wrap">
              {message || "No message to preview"}
            </p>
          </div>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <button
            onClick={() => setOpenPreview(false)}
            className="px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-600 text-sm font-semibold hover:bg-gray-50 transition"
          >
            Close
          </button>
          <button
            onClick={() => {
              setOpenPreview(false)
              handleSubmit({ preventDefault: () => {} })
            }}
            disabled={!message || selectedRecipients.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition disabled:bg-gray-300"
          >
            Send Now
          </button>
        </DialogActions>
      </Dialog>

      <footer className="text-white mt-4">
        <AdminsFooter />
      </footer>
    </div>
  )
}

export default ReachoutGroup
