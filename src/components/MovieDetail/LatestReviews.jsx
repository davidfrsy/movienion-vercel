import React, { useState, useEffect } from "react";
import { Card, Button, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";

import Carousel from "react-multi-carousel";
import MovieCard from "../LandingPage/MovieCard";

import "react-multi-carousel/lib/styles.css";
import "./LatestReviews.css";

const responsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 1400 }, items: 5 },
  desktop: { breakpoint: { max: 1400, min: 1024 }, items: 4 },
  tablet: { breakpoint: { max: 1024, min: 768 }, items: 3 },
  mobile: { breakpoint: { max: 768, min: 0 }, items: 2 },
};

const LatestReviews = () => {
  // 1. Siapkan state, sama seperti di LandingPage
  const [latestMovies, setLatestMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Fetch data dari endpoint yang spesifik untuk review terbaru
  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const response = await fetch(
          "/api/reviews/latest"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setLatestMovies(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLatest();
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo(0, 0);
  };

  // 3. Handle state loading dan error
  if (isLoading) {
    return (
      <div className="text-center">
        <Spinner animation="border" />
      </div>
    );
  }
  if (error) {
    return <p>Could not load latest reviews: {error}</p>;
  }

  // Jangan tampilkan carousel jika tidak ada review
  if (latestMovies.length === 0) {
    return (
      <div className="text-center">
        <p>No recent reviews yet.</p>
      </div>
    );
  }

  // 4. Tampilkan carousel jika data ada
  return (
    <div className="latest-reviews-section">
      <h2 className="section-title">Latest Reviews</h2>
      <Carousel
        responsive={responsive}
        infinite={true}
        swipeable={true}
        draggable={true}
        keyBoardControl={true}
        containerClass="carousel-container"
        itemClass="carousel-padding-item"
      >
        {latestMovies.map((movie) => (
          <div key={movie.id} onClick={handleScrollToTop}>
            <MovieCard movie={movie} />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default LatestReviews;
