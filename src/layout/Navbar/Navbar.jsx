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
import { FaSearch } from "react-icons/fa";
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
                  <>
                    {/* --- TAMPILAN ADMIN / AUTHOR --- */}
                    <NavDropdown title="My Account" id="admin-nav-dropdown">
                      <LinkContainer to="/dashboard">
                        <NavDropdown.Item>Dashboard</NavDropdown.Item>
                      </LinkContainer>

                      {/* Tampilan menu khusus admin */}
                      {user.role === "admin" && (
                        <LinkContainer to="/dashboard/users">
                          <NavDropdown.Item>Manage Users</NavDropdown.Item>
                        </LinkContainer>
                      )}

                      <LinkContainer to="/add-review" className="d-lg-none">
                        <NavDropdown.Item>Add Review</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <NavDropdown.Item onClick={logout}>
                        Logout
                      </NavDropdown.Item>
                    </NavDropdown>
                  </>
                ) : (
                  <>
                    {/* --- TAMPILAN 'user' BIASA --- */}
                    <NavDropdown
                      title={`Hi, ${user.name}`}
                      id="user-nav-dropdown"
                    >
                      <NavDropdown.Item onClick={logout}>
                        Logout
                      </NavDropdown.Item>
                    </NavDropdown>
                  </>
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
