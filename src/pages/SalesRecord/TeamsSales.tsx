// @ts-nocheck
import React, { useEffect, useState, useCallback, useMemo, useRef } from "react"
import { useMediaQuery, useTheme } from "@mui/material"
import planStatus from "../../features/planStatus/planStatus"
import AdminsFooter from "../../components/AdminsFooter"
import Navbar from "../../components/ui/mobile/admin/Navbar"
import { useParams, useNavigate } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import api from "../../../utils/api"
import {
  Receipt,
  People,
  LocalGasStation,
  AttachMoney,
  CreditCard,
  TrendingUp,
  Inventory,
  CalendarToday,
  LocationOn,
  Person,
  CheckCircle,
  Cancel,
  Refresh,
  Download,
  Print,
  FilterList,
  Search,
  Warning,
  Paid,
  ReceiptLong,
  CheckCircleOutline,
  ErrorOutline,
  MonetizationOn,
  MoneyOff,
  DirectionsCar,
  Store,
  Shop,
  Phone,
  Email,
  Assignment,
  AssignmentTurnedIn,
  NoteAdd,
  Visibility,
  Close,
  Add,
  Remove,
  Edit,
  Save,
  Cancel as CancelIcon,
  Delete,
  AssignmentLate,
  LocalAtm,
  CreditScore,
  Fastfood,
  CarRepair,
  ElectricalServices,
  Restaurant,
  MedicalServices,
  ShoppingCart,
  Calculate,
  Summarize,
  VerifiedUser,
  ArrowDropDown,
  ArrowDropUp,
  Menu,
  ChevronRight,
  DateRange,
  Today,
  ArrowBackIos,
  ArrowForwardIos,
  BarChart,
  PieChart,
  Timeline,
  TrendingFlat,
  Money,
  AccountBalance,
  Security,
  Lock,
  LockOpen,
  History,
  Restore,
  CloudDownload,
  CloudUpload,
  Share,
  QrCode,
  Receipt as ReceiptIcon,
  Description,
  FileCopy,
  ContentCopy,
  Speed,
  Analytics,
  Dashboard,
  Insights,
  DataUsage,
  Assessment,
  AccountTree,
  Category,
  Class,
  Work,
  Business,
  Apartment,
  Group,
  Groups,
  SupervisorAccount,
  Badge,
  WorkOutline,
  BusinessCenter,
  Storefront,
  LocalMall,
  ShoppingBag,
  PointOfSale,
  Payments,
  Payment,
  AccountBalanceWallet,
  Wallet,
  AccountCircle,
  Face,
  EmojiPeople,
  PersonPin,
  ContactMail,
  ContactPhone,
  ContactSupport,
  SupportAgent,
  HeadsetMic,
  Help,
  HelpOutline,
  Info,
  InfoOutlined,
  NotificationImportant,
  Notifications,
  NotificationsActive,
  Announcement,
  Campaign,
  Megaphone,
  VolumeUp,
  VolumeOff,
  VolumeDown,
  MusicNote,
  Audiotrack,
  GraphicEq,
  Equalizer,
  Timeline as TimelineIcon,
  ShowChart,
  MultilineChart,
  StackedLineChart,
  AreaChart,
  DonutLarge,
  DonutSmall,
  BubbleChart,
  ScatterPlot,
  LegendToggle,
  DataThresholding,
  Schema,
  Polyline,
  Splitscreen,
  VerticalSplit,
  HorizontalSplit,
  ViewSidebar,
  ViewWeek,
  ViewColumn,
  TableChart,
  TableRows,
  TableView,
  GridOn,
  GridView,
  ViewList,
  ViewModule,
  ViewQuilt,
  ViewComfy,
  ViewCompact,
  ViewStream,
  ViewAgenda,
  ViewCarousel,
  ViewDay,
  ViewHeadline,
  ViewCozy,
  MoreVert,
  ExpandMore,
  ExpandLess,
  DragIndicator,
  Reorder,
  Sort,
  SwapVert,
  SwapHoriz,
  SwapVerticalCircle,
  SwapHorizontalCircle,
  ImportExport,
  CompareArrows,
  Compare,
  Difference,
  Functions,
  Calculate as CalculateIcon,
  Addchart,
  Assessment as AssessmentIcon,
  InsertChart,
  InsertChartOutlined,
  PieChartOutline,
  ShowChartOutlined,
  MultilineChartOutlined,
  StackedLineChartOutlined,
  ScatterPlotOutlined,
  BubbleChartOutlined,
  DonutLargeOutlined,
  DonutSmallOutlined,
  TimelineOutlined,
  TrendingUpOutlined,
  TrendingFlatOutlined,
  TrendingDownOutlined,
  WaterfallChart,
  CandlestickChart,
  StackedBarChart,
  StackedLineChart as StackedLineChartIcon,
  StackedBarChartOutlined,
  WaterfallChartOutlined,
  CandlestickChartOutlined,
  AutoGraph,
  AutoGraphOutlined,
  Grade,
  GradeOutlined,
  Star,
  StarBorder,
  StarHalf,
  StarOutline,
  StarRate,
  Stars,
  ThumbUp,
  ThumbUpOffAlt,
  ThumbDown,
  ThumbDownOffAlt,
  Favorite,
  FavoriteBorder,
  HeartBroken,
  SentimentVerySatisfied,
  SentimentSatisfied,
  SentimentDissatisfied,
  SentimentVeryDissatisfied,
  Mood,
  MoodBad,
  SentimentNeutral,
  EmojiEmotions,
  EmojiEvents,
  EmojiFlags,
  EmojiFoodBeverage,
  EmojiNature,
  EmojiObjects,
  EmojiPeople as EmojiPeopleIcon,
  EmojiSymbols,
  EmojiTransportation,
  Bolt,
  ElectricBolt,
  FlashOn,
  FlashOff,
  Lightbulb,
  LightbulbOutline,
  LightMode,
  DarkMode,
  Brightness4,
  Brightness5,
  Brightness6,
  Brightness7,
  Contrast,
  InvertColors,
  Palette,
  ColorLens,
  FormatPaint,
  Brush,
  AutoFixHigh,
  AutoFixNormal,
  AutoFixOff,
  Build,
  Construction,
  Engineering,
  Handyman,
  Plumbing,
  ElectricalServices as ElectricalServicesIcon,
  Carpenter,
} from "@mui/icons-material"
import Tune from "@mui/icons-material/Tune"
import { fetchSales, selectAllSales } from "../../features/sales/salesSlice"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { fetchTeamsEmployees } from "../../features/employees/employeesSlice"
import {
  fetchExpenses,
  fetchTeamExpenses,
  selectAllExpenses,
} from "../../features/expenses/expensesSlice"
import RealTimeIndicator from "../../components/sales/RealTimeIndicator"
import QuickActions from "../../components/sales/QuickActions"
import BatchActions from "../../components/sales/BatchActions"
import SalesCharts from "../../components/sales/SalesCharts"
import EmployeePerformance from "../../components/sales/EmployeePerformance"
import SalesList from "../../components/sales/SalesList"
import ExpensesList from "../../components/sales/ExpensesList"
import SalesInsights from "../../components/sales/SalesInsights"
import SalesTrends from "../../components/sales/SalesTrends"
import CashReconciliation from "../../components/sales/CashReconciliation"
import SettlementSummary from "../../components/sales/SettlementSummary"
import MpesaVerification from "../../components/sales/MpesaVerification"
import ExportModal from "../../components/sales/ExportModal"
import AdvancedFilters from "../../components/sales/AdvancedFilters"
import FormattedAmount from "../../components/FormattedAmount"
import { getNairobiDateString, parseDateString } from "../../utils/dateUtils"

const TeamsSales = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const { id, name, teamtype } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const allSalesData = useAppSelector(selectAllSales)
  const allExpenses = useAppSelector(selectAllExpenses)

  // State Management
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [dateChanging, setDateChanging] = useState(false)
  const [error, setError] = useState(null)
  const [salesData, setSalesData] = useState([])
  const [statistics, setStatistics] = useState(null)
  console.log('sales sata', statistics)
  const [teamInfo, setTeamInfo] = useState(null)
  const [employees, setEmployees] = useState([])
  const [filteredSales, setFilteredSales] = useState([])
  const [expenses, setExpenses] = useState([])
  const [employeeExpenses, setEmployeeExpenses] = useState([])
  const [companyExpenses, setCompanyExpenses] = useState([])

  // Filters State
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSaleType, setSelectedSaleType] = useState("all")
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("all")
  const [selectedEmployee, setSelectedEmployee] = useState("all")
  const [selectedSalespersonType, setSelectedSalespersonType] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [reconciling, setReconciling] = React.useState(false)

  // Sales Categorization
  const [cylinderSales, setCylinderSales] = useState([])
  const [regularSales, setRegularSales] = useState([])
  const [mixedSales, setMixedSales] = useState([])

  // UI State
  const [activeSection, setActiveSection] = useState("overview")
  const [expandedSaleId, setExpandedSaleId] = useState(null)

  const [cashReconciliationRecord, setCashReconciliationRecord] = useState(null)
  const [mpesaReconciliationRecord, setMpesaReconciliationRecord] =
    useState(null)
  // Enhanced Features State
  const [showExportModal, setShowExportModal] = useState(false)
  const [showSalesSummary, setShowSalesSummary] = useState(false)
  const [showReconciliationReport, setShowReconciliationReport] =
    useState(false)
  const [showEmployeePerformance, setShowEmployeePerformance] = useState(false)
  const [showSalesInsights, setShowSalesInsights] = useState(false)
  const [showBulkOperations, setShowBulkOperations] = useState(false)
  const [showSalesTrends, setShowSalesTrends] = useState(false)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [showCashReconciliation, setShowCashReconciliation] = useState(false)
  const [showMpesaVerification, setShowMpesaVerification] = useState(false)

  // Advanced Features
  const [batchMode, setBatchMode] = useState(false)
  const [selectedBatchItems, setSelectedBatchItems] = useState([])
  const [lastUpdated, setLastUpdated] = useState(null)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [realTimeEnabled, setRealTimeEnabled] = useState(false)
  const [dataVersion, setDataVersion] = useState(0)

  const [totalSalesDebt, setTotalSalesDebt] = useState(0)
  const [hasCashReconciliation, setHasCashReconciliation] = useState(false)
  const [hasMpesaReconciliation, setHasMpesaReconciliation] = useState(false)

  const [startDate, setStartDate] = useState<string>(() => {
    return getNairobiDateString() // Always get Nairobi date
  })



  const [showDatePicker, setShowDatePicker] = useState(false)
  const [formattedDate, setFormattedDate] = useState("")

  // Settlement & Verification
  const [dailySettlement, setDailySettlement] = useState(null)
  const [isFinalized, setIsFinalized] = useState(false)
  const [cashVerification, setCashVerification] = useState({
    expectedCash: 0,
    totalSalesCash: 0,
    totalCashExpenses: 0,
    actualCash: 0,
    missingCash: 0,
    verifiedByEmployeeId: "",
    notes: "",
  })

  const [isReconciling, setIsReconciling] = useState(false);

  const [mpesaVerification, setMpesaVerification] = useState({
    expectedMpesa: 0,
    totalSalesMpesa: 0,
    totalMpesaExpenses: 0,
    actualMpesa: 0,
    missingMpesa: 0,
    unverifiedPayments: [],
    notes: "",
  })

  // Add these state declarations:
  const [itemDeficitForm, setItemDeficitForm] = useState({
    saleId: "",
    invoiceNumber: "",
    itemType: "",
    itemId: "",
    itemName: "",
    expectedPrice: 0,
    actualPrice: 0,
    deficitAmount: 0,
    assignedEmployeeId: "",
    assignedToCompany: false,
    reason: "",
    notes: "",
    isSalaryDeductible: true,
  })

  const [expenseAssignment, setExpenseAssignment] = useState({
    employeeId: "",
    isCompanyExpense: false,
    deduction_amount: 0,
    notes: "",
  })

  // Modals State
  const [showSettlementModal, setShowSettlementModal] = useState(false)
  const [settlementNotes, setSettlementNotes] = useState("")
  const [showItemDeficitModal, setShowItemDeficitModal] = useState(false)
  const [selectedItemForDeficit, setSelectedItemForDeficit] = useState(null)
  const [showExpenseAssignment, setShowExpenseAssignment] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState(null)

  // Derived Values
  const decodedTeamName = decodeURIComponent(name || "")
  const decodedTeamType = decodeURIComponent(teamtype || "")
  const teamId = Number(id) || 0
  const { businessName, businessId } = planStatus()
  const companyId = businessId

  // Add these state declarations after your other modal states:
  const [showShortageAssignment, setShowShortageAssignment] = useState(false)
  const [selectedShortageType, setSelectedShortageType] = useState("") // "cash" or "mpesa"

  // Update your isShortage helper function
  const isShortage = useCallback(() => {
    if (selectedShortageType === "cash") {
      return cashVerification.missingCash > 0
    } else {
      // For M-Pesa, check if there's unverified amount
      const totalUnverifiedAmount = mpesaVerification.unverifiedPayments.reduce(
        (sum, payment) => sum + parseFloat(payment.amount || 0),
        0,
      )
      return totalUnverifiedAmount > 0
    }
  }, [
    selectedShortageType,
    cashVerification.missingCash,
    mpesaVerification.unverifiedPayments,
  ])

  // Update your initial state to include new fields
  const [shortageAssignment, setShortageAssignment] = useState({
    shortageType: "",
    amount: 0,
    assignedTo: "", // "employee" or "company"
    employeeId: "",
    isSalaryDeductible: false, // For shortages
    isSalaryAddition: false, // For excess
    isCompanyAbsorption: false, // For excess when company keeps it
    notes: "",
  })

  // Memoized Values
  const locationFilter = useMemo(() => {
    if (!decodedTeamType || !teamId) return {}
    return { [`${decodedTeamType}Id`]: teamId }
  }, [decodedTeamType, teamId])

  // Enhanced Date Formatting
  const formatDate = useCallback((dateString, format = "full") => {
    try {
      const date = new Date(dateString)
      const options = {
        full: {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        },
        short: {
          year: "numeric",
          month: "short",
          day: "numeric",
        },
        time: {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        },
      }
      return date.toLocaleDateString("en-US", options[format] || options.full)
    } catch (error) {
      return "Invalid Date"
    }
  }, [])

  // Categorize Sales
  const categorizeSales = useCallback((sales) => {
    const cylinderOnly = []
    const regularOnly = []
    const mixed = []

    let salesArray = []
    if (Array.isArray(sales)) {
      salesArray = sales
    } else if (sales && typeof sales === "object") {
      if (Array.isArray(sales.results)) salesArray = sales.results
      else if (Array.isArray(sales.data)) salesArray = sales.data
      else
        salesArray = Object.values(sales).filter(
          (item) => typeof item === "object" && item !== null,
        )
    }

    salesArray.forEach((sale) => {
      if (!sale || typeof sale !== "object") return

      const hasCylinderItems =
        sale.cylinder_items &&
        Array.isArray(sale.cylinder_items) &&
        sale.cylinder_items.length > 0

      const hasRegularItems =
        sale.items && Array.isArray(sale.items) && sale.items.length > 0

      if (hasCylinderItems && !hasRegularItems) {
        cylinderOnly.push(sale)
      } else if (!hasCylinderItems && hasRegularItems) {
        regularOnly.push(sale)
      } else if (hasCylinderItems && hasRegularItems) {
        mixed.push(sale)
      } else {
        regularOnly.push(sale)
      }
    })

    return { cylinderOnly, regularOnly, mixed }
  }, [])

  // Categorize Expenses
  const categorizeExpenses = useCallback((expensesData) => {
    const employeeExp = []
    const companyExp = []

    if (!Array.isArray(expensesData)) {
      expensesData = []
    }

    expensesData.forEach((expense) => {
      if (!expense || typeof expense !== "object") return

      if (
        expense.employee_attachments &&
        expense.employee_attachments.length > 0
      ) {
        employeeExp.push(expense)
      } else if (expense?.entered_by) {
        employeeExp.push(expense)
      } else {
        companyExp.push(expense)
      }
    })

    setEmployeeExpenses(employeeExp)
    setCompanyExpenses(companyExp)
  }, [])

  // Calculate Expected Payments - Only Approved Expenses
  const calculateExpectedPayments = useCallback(
    (sales, currentExpenses = expenses) => {
      let totalExpectedCash = 0
      let totalExpectedMpesa = 0
      let unverifiedMpesaPayments = []
      let verifiedMpesaPayments = []

      const salesArray = Array.isArray(sales) ? sales : []

      salesArray.forEach((sale) => {
        if (!sale || !sale.payments || !Array.isArray(sale.payments)) return

        sale.payments.forEach((payment) => {
          if (!payment || typeof payment !== "object") return

          if (payment.payment_method === "CASH") {
            totalExpectedCash += parseFloat(payment.amount || 0)
          } else if (payment.payment_method === "MPESA") {
            totalExpectedMpesa += parseFloat(payment.amount || 0)

            // Get invoice number from the nested sale object
            const invoiceNumber =
              payment.sale?.invoice_number || sale.invoice_number

            const paymentData = {
              saleId: sale.id,
              invoice: invoiceNumber,
              amount: payment.amount,
              receipt: payment.mpesa_receipt_number || payment.reference_number,
              phone: payment.mpesa_phone_number,
              timestamp: payment.transaction_date || payment.created_at,
              paymentId: payment.id,
              mpesaTransactionId: payment.mpesa_transaction_id,
            }

            if (payment.is_verified) {
              verifiedMpesaPayments.push({
                ...paymentData,
                verifiedAt: payment.verified_at || payment.created_at,
              })
            } else {
              unverifiedMpesaPayments.push(paymentData)
            }
          }
        })
      })

      const expensesArray = Array.isArray(currentExpenses)
        ? currentExpenses
        : []

      // Calculate total Cash Expenses - Only APPROVED or PAID expenses
      const totalCashExpenses = expensesArray.reduce((sum, exp) => {
        if (!exp || typeof exp !== "object") return sum

        if (
          exp.payment_method === "CASH" &&
          (exp.status === "APPROVED" || exp.status === "PAID")
        ) {
          return sum + parseFloat(exp.amount || 0)
        }
        return sum
      }, 0)

      // Calculate total M-Pesa Expenses - Only APPROVED or PAID expenses
      const totalMpesaExpenses = expensesArray.reduce((sum, exp) => {
        if (!exp || typeof exp !== "object") return sum

        if (
          exp.payment_method === "MPESA" &&
          (exp.status === "APPROVED" || exp.status === "PAID")
        ) {
          return sum + parseFloat(exp.amount || 0)
        }
        return sum
      }, 0)

      // Calculate net expected cash and M-Pesa
      const netExpectedCash = totalExpectedCash - totalCashExpenses
      const netExpectedMpesa = totalExpectedMpesa - totalMpesaExpenses

      // Calculate actual M-Pesa from verified payments
      const actualMpesa = verifiedMpesaPayments.reduce(
        (sum, payment) => sum + parseFloat(payment.amount || 0),
        0,
      )

      setCashVerification((prev) => ({
        ...prev,
        expectedCash: netExpectedCash,
        totalSalesCash: totalExpectedCash,
        totalCashExpenses: totalCashExpenses,
        missingCash: netExpectedCash - (prev.actualCash || 0),
      }))

      setMpesaVerification((prev) => ({
        ...prev,
        expectedMpesa: netExpectedMpesa,
        totalSalesMpesa: totalExpectedMpesa,
        totalMpesaExpenses: totalMpesaExpenses,
        actualMpesa: actualMpesa,
        unverifiedPayments: unverifiedMpesaPayments,
        verifiedPayments: verifiedMpesaPayments,
        missingMpesa: netExpectedMpesa - actualMpesa,
      }))

      return {
        netExpectedCash,
        netExpectedMpesa,
        unverifiedMpesaPayments,
        verifiedMpesaPayments,
      }
    },
    [expenses],
  )

  // Enhanced Statistics Calculation
  const calculateStatistics = useCallback(
    (sales, expensesData = expenses) => {
      const salesArray = Array.isArray(sales) ? sales : []
      const expensesArray = Array.isArray(expensesData) ? expensesData : []

      // Filter out voided sales
      const activeSales = salesArray.filter((sale) => !sale.is_void)

      if (activeSales.length === 0 && expensesArray.length === 0) {
        const emptyStats = {
          total_sales: 0,
          total_cash: 0,
          total_mpesa: 0,
          total_expenses: 0,
          total_profit: 0,
          sales_count: 0,
          average_sale: 0,
          cylinder_sales_count: 0,
          regular_sales_count: 0,
          mixed_sales_count: 0,
          total_cylinder_amount: 0,
          total_regular_amount: 0,
          peak_hour: null,
          top_products: [],
          top_customers: [],
          average_transaction_value: 0,
          payment_method_distribution: { CASH: 0, MPESA: 0, OTHER: 0 },
        }
        setStatistics(emptyStats)
        return emptyStats
      }

      // Basic sales statistics
      let totalSales = 0
      let totalCash = 0
      let totalMpesa = 0
      let salesCount = 0
      let cylinderCount = 0
      let regularCount = 0
      let mixedCount = 0
      let cylinderAmount = 0
      let regularAmount = 0

      // Track hourly sales for peak hour calculation
      const hourlySales = {}
      const productSales = {}
      const customerSales = {}
      const paymentDistribution = { CASH: 0, MPESA: 0, OTHER: 0 }

      activeSales.forEach((sale) => {
        if (!sale || typeof sale !== "object") return

        const totalAmount = parseFloat(sale.total_amount || 0)
        totalSales += totalAmount
        salesCount++

        // Track payment methods
        sale.payments?.forEach((payment) => {
          const amount = parseFloat(payment.amount || 0)
          const method = payment.payment_method || "OTHER"
          paymentDistribution[method] =
            (paymentDistribution[method] || 0) + amount

          if (method === "CASH") totalCash += amount
          else if (method === "MPESA") totalMpesa += amount
        })

        // Categorize sales
        const hasCylinder = sale.cylinder_items?.length > 0
        const hasRegular = sale.items?.length > 0

        if (hasCylinder && !hasRegular) {
          cylinderCount++
          cylinderAmount += totalAmount
        } else if (!hasCylinder && hasRegular) {
          regularCount++
          regularAmount += totalAmount
        } else if (hasCylinder && hasRegular) {
          mixedCount++
        }

        // Track hourly sales
        const hour = new Date(sale.created_at).getHours()
        hourlySales[hour] = (hourlySales[hour] || 0) + totalAmount

        // Track product sales
        sale.items?.forEach((item) => {
          const productName = item.name || "Unknown"
          productSales[productName] =
            (productSales[productName] || 0) +
            (parseFloat(item.total_price) || 0)
        })

        sale.cylinder_items?.forEach((cylinder) => {
          const productName = cylinder.cylinder_name || "Cylinder"
          productSales[productName] =
            (productSales[productName] || 0) +
            (parseFloat(cylinder.total_price) || 0)
        })

        // Track customer sales
        const customerName = sale.customer_info?.name || "Walk-in"
        customerSales[customerName] =
          (customerSales[customerName] || 0) + totalAmount
      })

      // Find peak hour
      let peakHour = null
      let maxHourlySales = 0
      Object.entries(hourlySales).forEach(([hour, amount]) => {
        if (amount > maxHourlySales) {
          maxHourlySales = amount
          peakHour = `${hour}:00`
        }
      })

      // Find top products (top 5)
      const topProducts = Object.entries(productSales)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([name, amount]) => ({ name, amount }))

      // Find top customers (top 5)
      const topCustomers = Object.entries(customerSales)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([name, amount]) => ({ name, amount }))

      // Calculate expenses
      const totalExpenses = expensesArray.reduce(
        (sum, exp) => sum + (parseFloat(exp.amount) || 0),
        0,
      )

      const stats = {
        total_sales: totalSales,
        total_cash: totalCash,
        total_mpesa: totalMpesa,
        total_expenses: totalExpenses,
        total_profit: totalSales - totalExpenses,
        sales_count: salesCount,
        average_sale: salesCount > 0 ? totalSales / salesCount : 0,
        cylinder_sales_count: cylinderCount,
        regular_sales_count: regularCount,
        mixed_sales_count: mixedCount,
        total_cylinder_amount: cylinderAmount,
        total_regular_amount: regularAmount,
        peak_hour: peakHour,
        top_products: topProducts,
        top_customers: topCustomers,
        average_transaction_value: salesCount > 0 ? totalSales / salesCount : 0,
        payment_method_distribution: paymentDistribution,
      }

      setStatistics(stats)
      return stats
    },
    [expenses],
  )

  const hasCashPayments = (statistics?.total_cash || 0) > 0
  const hasMpesaPayments = (statistics?.total_mpesa || 0) > 0

  const cashSideOk = !hasCashPayments || hasCashReconciliation // if no cash payments, ok; else need reconciliation

  const mpesaSideOk = !hasMpesaPayments || hasMpesaReconciliation // same logic for M‑Pesa

  const canFinalizeByReconciliation = cashSideOk && mpesaSideOk && !isFinalized
  // Check Existing Analysis - IMPROVED VERSION
  const checkExistingAnalysis = useCallback(async (date: string) => {
    try {
      const response = await api.get("/sales/daily-analyses/", {
        params: {
          team_type: decodedTeamType.toUpperCase(),
          team_id: teamId,
          analysis_date: date,
        },
      })

      // Check if response and response.data exist
      if (!response) {
        return null
      }

      // Check if response.data exists
      if (!response.data) {
        return null
      }

      // Handle different response structures
      let results = []

      if (Array.isArray(response.data)) {
        // If response.data is already an array
        results = response.data
      } else if (
        response.data.results &&
        Array.isArray(response.data.results)
      ) {
        // If response.data has a results property
        results = response.data.results
      } else if (response.data.data && Array.isArray(response.data.data)) {
        // If response.data has a data property
        results = response.data.data
      }

      if (results.length > 0) {
        const analysis = results[0]
        return analysis
      }

      return null
    } catch (error) {
      // If it's a 404 error, that's fine - no analysis exists yet
      if (error.response && error.response.status === 404) {
        return null
      }

      // Log more details about the error
      if (error.response) {
       
      } else if (error.request) {
      } else {
      }
      return null
    }
  }, [decodedTeamType, teamId, startDate])

  // Analyze Daily Sales - FIXED VERSION (accepts optional date for the date being loaded)
  const analyzeDailySales = useCallback(
    async (analysisDateOverride?: string) => {
      const analysisDate = analysisDateOverride ?? startDate
      try {
        const response = await api.post(
          "/sales/daily-analyses/analyze_daily_sales/",
          {
            team_type: decodedTeamType.toUpperCase(),
            team_id: teamId,
            analysis_date: analysisDate,
            include_calculations: true,
            analyze_items: true,
            analyze_employees: true,
          },
        )

        // Check if the response indicates data is already finalized
        if (response.data?.detail?.includes("already finalized")) {
          return await checkExistingAnalysis(analysisDate)
        }

        // toast.success("Daily analysis completed!")
        return response.data
      } catch (error) {

        if (error.response?.data?.detail?.includes("already finalized")) {
          toast.info("Data is already finalized for this date")
          return await checkExistingAnalysis(analysisDate)
        }

        toast.error("Failed to analyze daily sales")
        throw error
      }
    },
    [decodedTeamType, teamId, startDate, checkExistingAnalysis],
  )

  // Add this function near other helper functions:
  const resetDateSpecificState = useCallback(() => {
    // Reset all state that's specific to the current date
    setSalesData([])
    setFilteredSales([])
    setExpenses([])
    setEmployeeExpenses([])
    setCompanyExpenses([])
    setCylinderSales([])
    setRegularSales([])
    setMixedSales([])
    setDailySettlement(null)
    setIsFinalized(false)
    setCashVerification({
      expectedCash: 0,
      totalSalesCash: 0,
      totalCashExpenses: 0,
      actualCash: 0,
      missingCash: 0,
      verifiedByEmployeeId: "",
      notes: "",
    })
    setMpesaVerification({
      expectedMpesa: 0,
      totalSalesMpesa: 0,
      totalMpesaExpenses: 0,
      actualMpesa: 0,
      missingMpesa: 0,
      unverifiedPayments: [],
      notes: "",
    })
    setSelectedBatchItems([])
    setStatistics(null)
    setError(null)
  }, [])

  // Add these functions near your other handler functions:
  // Handle opening shortage assignment modal for cash
  const handleAssignCashShortage = useCallback(() => {
    if (cashVerification.missingCash === 0) {
      toast.error("No cash shortage or excess to assign")
      return
    }

    setSelectedShortageType("cash")
    setShortageAssignment({
      shortageType: "cash",
      amount: Math.abs(cashVerification.missingCash),
      assignedTo: "",
      employeeId: "",
      isSalaryDeductible: false,
      notes: "",
    })
    setShowShortageAssignment(true)
  }, [cashVerification.missingCash])

  // Handle opening shortage assignment modal for M-Pesa
  const handleAssignMpesaShortage = useCallback(() => {
    // Calculate total unverified M-Pesa amount
    const totalUnverifiedAmount = mpesaVerification.unverifiedPayments.reduce(
      (sum, payment) => sum + parseFloat(payment.amount || 0),
      0,
    )

    if (totalUnverifiedAmount === 0) {
      toast.error("No unverified M-Pesa to assign")
      return
    }

    setSelectedShortageType("mpesa")
    setShortageAssignment({
      shortageType: "mpesa",
      amount: totalUnverifiedAmount,
      assignedTo: "",
      employeeId: "",
      isSalaryDeductible: false,
      notes: "",
    })
    setShowShortageAssignment(true)
  }, [mpesaVerification.unverifiedPayments])

  // Add this function near your other save functions:
  const saveShortageAssignment = async () => {
    try {
      if (!shortageAssignment.assignedTo) {
        toast.error("Please select where to assign the shortage/excess")
        return
      }

      if (
        shortageAssignment.assignedTo === "employee" &&
        !shortageAssignment.employeeId
      ) {
        toast.error("Please select an employee")
        return
      }

      // Determine if it's shortage or excess
      const isShortageValue =
        selectedShortageType === "cash"
          ? cashVerification.missingCash > 0
          : mpesaVerification.missingMpesa > 0

      const payload = {
        shortage_type: shortageAssignment.shortageType,
        amount: shortageAssignment.amount,
        is_shortage: isShortageValue,
        is_excess: !isShortageValue,
        assigned_to: shortageAssignment.assignedTo,
        employee_id: shortageAssignment.employeeId || null,
        is_salary_deductible: isShortageValue
          ? shortageAssignment.isSalaryDeductible
          : false,
        is_salary_addition: !isShortageValue
          ? shortageAssignment.isSalaryAddition
          : false,
        is_company_absorption: !isShortageValue
          ? shortageAssignment.isCompanyAbsorption
          : false,
        employee_receives_directly:
          !isShortageValue &&
          !shortageAssignment.isSalaryAddition &&
          !shortageAssignment.isCompanyAbsorption,
        notes: shortageAssignment.notes,
        date: startDate,
        team_id: teamId,
        team_type: decodedTeamType,
      }

      const response = await api.post("/shortages/assign", payload)

      if (response.status === 201) {
        toast.success(
          `${isShortageValue ? "Shortage" : "Excess"} assigned successfully!`,
        )
        setShowShortageAssignment(false)

        // Refresh data
        await loadDataForDate(startDate, false, true)
      }
    } catch (error) {
      toast.error(`Failed to assign ${isShortage() ? "shortage" : "excess"}`)
    }
  }


  // Add this function near fetchMpesaReconciliation
  const fetchMpesaReconciliation = useCallback(async (date: string) => {
    try {
      const response = await api.get("/sales/mpesa-reconciliation/", {
        params: {
          team_id: teamId,
          team_type: decodedTeamType,
          date: date,
        },
      })

      if (response.data && response.data.length > 0) {
        const reconciliationData = response.data[0]

        const apiVerified = reconciliationData.verified_payments
        const apiUnverified = reconciliationData.unverified_payments
        const hasPaymentLists =
          (Array.isArray(apiVerified) && apiVerified.length > 0) ||
          (Array.isArray(apiUnverified) && apiUnverified.length > 0)

        let verifiedPayments, unverifiedPayments, actualMpesa

        if (hasPaymentLists) {
          verifiedPayments = apiVerified || []
          unverifiedPayments = apiUnverified || []
          actualMpesa = verifiedPayments.reduce(
            (sum, p) => sum + parseFloat(p.amount || 0),
            0,
          )
        } else {
          // Reconciliation record has no payment lists; use actual_mpesa and keep existing lists
          actualMpesa = parseFloat(reconciliationData.actual_mpesa) || 0
          setMpesaVerification((prev) => ({
            ...prev,
            actualMpesa,
            notes: reconciliationData.notes || "",
            missingMpesa: (prev.expectedMpesa || 0) - actualMpesa,
          }))
          setHasMpesaReconciliation(true)
          setMpesaReconciliationRecord(reconciliationData)
          return
        }

        setMpesaVerification((prev) => ({
          ...prev,
          actualMpesa,
          verifiedPayments,
          unverifiedPayments,
          notes: reconciliationData.notes || "",
          missingMpesa: (prev.expectedMpesa || 0) - actualMpesa,
        }))
        setHasMpesaReconciliation(true)
        setMpesaReconciliationRecord(reconciliationData)
      } else {
        setHasMpesaReconciliation(false)
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setHasMpesaReconciliation(false)
        setMpesaReconciliationRecord(null)
      } else {
      }
    }
  }, [teamId, decodedTeamType, startDate])



  // Define fetchCashReconciliation with useCallback
  const fetchCashReconciliation = useCallback(async (date: string) => {
    try {
      const response = await api.get("/sales/cash-reconciliation/", {
        params: {
          team_id: teamId,
          team_type: decodedTeamType,
          date: date,
        },
      })

      if (response.data && response.data.length > 0) {
        const reconciliationData = response.data[0]
        setCashVerification((prev) => ({
          ...prev,
          actualCash: parseFloat(reconciliationData.actual_cash) || 0,
          notes: reconciliationData.notes || "",
          missingCash:
            (prev.expectedCash || 0) -
            (parseFloat(reconciliationData.actual_cash) || 0),
        }))
        setHasCashReconciliation(true)
        setCashReconciliationRecord(reconciliationData)
      } else {
        setHasCashReconciliation(false)
        setCashReconciliationRecord(null)
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setHasCashReconciliation(false)
        setCashReconciliationRecord(null)
      } else {
      }
    }
  }, [teamId, decodedTeamType, startDate])

  // Add this function to save M-Pesa reconciliation
  const saveMpesaReconciliation = useCallback(async () => {
    try {
      const response = await api.post("/sales/mpesa-reconciliation/", {
        team_id: teamId,
        team_type: decodedTeamType.toUpperCase(),
        date: startDate,
        expected_mpesa: mpesaVerification.expectedMpesa,
        actual_mpesa: mpesaVerification.actualMpesa,
        verified_payments: mpesaVerification.verifiedPayments || [],
        unverified_payments: mpesaVerification.unverifiedPayments || [],
        notes: mpesaVerification.notes,
      })

      toast.success("M-Pesa reconciliation saved")
      return response.data
    } catch (error) {
      toast.error("Failed to save M-Pesa reconciliation")
      throw error
    }
  }, [teamId, decodedTeamType, startDate, mpesaVerification])

  // Load Data with Caching - FIXED VERSION
  const loadDataForDate = useCallback(
    async (date, isDateChange = false, forceRefresh = false) => {
      if (!date || !teamId || !decodedTeamType) {
        return
      }

      if (isDateChange) {
        setDateChanging(true)
        const oldCacheKey = `sales_data_${teamId}_${startDate}_${decodedTeamType}`
        localStorage.removeItem(oldCacheKey)
      }

      setError(null)

      try {
        // Cache key
        const cacheKey = `sales_data_${teamId}_${date}_${decodedTeamType}`

        // Check cache if not forcing refresh
        if (!forceRefresh) {
          const cached = localStorage.getItem(cacheKey)
          if (cached) {
            const parsed = JSON.parse(cached)
            // Use cache if less than 5 minutes old
            if (Date.now() - parsed.timestamp < 5 * 60 * 1000) {
              setSalesData(parsed.salesData)
              setFilteredSales(parsed.salesData)
              setExpenses(parsed.expenses)

              const categorized = categorizeSales(parsed.salesData)
              setCylinderSales(categorized.cylinderOnly)
              setRegularSales(categorized.regularOnly)
              setMixedSales(categorized.mixed)
              categorizeExpenses(parsed.expenses)
              calculateExpectedPayments(parsed.salesData, parsed.expenses)
              calculateStatistics(parsed.salesData, parsed.expenses)
              setFormattedDate(formatDate(date, "full"))
              setLastUpdated(new Date().toLocaleTimeString())

              // Fetch cash reconciliation data even when using cache
              try {
                await fetchCashReconciliation(date)
              } catch (reconError) {
              }

              // Add this to fetch M-Pesa reconciliation
              try {
                await fetchMpesaReconciliation(date)
              } catch (mpesaReconError) {
                
              }

              // Fetch daily analysis for this date so finalization state is correct
              try {
                const analysisData = await checkExistingAnalysis(date)
                if (analysisData) {
                  setDailySettlement(analysisData)
                  setIsFinalized(analysisData.is_finalized || false)
                } else {
                  setDailySettlement(null)
                  setIsFinalized(false)
                }
              } catch (analysisError) {
                
                setDailySettlement(null)
                setIsFinalized(false)
              }

              if (isDateChange) setDateChanging(false)
              return
            }
          }
        }

        // Fetch fresh data
        const [salesResponse, expensesResponse] = await Promise.allSettled([
          dispatch(
            fetchSales({
              ...locationFilter,
              date: date,
            }),
          ).unwrap(),
          dispatch(
            fetchTeamExpenses({
              ...locationFilter,
              date: date,
            }),
          ).unwrap(),
        ])

        const salesData = []
        const expensesData = []

        // Process sales
        if (salesResponse.status === "fulfilled" && salesResponse.value) {
          const salesArray = Array.isArray(salesResponse.value)
            ? salesResponse.value
            : salesResponse.value.results || salesResponse.value.data || []
          salesData.push(...salesArray)
        }

        // Process expenses
        if (expensesResponse.status === "fulfilled" && expensesResponse.value) {
          const expensesArray = Array.isArray(expensesResponse.value)
            ? expensesResponse.value
            : expensesResponse.value.results || []
          expensesData.push(...expensesArray)
        }

        // Try to get analysis data for the date we're loading (use date, not startDate)
        try {
          let analysisData = null
          try {
            analysisData = await analyzeDailySales(date)
          } catch (analysisError) {
            
            analysisData = await checkExistingAnalysis(date)
          }

          if (analysisData) {
            setDailySettlement(analysisData)
            setIsFinalized(analysisData.is_finalized || false)
          } else {
            setDailySettlement(null)
            setIsFinalized(false)
          }
        } catch (analysisError) {
          setDailySettlement(null)
          setIsFinalized(false)
        }

        // Update state
        setSalesData(salesData)
        setFilteredSales(salesData)
        setExpenses(expensesData)

        const categorized = categorizeSales(salesData)
        setCylinderSales(categorized.cylinderOnly)
        setRegularSales(categorized.regularOnly)
        setMixedSales(categorized.mixed)
        categorizeExpenses(expensesData)

        // Calculate
        calculateExpectedPayments(salesData, expensesData)
        calculateStatistics(salesData, expensesData)

        // Fetch cash reconciliation data after calculations
        try {
          await fetchCashReconciliation(date)
        } catch (reconError) {
        }
        // Fetch M-Pesa reconciliation data after calculations
        try {
          await fetchMpesaReconciliation(date)
        } catch (reconError) {
        }

        // Update UI
        setFormattedDate(formatDate(date, "full"))
        setLastUpdated(new Date().toLocaleTimeString())
        setDataVersion((prev) => prev + 1)

        // Cache the data
        const cacheData = {
          salesData,
          expenses: expensesData,
          timestamp: Date.now(),
          date: date,
        }
        localStorage.setItem(cacheKey, JSON.stringify(cacheData))

        setError(null)
        // toast.success("Data loaded successfully")
      } catch (error) {
        toast.error("Failed to load data")
        setError({
          message: "Failed to load data",
          details: error.message || "Please check your connection",
        })
      } finally {
        if (isDateChange) setDateChanging(false)
        if (initialLoading) setInitialLoading(false)
      }
    },
    [
      teamId,
      decodedTeamType,
      dispatch,
      locationFilter,

      categorizeSales,
      categorizeExpenses,
      calculateExpectedPayments,
      calculateStatistics,
      formatDate,
      initialLoading,
      analyzeDailySales,
      checkExistingAnalysis,
      fetchCashReconciliation, // Make sure to add this to the dependency array
      fetchMpesaReconciliation,
    ],
  )
  // Add these functions to your TeamsSales component
  const verifyMpesaPayment = useCallback(
    async (paymentId, verify = true) => {
      try {
        const response = await api.post(
          `/sales/payments/${paymentId}/verify_payment/`,
          {
            is_verified: verify,
          },
        )

        if (response.status === 200) {
          toast.success(
            `Payment ${verify ? "verified" : "unverified"} successfully`,
          )

          // Refresh data to get updated payment status
          await loadDataForDate(startDate, false, true)

          return response.data
        }
      } catch (error) {
        toast.error(`Failed to ${verify ? "verify" : "unverify"} payment`)
        throw error
      }
    },
    [startDate, loadDataForDate],
  )

  const unverifyMpesaPayment = useCallback(async () => {
    try {
      // Call the API to unverify all payments for the selected date
      const response = await api.post(
        `/sales/payments/unverify_all_payments/`,
        {
          date: startDate,
        },
      )

      if (response.status === 200) {
        toast.success(
          "All payments for the selected date unverified successfully",
        )
        await loadDataForDate(startDate, false, true)
      } else {
        toast.error("Failed to unverify all payments for the selected date")
      }
    } catch (error) {
      toast.error("Failed to unverify all payments for the selected date")
    }
  }, [startDate, loadDataForDate])

  const verifyAllMpesaPayments = useCallback(async () => {
    try {
      // Call the API to verify all payments for the selected date
      const response = await api.post(`/sales/payments/verify_all_payments/`, {
        date: startDate,
      })

      if (response.status === 200) {
        toast.success(
          "All payments for the selected date verified successfully",
        )
        await loadDataForDate(startDate, false, true)
      } else {
        toast.error("Failed to verify all payments for the selected date")
      }
    } catch (error) {
      toast.error("Failed to verify all payments for the selected date")
    }
  }, [startDate, loadDataForDate])

  // Enhanced Refresh
  const handleRefresh = useCallback(async () => {
    setRefreshing(true)
    try {
      await loadDataForDate(startDate, false, true)
      toast.success("Data refreshed successfully!")
    } catch (error) {
      toast.error("Failed to refresh data")
    } finally {
      setRefreshing(false)
    }
  }, [startDate, loadDataForDate])

  // Date Navigation
  // Date Navigation - UPDATED VERSIONS
  const goToPreviousDay = useCallback(() => {
    try {
      // Parse the current date string in Nairobi timezone
      const currentDate = parseDateString(startDate)

      // Subtract one day
      currentDate.setDate(currentDate.getDate() - 1)

      // Get the new date in Nairobi timezone string format
      const newDate = getNairobiDateString(currentDate)

      // Reset state before loading new data
      resetDateSpecificState()
      setStartDate(newDate)
      loadDataForDate(newDate, true)
    } catch (error) {
      toast.error("Failed to navigate to previous day")
    }
  }, [startDate, loadDataForDate, resetDateSpecificState])

  const goToNextDay = useCallback(() => {
    try {
      // Parse the current date string in Nairobi timezone
      const currentDate = parseDateString(startDate)

      // Add one day
      currentDate.setDate(currentDate.getDate() + 1)

      // Get the new date in Nairobi timezone string format
      const newDate = getNairobiDateString(currentDate)

      // Reset state before loading new data
      resetDateSpecificState()
      setStartDate(newDate)
      loadDataForDate(newDate, true)
    } catch (error) {
      toast.error("Failed to navigate to next day")
    }
  }, [startDate, loadDataForDate, resetDateSpecificState])

  const goToToday = useCallback(() => {
    try {
      // Get today's date in Nairobi timezone
      const today = getNairobiDateString()

      // Only reset and reload if we're not already on today
      if (today !== startDate) {
        // Reset state before loading new data
        resetDateSpecificState()
        setStartDate(today)
        loadDataForDate(today, true)
        toast.success("Navigated to today")
      } else {
        toast.info("You're already viewing today's data")
      }
    } catch (error) {
      toast.error("Failed to navigate to today")
    }
  }, [startDate, loadDataForDate, resetDateSpecificState])

  // Apply Filters
  const applyFilters = useCallback(() => {
    try {
      let filtered = Array.isArray(salesData) ? [...salesData] : []

      // Search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        filtered = filtered.filter((sale) => {
          if (!sale || typeof sale !== "object") return false
          return (
            sale.invoice_number?.toLowerCase().includes(term) ||
            sale.customer_info?.name?.toLowerCase().includes(term) ||
            sale.customer_info?.phone?.includes(term) ||
            sale.salesperson_data?.full_name?.toLowerCase().includes(term)
          )
        })
      }

      // Sale type filter
      if (selectedSaleType !== "all") {
        filtered = filtered.filter(
          (sale) => sale.sale_type === selectedSaleType,
        )
      }

      // Payment status filter
      if (selectedPaymentStatus !== "all") {
        filtered = filtered.filter(
          (sale) => sale.payment_status === selectedPaymentStatus,
        )
      }

      // Employee filter
      if (selectedEmployee !== "all") {
        filtered = filtered.filter(
          (sale) => sale.salesperson_id?.toString() === selectedEmployee,
        )
      }

      // Salesperson type filter
      if (selectedSalespersonType !== "all") {
        filtered = filtered.filter((sale) => {
          if (!sale.salesperson_data) return false
          const { role, is_employee } = sale.salesperson_data
          return selectedSalespersonType === "admin"
            ? role === "COMPANY_ADMIN" || !is_employee
            : role === "SHOP_ATTENDANT" || is_employee
        })
      }

      setFilteredSales(filtered)
    } catch (error) {
      setFilteredSales(Array.isArray(salesData) ? salesData : [])
    }
  }, [
    salesData,
    searchTerm,
    selectedSaleType,
    selectedPaymentStatus,
    selectedEmployee,
    selectedSalespersonType,
  ])

  // Batch Operations
  const toggleBatchSelection = useCallback((saleId) => {
    setSelectedBatchItems((prev) => {
      if (prev.includes(saleId)) {
        return prev.filter((id) => id !== saleId)
      } else {
        return [...prev, saleId]
      }
    })
  }, [])

  const selectAllVisible = useCallback(() => {
    const visibleIds = filteredSales.map((sale) => sale.id)
    setSelectedBatchItems(visibleIds)
  }, [filteredSales])

  const clearBatchSelection = useCallback(() => {
    setSelectedBatchItems([])
  }, [])

  // Export Data
  const exportData = useCallback(
    async (format, options = {}) => {
      try {
        let exportData = options.selectedOnly
          ? salesData.filter((sale) => selectedBatchItems.includes(sale.id))
          : filteredSales

        // In a real implementation, this would call your API
        toast.info(`Exporting data as ${format.toUpperCase()}...`)

        // Mock export - replace with actual API call
        if (format === "csv") {
          const headers = ["Invoice", "Customer", "Amount", "Status", "Date"]
          const rows = exportData.map((sale) => [
            sale.invoice_number,
            sale.customer_info?.name || "Walk-in",
            sale.total_amount,
            sale.payment_status,
            new Date(sale.created_at).toLocaleDateString(),
          ])

          const csvContent = [
            headers.join(","),
            ...rows.map((row) => row.join(",")),
          ].join("\n")

          const blob = new Blob([csvContent], { type: "text/csv" })
          const url = URL.createObjectURL(blob)
          const link = document.createElement("a")
          link.href = url
          link.download = `sales_export_${startDate}.csv`
          link.click()
          URL.revokeObjectURL(url)
        }

        toast.success(`Data exported successfully as ${format.toUpperCase()}`)
      } catch (error) {
        toast.error("Failed to export data")
      }
    },
    [salesData, filteredSales, selectedBatchItems, startDate],
  )

  // Cash Reconciliation
  const performCashReconciliation = useCallback(async () => {
    setIsReconciling(true)
    try {
      const response = await api.post("/sales/cash-reconciliation/", {
        company_id: companyId,
        team_id: teamId,
        team_type: decodedTeamType.toUpperCase(),
        date: startDate,
        expected_cash: cashVerification.expectedCash,
        actual_cash: cashVerification.actualCash,
        verification_notes: cashVerification.notes,
      })
      setHasCashReconciliation(true)
      setCashReconciliationRecord(response.data)
      toast.success("Cash reconciliation completed")
      setIsReconciling(false)
      return response.data

    } catch (error) {
      setHasCashReconciliation(false)
      setCashReconciliationRecord(null)
      toast.error("Cash reconciliation failed")
      setIsReconciling(false)
      throw error
    }
  }, [teamId, decodedTeamType, startDate, cashVerification])

  // Cash Reconciliation
  const performMpesaReconciliation = useCallback(async () => {
    try {
      const response = await api.post("/sales/mpesa-reconciliation/", {
        company_id: companyId,
        team_id: teamId,
        team_type: decodedTeamType.toUpperCase(),
        date: startDate,
        expected_mpesa: mpesaVerification.expectedMpesa,
        actual_mpesa: mpesaVerification.actualMpesa,
        verification_notes: mpesaVerification.notes,
      })
      setHasMpesaReconciliation(true)
      setMpesaReconciliationRecord(response.data)
      toast.success("M-Pesa reconciliation completed")
      return response.data
    } catch (error) {
      setHasMpesaReconciliation(false)
      setMpesaReconciliationRecord(null)
      toast.error("M-Pesa reconciliation failed")
      throw error
    }
  }, [teamId, decodedTeamType, startDate, mpesaVerification])

  // Finalize Settlement
  const finalizeSettlement = useCallback(async () => {
    try {
      if (!dailySettlement?.id) {
        toast.error("No daily analysis found")
        return
      }

      const hasCashPayments = (statistics?.total_cash || 0) > 0
      const hasMpesaPayments = (statistics?.total_mpesa || 0) > 0

      const cashSideOk = !hasCashPayments || hasCashReconciliation
      const mpesaSideOk = !hasMpesaPayments || hasMpesaReconciliation

      if (!cashSideOk || !mpesaSideOk) {
        toast.error(
          "You must record cash and M‑Pesa reconciliation for this date before finalizing.",
        )
        return
      }

      if (dailySettlement.is_finalized) {
        toast.error("Settlement already finalized")
        setShowSettlementModal(false)
        return
      }

      const response = await api.post(
        `/sales/daily-analyses/${dailySettlement.id}/finalize_settlement/`,
        {
          settlement_notes: settlementNotes,
          missing_cash_employee_id: "",
          missing_mpesa_notes: mpesaVerification.notes,
        },
      )

      toast.success("Daily settlement finalized!")
      setShowSettlementModal(false)
      setIsFinalized(true)

      // Refresh data
      await loadDataForDate(startDate, false, true)

      return response.data
    } catch (error) {
      toast.error("Failed to finalize settlement")
      throw error
    }
  }, [
    dailySettlement,
    statistics,
    hasCashReconciliation,
    hasMpesaReconciliation,
    settlementNotes,
    selectedEmployee,
    mpesaVerification.notes,
    startDate,
    loadDataForDate,
  ])

  // Get Employee Name
  const getEmployeeName = useCallback(
    (employeeId) => {
      if (!employeeId) return "Not Assigned"
      const employee = employees.find((emp) => emp.id === employeeId)
      return employee
        ? `${employee.first_name} ${employee.last_name}`
        : "Unknown"
    },
    [employees],
  )

  // Get Salesperson Badge
  const getSalespersonBadge = useCallback((sale) => {
    if (!sale || !sale.salesperson_data) return null

    const { role, is_employee } = sale.salesperson_data

    if (role === "COMPANY_ADMIN" || !is_employee) {
      return (
        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs flex items-center gap-1">
          <VerifiedUser fontSize="small" />
          Admin
        </span>
      )
    } else if (role === "SHOP_ATTENDANT" || is_employee) {
      return (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center gap-1">
          <Person fontSize="small" />
          Employee
        </span>
      )
    }
    return null
  }, [])

  // Get Sale Type Badge
  const getSaleTypeBadge = useCallback((sale) => {
    if (!sale || typeof sale !== "object") return null

    const hasCylinderItems = sale.cylinder_items?.length > 0
    const hasRegularItems = sale.items?.length > 0

    if (hasCylinderItems && hasRegularItems) {
      return (
        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
          Mixed
        </span>
      )
    } else if (hasCylinderItems) {
      return (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
          Cylinder
        </span>
      )
    } else if (hasRegularItems) {
      return (
        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
          Regular
        </span>
      )
    }
    return null
  }, [])

  // Toggle Sale Details
  const toggleSaleDetails = useCallback(
    (saleId) => {
      setExpandedSaleId(expandedSaleId === saleId ? null : saleId)
    },
    [expandedSaleId],
  )

  // Reset All Data
  const resetAllData = useCallback(() => {
    setSalesData([])
    setFilteredSales([])
    setCylinderSales([])
    setRegularSales([])
    setMixedSales([])
    setExpenses([])
    setEmployeeExpenses([])
    setCompanyExpenses([])
    setSelectedBatchItems([])
    setStatistics(null)
  }, [])

  // Handle Item Deficit
  // Handle Item Deficit - Updated
  const handleItemDeficit = useCallback((sale, item, itemType) => {
    const actualPrice =
      parseFloat(item.total_price) ||
      (parseFloat(item.unit_price) || 0) * (parseFloat(item.quantity) || 1)

    setSelectedItemForDeficit({ sale, item, itemType })
    setItemDeficitForm({
      saleId: sale.id || "",
      invoiceNumber: sale.invoice_number || "",
      itemType: itemType,
      itemId: item.id || item.cylinder_id || "",
      itemName: item.cylinder_name || item.name || `Item`,
      expectedPrice: actualPrice, // Start with actual price as expected
      actualPrice: actualPrice, // The price it was actually sold for
      deficitAmount: 0, // Start with no difference
      assignedEmployeeId: sale.salesperson_id || "",
      assignedToCompany: false,
      reason: "",
      notes: "",
      isSalaryDeductible: true,
      isSalaryAddition: false, // Add this new field
    })
    setShowItemDeficitModal(true)
  }, [])

  // Handle Expense Assignment
  const handleAssignExpense = useCallback((expense) => {
    setSelectedExpense(expense)
    setExpenseAssignment({
      employeeId: expense.employee_id || "",
      isCompanyExpense: expense.is_company_expense || false,
      deduction_amount: expense.amount || 0,
      notes: expense.assignment_notes || "",
    })
    setShowExpenseAssignment(true)
  }, [])

  // Save Expense Assignment
  const saveExpenseAssignment = async () => {
    if (!selectedExpense) return

    try {
      // Check if expense status is approved or paid
      if (
        selectedExpense.status &&
        !["APPROVED", "PAID"].includes(selectedExpense.status.toUpperCase())
      ) {
        toast.error(
          `This expense is ${
            selectedExpense.status || "pending"
          }. Only approved or paid expenses can be attached to employees.`,
        )
        return
      }

      if (
        !expenseAssignment.employeeId &&
        !expenseAssignment.isCompanyExpense
      ) {
        toast.error("Please select an employee or mark as company expense")
        return
      }

      const requestData = {
        employee_id: expenseAssignment.employeeId, // Send as employee_id (not employeeId)
        deduction_amount: expenseAssignment.deduction_amount, // Keep as deduction_amount
        description: expenseAssignment.notes || "", // Send as 'description', not 'assignment_notes'
      }

      const response = await api.post(
        `/expenses/expenses/${selectedExpense.id}/attach_to_employee/`,
        requestData,
      )
      if (response.status === 200 || response.status === 201) {
        toast.success("Expense assigned successfully!")
        setShowExpenseAssignment(false)
        await loadDataForDate(startDate, false, true)
      }
    } catch (error) {

      // Check for specific error messages from the backend
      if (error.response?.data?.error) {
        toast.error(error.response.data.error)
      } else if (error.response?.data?.detail) {
        toast.error(error.response.data.detail)
      } else {
        toast.error(
          "Failed to assign expense: " + (error.message || "Unknown error"),
        )
      }
    }
  }

  // Save Item Deficit - Updated to use correct endpoint
  const saveItemDeficit = async () => {
    if (!selectedItemForDeficit || itemDeficitForm.expectedPrice === 0) {
      toast.error("Please enter a valid expected price")
      return
    }

    // Make sure we have a daily analysis ID
    if (!dailySettlement?.id) {
      toast.error("No daily analysis found. Please analyze daily sales first.")
      return
    }

    try {
      // Prepare the payload for the backend
      const payload = {
        invoice_number: itemDeficitForm.invoiceNumber,
        sale_id: parseInt(itemDeficitForm.saleId),
        sale: parseInt(itemDeficitForm.saleId), // Assuming the backend expects a sale ID
        item_type: itemDeficitForm.itemType.toUpperCase(), // CYLINDER or PRODUCT
        item_id: parseInt(itemDeficitForm.itemId),
        item_name: itemDeficitForm.itemName,
        expected_price: parseFloat(itemDeficitForm.expectedPrice),
        actual_price: parseFloat(itemDeficitForm.actualPrice),
        quantity: selectedItemForDeficit.item.quantity || 1,
        reason: itemDeficitForm.reason || "UNDERCHARGED",
        notes: itemDeficitForm.notes || "",
        responsibility_type: itemDeficitForm.assignedToCompany
          ? "COMPANY"
          : "EMPLOYEE",
        assigned_employee: itemDeficitForm.assignedEmployeeId || null,
        is_salary_deductible: itemDeficitForm.isSalaryDeductible,
        is_salary_addition: itemDeficitForm.isSalaryAddition || false,
        is_company_absorption: false, // You can update this based on your logic
      }

      // Determine the correct endpoint based on your backend
      // If you're using the new record_price_difference endpoint:
      const endpoint = `/sales/daily-analyses/${dailySettlement.id}/record_price_difference/`

      // OR if you're still using the old record_deficit endpoint:
      // const endpoint = `/sales/daily-analyses/${dailySettlement.id}/record_deficit/`;

  

      const response = await api.post(endpoint, payload)

      if (response.status === 201) {
        const message =
          itemDeficitForm.deficitAmount === 0
            ? "No difference recorded!"
            : itemDeficitForm.deficitAmount > 0
            ? "Item deficit recorded successfully!"
            : "Item excess recorded successfully!"

        toast.success(message)
        setShowItemDeficitModal(false)
        setSelectedItemForDeficit(null)

        // Refresh data to show the new deficit/excess record
        await loadDataForDate(startDate, false, true)
      }
    } catch (error) {

      // Provide more specific error message
      if (error.response) {
        if (error.response.status === 404) {
          toast.error(
            "Daily analysis not found. Please analyze daily sales first.",
          )
        } else if (error.response.status === 400) {
          toast.error(
            `Validation error: ${
              error.response.data.detail || JSON.stringify(error.response.data)
            }`,
          )
        } else {
          toast.error(
            `Failed to record item difference: ${
              error.response.data.detail || "Server error"
            }`,
          )
        }
      } else if (error.request) {
        toast.error("No response from server. Please check your connection.")
      } else {
        toast.error("Failed to record item difference")
      }
    }
  }

  // In the main TeamsSales component, add this state
  const [deficitData, setDeficitData] = useState([])
  const [showEditDeficitModal, setShowEditDeficitModal] = useState(false)
  const [selectedDeficit, setSelectedDeficit] = useState(null)
  const [editDeficitForm, setEditDeficitForm] = useState({
    id: "",
    expected_price: 0,
    actual_price: 0,
    reason: "",
    notes: "",
    assigned_employee: "",
    responsibility_type: "",
    is_salary_deductible: false,
    status: "",
  })

  // Add this function to load deficits
  const fetchDeficits = async () => {
    try {
      const response = await api.get(
        `/sales/daily-analyses/deficits_by_team/`,
        {
          params: {
            start_date: startDate,
            team_type: decodedTeamType.toUpperCase(),
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
      toast.error("Failed to fetch item differences")
    }
  }

  // Call fetchDeficits when data loads
  useEffect(() => {
    if (salesData.length > 0) {
      fetchDeficits()
    }
  }, [salesData, startDate])

  // Add function to handle edit deficit
  const handleEditDeficit = (deficit) => {
    setSelectedDeficit(deficit)
    setEditDeficitForm({
      id: deficit.id,
      expected_price: parseFloat(deficit.expected_price || 0),
      actual_price: parseFloat(deficit.actual_price || 0),
      reason: deficit.reason || "",
      notes: deficit.notes || "",
      assigned_employee: deficit.assigned_employee || "",
      responsibility_type: deficit.responsibility_type || "EMPLOYEE",
      is_salary_deductible: deficit.is_salary_deductible || false,
      status: deficit.status || "RECORDED",
    })
    setShowEditDeficitModal(true)
  }

  // Add function to save edited deficit
  const saveEditedDeficit = async () => {
    try {
      const response = await api.put(
        `/deficits/${selectedDeficit.id}/update/`,
        editDeficitForm,
      )

      if (response.status === 200) {
        toast.success("Deficit updated successfully!")
        setShowEditDeficitModal(false)

        // Refresh deficits data
        await fetchDeficits()
        // Also refresh main data
        await loadDataForDate(startDate, false, true)
      }
    } catch (error) {
      toast.error("Failed to update deficit")
    }
  }

  // Record Cash Verification
  const recordCashVerification = useCallback(async () => {
    try {
      if (!dailySettlement?.id) {
        toast.error("No daily analysis found")
        return
      }

      const response = await api.post(
        `/sales/daily-analyses/${dailySettlement.id}/record_verification/`,
        {
          actual_cash: cashVerification.actualCash,
          actual_mpesa: mpesaVerification.actualMpesa,
          notes: "Daily cash count",
          unverified_mpesa_count: mpesaVerification.unverifiedPayments.length,
          unverified_mpesa_amount: mpesaVerification.unverifiedPayments.reduce(
            (sum, payment) => sum + parseFloat(payment.amount || 0),
            0,
          ),
        },
      )

      toast.success("Cash verification recorded!")
      return response.data
    } catch (error) {
      toast.error("Failed to record verification")
      throw error
    }
  }, [dailySettlement, cashVerification, mpesaVerification])

  // Update the function:
  const handleActualPriceChange = useCallback(
    (value) => {
      const actualPrice = parseFloat(value) || 0
      const deficitAmount = Math.max(
        0,
        (itemDeficitForm.expectedPrice || 0) - actualPrice,
      )

      setItemDeficitForm((prev) => ({
        ...prev,
        actualPrice: actualPrice,
        deficitAmount: deficitAmount,
      }))
    },
    [itemDeficitForm.expectedPrice],
  )

  const performBatchOperation = useCallback(
    async (operation) => {
      if (selectedBatchItems.length === 0) {
        toast.error("No items selected")
        return
      }

      try {
        switch (operation) {
          case "export":
            setShowExportModal(true)
            break
          case "print":
            toast.info("Print functionality would be implemented here")
            break
          case "markPaid":
            // This is a mock API call - replace with your actual API
            toast.success(
              `${selectedBatchItems.length} sales would be marked as paid`,
            )
            // Refresh data
            await loadDataForDate(startDate, false, true)
            break
          case "sendReceipts":
            toast.success("Receipts would be sent")
            break
          default:
            toast.info(`Batch operation: ${operation}`)
        }
      } catch (error) {
        toast.error("Failed to perform batch operation")
      }
    },
    [selectedBatchItems, startDate, loadDataForDate],
  )

  // Auto-refresh Effect
  useEffect(() => {
    let intervalId
    if (autoRefresh && !isFinalized) {
      intervalId = setInterval(() => {
        handleRefresh()
      }, 30000) // 30 seconds
    }
    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [autoRefresh, isFinalized, handleRefresh])

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "f":
            e.preventDefault()
            setShowFilters(!showFilters)
            break
          case "r":
            e.preventDefault()
            if (!refreshing) handleRefresh()
            break
          case "e":
            e.preventDefault()
            setShowExportModal(true)
            break
          case "b":
            e.preventDefault()
            setBatchMode(!batchMode)
            break
          case "s":
            e.preventDefault()
            setShowSalesSummary(true)
            break
          case "a":
            e.preventDefault()
            setShowAdvancedFilters(!showAdvancedFilters)
            break
        }
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [showFilters, showAdvancedFilters, handleRefresh, refreshing, batchMode])

  // Initial Load
  useEffect(() => {
    const initialize = async () => {
      setFormattedDate(formatDate(startDate, "full"))

      if (teamId && decodedTeamType) {
        try {
          // Load employees
          const employeesResponse = await dispatch(
            fetchTeamsEmployees({
              teamId,
              teamType: decodedTeamType,
            }),
          ).unwrap()
          setEmployees(employeesResponse.employees || [])

          // Load initial data
          await loadDataForDate(startDate, false, true)
        } catch (error) {
          setError({
            message: "Failed to initialize",
            details: error.message || "Please refresh the page",
          })
          setInitialLoading(false)
        }
      } else {
        setError({
          message: "Missing team information",
          details: "Team ID or type is missing",
        })
        setInitialLoading(false)
      }
    }

    initialize()
  }, [])

  // Apply filters when criteria change
  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  // Recalculate when sales data changes
  useEffect(() => {
    if (salesData.length > 0) {
      calculateExpectedPayments(salesData, expenses)
      calculateStatistics(salesData, expenses)
    }
  }, [salesData, expenses, calculateExpectedPayments, calculateStatistics])

  // Total Calculations
  const totals = useMemo(() => {
    const salesArray = Array.isArray(filteredSales) ? filteredSales : []

    return salesArray.reduce(
      (acc, sale) => {
        if (!sale || typeof sale !== "object") return acc
        return {
          totalAmount: acc.totalAmount + (parseFloat(sale.total_amount) || 0),
          totalPaid: acc.totalPaid + (parseFloat(sale.amount_paid) || 0),
          totalBalance: acc.totalBalance + (parseFloat(sale.balance_due) || 0),
          totalCost: acc.totalCost + (parseFloat(sale.total_cost) || 0),
          count: acc.count + 1,
        }
      },
      { totalAmount: 0, totalPaid: 0, totalBalance: 0, totalCost: 0, count: 0 },
    )
  }, [filteredSales])

  // Sales by Type
  const salesByType = useMemo(() => {
    const salesArray = Array.isArray(salesData) ? salesData : []

    const adminSales = salesArray.filter(
      (sale) =>
        sale?.salesperson_data?.role === "COMPANY_ADMIN" ||
        !sale?.salesperson_data?.is_employee,
    )

    const employeeSales = salesArray.filter(
      (sale) =>
        sale?.salesperson_data?.role === "SHOP_ATTENDANT" ||
        sale?.salesperson_data?.is_employee,
    )

    return {
      adminCount: adminSales.length,
      adminTotal: adminSales.reduce(
        (sum, sale) => sum + (parseFloat(sale.total_amount) || 0),
        0,
      ),
      employeeCount: employeeSales.length,
      employeeTotal: employeeSales.reduce(
        (sum, sale) => sum + (parseFloat(sale.total_amount) || 0),
        0,
      ),
    }
  }, [salesData])

  // Check if editing is allowed
  const isEditingAllowed = useCallback(() => {
    if (!dailySettlement) return true
    if (dailySettlement && !dailySettlement.is_finalized) return true
    return false
  }, [dailySettlement])

  // Render loading state
  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">
            Loading sales dashboard...
          </p>
          <p className="text-sm text-gray-500">
            Preparing your enhanced sales management interface
          </p>
        </div>
      </div>
    )
  }

  // In your TeamsSales component, update the cash verification handler:
  const handleCashVerificationUpdate = (updatedVerification) => {
    setCashVerification((prev) => ({
      ...prev,
      ...updatedVerification,
      // Ensure missingCash is calculated as expected - actual
      missingCash:
        (prev.expectedCash || 0) - (updatedVerification.actualCash || 0),
    }))
  }

  // Similarly for M-Pesa verification:
  const handleMpesaVerificationUpdate = (updatedVerification) => {
    setMpesaVerification((prev) => ({
      ...prev,
      ...updatedVerification,
      // Calculate missing M-Pesa based on expected vs actual
      missingMpesa:
        (prev.expectedMpesa || 0) - (updatedVerification.actualMpesa || 0),
    }))
  }

  const handleReassignExpense = async (expenseId, employeeId, data) => {
    try {
      const response = await api.post(
        `/expenses/expenses/${expenseId}/attach_to_employee/`,
        {
          employee_id: employeeId,
          deduction_amount: data.deduction_amount,
          description: data.notes,
        },
      )
      if (response.status === 201) {
        toast.success("Expense reassigned successfully!")
        await loadDataForDate(startDate, false, true)
      }
    } catch (error) {
      toast.error("Failed to reassign expense")
    }
  }

  // Update the handleVerifyByReceipt function
  const handleVerifyByReceipt = async () => {
    if (!searchReceipt.trim()) return

    const matchingPayments = mpesaVerification.unverifiedPayments.filter(
      (payment) =>
        payment.receipt?.toLowerCase().includes(searchReceipt.toLowerCase()),
    )

    if (matchingPayments.length > 0) {
      try {
        // Verify all matching payments
        await Promise.all(
          matchingPayments.map((payment) =>
            onVerifyPayment(payment.paymentId, true),
          ),
        )

        toast.success(`Verified ${matchingPayments.length} payment(s)`)
        setSearchReceipt("")

        // Data will be refreshed by the parent
      } catch (error) {
        toast.error("Failed to verify some payments")
      }
    }
  }

  // Update the handleUnverifyByReceipt function similarly
  const handleUnverifyByReceipt = async () => {
    if (!searchReceipt.trim()) return

    const matchingPayments =
      mpesaVerification.verifiedPayments?.filter((payment) =>
        payment.receipt?.toLowerCase().includes(searchReceipt.toLowerCase()),
      ) || []

    if (matchingPayments.length > 0) {
      try {
        await Promise.all(
          matchingPayments.map((payment) =>
            onVerifyPayment(payment.paymentId, false),
          ),
        )

        toast.success(`Unverified ${matchingPayments.length} payment(s)`)
        setSearchReceipt("")
      } catch (error) {
        toast.error("Failed to unverify some payments")
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-gray-800 flex flex-col font-sans">
      {/* Enhanced Navbar */}
      <Navbar
        headerMessage={"Enhanced Sales Management"}
        headerText={`Managing ${decodedTeamName} - Advanced Analytics & Reporting`}
        showNotifications={true}
        notificationCount={mpesaVerification.unverifiedPayments.length}
      />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      {/* Real-time Indicator */}
      <div className="prevent-overflow">
        <RealTimeIndicator
          enabled={autoRefresh}
          lastUpdated={lastUpdated}
          dataVersion={dataVersion}
          onToggle={() => setAutoRefresh(!autoRefresh)}
        />
      </div>

      {/* Mobile Navigation Tabs */}
      {isMobile && (
        <div className="sticky top-0 z-40 bg-white border-b shadow-sm mobile-tabs-container">
          <div className="flex overflow-x-auto no-scrollbar py-2">
            {[
              {
                id: "overview",
                label: "Overview",
                icon: <Dashboard fontSize="small" />,
                badge: null,
              },
              {
                id: "sales",
                label: "Sales",
                icon: <Receipt fontSize="small" />,
                badge: filteredSales.length,
              },
              {
                id: "expenses",
                label: "Expenses",
                icon: <MoneyOff fontSize="small" />,
                badge: expenses.length,
              },
              {
                id: "analytics",
                label: "Analytics",
                icon: <Analytics fontSize="small" />,
                badge: null,
              },
              {
                id: "verification",
                label: "Verify",
                icon: <VerifiedUser fontSize="small" />,
                badge: null,
              },
              {
                id: "settlement",
                label: "Settle",
                icon: <AssignmentTurnedIn fontSize="small" />,
                badge: null,
              },
            ].map(({ id, label, icon, badge }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`flex-shrink-0 px-3 py-2 text-xs font-medium whitespace-nowrap border-b-2 transition-all flex items-center gap-1 mx-1 mobile-tab-button ${
                  activeSection === id
                    ? "border-blue-500 text-blue-600 bg-blue-50"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center gap-1">
                  {icon}
                  <span>{label}</span>
                  {badge !== null && badge > 0 && (
                    <span className="ml-1 bg-blue-100 text-blue-800 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {badge > 99 ? "99+" : badge}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Header with Date Navigation */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b shadow-sm">
        <div className="p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Storefront className="text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl font-bold text-gray-900 truncate">
                    {decodedTeamName}
                  </h1>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CalendarToday fontSize="small" />
                    <span className="font-medium">{formattedDate}</span>
                    {lastUpdated && (
                      <span className="text-xs text-gray-500">
                        • Updated: {lastUpdated}
                      </span>
                    )}
                    {isFinalized && (
                      <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        <Lock fontSize="small" className="inline mr-1" />
                        Finalized
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Date Navigation */}
            <div className="flex items-center gap-2 date-picker-container">
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={goToPreviousDay}
                  disabled={dateChanging}
                  className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed date-nav-button"
                  title="Previous Day"
                >
                  <ArrowBackIos fontSize="small" />
                </button>

                <div className="relative mx-2">
                  <button
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    disabled={dateChanging}
                    className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border hover:border-blue-500 transition-colors disabled:opacity-50 compact-button"
                  >
                    <CalendarToday fontSize="small" className="text-gray-500" />
                    <span className="font-medium truncate max-w-[120px]">
                      {formatDate(startDate, "short")}
                    </span>
                    {dateChanging ? (
                      <div className="ml-2 w-4 h-4">
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                      </div>
                    ) : (
                      <ArrowDropDown className="text-gray-400" />
                    )}
                  </button>

                  {/* Date Picker Dropdown - Fixed for mobile */}
                  {showDatePicker && (
                    <div
                      className={`absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border p-3 z-50 ${
                        isMobile ? "date-picker-dropdown" : "min-w-[300px]"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium text-gray-800">
                          Select Date
                        </h3>
                        <button
                          onClick={() => setShowDatePicker(false)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <Close fontSize="small" />
                        </button>
                      </div>
                      <input
                        type="date"
                        className="w-full p-2 border rounded-lg mb-3 filter-input"
                        value={startDate}
                        onChange={(e) => {
                          resetDateSpecificState()
                          setStartDate(e.target.value)
                          loadDataForDate(e.target.value, true)
                          setShowDatePicker(false)
                        }}
                      />
                      <div className="space-y-2">
                        <button
                          onClick={goToToday}
                          className="w-full px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-sm font-medium"
                        >
                          <Today className="inline mr-2" fontSize="small" />
                          Go to Today
                        </button>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => {
                              const yesterday = new Date()
                              yesterday.setDate(yesterday.getDate() - 1)
                              setStartDate(
                                yesterday.toISOString().split("T")[0],
                              )
                              loadDataForDate(
                                yesterday.toISOString().split("T")[0],
                                true,
                              )
                              setShowDatePicker(false)
                            }}
                            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                          >
                            Yesterday
                          </button>
                          <button
                            onClick={() => {
                              const lastWeek = new Date()
                              lastWeek.setDate(lastWeek.getDate() - 7)
                              setStartDate(lastWeek.toISOString().split("T")[0])
                              loadDataForDate(
                                lastWeek.toISOString().split("T")[0],
                                true,
                              )
                              setShowDatePicker(false)
                            }}
                            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                          >
                            Last Week
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={goToNextDay}
                  disabled={dateChanging}
                  className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed date-nav-button"
                  title="Next Day"
                >
                  <ArrowForwardIos fontSize="small" />
                </button>
              </div>
            </div>
          </div>

          {/* Filters Toggle */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 ${
                  showFilters
                    ? "bg-blue-100 text-blue-700 border border-blue-300"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <FilterList fontSize="small" />
                Filters
                {showFilters && <ExpandLess fontSize="small" />}
                {!showFilters && <ExpandMore fontSize="small" />}
              </button>
              {/* Quick Actions */}
              <QuickActions
                onRefresh={handleRefresh}
                onExport={() => setShowExportModal(true)}
                onSummary={() => setShowSalesSummary(true)}
                onAnalytics={() => setShowSalesInsights(true)}
                onPrint={() => window.print()}
                onFilters={() => setShowFilters(!showFilters)}
                onBatch={() => setBatchMode(!batchMode)}
                isFinalized={isFinalized}
                refreshing={refreshing}
                batchMode={batchMode}
                selectedCount={selectedBatchItems.length}
              />

              {showFilters && (
                <>
                  <button
                    onClick={() => setShowAdvancedFilters(true)}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200 flex items-center gap-2"
                  >
                    <Tune fontSize="small" />
                    Advanced Filters
                  </button>

                  {(searchTerm ||
                    selectedSaleType !== "all" ||
                    selectedPaymentStatus !== "all" ||
                    selectedEmployee !== "all") && (
                    <button
                      onClick={() => {
                        setSearchTerm("")
                        setSelectedSaleType("all")
                        setSelectedPaymentStatus("all")
                        setSelectedEmployee("all")
                        setSelectedSalespersonType("all")
                      }}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 flex items-center gap-2"
                    >
                      <Close fontSize="small" />
                      Clear All
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Batch Mode Indicator */}
            {batchMode && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-blue-700">
                  {selectedBatchItems.length} items selected
                </span>
                <BatchActions
                  selectedCount={selectedBatchItems.length}
                  onSelectAll={selectAllVisible}
                  onClearAll={clearBatchSelection}
                  onExport={() => setShowExportModal(true)}
                  onMarkPaid={() => performBatchOperation("markPaid")}
                  onExit={() => setBatchMode(false)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="bg-white border-b shadow-sm animate-slideDown">
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    fontSize="small"
                  />
                  <input
                    type="text"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Invoice, customer, phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Sale Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sale Type
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={selectedSaleType}
                  onChange={(e) => setSelectedSaleType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="RETAIL">Retail</option>
                  <option value="WHOLESALE">Wholesale</option>
                  <option value="CREDIT">Credit</option>
                </select>
              </div>

              {/* Payment Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Status
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={selectedPaymentStatus}
                  onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="PAID">Paid</option>
                  <option value="PARTIAL">Partial</option>
                  <option value="UNPAID">Unpaid</option>
                  <option value="OVERDUE">Overdue</option>
                </select>
              </div>

              {/* Employee */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salesperson
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                >
                  <option value="all">All Salespeople</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.first_name} {emp.last_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="m-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <ErrorOutline className="text-red-600 text-2xl" />
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-lg font-semibold text-red-800">
                  {error.message}
                </h3>
                <p className="text-red-700 mt-1">{error.details}</p>
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 flex items-center"
                  >
                    {refreshing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Retrying...
                      </>
                    ) : (
                      <>
                        <Refresh className="mr-2" fontSize="small" />
                        Retry
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow p-4 pb-24 prevent-overflow max-w-screen">
        {/* Date Changing Overlay */}
        {dateChanging && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40 flex items-center justify-center">
            <div className="bg-white/90 p-4 rounded-xl shadow-lg flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-sm font-medium text-gray-700">
                Loading data for {formatDate(startDate, "short")}...
              </span>
            </div>
          </div>
        )}

        {/* Desktop: Sidebar + Main Content Layout */}
        {!isMobile ? (
          <div className="flex gap-6">
            {/* Sidebar - Overview & Quick Stats */}
            <div className="w-80 flex-shrink-0">
              <div className="sticky top-24 space-y-6">
                {/* Quick Stats */}
                <div className="bg-white rounded-xl shadow-sm border p-4">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                    <Speed className="mr-2 text-blue-600" />
                    Quick Stats
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Total Sales</span>
                      <span className="font-bold">
                        <FormattedAmount amount={totals.totalAmount} />
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">
                        Transactions
                      </span>
                      <span className="font-bold">{totals.count}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Avg. Sale</span>
                      <span className="font-bold">
                        <FormattedAmount
                          amount={
                            totals.count > 0
                              ? totals.totalAmount / totals.count
                              : 0
                          }
                        />
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Net Cash</span>
                      <span className="font-bold text-blue-600">
                        <FormattedAmount
                          amount={cashVerification.expectedCash}
                        />
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Net M-Pesa</span>
                      <span className="font-bold text-purple-600">
                        <FormattedAmount
                          amount={mpesaVerification.expectedMpesa}
                        />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sales Breakdown */}
                <div className="bg-white rounded-xl shadow-sm border p-4">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                    <PieChart className="mr-2 text-green-600" />
                    Sales Breakdown
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
                      <div className="flex items-center">
                        <LocalGasStation
                          className="text-blue-600 mr-2"
                          fontSize="small"
                        />
                        <span className="text-sm">Cylinder Sales</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{cylinderSales.length}</div>
                        <div className="text-xs text-gray-600">
                          <FormattedAmount
                            amount={cylinderSales.reduce(
                              (sum, s) =>
                                sum + (parseFloat(s.total_amount) || 0),
                              0,
                            )}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                      <div className="flex items-center">
                        <ShoppingCart
                          className="text-green-600 mr-2"
                          fontSize="small"
                        />
                        <span className="text-sm">Regular Sales</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{regularSales.length}</div>
                        <div className="text-xs text-gray-600">
                          <FormattedAmount
                            amount={regularSales.reduce(
                              (sum, s) =>
                                sum + (parseFloat(s.total_amount) || 0),
                              0,
                            )}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-purple-50 rounded-lg">
                      <div className="flex items-center">
                        <LocalGasStation
                          className="text-purple-600 mr-1"
                          fontSize="small"
                        />
                        <ShoppingCart
                          className="text-purple-600 mr-2"
                          fontSize="small"
                        />
                        <span className="text-sm">Mixed Sales</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{mixedSales.length}</div>
                        <div className="text-xs text-gray-600">
                          <FormattedAmount
                            amount={mixedSales.reduce(
                              (sum, s) =>
                                sum + (parseFloat(s.total_amount) || 0),
                              0,
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions Panel */}
                <div className="bg-white rounded-xl shadow-sm border p-4">
                  <h3 className="font-bold text-gray-800 mb-4">
                    Quick Actions
                  </h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setShowExportModal(true)}
                      className="w-full px-3 py-2 text-left text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 flex items-center"
                    >
                      <CloudDownload className="mr-2" fontSize="small" />
                      Export Data
                    </button>
                    <button
                      onClick={() => setShowSalesSummary(true)}
                      className="w-full px-3 py-2 text-left text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 flex items-center"
                    >
                      <Assessment className="mr-2" fontSize="small" />
                      View Summary
                    </button>
                    <button
                      onClick={() => setShowCashReconciliation(true)}
                      className="w-full px-3 py-2 text-left text-sm bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 flex items-center"
                    >
                      <AccountBalance className="mr-2" fontSize="small" />
                      Cash Reconciliation
                    </button>
                    <button
                      onClick={() => setShowMpesaVerification(true)}
                      className="w-full px-3 py-2 text-left text-sm bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 flex items-center"
                    >
                      <CreditScore className="mr-2" fontSize="small" />
                      M-Pesa Verification
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1">
              {/* Analytics Dashboard */}
              {activeSection === "overview" && (
                <div className="space-y-6">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl p-4 shadow-sm border">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Total Sales</p>
                          <p className="text-2xl font-bold text-gray-800 mt-1">
                            <FormattedAmount
                              amount={statistics?.total_sales || 0}
                            />
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {statistics?.sales_count || 0} transactions
                          </p>
                        </div>
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Receipt className="text-blue-600" />
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t">
                        <div className="flex justify-between text-xs">
                          <span className="text-green-600">+12.5%</span>
                          <span>vs yesterday</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm border">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Net Profit</p>
                          <p
                            className={`text-2xl font-bold mt-1 ${
                              (statistics?.total_profit || 0) >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            <FormattedAmount
                              amount={statistics?.total_profit || 0}
                            />
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            After all expenses
                          </p>
                        </div>
                        <div className="p-2 bg-green-100 rounded-lg">
                          <TrendingUp className="text-green-600" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm border">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Cash Position</p>
                          <p className="text-2xl font-bold text-gray-800 mt-1">
                            <FormattedAmount
                              amount={cashVerification.expectedCash}
                            />
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Net after expenses
                          </p>
                        </div>
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <LocalAtm className="text-blue-600" />
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t">
                        <div className="text-xs text-gray-600">
                          {cashVerification.missingCash > 0 ? (
                            <span className="text-red-600">
                              Shortage:{" "}
                              <FormattedAmount
                                amount={cashVerification.missingCash}
                              />
                            </span>
                          ) : cashVerification.missingCash < 0 ? (
                            <span className="text-yellow-600">
                              Excess:{" "}
                              <FormattedAmount
                                amount={-cashVerification.missingCash}
                              />
                            </span>
                          ) : (
                            <span className="text-green-600">Balanced ✓</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm border">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">
                            M-Pesa Balance
                          </p>
                          <p className="text-2xl font-bold text-gray-800 mt-1">
                            <FormattedAmount
                              amount={mpesaVerification.expectedMpesa}
                            />
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {mpesaVerification.unverifiedPayments.length}{" "}
                            unverified
                          </p>
                        </div>
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <CreditScore className="text-purple-600" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Charts Section */}
                  <SalesCharts
                    salesData={filteredSales}
                    expenses={expenses}
                    statistics={statistics}
                  />

                  {/* Employee Performance Preview */}
                  <div className="bg-white rounded-xl shadow-sm border p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-gray-800 flex items-center">
                        <People className="mr-2 text-blue-600" />
                        Top Performers
                      </h3>
                      <button
                        onClick={() => setShowEmployeePerformance(true)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        View All →
                      </button>
                    </div>
                    <EmployeePerformance
                      salesData={filteredSales}
                      employees={employees}
                      previewMode={true}
                    />
                  </div>
                </div>
              )}

              {/* Sales List */}

              {activeSection === "sales" && (
                <SalesList
                  sales={filteredSales}
                  batchMode={batchMode}
                  selectedItems={selectedBatchItems}
                  onToggleSelection={toggleBatchSelection}
                  onToggleDetails={toggleSaleDetails}
                  expandedSaleId={expandedSaleId}
                  getSaleTypeBadge={getSaleTypeBadge}
                  getSalespersonBadge={getSalespersonBadge}
                  onItemDeficit={handleItemDeficit}
                  onEditDeficit={handleEditDeficit} // Add this
                  isFinalized={isFinalized}
                  // deficits={deficitData} // Pass deficits data
                  deficits={deficitData || []}
                />
              )}

              {/* Expenses List */}
              {activeSection === "expenses" && (
                <ExpensesList
                  expenses={expenses}
                  employeeExpenses={employeeExpenses}
                  companyExpenses={companyExpenses}
                  onAssignExpense={handleAssignExpense}
                  getEmployeeName={getEmployeeName}
                  isFinalized={isFinalized}
                  employees={employees} // Pass employees list
                  // onEditExpense={handleEditExpense} // Add edit handler
                  // onDeleteExpense={handleDeleteExpense} // Add delete handler
                  onReassignExpense={handleReassignExpense} // Add reassign handler
                />
              )}

              {/* Analytics */}
              {activeSection === "analytics" && (
                <div className="space-y-6">
                  <SalesInsights
                    salesData={filteredSales}
                    statistics={statistics}
                    expenses={expenses}
                  />
                  <SalesTrends
                    teamId={teamId}
                    teamType={decodedTeamType}
                    currentDate={startDate}
                  />
                </div>
              )}

              {/* Verification */}
              {activeSection === "verification" && (
                <div className="space-y-6">
                  <CashReconciliation
                    cashVerification={cashVerification}
                    onUpdate={setCashVerification}
                    onReconcile={performCashReconciliation}
                    onAssignShortage={handleAssignCashShortage}
                    reconciliationRecord={cashReconciliationRecord}
                    isFinalized={isFinalized}
                    isReconciling={isReconciling}
                  />
                  <MpesaVerification
                    mpesaVerification={mpesaVerification}
                    reconciliationRecord={mpesaReconciliationRecord}
                    onUpdate={setMpesaVerification}
                    onVerifyPayment={verifyMpesaPayment} // This is correct - passed as onVerifyPayment
                    onUnverifyPayment={unverifyMpesaPayment} // This is correct - passed as onUnverifyPayment
                    onVerifyAllPayments={verifyAllMpesaPayments} // This is correct - passed as onVerifyAllPayments
                    onVerify={recordCashVerification} // This is a different function
                    onMpesaReconcile={performMpesaReconciliation}
                    onAssignShortage={(totalUnverifiedAmount) => {
                      if (totalUnverifiedAmount > 0) {
                        setSelectedShortageType("mpesa")
                        setShortageAssignment({
                          shortageType: "mpesa",
                          amount: totalUnverifiedAmount,
                          assignedTo: "",
                          employeeId: "",
                          isSalaryDeductible: false,
                          notes: "",
                        })
                        setShowShortageAssignment(true)
                      }
                    }}
                    isFinalized={isFinalized}
                  />
                </div>
              )}

              {/* Settlement */}
              {activeSection === "settlement" && (
                <SettlementSummary
                  canFinalizeByReconciliation={canFinalizeByReconciliation}
                  statistics={statistics}
                  cashVerification={cashVerification}
                  mpesaVerification={mpesaVerification}
                  dailySettlement={dailySettlement}
                  isFinalized={isFinalized}
                  onFinalize={() => setShowSettlementModal(true)}
                />
              )}
            </div>
          </div>
        ) : (
          /* Mobile: Tab-based Content */
          <div className="space-y-6">
            {/* Overview Section (Mobile) */}
            {activeSection === "overview" && (
              <div className="space-y-4">
                {/* Stats Cards Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-xl p-3 shadow-sm border">
                    <p className="text-xs text-gray-600">Total Sales</p>
                    <p className="text-lg font-bold mt-1">
                      <FormattedAmount amount={statistics?.total_sales || 0} />
                    </p>
                    <p className="text-[10px] text-gray-500 mt-1">
                      {statistics?.sales_count || 0} trans
                    </p>
                  </div>
                  <div className="bg-white rounded-xl p-3 shadow-sm border">
                    <p className="text-xs text-gray-600">Net Profit</p>
                    <p
                      className={`text-lg font-bold mt-1 ${
                        (statistics?.total_profit || 0) >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      <FormattedAmount amount={statistics?.total_profit || 0} />
                    </p>
                    <p className="text-[10px] text-gray-500 mt-1">Today</p>
                  </div>
                  <div className="bg-white rounded-xl p-3 shadow-sm border">
                    <p className="text-xs text-gray-600">Net Cash</p>
                    <p className="text-lg font-bold mt-1">
                      <FormattedAmount amount={cashVerification.expectedCash} />
                    </p>
                    <p className="text-[10px] text-gray-500 mt-1">
                      {cashVerification.missingCash === 0
                        ? "✓ Balanced"
                        : cashVerification.missingCash > 0
                        ? "⚠ Shortage"
                        : "⚠ Excess"}
                    </p>
                  </div>
                  <div className="bg-white rounded-xl p-3 shadow-sm border">
                    <p className="text-xs text-gray-600">M-Pesa</p>
                    <p className="text-lg font-bold mt-1">
                      <FormattedAmount
                        amount={mpesaVerification.expectedMpesa}
                      />
                    </p>
                    <p className="text-[10px] text-gray-500 mt-1">
                      {mpesaVerification.unverifiedPayments.length} unverified
                    </p>
                  </div>
                  <div className="bg-white rounded-xl p-3 shadow-sm border col-span-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">Total Debt</p>
                      <p className="text-lg font-bold text-red-600">
                        <FormattedAmount amount={statistics?.total_debt_remaining || 0} />
                      </p>
                    </div>
                  </div>
                </div>

                {/* Charts Preview */}
                <div className="bg-white rounded-xl shadow-sm border p-4">
                  <SalesCharts
                    salesData={filteredSales}
                    expenses={expenses}
                    statistics={statistics}
                    mobile={true}
                  />
                </div>
              </div>
            )}

            {/* Sales List (Mobile) */}
            {activeSection === "sales" && (
              <SalesList
                sales={filteredSales}
                batchMode={batchMode}
                selectedItems={selectedBatchItems}
                onToggleSelection={toggleBatchSelection}
                onToggleDetails={toggleSaleDetails}
                expandedSaleId={expandedSaleId}
                getSaleTypeBadge={getSaleTypeBadge}
                getSalespersonBadge={getSalespersonBadge}
                onItemDeficit={handleItemDeficit}
                isFinalized={isFinalized}
                mobile={true}
                deficits={deficitData || []}
              />
            )}

            {/* Expenses (Mobile) */}
            {activeSection === "expenses" && (
              <ExpensesList
                expenses={expenses}
                employeeExpenses={employeeExpenses}
                companyExpenses={companyExpenses}
                onAssignExpense={handleAssignExpense}
                getEmployeeName={getEmployeeName}
                isFinalized={isFinalized}
                mobile={true}
                employees={employees} // Pass employees list
                // onEditExpense={handleEditExpense} // Add edit handler
                // onDeleteExpense={handleDeleteExpense} // Add delete handler
                onReassignExpense={handleReassignExpense} // Add reassign handler
              />
            )}

            {/* Analytics (Mobile) */}
            {activeSection === "analytics" && (
              <div className="space-y-4">
                <SalesInsights
                  salesData={filteredSales}
                  statistics={statistics}
                  expenses={expenses}
                  mobile={true}
                />
              </div>
            )}

            {/* Verification (Mobile) */}
            {activeSection === "verification" && (
              <div className="space-y-4">
                <CashReconciliation
                  reconciliationRecord={cashReconciliationRecord}
                  cashVerification={cashVerification}
                  onUpdate={setCashVerification}
                  onReconcile={performCashReconciliation}
                  onAssignShortage={handleAssignCashShortage}
                  isFinalized={isFinalized}
                  isReconciling ={isReconciling}
                  mobile={true}
                />
                <MpesaVerification
                  mpesaVerification={mpesaVerification}
                  reconciliationRecord={mpesaReconciliationRecord}
                  onUpdate={setMpesaVerification}
                  onVerifyPayment={verifyMpesaPayment} // This is correct - passed as onVerifyPayment
                  onUnverifyPayment={unverifyMpesaPayment} // This is correct - passed as onUnverifyPayment
                  onVerifyAllPayments={verifyAllMpesaPayments} // This is correct - passed as onVerifyAllPayments
                  onVerify={recordCashVerification} // This is a different function
                  onMpesaReconcile={performMpesaReconciliation}
                  onAssignShortage={(totalUnverifiedAmount) => {
                    if (totalUnverifiedAmount > 0) {
                      setSelectedShortageType("mpesa")
                      setShortageAssignment({
                        shortageType: "mpesa",
                        amount: totalUnverifiedAmount,
                        assignedTo: "",
                        employeeId: "",
                        isSalaryDeductible: false,
                        notes: "",
                      })
                      setShowShortageAssignment(true)
                    }
                  }}
                  isFinalized={isFinalized}
                  mobile={true}
                />
              </div>
            )}

            {/* Settlement (Mobile) */}
            {activeSection === "settlement" && (
              <SettlementSummary
                canFinalizeByReconciliation={canFinalizeByReconciliation}
                statistics={statistics}
                cashVerification={cashVerification}
                mpesaVerification={mpesaVerification}
                dailySettlement={dailySettlement}
                isFinalized={isFinalized}
                onFinalize={() => setShowSettlementModal(true)}
                mobile={true}
              />
            )}
          </div>
        )}
      </main>

      {/* Fixed Action Buttons for Mobile */}
      {isMobile && (
        <div className="fixed bottom-20 right-4 z-30 flex flex-col gap-2">
          {batchMode && selectedBatchItems.length > 0 && (
            <button
              onClick={() => setShowExportModal(true)}
              className="bg-blue-600 text-white p-3 rounded-full shadow-lg flex items-center justify-center"
              title="Export Selected"
            >
              <CloudDownload />
            </button>
          )}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="bg-blue-600 text-white p-3 rounded-full shadow-lg"
            title="Scroll to Top"
          >
            <ArrowDropUp />
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t">
        <div className="flex justify-between items-center p-3">
          <div className="flex items-center gap-3">
            <div
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                isFinalized
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {isFinalized ? (
                <span className="flex items-center">
                  <Lock fontSize="small" className="mr-1" />
                  Finalized
                </span>
              ) : (
                <span className="flex items-center">
                  <LockOpen fontSize="small" className="mr-1" />
                  In Progress
                </span>
              )}
            </div>
            <div className="text-sm text-gray-600">
              {filteredSales.length} sales • {expenses.length} expenses
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-3 py-1 rounded text-sm flex items-center gap-1 ${
                autoRefresh
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              <Refresh
                fontSize="small"
                className={autoRefresh ? "animate-spin" : ""}
              />
              <span className="hidden sm:inline">
                Auto-refresh {autoRefresh ? "On" : "Off"}
              </span>
            </button>
            <AdminsFooter />
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ExportModal
        open={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={exportData}
        selectedCount={selectedBatchItems.length}
        totalCount={filteredSales.length}
        formats={["pdf", "excel", "csv", "json"]}
      />

      <AdvancedFilters
        open={showAdvancedFilters}
        onClose={() => setShowAdvancedFilters(false)}
        employees={employees}
        onApply={(filters) => {
          // Apply advanced filters
        }}
      />

      {/* Edit Deficit Modal */}
      {showEditDeficitModal && selectedDeficit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">
                  Edit Deficit/Excess
                </h3>
                <button
                  onClick={() => setShowEditDeficitModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Close />
                </button>
              </div>

              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">{selectedDeficit.item_name}</p>
                <p className="text-sm text-gray-600">
                  Invoice: {selectedDeficit.invoice_number}
                </p>
                <p className="text-sm text-gray-600">
                  Type: {selectedDeficit.item_type}
                </p>
                <div className="mt-2 text-sm">
                  <span className="font-medium">Current Status:</span>{" "}
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      selectedDeficit.status === "RECORDED"
                        ? "bg-blue-100 text-blue-800"
                        : selectedDeficit.status === "DEDUCTED"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {selectedDeficit.status}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expected Price
                    </label>
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                      value={editDeficitForm.expected_price}
                      onChange={(e) =>
                        setEditDeficitForm((prev) => ({
                          ...prev,
                          expected_price: parseFloat(e.target.value) || 0,
                        }))
                      }
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Actual Price
                    </label>
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                      value={editDeficitForm.actual_price}
                      onChange={(e) =>
                        setEditDeficitForm((prev) => ({
                          ...prev,
                          actual_price: parseFloat(e.target.value) || 0,
                        }))
                      }
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Difference:</span>
                    <span
                      className={`text-lg font-bold ${
                        editDeficitForm.expected_price -
                          editDeficitForm.actual_price >
                        0
                          ? "text-red-700"
                          : "text-green-700"
                      }`}
                    >
                      {editDeficitForm.expected_price >
                      editDeficitForm.actual_price
                        ? "+"
                        : ""}
                      <FormattedAmount
                        amount={
                          editDeficitForm.expected_price -
                          editDeficitForm.actual_price
                        }
                      />
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {editDeficitForm.expected_price >
                    editDeficitForm.actual_price
                      ? "Deficit (Sold for less than expected)"
                      : "Excess (Sold for more than expected)"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                    value={editDeficitForm.reason}
                    onChange={(e) =>
                      setEditDeficitForm((prev) => ({
                        ...prev,
                        reason: e.target.value,
                      }))
                    }
                  >
                    <option value="">Select Reason</option>
                    <option value="UNDERCHARGED">Undercharged Customer</option>
                    <option value="OVERCHARGED">Overcharged Customer</option>
                    <option value="WRONG_PRICE">Wrong Price Applied</option>
                    <option value="MISSING_ITEM">Item Not Charged</option>
                    <option value="EXTRA_ITEM">Extra Item Charged</option>
                    <option value="DISCOUNT_ERROR">
                      Unauthorized Discount
                    </option>
                    <option value="STAFF_ERROR">Staff Error</option>
                    <option value="SYSTEM_ERROR">System Error</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Responsibility
                  </label>
                  <div className="flex space-x-2 mb-3">
                    <button
                      onClick={() =>
                        setEditDeficitForm((prev) => ({
                          ...prev,
                          responsibility_type: "EMPLOYEE",
                        }))
                      }
                      className={`flex-1 py-2 rounded-lg text-sm ${
                        editDeficitForm.responsibility_type === "EMPLOYEE"
                          ? "bg-blue-100 text-blue-700 border-2 border-blue-300"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      Employee
                    </button>
                    <button
                      onClick={() =>
                        setEditDeficitForm((prev) => ({
                          ...prev,
                          responsibility_type: "COMPANY",
                          assigned_employee: "",
                        }))
                      }
                      className={`flex-1 py-2 rounded-lg text-sm ${
                        editDeficitForm.responsibility_type === "COMPANY"
                          ? "bg-green-100 text-green-700 border-2 border-green-300"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      Company
                    </button>
                  </div>

                  {editDeficitForm.responsibility_type === "EMPLOYEE" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Assign to Employee
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                        value={editDeficitForm.assigned_employee}
                        onChange={(e) =>
                          setEditDeficitForm((prev) => ({
                            ...prev,
                            assigned_employee: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Employee</option>
                        {employees.map((emp) => (
                          <option key={emp.id} value={emp.id}>
                            {emp.first_name} {emp.last_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                    value={editDeficitForm.status}
                    onChange={(e) =>
                      setEditDeficitForm((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                  >
                    <option value="RECORDED">Recorded</option>
                    <option value="DEDUCTED">Deducted</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="ADJUSTED">Adjusted</option>
                  </select>
                </div>

                {editDeficitForm.responsibility_type === "EMPLOYEE" && (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_salary_deductible"
                      checked={editDeficitForm.is_salary_deductible}
                      onChange={(e) =>
                        setEditDeficitForm((prev) => ({
                          ...prev,
                          is_salary_deductible: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <label
                      htmlFor="is_salary_deductible"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Deduct from employee salary
                    </label>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                    rows="3"
                    value={editDeficitForm.notes}
                    onChange={(e) =>
                      setEditDeficitForm((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    placeholder="Enter additional notes..."
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    onClick={() => setShowEditDeficitModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveEditedDeficit}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shortage Assignment Modal */}
      {showShortageAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">
                  {selectedShortageType === "cash" ? "Cash" : "M-Pesa"}
                  {
                    selectedShortageType === "cash"
                      ? cashVerification.missingCash > 0
                        ? " Shortage Assignment"
                        : " Excess Assignment"
                      : " Shortage Assignment" /* M-Pesa unverified is always shortage */
                  }
                </h3>
                <button
                  onClick={() => setShowShortageAssignment(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Close />
                </button>
              </div>

              <div
                className={`mb-4 p-3 rounded-lg ${
                  selectedShortageType === "cash"
                    ? cashVerification.missingCash > 0
                      ? "bg-red-50 border-red-200"
                      : "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200" /* M-Pesa unverified is always red/shortage */
                } border`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      {selectedShortageType === "cash" ? (
                        cashVerification.missingCash > 0 ? (
                          <>
                            <ErrorOutline className="text-red-600" />
                            <p className="font-medium text-red-800">
                              Cash Shortage
                            </p>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="text-green-600" />
                            <p className="font-medium text-green-800">
                              Cash Excess
                            </p>
                          </>
                        )
                      ) : (
                        /* M-Pesa unverified section */
                        <>
                          <ErrorOutline className="text-red-600" />
                          <p className="font-medium text-red-800">
                            M-Pesa Shortage
                          </p>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Amount:{" "}
                      <span
                        className={`font-bold ${
                          selectedShortageType === "cash"
                            ? cashVerification.missingCash > 0
                              ? "text-red-700"
                              : "text-green-700"
                            : "text-red-700" /* M-Pesa unverified is always red */
                        }`}
                      >
                        <FormattedAmount amount={shortageAssignment.amount} />
                      </span>
                    </p>
                    {selectedShortageType === "cash" ? (
                      <div className="text-xs text-gray-500 mt-2 space-y-1">
                        <div>
                          Expected:{" "}
                          <FormattedAmount
                            amount={cashVerification.expectedCash}
                          />
                        </div>
                        <div>
                          Actual:{" "}
                          <FormattedAmount
                            amount={cashVerification.actualCash}
                          />
                        </div>
                        <div
                          className={`font-medium ${
                            cashVerification.missingCash > 0
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {cashVerification.missingCash > 0
                            ? "Shortage"
                            : "Excess"}
                          :{" "}
                          <FormattedAmount
                            amount={Math.abs(cashVerification.missingCash)}
                          />
                        </div>
                      </div>
                    ) : (
                      /* M-Pesa unverified details */
                      <div className="text-xs text-gray-500 mt-2 space-y-1">
                        <div>
                          Total M-Pesa Sales:{" "}
                          <FormattedAmount
                            amount={mpesaVerification.totalSalesMpesa}
                          />
                        </div>
                        <div>
                          M-Pesa Expenses:{" "}
                          <FormattedAmount
                            amount={mpesaVerification.totalMpesaExpenses}
                          />
                        </div>
                        <div>
                          Net Expected M-Pesa:{" "}
                          <FormattedAmount
                            amount={mpesaVerification.expectedMpesa}
                          />
                        </div>
                        <div className="font-medium text-red-600">
                          Unverified M-Pesa:{" "}
                          <FormattedAmount amount={shortageAssignment.amount} />
                        </div>
                        <div>
                          Unverified Payments:{" "}
                          {mpesaVerification.unverifiedPayments.length}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assign To
                  </label>
                  <div className="flex space-x-2 mb-3">
                    <button
                      onClick={() =>
                        setShortageAssignment((prev) => ({
                          ...prev,
                          assignedTo: "employee",
                          // Reset salary options when switching to employee
                          ...(prev.assignedTo !== "employee" && {
                            isSalaryDeductible: isShortage(),
                            isSalaryAddition: !isShortage(),
                          }),
                        }))
                      }
                      className={`flex-1 py-2 rounded-lg text-sm ${
                        shortageAssignment.assignedTo === "employee"
                          ? "bg-blue-100 text-blue-700 border-2 border-blue-300"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      Employee
                    </button>
                    <button
                      onClick={() =>
                        setShortageAssignment((prev) => ({
                          ...prev,
                          assignedTo: "company",
                          employeeId: "",
                          // Clear salary options when switching to company
                          isSalaryDeductible: false,
                          isSalaryAddition: false,
                        }))
                      }
                      className={`flex-1 py-2 rounded-lg text-sm ${
                        shortageAssignment.assignedTo === "company"
                          ? "bg-green-100 text-green-700 border-2 border-green-300"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      Company
                    </button>
                  </div>
                </div>

                {shortageAssignment.assignedTo === "employee" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Employee
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                        value={shortageAssignment.employeeId}
                        onChange={(e) =>
                          setShortageAssignment((prev) => ({
                            ...prev,
                            employeeId: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Employee</option>
                        {employees.map((emp) => (
                          <option key={emp.id} value={emp.id}>
                            {emp.first_name} {emp.last_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Salary Options - For M-Pesa unverified, it's always a shortage */}
                    <div className="space-y-3 p-3 bg-blue-50 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Salary Treatment
                      </label>

                      {/* Only show shortage options for M-Pesa unverified */}
                      {selectedShortageType === "mpesa" ? (
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="salaryDeductible"
                              name="salaryTreatment"
                              checked={shortageAssignment.isSalaryDeductible}
                              onChange={(e) =>
                                setShortageAssignment((prev) => ({
                                  ...prev,
                                  isSalaryDeductible: true,
                                  isSalaryAddition: false,
                                  isCompanyAbsorption: false,
                                }))
                              }
                              className="h-4 w-4 text-blue-600"
                            />
                            <label
                              htmlFor="salaryDeductible"
                              className="ml-2 text-sm text-gray-700 flex-1"
                            >
                              <div className="font-medium">
                                Deduct from employee salary
                              </div>
                              <div className="text-xs text-gray-600">
                                Amount will be subtracted from next salary
                                payment
                              </div>
                            </label>
                          </div>

                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="employeeAbsorption"
                              name="salaryTreatment"
                              checked={
                                !shortageAssignment.isSalaryDeductible &&
                                !shortageAssignment.isCompanyAbsorption
                              }
                              onChange={(e) =>
                                setShortageAssignment((prev) => ({
                                  ...prev,
                                  isSalaryDeductible: false,
                                  isSalaryAddition: false,
                                  isCompanyAbsorption: false,
                                }))
                              }
                              className="h-4 w-4 text-blue-600"
                            />
                            <label
                              htmlFor="employeeAbsorption"
                              className="ml-2 text-sm text-gray-700 flex-1"
                            >
                              <div className="font-medium">
                                Employee absorbs without salary deduction
                              </div>
                              <div className="text-xs text-gray-600">
                                Employee responsible but not deducted from
                                salary
                              </div>
                            </label>
                          </div>
                        </div>
                      ) : /* Cash shortage/excess options remain the same */
                      isShortage() ? (
                        // For SHORTAGE: Option to deduct from salary
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="salaryDeductibleCash"
                              name="salaryTreatment"
                              checked={shortageAssignment.isSalaryDeductible}
                              onChange={(e) =>
                                setShortageAssignment((prev) => ({
                                  ...prev,
                                  isSalaryDeductible: true,
                                  isSalaryAddition: false,
                                  isCompanyAbsorption: false,
                                }))
                              }
                              className="h-4 w-4 text-blue-600"
                            />
                            <label
                              htmlFor="salaryDeductibleCash"
                              className="ml-2 text-sm text-gray-700 flex-1"
                            >
                              <div className="font-medium">
                                Deduct from employee salary
                              </div>
                              <div className="text-xs text-gray-600">
                                Amount will be subtracted from next salary
                                payment
                              </div>
                            </label>
                          </div>

                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="employeeAbsorptionCash"
                              name="salaryTreatment"
                              checked={
                                !shortageAssignment.isSalaryDeductible &&
                                !shortageAssignment.isCompanyAbsorption
                              }
                              onChange={(e) =>
                                setShortageAssignment((prev) => ({
                                  ...prev,
                                  isSalaryDeductible: false,
                                  isSalaryAddition: false,
                                  isCompanyAbsorption: false,
                                }))
                              }
                              className="h-4 w-4 text-blue-600"
                            />
                            <label
                              htmlFor="employeeAbsorptionCash"
                              className="ml-2 text-sm text-gray-700 flex-1"
                            >
                              <div className="font-medium">
                                Employee absorbs without salary deduction
                              </div>
                              <div className="text-xs text-gray-600">
                                Employee responsible but not deducted from
                                salary
                              </div>
                            </label>
                          </div>
                        </div>
                      ) : (
                        // For EXCESS: Option to add to salary or treat as company excess
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="salaryAdditionCash"
                              name="salaryTreatment"
                              checked={shortageAssignment.isSalaryAddition}
                              onChange={(e) =>
                                setShortageAssignment((prev) => ({
                                  ...prev,
                                  isSalaryAddition: true,
                                  isSalaryDeductible: false,
                                  isCompanyAbsorption: false,
                                }))
                              }
                              className="h-4 w-4 text-green-600"
                            />
                            <label
                              htmlFor="salaryAdditionCash"
                              className="ml-2 text-sm text-gray-700 flex-1"
                            >
                              <div className="font-medium">
                                Add to employee salary
                              </div>
                              <div className="text-xs text-gray-600">
                                Amount will be added to next salary payment
                              </div>
                            </label>
                          </div>

                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="employeeReceivesCash"
                              name="salaryTreatment"
                              checked={
                                !shortageAssignment.isSalaryAddition &&
                                !shortageAssignment.isCompanyAbsorption
                              }
                              onChange={(e) =>
                                setShortageAssignment((prev) => ({
                                  ...prev,
                                  isSalaryAddition: false,
                                  isSalaryDeductible: false,
                                  isCompanyAbsorption: false,
                                }))
                              }
                              className="h-4 w-4 text-green-600"
                            />
                            <label
                              htmlFor="employeeReceivesCash"
                              className="ml-2 text-sm text-gray-700 flex-1"
                            >
                              <div className="font-medium">
                                Employee receives directly
                              </div>
                              <div className="text-xs text-gray-600">
                                Employee receives cash directly without salary
                                addition
                              </div>
                            </label>
                          </div>

                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="companyAbsorptionCash"
                              name="salaryTreatment"
                              checked={shortageAssignment.isCompanyAbsorption}
                              onChange={(e) =>
                                setShortageAssignment((prev) => ({
                                  ...prev,
                                  isCompanyAbsorption: true,
                                  isSalaryAddition: false,
                                  isSalaryDeductible: false,
                                }))
                              }
                              className="h-4 w-4 text-gray-600"
                            />
                            <label
                              htmlFor="companyAbsorptionCash"
                              className="ml-2 text-sm text-gray-700 flex-1"
                            >
                              <div className="font-medium">
                                Company absorbs excess
                              </div>
                              <div className="text-xs text-gray-600">
                                Excess retained by company, not given to
                                employee
                              </div>
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {shortageAssignment.assignedTo === "company" && (
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <Business
                        className="text-green-600 mr-2"
                        fontSize="small"
                      />
                      <div>
                        <p className="text-sm font-medium text-green-800">
                          Company Responsibility
                        </p>
                        <p className="text-xs text-green-700">
                          {selectedShortageType === "mpesa"
                            ? "The unverified M-Pesa will be recorded as a company loss."
                            : isShortage()
                            ? "The shortage will be recorded as a company loss."
                            : "The excess will be recorded as additional company income."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                    rows="3"
                    value={shortageAssignment.notes}
                    onChange={(e) =>
                      setShortageAssignment((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    placeholder={`Enter notes about this ${
                      selectedShortageType === "mpesa"
                        ? "M-Pesa shortage"
                        : isShortage()
                        ? "shortage"
                        : "excess"
                    } assignment...`}
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    onClick={() => setShowShortageAssignment(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveShortageAssignment}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      selectedShortageType === "mpesa" || isShortage()
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    {selectedShortageType === "mpesa" || isShortage()
                      ? "Assign Shortage"
                      : "Assign Excess"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Item Deficit Modal */}
      {showItemDeficitModal && selectedItemForDeficit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">
                  Record Item Deficit/Excess
                </h3>
                <button
                  onClick={() => {
                    setShowItemDeficitModal(false)
                    setSelectedItemForDeficit(null)
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Close />
                </button>
              </div>

              <div className="mb-4 p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium">
                      Invoice: {itemDeficitForm.invoiceNumber}
                    </p>
                    <p className="text-sm text-gray-600">
                      Item: {itemDeficitForm.itemName}
                    </p>
                    <p className="text-xs text-gray-500">
                      Type:{" "}
                      {itemDeficitForm.itemType === "cylinder"
                        ? "Cylinder"
                        : "Regular Item"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Sold Price</p>
                    <p className="text-sm font-bold">
                      <FormattedAmount
                        amount={
                          selectedItemForDeficit.item.total_price ||
                          selectedItemForDeficit.item.unit_price *
                            (selectedItemForDeficit.item.quantity || 1)
                        }
                      />
                    </p>
                  </div>
                </div>

                {selectedItemForDeficit.sale.customer_info?.name && (
                  <p className="text-xs text-gray-600 mt-1">
                    Customer: {selectedItemForDeficit.sale.customer_info.name}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expected Price
                    </label>
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                      value={itemDeficitForm.expectedPrice}
                      onChange={(e) =>
                        setItemDeficitForm((prev) => ({
                          ...prev,
                          expectedPrice: parseFloat(e.target.value) || 0,
                          deficitAmount:
                            (parseFloat(e.target.value) || 0) -
                            prev.actualPrice,
                        }))
                      }
                      placeholder="Enter expected price"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Actual Price Sold
                    </label>
                    <div className="p-2 bg-gray-50 rounded text-sm">
                      <FormattedAmount
                        amount={
                          selectedItemForDeficit.item.total_price ||
                          selectedItemForDeficit.item.unit_price *
                            (selectedItemForDeficit.item.quantity || 1)
                        }
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      (Auto-filled from sale)
                    </p>
                  </div>
                </div>

                {/* Deficit/Excess Display */}
                <div
                  className={`p-3 rounded-lg ${
                    itemDeficitForm.deficitAmount > 0
                      ? "bg-red-50 border-red-200 border"
                      : itemDeficitForm.deficitAmount < 0
                      ? "bg-green-50 border-green-200 border"
                      : "bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <p
                      className={`text-sm font-medium ${
                        itemDeficitForm.deficitAmount > 0
                          ? "text-red-800"
                          : itemDeficitForm.deficitAmount < 0
                          ? "text-green-800"
                          : "text-gray-800"
                      }`}
                    >
                      {itemDeficitForm.deficitAmount > 0
                        ? "Deficit (Sold for less)"
                        : itemDeficitForm.deficitAmount < 0
                        ? "Excess (Sold for more)"
                        : "No Difference"}
                    </p>
                    <p
                      className={`text-lg font-bold ${
                        itemDeficitForm.deficitAmount > 0
                          ? "text-red-700"
                          : itemDeficitForm.deficitAmount < 0
                          ? "text-green-700"
                          : "text-gray-700"
                      }`}
                    >
                      {itemDeficitForm.deficitAmount > 0 ? "+" : ""}
                      <FormattedAmount amount={itemDeficitForm.deficitAmount} />
                    </p>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Expected:{" "}
                    <FormattedAmount amount={itemDeficitForm.expectedPrice} />-
                    Actual:{" "}
                    <FormattedAmount amount={itemDeficitForm.actualPrice} />={" "}
                    {itemDeficitForm.deficitAmount > 0
                      ? "Deficit"
                      : itemDeficitForm.deficitAmount < 0
                      ? "Excess"
                      : "Difference"}
                    :{" "}
                    <FormattedAmount
                      amount={Math.abs(itemDeficitForm.deficitAmount)}
                    />
                    {itemDeficitForm.deficitAmount < 0 &&
                      " (Sold for more than expected)"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assign Responsibility
                  </label>
                  <div className="flex space-x-2 mb-3">
                    <button
                      onClick={() =>
                        setItemDeficitForm((prev) => ({
                          ...prev,
                          assignedToCompany: false,
                        }))
                      }
                      className={`flex-1 py-2 rounded-lg text-sm ${
                        !itemDeficitForm.assignedToCompany
                          ? "bg-blue-100 text-blue-700 border-2 border-blue-300"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      Employee
                    </button>
                    <button
                      onClick={() =>
                        setItemDeficitForm((prev) => ({
                          ...prev,
                          assignedToCompany: true,
                          assignedEmployeeId: "",
                        }))
                      }
                      className={`flex-1 py-2 rounded-lg text-sm ${
                        itemDeficitForm.assignedToCompany
                          ? "bg-green-100 text-green-700 border-2 border-green-300"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      Company
                    </button>
                  </div>

                  {!itemDeficitForm.assignedToCompany && (
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Employee
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                        value={itemDeficitForm.assignedEmployeeId}
                        onChange={(e) =>
                          setItemDeficitForm((prev) => ({
                            ...prev,
                            assignedEmployeeId: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Employee</option>
                        {employees.map((emp) => (
                          <option key={emp.id} value={emp.id}>
                            {emp.first_name} {emp.last_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason for Difference
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                    value={itemDeficitForm.reason}
                    onChange={(e) =>
                      setItemDeficitForm((prev) => ({
                        ...prev,
                        reason: e.target.value,
                      }))
                    }
                  >
                    <option value="">Select Reason</option>
                    <option value="UNDERCHARGED">Undercharged Customer</option>
                    <option value="OVERCHARGED">Overcharged Customer</option>
                    <option value="WRONG_PRICE">Wrong Price Applied</option>
                    <option value="MISSING_ITEM">Item Not Charged</option>
                    <option value="EXTRA_ITEM">Extra Item Charged</option>
                    <option value="DISCOUNT_ERROR">
                      Unauthorized Discount
                    </option>
                    <option value="STAFF_ERROR">Staff Error</option>
                    <option value="SYSTEM_ERROR">System Error</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                    rows="2"
                    value={itemDeficitForm.notes}
                    onChange={(e) =>
                      setItemDeficitForm((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    placeholder="Enter details about this price difference..."
                  />
                </div>

                {!itemDeficitForm.assignedToCompany && (
                  <div className="space-y-2">
                    {itemDeficitForm.deficitAmount > 0 && (
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="itemSalaryDeductible"
                          checked={itemDeficitForm.isSalaryDeductible}
                          onChange={(e) =>
                            setItemDeficitForm((prev) => ({
                              ...prev,
                              isSalaryDeductible: e.target.checked,
                            }))
                          }
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                        <label
                          htmlFor="itemSalaryDeductible"
                          className="ml-2 text-sm text-gray-700"
                        >
                          Deduct deficit from employee salary
                        </label>
                      </div>
                    )}
                    {itemDeficitForm.deficitAmount < 0 && (
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="itemSalaryAddition"
                          checked={itemDeficitForm.isSalaryAddition || false}
                          onChange={(e) =>
                            setItemDeficitForm((prev) => ({
                              ...prev,
                              isSalaryAddition: e.target.checked,
                            }))
                          }
                          className="h-4 w-4 text-green-600 rounded"
                        />
                        <label
                          htmlFor="itemSalaryAddition"
                          className="ml-2 text-sm text-gray-700"
                        >
                          Add excess to employee salary (bonus)
                        </label>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    onClick={() => {
                      setShowItemDeficitModal(false)
                      setSelectedItemForDeficit(null)
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveItemDeficit}
                    disabled={itemDeficitForm.expectedPrice === 0}
                    className={`px-4 py-2 rounded-lg text-sm ${
                      itemDeficitForm.deficitAmount === 0
                        ? "bg-gray-400 text-gray-800"
                        : itemDeficitForm.deficitAmount > 0
                        ? "bg-red-600 text-white"
                        : "bg-green-600 text-white"
                    } ${
                      itemDeficitForm.expectedPrice === 0
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {itemDeficitForm.deficitAmount === 0
                      ? "Record No Difference"
                      : itemDeficitForm.deficitAmount > 0
                      ? "Record Deficit"
                      : "Record Excess"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Expense Assignment Modal */}
      {showExpenseAssignment && selectedExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">
                  Assign Expense
                </h3>
                <button
                  onClick={() => setShowExpenseAssignment(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Close />
                </button>
              </div>

              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">{selectedExpense.title}</p>
                <p className="text-sm text-gray-600">
                  Amount: <FormattedAmount amount={selectedExpense.amount} />
                </p>
                <p className="text-sm text-gray-600">
                  Category: {selectedExpense.category?.name}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assign to
                  </label>
                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        setExpenseAssignment((prev) => ({
                          ...prev,
                          isCompanyExpense: false,
                        }))
                      }
                      className={`flex-1 py-2 rounded-lg text-sm ${
                        !expenseAssignment.isCompanyExpense
                          ? "bg-blue-100 text-blue-700 border-2 border-blue-300"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      Employee
                    </button>
                    <button
                      onClick={() =>
                        setExpenseAssignment((prev) => ({
                          ...prev,
                          isCompanyExpense: true,
                          employeeId: "",
                        }))
                      }
                      className={`flex-1 py-2 rounded-lg text-sm ${
                        expenseAssignment.isCompanyExpense
                          ? "bg-green-100 text-green-700 border-2 border-green-300"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      Company
                    </button>
                  </div>
                </div>

                {!expenseAssignment.isCompanyExpense && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Employee
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                      value={expenseAssignment.employeeId}
                      onChange={(e) =>
                        setExpenseAssignment((prev) => ({
                          ...prev,
                          employeeId: e.target.value,
                        }))
                      }
                    >
                      <option value="">Select Employee</option>
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.first_name} {emp.last_name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assignment Notes
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                    rows="2"
                    value={expenseAssignment.notes}
                    onChange={(e) =>
                      setExpenseAssignment((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    placeholder="Enter notes about this assignment..."
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    onClick={() => setShowExpenseAssignment(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveExpenseAssignment}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
                  >
                    Save Assignment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settlement Modal */}
      {showSettlementModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                {isFinalized
                  ? "Settlement Finalized"
                  : "Confirm Daily Settlement"}
              </h3>

              {isFinalized ? (
                <div className="mb-4 p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="text-green-600 mr-2" />
                    <div>
                      <p className="text-green-800 font-medium">
                        Already Finalized
                      </p>
                      <p className="text-sm text-green-700">
                        This day's sales have already been finalized on{" "}
                        {new Date(
                          dailySettlement.finalized_at,
                        ).toLocaleDateString()}
                        .
                      </p>
                      {dailySettlement.settlement_notes && (
                        <p className="text-sm text-gray-600 mt-2">
                          <span className="font-medium">Notes:</span>{" "}
                          {dailySettlement.settlement_notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-start">
                      <Warning className="text-yellow-600 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm text-yellow-800 font-medium">
                          Important Notice
                        </p>
                        <p className="text-sm text-yellow-700 mt-1">
                          Once finalized, no further changes can be made for{" "}
                          {formatDate(startDate, "short")}. Please verify all
                          data before proceeding.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Final Notes
                    </label>
                    <textarea
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                      rows="3"
                      value={settlementNotes}
                      onChange={(e) => setSettlementNotes(e.target.value)}
                      placeholder="Enter any final notes, comments, or observations..."
                    />
                  </div>

                  {/* Settlement Summary */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2">Summary</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Sales:</span>
                        <span className="font-medium">
                          <FormattedAmount
                            amount={statistics?.total_sales || 0}
                          />
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Expenses:</span>
                        <span className="font-medium text-red-600">
                          <FormattedAmount
                            amount={statistics?.total_expenses || 0}
                          />
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Net Profit:</span>
                        <span
                          className={`font-medium ${
                            (statistics?.total_profit || 0) >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          <FormattedAmount
                            amount={statistics?.total_profit || 0}
                          />
                        </span>
                      </div>
                      <div className="pt-2 border-t mt-2">
                        <div className="flex justify-between">
                          <span className="font-medium">Final Balance:</span>
                          <span className="font-bold text-lg">
                            <FormattedAmount
                              amount={
                                cashVerification.expectedCash +
                                  mpesaVerification.expectedMpesa || 0
                              }
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div>ddd</div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowSettlementModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm font-medium"
                >
                  {isFinalized ? "Close" : "Cancel"}
                </button>
                {!isFinalized && (
                  <button
                    onClick={finalizeSettlement}
                    disabled={!canFinalizeByReconciliation}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      canFinalizeByReconciliation
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Finalize Settlement
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add this CSS at the end of your component, replacing the existing style block */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }

        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }

        /* Responsive fixes */
        @media (max-width: 768px) {
          /* Mobile navigation tabs - make them scrollable with better spacing */
          .mobile-tabs-container {
            padding: 0 8px;
          }

          .mobile-tab-button {
            min-width: 120px;
            padding: 8px 12px;
            font-size: 11px;
            flex-direction: row;
            gap: 4px;
            white-space: nowrap;
          }

          .mobile-tab-button svg {
            font-size: 14px;
          }

          /* Date picker container - prevent overflow */
          .date-picker-container {
            position: relative;
            min-width: 0;
          }

          .date-picker-dropdown {
            position: fixed !important;
            left: 16px !important;
            right: 16px !important;
            width: auto !important;
            max-width: none !important;
            z-index: 100;
          }

          /* Main header adjustments */
          .main-header {
            padding: 12px;
          }

          .header-title {
            font-size: 18px;
          }

          /* Quick actions - stack on mobile */
          .quick-actions-container {
            flex-wrap: wrap;
            gap: 8px;
          }

          .quick-action-button {
            padding: 6px 10px;
            font-size: 12px;
          }

          /* Stats cards grid */
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px;
          }

          .stat-card {
            padding: 12px;
          }

          .stat-card-title {
            font-size: 11px;
          }

          .stat-card-value {
            font-size: 18px;
          }

          /* Filter section adjustments */
          .filter-grid {
            grid-template-columns: 1fr !important;
            gap: 12px;
          }

          .filter-input {
            font-size: 14px;
            padding: 10px 12px;
          }

          /* RealTimeIndicator fixes */
          .realtime-indicator {
            font-size: 11px;
            padding: 6px 8px;
            flex-wrap: wrap;
            justify-content: center;
            text-align: center;
          }

          .realtime-indicator-content {
            flex-direction: column;
            align-items: center;
            gap: 4px;
          }

          /* Modal adjustments */
          .modal-content {
            margin: 16px;
            max-height: calc(100vh - 32px);
          }

          .modal-inner {
            padding: 16px;
          }

          /* Footer adjustments */
          .footer-content {
            padding: 12px;
            flex-direction: column;
            gap: 8px;
            text-align: center;
          }

          .footer-status {
            justify-content: center;
          }

          /* Fix for table/list items */
          .sale-item,
          .expense-item {
            padding: 12px;
            margin-bottom: 8px;
          }

          /* Fix button congestion */
          .button-group {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
          }

          .compact-button {
            padding: 6px 10px;
            font-size: 12px;
            min-height: 36px;
          }

          /* Date navigation buttons */
          .date-nav-button {
            min-width: 36px;
            padding: 8px;
          }

          /* Hide non-essential elements on mobile */
          .hide-on-mobile {
            display: none !important;
          }

          /* Show essential elements on mobile */
          .show-on-mobile {
            display: block !important;
          }
        }

        @media (max-width: 480px) {
          /* Extra small devices */
          .mobile-tab-button {
            min-width: 100px;
            padding: 8px;
            font-size: 10px;
          }

          .stats-grid {
            grid-template-columns: 1fr !important;
          }

          .header-title {
            font-size: 16px;
          }

          .subtitle {
            font-size: 12px;
          }

          /* Make all buttons more touch-friendly */
          button,
          .button,
          [role="button"] {
            min-height: 44px;
            min-width: 44px;
          }

          /* Adjust padding for better touch */
          .p-4 {
            padding: 12px;
          }

          .p-3 {
            padding: 10px;
          }

          /* Fix input sizes */
          input,
          select,
          textarea {
            font-size: 16px !important; /* Prevents zoom on iOS */
            min-height: 44px;
          }
        }

        @media (max-width: 640px) {
          .text-xs {
            font-size: 11px;
          }
          .text-sm {
            font-size: 13px;
          }
          .text-base {
            font-size: 15px;
          }
          .text-lg {
            font-size: 17px;
          }
          .text-xl {
            font-size: 19px;
          }

          /* Container padding */
          .container-padding {
            padding-left: 12px;
            padding-right: 12px;
          }
        }

        /* Prevent horizontal overflow */
        .prevent-overflow {
          overflow-x: hidden;
          max-width: 100%;
        }

        /* Ensure content doesn't exceed screen width */
        .max-w-screen {
          max-width: 100vw;
        }

        /* Fix for horizontal scroll on mobile */
        body,
        html {
          overflow-x: hidden;
        }
      `}</style>
    </div>
  )
}

export default TeamsSales
