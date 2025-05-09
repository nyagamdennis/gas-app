/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import getApiUrl from "../../getApiUrl"

const apiUrl = getApiUrl()
const SALESTeam_URLS = `${apiUrl}/getsalesteam/`

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

export const fetchSalesTeam = createAsyncThunk<SalesTeam[], void, {}>(
  "salesTeam/fetchSalesTeam",
  async () => {
    const response = await axios.get<SalesTeam[]>(SALESTeam_URLS)
    return response.data // Corrected the return statement
  },
)

export const deleteSalesTeam = createAsyncThunk(
  "deleteSalesTeam/salesTeam",
  async (id: string) => {
    const response = await axios.delete(`${apiUrl}/getsalesteam/${id}/`)
    return response.data
  },
)

export const updateSalesTeam = createAsyncThunk(
  "updateSalesTeam/salesTeam",
  async ({ id, name }: { id: string; name: string }) => {
    const formData = new FormData()
    formData.append("name", name)
    const response = await axios.patch(`${apiUrl}/getsalesteam/${id}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },
)

interface AddSalesTeamParams {
  profile_image: File
  name: string
}

export const addSalesTeam = createAsyncThunk(
  "addSalesTeam/addSalesTeam",
  async (params: AddSalesTeamParams) => {
    const { profile_image, name } = params

    const formData = new FormData()
    formData.append("profile_image", profile_image)
    formData.append("name", name)

    const response = await axios.post(`${apiUrl}/createteam/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
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
    const response = await axios.post(`${apiUrl}/users/transfer/`, formData)
    return response.data
  },
)

const salesTeamSlice = createSlice({
  name: "salesTeam",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchSalesTeam.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchSalesTeam.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.salesTeam = action.payload
      })
      .addCase(fetchSalesTeam.rejected, (state, action) => {
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

export const selectAllSalesTeam = (state: { salesTeam: SalesTeamState }) =>
  state.salesTeam.salesTeam
export const getSalesTeamStatus = (state: { salesTeam: SalesTeamState }) =>
  state.salesTeam.status
export const getDebtorsError = (state: { salesTeam: SalesTeamState }) =>
  state.salesTeam.error

export default salesTeamSlice.reducer
