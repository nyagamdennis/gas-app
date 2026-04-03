// @ts-nocheck
import React, { useState, useRef } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { selectAllLocations } from "../location/locationSlice"
import api from "../../../utils/api"
import FormattedAmount from "../../components/FormattedAmount"
import {
  fetchCustomersHistory,
  selectAllCustomersHistory,
} from "./customerHistorySlice"

// Material UI icons only
import {
  Receipt,
  LocalGasStation,
  Inventory,
  CheckCircle,
  Pending,
  AccessTime,
  Person,
  Business,
  History,
  Send as SendIcon,
  Phone as PhoneInTalkIcon,
  LocationOn as LocationOnIcon,
  TrendingUp,
  ShoppingBag,
  AttachMoney,
  CalendarMonth,
  Close,
  Warning,
  ExpandMore,
  ExpandLess,
  MoneyOff,
  AccountBalanceWallet,
  EventBusy,
  CheckCircleOutline,
  ErrorOutline,
  AddCircleOutline,
  RemoveCircleOutline,
} from "@mui/icons-material"
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome"

import {
  getSendSmsError,
  getSendSmsStatus,
  getSmsBalanceStatus,
  getSmsError,
  selectAllSmsMessages,
  sendSms,
} from "../sms/smsSlice"

const CustomerExcerpt = ({
  customer,
  refreshCustomer,
}: {
  customer: any
  refreshCustomer: () => void
}) => {
  const dispatch = useAppDispatch()
  const [smsState, setSmsState] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showDebtDetail, setShowDebtDetail] = useState(false)
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [showError, setShowError] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [cylinderPage, setCylinderPage] = useState(1)
  const [productPage, setProductPage] = useState(1)
  const itemsPerPage = 5

  const messageTextareaRef = useRef(null)
  const locations = useAppSelector(selectAllLocations)
  const salesHistory = useAppSelector(selectAllCustomersHistory)

  const location = locations.find((l) => l.id === customer.location)
  const phoneStr = customer?.phone?.toString()
  const debt = customer.debt_summary

  const [depositModalOpen, setDepositModalOpen] = useState(false)
  const [cashAmount, setCashAmount] = useState("")
  const [mpesaDeposits, setMpesaDeposits] = useState([
    { phone: "", code: "", amount: "" },
  ])
  const [submittingDeposit, setSubmittingDeposit] = useState(false)
  const [depositError, setDepositError] = useState("")
  const [depositSuccess, setDepositSuccess] = useState(false)

  const cylinderSales = salesHistory.filter((s) => s.cylinder_items?.length > 0)
  const productSales = salesHistory.filter((s) => s.items?.length > 0)
  const salesWithDebt = salesHistory.filter(
    (s) => s.debt !== null && s.debt !== undefined,
  )

  const totalAllPages = Math.ceil(salesHistory.length / itemsPerPage)
  const totalCylinderPages = Math.ceil(cylinderSales.length / itemsPerPage)
  const totalProductPages = Math.ceil(productSales.length / itemsPerPage)

  const messages = useAppSelector(selectAllSmsMessages)
  const sendStatus = useAppSelector(getSendSmsStatus)
  const balance = useAppSelector(getSmsBalanceStatus)
  const sendSmsError = useAppSelector(getSendSmsError)

  const paginate = (data, page) =>
    data.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  const stats = {
    totalPurchases: salesHistory.length,
    totalAmount: salesHistory.reduce(
      (s, x) => s + parseFloat(x.total_amount || 0),
      0,
    ),
    cylinderSalesCount: cylinderSales.length,
    productSalesCount: productSales.length,
    avgPurchaseValue: salesHistory.length
      ? salesHistory.reduce((s, x) => s + parseFloat(x.total_amount || 0), 0) /
        salesHistory.length
      : 0,
    outstandingBalance: parseFloat(debt?.total_remaining || 0),
  }

  const toggleHistory = () => {
    if (!showHistory) dispatch(fetchCustomersHistory({ id: customer.id }))
    setShowHistory(!showHistory)
  }

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-KE", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

  const formatShortDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-KE", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "—"

  const getPaymentColor = (status) =>
    ({ PAID: "success", PENDING: "warning", PARTIAL: "info" }[status] ||
    "default")

  const getPaymentIcon = (status) =>
    ({
      PAID: <CheckCircle className="w-4 h-4" />,
      PENDING: <Pending className="w-4 h-4" />,
      PARTIAL: <AccessTime className="w-4 h-4" />,
    }[status])

  const getDebtStatusColor = (status) =>
    ({
      PENDING: "#f59e0b",
      PARTIALLY_PAID: "#3b82f6",
      PAID: "#10b981",
      WRITTEN_OFF: "#6b7280",
    }[status] || "#6b7280")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await dispatch(
        sendSms({ recipient: phoneStr, message: message }),
      ).unwrap()
      setShowAlert(true)
      setMessage("")
    } catch (err) {
      setShowError(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isOverdue = debt?.has_overdue
  const headerGradient = isOverdue
    ? "bg-gradient-to-r from-red-700 to-red-500"
    : customer.sales === "WHOLESALE"
    ? "bg-gradient-to-r from-blue-700 to-blue-400"
    : "bg-gradient-to-r from-purple-700 to-purple-400"

  const addMpesaRow = () => {
    setMpesaDeposits([...mpesaDeposits, { phone: "", code: "", amount: "" }])
  }

  const removeMpesaRow = (index: number) => {
    const newDeposits = mpesaDeposits.filter((_, i) => i !== index)
    setMpesaDeposits(newDeposits)
  }

  const updateMpesaDeposit = (index: number, field: string, value: string) => {
    const updated = [...mpesaDeposits]
    updated[index][field] = value
    setMpesaDeposits(updated)
  }

  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmittingDeposit(true)
    setDepositError("")
    setDepositSuccess(false)

    // Validate: at least one payment (cash amount > 0 or any M-Pesa with amount > 0)
    const cash = parseFloat(cashAmount) || 0
    const mpesaTotal = mpesaDeposits.reduce(
      (sum, d) => sum + (parseFloat(d.amount) || 0),
      0,
    )
    if (cash === 0 && mpesaTotal === 0) {
      setDepositError("Please enter at least one payment amount.")
      setSubmittingDeposit(false)
      return
    }

    // Validate each M-Pesa row that has amount: phone and code must be present
    const invalidMpesa = mpesaDeposits.some(
      (d) => d.amount && (!d.phone || !d.code),
    )
    if (invalidMpesa) {
      setDepositError(
        "All M-Pesa deposits with an amount must include phone and code.",
      )
      setSubmittingDeposit(false)
      return
    }

    // Filter out M-Pesa rows that have no amount
    const validMpesa = mpesaDeposits.filter((d) => parseFloat(d.amount) > 0)

    const payload = {
      cash_amount: cash,
      mpesa_deposits: validMpesa.map((d) => ({
        phone: d.phone,
        code: d.code,
        amount: parseFloat(d.amount),
      })),
    }

    try {
      await api.post(`/sales/${customer.id}/deposit/`, payload)
      setDepositSuccess(true)
      // Clear form
      setCashAmount("")
      setMpesaDeposits([{ phone: "", code: "", amount: "" }])
      // Close modal after a short delay to show success message
      setTimeout(() => {
        setDepositModalOpen(false)
        setDepositSuccess(false)
        // Refresh customers in parent
        if (refreshCustomers) refreshCustomers()
      }, 1500)
    } catch (err: any) {
      setDepositError(
        err.response?.data?.message ||
          "Failed to add deposit. Please try again.",
      )
    } finally {
      setSubmittingDeposit(false)
    }
  }

  return (
    <div className="mb-4 rounded-2xl shadow-md overflow-visible bg-white">
      <div className="p-4 sm:p-5">
        {/* Header */}
        <div
          className={`${headerGradient} rounded-xl p-4 sm:p-5 ${
            debt ? "mb-0" : "mb-4"
          } relative overflow-hidden`}
        >
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/90 flex items-center justify-center text-blue-700">
                {customer.sales === "WHOLESALE" ? (
                  <Business className="w-6 h-6 sm:w-7 sm:h-7" />
                ) : (
                  <Person className="w-6 h-6 sm:w-7 sm:h-7" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h5 className="text-lg sm:text-xl font-bold text-white">
                    {customer.name}
                  </h5>
                  {isOverdue && (
                    <span className="bg-yellow-200 text-yellow-800 text-xs font-bold px-2 py-0.5 rounded-full">
                      OVERDUE
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="bg-white/20 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    {customer.sales}
                  </span>
                  <div className="flex items-center gap-1 text-white/95">
                    <PhoneInTalkIcon className="w-3.5 h-3.5" />
                    <a
                      href={`tel:${phoneStr}`}
                      className="text-xs sm:text-sm no-underline text-inherit"
                    >
                      {phoneStr}
                    </a>
                  </div>
                  <div className="flex items-center gap-1 text-white/95">
                    <LocationOnIcon className="w-3.5 h-3.5" />
                    <span className="text-xs sm:text-sm">
                      {location?.name || customer.location_name || "—"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2 self-end md:self-center">
              <button
                onClick={() => setSmsState(!smsState)}
                className="bg-white/90 hover:bg-white text-blue-700 rounded-full p-2 transition-colors"
                title="Send SMS"
              >
                <SendIcon className="w-5 h-5" />
              </button>
              <button
                onClick={toggleHistory}
                className={`${
                  showHistory ? "bg-white" : "bg-white/90"
                } hover:bg-white text-blue-700 rounded-full p-2 transition-colors`}
                title="Purchase History"
              >
                <History className="w-5 h-5" />
              </button>
              <button
                className="bg-white/90 hover:bg-white text-blue-700 rounded-full p-2 transition-colors"
                title="Add Note"
              >
                <AutoAwesomeIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Debt Banner */}
        {debt && (
          <div
            className={`rounded-b-xl px-3 py-2 mb-4 ${
              isOverdue
                ? "bg-red-50 border border-red-300"
                : "bg-amber-50 border border-amber-300"
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                {isOverdue ? (
                  <ErrorOutline className="w-5 h-5 text-red-600" />
                ) : (
                  <MoneyOff className="w-5 h-5 text-amber-700" />
                )}
                <span
                  className={`text-xs sm:text-sm font-semibold ${
                    isOverdue ? "text-red-700" : "text-amber-800"
                  }`}
                >
                  {isOverdue ? "OVERDUE DEBT" : "OUTSTANDING DEBT"}
                </span>
                <span
                  className={`text-sm font-bold ${
                    isOverdue ? "text-red-700" : "text-amber-800"
                  }`}
                >
                  KES {parseFloat(debt.total_remaining).toLocaleString()}
                </span>
                {debt.nearest_due_date && (
                  <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">
                    <EventBusy className="w-3.5 h-3.5" />
                    Due: {formatShortDate(debt.nearest_due_date)}
                  </span>
                )}
                {parseFloat(debt.total_deposited) > 0 && (
                  <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                    <AccountBalanceWallet className="w-3.5 h-3.5" />
                    Deposited: KES{" "}
                    {parseFloat(debt.total_deposited).toLocaleString()}
                  </span>
                )}
              </div>
              <div className="flex gap-2 items-center">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full border ${
                    isOverdue
                      ? "border-red-300 text-red-700"
                      : "border-amber-300 text-amber-800"
                  }`}
                >
                  {debt.pending_debts_count} invoice
                  {debt.pending_debts_count > 1 ? "s" : ""}
                </span>
                <button
                  onClick={() => setShowDebtDetail(!showDebtDetail)}
                  className={`text-xs font-semibold flex items-center gap-1 ${
                    isOverdue ? "text-red-700" : "text-amber-800"
                  } hover:underline`}
                >
                  {showDebtDetail ? (
                    <ExpandLess className="w-4 h-4" />
                  ) : (
                    <ExpandMore className="w-4 h-4" />
                  )}
                  {showDebtDetail ? "Hide" : "Details"}
                </button>
                <button
                  onClick={() => setDepositModalOpen(true)}
                  className="text-xs flex items-center gap-1 px-1 py-1 border rounded-md transition-colors border-green-600 text-green-600 hover:bg-green-50"
                >
                  <AttachMoney className="w-3 h-3" />
                  Add Deposit
                </button>
              </div>
            </div>

            {/* Debt detail rows */}
            {showDebtDetail && (
              <div className="mt-3">
                <div className="border rounded-lg overflow-hidden border-gray-200 overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead
                      className={`${isOverdue ? "bg-red-100" : "bg-amber-50"}`}
                    >
                      <tr>
                        {[
                          "Invoice",
                          "Original",
                          "Remaining",
                          "Deposited",
                          "Due Date",
                          "Status",
                          "Overdue",
                        ].map((h) => (
                          <th
                            key={h}
                            className="px-2 sm:px-3 py-2 text-left text-xs font-bold"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {debt.debts.map((d) => (
                        <tr
                          key={d.debt_id}
                          className="hover:bg-gray-50 border-t"
                        >
                          <td className="px-2 sm:px-3 py-2 text-xs font-semibold text-blue-600">
                            {d.invoice_number}
                          </td>
                          <td className="px-2 sm:px-3 py-2 text-xs">
                            KES {parseFloat(d.original_amount).toLocaleString()}
                          </td>
                          <td
                            className={`px-2 sm:px-3 py-2 text-xs font-bold ${
                              d.is_overdue ? "text-red-600" : "text-amber-700"
                            }`}
                          >
                            KES{" "}
                            {parseFloat(d.remaining_amount).toLocaleString()}
                          </td>
                          <td className="px-2 sm:px-3 py-2 text-xs text-green-700">
                            {parseFloat(d.amount_deposited) > 0
                              ? `KES ${parseFloat(
                                  d.amount_deposited,
                                ).toLocaleString()}`
                              : "—"}
                          </td>
                          <td className="px-2 sm:px-3 py-2 text-xs">
                            {formatShortDate(d.repayment_date)}
                          </td>
                          <td className="px-2 sm:px-3 py-2">
                            <span
                              className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold"
                              style={{
                                backgroundColor: `${getDebtStatusColor(
                                  d.status,
                                )}20`,
                                color: getDebtStatusColor(d.status),
                              }}
                            >
                              {d.status.replace("_", " ")}
                            </span>
                          </td>
                          <td className="px-2 sm:px-3 py-2">
                            {d.is_overdue ? (
                              <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                                {d.days_overdue}d late
                              </span>
                            ) : (
                              <CheckCircleOutline className="w-4 h-4 text-green-600" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* SMS debt reminder button */}
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => {
                      setMessage(
                        `Dear ${
                          customer.name
                        }, you have an outstanding balance of KES ${parseFloat(
                          debt.total_remaining,
                        ).toLocaleString()} due on ${formatShortDate(
                          debt.nearest_due_date,
                        )}. Please make payment at your earliest convenience.`,
                      )
                      setSmsState(true)
                    }}
                    className={`text-xs flex items-center gap-1 px-3 py-1 border rounded-md transition-colors ${
                      isOverdue
                        ? "border-red-600 text-red-600 hover:bg-red-50"
                        : "border-amber-700 text-amber-700 hover:bg-amber-50"
                    }`}
                  >
                    <SendIcon className="w-3.5 h-3.5" />
                    Send Debt Reminder
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        {/* Deposit Modal */}
        {depositModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl">
              <div className="p-5">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-800">
                    Add Deposit for {customer.name}
                  </h3>
                  <button
                    onClick={() => setDepositModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Close className="w-5 h-5" />
                  </button>
                </div>

                {debt && (
                  <div className="mb-5 p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-amber-800">
                        Outstanding Debt:
                      </span>
                      <span className="text-lg font-bold text-amber-900">
                        KES {parseFloat(debt.total_remaining).toLocaleString()}
                      </span>
                    </div>
                    {debt.pending_debts_count > 0 && (
                      <div className="text-xs text-amber-700 mt-1">
                        {debt.pending_debts_count} invoice
                        {debt.pending_debts_count > 1 ? "s" : ""} pending
                      </div>
                    )}
                  </div>
                )}

                <form onSubmit={handleDepositSubmit} className="space-y-5">
                  {/* Cash deposit */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cash Deposit (KES)
                    </label>
                    <input
                      type="number"
                      value={cashAmount}
                      onChange={(e) => setCashAmount(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter amount"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  {/* M-Pesa deposits section */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        M-Pesa Deposits
                      </label>
                      <button
                        type="button"
                        onClick={addMpesaRow}
                        className="text-blue-600 text-sm flex items-center gap-1 hover:underline"
                      >
                        <AddCircleOutline className="w-4 h-4" />
                        Add another
                      </button>
                    </div>

                    {mpesaDeposits.map((deposit, idx) => (
                      <div
                        key={idx}
                        className="border rounded-lg p-3 mb-3 bg-gray-50"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-semibold text-gray-500">
                            Deposit #{idx + 1}
                          </span>
                          {idx > 0 && (
                            <button
                              type="button"
                              onClick={() => removeMpesaRow(idx)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <RemoveCircleOutline className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="M-Pesa Phone Number"
                            value={deposit.phone}
                            onChange={(e) =>
                              updateMpesaDeposit(idx, "phone", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          />
                          <input
                            type="text"
                            placeholder="M-Pesa Code (e.g., ABC123)"
                            value={deposit.code}
                            onChange={(e) =>
                              updateMpesaDeposit(idx, "code", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          />
                          <input
                            type="number"
                            placeholder="Amount (KES)"
                            value={deposit.amount}
                            onChange={(e) =>
                              updateMpesaDeposit(idx, "amount", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            min="0"
                            step="0.01"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {depositError && (
                    <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                      {depositError}
                    </div>
                  )}

                  {depositSuccess && (
                    <div className="text-green-600 text-sm bg-green-50 p-2 rounded">
                      Deposit added successfully! Refreshing customer data...
                    </div>
                  )}

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setDepositModalOpen(false)}
                      className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                      disabled={submittingDeposit}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submittingDeposit}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {submittingDeposit ? "Processing..." : "Add Deposit"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* SMS Form */}
        {smsState && (
          <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <form onSubmit={handleSubmit}>
              <div className="flex justify-between items-center mb-3">
                <h6 className="text-base font-semibold">
                  Send Message to {customer.name}
                </h6>
                <button
                  onClick={() => setSmsState(false)}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  <Close className="w-5 h-5" />
                </button>
              </div>
              <textarea
                ref={messageTextareaRef}
                placeholder="Type your message..."
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md mb-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={message}
                required
                onChange={(e) => setMessage(e.target.value)}
              />
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                <span className="text-xs text-gray-500 text-center sm:text-left">
                  Sending to: <strong>{phoneStr}</strong>
                </span>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 text-sm font-semibold disabled:opacity-50"
                >
                  <SendIcon className="w-4 h-4" />
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </div>
              {showAlert && (
                <div className="mt-3 p-2 bg-green-100 text-green-800 rounded-md flex justify-between items-center">
                  <span>Sent successfully!</span>
                  <button
                    onClick={() => setShowAlert(false)}
                    className="text-green-800"
                  >
                    <Close className="w-4 h-4" />
                  </button>
                </div>
              )}
              {showError && (
                <div className="mt-3 p-2 bg-red-100 text-red-800 rounded-md flex justify-between items-center">
                  <span>
                    {sendSmsError || "Failed to send. Please try again."}
                  </span>
                  <button
                    onClick={() => setShowError(false)}
                    className="text-red-800"
                  >
                    <Close className="w-4 h-4" />
                  </button>
                </div>
              )}
            </form>
          </div>
        )}

        {/* Purchase History */}
        {showHistory && (
          <div>
            <h6 className="text-lg font-bold mb-4">Customer Overview</h6>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
              {[
                {
                  label: "Total Orders",
                  value: stats.totalPurchases,
                  color: "text-blue-600",
                  bg: "bg-blue-50",
                  icon: <ShoppingBag className="w-5 h-5 text-blue-600" />,
                },
                {
                  label: "Total Revenue",
                  value: `KES ${stats.totalAmount.toLocaleString()}`,
                  color: "text-green-600",
                  bg: "bg-green-50",
                  icon: <AttachMoney className="w-5 h-5 text-green-600" />,
                },
                {
                  label: "Avg Order",
                  value: `KES ${Math.round(
                    stats.avgPurchaseValue,
                  ).toLocaleString()}`,
                  color: "text-amber-600",
                  bg: "bg-amber-50",
                  icon: <Receipt className="w-5 h-5 text-amber-600" />,
                },
                {
                  label: "Outstanding",
                  value: `KES ${stats.outstandingBalance.toLocaleString()}`,
                  color:
                    stats.outstandingBalance > 0
                      ? "text-red-600"
                      : "text-green-600",
                  bg:
                    stats.outstandingBalance > 0 ? "bg-red-50" : "bg-green-50",
                  icon: (
                    <Warning
                      className={`w-5 h-5 ${
                        stats.outstandingBalance > 0
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    />
                  ),
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="p-3 sm:p-4 text-center rounded-xl border border-gray-200 bg-white"
                >
                  <div
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full ${s.bg} flex items-center justify-center mx-auto mb-2`}
                  >
                    {s.icon}
                  </div>
                  <div
                    className={`text-base sm:text-lg font-bold ${s.color} truncate`}
                  >
                    {s.value}
                  </div>
                  <div className="text-xs text-gray-500">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-4 overflow-x-auto">
              <div className="flex min-w-max">
                {[
                  {
                    label: `All (${salesHistory.length})`,
                    icon: <Receipt className="w-4 h-4" />,
                  },
                  {
                    label: `Cylinders (${cylinderSales.length})`,
                    icon: <LocalGasStation className="w-4 h-4" />,
                  },
                  {
                    label: `Products (${productSales.length})`,
                    icon: <Inventory className="w-4 h-4" />,
                  },
                  {
                    label: `Debts (${salesWithDebt.length})`,
                    icon: <MoneyOff className="w-4 h-4" />,
                    color: salesWithDebt.length > 0 ? "text-red-600" : "",
                  },
                ].map((tab, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTab(idx)}
                    className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold flex items-center gap-1 transition-colors border-b-2 ${
                      activeTab === idx
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    } ${tab.color || ""}`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* All tab */}
            {activeTab === 0 && (
              <>
                <SalesTable
                  data={paginate(salesHistory, currentPage)}
                  showDebt
                  formatDate={formatDate}
                  formatShortDate={formatShortDate}
                  getPaymentColor={getPaymentColor}
                  getPaymentIcon={getPaymentIcon}
                  getDebtStatusColor={getDebtStatusColor}
                />
                {salesHistory.length > itemsPerPage && (
                  <div className="flex justify-center mt-3 overflow-x-auto">
                    <PaginationControls
                      count={totalAllPages}
                      page={currentPage}
                      onChange={(p) => setCurrentPage(p)}
                    />
                  </div>
                )}
              </>
            )}

            {/* Cylinders tab */}
            {activeTab === 1 && (
              <>
                {cylinderSales.length === 0 ? (
                  <EmptyState type="cylinders" />
                ) : (
                  <>
                    <SalesTable
                      data={paginate(cylinderSales, cylinderPage)}
                      showDebt
                      formatDate={formatDate}
                      formatShortDate={formatShortDate}
                      getPaymentColor={getPaymentColor}
                      getPaymentIcon={getPaymentIcon}
                      getDebtStatusColor={getDebtStatusColor}
                    />
                    {cylinderSales.length > itemsPerPage && (
                      <div className="flex justify-center mt-3 overflow-x-auto">
                        <PaginationControls
                          count={totalCylinderPages}
                          page={cylinderPage}
                          onChange={(p) => setCylinderPage(p)}
                        />
                      </div>
                    )}
                  </>
                )}
              </>
            )}

            {/* Products tab */}
            {activeTab === 2 && (
              <>
                {productSales.length === 0 ? (
                  <EmptyState type="products" />
                ) : (
                  <>
                    <SalesTable
                      data={paginate(productSales, productPage)}
                      showDebt
                      formatDate={formatDate}
                      formatShortDate={formatShortDate}
                      getPaymentColor={getPaymentColor}
                      getPaymentIcon={getPaymentIcon}
                      getDebtStatusColor={getDebtStatusColor}
                    />
                    {productSales.length > itemsPerPage && (
                      <div className="flex justify-center mt-3 overflow-x-auto">
                        <PaginationControls
                          count={totalProductPages}
                          page={productPage}
                          onChange={(p) => setProductPage(p)}
                        />
                      </div>
                    )}
                  </>
                )}
              </>
            )}

            {/* Debts tab */}
            {activeTab === 3 && (
              <>
                {salesWithDebt.length === 0 ? (
                  <div className="py-12 text-center">
                    <CheckCircleOutline className="w-16 h-16 text-green-300 mx-auto mb-3" />
                    <h6 className="text-lg text-gray-500">
                      No outstanding debts
                    </h6>
                    <p className="text-sm text-gray-400">
                      This customer has cleared all balances.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {salesWithDebt.map((sale) => (
                      <DebtCard
                        key={sale.id}
                        sale={sale}
                        formatDate={formatDate}
                        formatShortDate={formatShortDate}
                        getDebtStatusColor={getDebtStatusColor}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Sub-components

const SalesTable = ({
  data,
  showDebt,
  formatDate,
  formatShortDate,
  getPaymentColor,
  getPaymentIcon,
  getDebtStatusColor,
}) => (
  <div className="border border-gray-200 rounded-lg overflow-hidden mb-4 bg-white">
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            {[
              "Date",
              "Invoice",
              "Items",
              "Amount",
              "Paid",
              "Status",
              ...(showDebt ? ["Debt"] : []),
            ].map((h) => (
              <th key={h} className="px-3 py-2 text-left text-xs font-bold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((sale) => (
            <tr key={sale.id} className="hover:bg-gray-50 border-t">
              <td className="px-3 py-2 text-xs">
                <div className="flex items-center gap-1">
                  <CalendarMonth className="w-3.5 h-3.5 text-gray-500" />
                  {formatDate(sale.created_at)}
                </div>
              </td>
              <td className="px-3 py-2">
                <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {sale.invoice_number}
                </span>
              </td>
              <td className="px-3 py-2">
                <div className="flex flex-wrap gap-1">
                  {sale.cylinder_items?.map((item, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 border border-gray-300 text-xs px-2 py-0.5 rounded-full"
                    >
                      <LocalGasStation className="w-3 h-3" />
                      Cyl ×{item.quantity}
                    </span>
                  ))}
                  {sale.items?.map((item, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 border border-gray-300 text-xs px-2 py-0.5 rounded-full"
                    >
                      <Inventory className="w-3 h-3" />
                      {item.product?.name} ×{item.quantity}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-3 py-2 text-xs font-bold text-green-600">
                KES {parseFloat(sale.total_amount).toLocaleString()}
              </td>
              <td className="px-3 py-2 text-xs text-gray-600">
                KES {parseFloat(sale.amount_paid).toLocaleString()}
              </td>
              <td className="px-3 py-2">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                    sale.payment_status === "PAID"
                      ? "bg-green-100 text-green-800"
                      : sale.payment_status === "PENDING"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {getPaymentIcon(sale.payment_status)}
                  {sale.payment_status}
                </span>
              </td>
              {showDebt && (
                <td className="px-3 py-2">
                  {sale.debt ? (
                    <div>
                      <div className="text-xs font-bold text-red-600">
                        KES{" "}
                        {parseFloat(
                          sale.debt.remaining_amount,
                        ).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        Due: {formatShortDate(sale.debt.repayment_date)}
                      </div>
                    </div>
                  ) : (
                    <CheckCircleOutline className="w-4 h-4 text-green-600" />
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)

const DebtCard = ({
  sale,
  formatDate,
  formatShortDate,
  getDebtStatusColor,
}) => {
  const debt = sale.debt
  const isOverdue =
    debt.repayment_date && new Date(debt.repayment_date) < new Date()
  const daysOverdue = isOverdue
    ? Math.floor((new Date() - new Date(debt.repayment_date)) / 86400000)
    : 0
  const paidPercent = Math.round(
    (parseFloat(debt.amount_paid) / parseFloat(debt.original_amount)) * 100,
  )

  return (
    <div
      className={`p-4 rounded-xl border ${
        isOverdue ? "border-red-300 bg-red-50" : "border-amber-300 bg-amber-50"
      } shadow-sm`}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Receipt className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-blue-700">
              {sale.invoice_number}
            </span>
            {isOverdue && (
              <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full">
                {daysOverdue}d overdue
              </span>
            )}
          </div>
          <div className="text-xs text-gray-500 mb-2">
            Sold: {formatDate(sale.created_at)}
          </div>
          <div className="flex flex-wrap gap-1 mb-2">
            {sale.cylinder_items?.map((item, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 border border-gray-300 text-xs px-2 py-0.5 rounded-full bg-white"
              >
                <LocalGasStation className="w-3 h-3" />
                {item.cylinder?.weight}kg ×{item.quantity}
              </span>
            ))}
            {sale.items?.map((item, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 border border-gray-300 text-xs px-2 py-0.5 rounded-full bg-white"
              >
                <Inventory className="w-3 h-3" />
                {item.product?.name} ×{item.quantity}
              </span>
            ))}
          </div>
        </div>

        <div>
          <div className="grid grid-cols-2 gap-2">
            {[
              {
                label: "Sale Total",
                value: `KES ${parseFloat(sale.total_amount).toLocaleString()}`,
                color: "text-gray-800",
              },
              {
                label: "Amount Paid",
                value: `KES ${parseFloat(sale.amount_paid).toLocaleString()}`,
                color: "text-green-700",
              },
              {
                label: "Debt Amount",
                value: `KES ${parseFloat(
                  debt.original_amount,
                ).toLocaleString()}`,
                color: "text-amber-700",
              },
              {
                label: "Still Owed",
                value: `KES ${parseFloat(
                  debt.remaining_amount,
                ).toLocaleString()}`,
                color: isOverdue ? "text-red-700" : "text-amber-700",
              },
            ].map((row) => (
              <div
                key={row.label}
                className="p-2 bg-white rounded border border-gray-200"
              >
                <div className="text-xs text-gray-500">{row.label}</div>
                <div className={`text-sm font-bold ${row.color}`}>
                  {row.value}
                </div>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Repayment progress</span>
              <span className="font-bold">{paidPercent}%</span>
            </div>
            <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  paidPercent === 100
                    ? "bg-green-500"
                    : isOverdue
                    ? "bg-red-500"
                    : "bg-amber-500"
                }`}
                style={{ width: `${paidPercent}%` }}
              />
            </div>
          </div>

          <div className="flex justify-between items-center mt-3">
            <div className="flex items-center gap-1">
              <EventBusy
                className={`w-3.5 h-3.5 ${
                  isOverdue ? "text-red-600" : "text-amber-700"
                }`}
              />
              <span
                className={`text-xs font-semibold ${
                  isOverdue ? "text-red-700" : "text-amber-800"
                }`}
              >
                Due: {formatShortDate(debt.repayment_date)}
              </span>
            </div>
            <span
              className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold"
              style={{
                backgroundColor: `${getDebtStatusColor(debt.status)}20`,
                color: getDebtStatusColor(debt.status),
              }}
            >
              {debt.status.replace("_", " ")}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

const EmptyState = ({ type }) => (
  <div className="py-12 text-center">
    {type === "cylinders" ? (
      <LocalGasStation className="w-16 h-16 text-gray-300 mx-auto mb-3" />
    ) : (
      <Inventory className="w-16 h-16 text-gray-300 mx-auto mb-3" />
    )}
    <h6 className="text-lg text-gray-500">No {type} purchases</h6>
    <p className="text-sm text-gray-400">
      This customer hasn't purchased any {type} yet.
    </p>
  </div>
)

const PaginationControls = ({ count, page, onChange }) => {
  const pages = Array.from({ length: count }, (_, i) => i + 1)
  return (
    <div className="flex gap-1 flex-nowrap overflow-x-auto pb-1">
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`px-3 py-1 rounded-md text-sm whitespace-nowrap ${
            page === p
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {p}
        </button>
      ))}
    </div>
  )
}

export default CustomerExcerpt
