/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../../utils/api"

interface Assignment {
  type: "SHOP" | "VEHICLE" | "STORE" | null
  name: string | null
  id?: number
  assigned_date?: string
  assigned_by?: string | null
}

interface AssignmentHistory {
  type: "SHOP" | "VEHICLE" | "STORE"
  id: number
  name: string
  assigned_date: string
  assigned_by: string | null
  is_active: boolean
  status: string
}

interface TransferHistory {
  id: number
  from_type: string
  from_id: number | null
  to_type: string
  to_id: number
  transferred_by: string | null
  transfer_date: string
  reason: string
}

interface AttendanceSummary {
  last_30_days: {
    present: number
    absent: number
    on_leave: number
    total_days: number
  }
  recent_attendance: Array<{
    date: string
    status: string
    marked_by: string | null
    remarks: string | null
  }>
}

interface LeaveRequest {
  id: number
  start_date: string
  end_date: string
  reason: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  applied_on: string
  reviewed_by: string | null
  reviewed_on: string | null
  is_active_leave: boolean
}

interface Review {
  id: number
  rating: number
  comments: string | null
  review_date: string
  reviewer: string | null
}

interface EmploymentHistory {
  id: number
  start_date: string
  end_date: string | null
  status: "ACTIVE" | "ENDED"
  position: string | null
  department: string | null
  salary: string | null
  reason_for_change: string | null
}

interface SingleEmployee {
  id: number
  first_name: string
  last_name: string
  full_name: string
  gender: "MALE" | "FEMALE"
  id_number: string
  email: string
  phone_number: string
  email_verified: boolean
  phone_verified: boolean
  is_active: boolean
  employment_status: "ACTIVE" | "TERMINATED" | "RESIGNED" | "TRANSFERRED"
  can_perform_sales: boolean
  can_manage_inventory: boolean
  can_manage_delivery: boolean
  can_view_reports: boolean
  date_joined?: string
  created_at?: string
  updated_at?: string
  user_role: string
  assigned_to: Assignment | null
  assignment_history: AssignmentHistory[]
  transfer_history: TransferHistory[]
  attendance_summary: AttendanceSummary
  leave_history: LeaveRequest[]
  reviews: Review[]
  employment_history: EmploymentHistory[]
}

interface SingleEmployeeState {
  singleEmployee: SingleEmployee | null
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null

  // Additional states for related actions
  terminationStatus: "idle" | "loading" | "succeeded" | "failed"
  terminationError: string | null

  attendanceStatus: "idle" | "loading" | "succeeded" | "failed"
  attendanceData: any | null
  attendanceError: string | null

  leaveStatus: "idle" | "loading" | "succeeded" | "failed"
  leaveData: any | null
  leaveError: string | null

  reactivationStatus: "idle" | "loading" | "succeeded" | "failed"
  reactivationError: string | null
}

const initialState: SingleEmployeeState = {
  singleEmployee: null,
  status: "idle",
  error: null,

  terminationStatus: "idle",
  terminationError: null,

  attendanceStatus: "idle",
  attendanceData: null,
  attendanceError: null,

  leaveStatus: "idle",
  leaveData: null,
  leaveError: null,

  reactivationStatus: "idle",
  reactivationError: null,
}

export const fetchSingleEmployee = createAsyncThunk(
  "singleEmployee/fetchSingleEmployee",
  async (id: string) => {
    const response = await api.get(`/employees/employees/${id}/`)
    return response.data
  },
)

export const terminateEmployee = createAsyncThunk(
  "singleEmployee/terminateEmployee",
  async ({ employeeId, data }: { employeeId: string; data: any }) => {
    const response = await api.post(
      `/employees/employees/${employeeId}/terminate/`,
      data,
    )
    return response.data
  },
)

export const employeeAttendance = createAsyncThunk(
  "singleEmployee/employeeAttendance",
  async ({ employeeId, params = {} }: { employeeId: string; params?: any }) => {
    const response = await api.get(
      `/employees/employees/${employeeId}/attendance/`,
      { params },
    )
    return response.data
  },
)

export const employeeLeave = createAsyncThunk(
  "singleEmployee/employeeLeave",
  async ({ employeeId, params = {} }: { employeeId: string; params?: any }) => {
    const response = await api.get(
      `/employees/employees/${employeeId}/leaves/`,
      { params },
    )
    return response.data
  },
)

export const employeeReactivate = createAsyncThunk(
  "singleEmployee/employeeReactivate",
  async ({ employeeId, data }: { employeeId: string; data?: any }) => {
    const response = await api.post(
      `/employees/employees/${employeeId}/reactivate/`,
      data || {},
    )
    return response.data
  },
)

const singleEmployeeSlice = createSlice({
  name: "singleEmployee",
  initialState,
  reducers: {
    clearTerminationStatus: (state) => {
      state.terminationStatus = "idle"
      state.terminationError = null
    },
    clearAttendanceStatus: (state) => {
      state.attendanceStatus = "idle"
      state.attendanceData = null
      state.attendanceError = null
    },
    clearLeaveStatus: (state) => {
      state.leaveStatus = "idle"
      state.leaveData = null
      state.leaveError = null
    },
    clearReactivationStatus: (state) => {
      state.reactivationStatus = "idle"
      state.reactivationError = null
    },
    clearSingleEmployee: (state) => {
      state.singleEmployee = null
      state.status = "idle"
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Single Employee
      .addCase(fetchSingleEmployee.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(fetchSingleEmployee.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.singleEmployee = action.payload
      })
      .addCase(fetchSingleEmployee.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to fetch employee details"
      })

      // Terminate Employee
      .addCase(terminateEmployee.pending, (state) => {
        state.terminationStatus = "loading"
        state.terminationError = null
      })
      .addCase(terminateEmployee.fulfilled, (state, action) => {
        state.terminationStatus = "succeeded"
        if (state.singleEmployee) {
          state.singleEmployee.employment_status = "TERMINATED"
          state.singleEmployee.is_active = false
        }
       
      })
      .addCase(terminateEmployee.rejected, (state, action) => {
        state.terminationStatus = "failed"
        state.terminationError =
          action.error.message || "Failed to terminate employee"
      })

      // Employee Attendance
      .addCase(employeeAttendance.pending, (state) => {
        state.attendanceStatus = "loading"
        state.attendanceError = null
      })
      .addCase(employeeAttendance.fulfilled, (state, action) => {
        state.attendanceStatus = "succeeded"
        state.attendanceData = action.payload
      })
      .addCase(employeeAttendance.rejected, (state, action) => {
        state.attendanceStatus = "failed"
        state.attendanceError =
          action.error.message || "Failed to fetch attendance data"
      })

      // Employee Leave
      .addCase(employeeLeave.pending, (state) => {
        state.leaveStatus = "loading"
        state.leaveError = null
      })
      .addCase(employeeLeave.fulfilled, (state, action) => {
        state.leaveStatus = "succeeded"
        state.leaveData = action.payload
      })
      .addCase(employeeLeave.rejected, (state, action) => {
        state.leaveStatus = "failed"
        state.leaveError = action.error.message || "Failed to fetch leave data"
      })

      // Reactivate Employee
      .addCase(employeeReactivate.pending, (state) => {
        state.reactivationStatus = "loading"
        state.reactivationError = null
      })
      .addCase(employeeReactivate.fulfilled, (state, action) => {
        state.reactivationStatus = "succeeded"
        if (state.singleEmployee) {
          state.singleEmployee.employment_status = "ACTIVE"
          state.singleEmployee.is_active = true
        }
        
      })
      .addCase(employeeReactivate.rejected, (state, action) => {
        state.reactivationStatus = "failed"
        state.reactivationError =
          action.error.message || "Failed to reactivate employee"
      })
  },
})

export const {
  clearTerminationStatus,
  clearAttendanceStatus,
  clearLeaveStatus,
  clearReactivationStatus,
  clearSingleEmployee,
} = singleEmployeeSlice.actions

// Selectors
export const selectSingleEmployee = (state: {
  singleEmployee: SingleEmployeeState
}) => state.singleEmployee.singleEmployee
export const selectSingleEmployeeStatus = (state: {
  singleEmployee: SingleEmployeeState
}) => state.singleEmployee.status
export const selectSingleEmployeeError = (state: {
  singleEmployee: SingleEmployeeState
}) => state.singleEmployee.error
export const selectTerminationStatus = (state: {
  singleEmployee: SingleEmployeeState
}) => state.singleEmployee.terminationStatus
export const selectAttendanceData = (state: {
  singleEmployee: SingleEmployeeState
}) => state.singleEmployee.attendanceData
export const selectAttendanceStatus = (state: {
  singleEmployee: SingleEmployeeState
}) => state.singleEmployee.attendanceStatus
export const selectLeaveData = (state: {
  singleEmployee: SingleEmployeeState
}) => state.singleEmployee.leaveData
export const selectLeaveStatus = (state: {
  singleEmployee: SingleEmployeeState
}) => state.singleEmployee.leaveStatus

export default singleEmployeeSlice.reducer
