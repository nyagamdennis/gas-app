// @ts-nocheck
import React, { useState, useEffect } from "react"
import {
  TrendingUp,
  CalendarToday,
  ArrowDropDown,
  ArrowDropUp,
  ShowChart,
} from "@mui/icons-material"
import FormattedAmount from "../FormattedAmount"
import api from "../../../utils/api"

const SalesTrends = ({ teamId, teamType, currentDate }) => {
  const [timeRange, setTimeRange] = useState("week")
  const [trendsData, setTrendsData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchTrendsData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get("/sales/trends", {
        params: {
          team_id: teamId,
          team_type: teamType,
          range: timeRange,
          end_date: currentDate,
        },
      })
      setTrendsData(response.data)
    } catch (err) {
      console.error("Error fetching trends:", err)
      setError("Failed to load trends data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (teamId && teamType) {
      fetchTrendsData()
    }
  }, [teamId, teamType, timeRange, currentDate])

  const timeRanges = [
    { id: "week", label: "Last 7 Days" },
    { id: "month", label: "Last 30 Days" },
    { id: "quarter", label: "Last 90 Days" },
  ]

  const calculateTrend = (current, previous) => {
    if (!previous || previous === 0) return { value: 100, direction: "up" }
    const change = ((current - previous) / previous) * 100
    return {
      value: Math.abs(change).toFixed(1),
      direction: change >= 0 ? "up" : "down",
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="text-center py-8">
          <div className="text-red-500 mb-3">⚠️</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={fetchTrendsData}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!trendsData) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="text-center py-8">
          <ShowChart className="text-gray-300 text-4xl mx-auto mb-3" />
          <p className="text-gray-500">No trends data available</p>
        </div>
      </div>
    )
  }

  const salesTrend = calculateTrend(
    trendsData.current_period?.total_sales || 0,
    trendsData.previous_period?.total_sales || 0,
  )
  const profitTrend = calculateTrend(
    trendsData.current_period?.total_profit || 0,
    trendsData.previous_period?.total_profit || 0,
  )
  const transactionTrend = calculateTrend(
    trendsData.current_period?.sales_count || 0,
    trendsData.previous_period?.sales_count || 0,
  )

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <TrendingUp className="mr-2 text-blue-600" />
          Sales Trends
        </h3>
        <div className="flex items-center gap-2">
          <CalendarToday className="text-gray-400" fontSize="small" />
          <select
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            {timeRanges.map((range) => (
              <option key={range.id} value={range.id}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Trend Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="text-sm text-gray-600">Sales Trend</div>
              <div className="text-2xl font-bold mt-1">
                <FormattedAmount
                  amount={trendsData.current_period?.total_sales || 0}
                />
              </div>
            </div>
            <div
              className={`flex items-center ${
                salesTrend.direction === "up"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {salesTrend.direction === "up" ? (
                <ArrowDropUp />
              ) : (
                <ArrowDropDown />
              )}
              <span className="font-medium">{salesTrend.value}%</span>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            vs previous period:{" "}
            <FormattedAmount
              amount={trendsData.previous_period?.total_sales || 0}
            />
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="text-sm text-gray-600">Profit Trend</div>
              <div className="text-2xl font-bold mt-1">
                <FormattedAmount
                  amount={trendsData.current_period?.total_profit || 0}
                />
              </div>
            </div>
            <div
              className={`flex items-center ${
                profitTrend.direction === "up"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {profitTrend.direction === "up" ? (
                <ArrowDropUp />
              ) : (
                <ArrowDropDown />
              )}
              <span className="font-medium">{profitTrend.value}%</span>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            vs previous period:{" "}
            <FormattedAmount
              amount={trendsData.previous_period?.total_profit || 0}
            />
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="text-sm text-gray-600">Transaction Trend</div>
              <div className="text-2xl font-bold mt-1">
                {trendsData.current_period?.sales_count || 0}
              </div>
            </div>
            <div
              className={`flex items-center ${
                transactionTrend.direction === "up"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {transactionTrend.direction === "up" ? (
                <ArrowDropUp />
              ) : (
                <ArrowDropDown />
              )}
              <span className="font-medium">{transactionTrend.value}%</span>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            vs previous period: {trendsData.previous_period?.sales_count || 0}
          </div>
        </div>
      </div>

      {/* Daily Trends */}
      {trendsData.daily_trends && trendsData.daily_trends.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-800 mb-4">Daily Performance</h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Date
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Sales
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Transactions
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Avg. Sale
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Profit
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {trendsData.daily_trends.slice(0, 7).map((day, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">
                      {new Date(day.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">
                      <FormattedAmount amount={day.total_sales} />
                    </td>
                    <td className="px-4 py-3 text-sm">{day.sales_count}</td>
                    <td className="px-4 py-3 text-sm">
                      <FormattedAmount amount={day.average_sale} />
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={
                          day.total_profit >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        <FormattedAmount amount={day.total_profit} />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Insights */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">Trend Insights</h4>
        <ul className="space-y-2 text-sm text-blue-700">
          {salesTrend.direction === "up" ? (
            <li>📈 Sales are increasing compared to the previous period</li>
          ) : (
            <li>📉 Sales are decreasing compared to the previous period</li>
          )}
          {profitTrend.direction === "up" ? (
            <li>💰 Profitability is improving</li>
          ) : (
            <li>⚠️ Profitability needs attention</li>
          )}
          {transactionTrend.direction === "up" ? (
            <li>🛒 Customer transactions are increasing</li>
          ) : (
            <li>🔍 Consider reviewing customer acquisition strategies</li>
          )}
          {trendsData.peak_day && (
            <li>🎯 Peak performance day: {trendsData.peak_day}</li>
          )}
        </ul>
      </div>
    </div>
  )
}

export default SalesTrends
