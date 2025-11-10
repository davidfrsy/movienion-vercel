import React, { useState } from 'react';
import { Navbar, Nav, NavDropdown, Button } from 'react-bootstrap';
import { FaBars, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import LogoutModal from '../../components/common/LogoutModal.jsx';

const DashboardHeader = ({ onToggleSidebar, isSidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleConfirmLogout = () => {
    logout();
    setShowModal(false);
    navigate('/'); // Redirect ke home
  };

  return (
    <>
      <Navbar bg="light" expand="lg" className="dashboard-header">
        
        {/* Tombol Toggle Sidebar */}
        <Button 
          variant="light" 
          onClick={onToggleSidebar} 
          className="sidebar-toggle-btn"
          aria-label="Toggle sidebar"
        >
          {/* Ikon berubah tergantung state */}
          {isSidebarOpen ? <FaBars /> : <FaBars />} 
        </Button>

        {/* Menu di kanan */}
        <Nav className="ms-auto">
          <NavDropdown 
            title={
              <>
                <FaUserCircle className="me-1" />
                {user?.name || 'User'}
              </>
            } 
            id="user-dropdown"
            align="end"
          >
            {/* <NavDropdown.Item as={Link} to="/dashboard/profile">Profile</NavDropdown.Item> */}
            {/* <NavDropdown.Divider /> */}
            <NavDropdown.Item onClick={() => setShowModal(true)} className="text-danger">
              <FaSignOutAlt className="me-2" />
              Logout
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar>

      {/* Modal Konfirmasi */}
      <LogoutModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
};

export default DashboardHeader;