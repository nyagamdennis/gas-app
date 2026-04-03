// store/middleware/wsMiddleware.ts (updated)
import { Middleware } from "@reduxjs/toolkit"
import cookies from "cookies-js"
import {
  pushNotification,
  setWsStatus,
  setIsOnline,
  fetchUnreadNotifications,
  // playNotificationSound,
  showBrowserNotification,
} from "../features/notification/notificationSlice"

const RECONNECT_DELAY = 3000
const PING_INTERVAL = 30_000

const WS_URL = (token: string) =>
  `${
    window.location.protocol === "https:" ? "wss" : "ws"
  }://127.0.0.1:8000/ws/notifications/?token=${token}`

function getToken(): string | null {
  return cookies.get("accessToken") ?? null
}

// Helper to check if notification is stock depletion
const isStockDepletionNotification = (notification: any): boolean => {
  return (
    notification.category === "stock-depletion" ||
    notification.title?.toLowerCase().includes("stock") ||
    notification.message?.toLowerCase().includes("stock") ||
    notification.message?.toLowerCase().includes("depleted")
  )
}

export const wsMiddleware: Middleware = (store) => {
  let ws: WebSocket | null = null
  let pingInterval: ReturnType<typeof setInterval> | null = null
  let reconnectTimeout: ReturnType<typeof setTimeout> | null = null
  let tokenPollInterval: ReturnType<typeof setInterval> | null = null

  function cleanup() {
    if (pingInterval) clearInterval(pingInterval)
    if (reconnectTimeout) clearTimeout(reconnectTimeout)
    pingInterval = null
    reconnectTimeout = null
  }

  function connect() {
    const token = getToken()
    if (!token) return
    if (!navigator.onLine) return
    if (
      ws?.readyState === WebSocket.OPEN ||
      ws?.readyState === WebSocket.CONNECTING
    )
      return

    store.dispatch(setWsStatus("connecting"))

    ws = new WebSocket(WS_URL(token))

    ws.onopen = () => {
      console.log("[WS] ✅ Connected")
      store.dispatch(setWsStatus("connected"))
      store.dispatch(fetchUnreadNotifications() as any)

      pingInterval = setInterval(() => {
        if (ws?.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: "ping" }))
        }
      }, PING_INTERVAL)
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === "pong") return

        const notification = {
          id: data.id,
          title: data.title,
          message: data.message,
          priority: data.priority ?? 2,
          category: data.category ?? null,
          action_url: data.action_url ?? "",
          action_text: data.action_text ?? "",
          created_at: data.created_at,
          read: false,
          stockDepletion:
            data.category === "stock-depletion"
              ? {
                  productId: data.metadata?.product_id,
                  productName: data.metadata?.product_name,
                  currentStock: data.metadata?.current_stock,
                  threshold: data.metadata?.threshold,
                }
              : undefined,
        }

        store.dispatch(pushNotification(notification))

        // Play sound for stock depletion notifications
        // if (isStockDepletionNotification(notification)) {
        //   store.dispatch(playNotificationSound(notification))

        //   // Show browser notification
        //   if (Notification.permission === "granted") {
        //     showBrowserNotification(notification)
        //   } else if (Notification.permission !== "denied") {
        //     Notification.requestPermission().then((permission) => {
        //       if (permission === "granted") {
        //         showBrowserNotification(notification)
        //       }
        //     })
        //   }
        // }
      } catch {
        console.error("[WS] Failed to parse:", event.data)
      }
    }

    ws.onclose = (event) => {
      console.warn("[WS] Closed", event.code, event.reason)
      store.dispatch(setWsStatus("disconnected"))
      cleanup()

      if (event.code === 4001 || event.code === 4002) {
        console.error("[WS] Auth error — not reconnecting")
        return
      }

      reconnectTimeout = setTimeout(connect, RECONNECT_DELAY)
    }

    ws.onerror = () => ws?.close()
  }

  function startPollingForToken() {
    tokenPollInterval = setInterval(() => {
      const token = getToken()
      if (token) {
        clearInterval(tokenPollInterval!)
        tokenPollInterval = null
        connect()
      }
    }, 1000)
  }

  // ── Online / offline ──────────────────────────────────────────────────────
  window.addEventListener("online", () => {
    store.dispatch(setIsOnline(true))
    connect()
  })
  window.addEventListener("offline", () => {
    store.dispatch(setIsOnline(false))
  })

  // ── Defer initial connection until store is fully built ───────────────────
  setTimeout(() => {
    const token = getToken()
    if (token) {
      connect()
    } else {
      startPollingForToken()
    }
  }, 0)

  return (next) => (action) => next(action)
}
