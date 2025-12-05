// @ts-nocheck

import React, { useEffect, useState } from "react"
import Navbar from "../../../components/ui/mobile/employees/Navbar"
import { toast, ToastContainer } from "react-toastify"
import { useMediaQuery, useTheme } from "@mui/material"
import EmployeeFooter from "../../../components/ui/EmployeeFooter"
import FormattedAmount from "../../../components/FormattedAmount"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { selectMyProfile } from "../../../features/employees/myProfileSlice"
import { useNavigate } from "react-router-dom"
import { fetchAssignedOtherProducts, selectAllAssignedOtherProducts } from "../../../features/product/assignedOtherProductsSlice"
import { getSalesError } from "../../../features/sales/salesSlice"
import { recordOthersSales } from "../../../features/sales/othersSalesSlice"
import api from "../../../../utils/api"

const OtherProductsWholesale = () => {
    const theme = useTheme()
    const matches = useMediaQuery("(min-width:600px)")
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const myProfile = useAppSelector(selectMyProfile)

  const [searchResults, setSearchResults] = useState([])
  const [searchPhoneResults, setSearchPhoneResults] = useState([])
  const [searchingBy, setSearchingBy] = useState("") // "name" or "phone"
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const allOtherProducts = useAppSelector(selectAllAssignedOtherProducts)
  const operationError = useAppSelector(getSalesError)

  const [products, setProducts] = useState([{ productId: "", quantity: 1 }])
  const [saleType, setSaleType] = useState("REFILL")
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [customerLocation, setCustomerLocation] = useState("")
  const [paymentType, setPaymentType] = useState("FULLY_PAID") // 'FULLY_PAID' or 'DEBT'
  const [paymentAmount, setPaymentAmount] = useState("MAXIMUM") // 'MAXIMUM' or 'MINIMUM'
  const [deposit, setDeposit] = useState(0)
  const [repayDate, setRepayDate] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmittingOther, setIsSubmittingOther] = useState(false)
  const [selctedProductPrice, setSelectedProductPrice] = useState()
  const [fullyPaid, setFullyPaid] = useState()
  const [exchangedWithLocal, setExchangeWithLocal] = useState<boolean>(false)

  const [cylinderSale, setCylinderSale] = useState(true)
  const [otherProducts, setOtherProducts] = useState([
    { productId: "", quantity: 1 },
  ])
  const [otherCustomerName, setOtherCustomerName] = useState("")
  const [otherCustomerPhone, setOtherCustomerPhone] = useState("")
  const [otherCustomerLocation, setOtherCustomerLocation] = useState("")
  const [otherPaymentType, setOtherPaymentType] = useState("FULLY_PAID") // 'FULLY_PAID' or 'DEBT'
  const [otherDeposit, setOtherDeposit] = useState(0)
  const [otherRepayDate, setOtherRepayDate] = useState("")

  const [customPrice, setCustomPrice] = useState("")
  const [paymentMode, setPaymentMode] = useState("cash")
  const [mpesaName, setMpesaName] = useState("")
  const [mpesaPhone, setMpesaPhone] = useState("")

  const [cashAmount, setCashAmount] = useState<number>(0)
  const [cashAmountDeposit, setCashAmountDeposit] = useState<number>(0)
  const [numMpesaDeposits, setNumMpesaDeposits] = useState(1)
  const [mpesaPayments, setMpesaPayments] = useState([{ code: "", amount: "" }])
  const [mpesaCodes, setMpesaCodes] = useState([{ code: "", amount: 0 }])

  useEffect(() => {
    dispatch(fetchAssignedOtherProducts())
  }, [dispatch])

  const handleNumDepositsChange = (e) => {
    const count = Math.max(1, parseInt(e.target.value, 10) || 1)
    setNumMpesaDeposits(count)

    // Adjust Mpesa Codes List
    setMpesaCodes((prevCodes) => {
      const newCodes = [...prevCodes]

      // Expand array if needed
      while (newCodes.length < count) {
        newCodes.push({ code: "", amount: 0 })
      }

      // Trim array if needed
      return newCodes.slice(0, count)
    })
  }

  const handleMpesaCodeChange = (index, field, value) => {
    setMpesaCodes((prevCodes) => {
      const newCodes = [...prevCodes]
      newCodes[index][field] = value
      return newCodes
    })
  }

  const handleProductChange = (index, field, value) => {
    setProducts((prevProducts) =>
      prevProducts.map((product, i) =>
        i === index ? { ...product, [field]: value } : product,
      ),
    )
  }

  const handleAddProduct = () => {
    setProducts([...products, { productId: "", quantity: 1 }])
  }

  const handleRemoveProduct = (index) => {
    setProducts(products.filter((_, idx) => idx !== index))
  }


  // -------------------other products sales-------------------

  const handleOtherProductChange = (index, field, value) => {
    setOtherProducts((prev) => {
      const updated = [...prev]
      updated[index][field] =
        field === "quantity" ? parseInt(value) || "" : value
      return updated
    })
  }

  const handleAddOtherProduct = () => {
    setOtherProducts([...otherProducts, { productId: "", quantity: 1 }])
  }

  const handleRemoveOtherProduct = (index) => {
    setOtherProducts(otherProducts.filter((_, idx) => idx !== index))
  }

  const calculateOtherTotal = () => {
    return otherProducts.reduce((total, product) => {
      const assignedProduct = allOtherProducts.find(
        (prod) => prod.id === Number(product.productId),
      )
      console.log("assgined others prices ", assignedProduct)

      if (assignedProduct) {
        const price = assignedProduct?.product?.whole_sales_price

        return total + price * product.quantity
      }

      return <FormattedAmount amount={total} />
    }, 0)
  }

  const calculateOtherDebt = () => {
    const total = calculateOtherTotal()
    return Math.max(total - otherDeposit, 0)
  }

  const handleSubmitOtherProduct = async (e) => {
    e.preventDefault()
    setIsSubmittingOther(true)
    const isFullyPaid = otherPaymentType === "FULLY_PAID"
    const formData = {
      customer: {
        name: otherCustomerName,
        location: { name: otherCustomerLocation },
        phone: parseInt(otherCustomerPhone),
        sales: "WHOLESALE",
      },

      products: otherProducts.map((product) => ({
        id: product.productId,
        quantity: product.quantity,
      })),
      total_amount: calculateOtherTotal(),
      partial_payment_amount:
        otherPaymentType === "FULLY_PAID"
          ? calculateOtherTotal()
          : otherDeposit,
      debt_amount: otherPaymentType === "DEBT" ? calculateOtherDebt() : 0,
      repayment_date: otherPaymentType === "DEBT" ? otherRepayDate : null,
      is_fully_paid: isFullyPaid,
    }
    try {
      await dispatch(recordOthersSales(formData)).unwrap()
      // Add your API call logic here
      toast.success("Sales recorded successfully!")

      setTimeout(() => {
        navigate("/sales")
      }, 3000)
    } catch (error: any) {
      if (error && error.error) {
        toast.error(error.error) // Display specific error from the backend
      } else {
        toast.error("An error occurred while submitting the sales record.")
      }
    } finally {
      setIsSubmittingOther(false)
    }
  }

  // -------------------end other products sales-------------------

  // Function to search customers as user types
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchingBy === "name" && customerName.length > 0) {
      
        api
          .post("/search-customer/", {
            type: "name",
            query: customerName,
          })
          .then((response) => {
            setSearchResults(response.data)
          })
          .catch((error) => {
            console.error("Search error:", error)
          })
      } else {
        setSearchResults([])
      }
    }, 300) // <-- Wait 300ms after user stops typing

    return () => clearTimeout(delayDebounceFn)
  }, [customerName, searchingBy])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchingBy === "phone" && customerPhone.length > 0) {
   
        api
          .post("/search-customer/", {
            type: "phone",
            query: customerPhone,
          })
          .then((response) => {
            setSearchPhoneResults(response.data)
          })
          .catch((error) => {
            console.error("Search error:", error)
          })
      }
    }, 300)
    return () => clearTimeout(delayDebounceFn)
  }, [customerPhone, searchingBy])

  return (
    <div>
      <ToastContainer />
      {isMobile ? (
        <div className="min-h-screen bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-gray-800 flex flex-col font-sans">
          <Navbar
            headerMessage={"ERP"}
            headerText={"Manage your operations with style and clarity"}
          />
          <main className="flex-grow  p-1 bg-gray-300">
            <div>
              <h4 className="flex justify-center underline font-bold">
              Other Products  Wholesale Sales Record
              </h4>
              <form
            onSubmit={handleSubmitOtherProduct}
            className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg"
          >
            

            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              Customer Details
            </h2>

            <div className="mb-4">
              <label className="block text-gray-600">Customer Name</label>
              <input
                type="text"
                value={otherCustomerName}
                onChange={(e) => {
                  setSearchingBy("name")
                  setOtherCustomerName(e.target.value)}}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                // required
                
              />
              {searchResults.length > 0 && (
                <ul className="absolute bg-white border w-full mt-1 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                  {searchResults.map((customer) => (
                    <li
                      key={customer.id}
                      onClick={() => {
                        setCustomerName(customer.name)
                        setCustomerPhone(customer.phone)
                        setCustomerLocation(customer.location)
                        setSearchResults([])
                      }}
                      className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                    >
                      {customer.name} - {customer.phone}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-600">Customer Location</label>
              <input
                type="text"
                value={otherCustomerLocation}
                onChange={(e) => setOtherCustomerLocation(e.target.value)}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                // required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600">Customer Phone</label>
              <input
                type="tel"
                value={otherCustomerPhone}
                onChange={(e) => {
                  setSearchingBy("phone")
                  setOtherCustomerPhone(e.target.value)}}
                
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                // required
              />
              {searchPhoneResults.length > 0 && (
              <ul className="absolute bg-white border w-full mt-1 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                {searchPhoneResults.map((customer) => (
                  <li
                    key={customer.id}
                    onClick={() => {
                      setCustomerName(customer.name)
                      setCustomerPhone(customer.phone)
                      setCustomerLocation(customer.location)
                      setSearchPhoneResults([])
                    }}
                    className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                  >
                    {customer.name} - {customer.phone}
                  </li>
                ))}
              </ul>
            )}
            </div>
            {otherProducts.map((product, index) => {
              const selectedProduct = allOtherProducts.find(
                (prod) => prod.id === Number(product.productId),
              )

              return (
                <div key={index} className="mb-4 border-b pb-4">
                  <div className="mb-2 mt-3">
                    <label className="block text-gray-600">Product</label>
                    <select
                      value={product.productId}
                      onChange={(e) =>
                        handleOtherProductChange(
                          index,
                          "productId",
                          e.target.value,
                        )
                      }
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                      required
                    >
                      <option value="">Select a product</option>
                      {allOtherProducts.map((assignedProduct) => (
                        <option
                          key={assignedProduct.id}
                          value={assignedProduct.id}
                        >
                          {assignedProduct?.product?.name}
                        </option>
                      ))}
                    </select>
                    {selectedProduct && (
                      <p className="mt-2 text-sm text-gray-600">
                        Price:{" "}
                        <FormattedAmount
                          amount={selectedProduct?.product?.whole_sales_price}
                        />
                      </p>
                    )}
                  </div>

                  <div className="mb-2">
                    <label className="block text-gray-600">Quantity</label>
                    <input
                      type="number"
                      value={product.quantity}
                      onChange={(e) =>
                        handleOtherProductChange(
                          index,
                          "quantity",
                          e.target.value,
                        )
                      }
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                      min={1}
                      required
                    />
                  </div>

                  {otherProducts.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOtherProduct(index)}
                      className="text-red-500 underline text-sm mt-2"
                    >
                      Remove
                    </button>
                  )}
                </div>
              )
            })}
            <button
              type="button"
              onClick={handleAddOtherProduct}
              className="text-blue-500 underline text-sm mb-4"
            >
              Add Another Product
            </button>
            <h2 className="text-lg font-semibold mt-4 text-gray-700">
              Payment Details
            </h2>

            <div className="mb-4">
              <label className="block text-gray-600">Payment Type</label>
              <div className="flex items-center gap-4 mt-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="otherPaymentType"
                    value="FULLY_PAID"
                    checked={otherPaymentType === "FULLY_PAID"}
                    onChange={() => setOtherPaymentType("FULLY_PAID")}
                  />
                  Fully Paid
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="otherPaymentType"
                    value="DEBT"
                    checked={otherPaymentType === "DEBT"}
                    onChange={() => setOtherPaymentType("DEBT")}
                  />
                  Debt
                </label>
              </div>
            </div>

            {otherPaymentType === "DEBT" && (
              <div className="mb-4">
                <label className="block text-gray-600">Deposit Amount</label>
                <input
                  type="number"
                  value={otherDeposit}
                  onChange={(e) => setOtherDeposit(parseFloat(e.target.value))}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                  min={0}
                />
                <label className="block text-gray-600 mt-2">
                  Repayment Date
                </label>
                <input
                  type="date"
                  value={otherRepayDate}
                  onChange={(e) => setOtherRepayDate(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                />
                <p className="text-red-500 text-sm mt-2">
                  Debt Balance: Ksh {calculateOtherDebt()}
                </p>
              </div>
            )}

            <h3 className="text-lg font-bold mt-4">
              Total Amount: <FormattedAmount amount={calculateOtherTotal()} />
            </h3>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition mt-4"
              disabled={isSubmittingOther}
            >
              {isSubmittingOther ? "submitting..." : "Submit Product Sale"}
            </button>
          </form>
            </div>
          </main>

          <footer className=" text-white">
            <EmployeeFooter />
          </footer>
        </div>
      ) : (
        <div className="p-4">
          <p>Desktop view coming soon</p>
        </div>
      )}
    </div>
  )
}

export default OtherProductsWholesale
