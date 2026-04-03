// store/slices/notificationsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import cookies from "cookies-js"

export interface WSNotification {
  id: number
  title: string
  message: string
  priority: 1 | 2 | 3 | 4
  category: string | null
  action_url: string
  action_text: string
  created_at: string
  read: boolean
}

export type WsStatus = "idle" | "connecting" | "connected" | "disconnected"

interface NotificationsState {
  items: WSNotification[]
  wsStatus: WsStatus
  isOnline: boolean
  unreadCount: number
  audioEnabled: boolean
  lastPlayed: number | null
}

const loadFromSession = (): WSNotification[] => {
  try {
    return JSON.parse(sessionStorage.getItem("notifications") ?? "[]")
  } catch {
    return []
  }
}

const loadAudioPref = (): boolean => {
  try {
    return JSON.parse(localStorage.getItem("notificationAudio") ?? "true")
  } catch {
    return true
  }
}

const initialState: NotificationsState = {
  items: loadFromSession(),
  wsStatus: "idle",
  isOnline: navigator.onLine,
  unreadCount: loadFromSession().filter((n) => !n.read).length,
  audioEnabled: loadAudioPref(),
  lastPlayed: null,
}

// ── Async thunk — fetch existing unread from API ──────────────────────────────
export const fetchUnreadNotifications = createAsyncThunk(
  "notifications/fetchUnread",
  async (_, { rejectWithValue }) => {
    const token = cookies.get("accessToken")
    if (!token) return rejectWithValue("No token")

    try {
      const res = await fetch("/api/v1/notifications/my/?status=unread", {
        headers: { Authorization: `Bearer ${token}` },
      })

      // Check content type before parsing — catches HTML error pages
      const contentType = res.headers.get("content-type") ?? ""
      if (!contentType.includes("application/json")) {
        return rejectWithValue(
          `Server returned non-JSON response (${res.status})`,
        )
      }

      if (!res.ok) {
        const err = await res.json()
        return rejectWithValue(err?.detail ?? `Error ${res.status}`)
      }

      const data = await res.json()
      console.log("[WS] Fetched unread notifications:", data)
      return (data.results ?? []).map((n: any) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        priority: n.priority ?? 2,
        category: n.category?.slug ?? null,
        action_url: n.action_url ?? "",
        action_text: n.action_text ?? "",
        created_at: n.created_at,
        read: false,
      })) as WSNotification[]
    } catch (e: any) {
      // Always pass a plain string — never an Error object
      return rejectWithValue(e?.message ?? "Network error")
    }
  },
)

// ── Async thunk — mark all read on API ───────────────────────────────────────
export const markAllReadOnServer = createAsyncThunk(
  "notifications/markAllRead",
  async (_, { rejectWithValue }) => {
    const token = cookies.get("accessToken")
    if (!token) return rejectWithValue("No token")
    try {
      await fetch("/api/v1/notifications/my/read-all/", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
    } catch (e) {
      return rejectWithValue(e)
    }
  },
)

// ── Slice ─────────────────────────────────────────────────────────────────────
const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    // Called by the WebSocket middleware when a message arrives
    pushNotification(state, action: PayloadAction<WSNotification>) {
      const exists = state.items.some((n) => n.id === action.payload.id)
      if (!exists) {
        state.items.unshift({ ...action.payload, read: false })
        if (state.items.length > 99) state.items.pop()
      }
      state.unreadCount = state.items.filter((n) => !n.read).length
      sessionStorage.setItem("notifications", JSON.stringify(state.items))
    },

    markRead(state, action: PayloadAction<number>) {
      const n = state.items.find((n) => n.id === action.payload)
      if (n) n.read = true
      state.unreadCount = state.items.filter((n) => !n.read).length
      sessionStorage.setItem("notifications", JSON.stringify(state.items))
    },

    markAllRead(state) {
      state.items.forEach((n) => (n.read = true))
      state.unreadCount = 0
      sessionStorage.setItem("notifications", JSON.stringify(state.items))
    },

    clearAll(state) {
      state.items = []
      state.unreadCount = 0
      sessionStorage.removeItem("notifications")
    },

    setWsStatus(state, action: PayloadAction<WsStatus>) {
      state.wsStatus = action.payload
    },

    setIsOnline(state, action: PayloadAction<boolean>) {
      state.isOnline = action.payload
    },
    setAudioEnabled(state, action: PayloadAction<boolean>) {
      state.audioEnabled = action.payload
      localStorage.setItem("notificationAudio", JSON.stringify(action.payload))
    },
    playNotificationSound(state, action: PayloadAction<WSNotification>) {
      const now = Date.now()
      // Throttle sounds to prevent overwhelming (min 500ms between sounds)
      if (state.lastPlayed && now - state.lastPlayed < 500) {
        return
      }
      state.lastPlayed = now

      // This will be handled by the audio service in the component
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchUnreadNotifications.fulfilled, (state, action) => {
      const fetched = action.payload
      const fetchedIds = new Set(fetched.map((n: WSNotification) => n.id))
      const wsOnly = state.items.filter((n) => !fetchedIds.has(n.id))

      const existingIds = new Set(state.items.map((n) => n.id))
      const fresh = action.payload.filter((n) => !existingIds.has(n.id))
      state.items = [...fetched, ...wsOnly].slice(0, 99)
      state.unreadCount = state.items.filter((n) => !n.read).length
      console.log("items after fetch:", state.items)
      //   state.unreadCount = state.items.filter((n) => !n.read).length
      console.log("[SLICE] unreadCount after:", state.unreadCount)

      sessionStorage.setItem("notifications", JSON.stringify(state.items))
    })

    builder.addCase(markAllReadOnServer.fulfilled, (state) => {
      state.items.forEach((n) => (n.read = true))
      state.unreadCount = 0
      sessionStorage.setItem("notifications", JSON.stringify(state.items))
    })

  },
})

export const showBrowserNotification = (notification: WSNotification) => {
  if (!("Notification" in window)) return

  if (Notification.permission === "granted") {
    new Notification(notification.title, {
      body: notification.message,
      icon: "/icons/stock-alert-icon.png", // Add your icon
      tag: `stock-${notification.id}`,
      requireInteraction: true, // Keeps notification visible until user interacts
    })
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission()
  }
}

export const {
  pushNotification,
  markRead,
  markAllRead,
  clearAll,
  setWsStatus,
  setIsOnline,
  setAudioEnabled,
  playNotificationSound,
} = notificationsSlice.actions

export default notificationsSlice.reducer
