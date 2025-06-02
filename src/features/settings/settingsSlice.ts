// @ts-nocheck
/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../../utils/api"

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
    // const response = await axios.get<settings[]>(`${apiUrl}/business/operation/`, {
    //   headers: {
        
    //     Authorization: `Bearer ${Cookies.get("accessToken")}`,
        
    //   },
    // })
    const response = await api.get<Settings[]>("/business/operation/");
    return response.data
  },
)

export const addSettings = createAsyncThunk(
  "settings/addAnotherCylinder",
  async ({ dat }: { dat: any }, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      Object.keys(dat).forEach((key) => {
        if (dat[key] !== null && dat[key] !== undefined) {
          formData.append(key, dat[key]);
        }
      });

      const response = await api.post("/business/operation/", formData);
      return response.data;
    } catch (err: any) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data.message);
      }
      return rejectWithValue(
        "An unexpected error occurred while adding business."
      );
    }
  }
);



export const updateSettings = createAsyncThunk(
    "settings/updateAnotherCylinder",
    async ({ id, dat }: { dat: any; id: string}, { rejectWithValue }) => {
      try {
        // const response = await axios.post(
        //   `${apiUrl}/business/operation/${id}/`,
        //   dat,
        //   {
        //       headers: {
        //         Authorization: `Bearer ${Cookies.get("accessToken")}`,
        //         "Content-Type": "multipart/form-data",
        //       },
        //     }
        // )
        // console.log("response data", response.data)
        console.log('data ', dat)
        const formData = new FormData();
        Object.keys(dat).forEach((key) => {
          formData.append(key, dat[key]);
        });
        // console.log('formData ', id)
        const response = await api.patch(`/business/operation/`, formData);
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
        state.settings = [action.payload];
        // const updatedSettingIndex = state.settings.findIndex(
        //   (setting) => setting.id === action.payload.id
        // )
        // if (updatedSettingIndex !== -1) {
        //   state.settings[updatedSettingIndex] = action.payload
        // }
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