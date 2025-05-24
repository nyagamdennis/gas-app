// @ts-nocheck
import React, { useEffect } from "react"
import { Navigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "./app/hooks"
import {
  selectIsAuthenticated,
  selectUserRole,
  selectUserStatus,
} from "./features/auths/authSlice"
import { selectEmployeeVerified } from "./features/employees/employeeStatusSlice"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?:
    | "is_owner"
    | "is_employee"
    | "unverified_employee"
    | Array<"is_owner" | "is_employee" | "unverified_employee">
}




const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const userRole = useAppSelector(selectUserStatus)
  const dispatch = useAppDispatch()


  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Normalize role array
  const allowedRoles = Array.isArray(requiredRole)
    ? requiredRole
    : requiredRole
    ? [requiredRole]
    : null

  // Check if user role is allowed
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Optional: Custom redirect logic per role
    const roleRedirectMap: Record<string, string> = {
      is_owner:  "/admins",
      is_employee: "/sales",
      unverified_employee: "/unverified",
    }

    const redirectPath = roleRedirectMap[userRole] || "/unverified"
    return <Navigate to={redirectPath} replace />
  }

  return <>{children}</>
}

export default ProtectedRoute