// @ts-nocheck
import React from "react"
import { useAppSelector } from "../../app/hooks"
import { selectAllBusiness } from "../business/businnesSlice"

const planStatus = () => {
  const biz = useAppSelector(selectAllBusiness)
  const businessName = biz?.name || null
  const businessLogo = biz?.business_logo || null
  const subscription_paid = biz?.subscription_payment || null
  const subscriptionPlan = biz?.subscription_plan?.name || null
  const businessId = biz?.id || null
  const subscriptionPlanExpiry = biz?.subscription_plan_expiry || null
  const isTrial = biz?.is_trial
  const isExpired = biz?.is_expired
  const planName = biz?.subscription_plan?.name || null
  const employeeLimit = biz?.subscription_plan?.employee_limit || null
  return {
    businessId,
    businessName,
    businessLogo,
    subscriptionPlan,
    isTrial,
    isExpired,
    planName,
    employeeLimit,
    isStandard: planName === "Standard",
    isPro: planName === "Pro",
  }
}

export default planStatus
