// @ts-nocheck
// hooks/useVerificationPolling.ts
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useAppSelector } from "../../app/hooks"
import { exportedUserData } from "../auths/authSlice"
import { fetchEmployeeVerificationStatus } from "./employeeStatusSlice"

const useVerificationPolling = () => {
  const dispatch = useDispatch()
  const user = useAppSelector(exportedUserData)

  useEffect(() => {
    if (user?.is_employee && user.employee_id) {
      const interval = setInterval(() => {
        dispatch(fetchEmployeeVerificationStatus())
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [user?.employee_id, user?.is_employee, dispatch])
}

export default useVerificationPolling
