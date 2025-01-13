// @ts-nocheck
/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import {
  fetchProducts,
  selectAllProducts,
} from "../features/product/productSlice"
import axios from "axios"
import Cookies from "cookies-js"
import {
  fetchAssignedProducts,
  selectAllAssignedProducts,
} from "../features/product/assignedProductsSlice"
import { selectIsAuthenticated } from "../features/auths/authSlice"
import { fetchSalesTeam, selectAllSalesTeam } from "../features/salesTeam/salesTeamSlice"
import getApiUrl from "../getApiUrl"

const WholeSaleRecord = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  // const apiUrl = "127.0.0.1:8000"
  const apiUrl = getApiUrl()
  const allProducts = useAppSelector(selectAllProducts)
  const allAssignedProducts = useAppSelector(selectAllAssignedProducts)
  const salesteam = useAppSelector(selectAllSalesTeam);
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])
  useEffect(() => {
    dispatch(fetchAssignedProducts())
  }, [dispatch])
  useEffect(() => {
    dispatch(fetchSalesTeam())
  }, [dispatch])

  const [selectedProductId, setSelectedProductId] = useState<number | undefined>();
  const [selectedProduct, setSelectedProduct] = useState()
  const [quantity, setQuantity] = useState(1)
  const [fullyPaid, setFullyPaid] = useState(true)
  const [saleType, setSaleType] = useState("COMPLETESALE")
  const [deposit, setDeposit] = useState(0)
  const [isExhanged, setIsExchanged] = useState(false)
  const [customerPhone, setCustomerPhone] = useState("")
  const [customerLocation, setCustomerLocation] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [debt, setDebt] = useState()
  const [repayDate, setRepayDate] = useState("")
  const [totalPaid, setTotalPaid] = useState()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleCustomerNameInput = (e: any) => setCustomerName(e.target.value)
  const handleCustomerPhoneInput = (e: any) => setCustomerPhone(e.target.value)
  const handleCustomerLocationInput = (e: any) => setCustomerLocation(e.target.value)
  const handleSelectedProduct = (e: any) => setSelectedProduct(e.target.value)
  const handleQuantity = (e: any) => setQuantity(e.target.value)
  const handleFullyPaid = (e: any) => setFullyPaid(e.target.value)
  const handleSaleType = (e: any) => setSaleType(e.target.value)
  const handleDeposit = (e: any) => setDeposit(e.target.value)
  const handleIsExchanged = (e: any) => setIsExchanged(e.target.value)
  const user = useAppSelector((state) => state.auth.user)
  const selected = allProducts.find((product) => product.id === selectedProduct)
  // @ts-ignore
  const userSalesTeam = salesteam.find((sales) => sales.employees.some((employee) => user?.id === employee.id)
);
const assignedCylindersForUserSalesTeam = allAssignedProducts.filter((assignedCylinder) => 
    assignedCylinder.sales_team.id === userSalesTeam?.id
  );


  


  const calculateDebt = () => {
    if (deposit <= 0){
      return 0
    } else{
      return calculateTotalAmount() - deposit
    }    
  }
  const calculateTotalAmount = () => {
    if (selectedProduct) {
      const priceProperty =
        saleType === "COMPLETESALE"
          ? "wholesale_selling_price"
          : "wholesale_refil_price"
      if (
        // @ts-ignore
        selected[priceProperty] !== undefined &&
        // @ts-ignore
        !isNaN(selected[priceProperty]) &&
        !isNaN(quantity)
      ) {
        // @ts-ignore
        return selected[priceProperty] * quantity
      }
    }
    return 0
  }

  
  useEffect(() => {
    const calculatedDebt = calculateTotalAmount() - deposit
    // @ts-ignore
    setDebt(calculatedDebt)
  }, [calculateTotalAmount, deposit])
  useEffect(() => {
    if (deposit === 0) {
      const calculatedTotal = calculateTotalAmount()
      // @ts-ignore
      setTotalPaid(calculatedTotal)
    } else {
      const calculatedTotal = deposit
      // @ts-ignore
      setTotalPaid(calculatedTotal)
    }
  }, [calculateTotalAmount, deposit])
  console.log("This cash in hand  ", totalPaid)
  useEffect(() => {
    const calculatedDebt = calculateDebt()
    // @ts-ignore
    setDebt(calculatedDebt) 
  }, [deposit, calculateTotalAmount])

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    setIsSubmitting(true)
    try {
      const formData = {
        customer: {
          name: customerName,
          location: {
            name: customerLocation,
          },
          phone: parseInt(customerPhone),
          sales: "WHOLESALE",
        },
        sales_type: saleType,
        // product: selectedProduct,
        product: selectedProductId,
        quantity: quantity,
        is_fully_paid: fullyPaid,
        partial_payment_amount: deposit,
        exchanged_with_local: isExhanged,
        debt_amount: debt,
        expected_date_to_repay: repayDate,
        total_amount: totalPaid,
      }
      console.log('data sent ', formData)
      const response = await axios.post(
        `${apiUrl}/recordsales/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
            "Content-Type": "application/json",
          },
        },
      )
      if (response.status === 201) {
        console.log("Form submitted successfully!")
      } else {
        console.error("Form submission failed.")
      }
    } catch (error) {
      console.error("Error occurred while submitting the form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }


  const renderDepositAndTotalDebt = () => {
    if (!fullyPaid) {
      return (
        <>
          <div className="flex flex-col my-2">
            <label>Deposit</label>
            <input
              type="number"
              className="px-2 border-solid outline-none border-gray-500 border-2"
              value={deposit}
              onChange={(e) => setDeposit(parseFloat(e.target.value))}
            />
            <label>Repay Date</label>
            <input
              type="date"
              value={repayDate}
              onChange={(e) => setRepayDate(e.target.value)}
              className="px-2 border-solid outline-none border-gray-500 border-2"
            />
          </div>
          <div className="flex gap-2">
            <h3>Total Debt:</h3>
            <h5>Ksh{calculateDebt()}</h5>
          </div>
        </>
      )
    }
    return null
  }

  const selectedCylinderId = assignedCylindersForUserSalesTeam.find(
    (assignedProduct) => assignedProduct.id === selectedProductId
  )?.cylinder.id;

  // setSelectedProduct(selectedCylinderId); 
  if (selectedCylinderId !== selectedProduct) {
    // @ts-ignore
    setSelectedProduct(selectedCylinderId || "");
  }

  

  return (
    <div className="min-h-screen flex flex-col">
      <div>
        <div className=" text-center font-semibold underline top-0">
          For Wholesale Records Only
        </div>
        <div>
          <form
            className=" flex flex-col justify-center px-4 bg-slate-300 py-5 mx-2 rounded-lg mt-3"
            onSubmit={handleSubmit}
          >
            <label>Customer Name</label>
            <input
              name={customerName}
              type="text"
              className="px-2 border-solid outline-none border-gray-500 border-2"
              onChange={handleCustomerNameInput}
            />
            <label>Customer Location</label>
            <input
              name={customerLocation}
              className=" px-2 border-solid outline-none border-gray-500 border-2"
              type="text"
              onChange={handleCustomerLocationInput}
            />
            <label>Customer Phone</label>
            <input
              onChange={handleCustomerPhoneInput}
              name={customerPhone}
              className="px-2 border-solid outline-none border-gray-500 border-2"
              type="number"
            />
            <div className="flex flex-col">
              <div className="flex flex-col ">
                <label>Choose Sale Type:</label>
                <div className="flex items-center gap-1">
                  <label>Complete Sale</label>
                  <input
                    type="radio"
                    id="completeSale"
                    name="saleType"
                    value="COMPLETESALE"
                    checked={saleType === "COMPLETESALE"}
                    onChange={() => setSaleType("COMPLETESALE")}
                  />
                </div>
                <div className="flex items-center gap-1">
                  <label>Refill Sale</label>
                  <input
                    type="radio"
                    id="REFILL"
                    name="saleType"
                    value="REFILL"
                    checked={saleType === "REFILL"}
                    onChange={() => setSaleType("REFILL")}
                  />
                </div>
              </div>
              <label>Product</label>
<select
  name="product"
  value={selectedProductId ? selectedProductId : ""}
  className="px-2 border-solid outline-none border-gray-500 border-2"
  onChange={(e) => setSelectedProductId(parseInt(e.target.value, 10))}

>
  <option value="">Select an assigned product</option>
  {assignedCylindersForUserSalesTeam.map((assignedProduct) => (
    <option key={assignedProduct.cylinder.id} value={assignedProduct.id}>
      {assignedProduct.cylinder.gas_type.name} {assignedProduct.cylinder.weight.weight}(Kg)
    </option>
  ))}
</select>
              <label>Quantity</label>
              <input
                type="number"
                className="px-2 border-solid outline-none border-gray-500 border-2"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
              />
              <div className="flex gap-2">
                <h3>Total Amount:</h3>
                <h5>Ksh{calculateTotalAmount()}</h5>
              </div>
              <div className=" flex gap-2">
                <label>Fully Paid?</label>
                <div className=" flex items-center gap-1">
                  <label>Yes</label>
                  <input
                    type="radio"
                    id="html"
                    name="fullyPaid"
                    value="Yes"
                    checked={fullyPaid}
                    onChange={() => setFullyPaid(true)}
                  />
                </div>
                <div className=" flex items-center gap-1">
                  <label>No</label>
                  <input
                    type="radio"
                    name="fullyPaid"
                    value="No"
                    checked={!fullyPaid}
                    onChange={() => setFullyPaid(false)}
                  />
                </div>
              </div>
              {renderDepositAndTotalDebt()}
            </div>
            <div className=" flex flex-col">
              <label>Exchanged with Local?</label>
              <div className=" flex items-center gap-1">
                <label>Yes</label>
                <input
                  type="radio"
                  id="exchangedYes"
                  name="exchangedWithLocal"
                  checked={isExhanged}
                  onChange={() => setIsExchanged(true)}
                />
              </div>
              <div className=" flex items-center gap-1">
                <label>No</label>
                <input
                  type="radio"
                  id="exchangedNo"
                  name="exchangedWithLocal"
                  checked={!isExhanged}
                  onChange={() => setIsExchanged(false)}
                />
              </div>
            </div>
            <button className=" bg-gray-500 text-white font-semibold border-r-4">
              Submit
            </button>
          </form>
        </div>
      </div>
      <div className="flex-grow"></div>
      <div className="bg-gray-800 text-white py-2 text-center sticky bottom-0">
        <Link to="/sales">Home</Link>
      </div>
    </div>
  )
}
export default WholeSaleRecord
