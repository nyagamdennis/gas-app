/* eslint-disable prettier/prettier */
// @ts-nocheck
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../utils/api"


interface Salary {
    id: string;
    
}

interface SalaryState {
    salary: Salary[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

const initialState: SalaryState = {
    salary: [],
    status: "idle",
    error: null,
};


export const fetchSalary = createAsyncThunk<Salary[]>(
    "salary/fetchSalary",
    async ({ employeeId }: { employeeId: string }) => {
        // console.log('id s ', employeeId)
        // const response = await axios.get<Salary[]>(`${apiUrl}/employee-monthly-salary/${employeeId}/`,
        //     {
        //           headers: {
        //             Authorization: `Bearer ${Cookies.get("accessToken")}`,
        //             "Content-Type": "multipart/form-data",
        //           },
        //         }
        // );
        const response = await api.get(`/employee-monthly-salary/${employeeId}/`)
        return response.data; // Return the fetched employees data
    }
);





export const paySalary = createAsyncThunk(
    "salary/paySalary",
    async ({ employeeId, salaryAmount }: { employeeId: number; salaryAmount: number }) => {
        const formData = { contract_salary: salaryAmount };
        // const response = await axios.post(`${apiUrl}/monthly-salary/${employeeId}/`, formData,
        //     {
        //         headers: {
        //             Authorization: `Bearer ${Cookies.get("accessToken")}`,
        //         },
        //     }
        // );
        // console.log('response ', response.data)
        const response = await api.post(`/monthly-salary/${employeeId}/`, formData)
        return response.data;
    }
);






export const updateSimgleEmployeeStatus = createAsyncThunk(
    "employees/updateSimgleEmployeeStatus",
    async ({ employeeId, statusField }: { employeeId: number; statusField: string }) => {
        // const response = await axios.patch(`${apiUrl}/update-status/${employeeId}/`, {
        //     status_field: statusField,
        // }, {
        //     headers: {
        //         Authorization: `Bearer ${Cookies.get("accessToken")}`,
        //     },
        // });
        // console.log('STatus functions', response.data)
        const response = await api.patch(`/update-status/${employeeId}/`, {status_field:statusField})
        return response.data; // Return the updated employee data
        // return { employeeId, statusField, updatedEmployee: response.data }; // Return the updated employee data
    }
);

const salarySlice = createSlice({
    name: "salary",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            // Fetch Employees
            .addCase(fetchSalary.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchSalary.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.salary = action.payload;
            })
            .addCase(fetchSalary.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Failed to fetch employees";
            })
            .addCase(paySalary.pending, (state) => {
                state.status = "loading";
            })

            .addCase(paySalary.fulfilled, (state, action) => {
                state.status = "succeeded";

                // Extract updated employee from the payload
                const updatedSalary = action.payload;

                if (state.salary && state.salary.id === updatedSalary.id) {
                    state.salary.employee = updatedSalary.employee; // ✅ Update ONLY the verified field
                }
            })

            .addCase(paySalary.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Failed to pay employee";
            })
            
            // .addCase(addEmployeeSalary.pending, (state) => {
            //     state.status = "loading";
            // })

            // .addCase(addEmployeeSalary.fulfilled, (state, action) => {
            //     state.status = "succeeded";

            //     // Extract updated employee from the payload
            //     const updatedEmployee = action.payload;

            //     if (state.salary && state.salary.id === updatedEmployee.id) {
            //         state.salary.contract_salary = updatedEmployee.contract_salary; // ✅ Update ONLY the verified field
            //     }
            // })

            // .addCase(addEmployeeSalary.rejected, (state, action) => {
            //     state.status = "failed";
            //     state.error = action.error.message || "Failed to add salary.";
            // })

            // .addCase(addEmployeeSalaryDate.pending, (state) => {
            //     state.status = "loading";
            // })

            // .addCase(addEmployeeSalaryDate.fulfilled, (state, action) => {
            //     state.status = "succeeded";

            //     // Extract updated employee from the payload
            //     const updatedEmployee = action.payload;

            //     if (state.salary && state.salary.id === updatedEmployee.id) {
            //         state.salary.date_joined = updatedEmployee.date_joined; // ✅ Update ONLY the verified field
            //     }
            // })

            // .addCase(addEmployeeSalaryDate.rejected, (state, action) => {
            //     state.status = "failed";
            //     state.error = action.error.message || "Failed to add salary.";
            // })

            
            // // Update Employee Status
            // .addCase(updateSimgleEmployeeStatus.pending, (state) => {
            //     state.status = "loading";
            // })

            // .addCase(updateSimgleEmployeeStatus.fulfilled, (state, action) => {
            //     state.status = "succeeded";

            //     // Extract updated employee from the payload
            //     const updatedEmployee = action.payload.employee;
            //     // console.log('log message ', updatedEmployee)
            //     if (state.salary && state.salary.id === updatedEmployee.id) {
            //         state.salary.verified = updatedEmployee.verified; // ✅ Update ONLY the verified field
            //     }
            // })


            // .addCase(updateSimgleEmployeeStatus.rejected, (state, action) => {
            //     state.status = "failed";
            //     state.error = action.error.message || "Failed to update employee status";
            // });
    },
});

export const selectAllSalary = (state: { salary: SalaryState }) => state.salary.salary;
export const getSalarysStatus = (state: { salary: SalaryState }) => state.salary.status;
export const getSalaryError = (state: { salary: SalaryState }) => state.salary.error;

export default salarySlice.reducer;
