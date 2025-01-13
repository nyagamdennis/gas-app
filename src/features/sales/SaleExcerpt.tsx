/* eslint-disable prettier/prettier */
import React from "react"
// @ts-ignore
const SaleExcerpt = ({ sales }) => {
  const dateTime = new Date(sales.timestamp);

// Get the date components
const year = dateTime.getFullYear();
const month = dateTime.getMonth() + 1; // Month is zero-based, so add 1
const day = dateTime.getDate();

// Get the time components
const hours = dateTime.getHours();
const minutes = dateTime.getMinutes();
const seconds = dateTime.getSeconds();

// Format the date and time as desired
const formattedDateTime = `Date: ${day}-${month}-${year} Time: ${hours}:${minutes}:${seconds}`;

console.log(formattedDateTime);
  return (
    <div className=" bg-red-300 mb-2 mx-2 rounded-md p-2 text-white font-semibold">
      <h5>Product Sold: {sales.product.cylinder.gas_type.name}</h5>
      <h5>Weight: {sales.product.cylinder.weight.weight}Kg</h5>
      <h5>Quantity: {sales.quantity}</h5>
      <h5>Total amount: {sales.total_amount}</h5>
      <h5>{sales.sales_type}</h5>
      <h5>Who Recorded Sale: {sales.who_recorded_sale.user.username}</h5>
      <div className=" bg-gray-600">
        <h5>Customer Name: {sales.customer.name}</h5>
        <h5>Customer Phone Number: 0{sales.customer.phone}</h5>
        <h5>Customer Location: {sales.customer.location.name}</h5>
        <h5>Customer Type: {sales.customer.sales}</h5>
        <h6>Time Recorded: {formattedDateTime}</h6>
      </div>
    </div>
  )
}

export default SaleExcerpt
