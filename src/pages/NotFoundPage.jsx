import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <Container
      fluid
      className="vh-100 d-flex justify-content-center align-items-center text-center"
      style={{ backgroundColor: "#f8f9fa" }} // Latar belakang abu-abu muda
    >
      <Row>
        <Col>
          <h1
            style={{ fontSize: "6rem", fontWeight: "bold", color: "#343a40" }}
          >
            404
          </h1>
          <h2 className="mb-3" style={{ color: "#495057" }}>
            Page Not Found
          </h2>
          <p className="text-muted mb-4">
            Oops! The page you are looking for does not exist.
          </p>
          <Button as={Link} to="/" variant="primary" size="lg">
            Go Back Home
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFoundPage;
