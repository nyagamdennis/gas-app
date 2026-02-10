// @ts-nocheck
import React, { useMemo } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Equalizer,
  PieChart as PieChartIcon,
} from "@mui/icons-material"

const SalesCharts = ({ salesData, expenses, statistics, mobile = false }) => {
  // Prepare hourly sales data
  const hourlyData = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      sales: 0,
      count: 0,
    }))

    salesData.forEach((sale) => {
      const hour = new Date(sale.created_at).getHours()
      hours[hour].sales += parseFloat(sale.total_amount) || 0
      hours[hour].count += 1
    })

    return hours.filter((h) => h.sales > 0)
  }, [salesData])

  // Prepare payment method data
  const paymentData = useMemo(() => {
    const methods = {
      CASH: { name: "Cash", value: 0, color: "#10B981" },
      MPESA: { name: "M-Pesa", value: 0, color: "#8B5CF6" },
      OTHER: { name: "Other", value: 0, color: "#6B7280" },
    }

    salesData.forEach((sale) => {
      sale.payments?.forEach((payment) => {
        const method = payment.payment_method || "OTHER"
        methods[method].value += parseFloat(payment.amount) || 0
      })
    })

    return Object.values(methods).filter((m) => m.value > 0)
  }, [salesData])

  // Prepare sales by type data
  const salesTypeData = useMemo(() => {
    return [
      {
        name: "Cylinder",
        value: salesData.filter(
          (s) => s.cylinder_items?.length > 0 && s.items?.length === 0,
        ).length,
        color: "#3B82F6",
      },
      {
        name: "Regular",
        value: salesData.filter(
          (s) => s.items?.length > 0 && s.cylinder_items?.length === 0,
        ).length,
        color: "#10B981",
      },
      {
        name: "Mixed",
        value: salesData.filter(
          (s) => s.cylinder_items?.length > 0 && s.items?.length > 0,
        ).length,
        color: "#8B5CF6",
      },
    ]
  }, [salesData])

  if (salesData.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 text-center">
        <Equalizer className="text-gray-300 text-4xl mx-auto mb-3" />
        <p className="text-gray-500">No sales data available for charts</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Sales Chart */}
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800 flex items-center">
              <TrendingUp className="mr-2 text-blue-600" />
              Hourly Sales Performance
            </h3>
            <div className="text-sm text-gray-500">
              Peak: {statistics?.peak_hour || "N/A"}
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="hour" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip
                  formatter={(value) => [
                    `Ksh ${value.toLocaleString()}`,
                    "Sales",
                  ]}
                  labelFormatter={(label) => `Hour: ${label}`}
                />
                <Bar dataKey="sales" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Methods Chart */}
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <PieChartIcon className="mr-2 text-purple-600" />
            Payment Methods Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(1)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [
                    `Ksh ${value.toLocaleString()}`,
                    "Amount",
                  ]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {paymentData.map((method) => (
              <div key={method.name} className="text-center">
                <div className="font-bold" style={{ color: method.color }}>
                  <span>Ksh {method.value.toLocaleString()}</span>
                </div>
                <div className="text-xs text-gray-500">{method.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sales by Type Chart */}
      <div className="bg-white rounded-xl p-4 shadow-sm border">
        <h3 className="font-bold text-gray-800 mb-4">Sales by Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {salesTypeData.map((type) => (
            <div
              key={type.name}
              className="flex items-center p-3 rounded-lg"
              style={{ backgroundColor: `${type.color}15` }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                style={{ backgroundColor: type.color }}
              >
                <span className="text-white font-bold">{type.value}</span>
              </div>
              <div>
                <div className="font-medium" style={{ color: type.color }}>
                  {type.name}
                </div>
                <div className="text-sm text-gray-600">
                  {type.value} sales •{" "}
                  {((type.value / salesData.length) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SalesCharts
