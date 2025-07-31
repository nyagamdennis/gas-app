// @ts-nocheck
import React, { useEffect, useState } from 'react';
import AdminsFooter from '../components/AdminsFooter';
import FormattedAmount from '../components/FormattedAmount';
import { Link, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchMyProfile, selectMyProfile } from '../features/employees/myProfileSlice';
import { fetchSingleSalesTeamData, selectSingleSalesTeamData } from '../features/salesTeam/singleSalesTeamDataSlice';
import defaultProfile from "../components/media/default.png";
import { fetchAssignedProducts, selectAllAssignedProducts } from '../features/product/assignedProductsSlice';
import EmployeeFooter from '../components/ui/EmployeeFooter';
import SalesHeader from '../components/SalesHeader';

const mockProducts = [
  { id: 1, label: "Gas A - 6kg", gas_type: "Gas A", weight: 6 },
  { id: 2, label: "Gas B - 13kg", gas_type: "Gas B", weight: 13 },
  { id: 3, label: "Gas C - 50kg", gas_type: "Gas C", weight: 50 },
];

const SalesRecordEdit = () => {
  const myProfile = useAppSelector(selectMyProfile);
  const sale = useAppSelector(selectSingleSalesTeamData);
  console.log("Sale data:", sale);
  const allAssignedProducts = useAppSelector(selectAllAssignedProducts)
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerLocation, setCustomerLocation] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [salesType, setSalesType] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isExchanged, setIsExchanged] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    dispatch(fetchMyProfile());
    dispatch(fetchAssignedProducts())
    if (id) dispatch(fetchSingleSalesTeamData({ id }));
    if (sale?.customer) {
      setCustomerName(sale.customer.name);
      setCustomerPhone(sale.customer.phone);
      setCustomerLocation(sale.customer.location?.name);
      setSelectedProductId(sale.product?.id || '');
      setSalesType(sale.sales_type || 'retail');
      setQuantity(sale.quantity || 1);
      setIsExchanged(!!sale.exchanged_with_local);
      setTotalAmount(sale.total_amount || 0);
    }
  }, [dispatch, id]);


  // useEffect(() => {
  //   if (sale?.customer) {
  //     setCustomerName(sale.customer.name);
  //     setCustomerPhone(sale.customer.phone);
  //     setCustomerLocation(sale.customer.location?.name);
  //     setSelectedProductId(sale.product?.id || '');
  //     setSalesType(sale.sales_type || 'retail');
  //     setQuantity(sale.quantity || 1);
  //     setIsExchanged(!!sale.exchanged_with_local);
  //     setTotalAmount(sale.total_amount || 0);
  //   }
  // }, [sale]);

  const handleSaveChanges = () => {
    const payload = {
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
    };
    console.log("Saving updated sale:", payload);
    // Send to API or Redux action
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col">
      {/* Header */}
 {/*      <header className="bg-blue-600 text-white px-6 py-4 shadow-sm flex justify-between items-center">
        <Link to="/sales">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {myProfile?.sales_team?.name || "Sales Team"}
            </h1>
            <p className="text-sm text-blue-100">Track your team's sales performance</p>
          </div>
        </Link>
        <Link to="/myprofile" className="flex flex-col items-center">
          <img
            src={myProfile?.profile_image || defaultProfile}
            alt="Profile"
            className="w-10 h-10 rounded-full border border-white object-cover"
          />
          <span className="text-sm mt-1">{myProfile?.first_name} {myProfile?.last_name}</span>
        </Link>
      </header> */}
      
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

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
            <div>
              <label className="block text-sm font-medium mb-1">Customer Name</label>
              <input value={customerName} onChange={e => setCustomerName(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <input value={customerPhone} onChange={e => setCustomerPhone(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input value={customerLocation} onChange={e => setCustomerLocation(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
            
              <div>
  <label className="block text-sm font-medium mb-1">Product</label>
  <select
    value={selectedProductId}
    onChange={e => setSelectedProductId(e.target.value)}
    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
  >
    <option value="">Select product</option>
    {allAssignedProducts?.map(prod => (
      <option key={prod.id} value={prod.id}>
        {prod.gas_type} - {prod.weight}kg
      </option>
    ))}
  </select>
</div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Sales Type</label>
              <select value={salesType} onChange={e => setSalesType(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="retail">Retail</option>
                <option value="wholesale">Wholesale</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Quantity</label>
              <input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Total Amount</label>
              <input type="number" value={totalAmount} onChange={e => setTotalAmount(Number(e.target.value))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div className="flex items-center mt-6">
              <input type="checkbox" checked={isExchanged} onChange={e => setIsExchanged(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="ml-2 text-sm">Exchanged with another cylinder</label>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Sold on: {new Date(sale.timestamp).toLocaleDateString()}
            </p>
            <button onClick={handleSaveChanges}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow transition-all"
            >
              Save Changes
            </button>
          </div>
        </div>
      </main>

      <EmployeeFooter />
    </div>
  );
};

export default SalesRecordEdit;
