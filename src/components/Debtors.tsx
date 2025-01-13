/* eslint-disable prettier/prettier */
// Debtors.tsx
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  fetchDebtors,
  getDebtorsStatus,
  selectAllDebtors,
} from '../features/debtors/debtorsSlice';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import DebtorsExcerpt from '../features/debtors/DebtorsExcerpt';
import { fetchCustomers } from '../features/customers/customerSlice';

const columns = [
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'amount', label: 'Debt Amount', minWidth: 170 },
  { id: 'deposit', label: 'Deposit', minWidth: 170 },
  { id: 'dategive', label: 'Date Given', minWidth: 170 },
  { id: 'expecteddate', label: 'repayment Date', minWidth: 170 },
  { id: 'product', label: 'Product', minWidth: 170 },
  { id: 'team', label: 'Sales team', minWidth: 170 },
//   { id: 'recorder', label: 'Sales Manager', minWidth: 170 },
];

const Debtors = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const debtors = useAppSelector(selectAllDebtors);
  const debtorsStatus = useAppSelector(getDebtorsStatus);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchDebtors());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchCustomers())
  }, [dispatch])

  let content;

  if (debtorsStatus === 'loading') {
    content = <div>loading...</div>
  } else if (debtorsStatus === 'succeeded') {
    content = debtors
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((debtor) => (
          <DebtorsExcerpt key={debtor.id} debtor={debtor} />
        ))
  }
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div className='mt-5 mx-3'>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader size="small" aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align="left"
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
                {content}
              {/* {debtors
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((debtor) => (
                  <TableRow key={debtor.id} hover role="checkbox" tabIndex={-1}>
                    <TableCell>{debtor.id}</TableCell>
                    <TableCell>{debtor.amount}</TableCell>
                    <TableCell>{debtor.sales_tab.total_amount}</TableCell>
                  </TableRow>
                ))} */}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={debtors.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};

export default Debtors;
