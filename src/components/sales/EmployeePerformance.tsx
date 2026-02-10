// @ts-nocheck
import React, { useMemo } from "react"
import {
  People,
  Star,
  TrendingUp,
  TrendingDown,
  Equalizer,
} from "@mui/icons-material"
import FormattedAmount from "../FormattedAmount"

const EmployeePerformance = ({
  salesData,
  employees,
  onViewDetails,
  previewMode = false,
  mobile = false,
}) => {
  // Calculate employee performance
  const employeeStats = useMemo(() => {
    const stats = {}

    // Initialize stats for each employee
    employees.forEach((emp) => {
      stats[emp.id] = {
        id: emp.id,
        name: `${emp.first_name} ${emp.last_name}`,
        sales: 0,
        count: 0,
        avgSale: 0,
        cylinderSales: 0,
        regularSales: 0,
        totalCash: 0,
        totalMpesa: 0,
      }
    })

    // Calculate stats from sales data
    salesData.forEach((sale) => {
      const empId = sale.salesperson_id
      if (empId && stats[empId]) {
        const amount = parseFloat(sale.total_amount) || 0
        stats[empId].sales += amount
        stats[empId].count += 1

        // Categorize sales
        if (sale.cylinder_items?.length > 0 && sale.items?.length === 0) {
          stats[empId].cylinderSales += 1
        } else if (
          sale.items?.length > 0 &&
          sale.cylinder_items?.length === 0
        ) {
          stats[empId].regularSales += 1
        }

        // Payment methods
        sale.payments?.forEach((payment) => {
          const paymentAmount = parseFloat(payment.amount) || 0
          if (payment.payment_method === "CASH") {
            stats[empId].totalCash += paymentAmount
          } else if (payment.payment_method === "MPESA") {
            stats[empId].totalMpesa += paymentAmount
          }
        })
      }
    })

    // Calculate averages
    Object.values(stats).forEach((stat) => {
      stat.avgSale = stat.count > 0 ? stat.sales / stat.count : 0
    })

    // Sort by sales (descending)
    return Object.values(stats)
      .filter((stat) => stat.count > 0)
      .sort((a, b) => b.sales - a.sales)
  }, [salesData, employees])

  if (employeeStats.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 text-center">
        <People className="text-gray-300 text-4xl mx-auto mb-3" />
        <p className="text-gray-500">No employee performance data available</p>
      </div>
    )
  }

  const topPerformers = employeeStats.slice(0, previewMode ? 3 : 5)

  return (
    <div className={`bg-white rounded-xl ${previewMode ? "p-4" : "p-6"}`}>
      {!previewMode && (
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <People className="mr-2 text-blue-600" />
            Employee Performance
          </h3>
          <div className="text-sm text-gray-500">
            {employeeStats.length} active salespeople
          </div>
        </div>
      )}

      <div className="space-y-4">
        {topPerformers.map((employee, index) => (
          <div
            key={employee.id}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                  {employee.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-gray-800">{employee.name}</div>
                  <div className="text-sm text-gray-500">
                    {employee.count} sales • {employee.cylinderSales} cylinders
                    • {employee.regularSales} regular
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                {index === 0 && <Star className="text-yellow-500 mr-2" />}
                <div className="text-right">
                  <div className="font-bold text-lg">
                    <FormattedAmount amount={employee.sales} />
                  </div>
                  <div className="text-sm text-gray-500">
                    Avg: <FormattedAmount amount={employee.avgSale} />
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-2">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Sales Performance</span>
                <span>
                  {(
                    (employee.sales / (employeeStats[0]?.sales || 1)) *
                    100
                  ).toFixed(1)}
                  %
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                  style={{
                    width: `${
                      (employee.sales / (employeeStats[0]?.sales || 1)) * 100
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Payment Breakdown */}
            <div className="flex justify-between text-sm mt-3">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                <span className="text-gray-600">Cash:</span>
                <span className="font-medium ml-1">
                  <FormattedAmount amount={employee.totalCash} />
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-1"></div>
                <span className="text-gray-600">M-Pesa:</span>
                <span className="font-medium ml-1">
                  <FormattedAmount amount={employee.totalMpesa} />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {previewMode && employeeStats.length > 3 && (
        <button
          onClick={onViewDetails}
          className="w-full mt-4 py-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View All {employeeStats.length} Employees →
        </button>
      )}
    </div>
  )
}

export default EmployeePerformance
