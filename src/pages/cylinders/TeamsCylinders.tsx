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

const TeamsCylinders = () => {
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
  const [showStacked, setShowStacked] = useState<boolean>(false)
   
  const matches = useMediaQuery("(min-width:600px)")
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const idParams = useParams()
  const teamId = idParams.id
const teamName = idParams.name ? decodeURIComponent(idParams.name) : ""
  // console.log("Team ID from params:", teamId);
//   console.log("Team Name from params:", teamName);

  useEffect(() => {
    if (teamId) {
      api
        .get("/the-assigned-cylinders/", {
          params: { sales_team: teamId },
        })
        .then((response) => setAssignedCylinders(response.data))
        .catch((error) =>
          console.error("Error fetching assigned cylinders:", error),
        )
        .finally(() => {
          setloading(false)
        })
    }
  }, [teamId])
  //   console.log("Assigned Cylinders:", assignedCylinders)

  return (
    <div>
      {isMobile ? (
        <div className="min-h-screen bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-gray-800 flex flex-col font-sans">
          <Navbar
            headerMessage={"ERP"}
            headerText={"Manage your operations with style and clarity"}
          />
          <main className="flex-grow m-2 p-1">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">
                {teamName} Cylinders stock
              </h2>
              {!loading ? (
                <>
                  {assignedCylinders.length > 0 ? (
                    <>
                      <div className="w-full overflow-x-auto">
                        <table className="table-auto w-full text-xs md:text-sm border-collapse border border-gray-300 sticky top-0 bg-white z-10">
                          <thead>
                            <tr className="bg-gray-200">
                              <th className="border px-2 py-1">Gas Type</th>
                              <th className="border px-2 py-1">Weight (kg)</th>
                              <th className="border px-2 py-1">Assigned</th>
                              <th className="border px-2 py-1">Filled</th>
                              <th className="border px-2 py-1">Empties</th>
                              <th className="border px-2 py-1">Spoiled</th>
                            </tr>
                          </thead>
                          <tbody>
                            {assignedCylinders.map((cylinder) => (
                              <tr key={cylinder.id} className="text-center">
                                <td className="border px-2 py-1">
                                  {cylinder.gas_type}
                                </td>
                                <td className="border px-2 py-1">
                                  {cylinder.weight}
                                </td>
                                <td className="border px-2 py-1">
                                  {cylinder.assigned_quantity}
                                </td>
                                <td className="border px-2 py-1 whitespace-nowrap">
                                  {cylinder.filled}
                                  {cylinder.filled_lost > 0 && (
                                    <span className="text-red-500 ml-2 font-bold">
                                      - {cylinder.filled_lost}
                                    </span>
                                  )}
                                  {cylinder.less_pay > 0 && (
                                    <span className="text-green-800 ml-2 font-bold">
                                      - {cylinder.less_pay}
                                    </span>
                                  )}
                                </td>
                                <td className="border px-2 py-1 whitespace-nowrap">
                                  {cylinder.empties}
                                  {cylinder.empties_lost > 0 && (
                                    <span className="text-red-500 ml-2 font-bold">
                                      - {cylinder.empties_lost}
                                    </span>
                                  )}
                                  {cylinder.less_pay > 0 && (
                                    <span className="text-green-800 ml-2 font-bold">
                                      + {cylinder.less_pay}
                                    </span>
                                  )}
                                </td>
                                <td className="border px-2 py-1">
                                  {cylinder.spoiled}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                   
                     
                    </>
                  ) : (
                    <p className="text-center mt-4 text-gray-600">
                      No data available for assigned cylinders.
                    </p>
                  )}
                </>
              ) : (
                <div className="flex justify-center mt-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-600"></div>
                </div>
              )}
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

export default TeamsCylinders
