import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { AuthProvider } from "./context/AuthContext.jsx";
import MainLayout from "./layout/MainLayout.jsx";

import LandingPage from "./pages/LandingPage.jsx";
import MovieDetailPage from "./pages/MovieDetailPage.jsx";
import AddReviewPage from "./pages/AddReviewPage.jsx";
import EditReviewPage from "./pages/EditReviewPage.jsx";
import SearchPage from "./pages/SearchPage.jsx";

import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import CategoryPage from "./pages/CategoryPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import UserManagementPage from './pages/UserManagementPage.jsx';

import ProtectedRoute from "./components/auth/ProtectedAuth.jsx";
import GuestRoute from "./components/auth/GuestRoute.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

import "./App.css";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />

        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/movie/:slug" element={<MovieDetailPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/movies" element={<CategoryPage type="movie" />} />
            <Route path="/tv-shows" element={<CategoryPage type="tv" />} />

            <Route element={<GuestRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/add-review" element={<AddReviewPage />} />
              <Route path="/dashboard/edit/:reviewId" element={<EditReviewPage />} />
              <Route path="/dashboard/users" element={<UserManagementPage />} />
            </Route>
          </Route>

          {/* Rute 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
