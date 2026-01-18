// @ts-nocheck
import React from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAppSelector } from "./app/hooks"
import {
  selectIsAuthenticated,
  selectUserRole, // ✅ USE THIS INSTEAD - gets actual role
} from "./features/auths/authSlice"
import planStatus from "./features/planStatus/planStatus"
import { selectBusinessId } from "./features/plans/planStatusSlice"

// All possible roles from backend
type UserRole =
  | "SUPER_ADMIN"
  | "COMPANY_ADMIN"
  | "SHOP_ATTENDANT"
  | "DELIVERY_GUY"
  | "STORE_MAN"
  | "SECURITY"
  | "TRUCK_DRIVER"
  | "CONDUCTOR"
  | "SALES_PERSON"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole | UserRole[] | "is_admin" | "is_employee"
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const userRole = useAppSelector(selectUserRole) // ✅ This gets the actual role like "SALES_PERSON"
  const location = useLocation()

  // Get plan status from Redux store
  const { isExpired, businessId, subscriptionPlan } = useAppSelector(
    (state) =>
      state.planStatus || {
        isExpired: false,
        businessId: null,
        subscriptionPlan: null,
      },
  )
  // const businessIsId = useAppSelector(selectBusinessId)
  // console.log('expirarion ', businessId)

  // 🐛 DEBUG: Log authentication state (remove after testing)
  console.log("🔍 ProtectedRoute Debug:", {
    isAuthenticated,
    userRole,
    requiredRole,
    pathname: location.pathname,
  })

  // 🔐 Step 1: Check if user is authenticated
  if (!isAuthenticated) {
    console.log("❌ Not authenticated, redirecting to login")
    return <Navigate to="/login" replace />
  }

  // 🔐 Step 1.5: Check if userRole is loaded
  if (!userRole || userRole === "guest") {
    console.log("⏳ User role not loaded yet, waiting...")
    return <div>Loading...</div>
  }

  // Define employee and admin roles
  const employeeRoles: UserRole[] = [
    "SHOP_ATTENDANT",
    "DELIVERY_GUY",
    "STORE_MAN",
    "SECURITY",
    "TRUCK_DRIVER",
    "CONDUCTOR",
    "SALES_PERSON",
  ]

  const adminRoles: UserRole[] = ["SUPER_ADMIN", "COMPANY_ADMIN"]

  // 🎯 Step 2: Determine allowed roles for this route
  let allowedRoles: UserRole[] | null = null

  if (requiredRole === "is_admin") {
    allowedRoles = adminRoles
  } else if (requiredRole === "is_employee") {
    allowedRoles = employeeRoles
  } else if (Array.isArray(requiredRole)) {
    allowedRoles = requiredRole
  } else if (requiredRole) {
    allowedRoles = [requiredRole]
  }

  // 🚫 Step 3: Check role authorization
  // If route has role requirements AND user's role is NOT in allowed roles
  if (allowedRoles && !allowedRoles.includes(userRole as UserRole)) {
    console.log(
      `❌ User role ${userRole} not allowed. Required: ${allowedRoles.join(
        ", ",
      )}`,
    )

    // User doesn't have permission - redirect to their home page
    if (adminRoles.includes(userRole as UserRole)) {
      return <Navigate to="/admins" replace />
    } else if (employeeRoles.includes(userRole as UserRole)) {
      return <Navigate to="/sales" replace />
    } else {
      // Unknown role - send to login
      return <Navigate to="/login" replace />
    }
  }

  // 🛑 Step 4: Admin-specific restrictions
  const isAdmin = adminRoles.includes(userRole as UserRole)

  // Block admins with no business (except /settings)
  if (isAdmin && !businessId && location.pathname !== "/settings") {
    console.log("🏢 Admin has no business, redirecting to settings")
    return <Navigate to="/settings" replace />
  }

  // Block admins with expired/no subscription (except /subscribe and /settings)
  if (
    isAdmin &&
    (!subscriptionPlan || isExpired) &&
    location.pathname !== "/subscribe" &&
    location.pathname !== "/settings"
  ) {
    console.log(
      "💳 Admin subscription expired/missing, redirecting to subscribe",
    )
  
    return <Navigate to="/subscribe" replace />
  }

  // ✅ All checks passed - render the protected content
  console.log("✅ Access granted to", location.pathname)
  return <>{children}</>
}

export default ProtectedRoute
