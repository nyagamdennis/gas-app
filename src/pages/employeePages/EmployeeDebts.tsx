// @ts-nocheck
import React, { useEffect, useState } from "react"
import EmployeeFooter from "../../components/ui/EmployeeFooter"
import { useMediaQuery, useTheme } from "@mui/material"
import Navbar from "../../components/ui/mobile/employees/Navbar"
import api from "../../../utils/api"
import { useAppSelector } from "../../app/hooks"
import { selectEmployeeTeam } from "../../features/employees/employeesTeamSlice"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Skeleton,
  CircularProgress,
} from "@mui/material"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import ExpandLessIcon from "@mui/icons-material/ExpandLess"
import AddCircleOutline from "@mui/icons-material/AddCircleOutline"
import RemoveCircleOutline from "@mui/icons-material/RemoveCircleOutline"
import Close from "@mui/icons-material/Close"

// Icons for UI consistency
const Icons = {
  Debtor: () => <span className="text-2xl">💰</span>,
  Customer: () => <span className="text-xl">👤</span>,
  Location: () => <span className="text-xl">📍</span>,
  Calendar: () => <span className="text-xl">📅</span>,
}

const EmployeeDebts = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const myTeamData = useAppSelector(selectEmployeeTeam)

  const assignmentData = myTeamData?.[0]
  const userId = assignmentData?.user
  const shopId = assignmentData?.assigned_to?.shop_id
  const teamType = assignmentData?.assigned_to?.type
  const teamName = assignmentData?.assigned_to?.name

  const [debtData, setDebtData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedDebtorId, setExpandedDebtorId] = useState(null)
  const [depositModalOpen, setDepositModalOpen] = useState(false)
  const [selectedDebt, setSelectedDebt] = useState(null)
  const [selectedCustomerId, setSelectedCustomerId] = useState(null)
  const [cashAmount, setCashAmount] = useState("")
  const [mpesaDeposits, setMpesaDeposits] = useState([
    { phone: "", code: "", amount: "" },
  ])
  const [submittingDeposit, setSubmittingDeposit] = useState(false)
  const [depositError, setDepositError] = useState("")
  const [depositSuccess, setDepositSuccess] = useState(false)

  // Fetch employee debtors
  useEffect(() => {
    const fetchDebts = async () => {
      if (!userId) return
      setLoading(true)
      try {
        const response = await api.get("/customers/employee-debtors/", {
          params: { user_id: userId },
        })
        setDebtData(response.data)
        setError(null)
      } catch (err) {
        console.error("Error fetching debts:", err)
        setError("Failed to load debtors. Please try again.")
        toast.error("Could not fetch debtors")
      } finally {
        setLoading(false)
      }
    }

    fetchDebts()
  }, [userId])

  // Toggle debtor expansion
  const toggleDebtor = (customerId) => {
    setExpandedDebtorId(expandedDebtorId === customerId ? null : customerId)
  }

  // Open deposit modal for a specific debt
  const handleOpenDeposit = (debt, customerId) => {
    setSelectedDebt(debt)
    setSelectedCustomerId(customerId)
    setCashAmount("")
    setMpesaDeposits([{ phone: "", code: "", amount: "" }])
    setDepositError("")
    setDepositSuccess(false)
    setDepositModalOpen(true)
  }

  // Close deposit modal
  const handleCloseDeposit = () => {
    setDepositModalOpen(false)
    setSelectedDebt(null)
    setSelectedCustomerId(null)
  }

  const addMpesaRow = () => {
    setMpesaDeposits([...mpesaDeposits, { phone: "", code: "", amount: "" }])
  }

  const removeMpesaRow = (index) => {
    const newDeposits = mpesaDeposits.filter((_, i) => i !== index)
    setMpesaDeposits(newDeposits)
  }

  const updateMpesaDeposit = (index, field, value) => {
    const updated = [...mpesaDeposits]
    updated[index][field] = value
    setMpesaDeposits(updated)
  }

  // Submit deposit
  const handleSubmitDeposit = async (e) => {
    e.preventDefault()
    setSubmittingDeposit(true)
    setDepositError("")
    setDepositSuccess(false)

    const cash = parseFloat(cashAmount) || 0
    const mpesaTotal = mpesaDeposits.reduce(
      (sum, d) => sum + (parseFloat(d.amount) || 0),
      0,
    )

    // Validation
    if (cash === 0 && mpesaTotal === 0) {
      setDepositError("Please enter at least one payment amount.")
      setSubmittingDeposit(false)
      return
    }

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
      await api.post(`/sales/${selectedCustomerId}/deposit/`, payload)
      setDepositSuccess(true)
      // Refresh data after deposit
      const response = await api.get("/customers/employee-debtors/", {
        params: { user_id: userId },
      })
      setDebtData(response.data)
      // Close modal after a short delay to show success message
      setTimeout(() => {
        handleCloseDeposit()
      }, 1500)
    } catch (err) {
      console.error("Deposit failed:", err)
      setDepositError(
        err.response?.data?.message ||
          "Failed to record deposit. Please try again.",
      )
    } finally {
      setSubmittingDeposit(false)
    }
  }

  // Calculate total debt across all debtors
  const totalDebtAmount =
    debtData?.debtors?.reduce(
      (sum, debtor) => sum + (debtor.total_debt || 0),
      0,
    ) || 0

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] text-gray-800 flex flex-col font-sans">
        <Navbar headerMessage="ERP" headerText="Loading debtors..." />
        <main className="flex-grow m-2 p-1">
          <div className="space-y-4">
            <Skeleton
              variant="rectangular"
              height={120}
              className="rounded-lg"
            />
            <Skeleton
              variant="rectangular"
              height={200}
              className="rounded-lg"
            />
            <Skeleton
              variant="rectangular"
              height={200}
              className="rounded-lg"
            />
          </div>
        </main>
        <EmployeeFooter />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] text-gray-800 flex flex-col font-sans">
        <Navbar headerMessage="ERP" headerText="Debtors" />
        <main className="flex-grow m-2 p-1 flex items-center justify-center">
          <div className="text-center p-8 bg-white rounded-lg shadow-md">
            <div className="text-6xl mb-4">⚠️</div>
            <p className="text-red-500 text-lg font-medium">{error}</p>
            <Button
              variant="contained"
              onClick={() => window.location.reload()}
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        </main>
        <EmployeeFooter />
      </div>
    )
  }

  // Empty state (no debtors)
  if (!debtData || debtData.total_debtors === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] text-gray-800 flex flex-col font-sans">
        <Navbar headerMessage="ERP" headerText="Debtors" />
        <main className="flex-grow m-2 p-1 flex items-center justify-center">
          <div className="text-center p-8 bg-white rounded-lg shadow-md w-full max-w-md">
            <div className="text-6xl mb-4">💰</div>
            <p className="text-gray-600 text-lg mb-2">No outstanding debts</p>
            <p className="text-gray-500">
              All customers have settled their balances.
            </p>
          </div>
        </main>
        <EmployeeFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] text-gray-800 flex flex-col font-sans">
      <ToastContainer position="top-center" />
      <Navbar
        headerMessage="ERP"
        headerText={`${debtData.user_name || "Employee"} - Debtors`}
      />

      <main className="flex-grow m-2 p-1">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Debtors</p>
                <p className="text-2xl font-bold text-gray-800">
                  {debtData.total_debtors}
                </p>
              </div>
              <span className="text-3xl">👥</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Outstanding</p>
                <p className="text-2xl font-bold text-red-600">
                  KES{" "}
                  {totalDebtAmount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
              <span className="text-3xl">💵</span>
            </div>
          </div>
        </div>

        {/* Debtors List */}
        <div className="space-y-3">
          {debtData.debtors.map((debtor) => (
            <div
              key={debtor.customer_id}
              className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-yellow-500"
            >
              {/* Debtor Header (clickable to expand) */}
              <div
                className="p-4 cursor-pointer hover:bg-gray-50 transition"
                onClick={() => toggleDebtor(debtor.customer_id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icons.Customer />
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {debtor.customer_name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center gap-1">
                          📞 {debtor.customer_phone || "N/A"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Icons.Location />
                          {debtor.customer_location || "Unknown"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600">
                      KES{" "}
                      {debtor.total_debt.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                    <p className="text-xs text-gray-500">
                      {debtor.debt_count} debt
                      {debtor.debt_count !== 1 ? "s" : ""}
                    </p>
                    <div className="mt-1">
                      {expandedDebtorId === debtor.customer_id ? (
                        <ExpandLessIcon />
                      ) : (
                        <ExpandMoreIcon />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Debts List */}
              {expandedDebtorId === debtor.customer_id && (
                <div className="border-t border-gray-200 bg-gray-50 p-4">
                  <h4 className="font-medium text-gray-700 mb-3">
                    Outstanding Debts
                  </h4>
                  <div className="space-y-3">
                    {debtor.debts.map((debt) => (
                      <div
                        key={debt.debt_id}
                        className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-800">
                                KES{" "}
                                {debt.amount.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                })}
                              </span>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  debt.status === "PENDING"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : debt.status === "OVERDUE"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {debt.status}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600 flex flex-wrap gap-x-4 gap-y-1">
                              <span className="flex items-center gap-1">
                                <Icons.Calendar />
                                Repay: {debt.repayment_date || "Not set"}
                              </span>
                              <span className="flex items-center gap-1">
                                🏪 {debt.sale_location || "Unknown shop"}
                              </span>
                              <span>Sale #{debt.sale_id}</span>
                            </div>
                          </div>
                          <Button
                            variant="contained"
                            size="small"
                            color="primary"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleOpenDeposit(debt, debtor.customer_id)
                            }}
                            disabled={debt.status === "PAID"}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Add Deposit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Deposit Modal */}
      <Dialog
        open={depositModalOpen}
        onClose={handleCloseDeposit}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="bg-blue-600 text-white flex justify-between items-center">
          <span>Add Deposit</span>
          <button onClick={handleCloseDeposit} className="text-white">
            <Close className="w-5 h-5" />
          </button>
        </DialogTitle>
        <DialogContent className="mt-4">
          {selectedDebt && (
            <div className="space-y-5">
              <div className="bg-gray-100 p-3 rounded">
                <p className="text-sm text-gray-600">Debt Amount</p>
                <p className="text-xl font-bold">
                  KES{" "}
                  {selectedDebt.amount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Customer:{" "}
                  {
                    debtData.debtors.find(
                      (d) => d.customer_id === selectedCustomerId,
                    )?.customer_name
                  }
                </p>
              </div>

              <form onSubmit={handleSubmitDeposit} className="space-y-5">
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
                    Deposit added successfully! Refreshing data...
                  </div>
                )}

                <DialogActions className="p-0 pt-2">
                  <Button
                    onClick={handleCloseDeposit}
                    disabled={submittingDeposit}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={submittingDeposit}
                    className="bg-blue-600"
                  >
                    {submittingDeposit ? (
                      <CircularProgress size={24} />
                    ) : (
                      "Submit Deposit"
                    )}
                  </Button>
                </DialogActions>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <EmployeeFooter />
    </div>
  )
}

export default EmployeeDebts
