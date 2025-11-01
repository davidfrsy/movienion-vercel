import React, { useState } from "react";
import {
  Container,
  Form,
  Button,
  Spinner,
  Alert,
  Card,
  Row,
  Col,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const { name, email, password, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const resRegister = await fetch(
        "/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        }
      );

      const dataRegister = await resRegister.json();
      if (!resRegister.ok)
        throw new Error(dataRegister.error || "Failed to register.");

      const resLogin = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const dataLogin = await resLogin.json();
      if (!resLogin.ok)
        throw new Error(dataLogin.error || "Failed to login after register.");

      login(dataLogin.token);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={4}>
          <Card>
            <Card.Body className="p-4">
              <h2 className="text-center mb-4">Create an Account</h2>
              <Form onSubmit={handleSubmit}>
                {error && <Alert variant="danger">{error}</Alert>}

                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                  />
                </Form.Group>

                <Form.Group
                  className="mb-3"
                  controlId="formBasicConfirmPassword"
                >
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                    required
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button variant="primary" type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <Spinner as="span" animation="border" size="sm" />
                    ) : (
                      "Register"
                    )}
                  </Button>
                </div>
              </Form>
              <div className="mt-3 text-center">
                Already have an account? <Link to="/login">Login here</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;
