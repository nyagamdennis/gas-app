// @ts-nocheck
/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../../utils/api"

type Status = "idle" | "loading" | "succeeded" | "failed"

interface SmsMessage {
  id?: number
  recipient: string
  message: string
  status: "pending" | "sent" | "failed" | "delivered"
  sent_at?: string
  delivered_at?: string
  error_message?: string
  message_id?: string
  cost?: number
  sender_id?: string
  batch_id?: string
}

interface SmsBatch {
  id: string
  recipients: string[]
  message: string
  status: "pending" | "processing" | "completed" | "failed"
  total_count: number
  successful_count: number
  failed_count: number
  created_at: string
  completed_at?: string
  messages?: SmsMessage[]
}

interface SmsState {
  // Individual messages
  messages: SmsMessage[]

  // Batches
  batches: SmsBatch[]

  // Current sending status
  currentBatch: SmsBatch | null

  // Status tracking
  status: Status
  error: string | null

  // Send SMS status
  sendSmsStatus: Status
  sendSmsError: string | null | undefined

  // Bulk send status
  sendBulkSmsStatus: Status
  sendBulkSmsError: string | null | undefined

  // Message history status
  fetchMessagesStatus: Status
  fetchMessagesError: string | null | undefined

  // Balance/credits
  smsBalance: number | null
  smsBalanceStatus: Status
  smsBalanceError: string | null | undefined
}

const initialState: SmsState = {
  messages: [],
  batches: [],
  currentBatch: null,
  status: "idle",
  error: null,
  sendSmsStatus: "idle",
  sendSmsError: null,
  sendBulkSmsStatus: "idle",
  sendBulkSmsError: null,
  fetchMessagesStatus: "idle",
  fetchMessagesError: null,
  smsBalance: null,
  smsBalanceStatus: "idle",
  smsBalanceError: null,
}

// Send single SMS
export const sendSms = createAsyncThunk(
  "sms/sendSms",
  async (
    {
      recipient,
      message,
      sender_id,
      scheduled_time,
    }: {
      recipient: string
      message: string
      sender_id?: string
      scheduled_time?: string
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post("/sms/send/", {
        recipient,
        message,
        sender_id,
        scheduled_time,
      })
      console.log("SMS sent response:", response.data)
      return response.data
    } catch (err: any) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data.error || err.response.data)
      }
      return rejectWithValue(err.message)
    }
  },
)

// Send bulk SMS
export const sendBulkSms = createAsyncThunk(
  "sms/sendBulkSms",
  async (
    {
      recipients,
      message,
      sender_id,
      scheduled_time,
      batch_size = 100,
    }: {
      recipients: string[]
      message: string
      sender_id?: string
      scheduled_time?: string
      batch_size?: number
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post("/sms/bulk-send/", {
        recipients,
        message,
        sender_id,
        scheduled_time,
        batch_size,
      })
      console.log("Bulk SMS response:", response.data)
      return response.data
    } catch (err: any) {
      console.error("Error sending bulk SMS:", err)
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data.error || err.response.data)
      }
      return rejectWithValue(err.message)
    }
  },
)

// Fetch SMS history
export const fetchSmsMessages = createAsyncThunk(
  "sms/fetchMessages",
  async (
    {
      page = 1,
      page_size = 50,
      status,
      start_date,
      end_date,
      recipient,
    }: {
      page?: number
      page_size?: number
      status?: "pending" | "sent" | "failed" | "delivered"
      start_date?: string
      end_date?: string
      recipient?: string
    } = {},
    { rejectWithValue },
  ) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: page_size.toString(),
        ...(status && { status }),
        ...(start_date && { start_date }),
        ...(end_date && { end_date }),
        ...(recipient && { recipient }),
      })

      const response = await api.get(`/sms/messages/?${params}`)
      console.log("Fetched SMS messages:", response.data)
      return response.data
    } catch (err: any) {
      console.error("Error fetching SMS messages:", err)
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data.error || err.response.data)
      }
      return rejectWithValue(err.message)
    }
  },
)

// Fetch SMS batches
export const fetchSmsBatches = createAsyncThunk(
  "sms/fetchBatches",
  async (
    {
      page = 1,
      page_size = 20,
      status,
    }: {
      page?: number
      page_size?: number
      status?: "pending" | "processing" | "completed" | "failed"
    } = {},
    { rejectWithValue },
  ) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: page_size.toString(),
        ...(status && { status }),
      })

      const response = await api.get(`/sms/batches/?${params}`)
      console.log("Fetched SMS batches:", response.data)
      return response.data
    } catch (err: any) {
      console.error("Error fetching SMS batches:", err)
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data.error || err.response.data)
      }
      return rejectWithValue(err.message)
    }
  },
)

// Get batch details
export const fetchBatchDetails = createAsyncThunk(
  "sms/fetchBatchDetails",
  async ({ batch_id }: { batch_id: string }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/sms/batches/${batch_id}/`)
      console.log("Fetched batch details:", response.data)
      return response.data
    } catch (err: any) {
      console.error("Error fetching batch details:", err)
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data.error || err.response.data)
      }
      return rejectWithValue(err.message)
    }
  },
)

// Get SMS balance/credits
export const fetchSmsBalance = createAsyncThunk(
  "sms/fetchBalance",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/sms/balance/")
      console.log("SMS balance:", response.data)
      return response.data
    } catch (err: any) {
      console.error("Error fetching SMS balance:", err)
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data.error || err.response.data)
      }
      return rejectWithValue(err.message)
    }
  },
)

// Resend failed SMS
export const resendSms = createAsyncThunk(
  "sms/resendSms",
  async (
    { message_id }: { message_id: number | string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post(`/sms/messages/${message_id}/resend/`)
      console.log("Resend SMS response:", response.data)
      return response.data
    } catch (err: any) {
      console.error("Error resending SMS:", err)
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data.error || err.response.data)
      }
      return rejectWithValue(err.message)
    }
  },
)

// Cancel scheduled SMS
export const cancelScheduledSms = createAsyncThunk(
  "sms/cancelScheduled",
  async (
    { message_id }: { message_id: number | string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post(`/sms/messages/${message_id}/cancel/`)
      console.log("Cancel SMS response:", response.data)
      return response.data
    } catch (err: any) {
      console.error("Error cancelling SMS:", err)
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data.error || err.response.data)
      }
      return rejectWithValue(err.message)
    }
  },
)

const smsSlice = createSlice({
  name: "sms",
  initialState,
  reducers: {
    resetSmsState: (state) => {
      state.messages = []
      state.batches = []
      state.currentBatch = null
      state.status = "idle"
      state.error = null
    },
    clearCurrentBatch: (state) => {
      state.currentBatch = null
    },
    resetSendStatus: (state) => {
      state.sendSmsStatus = "idle"
      state.sendSmsError = null
      state.sendBulkSmsStatus = "idle"
      state.sendBulkSmsError = null
    },
  },
  extraReducers(builder) {
    builder
      // Send Single SMS
      .addCase(sendSms.pending, (state) => {
        state.sendSmsStatus = "loading"
        state.sendSmsError = null
      })
      .addCase(sendSms.fulfilled, (state, action) => {
        state.sendSmsStatus = "succeeded"
        state.messages = [action.payload, ...state.messages]
        state.sendSmsError = null
      })
      .addCase(sendSms.rejected, (state, action) => {
        state.sendSmsStatus = "failed"
        state.sendSmsError =
          (action.payload as string) ||
          action.error.message ||
          "Failed to send SMS"
      })

      // Send Bulk SMS
      .addCase(sendBulkSms.pending, (state) => {
        state.sendBulkSmsStatus = "loading"
        state.sendBulkSmsError = null
      })
      .addCase(sendBulkSms.fulfilled, (state, action) => {
        state.sendBulkSmsStatus = "succeeded"
        state.batches = [action.payload, ...state.batches]
        state.currentBatch = action.payload
        state.sendBulkSmsError = null

        // Add messages to messages list if they're included in response
        if (action.payload.messages) {
          state.messages = [...action.payload.messages, ...state.messages]
        }
      })
      .addCase(sendBulkSms.rejected, (state, action) => {
        state.sendBulkSmsStatus = "failed"
        state.sendBulkSmsError =
          (action.payload as string) ||
          action.error.message ||
          "Failed to send bulk SMS"
      })

      // Fetch SMS Messages
      .addCase(fetchSmsMessages.pending, (state) => {
        state.fetchMessagesStatus = "loading"
        state.error = null
      })
      .addCase(fetchSmsMessages.fulfilled, (state, action) => {
        state.fetchMessagesStatus = "succeeded"
        state.messages = action.payload.results || action.payload
        state.error = null
      })
      .addCase(fetchSmsMessages.rejected, (state, action) => {
        state.fetchMessagesStatus = "failed"
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Failed to fetch SMS messages"
      })

      // Fetch SMS Batches
      .addCase(fetchSmsBatches.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(fetchSmsBatches.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.batches = action.payload.results || action.payload
        state.error = null
      })
      .addCase(fetchSmsBatches.rejected, (state, action) => {
        state.status = "failed"
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Failed to fetch SMS batches"
      })

      // Fetch Batch Details
      .addCase(fetchBatchDetails.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(fetchBatchDetails.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.currentBatch = action.payload
        state.error = null
      })
      .addCase(fetchBatchDetails.rejected, (state, action) => {
        state.status = "failed"
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Failed to fetch batch details"
      })

      // Fetch SMS Balance
      .addCase(fetchSmsBalance.pending, (state) => {
        state.smsBalanceStatus = "loading"
        state.smsBalanceError = null
      })
      .addCase(fetchSmsBalance.fulfilled, (state, action) => {
        state.smsBalanceStatus = "succeeded"
        state.smsBalance = action.payload.balance || action.payload.credits || 0
        state.smsBalanceError = null
      })
      .addCase(fetchSmsBalance.rejected, (state, action) => {
        state.smsBalanceStatus = "failed"
        state.smsBalanceError =
          (action.payload as string) ||
          action.error.message ||
          "Failed to fetch SMS balance"
      })

      // Resend SMS
      .addCase(resendSms.fulfilled, (state, action) => {
        const updatedMessage = action.payload
        state.messages = state.messages.map((msg) =>
          msg.id === updatedMessage.id ? updatedMessage : msg,
        )
      })

      // Cancel Scheduled SMS
      .addCase(cancelScheduledSms.fulfilled, (state, action) => {
        const cancelledMessage = action.payload
        state.messages = state.messages.map((msg) =>
          msg.id === cancelledMessage.id ? cancelledMessage : msg,
        )
      })
  },
})

// Export actions
export const { resetSmsState, clearCurrentBatch, resetSendStatus } =
  smsSlice.actions

// Selectors
export const selectAllSmsMessages = (state: any) => state.sms.messages
export const selectAllSmsBatches = (state: any) => state.sms.batches
export const selectCurrentBatch = (state: any) => state.sms.currentBatch
export const selectSmsBalance = (state: any) => state.sms.smsBalance

export const getSmsStatus = (state: any) => state.sms.status
export const getSmsError = (state: any) => state.sms.error

export const getSendSmsStatus = (state: any) => state.sms.sendSmsStatus
export const getSendSmsError = (state: any) => state.sms.sendSmsError

export const getSendBulkSmsStatus = (state: any) => state.sms.sendBulkSmsStatus
export const getSendBulkSmsError = (state: any) => state.sms.sendBulkSmsError

export const getFetchMessagesStatus = (state: any) =>
  state.sms.fetchMessagesStatus
export const getFetchMessagesError = (state: any) =>
  state.sms.fetchMessagesError

export const getSmsBalanceStatus = (state: any) => state.sms.smsBalanceStatus
export const getSmsBalanceError = (state: any) => state.sms.smsBalanceError

export default smsSlice.reducer
