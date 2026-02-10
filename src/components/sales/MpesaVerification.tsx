// @ts-nocheck
import React from "react"
import {
  CreditScore,
  CheckCircle,
  Warning,
  ErrorOutline,
  Phone,
  Receipt,
  Search,
  AssignmentLate,
} from "@mui/icons-material"
import FormattedAmount from "../FormattedAmount"

const MpesaVerification = ({
  mpesaVerification,
  onUpdate,
  onVerify,
  isFinalized,
  onAssignShortage,
  mobile = false,
}) => {
  const handleVerifyPayment = (paymentIndex) => {
    const updatedPayments = [...mpesaVerification.unverifiedPayments]
    updatedPayments.splice(paymentIndex, 1)
    onUpdate({
      ...mpesaVerification,
      unverifiedPayments: updatedPayments,
    })
  }

  const handleVerifyAll = () => {
    onUpdate({
      ...mpesaVerification,
      unverifiedPayments: [],
    })
  }

  const totalUnverifiedAmount = mpesaVerification.unverifiedPayments.reduce(
    (sum, payment) => sum + parseFloat(payment.amount || 0),
    0,
  )

  // Calculate total shortage as total unverified M-Pesa
  const totalShortage = totalUnverifiedAmount

  // Calculate missing M-Pesa as difference between expected and verified
  const missingMpesa =
    mpesaVerification.missingMpesa !== undefined
      ? mpesaVerification.missingMpesa
      : totalUnverifiedAmount
      console.log('missing mpesa ', missingMpesa)

  const getStatusColor = () => {
    if (mpesaVerification.unverifiedPayments.length === 0) {
      return "bg-green-50 border-green-200 text-green-800"
    } else if (mpesaVerification.unverifiedPayments.length <= 3) {
      return "bg-yellow-50 border-yellow-200 text-yellow-800"
    } else {
      return "bg-red-50 border-red-200 text-red-800"
    }
  }

  const getStatusIcon = () => {
    if (mpesaVerification.unverifiedPayments.length === 0) {
      return <CheckCircle className="text-green-600" />
    } else {
      return <Warning className="text-yellow-600" />
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
        <CreditScore className="mr-2 text-purple-600" />
        M-Pesa Verification
      </h3>

      <div className="space-y-6">
        {/* M-Pesa Summary */}
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-medium text-purple-800 mb-3">M-Pesa Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-3 rounded-lg">
              <div className="text-sm text-purple-700 mb-1">
                Total M-Pesa Sales
              </div>
              <div className="text-xl font-bold">
                <FormattedAmount amount={mpesaVerification.totalSalesMpesa} />
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <div className="text-sm text-purple-700 mb-1">
                M-Pesa Expenses
              </div>
              <div className="text-xl font-bold text-red-600">
                <FormattedAmount
                  amount={mpesaVerification.totalMpesaExpenses}
                />
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <div className="text-sm text-purple-700 mb-1">
                Unverified M-Pesa
              </div>
              <div className="text-xl font-bold text-red-600">
                <FormattedAmount amount={totalUnverifiedAmount} />
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-purple-200">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium text-purple-800">
                  Net Expected M-Pesa
                </div>
                <div className="text-sm text-purple-600">
                  Sales - Company M-Pesa Expenses
                </div>
              </div>
              <div className="text-2xl font-bold text-purple-800">
                <FormattedAmount amount={mpesaVerification.expectedMpesa} />
              </div>
            </div>
          </div>
        </div>

        {/* Verification Status */}
        <div className={`p-4 rounded-lg border ${getStatusColor()}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              {getStatusIcon()}
              <span className="font-medium ml-2">
                {mpesaVerification.unverifiedPayments.length === 0
                  ? "All Payments Verified"
                  : `${mpesaVerification.unverifiedPayments.length} Unverified Payments`}
              </span>
            </div>

            {/* Assign Shortage Button - Show when there's unverified M-Pesa */}
            {totalUnverifiedAmount > 0 && !isFinalized && (
              <button
                onClick={() => onAssignShortage(totalUnverifiedAmount)}
                className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 flex items-center gap-1"
              >
                <AssignmentLate fontSize="small" />
                Assign Shortage
              </button>
            )}
          </div>

          {mpesaVerification.unverifiedPayments.length > 0 ? (
            <div>
              <div className="flex justify-between items-center mb-2">
                <span>Unverified Amount</span>
                <span className="text-xl font-bold">
                  <FormattedAmount amount={totalUnverifiedAmount} />
                </span>
              </div>
              <p className="text-sm mt-2">
                This amount will be considered as shortage until verified
              </p>
            </div>
          ) : (
            <p className="text-sm">
              All M-Pesa payments have been verified against statements
            </p>
          )}

          {/* Show total shortage amount */}
          {totalUnverifiedAmount > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="font-medium flex items-center">
                  <Warning className="mr-2 text-red-600" fontSize="small" />
                  Total Shortage
                </span>
                <span className="text-lg font-bold text-red-700">
                  <FormattedAmount amount={totalUnverifiedAmount} />
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                This amount needs to be assigned to an employee or marked as
                company loss
              </p>
            </div>
          )}
        </div>

        {/* Unverified Payments List */}
        {mpesaVerification.unverifiedPayments.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium text-gray-800">Unverified Payments</h4>
              <div className="flex items-center gap-2">
                <div className="text-sm text-gray-600">
                  Total: <FormattedAmount amount={totalUnverifiedAmount} />
                </div>
                <button
                  onClick={handleVerifyAll}
                  className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 flex items-center"
                  disabled={isFinalized}
                >
                  <CheckCircle fontSize="small" className="mr-1" />
                  Verify All
                </button>
              </div>
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {mpesaVerification.unverifiedPayments.map((payment, index) => (
                <div
                  key={index}
                  className="bg-red-50 border border-red-200 rounded-lg p-3"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium flex items-center">
                        <Receipt
                          className="mr-2 text-red-600"
                          fontSize="small"
                        />
                        Invoice: {payment.invoice}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Receipt: {payment.receipt || "Not provided"}
                      </div>
                    </div>
                    <div className="text-lg font-bold text-red-700">
                      <FormattedAmount amount={payment.amount} />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone fontSize="small" className="mr-1" />
                      {payment.phone}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          window.open(`/sales/${payment.saleId}`, "_blank")
                        }
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        View Sale
                      </button>
                      <button
                        onClick={() => handleVerifyPayment(index)}
                        className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                        disabled={isFinalized}
                      >
                        Verify
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Manual Verification */}
        <div>
          <h4 className="font-medium text-gray-800 mb-3">
            Manual Verification
          </h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <Search className="text-gray-400 mr-2" />
              <input
                type="text"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                placeholder="Search by M-Pesa receipt number..."
                disabled={isFinalized}
              />
            </div>
            <p className="text-sm text-gray-600">
              Enter M-Pesa receipt numbers to verify payments against your
              statements
            </p>
          </div>
        </div>

        {/* Shortage Breakdown */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-medium text-yellow-800 mb-3">
            Shortage Breakdown
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-700">Total Unverified M-Pesa:</span>
              <span className="font-medium">
                <FormattedAmount amount={totalUnverifiedAmount} />
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Verified M-Pesa:</span>
              <span className="font-medium text-green-700">
                <FormattedAmount
                  amount={
                    mpesaVerification.expectedMpesa - totalUnverifiedAmount
                  }
                />
              </span>
            </div>
            <div className="pt-2 border-t border-yellow-300">
              <div className="flex justify-between">
                <span className="font-medium text-red-700">
                  Total Shortage:
                </span>
                <span className="font-bold text-red-700 text-lg">
                  <FormattedAmount amount={totalUnverifiedAmount} />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Verification Notes
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 text-sm"
            rows="3"
            value={mpesaVerification.notes}
            onChange={(e) =>
              onUpdate({ ...mpesaVerification, notes: e.target.value })
            }
            placeholder="Enter any notes about M-Pesa verification or shortage assignment..."
            disabled={isFinalized}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleVerifyAll}
            className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
            disabled={
              isFinalized || mpesaVerification.unverifiedPayments.length === 0
            }
          >
            Verify All Payments
          </button>
          <button
            onClick={() => onVerify(totalUnverifiedAmount)}
            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50"
            disabled={isFinalized}
          >
            Record Verification (
            {totalUnverifiedAmount > 0
              ? `${mpesaVerification.unverifiedPayments.length} Unverified`
              : "All Verified"}
            )
          </button>
        </div>
      </div>
    </div>
  )
}

export default MpesaVerification
