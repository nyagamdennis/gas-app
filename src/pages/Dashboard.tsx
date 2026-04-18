// @ts-nocheck
import { useMediaQuery, useTheme } from "@mui/material"
import React, { useEffect, useState, useCallback } from "react"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { useNavigate } from "react-router-dom"
import planStatus from "../features/planStatus/planStatus"
import Navbar from "../components/ui/mobile/admin/Navbar"
import Slider from "react-slick"
import CurrencyConvert from "../components/CurrencyConvert"
import TrendingUpIcon from "@mui/icons-material/TrendingUp"
import TrendingDownIcon from "@mui/icons-material/TrendingDown"
import { GiExpense, GiProfit } from "react-icons/gi"
import { FcDebt } from "react-icons/fc"
import {
  FaDollarSign,
  FaUsers,
  FaShoppingCart,
  FaBoxes,
  FaChartLine,
  FaChartPie,
  FaChartBar,
} from "react-icons/fa"
import {
  MdAttachMoney,
  MdTrendingUp,
  MdTrendingDown,
  MdMoreHoriz,
} from "react-icons/md"
import { PiChartLineUpFill } from "react-icons/pi"
import { RiExchangeDollarFill } from "react-icons/ri"
import Box from "@mui/material/Box"
import AdminsFooter from "../components/AdminsFooter"
import computeDayOverDayDebtChange from "../utils/debtUtils"
import {
  fetchDebtors,
  selectAllDebtors,
} from "../features/debtors/debtorsSlice"
import { IoTrendingDown } from "react-icons/io5"
import {
  fetchAllExpenses,
  fetchExpenses,
  selectAllExpenses,
} from "../features/expenses/expensesSlice"
import {
  fetchAnalysis,
  selectAllAnalysis,
} from "../features/analysis/analysisSlice"
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Chip,
  Avatar,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Drawer,
  Menu,
  MenuItem,
  Fab,
  useScrollTrigger,
  Zoom,
  CircularProgress,
  Alert,
} from "@mui/material"
import {
  blue,
  green,
  red,
  orange,
  purple,
  deepPurple,
  cyan,
} from "@mui/material/colors"
import {
  TrendingUp,
  TrendingDown,
  People,
  Inventory,
  LocalShipping,
  Store,
  ShowChart,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  Assessment,
  MonetizationOn,
  Paid,
  Receipt,
  FilterList,
  Refresh,
  Download,
  Menu as MenuIcon,
  KeyboardArrowUp,
} from "@mui/icons-material"
import RealTimeIndicator from "../components/sales/RealTimeIndicator"
import api from "../../utils/api"

// Recharts imports
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip as PieTooltip,
} from "recharts"

// Custom responsive hook
const useResponsive = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"))
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"))

  return { isMobile, isTablet, isDesktop }
}

// Scroll to top component
function ScrollTop(props) {
  const { children } = props
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  })

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      "#back-to-top-anchor",
    )
    if (anchor) {
      anchor.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    }
  }

  return (
    <Zoom in={trigger}>
      <div
        onClick={handleClick}
        role="presentation"
        style={{ position: "fixed", bottom: 80, right: 16, zIndex: 1000 }}
      >
        {children}
      </div>
    </Zoom>
  )
}

const Dashboard = () => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { isMobile, isTablet, isDesktop } = useResponsive()
  const { isPro, isTrial, isExpired } = planStatus()

  // State for API data
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statsData, setStatsData] = useState(null)
  const [timeRange, setTimeRange] = useState("week") // daily, week, month, year
  const [teamFilter, setTeamFilter] = useState({ type: null, id: null })

  // Advanced Features
  const [batchMode, setBatchMode] = useState(false)
  const [selectedBatchItems, setSelectedBatchItems] = useState([])
  const [lastUpdated, setLastUpdated] = useState(null)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [realTimeEnabled, setRealTimeEnabled] = useState(false)
  const [dataVersion, setDataVersion] = useState(0)

  const [menuAnchor, setMenuAnchor] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activeView, setActiveView] = useState("overview")

  // Derived values from API data
  const totalRevenue = statsData?.revenue?.total || 0
  const totalExpenses = statsData?.expenses?.total || 0
  const totalProfit = statsData?.profit?.net || 0
  const profitMargin =
    totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : 0

  const retailRevenue = statsData?.revenue?.retail || 0
  const wholesaleRevenue = statsData?.revenue?.wholesale || 0
  const refillRevenue = statsData?.cylinder_sales?.refill || 0
  const completeRevenue = statsData?.cylinder_sales?.complete || 0

  const averageSale = statsData?.revenue?.average_sale || 0
  const totalOutstandingDebt = statsData?.debt_analysis?.total_outstanding || 0
  const totalOverdueDebt = statsData?.debt_analysis?.total_overdue || 0
  const totalCollectedDebt =
    statsData?.debt_analysis?.total_collected_lifetime || 0

  // For chart data (by date)
  const revenueByDate = statsData?.revenue?.by_date || []
  const expensesByDate = statsData?.expenses?.by_date || []
  const chartLabels = revenueByDate.map((item) =>
    new Date(item.period).toLocaleDateString(undefined, { weekday: "short" }),
  )
  const revenueChartData = revenueByDate.map((item) => item.total)
  const expenseChartData = expensesByDate.map((item) => item.total)

  // Prepare data for recharts
  const lineChartData = revenueByDate.map((item, index) => ({
    period: chartLabels[index] || new Date(item.period).toLocaleDateString(),
    revenue: item.total,
    expenses: expensesByDate[index]?.total || 0,
  }))

  const totalSalesValue = retailRevenue + wholesaleRevenue
  const salesDistribution = [
    { name: "Retail", value: retailRevenue, color: blue[500] },
    { name: "Wholesale", value: wholesaleRevenue, color: green[500] },
  ].filter((item) => item.value > 0)

  // Mock data (keep as is)
  const topProducts = [
    { name: "Gas Cylinder 15kg", sales: 245, revenue: 1225000, growth: 12.5 },
    { name: "Cooking Gas 6kg", sales: 189, revenue: 567000, growth: 8.2 },
    { name: "Industrial Gas", sales: 134, revenue: 4020000, growth: 15.7 },
    { name: "Medical Oxygen", sales: 98, revenue: 2940000, growth: 5.3 },
    { name: "CO2 Cylinder", sales: 76, revenue: 1520000, growth: -2.1 },
  ]

  const recentTransactions = [
    {
      id: 1,
      customer: "John Doe",
      amount: 50000,
      type: "Sale",
      date: "2024-01-15",
      status: "Completed",
    },
    {
      id: 2,
      customer: "Jane Smith",
      amount: 75000,
      type: "Sale",
      date: "2024-01-14",
      status: "Completed",
    },
    {
      id: 3,
      customer: "ABC Restaurant",
      amount: 250000,
      type: "Wholesale",
      date: "2024-01-14",
      status: "Pending",
    },
    {
      id: 4,
      customer: "XYZ Hospital",
      amount: 180000,
      type: "Sale",
      date: "2024-01-13",
      status: "Completed",
    },
    {
      id: 5,
      customer: "Mike Johnson",
      amount: 35000,
      type: "Refill",
      date: "2024-01-13",
      status: "Completed",
    },
  ]

  const salesTeamPerformance = [
    { name: "Team A", target: 1000000, achieved: 850000, efficiency: 85 },
    { name: "Team B", target: 800000, achieved: 720000, efficiency: 90 },
    { name: "Team C", target: 1200000, achieved: 950000, efficiency: 79 },
    { name: "Team D", target: 900000, achieved: 810000, efficiency: 90 },
  ]

  // Fetch dashboard statistics from API
  const fetchDashboardStats = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = { period: timeRange }
      if (teamFilter.type && teamFilter.id) {
        params.team_type = teamFilter.type
        params.team_id = teamFilter.id
      }
      const response = await api.get("/dashbaord/dashboard/stats/", { params })
      setStatsData(response.data)
      setLastUpdated(new Date().toLocaleTimeString())
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err)
      setError(err.response?.data?.detail || "Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }, [timeRange, teamFilter])

  useEffect(() => {
    fetchDashboardStats()
  }, [fetchDashboardStats])

  useEffect(() => {
    if (!autoRefresh) return
    const interval = setInterval(() => {
      fetchDashboardStats()
    }, 30000)
    return () => clearInterval(interval)
  }, [autoRefresh, fetchDashboardStats])

  const uncleared_debtors = []
  const debtChange = computeDayOverDayDebtChange(uncleared_debtors)
  const completionRate =
    recentTransactions.length > 0
      ? (recentTransactions.filter((t) => t.status === "Completed").length /
          recentTransactions.length) *
        100
      : 0

  // Stat Card Component (unchanged)
  const StatCard = ({
    title,
    value,
    icon,
    color,
    change,
    subtitle,
    onClick,
    isCurrency = true,
  }) => (
    <Paper
      elevation={2}
      className="p-3 rounded-xl transition-all active:scale-[0.98] touch-manipulation"
      onClick={onClick}
      sx={{
        cursor: onClick ? "pointer" : "default",
        "&:active": {
          transform: "scale(0.98)",
        },
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Typography
            variant="caption"
            color="text.secondary"
            className="font-medium block mb-1"
          >
            {title}
          </Typography>
          <Typography variant="h6" className="font-bold truncate">
            {isCurrency ? <CurrencyConvert price={value} /> : value}
          </Typography>
          {change !== undefined && (
            <div className="flex items-center mt-2">
              {change > 0 ? (
                <TrendingUp className="text-green-500 mr-1" fontSize="small" />
              ) : (
                <TrendingDown className="text-red-500 mr-1" fontSize="small" />
              )}
              <Typography
                variant="caption"
                className={`font-medium ${
                  change > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {change > 0 ? "+" : ""}
                {change}%
              </Typography>
              {subtitle && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  className="ml-2 truncate"
                >
                  {subtitle}
                </Typography>
              )}
            </div>
          )}
        </div>
        <Avatar
          sx={{
            bgcolor: `${color}15`,
            color: color,
            width: isMobile ? 36 : 44,
            height: isMobile ? 36 : 44,
          }}
        >
          {icon}
        </Avatar>
      </div>
    </Paper>
  )

  // Mobile Navigation Tabs (unchanged)
  const MobileNavTabs = () => (
    <div className="sticky top-0 z-10 bg-white border-b">
      <div className="flex overflow-x-auto scrollbar-hide">
        {["overview", "financial", "products", "teams"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveView(tab)}
            className={`flex-shrink-0 px-4 py-3 text-sm font-medium transition-colors ${
              activeView === tab
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-blue-500"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
    </div>
  )

  // Floating Action Button Menu (unchanged)
  const FloatingMenu = () => {
    const [anchorEl, setAnchorEl] = useState(null)

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
      setAnchorEl(null)
    }

    const actions = [
      {
        icon: <Refresh />,
        label: "Refresh Data",
        action: () => fetchDashboardStats(),
      },
      { icon: <Download />, label: "Export Report", action: () => {} },
      { icon: <FilterList />, label: "Filter View", action: () => {} },
    ]

    return (
      <>
        <Fab
          color="primary"
          aria-label="add"
          onClick={handleClick}
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            zIndex: 1000,
          }}
        >
          <MenuIcon />
        </Fab>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        >
          {actions.map((action) => (
            <MenuItem
              key={action.label}
              onClick={() => {
                action.action()
                handleClose()
              }}
            >
              <ListItemIcon>{action.icon}</ListItemIcon>
              <ListItemText>{action.label}</ListItemText>
            </MenuItem>
          ))}
        </Menu>
      </>
    )
  }

  // Slider settings (unchanged)
  const mobileSliderSettings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1.2,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "20px",
  }

  const tabletSliderSettings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2.2,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "20px",
  }

  const desktopSliderSettings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
  }

  const getSliderSettings = () => {
    if (isMobile) return mobileSliderSettings
    if (isTablet) return tabletSliderSettings
    return desktopSliderSettings
  }

  // Render content based on active view (mobile)
  const renderMobileContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-20">
          <CircularProgress />
        </div>
      )
    }
    if (error) {
      return (
        <Alert severity="error" className="m-4">
          {error}
        </Alert>
      )
    }

    switch (activeView) {
      case "financial":
        return (
          <>
            {/* Financial Trends Line Chart */}
            <Paper elevation={2} className="p-4 rounded-2xl mb-4">
              <Typography
                variant="h6"
                className="font-bold mb-4 flex items-center"
              >
                <FaChartLine className="mr-2 text-blue-500" />
                Financial Trends
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={(value) => `KSh ${value / 1000}k`} />
                  <ReTooltip
                    formatter={(value) => `KSh ${value.toLocaleString()}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke={green[500]}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke={red[500]}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Paper>

            {/* Pie Chart - Sales Breakdown */}
            <Paper elevation={2} className="p-4 rounded-2xl">
              <Typography
                variant="h6"
                className="font-bold mb-2 flex items-center"
              >
                <FaChartPie className="mr-2 text-green-500" />
                Sales Breakdown
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                className="block mb-4 text-center"
              >
                Total Sales: <CurrencyConvert price={totalSalesValue} />
              </Typography>
              <ResponsiveContainer width="100%" height={280}>
                <RePieChart>
                  <Pie
                    data={salesDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(1)}%`
                    }
                    labelLine={false}
                  >
                    {salesDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <PieTooltip
                    formatter={(value) => `KSh ${value.toLocaleString()}`}
                  />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    formatter={(value, entry, index) => {
                      const item = salesDistribution[index]
                      const percent = (
                        (item.value / totalSalesValue) *
                        100
                      ).toFixed(1)
                      return `${
                        item.name
                      } (${percent}%) – KSh ${item.value.toLocaleString()}`
                    }}
                  />
                </RePieChart>
              </ResponsiveContainer>
            </Paper>
          </>
        )

      case "products":
        return (
          <Paper elevation={2} className="p-4 rounded-2xl">
            <Typography
              variant="h6"
              className="font-bold mb-4 flex items-center"
            >
              <Inventory className="mr-2 text-blue-500" />
              Top Products
            </Typography>
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <Avatar
                        sx={{
                          bgcolor: blue[100],
                          color: blue[600],
                          width: 32,
                          height: 32,
                          fontSize: "0.875rem",
                        }}
                      >
                        {index + 1}
                      </Avatar>
                      <Typography variant="body1" className="font-medium">
                        {product.name}
                      </Typography>
                    </div>
                    <Chip
                      label={`${product.growth > 0 ? "+" : ""}${
                        product.growth
                      }%`}
                      size="small"
                      color={product.growth > 0 ? "success" : "error"}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 pl-10">
                    <span>{product.sales} units</span>
                    <span className="font-semibold">
                      <CurrencyConvert price={product.revenue} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Paper>
        )

      case "teams":
        return (
          <Paper elevation={2} className="p-4 rounded-2xl">
            <Typography
              variant="h6"
              className="font-bold mb-4 flex items-center"
            >
              <People className="mr-2 text-green-500" />
              Team Performance
            </Typography>
            <div className="space-y-5">
              {salesTeamPerformance.map((team, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <Typography variant="body1" className="font-bold">
                      {team.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      className="font-bold text-green-600"
                    >
                      {team.efficiency}%
                    </Typography>
                  </div>
                  <LinearProgress
                    variant="determinate"
                    value={team.efficiency}
                    color={
                      team.efficiency > 85
                        ? "success"
                        : team.efficiency > 70
                        ? "warning"
                        : "error"
                    }
                    className="h-2 rounded-full mb-2"
                  />
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>
                      Target: <CurrencyConvert price={team.target} />
                    </span>
                    <span>
                      Achieved: <CurrencyConvert price={team.achieved} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Paper>
        )

      default: // overview
        return (
          <>
            {/* Time Range Selector - Mobile Optimized */}
            <div className="mb-4">
              <div className="flex overflow-x-auto scrollbar-hide pb-2">
                {["day", "week", "month", "year"].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`flex-shrink-0 px-4 py-2 mx-1 text-sm font-medium rounded-full transition-colors ${
                      timeRange === range
                        ? "bg-blue-500 text-white shadow"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {range.charAt(0).toUpperCase() + range.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* KPI Cards Slider */}
            <div className="mb-6">
              <Slider {...getSliderSettings()}>
                {[
                  {
                    title: "Revenue",
                    value: totalRevenue,
                    icon: <FaDollarSign />,
                    color: green[600],
                    change: 12.5,
                    subtitle: "vs last period",
                  },
                  {
                    title: "Profit",
                    value: totalProfit,
                    icon: <GiProfit />,
                    color: blue[600],
                    change: 10.5,
                    subtitle: "vs last period",
                  },
                  {
                    title: "Expenses",
                    value: totalExpenses,
                    icon: <GiExpense />,
                    color: red[600],
                    change: -5.2,
                    subtitle: "vs last period",
                  },
                  {
                    title: "Outstanding Debt",
                    value: totalOutstandingDebt,
                    icon: <FcDebt />,
                    color: orange[600],
                    change: debtChange.changePercent || 0,
                    subtitle: "vs yesterday",
                  },
                  {
                    title: "Margin",
                    value: profitMargin,
                    icon: <PiChartLineUpFill />,
                    color: purple[600],
                    subtitle: `${profitMargin}%`,
                    isCurrency: false,
                  },
                  {
                    title: "Avg. Sale",
                    value: averageSale,
                    icon: <RiExchangeDollarFill />,
                    color: deepPurple[600],
                    subtitle: "per transaction",
                  },
                ].map((stat, index) => (
                  <div key={index} className="px-1">
                    <StatCard {...stat} />
                  </div>
                ))}
              </Slider>
            </div>

            {/* Quick Stats Grid */}
            <Grid container spacing={2} className="mb-6">
              <Grid item xs={6}>
                <Paper elevation={2} className="p-3 rounded-xl text-center">
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    className="block"
                  >
                    Completion Rate
                  </Typography>
                  <Typography variant="h5" className="font-bold my-2">
                    {completionRate.toFixed(0)}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={completionRate}
                    color="success"
                    className="h-1 rounded-full"
                  />
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper elevation={2} className="p-3 rounded-xl text-center">
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    className="block"
                  >
                    Active Debtors
                  </Typography>
                  <Typography variant="h5" className="font-bold my-2">
                    {uncleared_debtors.length}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Total: <CurrencyConvert price={totalOutstandingDebt} />
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Performance Overview Line Chart */}
            <Paper elevation={2} className="p-4 rounded-2xl mb-6">
              <Typography
                variant="h6"
                className="font-bold mb-4 flex items-center"
              >
                <ShowChart className="mr-2 text-blue-500" />
                Performance Overview
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={(value) => `KSh ${value / 1000}k`} />
                  <ReTooltip
                    formatter={(value) => `KSh ${value.toLocaleString()}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke={green[500]}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke={red[500]}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Paper>

            {/* Recent Transactions - Mobile Optimized */}
            <Paper elevation={2} className="p-4 rounded-2xl mb-6">
              <div className="flex justify-between items-center mb-4">
                <Typography
                  variant="h6"
                  className="font-bold flex items-center"
                >
                  <Receipt className="mr-2 text-purple-500" />
                  Recent Transactions
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => navigate("/transactions")}
                >
                  <MdMoreHoriz />
                </IconButton>
              </div>
              <div className="space-y-3">
                {recentTransactions.slice(0, 3).map((transaction) => (
                  <div
                    key={transaction.id}
                    className="bg-gray-50 p-4 rounded-xl border border-gray-100"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <Typography variant="subtitle1" className="font-bold">
                          {transaction.customer}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {transaction.date} • {transaction.type}
                        </Typography>
                      </div>
                      <div className="text-right">
                        <Typography
                          variant="subtitle1"
                          className="font-bold text-blue-600"
                        >
                          <CurrencyConvert price={transaction.amount} />
                        </Typography>
                        <Chip
                          label={transaction.status}
                          size="small"
                          color={
                            transaction.status === "Completed"
                              ? "success"
                              : "warning"
                          }
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Paper>
          </>
        )
    }
  }

  // Desktop/Tablet View
  const renderDesktopView = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-96">
          <CircularProgress size={60} />
        </div>
      )
    }
    if (error) {
      return <Alert severity="error">{error}</Alert>
    }

    return (
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="mb-6">
          <Typography variant="h4" className="font-bold text-gray-800 mb-2">
            Dashboard Overview
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back! Here's what's happening with your business.
          </Typography>
        </div>

        {/* Time Range Selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          {["day", "week", "month", "year"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                timeRange === range
                  ? "bg-blue-500 text-white shadow"
                  : "bg-white text-gray-600 hover:bg-gray-100 border"
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>

        {/* KPI Grid */}
        <Grid container spacing={2} className="mb-6">
          {[
            {
              title: "Total Revenue",
              value: totalRevenue,
              icon: <FaDollarSign />,
              color: green[600],
              change: 12.5,
              subtitle: "vs last period",
              cols: { xs: 12, sm: 6, md: 4, lg: 2 },
            },
            {
              title: "Total Profit",
              value: totalProfit,
              icon: <GiProfit />,
              color: blue[600],
              change: 10.5,
              subtitle: "vs last period",
              cols: { xs: 12, sm: 6, md: 4, lg: 2 },
            },
            {
              title: "Total Expenses",
              value: totalExpenses,
              icon: <GiExpense />,
              color: red[600],
              change: -5.2,
              subtitle: "vs last period",
              cols: { xs: 12, sm: 6, md: 4, lg: 2 },
            },
            {
              title: "Outstanding Debt",
              value: totalOutstandingDebt,
              icon: <FcDebt />,
              color: orange[600],
              change: debtChange.changePercent || 0,
              subtitle: "vs yesterday",
              cols: { xs: 12, sm: 6, md: 4, lg: 2 },
            },
            {
              title: "Profit Margin",
              value: profitMargin,
              icon: <PiChartLineUpFill />,
              color: purple[600],
              subtitle: `${profitMargin}%`,
              isCurrency: false,
              cols: { xs: 12, sm: 6, md: 4, lg: 2 },
            },
            {
              title: "Avg. Transaction",
              value: averageSale,
              icon: <RiExchangeDollarFill />,
              color: deepPurple[600],
              subtitle: "per sale",
              cols: { xs: 12, sm: 6, md: 4, lg: 2 },
            },
          ].map((stat, index) => (
            <Grid item {...stat.cols} key={index}>
              <StatCard {...stat} />
            </Grid>
          ))}
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3} className="mb-6">
          <Grid item xs={12} lg={8}>
            <Paper elevation={2} className="p-4 rounded-2xl h-full">
              <Typography
                variant="h6"
                className="font-bold mb-4 flex items-center"
              >
                <ShowChart className="mr-2 text-blue-500" />
                Financial Performance
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis tickFormatter={(value) => `KSh ${value / 1000}k`} />
                  <ReTooltip
                    formatter={(value) => `KSh ${value.toLocaleString()}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke={green[500]}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke={red[500]}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Paper elevation={2} className="p-4 rounded-2xl h-full">
              <Typography
                variant="h6"
                className="font-bold mb-2 flex items-center"
              >
                <PieChartIcon className="mr-2 text-green-500" />
                Sales Breakdown
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                className="mb-4 text-center"
              >
                Total Sales: <CurrencyConvert price={totalSalesValue} />
              </Typography>
              <ResponsiveContainer width="100%" height={320}>
                <RePieChart>
                  <Pie
                    data={salesDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(1)}%`
                    }
                    labelLine={true}
                  >
                    {salesDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <PieTooltip
                    formatter={(value) => `KSh ${value.toLocaleString()}`}
                  />
                  <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    formatter={(value, entry, index) => {
                      const item = salesDistribution[index]
                      const percent = (
                        (item.value / totalSalesValue) *
                        100
                      ).toFixed(1)
                      return `${
                        item.name
                      } – ${percent}% (KSh ${item.value.toLocaleString()})`
                    }}
                  />
                </RePieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>

        {/* Bottom Section (unchanged) */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} className="p-4 rounded-2xl h-full">
              <Typography
                variant="h6"
                className="font-bold mb-4 flex items-center"
              >
                <Inventory className="mr-2 text-blue-500" />
                Top Products
              </Typography>
              <List>
                {topProducts.map((product, index) => (
                  <div key={index}>
                    <ListItem className="px-0 py-3">
                      <ListItemIcon>
                        <Avatar
                          sx={{
                            bgcolor: blue[100],
                            color: blue[600],
                            width: 36,
                            height: 36,
                          }}
                        >
                          {index + 1}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body2" className="font-medium">
                            {product.name}
                          </Typography>
                        }
                        secondary={
                          <div className="flex justify-between items-center mt-1">
                            <div>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {product.sales} units
                              </Typography>
                              <Typography
                                variant="caption"
                                className="ml-2"
                                color="text.secondary"
                              >
                                • <CurrencyConvert price={product.revenue} />
                              </Typography>
                            </div>
                            <Chip
                              label={`${product.growth > 0 ? "+" : ""}${
                                product.growth
                              }%`}
                              size="small"
                              color={product.growth > 0 ? "success" : "error"}
                            />
                          </div>
                        }
                      />
                    </ListItem>
                    {index < topProducts.length - 1 && <Divider />}
                  </div>
                ))}
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={2} className="p-4 rounded-2xl h-full">
              <div className="flex justify-between items-center mb-4">
                <Typography
                  variant="h6"
                  className="font-bold flex items-center"
                >
                  <Receipt className="mr-2 text-purple-500" />
                  Recent Transactions
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => navigate("/transactions")}
                >
                  <MdMoreHoriz />
                </IconButton>
              </div>
              <List>
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id}>
                    <ListItem className="px-0 py-2">
                      <ListItemIcon>
                        <Avatar
                          sx={{
                            bgcolor:
                              transaction.type === "Sale"
                                ? green[100]
                                : transaction.type === "Wholesale"
                                ? blue[100]
                                : orange[100],
                            color:
                              transaction.type === "Sale"
                                ? green[600]
                                : transaction.type === "Wholesale"
                                ? blue[600]
                                : orange[600],
                            width: 32,
                            height: 32,
                          }}
                        >
                          {transaction.type.charAt(0)}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body2" className="font-medium">
                            {transaction.customer}
                          </Typography>
                        }
                        secondary={
                          <div className="flex justify-between">
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {transaction.date}
                            </Typography>
                            <Typography
                              variant="caption"
                              className="font-medium"
                            >
                              <CurrencyConvert price={transaction.amount} />
                            </Typography>
                          </div>
                        }
                      />
                      <Chip
                        label={transaction.status}
                        size="small"
                        color={
                          transaction.status === "Completed"
                            ? "success"
                            : "warning"
                        }
                      />
                    </ListItem>
                    <Divider />
                  </div>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 touch-manipulation">
      <div id="back-to-top-anchor" />
      <div className="prevent-overflow">
        <RealTimeIndicator
          enabled={autoRefresh}
          lastUpdated={lastUpdated}
          dataVersion={dataVersion}
          onToggle={() => setAutoRefresh(!autoRefresh)}
        />
      </div>
      <Navbar
        headerMessage={"ERP Dashboard"}
        headerText={"Real-time insights for your business"}
      />
      {isMobile ? (
        <>
          <MobileNavTabs />
          <main className="m-2 p-1 pb-20">{renderMobileContent()}</main>
        </>
      ) : (
        renderDesktopView()
      )}
      {isMobile && <FloatingMenu />}
      <ScrollTop>
        <Fab color="primary" size="small" aria-label="scroll back to top">
          <KeyboardArrowUp />
        </Fab>
      </ScrollTop>
      <footer className="mt-8">
        <AdminsFooter />
      </footer>
    </div>
  )
}

export default Dashboard
