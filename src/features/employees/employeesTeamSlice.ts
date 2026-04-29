// @ts-nocheck
/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../../utils/api"

type Status = "idle" | "loading" | "succeeded" | "failed"

interface EmployeeTeam {
  id: string
  teamType: "SHOP" | "STORE" | "VEHICLE" | "DELIVERY" | null
  teamName: string | null
}

interface EmployeeTeamsState {
  employeesTeam: EmployeeTeam[]
  status: Status
  error: string | null
}

const initialState: EmployeeTeamsState = {
  employeesTeam: [],
  status: "idle",
  error: null,
}

export const fetchEmployeesTeam = createAsyncThunk<EmployeeTeam[], string>(
  "employeesTeam/fetchEmployeesTeam",
  async (employeeId) => {
    console.log("Fetching employee team for employee ID:", employeeId)
    const response = await api.get(`employees/employees-team/${employeeId}/`)
    return response.data;
  },
)

const employeesTeamSlice = createSlice({
  name: "employeesTeam",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // Fetch Employees
      .addCase(fetchEmployeesTeam.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchEmployeesTeam.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.employeesTeam = action.payload
      })
      .addCase(fetchEmployeesTeam.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to fetch employees"
      })

        
  },
})


export const selectEmployeeTeam = (state: { employeesTeam: EmployeesTeamsState }) =>
  state.employeesTeam.employeesTeam

export const getEmployeesTeamStatus = (state: { employeesTeam: EmployeesTeamsState }) =>
  state.employeesTeam.status


export const getEmployeesTeamError = (state: { employeesTeam: EmployeesTeamsState }) =>
  state.employeesTeam.error



export default employeesTeamSlice.reducer;