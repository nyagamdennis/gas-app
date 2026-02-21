// @ts-nocheck
import React, { useState } from "react"
import {
  MoneyOff,
  People,
  Store,
  Warning,
  CheckCircle,
  Cancel,
  Assignment,
  MoreVert,
  Build,
  LocalGasStation,
  Fastfood,
  DirectionsCar,
  Edit,
  Delete,
  Close,
  CheckCircleOutline,
  ErrorOutline,
  Pending,
  Payment,
  AttachMoney,
  Receipt,
} from "@mui/icons-material"
import FormattedAmount from "../FormattedAmount"
import { formatDistanceToNow } from "date-fns"

const ExpensesList = ({
  expenses,
  employeeExpenses,
  companyExpenses,
  onAssignExpense,
  getEmployeeName,
  isFinalized,
  mobile = false,
  onEditExpense, // Add this prop for editing
  onDeleteExpense, // Add this prop for deleting
  employees = [], // Pass employees list for reassignment
  onReassignExpense, // Add this prop for reassigning
}) => {
  const [expandedExpenseId, setExpandedExpenseId] = useState(null)
  const [showReassignModal, setShowReassignModal] = useState(false)
  const [selectedExpenseForReassign, setSelectedExpenseForReassign] =
    useState(null)
  const [reassignData, setReassignData] = useState({
    employeeId: "",
    isCompanyExpense: false,
    deduction_amount: 0,
    notes: "",
  })

  const getStatusBadge = (status) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs flex items-center gap-1">
            <CheckCircle fontSize="small" className="mr-1" /> Approved
          </span>
        )
      case "REJECTED":
        return (
          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs flex items-center gap-1">
            <Cancel fontSize="small" className="mr-1" /> Rejected
          </span>
        )
      case "PENDING":
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs flex items-center gap-1">
            <Pending fontSize="small" className="mr-1" /> Pending
          </span>
        )
      case "PAID":
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center gap-1">
            <Payment fontSize="small" className="mr-1" /> Paid
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

  const getStatusIcon = (status) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle className="text-green-600" fontSize="small" />
      case "REJECTED":
        return <ErrorOutline className="text-red-600" fontSize="small" />
      case "PENDING":
        return <Pending className="text-yellow-600" fontSize="small" />
      case "PAID":
        return <Payment className="text-blue-600" fontSize="small" />
      default:
        return <Receipt className="text-gray-600" fontSize="small" />
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

  // Get attached employees for an expense
  const getAttachedEmployees = (expense) => {
    if (
      expense.employee_attachments &&
      expense.employee_attachments.length > 0
    ) {
      return expense.employee_attachments.map((attachment) => ({
        id: attachment.employee,
        name: attachment.employee_name || getEmployeeName(attachment.employee),
        deductionAmount: attachment.deduction_amount,
        status: attachment.status,
        attachedAt: attachment.attached_at,
        attachmentId: attachment.id,
      }))
    }
    return []
  }

  // Handle reassign click
  const handleReassignClick = (expense) => {
    setSelectedExpenseForReassign(expense)
    setReassignData({
      employeeId: "",
      isCompanyExpense: false,
      deduction_amount: expense.amount || 0,
      notes: "",
    })
    setShowReassignModal(true)
  }

  // Save reassignment
  const saveReassignment = async () => {
    if (!selectedExpenseForReassign) return

    try {
      await onReassignExpense(
        selectedExpenseForReassign.id,
        reassignData.employeeId,
        reassignData,
      )
      setShowReassignModal(false)
      setSelectedExpenseForReassign(null)
    } catch (error) {
      console.error("Error reassigning expense:", error)
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
    <>
      <div className="bg-white rounded-xl shadow-sm border">
        {/* Header with Summary */}
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-gray-800 text-lg">Expenses</h3>
              <div className="flex items-center gap-4 text-sm text-gray-600 mt-1 flex-wrap">
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
          {expenses.map((expense) => {
            const attachedEmployees = getAttachedEmployees(expense)
            const hasAttachments = attachedEmployees.length > 0

            return (
              <div
                key={expense.id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    {/* Title and Status Row */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="font-bold text-gray-800 truncate">
                        {expense.title}
                      </span>
                      {getStatusBadge(expense.status)}
                      {expense.expense_type && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                          {expense.expense_type}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {expense.description || "No description provided"}
                    </p>

                    {/* Category and Payment Method */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-2 flex-wrap">
                      <span className="flex items-center">
                        {getCategoryIcon(expense.category?.name)}
                        <span className="ml-1">
                          {expense.category?.name || "Uncategorized"}
                        </span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center">
                        <AttachMoney fontSize="small" className="mr-1" />
                        {expense.payment_method}
                      </span>
                      {expense.payment_reference && (
                        <>
                          <span>•</span>
                          <span className="text-xs">
                            Ref: {expense.payment_reference}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Attached Employees Section */}
                    {hasAttachments && (
                      <div className="mt-3 space-y-2">
                        <div className="text-xs font-medium text-gray-500 flex items-center">
                          <People fontSize="small" className="mr-1" />
                          Attached to:
                        </div>
                        {attachedEmployees.map((attached, idx) => (
                          <div
                            key={idx}
                            className="bg-blue-50 rounded-lg p-2 border border-blue-100"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-sm">
                                    {attached.name}
                                  </span>
                                  <span
                                    className={`text-xs px-2 py-0.5 rounded-full ${
                                      attached.status === "PENDING"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : attached.status === "APPROVED"
                                        ? "bg-green-100 text-green-800"
                                        : attached.status === "REJECTED"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-gray-100 text-gray-800"
                                    }`}
                                  >
                                    {attached.status}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-600 mt-1">
                                  <span className="font-medium">
                                    Deduction:{" "}
                                  </span>
                                  <FormattedAmount
                                    amount={attached.deductionAmount}
                                  />
                                </div>
                                {attached.attachedAt && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    {formatDistanceToNow(
                                      new Date(attached.attachedAt),
                                      { addSuffix: true },
                                    )}
                                  </div>
                                )}
                              </div>
                              {!isFinalized && (
                                <button
                                  onClick={() => handleReassignClick(expense)}
                                  className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                                  title="Reassign"
                                >
                                  <Edit fontSize="small" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Receipt Info */}
                    {expense.receipt_number && (
                      <div className="mt-2 text-xs text-gray-500 flex items-center">
                        <Receipt fontSize="small" className="mr-1" />
                        Receipt: {expense.receipt_number}
                      </div>
                    )}

                    {/* Notes */}
                    {expense.notes && (
                      <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        <span className="font-medium">Notes:</span>{" "}
                        {expense.notes}
                      </div>
                    )}
                  </div>

                  {/* Amount and Actions */}
                  <div className="ml-4 flex flex-col items-end">
                    <div className="text-lg font-bold text-red-600 mb-2">
                      <FormattedAmount amount={expense.amount} />
                    </div>
                    {expense.tax_amount > 0 && (
                      <div className="text-xs text-gray-500 mb-2">
                        Tax: <FormattedAmount amount={expense.tax_amount} />
                      </div>
                    )}
                    <div className="flex gap-1">
                      {!hasAttachments && !isFinalized && (
                        <button
                          onClick={() => onAssignExpense(expense)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                          title="Assign Expense"
                        >
                          <Assignment fontSize="small" />
                        </button>
                      )}
                      {!isFinalized && onEditExpense && (
                        <button
                          onClick={() => onEditExpense(expense)}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                          title="Edit Expense"
                        >
                          <Edit fontSize="small" />
                        </button>
                      )}
                      {!isFinalized && onDeleteExpense && (
                        <button
                          onClick={() => onDeleteExpense(expense)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                          title="Delete Expense"
                        >
                          <Delete fontSize="small" />
                        </button>
                      )}
                      <button
                        onClick={() =>
                          setExpandedExpenseId(
                            expandedExpenseId === expense.id
                              ? null
                              : expense.id,
                          )
                        }
                        className="p-1.5 text-gray-600 hover:bg-gray-50 rounded"
                      >
                        <MoreVert fontSize="small" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedExpenseId === expense.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Created</p>
                        <p className="font-medium">
                          {new Date(expense.created_at).toLocaleString()}
                        </p>
                      </div>
                      {expense.approved_at && (
                        <div>
                          <p className="text-gray-500">Approved</p>
                          <p className="font-medium">
                            {new Date(expense.approved_at).toLocaleString()}
                          </p>
                        </div>
                      )}
                      {expense.payment_date && (
                        <div>
                          <p className="text-gray-500">Paid</p>
                          <p className="font-medium">
                            {new Date(expense.payment_date).toLocaleString()}
                          </p>
                        </div>
                      )}
                      {expense.rejection_reason && (
                        <div className="col-span-2">
                          <p className="text-gray-500">Rejection Reason</p>
                          <p className="font-medium text-red-600">
                            {expense.rejection_reason}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
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
              <div className="text-xs text-gray-500">
                {expenses.length} total
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reassign Modal */}
      {showReassignModal && selectedExpenseForReassign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">
                  Reassign Expense
                </h3>
                <button
                  onClick={() => setShowReassignModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Close />
                </button>
              </div>

              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">
                  {selectedExpenseForReassign.title}
                </p>
                <p className="text-sm text-gray-600">
                  Amount:{" "}
                  <FormattedAmount amount={selectedExpenseForReassign.amount} />
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assign to
                  </label>
                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        setReassignData((prev) => ({
                          ...prev,
                          isCompanyExpense: false,
                        }))
                      }
                      className={`flex-1 py-2 rounded-lg text-sm ${
                        !reassignData.isCompanyExpense
                          ? "bg-blue-100 text-blue-700 border-2 border-blue-300"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      Employee
                    </button>
                    <button
                      onClick={() =>
                        setReassignData((prev) => ({
                          ...prev,
                          isCompanyExpense: true,
                          employeeId: "",
                        }))
                      }
                      className={`flex-1 py-2 rounded-lg text-sm ${
                        reassignData.isCompanyExpense
                          ? "bg-green-100 text-green-700 border-2 border-green-300"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      Company
                    </button>
                  </div>
                </div>

                {!reassignData.isCompanyExpense && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Employee
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                      value={reassignData.employeeId}
                      onChange={(e) =>
                        setReassignData((prev) => ({
                          ...prev,
                          employeeId: e.target.value,
                        }))
                      }
                    >
                      <option value="">Select Employee</option>
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.first_name} {emp.last_name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deduction Amount
                  </label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                    value={reassignData.deduction_amount}
                    onChange={(e) =>
                      setReassignData((prev) => ({
                        ...prev,
                        deduction_amount: parseFloat(e.target.value) || 0,
                      }))
                    }
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                    rows="3"
                    value={reassignData.notes}
                    onChange={(e) =>
                      setReassignData((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    placeholder="Enter reassignment notes..."
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    onClick={() => setShowReassignModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveReassignment}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
                  >
                    Save Reassignment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ExpensesList
