/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "cookies-js"
import getApiUrl from "../../getApiUrl";

const apiUrl = getApiUrl();
const EMPLOYEES_URLS = `${apiUrl}/employees/`;

interface Employees {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  alternative_phone: string;
  sales_team?: { id: number; name: string };
  verified: boolean;
  suspended: boolean;
  fired: boolean;
  defaulted: boolean;
}

interface EmployeesState {
  employees: Employees[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: EmployeesState = {
  employees: [],
  status: "idle",
  error: null,
};

export const fetchEmployees = createAsyncThunk<Employees[]>(
  "employees/fetchEmployees",
  async () => {
    const response = await axios.get<Employees[]>(EMPLOYEES_URLS);
    return response.data; // Return the fetched employees data
  }
);

export const transferEmployee = createAsyncThunk(
  "employees/transferEmployee",
  async ({ employeeId, salesTeamId }: { employeeId: number; salesTeamId: number }) => {
    const formData = { sales_team_id: salesTeamId };
    const response = await axios.patch(`${apiUrl}/transfer/${employeeId}/`, formData, 
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      }
    );
    console.log('after transfer ', response.data)
    return response.data; // Return the updated employee data
  }
);

export const updateEmployeeStatus = createAsyncThunk(
  "employees/updateEmployeeStatus",
  async ({ employeeId, statusField }: { employeeId: number; statusField: string }) => {
    const response = await axios.patch(`${apiUrl}/update-status/${employeeId}/`, {
      status_field: statusField,
    },{
      headers: {
        Authorization: `Bearer ${Cookies.get("accessToken")}`,
      },
    });
    console.log('STatus functions', response.data)
    return response.data; // Return the updated employee data
    // return { employeeId, statusField, updatedEmployee: response.data }; // Return the updated employee data
  }
);

const employeesSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // Fetch Employees
      .addCase(fetchEmployees.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch employees";
      })
      // Transfer Employee
      .addCase(transferEmployee.pending, (state) => {
        state.status = "loading";
      })
      // .addCase(transferEmployee.fulfilled, (state, action) => {
      //   state.status = "succeeded";
      //   const updatedEmployee = action.payload;
      //   state.employees = state.employees.map((employee) =>
      //     employee.id === updatedEmployee.id ? updatedEmployee : employee
      //   );
      // })
      .addCase(transferEmployee.fulfilled, (state, action) => {
        state.status = "succeeded";
    
        // Extract updated employee from the payload
        const updatedEmployee = action.payload.employee;
    
        // Update the employees array with the modified employee
        state.employees = state.employees.map((employee) =>
            employee.id === updatedEmployee.id ? updatedEmployee : employee
        );
    })
    
      .addCase(transferEmployee.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to transfer employee";
      })
      // Update Employee Status
      .addCase(updateEmployeeStatus.pending, (state) => {
        state.status = "loading";
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
        state.status = "succeeded";
    
        // Extract updated employee from the payload
        const updatedEmployee = action.payload.employee;
    
        // Update the employees array with the modified employee
        state.employees = state.employees.map((employee) =>
            employee.id === updatedEmployee.id ? updatedEmployee : employee
        );
    })
    
    
      .addCase(updateEmployeeStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to update employee status";
      });
  },
});

export const selectAllEmployees = (state: { employees: EmployeesState }) => state.employees.employees;
export const getEmployeesStatus = (state: { employees: EmployeesState }) => state.employees.status;
export const getEmployeesError = (state: { employees: EmployeesState }) => state.employees.error;

export default employeesSlice.reducer;
