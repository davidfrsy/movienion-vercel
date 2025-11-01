import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const GuestRoute = () => {
  const token = localStorage.getItem("token");

  // Jika token ada, arahkan pengguna ke dashboard
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  // Jika tidak ada token, izinkan akses ke rute children
  return <Outlet />;
};

export default GuestRoute;