// @ts-nocheck
import React, { useState, useMemo, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowBack,
  Email,
  Sms,
  DoneAll,
  DeleteSweep,
  NotificationsNone,
  FilterList,
} from "@mui/icons-material"
import type { WSNotification } from "./RealTimeIndicator"
import Navbar from "../components/ui/mobile/admin/Navbar"
import AdminsFooter from "../components/AdminsFooter"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// ─── Icons (matching Expenses page style) ─────────────────────────────────────
const Icon = {
  Bell: () => (
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
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      />
    </svg>
  ),
  Email: () => (
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
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  ),
  Sms: () => (
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
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
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
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return new Date(isoString).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })
}

function groupByDate(
  notifications: WSNotification[],
): Record<string, WSNotification[]> {
  const groups: Record<string, WSNotification[]> = {}
  for (const n of notifications) {
    const d = new Date(n.created_at)
    const today = new Date()
    const yesterday = new Date()
    yesterday.setDate(today.getDate() - 1)

    let label: string
    if (d.toDateString() === today.toDateString()) label = "Today"
    else if (d.toDateString() === yesterday.toDateString()) label = "Yesterday"
    else
      label = d.toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
      })

    groups[label] = groups[label] ?? []
    groups[label].push(n)
  }
  return groups
}

// ─── Type Badge (matching Expenses page badge style) ──────────────────────────
const TypeBadge = ({ type }: { type: "EMAIL" | "SMS" }) => {
  const isEmail = type === "EMAIL"
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${
        isEmail ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
      }`}
    >
      {isEmail ? <Icon.Email /> : <Icon.Sms />}
      {type}
    </span>
  )
}

// ─── Status Badge for Read/Unread ─────────────────────────────────────────────
const ReadStatusBadge = ({ read }: { read: boolean }) => {
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-bold ${
        read ? "bg-gray-100 text-gray-500" : "bg-blue-100 text-blue-700"
      }`}
    >
      {read ? "Read" : "Unread"}
    </span>
  )
}

// ─── Notification Card (matching Expenses card style) ─────────────────────────
const NotificationCard = ({
  notification,
  onMarkRead,
}: {
  notification: WSNotification
  onMarkRead: (id: number) => void
}) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      onClick={() => onMarkRead(notification.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`bg-white rounded-lg shadow-md border-l-4 overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
        !notification.read
          ? "border-blue-500 hover:border-blue-600"
          : "border-gray-300 hover:border-gray-400"
      }`}
    >
      <div className="p-4">
        {/* Card header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <TypeBadge type={notification.type} />
              <ReadStatusBadge read={notification.read} />
            </div>
          </div>
          <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
            {timeAgo(notification.created_at)}
          </span>
        </div>

        {/* Message content */}
        <p
          className={`text-sm leading-relaxed mb-3 ${
            !notification.read ? "text-gray-800 font-medium" : "text-gray-600"
          }`}
        >
          {notification.message}
        </p>

        {/* Full timestamp */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">
            {new Date(notification.created_at).toLocaleString()}
          </p>

          {/* Mark as read indicator */}
          {!notification.read && isHovered && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onMarkRead(notification.id)
              }}
              className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-100 transition"
            >
              <Icon.Check /> Mark read
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Stats Cards (matching Expenses page summary cards) ───────────────────────
const StatsCard = ({ label, value, color, border, icon }: any) => (
  <div className={`bg-white p-4 rounded-lg shadow-md border-l-4 ${border}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className={`text-xl font-bold ${color}`}>{value}</p>
      </div>
      <span className="text-3xl">{icon}</span>
    </div>
  </div>
)

// ─── Empty State (matching Expenses empty state style) ────────────────────────
const EmptyState = ({ filtered }: { filtered: boolean }) => (
  <div className="bg-white rounded-lg shadow-md p-12 text-center">
    <div className="text-6xl mb-4">🔔</div>
    <p className="text-gray-500 text-lg font-medium mb-1">
      {filtered ? "No notifications match this filter" : "All caught up"}
    </p>
    <p className="text-gray-400 text-sm">
      {filtered
        ? "Try adjusting your filter"
        : "New notifications will appear here in real time"}
    </p>
  </div>
)

// ─── Main Component ───────────────────────────────────────────────────────────
type Filter = "all" | "unread" | "EMAIL" | "SMS"

const NotificationsPage = () => {
  const navigate = useNavigate()

  const [notifications, setNotifications] = useState<WSNotification[]>(() => {
    try {
      return JSON.parse(sessionStorage.getItem("notifications") ?? "[]")
    } catch {
      return []
    }
  })

  const [filter, setFilter] = useState<Filter>("all")
  const [showFilters, setShowFilters] = useState(false)

  // ── Actions ─────────────────────────────────────────────────────────────
  const markRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    )
    sync((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
    toast.success("Notification marked as read")
  }

  const markAllRead = () => {
    if (unreadCount === 0) {
      toast.info("No unread notifications")
      return
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    sync((prev) => prev.map((n) => ({ ...n, read: true })))
    toast.success("All notifications marked as read")
  }

  const clearAll = () => {
    if (notifications.length === 0) return
    setNotifications([])
    sessionStorage.removeItem("notifications")
    toast.success("All notifications cleared")
  }

  /** Write back to sessionStorage so the indicator stays in sync */
  const sync = (updater: (prev: WSNotification[]) => WSNotification[]) => {
    try {
      const current: WSNotification[] = JSON.parse(
        sessionStorage.getItem("notifications") ?? "[]",
      )
      sessionStorage.setItem("notifications", JSON.stringify(updater(current)))
    } catch {
      // ignore
    }
  }

  // ── Filtered & grouped ───────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      if (filter === "unread") return !n.read
      if (filter === "EMAIL") return n.type === "EMAIL"
      if (filter === "SMS") return n.type === "SMS"
      return true
    })
  }, [notifications, filter])

  const grouped = useMemo(() => groupByDate(filtered), [filtered])
  const groupKeys = Object.keys(grouped)

  const unreadCount = notifications.filter((n) => !n.read).length
  const totalFiltered = filtered.length

  // ── Stats data ───────────────────────────────────────────────────────────
  const stats = [
    {
      label: "Total",
      value: notifications.length,
      color: "text-blue-600",
      border: "border-blue-500",
      icon: "🔔",
    },
    {
      label: "Unread",
      value: unreadCount,
      color: "text-yellow-600",
      border: "border-yellow-500",
      icon: "📬",
    },
    {
      label: "Email",
      value: notifications.filter((n) => n.type === "EMAIL").length,
      color: "text-green-600",
      border: "border-green-500",
      icon: "📧",
    },
    {
      label: "SMS",
      value: notifications.filter((n) => n.type === "SMS").length,
      color: "text-purple-600",
      border: "border-purple-500",
      icon: "💬",
    },
  ]

  // ── Filter tabs ──────────────────────────────────────────────────────────
  const statusTabs: { key: Filter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "unread", label: "Unread" },
    { key: "EMAIL", label: "Email" },
    { key: "SMS", label: "SMS" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-gray-800 flex flex-col font-sans">
      <ToastContainer position="top-center" />
      <Navbar
        headerMessage="Notifications"
        headerText="Stay updated with real-time alerts"
      />

      <main className="flex-grow m-2 p-1 pb-24 space-y-4">
        {/* ── Header ── */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-1">
            <span>🔔</span> Notification Center
          </h2>
          <p className="text-sm text-gray-500">
            View and manage all your notifications in one place
          </p>
        </div>

        {/* ── Stats Cards ── */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => (
            <StatsCard key={stat.label} {...stat} />
          ))}
        </div>

        {/* ── Quick Actions ── */}
        <div className="flex gap-2">
          <button
            onClick={markAllRead}
            disabled={unreadCount === 0}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm shadow-md transition active:scale-95 ${
              unreadCount > 0
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <Icon.Check /> Mark All Read
          </button>
          <button
            onClick={clearAll}
            disabled={notifications.length === 0}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm shadow-md transition active:scale-95 ${
              notifications.length > 0
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <Icon.Trash /> Clear All
          </button>
        </div>

        {/* ── Search & Filter ── */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex gap-2 mb-3">
            <div className="relative flex-1">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`w-full flex items-center justify-between px-4 py-2.5 border-2 rounded-lg transition ${
                  showFilters
                    ? "border-blue-500 bg-blue-50 text-blue-600"
                    : "border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span className="text-sm font-medium">
                  {filter === "all" && "All Notifications"}
                  {filter === "unread" && "Unread Only"}
                  {filter === "EMAIL" && "Email Only"}
                  {filter === "SMS" && "SMS Only"}
                </span>
                <Icon.Filter />
              </button>
            </div>
          </div>

          {/* Status tabs */}
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
            {statusTabs.map((tab) => {
              const count =
                tab.key === "all"
                  ? notifications.length
                  : tab.key === "unread"
                  ? unreadCount
                  : tab.key === "EMAIL"
                  ? notifications.filter((n) => n.type === "EMAIL").length
                  : notifications.filter((n) => n.type === "SMS").length

              return (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                    filter === tab.key
                      ? tab.key === "unread"
                        ? "bg-yellow-500 text-white"
                        : tab.key === "EMAIL"
                        ? "bg-blue-500 text-white"
                        : tab.key === "SMS"
                        ? "bg-purple-500 text-white"
                        : "bg-gray-800 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {tab.label}
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-xs ${
                      filter === tab.key
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

          {/* Advanced filters panel */}
          {showFilters && (
            <div className="mt-3 pt-3 border-t border-gray-100 space-y-3">
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                    filter === "all"
                      ? "bg-gray-800 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Show All
                </button>
                <button
                  onClick={() => setFilter("unread")}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                    filter === "unread"
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Unread Only
                </button>
              </div>
              <button
                onClick={() => {
                  setFilter("all")
                  setShowFilters(false)
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
            <span className="font-semibold">{totalFiltered}</span> notifications
            {filter !== "all" && ` · filtered by ${filter}`}
          </p>
        </div>

        {/* ── Notification Cards ── */}
        {groupKeys.length === 0 ? (
          <EmptyState filtered={filter !== "all"} />
        ) : (
          <div className="space-y-4">
            {groupKeys.map((dateLabel) => (
              <div key={dateLabel}>
                {/* Date separator */}
                <div className="mb-3">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide">
                    {dateLabel}
                  </h3>
                </div>

                {/* Cards */}
                <div className="space-y-3">
                  {grouped[dateLabel].map((n) => (
                    <NotificationCard
                      key={n.id}
                      notification={n}
                      onMarkRead={markRead}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Count footer */}
        {/* {notifications.length > 0 && (
          <p className="text-center text-xs text-gray-400 mt-4">
            {notifications.length} notification
            {notifications.length !== 1 ? "s" : ""} stored locally
          </p>
        )} */}
      </main>

      <footer className="text-white mt-4">
        <AdminsFooter />
      </footer>
    </div>
  )
}

export default NotificationsPage
