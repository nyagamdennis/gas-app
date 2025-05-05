// @ts-nocheck
import React, { useEffect } from "react"
import { Navigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "./app/hooks"
import {
  selectIsAuthenticated,
  selectUserRole,
} from "./features/auths/authSlice"
import useMediaQuery from "@mui/material/useMediaQuery"
import getApiUrl from "./getApiUrl"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?:
    | "admin"
    | "employee"
    | "regular_user"
    | Array<"admin" | "employee" | "regular_user">
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const userRole = useAppSelector(selectUserRole)
  const isLargeScreen = useMediaQuery("(min-width:960px)")
  const dispatch = useAppDispatch()
  const apiUrl = getApiUrl()


  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Normalize role array
  const allowedRoles = Array.isArray(requiredRole)
    ? requiredRole
    : requiredRole
    ? [requiredRole]
    : null

  console.log("User role:", userRole)
  // Check if user role is allowed
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Optional: Custom redirect logic per role
    const roleRedirectMap: Record<string, string> = {
      admin:  "/admins",
      employee: "/sales",
      regular_user: "/unverified",
    }

    const redirectPath = roleRedirectMap[userRole] || "/unverified"
    return <Navigate to={redirectPath} replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
