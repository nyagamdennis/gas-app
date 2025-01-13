import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "./app/hooks";
import { selectIsAuthenticated, selectUserRole } from "./features/auths/authSlice";
import useMediaQuery from "@mui/material/useMediaQuery";

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: "admin" | "employee"; // Specify allowed roles
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const userRole = useAppSelector(selectUserRole);
    const isLargeScreen = useMediaQuery("(min-width:960px)");


    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    

    if (requiredRole && userRole !== requiredRole) {
        return <Navigate to="/" />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
