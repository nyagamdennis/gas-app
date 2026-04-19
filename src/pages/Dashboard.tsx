// @ts-nocheck
import React, { useEffect, useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { FaDollarSign, FaChartLine, FaChartPie } from "react-icons/fa"
import { GiExpense, GiProfit } from "react-icons/gi"
import { FcDebt } from "react-icons/fc"
import { PiChartLineUpFill } from "react-icons/pi"
import { RiExchangeDollarFill } from "react-icons/ri"
import { MdMoreHoriz } from "react-icons/md"
import {
  TrendingUp,
  TrendingDown,
  People,
  Inventory,
  ShowChart,
  PieChart as PieChartIcon,
  Receipt,
  FilterList,
  Refresh,
  Download,
  Menu as MenuIcon,
  KeyboardArrowUp,
} from "@mui/icons-material"

import Navbar from "../components/ui/mobile/admin/Navbar"
import AdminsFooter from "../components/AdminsFooter"
import CurrencyConvert from "../components/CurrencyConvert"
import RealTimeIndicator from "../components/sales/RealTimeIndicator"
import planStatus from "../features/planStatus/planStatus"
import computeDayOverDayDebtChange from "../utils/debtUtils"
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])
  return { isMobile, isTablet: false, isDesktop: !isMobile }
}

const Dashboard = () => {
  const navigate = useNavigate()
  const { isMobile } = useResponsive()
  const { isPro, isTrial, isExpired } = planStatus()

  // State for API data
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statsData, setStatsData] = useState(null)
  const [timeRange, setTimeRange] = useState("week")
  const [teamFilter, setTeamFilter] = useState({ type: null, id: null })

  // Team filter UI state
  const [selectedTeamType, setSelectedTeamType] = useState("")
  const [selectedTeamId, setSelectedTeamId] = useState("")
  const [teamsList, setTeamsList] = useState([])
  const [loadingTeams, setLoadingTeams] = useState(false)

  // Additional data states
  const [latestTransactions, setLatestTransactions] = useState([])
  const [teamPerformance, setTeamPerformance] = useState([])
  const [loadingTransactions, setLoadingTransactions] = useState(false)
  const [loadingPerformance, setLoadingPerformance] = useState(false)

  // Advanced Features
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [dataVersion, setDataVersion] = useState(0)
  const [activeView, setActiveView] = useState("overview")

  // Derived values from API data
  const totalRevenue = statsData?.revenue?.total || 0
  const totalExpenses = statsData?.expenses?.total || 0
  const totalProfit = statsData?.profit?.net || 0
  const profitMargin =
    totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : 0

  const retailRevenue = statsData?.revenue?.retail || 0
  const wholesaleRevenue = statsData?.revenue?.wholesale || 0
  const averageSale = statsData?.revenue?.average_sale || 0
  const totalOutstandingDebt = statsData?.debt_analysis?.total_outstanding || 0

  // Chart data
  const revenueByDate = statsData?.revenue?.by_date || []
  const expensesByDate = statsData?.expenses?.by_date || []
  const chartLabels = revenueByDate.map((item) =>
    new Date(item.period).toLocaleDateString(undefined, { weekday: "short" }),
  )
  const lineChartData = revenueByDate.map((item, index) => ({
    period: chartLabels[index] || new Date(item.period).toLocaleDateString(),
    revenue: item.total,
    expenses: expensesByDate[index]?.total || 0,
  }))

  const totalSalesValue = retailRevenue + wholesaleRevenue
  const salesDistribution = [
    { name: "Retail", value: retailRevenue, color: "#3b82f6" },
    { name: "Wholesale", value: wholesaleRevenue, color: "#10b981" },
  ].filter((item) => item.value > 0)

  // Mock data for top products (still mock)
  const topProducts = [
    { name: "Gas Cylinder 15kg", sales: 245, revenue: 1225000, growth: 12.5 },
    { name: "Cooking Gas 6kg", sales: 189, revenue: 567000, growth: 8.2 },
    { name: "Industrial Gas", sales: 134, revenue: 4020000, growth: 15.7 },
    { name: "Medical Oxygen", sales: 98, revenue: 2940000, growth: 5.3 },
    { name: "CO2 Cylinder", sales: 76, revenue: 1520000, growth: -2.1 },
  ]

  // Fetch dashboard statistics
  const fetchDashboardStats = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = { period: timeRange }
      if (teamFilter.type && teamFilter.id) {
        params.team_type = teamFilter.type
        params.team_id = teamFilter.id
      }
      const response = await api.get("/dashboard/dashboard/stats/", { params })
      setStatsData(response.data)
      setLastUpdated(new Date().toLocaleTimeString())
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err)
      setError(err.response?.data?.detail || "Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }, [timeRange, teamFilter])

  // Fetch latest transactions
  const fetchLatestTransactions = useCallback(async () => {
    setLoadingTransactions(true)
    try {
      const params = { limit: 5 }
      if (teamFilter.type && teamFilter.id) {
        params.team_type = teamFilter.type
        params.team_id = teamFilter.id
      }
      const response = await api.get("/dashboard/sales/latest-transactions/", {
        params,
      })
      setLatestTransactions(response.data.transactions || [])
    } catch (err) {
      console.error("Failed to fetch latest transactions:", err)
    } finally {
      setLoadingTransactions(false)
    }
  }, [teamFilter])

  // Fetch team performance
  const fetchTeamPerformance = useCallback(async () => {
    setLoadingPerformance(true)
    try {
      const params = { period: timeRange }
      if (teamFilter.type && teamFilter.id) {
        params.team_type = teamFilter.type
        params.team_id = teamFilter.id
      }
      const response = await api.get("/dashboard/sales/team-performance/", {
        params,
      })
      setTeamPerformance(response.data.teams || [])
    } catch (err) {
      console.error("Failed to fetch team performance:", err)
    } finally {
      setLoadingPerformance(false)
    }
  }, [timeRange, teamFilter])

  // Fetch teams when team type changes
  useEffect(() => {
    if (!selectedTeamType) {
      setTeamsList([])
      setSelectedTeamId("")
      return
    }
    const fetchTeams = async () => {
      setLoadingTeams(true)
      try {
        let endpoint = ""
        if (selectedTeamType === "SHOP") endpoint = "/shop/"
        else if (selectedTeamType === "STORE") endpoint = "/store/"
        else if (selectedTeamType === "VEHICLE") endpoint = "/vehicle/"
        const response = await api.get(endpoint)
        let teams = response.data.results || response.data || []
        setTeamsList(teams)
      } catch (error) {
        console.error("Failed to fetch teams:", error)
        toast.error("Failed to load teams")
        setTeamsList([])
      } finally {
        setLoadingTeams(false)
      }
    }
    fetchTeams()
  }, [selectedTeamType])

  const handleTeamFilterChange = (type, id) => {
    setSelectedTeamType(type)
    setSelectedTeamId(id)
    setTeamFilter({ type: type || null, id: id || null })
  }

  const clearTeamFilter = () => {
    setSelectedTeamType("")
    setSelectedTeamId("")
    setTeamFilter({ type: null, id: null })
  }

  useEffect(() => {
    fetchDashboardStats()
    fetchLatestTransactions()
    fetchTeamPerformance()
  }, [fetchDashboardStats, fetchLatestTransactions, fetchTeamPerformance])

  useEffect(() => {
    if (!autoRefresh) return
    const interval = setInterval(() => {
      fetchDashboardStats()
      fetchLatestTransactions()
      fetchTeamPerformance()
    }, 30000)
    return () => clearInterval(interval)
  }, [
    autoRefresh,
    fetchDashboardStats,
    fetchLatestTransactions,
    fetchTeamPerformance,
  ])

  const debtChange = computeDayOverDayDebtChange([])
  const completionRate =
    latestTransactions.length > 0
      ? (latestTransactions.filter((t) => t.payment_status === "PAID").length /
          latestTransactions.length) *
        100
      : 0

  // Stat Card Component (pure Tailwind)
  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    change,
    subtitle,
    isCurrency = true,
  }) => (
    <div className="bg-white rounded-xl shadow-md p-4 transition-all hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs text-gray-500 font-medium mb-1">{title}</p>
          <p className="text-xl font-bold text-gray-800">
            {isCurrency ? <CurrencyConvert price={value} /> : value}
          </p>
          {change !== undefined && (
            <div className="flex items-center mt-2">
              {change > 0 ? (
                <TrendingUp
                  className="text-green-500 mr-1"
                  style={{ fontSize: "1rem" }}
                />
              ) : (
                <TrendingDown
                  className="text-red-500 mr-1"
                  style={{ fontSize: "1rem" }}
                />
              )}
              <span
                className={`text-xs font-medium ${
                  change > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {change > 0 ? "+" : ""}
                {change}%
              </span>
              {subtitle && (
                <span className="text-xs text-gray-400 ml-2">{subtitle}</span>
              )}
            </div>
          )}
        </div>
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${color}15`, color }}
        >
          <Icon style={{ fontSize: "1.25rem" }} />
        </div>
      </div>
    </div>
  )

  // Mobile Navigation Tabs
  const MobileNavTabs = () => (
    <div className="sticky top-0 z-10 bg-white border-b">
      <div className="flex overflow-x-auto no-scrollbar">
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

  // Slider settings
  const sliderSettings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: isMobile ? 1.2 : 4,
    slidesToScroll: 1,
    centerMode: isMobile,
    centerPadding: isMobile ? "20px" : "0",
  }

  // Mobile content
  const renderMobileContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )
    }
    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )
    }

    switch (activeView) {
      case "financial":
        return (
          <>
            <div className="bg-white rounded-xl shadow-md p-4 mb-4">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                <FaChartLine className="mr-2 text-blue-500" /> Financial Trends
              </h3>
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
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4">
              <h3 className="font-bold text-gray-800 mb-2 flex items-center">
                <FaChartPie className="mr-2 text-green-500" /> Sales Breakdown
              </h3>
              <p className="text-xs text-gray-500 text-center mb-4">
                Total Sales: <CurrencyConvert price={totalSalesValue} />
              </p>
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
                    {salesDistribution.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
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
            </div>
          </>
        )
      case "products":
        return (
          <div className="bg-white rounded-xl shadow-md p-4">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center">
              <Inventory className="mr-2 text-blue-500" /> Top Products
            </h3>
            <div className="space-y-3">
              {topProducts.map((product, idx) => (
                <div key={idx} className="bg-gray-50 p-3 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
                        {idx + 1}
                      </div>
                      <span className="font-medium">{product.name}</span>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        product.growth > 0
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.growth > 0 ? "+" : ""}
                      {product.growth}%
                    </span>
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
          </div>
        )
      case "teams":
        return (
          <div className="bg-white rounded-xl shadow-md p-4">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center">
              <People className="mr-2 text-green-500" /> Team Performance
            </h3>
            {loadingPerformance ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-20 bg-gray-100 animate-pulse rounded-xl"
                  ></div>
                ))}
              </div>
            ) : teamPerformance.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No team performance data available
              </p>
            ) : (
              <div className="space-y-5">
                {teamPerformance.map((team, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold">{team.name}</span>
                      <span className="font-bold text-green-600">
                        <CurrencyConvert price={team.total_sales} />
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            (team.total_sales / (team.total_sales + 100000)) *
                              100,
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>{team.sales_count} sales</span>
                      <span>
                        Avg: <CurrencyConvert price={team.average_sale} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      default: // overview
        return (
          <>
            {/* Time range & team filter */}
            <div className="mb-4">
              <div className="flex overflow-x-auto no-scrollbar pb-2 gap-2">
                {["day", "week", "month", "year"].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition ${
                      timeRange === range
                        ? "bg-blue-500 text-white shadow"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {range.charAt(0).toUpperCase() + range.slice(1)}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 items-center mt-2">
                <select
                  className="flex-1 px-3 py-2 border rounded-lg text-sm bg-white"
                  value={selectedTeamType}
                  onChange={(e) => handleTeamFilterChange(e.target.value, "")}
                >
                  <option value="">All Teams</option>
                  <option value="SHOP">Shop</option>
                  <option value="STORE">Store</option>
                  <option value="VEHICLE">Vehicle</option>
                </select>
                {selectedTeamType && (
                  <select
                    className="flex-1 px-3 py-2 border rounded-lg text-sm bg-white"
                    value={selectedTeamId}
                    onChange={(e) =>
                      handleTeamFilterChange(selectedTeamType, e.target.value)
                    }
                    disabled={loadingTeams}
                  >
                    <option value="">
                      Select {selectedTeamType.toLowerCase()}
                    </option>
                    {teamsList.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name || team.number_plate || `ID: ${team.id}`}
                      </option>
                    ))}
                  </select>
                )}
                {(selectedTeamType || selectedTeamId) && (
                  <button
                    onClick={clearTeamFilter}
                    className="px-3 py-2 text-sm text-red-600"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* KPI Cards Slider */}
            <div className="mb-6">
              <Slider {...sliderSettings}>
                {[
                  {
                    title: "Revenue",
                    value: totalRevenue,
                    icon: FaDollarSign,
                    color: "#10b981",
                    change: 12.5,
                    subtitle: "vs last period",
                  },
                  {
                    title: "Profit",
                    value: totalProfit,
                    icon: GiProfit,
                    color: "#3b82f6",
                    change: 10.5,
                    subtitle: "vs last period",
                  },
                  {
                    title: "Expenses",
                    value: totalExpenses,
                    icon: GiExpense,
                    color: "#ef4444",
                    change: -5.2,
                    subtitle: "vs last period",
                  },
                  {
                    title: "Outstanding Debt",
                    value: totalOutstandingDebt,
                    icon: FcDebt,
                    color: "#f97316",
                    change: debtChange.changePercent || 0,
                    subtitle: "vs yesterday",
                  },
                  {
                    title: "Margin",
                    value: profitMargin,
                    icon: PiChartLineUpFill,
                    color: "#8b5cf6",
                    subtitle: `${profitMargin}%`,
                    isCurrency: false,
                  },
                  {
                    title: "Avg. Sale",
                    value: averageSale,
                    icon: RiExchangeDollarFill,
                    color: "#6366f1",
                    subtitle: "per transaction",
                  },
                ].map((stat, idx) => (
                  <div key={idx} className="px-1">
                    <StatCard {...stat} />
                  </div>
                ))}
              </Slider>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-white rounded-xl shadow-md p-3 text-center">
                <p className="text-xs text-gray-500">Completion Rate</p>
                <p className="text-2xl font-bold my-2">
                  {completionRate.toFixed(0)}%
                </p>
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div
                    className="bg-green-500 h-1 rounded-full"
                    style={{ width: `${completionRate}%` }}
                  ></div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-3 text-center">
                <p className="text-xs text-gray-500">Active Debtors</p>
                <p className="text-2xl font-bold my-2">0</p>
                <p className="text-xs text-gray-500">
                  Total: <CurrencyConvert price={totalOutstandingDebt} />
                </p>
              </div>
            </div>

            {/* Performance Line Chart */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-6">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                <ShowChart className="mr-2 text-blue-500" /> Performance
                Overview
              </h3>
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
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-xl shadow-md p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold flex items-center">
                  <Receipt className="mr-2 text-purple-500" /> Recent
                  Transactions
                </h3>
                <button
                  onClick={() => navigate("/transactions")}
                  className="text-gray-500"
                >
                  <MdMoreHoriz size={20} />
                </button>
              </div>
              {loadingTransactions ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-20 bg-gray-100 animate-pulse rounded-xl"
                    ></div>
                  ))}
                </div>
              ) : latestTransactions.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No recent transactions
                </p>
              ) : (
                <div className="space-y-3">
                  {latestTransactions.slice(0, 3).map((tx) => (
                    <div
                      key={tx.id}
                      className="bg-gray-50 p-4 rounded-xl border border-gray-100"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-bold">{tx.customer_name}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(tx.created_at).toLocaleDateString()} •{" "}
                            {tx.location_name || "Unknown"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-blue-600">
                            <CurrencyConvert price={tx.total_amount} />
                          </p>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              tx.payment_status === "PAID"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {tx.payment_status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )
    }
  }

  // Desktop view (simplified, similar structure but with grid)
  const renderDesktopView = () => {
    if (loading)
      return (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )
    if (error)
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )

    return (
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Dashboard Overview
          </h1>
          <p className="text-gray-500">Real-time insights for your business</p>
        </div>

        {/* Time Range & Team Filter */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex gap-2">
            {["day", "week", "month", "year"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition ${
                  timeRange === range
                    ? "bg-blue-500 text-white shadow"
                    : "bg-white text-gray-600 hover:bg-gray-100 border"
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <select
              className="px-3 py-1.5 border rounded-lg text-sm bg-white"
              value={selectedTeamType}
              onChange={(e) => handleTeamFilterChange(e.target.value, "")}
            >
              <option value="">All Teams</option>
              <option value="SHOP">Shop</option>
              <option value="STORE">Store</option>
              <option value="VEHICLE">Vehicle</option>
            </select>
            {selectedTeamType && (
              <select
                className="px-3 py-1.5 border rounded-lg text-sm bg-white"
                value={selectedTeamId}
                onChange={(e) =>
                  handleTeamFilterChange(selectedTeamType, e.target.value)
                }
                disabled={loadingTeams}
              >
                <option value="">
                  Select {selectedTeamType.toLowerCase()}
                </option>
                {teamsList.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name || team.number_plate || `ID: ${team.id}`}
                  </option>
                ))}
              </select>
            )}
            {(selectedTeamType || selectedTeamId) && (
              <button
                onClick={clearTeamFilter}
                className="text-red-600 text-sm"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
          <StatCard
            title="Total Revenue"
            value={totalRevenue}
            icon={FaDollarSign}
            color="#10b981"
            change={12.5}
            subtitle="vs last period"
          />
          <StatCard
            title="Total Profit"
            value={totalProfit}
            icon={GiProfit}
            color="#3b82f6"
            change={10.5}
            subtitle="vs last period"
          />
          <StatCard
            title="Total Expenses"
            value={totalExpenses}
            icon={GiExpense}
            color="#ef4444"
            change={-5.2}
            subtitle="vs last period"
          />
          <StatCard
            title="Outstanding Debt"
            value={totalOutstandingDebt}
            icon={FcDebt}
            color="#f97316"
            change={debtChange.changePercent || 0}
            subtitle="vs yesterday"
          />
          <StatCard
            title="Profit Margin"
            value={profitMargin}
            icon={PiChartLineUpFill}
            color="#8b5cf6"
            isCurrency={false}
            subtitle={`${profitMargin}%`}
          />
          <StatCard
            title="Avg. Transaction"
            value={averageSale}
            icon={RiExchangeDollarFill}
            color="#6366f1"
            subtitle="per sale"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-4">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center">
              <ShowChart className="mr-2 text-blue-500" /> Financial Performance
            </h3>
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
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center">
              <PieChartIcon className="mr-2 text-green-500" /> Sales Breakdown
            </h3>
            <p className="text-sm text-gray-500 text-center mb-4">
              Total Sales: <CurrencyConvert price={totalSalesValue} />
            </p>
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
                  labelLine
                >
                  {salesDistribution.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
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
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-4">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center">
              <Inventory className="mr-2 text-blue-500" /> Top Products
            </h3>
            <div className="divide-y">
              {topProducts.map((product, idx) => (
                <div
                  key={idx}
                  className="py-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-xs text-gray-500">
                        {product.sales} units •{" "}
                        <CurrencyConvert price={product.revenue} />
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      product.growth > 0
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.growth > 0 ? "+" : ""}
                    {product.growth}%
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold flex items-center">
                <Receipt className="mr-2 text-purple-500" /> Recent Transactions
              </h3>
              <button
                onClick={() => navigate("/transactions")}
                className="text-gray-500"
              >
                <MdMoreHoriz size={20} />
              </button>
            </div>
            {loadingTransactions ? (
              <div className="space-y-2">
                {Array(4)
                  .fill()
                  .map((_, i) => (
                    <div
                      key={i}
                      className="h-16 bg-gray-100 animate-pulse rounded-lg"
                    ></div>
                  ))}
              </div>
            ) : latestTransactions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No recent transactions
              </p>
            ) : (
              <div className="divide-y">
                {latestTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="py-3 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          tx.payment_status === "PAID"
                            ? "bg-green-100 text-green-600"
                            : "bg-orange-100 text-orange-600"
                        }`}
                      >
                        {tx.customer_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{tx.customer_name}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(tx.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">
                        <CurrencyConvert price={tx.total_amount} />
                      </p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          tx.payment_status === "PAID"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {tx.payment_status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0]">
      <ToastContainer />
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
        headerMessage="ERP Dashboard"
        headerText="Real-time insights for your business"
      />

      {isMobile ? (
        <>
          <MobileNavTabs />
          <main className="flex-grow p-4 pb-20">{renderMobileContent()}</main>
        </>
      ) : (
        <main className="flex-grow">{renderDesktopView()}</main>
      )}

      <ScrollTop />
      <footer className="mt-8">
        <AdminsFooter />
      </footer>
    </div>
  )
}

// ScrollToTop component (simple)
const ScrollTop = () => {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const toggle = () => setVisible(window.scrollY > 300)
    window.addEventListener("scroll", toggle)
    return () => window.removeEventListener("scroll", toggle)
  }, [])
  if (!visible) return null
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-20 right-4 z-40 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
    >
      <KeyboardArrowUp />
    </button>
  )
}

export default Dashboard
