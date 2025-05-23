import { useEffect, useState } from "react"

const useEmployeeVerificationStatus = ({
  employeeId,
}: {
  employeeId: string
}) => {
  const [verified, setVerified] = useState<boolean | null>(null)
  const [connected, setConnected] = useState<boolean>(false)

  useEffect(() => {
    if (!employeeId) return

    const socket = new WebSocket(`ws://127.0.0.1:8001/ws/employee-status/${employeeId}/`)

    socket.onopen = () => {
      console.log("✅ WebSocket connected.")
      setConnected(true)
    }

    socket.onmessage = (e) => {
      const data = JSON.parse(e.data)
    console.log("🔁 Verification status received:", data.verified)
      setVerified(data.verified)
    }

    socket.onerror = (err) => {
      console.error("❌ WebSocket error:", err)
      setConnected(false)
    }

    socket.onclose = () => {
      console.log("❌ WebSocket disconnected.")
      setConnected(false)
    }

    return () => socket.close()
  }, [employeeId])

  return { verified, connected }
}

export default useEmployeeVerificationStatus
