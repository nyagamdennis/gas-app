import React from 'react';
import { Link } from 'react-router-dom';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { useAppDispatch } from '../app/hooks';
import { logout } from '../features/auths/authSlice';
import AdminsFooter from '../components/AdminsFooter';
import AdminNav from '../components/ui/AdminNav';

const AdminAssign = () => {
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-gray-800 flex flex-col font-sans">
      {/* Header */}
      <AdminNav headerMessage={'Admin Dashboard'} headerText={'Manage your operations with style and clarity'} />
      {/* <header className="bg-white/80 backdrop-blur-md shadow-md border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your operations with style and clarity</p>
        </div>
        <button
          onClick={handleLogOut}
          className="text-red-500 hover:text-red-600 transition duration-200"
          title="Log out"
        >
          <PowerSettingsNewIcon fontSize="large" />
        </button>
      </header> */}

      {/* Main Cards */}
      <main className="flex-grow p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            to: '/admins/assign',
            title: 'Assign Cylinders',
            subtitle: 'Distribute cylinders to sales teams.',
            color: 'blue',
          },
          {
            to: '/admins/collect',
            title: 'Collect Cylinders',
            subtitle: 'Collect the Cylinders effectively',
            color: 'blue',
          },
          {
            to: '/admins/assignothers',
            title: 'Assign Other Products',
            subtitle: 'Allocate Other Products.',
            color: 'blue',
          },
          {
            to: '',
            title: 'Other Sold',
            subtitle: 'Track sales of other items',
            color: 'green',
          },
          {
            to: '/admin/sales',
            title: 'Sales Record',
            subtitle: 'Access detailed sales data',
            color: 'green',
          },
          {
            to: '/admins/employees',
            title: 'Employees',
            subtitle: 'Manage employees data efficiently',
            color: 'yellow',
          },
          {
            to: '/createteam',
            title: 'Create Team',
            subtitle: 'Create a new sales team',
            color: 'blue',
          },
          {
            to: '/admins/store',
            title: 'Store',
            subtitle: 'Manage store inventory and operations',
            color: 'blue',
          },
          {
            to: '/admins/customers',
            title: 'Customers',
            subtitle: 'Manage customer data and interactions',
            color: 'blue',
          },
          {
            to: "/admins/sms",
            title: 'SMS',
            subtitle: 'Send SMS to customers',
            color: 'blue',
          },
          {
            to: '/admins/analysis',
            title: 'Analysis',
            subtitle: 'Analyze sales and performance data',
            color: 'blue',
          }
        ].map(({ to, title, subtitle, color }, index) =>
          to ? (
            <Link
              to={to}
              key={index}
              className={`rounded-2xl shadow-xl bg-white hover:bg-${color}-50 border border-${color}-300 text-${color}-600 transition duration-300 ease-in-out p-6 flex flex-col items-center justify-center text-center hover:scale-[1.02]`}
            >
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
            </Link>
          ) : (
            <div
              key={index}
              className={`rounded-2xl shadow-xl bg-white hover:bg-${color}-50 border border-${color}-300 text-${color}-600 transition duration-300 ease-in-out p-6 flex flex-col items-center justify-center text-center hover:scale-[1.02]`}
            >
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
            </div>
          )
        )}
      </main>

      <AdminsFooter />
    </div>
  );
};

export default AdminAssign;
