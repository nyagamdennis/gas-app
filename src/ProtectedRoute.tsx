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
    businessId,
    businessName,
    businessLogo,
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

  // Check if user role is allowed
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    const roleRedirectMap: Record<string, string> = {
      is_owner: "/admins",
      is_employee: "/sales",
      unverified_employee: "/unverified",
    }

    const redirectPath = roleRedirectMap[userRole] || "/unverified"
    return <Navigate to={redirectPath} replace />
  }

  // 🛑 Block owners with NO business from all pages except /setting
  const noBusiness = userRole === "is_owner" && !businessId
  const restrictedToSettingsOnly = noBusiness && location.pathname !== "/settings"
  if (restrictedToSettingsOnly) {
    return <Navigate to="/settings" replace />
  }

  // ⛔ Block owners with no subscription or expired plan from everything except /subscribe or /setting
  const isOwnerRestricted =
    userRole === "is_owner" &&
    (!subscriptionPlan || isExpired) &&
    location.pathname !== "/subscribe" &&
    location.pathname !== "/settings"

  if (isOwnerRestricted) {
    return <Navigate to="/subscribe" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
