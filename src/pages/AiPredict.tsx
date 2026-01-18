// @ts-nocheck
import React, { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import {
  CircularProgress,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material"
import {
  TrendingUp,
  LocalGasStation,
  Storefront,
  DirectionsCar,
  Inventory,
  People,
  Phone,
  Send,
  WhatsApp,
  Business,
  Person,
  Warning,
  CheckCircle,
  Info,
  ExpandMore,
  ChevronRight,
  Search,
  Download,
  Refresh,
  ShoppingCart,
  Speed,
  Analytics,
  CalendarToday,
  Schedule,
  Sms,
} from "@mui/icons-material"
import OnlinePredictionIcon from "@mui/icons-material/OnlinePrediction"
import {
  fetchAnalysisAi,
  selectAllAnalysisAi,
} from "../features/ai/aiAnalysisSlice"
import {
  fetchCustomers,
  selectAllCustomers,
} from "../features/customers/customerSlice"
import {
  fetchLocations,
  selectAllLocations,
} from "../features/location/locationSlice"
import { fetchSales, selectAllSales } from "../features/sales/salesSlice"
import {
  fetchSalesTeamVehicle,
  selectAllSalesTeamVehicle,
} from "../features/salesTeam/salesTeamVehicleSlice"
import AdminsFooter from "../components/AdminsFooter"

const AiPredict = () => {
  const dispatch = useAppDispatch()
  const prediction_data = useAppSelector(selectAllAnalysisAi)
  const customers = useAppSelector(selectAllCustomers)
  const locations = useAppSelector(selectAllLocations)
  const vehicles = useAppSelector(selectAllSalesTeamVehicle)
  const sales = useAppSelector(selectAllSales)

  const [activeTab, setActiveTab] = useState(0)
  const [expandedRows, setExpandedRows] = useState<number[]>([])
  const [timeFrame, setTimeFrame] = useState("WEEK")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [predictions, setPredictions] = useState({
    shop: { daily: 0, weekly: 0, monthly: 0 },
    vehicle: { daily: 0, weekly: 0, monthly: 0 },
    store: { daily: 0, weekly: 0, monthly: 0 },
    potentialCustomers: { daily: 0, weekly: 0, monthly: 0 },
  })

  // New state for shop/vehicle/store selection
  const [selectedShops, setSelectedShops] = useState<string[]>([])
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([])
  const [selectedStores, setSelectedStores] = useState<string[]>([])
  const [selectedChannel, setSelectedChannel] = useState<string>("ALL")

  // New state for SMS scheduling
  const [scheduleSMS, setScheduleSMS] = useState(false)
  const [smsMessage, setSmsMessage] = useState("")
  const [smsScheduleTime, setSmsScheduleTime] = useState("09:00")
  const [smsScheduleDate, setSmsScheduleDate] = useState("")
  const [smsRecipientType, setSmsRecipientType] = useState("ALL")
  const [smsDialogOpen, setSmsDialogOpen] = useState(false)

  // Get unique shops, vehicles, and stores
  const uniqueShops = [
    ...new Set(
      locations.filter((loc) => loc.type === "SHOP").map((loc) => loc.name),
    ),
  ]
  const uniqueVehicles = [
    ...new Set(vehicles.map((vehicle) => vehicle.vehicle_number)),
  ]
  const uniqueStores = [
    ...new Set(
      locations.filter((loc) => loc.type === "STORE").map((loc) => loc.name),
    ),
  ]

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([
        dispatch(fetchAnalysisAi()),
        dispatch(fetchCustomers()),
        dispatch(fetchLocations()),
        dispatch(fetchSalesTeamVehicle()),
        dispatch(fetchSales()),
      ])
      setLoading(false)
    }
    loadData()

    // Set default SMS date to tomorrow
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    setSmsScheduleDate(tomorrow.toISOString().split("T")[0])
  }, [dispatch])

  useEffect(() => {
    if (sales.length > 0 && customers.length > 0) {
      const calculateAverageSales = (type: string) => {
        const relevantSales = sales.filter((s) => {
          if (type === "SHOP") return !s.vehicle && !s.motorbike
          if (type === "VEHICLE") return s.vehicle
          if (type === "STORE") return !s.vehicle && s.location
          return true
        })

        const dailyAvg = relevantSales.length / 30
        return {
          daily: Math.round(dailyAvg),
          weekly: Math.round(dailyAvg * 7),
          monthly: Math.round(dailyAvg * 30),
        }
      }

      setPredictions({
        shop: calculateAverageSales("SHOP"),
        vehicle: calculateAverageSales("VEHICLE"),
        store: calculateAverageSales("STORE"),
        potentialCustomers: {
          daily: Math.round(customers.length * 0.1),
          weekly: Math.round(customers.length * 0.3),
          monthly: Math.round(customers.length * 0.6),
        },
      })
    }
  }, [sales, customers])

  const toggleRow = (id: number) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    )
  }

  const getPredictionScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getPredictionScoreLabel = (score: number) => {
    if (score >= 80) return "High"
    if (score >= 60) return "Medium"
    return "Low"
  }

  const getDaysUntilNextPurchase = (dateString: string) => {
    const nextDate = new Date(dateString)
    const today = new Date()
    const diffTime = nextDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getUrgencyColor = (days: number) => {
    if (days <= 3) return "bg-red-100 text-red-800 border-red-300"
    if (days <= 7) return "bg-yellow-100 text-yellow-800 border-yellow-300"
    return "bg-green-100 text-green-800 border-green-300"
  }

  const getUrgencyText = (days: number) => {
    if (days <= 0) return "Overdue"
    if (days <= 3) return "Immediate"
    if (days <= 7) return "Soon"
    if (days <= 14) return "Upcoming"
    return "Future"
  }

  const filteredPredictions = prediction_data.filter((prediction) => {
    const customer = customers.find((c) => c.id === prediction.customer_id)
    if (!customer) return false

    if (
      searchQuery &&
      !customer.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    if (activeTab === 0 && customer.sales !== "RETAIL") return false
    if (activeTab === 1 && customer.sales !== "WHOLESALE") return false

    // Filter by selected shops/vehicles/stores
    if (selectedChannel !== "ALL") {
      if (selectedChannel === "SHOP" && selectedShops.length > 0) {
        const customerLocation = locations.find(
          (loc) => loc.id === customer.location_id,
        )
        if (
          !customerLocation ||
          !selectedShops.includes(customerLocation.name)
        ) {
          return false
        }
      } else if (selectedChannel === "VEHICLE" && selectedVehicles.length > 0) {
        // Implement vehicle filtering logic based on your data structure
        return true
      } else if (selectedChannel === "STORE" && selectedStores.length > 0) {
        const customerLocation = locations.find(
          (loc) => loc.id === customer.location_id,
        )
        if (
          !customerLocation ||
          !selectedStores.includes(customerLocation.name)
        ) {
          return false
        }
      }
    }

    return true
  })

  const sortedPredictions = [...filteredPredictions].sort((a, b) => {
    const daysA = getDaysUntilNextPurchase(a.latest_prediction)
    const daysB = getDaysUntilNextPurchase(b.latest_prediction)
    return daysA - daysB
  })

  const totalPredictedCustomers = sortedPredictions.length
  const immediateRefills = sortedPredictions.filter(
    (p) => getDaysUntilNextPurchase(p.latest_prediction) <= 3,
  ).length
  const highProbabilityCustomers = sortedPredictions.filter(
    (p) => p.prediction_score >= 80,
  ).length

  const StatCard = ({ title, value, unit, icon, color, trend, index }: any) => (
    <div
      className={`bg-white rounded-2xl p-4 shadow-lg border transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
        color === "primary"
          ? "border-blue-200"
          : color === "error"
          ? "border-red-200"
          : color === "success"
          ? "border-green-200"
          : "border-yellow-200"
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-600 font-medium mb-1">{title}</p>
          <div className="flex items-baseline">
            <span
              className={`text-3xl font-bold ${
                color === "primary"
                  ? "text-blue-600"
                  : color === "error"
                  ? "text-red-600"
                  : color === "success"
                  ? "text-green-600"
                  : "text-yellow-600"
              }`}
            >
              {value}
            </span>
            <span className="text-gray-500 text-sm ml-1">{unit}</span>
          </div>
          {trend !== undefined && (
            <div className="flex items-center mt-2">
              {trend >= 0 ? (
                <TrendingUp className="text-green-500 text-sm mr-1" />
              ) : (
                <TrendingUp className="text-red-500 text-sm mr-1 transform rotate-180" />
              )}
              <span
                className={`text-xs font-semibold ${
                  trend >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {trend >= 0 ? "+" : ""}
                {trend}%
              </span>
            </div>
          )}
        </div>
        <div
          className={`p-3 rounded-full ${
            color === "primary"
              ? "bg-blue-100 text-blue-600"
              : color === "error"
              ? "bg-red-100 text-red-600"
              : color === "success"
              ? "bg-green-100 text-green-600"
              : "bg-yellow-100 text-yellow-600"
          }`}
        >
          {icon}
        </div>
      </div>
    </div>
  )

  const PredictionChannelCard = ({ type, icon, color, title }: any) => {
    const value =
      timeFrame === "DAY"
        ? predictions[type.toLowerCase() as keyof typeof predictions].daily
        : timeFrame === "WEEK"
        ? predictions[type.toLowerCase() as keyof typeof predictions].weekly
        : predictions[type.toLowerCase() as keyof typeof predictions].monthly

    const colorClasses = {
      primary: "border-blue-200 bg-gradient-to-br from-blue-50 to-white",
      secondary: "border-purple-200 bg-gradient-to-br from-purple-50 to-white",
      success: "border-green-200 bg-gradient-to-br from-green-50 to-white",
    }

    const textColors = {
      primary: "text-blue-600",
      secondary: "text-purple-600",
      success: "text-green-600",
    }

    return (
      <div
        className={`bg-white rounded-2xl p-4 shadow-lg border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
          colorClasses[color as keyof typeof colorClasses]
        }`}
      >
        <div className="flex items-center mb-4">
          <div
            className={`p-3 rounded-full mr-3 ${
              color === "primary"
                ? "bg-blue-100 text-blue-600"
                : color === "secondary"
                ? "bg-purple-100 text-purple-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {icon}
          </div>
          <div>
            <h3 className="font-bold text-lg">{title}</h3>
            <p className="text-gray-600 text-sm">Estimated Sales</p>
          </div>
        </div>

        <div className="mb-4">
          <div
            className={`text-4xl font-black text-center mb-1 ${
              textColors[color as keyof typeof textColors]
            }`}
          >
            {value}
          </div>
          <p className="text-gray-600 text-center font-medium">
            cylinders / {timeFrame.toLowerCase()}
          </p>
        </div>

        <div className="mb-4">
          <p className="font-semibold text-sm mb-2">📋 Recommendations</p>
          <div
            className={`p-3 rounded-lg text-sm ${
              type === "SHOP"
                ? "bg-blue-50 text-blue-800"
                : type === "VEHICLE"
                ? "bg-yellow-50 text-yellow-800"
                : "bg-green-50 text-green-800"
            }`}
          >
            {type === "SHOP"
              ? `Restock: ${Math.round(value * 1.2)} cylinders`
              : type === "VEHICLE"
              ? `Fuel needed: ${Math.round(value * 0.5)}L`
              : `Buffer: ${Math.round(value * 1.5)} cylinders`}
          </div>
        </div>

        <button
          className={`w-full py-3 px-4 rounded-xl font-semibold transition-colors ${
            color === "primary"
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : color === "secondary"
              ? "bg-purple-600 hover:bg-purple-700 text-white"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          {type === "SHOP"
            ? "Plan Restock"
            : type === "VEHICLE"
            ? "Schedule Delivery"
            : "Order Stock"}
        </button>
      </div>
    )
  }

  const handleSendSMS = () => {
    console.log("Sending SMS:", {
      message: smsMessage,
      scheduleTime: smsScheduleTime,
      scheduleDate: smsScheduleDate,
      recipientType: smsRecipientType,
      schedule: scheduleSMS,
    })
    setSmsDialogOpen(false)
    setSmsMessage("")
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-500 to-purple-600">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center py-4 gap-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🔮</span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  AI Predictive Analytics
                </h1>
                <p className="text-white/80 text-sm">
                  Smart insights for optimal cylinder refill operations
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSmsDialogOpen(true)}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Schedule />
                <span className="hidden sm:inline">Schedule SMS</span>
              </button>
              <button
                onClick={() => dispatch(fetchAnalysisAi())}
                className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-colors"
              >
                <Refresh />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 flex-1 w-full">
        {/* Channel Selection */}
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-4 mb-4 shadow-lg border border-white/20">
          <h2 className="font-bold text-lg mb-4">
            🏪 Select Channel for Predictions
          </h2>

          <div className="space-y-4">
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            >
              <option value="ALL">All Channels</option>
              <option value="SHOP">Shops Only</option>
              <option value="VEHICLE">Vehicles Only</option>
              <option value="STORE">Stores Only</option>
            </select>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(selectedChannel === "SHOP" || selectedChannel === "ALL") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Shops
                  </label>
                  <select
                    multiple
                    value={selectedShops}
                    onChange={(e) =>
                      setSelectedShops(
                        Array.from(
                          e.target.selectedOptions,
                          (option) => option.value,
                        ),
                      )
                    }
                    className="w-full p-3 rounded-xl border border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none min-h-[120px]"
                  >
                    {uniqueShops.map((shop) => (
                      <option key={shop} value={shop}>
                        {shop}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {(selectedChannel === "VEHICLE" || selectedChannel === "ALL") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Vehicles
                  </label>
                  <select
                    multiple
                    value={selectedVehicles}
                    onChange={(e) =>
                      setSelectedVehicles(
                        Array.from(
                          e.target.selectedOptions,
                          (option) => option.value,
                        ),
                      )
                    }
                    className="w-full p-3 rounded-xl border border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none min-h-[120px]"
                  >
                    {uniqueVehicles.map((vehicle) => (
                      <option key={vehicle} value={vehicle}>
                        {vehicle}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {(selectedChannel === "STORE" || selectedChannel === "ALL") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Stores
                  </label>
                  <select
                    multiple
                    value={selectedStores}
                    onChange={(e) =>
                      setSelectedStores(
                        Array.from(
                          e.target.selectedOptions,
                          (option) => option.value,
                        ),
                      )
                    }
                    className="w-full p-3 rounded-xl border border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none min-h-[120px]"
                  >
                    {uniqueStores.map((store) => (
                      <option key={store} value={store}>
                        {store}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <StatCard
            title="Predicted Customers"
            value={totalPredictedCustomers}
            unit="customers"
            icon={<People />}
            color="primary"
            trend={12}
            index={0}
          />
          <StatCard
            title="Immediate Refills"
            value={immediateRefills}
            unit="needed"
            icon={<LocalGasStation />}
            color="error"
            trend={8}
            index={1}
          />
          <StatCard
            title="High Probability"
            value={highProbabilityCustomers}
            unit="customers"
            icon={<TrendingUp />}
            color="success"
            trend={15}
            index={2}
          />
          <StatCard
            title="Prediction Accuracy"
            value={87}
            unit="%"
            icon={<Analytics />}
            color="warning"
            index={3}
          />
        </div>

        {/* Sales Predictions Section */}
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-4 mb-4 shadow-lg border border-white/20">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
            <div>
              <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                📊 Sales & Restocking Predictions
              </h2>
              <p className="text-gray-600">
                AI-powered forecasts for optimal inventory management
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <select
                value={timeFrame}
                onChange={(e) => setTimeFrame(e.target.value)}
                className="p-2 rounded-lg border border-gray-300 bg-white"
              >
                <option value="DAY">Daily</option>
                <option value="WEEK">Weekly</option>
                <option value="MONTH">Monthly</option>
              </select>
              <button
                onClick={() => setSmsDialogOpen(true)}
                className="px-4 py-2 border-2 border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
              >
                <Sms />
                Send SMS
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <PredictionChannelCard
              type="SHOP"
              icon={<Storefront />}
              color="primary"
              title="Shop Predictions"
            />
            <PredictionChannelCard
              type="VEHICLE"
              icon={<DirectionsCar />}
              color="secondary"
              title="Vehicle Predictions"
            />
            <PredictionChannelCard
              type="STORE"
              icon={<Business />}
              color="success"
              title="Store Predictions"
            />
          </div>

          {/* Potential Customers */}
          <div className="mt-8">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              👥 Potential Customer Acquisition
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  period: "Daily",
                  value: predictions.potentialCustomers.daily,
                  color: "bg-blue-100 border-blue-300 text-blue-700",
                },
                {
                  period: "Weekly",
                  value: predictions.potentialCustomers.weekly,
                  color: "bg-yellow-100 border-yellow-300 text-yellow-700",
                },
                {
                  period: "Monthly",
                  value: predictions.potentialCustomers.monthly,
                  color: "bg-green-100 border-green-300 text-green-700",
                },
              ].map((item, index) => (
                <div
                  key={item.period}
                  className={`p-4 rounded-2xl border text-center transition-all duration-300 hover:-translate-y-1 ${item.color}`}
                >
                  <div className="text-3xl font-black mb-1">{item.value}</div>
                  <div className="font-semibold">{item.period} Potential</div>
                  <div className="text-sm opacity-75">
                    {item.period === "Daily"
                      ? "customers/day"
                      : item.period === "Weekly"
                      ? "customers/week"
                      : "customers/month"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Customer Predictions Table */}
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-4 shadow-lg border border-white/20 mb-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
            <div>
              <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                🎯 Customer Refill Predictions
              </h2>
              <p className="text-gray-600">
                AI-powered insights for customer engagement
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                />
              </div>
              <div className="flex border rounded-lg overflow-hidden">
                <button
                  onClick={() => setActiveTab(0)}
                  className={`px-4 py-2 flex items-center gap-2 ${
                    activeTab === 0
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  <Person className="w-4 h-4" />
                  <span className="hidden sm:inline">Retail</span>
                </button>
                <button
                  onClick={() => setActiveTab(1)}
                  className={`px-4 py-2 flex items-center gap-2 ${
                    activeTab === 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  <Business className="w-4 h-4" />
                  <span className="hidden sm:inline">Wholesale</span>
                </button>
                <button
                  onClick={() => setActiveTab(2)}
                  className={`px-4 py-2 flex items-center gap-2 ${
                    activeTab === 2
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  <People className="w-4 h-4" />
                  <span className="hidden sm:inline">All</span>
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center p-12">
              <CircularProgress />
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left font-bold">Customer</th>
                    <th className="p-3 text-left font-bold">Type</th>
                    <th className="p-3 text-left font-bold">Next Refill</th>
                    <th className="p-3 text-left font-bold">Urgency</th>
                    <th className="p-3 text-left font-bold">Probability</th>
                    <th className="p-3 text-left font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedPredictions.map((prediction) => {
                    const customer = customers.find(
                      (c) => c.id === prediction.customer_id,
                    )
                    const isExpanded = expandedRows.includes(
                      prediction.customer_id,
                    )
                    const daysUntil = getDaysUntilNextPurchase(
                      prediction.latest_prediction,
                    )
                    const urgencyColor = getUrgencyColor(daysUntil)

                    return (
                      <React.Fragment key={prediction.customer_id}>
                        <tr className="border-t border-gray-200 hover:bg-gray-50">
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <div
                                className={`p-2 rounded-full ${
                                  customer?.sales === "WHOLESALE"
                                    ? "bg-blue-100 text-blue-600"
                                    : "bg-purple-100 text-purple-600"
                                }`}
                              >
                                {customer?.sales === "WHOLESALE" ? (
                                  <Business />
                                ) : (
                                  <Person />
                                )}
                              </div>
                              <div>
                                <div className="font-semibold">
                                  {customer?.name || "Unknown"}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {customer?.phone || "No phone"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                customer?.sales === "WHOLESALE"
                                  ? "bg-blue-100 text-blue-700 border border-blue-300"
                                  : "bg-purple-100 text-purple-700 border border-purple-300"
                              }`}
                            >
                              {customer?.sales}
                            </span>
                          </td>
                          <td className="p-3">
                            <div>
                              <div className="font-medium">
                                {new Date(
                                  prediction.latest_prediction,
                                ).toLocaleDateString()}
                              </div>
                              <div className="text-sm text-gray-600">
                                {daysUntil} days
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <div
                              className={`px-3 py-1 rounded-full text-sm font-medium border ${urgencyColor}`}
                            >
                              {getUrgencyText(daysUntil)}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="min-w-[120px]">
                              <LinearProgress
                                variant="determinate"
                                value={prediction.prediction_score}
                                className={`h-2 rounded-full ${getPredictionScoreColor(
                                  prediction.prediction_score,
                                )}`}
                              />
                              <div className="text-sm font-medium mt-1">
                                {prediction.prediction_score}% (
                                {getPredictionScoreLabel(
                                  prediction.prediction_score,
                                )}
                                )
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-1">
                              <button
                                onClick={() =>
                                  toggleRow(prediction.customer_id)
                                }
                                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                              >
                                {isExpanded ? <ExpandMore /> : <ChevronRight />}
                              </button>
                              <button
                                onClick={() => setSmsDialogOpen(true)}
                                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                              >
                                <Sms />
                              </button>
                              <button className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors">
                                <Phone />
                              </button>
                            </div>
                          </td>
                        </tr>

                        {isExpanded && (
                          <tr>
                            <td colSpan={6} className="p-0">
                              <div className="bg-gray-50 p-4">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                  <div>
                                    <h4 className="font-bold text-blue-600 mb-3">
                                      Customer Details
                                    </h4>
                                    <div className="space-y-3">
                                      <div className="flex items-center gap-3">
                                        <Phone className="text-gray-500" />
                                        <span>
                                          {customer?.phone ? (
                                            <a
                                              href={`tel:${customer.phone}`}
                                              className="text-blue-600 font-medium hover:underline"
                                            >
                                              {customer.phone}
                                            </a>
                                          ) : (
                                            "N/A"
                                          )}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <Business className="text-gray-500" />
                                        <span>
                                          {customer?.location?.name || "N/A"}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <CalendarToday className="text-gray-500" />
                                        <span>
                                          Last Purchase:{" "}
                                          {prediction.last_purchase_date
                                            ? new Date(
                                                prediction.last_purchase_date,
                                              ).toLocaleDateString()
                                            : "N/A"}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="font-bold text-blue-600 mb-3">
                                      AI Insights
                                    </h4>
                                    <div className="space-y-3">
                                      <div className="flex items-center gap-3">
                                        <Info className="text-blue-500" />
                                        <span>
                                          Expected cylinder type: 13kg
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <TrendingUp className="text-green-500" />
                                        <span>
                                          Purchase frequency: Every{" "}
                                          {Math.round(
                                            365 / prediction.purchase_count,
                                          )}{" "}
                                          days
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <LocalGasStation className="text-yellow-500" />
                                        <span>
                                          Recommended action: Send reminder in{" "}
                                          {Math.max(0, daysUntil - 2)} days
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="lg:col-span-2 pt-4 border-t border-gray-200">
                                    <div className="flex flex-wrap gap-3">
                                      <button
                                        onClick={() => setSmsDialogOpen(true)}
                                        className="px-4 py-2 border-2 border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
                                      >
                                        <Sms />
                                        Send SMS Reminder
                                      </button>
                                      <button className="px-4 py-2 border-2 border-green-500 text-green-600 rounded-lg hover:bg-green-50 transition-colors flex items-center gap-2">
                                        <WhatsApp />
                                        WhatsApp Message
                                      </button>
                                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                                        <Phone />
                                        Call Now
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    )
                  })}

                  {sortedPredictions.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center">
                        <div className="text-center">
                          <LocalGasStation className="text-gray-300 text-6xl mx-auto mb-4" />
                          <h3 className="text-gray-600 text-lg font-semibold mb-2">
                            No predictions found
                          </h3>
                          <p className="text-gray-500">
                            {searchQuery
                              ? "Try adjusting your search criteria"
                              : "AI is analyzing customer patterns..."}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recommendations Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-4 border border-blue-200">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-blue-600">
              <Speed /> AI Recommendations
            </h3>
            <div className="space-y-3">
              {[
                {
                  icon: <Inventory className="text-blue-500" />,
                  text: "Restock shops with 13kg cylinders - high demand predicted",
                  bg: "bg-blue-50",
                  textColor: "text-blue-800",
                },
                {
                  icon: <DirectionsCar className="text-yellow-500" />,
                  text: "Schedule vehicle deliveries for Thursday - optimal customer availability",
                  bg: "bg-yellow-50",
                  textColor: "text-yellow-800",
                },
                {
                  icon: <People className="text-green-500" />,
                  text: "Target wholesale customers next week - 45% predicted to refill",
                  bg: "bg-green-50",
                  textColor: "text-green-800",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg flex items-start gap-3 ${item.bg}`}
                >
                  {item.icon}
                  <p className={`font-medium ${item.textColor}`}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-white rounded-2xl p-4 border border-yellow-200">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-yellow-600">
              <OnlinePredictionIcon /> Prediction Accuracy
            </h3>
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">Model Confidence</span>
              <span className="text-3xl font-black text-yellow-600">87%</span>
            </div>
            <LinearProgress
              variant="determinate"
              value={87}
              className="h-3 rounded-full bg-yellow-100 mb-4"
              sx={{
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#f59e0b",
                  borderRadius: "8px",
                },
              }}
            />
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                Retail: 92%
              </span>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
                Wholesale: 85%
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                New: 78%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SMS Scheduling Dialog */}
      <Dialog
        open={smsDialogOpen}
        onClose={() => setSmsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="flex items-center gap-2">
          <Sms className="text-blue-500" />
          <span className="font-bold">Schedule SMS Notifications</span>
        </DialogTitle>
        <DialogContent>
          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipient Type
              </label>
              <select
                value={smsRecipientType}
                onChange={(e) => setSmsRecipientType(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              >
                <option value="ALL">All Customers</option>
                <option value="RETAIL">Retail Only</option>
                <option value="WHOLESALE">Wholesale Only</option>
                <option value="PREDICTED">Predicted to Refill</option>
                <option value="IMMEDIATE">Immediate Refills</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SMS Message
              </label>
              <textarea
                value={smsMessage}
                onChange={(e) => setSmsMessage(e.target.value)}
                placeholder="Enter your SMS message here..."
                rows={4}
                className="w-full p-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              />
              <p className="text-sm text-gray-500 mt-1">
                Message will be sent to selected customers
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="scheduleSMS"
                checked={scheduleSMS}
                onChange={(e) => setScheduleSMS(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="scheduleSMS" className="text-sm text-gray-700">
                Schedule for later
              </label>
            </div>

            {scheduleSMS && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Schedule Date
                  </label>
                  <input
                    type="date"
                    value={smsScheduleDate}
                    onChange={(e) => setSmsScheduleDate(e.target.value)}
                    className="w-full p-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Schedule Time
                  </label>
                  <input
                    type="time"
                    value={smsScheduleTime}
                    onChange={(e) => setSmsScheduleTime(e.target.value)}
                    className="w-full p-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <button
            onClick={() => setSmsDialogOpen(false)}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSendSMS}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Send />
            {scheduleSMS ? "Schedule SMS" : "Send Now"}
          </button>
        </DialogActions>
      </Dialog>

      {/* Footer */}
      <div className="mt-auto">
        <AdminsFooter />
      </div>
    </div>
  )
}

export default AiPredict
