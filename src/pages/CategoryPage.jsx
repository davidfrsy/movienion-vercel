import React, { useState, useEffect } from "react";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import MovieCard from "../components/LandingPage/MovieCard";
import "./CategoryPage.css"; 

const CategoryPage = ({ type }) => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const title = type === "movie" ? "Movies" : "TV Shows";

  useEffect(() => {
    setReviews([]);
    setIsLoading(true);
    setError(null);

    const fetchReviews = async () => {
      try {
        const response = await fetch(
          `/api/reviews/type/${type}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch ${title}.`);
        }
        const data = await response.json();
        setReviews(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [type, title]); 

  return (
    <Container className="category-page my-5">
      <header className="category-header text-center mb-4">
        <h2>-- {title} --</h2>
      </header>

      <h3 className="featured-header mb-3">Featured {title}</h3>

      {isLoading && (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      )}
      {error && <Alert variant="danger">{error}</Alert>}

      {!isLoading &&
        !error &&
        (reviews.length > 0 ? (
          <Row xs={2} sm={2} lg={3} xl={4} className="g-3">
            {reviews.map((movie) => (
              <Col key={movie.id}>
                <MovieCard movie={movie} />
              </Col>
            ))}
          </Row>
        ) : (
          <p>No {title} reviews found yet.</p>
        ))}
    </Container>
  );
};

export default CategoryPage;
