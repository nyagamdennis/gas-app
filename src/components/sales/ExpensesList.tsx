// @ts-nocheck
import React from "react"
import {
  MoneyOff,
  People,
  Store,
  Warning,
  CheckCircle,
  Cancel,
  Assignment,
  MoreVert,
} from "@mui/icons-material"
import FormattedAmount from "../FormattedAmount"

const ExpensesList = ({
  expenses,
  employeeExpenses,
  companyExpenses,
  onAssignExpense,
  getEmployeeName,
  isFinalized,
  mobile = false,
}) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs flex items-center">
            <CheckCircle fontSize="small" className="mr-1" /> Approved
          </span>
        )
      case "REJECTED":
        return (
          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs flex items-center">
            <Cancel fontSize="small" className="mr-1" /> Rejected
          </span>
        )
      case "PENDING":
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs flex items-center">
            <Warning fontSize="small" className="mr-1" /> Pending
          </span>
        )
      default:
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
            Unknown
          </span>
        )
    }
  }

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case "fuel":
        return <LocalGasStation className="text-orange-500" fontSize="small" />
      case "food":
        return <Fastfood className="text-red-500" fontSize="small" />
      case "transport":
        return <DirectionsCar className="text-blue-500" fontSize="small" />
      case "maintenance":
        return <Build className="text-yellow-500" fontSize="small" />
      default:
        return <MoneyOff className="text-gray-500" fontSize="small" />
    }
  }

  const totalExpenses = expenses.reduce(
    (sum, exp) => sum + (parseFloat(exp.amount) || 0),
    0,
  )
  const totalEmployeeExpenses = employeeExpenses.reduce(
    (sum, exp) => sum + (parseFloat(exp.amount) || 0),
    0,
  )
  const totalCompanyExpenses = companyExpenses.reduce(
    (sum, exp) => sum + (parseFloat(exp.amount) || 0),
    0,
  )

  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 text-center">
        <MoneyOff className="text-gray-300 text-4xl mx-auto mb-3" />
        <p className="text-gray-500">No expenses found</p>
        <p className="text-sm text-gray-400 mt-1">
          All expenses will appear here
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border">
      {/* Header with Summary */}
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-gray-800 text-lg">Expenses</h3>
            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
              <span className="flex items-center">
                <People className="mr-1" fontSize="small" />
                Employee:{" "}
                <FormattedAmount
                  amount={totalEmployeeExpenses}
                  className="ml-1 font-medium"
                />
              </span>
              <span className="flex items-center">
                <Store className="mr-1" fontSize="small" />
                Company:{" "}
                <FormattedAmount
                  amount={totalCompanyExpenses}
                  className="ml-1 font-medium"
                />
              </span>
              <span className="font-bold">
                Total: <FormattedAmount amount={totalExpenses} />
              </span>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {expenses.length} expenses
          </div>
        </div>
      </div>

      {/* Expenses List */}
      <div className="divide-y divide-gray-100">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="font-bold text-gray-800 truncate">
                    {expense.title}
                  </span>
                  {getStatusBadge(expense.status)}
                  {expense.employee_id && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center">
                      <People fontSize="small" className="mr-1" />
                      Employee
                    </span>
                  )}
                  {expense.is_company_expense && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs flex items-center">
                      <Store fontSize="small" className="mr-1" />
                      Company
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {expense.description || "No description provided"}
                </p>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    {getCategoryIcon(expense.category?.name)}
                    <span className="ml-1">
                      {expense.category?.name || "Uncategorized"}
                    </span>
                  </span>
                  <span>•</span>
                  <span>{expense.payment_method}</span>
                  {expense.employee_id && (
                    <>
                      <span>•</span>
                      <span>
                        Assigned to: {getEmployeeName(expense.employee_id)}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="ml-4 flex flex-col items-end">
                <div className="text-lg font-bold text-red-600 mb-2">
                  <FormattedAmount amount={expense.amount} />
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => onAssignExpense(expense)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                    title="Assign Expense"
                    disabled={isFinalized}
                  >
                    <Assignment fontSize="small" />
                  </button>
                  <button className="p-1.5 text-gray-600 hover:bg-gray-50 rounded">
                    <MoreVert fontSize="small" />
                  </button>
                </div>
              </div>
            </div>

            {/* Expense Details */}
            {expense.notes && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Notes:</span> {expense.notes}
                </p>
              </div>
            )}

            {/* Attachments */}
            {expense.attachments && expense.attachments.length > 0 && (
              <div className="mt-3">
                <div className="flex flex-wrap gap-2">
                  {expense.attachments.slice(0, 3).map((attachment, index) => (
                    <a
                      key={index}
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200"
                    >
                      Attachment {index + 1}
                    </a>
                  ))}
                  {expense.attachments.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      +{expense.attachments.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary Footer */}
      <div className="p-4 border-t bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-sm text-gray-600">Employee Expenses</div>
            <div className="text-lg font-bold text-blue-600">
              <FormattedAmount amount={totalEmployeeExpenses} />
            </div>
            <div className="text-xs text-gray-500">
              {employeeExpenses.length} expenses
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">Company Expenses</div>
            <div className="text-lg font-bold text-green-600">
              <FormattedAmount amount={totalCompanyExpenses} />
            </div>
            <div className="text-xs text-gray-500">
              {companyExpenses.length} expenses
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">Total Expenses</div>
            <div className="text-lg font-bold text-red-600">
              <FormattedAmount amount={totalExpenses} />
            </div>
            <div className="text-xs text-gray-500">{expenses.length} total</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExpensesList
