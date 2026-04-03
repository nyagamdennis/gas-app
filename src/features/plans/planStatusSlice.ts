// features/planStatus/planStatusSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { RootState } from "../../app/store"
import api from "../../../utils/api"
import jwt_decode from "jwt-decode"
import cookies from "cookies-js"

// ─── JWT shape (matches your decoded token) ───────────────────────────────────
interface DecodedToken {
  token_type: string
  exp: number
  iat: number
  jti: string
  user_id: string
  email: string
  email_is_verified: boolean
  phone: string
  phone_is_verified: boolean
  role: string
  onboarding_stage: string
  company_id: number | null
  subscription: {
    id: number
    plan_name: string
    plan_code: string
    status: string
    start_date: string
    expires_at: string
    is_active: boolean
  } | null
}

interface PlanStatusState {
  isExpired: boolean
  isSubscribed: boolean
  businessId: string | null
  businessName: string | null
  businessLogo: string | null
  businessEmail: string | null
  businessPhone: string | null
  businessWebsite: string | null
  businessLocation: string | null
  subscriptionPlan: string | null
  subscriptionPlanCode: string | null
  subscriptionStatus: string | null
  expiresAt: string | null
  loading: boolean
  error: string | null
  lastFetched: number | null
}

// ─── Helper: decode token and extract plan/subscription data ──────────────────
const decodeTokenData = (): Partial<PlanStatusState> => {
  try {
    const accessToken = cookies.get("accessToken")
    if (!accessToken) return {}

    const decoded = jwt_decode<DecodedToken>(accessToken)

    const sub = decoded.subscription
    const isExpired = sub
      ? new Date(sub.expires_at) < new Date() ||
        !sub.is_active ||
        sub.status === "EXPIRED"
      : true

    return {
      isExpired,
      isSubscribed: sub ? sub.is_active && !isExpired : false,
      subscriptionPlan: sub?.plan_name || null,
      subscriptionPlanCode: sub?.plan_code || null,
      subscriptionStatus: sub?.status || null,
      expiresAt: sub?.expires_at || null,
      // company_id is available from the token — company details fetched separately
      businessId: decoded.company_id ? String(decoded.company_id) : null,
    }
  } catch (err) {
    return {}
  }
}

// ─── Seed initial state from cookie token (persists across page refresh) ──────
const tokenData = decodeTokenData()

const initialState: PlanStatusState = {
  isExpired: tokenData.isExpired ?? true,
  isSubscribed: tokenData.isSubscribed ?? false,
  businessId: tokenData.businessId ?? null,
  businessName: null,
  businessLogo: null,
  businessEmail: null,
  businessPhone: null,
  businessWebsite: null,
  businessLocation: null,
  subscriptionPlan: tokenData.subscriptionPlan ?? null,
  subscriptionPlanCode: tokenData.subscriptionPlanCode ?? null,
  subscriptionStatus: tokenData.subscriptionStatus ?? null,
  expiresAt: tokenData.expiresAt ?? null,
  loading: false,
  error: null,
  lastFetched: null,
}

// ─── Thunk: fetch full company details using company_id from token ─────────────
export const fetchCompanyData = createAsyncThunk(
  "planStatus/fetchCompany",
  async (companyId: number, { rejectWithValue }) => {
    try {
      const response = await api.get(`/company/details/${companyId}/`)
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to fetch company data",
      )
    }
  },
)

// ─── Thunk: read subscription + company_id from token, then fetch company ──────
// Call this after login or token refresh instead of setSubscriptionFromLogin
export const loadPlanStatusFromToken = createAsyncThunk(
  "planStatus/loadFromToken",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const accessToken = cookies.get("accessToken")
      if (!accessToken) throw new Error("No access token found")

      const decoded = jwt_decode<DecodedToken>(accessToken)
      const sub = decoded.subscription

      const isExpired = sub
        ? new Date(sub.expires_at) < new Date() ||
          !sub.is_active ||
          sub.status === "EXPIRED"
        : true

      const isSubscribed = sub ? sub.is_active && !isExpired : false

      // Fetch company data if company_id is in token
      let companyData = null
      if (decoded.company_id) {
        const result = await dispatch(fetchCompanyData(decoded.company_id))
        if (fetchCompanyData.fulfilled.match(result)) {
          companyData = result.payload
        }
      }

      return {
        isExpired,
        isSubscribed,
        businessId: companyData?.id
          ? String(companyData.id)
          : decoded.company_id
          ? String(decoded.company_id)
          : null,
        businessName: companyData?.name || null,
        businessLogo: companyData?.logo || null,
        businessEmail: companyData?.company_email || null,
        businessPhone: companyData?.company_phone_number || null,
        businessWebsite: companyData?.website || null,
        businessLocation: companyData?.location || null,
        subscriptionPlan: sub?.plan_name || null,
        subscriptionPlanCode: sub?.plan_code || null,
        subscriptionStatus: sub?.status || null,
        expiresAt: sub?.expires_at || null,
      }
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  },
)

// ─── Keep for backwards compat but now reads from token internally ─────────────
export const setSubscriptionFromLogin = createAsyncThunk(
  "planStatus/setFromLogin",
  async (_: any, { dispatch }) => {
    // Ignore the loginData arg — read from token instead
    return dispatch(loadPlanStatusFromToken()).unwrap()
  },
)

// ─── Slice ─────────────────────────────────────────────────────────────────────
const planStatusSlice = createSlice({
  name: "planStatus",
  initialState,
  reducers: {
    clearPlanStatus: () => ({
      ...initialState,
      // Re-read token on clear so refresh doesn't lose data
      ...decodeTokenData(),
    }),

    // Manually refresh from current token (call after token refresh)
    refreshFromToken: (state) => {
      const data = decodeTokenData()
      if (data.isExpired !== undefined) state.isExpired = data.isExpired
      if (data.isSubscribed !== undefined)
        state.isSubscribed = data.isSubscribed
      if (data.subscriptionPlan !== undefined)
        state.subscriptionPlan = data.subscriptionPlan
      if (data.subscriptionPlanCode !== undefined)
        state.subscriptionPlanCode = data.subscriptionPlanCode
      if (data.subscriptionStatus !== undefined)
        state.subscriptionStatus = data.subscriptionStatus
      if (data.expiresAt !== undefined) state.expiresAt = data.expiresAt
      if (data.businessId !== undefined) state.businessId = data.businessId
    },

    setPlanStatus: (state, action) => {
      const {
        subscription,
        companyId,
        companyName,
        companyLogo,
        companyEmail,
        companyPhone,
        companyWebsite,
        companyLocation,
      } = action.payload

      if (subscription) {
        state.isExpired =
          new Date(subscription.expires_at) < new Date() ||
          !subscription.is_active
        state.isSubscribed = !state.isExpired && subscription.is_active
        state.subscriptionPlan = subscription.plan_name
        state.subscriptionPlanCode = subscription.plan_code
        state.subscriptionStatus = subscription.status
        state.expiresAt = subscription.expires_at
      }

      state.businessId = companyId ? String(companyId) : null
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
      // fetchCompanyData
      .addCase(fetchCompanyData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCompanyData.fulfilled, (state, action) => {
        state.loading = false
        state.businessId = action.payload.id
          ? String(action.payload.id)
          : state.businessId
        state.businessName = action.payload.name || null
        state.businessLogo = action.payload.logo || null
        state.businessEmail = action.payload.company_email || null
        state.businessPhone = action.payload.company_phone_number || null
        state.businessWebsite = action.payload.website || null
        state.businessLocation = action.payload.location || null
        state.lastFetched = Date.now()
      })
      .addCase(fetchCompanyData.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // loadPlanStatusFromToken
      .addCase(loadPlanStatusFromToken.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loadPlanStatusFromToken.fulfilled, (state, action) => {
        state.loading = false
        state.isExpired = action.payload.isExpired
        state.isSubscribed = action.payload.isSubscribed
        state.businessId = action.payload.businessId
        state.businessName = action.payload.businessName
        state.businessLogo = action.payload.businessLogo
        state.businessEmail = action.payload.businessEmail
        state.businessPhone = action.payload.businessPhone
        state.businessWebsite = action.payload.businessWebsite
        state.businessLocation = action.payload.businessLocation
        state.subscriptionPlan = action.payload.subscriptionPlan
        state.subscriptionPlanCode = action.payload.subscriptionPlanCode
        state.subscriptionStatus = action.payload.subscriptionStatus
        state.expiresAt = action.payload.expiresAt
        state.lastFetched = Date.now()
      })
      .addCase(loadPlanStatusFromToken.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // setSubscriptionFromLogin (delegates to loadPlanStatusFromToken)
      .addCase(setSubscriptionFromLogin.pending, (state) => {
        state.loading = true
      })
      .addCase(setSubscriptionFromLogin.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(setSubscriptionFromLogin.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearPlanStatus, setPlanStatus, refreshFromToken } =
  planStatusSlice.actions

// ─── Selectors ─────────────────────────────────────────────────────────────────
export const selectPlanStatus = (state: RootState) => state.planStatus
export const selectIsExpired = (state: RootState) => state.planStatus.isExpired
export const selectIsSubscribed = (state: RootState) =>
  state.planStatus.isSubscribed
export const selectBusinessId = (state: RootState) =>
  state.planStatus.businessId
export const selectBusinessName = (state: RootState) =>
  state.planStatus.businessName
export const selectBusinessLogo = (state: RootState) =>
  state.planStatus.businessLogo
export const selectSubscriptionPlan = (state: RootState) =>
  state.planStatus.subscriptionPlan
export const selectSubscriptionPlanCode = (state: RootState) =>
  state.planStatus.subscriptionPlanCode
export const selectSubscriptionStatus = (state: RootState) =>
  state.planStatus.subscriptionStatus
export const selectExpiresAt = (state: RootState) => state.planStatus.expiresAt

export default planStatusSlice.reducer
