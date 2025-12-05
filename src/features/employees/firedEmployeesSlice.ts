/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../utils/api"



interface FiredEmployees {
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

interface FiredEmployeesState {
  firedEmployees: FiredEmployees[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: FiredEmployeesState = {
  firedEmployees: [],
  status: "idle",
  error: null,
};

export const fetchFiredEmployees = createAsyncThunk<FiredEmployees[], { businessId: string },{}>(
  "firedEmployees/fetchFiredEmployees",
  async ({ businessId }) => {
   
    const response = await api.get(`/fired_employees/${businessId}`)
    return response.data; // Return the fetched employees data
  }
);



export const updateEmployeeStatus = createAsyncThunk(
  "employees/updateEmployeeStatus",
  async ({ employeeId, statusField }: { employeeId: number; statusField: string }) => {
    // const response = await axios.patch(`${apiUrl}/update-status/${employeeId}/`, {
    //   status_field: statusField,
    // },{
    //   headers: {
    //     Authorization: `Bearer ${Cookies.get("accessToken")}`,
    //   },
    // });
    // console.log('STatus functions', response.data)
    const response = await api.patch(`/update-status/${employeeId}/`, {
      status_field: statusField,
    });
    return response.data; // Return the updated employee data
    // return { employeeId, statusField, updatedEmployee: response.data }; // Return the updated employee data
  }
);

const firedEmployeesSlice = createSlice({
  name: "firedEmployees",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // Fetch Employees
      .addCase(fetchFiredEmployees.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFiredEmployees.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.firedEmployees = action.payload;
      })
      .addCase(fetchFiredEmployees.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch employees";
      })
      // Transfer Employee
     
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
        state.firedEmployees = state.firedEmployees.map((employee) =>
            employee.id === updatedEmployee.id ? updatedEmployee : employee
        );
    })
    
    
      .addCase(updateEmployeeStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to update employee status";
      });
  },
});

export const selectAllFiredEmployees = (state: { firedEmployees: FiredEmployeesState }) => state.firedEmployees.firedEmployees;
export const getFiredEmployeesStatus = (state: { firedEmployees: FiredEmployeesState }) => state.firedEmployees.status;
export const getFiredEmployeesError = (state: { firedEmployees: FiredEmployeesState }) => state.firedEmployees.error;

export default firedEmployeesSlice.reducer;
