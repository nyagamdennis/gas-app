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

export const createBrand = createAsyncThunk<void, number>(
  "cylindersBrand/createBrand",
  async (pk) => {
    // await axios.post(`${apiUrl}/clear_debt/${pk}/`);
    await api.post(`/clear_debt/${pk}/`)
    return pk
  },
)

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

    // Clear Debtors Cases
    // .addCase(createBrand.pending, (state) => {
    //   state.createBrand = "loading";
    //   state.clearDebtError = null;
    // })
    // .addCase(createBrand.fulfilled, (state, action) => {
    //   state.clearDebtStatus = "succeeded";
    //   const clearedDebtorId = action.payload;
    //   state.debtors = state.debtors.filter(
    //     (debtor) => debtor.id !== clearedDebtorId
    //   );
    // })
    // .addCase(createBrand.rejected, (state, action) => {
    //   state.clearDebtStatus = "failed";
    //   state.clearDebtError =
    //     action.error.message || "Failed to clear the selected debt.";
    // });
  },
})

export const selectAllCylinderBrands = (state: {cylindersBrand: CylindersBrandState}) => state.cylindersBrand.cylindersBrand
export const getCylinderBrandsStatus = (state: {cylindersBrand: CylindersBrandState}) => state.cylindersBrand.status
export const getCylinderBrandsError = (state: {cylindersBrand: CylindersBrandState}) => state.cylindersBrand.error

export default cylindersBrandSlice.reducer
