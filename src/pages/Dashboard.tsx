// @ts-nocheck
import { useMediaQuery, useTheme } from "@mui/material"
import React from "react"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { useNavigate } from "react-router-dom"
import planStatus from "../features/planStatus/planStatus"
import Navbar from "../components/ui/mobile/admin/Navbar"
import Slider from "react-slick"
import CurrencyConvert from "../components/CurrencyConvert"
import TrendingUpIcon from "@mui/icons-material/TrendingUp"
import { GiExpense, GiProfit } from "react-icons/gi"
import { FcDebt } from "react-icons/fc"
import { FaDollarSign } from "react-icons/fa"
import Box from "@mui/material/Box"
import { LineChart } from "@mui/x-charts/LineChart"
// import { PieChart } from "@mui/x-charts"
import { PieChart } from "@mui/x-charts/PieChart"
import { BarChart } from '@mui/x-charts/BarChart';
import AdminsFooter from "../components/AdminsFooter"

const Dashboard = () => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  //   const allBusiness = useAppSelector(selectAllBusiness)
  const { isPro, isTrial, isExpired } = planStatus()
  const matches = useMediaQuery("(min-width:600px)")
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  //   useEffect(() => {
  //     dispatch(fetchBusiness())
  //   }, [dispatch])

  var settings = {
    className: "slider variable-width",
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2.2,
          slidesToScroll: 1,
        },
      },
    ],
  }

  const margin = { right: 24 }
  const lData = [4000, 3000, 2000, 2780, 1890, 2390, 3490]
  const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300]
  const xLabels = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July"]

  const desktopOS = [
    {
      label: "Windows",
      value: 72.72,
    },
    {
      label: "OS X",
      value: 16.38,
    },
    {
      label: "Linux",
      value: 3.83,
    },
    {
      label: "Chrome OS",
      value: 2.42,
    },
    {
      label: "Other",
      value: 4.65,
    },
  ]

  const mobileOS = [
    {
      label: "Android",
      value: 70.48,
    },
    {
      label: "iOS",
      value: 28.8,
    },
    {
      label: "Other",
      value: 0.71,
    },
  ]

  const platforms = [
    {
      label: "Mobile",
      value: 59.12,
    },
    {
      label: "Desktop",
      value: 40.88,
    },
  ]

  const normalize = (v: number, v2: number) =>
    Number.parseFloat(((v * v2) / 100).toFixed(2))

  const mobileAndDesktopOS = [
    ...mobileOS.map((v) => ({
      ...v,
      label: v.label === "Other" ? "Other (Mobile)" : v.label,
      value: normalize(v.value, platforms[0].value),
    })),
    ...desktopOS.map((v) => ({
      ...v,
      label: v.label === "Other" ? "Other (Desktop)" : v.label,
      value: normalize(v.value, platforms[1].value),
    })),
  ]

  const chartSetting = {
    yAxis: [
      {
        label: "rainfall (mm)",
        width: 60,
      },
    ],
    height: 300,
  }

  const valueFormatter = (item: { value: number }) => `${item.value}%`


  const dataset = [
  {
    london: 59,
    paris: 57,
    newYork: 86,
    seoul: 21,
    month: 'Jan',
  },
  {
    london: 50,
    paris: 52,
    newYork: 78,
    seoul: 28,
    month: 'Feb',
  },
  {
    london: 47,
    paris: 53,
    newYork: 106,
    seoul: 41,
    month: 'Mar',
  },
  {
    london: 54,
    paris: 56,
    newYork: 92,
    seoul: 73,
    month: 'Apr',
  },
  {
    london: 57,
    paris: 69,
    newYork: 92,
    seoul: 99,
    month: 'May',
  },
  {
    london: 60,
    paris: 63,
    newYork: 103,
    seoul: 144,
    month: 'June',
  },
  {
    london: 59,
    paris: 60,
    newYork: 105,
    seoul: 319,
    month: 'July',
  },
  {
    london: 65,
    paris: 60,
    newYork: 106,
    seoul: 249,
    month: 'Aug',
  },
  {
    london: 51,
    paris: 51,
    newYork: 95,
    seoul: 131,
    month: 'Sept',
  },
  {
    london: 60,
    paris: 65,
    newYork: 97,
    seoul: 55,
    month: 'Oct',
  },
  {
    london: 67,
    paris: 64,
    newYork: 76,
    seoul: 48,
    month: 'Nov',
  },
  {
    london: 61,
    paris: 70,
    newYork: 103,
    seoul: 25,
    month: 'Dec',
  },
];

function valueFormatters(value: number | null) {
  return `${value}mm`;
}
  return (
    <div>
      {isMobile ? (
        <div className="min-h-screen bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] text-gray-800 flex flex-col font-sans">
          <Navbar
            headerMessage={"ERP"}
            headerText={"Manage your operations with style and clarity"}
          />
          <main className="m-2 p-1">
            <div className="slider-container ">
              <Slider {...settings}>
                <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
                  <div className=" flex items-center justify-center">
                    <FaDollarSign
                      className="text-green-500 text-2xl"
                      fontSize=""
                    />
                    <h3 className="text-sm font-semibold mt-2 whitespace-nowrap">Total Revenue</h3>
                  </div>

                  <p className="text-gray-600 font-bold ms-2">
                    <CurrencyConvert price={2000} />
                  </p>
                  <div className="flex items-center space-x-1">
                    <div className="flex items-center mt-2">
                      <TrendingUpIcon className="text-green-500  " />
                      <p className="text-sm text-green-500 ml-1 ">15.2%</p>
                    </div>
                    <p className="text-xs text-gray-500">from last day</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
                  <div className="flex items-center justify-center">
                    <GiProfit className="text-blue-500 text-2xl" />
                    <h3 className="text-sm  font-semibold mt-2">Total Profit</h3>
                  </div>

                  <p className="text-gray-600 font-bold ms-2">
                    <CurrencyConvert price={1500} />
                  </p>
                  <div className="flex items-center space-x-1">
                    <div className="flex items-center mt-2">
                      <TrendingUpIcon className="text-blue-500" />
                      <p className="text-sm text-blue-500 ml-1">10.5%</p>
                    </div>
                    <p className="text-xs text-gray-500">from last day</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
                  <div className="flex items-center justify-center">
                    <GiExpense className="text-red-500" fontSize="large" />
                    <h3 className="text-sm  font-semibold mt-2">
                      Total Expenses
                    </h3>
                  </div>

                  <p className="text-gray-600 font-bold ms-2">
                    <CurrencyConvert price={500} />
                  </p>
                  <div className="flex items-center space-x-1">
                    <div className="flex items-center mt-2">
                      <TrendingUpIcon className="text-red-500" />
                      <p className="text-sm text-red-500 ml-1">5.2%</p>
                    </div>
                    <p className="text-xs text-gray-500">from last day</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
                  <div className="flex items-center justify-center">
                    <FcDebt className="text-yellow-500" fontSize="large" />
                    <h3 className="text-sm  font-semibold mt-2">Total Debt</h3>
                  </div>

                  <p className="text-gray-600 font-bold ms-2">
                    <CurrencyConvert price={300} />
                  </p>
                  <div className="flex items-center space-x-1">
                    <div className="flex items-center mt-2">
                      <TrendingUpIcon className="text-yellow-500" />
                      <p className="text-sm text-yellow-500 ml-1">2.8%</p>
                    </div>
                    <p className="text-xs text-gray-500">from last day</p>
                  </div>
                </div>
              </Slider>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
                <h4>Profit loss overview</h4>
                <div>
                  <Box sx={{ width: "100%", height: 300 }}>
                    <LineChart
                      series={[
                        { data: pData, label: "profit" },
                        { data: lData, label: "loss" },
                      ]}
                      xAxis={[{ scaleType: "point", data: xLabels }]}
                      yAxis={[{ width: 50 }]}
                      margin={margin}
                    />
                  </Box>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
                <h4>Sales analysis</h4>
                <div>
                  <PieChart
                    series={[
                      {
                        data: desktopOS,
                        highlightScope: { fade: "global", highlight: "item" },
                        faded: {
                          innerRadius: 30,
                          additionalRadius: -30,
                          color: "gray",
                        },
                        valueFormatter,
                      },
                    ]}
                    height={200}
                    width={200}
                  />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
                <h4>Sales Team overview</h4>
                <div>
                  <BarChart
                    dataset={dataset}
                    xAxis={[{ dataKey: "month" }]}
                    series={[
                      { dataKey: "london", label: "London", valueFormatters },
                      { dataKey: "paris", label: "Paris", valueFormatters },
                      { dataKey: "newYork", label: "New York", valueFormatters },
                      { dataKey: "seoul", label: "Seoul", valueFormatters },
                    ]}
                    {...chartSetting}
                  />
                </div>
              </div>
            </div>
          </main>
          <footer>
        <AdminsFooter />
      </footer>
        </div>
      ) : (
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white shadow rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2">Sales Overview</h2>
              <p>Placeholder for sales data and charts.</p>
            </div>
            <div className="bg-white shadow rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2">Recent Activities</h2>
              <p>Placeholder for recent activities.</p>
            </div>
            <div className="bg-white shadow rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2">Notifications</h2>
              <p>Placeholder for notifications.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
