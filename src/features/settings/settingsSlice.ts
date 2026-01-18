// @ts-nocheck
/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../../utils/api"
import { fetchCompanyData } from "../plans/planStatusSlice"


type Status = "idle" | "loading" | "succeeded" | "failed"

interface Settings {
  id: string
  name: string
  logo?: string
  company_email?: string
  company_phone_number?: string
  website?: string
  location?: string
}

interface settingsState {
  settings: Settings[]
  status: Status
  error: string | null
}

const initialState: settingsState = {
  settings: [],
  status: "idle",
  error: null,
}

export const fetchSettings = createAsyncThunk<Settings[], void, {}>(
  "settings/fetchSettings",
  async () => {
    const response = await api.get<Settings[]>("/business/operation/")
    return response.data
  },
)

export const addSettings = createAsyncThunk(
  "settings/addSettings",
  async ({ dat }: { dat: any }, { rejectWithValue }) => {
    try {
      const formData = new FormData()

      Object.keys(dat).forEach((key) => {
        if (dat[key] !== null && dat[key] !== undefined) {
          formData.append(key, dat[key])
        }
      })

      const response = await api.post("/business/operation/", formData)
      return response.data
    } catch (err: any) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data.message)
      }
      return rejectWithValue(
        "An unexpected error occurred while adding business.",
      )
    }
  },
)

// 🔥 Updated to sync with planStatus after update
export const updateSettings = createAsyncThunk(
  "settings/updateSettings",
  async (
    { businessId, dat }: { businessId: string; dat: any },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const formData = new FormData()
      Object.keys(dat).forEach((key) => {
        if (dat[key] !== null && dat[key] !== undefined) {
          formData.append(key, dat[key])
        }
      })

      const response = await api.patch(
        `/company/update/${businessId}/`,
        formData,
      )

      // 🔥 After successful update, refresh the company data in planStatus
      await dispatch(fetchCompanyData(parseInt(businessId)))

      return response.data
    } catch (err: any) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data.message)
      }
      return rejectWithValue(
        "An unexpected error occurred while updating business.",
      )
    }
  },
)

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.settings = action.payload
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to fetch settings"
      })

      .addCase(addSettings.pending, (state) => {
        state.status = "loading"
      })
      .addCase(addSettings.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.settings = action.payload
      })
      .addCase(addSettings.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to add settings"
      })

      .addCase(updateSettings.pending, (state) => {
        state.status = "loading"
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.settings = [action.payload]
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to update settings"
      })
  },
})

export default settingsSlice.reducer
