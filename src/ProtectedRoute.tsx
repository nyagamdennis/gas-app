// @ts-nocheck
import React from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAppSelector } from "./app/hooks"
import {
  selectIsAuthenticated,
  selectUserRole,
  selectEmailIsVerified, // ✅ Add these selectors to your authSlice
  selectPhoneIsVerified, // ✅ Add these selectors to your authSlice
} from "./features/auths/authSlice"
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

// Routes that should be accessible even without verification
const VERIFICATION_EXEMPT_ROUTES = ["/verify-email", "/logout"]

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const userRole = useAppSelector(selectUserRole)
  const emailIsVerified = useAppSelector(selectEmailIsVerified)
  const phoneIsVerified = useAppSelector(selectPhoneIsVerified)
  const location = useLocation()

  const { isExpired, businessId, subscriptionPlan } = useAppSelector(
    (state) =>
      state.planStatus || {
        isExpired: false,
        businessId: null,
        subscriptionPlan: null,
      },
  )

  
  console.log('is expired:', isExpired)

  console.log("🔍 ProtectedRoute Debug:", {
    isAuthenticated,
    userRole,
    requiredRole,
    emailIsVerified,
    phoneIsVerified,
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

  // 📧 Step 2: Check email & phone verification (skip for exempt routes)
  const isExemptRoute = VERIFICATION_EXEMPT_ROUTES.some((route) =>
    location.pathname.startsWith(route),
  )

  if (isExemptRoute) {
    return <>{children}</>
  }

  // if (!isExemptRoute) {
  if (!emailIsVerified) {
    console.log("📧 Email not verified, redirecting to email verification")
    return <Navigate to="/verify-email" state={{ from: location }} replace />
  }

  if (!phoneIsVerified) {
    console.log("📱 Phone not verified, redirecting to phone verification")
    return <Navigate to="/verify-email" state={{ from: location }} replace />
  }
  // }

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

  // 🎯 Step 3: Determine allowed roles for this route
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

  // 🚫 Step 4: Check role authorization
  if (allowedRoles && !allowedRoles.includes(userRole as UserRole)) {
    console.log(
      `❌ User role ${userRole} not allowed. Required: ${allowedRoles.join(
        ", ",
      )}`,
    )

    if (adminRoles.includes(userRole as UserRole)) {
      return <Navigate to="/admins" replace />
    } else if (employeeRoles.includes(userRole as UserRole)) {
      return <Navigate to="/sales" replace />
    } else {
      return <Navigate to="/login" replace />
    }
  }

  // 🛑 Step 5: Admin-specific restrictions
  const isAdmin = adminRoles.includes(userRole as UserRole)

  // if (isAdmin && !businessId && location.pathname !== "/settings") {
  //   return <Navigate to="/settings" replace />
  // }

  if (isAdmin && !subscriptionPlan && location.pathname !== "/subscribe") {
    return <Navigate to="/subscribe" replace />
  }

  if (isAdmin && !businessId && subscriptionPlan && location.pathname !== "/settings") {
    return <Navigate to="/settings" replace />
  }

  if (
    isAdmin &&
    businessId &&
    (!subscriptionPlan || isExpired) &&
    location.pathname !== "/subscribe" &&
    location.pathname !== "/settings"
  ) {
    console.log(
      "💳 Admin subscription expired/missing, redirecting to subscribe",
    )
    return <Navigate to="/subscribe" replace />
  }

  // ✅ All checks passed
  return <>{children}</>
}

export default ProtectedRoute
