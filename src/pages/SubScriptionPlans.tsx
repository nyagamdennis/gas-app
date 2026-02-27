// @ts-nocheck
import React, { useEffect, useState, memo } from "react"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import {
  addFreeTrial,
  addSubscription,
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

// ─── Feature icon map ─────────────────────────────────────────────────────────
const FEATURE_ICONS: Record<string, string> = {
  Store: "🏪",
  SMS: "💬",
  analytics: "📊",
  default: "⚡",
}

// ─── StatusBanner (memoized — no internal state, won't cause re-renders) ──────
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

    if (!hasPlan && !isTrial) {
      return (
        <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl mb-5 bg-emerald-400/15 border border-emerald-400/30">
          <span className="text-3xl">🎁</span>
          <div>
            <div className="text-sm font-bold text-white">
              Free Trial Available
            </div>
            <div className="text-xs text-white/60 mt-0.5">
              Start your 5-day free trial today
            </div>
          </div>
        </div>
      )
    }
    if (isTrial) {
      return (
        <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl mb-5 bg-violet-500/15 border border-violet-500/35">
          <span className="text-3xl">⚡</span>
          <div>
            <div className="text-sm font-bold text-white">
              Free Trial Active
            </div>
            <div className="text-xs text-white/60 mt-0.5">
              {trialEndsIn} day(s) remaining · Ends{" "}
              <Datetime date={expiryDate} showTime={false} />
            </div>
          </div>
        </div>
      )
    }
    if (hasPlan && isExpired) {
      return (
        <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl mb-5 bg-red-500/15 border border-red-500/30">
          <span className="text-3xl">⚠️</span>
          <div>
            <div className="text-sm font-bold text-white">Plan Expired</div>
            <div className="text-xs text-white/60 mt-0.5">
              {planName} · Expired{" "}
              <Datetime date={expiryDate} showTime={false} />
            </div>
          </div>
        </div>
      )
    }
    if (hasPlan) {
      return (
        <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl mb-5 bg-violet-500/15 border border-violet-500/35">
          <span className="text-3xl">✅</span>
          <div>
            <div className="text-sm font-bold text-white">{planName} Plan</div>
            <div className="text-xs text-white/60 mt-0.5">
              {daysRemaining} day(s) left ·{" "}
              <SubscriptionCountdownTimer expiryDate={expiryDate} />
            </div>
          </div>
        </div>
      )
    }
    return null
  },
)
StatusBanner.displayName = "StatusBanner"

// ─── PlanCard (memoized + own local state = zero parent re-renders) ────────────
// KEY FIX: phone input and month selection are LOCAL to each card,
// so typing/clicking no longer triggers a parent state change → no page "refresh"
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

    return (
      <div
        className={`relative rounded-2xl p-5 flex flex-col gap-4 transition-all duration-300
        ${
          plan.highlight
            ? "bg-violet-900/20 border border-violet-500/50 shadow-[0_0_40px_rgba(139,92,246,0.15)]"
            : "bg-white/5 border border-white/10"
        }`}
      >
        {/* Popular badge */}
        {plan.highlight && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-violet-600 to-purple-500 text-white text-[9px] font-extrabold tracking-widest px-3 py-1 rounded-full">
            ✦ MOST POPULAR
          </div>
        )}

        {/* Header: name + price */}
        <div className="flex justify-between items-start">
          <div>
            <div className="text-xl font-extrabold text-white mb-1">
              {plan.name}
            </div>
            {plan.description && (
              <div className="text-xs text-white/50 max-w-[160px] leading-relaxed">
                {plan.description}
              </div>
            )}
          </div>
          <div className="text-right shrink-0">
            <div className="text-3xl font-extrabold text-violet-300 leading-none">
              {isContact ? "Contact" : <FormattedAmount amount={plan.price} />}
            </div>
            {!isContact && (
              <div className="text-[11px] text-white/40 mt-1">/mo</div>
            )}
          </div>
        </div>

        {/* Features */}
        {plan.features?.length > 0 ? (
          <div className="border-t border-b border-white/[0.07] py-3 grid grid-cols-2 gap-x-3 gap-y-2.5">
            {plan.features.map((feature: any, i: number) => {
              const hasLimit =
                feature.limits && Object.keys(feature.limits).length > 0
              const icon =
                FEATURE_ICONS[feature.code] ?? FEATURE_ICONS["default"]
              return (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-sm mt-0.5 shrink-0">{icon}</span>
                  <span
                    className={`text-xs leading-snug ${
                      feature.enabled
                        ? "text-white/75"
                        : "text-white/35 line-through"
                    }`}
                  >
                    {feature.description}
                    {hasLimit && feature.limits.max && (
                      <span className="text-violet-300/90 font-semibold not-line-through">
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
          <div className="border-t border-b border-white/[0.07] py-4 flex items-center justify-center">
            <span className="text-xs text-white/30 italic">
              Contact us for full feature details
            </span>
          </div>
        )}

        {/* Month duration selector */}
        {!isContact && (
          <div>
            <div className="text-[11px] font-semibold text-white/40 tracking-widest uppercase mb-2">
              Duration
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex gap-1.5 flex-wrap">
                {[1, 2, 3, 6, 12].map((m) => (
                  <button
                    key={m}
                    onClick={() => setMonths(m)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150
                    ${
                      months === m
                        ? "bg-violet-500/40 border-violet-400 text-white"
                        : "bg-transparent border-white/15 text-white/60 hover:border-white/30 hover:text-white/80"
                    }`}
                  >
                    {m}mo
                  </button>
                ))}
              </div>
              <div className="bg-violet-500/20 border border-violet-500/40 rounded-xl px-3 py-1.5 text-sm font-bold text-violet-300 whitespace-nowrap shrink-0">
                <FormattedAmount amount={total} />
              </div>
            </div>
          </div>
        )}

        {/* Free trial CTA */}
        {!hasPlan && !isTrial && (
          <button
            onClick={() => onFreeTrial(plan.id)}
            disabled={addingFreeTrial}
            className="w-full py-3 rounded-xl border border-emerald-400/40 bg-emerald-400/10 text-emerald-400 text-sm font-bold tracking-wide hover:bg-emerald-400/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {addingFreeTrial
              ? "⏳ Starting trial..."
              : "🎁 Start 5-Day Free Trial"}
          </button>
        )}

        {/* Payment flow */}
        {showPayment ? (
          <div className="bg-black/20 rounded-xl p-4 border border-white/[0.08] flex flex-col gap-3">
            <div className="text-xs font-semibold text-white/60">
              📱 M-Pesa Number
            </div>
            <input
              type="tel"
              value={paymentNumber}
              onChange={(e) => setPaymentNumber(e.target.value)}
              placeholder="e.g. 0712 345 678"
              className="w-full rounded-xl px-4 py-3 text-white text-base outline-none placeholder:text-white/30 focus:border-violet-400/60 border border-white/15 transition-colors"
              style={{ background: "rgba(255,255,255,0.07)" }}
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowPayment(false)}
                className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/60 text-sm font-semibold hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => onSubscribe(plan.id, months, paymentNumber)}
                disabled={subscribing || !paymentNumber.trim()}
                className="flex-[2] py-2.5 rounded-xl bg-gradient-to-r from-violet-700 to-purple-500 text-white text-sm font-bold shadow-[0_4px_12px_rgba(139,92,246,0.35)] hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {subscribing ? "Processing..." : "Pay Now →"}
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowPayment(true)}
            className={`w-full py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all
            ${
              plan.highlight
                ? "bg-gradient-to-r from-violet-700 to-purple-500 text-white shadow-[0_4px_20px_rgba(139,92,246,0.4)] hover:opacity-90"
                : "bg-white/10 text-white hover:bg-white/15"
            }`}
          >
            {isExpired
              ? "Renew Plan →"
              : hasPlan
              ? "Upgrade →"
              : "Choose Plan →"}
          </button>
        )}
      </div>
    )
  },
)
PlanCard.displayName = "PlanCard"

// ─── Main page component ──────────────────────────────────────────────────────
const SubScriptionPlans = () => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const my_business = useAppSelector(selectAllBusiness)
  const all_subscription = useAppSelector(selectAllSubscription)
  const navigate = useNavigate()

  const [subscribing, setSubscribing] = useState(false)
  const [addingFreeTrial, setAddingFreeTrial] = useState(false)
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

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
      const response = await dispatch(
        addSubscription({ formData: { months, paymentNumber }, id }),
      ).unwrap()
      if (response.status === "processing" && response.checkoutRequestId) {
        const plan = all_subscription.find((p: any) => p.id === id)
        navigate("/processing", {
          state: {
            planName: plan?.name || "Subscription Plan",
            months,
            amount: parseFloat(plan?.price || "0") * months,
            checkoutRequestId: response.checkoutRequestId,
          },
        })
      } else {
        alert("Payment process could not be started.")
      }
    } catch {
      alert(
        "Something went wrong while processing your payment. Try again later.",
      )
    } finally {
      setSubscribing(false)
    }
  }

  const handleFreeTrial = async (id: number) => {
    try {
      setAddingFreeTrial(true)
      await dispatch(addFreeTrial({ id }))
    } catch {
      console.log("error")
    } finally {
      setAddingFreeTrial(false)
    }
  }

  // Shared props for both StatusBanner and PlanCard
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

  const gradientText = {
    background: "linear-gradient(90deg, #fff 0%, #c4b5fd 100%)",
    WebkitBackgroundClip: "text" as const,
    WebkitTextFillColor: "transparent" as const,
  }

  // ── Desktop ────────────────────────────────────────────────────────────────
  if (!isMobile) {
    return (
      <div
        className="min-h-screen text-white px-6 py-10"
        style={{
          background: "linear-gradient(160deg, #0f0c29, #302b63, #24243e)",
          fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        }}
      >
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-10">
            <div className="text-xs font-bold tracking-[4px] text-violet-400 uppercase mb-2">
              Pricing
            </div>
            <div className="text-5xl font-black mb-3" style={gradientText}>
              Choose Your Plan
            </div>
            <div className="text-sm text-white/50">
              Scale your business with the right tools
            </div>
          </div>

          {business && (
            <div className="max-w-[480px] mx-auto">
              <StatusBanner {...bannerProps} />
            </div>
          )}

          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5 mt-8">
            {all_subscription.map((plan: any) => (
              <PlanCard key={plan.id} plan={plan} {...cardProps} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── Mobile ─────────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen text-white flex flex-col"
      style={{
        background: "linear-gradient(160deg, #0f0c29, #302b63, #24243e)",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      }}
    >
      <Navbar headerMessage={"Pricing"} headerText={"Choose your plan"} />

      <main className="flex-1 px-4 pt-4 pb-28">
        <div className="text-center my-5 mb-6">
          <div className="text-[11px] font-bold tracking-[3px] text-violet-400 uppercase mb-2">
            Subscription Plans
          </div>
          <div
            className="text-2xl font-extrabold leading-tight mb-2"
            style={gradientText}
          >
            Power Up Your Business
          </div>
          <div className="text-xs text-white/50">Cancel or upgrade anytime</div>
        </div>

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

export default SubScriptionPlans
