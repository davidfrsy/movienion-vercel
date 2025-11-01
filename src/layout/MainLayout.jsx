import React from 'react';
import { Outlet } from 'react-router-dom';
import AppNavbar from './Navbar/Navbar';
import Footer from './Footer/Footer';

const MainLayout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppNavbar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;