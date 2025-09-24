// @ts-nocheck
import React, { useEffect, useState } from "react"
import AdminsFooter from "../components/AdminsFooter"
import FormattedAmount from "../components/FormattedAmount"
import { Link, useParams } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import {
  fetchMyProfile,
  selectMyProfile,
} from "../features/employees/myProfileSlice"
import {
  fetchSingleSalesTeamData,
  selectSingleSalesTeamData,
} from "../features/salesTeam/singleSalesTeamDataSlice"
import defaultProfile from "../components/media/default.png"
import {
  fetchAssignedProducts,
  selectAllAssignedProducts,
} from "../features/product/assignedProductsSlice"
import EmployeeFooter from "../components/ui/EmployeeFooter"
import SalesHeader from "../components/SalesHeader"
import { editSalesRecord } from "../features/sales/salesSlice"

const SalesRecordEdit = () => {
  const myProfile = useAppSelector(selectMyProfile)
  const sale = useAppSelector(selectSingleSalesTeamData)
  const allAssignedProducts = useAppSelector(selectAllAssignedProducts)
  const dispatch = useAppDispatch()
  const { id } = useParams<{ id: string }>()

  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [customerLocation, setCustomerLocation] = useState("")
  const [selectedProductId, setSelectedProductId] = useState("")
  const [salesType, setSalesType] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [isExchanged, setIsExchanged] = useState(false)
  const [totalAmount, setTotalAmount] = useState(0)
  // const [products, setProducts] = useState([{ productId: "", quantity: 1 }])
  const [products, setProducts] = useState([
    { productId: "", quantity: 1, paymentAmount: "MINIMUM", customPrice: "" },
  ])
  const [exchangedWithLocal, setExchangeWithLocal] = useState<boolean>(false)
  const [paymentType, setPaymentType] = useState("FULLY_PAID") // 'FULLY_PAID' or 'DEBT'
  const [paymentMode, setPaymentMode] = useState("cash")
  const [mpesaName, setMpesaName] = useState("")
  const [mpesaPhone, setMpesaPhone] = useState("")
  // const [mpesaCodes, setMpesaCodes] = useState([""])
  const [cashAmount, setCashAmount] = useState<number>(0)
  const [cashAmountDeposit, setCashAmountDeposit] = useState<number>(0)
  const [numMpesaDeposits, setNumMpesaDeposits] = useState(1)
  const [mpesaPayments, setMpesaPayments] = useState([{ code: "", amount: "" }])
  const [mpesaCodes, setMpesaCodes] = useState([{ code: "", amount: 0 }])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cylinderExchaged, setCylinderExchanged] = useState("")
  const [deposit, setDeposit] = useState(0)
  const [otherDeposit, setOtherDeposit] = useState(0)
  const [repayDate, setRepayDate] = useState("")
  const [otherRepayDate, setOtherRepayDate] = useState("")

  console.log("sales data:", sale)
  useEffect(() => {
    dispatch(fetchMyProfile())
    dispatch(fetchAssignedProducts())
    if (id) dispatch(fetchSingleSalesTeamData({ id }))
  }, [dispatch, id])

  useEffect(() => {
    if (sale?.customer) {
      setCustomerName(sale.customer.name)
      setCustomerPhone(sale.customer.phone)
      setCustomerLocation(sale.customer.location?.name)
      setSelectedProductId(sale.product?.id || "")
      setSalesType(sale.sales_type || "retail")
      setQuantity(sale.quantity || 1)
      setIsExchanged(!!sale.exchanged_with_local)
      setTotalAmount(sale.total_amount || 0)
    }
  }, [sale])

  const handleSaveChanges = async () => {
    const formData = {
      id,
      customer: {
        name: customerName,
        phone: customerPhone,
        location: customerLocation,
      },
      product_id: selectedProductId,
      sales_type: salesType,
      quantity,
      exchanged_with_local: isExchanged,
      total_amount: totalAmount,
    }
    console.log("Saving updated sale:", formData)
    // Send to API or Redux action
    try {
      setIsSubmitting(true)
      await dispatch(editSalesRecord({id,formData})).unwrap()
      alert("Sales record updated successfully!")
    } catch (error) {
      console.error("Failed to update sales record:", error)
      alert("Error updating sales record. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const calculateTotal = () => {
    return products.reduce((total, product) => {
      const assignedProduct = allAssignedProducts.find(
        (prod) => prod.id === Number(product.productId),
      )

      if (assignedProduct) {
        let price
        price = totalAmount

        // if (product.paymentAmount === "CUSTOM" && product.customPrice) {
        //   price = parseFloat(product.customPrice) // ✅ Use product's custom price
        // } else {
        //   price =
        //     saleType === "COMPLETESALE"
        //       ? product.paymentAmount === "MAXIMUM"
        //         ? assignedProduct.max_retail_selling_price
        //         : product.paymentAmount === "MEDIUM"
        //         ? assignedProduct.mid_retail_selling_price
        //         : assignedProduct.min_retail_selling_price
        //       : product.paymentAmount === "MAXIMUM"
        //       ? assignedProduct.max_retail_refil_price
        //       : product.paymentAmount === "MEDIUM"
        //       ? assignedProduct.mid_retail_refil_price
        //       : assignedProduct.min_retail_refil_price
        // }
        return total + price * quantity // ✅ Correct multiplication
      }
      return total
    }, 0)
  }

  const handleExchangeWithLocalTrue = () => {
    setExchangeWithLocal(true)
  }

  const handleExchangeWithLocalFalse = () => {
    setExchangeWithLocal(false)
  }

  const calculateDebt = () => {
    const total = calculateTotal()
    return Math.max(total - deposit, 0)
  }

  const handleProductChange = (index, field, value) => {
    setProducts((prevProducts) =>
      prevProducts.map((product, i) =>
        i === index ? { ...product, [field]: value } : product,
      ),
    )
  }

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

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col">
      <SalesHeader
        teamName={myProfile?.sales_team?.name}
        profileImage={myProfile?.profile_image}
        firstName={myProfile?.first_name}
        lastName={myProfile?.last_name}
        description="Edit Records"
      />

      {/* Main Content */}
      <main className="flex-grow px-6 py-8 grid place-items-center">
        <div className="w-full max-w-3xl bg-white rounded-xl shadow-md p-6 space-y-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-blue-700">
            Edit Sales Record
          </h2>

          <div className="flex justify-center mt-6 px-4">
            {/* {cylinderSale ? ( */}
            <form
              // onSubmit={handleSubmit}
              className="w-full max-w-lg "
            >
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Customer Details
              </h2>

              <div className="mb-4">
                <label className="block text-gray-600">Customer Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                  // required
                />
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
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                  // required
                />
              </div>
              {/* Autocomplete dropdown */}
              {/* {searchPhoneResults.length > 0 && (
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
                )} */}

              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Sale Details
              </h2>
              {/* +++++++++++++++++++++++++++++++++++++++++++++ */}
              <div className="mb-4">
                <label className="block text-gray-600">Sale Type</label>
                <select
                  value={salesType}
                  onChange={(e) => setSalesType(e.target.value)}
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
                      (p, i) =>
                        i !== index && p.productId === prod.id.toString(), // Exclude from other rows
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
                        // value={product.productId}
                        value={selectedProductId}
                        onChange={(e) => setSelectedProductId(e.target.value)}
                        // onChange={(e) =>
                        //   handleProductChange(
                        //     index,
                        //     "productId",
                        //     e.target.value,
                        //   )
                        // }
                        className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                        required
                      >
                        <option value="">Select a product</option>
                        {availableProducts.map((assignedProduct) => (
                          <option
                            key={assignedProduct.id}
                            value={assignedProduct.id}
                          >
                            {assignedProduct.gas_type} {assignedProduct.weight}
                            kg
                          </option>
                        ))}
                      </select>

                      <div className="flex items-center  space-x-3 flex-wrap mt-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="number"
                            value={totalAmount}
                            onChange={(e) =>
                              setTotalAmount(Number(e.target.value))
                            }
                            className="border rounded-md px-2 py-1"
                          />
                        </label>
                      </div>
                    </div>

                    <div className="mb-2">
                      <label className="block text-gray-600">Quantity</label>
                      <input
                        type="number"
                        // value={product.quantity}
                        // onChange={(e) =>
                        //   handleProductChange(index, "quantity", e.target.value)
                        // }
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
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

              <div className="mb-4">
                <label className="block text-gray-600">
                  Exchanged with another cylinder?
                </label>
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
                      value={totalAmount || Number(calculateTotal())} // Only set initial value
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
                Total Amount:{" "}
                {sale.total_amount ? (
                  <FormattedAmount amount={totalAmount} />
                ) : (
                  <FormattedAmount amount={calculateTotal()} />
                )}
              </h3>
              <h3 className="text-lg font-bold mt-2">
                Total Debt:{" "}
                {paymentType === "DEBT" ? (
                  <FormattedAmount amount={calculateDebt()} />
                ) : (
                  "N/A"
                )}
              </h3>
            </form>

            {/* )} */}
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              {new Date(sale.timestamp).toLocaleDateString("en-GB")} at{" "}
              {new Date(sale.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <button
              onClick={handleSaveChanges}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow transition-all"
            >
              Save Changes
            </button>
          </div>
        </div>
      </main>

      <EmployeeFooter />
    </div>
  )
}

export default SalesRecordEdit
