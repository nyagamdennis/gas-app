// @ts-nocheck
import React, { useEffect, useState } from "react"
import { useMediaQuery, useTheme } from "@mui/material"
import planStatus from "../../features/planStatus/planStatus"
import Navbar from "../../components/ui/mobile/admin/Navbar"
import { useAppDispatch } from "../../app/hooks"
import { useNavigate, useParams } from "react-router-dom"
import api from "../../../utils/api"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp"
import AdminsFooter from "../../components/AdminsFooter"

const TeamsCylindersVehicle = () => {
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

  const [assignedCylinders, setAssignedCylinders] = useState([])
  const [loading, setloading] = useState(true)

  const matches = useMediaQuery("(min-width:600px)")
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const idParams = useParams()
  const teamId = idParams.id
  const teamName = idParams.name ? decodeURIComponent(idParams.name) : ""



  
    const [showStacked, setShowStacked] = useState(false)
    const [expandedRows, setExpandedRows] = useState({})
  
    

  

  useEffect(() => {
    if (teamId) {
      api
        .get(`/inventory/vehicles/${teamId}/cylinders/`)
        .then((response) => setAssignedCylinders(response.data))
        .catch((error) =>
          console.error("Error fetching assigned cylinders:", error),
        )
        .finally(() => {
          setloading(false)
        })
    }
  }, [teamId])



  const toggleRowExpansion = (cylinderId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [cylinderId]: !prev[cylinderId],
    }))
  }

  // Calculate totals
  const calculateTotals = () => {
    return assignedCylinders.reduce(
      (acc, cylinder) => {
        acc.filled += cylinder.full_cylinder_quantity || 0
        acc.empties += cylinder.empty_cylinder_quantity || 0
        acc.spoiled += cylinder.spoiled_cylinder_quantity || 0
        acc.filledLost += cylinder.filled_lost || 0
        acc.emptiesLost += cylinder.empties_lost || 0
        acc.lessPay += cylinder.less_pay || 0
        return acc
      },
      {
        filled: 0,
        empties: 0,
        spoiled: 0,
        filledLost: 0,
        emptiesLost: 0,
        lessPay: 0,
      },
    )
  }

  const totals = assignedCylinders.length > 0 ? calculateTotals() : null

  // Group cylinders by type
  const groupByType = () => {
    const grouped = {}
    assignedCylinders.forEach((cylinder) => {
      const typeName = cylinder.cylinder?.cylinder_type?.name || "Unknown"
      if (!grouped[typeName]) {
        grouped[typeName] = []
      }
      grouped[typeName].push(cylinder)
    })
    return grouped
  }

    const groupedCylinders = assignedCylinders.length > 0 ? groupByType() : {}

  return (
    <div>
      {isMobile ? (
        <div className="min-h-screen bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-gray-800 flex flex-col font-sans">
          <Navbar
            headerMessage={"ERP"}
            headerText={"Manage your operations with style and clarity"}
          />
          <main className="flex-grow m-2 p-1">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg shadow-lg mb-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-white hover:text-blue-100 font-medium transition mb-3"
              >
                <span className="mr-2">←</span> Back
              </button>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">
                    {teamName || "Team"}
                  </h1>
                  <p className="text-blue-100 text-sm">
                    Cylinder Stock Overview
                  </p>
                </div>
                <div className="text-6xl opacity-20">🛢️</div>
              </div>
            </div>

            {!loading ? (
              <>
                {assignedCylinders.length > 0 ? (
                  <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
                        <div className="text-xs text-gray-600 mb-1">Filled</div>
                        <div className="text-2xl font-bold text-green-600">
                          {totals.filled}
                        </div>
                        {totals.filledLost > 0 && (
                          <div className="text-xs text-red-500 mt-1">
                            -{totals.filledLost} lost
                          </div>
                        )}
                      </div>

                      <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-gray-400">
                        <div className="text-xs text-gray-600 mb-1">
                          Empties
                        </div>
                        <div className="text-2xl font-bold text-gray-700">
                          {totals.empties}
                        </div>
                        {totals.emptiesLost > 0 && (
                          <div className="text-xs text-red-500 mt-1">
                            -{totals.emptiesLost} lost
                          </div>
                        )}
                      </div>

                      <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-red-500">
                        <div className="text-xs text-gray-600 mb-1">
                          Spoiled
                        </div>
                        <div className="text-2xl font-bold text-red-600">
                          {totals.spoiled}
                        </div>
                      </div>
                    </div>

                    {/* Toggle View Button */}
                    <div className="flex justify-end mb-3">
                      <button
                        onClick={() => setShowStacked(!showStacked)}
                        className="bg-white px-4 py-2 rounded-lg shadow-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                      >
                        {showStacked ? "📊 Table View" : "📋 Card View"}
                      </button>
                    </div>

                    {!showStacked ? (
                      /* Table View */
                      <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-gradient-to-r from-blue-100 to-blue-200">
                                <th className="border border-gray-300 px-3 py-3 text-left font-semibold">
                                  Type & Weight
                                </th>
                                <th className="border border-gray-300 px-3 py-3 text-center font-semibold text-green-600">
                                  Filled
                                </th>
                                <th className="border border-gray-300 px-3 py-3 text-center font-semibold">
                                  Empties
                                </th>
                                <th className="border border-gray-300 px-3 py-3 text-center font-semibold text-red-600">
                                  Spoiled
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {assignedCylinders.map((cylinder) => (
                                <tr
                                  key={cylinder.id}
                                  className="hover:bg-gray-50 transition"
                                >
                                  <td className="border border-gray-300 px-3 py-3">
                                    <div className="font-semibold text-gray-800">
                                      {cylinder.cylinder?.cylinder_type?.name}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                      {cylinder.cylinder?.weight?.weight} kg
                                    </div>
                                  </td>
                                  <td className="border border-gray-300 px-3 py-3 text-center">
                                    <div className="font-bold text-green-600 text-lg">
                                      {cylinder.full_cylinder_quantity}
                                    </div>
                                    {cylinder.filled_lost > 0 && (
                                      <div className="text-xs text-red-500 mt-1">
                                        -{cylinder.filled_lost} lost
                                      </div>
                                    )}
                                    {cylinder.less_pay > 0 && (
                                      <div className="text-xs text-orange-600 mt-1">
                                        -{cylinder.less_pay} less pay
                                      </div>
                                    )}
                                  </td>
                                  <td className="border border-gray-300 px-3 py-3 text-center">
                                    <div className="font-bold text-gray-700 text-lg">
                                      {cylinder.empty_cylinder_quantity}
                                    </div>
                                    {cylinder.empties_lost > 0 && (
                                      <div className="text-xs text-red-500 mt-1">
                                        -{cylinder.empties_lost} lost
                                      </div>
                                    )}
                                    {cylinder.less_pay > 0 && (
                                      <div className="text-xs text-green-600 mt-1">
                                        +{cylinder.less_pay} from less pay
                                      </div>
                                    )}
                                  </td>
                                  <td className="border border-gray-300 px-3 py-3 text-center">
                                    <div className="font-bold text-red-600 text-lg">
                                      {cylinder.spoiled_cylinder_quantity}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      /* Card View */
                      <div className="space-y-4">
                        {Object.entries(groupedCylinders).map(
                          ([typeName, cylinders]) => (
                            <div
                              key={typeName}
                              className="bg-white rounded-lg shadow-md border-l-4 border-blue-500 overflow-hidden"
                            >
                              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 border-b border-gray-200">
                                <h3 className="text-lg font-bold text-blue-700 flex items-center">
                                  <span className="mr-2">🛢️</span>
                                  {typeName}
                                </h3>
                              </div>
                              <div className="p-4 space-y-3">
                                {cylinders.map((cylinder) => (
                                  <div
                                    key={cylinder.id}
                                    className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition"
                                  >
                                    <div className="flex justify-between items-start mb-3">
                                      <div>
                                        <div className="font-semibold text-gray-800">
                                          {cylinder.cylinder?.weight?.weight} kg
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          {cylinder.cylinder?.display_name ||
                                            "Standard"}
                                        </div>
                                      </div>
                                      <button
                                        onClick={() =>
                                          toggleRowExpansion(cylinder.id)
                                        }
                                        className="text-blue-600 hover:text-blue-800"
                                      >
                                        {expandedRows[cylinder.id] ? (
                                          <ArrowDropUpIcon />
                                        ) : (
                                          <ArrowDropDownIcon />
                                        )}
                                      </button>
                                    </div>

                                    <div className="grid grid-cols-3 gap-3">
                                      <div className="text-center p-2 bg-green-50 rounded">
                                        <div className="text-xs text-gray-600 mb-1">
                                          Filled
                                        </div>
                                        <div className="text-xl font-bold text-green-600">
                                          {cylinder.full_cylinder_quantity}
                                        </div>
                                      </div>
                                      <div className="text-center p-2 bg-gray-50 rounded">
                                        <div className="text-xs text-gray-600 mb-1">
                                          Empties
                                        </div>
                                        <div className="text-xl font-bold text-gray-700">
                                          {cylinder.empty_cylinder_quantity}
                                        </div>
                                      </div>
                                      <div className="text-center p-2 bg-red-50 rounded">
                                        <div className="text-xs text-gray-600 mb-1">
                                          Spoiled
                                        </div>
                                        <div className="text-xl font-bold text-red-600">
                                          {cylinder.spoiled_cylinder_quantity}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Expanded Details */}
                                    {expandedRows[cylinder.id] && (
                                      <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                                        {cylinder.filled_lost > 0 && (
                                          <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-600">
                                              Filled Lost:
                                            </span>
                                            <span className="font-semibold text-red-500">
                                              -{cylinder.filled_lost}
                                            </span>
                                          </div>
                                        )}
                                        {cylinder.empties_lost > 0 && (
                                          <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-600">
                                              Empties Lost:
                                            </span>
                                            <span className="font-semibold text-red-500">
                                              -{cylinder.empties_lost}
                                            </span>
                                          </div>
                                        )}
                                        {cylinder.less_pay > 0 && (
                                          <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-600">
                                              Less Pay Adjustment:
                                            </span>
                                            <span className="font-semibold text-orange-600">
                                              {cylinder.less_pay}
                                            </span>
                                          </div>
                                        )}
                                        {!cylinder.filled_lost &&
                                          !cylinder.empties_lost &&
                                          !cylinder.less_pay && (
                                            <div className="text-sm text-gray-500 text-center italic">
                                              No adjustments
                                            </div>
                                          )}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <div className="text-6xl mb-4 opacity-30">📦</div>
                    <p className="text-gray-500 text-lg mb-2">
                      No cylinders assigned yet
                    </p>
                    <p className="text-gray-400 text-sm">
                      Assign cylinders to this team to see stock information
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12">
                <div className="flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
                  <p className="text-gray-600 font-medium">
                    Loading cylinder data...
                  </p>
                </div>
              </div>
            )}
          </main>
          <footer className="text-white">
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

export default TeamsCylindersVehicle
