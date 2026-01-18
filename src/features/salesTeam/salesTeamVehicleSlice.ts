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

export const fetchSalesTeamVehicle = createAsyncThunk<SalesTeamVehicle[]>(
  "salesTeamVehicle/fetchSalesTeamVehicle",
  async () => {
    const response = await api.get(`/vehicle/`)
    return response.data; // Corrected the return statement
  },
);

export const deleteSalesTeamVehicle = createAsyncThunk(
  "deleteSalesTeamVehicle/salesTeamVehicle",
  async (id: string) => {

    const response = await api.delete(`/getsalesteam/${id}/`);
    return response.data
  },
)

export const updateSalesTeamVehicle = createAsyncThunk(
  "updateSalesTeamVehicle/salesTeamVehicle",
  async ({ id, name }: { id: string; name: string }) => {
    const formData = new FormData()
    formData.append("name", name)

    const response = await api.patch(`/getsalesteam/${id}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data
  },
)

interface AddSalesTeamVehicleParams {
  profile_image: File
  name: string
  teamType: string
}

export const addSalesTeamVehicle = createAsyncThunk(
  "addSalesTeamVehicle/addSalesTeamVehicle",
  async (params: AddSalesTeamVehicleParams) => {
    const { profile_image, name, teamType } = params

    const formData = new FormData()
    formData.append("profile_image", profile_image)
    formData.append("name", name)
    formData.append('type', teamType)

 
    const response = await api.post("/createteam/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data
  },
)

export const changeSalesTeamVehicleMember = createAsyncThunk(
  "changeSalesTeamVehicleMember/salesTeamVehicle",
  async ({ userId, teamsId }: { userId: string; teamsId: string }) => {
    const formData = new FormData()
    formData.append("employeeId", userId)
    formData.append("teamId", teamsId)
    console.log("submited data ", userId)
    // const response = await axios.post(`${apiUrl}/users/transfer/`, formData)
    const response = await api.post("/users/transfer/", formData);
    return response.data
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
        state.error = action.error.message || "Failed to fetch salesTeamVehicle"
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
        state.error = action.error.message || "Failed to change salesTeamVehicle"
      })
      .addCase(addSalesTeamVehicle.pending, (state, action) => {
        state.status = "loading"
      })
      .addCase(addSalesTeamVehicle.fulfilled, (state, action) => {
        state.status = "succeeded"
        // state.salesTeamVehicle.push(action.payload)
        state.salesTeamVehicle = [ action.payload, ...state.salesTeamVehicle]
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
        state.error = action.error.message
      })

      .addCase(deleteSalesTeamVehicle.pending, (state) => {
        state.status = "loading"
      })
      .addCase(deleteSalesTeamVehicle.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.salesTeamVehicle = state.salesTeamVehicle.filter(
          (salesTeamVehicle) => salesTeamVehicle.id !== action.meta.arg,
        )
      }
      )
      .addCase(deleteSalesTeamVehicle.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message
      }
      )
      .addCase(updateSalesTeamVehicle.pending, (state) => {
        state.status = "loading"
      }
      )
      .addCase(updateSalesTeamVehicle.fulfilled, (state, action) => {
        state.status = "succeeded"
        const index = state.salesTeamVehicle.findIndex(
          (salesTeamVehicle) => salesTeamVehicle.id === action.payload.id,
        )
        if (index !== -1) {
          state.salesTeamVehicle[index] = action.payload
        }
      }
      )
      .addCase(updateSalesTeamVehicle.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message
      }
      )
  },
})

export const selectAllSalesTeamVehicle = (state: { salesTeamVehicle: SalesTeamVehicleState }) =>
  state.salesTeamVehicle.salesTeamVehicle
export const getSalesTeamVehicleStatus = (state: { salesTeamVehicle: SalesTeamVehicleState }) =>
  state.salesTeamVehicle.status
export const getDebtorsError = (state: { salesTeamVehicle: SalesTeamVehicleState }) =>
  state.salesTeamVehicle.error

export default salesTeamVehicleSlice.reducer
