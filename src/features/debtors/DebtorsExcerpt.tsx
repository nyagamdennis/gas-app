/* eslint-disable prettier/prettier */
import React from 'react'
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import CurrencyConvert from '../../components/CurrencyConvert';
import { useAppSelector } from '../../app/hooks';
import { selectAllCustomers } from '../customers/customerSlice';
import { selectAllEmployees } from '../employees/employeesSlice';
// @ts-ignore
const DebtorsExcerpt = ({ debtor }) => {
    const customers = useAppSelector(selectAllCustomers)
    const employees = useAppSelector(selectAllEmployees)

    const customer = customers.find((cust) => cust.id === debtor.id)
    const employee = employees.find((employ) => employ.id === debtor.sales_tab.who_recorded_sale)

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
            <TableCell>{debtor.sales_tab.quantity} {debtor.sales_tab.product.cylinder.gas_type.name} {debtor.sales_tab.product.cylinder.weight.weight}Kg</TableCell>
            <TableCell>{debtor.sales_tab.product.sales_team.name}</TableCell>
            {/* <TableCell>{employee?.name}</TableCell> */}
        </TableRow>
    )
}

export default DebtorsExcerpt