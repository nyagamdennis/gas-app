// @ts-nocheck
import React, { useEffect, useState } from "react"
import AdminsFooter from "../../components/AdminsFooter"
import { Navigate, useNavigate } from "react-router-dom"
import planStatus from "../../features/planStatus/planStatus"
import { useMediaQuery, useTheme } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { toast, ToastContainer } from "react-toastify"
import Navbar from "../../components/ui/mobile/admin/Navbar"
import {
  fetchSalesTeam,
  selectAllSalesTeam,
} from "../../features/salesTeam/salesTeamSlice"
import {
  fetchOtherProducts,
  selectAllOtherProducts,
} from "../../features/store/otherProductsSlice"
import FormattedAmount from "../../components/FormattedAmount"
import { assignOthers } from "../../features/assigns/assignsOthersSlice"
import {
  fetchAssignedOtherProducts,
  fetchTeamsOtherProducts,
  selectAllAssignedOtherProducts,
} from "../../features/product/assignedOtherProductsSlice"

const CollectOtheProducts = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
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
  const matches = useMediaQuery("(min-width:600px)")
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const allSalesTeam = useAppSelector(selectAllSalesTeam)
  const products = useAppSelector(selectAllOtherProducts)
  const otherProducts = useAppSelector(selectAllAssignedOtherProducts)
  

  const [selectedTeam, setSelectedTeam] = useState(null)
  const [assignments, setAssignments] = useState([])
  const [loadingAssign, setLoadingAssign] = useState(false)
  // console.log("selected team ", selectedTeam?.id)
  const teamId = selectedTeam?.id
  useEffect(() => {
    dispatch(fetchSalesTeam({ businessId }))
    // dispatch(fetchOtherProducts({ businessId }))
    // dispatch(fetchAssignedOtherProducts());
    if (selectedTeam) {
      dispatch(fetchTeamsOtherProducts({ teamId }))
    }
  }, [dispatch, teamId])

  //    useEffect(() => {
  //       dispatch(fetchMyProfile());
  //       dispatch(fetchAssignedOtherProducts());
  //     }, [dispatch]);

  console.log('other products ', otherProducts)
  const handleSelectTeam = (team) => {
    setSelectedTeam(team)
  }

  const handleInputChange = (productId, value) => {
    setAssignments((prev) => {
      const updated = [...prev]
      const index = updated.findIndex((item) => item.productId === productId)

      if (index !== -1) {
        updated[index] = { productId, assigned_quantity: parseInt(value, 10) }
      } else {
        updated.push({ productId, assigned_quantity: parseInt(value, 10) })
      }

      return updated.filter((item) => item.assigned_quantity > 0) // Remove items with 0 quantity
    })
  }

  const handleAssign = () => {
    // setLoadingAssign(true);
    const payload = assignments.map((item) => ({
      sales_team: selectedTeam?.id,
      product: item.productId,
      assigned_quantity: item.assigned_quantity,
    }))

    dispatch(assignOthers(payload))
      .then(() =>
        navigate(`/admins/afterassignothers/${selectedTeam?.id}`, {
          state: { salesTeamName: selectedTeam?.name },
        }),
      )
      .catch((error) => console.error("Error in product assignment:", error))
      .finally(() => setLoadingAssign(false))
  }

  return (
    <div>
      {isMobile ? (
        <div className="min-h-screen bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-gray-800 flex flex-col font-sans">
          <Navbar
            headerMessage={"ERP"}
            headerText={"Manage your operations with style and clarity"}
          />
          <main className="flex-grow m-2 p-1">
            <div className=" ">
              {!selectedTeam ? (
                <div>
                  <h2 className="text-xl font-bold text-center ">
                    Select a Sales Team
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                    {allSalesTeam.map((team) => (
                      <div
                        key={team.id}
                        className="bg-white border border-blue-500 text-blue-600 rounded-lg shadow-lg p-4 cursor-pointer hover:bg-blue-50 transition"
                        onClick={() => handleSelectTeam(team)}
                      >
                        <h3 className="text-lg font-semibold">{team.name}</h3>
                        <p className="text-sm mt-1">
                          Type: {team.type_of_sales_team?.name || "N/A"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-bold text-center mb-2">
                    Collect products to {selectedTeam.name}
                  </h2>
                  <div>
                    <table className="mt-2 w-full border text-sm">
                      <thead>
                        <tr className="bg-gray-200 text-left">
                          <th className="border px-1 py-1">product</th>
                          <th className="border px-1 py-1">quantity</th>
                          <th className="border px-1 py-1">Spoiled</th>
                          <th className="border px-1 py-1">Collect</th>
                        </tr>
                      </thead>
                      <tbody>
                        {otherProducts.map((product) => (
                          <tr key={product.id}>
                            <td className="border px-1 py-1 text-center">
                              {product?.product?.name}
                            </td>
                            <td className="border px-1 py-1 text-center">
                              {product?.assigned_quantity}
                            </td>
                            <td className="border px-1 py-1 text-center">
                             
                                {product.spoiled}
                              
                            </td>
                           

                            <td className="border px-1 py-1 text-center">
                              <input
                                type="number"
                                min="0"
                                max={product.quantity}
                                className="w-full border px-1 py-1"
                                onChange={(e) =>
                                  handleInputChange(product.id, e.target.value)
                                }
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-6 text-center">
                    <button
                      className={`bg-blue-500 text-white px-6 py-2 rounded-lg shadow ${
                        loadingAssign
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-blue-600"
                      } transition`}
                      onClick={handleAssign}
                      disabled={loadingAssign}
                    >
                      {loadingAssign ? "loading..." : "Collect products"}
                    </button>
                  </div>
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

export default CollectOtheProducts
