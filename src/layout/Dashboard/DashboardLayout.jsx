import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar.jsx';
import DashboardHeader from './DashboardHeader.jsx';
import './Dashboard.css'; // Kita akan gunakan CSS ini

const DashboardLayout = () => {
  // State untuk mengelola 'isCollapsed' di desktop dan 'show' di mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Fungsi untuk toggle di desktop
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`dashboard-layout ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      
      {/* 1. SIDEBAR (Selalu ada) */}
      <div className="dashboard-sidebar-wrapper">
        <DashboardSidebar isOpen={isSidebarOpen} />
      </div>

      {/* 2. KONTEN (Header + Halaman) */}
      <div className="dashboard-content-wrapper">
        <DashboardHeader 
          onToggleSidebar={toggleSidebar} 
          isSidebarOpen={isSidebarOpen} 
        />
        
        {/* Area konten halaman */}
        <main className="dashboard-main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;