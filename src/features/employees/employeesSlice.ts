/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../../utils/api"

type Status = "idle" | "loading" | "succeeded" | "failed"

interface Employee {
  id: string
  first_name: string
  last_name: string
  gender: "MALE" | "FEMALE" | "OTHER"
  id_number: string
  email: string
  phone_number: string
  role:
    | "SHOP_ATTENDANT"
    | "DELIVERY_GUY"
    | "STORE_MAN"
    | "SECURITY"
    | "TRUCK_DRIVER"
    | "CONDUCTOR"
    | "SALES_PERSON"
  status?: "ACTIVE" | "INACTIVE"
  date_joined?: string
  created_at?: string
  updated_at?: string
}

interface EmployeeStatistics {
  total_employees: number
  present: number
  on_leave: number
  pending_leave_reviews: number
}

interface NewEmployeeData {
  first_name: string
  last_name: string
  gender?: string
  id_number?: string
  email?: string
  phone_number?: string
  role?: string
}

interface EmployeesState {
  employees: Employee[]
  status: Status
  error: string | null

  addEmployeeStatus: Status
  addEmployeeError: string | null

  statistics: EmployeeStatistics | null
  statisticsStatus: Status
  statisticsError: string | null
}

const initialState: EmployeesState = {
  employees: [],
  status: "idle",
  error: null,

  addEmployeeStatus: "idle",
  addEmployeeError: null,

  statistics: null,
  statisticsStatus: "idle",
  statisticsError: null,
}

export const fetchEmployees = createAsyncThunk<Employee[], void>(
  "employees/fetchEmployees",
  async () => {
    const response = await api.get(`/employees/`)
    return response.data // Return the fetched employees data
  },
)

// /employees/statictics/

export const fetchEmployeeStatistics = createAsyncThunk<
  EmployeeStatistics,
  void
>("employees/fetchEmployeeStatistics", async () => {
  const response = await api.get(`/employees/statistics/`)
  return response.data as EmployeeStatistics
})

export const addEmployee = createAsyncThunk<Employee, NewEmployeeData>(
  "employees/addEmployee",
  async (newEmployee) => {
    const response = await api.post(`/employees/create/`, newEmployee)
    return response.data as Employee
  },
)

export const transferEmployee = createAsyncThunk(
  "employees/transferEmployee",
  async ({
    employeeId,
    salesTeamId,
  }: {
    employeeId: number
    salesTeamId: number
  }) => {
    const formData = { sales_team_id: salesTeamId }

    const response = await api.patch(`/transfer/${employeeId}/`, formData)
    return response.data
  },
)

export const updateEmployeeStatus = createAsyncThunk(
  "employees/updateEmployeeStatus",
  async ({
    employeeId,
    statusField,
  }: {
    employeeId: number
    statusField: string
  }) => {
    const response = await api.patch(`/update-status/${employeeId}/`, {
      status_field: statusField,
    })
    return response.data
  },
)

const employeesSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    clearAddEmployeeStatus: (state) => {
      state.addEmployeeStatus = "idle"
      state.addEmployeeError = null
    },
  },
  extraReducers(builder) {
    builder
      // Fetch Employees
      .addCase(fetchEmployees.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.employees = action.payload
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to fetch employees"
      })
      // Transfer Employee
      .addCase(transferEmployee.pending, (state) => {
        state.status = "loading"
      })
      // .addCase(transferEmployee.fulfilled, (state, action) => {
      //   state.status = "succeeded";
      //   const updatedEmployee = action.payload;
      //   state.employees = state.employees.map((employee) =>
      //     employee.id === updatedEmployee.id ? updatedEmployee : employee
      //   );
      // })
      .addCase(transferEmployee.fulfilled, (state, action) => {
        state.status = "succeeded"

        // Extract updated employee from the payload
        const updatedEmployee = action.payload.employee

        // Update the employees array with the modified employee
        state.employees = state.employees.map((employee) =>
          employee.id === updatedEmployee.id ? updatedEmployee : employee,
        )
      })

      .addCase(transferEmployee.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to transfer employee"
      })
      // Update Employee Status
      .addCase(updateEmployeeStatus.pending, (state) => {
        state.status = "loading"
      })
      // .addCase(updateEmployeeStatus.fulfilled, (state, action) => {
      //   state.status = "succeeded";
      //   const { employeeId, statusField, updatedEmployee } = action.payload;
      //   state.employees = state.employees.map((employee) =>
      //     employee.id === employeeId
      //       ? { ...employee, ...updatedEmployee, [statusField]: !employee[statusField] }
      //       : employee
      //   );
      // })
      .addCase(updateEmployeeStatus.fulfilled, (state, action) => {
        state.status = "succeeded"

        // Extract updated employee from the payload
        const updatedEmployee = action.payload.employee

        // Update the employees array with the modified employee
        state.employees = state.employees.map((employee) =>
          employee.id === updatedEmployee.id ? updatedEmployee : employee,
        )
      })

      .addCase(updateEmployeeStatus.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to update employee status"
      })
      .addCase(addEmployee.pending, (state) => {
        state.status = "loading"
      })
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.status = "succeeded"
        // Prepend the newly created employee so it appears first in lists
        state.employees.unshift(action.payload)
      })
      .addCase(addEmployee.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to create employee"
      })
      .addCase(fetchEmployeeStatistics.pending, (state) => {
        state.statisticsStatus = "loading"
      })
      .addCase(fetchEmployeeStatistics.fulfilled, (state, action) => {
        state.statisticsStatus = "succeeded"
        state.statistics = action.payload
      })
      .addCase(fetchEmployeeStatistics.rejected, (state, action) => {
        state.statisticsStatus = "failed"
        state.statisticsError =
          action.error.message || "Failed to fetch employee statistics"
      })
  },
})

export const { clearAddEmployeeStatus } = employeesSlice.actions

export const selectAllEmployees = (state: { employees: EmployeesState }) =>
  state.employees.employees
export const selectEmployeeStatistics = (state: {
  employees: EmployeesState
}) => state.employees.statistics
// Deprecated: use selectEmployeeStatistics
export const staticticsEmployees = selectEmployeeStatistics
export const getEmployeesStatus = (state: { employees: EmployeesState }) =>
  state.employees.status
export const getEmployeesError = (state: { employees: EmployeesState }) =>
  state.employees.error
export const getEmployeeStatisticsStatus = (state: {
  employees: EmployeesState
}) => state.employees.statisticsStatus
export const getEmployeeStatisticsError = (state: {
  employees: EmployeesState
}) => state.employees.statisticsError

export const selectAddEmployeeStatus = (state: { employees: EmployeesState }) =>
  state.employees.addEmployeeStatus
export const selectAddEmployeeError = (state: {
  employees: EmployeesState
}) => state.employees.addEmployeeError


export default employeesSlice.reducer
