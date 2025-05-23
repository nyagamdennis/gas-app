// @ts-nocheck
/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import getApiUrl from "../../getApiUrl"
import { JSX } from "react/jsx-runtime"
import api from "../../../utils/api"

type Status = "idle" | "loading" | "succeeded" | "failed"

interface Subscription {
  id: string
  name: string
  price: string
  features: {
    map(arg0: (feature: any, index: any) => JSX.Element): import("react").ReactNode
    id: string
    name: string
  }
  highlight:boolean
  description: string

}

interface subscriptionState {
  subscription: Subscription[]
  status: Status
  error: string | null

  addSubscriptionStatus: Status
  addSubscriptionError: string | null | undefined

  addFreeTrialStatus: Status
  addFreeTrialError: string | null | undefined

  updateCylinderStatus: Status
  updateCylinderError: string | null | undefined

  addAnotherCylinderStatus: Status
  addAnotherCyinderError: string | null | undefined

  deleteCylinderStatus: Status
  deleteCyinderError: string | null | undefined
}

const initialState: subscriptionState = {
  subscription: [],
  status: "idle",
  error: null,

  addSubscriptionStatus: "idle",
  addSubscriptionError: null,

  addFreeTrialStatus: "idle",
  addFreeTrialError: null,

  updateCylinderStatus: "idle",
  updateCylinderError: null,

  addAnotherCylinderStatus: "idle",
  addAnotherCyinderError: null,

  deleteCylinderStatus: "idle",
  deleteCyinderError: null,
}

export const fetchSubscription = createAsyncThunk<Subscription[], void, {}>(
  "subscription/fetchSubscription",
  async () => {
    // await new Promise((resolve) => setTimeout(resolve, 5000))
    // const response = await axios.get<Subscription[]>(`${apiUrl}/business/`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${Cookies.get("accessToken")}`,
    //       "Content-Type": "multipart/form-data",
    //     },
    //   }
    // )
    const response = await api.get<Subscription[]>("/business/");
    return response.data
  },
)






export const addSubscription = createAsyncThunk(
  "subscription/addSubscription",
  async ({formData, id}) => {
    // const response = await axios.post(`${apiUrl}/business/subscription/${id}/`, formData,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${Cookies.get("accessToken")}`,
    //       "Content-Type": "multipart/form-data",
    //     },
    //   }
    // )
    const response = await api.post(`/business/subscription/${id}/`, formData);
    return response.data
  },
)


export const addFreeTrial = createAsyncThunk(
  "subscription/addFreeTrial",
  async ({ id }: { id: string }, { rejectWithValue }) => {
    try {
      // const response = await axios.post(`${apiUrl}/business/subscription-free-trial/${id}/`, null,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${Cookies.get("accessToken")}`,
      //       "Content-Type": "multipart/form-data",
      //     },
      //   }
      // )
      const response = await api.post(`/business/subscription-free-trial/${id}/`, null);
      return response.data
    } catch (err: any) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data.message) // extract `error` field
      }
      return rejectWithValue(err.response.data.message) // fallback error
    }
  },
)





const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchSubscription.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchSubscription.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.subscription = action.payload
      })
      .addCase(fetchSubscription.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to fetch products"
      })


      .addCase(addSubscription.pending, (state) => {
        state.addSubscriptionStatus = "loading"
      })
      .addCase(addSubscription.fulfilled, (state, action) => {
        state.addSubscriptionStatus = "succeeded"
        // state.store = action.payload;
      })
      .addCase(addSubscription.rejected, (state, action) => {
        state.addSubscriptionError = action.error.message || "Failed to fetch products"
      })



      .addCase(addFreeTrial.pending, (state) => {
        state.addFreeTrialStatus = "loading"
      })
      .addCase(addFreeTrial.fulfilled, (state, action) => {
        state.addFreeTrialStatus = "succeeded"
        
        state.store = [action.payload.data, ...state.store]
      })

      .addCase(addFreeTrial.rejected, (state, action) => {
        state.addFreeTrialStatus = "failed"
        state.addFreeTrialError =
          action.error.message || "Failed to fetch products"
      })
     
      
  },
})

export const selectAllSubscription = (state: { subscription: subscriptionState }) =>
  state.subscription.subscription
export const getSubscriptionstatus = (state: { subscription: subscriptionState }) =>
  state.subscription.status
export const getSubscriptionError = (state: { subscription: subscriptionState }) => state.subscription.error

export default subscriptionSlice.reducer
