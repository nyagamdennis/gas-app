// @ts-nocheck
import React, { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import {
  addFreeTrial,
  addSubscription,
  fetchSubscription,
  selectAllSubscription,
} from "../features/subscriptions/subscriptionSlice"
import AdminsFooter from "../components/AdminsFooter"
import AdminNav from "../components/ui/AdminNav"
import FormattedAmount from "../components/FormattedAmount"
import { useNavigate, useSearchParams } from "react-router-dom"
import {
  fetchBusiness,
  selectAllBusiness,
} from "../features/business/businnesSlice"
import DateDisplay from "../components/DateDisplay"
import Datetime from "../components/Datetime"
import SubscriptionCountdownTimer from "../components/SubscriptionCountdownTimer"

const SubScriptionPlans = () => {
  const dispatch = useAppDispatch()
  const my_business = useAppSelector(selectAllBusiness)
  const all_subscription = useAppSelector(selectAllSubscription)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [subscribing, setSubscribing] = useState(false)
  const [paymentNumber, setPaymentNumber] = useState("")
  const [paymentNumberInput, setPaymentNumberInput] = useState(false)
  const [activePlanId, setActivePlanId] = useState(null)

  const [selectedMonths, setSelectedMonths] = useState({})

  useEffect(() => {
    dispatch(fetchSubscription())
    dispatch(fetchBusiness())
  }, [dispatch])

  const business = my_business
  const hasPlan = business?.subscription_plan !== null
  const planName = business?.subscription_plan?.name
  const expiryDate = business?.subscription_plan_expiry
    ? new Date(business.subscription_plan_expiry)
    : null
  const isExpired = business?.is_expired
  const isTrial = business?.is_trial
  const trialEndsIn = business?.trial_ends_in
  const daysRemaining = business?.days_remaining

  const handleMonthChange = (planName, months) => {
    setSelectedMonths((prev) => ({ ...prev, [planName]: months }))
  }

  const calculateTotal = (priceString, months) => {
    const numericPrice = parseFloat(priceString.replace(/[^0-9.]/g, ""))
    return <FormattedAmount amount={numericPrice * months} />
  }

  
  const handleSubscription = async (id) => {
    const selected = selectedMonths[planName] || 1
    const formData = {
      months: selected,
      paymentNumber: paymentNumber,
    }
  
    try {
      setSubscribing(true)
  
      const response = await dispatch(addSubscription({ formData, id })).unwrap()
  
      // Check if the backend response has a 'processing' status
      if (response.status === "processing" && response.checkoutRequestId) {
        const plan = all_subscription.find(p => p.id === id)
  
        navigate("/processing", {
          state: {
            planName: plan?.name || "Subscription Plan",
            months: selected,
            amount: parseFloat(plan?.price || "0") * selected,
            checkoutRequestId: response.checkoutRequestId,
          },
        })
      } else {
        alert("Payment process could not be started.")
      }
    } catch (error) {
      console.error("Subscription error:", error)
      alert("Something went wrong while processing your payment.")
    } finally {
      setSubscribing(false)
    }
  }
  

  const handleAddFreeTrial = async (id) => {
    try {
      await dispatch(addFreeTrial({ id }))
    } catch (error) {
      alert("Error starting free trial")
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNav
        headerMessage="Manage your subscription plans"
        headerText="Subscription Plans"
      />

      <div className="max-w-6xl mx-auto px-4 py-1">
        <h2 className="text-xl font-bold text-center mb-6">Choose Your Plan</h2>

        {business && (
          <div className="mb-6 p-4 border rounded-md shadow bg-white space-y-2">
            {!hasPlan && !isTrial && (
              <p className="text-green-700 font-semibold">
                🎉 You're eligible for a free trial.
              </p>
            )}
            {isTrial && trialEndsIn !== null && (
              <p className="text-blue-600 font-semibold">
                You're on a <strong>free trial</strong>. It ends in{" "}
                <strong>{trialEndsIn} day(s)</strong> on{" "}
                <strong>
                  <Datetime date={expiryDate} showTime />
                  
                </strong>
                .
              </p>
            )}
            {hasPlan && !isTrial && (
              <>
                <p className="text-gray-800">
                  You're on the <strong>{planName}</strong> plan.{" "}
                  {expiryDate && (
                    <p className="text-sm text-gray-700 mt-2">
                      ⏰ Expires in:{" "}
                      <SubscriptionCountdownTimer expiryDate={expiryDate} />
                      
                    </p>
                  )}
                  {isExpired ? (
                    <span className="text-red-600">
                      It expired on{" "}
                      <strong>
                        <Datetime date={expiryDate} showTime />
                      </strong>
                      .
                    </span>
                  ) : (
                    <span>
                      It expires in <strong>{daysRemaining} day(s)</strong> on{" "}
                      <strong>
                        <DateDisplay date={expiryDate} showTime />
                      </strong>
                      .
                    </span>
                  )}
                </p>
              </>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {all_subscription.map((plan) => {
            const months = selectedMonths[plan.name] || 1
            const isContact = plan.price.toLowerCase().includes("contact")
            return (
              <div
                key={plan.name}
                className={`flex flex-col border rounded-xl shadow-sm transition duration-300 p-6 bg-white ${
                  plan.highlight
                    ? "border-blue-600 shadow-md scale-105"
                    : "border-gray-200"
                }`}
              >
                {plan.highlight && (
                  <div className="mb-2 text-sm font-semibold text-blue-600">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <div className="text-2xl font-bold text-gray-800 mb-2">
                  <FormattedAmount amount={plan.price} />
                  <span className="text-sm">/month</span>
                </div>
                <p className="text-gray-600 mb-4">{plan.description}</p>

                <ul className="flex-1 space-y-2 mb-4">
                  {plan.features?.map((feature, index) => (
                    <li key={index} className="text-gray-700 flex items-center">
                      <span className="mr-2 text-blue-500">✔</span>
                      {feature.name}
                    </li>
                  ))}
                </ul>

                {!isContact && (
                  <>
                    <label className="block text-sm mb-2 text-gray-700">
                      Subscription duration
                    </label>
                    <select
                      className="mb-4 outline-none w-full border rounded-md px-3 py-2 text-sm"
                      value={months}
                      onChange={(e) =>
                        handleMonthChange(plan.name, parseInt(e.target.value))
                      }
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                        <option key={m} value={m}>
                          {m} {m === 1 ? "month" : "months"}
                        </option>
                      ))}
                    </select>
                    <div className="text-gray-600 mb-4 text-sm">
                      Total:{" "}
                      <span className="font-semibold">
                        {calculateTotal(plan.price, months)}
                      </span>
                    </div>
                  </>
                )}

                {!hasPlan && !isTrial && (
                  <button
                    onClick={() => handleAddFreeTrial(plan.id)}
                    className="w-full py-2 px-4 rounded-md text-white font-medium bg-green-600 hover:bg-green-700 mb-2"
                  >
                    Start 5-Day Free Trial
                  </button>
                )}

                {/* {paymentNumberInput && (
                  <div >
                    <p className=" text-xs font-bold mb-2">Enter mpesa number to pay with</p>
                    <input
                      type="text"
                      value={paymentNumber}
                      onChange={(e) => setPaymentNumber(e.target.value)}
                      placeholder="Enter payment number"
                      className="mb-4 outline-none w-full border rounded-md px-3 py-2 text-sm"
                    />
                    <div className="flex justify-between gap-2 flex-col-reverse mb-2">
                      <button
                        onClick={() => setPaymentNumberInput(false)}
                        className="flex-1 py-2 px-4 rounded-md text-white font-medium bg-red-600 hover:bg-red-700"
                      >
                        Cancel
                      </button>
                      <button
  onClick={() => {
    
    handleSubscription(plan.id)
  }}
  disabled={subscribing}
  className={`flex-1 py-2 px-4 rounded-md text-white font-medium bg-blue-600 hover:bg-blue-700 ${
    subscribing ? "opacity-50 cursor-not-allowed" : ""
  }`}
>
  {subscribing ? "Processing..." : "Make Payment"}
</button>

                    </div>
                  </div>
                )} */}
                {activePlanId === plan.id && (
  <div>
    <p className="text-xs font-bold mb-2">Enter mpesa number to pay with</p>
    <form>
    <input
      type="text"
      required
      value={paymentNumber}
      onChange={(e) => setPaymentNumber(e.target.value)}
      placeholder="Enter payment number"
      className="mb-4 outline-none w-full border rounded-md px-3 py-2 text-sm"
    />
    <div className="flex justify-between gap-2 flex-col-reverse mb-2">
      <button
        onClick={() => setActivePlanId(null)}
        className="flex-1 py-2 px-4 rounded-md text-white font-medium bg-red-600 hover:bg-red-700"
      >
        Cancel
      </button>
      <button
        onClick={() => handleSubscription(plan.id)}
        disabled={subscribing}
        className={`flex-1 py-2 px-4 rounded-md text-white font-medium bg-blue-600 hover:bg-blue-700 ${
          subscribing ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {subscribing ? "Processing..." : "Make Payment"}
      </button>
    </div>
    </form>
    
  </div>
)}


                {/* {!paymentNumberInput && (
                  <button
                    onClick={() => setPaymentNumberInput(true)}
                    className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                      plan.highlight
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-700 hover:bg-gray-800"
                    }`}
                  >
                    {isExpired ? "Renew Plan" : "Renew in Advance"}
                  </button>
                )} */}
                {activePlanId !== plan.id && (
            <button
              onClick={() => setActivePlanId(plan.id)}
              className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                plan.highlight
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-700 hover:bg-gray-800"
              }`}
            >
              {isExpired ? "Renew Plan" : "Renew in Advance"}
            </button>
)}

              </div>
            )
          })}
        </div>
      </div>
      <footer className="bg-gray-100 mt-auto">
        <AdminsFooter />
      </footer>
    </div>
  )
}

export default SubScriptionPlans
