// @ts-nocheck
import React, { useEffect } from "react";
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

const OtherProductsSale = () => {
  const dispatch = useAppDispatch();
  const otherProducts = useAppSelector(selectAllAssignedOtherProducts);
  const myProfile = useAppSelector(selectMyProfile);

  useEffect(() => {
    dispatch(fetchMyProfile());
    dispatch(fetchAssignedOtherProducts());
  }, [dispatch]);

  console.log("Other Products:", otherProducts);

  const salesTeamName = myProfile?.sales_team?.name || "Sales Team";
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
            className="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition duration-300"
          >
            <h3 className="text-lg font-bold text-gray-800">{product.product.name}</h3>
            <p className="text-gray-600 mt-2">
              <strong>Assigned Quantity:</strong> {product.assigned_quantity}
            </p>
            <p className="text-gray-600 mt-1">
              <strong>Wholesale Price:</strong> Ksh {product.product.whole_sales_price}
            </p>
            <p className="text-gray-600 mt-1">
              <strong>Retail Price:</strong> Ksh {product.product.retail_sales_price}
            </p>
            <p className="text-gray-600 mt-1">
              <strong>Date Assigned:</strong> {new Date(product.date_assigned).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      {/* Footer Section */}
      <EmployeeFooter />
      {/* <div className="bg-blue-600 text-white py-3 text-center shadow-inner">
        <Link className="hover:underline" to="/sales">
          Back to Sales
        </Link>
      </div> */}
    </div>
  );
};

export default OtherProductsSale;
