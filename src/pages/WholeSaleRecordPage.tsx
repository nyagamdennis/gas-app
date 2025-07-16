// @ts-nocheck
import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import {
  fetchAssignedProducts,
  selectAllAssignedProducts,
} from "../features/product/assignedProductsSlice"
import { getSalesError, recordSales } from "../features/sales/salesSlice"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import FormattedAmount from "../components/FormattedAmount"
import {
  fetchAssignedOtherProducts,
  selectAllAssignedOtherProducts,
} from "../features/product/assignedOtherProductsSlice"
import { recordOthersSales } from "../features/sales/othersSalesSlice"
import { fetchMyProfile, selectMyProfile } from '../features/employees/myProfileSlice';


import api from "../../utils/api"
import SalesHeader from "../components/SalesHeader"
import EmployeeFooter from "../components/ui/EmployeeFooter"

const WholeSaleRecordPage = () => {
      const myProfile = useAppSelector(selectMyProfile);


  const [searchResults, setSearchResults] = useState([])
  const [searchPhoneResults, setSearchPhoneResults] = useState([])
  const [searchingBy, setSearchingBy] = useState("") // "name" or "phone"
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const allAssignedProducts = useAppSelector(selectAllAssignedProducts)
  const allOtherProducts = useAppSelector(selectAllAssignedOtherProducts)
  const operationError = useAppSelector(getSalesError)

  const [products, setProducts] = useState([{ productId: "", quantity: 1 }])
  const [cylinderExchaged, setCylinderExchanged] = useState("")
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
    dispatch(fetchAssignedProducts())
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

  const calculateTotal = () => {
    return products.reduce((total, product) => {
      const assignedProduct = allAssignedProducts.find(
        (prod) => prod.id === Number(product.productId),
      )

      if (assignedProduct) {
        let price

        if (product.paymentAmount === "CUSTOM" && product.customPrice) {
          price = parseFloat(product.customPrice) // ✅ Use product's custom price
        } else {
          price =
            saleType === "COMPLETESALE"
              ? product.paymentAmount === "MAXIMUM"
                ? assignedProduct.max_wholesale_selling_price
                : product.paymentAmount === "MEDIUM"
                ? assignedProduct.mid_wholesale_selling_price
                : assignedProduct.min_wholesale_selling_price
              : product.paymentAmount === "MAXIMUM"
              ? assignedProduct.max_wholesale_refil_price
              : product.paymentAmount === "MEDIUM"
              ? assignedProduct.mid_wholesale_refil_price
              : assignedProduct.min_wholesale_refil_price
        }

        return total + price * product.quantity // ✅ Correct multiplication
      }

      return total
    }, 0)
  }

  console.log("cylinder exchanged with ", cylinderExchaged)
  const calculateDebt = () => {
    const total = calculateTotal()
    return Math.max(total - deposit, 0)
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setIsSubmitting(true)

    const isFullyPaid = paymentType === "FULLY_PAID"

    const formData = {
      customer: {
        name: customerName,
        location: { name: customerLocation },
        phone: parseInt(customerPhone),
        sales: "WHOLESALE",
      },
      sales_type: saleType,
      products: products.map((product) => {
        const assignedProduct = allAssignedProducts.find(
          (prod) => prod.id === Number(product.productId),
        )

        let unitPrice = 0

        if (product.paymentAmount === "CUSTOM" && product.customPrice) {
          unitPrice = parseFloat(product.customPrice)
        } else {
          unitPrice =
            saleType === "COMPLETESALE"
              ? product.paymentAmount === "MAXIMUM"
                ? assignedProduct.max_wholesale_selling_price
                : product.paymentAmount === "MEDIUM"
                ? assignedProduct.mid_wholesale_selling_price
                : assignedProduct.min_wholesale_selling_price
              : product.paymentAmount === "MAXIMUM"
              ? assignedProduct.max_wholesale_refil_price
              : product.paymentAmount === "MEDIUM"
              ? assignedProduct.mid_wholesale_refil_price
              : assignedProduct.min_wholesale_refil_price
        }

        const productPayload: any = {
          id: product.productId,
          quantity: product.quantity,
          amount_sold_for: unitPrice,
        }

        if (paymentMode === "mpesa" || paymentMode === "mpesa_cash") {
          productPayload.amount_sold_for_mpesa = unitPrice
        }

        return productPayload
      }),

      total_amount: calculateTotal(),
      partial_payment_amount:
        paymentType === "FULLY_PAID" ? calculateTotal() : deposit,
      debt_amount: paymentType === "DEBT" ? calculateDebt() : 0,
      repayment_date: paymentType === "DEBT" ? repayDate : null,
      is_fully_paid: isFullyPaid,
      exchanged_with_local: exchangedWithLocal,
      cylinder_exchanged_with: cylinderExchaged,
      mpesa_code: mpesaCodes,
    }

    if (paymentMode === "cash") {
      formData.cashAmount = Number(calculateTotal()) // Set full total to cash
    } else if (paymentMode === "mpesa") {
      formData.mpesaAmount = Number(calculateTotal())
    } else if (paymentMode === "mpesa_cash") {
      formData.cashAmount = Number(cashAmount)
      formData.mpesaAmount = Number(calculateTotal()) - Number(cashAmount)
    }

    try {
      await dispatch(recordSales(formData)).unwrap()
      // Add your API call logic here
      toast.success("Sales recorded successfully!")

      setTimeout(() => {
        navigate("/sales")
      }, 2000)
    } catch (error: any) {
      console.error("Error during submission:", error)
      if (error && error.error) {
        toast.error(error.error) // Display specific error from the backend
      } else {
        toast.error("An error occurred while submitting the sales record.")
      }
      // toast.error("An error occurred while submitting the sales record.");
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleExchangeWithLocalTrue = () => {
    setExchangeWithLocal(true)
  }

  const handleExchangeWithLocalFalse = () => {
    setExchangeWithLocal(false)
  }
  useEffect(() => {
    if (paymentMode === "cash") {
      setCashAmount(calculateTotal()) // Set total when "cash" mode is selected
    } else if (paymentMode === "mpesa") {
      setCashAmount("") // Reset cashAmount when only Mpesa is selected
    }
  }, [paymentMode]) // Re-run when paymentMode changes

  // -------------------other products sales-------------------
  const handleSalesChange = (type) => {
    setCylinderSale(type === "CYLINDER")
  }

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
      console.log('assgined others prices ', assignedProduct)

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
        // axios
        //   .post(`${apiUrl}/search-customer/`, {
        //     type: "name",
        //     query: customerName,
        //   })
        api.post("/search-customer/", {
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
        // axios
        //   .post(`${apiUrl}/search-customer/`, {
        //     type: "phone",
        //     query: customerPhone,
        //   })
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
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
     {/*  <div className="bg-blue-600 text-white py-4 text-center font-bold text-xl">
        Wholesale Records
      </div>
      <ToastContainer /> */}
      <SalesHeader
       teamName={myProfile?.sales_team?.name}
        profileImage={myProfile?.profile_image}
        firstName={myProfile?.first_name}
        lastName={myProfile?.last_name}
        description="Wholesales Cylinders Request"
      />

      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={() => handleSalesChange("CYLINDER")}
          className={`px-4 py-2 rounded-md ${
            cylinderSale ? "bg-green-600 text-white" : "bg-gray-300"
          }`}
        >
          Cylinder Sales
        </button>
        <button
          onClick={() => handleSalesChange("PRODUCT")}
          className={`px-4 py-2 rounded-md ${
            !cylinderSale ? "bg-green-600 text-white" : "bg-gray-300"
          }`}
        >
          Other Products
        </button>
      </div>

      {/* Form */}
      <div className="flex justify-center mt-6 px-4">
        {cylinderSale ? (
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              Customer Details
            </h2>

            <div className="mb-4">
              <label className="block text-gray-600">Customer Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => {
                  setSearchingBy("name")
                  setCustomerName(e.target.value)
                }}
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
                value={customerLocation}
                onChange={(e) => setCustomerLocation(e.target.value)}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                // required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600">Customer Phone</label>
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => {
                  setSearchingBy("phone")
                  setCustomerPhone(e.target.value)
                }}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                // required
              />
            </div>

            {/* Autocomplete dropdown */}
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
            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              Sale Details
            </h2>

            <div className="mb-4">
              <label className="block text-gray-600">Sale Type</label>
              <select
                value={saleType}
                onChange={(e) => setSaleType(e.target.value)}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                required
              >
                <option value="REFILL">Refill</option>
                <option value="COMPLETESALE">Complete Sale</option>
              </select>
            </div>
            {products.map((product, index) => {
              // Get selected product details
              const selectedProduct = allAssignedProducts.find(
                (prod) => prod.id === Number(product.productId),
              )

              // Available products: Exclude selected ones, but keep the current row's selection
              const availableProducts = allAssignedProducts.filter(
                (prod) =>
                  prod.id === Number(product.productId) || // Keep the selected product in its own dropdown
                  !products.some(
                    (p, i) => i !== index && p.productId === prod.id.toString(), // Exclude from other rows
                  ),
              )

              return (
                <div
                  key={index}
                  className="mb-4 border-b-4 border-green-900 pb-4"
                >
                  <div className="mb-2">
                    <label className="block text-gray-600">Product</label>

                    <select
                      value={product.productId}
                      onChange={(e) =>
                        handleProductChange(index, "productId", e.target.value)
                      }
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                      required
                    >
                      <option value="">Select a product</option>
                      {availableProducts.map((assignedProduct) => (
                        <option
                          key={assignedProduct.id}
                          value={assignedProduct.id}
                        >
                          {assignedProduct.gas_type} {assignedProduct.weight}kg
                        </option>
                      ))}
                    </select>

                    {selectedProduct && (
                      <div className="flex items-center  space-x-3 flex-wrap mt-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`paymentAmount-${index}`}
                            value="MINIMUM"
                            checked={product.paymentAmount === "MINIMUM"}
                            onChange={() =>
                              handleProductChange(
                                index,
                                "paymentAmount",
                                "MINIMUM",
                              )
                            }
                          />
                          <p>
                            {saleType === "COMPLETESALE" ? (
                              <FormattedAmount
                                amount={
                                  selectedProduct.min_wholesale_selling_price
                                }
                              />
                            ) : (
                              <FormattedAmount
                                amount={
                                  selectedProduct.min_wholesale_refil_price
                                }
                              />
                            )}
                          </p>
                        </label>

                        {/* <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`paymentAmount-${index}`}
                            value="MEDIUM"
                            checked={product.paymentAmount === "MEDIUM"}
                            onChange={() =>
                              handleProductChange(
                                index,
                                "paymentAmount",
                                "MEDIUM",
                              )
                            }
                          />
                          <p>
                            {saleType === "COMPLETESALE" ? (
                              <FormattedAmount
                                amount={
                                  selectedProduct.mid_wholesale_selling_price
                                }
                              />
                            ) : (
                              <FormattedAmount
                                amount={
                                  selectedProduct.mid_wholesale_refil_price
                                }
                              />
                            )}
                          </p>
                        </label> */}

                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`paymentAmount-${index}`}
                            value="MAXIMUM"
                            // checked={paymentAmount === "MAXIMUM"}
                            // onChange={() => setPaymentAmount("MAXIMUM")}
                            checked={product.paymentAmount === "MAXIMUM"}
                            onChange={() =>
                              handleProductChange(
                                index,
                                "paymentAmount",
                                "MAXIMUM",
                              )
                            }
                          />
                          <p>
                            {saleType === "COMPLETESALE" ? (
                              <FormattedAmount
                                amount={
                                  selectedProduct.max_wholesale_selling_price
                                }
                              />
                            ) : (
                              <FormattedAmount
                                amount={
                                  selectedProduct.max_wholesale_refil_price
                                }
                              />
                            )}
                          </p>
                        </label>

                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`paymentAmount-${index}`}
                            value="CUSTOM"
                            checked={product.paymentAmount === "CUSTOM"}
                            onChange={() =>
                              handleProductChange(
                                index,
                                "paymentAmount",
                                "CUSTOM",
                              )
                            }
                          />
                          <p>Custom Amount</p>
                        </label>
                      </div>
                    )}
                  </div>

                  {product.paymentAmount === "CUSTOM" && (
                    <input
                      type="number"
                      value={product.customPrice || ""}
                      onChange={(e) =>
                        handleProductChange(
                          index,
                          "customPrice",
                          e.target.value,
                        )
                      }
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                      placeholder="Enter custom amount"
                      min="0"
                      required
                    />
                  )}

                  <div className="mb-2">
                    <label className="block text-gray-600">Quantity</label>
                    <input
                      type="number"
                      value={product.quantity}
                      onChange={(e) =>
                        handleProductChange(index, "quantity", e.target.value)
                      }
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                      min={1}
                      required
                    />
                    {selectedProduct &&
                      product.quantity > selectedProduct.filled && (
                        <p className="text-red-500 text-sm mt-1">
                          Maximum quantity available: {selectedProduct.filled}
                        </p>
                      )}
                  </div>

                  {products.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveProduct(index)}
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
              onClick={handleAddProduct}
              className="text-blue-500 underline text-sm"
            >
              Add Another Product
            </button>

            <div className="mb-4">
              <label className="block text-gray-600">Exchange with another cylinder?</label>
              <div className="flex items-center gap-4 mt-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="exchangeWithLocal"
                    value="false"
                    checked={!exchangedWithLocal}
                    onChange={() => handleExchangeWithLocalFalse(false)}
                  />
                  No
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="exchangeWithLocal"
                    value="true"
                    checked={exchangedWithLocal}
                    onChange={() => handleExchangeWithLocalTrue(true)}
                  />
                  Yes
                </label>
              </div>
              {exchangedWithLocal && (
                <div className="mt-4">
                  <label className="block text-gray-600">
                    Select Product Exchange with
                  </label>
                  <select
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                    onChange={(e) => setCylinderExchanged(e.target.value)}
                    value={cylinderExchaged}
                  >
                    <option value="">Select a product</option>
                    {allAssignedProducts.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.gas_type} {product.weight}kg
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <h2 className="text-lg font-semibold mt-4 text-gray-700">
              Payment Details
            </h2>

            <div className="mb-4">
              <label className="block text-gray-600">Payment Type</label>
              <div className="flex items-center gap-4 mt-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="paymentType"
                    value="FULLY_PAID"
                    checked={paymentType === "FULLY_PAID"}
                    onChange={() => setPaymentType("FULLY_PAID")}
                  />
                  Fully Paid
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="paymentType"
                    value="DEBT"
                    checked={paymentType === "DEBT"}
                    onChange={() => setPaymentType("DEBT")}
                  />
                  Debt
                </label>
              </div>
            </div>

            {paymentType === "DEBT" && (
              <div className="mb-4">
                <label className="block text-gray-600">Deposit Amount</label>
                <input
                  type="number"
                  value={deposit}
                  onChange={(e) => setDeposit(parseFloat(e.target.value))}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                  min={0}
                />
                <label className="block text-gray-600 mt-2">
                  Repayment Date
                </label>
                <input
                  type="date"
                  value={repayDate}
                  onChange={(e) => setRepayDate(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                />
                <p className="text-red-500 text-sm mt-2">
                  Debt Balance: Ksh {calculateDebt()}
                </p>
              </div>
            )}
            {/* ------------------------------------------------------------ */}
            <div className=" border border-green-700 p-2">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Payment Mode
              </h2>

              <div className="mb-4 flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="paymentMode"
                    value="cash"
                    checked={paymentMode === "cash"}
                    onChange={() => setPaymentMode("cash")}
                  />
                  Cash
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="paymentMode"
                    value="mpesa"
                    checked={paymentMode === "mpesa"}
                    onChange={() => setPaymentMode("mpesa")}
                  />
                  Mpesa
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="paymentMode"
                    value="mpesa_cash"
                    checked={paymentMode === "mpesa_cash"}
                    onChange={() => setPaymentMode("mpesa_cash")}
                  />
                  Mpesa + Cash
                </label>
              </div>

              {paymentMode === "cash" && (
                <div className="mb-4">
                  <label className="block text-gray-600">
                    Cash Amount (Ksh)
                  </label>
                  <input
                    type="number"
                    value={cashAmount || Number(calculateTotal())} // Only set initial value
                    onChange={(e) => setCashAmount(e.target.value)} // Allow manual updates
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                    required
                  />
                </div>
              )}

              {/* cash + mpesa payment */}
              {(paymentMode === "mpesa" || paymentMode === "mpesa_cash") && (
                <>
                  <div className="mb-4">
                    <label className="block text-gray-600">Mpesa Name</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-600">
                      Mpesa Phone Number
                    </label>
                    <input
                      type="text"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-600">
                      Number of Mpesa Deposits
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={numMpesaDeposits}
                      onChange={handleNumDepositsChange}
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                      required
                    />
                  </div>

                  {mpesaCodes.map((code, index) => (
                    <div key={index} className="mb-4">
                      <label className="block text-gray-600">
                        Mpesa Code {index + 1}
                      </label>
                      <input
                        type="text"
                        value={code.code}
                        onChange={(e) =>
                          handleMpesaCodeChange(index, "code", e.target.value)
                        }
                        className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                        required
                      />
                      {/* Show Amount Input Only if Deposits > 1 */}
                      {numMpesaDeposits > 1 && (
                        <div className="mt-2">
                          <label className="block text-gray-600">
                            Amount for Code {index + 1}
                          </label>
                          <input
                            type="number"
                            value={code.amount}
                            onChange={(e) =>
                              handleMpesaCodeChange(
                                index,
                                "amount",
                                e.target.value,
                              )
                            }
                            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                            min="0"
                            required
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </>
              )}

              {paymentMode === "mpesa_cash" && (
                <div className="mb-4">
                  <label className="block text-gray-600">
                    Cash Deposit (Ksh)
                  </label>
                  <input
                    type="number"
                    value={cashAmount}
                    onChange={(e) => setCashAmount(e.target.value)}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                    required
                  />
                </div>
              )}
            </div>
            {/* ----------------------------------- */}

            <h3 className="text-lg font-bold mt-4">
              Total Amount: <FormattedAmount amount={calculateTotal()} />
            </h3>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition mt-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        ) : (
          <form
            onSubmit={handleSubmitOtherProduct}
            className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              Other Products Sales Form
            </h2>

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
                          {assignedProduct.product.name}
                        </option>
                      ))}
                    </select>
                    {selectedProduct && (
                      <p className="mt-2 text-sm text-gray-600">
                        Price:{" "}
                        <FormattedAmount
                          amount={selectedProduct.product.whole_sales_price}
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
        )}
      </div>

     {/*  <Link
        to="/sales"
        className="text-blue-300 bg-gray-800 font-bold text-xl py-4 text-center mt-auto"
      >
        Back to Home
      </Link> */}
      <EmployeeFooter/>
    </div>
  )
}

export default WholeSaleRecordPage
