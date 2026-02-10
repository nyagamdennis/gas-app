// @ts-nocheck
import React, { useMemo } from "react"
import {
  Insights,
  TrendingUp,
  TrendingDown,
  Schedule,
  People,
  LocalGasStation,
  ShoppingCart,
  CreditCard,
  AttachMoney,
} from "@mui/icons-material"
import FormattedAmount from "../FormattedAmount"

const SalesInsights = ({ salesData, statistics, expenses, mobile = false }) => {
  // Calculate insights
  const insights = useMemo(() => {
    if (!statistics || salesData.length === 0) {
      return []
    }

    const insightsList = []

    // Peak hour insight
    if (statistics.peak_hour) {
      insightsList.push({
        icon: <Schedule />,
        title: "Peak Sales Hour",
        description: `Most sales occur at ${statistics.peak_hour}`,
        value: statistics.peak_hour,
        type: "info",
      })
    }

    // Average transaction value insight
    insightsList.push({
      icon: <AttachMoney />,
      title: "Average Transaction",
      description: "Average value per sale",
      value: <FormattedAmount amount={statistics.average_sale} />,
      type: "success",
    })

    // Payment method insight
    const cashPercent = statistics.payment_method_distribution?.CASH
      ? (statistics.payment_method_distribution.CASH / statistics.total_sales) *
        100
      : 0
    const mpesaPercent = statistics.payment_method_distribution?.MPESA
      ? (statistics.payment_method_distribution.MPESA /
          statistics.total_sales) *
        100
      : 0

    insightsList.push({
      icon: <CreditCard />,
      title: "Payment Preference",
      description:
        "Customers prefer " + (cashPercent > mpesaPercent ? "Cash" : "M-Pesa"),
      value:
        cashPercent > mpesaPercent
          ? `${cashPercent.toFixed(1)}% Cash`
          : `${mpesaPercent.toFixed(1)}% M-Pesa`,
      type: "warning",
    })

    // Top product insight
    if (statistics.top_products.length > 0) {
      const topProduct = statistics.top_products[0]
      insightsList.push({
        icon: <LocalGasStation />,
        title: "Top Product",
        description: topProduct.name,
        value: <FormattedAmount amount={topProduct.amount} />,
        type: "info",
      })
    }

    // Profit margin insight
    const profitMargin =
      statistics.total_sales > 0
        ? (statistics.total_profit / statistics.total_sales) * 100
        : 0

    insightsList.push({
      icon: <TrendingUp />,
      title: "Profit Margin",
      description: profitMargin >= 0 ? "Healthy margin" : "Operating at loss",
      value: `${profitMargin.toFixed(1)}%`,
      type:
        profitMargin >= 20
          ? "success"
          : profitMargin >= 0
          ? "warning"
          : "error",
    })

    // Customer insight
    if (statistics.top_customers.length > 0) {
      const topCustomer = statistics.top_customers[0]
      insightsList.push({
        icon: <People />,
        title: "Top Customer",
        description: topCustomer.name,
        value: <FormattedAmount amount={topCustomer.amount} />,
        type: "info",
      })
    }

    return insightsList
  }, [statistics, salesData])

  if (!statistics || salesData.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 text-center">
        <Insights className="text-gray-300 text-4xl mx-auto mb-3" />
        <p className="text-gray-500">No insights available</p>
      </div>
    )
  }

  const getTypeColor = (type) => {
    switch (type) {
      case "success":
        return "text-green-600 bg-green-50 border-green-200"
      case "warning":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "error":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-blue-600 bg-blue-50 border-blue-200"
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
        <Insights className="mr-2 text-blue-600" />
        Sales Insights & Analytics
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${getTypeColor(insight.type)}`}
          >
            <div className="flex items-center mb-3">
              <div className="p-2 rounded-lg bg-white mr-3">{insight.icon}</div>
              <div>
                <div className="font-bold text-gray-800">{insight.title}</div>
                <div className="text-sm text-gray-600">
                  {insight.description}
                </div>
              </div>
            </div>
            <div className="text-2xl font-bold mt-2">{insight.value}</div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-8 pt-6 border-t">
        <h4 className="font-bold text-gray-800 mb-4">Summary Statistics</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">Total Sales</div>
            <div className="text-xl font-bold mt-1">
              <FormattedAmount amount={statistics.total_sales} />
            </div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">Transactions</div>
            <div className="text-xl font-bold mt-1">
              {statistics.sales_count}
            </div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">Avg. Sale</div>
            <div className="text-xl font-bold mt-1">
              <FormattedAmount amount={statistics.average_sale} />
            </div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">Profit Margin</div>
            <div
              className={`text-xl font-bold mt-1 ${
                statistics.total_profit >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {statistics.total_sales > 0
                ? `${(
                    (statistics.total_profit / statistics.total_sales) *
                    100
                  ).toFixed(1)}%`
                : "0%"}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SalesInsights
