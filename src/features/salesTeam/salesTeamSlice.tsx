/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../../utils/api"

interface SalesTeam {
  id: string
  name: number
  product: number
  timestamp: string
}

interface SalesTeamState {
  salesTeam: SalesTeam[]
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null | undefined
}

const initialState: SalesTeamState = {
  salesTeam: [],
  status: "idle",
  error: null,
}

export const fetchSalesTeamShops = createAsyncThunk<
  SalesTeam[],
  void,
  { rejectValue: string }
>("salesTeam/fetchSalesTeamShops", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get(`/shop/`)
    return response.data
  } catch (error: any) {
    if (error.response && error.response.data) {
      return rejectWithValue(
        error.response.data.detail ||
          error.response.data.message ||
          "Failed to fetch shops",
      )
    }
    return rejectWithValue("Failed to fetch shops. Please try again.")
  }
})

export const deleteSalesTeam = createAsyncThunk<
  any,
  string,
  { rejectValue: string }
>("deleteSalesTeam/salesTeam", async (id: string, { rejectWithValue }) => {
  try {
    const response = await api.delete(`/shop/shops/${id}/`)
    return response.data
  } catch (error: any) {
    if (error.response && error.response.data) {
      return rejectWithValue(
        error.response.data.detail ||
          error.response.data.message ||
          "Failed to delete shop",
      )
    }
    return rejectWithValue("Failed to delete shop. Please try again.")
  }
})

export const updateSalesTeam = createAsyncThunk<
  any,
  { id: string; name: string },
  { rejectValue: string }
>("updateSalesTeam/salesTeam", async ({ id, name }, { rejectWithValue }) => {
  try {
    const formData = new FormData()
    formData.append("name", name)
    const response = await api.patch(`/shop/shops/${id}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  } catch (error: any) {
    if (error.response && error.response.data) {
      return rejectWithValue(
        error.response.data.detail ||
          error.response.data.message ||
          "Failed to update shop",
      )
    }
    return rejectWithValue("Failed to update shop. Please try again.")
  }
})

interface AddSalesTeamParams {
  name: string
  teamType: string
}

export const addSalesTeam = createAsyncThunk<any, any, { rejectValue: string }>(
  "addSalesTeam/addSalesTeam",
  async (Data, { rejectWithValue }) => {
    try {
      const response = await api.post("/shop/", Data)
      return response.data
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(
          error.response.data.detail ||
            error.response.data.message ||
            "Failed to add shop",
        )
      }
      return rejectWithValue("Failed to add shop. Please try again.")
    }
  },
)

export const changeSalesTeamMember = createAsyncThunk<
  any,
  { userId: string; teamsId: string },
  { rejectValue: string }
>(
  "changeSalesTeamMember/salesTeam",
  async ({ userId, teamsId }, { rejectWithValue }) => {
    try {
      const formData = new FormData()
      formData.append("employeeId", userId)
      formData.append("teamId", teamsId)
      console.log("submited data ", userId)
      const response = await api.post("/users/transfer/", formData)
      return response.data
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(
          error.response.data.detail ||
            error.response.data.message ||
            "Failed to change team member",
        )
      }
      return rejectWithValue("Failed to change team member. Please try again.")
    }
  },
)

const salesTeamSlice = createSlice({
  name: "salesTeam",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchSalesTeamShops.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchSalesTeamShops.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.salesTeam = action.payload
      })
      .addCase(fetchSalesTeamShops.rejected, (state, action) => {
        state.status = "failed"
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Failed to fetch shops"
      })
      .addCase(changeSalesTeamMember.pending, (state) => {
        state.status = "loading"
      })
      .addCase(changeSalesTeamMember.fulfilled, (state, action) => {
        state.status = "succeeded"
        // state.salesTeam = action.payload;
      })
      .addCase(changeSalesTeamMember.rejected, (state, action) => {
        state.status = "failed"
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Failed to change team member"
      })
      .addCase(addSalesTeam.pending, (state, action) => {
        state.status = "loading"
      })
      .addCase(addSalesTeam.fulfilled, (state, action) => {
        state.status = "succeeded"
        // state.salesTeam.push(action.payload)
        state.salesTeam.unshift(action.payload.shop)
      })
      .addCase(addSalesTeam.rejected, (state, action) => {
        state.status = "failed"
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Failed to add shop"
      })

      .addCase(deleteSalesTeam.pending, (state) => {
        state.status = "loading"
      })
      .addCase(deleteSalesTeam.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.salesTeam = state.salesTeam.filter(
          (salesTeam) => salesTeam.id !== action.meta.arg,
        )
      })
      .addCase(deleteSalesTeam.rejected, (state, action) => {
        state.status = "failed"
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Failed to delete shop"
      })
      .addCase(updateSalesTeam.pending, (state) => {
        state.status = "loading"
      })
      .addCase(updateSalesTeam.fulfilled, (state, action) => {
        state.status = "succeeded"
        const index = state.salesTeam.findIndex(
          (salesTeam) => salesTeam.id === action.payload.shop.id,
        )
        if (index !== -1) {
          state.salesTeam[index] = action.payload.shop
        }
      })
      .addCase(updateSalesTeam.rejected, (state, action) => {
        state.status = "failed"
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Failed to update shop"
      })
  },
})

export const selectAllSalesTeamShops = (state: { salesTeam: SalesTeamState }) =>
  state.salesTeam.salesTeam
export const getSalesTeamStatus = (state: { salesTeam: SalesTeamState }) =>
  state.salesTeam.status
export const getDebtorsError = (state: { salesTeam: SalesTeamState }) =>
  state.salesTeam.error

export default salesTeamSlice.reducer
