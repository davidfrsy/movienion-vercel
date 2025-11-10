import React from 'react';
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useAuth } from '../../context/AuthContext.jsx';
import { FaTachometerAlt, FaUsers, FaPlus, FaHome, FaFilm } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

// Menerima 'isOpen' sebagai prop
const DashboardSidebar = ({ isOpen }) => {
  const { user } = useAuth();

  // Helper untuk Link (agar 'active' class bekerja)
  const SidebarLink = ({ to, icon, text }) => (
    <NavLink to={to} className="nav-link" end>
      {({ isActive }) => (
        <div className={`sidebar-link-content ${isActive ? 'active' : ''}`}>
          {icon}
          {isOpen && <span className="sidebar-link-text">{text}</span>}
        </div>
      )}
    </NavLink>
  );

  return (
    <Nav className="flex-column dashboard-sidebar">
      {/* Header Logo */}
      <div className="sidebar-logo">
        <FaFilm className="logo-icon" />
        {isOpen && <span className="logo-text">Movienion</span>}
      </div>
      
      {/* Menu Utama */}
      <div className="sidebar-menu-group">
        <SidebarLink to="/" icon={<FaHome />} text="Lihat Situs" />
      </div>

      <div className="sidebar-menu-group">
        <div className="sidebar-menu-title">{isOpen ? 'Kelola' : ''}</div>
        <SidebarLink to="/dashboard" icon={<FaTachometerAlt />} text="Review Saya" />
        <SidebarLink to="/dashboard/add" icon={<FaPlus />} text="Tambah Review" />
      </div>

      {/* Menu Admin */}
      {user.role === 'admin' && (
        <div className="sidebar-menu-group">
          <div className="sidebar-menu-title">{isOpen ? 'Administrasi' : ''}</div>
          <SidebarLink to="/dashboard/users" icon={<FaUsers />} text="Kelola User" />
        </div>
      )}
    </Nav>
  );
};

export default DashboardSidebar;