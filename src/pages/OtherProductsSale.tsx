// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  fetchAssignedOtherProducts,
  selectAllAssignedOtherProducts,
} from "../features/product/assignedOtherProductsSlice";
import { fetchMyProfile, selectMyProfile } from "../features/employees/myProfileSlice";
import { Link } from "react-router-dom";
import defaultProfile from "../components/media/default.png";
import EmployeeNav from "../components/ui/EmployeeNav";
import EmployeeFooter from "../components/ui/EmployeeFooter";
import AdminsFooter from "../components/AdminsFooter";

const OtherProductsSale = () => {
  const dispatch = useAppDispatch();
  const otherProducts = useAppSelector(selectAllAssignedOtherProducts);
  const myProfile = useAppSelector(selectMyProfile);
    const [spoiledInput, setSpoiledInput] = useState({})
  
  // console.log("Other Products:", otherProducts);

  useEffect(() => {
    dispatch(fetchMyProfile());
    dispatch(fetchAssignedOtherProducts());
  }, [dispatch]);


  const salesTeamName = myProfile?.sales_team?.name || "Sales Team";

  const handleSpoiledInputChange = (id, value) => {
    setSpoiledInput((prev) => ({ ...prev, [id]: Number(value) }))
  }

   const handleSpoiledSubmit = (id) => {
      const spoiledQty = spoiledInput[id]
      if (!spoiledQty || spoiledQty < 0) {
        alert("Please enter a valid spoiled quantity.")
        return
      }
  
      // Dispatch addSpoiledCylinder action
      dispatch(addSpoiledCylinder({ id, spoiled: spoiledQty }))
        .unwrap()
        .then(() => {
          alert("Spoiled cylinders updated successfully!")
          dispatch(fetchAssignedProducts()) // Refresh the assigned products after update
          setSpoiledInput((prev) => ({ ...prev, [id]: "" })) // Reset input
        })
        .catch((error) => {
          console.error("Failed to update spoiled cylinders:", error)
          alert("Failed to update spoiled cylinders.")
        })
    }


  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header Section */}
      <EmployeeNav headerMessage={"Other Products Sale"} 
          headerText={"Manage and view your assigned products"} salesTeamName={salesTeamName} myProfile={myProfile} />
     
      {/* Product Grid Section */}
      <div className="flex-grow p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {otherProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white border border-gray-300 rounded-lg shadow-lg p-6 hover:shadow-xl transition"
          >
            <div>
               <h3 className="text-xl font-semibold text-blue-700">{product.product.name}</h3>
            <p className="text-gray-600 mt-2">
              <strong>Assigned Quantity:</strong> {product.assigned_quantity}
            </p>
             <p className="text-gray-600 mt-1">
              <strong>Retail Sold:</strong> {product.retail_sold}
            </p>
            <p className="text-gray-600 mt-1">
              <strong>Wholesale Sold:</strong> {product.wholesale_sold}
            </p>
             <p className="text-gray-600 mt-1">
              <strong>Missing:</strong> {product.missing_products}
            </p>
            <p className="text-gray-600 mt-1">
              <strong>Remaining:</strong> {product.assigned_quantity}
            </p>
            <p className="text-gray-600 mt-1">
              <strong>Spoiled:</strong> {product.spoiled}
            </p>
            <p className="text-gray-600 mt-1 text-sm">
              <strong>Wholesale Price:</strong> Ksh {product.product.whole_sales_price}
            </p>
            <p className="text-gray-600 mt-1 text-sm">
              <strong>Retail Price:</strong> Ksh {product.product.retail_sales_price}
            </p>
            <p className="text-gray-600 mt-1 text-sm">
              <strong>Date Assigned:</strong> {new Date(product.date_assigned).toLocaleDateString()}
            </p>

            </div>
           
            <div>
              <div className="">
              <label
                htmlFor={`spoiled-${product.id}`}
                className="block text-gray-700 font-medium"
              >
                Add Spoiled items:
              </label>
              <div className="flex items-center space-x-2 mt-2">
                <input
                  type="number"
                  max={product.assigned_quantity}
                  min={0}
                  id={`spoiled-${product.id}`}
                  value={spoiledInput[product.id] || ""}
                  onChange={(e) =>
                    handleSpoiledInputChange(product.id, e.target.value)
                  }
                  className="border border-gray-300 rounded-md px-3 py-1 w-24"
                  placeholder="Qty"
                />
                <button
                  onClick={() => handleSpoiledSubmit(product.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                >
                  Submit
                </button>
              </div>
            </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Section */}
      {/* <EmployeeFooter /> */}
      <AdminsFooter/>
    </div>
  );
};

export default OtherProductsSale;
