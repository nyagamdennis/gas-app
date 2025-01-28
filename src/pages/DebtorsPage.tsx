/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import LeftNav from '../components/ui/LeftNav'
import NavBar from '../components/ui/NavBar'
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchDebtors, getDebtorsStatus, selectAllDebtors } from '../features/debtors/debtorsSlice';
import { fetchCustomers } from '../features/customers/customerSlice';
import DebtorsExcerpt from '../features/debtors/DebtorsExcerpt';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


const columns = [
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'amount', label: 'Debt Amount', minWidth: 170 },
    { id: 'deposit', label: 'Deposit', minWidth: 170 },
    { id: 'dategive', label: 'Date Given', minWidth: 170 },
    { id: 'expecteddate', label: 'repayment Date', minWidth: 170 },
    { id: 'product', label: 'Product', minWidth: 170 },
    { id: 'team', label: 'Action', minWidth: 170 },
    //   { id: 'recorder', label: 'Sales Manager', minWidth: 170 },
];



const DebtorsPage = () => {
    const [open, setOpen] = useState (false);
    const [selectedDebtor, setSelectedDebtor] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const debtors = useAppSelector(selectAllDebtors);
    const debtorsStatus = useAppSelector(getDebtorsStatus);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchDebtors());
        dispatch(fetchCustomers());
    }, [dispatch]);

    const handleClickOpen = (debtor:any) => {
        setSelectedDebtor(debtor);
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
        setSelectedDebtor(null);
      };
    

    let content;

    if (debtorsStatus === 'loading') {
        content = <div>loading...</div>
    } else if (debtorsStatus === 'succeeded') {
        content = debtors
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((debtor) => (
                <DebtorsExcerpt key={debtor.id} debtor={debtor} onClearClick={handleClickOpen} onCloseClick={handleClose} />
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


    const handleCLearDebt = () => {
        console.log('Clearing debt')
      }
    
      const handleDeposit = () => {
        console.log('Clearing debt')
      }
    
      
    
     
    return (
        <div className='flex gap-1 bg-slate-900 text-white'>
            <div className=' w-1/6'>
                <LeftNav />
            </div>
            <div className=' w-full'>
                <NavBar />
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
            </div>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Use Google's location service?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Let Google help apps determine location. This means sending anonymous
                        location data to Google, even when no apps are running.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Disagree</Button>
                    <Button onClick={handleClose} autoFocus>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default DebtorsPage