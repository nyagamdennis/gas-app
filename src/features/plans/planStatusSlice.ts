// features/planStatus/planStatusSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { RootState } from "../../app/store"
import api from "../../../utils/api"

interface SubscriptionData {
  id: string
  plan_name: string
  plan_code: string
  status: string
  start_date: string
  expires_at: string
  is_active: boolean
}

interface CompanyData {
  id: string
  name: string
  logo?: string
  company_email?: string
  company_phone_number?: string
  website?: string
  location?: string
  // Add other company fields as needed
}

interface PlanStatusState {
  isExpired: boolean
  businessId: string | null
  businessName: string | null
  businessLogo: string | null
  businessEmail: string | null
  businessPhone: string | null
  businessWebsite: string | null
  businessLocation: string | null
  subscriptionPlan: string | null
  subscriptionStatus: string | null
  expiresAt: string | null
  loading: boolean
  error: string | null
  lastFetched: number | null
}

const initialState: PlanStatusState = {
  isExpired: false,
  businessId: null,
  businessName: null,
  businessLogo: null,
  businessEmail: null,
  businessPhone: null,
  businessWebsite: null,
  businessLocation: null,
  subscriptionPlan: null,
  subscriptionStatus: null,
  expiresAt: null,
  loading: false,
  error: null,
  lastFetched: null,
}

// 🔥 Async thunk to fetch company data by ID
export const fetchCompanyData = createAsyncThunk(
  "planStatus/fetchCompany",
  async (companyId: number, { rejectWithValue }) => {
    try {
      const response = await api.get(`/company/details/${companyId}/`)
      console.log("Fetched company data:", response.data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to fetch company data",
      )
    }
  },
)

// 🔥 Store subscription data from login response
export const setSubscriptionFromLogin = createAsyncThunk(
  "planStatus/setFromLogin",
  async (
    loginData: {
      company_id: number | null
      subscription: SubscriptionData | null
    },
    { dispatch, rejectWithValue },
  ) => {
    try {
      let companyData: CompanyData | null = null

      // Fetch company data if company_id exists
      if (loginData.company_id) {
        const response = await dispatch(fetchCompanyData(loginData.company_id))
        if (fetchCompanyData.fulfilled.match(response)) {
          companyData = response.payload as CompanyData
        }
      }

      // Check if subscription is expired
      const isExpired = loginData.subscription
        ? new Date(loginData.subscription.expires_at) < new Date() ||
          !loginData.subscription.is_active
        : true

        console.log("company data in planStatusSlice here:", companyData)
      console.log("Subscription isExpired is here:", isExpired)
      console.log("Login data in planStatusSlice here also:", loginData)
      return {
        isExpired,
        businessId: companyData?.id || null,
        businessName: companyData?.name || null,
        businessLogo: companyData?.logo || null,
        businessEmail: companyData?.company_email || null,
        businessPhone: companyData?.company_phone_number || null,
        businessWebsite: companyData?.website || null,
        businessLocation: companyData?.location || null,
        subscriptionPlan: loginData.subscription?.plan_name || null,
        subscriptionStatus: loginData.subscription?.status || null,
        expiresAt: loginData.subscription?.expires_at || null,
      }
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  },
)

const planStatusSlice = createSlice({
  name: "planStatus",
  initialState,
  reducers: {
    clearPlanStatus: () => initialState,
    // Manual setter for when you already have the data
    setPlanStatus: (state, action) => {
      const { subscription, companyId, companyName, companyLogo, companyEmail, companyPhone, companyWebsite, companyLocation } =
        action.payload

      if (subscription) {
        state.isExpired =
          new Date(subscription.expires_at) < new Date() ||
          !subscription.is_active
        state.subscriptionPlan = subscription.plan_name
        state.subscriptionStatus = subscription.status
        state.expiresAt = subscription.expires_at
      }

      state.businessId = companyId || null
      state.businessName = companyName || null
      state.businessLogo = companyLogo || null
      state.businessEmail = companyEmail || null
      state.businessPhone = companyPhone || null
      state.businessWebsite = companyWebsite || null
      state.businessLocation = companyLocation || null
      state.lastFetched = Date.now()
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch company data
      .addCase(fetchCompanyData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCompanyData.fulfilled, (state, action) => {
        state.loading = false
        state.businessId = action.payload.id
        state.businessName = action.payload.name
        state.businessLogo = action.payload.logo || null
        state.businessEmail = action.payload.company_email || null
        state.businessPhone = action.payload.company_phone_number || null
        state.businessWebsite = action.payload.website || null
        state.businessLocation = action.payload.location || null
      })
      .addCase(fetchCompanyData.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Set from login
      .addCase(setSubscriptionFromLogin.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(setSubscriptionFromLogin.fulfilled, (state, action) => {
        state.loading = false
        state.isExpired = action.payload.isExpired
        state.businessId = action.payload.businessId
        state.businessName = action.payload.businessName
        state.businessLogo = action.payload.businessLogo
        state.subscriptionPlan = action.payload.subscriptionPlan
        state.subscriptionStatus = action.payload.subscriptionStatus
        state.expiresAt = action.payload.expiresAt
        state.lastFetched = Date.now()
      })
      .addCase(setSubscriptionFromLogin.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearPlanStatus, setPlanStatus } = planStatusSlice.actions

// Selectors
export const selectPlanStatus = (state: RootState) => state.planStatus
export const selectIsExpired = (state: RootState) => state.planStatus.isExpired
export const selectBusinessId = (state: RootState) =>
  state.planStatus.businessId
export const selectSubscriptionPlan = (state: RootState) =>
  state.planStatus.subscriptionPlan

export default planStatusSlice.reducer
