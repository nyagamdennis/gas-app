/* eslint-disable prettier/prettier */
// @ts-nocheck
import React, { Fragment, useEffect, useState } from "react"
import NavBar from "../components/ui/NavBar"
import LeftNav from "../components/ui/LeftNav"
import Products from "../components/Products"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { selectIsAuthenticated } from "../features/auths/authSlice"
import { Link } from "react-router-dom"
import Login from "../components/Login"
import ShortCuts from "../components/ShortCuts"
import { fetchSalesTeamManagement, getSalesTeamManagementStatus, selectAllSalesTeamManagement } from "../features/salesTeam/salesTeamManagementSlice"
import { fetchCustomers } from "../features/customers/customerSlice"
import { fetchDebtors } from "../features/debtors/debtorsSlice"
import { fetchProducts, selectAllProducts } from "../features/product/productSlice"
import { fetchSales } from "../features/sales/salesSlice"
import { Button, Dialog, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import RemoveIcon from '@mui/icons-material/Remove';
import { useTheme } from '@mui/material/styles';
import { TransitionProps } from '@mui/material/transitions';
import Slide from '@mui/material/Slide';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { changeSalesTeamMember, fetchSalesTeam, selectAllSalesTeam } from "../features/salesTeam/salesTeamSlice"



const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const HomePage = () => {

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));



  const isAuthenticated = useAppSelector(selectIsAuthenticated)


  const allTeams = useAppSelector(selectAllSalesTeamManagement);
  const allTeamsStatus = useAppSelector(getSalesTeamManagementStatus)
  const allProducts = useAppSelector(selectAllProducts)

  const allSalesTeam = useAppSelector(selectAllSalesTeam);

  const dispatch = useAppDispatch()



  const [openEmployee, setOpenEmployee] = useState<boolean>(false);
  const [employeeName, setEmployeeName] = useState<string>("");
  const [employeeId, setEmployeeId] = useState<string>("");
  const [openChangeTeam, setOpenChangeTeam] = useState<boolean>(false);
  const [teamId, setTeamId] = useState<string>("");
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");


  const handleChangeTeams = () => {
    console.log('employee id ', selectedTeamId)
    dispatch(changeSalesTeamMember({ userId: employeeId, teamsId: selectedTeamId }))
  }

  const handleOpenChangeTeam = () => {
    setOpenChangeTeam(true);
  }

  const handleCloseChangeTeam = () => {
    setOpenChangeTeam(false);
  }

  const handleOpenEmployee = (employeesName: string, employeeId: string, teamsId: string) => {
    setEmployeeName(employeesName);
    setEmployeeId(employeeId);
    setTeamId(teamsId);
    setOpenEmployee(true);
  }


  const handleCloseEmployee = () => {
    setOpenEmployee(false);
  }


  useEffect(() => {
    dispatch(fetchCustomers());
    dispatch(fetchDebtors());
    dispatch(fetchProducts());
    dispatch(fetchSales());
    dispatch(fetchSalesTeamManagement());
    dispatch(fetchSalesTeam());
  }, [dispatch])





  const groupCylindersByGasType = (assignedCylinders: any) => {
    const grouped = {};

    assignedCylinders.forEach((cylinder: any) => {
      const gasType = cylinder.cylinder_details.gas_type;
      if (!grouped[gasType]) {
        grouped[gasType] = [];
      }
      grouped[gasType].push(cylinder);
    });

    return grouped;
  };

  return (
    <div>
      <>
        <div className="flex gap-1 bg-green text-white h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
          <div className=" w-1/6">
            <LeftNav />
          </div>
          <div className=" w-full">
            <NavBar />
            <div>
              <ShortCuts />
              <div>
                <div className="mt-5 mx-3 bg-slate-600 px-4">
                  <h3 className="font-extrabold text-2xl text-center bg-slate-600 font-serif underline">
                    Sales Record
                  </h3>
                  {allTeams.map((team) => (
                    <div className="bg-slate-400 my-2 p-2 flex space-x-2 justify-between ">
                      <div className="bg-slate-200 p-2">
                        <div className="flex items-center flex-col top-0">
                          <img
                            src={team.profile_image}
                            className="w-20 h-20 rounded-lg object-fill mb-2"
                            alt={team.name}
                          />
                          <h5 className="font-extrabold text-green-800">
                            {team.name}
                          </h5>
                        </div>
                        <div className=" text-black">
                          <div className=" h-36 bg-blue-400 flex flex-col">
                            <div className=" px-2 ">
                              <h5 className=" text-center font-bold text-white underline">
                                Employees
                              </h5>
                              {team.employees.map((employee: any, index: any) => (
                                <p key={employee.id} className=" font-semibold text-white flex justify-between space-x-2 items-center">
                                  <div>
                                    {index + 1}. {employee.first_name} {employee.last_name} +254{" "}
                                    {employee.phone}
                                  </div>
                                  <div>
                                    <RemoveIcon onClick={() => handleOpenEmployee(employee.first_name, employee.id, team.id)} className=" cursor-pointer border border-solid !h-4 !w-4" />
                                  </div>
                                </p>
                              ))}
                            </div>
                          </div>

                        </div>
                      </div>
                      <div>

                      </div>
                      <div>
                        <TableContainer component={Paper}>
                          <Table sx={{ minWidth: 650 }} stickyHeader aria-label='sales table'>
                            <TableHead >
                              <TableRow>
                                <TableCell className='font-bold'>Product</TableCell>
                                <TableCell align='center'>Weight</TableCell>
                                <TableCell align='center'>Assigned</TableCell>
                                <TableCell align='center'>Filled</TableCell>
                                <TableCell align='center'>Empties</TableCell>
                                <TableCell align='center'>Spoiled</TableCell>
                                <TableCell align='center'>Wholesale Refilled</TableCell>
                                <TableCell align='center'>Wholesale sold</TableCell>
                                <TableCell align='center'>Retail Refilled</TableCell>
                                <TableCell align='center'>Retail sold</TableCell>
                                <TableCell align='center'>Action</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {Object.entries(groupCylindersByGasType(team.assigned_cylinders)).map(
                                ([gasType, cylinders], gasTypeIndex) => (
                                  <React.Fragment key={gasTypeIndex}>
                                    {/* Render the first row with the gas type */}
                                    <TableRow>
                                    {/* // @ts-ignore */}
                                      <TableCell rowSpan={cylinders.length} className="font-bold">
                                        {gasType}
                                      </TableCell>
                                      {/* @ts-nocheck */}
                                      <TableCell align="center">{cylinders[0].cylinder_details.weight} kg</TableCell>
                                      <TableCell align="center">{cylinders[0].assigned_quantity}</TableCell>
                                      <TableCell align="center">{cylinders[0].filled}</TableCell>
                                      <TableCell align="center">{cylinders[0].empties}</TableCell>
                                      <TableCell align="center">{cylinders[0].spoiled}</TableCell>
                                      <TableCell align="center">{cylinders[0].wholesale_refilled}</TableCell>
                                      <TableCell align="center">{cylinders[0].wholesale_sold}</TableCell>
                                      <TableCell align="center">{cylinders[0].retail_refilled}</TableCell>
                                      <TableCell align="center">{cylinders[0].retail_sold}</TableCell>
                                      <TableCell align="center">
                                        <button className="bg-red-500 text-white px-2 py-1 rounded">
                                          Action
                                        </button>
                                      </TableCell>
                                    </TableRow>
                                    {/* Render additional rows for the same gas type */}
                                    {cylinders.slice(1).map((cylinder, cylinderIndex) => (
                                      <TableRow key={cylinderIndex}>
                                        <TableCell align="center">{cylinder.cylinder_details.weight} kg</TableCell>
                                        <TableCell align="center">{cylinder.assigned_quantity}</TableCell>
                                        <TableCell align="center">{cylinder.filled}</TableCell>
                                        <TableCell align="center">{cylinder.empties}</TableCell>
                                        <TableCell align="center">{cylinder.spoiled}</TableCell>
                                        <TableCell align="center">{cylinders[0].wholesale_refilled}</TableCell>
                                        <TableCell align="center">{cylinders[0].wholesale_sold}</TableCell>
                                        <TableCell align="center">{cylinders[0].retail_refilled}</TableCell>
                                        <TableCell align="center">{cylinders[0].retail_sold}</TableCell>
                                        <TableCell align="center">
                                          <button className="bg-red-500 text-white px-2 py-1 rounded">
                                            Action
                                          </button>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </React.Fragment>
                                )
                              )}
                            </TableBody>

                          </Table>
                        </TableContainer>

                      </div>
                    </div>
                  ))}

                </div>
              </div>
            </div>
          </div>
        </div>

      </>

      <Dialog
        fullScreen={fullScreen}
        open={openEmployee}
        TransitionComponent={Transition}
        onClose={handleCloseEmployee}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Action"} {employeeName}
        </DialogTitle>
        <DialogContent>
          <div className=" flex flex-col space-y-2">
            <h4 onClick={handleOpenChangeTeam} className=" border-b border-gray-500 cursor-pointer hover:bg-gray-400">Transfer to deferent sales team.</h4>
            <h4 className="border-b border-gray-500 cursor-pointer hover:bg-gray-400">Suspend.</h4>
            <h4 className="border-b border-gray-500 cursor-pointer hover:bg-gray-400">Fire employee.</h4>
          </div>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEmployee} className=' !bg-pink-700 !text-white' autoFocus >
            Cancel
          </Button>
          {/* <Button className=' !bg-red-600 !text-white'  autoFocus>
                        Delete
                    </Button> */}
        </DialogActions>
      </Dialog>



      <Dialog
        fullScreen={fullScreen}
        open={openChangeTeam}
        TransitionComponent={Transition}
        onClose={handleCloseChangeTeam}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Transfer"} {employeeName} {"to a different sales team"}
        </DialogTitle>
        <DialogContent>
          <div className=" flex flex-col space-y-3">
            {allSalesTeam.filter((team) => team.id !== teamId).map((team) => (
              // {allSalesTeam.map((team) => (
              <h2 key={team.id} onClick={() => setSelectedTeamId(team.id)} className=" text-lg text-center cursor-pointer border-b">{team.name}</h2>
            ))}
          </div>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleChangeTeams} className=' !bg-pink-700 !text-white' autoFocus >
            Transfer
          </Button>
          {/* <Button className=' !bg-red-600 !text-white'  autoFocus>
                        Delete
                    </Button> */}
        </DialogActions>
      </Dialog>
    </div>

  )
}

export default HomePage;