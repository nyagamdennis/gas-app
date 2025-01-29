/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable prettier/prettier */
// @ts-nocheck
import React, { useEffect, useState } from 'react'
import LeftNav from '../components/ui/LeftNav'
import NavBar from '../components/ui/NavBar'
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { clearDebtors, fetchDebtors, getClearDebtError, getClearDebtStatus, getDebtorsStatus, selectAllDebtors } from '../features/debtors/debtorsSlice';
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
import FormattedAmount from '../components/FormattedAmount';
import { CircularProgress } from '@mui/material';


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
    const [open, setOpen] = useState(false);
    const [selectedDebtor, setSelectedDebtor] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const debtors = useAppSelector(selectAllDebtors);
    const debtorsStatus = useAppSelector(getDebtorsStatus);
    const dispatch = useAppDispatch();

    const clearDebtStatus = useAppSelector(getClearDebtStatus);
    const clearDebtError = useAppSelector(getClearDebtError);

    useEffect(() => {
        dispatch(fetchDebtors());
        dispatch(fetchCustomers());
    }, [dispatch]);

    const handleClickOpen = ({ debtor, customer }: any) => {
        setSelectedDebtor({ ...debtor, customerName: customer?.name });
        // setSelectedDebtor(debtor);
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
        dispatch(clearDebtors(selectedDebtor?.id));
        if (clearDebtStatus === "succeeded") {
            handleClose(); // Close the dialog
          }
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
                    {/* {"Use Google's location service?"} */}
                    {selectedDebtor ? `Clear ${selectedDebtor?.customerName || "N/A"}` : "Debtor Information"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {/* Let Google help apps determine location. This means sending anonymous
                        location data to Google, even when no apps are running. */}
                        Are you sure you want to clear {selectedDebtor?.customerName || "N/A"} the debt of <FormattedAmount amount={selectedDebtor?.amount} />
                    </DialogContentText>
                    {/* selectedDebtor?.id */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button
                        onClick={handleCLearDebt}
                        disabled={clearDebtStatus === "loading"}
                        autoFocus
                    >
                        {clearDebtStatus === "loading" ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            "Yes"
                        )}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default DebtorsPage