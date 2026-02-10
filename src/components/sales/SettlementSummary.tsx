// @ts-nocheck
import React from "react"
import {
  AssignmentTurnedIn,
  Lock,
  LockOpen,
  AttachMoney,
  CreditScore,
  TrendingUp,
  TrendingDown,
  Warning,
  CheckCircle,
} from "@mui/icons-material"
import FormattedAmount from "../FormattedAmount"

const SettlementSummary = ({
  statistics,
  cashVerification,
  mpesaVerification,
  dailySettlement,
  isFinalized,
  onFinalize,
  mobile = false,
}) => {
  const netBalance =
    (cashVerification.expectedCash || 0) +
    (mpesaVerification.expectedMpesa || 0)
  const cashStatus =
    cashVerification.missingCash === 0
      ? "balanced"
      : cashVerification.missingCash > 0
      ? "shortage"
      : "excess"
  const mpesaStatus =
    mpesaVerification.unverifiedPayments.length === 0
      ? "verified"
      : "unverified"

  const getCashStatusColor = () => {
    switch (cashStatus) {
      case "balanced":
        return "text-green-600 bg-green-50 border-green-200"
      case "shortage":
        return "text-red-600 bg-red-50 border-red-200"
      case "excess":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getMpesaStatusColor = () => {
    switch (mpesaStatus) {
      case "verified":
        return "text-green-600 bg-green-50 border-green-200"
      case "unverified":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <AssignmentTurnedIn className="mr-2 text-green-600" />
          Daily Settlement Summary
        </h3>
        <div
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            isFinalized
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {isFinalized ? (
            <span className="flex items-center">
              <Lock fontSize="small" className="mr-1" />
              Finalized
            </span>
          ) : (
            <span className="flex items-center">
              <LockOpen fontSize="small" className="mr-1" />
              Pending Finalization
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue & Expenses */}
        <div className="bg-gray-50 rounded-xl p-5">
          <h4 className="font-bold text-gray-800 mb-4">Revenue & Expenses</h4>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Total Sales</span>
                <span className="font-bold">
                  <FormattedAmount amount={statistics?.total_sales || 0} />
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: "100%" }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Total Expenses</span>
                <span className="font-bold text-red-600">
                  <FormattedAmount amount={statistics?.total_expenses || 0} />
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      ((statistics?.total_expenses || 0) /
                        (statistics?.total_sales || 1)) *
                        100,
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="font-medium">Net Profit</span>
                <span
                  className={`text-xl font-bold ${
                    (statistics?.total_profit || 0) >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  <FormattedAmount amount={statistics?.total_profit || 0} />
                </span>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Margin:{" "}
                {statistics?.total_sales
                  ? (
                      ((statistics?.total_profit || 0) /
                        statistics.total_sales) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </div>
            </div>
          </div>
        </div>

        {/* Cash Position */}
        <div className="bg-blue-50 rounded-xl p-5">
          <h4 className="font-bold text-gray-800 mb-4 flex items-center">
            <AttachMoney className="mr-2 text-blue-600" />
            Cash Position
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Expected Cash</span>
              <span className="font-bold">
                <FormattedAmount amount={cashVerification.expectedCash} />
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Actual Cash</span>
              <span className="font-bold">
                <FormattedAmount amount={cashVerification.actualCash} />
              </span>
            </div>
            <div className={`p-3 rounded-lg border ${getCashStatusColor()}`}>
              <div className="flex justify-between items-center">
                <span className="font-medium">Difference</span>
                <span className="text-lg font-bold">
                  <FormattedAmount
                    amount={Math.abs(cashVerification.missingCash)}
                  />
                </span>
              </div>
              <div className="text-sm mt-1">
                {cashStatus === "balanced" && "✓ Perfectly balanced"}
                {cashStatus === "shortage" && "⚠ Cash shortage detected"}
                {cashStatus === "excess" && "⚠ Cash excess detected"}
              </div>
            </div>
          </div>
        </div>

        {/* M-Pesa Position */}
        <div className="bg-purple-50 rounded-xl p-5">
          <h4 className="font-bold text-gray-800 mb-4 flex items-center">
            <CreditScore className="mr-2 text-purple-600" />
            M-Pesa Position
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Expected M-Pesa</span>
              <span className="font-bold">
                <FormattedAmount amount={mpesaVerification.expectedMpesa} />
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Unverified Payments</span>
              <span className="font-bold">
                {mpesaVerification.unverifiedPayments.length}
              </span>
            </div>
            <div className={`p-3 rounded-lg border ${getMpesaStatusColor()}`}>
              <div className="flex justify-between items-center">
                <span className="font-medium">Status</span>
                <span className="text-sm font-medium">
                  {mpesaStatus === "verified"
                    ? "All Verified"
                    : "Needs Attention"}
                </span>
              </div>
              <div className="text-sm mt-1">
                {mpesaStatus === "verified" && "✓ All payments verified"}
                {mpesaStatus === "unverified" &&
                  `⚠ ${mpesaVerification.unverifiedPayments.length} unverified payments`}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final Balance */}
      <div className="mt-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm opacity-90">Final Balance</div>
            <div className="text-3xl font-bold mt-1">
              <FormattedAmount amount={netBalance} />
            </div>
            <div className="text-sm opacity-90 mt-2">
              Cash: <FormattedAmount amount={cashVerification.expectedCash} /> +
              M-Pesa:{" "}
              <FormattedAmount amount={mpesaVerification.expectedMpesa} />
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-90">Daily Profit</div>
            <div
              className={`text-2xl font-bold mt-1 ${
                (statistics?.total_profit || 0) >= 0
                  ? "text-green-300"
                  : "text-red-300"
              }`}
            >
              <FormattedAmount amount={statistics?.total_profit || 0} />
            </div>
            <div className="text-sm opacity-90 mt-2">
              {statistics?.sales_count || 0} transactions
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {!isFinalized && (
        <div className="mt-6 pt-6 border-t">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Once finalized, no further changes can be made to this day's data.
            </div>
            <button
              onClick={onFinalize}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center"
            >
              <AssignmentTurnedIn className="mr-2" />
              Finalize Settlement
            </button>
          </div>
        </div>
      )}

      {/* Finalization Details */}
      {isFinalized && dailySettlement && (
        <div className="mt-6 bg-gray-50 rounded-xl p-5">
          <h4 className="font-bold text-gray-800 mb-4">Finalization Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">Finalized By</div>
              <div className="font-medium">
                {dailySettlement.finalized_by?.name || "System"}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Finalized At</div>
              <div className="font-medium">
                {new Date(dailySettlement.finalized_at).toLocaleString()}
              </div>
            </div>
            {dailySettlement.settlement_notes && (
              <div className="md:col-span-2">
                <div className="text-sm text-gray-600">Finalization Notes</div>
                <div className="mt-1 p-3 bg-white rounded-lg border">
                  {dailySettlement.settlement_notes}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default SettlementSummary
