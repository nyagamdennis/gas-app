/* eslint-disable prettier/prettier */
// @ts-nocheck
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../../utils/api"

// const DEBTORS_URL = `${apiUrl}/debtors/`;

type Status = "idle" | "loading" | "succeeded" | "failed"

interface CylindersBrand {
  id: number
  name: string
}

interface CylindersBrandState {
  cylindersBrand: CylindersBrand[]
  status: Status
  error: string | null
}

const initialState: CylindersBrandState = {
  cylindersBrand: [],
  status: "idle",
  error: null,
}

export const fetchCylindersBrand = createAsyncThunk<Debtors[], void>(
  "debtors/fetchCylindersBrand",
  async () => {
    // const response = await axios.get<Debtors[]>(DEBTORS_URL);
    const response = await api.get("/cylinder-brands/")
    return response.data
  },
)

type NewCylindersBrand = { name: string }

export const createCylindersBrand = createAsyncThunk<
  CylindersBrand,
  NewCylindersBrand
>("cylindersBrand/createCylindersBrand", async (brand) => {
  const response = await api.post("/cylinder-brands/", brand)
  return response.data as CylindersBrand
})

const cylindersBrandSlice = createSlice({
  name: "debtors",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Debtors Cases
      .addCase(fetchCylindersBrand.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(fetchCylindersBrand.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.cylindersBrand = action.payload
      })
      .addCase(fetchCylindersBrand.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to fetch debtors."
      })
      .addCase(createCylindersBrand.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(createCylindersBrand.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.cylindersBrand.push(action.payload)
      })
      .addCase(createCylindersBrand.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to create brand."
      })
  },
})

export const selectAllCylinderBrands = (state: {
  cylindersBrand: CylindersBrandState
}) => state.cylindersBrand.cylindersBrand
export const getCylinderBrandsStatus = (state: {
  cylindersBrand: CylindersBrandState
}) => state.cylindersBrand.status
export const getCylinderBrandsError = (state: {
  cylindersBrand: CylindersBrandState
}) => state.cylindersBrand.error

export default cylindersBrandSlice.reducer
