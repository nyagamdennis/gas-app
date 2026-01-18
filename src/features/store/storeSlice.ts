// @ts-nocheck
/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../../utils/api"

type Status = "idle" | "loading" | "succeeded" | "failed"

interface store {
  id: string
  name: string
  location: string
}

interface storeState {
  store: store[]
  status: Status
  error: string | null
}

const initialState: storeState = {
  store: [],
  status: "idle",
  error: null,
}

export const fetchStore = createAsyncThunk<store[], { businessId: string }, {}>(
  "store/fetchStore",
  async ({ businessId }) => {
    const response = await api.get<store[]>(`/store/`)
    return response.data
  },
)



const storeSlice = createSlice({
  name: "store",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchStore.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchStore.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.store = action.payload
      })
      .addCase(fetchStore.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to fetch products"
      })
  },
})



export const selectAllStore = (state: { store: storeState }) =>
  state.store.store
export const getStoreStatus = (state: { store: storeState }) =>
  state.store.status
export const getStoreError = (state: { store: storeState }) => state.store.error

export default storeSlice.reducer
