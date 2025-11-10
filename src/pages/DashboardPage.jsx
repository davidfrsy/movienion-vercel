import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Button,
  Spinner,
  Alert,
  Row,
  Col,
  Form,
} from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { toast } from "react-toastify";
import DataTable from "react-data-table-component";

const DashboardPage = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filterText, setFilterText] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyReviews = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          "/api/dashboard/reviews",
          {
            method: "GET",
            headers: {
              "x-auth-token": token,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch reviews or you are not authorized.");
        }

        const data = await response.json();
        setReviews(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyReviews();
  }, [navigate]);

  
  const handleDelete = async (reviewId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this review? This action cannot be undone."
      )
    ) {
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `/api/reviews/${reviewId}`,
        {
          method: "DELETE",
          headers: {
            "x-auth-token": token,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete the review.");
      }

      setReviews((currentReviews) =>
        currentReviews.filter((review) => review.id !== reviewId)
      );
      toast.success("Review deleted successfully!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const filteredItems = reviews.filter(
    (item) =>
      item.title && item.title.toLowerCase().includes(filterText.toLowerCase())
  );

  const columns = [
    {
      name: '#',
      selector: (row, index) => index + 1, 
      width: '50px', 
    },
    {
      name: "Title",
      selector: (row) => row.title,
      sortable: true,
    },
    {
      name: "Rating",
      selector: (row) => row.rating,
      sortable: true,
      width: "100px",
    },
    {
      name: "Year",
      selector: (row) => row.release_year,
      sortable: true,
      width: "100px",
    },
    {
      name: "Genre",
      selector: (row) => row.genre,
      sortable: true,
    },
    {
      name: "Actions",
      width: "250px",
      cell: (
        row 
      ) => (
        <div>
          <Button
            as={Link}
            to={`/movie/${row.slug || row.id}`}
            variant="outline-secondary"
            size="sm"
            className="me-2"
          >
            View
          </Button>
          <Button
            as={Link}
            to={`/dashboard/edit/${row.id}`}
            variant="outline-primary"
            size="sm"
            className="me-2"
          >
            Edit
          </Button>
          <Button
            onClick={() => handleDelete(row.id)}
            variant="outline-danger"
            size="sm"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const subHeaderComponent = useMemo(() => {
    return (
      <Form.Group as={Row} className="g-2">
        <Col xs="auto">
          <Form.Control
            type="text"
            placeholder="Search by title..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </Col>
      </Form.Group>
    );
  }, [filterText]);

  if (isLoading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" />
      </Container>
    );
  }
  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-2">
      <div className="d-flex justify-content-between mb-4">
        <h1>My Reviews</h1>
      </div>

      {isLoading && (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      )}
      {error && <Alert variant="danger">{error}</Alert>}

      {!isLoading && !error && (
        <DataTable
          columns={columns}
          data={filteredItems}
          pagination 
          subHeader 
          subHeaderComponent={subHeaderComponent} 
          persistTableHead 
          highlightOnHover
          striped 
        />
      )}
    </Container>
  );
};

export default DashboardPage;