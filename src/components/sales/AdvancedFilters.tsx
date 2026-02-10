// @ts-nocheck
import React, { useState } from "react"
import {
  Close,
  FilterList,
  CalendarToday,
  AttachMoney,
  Category,
  Payment,
  People,
  ClearAll,
} from "@mui/icons-material"

const AdvancedFilters = ({ open, onClose, employees, onApply }) => {
  const [filters, setFilters] = useState({
    amountRange: { min: "", max: "" },
    dateRange: { start: "", end: "" },
    categories: [],
    paymentMethods: [],
    employees: [],
    statuses: [],
    saleTypes: [],
  })

  const categories = [
    { id: "cylinder", name: "Cylinder Sales" },
    { id: "regular", name: "Regular Items" },
    { id: "mixed", name: "Mixed Sales" },
  ]

  const paymentMethods = [
    { id: "CASH", name: "Cash" },
    { id: "MPESA", name: "M-Pesa" },
    { id: "CARD", name: "Card" },
    { id: "BANK", name: "Bank Transfer" },
  ]

  const statuses = [
    { id: "PAID", name: "Paid" },
    { id: "PARTIAL", name: "Partial" },
    { id: "UNPAID", name: "Unpaid" },
    { id: "OVERDUE", name: "Overdue" },
  ]

  const saleTypes = [
    { id: "RETAIL", name: "Retail" },
    { id: "WHOLESALE", name: "Wholesale" },
    { id: "CREDIT", name: "Credit Sale" },
  ]

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }))
  }

  const handleApply = () => {
    onApply(filters)
    onClose()
  }

  const handleReset = () => {
    setFilters({
      amountRange: { min: "", max: "" },
      dateRange: { start: "", end: "" },
      categories: [],
      paymentMethods: [],
      employees: [],
      statuses: [],
      saleTypes: [],
    })
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <FilterList className="mr-2 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                Advanced Filters
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-2"
            >
              <Close />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Amount Range */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                <AttachMoney className="mr-2 text-green-600" />
                Amount Range
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Minimum Amount
                  </label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    placeholder="0.00"
                    value={filters.amountRange.min}
                    onChange={(e) =>
                      handleFilterChange("amountRange", {
                        ...filters.amountRange,
                        min: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Maximum Amount
                  </label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    placeholder="10000.00"
                    value={filters.amountRange.max}
                    onChange={(e) =>
                      handleFilterChange("amountRange", {
                        ...filters.amountRange,
                        max: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Date Range */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                <CalendarToday className="mr-2 text-blue-600" />
                Date Range
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    value={filters.dateRange.start}
                    onChange={(e) =>
                      handleFilterChange("dateRange", {
                        ...filters.dateRange,
                        start: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    value={filters.dateRange.end}
                    onChange={(e) =>
                      handleFilterChange("dateRange", {
                        ...filters.dateRange,
                        end: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                <Category className="mr-2 text-purple-600" />
                Categories
              </h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label key={category.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleFilterChange("categories", [
                            ...filters.categories,
                            category.id,
                          ])
                        } else {
                          handleFilterChange(
                            "categories",
                            filters.categories.filter(
                              (id) => id !== category.id,
                            ),
                          )
                        }
                      }}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {category.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                <Payment className="mr-2 text-green-600" />
                Payment Methods
              </h3>
              <div className="space-y-2">
                {paymentMethods.map((method) => (
                  <label key={method.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.paymentMethods.includes(method.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleFilterChange("paymentMethods", [
                            ...filters.paymentMethods,
                            method.id,
                          ])
                        } else {
                          handleFilterChange(
                            "paymentMethods",
                            filters.paymentMethods.filter(
                              (id) => id !== method.id,
                            ),
                          )
                        }
                      }}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {method.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Employees */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                <People className="mr-2 text-blue-600" />
                Salespeople
              </h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {employees.map((employee) => (
                  <label key={employee.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.employees.includes(
                        employee.id.toString(),
                      )}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleFilterChange("employees", [
                            ...filters.employees,
                            employee.id.toString(),
                          ])
                        } else {
                          handleFilterChange(
                            "employees",
                            filters.employees.filter(
                              (id) => id !== employee.id.toString(),
                            ),
                          )
                        }
                      }}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {employee.first_name} {employee.last_name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Status & Sale Types */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-3">Status & Types</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Status
                  </h4>
                  <div className="space-y-1">
                    {statuses.map((status) => (
                      <label key={status.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.statuses.includes(status.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleFilterChange("statuses", [
                                ...filters.statuses,
                                status.id,
                              ])
                            } else {
                              handleFilterChange(
                                "statuses",
                                filters.statuses.filter(
                                  (id) => id !== status.id,
                                ),
                              )
                            }
                          }}
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {status.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Sale Type
                  </h4>
                  <div className="space-y-1">
                    {saleTypes.map((type) => (
                      <label key={type.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.saleTypes.includes(type.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleFilterChange("saleTypes", [
                                ...filters.saleTypes,
                                type.id,
                              ])
                            } else {
                              handleFilterChange(
                                "saleTypes",
                                filters.saleTypes.filter(
                                  (id) => id !== type.id,
                                ),
                              )
                            }
                          }}
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {type.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-6 border-t">
            <div className="flex justify-between">
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 flex items-center"
              >
                <ClearAll className="mr-2" />
                Reset All
              </button>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApply}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdvancedFilters
