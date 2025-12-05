// @ts-nocheck
/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../../utils/api"

type Status = "idle" | "loading" | "succeeded" | "failed"

interface store {
  id: string
  name: string
  cylinders: [
    {
      id: string
      gas_type: string
      weight: {
        id: string
        weight: string
        creator: string
      }
      stores: [
        {
          id: string
          filled: number
          empties: number
          total_cylinders: number
          dates: string
          spoiled: number
          date_of_operation: string
          cylinder_details: {
            id: string
            wholesale_selling_price: number
            wholesale_refil_price: number
            retail_selling_price: number
            retail_refil_price: number
            weight: string
          }
        },
      ]
    },
  ]
}

interface storeState {
  store: store[]
  status: Status
  error: string | null

  refillEmptiesStatus: Status
  refillEmptiesError: string | null | undefined

  addNewCylinderStatus: Status
  addNewCylinderError: string | null | undefined

  updateCylinderStatus: Status
  updateCylinderError: string | null | undefined

  addAnotherCylinderStatus: Status
  addAnotherCyinderError: string | null | undefined

  deleteCylinderStatus: Status
  deleteCyinderError: string | null | undefined

  storeRefillStatus: Status
  storeRefillError: string | null | undefined

  storeRepairStatus: Status
  storeRepairError: string | null | undefined
}

const initialState: storeState = {
  store: [],
  status: "idle",
  error: null,

  refillEmptiesStatus: "idle",
  refillEmptiesError: null,

  addNewCylinderStatus: "idle",
  addNewCylinderError: null,

  updateCylinderStatus: "idle",
  updateCylinderError: null,

  addAnotherCylinderStatus: "idle",
  addAnotherCyinderError: null,

  deleteCylinderStatus: "idle",
  deleteCyinderError: null,

  storeRefillStatus: "idle",
  storeRefillError: null,

  storeRepairStatus: "idle",
  storeRepairError: null,
}

export const fetchStore = createAsyncThunk<store[], { businessId: string }, {}>(
  "store/fetchStore",
  async ({ businessId }) => {
    // const response = await axios.get<store[]>(`${apiUrl}/store/${businessId}`, {
    //   headers: {
    //     Authorization: `Bearer ${Cookies.get("accessToken")}`,
    //   },
    // })
    // console.log("response store data", response.data)
    const response = await api.get<store[]>(`/store/${businessId}/`)
    return response.data
  },
)

export const refillEmpties = createAsyncThunk(
  "empties/refillEmpties",
  async (formData) => {
    // const response = await axios.post(`${apiUrl}/refill/`, formData, {
    //   headers: {
    //     Authorization: `Bearer ${Cookies.get("accessToken")}`,
    //   },
    // })
    // console.log("response refill data", response.data)
    const response = await api.post(`/refill/`, formData)
    return response.data
  },
)

export const addNewCylinders = createAsyncThunk(
  "cylinders/ addNewCylinders",
  async ({ businessId, formData }, { rejectWithValue }) => {
    try {
      // const response = await axios.post(
      //   `${apiUrl}/addnewcylinder/${businessId}/`,
      //   formData,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${Cookies.get("accessToken")}`,
      //     },
      //   },
      // )
      // console.log("response data", response.data)
      const response = await api.post(
        `/addnewcylinder/${businessId}/`,
        formData,
      )
      return response.data
    } catch (err: any) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data.message) // extract `error` field
      }
      return rejectWithValue(err.response.data.message) // fallback error
    }
  },
)

export const addAnotherCylinder = createAsyncThunk(
  "cylinders/addAnotherCylinder",
  async ({ dat, id }: { dat: any; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/addanothercylinder/${id}/`, dat)
      return response.data
    } catch (err: any) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data.message)
      }
      return rejectWithValue(
        "An unexpected error occurred while adding another cylinder.",
      )
    }
  },
)

export const updateTheCylinder = createAsyncThunk(
  "updateCylinder/updateTheCylinder",
  async ({ name, id }: { name: string; id: string }, { rejectWithValue }) => {
    try {
      // const response = await axios.put(
      //   `${apiUrl}/updateCylinder/${id}/`,
      //   {
      //     name,
      //   },
      //   {
      //     headers: {
      //       Authorization: `Bearer ${Cookies.get("accessToken")}`,
      //     },
      //   },
      // )
      const response = await api.put(`/updateCylinder/${id}/`, { name })
      return response.data
    } catch (err: any) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data.message)
      }
      return rejectWithValue(
        "An unexpected error occurred while updating the cylinder.",
      )
    }
  },
)

export const deleteCylinder = createAsyncThunk(
  "deleteCylinder/deleteCylinder",
  async ({ id }: { id: string }, { rejectWithValue }) => {
    try {
      // const response = await axios.delete(
      //   `${apiUrl}/addanothercylinder/${id}/`,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${Cookies.get("accessToken")}`,
      //     },
      //   },
      // )
      const response = await api.delete(`/addanothercylinder/${id}/`)
      return response.data
    } catch (err: any) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data.message)
      }
      return rejectWithValue(
        "An unexpected error occurred while deleting the cylinder.",
      )
    }
  },
)

export const updateThisCylinder = createAsyncThunk(
  "updateCylinder/updateThisCylinder",
  async ({ dat, id }: { dat: any; id: string }, { rejectWithValue }) => {
    try {
      // const response = await axios.put(
      //   `${apiUrl}/updateThisCylinder/${id}/`,
      //   dat,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${Cookies.get("accessToken")}`,
      //     },
      //   },
      // )
      // console.log("response data", response.data)
      const response = await api.put(`/updateThisCylinder/${id}/`, dat)
      return response.data
    } catch (err: any) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data.message)
      }
      return rejectWithValue(
        "An unexpected error occurred while updating the cylinder.",
      )
    }
  },
)

export const deleteThisCylinder = createAsyncThunk(
  "deleteCylinder/deleteThisCylinder",
  async (
    { id, cylinderWeight }: { cylinderId: string; cylinderWeight },
    { rejectWithValue },
  ) => {
    const formData = {
      weight: cylinderWeight,
    }
    try {
      // const response = await axios.delete(
      //   `${apiUrl}/updateThisCylinder/${id}/${cylinderWeight}/`,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${Cookies.get("accessToken")}`,
      //     },
      //   },
      // )
      // console.log("response data", response.data)
      const response = await api.delete(
        `/updateThisCylinder/${id}/${cylinderWeight}/`,
        {
          data: formData,
        },
      )
      return response.data
    } catch (err: any) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data.message)
      }
      return rejectWithValue(
        "An unexpected error occurred while deleting the cylinder.",
      )
    }
  },
)

export const storeRefillCylinders = createAsyncThunk(
  "cylinders/storeRefillCylinders",
  async ({ payload }: { payload: any }, { rejectWithValue }) => {
    console.log("payload to refill", payload)
    try {
      const response = await api.post(`/deport-refill/`, payload)
      return response.data
    } catch (err: any) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data.message)
      }
      return rejectWithValue(
        "An unexpected error occurred while adding another cylinder.",
      )
    }
  },
)

export const storeRepairCylinders = createAsyncThunk(
  "cylinders/storeRepairCylinders",
  async ({ payload }: { payload: any }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/store-repair/`, payload)

      return response.data
    } catch (err: any) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data.message)
      }
      return rejectWithValue(
        "An unexpected error occurred while adding another cylinder.",
      )
    }
  },
)
const storeSlice = createSlice({
  name: "store",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchStore.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchStore.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.store = action.payload
      })
      .addCase(fetchStore.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to fetch products"
      })
      .addCase(refillEmpties.pending, (state) => {
        state.refillEmptiesStatus = "loading"
      })
      .addCase(refillEmpties.fulfilled, (state, action) => {
        state.refillEmptiesStatus = "succeeded"
        // state.store = action.payload;
      })
      .addCase(refillEmpties.rejected, (state, action) => {
        state.refillEmptiesError =
          action.error.message || "Failed to fetch products"
      })
      .addCase(addNewCylinders.pending, (state) => {
        state.addNewCylinderStatus = "loading"
      })
      .addCase(addNewCylinders.fulfilled, (state, action) => {
        state.addNewCylinderStatus = "succeeded"
        console.log("action payload", action.payload)
        console.log("state store", state.store)
        console.log("action payload data", action.payload.data)
        state.store = [action.payload.data, ...state.store]
      })
      .addCase(addNewCylinders.rejected, (state, action) => {
        state.addNewCylinderStatus = "failed"
        state.addNewCylinderError =
          action.error.message || "Failed to fetch products"
      })
      .addCase(updateTheCylinder.pending, (state) => {
        state.updateCylinderStatus = "loading"
      })
      .addCase(updateTheCylinder.fulfilled, (state, action) => {
        state.updateCylinderStatus = "succeeded"
        const updatedStore = state.store.map((storeItem) => {
          if (storeItem.id === action.payload.id) {
            return {
              ...storeItem,
              name: action.payload.name,
            }
          }
          return storeItem
        })
        state.store = updatedStore
        // state.store = action.payload;
      })
      .addCase(updateTheCylinder.rejected, (state, action) => {
        state.updateCylinderError =
          action.error.message || "Failed to fetch products"
      })
      .addCase(addAnotherCylinder.pending, (state) => {
        state.addAnotherCylinderStatus = "loading"
      })
      .addCase(addAnotherCylinder.fulfilled, (state, action) => {
        state.addAnotherCylinderStatus = "succeeded"

        const updatedStore = state.store.map((storeItem) => {
          if (storeItem.id === action.payload.data.gas_type) {
            return {
              ...storeItem,
              cylinders: [...storeItem.cylinders, action.payload.data],
            }
          }
          return storeItem
        })
        state.store = updatedStore
      })
      .addCase(addAnotherCylinder.rejected, (state, action) => {
        state.addAnotherCyinderError =
          action.error.message || "Failed to fetch products"
      })
      .addCase(deleteCylinder.pending, (state) => {
        state.deleteCylinderStatus = "loading"
      })
      .addCase(deleteCylinder.fulfilled, (state, action) => {
        state.deleteCylinderStatus = "succeeded"
        state.store = state.store.filter(
          (storeItem) => storeItem.id !== action.meta.arg.id,
        )
      })
      .addCase(deleteCylinder.rejected, (state, action) => {
        state.deleteCyinderError = action.error.message || "Failed to delete"
      })
      .addCase(updateThisCylinder.pending, (state) => {
        state.updateCylinderStatus = "loading"
      })
      .addCase(updateThisCylinder.fulfilled, (state, action) => {
        state.updateCylinderStatus = "succeeded"
        const updatedStore = state.store.map((storeItem) => {
          return {
            ...storeItem,
            cylinders: storeItem.cylinders.map((cylinder) => {
              if (cylinder.id === action.payload.data.id) {
                return {
                  ...cylinder,
                  ...action.payload.data,
                }
              }
              return cylinder
            }),
          }
        })

        state.store = updatedStore
      })
      .addCase(updateThisCylinder.rejected, (state, action) => {
        state.updateCylinderError = action.error.message || "Failed to update"
      })

      .addCase(deleteThisCylinder.pending, (state) => {
        state.deleteCylinderStatus = "loading"
      })
      .addCase(deleteThisCylinder.fulfilled, (state, action) => {
        state.deleteCylinderStatus = "succeeded"

        state.store = state.store.map((storeItem) => {
          const cylinderExists = storeItem.cylinders.some(
            (cylinder) => cylinder.id === action.meta.arg.id,
          )

          return {
            ...storeItem,
            cylinders: storeItem.cylinders.filter(
              (cylinder) => cylinder.id !== action.meta.arg.id,
            ),
          }
        })
      })
      .addCase(deleteThisCylinder.rejected, (state, action) => {
        state.deleteCyinderError = action.error.message || "Failed to delete"
      })

      .addCase(storeRefillCylinders.pending, (state) => {
        state.storeRefillStatus = "loading"
      })
      .addCase(storeRefillCylinders.fulfilled, (state, action) => {
        state.storeRefillStatus = "succeeded"

        const updatedTypes = action.payload.updated_types || []

        updatedTypes.forEach((updatedType) => {
          const existingType = state.store.find(
            (type) => type.id === updatedType.id,
          )
          if (!existingType) return

          updatedType.cylinders.forEach((updatedCylinder) => {
            const existingCylinder = existingType.cylinders.find(
              (cyl) => cyl.id === updatedCylinder.id,
            )
            if (!existingCylinder) return

            updatedCylinder.stores.forEach((updatedStore) => {
              const storeIndex = existingCylinder.stores.findIndex(
                (store) => store.id === updatedStore.id,
              )
              if (storeIndex !== -1) {
                existingCylinder.stores[storeIndex] = {
                  ...existingCylinder.stores[storeIndex],
                  ...updatedStore,
                }
              }
            })
          })
        })
      })

      .addCase(storeRefillCylinders.rejected, (state, action) => {
        state.storeRefillError =
          action.error.message ?? "failed to refill cylinders."
      })

      // Store Repair Cylinders
      .addCase(storeRepairCylinders.pending, (state) => {
        state.storeRepairStatus = "loading"
      })
      .addCase(storeRepairCylinders.fulfilled, (state, action) => {
        state.storeRepairStatus = "succeeded"

        const updatedTypes = action.payload.updated_types || []
        console.log("Updated Types", updatedTypes)

        updatedTypes.forEach((updatedType) => {
          const existingType = state.store.find(
            (type) => type.id === updatedType.id,
          )
          if (!existingType) return

          updatedType.cylinders.forEach((updatedCylinder) => {
            const existingCylinder = existingType.cylinders.find(
              (cyl) => cyl.id === updatedCylinder.id,
            )
            if (!existingCylinder) return

            updatedCylinder.stores.forEach((updatedStore) => {
              const storeIndex = existingCylinder.stores.findIndex(
                (store) => store.id === updatedStore.id,
              )
              if (storeIndex !== -1) {
                existingCylinder.stores[storeIndex] = {
                  ...existingCylinder.stores[storeIndex],
                  ...updatedStore,
                }
              }
            })
          })
        })
      })

      .addCase(storeRepairCylinders.rejected, (state, action) => {
        state.storeRepairError =
          action.error.message ?? "failed to repair cylinders."
      })
  },
})

export const selectAllStore = (state: { store: storeState }) =>
  state.store.store
export const getStoreStatus = (state: { store: storeState }) =>
  state.store.status
export const getStoreError = (state: { store: storeState }) => state.store.error

export default storeSlice.reducer
