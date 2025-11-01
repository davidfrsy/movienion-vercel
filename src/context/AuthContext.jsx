import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedUser = jwtDecode(token).user; // Baca token
        setUser(decodedUser); // Simpan data user
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    const decodedUser = jwtDecode(token).user;
    setUser(decodedUser); 
    toast.success(`Welcome back, ${decodedUser.name}!`);
    
    if (decodedUser.role === 'admin' || decodedUser.role === 'author') {
      navigate('/dashboard');
    } else {
      navigate('/'); 
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null); 
    toast.success('You have been logged out.');
    navigate('/login');
  };

  const value = {
    user,
    isLoggedIn: !!user, 
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};