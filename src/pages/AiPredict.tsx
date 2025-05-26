// @ts-nocheck

import React, { useEffect, useState } from "react"
import AdminNav from "../components/ui/AdminNav"
import AdminsFooter from "../components/AdminsFooter"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import {
  fetchAnalysisAi,
  selectAllAnalysisAi,
} from "../features/ai/aiAnalysisSlice"
import { fetchLocations } from "../features/location/locationSlice"
import {
  fetchCustomers,
  selectAllCustomers,
} from "../features/customers/customerSlice"

const AiPredict = () => {
  const dispatch = useAppDispatch()
  const prediction_data = useAppSelector(selectAllAnalysisAi)
  const customers = useAppSelector(selectAllCustomers)
  const [expandedRows, setExpandedRows] = useState<number[]>([])

  useEffect(() => {
    dispatch(fetchAnalysisAi())
    dispatch(fetchCustomers())
    dispatch(fetchLocations())
  }, [dispatch])

  const toggleRow = (id: number) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <AdminNav
        headerMessage="AI-Powered Insights"
        headerText="Predict the next sales probability for your customers using advanced AI analysis"
      />
      <main className="flex-1 max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-semibold mb-6">
          Predicted Customer Purchases
        </h2>

        {["RETAIL", "WHOLESALE"].map((type) => {
          const filtered = prediction_data.filter((prediction) => {
            const customer = customers.find(
              (c) => c.id === prediction.customer_id,
            )
            return customer?.sales === type
          })

          return (
            <div key={type} className="mb-12">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {type} Customers
              </h3>

              <div className="w-full overflow-x-auto bg-white shadow rounded-lg">
                <table className="w-full table-auto divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">
                        Name
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">
                        Type
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">
                        Next Purchase
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filtered.map((prediction) => {
                      const customer = customers.find(
                        (c) => c.id === prediction.customer_id,
                      )
                      const isExpanded = expandedRows.includes(
                        prediction.customer_id,
                      )

                      return (
                        <React.Fragment key={prediction.customer_id}>
                          <tr className="hover:bg-gray-50">
                            <td className="px-4 py-2 whitespace-nowrap text-gray-900">
                              {customer?.name || "Unknown"}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-gray-700">
                              {customer?.sales}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-gray-700">
                              {new Date(
                                prediction.latest_prediction,
                              ).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap">
                              <button
                                onClick={() =>
                                  toggleRow(prediction.customer_id)
                                }
                                className="text-blue-600 hover:underline"
                              >
                                {isExpanded ? "Hide" : "View More"}
                              </button>
                            </td>
                          </tr>

                          {isExpanded && (
                            <tr className="bg-gray-50">
                              <td
                                colSpan={4}
                                className="px-4 py-2 text-gray-600"
                              >
                                <div className=" flex">
                                  <div>
                                    <span className="font-medium text-gray-800">
                                      Phone:
                                    </span>{" "}
                                    {customer?.phone ? (
                                      <a
                                        href={`tel:${customer.phone}`}
                                        className="text-blue-600 underline hover:text-blue-800"
                                      >
                                        {customer.phone}
                                      </a>
                                    ) : (
                                      "N/A"
                                    )}
                                    <div>
                                      <span className="font-medium text-gray-800">
                                        Location:
                                      </span>{" "}
                                      {customer?.location?.name || "N/A"}
                                    </div>
                                  </div>
                                  {/* <div>
                                  send sms
                                </div> */}
                                </div>
                                
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      )
                    })}

                    {filtered.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="text-center px-4 py-4 text-gray-500"
                        >
                          No {type.toLowerCase()} customers predicted
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )
        })}
      </main>

      <div className="mt-auto">
        <AdminsFooter />
      </div>
    </div>
  )
}

export default AiPredict
