import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import FormattedAmount from "../components/FormattedAmount"

const ProsessingPayment = () => {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [status, setStatus] = useState("pending")

  const { planName, months, amount, checkoutRequestId } = state || {}

  useEffect(() => {
    if (!checkoutRequestId) {
      navigate("/subscribe")
      return
    }

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/transactions/status/${checkoutRequestId}`)
        const data = await res.json()

        if (data.status === "completed") {
          setStatus("success")
          clearInterval(interval)
        } else if (data.status === "failed") {
          setStatus("failed")
          clearInterval(interval)
        }
      } catch (err) {
        console.error("Error checking payment status")
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [checkoutRequestId, navigate])

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h2 className="text-2xl font-bold mb-4">Processing Payment...</h2>
      <p className="mb-2">
        Plan: <strong>{planName}</strong>
      </p>
      <p className="mb-4">
        Amount: <strong><FormattedAmount amount={amount} /></strong> for {months} month(s)
      </p>

      {status === "pending" && (
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4" />
          <p>Waiting for confirmation...</p>
        </div>
      )}

      {status === "success" && (
        <div className="text-green-600 text-center">
          <p className="text-xl font-semibold">✅ Payment Successful!</p>
          <p>You are now subscribed to the {planName} plan.</p>
        </div>
      )}

      {status === "failed" && (
        <div className="text-red-600 text-center">
          <p className="text-xl font-semibold">❌ Payment Failed</p>
          <p>Please try again with a valid number.</p>
        </div>
      )}
    </div>
  )
}

export default ProsessingPayment
