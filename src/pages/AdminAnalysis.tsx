// @ts-nocheck
import React, { useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, LineChart, Line } from "recharts";
import AdminsFooter from "../components/AdminsFooter";


const now = new Date();

const dummySales = [
  { id: 1, name: "Shop A", amount: 50000, date: "2025-04-12" },
  { id: 2, name: "Shop B", amount: 40000, date: "2025-04-15" },
];

const dummyExpenses = [
  { id: 1, name: "Store Rent", amount: 15000, date: "2025-04-10" },
  { id: 2, name: "Fuel", amount: 5000, date: "2025-04-14" },
];

const dummySalaries = [
  { id: 1, employee: "John", amount: 20000, date: "2025-04-01" },
  { id: 2, employee: "Jane", amount: 18000, date: "2025-04-05" },
];

const dummyLosses = [
  { id: 1, reason: "Lost Cylinders", amount: 4000, date: "2025-04-13" },
];

const dummyPurchases = [
  { id: 1, item: "New Stock", amount: 30000, date: "2025-04-09" },
];

const filterData = (data, period) => {
  return data.filter((item) => {
    const itemDate = new Date(item.date);
    const diffInDays = (now - itemDate) / (1000 * 60 * 60 * 24);
    return diffInDays <= period;
  });
};




const periods = [
  { label: "Last 7 Days", value: 7 },
  { label: "Last 14 Days", value: 14 },
  { label: "Last 21 Days", value: 21 },
  { label: "Last 30 Days", value: 30 },
];

const dummyShops = [
  { name: "Shop A", totalSales: 50000, date: "2025-04-10" },
  { name: "Shop B", totalSales: 40000, date: "2025-04-15" },
  { name: "Shop C", totalSales: 30000, date: "2025-04-18" },
  { name: "Shop D", totalSales: 20000, date: "2025-04-22" },
];

const dummyDistributors = [
  { name: "Distributor X", totalSales: 120000, date: "2025-04-11" },
  { name: "Distributor Y", totalSales: 80000, date: "2025-04-14" },
  { name: "Distributor Z", totalSales: 60000, date: "2025-04-19" },
];

const dummyFinancials = [
  { month: "Jan", profit: 10000, loss: 2000 },
  { month: "Feb", profit: 12000, loss: 1500 },
  { month: "Mar", profit: 18000, loss: 3000 },
  { month: "Apr", profit: 20000, loss: 2500 },
];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

const AdminAnalysis = () => {
  const [selectedPeriod, setSelectedPeriod] = useState(7);
  const now = new Date();

  const filterData = (data) => {
    return data.filter((item) => {
      const itemDate = new Date(item.date);
      const diffInDays = (now - itemDate) / (1000 * 60 * 60 * 24);
      return diffInDays <= selectedPeriod;
    });
  };

  const filteredShops = filterData(dummyShops);
  const filteredDistributors = filterData(dummyDistributors);




  // -------------------------------------------------------
  const filteredSales = filterData(dummySales, selectedPeriod);
  const filteredExpenses = filterData(dummyExpenses, selectedPeriod);
  const filteredSalaries = filterData(dummySalaries, selectedPeriod);
  const filteredLosses = filterData(dummyLosses, selectedPeriod);
  const filteredPurchases = filterData(dummyPurchases, selectedPeriod);

  const totalSales = filteredSales.reduce((acc, item) => acc + item.amount, 0);
  const totalExpenses = filteredExpenses.reduce((acc, item) => acc + item.amount, 0);
  const totalSalaries = filteredSalaries.reduce((acc, item) => acc + item.amount, 0);
  const totalLosses = filteredLosses.reduce((acc, item) => acc + item.amount, 0);
  const totalPurchases = filteredPurchases.reduce((acc, item) => acc + item.amount, 0);

  const totalCosts = totalExpenses + totalSalaries + totalLosses + totalPurchases;
  const profit = totalSales - totalCosts;
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 text-gray-800 font-sans">
      <motion.main
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-grow px-4 pt-8 pb-20 max-w-7xl mx-auto"
      >
        <h1 className="text-3xl font-extrabold text-blue-700 mb-6 text-center">Admin Analytics Dashboard</h1>

        <div className="flex justify-center mb-6">
          <select
            className="border border-gray-300 rounded-lg p-2 bg-white text-sm"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(Number(e.target.value))}
          >
            {periods.map((period) => (
              <option key={period.value} value={period.value}>{period.label}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
            <h2 className="text-lg font-bold mb-4 text-blue-700">Retail Shops Performance</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filteredShops}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalSales" fill="#3b82f6" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
            <h2 className="text-lg font-bold mb-4 text-green-700">Distributors Performance</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filteredDistributors}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalSales" fill="#10b981" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div className="bg-white p-6 rounded-xl shadow-md border border-gray-200" whileHover={{ scale: 1.02 }}>
            <h2 className="text-lg font-semibold mb-4">Profits and Losses</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dummyFinancials}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="loss" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        <motion.main initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex-grow px-4 pt-8 pb-20 max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold text-blue-700 mb-6 text-center">Profit & Loss Dashboard</h1>

        <div className="flex justify-end mb-4">
          <select className="border border-gray-300 rounded-lg p-2 bg-white text-sm" value={selectedPeriod} onChange={(e) => setSelectedPeriod(Number(e.target.value))}>
            {periods.map((period) => (
              <option key={period.value} value={period.value}>{period.label}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div whileHover={{ scale: 1.02 }} className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h2 className="text-lg font-bold mb-4 text-blue-700">Total Revenue</h2>
            <p className="text-2xl font-bold text-green-600">Ksh {totalSales.toLocaleString()}</p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h2 className="text-lg font-bold mb-4 text-red-700">Total Costs</h2>
            <p className="text-2xl font-bold text-rose-600">Ksh {totalCosts.toLocaleString()}</p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} className="col-span-1 md:col-span-2 bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h2 className="text-lg font-bold mb-4 text-indigo-700">Profit</h2>
            <p className={`text-2xl font-bold ${profit >= 0 ? "text-green-600" : "text-red-600"}`}>
              {profit >= 0 ? `Ksh ${profit.toLocaleString()}` : `Loss Ksh ${Math.abs(profit).toLocaleString()}`}
            </p>
          </motion.div>
        </div>

        {/* Detailed Tables */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sales Table */}
          <div className="bg-white rounded-xl shadow-md p-4">
            <h3 className="text-lg font-bold mb-2">Sales</h3>
            <ul className="text-sm space-y-1">
              {filteredSales.map((sale) => (
                <li key={sale.id} className="flex justify-between">
                  <span>{sale.name}</span>
                  <span>Ksh {sale.amount.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Expenses Table */}
          <div className="bg-white rounded-xl shadow-md p-4">
            <h3 className="text-lg font-bold mb-2">Expenses</h3>
            <ul className="text-sm space-y-1">
              {filteredExpenses.map((exp) => (
                <li key={exp.id} className="flex justify-between">
                  <span>{exp.name}</span>
                  <span>Ksh {exp.amount.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Salaries Table */}
          <div className="bg-white rounded-xl shadow-md p-4">
            <h3 className="text-lg font-bold mb-2">Salaries</h3>
            <ul className="text-sm space-y-1">
              {filteredSalaries.map((salary) => (
                <li key={salary.id} className="flex justify-between">
                  <span>{salary.employee}</span>
                  <span>Ksh {salary.amount.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Losses Table */}
          <div className="bg-white rounded-xl shadow-md p-4">
            <h3 className="text-lg font-bold mb-2">Losses</h3>
            <ul className="text-sm space-y-1">
              {filteredLosses.map((loss) => (
                <li key={loss.id} className="flex justify-between">
                  <span>{loss.reason}</span>
                  <span>Ksh {loss.amount.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Purchases Table */}
          <div className="bg-white rounded-xl shadow-md p-4">
            <h3 className="text-lg font-bold mb-2">Stock Purchases</h3>
            <ul className="text-sm space-y-1">
              {filteredPurchases.map((purchase) => (
                <li key={purchase.id} className="flex justify-between">
                  <span>{purchase.item}</span>
                  <span>Ksh {purchase.amount.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.main>

      </motion.main>

      <AdminsFooter />
    </div>
  );
};

export default AdminAnalysis;
