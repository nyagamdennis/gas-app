// @ts-nocheck
import React, { useEffect, useState, useCallback, useMemo } from "react"
import { useMediaQuery, useTheme } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import {
  fetchMyProfile,
  selectMyProfile,
} from "../features/employees/myProfileSlice"
import { Link } from "react-router-dom"
import {
  deleteSalesTeamData,
  fetchSalesTeamData,
  selectAllSalesTeamData,
} from "../features/salesTeam/salesTeamDataSlice"
import FormattedAmount from "../components/FormattedAmount"
import EmployeeFooter from "../components/ui/EmployeeFooter"
import Navbar from "../components/ui/mobile/employees/Navbar"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import {
  CalendarToday,
  ArrowBackIos,
  ArrowForwardIos,
  Today,
  Close,
  Refresh,
  Receipt,
  AttachMoney,
  CreditCard,
  Warning,
  CheckCircle,
  Person,
  Phone,
  LocationOn,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ReceiptLong,
  Search,
  Add,
  Remove,
  AssignmentLate,
} from "@mui/icons-material"
import { selectEmployeeTeam } from "../features/employees/employeesTeamSlice"
import { fetchSales } from "../features/sales/salesSlice"
import api from "../../utils/api"

// Helper: get Nairobi date string (YYYY-MM-DD) reliably
const getNairobiDateString = (date = new Date()) => {
  return date.toLocaleDateString("en-CA", { timeZone: "Africa/Nairobi" })
}

const parseDateString = (dateStr: string) => {
  const [year, month, day] = dateStr.split("-").map(Number)
  return new Date(year, month - 1, day)
}

const TeamSalesPage = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const dispatch = useAppDispatch()

  // --- Data & State ---
  const allSalesData = useAppSelector(selectAllSalesTeamData)

  const [salesData, setSalesData] = useState([])
  const [filteredSales, setFilteredSales] = useState([])
  const [initialLoading, setInitialLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [dateChanging, setDateChanging] = useState(false)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [customerId, setCustomerId] = useState(null)

  // Date state
  const [startDate, setStartDate] = useState<string>(() =>
    getNairobiDateString(),
  )
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [formattedDate, setFormattedDate] = useState("")

  // Customer search
  const [customerSearchTerm, setCustomerSearchTerm] = useState("")

  // Delete modal
  const [openDelete, setOpenDelete] = useState(false)
  const [deleteSaleId, setDeleteSaleId] = useState(null)
  const [deleteProductDesc, setDeleteProductDesc] = useState("")
  const [deleteSoldTo, setDeleteSoldTo] = useState(null)

  // Debt settlement modal
  const [settleModalOpen, setSettleModalOpen] = useState(false)
  const [selectedDebtSale, setSelectedDebtSale] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState("CASH") // "CASH", "MPESA", "BOTH"
  const [cashAmount, setCashAmount] = useState(0)
  const [mpesaDeposits, setMpesaDeposits] = useState([
    { receipt: "", amount: 0 },
  ])
  const [submitting, setSubmitting] = useState(false)

  // Deficit state
  const [deficitData, setDeficitData] = useState([])

  // --- Derived values ---
  const myTeamData = useAppSelector(selectEmployeeTeam)
  const assignmentData = myTeamData?.[0]
  const teamId = assignmentData?.assigned_to?.shop_id
  const teamType = assignmentData?.assigned_to?.type
  const teamName = assignmentData?.assigned_to?.name
  const userId = assignmentData?.user // This is the employee's user ID
  const [deleteReason, setDeleteReason] = useState("Customer returns item")

  const locationFilter = useMemo(() => {
    if (!teamType || !teamId) return {}
    return { [`${teamType}Id`]: teamId }
  }, [teamType, teamId])

  // --- Helper: get list of products with details ---
  const getProductDetails = useCallback((sale) => {
    const products = []
    if (sale.items && sale.items.length) {
      sale.items.forEach((item) => {
        products.push({
          name: item.product_name,
          quantity: item.quantity,
          unitPrice: parseFloat(item.unit_price) || 0,
          totalPrice: parseFloat(item.total_price) || 0,
        })
      })
    }
    if (sale.cylinder_items && sale.cylinder_items.length) {
      sale.cylinder_items.forEach((cyl) => {
        products.push({
          name: cyl.cylinder_name,
          quantity: cyl.quantity,
          unitPrice: parseFloat(cyl.unit_price) || 0,
          totalPrice: parseFloat(cyl.total_price) || 0,
        })
      })
    }
    return products
  }, [])

  const getProductDescription = useCallback(
    (sale) => {
      const products = getProductDetails(sale)
      if (products.length === 0) return "N/A"
      if (products.length === 1)
        return `${products[0].name} (x${products[0].quantity})`
      return `${products.length} items: ${products
        .map((p) => `${p.name} (x${p.quantity})`)
        .join(", ")}`
    },
    [getProductDetails],
  )

  const getExchangeStatus = useCallback((sale) => {
    if (sale.cylinder_items && sale.cylinder_items.length) {
      return sale.cylinder_items.some(
        (cyl) => cyl.exchanged_with_local === true,
      )
    }
    return false
  }, [])

  // Payment summary: returns amounts and verification status per method
  const getPaymentSummary = useCallback((sale) => {
    let cashAmount = 0
    let cashVerified = true
    let mpesaAmount = 0
    let mpesaVerified = true

    if (sale.payments && sale.payments.length) {
      sale.payments.forEach((payment) => {
        const amount = parseFloat(payment.amount) || 0
        if (payment.payment_method === "CASH") {
          cashAmount += amount
          if (!payment.is_verified) cashVerified = false
        } else if (payment.payment_method === "MPESA") {
          mpesaAmount += amount
          if (!payment.is_verified) mpesaVerified = false
        }
      })
    }
    return { cashAmount, cashVerified, mpesaAmount, mpesaVerified }
  }, [])

  // --- Data fetching ---
  const loadSalesData = useCallback(
    async (date: string, forceRefresh = false) => {
      if (!date) return
      setDateChanging(true)
      setError(null)

      try {
        const cacheKey = `sales_team_${teamId}_${date}`
        if (!forceRefresh) {
          const cached = localStorage.getItem(cacheKey)
          if (cached) {
            const parsed = JSON.parse(cached)
            if (Date.now() - parsed.timestamp < 5 * 60 * 1000) {
              setSalesData(parsed.salesData)
              setFilteredSales(parsed.salesData)
              setLastUpdated(new Date().toLocaleTimeString())
              setDateChanging(false)
              setInitialLoading(false)
              return
            }
          }
        }

        const result = await dispatch(
          fetchSales({ ...locationFilter, date }),
        ).unwrap()
        const salesArray = Array.isArray(result) ? result : result.results || []
        setSalesData(salesArray)
        setFilteredSales(salesArray)
        setLastUpdated(new Date().toLocaleTimeString())

        localStorage.setItem(
          cacheKey,
          JSON.stringify({ salesData: salesArray, timestamp: Date.now() }),
        )
      } catch (err) {
        console.error("Failed to load sales:", err)
        setError({ message: "Failed to load sales data", details: err.message })
        toast.error("Could not load sales data")
      } finally {
        setDateChanging(false)
        setInitialLoading(false)
        setRefreshing(false)
      }
    },
    [dispatch, teamId, locationFilter],
  )

  // --- Fetch deficits ---
  const fetchDeficits = useCallback(async () => {
    if (!teamId || !teamType || !startDate) return
    try {
      const response = await api.get(
        `/sales/daily-analyses/deficits_by_team/`,
        {
          params: {
            start_date: startDate,
            team_type: teamType.toUpperCase(),
            team_id: teamId,
          },
        },
      )
      if (response.data?.deficits) {
        setDeficitData(response.data.deficits)
      } else {
        setDeficitData([])
      }
    } catch (error) {
      console.error("Failed to fetch deficits:", error)
      // Don't show toast to avoid spam, just set empty
      setDeficitData([])
    }
  }, [teamId, teamType, startDate])

  // Filter by customer search
  useEffect(() => {
    if (!salesData.length) return
    if (!customerSearchTerm.trim()) {
      setFilteredSales(salesData)
    } else {
      const term = customerSearchTerm.toLowerCase()
      const filtered = salesData.filter(
        (sale) =>
          sale.customer_info?.name?.toLowerCase().includes(term) ||
          sale.customer_info?.phone?.includes(term),
      )
      setFilteredSales(filtered)
    }
  }, [customerSearchTerm, salesData])

  const handleRefresh = useCallback(async () => {
    setRefreshing(true)
    await loadSalesData(startDate, true)
    await fetchDeficits()
    toast.success("Sales data refreshed")
  }, [startDate, loadSalesData, fetchDeficits])

  const goToPreviousDay = useCallback(() => {
    const currentDate = parseDateString(startDate)
    currentDate.setDate(currentDate.getDate() - 1)
    const newDate = getNairobiDateString(currentDate)
    setStartDate(newDate)
    loadSalesData(newDate)
  }, [startDate, loadSalesData])

  const goToNextDay = useCallback(() => {
    const currentDate = parseDateString(startDate)
    currentDate.setDate(currentDate.getDate() + 1)
    const newDate = getNairobiDateString(currentDate)
    setStartDate(newDate)
    loadSalesData(newDate)
  }, [startDate, loadSalesData])

  const goToToday = useCallback(() => {
    const today = getNairobiDateString()
    if (today !== startDate) {
      setStartDate(today)
      loadSalesData(today)
      toast.success("Navigated to today")
    } else {
      toast.info("Already viewing today")
    }
  }, [startDate, loadSalesData])

  // Delete handler
  const handleDelete = async () => {
    try {
      await api.post(`sales/sales/${deleteSaleId}/void/`, {
        reason: deleteReason,
      })
      toast.success("Sales record voided successfully")
      handleCloseDelete()
      await loadSalesData(startDate, true)
      await fetchDeficits()
    } catch (error) {
      toast.error("Error voiding sales record")
    }
  }

  const handleOpenDelete = (sale) => {
    setDeleteSaleId(sale.id)
    setDeleteProductDesc(getProductDescription(sale))
    setDeleteSoldTo(sale.customer_info?.name || "Unknown")
    setOpenDelete(true)
  }

  const handleCloseDelete = () => {
    setOpenDelete(false)
    setDeleteSaleId(null)
  }

  // Debt settlement modal handlers
  const openSettleModal = (sale) => {
    setCustomerId(sale.customer_info?.id || null)
    setSelectedDebtSale(sale)
    setPaymentMethod("CASH")
    setCashAmount(sale.debt?.remaining_amount || 0)
    setMpesaDeposits([{ receipt: "", amount: 0 }])
    setSettleModalOpen(true)
  }

  const closeSettleModal = () => {
    setSettleModalOpen(false)
    setSelectedDebtSale(null)
  }

  const addMpesaDeposit = () => {
    setMpesaDeposits([...mpesaDeposits, { receipt: "", amount: 0 }])
  }

  const removeMpesaDeposit = (index) => {
    if (mpesaDeposits.length === 1) return
    const newDeposits = mpesaDeposits.filter((_, i) => i !== index)
    setMpesaDeposits(newDeposits)
  }

  const updateMpesaDeposit = (index, field, value) => {
    const updated = [...mpesaDeposits]
    updated[index][field] = field === "amount" ? parseFloat(value) || 0 : value
    setMpesaDeposits(updated)
  }

  const handleSettleSubmit = async () => {
    if (!selectedDebtSale && customerId) return

    let totalPayment = 0
    if (paymentMethod === "CASH") {
      totalPayment = cashAmount
    } else if (paymentMethod === "MPESA") {
      totalPayment = mpesaDeposits.reduce((sum, d) => sum + (d.amount || 0), 0)
    } else if (paymentMethod === "BOTH") {
      totalPayment =
        cashAmount + mpesaDeposits.reduce((sum, d) => sum + (d.amount || 0), 0)
    }

    const remainingDebt = parseFloat(
      selectedDebtSale.debt?.remaining_amount || 0,
    )

    if (totalPayment <= 0) {
      toast.error("Please enter a valid payment amount")
      return
    }
    if (totalPayment > remainingDebt) {
      toast.error(`Payment cannot exceed remaining debt of ${remainingDebt}`)
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        sale_id: selectedDebtSale.id,
        debt_id: selectedDebtSale.debt.id,
        payment_method: paymentMethod,
        cash_amount:
          paymentMethod === "CASH" || paymentMethod === "BOTH" ? cashAmount : 0,
        mpesa_deposits:
          paymentMethod === "MPESA" || paymentMethod === "BOTH"
            ? mpesaDeposits
            : [],
        amount_paid: totalPayment,
      }

      await api.post(`sales/${customerId}/deposit/`, payload)
      toast.success(`Successfully paid ${totalPayment} towards debt`)
      closeSettleModal()
      await loadSalesData(startDate, true)
      await fetchDeficits()
    } catch (err) {
      console.error(err)
      toast.error("Failed to settle debt. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const formatDisplayDate = useCallback((dateStr: string) => {
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString("en-GB", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return dateStr
    }
  }, [])

  // Totals calculation – exclude voided sales
  const totals = useMemo(() => {
    let totalSales = 0,
      totalCash = 0,
      totalMpesa = 0,
      totalUnverifiedMpesa = 0
    for (const sale of filteredSales) {
      if (sale.is_void) continue
      totalSales += Number(sale.total_amount) || 0
      if (sale.payments) {
        for (const payment of sale.payments) {
          const payAmount = Number(payment.amount) || 0
          if (payment.payment_method === "CASH") totalCash += payAmount
          else if (payment.payment_method === "MPESA") {
            totalMpesa += payAmount
            if (!payment.is_verified) totalUnverifiedMpesa += payAmount
          }
        }
      }
    }
    return { totalSales, totalCash, totalMpesa, totalUnverifiedMpesa }
  }, [filteredSales])

  // Load sales and deficits on mount and when date changes
  useEffect(() => {
    if (teamId) {
      loadSalesData(startDate)
      setFormattedDate(formatDisplayDate(startDate))
    }
  }, [teamId, startDate, loadSalesData, formatDisplayDate])

  // Fetch deficits after sales data is loaded
  useEffect(() => {
    if (salesData.length > 0) {
      fetchDeficits()
    }
  }, [salesData, startDate, fetchDeficits])

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading sales data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-gray-800 flex flex-col font-sans">
      <Navbar
        headerMessage="Sales Dashboard"
        headerText="Manage your team's sales with ease"
      />
      <ToastContainer position="top-right" autoClose={5000} theme="colored" />

      {/* Header with date navigation and search */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b shadow-sm">
        <div className="p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Receipt className="text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 truncate">
                    {teamName ? `${teamName}` : "Team Sales"} {teamType}
                  </h1>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CalendarToday fontSize="small" />
                    <span className="font-medium">{formattedDate}</span>
                    {lastUpdated && (
                      <span className="text-xs text-gray-500">
                        • Updated: {lastUpdated}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Customer search */}
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  fontSize="small"
                />
                <input
                  type="text"
                  placeholder="Search customer..."
                  value={customerSearchTerm}
                  onChange={(e) => setCustomerSearchTerm(e.target.value)}
                  className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg w-full sm:w-64 text-sm focus:ring-2 focus:ring-blue-500"
                />
                {customerSearchTerm && (
                  <button
                    onClick={() => setCustomerSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <Close fontSize="small" />
                  </button>
                )}
              </div>

              {/* Date navigation */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={goToPreviousDay}
                    disabled={dateChanging}
                    className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                  >
                    <ArrowBackIos fontSize="small" />
                  </button>
                  <div className="relative mx-2">
                    <button
                      onClick={() => setShowDatePicker(!showDatePicker)}
                      className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border hover:border-blue-500"
                    >
                      <CalendarToday fontSize="small" />
                      <span className="font-medium">{startDate}</span>
                    </button>
                    {showDatePicker && (
                      <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border p-3 z-50 min-w-[280px]">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-medium">Select Date</h3>
                          <button onClick={() => setShowDatePicker(false)}>
                            <Close fontSize="small" />
                          </button>
                        </div>
                        <input
                          type="date"
                          className="w-full p-2 border rounded-lg mb-3"
                          value={startDate}
                          onChange={(e) => {
                            setStartDate(e.target.value)
                            loadSalesData(e.target.value)
                            setShowDatePicker(false)
                          }}
                        />
                        <button
                          onClick={goToToday}
                          className="w-full px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-sm"
                        >
                          <Today className="inline mr-2" fontSize="small" /> Go
                          to Today
                        </button>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={goToNextDay}
                    disabled={dateChanging}
                    className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                  >
                    <ArrowForwardIos fontSize="small" />
                  </button>
                </div>
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  <Refresh
                    fontSize="small"
                    className={refreshing ? "animate-spin" : ""}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="m-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-start">
              <Warning className="text-red-600 mr-3" />
              <div>
                <h3 className="font-semibold text-red-800">{error.message}</h3>
                <p className="text-red-700 text-sm">{error.details}</p>
                <button
                  onClick={handleRefresh}
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {dateChanging && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="bg-white/90 p-4 rounded-xl shadow-lg flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span>Loading sales for {startDate}...</span>
          </div>
        </div>
      )}

      <main className="flex-grow p-4 pb-24">
        {/* Totals cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border hover:shadow-md transition">
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Total Sales
            </p>
            <p className="text-2xl font-bold text-gray-800">
              <FormattedAmount amount={totals.totalSales} />
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border hover:shadow-md transition">
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Cash (verified)
            </p>
            <p className="text-2xl font-bold text-green-600">
              <FormattedAmount amount={totals.totalCash} />
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border hover:shadow-md transition">
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              M-Pesa (verified)
            </p>
            <p className="text-2xl font-bold text-blue-600">
              <FormattedAmount amount={totals.totalMpesa} />
            </p>
          </div>
          {totals.totalUnverifiedMpesa > 0 && (
            <div className="bg-white rounded-xl p-4 shadow-sm border hover:shadow-md transition">
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Unverified M-Pesa
              </p>
              <p className="text-2xl font-bold text-orange-600">
                <FormattedAmount amount={totals.totalUnverifiedMpesa} />
              </p>
            </div>
          )}
        </div>

        {/* Sales list */}
        {filteredSales.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center text-gray-500 shadow-sm">
            <ReceiptLong className="text-4xl text-gray-300 mx-auto mb-3" />
            <p>No sales recorded for {formattedDate}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSales.map((sale) => {
              const products = getProductDetails(sale)
              const payment = getPaymentSummary(sale)
              const hasDebt = sale.debt && sale.debt.remaining_amount > 0
              // Find deficit for this sale
              const saleDeficit = deficitData.find((d) => d.sale === sale.id)
              const isCurrentUserResponsible =
                saleDeficit &&
                saleDeficit.responsibility_type === "EMPLOYEE" &&
                saleDeficit.assigned_employee__user_id === userId

              return (
                <div
                  key={sale.id}
                  className={`bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col ${
                    sale.is_void ? "opacity-75 bg-gray-50" : ""
                  }`}
                >
                  {/* Invoice header */}
                  <div
                    className={`px-4 py-3 border-b flex justify-between items-center ${
                      sale.is_void
                        ? "bg-red-50 border-red-200"
                        : "bg-gradient-to-r from-blue-50 to-indigo-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <ReceiptLong
                        className={
                          sale.is_void ? "text-red-600" : "text-blue-600"
                        }
                        fontSize="small"
                      />
                      <span
                        className={`font-mono font-bold ${
                          sale.is_void
                            ? "text-red-700 line-through"
                            : "text-gray-700"
                        }`}
                      >
                        {sale.invoice_number}
                      </span>
                      {sale.is_void && (
                        <span className="ml-2 px-2 py-0.5 bg-red-600 text-white text-xs rounded-full">
                          VOIDED
                        </span>
                      )}
                    </div>
                    <div className="flex gap-1">
                      {!sale.is_void && (
                        <button
                          onClick={() => handleOpenDelete(sale)}
                          className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition"
                        >
                          <DeleteIcon fontSize="small" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="p-4 flex flex-col gap-3">
                    {/* Void reason (if any) */}
                    {sale.is_void && sale.void_reason && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-xs text-red-700">
                        <strong>Void reason:</strong> {sale.void_reason}
                      </div>
                    )}

                    {/* Deficit block */}
                    {saleDeficit && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-red-700">
                            <Warning fontSize="small" />
                            <span className="text-xs font-medium">Deficit</span>
                          </div>
                          <span className="text-xs font-bold text-red-700">
                            +
                            <FormattedAmount
                              amount={saleDeficit.difference_amount}
                            />
                          </span>
                        </div>
                        <p className="text-xs text-red-600 mt-1">
                          {saleDeficit.item_name} –{" "}
                          {saleDeficit.reason?.replace(/_/g, " ")}
                        </p>
                        {isCurrentUserResponsible && (
                          <div className="mt-2 p-1.5 bg-yellow-100 rounded text-xs text-yellow-800 flex items-start gap-1">
                            <AssignmentLate fontSize="small" />
                            <span>
                              You are responsible.{" "}
                              {saleDeficit.is_salary_deductible
                                ? "This amount will be deducted from your salary."
                                : "You are accountable but no salary deduction."}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm">
                      <Person fontSize="small" className="text-gray-400" />
                      <span className="font-medium">
                        {sale.salesperson_data?.full_name ||
                          `${sale.salesperson_data?.first_name || ""} ${
                            sale.salesperson_data?.last_name || ""
                          }`}
                      </span>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <Person fontSize="small" className="text-gray-400" />
                        <span className="font-medium">Customer:</span>
                        <span>{sale.customer_info?.name || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone fontSize="small" className="text-gray-400" />
                        <span>+254 {sale.customer_info?.phone || "—"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <LocationOn
                          fontSize="small"
                          className="text-gray-400"
                        />
                        <span>{sale.customer_info?.location_name || "—"}</span>
                      </div>
                    </div>

                    {products.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          Items
                        </p>
                        <div className="space-y-2">
                          {products.map((product, idx) => (
                            <div
                              key={idx}
                              className="border-b border-gray-100 pb-2 last:border-0"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium text-gray-800">
                                    {product.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Qty: {product.quantity} ×{" "}
                                    <FormattedAmount
                                      amount={product.unitPrice}
                                    />
                                  </p>
                                </div>
                                <p className="font-semibold text-gray-800">
                                  <FormattedAmount
                                    amount={product.totalPrice}
                                  />
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium">
                        {sale.sale_type}{" "}
                        {sale.has_cylinder_sales ? "(Cylinder)" : ""}
                      </span>
                      {getExchangeStatus(sale) ? (
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                          Exchanged Locally
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          No Exchange
                        </span>
                      )}
                    </div>

                    {/* Debt info and settle button */}
                    {hasDebt ? (
                      <div className="bg-red-50 rounded-lg p-3 text-sm">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-red-700 font-medium flex items-center gap-1">
                              <Warning fontSize="small" /> Debt
                            </p>
                            <p className="text-red-600">
                              Amount:{" "}
                              <FormattedAmount
                                amount={sale.debt.remaining_amount || 0}
                              />
                            </p>
                            <p className="text-xs text-red-500">
                              Repay by: {sale.debt.repayment_date || "N/A"}
                            </p>
                          </div>
                          {!sale.is_void && (
                            <button
                              onClick={() => openSettleModal(sale)}
                              className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs hover:bg-red-700 transition"
                            >
                              Settle Debt
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-green-50 rounded-lg p-2 text-center text-green-700 text-sm">
                        ✓ No Debt
                      </div>
                    )}

                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Payment
                      </p>
                      <div className="space-y-1 text-sm">
                        {payment.cashAmount > 0 && (
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <AttachMoney
                                fontSize="small"
                                className="text-gray-500"
                              />
                              <span>Cash</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FormattedAmount amount={payment.cashAmount} />
                              {payment.cashVerified ? (
                                <CheckCircle
                                  fontSize="small"
                                  className="text-green-600"
                                />
                              ) : (
                                <Warning
                                  fontSize="small"
                                  className="text-red-500"
                                />
                              )}
                            </div>
                          </div>
                        )}
                        {payment.mpesaAmount > 0 && (
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <CreditCard
                                fontSize="small"
                                className="text-gray-500"
                              />
                              <span>M-Pesa</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FormattedAmount amount={payment.mpesaAmount} />
                              {payment.mpesaVerified ? (
                                <CheckCircle
                                  fontSize="small"
                                  className="text-green-600"
                                />
                              ) : (
                                <Warning
                                  fontSize="small"
                                  className="text-red-500"
                                />
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t flex justify-between items-center">
                      <span className="font-bold text-gray-700">Total</span>
                      <span
                        className={`text-xl font-bold ${
                          sale.is_void
                            ? "text-gray-500 line-through"
                            : "text-blue-700"
                        }`}
                      >
                        <FormattedAmount amount={sale.total_amount} />
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 text-right">
                      {new Date(sale.created_at).toLocaleDateString("en-GB")} at{" "}
                      {new Date(sale.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Delete confirmation dialog */}
      <Dialog open={openDelete} onClose={handleCloseDelete}>
        <DialogTitle>Confirm Void</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to void the sales record for{" "}
            <strong>{deleteProductDesc}</strong> sold to {deleteSoldTo}? All
            products will be added back to stock. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>Cancel</Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Void
          </Button>
        </DialogActions>
      </Dialog>

      {/* Debt Settlement Modal */}
      <Dialog
        open={settleModalOpen}
        onClose={closeSettleModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Settle Debt</DialogTitle>
        <DialogContent>
          {selectedDebtSale && (
            <div className="space-y-4 py-2">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">
                  Customer:{" "}
                  <span className="font-medium">
                    {selectedDebtSale.customer_info?.name}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Invoice:{" "}
                  <span className="font-mono">
                    {selectedDebtSale.invoice_number}
                  </span>
                </p>
                <p className="text-lg font-bold text-red-600 mt-2">
                  Outstanding Debt:{" "}
                  <FormattedAmount
                    amount={selectedDebtSale.debt?.remaining_amount || 0}
                  />
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <div className="flex gap-3 flex-wrap">
                  {["CASH", "MPESA", "BOTH"].map((method) => (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        paymentMethod === method
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {method === "CASH"
                        ? "Cash Only"
                        : method === "MPESA"
                        ? "M-Pesa Only"
                        : "M-Pesa + Cash"}
                    </button>
                  ))}
                </div>
              </div>

              {(paymentMethod === "CASH" || paymentMethod === "BOTH") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cash Amount
                  </label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                    value={cashAmount}
                    onChange={(e) =>
                      setCashAmount(parseFloat(e.target.value) || 0)
                    }
                    min="0"
                    step="0.01"
                  />
                </div>
              )}

              {(paymentMethod === "MPESA" || paymentMethod === "BOTH") && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      M-Pesa Deposits
                    </label>
                    <button
                      onClick={addMpesaDeposit}
                      className="text-blue-600 text-sm flex items-center gap-1"
                    >
                      <Add fontSize="small" /> Add Deposit
                    </button>
                  </div>
                  <div className="space-y-3">
                    {mpesaDeposits.map((deposit, idx) => (
                      <div
                        key={idx}
                        className="border border-gray-200 rounded-lg p-3 relative"
                      >
                        {mpesaDeposits.length > 1 && (
                          <button
                            onClick={() => removeMpesaDeposit(idx)}
                            className="absolute top-2 right-2 text-red-500"
                          >
                            <Remove fontSize="small" />
                          </button>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Receipt / Transaction ID"
                            className="border border-gray-300 rounded-lg p-2 text-sm"
                            value={deposit.receipt}
                            onChange={(e) =>
                              updateMpesaDeposit(idx, "receipt", e.target.value)
                            }
                          />
                          <input
                            type="number"
                            placeholder="Amount"
                            className="border border-gray-300 rounded-lg p-2 text-sm"
                            value={deposit.amount}
                            onChange={(e) =>
                              updateMpesaDeposit(idx, "amount", e.target.value)
                            }
                            min="0"
                            step="0.01"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-blue-800">
                  Total Payment:{" "}
                  <FormattedAmount
                    amount={
                      (paymentMethod === "CASH" || paymentMethod === "BOTH"
                        ? cashAmount
                        : 0) +
                      (paymentMethod === "MPESA" || paymentMethod === "BOTH"
                        ? mpesaDeposits.reduce((s, d) => s + (d.amount || 0), 0)
                        : 0)
                    }
                  />
                </p>
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeSettleModal}>Cancel</Button>
          <Button
            onClick={handleSettleSubmit}
            variant="contained"
            color="primary"
            disabled={submitting}
          >
            {submitting ? "Processing..." : "Settle Debt"}
          </Button>
        </DialogActions>
      </Dialog>

      <footer className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t">
        <EmployeeFooter />
      </footer>
    </div>
  )
}

export default TeamSalesPage
