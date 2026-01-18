// @ts-nocheck
import React, { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { useNavigate } from "react-router-dom"
import { fetchSalesTeamShops, selectAllSalesTeamShops } from "../features/salesTeam/salesTeamSlice"
import { fetchStore, selectAllStore } from "../features/store/storeSlice"
import { assignCylinders } from "../features/assigns/assignsSlice"
import {
  fetchProducts,
  selectAllProducts,
} from "../features/product/productSlice"
import {
  fetchOtherProducts,
  selectAllOtherProducts,
} from "../features/store/productsSlice"
import { assignOthers } from "../features/assigns/assignsOthersSlice"
import FormattedAmount from "../components/FormattedAmount"
import planStatus from "../features/planStatus/planStatus"
import AdminNav from "../components/ui/AdminNav"
import AdminsFooter from "../components/AdminsFooter"

const AssigningOtherProducts = () => {
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
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const allSalesTeam = useAppSelector(selectAllSalesTeamShops)
  const products = useAppSelector(selectAllOtherProducts)

  const [selectedTeam, setSelectedTeam] = useState(null)
  const [assignments, setAssignments] = useState([])
  const [loadingAssign, setLoadingAssign] = useState(false)

  useEffect(() => {
    dispatch(fetchSalesTeamShops())
    dispatch(fetchOtherProducts({ businessId }))
  }, [dispatch])

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
    <>
      <AdminNav
        headerMessage={"Others Sales Insights"}
        headerText={"Monitor and manage your team's sales"}
      />

      <div className="min-h-screen bg-gray-100 p-4 ">
        {!selectedTeam ? (
          <div>
            <h2 className="text-xl font-bold text-center mb-4 mt-4">
              Select a Sales Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <h2 className="text-xl font-bold text-center mb-4 mt-4">
              Assign product to {selectedTeam.name}
            </h2>
            <div>
              <table className="mt-2 w-full border text-sm">
                <thead>
                  <tr className="bg-gray-200 text-left">
                    <th className="border px-2 py-1">product</th>
                    <th className="border px-2 py-1">quantity</th>
                    <th className="border px-2 py-1">Retail Price</th>
                    <th className="border px-2 py-1">Wholesale Price</th>
                    <th className="border px-2 py-1">Assign</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="border px-2 py-1 text-center">
                        {product.name}
                      </td>
                      <td className="border px-2 py-1 text-center">
                        {product.quantity}
                      </td>
                      <td className="border px-2 py-1 text-center">
                        <FormattedAmount amount={product.retail_sales_price} />
                      </td>
                      <td className="border px-2 py-1 text-center">
                        <FormattedAmount amount={product.whole_sales_price} />{" "}
                      </td>

                      <td className="border px-2 py-1 text-center">
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
                {loadingAssign ? "Assigning..." : "Assign Cylinders"}
              </button>
            </div>
          </div>
        )}
      </div>
      <AdminsFooter />
    </>
  )
}

export default AssigningOtherProducts
