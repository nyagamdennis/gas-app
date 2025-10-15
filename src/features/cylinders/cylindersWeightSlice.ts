/* eslint-disable prettier/prettier */
// @ts-nocheck
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../../utils/api"

// const CYLINDERSWEIGHT_URL = `${apiUrl}/cylindersWeight/`;

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
    const response = await api.get("/cylinder-weight/")
    return response.data
  },
)

export const createCylindersWeight = createAsyncThunk<void, number>(
  "cylindersWeight/createCylindersWeight",
  async (pk) => {
    // await axios.post(`${apiUrl}/clear_debt/${pk}/`);
    await api.post(`/clear_debt/${pk}/`)
    return pk
  },
)

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

    // Clear CylindersWeight Cases
    // .addCase(createCylindersWeight.pending, (state) => {
    //   state.createCylindersWeight = "loading";
    //   state.clearDebtError = null;
    // })
    // .addCase(createCylindersWeight.fulfilled, (state, action) => {
    //   state.clearDebtStatus = "succeeded";
    //   const clearedDebtorId = action.payload;
    //   state.cylindersWeight = state.cylindersWeight.filter(
    //     (debtor) => debtor.id !== clearedDebtorId
    //   );
    // })
    // .addCase(createCylindersWeight.rejected, (state, action) => {
    //   state.clearDebtStatus = "failed";
    //   state.clearDebtError =
    //     action.error.message || "Failed to clear the selected debt.";
    // });
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
