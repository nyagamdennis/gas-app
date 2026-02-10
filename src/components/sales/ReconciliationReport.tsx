// @ts-nocheck

import React from "react"
import {
  AssignmentTurnedIn,
  CheckCircle,
  Warning,
  ErrorOutline,
  AttachMoney,
  CreditScore,
  Description,
} from "@mui/icons-material"
import FormattedAmount from "../FormattedAmount"

const ReconciliationReport = ({
  open,
  onClose,
  cashVerification,
  mpesaVerification,
  discrepancies,
}) => {
  if (!open) return null

  const getCashStatus = () => {
    if (cashVerification.missingCash === 0)
      return {
        text: "Balanced",
        color: "text-green-600",
        bg: "bg-green-50",
        icon: <CheckCircle />,
      }
    if (cashVerification.missingCash > 0)
      return {
        text: "Shortage",
        color: "text-red-600",
        bg: "bg-red-50",
        icon: <ErrorOutline />,
      }
    return {
      text: "Excess",
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      icon: <Warning />,
    }
  }

  const getMpesaStatus = () => {
    if (mpesaVerification.unverifiedPayments.length === 0)
      return {
        text: "All Verified",
        color: "text-green-600",
        bg: "bg-green-50",
        icon: <CheckCircle />,
      }
    return {
      text: "Unverified Payments",
      color: "text-red-600",
      bg: "bg-red-50",
      icon: <Warning />,
    }
  }

  const cashStatus = getCashStatus()
  const mpesaStatus = getMpesaStatus()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <AssignmentTurnedIn className="mr-2 text-blue-600" />
                Reconciliation Report
              </h2>
              <p className="text-gray-600">Detailed reconciliation analysis</p>
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

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div
              className={`p-4 rounded-lg border ${cashStatus.bg} ${cashStatus.color} border-current`}
            >
              <div className="flex items-center mb-3">
                {cashStatus.icon}
                <span className="font-bold ml-2">Cash Reconciliation</span>
              </div>
              <div className="text-3xl font-bold mb-2">
                <FormattedAmount
                  amount={Math.abs(cashVerification.missingCash)}
                />
              </div>
              <div className="text-sm">
                {cashStatus.text} • Expected:{" "}
                <FormattedAmount amount={cashVerification.expectedCash} />
              </div>
              <div className="text-sm mt-1">
                Actual: <FormattedAmount amount={cashVerification.actualCash} />
              </div>
            </div>

            <div
              className={`p-4 rounded-lg border ${mpesaStatus.bg} ${mpesaStatus.color} border-current`}
            >
              <div className="flex items-center mb-3">
                {mpesaStatus.icon}
                <span className="font-bold ml-2">M-Pesa Verification</span>
              </div>
              <div className="text-3xl font-bold mb-2">
                {mpesaVerification.unverifiedPayments.length}
              </div>
              <div className="text-sm">
                {mpesaStatus.text} • Total:{" "}
                <FormattedAmount amount={mpesaVerification.expectedMpesa} />
              </div>
              <div className="text-sm mt-1">
                Unverified amount:{" "}
                <FormattedAmount
                  amount={mpesaVerification.unverifiedPayments.reduce(
                    (sum, p) => sum + parseFloat(p.amount || 0),
                    0,
                  )}
                />
              </div>
            </div>
          </div>

          {/* Detailed Cash Breakdown */}
          <div className="bg-gray-50 rounded-xl p-5 mb-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center">
              <AttachMoney className="mr-2 text-blue-600" />
              Cash Breakdown
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Sales Cash</div>
                  <div className="text-xl font-bold text-green-600">
                    <FormattedAmount amount={cashVerification.totalSalesCash} />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Total cash from sales
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">
                    Cash Expenses
                  </div>
                  <div className="text-xl font-bold text-red-600">
                    <FormattedAmount
                      amount={cashVerification.totalCashExpenses}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Paid out in cash
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <div className="font-medium">Net Expected Cash</div>
                    <div className="text-sm text-gray-500">
                      Sales Cash - Cash Expenses
                    </div>
                  </div>
                  <div className="text-2xl font-bold">
                    <FormattedAmount amount={cashVerification.expectedCash} />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Actual Cash Counted</div>
                    <div className="text-sm text-gray-500">
                      Physical cash count
                    </div>
                  </div>
                  <div className="text-2xl font-bold">
                    <FormattedAmount amount={cashVerification.actualCash} />
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-lg ${cashStatus.bg}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Difference</div>
                    <div className="text-sm text-gray-500">Variance amount</div>
                  </div>
                  <div className={`text-2xl font-bold ${cashStatus.color}`}>
                    <FormattedAmount
                      amount={Math.abs(cashVerification.missingCash)}
                    />
                  </div>
                </div>
                {cashVerification.missingCash !== 0 && (
                  <div className="mt-2 text-sm">
                    {cashVerification.missingCash > 0
                      ? "There is less cash than expected. Please investigate potential issues."
                      : "There is more cash than expected. Please verify all transactions."}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* M-Pesa Verification Details */}
          <div className="bg-gray-50 rounded-xl p-5 mb-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center">
              <CreditScore className="mr-2 text-purple-600" />
              M-Pesa Verification Details
            </h3>

            <div className="mb-4">
              <div className="flex justify-between items-center p-3 bg-white rounded-lg mb-2">
                <div>
                  <div className="font-medium">Total M-Pesa Sales</div>
                  <div className="text-sm text-gray-500">
                    From all sales transactions
                  </div>
                </div>
                <div className="text-xl font-bold">
                  <FormattedAmount amount={mpesaVerification.totalSalesMpesa} />
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                <div>
                  <div className="font-medium">M-Pesa Expenses</div>
                  <div className="text-sm text-gray-500">Paid via M-Pesa</div>
                </div>
                <div className="text-xl font-bold text-red-600">
                  <FormattedAmount
                    amount={mpesaVerification.totalMpesaExpenses}
                  />
                </div>
              </div>
            </div>

            {/* Unverified Payments */}
            {mpesaVerification.unverifiedPayments.length > 0 ? (
              <div>
                <h4 className="font-medium text-gray-700 mb-3">
                  Unverified Payments (
                  {mpesaVerification.unverifiedPayments.length})
                </h4>
                <div className="space-y-3">
                  {mpesaVerification.unverifiedPayments
                    .slice(0, 5)
                    .map((payment, index) => (
                      <div
                        key={index}
                        className="bg-red-50 border border-red-200 rounded-lg p-3"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-medium">
                              Invoice: {payment.invoice}
                            </div>
                            <div className="text-sm text-gray-600">
                              Receipt: {payment.receipt || "Not provided"}
                            </div>
                          </div>
                          <div className="text-lg font-bold text-red-700">
                            <FormattedAmount amount={payment.amount} />
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          Phone: {payment.phone} • Sale ID: {payment.saleId}
                        </div>
                      </div>
                    ))}
                  {mpesaVerification.unverifiedPayments.length > 5 && (
                    <div className="text-center text-sm text-gray-500">
                      + {mpesaVerification.unverifiedPayments.length - 5} more
                      unverified payments
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <CheckCircle className="text-green-500 text-4xl mx-auto mb-2" />
                <p className="text-green-600 font-medium">
                  All M-Pesa payments verified
                </p>
                <p className="text-gray-500 text-sm">
                  No unverified payments found
                </p>
              </div>
            )}
          </div>

          {/* Notes Section */}
          <div className="bg-gray-50 rounded-xl p-5">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center">
              <Description className="mr-2 text-gray-600" />
              Reconciliation Notes
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cash Reconciliation Notes
                </label>
                <div className="bg-white p-3 rounded-lg border min-h-20">
                  {cashVerification.notes || "No notes provided"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  M-Pesa Verification Notes
                </label>
                <div className="bg-white p-3 rounded-lg border min-h-20">
                  {mpesaVerification.notes || "No notes provided"}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 pt-6 border-t">
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                Print Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReconciliationReport
