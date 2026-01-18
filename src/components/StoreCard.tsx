// @ts-nocheck
import React, { useState } from "react"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import FormattedAmount from "./FormattedAmount"

const StoreCard = ({ storeCylinders, onDialogOpen, onDialogOpenAgain }) => {
  const [expandedRow, setExpandedRow] = useState(null)

  const toggleRow = (rowId) => {
    setExpandedRow(expandedRow === rowId ? null : rowId)
  }

  // Group cylinders by cylinder type
  const groupedCylinders = storeCylinders.reduce((acc, item) => {
    const cylinderName = item.cylinder.cylinder_type.name
    if (!acc[cylinderName]) {
      acc[cylinderName] = {
        name: cylinderName,
        id: item.cylinder.cylinder_type.id,
        cylinders: [],
      }
    }
    acc[cylinderName].cylinders.push(item)
    return acc
  }, {})

  return (
    <div className="space-y-4">
      {Object.values(groupedCylinders).map((gas) => (
        <div
          key={gas.id}
          className="bg-white rounded-xl shadow-md border border-gray-200 p-1 mb-2"
        >
          <div className="flex space-x-2 items-center">
            <h3 className="text-2xl font-bold text-blue-700 text-nowrap">
              {gas.name}
            </h3>
            <div className="flex">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onDialogOpen("add", gas)}
                  className="bg-blue-600 text-white px-3 py-1 text-nowrap rounded-lg hover:bg-blue-700 transition text-xs"
                >
                  Add Cylinder
                </button>
                <button
                  onClick={() => onDialogOpen("update", gas)}
                  className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition text-xs"
                >
                  Update
                </button>
                <button
                  onClick={() => onDialogOpen("delete", gas)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition text-xs"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>

          {gas.cylinders.map((cylinderData) => {
            const cylinder = cylinderData.cylinder
            const weight = cylinder.weight.weight
            const total =
              cylinderData.full_cylinder_quantity +
              cylinderData.empty_cylinder_quantity +
              cylinderData.spoiled_cylinder_quantity

            return (
              <div key={cylinderData.id} className="mt-5 space-y-2">
                <h4 className="text-lg font-semibold text-gray-800">
                  Cylinder Weight: {weight}kg
                </h4>

                <table className="w-full border text-sm rounded overflow-hidden">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 font-semibold">
                      <th className="border px-2 py-2 text-left">Filled</th>
                      <th className="border px-2 py-2 text-left">Empties</th>
                      <th className="border px-2 py-2 text-left">Spoiled</th>
                      <th className="border px-2 py-2 text-left">Total</th>
                      <th className="border px-2 py-2 text-center">More</th>
                    </tr>
                  </thead>
                  <tbody>
                    <React.Fragment>
                      <tr className="hover:bg-gray-50 transition">
                        <td className="border px-2 py-2 text-center">
                          {cylinderData.full_cylinder_quantity}
                        </td>
                        <td className="border px-2 py-2 text-center">
                          {cylinderData.empty_cylinder_quantity}
                        </td>
                        <td className="border px-2 py-2 text-center">
                          {cylinderData.spoiled_cylinder_quantity}
                        </td>
                        <td className="border px-2 py-2 text-center">
                          {total}
                        </td>
                        <td className="border px-2 py-2 text-center">
                          <button
                            onClick={() => toggleRow(cylinderData.id)}
                            className="text-gray-600 hover:text-blue-600 transition"
                          >
                            <KeyboardArrowDownIcon />
                          </button>
                        </td>
                      </tr>

                      {expandedRow === cylinderData.id && (
                        <tr>
                          <td
                            colSpan={5}
                            className="border-t px-4 py-3 bg-gray-50"
                          >
                            <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-700">
                              <div>
                                <p>
                                  <strong>Wholesale Refill Price:</strong>{" "}
                                  <FormattedAmount
                                    amount={cylinder.wholesale_refill_price}
                                  />
                                </p>
                                <p>
                                  <strong>Retail Refill Price:</strong>{" "}
                                  <FormattedAmount
                                    amount={cylinder.retail_refill_price}
                                  />
                                </p>
                                <p>
                                  <strong>Outlet Wholesale Price:</strong>{" "}
                                  <FormattedAmount
                                    amount={cylinder.outlet_wholesale_price}
                                  />
                                </p>
                                <p>
                                  <strong>Outlet Retail Price:</strong>{" "}
                                  <FormattedAmount
                                    amount={cylinder.outlet_retail_price}
                                  />
                                </p>
                              </div>
                              <div>
                                <p>
                                  <strong>
                                    Complete Wholesale Price (Grill + Burner):
                                  </strong>{" "}
                                  <FormattedAmount
                                    amount={cylinder.complete_wholesale_price}
                                  />
                                </p>
                                <p>
                                  <strong>
                                    Complete Retail Price (Grill + Burner):
                                  </strong>{" "}
                                  <FormattedAmount
                                    amount={cylinder.complete_retail_price}
                                  />
                                </p>
                                <p>
                                  <strong>Empty Cylinder Price:</strong>{" "}
                                  <FormattedAmount
                                    amount={cylinder.empty_cylinder_price}
                                  />
                                </p>
                                <p>
                                  <strong>Depot Refill Price:</strong>{" "}
                                  <FormattedAmount
                                    amount={cylinder.depot_refill_price}
                                  />
                                </p>
                              </div>
                            </div>

                            <div className="mt-4 flex gap-3">
                              <button
                                onClick={() =>
                                  onDialogOpenAgain("delete", gas, cylinderData)
                                }
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm"
                              >
                                Delete
                              </button>
                              <button
                                onClick={() =>
                                  onDialogOpenAgain("update", gas, cylinderData)
                                }
                                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition text-sm"
                              >
                                Update
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  </tbody>
                </table>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default StoreCard
