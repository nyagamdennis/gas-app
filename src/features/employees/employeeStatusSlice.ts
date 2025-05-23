// features/auths/employeeStatusSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../../../utils/api"

interface State {
  verified: boolean | null
  loading: boolean
  error: string | null
}

const initialState: State = {
  verified: null,
  loading: false,
  error: null,
}

export const fetchEmployeeVerificationStatus = createAsyncThunk(
  "employee/fetchStatus",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI
    try {
      // const response = await axios.get(`${apiUrl}/check-user-status/`,{
      //   headers: {
      //     Authorization: `Bearer ${Cookies.get("accessToken")}`,
      //   },
      // })
      const response = await api.get("/check-user-status/")
      return response.data.is_verified
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Failed to fetch status")
    }
  }
)

const employeeStatusSlice = createSlice({
  name: "employeeStatus",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployeeVerificationStatus.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEmployeeVerificationStatus.fulfilled, (state, action) => {
        state.verified = action.payload
        state.loading = false
      })
      .addCase(fetchEmployeeVerificationStatus.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const selectEmployeeVerified = (state: any) =>
  state.employeeStatus.verified

export default employeeStatusSlice.reducer
