/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../../utils/api"

interface SalesTeamVehicle {
  id: string
  companay: string
  number_plate: string
  engine_size: string
}

interface SalesTeamVehicleState {
  salesTeamVehicle: SalesTeamVehicle[]
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null | undefined
}

const initialState: SalesTeamVehicleState = {
  salesTeamVehicle: [],
  status: "idle",
  error: null,
}

export const fetchSalesTeamVehicle = createAsyncThunk<
  SalesTeamVehicle[],
  void,
  { rejectValue: string }
>("salesTeamVehicle/fetchSalesTeamVehicle", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get(`/vehicle/`)
    return response.data
  } catch (error: any) {
    if (error.response && error.response.data) {
      return rejectWithValue(
        error.response.data.detail ||
          error.response.data.message ||
          "Failed to fetch vehicles",
      )
    }
    return rejectWithValue("Failed to fetch vehicles. Please try again.")
  }
})

export const deleteSalesTeamVehicle = createAsyncThunk<
  any,
  string,
  { rejectValue: string }
>(
  "deleteSalesTeamVehicle/salesTeamVehicle",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/getsalesteam/${id}/`)
      return response.data
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(
          error.response.data.detail ||
            error.response.data.message ||
            "Failed to delete vehicle",
        )
      }
      return rejectWithValue("Failed to delete vehicle. Please try again.")
    }
  },
)

export const updateSalesTeamVehicle = createAsyncThunk<
  any,
  { id: string; name: string },
  { rejectValue: string }
>(
  "updateSalesTeamVehicle/salesTeamVehicle",
  async ({ id, name }, { rejectWithValue }) => {
    try {
      const formData = new FormData()
      formData.append("name", name)
      const response = await api.patch(`/getsalesteam/${id}/`, formData, {
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
            "Failed to update vehicle",
        )
      }
      return rejectWithValue("Failed to update vehicle. Please try again.")
    }
  },
)

interface AddSalesTeamVehicleParams {
  profile_image: File
  name: string
  teamType: string
}

export const addSalesTeamVehicle = createAsyncThunk<
  any,
  AddSalesTeamVehicleParams,
  { rejectValue: string }
>(
  "addSalesTeamVehicle/addSalesTeamVehicle",
  async (params: AddSalesTeamVehicleParams, { rejectWithValue }) => {
    try {
      const { profile_image, name, teamType } = params
      const formData = new FormData()
      formData.append("profile_image", profile_image)
      formData.append("name", name)
      formData.append("type", teamType)
      const response = await api.post("/createteam/", formData, {
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
            "Failed to add vehicle",
        )
      }
      return rejectWithValue("Failed to add vehicle. Please try again.")
    }
  },
)

export const changeSalesTeamVehicleMember = createAsyncThunk<
  any,
  { userId: string; teamsId: string },
  { rejectValue: string }
>(
  "changeSalesTeamVehicleMember/salesTeamVehicle",
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
            "Failed to change vehicle team member",
        )
      }
      return rejectWithValue(
        "Failed to change vehicle team member. Please try again.",
      )
    }
  },
)

const salesTeamVehicleSlice = createSlice({
  name: "salesTeamVehicle",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchSalesTeamVehicle.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchSalesTeamVehicle.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.salesTeamVehicle = action.payload
      })
      .addCase(fetchSalesTeamVehicle.rejected, (state, action) => {
        state.status = "failed"
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Failed to fetch vehicles"
      })
      .addCase(changeSalesTeamVehicleMember.pending, (state) => {
        state.status = "loading"
      })
      .addCase(changeSalesTeamVehicleMember.fulfilled, (state, action) => {
        state.status = "succeeded"
        // state.salesTeamVehicle = action.payload;
      })
      .addCase(changeSalesTeamVehicleMember.rejected, (state, action) => {
        state.status = "failed"
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Failed to change vehicle team member"
      })
      .addCase(addSalesTeamVehicle.pending, (state, action) => {
        state.status = "loading"
      })
      .addCase(addSalesTeamVehicle.fulfilled, (state, action) => {
        state.status = "succeeded"
        // state.salesTeamVehicle.push(action.payload)
        state.salesTeamVehicle = [action.payload, ...state.salesTeamVehicle]
        // state.stockProps = state.stockProps.map((stock) => {
        //   if (stock.id === action.payload.id) {
        //     return action.payload
        //   } else {
        //     return stock
        //   }
        // })
      })
      .addCase(addSalesTeamVehicle.rejected, (state, action) => {
        state.status = "failed"
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Failed to add vehicle"
      })

      .addCase(deleteSalesTeamVehicle.pending, (state) => {
        state.status = "loading"
      })
      .addCase(deleteSalesTeamVehicle.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.salesTeamVehicle = state.salesTeamVehicle.filter(
          (salesTeamVehicle) => salesTeamVehicle.id !== action.meta.arg,
        )
      })
      .addCase(deleteSalesTeamVehicle.rejected, (state, action) => {
        state.status = "failed"
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Failed to delete vehicle"
      })
      .addCase(updateSalesTeamVehicle.pending, (state) => {
        state.status = "loading"
      })
      .addCase(updateSalesTeamVehicle.fulfilled, (state, action) => {
        state.status = "succeeded"
        const index = state.salesTeamVehicle.findIndex(
          (salesTeamVehicle) => salesTeamVehicle.id === action.payload.id,
        )
        if (index !== -1) {
          state.salesTeamVehicle[index] = action.payload
        }
      })
      .addCase(updateSalesTeamVehicle.rejected, (state, action) => {
        state.status = "failed"
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Failed to update vehicle"
      })
  },
})

export const selectAllSalesTeamVehicle = (state: {
  salesTeamVehicle: SalesTeamVehicleState
}) => state.salesTeamVehicle.salesTeamVehicle
export const getSalesTeamVehicleStatus = (state: {
  salesTeamVehicle: SalesTeamVehicleState
}) => state.salesTeamVehicle.status
export const getDebtorsError = (state: {
  salesTeamVehicle: SalesTeamVehicleState
}) => state.salesTeamVehicle.error

export default salesTeamVehicleSlice.reducer
