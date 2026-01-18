/* eslint-disable prettier/prettier */
// @ts-nocheck
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../../utils/api"


type Status = "idle" | "loading" | "succeeded" | "failed"

interface CylindersWeight {
  id: string
  weight: string
}

interface CylindersWeightState {
  cylindersWeight: CylindersWeight[]
  status: Status
  error: string | null
}

const initialState: CylindersWeightState = {
  cylindersWeight: [],
  status: "idle",
  error: null,
}

export const fetchCylindersWeight = createAsyncThunk<CylindersWeight[], void>(
  "cylindersWeight/fetchCylindersWeight",
  async () => {
    const response = await api.get("/cylinder/weights/")
    return response.data
  },
)



type NewCylindersWeight = { name: string }

export const createCylindersWeight = createAsyncThunk<
  CylindersWeight,
  NewCylindersWeight
>("cylindersWeight/createCylindersWeight", async (weight) => {
  const response = await api.post("/cylinder/weights/", weight)
  return response.data as CylindersWeight
})

const cylindersWeightSlice = createSlice({
  name: "cylindersWeight",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch CylindersWeight Cases
      .addCase(fetchCylindersWeight.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(fetchCylindersWeight.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.cylindersWeight = action.payload
      })
      .addCase(fetchCylindersWeight.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to fetch cylindersWeight."
      })

      .addCase(createCylindersWeight.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(createCylindersWeight.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.cylindersWeight.push(action.payload.weight)
      })
      .addCase(createCylindersWeight.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to create brand."
      })
  },
})

export const selectAllCylindersWeight = (state: {
  cylindersWeight: CylindersWeightState
}) => state.cylindersWeight.cylindersWeight
export const getCylinderWeightStatus = (state: {
  cylindersWeight: CylindersWeightState
}) => state.cylindersWeight.status
export const getCylinderWeightError = (state: {
  cylindersWeight: CylindersWeightState
}) => state.cylindersWeight.error

export default cylindersWeightSlice.reducer
