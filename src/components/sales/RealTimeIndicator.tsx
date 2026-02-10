// @ts-nocheck
import React, { useState, useEffect } from "react"
import {
  Refresh,
  CloudSync,
  NotificationsActive,
  Wifi,
  WifiOff,
} from "@mui/icons-material"

const RealTimeIndicator = ({ enabled, lastUpdated, dataVersion, onToggle }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [syncStatus, setSyncStatus] = useState("idle")
  const [notifications, setNotifications] = useState([])

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Simulate sync status changes
  useEffect(() => {
    if (enabled && isOnline) {
      setSyncStatus("syncing")
      const timer = setTimeout(() => setSyncStatus("synced"), 2000)
      return () => clearTimeout(timer)
    }
  }, [dataVersion, enabled, isOnline])

  const getSyncColor = () => {
    if (!isOnline) return "text-red-500"
    if (syncStatus === "syncing") return "text-yellow-500"
    if (syncStatus === "synced") return "text-green-500"
    return "text-gray-500"
  }

  const getSyncIcon = () => {
    if (!isOnline) return <WifiOff fontSize="small" />
    if (syncStatus === "syncing")
      return <CloudSync fontSize="small" className="animate-pulse" />
    if (syncStatus === "synced") return <Wifi fontSize="small" />
    return <Wifi fontSize="small" />
  }

  const getSyncText = () => {
    if (!isOnline) return "Offline"
    if (syncStatus === "syncing") return "Syncing..."
    if (syncStatus === "synced") return "Synced"
    return "Online"
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full shadow-lg px-3 py-2">
        {/* Auto-refresh Toggle */}
        <button
          onClick={onToggle}
          className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-sm ${
            enabled ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
          }`}
          title={enabled ? "Auto-refresh enabled" : "Auto-refresh disabled"}
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

        {/* Connection Status */}
        <div
          className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-sm ${getSyncColor()}`}
        >
          {getSyncIcon()}
          <span className="hidden sm:inline">{getSyncText()}</span>
        </div>

        {/* Last Updated */}
        {lastUpdated && (
          <div className="hidden md:block text-xs text-gray-500 px-2 py-1 bg-gray-50 rounded">
            Updated: {lastUpdated}
          </div>
        )}

        {/* Data Version */}
        <div className="text-xs text-gray-400 px-2">v{dataVersion}</div>

        {/* Notifications */}
        {notifications.length > 0 && (
          <button className="relative">
            <NotificationsActive fontSize="small" className="text-yellow-600" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {notifications.length}
            </span>
          </button>
        )}
      </div>
    </div>
  )
}

export default RealTimeIndicator;
