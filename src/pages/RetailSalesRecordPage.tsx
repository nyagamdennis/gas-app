// @ts-nocheck
import React, { useEffect, useState } from 'react'
import RetailSaleRecord from '../components/RetailSaleRecord'
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchAssignedProducts, selectAllAssignedProducts } from '../features/product/assignedProductsSlice';
import { Link, useNavigate } from 'react-router-dom';
import { getSalesError, recordSales } from '../features/sales/salesSlice';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const RetailSalesRecordPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const allAssignedProducts = useAppSelector(selectAllAssignedProducts);
  const operationError = useAppSelector(getSalesError);

  const [products, setProducts] = useState([{ productId: "", quantity: 1 }]);
  const [saleType, setSaleType] = useState("REFILL");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerLocation, setCustomerLocation] = useState("");
  const [paymentType, setPaymentType] = useState("FULLY_PAID"); // 'FULLY_PAID' or 'DEBT'
  const [deposit, setDeposit] = useState(0);
  const [repayDate, setRepayDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selctedProductPrice, setSelectedProductPrice] = useState();
  const [fullyPaid, setFullyPaid] = useState()

  useEffect(() => {
    dispatch(fetchAssignedProducts());
  }, [dispatch]);



  const handleProductChange = (index, field, value) => {
    setProducts((prev) => {
      const updated = [...prev];
      if (field === "quantity") {
        updated[index][field] = value === "" ? "" : parseInt(value, 10); // Allow temporary invalid values
      } else if (field === "productId") {
        updated[index][field] = value; // Update productId
      }
      return updated;
    });
  };



  const handleAddProduct = () => {
    setProducts([...products, { productId: "", quantity: 1 }]);
  };

  const handleRemoveProduct = (index) => {
    setProducts(products.filter((_, idx) => idx !== index));
  };

  const calculateTotal = () => {
    return products.reduce((total, product) => {
      const assignedProduct = allAssignedProducts.find(
        (prod) => prod.id === Number(product.productId)
      );
    
      if (assignedProduct) {
        const price =
          saleType === "COMPLETESALE"
            ? assignedProduct.wholesale_selling_price
            : assignedProduct.wholesale_refil_price;
        return total + price * product.quantity;
      }

      return total;
    }, 0);
  };


  const calculateDebt = () => {
    const total = calculateTotal();
    console.log('total is ', deposit)
    return Math.max(total - deposit, 0);
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setIsSubmitting(true);
    const isFullyPaid = paymentType === "FULLY_PAID";
    const formData = {
      customer: {
        name: customerName,
        location: { name: customerLocation },
        phone: parseInt(customerPhone),
        sales: "RETAIL",
      },
      sales_type: saleType,
      products: products.map((product) => ({
        id: product.productId,
        quantity: product.quantity,
      })),
      total_amount: calculateTotal(),
      partial_payment_amount: paymentType === "FULLY_PAID" ? calculateTotal() : deposit,
      debt_amount: paymentType === "DEBT" ? calculateDebt() : 0,
      repayment_date: paymentType === "DEBT" ? repayDate : null,
      is_fully_paid: isFullyPaid,
    };

    try {
      console.log("Submitting form data: ", formData);
      await dispatch(recordSales(formData)).unwrap()
      // Add your API call logic here
      toast.success("Sales recorded successfully!");

      setTimeout(() => {
        navigate("/sales");
      }, 2000);

    } catch (error: any) {
      console.error("Error during submission:", error);
      if (error && error.error) {
        toast.error(error.error); // Display specific error from the backend
      } else {
        toast.error("An error occurred while submitting the sales record.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-blue-600 text-white py-4 text-center font-bold text-xl">
        Retail Sales Records
      </div>
      <ToastContainer />

      {/* Form */}
      <div className="flex justify-center mt-6 px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg"
        >
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Customer Details</h2>

          <div className="mb-4">
            <label className="block text-gray-600">Customer Name</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600">Customer Location</label>
            <input
              type="text"
              value={customerLocation}
              onChange={(e) => setCustomerLocation(e.target.value)}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600">Customer Phone</label>
            <input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>

          <h2 className="text-lg font-semibold mb-4 text-gray-700">Sale Details</h2>

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
            const selectedProduct = allAssignedProducts.find(
              (prod) => prod.id === Number(product.productId)
            );

            return (
              <div key={index} className="mb-4 border-b pb-4">
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
                    {allAssignedProducts.map((assignedProduct) => (
                      <option
                        key={assignedProduct.id}
                        value={assignedProduct.id}
                      >
                        {assignedProduct.gas_type} {assignedProduct.weight}kg
                      </option>
                    ))}
                  </select>
                  {selectedProduct && (
                    <div className=" flex space-x-2 items-center">
                      <p className="text-sm text-gray-500 mt-1">
                      Ksh{" "}
                      {saleType === "COMPLETESALE"
                        ? selectedProduct.min_wholesale_selling_price
                        : selectedProduct.min_wholesale_refil_price}
                    </p>
                      <p className="text-sm text-gray-500 mt-1">
                      Ksh{" "}
                      {saleType === "COMPLETESALE"
                        ? selectedProduct.wholesale_selling_price
                        : selectedProduct.wholesale_refil_price}
                    </p>
                      <p className="text-sm text-gray-500 mt-1">
                      Ksh{" "}
                      {saleType === "COMPLETESALE"
                        ? selectedProduct.max_wholesale_selling_price
                        : selectedProduct.max_wholesale_refil_price}
                    </p>
                    </div>
                    
                  )}
      
                </div>

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
                  {selectedProduct && product.quantity > selectedProduct.filled && (
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
            );
          })}

          <button
            type="button"
            onClick={handleAddProduct}
            className="text-blue-500 underline text-sm"
          >
            Add Another Product
          </button>

          <h2 className="text-lg font-semibold mt-4 text-gray-700">Payment Details</h2>

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
              <label className="block text-gray-600 mt-2">Repayment Date</label>
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

          <h3 className="text-lg font-bold mt-4">
            Total Amount: Ksh {calculateTotal()}
          </h3>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition mt-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>

      <footer className="bg-gray-800 text-white py-4 text-center mt-auto">
        <Link to="/sales" className="text-blue-300 hover:underline">
          Back to Home
        </Link>
      </footer>
    </div>
  )
}

export default RetailSalesRecordPage