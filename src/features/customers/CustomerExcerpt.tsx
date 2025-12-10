// @ts-nocheck
import React, { useState, useRef } from "react"
import { useAppSelector } from "../../app/hooks"
import { selectAllLocations } from "../location/locationSlice"
import { selectAllProducts } from "../product/productSlice"
import { selectAllSales } from "../sales/salesSlice"
import api from "../../../utils/api"
import FormattedAmount from "../../components/FormattedAmount"

import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import SendIcon from "@mui/icons-material/Send"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import CircularProgress from "@mui/material/CircularProgress"
import Box from "@mui/material/Box"
import Alert from "@mui/material/Alert"
import Stack from "@mui/material/Stack"

const CustomerExcerpt = ({ customer }) => {
  // const apiUrl = getApiUrl()
  console.log("Customer data:", customer)
  const [smsState, setSmsState] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [showError, setShowError] = useState(false)
  const messageTextareaRef = useRef(null)

  const locations = useAppSelector(selectAllLocations)
  const products = useAppSelector(selectAllProducts)
  const salesProduct = useAppSelector(selectAllSales)

  const location = locations.find((l) => l.id === customer.location.id)
  const phoneStr = customer?.phone?.toString();

  
  const toggleSMS = () => setSmsState(!smsState)
  const toggleHistory = () => setShowHistory(!showHistory)

  const formattedDates = customer.customer_debt?.map((debt) => {
    const date = new Date(debt.expected_date_to_repay)
    return {
      formatted: date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      isPastDue: date < new Date(),
    }
  })

  const dateGivenList = customer.customer_debt.map((debt) => {
    const date = new Date(debt.date_given)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const formData = {
        message,
        customer: [customer.id],
        location: [customer.location.id],
      }

      // const response = await axios.post(`${apiUrl}/sendsms/`, formData, {
      //   headers: {
      //     Authorization: `Bearer ${Cookies.get("accessToken")}`,
      //     "Content-Type": "application/json",
      //   },
      // })

      const response = await api.post("/sendsms/", formData)
      if (response.status === 201) {
        setShowAlert(true)
        if (messageTextareaRef.current) {
          messageTextareaRef.current.value = ""
        }
        setTimeout(() => setShowAlert(false), 5000)
      }
    } catch (error) {
      console.error("SMS error", error)
      setShowError(true)
      setTimeout(() => setShowError(false), 5000)
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setSmsState(false), 5000)
    }
  }

  return (
    <div className="bg-white shadow-md rounded-2xl p-4 mb-4 border border-gray-200">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-blue-700">
            {customer.name}
          </h2>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <PhoneInTalkIcon fontSize="small" />
            <a
              href={`tel:${phoneStr}`}
              className="text-blue-600 hover:underline"
            >
              {phoneStr}
            </a>
            {/* {phoneStr.slice(0, 3)}****{phoneStr.slice(-3)} */}
          </p>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <LocationOnIcon fontSize="small" />
            {location?.name}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={toggleSMS}
            className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700"
          >
            Message
          </button>
          <ExpandMoreIcon onClick={toggleHistory} className="cursor-pointer" />
        </div>
      </div>

      {/* SMS Form */}
      {smsState && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-2">
          <textarea
            ref={messageTextareaRef}
            placeholder="Type your message..."
            className="w-full p-2 border rounded-md outline-none"
            required
            onChange={(e) => setMessage(e.target.value)}
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
            >
              {isSubmitting ? (
                <CircularProgress size={20} className="text-white" />
              ) : (
                <>
                  <SendIcon /> Send
                </>
              )}
            </button>
          </div>

          {showAlert && (
            <Stack className="mt-2" spacing={1}>
              <Alert severity="success">Message sent successfully!</Alert>
            </Stack>
          )}

          {showError && (
            <Stack className="mt-2" spacing={1}>
              <Alert severity="error">Please login to send messages.</Alert>
            </Stack>
          )}
        </form>
      )}

      {/* History Section */}
      {showHistory && (
        <div className="mt-4 space-y-4">
          {customer.customer_debt.length > 0 && (
            <div>
              <h4 className="font-semibold text-red-700">Customer Debts</h4>
              {customer.customer_debt.map((debt, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-md text-sm ${
                    formattedDates[index].isPastDue
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100"
                  }`}
                >
                  <p>🕐 Given on: {dateGivenList[index]}</p>
                  <p>
                    💰 Amount:{" "}
                    <span className="font-bold">
                      <FormattedAmount amount={debt.amount} />
                    </span>
                  </p>
                  <p>📅 Due: {formattedDates[index].formatted}</p>
                </div>
              ))}
            </div>
          )}

          <div className="">
            <h4 className="font-semibold text-green-700">Purchase History</h4>
            {customer.customer_sales.map((sale, i) => (
              <div
                key={i}
                className="p-2 rounded-lg bg-green-50 text-sm border border-green-200 mb-2"
              >
                <p>🧪 Product: {sale.product?.gas_type || "N/A"}</p>
                <p>⚖️ Weight: {sale.product?.weight || "N/A"}kg</p>
                <p>📦 Qty: {sale.quantity}</p>
                <p>
                  💵 Total: <FormattedAmount amount={sale.total_amount} />
                </p>
                {sale.exchanged_with_local && (
                  <p className="text-yellow-600">
                    ♻️ Exchanged with {sale.cylinder_exchanged_with.gas_type} {sale.cylinder_exchanged_with.weight}kg
                  </p>
                )}
                <hr />
                <p className="text-xs mt-2">
                  🗓️ Purchased on:{" "}
                  {new Date(sale.timestamp).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  at{" "}
                  {new Date(sale.timestamp).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomerExcerpt
