import React, { useState } from "react";
import {
  Navbar,
  Nav,
  Container,
  Form,
  Button,
  NavDropdown,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaSignOutAlt, FaTachometerAlt } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext.jsx";
import "./Navbar.css";

const AppNavbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/search?query=${searchQuery}`);
    setSearchQuery("");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>Movienion</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/movies">
              <Nav.Link>Movies</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/tv-shows">
              <Nav.Link>TV Shows</Nav.Link>
            </LinkContainer>
          </Nav>

          <Nav className="ms-auto align-items-center">
            <Form
              onSubmit={handleSearchSubmit}
              className="d-flex me-2 navbar-search-form"
            >
              <div className="search-box-container">
                <Form.Control
                  type="search"
                  placeholder="Search my reviews..."
                  className="me-2 search-input-with-icon"
                  aria-label="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FaSearch className="search-icon" />
              </div>
            </Form>

            {isLoggedIn ? (
              <>
                {/* Cek role */}
                {user.role === "admin" || user.role === "author" ? (
                  <NavDropdown
                    title={`Hi, ${user.name}`}
                    id="admin-nav-dropdown"
                    align="end"
                  >
                    <LinkContainer to="/dashboard">
                      <NavDropdown.Item>
                        <FaTachometerAlt className="me-2" />Dashboard
                      </NavDropdown.Item>
                    </LinkContainer>
                  </NavDropdown>
                ) : (
                  <NavDropdown
                    title={`Hi, ${user.name}`}
                    id="user-nav-dropdown"
                    align="end"
                  >
                    <NavDropdown.Item onClick={logout}>
                      <FaSignOutAlt className="me-2" /> Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                )}
              </>
            ) : (
              <>
                {/* --- TAMPILAN 'guest' (BELUM LOGIN) --- */}
                <LinkContainer to="/login">
                  <Nav.Link>
                    <Button variant="outline-success" size="sm">
                      Login
                    </Button>
                  </Nav.Link>
                </LinkContainer>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
