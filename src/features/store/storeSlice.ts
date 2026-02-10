// @ts-nocheck
/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../../utils/api"

type Status = "idle" | "loading" | "succeeded" | "failed"



interface Location {
  id: number
  name: string
  coordinates?: string
}

interface Store {
  id: number
  name: string
  location: Location
  company: number
  created_at?: string
  updated_at?: string
}

interface StoreResponse {
  message: string
  store: Store
}

interface storeState {
  store: store[]
  status: Status
  error: string | null
  currentStore: Store | null
}

const initialState: storeState = {
  store: [],
  status: "idle",
  error: null,
  currentStore: null,
}

export const fetchStore = createAsyncThunk<store[], { businessId: string }, {}>(
  "store/fetchStore",
  async ({ businessId }) => {
    const response = await api.get<store[]>(`/store/`)
    return response.data
  },
)

export const addStore = createAsyncThunk<
  Stores, // The type of the returned data
  {
    business: number
    name: string
    location: string
  },
  { rejectValue: string } // Type for rejected value
>("store/addStore", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.post(`/store/`, formData) // API call to add a new vehicle
    return response.data // Return the newly added vehicle
  } catch (error: any) {
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data.message) // Return API error message
    }
    return rejectWithValue("Failed to add store. Please try again.")
  }
})

// Delete store
export const deleteStore = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("store/deleteStore", async (storeId, { rejectWithValue }) => {
  try {
    await api.delete(`/store/stores/${storeId}/`)
    return storeId
  } catch (error: any) {
    if (error.response && error.response.data) {
      return rejectWithValue(
        error.response.data.message || "Failed to delete store",
      )
    }
    return rejectWithValue("Failed to delete store. Please try again.")
  }
})

// Update store
export const updateStore = createAsyncThunk<
  StoreResponse, // Now expects the full response object
  {
    id: number
    data: {
      name?: string
      location_name?: string
      location_coordinates?: string
    }
  },
  { rejectValue: string }
>("store/updateStore", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await api.patch<StoreResponse>(`/store/stores/${id}/`, data)
    return response.data // Returns { message: "...", store: {...} }
  } catch (error: any) {
    if (error.response && error.response.data) {
      // Handle validation errors
      if (error.response.data.errors) {
        const errorMessages = Object.values(error.response.data.errors)
          .flat()
          .join(", ")
        return rejectWithValue(errorMessages)
      }
      return rejectWithValue(
        error.response.data.message || "Failed to update store",
      )
    }
    return rejectWithValue("Failed to update store. Please try again.")
  }
})

// Fetch single store by ID
export const fetchStoreById = createAsyncThunk<
  Store,
  number,
  { rejectValue: string }
>("store/fetchStoreById", async (storeId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/stores/${storeId}/`)
    return response.data
  } catch (error: any) {
    if (error.response && error.response.data) {
      return rejectWithValue(
        error.response.data.message || "Failed to fetch store",
      )
    }
    return rejectWithValue("Failed to fetch store. Please try again.")
  }
})

const storeSlice = createSlice({
  name: "store",
  initialState,
  reducers: {
    setCurrentStore: (state, action: PayloadAction<Store | null>) => {
      state.currentStore = action.payload
    },
    clearStoreError: (state) => {
      state.error = null
    },
    resetStoreStatus: (state) => {
      state.status = "idle"
    },
  },
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
      .addCase(addStore.pending, (state) => {
        state.status = "loading"
      })
      .addCase(addStore.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.store.unshift(action.payload.store) // Add the new vehicle to the state
      })
      .addCase(addStore.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload as string // Set the error message
      })

      // Update store
      .addCase(updateStore.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(updateStore.fulfilled, (state, action) => {
        state.status = "succeeded"

        const store = action.payload.store

        const index = state.store.findIndex((s) => s.id === store.id)
        if (index !== -1) {
          state.store[index] = store
        }

        // Update current store if it's the same one
        if (state.currentStore?.id === store.id) {
          state.currentStore = store
        }
      })
      .addCase(updateStore.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload as string
      })

      // Delete store
      .addCase(deleteStore.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(deleteStore.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.store = state.store.filter(
          (store) => store.id !== action.payload,
        )
        if (state.currentStore?.id === action.payload) {
          state.currentStore = null
        }
      })
      .addCase(deleteStore.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload as string
      })

      // Fetch store by ID
      .addCase(fetchStoreById.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(fetchStoreById.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.currentStore = action.payload

        // Update the store in the list if it exists
        const index = state.stores.findIndex(
          (store) => store.id === action.payload.id,
        )
        if (index !== -1) {
          state.stores[index] = action.payload
        } else {
          state.stores.push(action.payload)
        }
      })
      .addCase(fetchStoreById.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload as string
      })
  },
})

export const { setCurrentStore, clearStoreError, resetStoreStatus } =
  storeSlice.actions


export const selectAllStore = (state: { store: storeState }) =>
  state.store.store
export const getStoreStatus = (state: { store: storeState }) =>
  state.store.status
export const getStoreError = (state: { store: storeState }) => state.store.error
export const selectStoreById = (id: number) => (state: { store: StoreState }) =>
  state.store.stores.find((store) => store.id === id)

export default storeSlice.reducer
