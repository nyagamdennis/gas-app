// @ts-nocheck
import { useMediaQuery, useTheme } from "@mui/material"
import React, { useEffect, useState } from "react"
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
import { LineChart } from "@mui/x-charts/LineChart"
import { PieChart } from "@mui/x-charts/PieChart"
import { BarChart } from "@mui/x-charts/BarChart"
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
  const analysis_data = useAppSelector(selectAllAnalysis)
  const all_debtors = analysis_data?.debtors || []
  const debtors_count = all_debtors.length
  const [timeRange, setTimeRange] = useState("daily")
  const [menuAnchor, setMenuAnchor] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activeView, setActiveView] = useState("overview") // overview, financial, products, teams

  const all_expenses = analysis_data?.expenses || []
  const total_expenses = analysis_data?.sales_summary?.total_expenses || 0
  const total_revenue = analysis_data?.sales_summary?.total_revenue || 0
  const total_profit = total_revenue - total_expenses
  const profit_margin =
    total_revenue > 0 ? ((total_profit / total_revenue) * 100).toFixed(1) : 0

  // Mock data
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

  useEffect(() => {
    dispatch(fetchAnalysis())
  }, [dispatch])

  // Mobile slider settings
  const mobileSliderSettings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1.2,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "20px",
    responsive: [
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1.1,
          centerPadding: "10px",
        },
      },
    ],
  }

  // Tablet slider settings
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

  // Desktop slider settings
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

  // Chart data
  const revenueData = [4000, 3000, 2000, 2780, 1890, 2390, 3490]
  const expenseData = [2400, 1398, 9800, 3908, 4800, 3800, 4300]
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  const salesDistribution = [
    { label: "Retail", value: 72.72, color: blue[500] },
    { label: "Wholesale", value: 16.38, color: green[500] },
    { label: "Refill", value: 3.83, color: orange[500] },
    { label: "Industrial", value: 2.42, color: purple[500] },
    { label: "Other", value: 4.65, color: deepPurple[500] },
  ]

  const uncleared_debtors = all_debtors.filter(
    (debtor) => debtor.cleared === false,
  )
  const total_debt = uncleared_debtors.reduce((total, debtor) => {
    const amt = Number(debtor.amount) || 0
    return total + amt
  }, 0)

  const debtChange = computeDayOverDayDebtChange(uncleared_debtors)
  const averageTransactionValue =
    recentTransactions.length > 0
      ? recentTransactions.reduce((sum, t) => sum + t.amount, 0) /
        recentTransactions.length
      : 0

  const completionRate =
    recentTransactions.length > 0
      ? (recentTransactions.filter((t) => t.status === "Completed").length /
          recentTransactions.length) *
        100
      : 0

  // Stat Card Component
  const StatCard = ({
    title,
    value,
    icon,
    color,
    change,
    subtitle,
    onClick,
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
            <CurrencyConvert price={value} />
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

  // Mobile Navigation Tabs
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

  // Floating Action Button Menu
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
        action: () => dispatch(fetchAnalysis()),
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

  // Render content based on active view (mobile)
  const renderMobileContent = () => {
    switch (activeView) {
      case "financial":
        return (
          <>
            <Paper elevation={2} className="p-4 rounded-2xl mb-4">
              <Typography
                variant="h6"
                className="font-bold mb-4 flex items-center"
              >
                <FaChartLine className="mr-2 text-blue-500" />
                Financial Trends
              </Typography>
              <Box sx={{ width: "100%", height: 250 }}>
                <LineChart
                  series={[
                    {
                      data: revenueData,
                      label: "Revenue",
                      color: green[500],
                      curve: "natural",
                    },
                  ]}
                  xAxis={[
                    {
                      scaleType: "point",
                      data: days,
                    },
                  ]}
                  height={220}
                  margin={{ top: 10, bottom: 20, left: 30, right: 10 }}
                />
              </Box>
            </Paper>

            <Paper elevation={2} className="p-4 rounded-2xl">
              <Typography
                variant="h6"
                className="font-bold mb-4 flex items-center"
              >
                <FaChartPie className="mr-2 text-green-500" />
                Expense Breakdown
              </Typography>
              <div className="flex justify-center">
                <PieChart
                  series={[
                    {
                      data: salesDistribution,
                      innerRadius: 30,
                      outerRadius: 80,
                    },
                  ]}
                  height={220}
                  width={300}
                />
              </div>
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
                        <Typography
                          variant="body2"
                          className="font-medium truncate"
                        >
                          {product.name}
                        </Typography>
                      }
                      secondary={
                        <div className="flex justify-between items-center mt-1">
                          <Typography variant="caption" color="text.secondary">
                            {product.sales} units
                          </Typography>
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
            {salesTeamPerformance.map((team, index) => (
              <div key={index} className="mb-4 last:mb-0">
                <div className="flex justify-between items-center mb-1">
                  <Typography variant="body2" className="font-medium">
                    {team.name}
                  </Typography>
                  <Typography variant="body2" className="font-bold">
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
                  className="h-2 rounded-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>
                    Target: <CurrencyConvert price={team.target} />
                  </span>
                  <span>
                    Achieved: <CurrencyConvert price={team.achieved} />
                  </span>
                </div>
              </div>
            ))}
          </Paper>
        )

      default: // overview
        return (
          <>
            {/* Time Range Selector - Mobile Optimized */}
            <div className="mb-4">
              <div className="flex overflow-x-auto scrollbar-hide pb-2">
                {["Today", "Week", "Month", "Quarter", "Year"].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range.toLowerCase())}
                    className={`flex-shrink-0 px-4 py-2 mx-1 text-sm font-medium rounded-full transition-colors ${
                      timeRange === range.toLowerCase()
                        ? "bg-blue-500 text-white shadow"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {range}
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
                    value: total_revenue,
                    icon: <FaDollarSign />,
                    color: green[600],
                    change: 12.5,
                    subtitle: "vs last period",
                  },
                  {
                    title: "Profit",
                    value: total_profit,
                    icon: <GiProfit />,
                    color: blue[600],
                    change: 10.5,
                    subtitle: "vs last period",
                  },
                  {
                    title: "Expenses",
                    value: total_expenses,
                    icon: <GiExpense />,
                    color: red[600],
                    change: -5.2,
                    subtitle: "vs last period",
                  },
                  {
                    title: "Debt",
                    value: total_debt,
                    icon: <FcDebt />,
                    color: orange[600],
                    change: debtChange.changePercent || 0,
                    subtitle: "vs yesterday",
                  },
                  {
                    title: "Margin",
                    value: profit_margin,
                    icon: <PiChartLineUpFill />,
                    color: purple[600],
                    subtitle: `${profit_margin}%`,
                  },
                  {
                    title: "Avg. Sale",
                    value: averageTransactionValue,
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
                    Total: <CurrencyConvert price={total_debt} />
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Main Chart */}
            <Paper elevation={2} className="p-4 rounded-2xl mb-6">
              <Typography
                variant="h6"
                className="font-bold mb-4 flex items-center"
              >
                <ShowChart className="mr-2 text-blue-500" />
                Performance Overview
              </Typography>
              <Box sx={{ width: "100%", height: 250 }}>
                <LineChart
                  series={[
                    {
                      data: revenueData,
                      label: "Revenue",
                      color: green[500],
                      curve: "natural",
                    },
                    {
                      data: expenseData,
                      label: "Expenses",
                      color: red[500],
                      curve: "natural",
                    },
                  ]}
                  xAxis={[
                    {
                      scaleType: "point",
                      data: days,
                    },
                  ]}
                  height={220}
                  margin={{ top: 10, bottom: 20, left: 30, right: 10 }}
                />
              </Box>
            </Paper>

            {/* Recent Transactions */}
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
              <List className="space-y-2">
                {recentTransactions.slice(0, 3).map((transaction) => (
                  <Paper
                    key={transaction.id}
                    elevation={0}
                    className="p-3 rounded-lg bg-gray-50"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <Typography variant="body2" className="font-medium">
                          {transaction.customer}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {transaction.date} • {transaction.type}
                        </Typography>
                      </div>
                      <div className="text-right">
                        <Typography variant="body2" className="font-bold">
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
                  </Paper>
                ))}
              </List>
            </Paper>
          </>
        )
    }
  }

  // Desktop/Tablet View
  const renderDesktopView = () => (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <Typography variant="h4" className="font-bold text-gray-800 mb-2">
          Dashboard Overview
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back! Here's what's happening with your business today.
        </Typography>
      </div>

      {/* Time Range Selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["Today", "Week", "Month", "Quarter", "Year"].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range.toLowerCase())}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
              timeRange === range.toLowerCase()
                ? "bg-blue-500 text-white shadow"
                : "bg-white text-gray-600 hover:bg-gray-100 border"
            }`}
          >
            {range}
          </button>
        ))}
      </div>

      {/* KPI Grid */}
      <Grid container spacing={2} className="mb-6">
        {[
          {
            title: "Total Revenue",
            value: total_revenue,
            icon: <FaDollarSign />,
            color: green[600],
            change: 12.5,
            subtitle: "vs last period",
            cols: { xs: 12, sm: 6, md: 4, lg: 2 },
          },
          {
            title: "Total Profit",
            value: total_profit,
            icon: <GiProfit />,
            color: blue[600],
            change: 10.5,
            subtitle: "vs last period",
            cols: { xs: 12, sm: 6, md: 4, lg: 2 },
          },
          {
            title: "Total Expenses",
            value: total_expenses,
            icon: <GiExpense />,
            color: red[600],
            change: -5.2,
            subtitle: "vs last period",
            cols: { xs: 12, sm: 6, md: 4, lg: 2 },
          },
          {
            title: "Total Debt",
            value: total_debt,
            icon: <FcDebt />,
            color: orange[600],
            change: debtChange.changePercent || 0,
            subtitle: "vs yesterday",
            cols: { xs: 12, sm: 6, md: 4, lg: 2 },
          },
          {
            title: "Profit Margin",
            value: profit_margin,
            icon: <PiChartLineUpFill />,
            color: purple[600],
            subtitle: `${profit_margin}%`,
            cols: { xs: 12, sm: 6, md: 4, lg: 2 },
          },
          {
            title: "Avg. Transaction",
            value: averageTransactionValue,
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
            <Box sx={{ width: "100%", height: 300 }}>
              <LineChart
                series={[
                  {
                    data: revenueData,
                    label: "Revenue",
                    color: green[500],
                    curve: "natural",
                    area: true,
                  },
                  {
                    data: expenseData,
                    label: "Expenses",
                    color: red[500],
                    curve: "natural",
                    area: true,
                  },
                ]}
                xAxis={[
                  {
                    scaleType: "point",
                    data: days,
                    label: "Days",
                  },
                ]}
                yAxis={[
                  {
                    label: "Amount (K)",
                    width: 60,
                  },
                ]}
                height={260}
                margin={{ top: 20, bottom: 40, left: 60, right: 20 }}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper elevation={2} className="p-4 rounded-2xl h-full">
            <Typography
              variant="h6"
              className="font-bold mb-4 flex items-center"
            >
              <PieChartIcon className="mr-2 text-green-500" />
              Sales Distribution
            </Typography>
            <div className="flex justify-center">
              <PieChart
                series={[
                  {
                    data: salesDistribution,
                    innerRadius: 40,
                    outerRadius: 100,
                    paddingAngle: 2,
                    cornerRadius: 4,
                  },
                ]}
                height={260}
                width={isTablet ? 300 : 350}
              />
            </div>
          </Paper>
        </Grid>
      </Grid>

      {/* Bottom Section */}
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
              <Typography variant="h6" className="font-bold flex items-center">
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
                          <Typography variant="caption" color="text.secondary">
                            {transaction.date}
                          </Typography>
                          <Typography variant="caption" className="font-medium">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 touch-manipulation">
      {/* Back to top anchor */}
      <div id="back-to-top-anchor" />

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

      {/* Floating Action Button for Mobile */}
      {isMobile && <FloatingMenu />}

      {/* Scroll to Top Button */}
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
