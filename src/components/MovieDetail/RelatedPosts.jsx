import React, { useState, useEffect } from "react";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import MovieCard from "../LandingPage/MovieCard";

const RelatedPosts = ({ currentSlug }) => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentSlug) return;

    const fetchRelated = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `/api/reviews/related/${currentSlug}`
        );
        if (!response.ok) {
          throw new Error("Gagal memuat postingan terkait.");
        }
        const data = await response.json();
        setReviews(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelated();
  }, [currentSlug]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center">
          <Spinner animation="border" size="sm" />
        </div>
      );
    }
    if (error) {
      return <Alert variant="danger">{error}</Alert>;
    }
    if (reviews.length === 0) {
      return null;
    }

    return reviews.map((movie) => (
      <Col key={movie.id}>
        <MovieCard movie={movie} />
      </Col>
    ));
  };

  if (reviews.length === 0 && !isLoading) {
    return null;
  }

  return (
    <div
      className="related-posts-container py-3"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <Container>
        <h3 className="mb-4">You Might Also Like</h3>
        <Row xs={2} sm={2} lg={3} xl={4} className="g-3">
          {renderContent()}
        </Row>
      </Container>
    </div>
  );
};

export default RelatedPosts;
