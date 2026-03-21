// @ts-nocheck
import React, { useEffect, useState, memo } from "react"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import {
  addFreeTrial,
  fetchSubscription,
  selectAllSubscription,
} from "../features/subscriptions/subscriptionSlice"
import AdminsFooter from "../components/AdminsFooter"
import FormattedAmount from "../components/FormattedAmount"
import { useNavigate } from "react-router-dom"
import {
  fetchBusiness,
  selectAllBusiness,
} from "../features/company/companySlice"
import Datetime from "../components/Datetime"
import SubscriptionCountdownTimer from "../components/SubscriptionCountdownTimer"
import { useMediaQuery, useTheme } from "@mui/material"
import Navbar from "../components/ui/mobile/admin/Navbar"
import AdminNav from "../components/ui/AdminNav"
import api from "../../utils/api"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const FEATURE_ICONS: Record<string, string> = {
  Store: "🏪",
  SMS: "💬",
  analytics: "📊",
  default: "⚡",
}

// ─── Status Banner ─────────────────────────────────────────────────────────────
const StatusBanner = memo(
  ({
    business,
    hasPlan,
    isTrial,
    isExpired,
    planName,
    trialEndsIn,
    daysRemaining,
    expiryDate,
  }: any) => {
    if (!business) return null

    if (!hasPlan && !isTrial)
      return (
        <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl mb-5 bg-emerald-50 border border-emerald-200 shadow-sm">
          <span className="text-2xl">🎁</span>
          <div>
            <div className="text-sm font-bold text-emerald-800">
              Free Trial Available
            </div>
            <div className="text-xs text-emerald-600 mt-0.5">
              Start your 14-day free trial today — no credit card needed
            </div>
          </div>
        </div>
      )

    if (isTrial)
      return (
        <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl mb-5 bg-blue-50 border border-blue-200 shadow-sm">
          <span className="text-2xl">⚡</span>
          <div>
            <div className="text-sm font-bold text-blue-800">
              Free Trial Active
            </div>
            <div className="text-xs text-blue-600 mt-0.5">
              {trialEndsIn} day(s) remaining · Ends{" "}
              <Datetime date={expiryDate} showTime={false} />
            </div>
          </div>
        </div>
      )

    if (hasPlan && isExpired)
      return (
        <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl mb-5 bg-red-50 border border-red-200 shadow-sm">
          <span className="text-2xl">⚠️</span>
          <div>
            <div className="text-sm font-bold text-red-800">Plan Expired</div>
            <div className="text-xs text-red-600 mt-0.5">
              {planName} · Expired{" "}
              <Datetime date={expiryDate} showTime={false} />
            </div>
          </div>
        </div>
      )

    return (
      <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl mb-5 bg-green-50 border border-green-200 shadow-sm">
        <span className="text-2xl">✅</span>
        <div>
          <div className="text-sm font-bold text-green-800">
            {planName} Plan — Active
          </div>
          <div className="text-xs text-green-600 mt-0.5">
            {daysRemaining} day(s) left ·{" "}
            <SubscriptionCountdownTimer expiryDate={expiryDate} />
          </div>
        </div>
      </div>
    )
  },
)
StatusBanner.displayName = "StatusBanner"

// ─── Plan Card ──────────────────────────────────────────────────────────────────
const PlanCard = memo(
  ({
    plan,
    hasPlan,
    isTrial,
    isExpired,
    onSubscribe,
    onFreeTrial,
    subscribing,
    addingFreeTrial,
  }: any) => {
    const [months, setMonths] = useState(1)
    const [paymentNumber, setPaymentNumber] = useState("")
    const [showPayment, setShowPayment] = useState(false)

    const isContact =
      typeof plan.price === "string" &&
      plan.price.toLowerCase().includes("contact")
    const numericPrice = parseFloat(String(plan.price).replace(/[^0-9.]/g, ""))
    const total = isNaN(numericPrice) ? 0 : numericPrice * months

    // Each plan gets a gradient that matches the PayRoll green/blue palette
    const planGradients = [
      "from-violet-500 to-violet-600",
      "from-blue-500 to-blue-600",
      "from-emerald-500 to-emerald-600",
      "from-rose-500 to-rose-600",
    ]
    const gradient = plan.highlight
      ? "from-violet-500 to-violet-600"
      : planGradients[(plan.sort_order ?? 0) % planGradients.length]
    const focusColor = plan.highlight
      ? "focus:border-violet-500 focus:ring-violet-200"
      : "focus:border-blue-500 focus:ring-blue-200"

    return (
      <div
        className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden
      ${plan.highlight ? "ring-2 ring-violet-400 ring-offset-2" : ""}`}
      >
        {/* Gradient header — same style as PayRoll's green header */}
        <div className={`bg-gradient-to-r ${gradient} p-6 relative`}>
          {plan.highlight && (
            <div className="absolute top-3 right-3 bg-white/25 backdrop-blur text-white text-[9px] font-extrabold tracking-widest px-2.5 py-1 rounded-full border border-white/30">
              ✦ POPULAR
            </div>
          )}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
              {plan.description && (
                <p className="text-white/70 text-xs leading-relaxed max-w-[140px]">
                  {plan.description}
                </p>
              )}
            </div>
            <div className="text-right">
              <div className="text-3xl font-extrabold text-white leading-none">
                {isContact ? (
                  "Contact"
                ) : (
                  <FormattedAmount amount={plan.price} />
                )}
              </div>
              {!isContact && (
                <div className="text-white/70 text-xs mt-1">/month</div>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 flex-1 flex flex-col gap-4">
          {/* Features */}
          {plan.features?.length > 0 ? (
            <div className="space-y-2">
              {plan.features.map((feature: any, i: number) => {
                const hasLimit =
                  feature.limits && Object.keys(feature.limits).length > 0
                const icon =
                  FEATURE_ICONS[feature.code] ?? FEATURE_ICONS["default"]
                return (
                  <div key={i} className="flex items-center gap-2.5">
                    <span className="text-sm shrink-0">{icon}</span>
                    <span
                      className={`text-sm ${
                        feature.enabled
                          ? "text-gray-700"
                          : "text-gray-400 line-through"
                      }`}
                    >
                      {feature.description}
                      {hasLimit && feature.limits.max && (
                        <span className="text-violet-600 font-semibold">
                          {" "}
                          · {feature.limits.max}
                        </span>
                      )}
                    </span>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic text-center py-2">
              Contact us for full feature details
            </p>
          )}

          {/* Duration selector */}
          {!isContact && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
                Duration
              </p>
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex gap-1.5 flex-wrap">
                  {[1, 2, 3, 6, 12].map((m) => (
                    <button
                      key={m}
                      onClick={() => setMonths(m)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all duration-150
                      ${
                        months === m
                          ? `bg-gradient-to-r ${gradient} text-white border-transparent shadow-sm`
                          : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-400"
                      }`}
                    >
                      {m}mo
                    </button>
                  ))}
                </div>
                <div className="bg-gray-100 border-2 border-gray-200 rounded-xl px-3 py-1.5 text-sm font-bold text-gray-800 whitespace-nowrap">
                  <FormattedAmount amount={total} />
                </div>
              </div>
            </div>
          )}

          {/* Free trial */}
          {!hasPlan && !isTrial && (
            <button
              onClick={() => onFreeTrial(plan.id)}
              disabled={addingFreeTrial}
              className="w-full py-2.5 rounded-xl border-2 border-emerald-300 bg-emerald-50 text-emerald-700 text-sm font-bold hover:bg-emerald-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {addingFreeTrial ? "⏳ Starting trial..." : "🎁 Start Free Trial"}
            </button>
          )}

          {/* Payment flow */}
          {showPayment ? (
            <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200 flex flex-col gap-3">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest">
                📱 M-Pesa Number
              </p>
              <input
                type="tel"
                value={paymentNumber}
                onChange={(e) => setPaymentNumber(e.target.value)}
                placeholder="e.g. 0712 345 678"
                className={`w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 text-sm outline-none ${focusColor} focus:ring-2 transition-colors`}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setShowPayment(false)}
                  className="flex-1 py-2.5 rounded-lg border-2 border-gray-300 text-gray-600 text-sm font-semibold hover:bg-gray-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => onSubscribe(plan.id, months, paymentNumber)}
                  disabled={subscribing || !paymentNumber.trim()}
                  className={`flex-[2] py-2.5 rounded-lg bg-gradient-to-r ${gradient} text-white text-sm font-bold shadow-md hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  {subscribing ? "Processing..." : "Pay Now →"}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowPayment(true)}
              className={`w-full py-3 rounded-xl bg-gradient-to-r ${gradient} text-white text-sm font-bold shadow-md hover:opacity-90 transition-all`}
            >
              {isExpired
                ? "Renew Plan →"
                : hasPlan
                ? "Upgrade →"
                : "Choose Plan →"}
            </button>
          )}
        </div>
      </div>
    )
  },
)
PlanCard.displayName = "PlanCard"

// ─── Main ───────────────────────────────────────────────────────────────────────
const SubScriptionPlans = () => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const my_business = useAppSelector(selectAllBusiness)
  const all_subscription = useAppSelector(selectAllSubscription)
  const navigate = useNavigate()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const [subscribing, setSubscribing] = useState(false)
  const [addingFreeTrial, setAddingFreeTrial] = useState(false)

  useEffect(() => {
    dispatch(fetchSubscription())
    dispatch(fetchBusiness())
  }, [dispatch])

  const business = my_business
  const hasPlan = business?.subscription_plan
  const planName = business?.subscription_plan?.name
  const expiryDate = business?.subscription_plan_expiry
    ? new Date(business.subscription_plan_expiry)
    : null
  const isExpired = business?.is_expired
  const isTrial = business?.is_trial
  const trialEndsIn = business?.trial_ends_in
  const daysRemaining = business?.days_remaining

  const handleSubscribe = async (
    id: number,
    months: number,
    paymentNumber: string,
  ) => {
    try {
      setSubscribing(true)
      const response = await api.post(
        `online-payment/subscription-payment/${id}/`,
        {
          subscription_id: id,
          months,
          phone_number: paymentNumber,
        },
      )
      const data = response.data
      if (data.success && data.checkout_request_id) {
        const plan = all_subscription.find((p: any) => p.id === id)
        navigate("/processing", {
          state: {
            planName: plan?.name || "Subscription Plan",
            months,
            amount: parseFloat(plan?.price || "0") * months,
            checkoutRequestId: data.checkout_request_id,
            phoneNumber: paymentNumber,
          },
        })
      } else {
        toast.error(data.message || "Payment could not be started.")
      }
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          "Something went wrong. Try again later.",
      )
    } finally {
      setSubscribing(false)
    }
  }

  const handleFreeTrial = async (id: number) => {
    try {
      setAddingFreeTrial(true)
      await dispatch(addFreeTrial({ id }))
      toast.success("Free trial started! 🎉")
    } catch {
      toast.error("Could not start free trial.")
    } finally {
      setAddingFreeTrial(false)
    }
  }

  const bannerProps = {
    business,
    hasPlan,
    isTrial,
    isExpired,
    planName,
    trialEndsIn,
    daysRemaining,
    expiryDate,
  }
  const cardProps = {
    hasPlan,
    isTrial,
    isExpired,
    onSubscribe: handleSubscribe,
    onFreeTrial: handleFreeTrial,
    subscribing,
    addingFreeTrial,
  }

  // ── Mobile ────────────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-gray-800 font-sans">
        <Navbar
          headerMessage="ERP"
          headerText="Manage your operations with style and clarity"
        />
        <ToastContainer />

        <main className="flex-grow m-2 p-1 mb-20">
          {/* Page header — violet to match subscriptions */}
          <div className="bg-gradient-to-r from-violet-500 to-violet-600 p-6 rounded-xl shadow-lg mb-4">
            <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
              💳 Subscription Plans
            </h1>
            <p className="text-violet-100 text-sm">
              Scale your business with the right tools
            </p>
          </div>

          {/* Stats row */}
          {(hasPlan || isTrial) && (
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="text-xs text-gray-600 mb-1">Current Plan</div>
                <div className="text-lg font-bold text-violet-600">
                  {planName || "Trial"}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="text-xs text-gray-600 mb-1">Days Left</div>
                <div
                  className={`text-lg font-bold ${
                    isExpired ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {isExpired ? "Expired" : `${daysRemaining}d`}
                </div>
              </div>
            </div>
          )}

          <StatusBanner {...bannerProps} />

          <div className="flex flex-col gap-4">
            {all_subscription.map((plan: any) => (
              <PlanCard key={plan.id} plan={plan} {...cardProps} />
            ))}
          </div>
        </main>

        <footer className="fixed bottom-0 left-0 right-0">
          <AdminsFooter />
        </footer>
      </div>
    )
  }

  // ── Desktop ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-gray-800 font-sans">
      <AdminNav
        headerMessage="Subscription Plans"
        headerText="Choose the right plan for your business"
      />
      <ToastContainer />

      <main className="flex-grow p-6">
        {/* Page header — same structure as PayRoll's green header but violet */}
        <div className="bg-gradient-to-r from-violet-500 to-violet-600 p-8 rounded-2xl shadow-xl mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                💳 Subscription Plans
              </h1>
              <p className="text-violet-100">
                Scale your business with the right tools
              </p>
            </div>
            {/* Current plan badge in header — same style as PayRoll's "Process Payroll" button */}
            {hasPlan && !isExpired && (
              <div className="bg-white text-violet-600 px-6 py-3 rounded-xl font-semibold shadow-lg">
                ✅ {planName} · {daysRemaining} days left
              </div>
            )}
            {isExpired && (
              <div className="bg-white text-red-600 px-6 py-3 rounded-xl font-semibold shadow-lg">
                ⚠️ Plan expired — renew now
              </div>
            )}
            {isTrial && !isExpired && (
              <div className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold shadow-lg">
                ⚡ Trial · {trialEndsIn} days left
              </div>
            )}
          </div>
        </div>

        {/* Stats row — same 4-card grid as PayRoll */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Current Plan",
              value: planName || (isTrial ? "Free Trial" : "None"),
              icon: "📋",
              color: "text-violet-600",
            },
            {
              label: "Status",
              value: isExpired
                ? "Expired"
                : isTrial
                ? "Trial"
                : hasPlan
                ? "Active"
                : "No Plan",
              icon: "📊",
              color: isExpired ? "text-red-600" : "text-green-600",
            },
            {
              label: "Days Remaining",
              value: isExpired ? "0" : daysRemaining ?? "—",
              icon: "📅",
              color: isExpired ? "text-red-600" : "text-blue-600",
            },
            {
              label: "Available Plans",
              value: all_subscription.length,
              icon: "🗂️",
              color: "text-gray-700",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                </div>
                <span className="text-3xl">{stat.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Status banner in white card — same pattern as PayRoll's search card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <StatusBanner {...bannerProps} />
          <p className="text-sm text-gray-500 mt-1">
            Choose a plan below, set your duration, and pay securely via M-Pesa
            STK push.
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {all_subscription.map((plan: any) => (
            <PlanCard key={plan.id} plan={plan} {...cardProps} />
          ))}
        </div>
      </main>

      <AdminsFooter />
    </div>
  )
}

export default SubScriptionPlans
