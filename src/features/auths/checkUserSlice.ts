// /* eslint-disable prettier/prettier */
// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
// import axios from "axios"
// import Cookies from "cookies-js"
// import getApiUrl from "../../getApiUrl"

// const apiUrl = getApiUrl()

// interface Cash {
//   id: number
// }

// interface CashState {
//   cash: Cash[]
//   status: "idle" | "loading" | "succeeded" | "failed"
//   error: string | null
// }

// const initialState: CashState = {
//   cash: [],
//   status: "idle",
//   error: null,
// }

// export const fetchCash = createAsyncThunk<Cash[]>(
//   "cash/fetchCash",
//   async (employeeId) => {
//     // const response = await axios.get<cash[]>(cash_URLS);
//     const response = await axios.get<Cash[]>(`${apiUrl}/cash/${employeeId}`, {
//       headers: {
//         Authorization: `Bearer ${Cookies.get("accessToken")}`,
//       },
//     })
//     return response.data // Return the fetched cash data
//   },
// )

// export const fetchUserInfo = createAsyncThunk(
//   "auth/fetchUserInfo",
//   async (_, thunkAPI) => {
//     try {
//       const response = await axios.get("/auth/me", { withCredentials: true })
//       return response.data // must contain updated role like "employee"
//     } catch (err) {
//       return thunkAPI.rejectWithValue("Failed to fetch user info")
//     }
//   },
// )

// extraReducers: (builder) => {
    
//   }

// const cashSlice = createSlice({
//   name: "cash",
//   initialState,
//   reducers: {},
//   extraReducers(builder) {
//     builder
//       // Fetch cash
//       .addCase(fetchCash.pending, (state) => {
//         state.status = "loading"
//       })
//       .addCase(fetchCash.fulfilled, (state, action) => {
//         state.status = "succeeded"
//         state.cash = action.payload
//       })
//       .addCase(fetchCash.rejected, (state, action) => {
//         state.status = "failed"
//         state.error = action.error.message || "Failed to fetch cash"
//       })
//       // Transfer Employee

//   },
// })

// export const selectAllCash = (state: { cash: CashState }) => state.cash.cash
// export const getCashStatus = (state: { cash: CashState }) => state.cash.status
// export const getCashError = (state: { cash: CashState }) => state.cash.error

// export default cashSlice.reducer


