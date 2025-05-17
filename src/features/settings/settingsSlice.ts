// @ts-nocheck
/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import Cookies from "cookies-js"
import getApiUrl from "../../getApiUrl"

const apiUrl = getApiUrl()

type Status = "idle" | "loading" | "succeeded" | "failed"

interface Settings {
  id: string
  name: string
  //   employee: string
  //   is_paid: boolean
  //   amount: number
  //   payment_date: string
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

export const fetchSettings = createAsyncThunk<settings[], void, {}>(
  "settings/fetchSettings",
  async () => {
    const response = await axios.get<settings[]>(`${apiUrl}/business/operation/`, {
      headers: {
        
        Authorization: `Bearer ${Cookies.get("accessToken")}`,
        
      },
    })
    return response.data
  },
)

export const addSettings = createAsyncThunk(
  "settings/addAnotherCylinder",
  async ({ dat }: { dat: any; }, { rejectWithValue }) => {
    console.log('data ', dat)
    try {
      const response = await axios.post(
        `${apiUrl}/business/operation/`,
        dat,
        {
            headers: {
              Authorization: `Bearer ${Cookies.get("accessToken")}`,
              "Content-Type": "multipart/form-data",
            },
          }
      )
      console.log("response data", response.data)
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


export const updateSettings = createAsyncThunk(
    "settings/updateAnotherCylinder",
    async ({ dat, id }: { dat: any; id: string}, { rejectWithValue }) => {
      try {
        const response = await axios.post(
          `${apiUrl}/business/operation/${id}/`,
          dat,
          {
              headers: {
                Authorization: `Bearer ${Cookies.get("accessToken")}`,
                "Content-Type": "multipart/form-data",
              },
            }
        )
        console.log("response data", response.data)
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
        state.error = action.error.message || "Failed to fetch products"
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
        state.error = action.error.message || "Failed to fetch products"
      })

      .addCase(updateSettings.pending, (state) => {
        state.status = "loading"
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.status = "succeeded"
        const updatedSettingIndex = state.settings.findIndex(
          (setting) => setting.id === action.payload.id
        )
        if (updatedSettingIndex !== -1) {
          state.settings[updatedSettingIndex] = action.payload
        }
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to fetch products"
      })
  },
})

export const selectAllSettings = (state: { settings: settingsState }) =>
  state.settings.settings
export const getSettingsStatus = (state: { settings: settingsState }) =>
  state.settings.status
export const getSettingsError = (state: { settings: settingsState }) =>
  state.settings.error

export default settingsSlice.reducer;