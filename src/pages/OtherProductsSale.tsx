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

const OtherProductsSale = () => {
  const dispatch = useAppDispatch();
  const otherProducts = useAppSelector(selectAllAssignedOtherProducts);
  const myProfile = useAppSelector(selectMyProfile);

  useEffect(() => {
    dispatch(fetchMyProfile());
    dispatch(fetchAssignedOtherProducts());
  }, [dispatch]);

  console.log("Other Products:", otherProducts);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header Section */}
      <div className="bg-blue-600 text-white py-4 shadow-md flex justify-between items-center px-6">
        <div>
          <h1 className="text-3xl font-bold">{myProfile?.sales_team?.name}</h1>
          <p className="mt-1 text-sm">Make sales the easy way.</p>
        </div>
        <Link to="/myprofile" className="flex items-center space-y-2 flex-col">
          <img
            src={myProfile.profile_image || defaultProfile}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
          />
          <span className="text-white text-sm">
            {myProfile?.first_name} {myProfile?.last_name}
          </span>
        </Link>
      </div>

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
      <div className="bg-blue-600 text-white py-3 text-center shadow-inner">
        <Link className="hover:underline" to="/sales">
          Back to Sales
        </Link>
      </div>
    </div>
  );
};

export default OtherProductsSale;
