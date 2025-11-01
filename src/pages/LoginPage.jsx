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
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    34;
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed.");
      }

      login(data.token);
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
              <h2 className="text-center mb-4">Login</h2>
              <Form onSubmit={handleSubmit}>

                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                {error && <Alert variant="danger">{error}</Alert>}

                <div className="d-grid">
                  <Button variant="primary" type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <Spinner as="span" animation="border" size="sm" />
                    ) : (
                      "Login"
                    )}
                  </Button>
                </div>
              </Form>

              <div className="mt-3 text-center">
                Don't have an account? <Link to="/register">Sign up here</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
