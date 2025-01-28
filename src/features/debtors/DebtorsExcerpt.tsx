/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import CurrencyConvert from '../../components/CurrencyConvert';
import { useAppSelector } from '../../app/hooks';
import { selectAllCustomers } from '../customers/customerSlice';
import { selectAllEmployees } from '../employees/employeesSlice';

// @ts-ignore
const DebtorsExcerpt = ({ debtor, onClearClick, onCloseClick }) => {
  
  const customers = useAppSelector(selectAllCustomers)
  const employees = useAppSelector(selectAllEmployees)

  const customer = customers.find((cust) => cust.id === debtor.customer)
  const employee = employees.find((employ) => employ.id === debtor.sales_tab.who_recorded_sale)
  // console.log('The customer with debt is ', customer)

  const formattedDate = new Date(debtor.date_given).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const formattedDates = new Date(debtor.expected_date_to_repay).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  

  return (
    <TableRow key={debtor.id} hover role="checkbox" tabIndex={-1}>
      <TableCell>{customer?.name}</TableCell>
      <TableCell><CurrencyConvert price={debtor.amount} /> </TableCell>
      <TableCell><CurrencyConvert price={debtor.sales_tab.total_amount} /> </TableCell>
      <TableCell>{formattedDate}</TableCell>
      <TableCell>{formattedDates}</TableCell>
      {/* <TableCell>{debtor.sales_tab.quantity} {debtor.sales_tab.product.cylinder.gas_type.name} {debtor.sales_tab.product.cylinder.weight.weight}Kg</TableCell> */}
      <TableCell>{debtor.sales_tab.product.gas_type} {debtor.sales_tab.product.weight}kg</TableCell>
      <TableCell>
        <div className=' flex space-x-1 items-center'>
          <button  className='bg-green-800 text-white px-2 py-0.5 rounded-md'>Clear</button>
          {/* <button onClick={() => onClearClick(debtor)} className='bg-green-800 text-white px-2 py-0.5 rounded-md'>Clear</button> */}
          <button className='bg-blue-800 text-white px-2 py-0.5 rounded-md'>Deposit</button>
        </div>
      </TableCell>
      {/* <TableCell>{employee?.name}</TableCell> */}
    </TableRow>
  )
}

export default DebtorsExcerpt