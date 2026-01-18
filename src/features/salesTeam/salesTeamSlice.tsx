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

export const fetchSalesTeamShops = createAsyncThunk<SalesTeam[]>(
  "salesTeam/fetchSalesTeamShops",
  async () => {
    const response = await api.get(`/shop/`)
    return response.data; // Corrected the return statement
  },
);

export const deleteSalesTeam = createAsyncThunk(
  "deleteSalesTeam/salesTeam",
  async (id: string) => {
    // const response = await axios.delete(`${apiUrl}/getsalesteam/${id}/`,{
    //   headers: {
    //     Authorization: `Bearer ${Cookies.get("accessToken")}`,
    //   },
    // })
    const response = await api.delete(`/getsalesteam/${id}/`);
    return response.data
  },
)

export const updateSalesTeam = createAsyncThunk(
  "updateSalesTeam/salesTeam",
  async ({ id, name }: { id: string; name: string }) => {
    const formData = new FormData()
    formData.append("name", name)
    // const response = await axios.patch(`${apiUrl}/getsalesteam/${id}/`, formData, {
    //   headers: {
    //     "Content-Type": "multipart/form-data",
    //   },
    // })
    const response = await api.patch(`/getsalesteam/${id}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data
  },
)

interface AddSalesTeamParams {
  profile_image: File
  name: string
  teamType: string
}

export const addSalesTeam = createAsyncThunk(
  "addSalesTeam/addSalesTeam",
  async (params: AddSalesTeamParams) => {
    const { profile_image, name, teamType } = params

    const formData = new FormData()
    formData.append("profile_image", profile_image)
    formData.append("name", name)
    formData.append('type', teamType)

    // const response = await axios.post(`${apiUrl}/createteam/`, formData, {
    //   headers: {
    //     Authorization: `Bearer ${Cookies.get("accessToken")}`,
    //     "Content-Type": "multipart/form-data",
    //   },
    // })
    const response = await api.post("/createteam/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data
  },
)

export const changeSalesTeamMember = createAsyncThunk(
  "changeSalesTeamMember/salesTeam",
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
        state.error = action.error.message || "Failed to fetch salesTeam"
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
        state.error = action.error.message || "Failed to change salesTeam"
      })
      .addCase(addSalesTeam.pending, (state, action) => {
        state.status = "loading"
      })
      .addCase(addSalesTeam.fulfilled, (state, action) => {
        state.status = "succeeded"
        // state.salesTeam.push(action.payload)
        state.salesTeam = [ action.payload, ...state.salesTeam]
        // state.stockProps = state.stockProps.map((stock) => {
        //   if (stock.id === action.payload.id) {
        //     return action.payload
        //   } else {
        //     return stock
        //   }
        // })
      })
      .addCase(addSalesTeam.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message
      })

      .addCase(deleteSalesTeam.pending, (state) => {
        state.status = "loading"
      })
      .addCase(deleteSalesTeam.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.salesTeam = state.salesTeam.filter(
          (salesTeam) => salesTeam.id !== action.meta.arg,
        )
      }
      )
      .addCase(deleteSalesTeam.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message
      }
      )
      .addCase(updateSalesTeam.pending, (state) => {
        state.status = "loading"
      }
      )
      .addCase(updateSalesTeam.fulfilled, (state, action) => {
        state.status = "succeeded"
        const index = state.salesTeam.findIndex(
          (salesTeam) => salesTeam.id === action.payload.id,
        )
        if (index !== -1) {
          state.salesTeam[index] = action.payload
        }
      }
      )
      .addCase(updateSalesTeam.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message
      }
      )
  },
})

export const selectAllSalesTeamShops = (state: { salesTeam: SalesTeamState }) =>
  state.salesTeam.salesTeam
export const getSalesTeamStatus = (state: { salesTeam: SalesTeamState }) =>
  state.salesTeam.status
export const getDebtorsError = (state: { salesTeam: SalesTeamState }) =>
  state.salesTeam.error

export default salesTeamSlice.reducer
