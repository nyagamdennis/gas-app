// @ts-nocheck
import React, { useState } from "react"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import ArrowRightIcon from "@mui/icons-material/ArrowRight"
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft"
import FormattedAmount from "./FormattedAmount"
import { Form } from "react-router-dom"

const StoreCard = ({ gas, onDialogOpen, onDialogOpenAgain }) => {
    // console.log("gas", gas)
  const [expandedRow, setExpandedRow] = useState(null)
  const [expanded, setExpanded] = useState(false)

  const handleExpand = () => {
    setExpanded(!expanded)
  }
  const toggleRow = (rowId) => {
    setExpandedRow(expandedRow === rowId ? null : rowId)
  }

  // console.log("gas", gas)
  return (
    <div
      key={gas.id}
      className="bg-white rounded-xl shadow-md border border-gray-200 p-5 mb-5"
    >
      <div className="flex space-x-5 items-center">
        <h3 className="text-2xl  font-bold text-blue-700 text-nowrap">{gas.name}</h3>
        <div className="flex ">
          <div className="flex items-center">
            <button
              onClick={() => onDialogOpen("add", gas)}
              className="bg-blue-600 text-white px-3 py-1 text-nowrap rounded hover:bg-blue-700 transition text-sm"
            >
              Add Cylinder
            </button>
            <button
              onClick={() => onDialogOpen("delete", gas)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm ml-2"
            >
              Delete
            </button>
            <button
              onClick={() => onDialogOpen("update", gas)}
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition text-sm ml-2"
            >
              Update
            </button>
          </div>
        </div>
      </div>

      {gas.cylinders.map((cylinder) => (
        <div key={cylinder.id} className="mt-5 space-y-2">
          <h4 className="text-lg font-semibold text-gray-800">
            Cylinder Weight: {cylinder.weight.weight}kg
          </h4>

          {cylinder.stores.length > 0 ? (
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
                {cylinder.stores.map((storeItem) => (
                  <React.Fragment key={storeItem.id}>
                    <tr className="hover:bg-gray-50 transition">
                      <td className="border px-2 py-2 text-center">
                        {storeItem.filled}
                      </td>
                      <td className="border px-2 py-2 text-center">
                        {storeItem.empties}
                      </td>
                      <td className="border px-2 py-2 text-center">
                        {storeItem.spoiled}
                      </td>
                      <td className="border px-2 py-2 text-center">
                        {storeItem.total_cylinders}
                      </td>
                      <td className="border px-2 py-2 text-center">
                        <button
                          onClick={() => toggleRow(storeItem.id)}
                          className="text-gray-600 hover:text-blue-600 transition"
                        >
                          <KeyboardArrowDownIcon />
                        </button>
                      </td>
                    </tr>

                    {expandedRow === storeItem.id && (
                      <tr>
                        <td
                          colSpan={5}
                          className="border-t px-4 py-3 bg-gray-50"
                        >
                          <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-700">
                            <div>
                              <p>
                                <strong>Min Retail Price:</strong>{" "}
                                <FormattedAmount amount={cylinder.min_retail_selling_price} />
                                
                              </p>
                              <p>
                                <strong>Max Retail Price:</strong>{" "}
                                <FormattedAmount amount={cylinder.max_retail_selling_price} />
                                
                              </p>
                              <p>
                                <strong>Min Wholesale:</strong>{" "}
                                <FormattedAmount amount={cylinder.min_wholesale_selling_price} />
                                
                              </p>
                              <p>
                                <strong>Max Wholesale:</strong>{" "}
                                <FormattedAmount amount={cylinder.max_wholesale_selling_price} />
                                
                              </p>
                            </div>
                            <div>
                              <p>
                                <strong>Min Refill (Retail):</strong>{" "}
                                <FormattedAmount amount={cylinder.min_retail_refil_price} />
                                
                              </p>
                              <p>
                                <strong>Max Refill (Retail):</strong>{" "}
                                <FormattedAmount amount={cylinder.max_retail_refil_price} />
                                
                              </p>
                              <p>
                                <strong>Min Refill (Wholesale):</strong>{" "}
                                <FormattedAmount amount={cylinder.min_wholesale_refil_price} />
                                
                              </p>
                              <p>
                                <strong>Max Refill (Wholesale):</strong>{" "}
                                <FormattedAmount amount={cylinder.max_wholesale_refil_price} />
                                
                              </p>


                              <p>
                                <strong>Empty Cylinder prince:</strong>{" "}
                                <FormattedAmount amount={cylinder.empty_cylinder_price} />
                                
                              </p>
                              {/* depot_refill_price */}
                              <p>
                                <strong>Depot Refill prince:</strong>{" "}
                                <FormattedAmount amount={cylinder.depot_refill_price } />
                                
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 flex gap-3">
                            <button
                              onClick={() =>
                                onDialogOpenAgain("delete", gas, cylinder)
                              }
                              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() =>
                                onDialogOpenAgain("update", gas, cylinder)
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
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 text-sm italic mt-2">
              No stores available for this cylinder.
            </p>
          )}
        </div>
      ))}
    </div>
  )
}

export default StoreCard
