/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../../utils/api"


interface Analysis {
  id: string
  business: string
  sales_team: string
  sales_choice: string
  sales_quantity: number
  total_amount: number
  cash_amount: number
  mpesa_amount: number
  date: string
}

interface AnalysisState {
  analysis: Analysis[]
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null | undefined
}

const initialState: AnalysisState = {
  analysis: [],
  status: "idle",
  error: null,
}

export const fetchAnalysis = createAsyncThunk<Analysis[],{}>("analysis/fetchAnalysis", async () => {

  const response = await api.get("/sales_ai/sales-analysis/")
  return response.data // Corrected the return statement
})




const analysisSlice = createSlice({
  name: "salesTeam",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAnalysis.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchAnalysis.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.analysis = action.payload
      })
      .addCase(fetchAnalysis.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to fetch analysis."
      })
    
  },
})

export const selectAllAnalysis = (state: { analysis: AnalysisState }) =>
  state.analysis.analysis
export const getAnalysisStatus = (state: { analysis: AnalysisState }) =>
  state.analysis.status
export const getAnalysisError = (state: { analysis: AnalysisState }) =>
  state.analysis.error

export default analysisSlice.reducer
