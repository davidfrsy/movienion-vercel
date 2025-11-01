import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { Spinner } from "react-bootstrap";

const ProtectedRoute = () => {
  const { user, isLoggedIn } = useAuth(); 

  if (isLoggedIn === false && localStorage.getItem("token")) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "user") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
