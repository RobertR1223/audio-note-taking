import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getAccessToken } from "../../utils/token";

const ProtectedRoute = () => {
    const isAuthenticated = !!getAccessToken(); // Check if a token exists

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
