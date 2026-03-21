// @ts-nocheck
import React, { useState, useEffect } from "react"
import {
  CreditScore,
  CheckCircle,
  Warning,
  ErrorOutline,
  Phone,
  Receipt,
  Search,
  AssignmentLate,
  Undo,
} from "@mui/icons-material"
import FormattedAmount from "../FormattedAmount"

const MpesaVerification = ({
  mpesaVerification,
  onUpdate,
  onVerifyPayment, // New prop
  onUnverifyPayment, // New prop
  onVerifyAllPayments, // New prop
  onVerify,
  onMpesaReconcile,
  isFinalized,
  onAssignShortage,
  mobile = false,
  reconciliationRecord = null,
}) => {
  // Add state for search term and verified payments view
  const [searchReceipt, setSearchReceipt] = useState("")
  const [showVerifiedPayments, setShowVerifiedPayments] = useState(false)

  // Calculate verified and unverified amounts
  const totalUnverifiedAmount =
    mpesaVerification.unverifiedPayments?.reduce(
      (sum, payment) => sum + parseFloat(payment.amount || 0),
      0,
    ) || 0

  const totalVerifiedAmount =
    mpesaVerification.verifiedPayments?.reduce(
      (sum, payment) => sum + parseFloat(payment.amount || 0),
      0,
    ) || 0

  // FIX: Calculate actual M-Pesa balance (verified amount only)
  const actualMpesaBalance = totalVerifiedAmount

  // FIX: Calculate missing amount correctly (expected - verified)
  const missingAmount =
    (mpesaVerification.expectedMpesa || 0) - actualMpesaBalance

  // Sync missingMpesa with parent component
  useEffect(() => {
    // Only update if the calculated missing amount differs from what's in the parent
    if (mpesaVerification.missingMpesa !== missingAmount) {
      onUpdate({
        ...mpesaVerification,
        actualMpesa: actualMpesaBalance,
        missingMpesa: missingAmount,
      })
    }
  }, [actualMpesaBalance, missingAmount, mpesaVerification, onUpdate])

  const handleVerifyPayment = async (paymentIndex) => {
    const paymentToVerify = mpesaVerification.unverifiedPayments[paymentIndex]

    try {
      // Call API to update is_verified
      await onVerifyPayment(paymentToVerify.paymentId, true)

      // Update local state (this will be refreshed by loadDataForDate)
      // But we'll update optimistically for better UX
      const updatedUnverified = [...mpesaVerification.unverifiedPayments]
      updatedUnverified.splice(paymentIndex, 1)

      const updatedVerified = mpesaVerification.verifiedPayments
        ? [
            ...mpesaVerification.verifiedPayments,
            { ...paymentToVerify, verifiedAt: new Date().toISOString() },
          ]
        : [{ ...paymentToVerify, verifiedAt: new Date().toISOString() }]

      onUpdate({
        ...mpesaVerification,
        unverifiedPayments: updatedUnverified,
        verifiedPayments: updatedVerified,
      })
      setSearchReceipt("")
    } catch (error) {
      console.error("Failed to verify payment:", error)
    }
  }

  const handleUnverifyPayment = async (paymentIndex) => {
    const paymentToUnverify = mpesaVerification.verifiedPayments[paymentIndex]

    try {
      // Call API to update is_verified
      await onUnverifyPayment(paymentToUnverify.paymentId, false)

      // Update local state
      const updatedVerified = [...mpesaVerification.verifiedPayments]
      updatedVerified.splice(paymentIndex, 1)

      const { verifiedAt, ...paymentWithoutVerifiedAt } = paymentToUnverify
      const updatedUnverified = [
        ...mpesaVerification.unverifiedPayments,
        paymentWithoutVerifiedAt,
      ]

      onUpdate({
        ...mpesaVerification,
        unverifiedPayments: updatedUnverified,
        verifiedPayments: updatedVerified,
      })
      setSearchReceipt("")
    } catch (error) {
      console.error("Failed to unverify payment:", error)
    }
  }

  // const handleVerifyAll = () => {
  //   // Move all unverified to verified
  //   const paymentsToVerify = mpesaVerification.unverifiedPayments.map(
  //     (payment) => ({
  //       ...payment,
  //       verifiedAt: new Date().toISOString(),
  //     }),
  //   )

  //   const updatedVerified = mpesaVerification.verifiedPayments
  //     ? [...mpesaVerification.verifiedPayments, ...paymentsToVerify]
  //     : [...paymentsToVerify]

  //   onUpdate({
  //     ...mpesaVerification,
  //     unverifiedPayments: [],
  //     verifiedPayments: updatedVerified,
  //     // actualMpesa and missingMpesa will be updated via useEffect
  //   })
  //   setSearchReceipt("")
  // }

  const handleVerifyAll = async () => {
    try {
      await onVerifyAllPayments()

      // The data will be refreshed by loadDataForDate
      // So we don't need to update local state here
      setSearchReceipt("")
    } catch (error) {
      console.error("Failed to verify all payments:", error)
    }
  }

  const handleUnverifyAll = async () => {
    try {
      await onUnverifyPayment()

      // The data will be refreshed by loadDataForDate
      // So we don't need to update local state here
      setSearchReceipt("")
    } catch (error) {
      console.error("Failed to unverify all payments:", error)
    }
  }

  // Function to verify payment by receipt number
  // const handleVerifyByReceipt = () => {
  //   if (!searchReceipt.trim()) return

  //   // Find payments that match the receipt number
  //   const matchingPayments = mpesaVerification.unverifiedPayments.filter(
  //     (payment) =>
  //       payment.receipt?.toLowerCase().includes(searchReceipt.toLowerCase()),
  //   )

  //   if (matchingPayments.length > 0) {
  //     // Remove matching payments from unverified
  //     const updatedUnverified = mpesaVerification.unverifiedPayments.filter(
  //       (payment) =>
  //         !payment.receipt?.toLowerCase().includes(searchReceipt.toLowerCase()),
  //     )

  //     // Add to verified with timestamp
  //     const verifiedPayments = matchingPayments.map((payment) => ({
  //       ...payment,
  //       verifiedAt: new Date().toISOString(),
  //     }))

  //     const updatedVerified = mpesaVerification.verifiedPayments
  //       ? [...mpesaVerification.verifiedPayments, ...verifiedPayments]
  //       : [...verifiedPayments]

  //     onUpdate({
  //       ...mpesaVerification,
  //       unverifiedPayments: updatedUnverified,
  //       verifiedPayments: updatedVerified,
  //       // actualMpesa and missingMpesa will be updated via useEffect
  //     })

  //     setSearchReceipt("")
  //   }
  // }

  const handleVerifyByReceipt = async () => {
    if (!searchReceipt.trim() || !onVerifyPayment) return

    const matchingPayments = mpesaVerification.unverifiedPayments.filter(
      (payment) =>
        payment.receipt?.toLowerCase().includes(searchReceipt.toLowerCase()),
    )

    if (matchingPayments.length > 0) {
      try {
        await Promise.all(
          matchingPayments.map((payment) =>
            onVerifyPayment(payment.paymentId, true),
          ),
        )

        toast.success(`Verified ${matchingPayments.length} payment(s)`)
        setSearchReceipt("")
      } catch (error) {
        console.error("Error verifying payments by receipt:", error)
        toast.error("Failed to verify some payments")
      }
    }
  }

  // Function to unverify payment by receipt number
  // const handleUnverifyByReceipt = () => {
  //   if (!searchReceipt.trim()) return

  //   // Find payments that match the receipt number in verified list
  //   const matchingPayments =
  //     mpesaVerification.verifiedPayments?.filter((payment) =>
  //       payment.receipt?.toLowerCase().includes(searchReceipt.toLowerCase()),
  //     ) || []

  //   if (matchingPayments.length > 0) {
  //     // Remove matching payments from verified
  //     const updatedVerified = mpesaVerification.verifiedPayments.filter(
  //       (payment) =>
  //         !payment.receipt?.toLowerCase().includes(searchReceipt.toLowerCase()),
  //     )

  //     // Add back to unverified (remove verifiedAt timestamp)
  //     const unverifiedPayments = matchingPayments.map(
  //       ({ verifiedAt, ...payment }) => payment,
  //     )

  //     const updatedUnverified = [
  //       ...mpesaVerification.unverifiedPayments,
  //       ...unverifiedPayments,
  //     ]

  //     onUpdate({
  //       ...mpesaVerification,
  //       unverifiedPayments: updatedUnverified,
  //       verifiedPayments: updatedVerified,
  //       // actualMpesa and missingMpesa will be updated via useEffect
  //     })

  //     setSearchReceipt("")
  //   }
  // }

  const handleUnverifyByReceipt = async () => {
    if (!searchReceipt.trim() || !onVerifyPayment) return

    const matchingPayments =
      mpesaVerification.verifiedPayments?.filter((payment) =>
        payment.receipt?.toLowerCase().includes(searchReceipt.toLowerCase()),
      ) || []

    if (matchingPayments.length > 0) {
      try {
        await Promise.all(
          matchingPayments.map((payment) =>
            onVerifyPayment(payment.paymentId, false),
          ),
        )

        toast.success(`Unverified ${matchingPayments.length} payment(s)`)
        setSearchReceipt("")
      } catch (error) {
        console.error("Error unverifying payments by receipt:", error)
        toast.error("Failed to unverify some payments")
      }
    }
  }

  const getStatusColor = () => {
    if (mpesaVerification.unverifiedPayments?.length === 0) {
      return "bg-green-50 border-green-200 text-green-800"
    } else if (mpesaVerification.unverifiedPayments?.length <= 3) {
      return "bg-yellow-50 border-yellow-200 text-yellow-800"
    } else {
      return "bg-red-50 border-red-200 text-red-800"
    }
  }

  const getStatusIcon = () => {
    if (mpesaVerification.unverifiedPayments?.length === 0) {
      return <CheckCircle className="text-green-600" />
    } else {
      return <Warning className="text-yellow-600" />
    }
  }

  // Filter payments based on search
  const filteredUnverifiedPayments =
    searchReceipt.trim() && !showVerifiedPayments
      ? mpesaVerification.unverifiedPayments?.filter((payment) =>
          payment.receipt?.toLowerCase().includes(searchReceipt.toLowerCase()),
        ) || []
      : mpesaVerification.unverifiedPayments || []

  const filteredVerifiedPayments =
    searchReceipt.trim() && showVerifiedPayments
      ? mpesaVerification.verifiedPayments?.filter((payment) =>
          payment.receipt?.toLowerCase().includes(searchReceipt.toLowerCase()),
        ) || []
      : mpesaVerification.verifiedPayments || []

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 pb-32">
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
        <CreditScore className="mr-2 text-purple-600" />
        M-Pesa Verification
      </h3>
      {reconciliationRecord && (
        <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200">
          <div className="flex items-center gap-2 text-green-800 font-medium">
            <CheckCircle className="text-green-600" />
            M-Pesa reconciliation complete
          </div>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-green-700">
            <span>
              Reconciled:{" "}
              {new Date(
                reconciliationRecord.reconciliation_time,
              ).toLocaleString()}
            </span>
            {reconciliationRecord.mpesa_difference != null && (
              <span>
                Difference:{" "}
                <FormattedAmount
                  amount={parseFloat(reconciliationRecord.mpesa_difference)}
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

      <div className="space-y-6">
        {/* M-Pesa Summary - FIXED: Show correct balances */}
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-medium text-purple-800 mb-3">M-Pesa Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-3 rounded-lg">
              <div className="text-sm text-purple-700 mb-1">
                Total M-Pesa Sales
              </div>
              <div className="text-xl font-bold">
                <FormattedAmount
                  amount={mpesaVerification.totalSalesMpesa || 0}
                />
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <div className="text-sm text-purple-700 mb-1">
                M-Pesa Expenses
                <span className="ml-1 text-xs text-green-600">
                  (Approved/Paid only)
                </span>
              </div>
              <div className="text-xl font-bold text-red-600">
                <FormattedAmount
                  amount={mpesaVerification.totalMpesaExpenses || 0}
                />
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <div className="text-sm text-purple-700 mb-1">
                Expected M-Pesa
                <span className="ml-1 text-xs text-blue-600">
                  (Sales - Expenses)
                </span>
              </div>
              <div className="text-xl font-bold text-purple-800">
                <FormattedAmount
                  amount={mpesaVerification.expectedMpesa || 0}
                />
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <div className="text-sm text-purple-700 mb-1">
                Verified M-Pesa
              </div>
              <div className="text-xl font-bold text-green-600">
                <FormattedAmount amount={actualMpesaBalance} />
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-purple-200">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium text-purple-800">
                  Missing / Shortage
                </div>
                <div className="text-sm text-purple-600">
                  Expected - Verified ={" "}
                  {missingAmount > 0
                    ? "Shortage"
                    : missingAmount < 0
                    ? "Excess"
                    : "Balanced"}
                </div>
              </div>
              <div
                className={`text-2xl font-bold ${
                  missingAmount > 0
                    ? "text-red-700"
                    : missingAmount < 0
                    ? "text-green-700"
                    : "text-purple-800"
                }`}
              >
                <FormattedAmount amount={Math.abs(missingAmount)} />
                {missingAmount > 0 && " (Shortage)"}
                {missingAmount < 0 && " (Excess)"}
              </div>
            </div>
          </div>
        </div>

        {/* Verification Status - FIXED: Show correct shortage amount */}
        <div className={`p-4 rounded-lg border ${getStatusColor()}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              {getStatusIcon()}
              <span className="font-medium ml-2">
                {mpesaVerification.unverifiedPayments?.length === 0
                  ? "All Payments Verified"
                  : `${
                      mpesaVerification.unverifiedPayments?.length || 0
                    } Unverified Payments`}
              </span>
            </div>

            {/* Assign Shortage Button - Show only when there's actual shortage (missing > 0) */}
            {missingAmount > 0 && !isFinalized && (
              <button
                onClick={() => onAssignShortage(missingAmount)}
                className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 flex items-center gap-1"
              >
                <AssignmentLate fontSize="small" />
                Assign Shortage (KES {missingAmount.toLocaleString()})
              </button>
            )}
          </div>

          {missingAmount > 0 ? (
            <div>
              <div className="flex justify-between items-center mb-2">
                <span>Shortage Amount</span>
                <span className="text-xl font-bold text-red-700">
                  <FormattedAmount amount={missingAmount} />
                </span>
              </div>
              <p className="text-sm mt-2">
                Expected M-Pesa:{" "}
                <FormattedAmount
                  amount={mpesaVerification.expectedMpesa || 0}
                />{" "}
                - Verified: <FormattedAmount amount={actualMpesaBalance} /> =
                Shortage: <FormattedAmount amount={missingAmount} />
              </p>
            </div>
          ) : missingAmount < 0 ? (
            <div>
              <div className="flex justify-between items-center mb-2">
                <span>Excess Amount</span>
                <span className="text-xl font-bold text-green-700">
                  <FormattedAmount amount={Math.abs(missingAmount)} />
                </span>
              </div>
              <p className="text-sm mt-2">
                Verified M-Pesa is more than expected by{" "}
                <FormattedAmount amount={Math.abs(missingAmount)} />
              </p>
            </div>
          ) : (
            <p className="text-sm">
              All M-Pesa payments have been verified and match expected amount
            </p>
          )}
        </div>

        {/* Payment Lists Toggle */}
        {(mpesaVerification.unverifiedPayments?.length > 0 ||
          mpesaVerification.verifiedPayments?.length > 0) && (
          <div className="flex gap-2 border-b border-gray-200 pb-2">
            <button
              onClick={() => setShowVerifiedPayments(false)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
                !showVerifiedPayments
                  ? "bg-purple-100 text-purple-700 border-b-2 border-purple-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Unverified ({mpesaVerification.unverifiedPayments?.length || 0})
            </button>
            <button
              onClick={() => setShowVerifiedPayments(true)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
                showVerifiedPayments
                  ? "bg-green-100 text-green-700 border-b-2 border-green-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Verified ({mpesaVerification.verifiedPayments?.length || 0})
            </button>
          </div>
        )}

        {/* Unverified Payments List */}
        {!showVerifiedPayments &&
          mpesaVerification.unverifiedPayments?.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-800">
                  Unverified Payments
                  {searchReceipt.trim() && (
                    <span className="ml-2 text-sm font-normal text-gray-600">
                      (Filtered: {filteredUnverifiedPayments.length} of{" "}
                      {mpesaVerification.unverifiedPayments.length})
                    </span>
                  )}
                </h4>
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
                {filteredUnverifiedPayments.length > 0 ? (
                  filteredUnverifiedPayments.map((payment, index) => (
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
                            onClick={() => {
                              const actualIndex =
                                mpesaVerification.unverifiedPayments.findIndex(
                                  (p) => p.saleId === payment.saleId,
                                )
                              if (actualIndex !== -1) {
                                handleVerifyPayment(actualIndex)
                              }
                            }}
                            className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                            disabled={isFinalized}
                          >
                            Verify
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                    <Search className="text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">
                      No unverified payments found with receipt number "
                      {searchReceipt}"
                    </p>
                    <button
                      onClick={() => setSearchReceipt("")}
                      className="mt-2 text-sm text-purple-600 hover:text-purple-800"
                    >
                      Clear search
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

        {/* Verified Payments List */}
        {showVerifiedPayments &&
          mpesaVerification.verifiedPayments?.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-800">
                  Verified Payments
                  {searchReceipt.trim() && (
                    <span className="ml-2 text-sm font-normal text-gray-600">
                      (Filtered: {filteredVerifiedPayments.length} of{" "}
                      {mpesaVerification.verifiedPayments.length})
                    </span>
                  )}
                </h4>
                <div className="flex items-center gap-2">
                  <div className="text-sm text-gray-600">
                    Total: <FormattedAmount amount={totalVerifiedAmount} />
                  </div>
                  <button
                    onClick={handleUnverifyAll}
                    className="px-3 py-1 text-sm bg-orange-100 text-orange-700 rounded hover:bg-orange-200 flex items-center"
                    disabled={isFinalized}
                  >
                    <Undo fontSize="small" className="mr-1" />
                    Unverify All
                  </button>
                </div>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {filteredVerifiedPayments.length > 0 ? (
                  filteredVerifiedPayments.map((payment, index) => (
                    <div
                      key={index}
                      className="bg-green-50 border border-green-200 rounded-lg p-3"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-medium flex items-center">
                            <CheckCircle
                              className="mr-2 text-green-600"
                              fontSize="small"
                            />
                            Invoice: {payment.invoice}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            Receipt: {payment.receipt || "Not provided"}
                          </div>
                          {payment.verifiedAt && (
                            <div className="text-xs text-green-600 mt-1">
                              Verified:{" "}
                              {new Date(payment.verifiedAt).toLocaleString()}
                            </div>
                          )}
                        </div>
                        <div className="text-lg font-bold text-green-700">
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
                            onClick={() => {
                              const actualIndex =
                                mpesaVerification.verifiedPayments.findIndex(
                                  (p) => p.saleId === payment.saleId,
                                )
                              if (actualIndex !== -1) {
                                handleUnverifyPayment(actualIndex)
                              }
                            }}
                            className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded hover:bg-orange-200"
                            disabled={isFinalized}
                          >
                            Unverify
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                    <Search className="text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">
                      No verified payments found with receipt number "
                      {searchReceipt}"
                    </p>
                    <button
                      onClick={() => setSearchReceipt("")}
                      className="mt-2 text-sm text-purple-600 hover:text-purple-800"
                    >
                      Clear search
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

        {/* Manual Verification */}
        <div>
          <h4 className="font-medium text-gray-800 mb-3">
            Manual Verification
          </h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-3 gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchReceipt}
                  onChange={(e) => setSearchReceipt(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      if (showVerifiedPayments) {
                        handleUnverifyByReceipt()
                      } else {
                        handleVerifyByReceipt()
                      }
                    }
                  }}
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm"
                  placeholder={
                    showVerifiedPayments
                      ? "Enter receipt number to unverify..."
                      : "Enter receipt number to verify..."
                  }
                  disabled={isFinalized}
                />
              </div>
              {showVerifiedPayments ? (
                <button
                  onClick={handleUnverifyByReceipt}
                  disabled={!searchReceipt.trim() || isFinalized}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <Undo fontSize="small" />
                  Unverify by Receipt
                </button>
              ) : (
                <button
                  onClick={handleVerifyByReceipt}
                  disabled={!searchReceipt.trim() || isFinalized}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <CheckCircle fontSize="small" />
                  Verify by Receipt
                </button>
              )}
            </div>

            {/* Show matching count when searching */}
            {searchReceipt.trim() && (
              <div className="mb-3 p-2 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-sm text-purple-700">
                  {showVerifiedPayments
                    ? `Found ${filteredVerifiedPayments.length} verified payment(s) matching receipt "${searchReceipt}"`
                    : `Found ${filteredUnverifiedPayments.length} unverified payment(s) matching receipt "${searchReceipt}"`}
                </p>
              </div>
            )}

            <p className="text-sm text-gray-600">
              {showVerifiedPayments
                ? "Enter an M-Pesa receipt number to unverify matching payments"
                : "Enter an M-Pesa receipt number to verify matching payments"}
            </p>
          </div>
        </div>

        {/* Shortage Breakdown - FIXED: Show actual shortage (expected - verified) */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-medium text-yellow-800 mb-3">
            M-Pesa Reconciliation
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-700">Expected M-Pesa:</span>
              <span className="font-medium">
                <FormattedAmount
                  amount={mpesaVerification.expectedMpesa || 0}
                />
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Verified M-Pesa:</span>
              <span className="font-medium text-green-700">
                <FormattedAmount amount={actualMpesaBalance} />
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Unverified Payments:</span>
              <span className="font-medium">
                <FormattedAmount amount={totalUnverifiedAmount} />
              </span>
            </div>
            <div className="pt-2 border-t border-yellow-300">
              <div className="flex justify-between">
                <span className="font-medium text-red-700">
                  {missingAmount > 0
                    ? "Total Shortage:"
                    : missingAmount < 0
                    ? "Total Excess:"
                    : "Balance:"}
                </span>
                <span
                  className={`font-bold text-lg ${
                    missingAmount > 0
                      ? "text-red-700"
                      : missingAmount < 0
                      ? "text-green-700"
                      : "text-gray-800"
                  }`}
                >
                  <FormattedAmount amount={Math.abs(missingAmount)} />
                  {missingAmount > 0 && " (Shortage)"}
                  {missingAmount < 0 && " (Excess)"}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Expected:{" "}
                <FormattedAmount
                  amount={mpesaVerification.expectedMpesa || 0}
                />{" "}
                - Verified: <FormattedAmount amount={actualMpesaBalance} /> =
                {missingAmount > 0
                  ? " Shortage"
                  : missingAmount < 0
                  ? " Excess"
                  : " Balanced"}
              </p>
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
            value={mpesaVerification.notes || ""}
            onChange={(e) =>
              onUpdate({ ...mpesaVerification, notes: e.target.value })
            }
            placeholder="Enter any notes about M-Pesa verification..."
            disabled={isFinalized}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-1">
          <button
            onClick={handleVerifyAll}
            className="px-1 text-xs py-1 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
            disabled={
              isFinalized || mpesaVerification.unverifiedPayments?.length === 0
            }
          >
            Verify All Payments
          </button>
          <button
            onClick={handleUnverifyAll}
            className="px-1 text-xs py-1 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50"
            disabled={
              isFinalized || !mpesaVerification.verifiedPayments?.length
            }
          >
            Unverify All Payments
          </button>
          <button
            onClick={onMpesaReconcile}
            className=" px-1 text-xs py-1 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50"
            disabled={isFinalized}
          >
            Record Reconciliation
            {/* (
            {missingAmount > 0
              ? `Shortage: ${missingAmount.toLocaleString()}`
              : missingAmount < 0
              ? `Excess: ${Math.abs(missingAmount).toLocaleString()}`
              : "Balanced"}
            ) */}
          </button>
        </div>
      </div>
    </div>
  )
}

export default MpesaVerification
