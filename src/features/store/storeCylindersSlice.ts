// @ts-nocheck
/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../../utils/api"

type Status = "idle" | "loading" | "succeeded" | "failed"

interface storeCylinders {
  id: number
  store: number
  store_name: string
  cylinder: {
    id: number
    cylinder_type: {
      id: number
      name: string
      date_added: string
      created_at: string
      updated_at: string
    }
    weight: {
      id: number
      weight: number
      created_at: string
      updated_at: string
    }
    display_name: string
    wholesale_refill_price: number
    retail_refill_price: number
    outlet_wholesale_price: number
    outlet_retail_price: number
    complete_wholesale_price: number
    complete_retail_price: number
    depot_refill_price: number
    empty_cylinder_price: number
    created_at: string
    updated_at: string
  }
  full_cylinder_quantity: number
  empty_cylinder_quantity: number
  spoiled_cylinder_quantity: number
  total_quantity: number
  created_at: string
  updated_at: string
}

interface storeCylindersState {
  storeCylinders: storeCylinders[]
  status: Status
  error: string | null

  addStatus: Status
  addError: string | null

  updateStatus: Status
  updateError: string | null

  updateCylinderTypeStatus: Status
  updateCylinderTypeError: string | null

  deleteCylinderTypeStatus: Status
  deleteCylinderTypeError: string | null
}

const initialState: storeCylindersState = {
  storeCylinders: [],
  status: "idle",
  error: null,

  addStatus: "idle",
  addError: null,

  updateStatus: "idle",
  updateError: null,

  updateCylinderTypeStatus: "idle",
  updateCylinderTypeError: null,

  deleteCylinderTypeStatus: "idle",
  deleteCylinderTypeError: null,
}

export const fetchStoreCylinders = createAsyncThunk<
  storeCylinders[],
  { storeId: string },
  {}
>("storeCylinders/fetchStoreCylinders", async ({ storeId }) => {
  const response = await api.get<storeCylinders[]>(
    `/inventory/stores/cylinders/${storeId}`,
  )
  console.log("Fetched store cylinders:", response.data)
  return response.data
})

export const addStoreCylinders = createAsyncThunk<
  { message: string; cylinder: any; stock: storeCylinders; created: any },
  { dat: any; storeId: string },
  {}
>("storeCylinders/addStoreCylinders", async ({ dat, storeId }) => {
  const response = await api.post<{
    message: string
    cylinder: any
    stock: storeCylinders
    created: any
  }>(`/inventory/store-cylinders/create/`, dat)
  return response.data
})

export const updateCylinders = createAsyncThunk<
  { message: string; type: { id: number; name: string } },
  { dat: any; id: number }
>("storeCylinders/updateCylinders", async ({ dat, id }) => {
  const response = await api.patch<{
    message: string
    type: { id: number; name: string }
  }>(`/cylinder/types/${id}/`, dat)
  return response.data
})

export const updateStoreCylinders = createAsyncThunk<
  { message: string; stock: storeCylinders; updated: any },
  { dat: any; id: number }
>("storeCylinders/updateStoreCylinders", async ({ dat, id }) => {
  const response = await api.patch<{
    message: string
    stock: storeCylinders
    updated: any
  }>(`/inventory/store-cylinders/${id}/update/`, dat)
  console.log("Update response:", response.data)
  return response.data
})

export const updateThisStoreCylinders = createAsyncThunk<
  { message: string; stock: storeCylinders; updated: any },
  { stockId: number; dat: any },
  {}
>("storeCylinders/updateThisStoreCylinders", async ({ stockId, dat }) => {
  console.log("Updating store cylinder stock:", dat)
  const response = await api.patch<{
    message: string
    stock: storeCylinders
    updated: any
  }>(`/inventory/store-cylinders/${stockId}/update/`, dat)
  console.log("Update response:", response.data)
  return response.data
})

// Alternative: Update using store_id and cylinder_id
export const updateStoreCylindersByIds = createAsyncThunk<
  { message: string; stock: storeCylinders; updated: any },
  { dat: any },
  {}
>("storeCylinders/updateStoreCylindersByIds", async ({ dat }) => {
  console.log("Updating store cylinder stock by IDs:", dat)
  const response = await api.patch<{
    message: string
    stock: storeCylinders
    updated: any
  }>(`/inventory/store-cylinders/update/`, dat)
  console.log("Update response:", response.data)
  return response.data
})




export const deleteStoreCylindersByIds = createAsyncThunk<
  { message: string; id: number },
  { id: number },
  { rejectValue: { error: string } }
>("storeCylinders/deleteStoreCylindersByIds", async ({ id }, thunkAPI) => {
  try {
    await api.delete(`/inventory/store-cylinders/${id}/update/`)
    return { message: "Cylinder deleted successfully", id }
  } catch (err: any) {
    const message =
      err?.response?.data?.error ||
      err?.response?.data?.message ||
      err?.message ||
      "Failed to delete cylinder."
    return thunkAPI.rejectWithValue({ error: message })
  }
})



export const deleteCylinders = createAsyncThunk<
  { message: string; type: { id: number } },
  { dat: any; id: number },
  { rejectValue: { error: string } }
>("storeCylinders/deleteCylinders", async ({ id }, thunkAPI) => {
  try {
    const response = await api.delete<{
      message: string
      type: { id: number }
    }>(`/cylinder/types/${id}/`)
    return response.data
  } catch (err: any) {
    const message =
      err?.response?.data?.error ||
      err?.response?.data?.message ||
      err?.message ||
      "Failed to delete cylinder type."
    return thunkAPI.rejectWithValue({ error: message })
  }
})

const storeSlice = createSlice({
  name: "storeCylinders",
  initialState,
  reducers: {
    resetAddStatus: (state) => {
      state.addStatus = "idle"
      state.addError = null
    },
    resetUpdateStatus: (state) => {
      state.updateStatus = "idle"
      state.updateError = null
    },
    resetDeleteStatus: (state) => {
      state.deleteCylinderTypeStatus = "idle"
      state.deleteCylinderTypeError = null
    },
  },
  extraReducers(builder) {
    builder
      // Fetch store cylinders
      .addCase(fetchStoreCylinders.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchStoreCylinders.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.storeCylinders = action.payload
      })
      .addCase(fetchStoreCylinders.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to fetch store cylinders."
      })

      // Add store cylinders
      .addCase(addStoreCylinders.pending, (state) => {
        state.addStatus = "loading"
        state.addError = null
      })
      .addCase(addStoreCylinders.fulfilled, (state, action) => {
        state.addStatus = "succeeded"

        const newStock = action.payload.stock

        const existingIndex = state.storeCylinders.findIndex(
          (item) => item.id === newStock.id,
        )

        if (existingIndex !== -1) {
          // Update existing cylinder stock
          state.storeCylinders[existingIndex] = newStock
        } else {
          // Add new cylinder stock to the array
          state.storeCylinders.push(newStock)
        }

        // Only sort when adding NEW items
        state.storeCylinders.sort((a, b) => {
          const nameCompare = a.cylinder.cylinder_type.name.localeCompare(
            b.cylinder.cylinder_type.name,
          )
          if (nameCompare !== 0) return nameCompare
          return a.cylinder.weight.weight - b.cylinder.weight.weight
        })
      })
      .addCase(addStoreCylinders.rejected, (state, action) => {
        state.addStatus = "failed"
        state.addError =
          action.error.message || "Failed to add store cylinders."
      })

      // Update cylinder type name
      .addCase(updateCylinders.pending, (state) => {
        state.updateCylinderTypeStatus = "loading"
        state.updateCylinderTypeError = null
      })
      .addCase(updateCylinders.fulfilled, (state, action) => {
        state.updateCylinderTypeStatus = "succeeded"
        const updatedType = action.payload.type

        // Update all store cylinders that have this cylinder type
        state.storeCylinders = state.storeCylinders.map((storeCylinder) => {
          if (storeCylinder.cylinder.cylinder_type.id === updatedType.id) {
            return {
              ...storeCylinder,
              cylinder: {
                ...storeCylinder.cylinder,
                cylinder_type: {
                  ...storeCylinder.cylinder.cylinder_type,
                  name: updatedType.name,
                },
                display_name: `${updatedType.name} - ${storeCylinder.cylinder.weight.weight}Kg`,
              },
            }
          }
          return storeCylinder
        })

        // NO SORTING - keep original order
      })
      .addCase(updateCylinders.rejected, (state, action) => {
        state.updateCylinderTypeStatus = "failed"
        state.updateCylinderTypeError =
          action.error.message || "Failed to update cylinder type."
      })

      // Update store cylinders (main update)
      .addCase(updateStoreCylinders.pending, (state) => {
        state.updateStatus = "loading"
        state.updateError = null
      })
      .addCase(updateStoreCylinders.fulfilled, (state, action) => {
        state.updateStatus = "succeeded"

        const updatedStock = action.payload.stock

        const existingIndex = state.storeCylinders.findIndex(
          (item) => item.id === updatedStock.id,
        )

        if (existingIndex !== -1) {
          // Update in place - preserve order
          state.storeCylinders[existingIndex] = updatedStock
        }

        // NO SORTING - keep original order
      })
      .addCase(updateStoreCylinders.rejected, (state, action) => {
        state.updateStatus = "failed"
        state.updateError =
          action.error.message || "Failed to update store cylinders."
      })

      // Update this store cylinders (alternative method)
      .addCase(updateThisStoreCylinders.pending, (state) => {
        state.updateStatus = "loading"
        state.updateError = null
      })
      .addCase(updateThisStoreCylinders.fulfilled, (state, action) => {
        state.updateStatus = "succeeded"

        const updatedStock = action.payload.stock

        const existingIndex = state.storeCylinders.findIndex(
          (item) => item.id === updatedStock.id,
        )

        if (existingIndex !== -1) {
          // Update in place - preserve order
          state.storeCylinders[existingIndex] = updatedStock
        }

        // NO SORTING - keep original order
      })
      .addCase(updateThisStoreCylinders.rejected, (state, action) => {
        state.updateStatus = "failed"
        state.updateError =
          action.error.message || "Failed to update store cylinders."
      })

      // Update store cylinders by IDs
      .addCase(updateStoreCylindersByIds.pending, (state) => {
        state.updateStatus = "loading"
        state.updateError = null
      })
      .addCase(updateStoreCylindersByIds.fulfilled, (state, action) => {
        state.updateStatus = "succeeded"

        const updatedStock = action.payload.stock

        const existingIndex = state.storeCylinders.findIndex(
          (item) => item.id === updatedStock.id,
        )

        if (existingIndex !== -1) {
          // Update in place - preserve order
          state.storeCylinders[existingIndex] = updatedStock
        }

        // NO SORTING - keep original order
      })
      .addCase(updateStoreCylindersByIds.rejected, (state, action) => {
        state.updateStatus = "failed"
        state.updateError =
          action.error.message || "Failed to update store cylinders."
      })

      // Delete cylinder type
      .addCase(deleteCylinders.pending, (state) => {
        state.deleteCylinderTypeStatus = "loading"
        state.deleteCylinderTypeError = null
      })
      .addCase(deleteCylinders.fulfilled, (state, action) => {
        state.deleteCylinderTypeStatus = "succeeded"
        const deletedType = action.payload?.type
        const deletedTypeId = deletedType?.id ?? action.meta?.arg?.id ?? null

        // Remove all store cylinders that have this cylinder type (use id from payload if available, otherwise from the original arg)
        if (deletedTypeId) {
          state.storeCylinders = state.storeCylinders.filter(
            (storeCylinder) =>
              storeCylinder.cylinder.cylinder_type.id !== deletedTypeId,
          )
        }
      })
      .addCase(deleteCylinders.rejected, (state, action) => {
        state.deleteCylinderTypeStatus = "failed"
        state.deleteCylinderTypeError =
          (action.payload && (action.payload as { error: string }).error) ||
          action.error.message ||
          "Failed to delete cylinder type."
      })
      // Delete store cylinder by ID
      .addCase(deleteStoreCylindersByIds.pending, (state) => {
        state.deleteCylinderTypeStatus = "loading"
        state.deleteCylinderTypeError = null
      })
      .addCase(deleteStoreCylindersByIds.fulfilled, (state, action) => {
        state.deleteCylinderTypeStatus = "succeeded"

        // Remove the deleted cylinder from the list
        state.storeCylinders = state.storeCylinders.filter(
          (cylinder) => cylinder.id !== action.payload.id,
        )
      })
      .addCase(deleteStoreCylindersByIds.rejected, (state, action) => {
        state.deleteCylinderTypeStatus = "failed"
        state.deleteCylinderTypeError =
          (action.payload && action.payload.error) ||
          action.error.message ||
          "Failed to delete cylinder."
      })
  },
})

export const { resetAddStatus, resetUpdateStatus } = storeSlice.actions

export const selectAllStoreCylinders = (state: {
  storeCylinders: storeCylindersState
}) => state.storeCylinders.storeCylinders

export const getStoreCylindersStatus = (state: {
  storeCylinders: storeCylindersState
}) => state.storeCylinders.status

export const getStoreCylindersError = (state: {
  storeCylinders: storeCylindersState
}) => state.storeCylinders.error

export const getAddStoreCylindersStatus = (state: {
  storeCylinders: storeCylindersState
}) => state.storeCylinders.addStatus

export const getAddStoreCylindersError = (state: {
  storeCylinders: storeCylindersState
}) => state.storeCylinders.addError

export const getUpdateStoreCylindersStatus = (state: {
  storeCylinders: storeCylindersState
}) => state.storeCylinders.updateStatus

export const getUpdateStoreCylindersError = (state: {
  storeCylinders: storeCylindersState
}) => state.storeCylinders.updateError

export default storeSlice.reducer
