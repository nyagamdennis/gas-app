// @ts-nocheck
import React, { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { fetchBusiness, selectAllBusiness } from "../company/companySlice"

const planStatus = () => {
  const biz = useAppSelector(selectAllBusiness)
  console.log("🔍 planStatus Debug - Business Data:", biz) // Debug log to check the structure of biz
  const dispatch = useAppDispatch()

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
