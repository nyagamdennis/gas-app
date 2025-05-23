// @ts-nocheck
/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import getApiUrl from "../../getApiUrl"
import { JSX } from "react/jsx-runtime"
import Cookies from "cookies-js"
import api from "../../../utils/api"



type Status = "idle" | "loading" | "succeeded" | "failed"

interface Payments {
  id: string
  

}

interface paymentsState {
  payments: Payments[]
  status: Status
  error: string | null

  addpaymentsStatus: Status
  addpaymentsError: string | null | undefined

  addNewCylinderStatus: Status
  addNewCylinderError: string | null | undefined

  updateCylinderStatus: Status
  updateCylinderError: string | null | undefined

  addAnotherCylinderStatus: Status
  addAnotherCyinderError: string | null | undefined

  deleteCylinderStatus: Status
  deleteCyinderError: string | null | undefined
}

const initialState: paymentsState = {
  payments: [],
  status: "idle",
  error: null,

  addpaymentsStatus: "idle",
  addpaymentsError: null,

  addNewCylinderStatus: "idle",
  addNewCylinderError: null,

  updateCylinderStatus: "idle",
  updateCylinderError: null,

  addAnotherCylinderStatus: "idle",
  addAnotherCyinderError: null,

  deleteCylinderStatus: "idle",
  deleteCyinderError: null,
}

export const fetchPayments = createAsyncThunk<Payments[], void, {}>(
  "payments/fetchPayments",
  async () => {
    await new Promise((resolve) => setTimeout(resolve, 5000))
    // const response = await axios.get<Payments[]>(`${apiUrl}/business/payments/${id}/`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${Cookies.get("accessToken")}`,
    //       "Content-Type": "multipart/form-data",
    //     },
    //   }
    // )
    const response = await api.get<Payments[]>("/business/payments/");
    return response.data
  },
)



const paymentsSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchPayments.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.payments = action.payload
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to fetch products"
      })

  },
})

export const selectAllPayments = (state: { payments: paymentsState }) =>
  state.payments.payments
export const getPaymentsStatus = (state: { payments: paymentsState }) =>
  state.payments.status
export const getPaymentsError = (state: { payments: paymentsState }) => state.payments.error

export default paymentsSlice.reducer
