/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../../utils/api"


interface AnalysisAi {
  id: string
  
}

interface AnalysisAiState {
  analysisAi: AnalysisAi[]
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null | undefined
}

const initialState: AnalysisAiState = {
  analysisAi: [],
  status: "idle",
  error: null,
}

export const fetchAnalysisAi = createAsyncThunk<AnalysisAi[]>("analysisAi/fetchAnalysisAi", async () => {
  const response = await api.get("/sales_ai/predict/")
  return response.data // Corrected the return statement
})




const aiAnalysisSlice = createSlice({
  name: "analysisAi",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAnalysisAi.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchAnalysisAi.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.analysisAi = action.payload
      })
      .addCase(fetchAnalysisAi.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to fetch analysisAi."
      })
    
  },
})

export const selectAllAnalysisAi = (state: { analysisAi: AnalysisAiState }) =>
  state.analysisAi.analysisAi
export const getAnalysisAiStatus = (state: { analysisAi: AnalysisAiState }) =>
  state.analysisAi.status
export const getAnalysisAiError = (state: { analysisAi: AnalysisAiState }) =>
  state.analysisAi.error

export default aiAnalysisSlice.reducer
