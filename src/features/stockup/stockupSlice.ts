// @ts-nocheck
/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../../utils/api"



interface Stockup {
  id: string
  name: number
  product: number
  timestamp: string
}

interface StockupState {
  stockup: Stockup[]
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null | undefined
}

const initialState: StockupState = {
  stockup: [],
  status: "idle",
  error: null,
}

export const fetchStockedupCylinders = createAsyncThunk(
  "assignedCylinders/fetchStockedupCylinders",
  async (salesTeamId) => {
    // const response = await axios.get(`${apiUrl}/print-assigned-cylinders/`, {
    //   headers: {
    //     Authorization: `Bearer ${Cookies.get("accessToken")}`,
    //   },
    //   params: {
    //     sales_team: salesTeamId,
    //   },
    // })
    const response = await api.get("/print-assigned-cylinders/", {params : {sales_team: salesTeamId}})
    return response.data
  },
)

export const stockupCylinders = createAsyncThunk(
  "stockupCylinders/stockupCylinders",
  async (payload) => {
    const response = await api.post("/stockup-cylinders/", payload)
    return response.data
  },
)

export const assignedCylindersUpdate = createAsyncThunk(
  "assignedCylinders/assignedCylindersUpdate",
  async (payload) => {
  
    const response = await api.put("/assign-update-cylinders/", payload)
    return response.data
  },
)

const stockupSlice = createSlice({
  name: "stockup",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder

      .addCase(stockupCylinders.pending, (state, action) => {
        state.status = "loading"
      })
      .addCase(stockupCylinders.fulfilled, (state, action) => {
        state.status = "succeeded"
        // state.stockup.push(action.payload);
      })
      .addCase(stockupCylinders.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message
      })
      .addCase(fetchStockedupCylinders.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchStockedupCylinders.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.stockup = action.payload
      })
      .addCase(fetchStockedupCylinders.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message
      })
      .addCase(assignedCylindersUpdate.pending, (state) => {
        state.status = "loading"
      })
      .addCase(assignedCylindersUpdate.fulfilled, (state, action) => {
        state.status = "succeeded"
        const index = state.stockup.findIndex(
          (assign) => assign.id === action.payload.id,
        )
        if (index !== -1) {
          state.stockup[index] = action.payload
        }
      })
      .addCase(assignedCylindersUpdate.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message
      })
  },
})

export const selectAllStockup = (state: { stockup: StockupState }) =>
  state.stockup.stockup
export const getStockupStatus = (state: { stockup: StockupState }) =>
  state.stockup.status
export const getStockupError = (state: { stockup: StockupState }) =>
  state.stockup.error

export default stockupSlice.reducer
