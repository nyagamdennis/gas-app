// @ts-nocheck
import React from "react"
import {
  AccountBalance,
  Warning,
  CheckCircle,
  AssignmentLate,
  ErrorOutline,
} from "@mui/icons-material"
import FormattedAmount from "../FormattedAmount"

const CashReconciliation = ({
  cashVerification,
  onUpdate,
  onReconcile,
  onAssignShortage,
  isFinalized,
  mobile = false,
  cashReconciliationRecord = null,
  reconciliationRecord = null,
}) => {
  const handleActualCashChange = (value) => {
    const actualCash = parseFloat(value) || 0
    const missingCash = cashVerification.expectedCash - actualCash

    onUpdate({
      ...cashVerification,
      actualCash,
      missingCash,
    })
  }

  const getStatusColor = () => {
    if (cashVerification.missingCash === 0)
      return "bg-green-50 border-green-200 text-green-800"
    if (cashVerification.missingCash > 0)
      return "bg-red-50 border-red-200 text-red-800"
    return "bg-yellow-50 border-yellow-200 text-yellow-800"
  }

  const getStatusIcon = () => {
    if (cashVerification.missingCash === 0)
      return <CheckCircle className="text-green-600" />
    if (cashVerification.missingCash > 0)
      return <ErrorOutline className="text-red-600" />
    return <Warning className="text-yellow-600" />
  }

  const getStatusText = () => {
    if (cashVerification.missingCash === 0) return "Perfectly Balanced"
    if (cashVerification.missingCash > 0) return "Cash Shortage"
    return "Cash Excess"
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
        <AccountBalance className="mr-2 text-blue-600" />
        Cash Reconciliation
      </h3>

      <div className="space-y-6">
        {reconciliationRecord && (
          <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200">
            <div className="flex items-center gap-2 text-green-800 font-medium">
              <CheckCircle className="text-green-600" />
              Reconciliation complete
            </div>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-green-700">
              <span>
                Reconciled:{" "}
                {new Date(
                  reconciliationRecord.reconciliation_time,
                ).toLocaleString()}
              </span>
              {reconciliationRecord.cash_difference != null && (
                <span>
                  Difference:{" "}
                  <FormattedAmount
                    amount={parseFloat(reconciliationRecord.cash_difference)}
                  />
                </span>
              )}
            </div>
            {reconciliationRecord.notes && (
              <p className="mt-2 text-sm text-green-600">
                {reconciliationRecord.notes}
              </p>
            )}
          </div>
        )}
        {/* Expected Cash Breakdown */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-3">
            Expected Cash Breakdown
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-blue-700">Sales Cash</span>
              <span className="font-medium">
                <FormattedAmount amount={cashVerification.totalSalesCash} />
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-red-600">Cash Expenses</span>
              <span className="font-medium text-red-600">
                -{" "}
                <FormattedAmount amount={cashVerification.totalCashExpenses} />
              </span>
            </div>
            <div className="pt-2 border-t border-blue-200">
              <div className="flex justify-between items-center">
                <span className="font-medium text-blue-800">
                  Net Expected Cash
                </span>
                <span className="text-lg font-bold text-blue-800">
                  <FormattedAmount amount={cashVerification.expectedCash} />
                </span>
              </div>
              {cashVerification.expectedCash < 0 && (
                <p className="text-xs text-red-600 mt-1">
                  Note: Negative value means expenses exceed cash sales
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Actual Cash Input */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-3">Actual Cash Count</h4>
          <div className="flex items-center">
            <span className="text-gray-600 mr-2">Ksh</span>
            <input
              type="number"
              className="flex-1 text-2xl font-bold text-gray-800 bg-transparent border-none outline-none"
              value={cashVerification.actualCash || ""}
              onChange={(e) => handleActualCashChange(e.target.value)}
              placeholder="0.00"
              min="0"
              disabled={isFinalized}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Enter the actual cash counted in the register
          </p>
        </div>

        {/* Status Display with Assign Button */}
        <div className={`p-4 rounded-lg border ${getStatusColor()}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              {getStatusIcon()}
              <span className="font-medium ml-2">{getStatusText()}</span>
            </div>

            {/* Assign Shortage Button - Positioned in the header */}

            {cashVerification.missingCash !== 0 && !isFinalized && (
              <button
                // onClick={onAssignShortage}
                onClick={(e) => {
                  console.log("Button clicked directly!", e)
                  if (onAssignShortage) {
                    console.log("Handler exists, calling it...")
                    onAssignShortage()
                  } else {
                    console.error("onAssignShortage handler is undefined!")
                  }
                }}
                className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 flex items-center gap-1"
              >
                <AssignmentLate fontSize="small" />
                {cashVerification.missingCash > 0 ? "Assign" : "Assign Excess"}
              </button>
            )}
          </div>

          <div className="flex justify-between items-center mb-2">
            <span>Difference</span>
            <span className="text-xl font-bold">
              <FormattedAmount
                amount={Math.abs(cashVerification.missingCash)}
              />
            </span>
          </div>

          {cashVerification.missingCash !== 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-sm">
                {cashVerification.missingCash > 0
                  ? "There is less cash than expected. Please investigate."
                  : "There is more cash than expected. Please verify."}
              </p>

              {/* Alternative: Button could also go here */}
              {/* {cashVerification.missingCash !== 0 && !isFinalized && (
                <button
                  onClick={onAssignShortage}
                  className="mt-3 w-full px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 flex items-center justify-center gap-2"
                >
                  <AssignmentLate fontSize="small" />
                  {cashVerification.missingCash > 0 ? "Assign Shortage to Employee/Company" : "Assign Excess to Employee/Company"}
                </button>
              )} */}
            </div>
          )}
        </div>

        {/* Notes */}
        <div>
          <h4 className="font-medium text-gray-800 mb-2">
            Reconciliation Notes
          </h4>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 text-sm"
            rows="3"
            value={cashVerification.notes}
            onChange={(e) =>
              onUpdate({ ...cashVerification, notes: e.target.value })
            }
            placeholder="Enter any notes about the cash count..."
            disabled={isFinalized}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() =>
              handleActualCashChange(cashVerification.expectedCash)
            }
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 disabled:opacity-50"
            disabled={isFinalized}
          >
            Set to Expected
          </button>
          <button
            onClick={onReconcile}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
            disabled={isFinalized}
          >
            Record Reconciliation
          </button>
        </div>
      </div>
    </div>
  )
}

export default CashReconciliation
