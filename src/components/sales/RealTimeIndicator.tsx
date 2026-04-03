// @ts-nocheck
import React from "react"
import { useNavigate } from "react-router-dom"
import {
  Refresh,
  CloudSync,
  NotificationsActive,
  NotificationsNone,
  Wifi,
  WifiOff,
} from "@mui/icons-material"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { markAllRead, markAllReadOnServer } from "../../features/notification/notificationSlice"


interface Props {
  enabled?: boolean
  lastUpdated?: string
  dataVersion?: number
  onToggle?: () => void
}

const RealTimeIndicator = ({
  enabled,
  lastUpdated,
  dataVersion = 1,
  onToggle,
}: Props) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()


  const { wsStatus, isOnline, unreadCount, items } = useAppSelector(
    (state) => state.notifications,
  )

  const statusColor = () => {
    if (!isOnline) return "text-red-500"
    if (wsStatus === "connecting") return "text-yellow-500"
    if (wsStatus === "connected") return "text-green-500"
    return "text-gray-400"
  }

  const statusIcon = () => {
    if (!isOnline) return <WifiOff fontSize="small" />
    if (wsStatus === "connecting")
      return <CloudSync fontSize="small" className="animate-pulse" />
    return <Wifi fontSize="small" />
  }

  const statusLabel = () => {
    if (!isOnline) return "Offline"
    if (wsStatus === "connecting") return "Connecting…"
    if (wsStatus === "connected") return "Live"
    return "Disconnected"
  }

  const handleBellClick = () => {
    dispatch(markAllRead()) // optimistic local update
    dispatch(markAllReadOnServer()) // sync to backend
    navigate("/notifications")
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full shadow-lg px-3 py-2">
        {onToggle && (
          <button
            onClick={onToggle}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-sm transition-colors ${
              enabled
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            <Refresh
              fontSize="small"
              className={enabled ? "animate-spin" : ""}
              style={{ animationDuration: "2s" }}
            />
            <span className="hidden sm:inline">
              {enabled ? "Auto" : "Manual"}
            </span>
          </button>
        )}

        <div
          className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-sm ${statusColor()}`}
        >
          {statusIcon()}
          <span className="hidden sm:inline">{statusLabel()}</span>
        </div>

        {lastUpdated && (
          <div className="hidden md:block text-xs text-gray-500 px-2 py-1 bg-gray-50 rounded">
            {lastUpdated}
          </div>
        )}

        <div className="text-xs text-gray-400 px-1">v{dataVersion}</div>

        <button
          onClick={handleBellClick}
          className="relative p-1 rounded-full hover:bg-gray-100 transition-colors"
          title={unreadCount > 0 ? `${unreadCount} unread` : "Notifications"}
        >
          {unreadCount > 0 ? (
            <NotificationsActive fontSize="small" className="text-yellow-600" />
          ) : (
            <NotificationsNone fontSize="small" className="text-gray-400" />
          )}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-red-500 text-white text-[10px] font-semibold rounded-full flex items-center justify-center px-[3px]">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>
      </div>
    </div>
  )
}

export default RealTimeIndicator
