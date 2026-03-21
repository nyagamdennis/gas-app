// @ts-nocheck
import React, { useEffect, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import api from "../../utils/api"

type PaymentStatus = "processing" | "success" | "failed" | "timeout"

const POLL_INTERVAL_MS = 4000
const MAX_WAIT_MS = 120_000

const ProcessingPayment = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const state = location.state || {}
  const planName = state.planName || "Subscription Plan"
  const months = state.months || 1
  const amount = state.amount || 0
  const checkoutRequestId = state.checkoutRequestId
  const phoneNumber = state.phoneNumber || ""

  const [paymentStatus, setPaymentStatus] =
    useState<PaymentStatus>("processing")
  const [successData, setSuccessData] = useState<any>(null)
  const [failureReason, setFailureReason] = useState("")
  const [secondsLeft, setSecondsLeft] = useState(MAX_WAIT_MS / 1000)
  const [dots, setDots] = useState(".")

  const pollRef = useRef<any>(null)
  const timeoutRef = useRef<any>(null)
  const countdownRef = useRef<any>(null)
  const dotsRef = useRef<any>(null)

  const stopAll = () => {
    clearInterval(pollRef.current)
    clearTimeout(timeoutRef.current)
    clearInterval(countdownRef.current)
    clearInterval(dotsRef.current)
  }

  useEffect(() => {
    if (!checkoutRequestId) {
      setPaymentStatus("failed")
      setFailureReason("No checkout request ID found. Please try again.")
      return
    }

    dotsRef.current = setInterval(
      () => setDots((d) => (d.length >= 3 ? "." : d + ".")),
      500,
    )
    countdownRef.current = setInterval(
      () => setSecondsLeft((s) => Math.max(0, s - 1)),
      1000,
    )

    const poll = async () => {
      try {
        const res = await api.post(
          `online-payment/check-payment-status/${checkoutRequestId}/`,
          { phone_number: phoneNumber },
        )
        const { status: payStatus, message, data } = res.data

        if (payStatus === "success" && data) {
          if (data.is_failed) {
            stopAll()
            setFailureReason(
              data.failure_reason || "Payment was not completed.",
            )
            setPaymentStatus("failed")
          } else if (data.is_confirmed) {
            stopAll()
            setSuccessData(data)
            setPaymentStatus("success")
          }
        } else if (payStatus === "failed" || payStatus === "error") {
          stopAll()
          setFailureReason(message || "Payment was not completed.")
          setPaymentStatus("failed")
        }
      } catch {
        // non-fatal, keep polling
      }
    }

    poll()
    pollRef.current = setInterval(poll, POLL_INTERVAL_MS)
    timeoutRef.current = setTimeout(() => {
      stopAll()
      setPaymentStatus("timeout")
    }, MAX_WAIT_MS)

    return () => stopAll()
  }, [checkoutRequestId])

  const pct = (secondsLeft / (MAX_WAIT_MS / 1000)) * 100

  // ── Shared page shell — matches PayRoll bg exactly ──────────────────────────
  const Shell = ({
    children,
    headerGradient,
    headerIcon,
    headerTitle,
    headerSubtitle,
  }: any) => (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-gray-800 font-sans">
      {/* Top gradient header — same pattern as PayRoll */}
      <div
        className={`bg-gradient-to-r ${headerGradient} p-8 m-6 rounded-2xl shadow-xl`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <span>{headerIcon}</span> {headerTitle}
            </h1>
            <p className="text-white/80">{headerSubtitle}</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-grow px-6 pb-8 flex items-start justify-center">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  )

  // ── Row used inside white summary cards ──────────────────────────────────────
  const SummaryRow = ({ label, value, valueClass = "text-gray-800" }: any) => (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-gray-600">{label}</span>
      <span className={`text-sm font-bold ${valueClass}`}>{value}</span>
    </div>
  )

  // ─── PROCESSING ─────────────────────────────────────────────────────────────
  if (paymentStatus === "processing") {
    return (
      <Shell
        headerGradient="from-violet-500 to-violet-600"
        headerIcon="📱"
        headerTitle="Processing Payment"
        headerSubtitle={`${planName} · ${months} month${
          months > 1 ? "s" : ""
        } · KES ${Number(amount).toLocaleString()}`}
      >
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

        {/* Spinner card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-4 flex flex-col items-center gap-6">
          {/* Spinner */}
          <div
            style={{
              position: "relative",
              width: 72,
              height: 72,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: "4px solid rgba(139,92,246,0.15)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: "4px solid transparent",
                borderTopColor: "#7c3aed",
                animation: "spin 1s linear infinite",
              }}
            />
            <span style={{ fontSize: 26, position: "relative", zIndex: 1 }}>
              📱
            </span>
          </div>

          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Awaiting Payment{dots}
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Check your phone for the M-Pesa prompt and enter your PIN to
              complete the payment.
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${pct}%`,
                  background: "linear-gradient(90deg, #7c3aed, #a78bfa)",
                }}
              />
            </div>
            <p className="text-xs text-gray-400 text-center">
              {secondsLeft}s remaining
            </p>
          </div>
        </div>

        {/* Summary card — same style as PayRoll's stats cards */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-gray-800">
              Payment Summary
            </h3>
            <span className="text-lg">🧾</span>
          </div>
          <SummaryRow label="Plan" value={planName} />
          <SummaryRow
            label="Duration"
            value={`${months} month${months > 1 ? "s" : ""}`}
          />
          {phoneNumber && (
            <SummaryRow label="M-Pesa Number" value={phoneNumber} />
          )}
          <div className="border-t border-gray-100 mt-2 pt-3">
            <SummaryRow
              label="Total"
              value={`KES ${Number(amount).toLocaleString()}`}
              valueClass="text-violet-600 text-base"
            />
          </div>
        </div>
      </Shell>
    )
  }

  // ─── SUCCESS ────────────────────────────────────────────────────────────────
  if (paymentStatus === "success") {
    return (
      <Shell
        headerGradient="from-green-500 to-green-600"
        headerIcon="✅"
        headerTitle="Payment Successful!"
        headerSubtitle={`Your ${
          successData?.plan_name || planName
        } subscription is now active`}
      >
        {/* Receipt card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-4">
          {/* Green accent bar */}
          <div className="h-1.5 bg-gradient-to-r from-green-400 to-emerald-500" />
          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-gray-800">
                Payment Receipt
              </h3>
              <span className="text-2xl">🎉</span>
            </div>

            {successData?.mpesa_code && (
              <>
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4 text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">
                    M-Pesa Code
                  </p>
                  <p className="text-xl font-extrabold text-green-700 tracking-widest">
                    {successData.mpesa_code}
                  </p>
                </div>
              </>
            )}

            <SummaryRow
              label="Plan"
              value={successData?.plan_name || planName}
            />
            <SummaryRow
              label="Duration"
              value={`${months} month${months > 1 ? "s" : ""}`}
            />
            <SummaryRow
              label="Payment Date"
              value={new Date().toLocaleDateString("en-KE")}
            />
            <div className="border-t border-gray-100 mt-2 pt-3">
              <SummaryRow
                label="Amount Paid"
                value={`KES ${Number(
                  successData?.amount || amount,
                ).toLocaleString()}`}
                valueClass="text-green-600 text-base"
              />
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate("/admins")}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-bold shadow-lg hover:from-green-600 hover:to-green-700 transition-all"
        >
          Go to Dashboard →
        </button>
      </Shell>
    )
  }

  // ─── FAILED ──────────────────────────────────────────────────────────────────
  if (paymentStatus === "failed") {
    return (
      <Shell
        headerGradient="from-red-500 to-red-600"
        headerIcon="❌"
        headerTitle="Payment Failed"
        headerSubtitle={failureReason || "Your payment could not be processed"}
      >
        {/* Reason card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-4">
          <div className="h-1.5 bg-gradient-to-r from-red-400 to-rose-500" />
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-800">
                What happened?
              </h3>
              <span className="text-2xl">🤔</span>
            </div>

            {failureReason && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                <p className="text-sm text-red-700 font-medium">
                  {failureReason}
                </p>
              </div>
            )}

            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
              Common reasons
            </p>
            <div className="space-y-2">
              {[
                "Wrong M-Pesa PIN entered",
                "Insufficient M-Pesa balance",
                "Request cancelled on phone",
                "Transaction timed out",
              ].map((r) => (
                <div
                  key={r}
                  className="flex items-center gap-3 bg-red-50 rounded-lg px-3 py-2"
                >
                  <div className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                  <span className="text-sm text-gray-700">{r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/subscribe")}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 text-white text-sm font-bold shadow-lg hover:from-violet-600 hover:to-violet-700 transition-all"
          >
            💳 Try Again
          </button>
          <button
            onClick={() => navigate("/admins")}
            className="w-full py-3 rounded-xl border-2 border-gray-300 text-gray-600 text-sm font-semibold hover:bg-gray-100 transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </Shell>
    )
  }

  // ─── TIMEOUT ─────────────────────────────────────────────────────────────────
  return (
    <Shell
      headerGradient="from-amber-500 to-amber-600"
      headerIcon="⏳"
      headerTitle="Taking Too Long"
      headerSubtitle="We couldn't confirm your payment within 2 minutes"
    >
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-4">
        <div className="h-1.5 bg-gradient-to-r from-amber-400 to-yellow-500" />
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-gray-800">
              What to do next?
            </h3>
            <span className="text-2xl">💡</span>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
            <p className="text-sm text-amber-800 leading-relaxed">
              If you completed the M-Pesa prompt, your subscription will be
              activated shortly — check back in a few minutes.
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <p className="text-sm text-gray-600 leading-relaxed">
              If you were charged but your plan hasn't activated within{" "}
              <strong>10 minutes</strong>, contact our support team with your
              M-Pesa transaction code.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={() => navigate("/subscribe")}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-bold shadow-lg hover:from-amber-600 hover:to-amber-700 transition-all"
        >
          Check My Subscription →
        </button>
        <button
          onClick={() => navigate("/admins")}
          className="w-full py-3 rounded-xl border-2 border-gray-300 text-gray-600 text-sm font-semibold hover:bg-gray-100 transition-all"
        >
          Back to Dashboard
        </button>
      </div>
    </Shell>
  )
}

export default ProcessingPayment
