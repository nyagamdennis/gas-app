// @ts-nocheck
import React, { useEffect, useState } from 'react'
import LeftNav from '../components/ui/LeftNav'
import NavBar from '../components/ui/NavBar'
import { Button, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { addAnotherCylinder, addNewCylinders, deleteCylinder, fetchStore, getStoretatus, refillEmpties, selectAllStore, updateTheCylinder } from '../features/store/storeSlice';
import { TransitionProps } from '@mui/material/transitions';
import Slide from '@mui/material/Slide';
import { addNewProduct, fetchOtherProducts, selectAllOtherProducts } from '../features/store/otherProductsSlice';
import FormattedAmount from '../components/FormattedAmount';
import AddBoxIcon from '@mui/icons-material/AddBox';
import axios from 'axios';
import Cookies from "cookies-js"


const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});


const Store = () => {
    const dispatch = useAppDispatch();
    const [openAssign, setOpenAssign] = useState<boolean>(false)
    const [openSell, setOpenSell] = useState<boolean>(false)
    const [activeTab, setActiveTab] = useState<string>('cylinders')
    const [activeForm, setActiveForm] = useState<string>('cylinders')

    const store = useAppSelector(selectAllStore);
    const otherProducts = useAppSelector(selectAllOtherProducts);
    const updatingCylinderStatus = useAppSelector(state => state.store.updateCylinderStatus);
    const updatingCylinderError = useAppSelector(state => state.store.updateCylinderError);
    const storeStatus = useAppSelector(getStoretatus);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const [selectedEmpties, setSelectedEmpties] = useState<number>(0);
    const [refillAmount, setRefillAmount] = useState<number>();
    const [refillId, setRefillId] = useState<string>();
    const [refillValue, setRefillValue] = useState<number>();

    const [soldId, setSoldId] = useState<string>();

    const [selectedProductId, setSelectedProductId] = useState<number | undefined>();
    const [selectedProduct, setSelectedProduct] = useState()
    const [quantity, setQuantity] = useState(1)
    const [fullyPaid, setFullyPaid] = useState(true)
    const [saleType, setSaleType] = useState("COMPLETESALE");
    const [salesTyleWholeSaleRetail, setSalesTyleWholeSaleRetail] = useState("RETAIL")
    const [deposit, setDeposit] = useState(0)
    const [isExhanged, setIsExchanged] = useState(false)
    const [customerPhone, setCustomerPhone] = useState("")
    const [customerLocation, setCustomerLocation] = useState("")
    const [customerName, setCustomerName] = useState("")
    const [debt, setDebt] = useState()
    const [repayDate, setRepayDate] = useState("")
    const [totalPaid, setTotalPaid] = useState()
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [gasType, setGasType] = useState<string>("");
    const [retailSellingPrice, setRetailSellingPrice] = useState<number>(0);
    const [retailRefillingPrice, setRetailRefillingPrice] = useState<number>(0);
    const [wholeSaleSellingPrice, setWholeSellingPrice] = useState<number>(0);
    const [wholeSaleRefillingPrice, setWholeRefillingPrice] = useState<number>(0);
    const [cylinderWeight, setCylinderWeight] = useState<number>(0);
    const [gasEmpties, setGasEmpties] = useState<number>(0);
    const [gasFilled, setGasFilled] = useState<number>(0);
    const [gasSpoiled, setGasSpoiled] = useState<number>(0);
    const [productName, setProductName] = useState<string>("");
    const [productWholeSalePrice, setProductWholeSalePrice] = useState<number>(0);
    const [productRetailPrice, setProductRetailPrice] = useState<number>(0);
    const [productQuantity, setProductQuantity] = useState<number>(0);
    const [openUpdateCylinder, setOpenUpdateCylinder] = useState<boolean>(false);
    const [updateCylinderId, setUpdateCylinderID] = useState<string>("");
    const [updateCylinderName, setUpdateCylinderName] = useState<string>("");
    const [openAddAnotherCylinder, setOpenAddAnotherCylinder] = useState<boolean>(false);
    const [anotherCylinderWeight, setAnotherCylinderWeight] = useState<number>();
    const [anotherCylinderFilled, setAnotherCylinderFilled] = useState<number>();
    const [anotherCylinderEmpties, setAnotherCylinderEmpties] = useState<number>();
    const [anotherCylinderWholeSaleSelling, setAnotherCylinderWholeSaleSelling] = useState<number>();
    const [anotherCylinderWholeSaleRefill, setAnotherCylinderWholeSaleRefill] = useState<number>();
    const [anotherCylinderRetailRefill, setAnotherCylinderRetailRefill] = useState<number>();
    const [anotherCylinderRetailSelling, setAnotherCylinderRetailSelling] = useState<number>();
    const [anotherCylinderSpoiled, setAnotherCylinderSpoiled] = useState<number>();
    const [anotherCylinderId, setAnotherCylinderId] = useState<string>("");
    const [anotherCylinderName, setAnotherCylinderName] = useState<string>("");
    const [openDeleteCylinder, setOpenDeleteCylinder] = useState<boolean>(false);
    const [deleteCylinderId, setDeleteCylinderId] = useState<string>('');
    const [deleteCylinderName, setDeleteCylinderName] = useState<string>('');

    const [openUpdateCylinderData, setOpenUpdateCylinderData] = useState<boolean>(false);
    const [openDeleteCylinderData, setOpenDeleteCylinderData] = useState<boolean>(false);
    const [deleteCylinderDataId, setDeleteCylinderDataId] = useState<string>("");
    const [deleteCylinderDataName, setDeleteCylinderDataName] = useState<string>("");
    const [deleteCylinderDataWeightId, setDeleteCylinderDataWeightId] = useState<string>("");
    const [deleteCylinderDataWeight, setDeleteCylinderDataWeight] = useState<string>("");
    const [updateCylinderDataName, setUpdateCylinderDataName] = useState<string>("");
    const [updateCylinderData, setUpdateCylinderData] = useState<string>("");
    const [updateCylinderDataWeight, setUpdateCylinderDataWeight] = useState<number>();
    const [updateCylinderDataFilled, setUpdateCylinderDataFilled] = useState<number>();
    const [updateCylinderDataEmpties, setUpdateCylinderDataEmpties] = useState<number>();
    const [updateCylinderDataSpoiled, setUpdateCylinderDataSpoiled] = useState<number>();
    const [updateCylinderDataWholesaleSelling, setUpdateCylinderDataWholesaleSelling] = useState<number>();
    const [updateCylinderDataWholesaleRefill, setUpdateCylinderDataWholesaleRefill] = useState<number>();
    const [updateCylinderDataRetailSelling, setUpdateCylinderDataRetailSelling] = useState<number>();
    const [updateCylinderDataRetailRefill, setUpdateCylinderDataRetailRefill] = useState<number>();



    const handleCustomerNameInput = (e: any) => setCustomerName(e.target.value)
    const handleCustomerPhoneInput = (e: any) => setCustomerPhone(e.target.value)
    const handleCustomerLocationInput = (e: any) => setCustomerLocation(e.target.value)
    const handleSelectedProduct = (e: any) => setSelectedProduct(e.target.value)

    useEffect(() => {
        dispatch(fetchStore())
    }, [dispatch])

    useEffect(() => {
        dispatch(fetchOtherProducts())
    }, [dispatch])

    const handleOpenDeleteCylinderData = (id:string, cylinderWeightId:string, cylinderName: string, cylinderWeight: string) => {
        setDeleteCylinderDataName(cylinderName);
        setDeleteCylinderDataWeight(cylinderWeight);
        setDeleteCylinderDataWeightId(cylinderWeightId);
        setDeleteCylinderDataId(id);

        setOpenDeleteCylinderData(true);
    }

    const handleCloseDeleteCylinderData = () => {
        setOpenDeleteCylinderData(false);
    }


    const handleOpenUpdateCylinderData = (id:string, cylindersName: string, dataRest:any) => {
        setUpdateCylinderDataName(cylindersName);
        setUpdateCylinderData(dataRest);
        setUpdateCylinderDataWeight(dataRest?.weight?.weight)
        setUpdateCylinderDataFilled(dataRest?.stores[0]?.filled)
        setUpdateCylinderDataEmpties(dataRest?.stores[0]?.empties)
        setUpdateCylinderDataWholesaleSelling(dataRest?.stores[0]?.cylinder_details?.wholesale_selling_price)
        setUpdateCylinderDataWholesaleRefill(dataRest?.stores[0]?.cylinder_details?.wholesale_refil_price)
        setUpdateCylinderDataRetailSelling(dataRest?.stores[0]?.cylinder_details?.retail_selling_price)
        setUpdateCylinderDataRetailRefill(dataRest?.stores[0]?.cylinder_details?.retail_refil_price)
        setUpdateCylinderDataSpoiled(dataRest?.stores[0]?.spoiled)
        setOpenUpdateCylinderData(true);
    }

    const handleCloseUpdateCylinderData = () => {
        setOpenUpdateCylinderData(false);
    }
    
    const handleUpdateCylinderDataWeightInputChange = (e: any) => {
        setUpdateCylinderDataWeight(e.target.value)
    }


    
    const handleUpdateCylinderDataFilledInputChange = (e: any) => {
        setUpdateCylinderDataFilled(e.target.value)
    }

    
    const handleUpdateCylinderDataEmptiesInputChange = (e: any) => {
        setUpdateCylinderDataEmpties(e.target.value)
    }

    
    const handleUpdateCylinderDataWholeSaleSellingInputChange = (e: any) => {
        setUpdateCylinderDataWholesaleSelling(e.target.value)
    }

    
    const handleUpdateCylinderDataWholeSaleRefillInputChange = (e: any) => {
        setUpdateCylinderDataWholesaleRefill(e.target.value)
    }

    
    const handleUpdateCylinderDataRetailSellingInputChange = (e: any) => {
        setUpdateCylinderDataRetailSelling(e.target.value)
    }

    
    const handleUpdateCylinderDataRetailRefillInputChange = (e: any) => {
        setUpdateCylinderDataRetailRefill(e.target.value)
    }

    
    const handleUpdateCylinderDataSpoiledInputChange = (e: any) => {
        setUpdateCylinderDataSpoiled(e.target.value)
    }


    const handleAnotherCylinderWeightInputChange = (e: any) => {
        setAnotherCylinderWeight(e.target.value)
    }


    const handleAnotherCylinderFilledInputChange = (e: any) => {
        setAnotherCylinderFilled(e.target.value)
    }


    const handleAnotherCylinderEmptyInputChange = (e: any) => {
        setAnotherCylinderEmpties(e.target.value)
    }


    const handleAnotherCylinderWholesaleSellingInputChange = (e: any) => {
        setAnotherCylinderWholeSaleSelling(e.target.value)
    }


    const handleAnotherCylinderWholesaleRefillingInputChange = (e: any) => {
        setAnotherCylinderWholeSaleRefill(e.target.value)
    }


    const handleAnotherCylinderRetailRefillInputChange = (e: any) => {
        setAnotherCylinderRetailRefill(e.target.value)
    }


    const handleAnotherCylinderRetailSellingInputChange = (e: any) => {
        setAnotherCylinderRetailSelling(e.target.value)
    }

    const handleAnotherCylinderSpoiledInputChange = (e: any) => {
        setAnotherCylinderSpoiled(e.target.value)
    }


    const handleOpenAddAnotherCylinder = (id:string, cylinderName: string) => {
        setAnotherCylinderId(id);
        setAnotherCylinderName(cylinderName);
        setOpenAddAnotherCylinder(true);
    }

    const handleCloseDeleteCylinder = () => {
        setOpenDeleteCylinder(false);
    }
    const handleOpenDeleteCylinder = (id:string, cylinderDeleteName: string) => {
        setDeleteCylinderName(cylinderDeleteName);
        setDeleteCylinderId(id);
        setOpenDeleteCylinder(true);
    }

    const handleDeleteCylinder = () => {
        dispatch(deleteCylinder({id:deleteCylinderId}))
    }


    const handleCloseAddAnotherCylinder = () => {
        setOpenAddAnotherCylinder(false);
    }

    const handleAddAnotherCylinder = () => {
        // setAnotherCylinderId(id);
        const formData = {
            empties: anotherCylinderEmpties,
            filled: anotherCylinderFilled,
            spoiled: anotherCylinderSpoiled,
            wholesale_selling_price: anotherCylinderWholeSaleSelling,
            wholesale_refill_price: anotherCylinderWholeSaleRefill,
            retail_selling_price: anotherCylinderRetailSelling,
            retail_refill_price: anotherCylinderRetailRefill,
        }
        dispatch(addAnotherCylinder({dat:formData, id: anotherCylinderId}))
    }




    const openAssignDialogue = (empties: number, id: string) => {
        setSelectedEmpties(empties)
        setRefillId(id)
        setOpenAssign(true);
    }

    const handleClose = () => {
        setRefillValue(0)
        setOpenAssign(false);
    }

    const openSellDialogue = (id: string) => {
        setSoldId(id)
        setOpenSell(true);
    }

    const handleCloseSellDialogue = () => {
        setRefillValue(0)
        setOpenSell(false);
    }


    const changectiveTab = (tab: string) => {
        setActiveTab(tab);
    }

    const changectiveFrom = (form: string) => {
        setActiveForm(form);
    }



    const handleRefillValueInputChange = (e: any) => {
        setRefillValue(e.target.value);
    };


    const handleRefill = () => {
        const formData = {
            id: refillId,
            empties: refillValue
        }

        dispatch(refillEmpties(formData))
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()

        setIsSubmitting(true)
        try {
            const formData = {
                customer: {
                    name: customerName,
                    location: {
                        name: customerLocation,
                    },
                    phone: parseInt(customerPhone),
                    sales: salesTyleWholeSaleRetail,
                },
                sales_type: saleType,
                sales_choice: salesTyleWholeSaleRetail,

                // product: selectedProduct,
                store_product: soldId,
                quantity: quantity,
                is_fully_paid: fullyPaid,
                partial_payment_amount: deposit,
                exchanged_with_local: isExhanged,
                debt_amount: debt,
                expected_date_to_repay: repayDate,
                total_amount: totalPaid,
            }

            const response = await axios.post(
                `http://127.0.0.1:8000/recordsales/`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get("accessToken")}`,
                        "Content-Type": "application/json",
                    },
                },
            )
            if (response.status === 201) {
                console.log("Form submitted successfully!")
            } else {
                console.error("Form submission failed.")
            }
        } catch (error) {
            console.error("Error occurred while submitting the form:", error)
        } finally {
            setIsSubmitting(false)
        }
    }


    const calculateDebt = () => {
        if (deposit <= 0) {
            return 0
        } else {
            return calculateTotalAmount() - deposit
        }
    }
    const calculateTotalAmount = () => {
        if (selectedProduct) {
            const priceProperty =
                saleType === "COMPLETESALE"
                    ? "wholesale_selling_price"
                    : "wholesale_refil_price"
            if (
                // @ts-ignore
                selected[priceProperty] !== undefined &&
                // @ts-ignore
                !isNaN(selected[priceProperty]) &&
                !isNaN(quantity)
            ) {
                // @ts-ignore
                return selected[priceProperty] * quantity
            }
        }
        return 0
    }


    const renderDepositAndTotalDebt = () => {
        if (!fullyPaid) {
            return (
                <>
                    <div className="flex flex-col my-2">
                        <label>Deposit</label>
                        <input
                            type="number"
                            min={0}
                            className="px-2 border-solid outline-none border-gray-500 border-2"
                            value={deposit}
                            onChange={(e) => setDeposit(parseFloat(e.target.value))}
                        />
                        <label>Repay Date</label>
                        <input
                            type="date"
                            value={repayDate}
                            onChange={(e) => setRepayDate(e.target.value)}
                            className="px-2 border-solid outline-none border-gray-500 border-2"
                        />
                    </div>
                    <div className="flex gap-2">
                        <h3>Total Debt:</h3>
                        <h5>Ksh{calculateDebt()}</h5>
                    </div>
                </>
            )
        }
        return null
    }

    const handleOpenUpdateCylinder = (upDateId: string, updateName: string) => {
        setUpdateCylinderID(upDateId)
        setUpdateCylinderName(updateName)
        setOpenUpdateCylinder(true);
    }

    const handleUpdateCylinder = () => {
        updateCylinderName

        dispatch(updateTheCylinder({ name: updateCylinderName, id: updateCylinderId }))
    }

    const handleUpdateCylinderNameInputChange = (e: any) => {
        setUpdateCylinderName(e.target.value)
    }

    const handleCloseUpdateCylinder = () => {
        setOpenUpdateCylinder(false);
    }


    const addNewCylinder = (e: any) => {
        e.preventDefault()
        const formData = {
            gas_type: gasType,
            weight: cylinderWeight,
            wholesale_selling_price: wholeSaleSellingPrice,
            wholesale_refil_price: wholeSaleRefillingPrice,
            retail_selling_price: retailSellingPrice,
            retail_refil_price: retailRefillingPrice,
            filled: gasFilled,
            empties: gasEmpties,
        }

        dispatch(addNewCylinders(formData))
        // console.log('Form data ', formData)
    }

    const addOtherProducts = (e: any) => {
        e.preventDefault()
        const formData = {
            name: productName,
            whole_sales_price: productWholeSalePrice,
            retail_sales_price: productRetailPrice,
            quantity: productQuantity
        }

        dispatch(addNewProduct(formData))
    }

    const handleNameInputChange = (e: any) => {
        setProductName(e.target.value)
    }

    const handleProductWholeSalePriceInputChange = (e: any) => {
        setProductWholeSalePrice(e.target.value)
    }


    const handleProductRetailPriceInputChange = (e: any) => {
        setProductRetailPrice(e.target.value)
    }

    const handleProductQuantityInputChange = (e: any) => {
        setProductQuantity(e.target.value)
    }



    const handleGasTypeInputChange = (e: any) => {
        setGasType(e.target.value);
    };


    const handleGasWeightInputChange = (e: any) => {
        setCylinderWeight(e.target.value);
    };

    const handleWholeSaleSellingtInputChange = (e: any) => {
        setWholeSellingPrice(e.target.value);
    };


    const handleWholeSaleRefillingInputChange = (e: any) => {
        setWholeRefillingPrice(e.target.value);
    };


    const handleRetailSalesInputChange = (e: any) => {
        setRetailSellingPrice(e.target.value);
    };


    const handleRetailFillingInputChange = (e: any) => {
        setRetailRefillingPrice(e.target.value);
    };


    const handleGasFilledInputChange = (e: any) => {
        setGasFilled(e.target.value);
    }


    const handleGasEmptiesInputChange = (e: any) => {
        setGasEmpties(e.target.value)
    }



    return (
        <div className=''>
            <div className='flex gap-1 bg-slate-900 text-white h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200'>
                <div className=' w-1/6'>
                    <LeftNav />
                </div>
                <div className=' w-full'>
                    <NavBar />
                    <div className='m-4'>
                        <div className='mb-4 flex border border-green-800 justify-between space-x-2 p-1 rounded-md'>
                            <div onClick={() => changectiveTab('cylinders')} className={`${activeTab === 'cylinders' ? 'bg-emerald-800' : ''}  w-full text-center cursor-pointer rounded-md`}>Cylinders</div>
                            <div onClick={() => changectiveTab('otherProducts')} className={` ${activeTab === 'otherProducts' ? 'bg-emerald-800' : ''} w-full text-center cursor-pointer rounded-md`}>Other Products</div>
                            <div onClick={() => changectiveTab('addProduct')} className={` ${activeTab === 'addProduct' ? 'bg-emerald-800' : ''} w-full text-center cursor-pointer rounded-md`}>Add new product</div>
                        </div>
                        <div className={`transition-all duration-500 ease-in-out ${activeTab === 'cylinders' ? 'block' : 'hidden'
                            }`}>
                            {storeStatus === "loading" && (
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 650 }} stickyHeader aria-label='sales table'>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell className='font-bold'>Product</TableCell>
                                                <TableCell align='center'>Weight</TableCell>
                                                <TableCell align='center'>Stock</TableCell>
                                                <TableCell align='center'>Returned</TableCell>
                                                <TableCell align='center'>Sold</TableCell>
                                                <TableCell align='center'>Add Stock</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>


                                            <React.Fragment>
                                                <TableRow >
                                                    {/* Display Product Name only once using rowSpan */}

                                                    <TableCell rowSpan={4} component="th" scope="row">
                                                        <Skeleton variant='text' sx={{ fontSize: '1rem' }} width={100} />
                                                    </TableCell>

                                                    <TableCell align='center'><Skeleton /></TableCell>
                                                    <TableCell align="center"><Skeleton /></TableCell>
                                                    <TableCell align="center"><Skeleton /></TableCell>
                                                    <TableCell align="center"><Skeleton /></TableCell>
                                                    <TableCell align="center" className='flex space-x-2'>
                                                        <button className="bg-blue-500 text-white px-2 py-1 rounded"><Skeleton variant='text' sx={{ fontSize: '1rem' }} width={50} /></button>
                                                        <button className="bg-blue-500 text-white px-2 py-1 rounded"><Skeleton variant='text' sx={{ fontSize: '1rem' }} width={50} /></button>
                                                        <button className="bg-blue-500 text-white px-2 py-1 rounded"><Skeleton variant='text' sx={{ fontSize: '1rem' }} width={50} /></button>

                                                    </TableCell>
                                                </TableRow>

                                            </React.Fragment>

                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}

                            {storeStatus === "succeeded" && (
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 150 }} size='small' stickyHeader aria-label='sales table'>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell className='font-bold'>Product</TableCell>
                                                <TableCell align='center'>Weight</TableCell>
                                                <TableCell align='center'>Filled</TableCell>
                                                <TableCell align='center'>Empties</TableCell>
                                                <TableCell align='center'>Spoiled</TableCell>
                                                <TableCell align='center'>Total Cylinders</TableCell>
                                                <TableCell align='center'>WholeSale Selling Price</TableCell>
                                                <TableCell align='center'>WholeSale Refill Price</TableCell>
                                                <TableCell align='center'>Retail Sellig Price</TableCell>
                                                <TableCell align='center'>Retail Refill Price</TableCell>
                                                <TableCell align='center'>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>

                                            {store.map((product) => (
                                                <React.Fragment key={product.id}>
                                                    {product.cylinders.map((cylinder, index) => (
                                                        <TableRow key={cylinder.id}>
                                                            {/* Display Product Name only once using rowSpan */}
                                                            {index === 0 && (
                                                                <TableCell className=' whitespace-nowrap  ' rowSpan={product.cylinders.length} component="th" scope="row">
                                                                    <p className='text-center mb-2'>{product.name}</p>
                                                                    <div className=' flex space-x-0.5'>
                                                                        <button onClick={() => handleOpenAddAnotherCylinder(product.id, product.name)} className='bg-green-500 text-white px-1 py-1 rounded'>add</button>
                                                                        <button onClick={() => handleOpenUpdateCylinder(product.id, product.name)} className='bg-blue-500 text-white px-1 py-1 rounded'>Update</button>
                                                                        <button onClick={() => handleOpenDeleteCylinder(product.id, product.name)} className='bg-red-500 text-white px-1 py-1 rounded'>Delete</button>
                                                                    </div>
                                                                </TableCell>
                                                            )}
                                                            <TableCell align='center'>{cylinder.weight.weight}kg</TableCell>
                                                            <TableCell align="center">{cylinder.stores[0]?.filled || 0}</TableCell>
                                                            <TableCell align="center">{cylinder.stores[0]?.empties || 0}</TableCell>
                                                            <TableCell align="center">{cylinder.stores[0]?.spoiled || 0}</TableCell>
                                                            <TableCell align="center">{cylinder.stores[0]?.filled + cylinder.stores[0]?.empties || 0}</TableCell>
                                                            <TableCell align="center"><FormattedAmount amount={cylinder.stores[0]?.cylinder_details.wholesale_selling_price || 0} /></TableCell>
                                                            <TableCell align="center"><FormattedAmount amount={cylinder.stores[0]?.cylinder_details.wholesale_refil_price || 0} /></TableCell>
                                                            <TableCell align="center"><FormattedAmount amount={cylinder.stores[0]?.cylinder_details.retail_selling_price || 0} /></TableCell>
                                                            <TableCell align="center"><FormattedAmount amount={cylinder.stores[0]?.cylinder_details.retail_refil_price || 0} /></TableCell>
                                                            <TableCell align="center" className=''>
                                                                {/* <button onClick={openAssignDialogue} className="bg-green-500 text-white px-2 py-1 rounded">Assign</button> */}
                                                                <div className='flex space-x-1 flex-nowrap'>
                                                                    <button onClick={() => openAssignDialogue(cylinder.stores[0]?.empties || 0, cylinder.stores[0]?.id)} className="bg-green-500 text-white px-2 py-1 rounded">Refill</button>
                                                                    <button onClick={() => openSellDialogue(cylinder.stores[0]?.id)} className="bg-green-900 text-white px-2 py-1 rounded">Sell</button>
                                                                    <button onClick={() => handleOpenUpdateCylinderData(product.id, product.name, cylinder)} className="bg-blue-500 text-white px-2 py-1 rounded">Update</button>
                                                                    <button onClick={() => handleOpenDeleteCylinderData(product.id, cylinder.weight.id, product.name, cylinder.weight.weight )} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                                                                </div>

                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </React.Fragment>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </div>
                        <div className={`transition-all duration-500 ease-in-out ${activeTab === 'otherProducts' ? 'block' : 'hidden'
                            }`}>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align='center'>product</TableCell>
                                            <TableCell align="center">Quantity</TableCell>
                                            <TableCell align="center">WholeSale Price</TableCell>
                                            <TableCell align="center">Retail Price</TableCell>
                                            <TableCell align="center">Action</TableCell>
                                            {/* <TableCell align="center">Protein&nbsp;(g)</TableCell>  */}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {otherProducts.map((product) => (
                                            <TableRow
                                                key={product.id}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" align='center' scope="row">
                                                    {product.name}
                                                </TableCell>
                                                <TableCell align="center">{product.quantity}</TableCell>
                                                <TableCell align="center"><FormattedAmount amount={product.whole_sales_price} /> </TableCell>
                                                <TableCell align="center"><FormattedAmount amount={product.retail_sales_price} /> </TableCell>
                                                <TableCell align="center" className='flex space-x-2'>
                                                    <button onClick={openAssignDialogue} className="bg-green-500 text-white px-2 py-1 rounded">Assign</button>
                                                    <button onClick={openAssignDialogue} className="bg-green-500 text-white px-2 py-1 rounded">Recieve Empties</button>
                                                    <button onClick={openAssignDialogue} className="bg-green-500 text-white px-2 py-1 rounded">Sell</button>
                                                    <button className="bg-blue-500 text-white px-2 py-1 rounded">Update</button>
                                                    <button className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>

                        <div className={`transition-all duration-500 ease-in-out ${activeTab === 'addProduct' ? 'block' : 'hidden'
                            }`}>
                            <div className="flex justify-center flex-col items-center min-h-screen bg-gray-100">
                                <div className=' flex mb-5 space-x-2  border-blue-500 border-2 p-1 rounded-md bg-gray-500'>
                                    <div onClick={() => changectiveFrom('cylinders')} className={`cursor-pointer  p-1 rounded-md ${activeForm === 'cylinders' ? 'bg-green-600' : ''}`}>
                                        <h5 className=' text-white text-sm font-semibold'>Add Cylinders</h5>
                                    </div>
                                    <div onClick={() => changectiveFrom('others')} className={`cursor-pointer  p-1 rounded-md ${activeForm === 'others' ? 'bg-green-600' : ''}`}>
                                        <h5 className=' text-white text-sm font-semibold'>Add Other Products</h5>
                                    </div>
                                </div>
                                <form className={`bg-white shadow-lg rounded-lg p-6 w-full max-w-md ${activeForm === 'cylinders' ? 'block' : 'hidden'}`}>
                                    {/* <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Add Cylinder</h2> */}
                                    <div className=' flex space-x-2 items-center'>
                                        <div>
                                            <div className="flex flex-col mb-4">
                                                <label className="text-gray-700 font-semibold mb-2" htmlFor="cylinderType">Cylinder Type</label>
                                                <input
                                                    id="cylinderType"
                                                    className="text-black border border-gray-300 rounded-md p-2 focus:ring focus:ring-green-300 focus:outline-none"
                                                    type="text"
                                                    value={gasType}
                                                    onChange={handleGasTypeInputChange}
                                                    placeholder="Enter cylinder type"
                                                />
                                            </div>
                                            <div className="flex flex-col mb-4">
                                                <label className="text-gray-700 font-semibold mb-2" htmlFor="cylinderWeight">Cylinder Weight</label>
                                                <input
                                                    id="cylinderWeight"
                                                    className="text-black border border-gray-300 rounded-md p-2 focus:ring focus:ring-green-300 focus:outline-none"
                                                    type="number"
                                                    min={0}
                                                    value={cylinderWeight}
                                                    onChange={handleGasWeightInputChange}
                                                    placeholder="Enter weight"
                                                />
                                            </div>
                                            <div className="flex flex-col mb-4">
                                                <label className="text-gray-700 font-semibold mb-2" htmlFor="wholesalePrice">Wholesale Selling Price</label>
                                                <input
                                                    id="wholesalePrice"
                                                    className="text-black border border-gray-300 rounded-md p-2 focus:ring focus:ring-green-300 focus:outline-none"
                                                    type="number"
                                                    min={0}
                                                    value={wholeSaleSellingPrice}
                                                    onChange={handleWholeSaleSellingtInputChange}
                                                    placeholder="Enter price"
                                                />
                                            </div>
                                            <div className="flex flex-col mb-4">
                                                <label className="text-gray-700 font-semibold mb-2" htmlFor="wholesalePrice">Filled</label>
                                                <input
                                                    id="wholesalePrice"
                                                    className="text-black border border-gray-300 rounded-md p-2 focus:ring focus:ring-green-300 focus:outline-none"
                                                    type="number"
                                                    min={0}
                                                    value={gasFilled}
                                                    onChange={handleGasFilledInputChange}
                                                    placeholder="Enter price"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex flex-col mb-4">
                                                <label className="text-gray-700 font-semibold mb-2" htmlFor="retailPrice">Retail Selling Price</label>
                                                <input
                                                    id="retailPrice"
                                                    className="text-black border border-gray-300 rounded-md p-2 focus:ring focus:ring-green-300 focus:outline-none"
                                                    type="number"
                                                    min={0}
                                                    value={retailSellingPrice}
                                                    onChange={handleRetailSalesInputChange}
                                                    placeholder="Enter price"
                                                />
                                            </div>
                                            <div className="flex flex-col mb-4">
                                                <label className="text-gray-700 font-semibold mb-2" htmlFor="wholesaleRefill">Wholesale Refilling Price</label>
                                                <input
                                                    id="wholesaleRefill"
                                                    className="text-black border border-gray-300 rounded-md p-2 focus:ring focus:ring-green-300 focus:outline-none"
                                                    type="number"
                                                    min={0}
                                                    value={wholeSaleRefillingPrice}
                                                    onChange={handleWholeSaleRefillingInputChange}
                                                    placeholder="Enter price"
                                                />
                                            </div>
                                            <div className="flex flex-col mb-6">
                                                <label className="text-gray-700 font-semibold mb-2" htmlFor="retailRefill">Retail Refilling Price</label>
                                                <input
                                                    id="retailRefill"
                                                    className="text-black border border-gray-300 rounded-md p-2 focus:ring focus:ring-green-300 focus:outline-none"
                                                    type="number"
                                                    min={0}
                                                    value={retailRefillingPrice}
                                                    onChange={handleRetailFillingInputChange}
                                                    placeholder="Enter price"
                                                />
                                            </div>
                                            <div className="flex flex-col mb-6">
                                                <label className="text-gray-700 font-semibold mb-2" htmlFor="retailRefill">Empties</label>
                                                <input
                                                    id="retailRefill"
                                                    className="text-black border border-gray-300 rounded-md p-2 focus:ring focus:ring-green-300 focus:outline-none"
                                                    type="number"
                                                    min={0}
                                                    value={gasEmpties}
                                                    onChange={handleGasEmptiesInputChange}
                                                    placeholder="Enter empties"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={addNewCylinder}
                                        type="submit"
                                        className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 focus:ring focus:ring-green-300 focus:outline-none"
                                    >
                                        Submit
                                    </button>
                                </form>


                                <form className={`bg-white shadow-lg rounded-lg p-6 w-full max-w-md ${activeForm === 'others' ? 'block' : 'hidden'}`}>
                                    {/* <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Add Cylinder</h2> */}
                                    <div className=' '>
                                        <div>
                                            <div className="flex flex-col mb-4">
                                                <label className="text-gray-700 font-semibold mb-2" htmlFor="cylinderType">Product name</label>
                                                <input
                                                    id=""
                                                    className="text-black border border-gray-300 rounded-md p-2 focus:ring focus:ring-green-300 focus:outline-none"
                                                    type="text"
                                                    value={productName}
                                                    onChange={handleNameInputChange}
                                                    placeholder="Enter product name"
                                                />
                                            </div>
                                            <div className="flex flex-col mb-4">
                                                <label className="text-gray-700 font-semibold mb-2" htmlFor="cylinderWeight">Product Wholesale Price</label>
                                                <input
                                                    id=""
                                                    className="text-black border border-gray-300 rounded-md p-2 focus:ring focus:ring-green-300 focus:outline-none"
                                                    type="number"
                                                    min={0}
                                                    value={productWholeSalePrice}
                                                    onChange={handleProductWholeSalePriceInputChange}
                                                    placeholder="Enter wholesale price"
                                                />
                                            </div>
                                            <div className="flex flex-col mb-4">
                                                <label className="text-gray-700 font-semibold mb-2" htmlFor="wholesalePrice">Product Retail Price</label>
                                                <input
                                                    id=""
                                                    className="text-black border border-gray-300 rounded-md p-2 focus:ring focus:ring-green-300 focus:outline-none"
                                                    type="number"
                                                    min={0}
                                                    value={productRetailPrice}
                                                    onChange={handleProductRetailPriceInputChange}
                                                    placeholder="Enter Retaile Price"
                                                />
                                            </div>
                                            <div className="flex flex-col mb-4">
                                                <label className="text-gray-700 font-semibold mb-2" htmlFor="wholesalePrice">Quantity</label>
                                                <input
                                                    id=""
                                                    className="text-black border border-gray-300 rounded-md p-2 focus:ring focus:ring-green-300 focus:outline-none"
                                                    type="number"
                                                    min={0}
                                                    value={productQuantity}
                                                    onChange={handleProductQuantityInputChange}
                                                    placeholder="Enter quantity"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            {/* <div className="flex flex-col mb-4">
                                                <label className="text-gray-700 font-semibold mb-2" htmlFor="retailPrice">Retail Selling Price</label>
                                                <input
                                                    id="retailPrice"
                                                    className="text-black border border-gray-300 rounded-md p-2 focus:ring focus:ring-green-300 focus:outline-none"
                                                    type="number"
                                                    min={0}
                                                    value={retailSellingPrice}
                                                    onChange={handleRetailSalesInputChange}
                                                    placeholder="Enter price"
                                                />
                                            </div> */}
                                            {/* <div className="flex flex-col mb-4">
                                                <label className="text-gray-700 font-semibold mb-2" htmlFor="wholesaleRefill">Wholesale Refilling Price</label>
                                                <input
                                                    id="wholesaleRefill"
                                                    className="text-black border border-gray-300 rounded-md p-2 focus:ring focus:ring-green-300 focus:outline-none"
                                                    type="number"
                                                    min={0}
                                                    value={wholeSaleRefillingPrice}
                                                    onChange={handleWholeSaleRefillingInputChange}
                                                    placeholder="Enter price"
                                                />
                                            </div> */}
                                            {/* <div className="flex flex-col mb-6">
                                                <label className="text-gray-700 font-semibold mb-2" htmlFor="retailRefill">Retail Refilling Price</label>
                                                <input
                                                    id="retailRefill"
                                                    className="text-black border border-gray-300 rounded-md p-2 focus:ring focus:ring-green-300 focus:outline-none"
                                                    type="number"
                                                    min={0}
                                                    value={retailRefillingPrice}
                                                    onChange={handleRetailFillingInputChange}
                                                    placeholder="Enter price"
                                                />
                                            </div> */}
                                            {/* <div className="flex flex-col mb-6">
                                                <label className="text-gray-700 font-semibold mb-2" htmlFor="retailRefill">Empties</label>
                                                <input
                                                    id="retailRefill"
                                                    className="text-black border border-gray-300 rounded-md p-2 focus:ring focus:ring-green-300 focus:outline-none"
                                                    type="number"
                                                    min={0}
                                                    value={gasEmpties}
                                                    onChange={handleGasEmptiesInputChange}
                                                    placeholder="Enter empties"
                                                />
                                            </div> */}
                                        </div>
                                    </div>
                                    <button
                                        onClick={addOtherProducts}
                                        type="submit"
                                        className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 focus:ring focus:ring-green-300 focus:outline-none"
                                    >
                                        Submit
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Dialog
                fullScreen={fullScreen}
                open={openAssign}
                TransitionComponent={Transition}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {"Refill the empties. Current empties"} {selectedEmpties} {"cylinders. Id is"} {refillId}
                </DialogTitle>
                <DialogContent>
                    <form>
                        <div className=' flex flex-col'>
                            <label>Enter the number of cylinders</label>
                            <input className=' border border-green-600 outline-none px-2'
                                type='number'
                                max={selectedEmpties}
                                min={0}
                                value={refillValue}
                                onChange={handleRefillValueInputChange}
                            />
                        </div>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button className=' !bg-pink-700 !text-white' autoFocus onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button className=' !bg-green-600 !text-white' onClick={handleRefill} autoFocus>
                        Refill
                    </Button>
                </DialogActions>
            </Dialog>


            <Dialog
                fullScreen={fullScreen}
                open={openSell}
                TransitionComponent={Transition}
                onClose={handleCloseSellDialogue}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {"Sell "}
                </DialogTitle>
                <DialogContent>
                    <form
                        className=" flex flex-col justify-center px-4 bg-slate-300 py-5 mx-2 rounded-lg mt-3"
                        onSubmit={handleSubmit}
                    >
                        <div className=' flex space-x-5'>
                            <div className=' flex flex-col'>
                                <label>Customer Name</label>
                                <input
                                    name={customerName}
                                    type="text"
                                    className="px-2 border-solid outline-none border-gray-500 border-2"
                                    onChange={handleCustomerNameInput}
                                />
                                <label>Customer Location</label>
                                <input
                                    name={customerLocation}
                                    className=" px-2 border-solid outline-none border-gray-500 border-2"
                                    type="text"
                                    onChange={handleCustomerLocationInput}
                                />
                                <label>Customer Phone</label>
                                <input
                                    onChange={handleCustomerPhoneInput}
                                    name={customerPhone}
                                    className="px-2 border-solid outline-none border-gray-500 border-2"
                                    type="text"
                                />
                            </div>


                            <div>
                                <div className="flex flex-col">
                                    <div className="flex flex-col ">

                                        <label className=' font-bold underline'>Choose Sale Type:</label>

                                        <div className='flex items-center space-x-3  mb-3 border border-gray-500 justify-center bg-green-400'>
                                            <div className="flex items-center mb-3 space-x-1">
                                                <label>WholeSale</label>
                                                <input
                                                    type="radio"
                                                    id="wholeSale"
                                                    name="salesTyleWholeSaleRetail"
                                                    value="WHOLESALE"
                                                    checked={salesTyleWholeSaleRetail === "WHOLESALE"}
                                                    onChange={() => setSalesTyleWholeSaleRetail("WHOLESALE")}
                                                />
                                            </div>
                                            <div className="flex items-center space-x-1 ">
                                                <label>Retail</label>
                                                <input
                                                    type="radio"
                                                    id="RETAIL"
                                                    name="salesTyleWholeSaleRetail"
                                                    value="RETAIL"
                                                    checked={salesTyleWholeSaleRetail === "RETAIL"}
                                                    onChange={() => setSalesTyleWholeSaleRetail("RETAIL")}
                                                />
                                            </div>
                                        </div>
                                        <div>

                                            <div className="flex items-center gap-1">
                                                <label>Complete Sale</label>
                                                <input
                                                    type="radio"
                                                    id="completeSale"
                                                    name="saleType"
                                                    value="COMPLETESALE"
                                                    checked={saleType === "COMPLETESALE"}
                                                    onChange={() => setSaleType("COMPLETESALE")}
                                                />
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <label>Refill Sale</label>
                                                <input
                                                    type="radio"
                                                    id="REFILL"
                                                    name="saleType"
                                                    value="REFILL"
                                                    checked={saleType === "REFILL"}
                                                    onChange={() => setSaleType("REFILL")}
                                                />
                                            </div>
                                        </div>

                                    </div>

                                    <label>Quantity</label>
                                    <input
                                        type="number"
                                        className="px-2 border-solid outline-none border-gray-500 border-2"
                                        value={quantity}
                                        onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                                    />
                                    <div className="flex gap-2">
                                        <h3>Total Amount:</h3>
                                        <h5>Ksh{calculateTotalAmount()}</h5>
                                    </div>
                                    <div className=" flex gap-2">
                                        <label>Fully Paid?</label>
                                        <div className=" flex items-center gap-1">
                                            <label>Yes</label>
                                            <input
                                                type="radio"
                                                id="html"
                                                name="fullyPaid"
                                                value="Yes"
                                                checked={fullyPaid}
                                                onChange={() => setFullyPaid(true)}
                                            />
                                        </div>
                                        <div className=" flex items-center gap-1">
                                            <label>No</label>
                                            <input
                                                type="radio"
                                                name="fullyPaid"
                                                value="No"
                                                checked={!fullyPaid}
                                                onChange={() => setFullyPaid(false)}
                                            />
                                        </div>
                                    </div>
                                    {renderDepositAndTotalDebt()}
                                </div>
                                <div className=" flex flex-col">
                                    <label>Exchanged with Local?</label>
                                    <div className=" flex items-center gap-1">
                                        <label>Yes</label>
                                        <input
                                            type="radio"
                                            id="exchangedYes"
                                            name="exchangedWithLocal"
                                            checked={isExhanged}
                                            onChange={() => setIsExchanged(true)}
                                        />
                                    </div>
                                    <div className=" flex items-center gap-1">
                                        <label>No</label>
                                        <input
                                            type="radio"
                                            id="exchangedNo"
                                            name="exchangedWithLocal"
                                            checked={!isExhanged}
                                            onChange={() => setIsExchanged(false)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>



                        <button className=" bg-gray-500 text-white font-semibold border-r-4">
                            Submit
                        </button>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button className=' !bg-pink-700 !text-white' autoFocus onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button className=' !bg-green-600 !text-white' onClick={handleRefill} autoFocus>
                        Refill
                    </Button>
                </DialogActions>
            </Dialog>


            <Dialog
                fullScreen={fullScreen}
                open={openUpdateCylinder}
                TransitionComponent={Transition}
                onClose={handleCloseUpdateCylinder}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {"update"} {updateCylinderName}
                </DialogTitle>
                <DialogContent>
                    <form
                        className=" flex flex-col justify-center px-4 bg-slate-300 py-5 mx-2 rounded-lg mt-3"
                        onSubmit={handleSubmit}
                    >
                        <div className=' '>
                            <div className=' flex flex-col space-y-2'>
                                <label>Cylinder</label>
                                <input
                                    type="text"
                                    className="px-2 border-solid outline-none border-gray-500 border-2"
                                    value={updateCylinderName}
                                    onChange={handleUpdateCylinderNameInputChange}
                                />

                            </div>
                        </div>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button className=' !bg-pink-700 !text-white' autoFocus onClick={handleCloseUpdateCylinder}>
                        Cancel
                    </Button>
                    {/* {updatingCylinderStatus === 'loading' && ( */}
                    <Button className=' !bg-green-600 !text-white' onClick={handleUpdateCylinder} autoFocus>
                        update
                    </Button>

                    {/* {updatingCylinderStatus === "idle" && (
                        <Button  className=' !bg-green-600 !text-white' onClick={handleUpdateCylinder} autoFocus>
                        update
                    </Button>
                    ) } */}
                    {/* {updatingCylinderStatus === "idle" && (
                        <Button  className=' !bg-green-600 !text-white' onClick={handleUpdateCylinder} autoFocus>
                        update
                    </Button>
                    ) } */}


                </DialogActions>
            </Dialog>


            <Dialog
                fullScreen={fullScreen}
                open={openAddAnotherCylinder}
                TransitionComponent={Transition}
                onClose={handleCloseAddAnotherCylinder}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {"Add another cylinder to"} {anotherCylinderName}
                </DialogTitle>
                <DialogContent>
                    <form
                        className=" flex flex-col justify-center px-4 bg-slate-300 py-5 mx-2 rounded-lg mt-3"
                        onSubmit={handleSubmit}
                    >
                        <div className=' flex space-x-5'>
                            <div className=' flex flex-col'>
                                <label>Weight</label>
                                <input
                                    min={0}
                                    type="number"
                                    className="px-2 border-solid outline-none border-gray-500 border-2"
                                    onChange={handleAnotherCylinderWeightInputChange}
                                    value={anotherCylinderWeight}
                                />
                                <label>Filled</label>
                                <input
                                    min={0}
                                    className=" px-2 border-solid outline-none border-gray-500 border-2"
                                    type="number"
                                    value={anotherCylinderFilled}
                                    onChange={handleAnotherCylinderFilledInputChange}
                                />
                                <label>Empties</label>
                                <input
                                    // onChange={handleCustomerPhoneInput}
                                    min={0}
                                    className="px-2 border-solid outline-none border-gray-500 border-2"
                                    type="number"
                                    value={anotherCylinderEmpties}
                                    onChange={handleAnotherCylinderEmptyInputChange}
                                />
                                <label>Spoiled</label>
                                <input
                                    // onChange={handleCustomerPhoneInput}
                                    min={0}
                                    className="px-2 border-solid outline-none border-gray-500 border-2"
                                    type="number"
                                    value={anotherCylinderSpoiled}
                                    onChange={handleAnotherCylinderSpoiledInputChange}
                                />
                            </div>


                            <div>
                                <div className="flex flex-col">
                                    <label>wholesale selling price</label>
                                    <input
                                        type="number"
                                        className="px-2 border-solid outline-none border-gray-500 border-2"
                                        min={0}
                                        value={anotherCylinderWholeSaleSelling}
                                        onChange={handleAnotherCylinderWholesaleSellingInputChange}
                                    />
                                    <label>wholesale refill price</label>
                                    <input
                                        type="number"
                                        className="px-2 border-solid outline-none border-gray-500 border-2"
                                        min={0}
                                        value={anotherCylinderWholeSaleRefill}
                                        onChange={handleAnotherCylinderWholesaleRefillingInputChange}
                                    />
                                    <label>retail selling price</label>
                                    <input
                                        type="number"
                                        className="px-2 border-solid outline-none border-gray-500 border-2"
                                        min={0}
                                        value={anotherCylinderRetailSelling}
                                        onChange={handleAnotherCylinderRetailSellingInputChange}
                                    />
                                    <label>retail refill price</label>
                                    <input
                                        type="number"
                                        className="px-2 border-solid outline-none border-gray-500 border-2"
                                        min={0}
                                        value={anotherCylinderRetailRefill}
                                        onChange={handleAnotherCylinderRetailRefillInputChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button className=' !bg-pink-700 !text-white' autoFocus onClick={handleCloseAddAnotherCylinder}>
                        Cancel
                    </Button>
                    <Button className=' !bg-green-600 !text-white' onClick={handleAddAnotherCylinder} autoFocus>
                        Refill
                    </Button>
                </DialogActions>
            </Dialog>


            <Dialog
                fullScreen={fullScreen}
                open={openDeleteCylinder}
                TransitionComponent={Transition}
                onClose={handleCloseDeleteCylinder}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {"Delete cylinder "} {deleteCylinderName}
                </DialogTitle>
                <DialogContent>
                    <h4>Are you sure you want to delete <span className=' font-bold'>{deleteCylinderName}</span> permanetly?</h4>
                </DialogContent>
                <DialogActions>
                    <Button className=' !bg-pink-700 !text-white' autoFocus onClick={handleCloseDeleteCylinder}>
                        Cancel
                    </Button>
                    <Button className=' !bg-red-600 !text-white' onClick={handleDeleteCylinder} autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>



            <Dialog
                fullScreen={fullScreen}
                open={openUpdateCylinderData}
                TransitionComponent={Transition}
                onClose={handleCloseUpdateCylinderData}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {/* {"Add another cylinder to"} {anotherCylinderName} */}
                    {"update"} {updateCylinderDataName} {updateCylinderData?.weight?.weight}{"kg cylinder"}
                </DialogTitle>
                <DialogContent>
                    <form
                        className=" flex flex-col justify-center px-4 bg-slate-300 py-5 mx-2 rounded-lg mt-3"
                        onSubmit={handleSubmit}
                    >
                        <div className=' flex space-x-5'>
                            <div className=' flex flex-col'>
                                <label>Weight</label>
                                <input
                                    min={0}
                                    type="number"
                                    className="px-2 border-solid outline-none border-gray-500 border-2"
                                    onChange={handleUpdateCylinderDataWeightInputChange}
                                    value={updateCylinderDataWeight}
                                />
                                <label>Filled</label>
                                <input
                                    min={0}
                                    className=" px-2 border-solid outline-none border-gray-500 border-2"
                                    type="number"
                                    value={updateCylinderDataFilled}
                                    onChange={handleUpdateCylinderDataFilledInputChange}
                                />
                                <label>Empties</label>
                                <input
                                    // onChange={handleCustomerPhoneInput}
                                    min={0}
                                    className="px-2 border-solid outline-none border-gray-500 border-2"
                                    type="number"
                                    value={updateCylinderDataEmpties}
                                    onChange={handleUpdateCylinderDataEmptiesInputChange}
                                />
                                <label>Spoiled</label>
                                <input
                                    // onChange={handleCustomerPhoneInput}
                                    min={0}
                                    className="px-2 border-solid outline-none border-gray-500 border-2"
                                    type="number"
                                    value={updateCylinderDataSpoiled}
                                    onChange={handleUpdateCylinderDataSpoiledInputChange}
                                />
                            </div>


                            <div>
                                <div className="flex flex-col">
                                    <label>wholesale selling price</label>
                                    <input
                                        type="number"
                                        className="px-2 border-solid outline-none border-gray-500 border-2"
                                        min={0}
                                        value={updateCylinderDataWholesaleSelling}
                                        onChange={handleUpdateCylinderDataWholeSaleSellingInputChange}
                                    />
                                    <label>wholesale refill price</label>
                                    <input
                                        type="number"
                                        className="px-2 border-solid outline-none border-gray-500 border-2"
                                        min={0}
                                        value={updateCylinderDataWholesaleRefill}
                                        onChange={handleUpdateCylinderDataWholeSaleRefillInputChange}
                                    />
                                    <label>retail selling price</label>
                                    <input
                                        type="number"
                                        className="px-2 border-solid outline-none border-gray-500 border-2"
                                        min={0}
                                        value={updateCylinderDataRetailSelling}
                                        onChange={handleUpdateCylinderDataRetailSellingInputChange}
                                    />
                                    <label>retail refill price</label>
                                    <input
                                        type="number"
                                        className="px-2 border-solid outline-none border-gray-500 border-2"
                                        min={0}
                                        value={updateCylinderDataRetailRefill}
                                        onChange={handleUpdateCylinderDataRetailRefillInputChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button className=' !bg-pink-700 !text-white' autoFocus onClick={handleCloseUpdateCylinderData}>
                        Cancel
                    </Button>
                    <Button className=' !bg-green-600 !text-white' onClick={handleAddAnotherCylinder} autoFocus>
                        update
                    </Button>
                </DialogActions>
            </Dialog>


            <Dialog
                fullScreen={fullScreen}
                open={openDeleteCylinderData}
                TransitionComponent={Transition}
                onClose={handleCloseDeleteCylinderData}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {"Delete cylinder "} {deleteCylinderDataName} {deleteCylinderDataWeight}{"kg"}
                </DialogTitle>
                <DialogContent>
                    <h4>Are you sure you want to delete <span className=' font-bold'>{deleteCylinderDataName}</span> permanetly?</h4>
                </DialogContent>
                <DialogActions>
                    <Button className=' !bg-pink-700 !text-white' autoFocus onClick={handleCloseDeleteCylinderData}>
                        Cancel
                    </Button>
                    <Button className=' !bg-red-600 !text-white' onClick={handleDeleteCylinder} autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    )
}
export default Store