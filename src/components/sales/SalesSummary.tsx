// @ts-nocheck
import React from "react"
import {
  Assessment,
  Receipt,
  People,
  LocalGasStation,
  ShoppingCart,
  AttachMoney,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Warning,
} from "@mui/icons-material"
import FormattedAmount from "../FormattedAmount"

const SalesSummary = ({
  open,
  onClose,
  statistics,
  salesData,
  expenses,
  date,
}) => {
  if (!open) return null

  if (!statistics) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="text-center py-8">
              <Assessment className="text-gray-300 text-4xl mx-auto mb-3" />
              <p className="text-gray-500">No data available for summary</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Sales Summary Report
              </h2>
              <p className="text-gray-600">{date}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-2"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Executive Summary */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Executive Summary</h3>
                <p className="opacity-90">Daily performance overview</p>
              </div>
              <Assessment className="text-4xl opacity-80" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white/20 p-4 rounded-lg">
                <div className="text-sm opacity-90">Total Revenue</div>
                <div className="text-2xl font-bold mt-1">
                  <FormattedAmount amount={statistics.total_sales} />
                </div>
              </div>
              <div className="bg-white/20 p-4 rounded-lg">
                <div className="text-sm opacity-90">Net Profit</div>
                <div
                  className={`text-2xl font-bold mt-1 ${
                    statistics.total_profit >= 0
                      ? "text-green-300"
                      : "text-red-300"
                  }`}
                >
                  <FormattedAmount amount={statistics.total_profit} />
                </div>
              </div>
              <div className="bg-white/20 p-4 rounded-lg">
                <div className="text-sm opacity-90">Transactions</div>
                <div className="text-2xl font-bold mt-1">
                  {statistics.sales_count}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Breakdown */}
            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                <Receipt className="mr-2 text-blue-600" />
                Sales Breakdown
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <div className="flex items-center">
                    <LocalGasStation className="text-blue-600 mr-3" />
                    <div>
                      <div className="font-medium">Cylinder Sales</div>
                      <div className="text-sm text-gray-500">
                        {statistics.cylinder_sales_count} transactions
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">
                      <FormattedAmount
                        amount={statistics.total_cylinder_amount}
                      />
                    </div>
                    <div className="text-sm text-gray-500">
                      {statistics.sales_count > 0
                        ? Math.round(
                            (statistics.cylinder_sales_count /
                              statistics.sales_count) *
                              100,
                          )
                        : 0}
                      % of total
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <div className="flex items-center">
                    <ShoppingCart className="text-green-600 mr-3" />
                    <div>
                      <div className="font-medium">Regular Sales</div>
                      <div className="text-sm text-gray-500">
                        {statistics.regular_sales_count} transactions
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">
                      <FormattedAmount
                        amount={statistics.total_regular_amount}
                      />
                    </div>
                    <div className="text-sm text-gray-500">
                      {statistics.sales_count > 0
                        ? Math.round(
                            (statistics.regular_sales_count /
                              statistics.sales_count) *
                              100,
                          )
                        : 0}
                      % of total
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <div className="flex items-center">
                    <LocalGasStation className="text-purple-600 mr-1" />
                    <ShoppingCart className="text-purple-600 mr-2" />
                    <div>
                      <div className="font-medium">Mixed Sales</div>
                      <div className="text-sm text-gray-500">
                        {statistics.mixed_sales_count} transactions
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">
                      <FormattedAmount
                        amount={
                          statistics.total_sales -
                          statistics.total_cylinder_amount -
                          statistics.total_regular_amount
                        }
                      />
                    </div>
                    <div className="text-sm text-gray-500">
                      {statistics.sales_count > 0
                        ? Math.round(
                            (statistics.mixed_sales_count /
                              statistics.sales_count) *
                              100,
                          )
                        : 0}
                      % of total
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                <AttachMoney className="mr-2 text-green-600" />
                Financial Summary
              </h3>
              <div className="space-y-4">
                <div className="p-3 bg-white rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm text-gray-600">Revenue</div>
                    <div className="font-bold text-green-600">
                      <FormattedAmount amount={statistics.total_sales} />
                    </div>
                  </div>
                  <div className="h-2 bg-green-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm text-gray-600">Expenses</div>
                    <div className="font-bold text-red-600">
                      <FormattedAmount amount={statistics.total_expenses} />
                    </div>
                  </div>
                  <div className="h-2 bg-red-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          (statistics.total_expenses / statistics.total_sales) *
                            100,
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm text-gray-600">Net Profit</div>
                    <div
                      className={`font-bold ${
                        statistics.total_profit >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      <FormattedAmount amount={statistics.total_profit} />
                    </div>
                  </div>
                  <div
                    className={`h-2 rounded-full overflow-hidden ${
                      statistics.total_profit >= 0
                        ? "bg-green-100"
                        : "bg-red-100"
                    }`}
                  >
                    <div
                      className={`h-full rounded-full ${
                        statistics.total_profit >= 0
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                      style={{
                        width: `${Math.min(
                          100,
                          (Math.abs(statistics.total_profit) /
                            statistics.total_sales) *
                            100,
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">Profit Margin</div>
                    <div
                      className={`font-bold ${
                        statistics.total_profit >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {statistics.total_sales > 0
                        ? (
                            (statistics.total_profit / statistics.total_sales) *
                            100
                          ).toFixed(1)
                        : 0}
                      %
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="bg-gray-50 rounded-xl p-5 lg:col-span-2">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                <TrendingUp className="mr-2 text-purple-600" />
                Key Metrics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {statistics.sales_count}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Total Transactions
                  </div>
                  <div className="text-xs text-gray-500">Sales count</div>
                </div>
                <div className="bg-white p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">
                    <FormattedAmount amount={statistics.average_sale} />
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Average Sale</div>
                  <div className="text-xs text-gray-500">Per transaction</div>
                </div>
                <div className="bg-white p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {statistics.peak_hour || "N/A"}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Peak Hour</div>
                  <div className="text-xs text-gray-500">
                    Highest sales volume
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {expenses.length}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Expenses</div>
                  <div className="text-xs text-gray-500">Total count</div>
                </div>
              </div>
            </div>

            {/* Top Products */}
            {statistics.top_products.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-bold text-gray-800 mb-4">Top Products</h3>
                <div className="space-y-3">
                  {statistics.top_products.map((product, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white rounded-lg"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold mr-3">
                          {index + 1}
                        </div>
                        <div className="truncate">
                          <div className="font-medium truncate">
                            {product.name}
                          </div>
                          <div className="text-xs text-gray-500">Product</div>
                        </div>
                      </div>
                      <div className="font-bold">
                        <FormattedAmount amount={product.amount} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top Customers */}
            {statistics.top_customers.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-bold text-gray-800 mb-4">Top Customers</h3>
                <div className="space-y-3">
                  {statistics.top_customers.map((customer, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white rounded-lg"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold mr-3">
                          {index + 1}
                        </div>
                        <div className="truncate">
                          <div className="font-medium truncate">
                            {customer.name}
                          </div>
                          <div className="text-xs text-gray-500">Customer</div>
                        </div>
                      </div>
                      <div className="font-bold">
                        <FormattedAmount amount={customer.amount} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Print Button */}
          <div className="mt-6 pt-6 border-t">
            <div className="flex justify-end">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                Print Summary
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SalesSummary
