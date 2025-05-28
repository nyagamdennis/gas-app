// @ts-nocheck
import React from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "./app/hooks"
import {
  selectIsAuthenticated,
  selectUserStatus,
} from "./features/auths/authSlice"
import planStatus from "./features/planStatus/planStatus"

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
  const location = useLocation()
  const dispatch = useAppDispatch()

  const {
    isExpired,
    subscriptionPlan,
  } = planStatus()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Normalize role array
  const allowedRoles = Array.isArray(requiredRole)
    ? requiredRole
    : requiredRole
    ? [requiredRole]
    : null

  // Role-based access
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    const roleRedirectMap: Record<string, string> = {
      is_owner: "/admins",
      is_employee: "/sales",
      unverified_employee: "/unverified",
    }

    const redirectPath = roleRedirectMap[userRole] || "/unverified"
    return <Navigate to={redirectPath} replace />
  }

  // ⛔ Block is_owner if no subscription OR plan is expired — except on allowed pages
  const isOwnerRestricted =
    userRole === "is_owner" &&
    (!subscriptionPlan || isExpired) &&
    location.pathname !== "/subscribe" &&
    location.pathname !== "/setting"

  if (isOwnerRestricted) {
    return <Navigate to="/subscribe" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
