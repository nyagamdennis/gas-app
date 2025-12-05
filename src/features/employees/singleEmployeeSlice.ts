/* eslint-disable prettier/prettier */
// @ts-nocheck
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../utils/api"




interface SingleEmployee {
    id: string;
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

interface SingleEmployeeState {
    singleEmployee: SingleEmployee[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

const initialState: SingleEmployeeState = {
    singleEmployee: [],
    status: "idle",
    error: null,
};


export const fetchSingleEmployee = createAsyncThunk<Employees[]>(
    "singleEmployee/fetchSingleEmployee",
    async ({ id }: { id: string }) => {
        // const response = await axios.get<Employees[]>(`${apiUrl}/employees/${employeeId}/`);
        const response = await api.get(`/employees/${id}/`)
        // alert('fetched ', response.data)
        // console.log('results of employees ', response.data)
        return response.data; // Return the fetched employees data
    }
);


export const transferEmployee = createAsyncThunk(
    "singleEmployee/transferEmployee",
    async ({ employeeId, salesTeamId }: { employeeId: number; salesTeamId: number }) => {
        const formData = { sales_team_id: salesTeamId };
        // const response = await axios.patch(`${apiUrl}/transfer/${employeeId}/`, formData,
        //     {
        //         headers: {
        //             Authorization: `Bearer ${Cookies.get("accessToken")}`,
        //         },
        //     }
        // );
        const response = await api.patch(`/transfer/${employeeId}/`, formData);
        return response.data; // Return the updated employee data
    }
);


export const addEmployeeSalary = createAsyncThunk(
    "singleEmployee/addEmployeeSalary",
    async ({ employeeId, salaryAmount }: { employeeId: number; salaryAmount: number }) => {
        const formData = { contract_salary: salaryAmount };
        // const response = await axios.patch(`${apiUrl}/salary/${employeeId}/`, formData,
        //     {
        //         headers: {
        //             Authorization: `Bearer ${Cookies.get("accessToken")}`,
        //         },
        //     }
        // );
        // console.log('response ', response.data)
        const response = await api.patch(`/salary/${employeeId}/`, formData);
        return response.data;
    }
);



export const addEmployeeSalaryDate = createAsyncThunk(
    "singleEmployee/addEmployeeSalaryDate",
    async ({ employeeId, salaryDate }: { employeeId: number; salaryDate: number }) => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth(); // Note: getMonth() returns 0-based month
        const date = new Date(year, month, salaryDate+1); // Create a proper date object with corrected month
        const formData = { date_joined: date.toISOString().split("T")[0] }; // Format as YYYY-MM-DD
        // console.log('dates ', formData)
        // const response = await axios.patch(`${apiUrl}/salary/${employeeId}/`, formData,
        //     {
        //         headers: {
        //             Authorization: `Bearer ${Cookies.get("accessToken")}`,
        //         },
        //     }
        // );
        const response = await api.patch(`/salary/${employeeId}/`, formData);
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
        const response = await api.patch(`/update-status/${employeeId}/`, {
            status_field: statusField,
        });
        return response.data; // Return the updated employee data
        // return { employeeId, statusField, updatedEmployee: response.data }; // Return the updated employee data
    }
);

const singleEmployeeSlice = createSlice({
    name: "singleEmployee",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            // Fetch Employees
            .addCase(fetchSingleEmployee.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchSingleEmployee.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.singleEmployee = action.payload;
            })
            .addCase(fetchSingleEmployee.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Failed to fetch employees";
            })
            // Transfer Employee
            .addCase(transferEmployee.pending, (state) => {
                state.status = "loading";
            })

            .addCase(transferEmployee.fulfilled, (state, action) => {
                state.status = "succeeded";

                // Extract updated employee from the payload
                const updatedEmployee = action.payload.employee;

                if (state.singleEmployee && state.singleEmployee.id === updatedEmployee.id) {
                    state.singleEmployee.sales_team = updatedEmployee.sales_team; // ✅ Update ONLY the verified field
                }
            })

            .addCase(transferEmployee.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Failed to transfer employee";
            })
            .addCase(addEmployeeSalary.pending, (state) => {
                state.status = "loading";
            })

            .addCase(addEmployeeSalary.fulfilled, (state, action) => {
                state.status = "succeeded";

                // Extract updated employee from the payload
                const updatedEmployee = action.payload;

                if (state.singleEmployee && state.singleEmployee.id === updatedEmployee.id) {
                    state.singleEmployee.contract_salary = updatedEmployee.contract_salary; // ✅ Update ONLY the verified field
                }
            })

            .addCase(addEmployeeSalary.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Failed to add salary.";
            })

            .addCase(addEmployeeSalaryDate.pending, (state) => {
                state.status = "loading";
            })

            .addCase(addEmployeeSalaryDate.fulfilled, (state, action) => {
                state.status = "succeeded";

                // Extract updated employee from the payload
                const updatedEmployee = action.payload;

                if (state.singleEmployee && state.singleEmployee.id === updatedEmployee.id) {
                    state.singleEmployee.date_joined = updatedEmployee.date_joined; // ✅ Update ONLY the verified field
                }
            })

            .addCase(addEmployeeSalaryDate.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Failed to add salary.";
            })

            
            // Update Employee Status
            .addCase(updateSimgleEmployeeStatus.pending, (state) => {
                state.status = "loading";
            })

            .addCase(updateSimgleEmployeeStatus.fulfilled, (state, action) => {
                state.status = "succeeded";

                // Extract updated employee from the payload
                const updatedEmployee = action.payload.employee;
                // console.log('log message ', updatedEmployee)
                if (state.singleEmployee && state.singleEmployee.id === updatedEmployee.id) {
                    state.singleEmployee.verified = updatedEmployee.verified; // ✅ Update ONLY the verified field
                    state.singleEmployee.fired = updatedEmployee.fired;
                }


            })


            .addCase(updateSimgleEmployeeStatus.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Failed to update employee status";
            });
    },
});

export const selectSingleEmployees = (state: { singleEmployee: SingleEmployeeState }) => state.singleEmployee.singleEmployee;
export const getSingleEmployeesStatus = (state: { singleEmployee: SingleEmployeeState }) => state.singleEmployee.status;
export const getSingleEmployeeError = (state: { singleEmployee: SingleEmployeeState }) => state.singleEmployee.error;

export default singleEmployeeSlice.reducer;
