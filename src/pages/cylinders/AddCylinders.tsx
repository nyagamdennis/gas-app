import React, { useEffect, useState } from "react"
import { useMediaQuery, useTheme } from "@mui/material"
import Navbar from "../../components/ui/mobile/admin/Navbar"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { useNavigate } from "react-router-dom"
import { CiSquarePlus } from "react-icons/ci";
import planStatus from "../../features/planStatus/planStatus"
import AddBoxIcon from '@mui/icons-material/AddBox';
import {
  fetchSalesTeam,
  selectAllSalesTeam,
} from "../../features/salesTeam/salesTeamSlice"
import AdminsFooter from "../../components/AdminsFooter"
import {
  fetchCylindersBrand,
  selectAllCylinderBrands,
} from "../../features/cylinders/cylindersBrandSlice"
import Select from "react-select"
import {
  fetchCylindersWeight,
  selectAllCylindersWeight,
} from "../../features/cylinders/cylindersWeightSlice"
import { all } from "axios"

const AddCylinders = () => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const {
    isPro,
    isTrial,
    isExpired,
    businessName,
    businessId,
    businessLogo,
    subscriptionPlan,
    employeeLimit,
    planName,
  } = planStatus()
  const [showAddBrandModal, setShowAddBrandModal] = useState(false)

  const matches = useMediaQuery("(min-width:600px)")
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const allCylinderBrands = useAppSelector(selectAllCylinderBrands)
  const allCylinderWeights = useAppSelector(selectAllCylindersWeight)

  useEffect(() => {
    if (businessId) {
      dispatch(fetchCylindersBrand())
      dispatch(fetchCylindersWeight())
    }
  }, [dispatch, businessId])

  //   console.log("All Cylinder Brands:", allCylinderBrands);

  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ]
  console.log(options)
  console.log(allCylinderBrands)
  return (
    <div>
      {isMobile ? (
        <div className="min-h-screen bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-gray-800 flex flex-col font-sans">
          <Navbar
            headerMessage={"ERP"}
            headerText={"Manage your operations with style and clarity"}
          />
          <main className="flex-grow m-2 p-1">
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-2xl font-semibold mb-6">Add Cylinders</h2>
    <form className="space-y-6">
      {/* Cylinder Brand Select */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Brand Name
        </label>
        <div className="flex items-center gap-2">
          <Select
            options={[
              ...allCylinderBrands.map((brand: any) => ({
                value: brand.id,
                label: brand.name,
              })),
            ]}
            onChange={(selected) => {
              if (selected && (selected as any).value === "add_new") {
                setShowAddBrandModal(true)
              }
            }}
            placeholder="Select Brand"
            isClearable
            className="flex-grow"
          />
          <button
            type="button"
            onClick={() => setShowAddBrandModal(true)}
            className="bg-blue-500 text-white p-2 rounded-md shadow-md hover:bg-blue-600 transition"
          >
            <AddBoxIcon sx={{ fontSize: 24 }} />
          </button>
        </div>
      </div>

      {/* Weight */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Weight (kg)
        </label>
        <div className="flex items-center gap-2">
          <Select
            options={[
              ...allCylinderWeights.map((weight: any) => ({
                value: weight.id,
                label: weight.weight + " kg",
              })),
            ]}
            onChange={(selected) => {
              if (selected && (selected as any).value === "add_new") {
                setShowAddBrandModal(true)
              }
            }}
            placeholder="Select Weight"
            isClearable
            className="flex-grow"
          />
          <button
            type="button"
            onClick={() => setShowAddBrandModal(true)}
            className="bg-blue-500 text-white p-2 rounded-md shadow-md hover:bg-blue-600 transition"
          >
            <AddBoxIcon sx={{ fontSize: 24 }} />
          </button>
        </div>
      </div>

      {/* Prices */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Prices
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Outlet Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Outlet Wholesale Price (Full Cylinder)
            </label>
            <input
              type="number"
              placeholder="Enter outlet price"
              className="mt-1 block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Outlet Retail Price (Full Cylinder)
            </label>
            <input
              type="number"
              placeholder="Enter outlet price"
              className="mt-1 block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {/* Wholesale Refill Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Wholesale Refill Price
            </label>
            <input
              type="number"
              placeholder="Enter wholesale refill price"
              className="mt-1 block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {/* Retail Refill Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Retail Refill Price
            </label>
            <input
              type="number"
              placeholder="Enter retail refill price"
              className="mt-1 block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {/* Depot Refill Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Depot Refill Price
            </label>
            <input
              type="number"
              placeholder="Enter depot refill price"
              className="mt-1 block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Quantities */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Quantities
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Full Cylinders */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Cylinders
            </label>
            <input
              type="number"
              placeholder="Enter quantity"
              className="mt-1 block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {/* Empty Cylinders */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Empty Cylinders
            </label>
            <input
              type="number"
              placeholder="Enter quantity"
              className="mt-1 block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {/* Spoiled Cylinders */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Spoiled Cylinders
            </label>
            <input
              type="number"
              placeholder="Enter quantity"
              className="mt-1 block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition"
        >
          Add Cylinders
        </button>
      </div>
    </form>
  </div>
</main>
          <footer>
            <AdminsFooter />
          </footer>
        </div>
      ) : (
        <div className="p-4">
          <p>Desktop view coming soon</p>
        </div>
      )}
    </div>
  )
}

export default AddCylinders
