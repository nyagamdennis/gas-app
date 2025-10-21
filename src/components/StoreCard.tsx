// @ts-nocheck
import React, { useState } from "react"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import ArrowRightIcon from "@mui/icons-material/ArrowRight"
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft"
import FormattedAmount from "./FormattedAmount"
import { Form } from "react-router-dom"

const StoreCard = ({ gas, onDialogOpen, onDialogOpenAgain }) => {
  const [expandedRow, setExpandedRow] = useState(null)
  const [expanded, setExpanded] = useState(false)

  const handleExpand = () => {
    setExpanded(!expanded)
  }
  const toggleRow = (rowId) => {
    setExpandedRow(expandedRow === rowId ? null : rowId)
  }

  return (
    <div
      key={gas.id}
      className="bg-white rounded-xl shadow-md border border-gray-200 p-1 mb-2"
    >
      <div className="flex space-x-2 items-center">
        <h3 className="text-2xl  font-bold text-blue-700 text-nowrap">{gas.name}</h3>
        <div className="flex ">
          <div className="flex items-center gap-1">
            <button
              onClick={() => onDialogOpen("add", gas)}
              className="bg-blue-600 text-white px-3 py-1 text-nowrap  rounded-lg hover:bg-blue-700 transition text-xs"
            >
              Add Cylinder
            </button>
            <button
              onClick={() => onDialogOpen("update", gas)}
              className="bg-green-500 text-white px-3 py-1 r rounded-lg over:bg-green-600 transition text-xs"
            >
              Update
            </button>
            <button
              onClick={() => onDialogOpen("delete", gas)}
              className="bg-red-500 text-white px-3 py-1 rounded-lg  hover:bg-red-600 transition text-xs"
            >
              Delete
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
                                <strong>Wholesale Refill Price:</strong>{" "}
                                <FormattedAmount amount={cylinder.wholesale_refil_price} />
                                
                              </p>
                              <p>
                                <strong>Retail Refill Price:</strong>{" "}
                                <FormattedAmount amount={cylinder.retail_refil_price} />
                                
                              </p>
                              <p>
                                <strong>Outlet Wholesale Price:</strong>{" "}
                                <FormattedAmount amount={cylinder.outlet_wholesale_price} />
                                
                              </p>
                              <p>
                                <strong>Outlet Retail Price:</strong>{" "}
                                <FormattedAmount amount={cylinder.outlet_retail_price} />
                                
                              </p>
                            </div>
                            <div>
                              <p>
                                <strong>Complete Wholesale Price (Gril + Burner):</strong>{" "}
                                <FormattedAmount amount={cylinder.complete_wholesale_price} />
                                
                              </p>
                              <p>
                                <strong>Complete Retail Price (Grill + Burner):</strong>{" "}
                                <FormattedAmount amount={cylinder.complete_retail_price} />
                                
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
