// @ts-nocheck
/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../../utils/api"



interface Assigns {
  id: string
  name: number
  product: number
  timestamp: string
}

interface AssignsState {
  assigns: Assigns[]
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null | undefined
}

const initialState: AssignsState = {
  assigns: [],
  status: "idle",
  error: null,
}

export const fetchAssignedCylinders = createAsyncThunk(
  "assignedCylinders/fetchAssignedCylinders",
  async (salesTeamId) => {
  
    const response = await api.get("/print-assigned-cylinders/", {params : {sales_team: salesTeamId}})
    return response.data
  },
)

export const assignShopCylinders = createAsyncThunk(
  "assignShopCylinders/assignShopCylinders",
  async (payload) => {
    const response = await api.post("/inventory/transfer/cylinders/", payload)
    // transfer/cylinders/
    console.log("Response from assignShopCylinders:", response.data)
    return response.data
  },
)

export const assignShopBulkCylinders = createAsyncThunk(
  "assignShopBulkCylinders/assignShopBulkCylinders",
  async (payload) => {
    const response = await api.post("/inventory/transfer/cylinders/bulk/", payload)
    // transfer/cylinders/
    console.log("Response from assignShopBulkCylinders:", response.data)
    return response.data
  },
)

export const assignVehicleCylinders = createAsyncThunk(
  "assignVehicleCylinders/assignVehicleCylinders",
  async (payload) => {
    const response = await api.post("/assign-cylinders/", payload)
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

const assignsSlice = createSlice({
  name: "assigns",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder

      .addCase(assignShopCylinders.pending, (state, action) => {
        state.status = "loading"
      })
      .addCase(assignShopCylinders.fulfilled, (state, action) => {
        state.status = "succeeded"
        // state.assigns.push(action.payload);
      })
      .addCase(assignShopCylinders.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message
      })
      .addCase(assignShopBulkCylinders.pending, (state, action) => {
        state.status = "loading"
      })
      .addCase(assignShopBulkCylinders.fulfilled, (state, action) => {
        state.status = "succeeded"
        // state.assigns.push(action.payload);
      })
      .addCase(assignShopBulkCylinders.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message
      })
      .addCase(assignVehicleCylinders.pending, (state, action) => {
        state.status = "loading"
      })
      .addCase(assignVehicleCylinders.fulfilled, (state, action) => {
        state.status = "succeeded"
        // state.assigns.push(action.payload);
      })
      .addCase(assignVehicleCylinders.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message
      })
      .addCase(fetchAssignedCylinders.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchAssignedCylinders.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.assigns = action.payload
      })
      .addCase(fetchAssignedCylinders.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message
      })
      .addCase(assignedCylindersUpdate.pending, (state) => {
        state.status = "loading"
      })
      .addCase(assignedCylindersUpdate.fulfilled, (state, action) => {
        state.status = "succeeded"
        const index = state.assigns.findIndex(
          (assign) => assign.id === action.payload.id,
        )
        if (index !== -1) {
          state.assigns[index] = action.payload
        }
      })
      .addCase(assignedCylindersUpdate.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message
      })
  },
})

export const selectAllAssigns = (state: { assigns: AssignsState }) =>
  state.assigns.assigns
export const getAssignsStatus = (state: { assigns: AssignsState }) =>
  state.assigns.status
export const getAssignsError = (state: { assigns: AssignsState }) =>
  state.assigns.error

export default assignsSlice.reducer
