import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import LeftNav from '../components/ui/LeftNav';
import NavBar from '../components/ui/NavBar';
import { ToastContainer } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchTransactions, selectAllTransactions } from '../features/transactions/transactionsSlice';

const Transactions = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");

    const dispatch = useAppDispatch();
    const all_transactions = useAppSelector(selectAllTransactions);

    useEffect(() => {
        dispatch(fetchTransactions());
    }, [dispatch]);

 


    const filteredTransactions = all_transactions.filter(transaction =>
        transaction.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='flex gap-1 bg-slate-900 text-white h-screen overflow-y-auto'>
            <div className='w-1/6'>
                <LeftNav />
            </div>
            <div className='w-full'>
                <NavBar />
                <ToastContainer />
                <div className='m-4'>
                    <div className='mb-2'>
                        <input
                            placeholder='Search by name'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='p-2 rounded text-black'
                        />
                    </div>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell align="right">Transaction Code</TableCell>
                                    <TableCell align="right">Amount</TableCell>
                                    <TableCell align="right">Date</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredTransactions.map((transaction) => (
                                    <TableRow
                                        key={transaction.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {transaction.name}
                                        </TableCell>
                                        <TableCell align="right">{transaction.transaction_code}</TableCell>
                                        <TableCell align="right">{transaction.amount}</TableCell>
                                        <TableCell align="right">{transaction.date}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        </div>
    );
}

export default Transactions;
