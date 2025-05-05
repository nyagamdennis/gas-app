// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  fetchSubscription,
  selectAllSubscription,
} from "../features/subscriptions/subscriptionSlice";
import AdminsFooter from "../components/AdminsFooter";
import AdminNav from "../components/ui/AdminNav";
import FormattedAmount from "../components/FormattedAmount";

const SubScriptionPlans = () => {
  const dispatch = useAppDispatch();
  const all_subscription = useAppSelector(selectAllSubscription);

  useEffect(() => {
    dispatch(fetchSubscription());
  }, [dispatch]);

  // State to store month selection per plan
  const [selectedMonths, setSelectedMonths] = useState({});

  const handleMonthChange = (planName, months) => {
    setSelectedMonths((prev) => ({ ...prev, [planName]: months }));
  };

  const calculateTotal = (priceString, months) => {
    const numericPrice = parseFloat(priceString.replace(/[^0-9.]/g, ""));
    return <FormattedAmount amount={numericPrice * months} /> ;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNav
        headerMessage="Manage your subscription plans"
        headerText="Subscription Plans"
      />
      <div className="max-w-6xl mx-auto px-4 py-1">
        <h2 className="text-xl font-bold text-center mb-8">Choose Your Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {all_subscription.map((plan) => {
            const months = selectedMonths[plan.name] || 1;
            const isContact = plan.price.toLowerCase().includes("contact");
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
                  {plan.price}
                </div>
                <p className="text-gray-600 mb-4">{plan.description}</p>

                <ul className="flex-1 space-y-2 mb-4">
                  {plan.features?.map((feature, index) => (
                    <li key={index} className="text-gray-700 flex items-center">
                      <span className="mr-2 text-blue-500">✔</span> {feature.name}
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

                <button
                  className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                    plan.highlight
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-700 hover:bg-gray-800"
                  }`}
                >
                  {isContact ? "Get in Touch" : "Choose Plan"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <footer className="bg-gray-100 mt-auto">
        <AdminsFooter />
      </footer>
    </div>
  );
};

export default SubScriptionPlans;