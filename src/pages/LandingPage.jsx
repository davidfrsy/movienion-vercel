import React, { useState, useEffect } from "react";
import { Container, Row, Col, Spinner, Pagination } from "react-bootstrap";

import MovieCard from "../components/LandingPage/MovieCard";
import HeroCarousel from "../components/LandingPage/HeroCarousel";
import ContributorsCard from "../components/SidebarWidget/ContributorsCard";

import TopRatedWidget from "../components/SidebarWidget/TopRatedWidget";
import AboutWidget from "../components/SidebarWidget/AboutWidget";  
import GenreWidget from '../components/SidebarWidget/GenreWidget';

const LandingPage = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        const [reviewsResponse, genresResponse] = await Promise.all([
          fetch(`/api/reviews?page=${currentPage}`),
          fetch('/api/genres')
        ]);

        if (!reviewsResponse.ok) {
          throw new Error('Failed to fetch reviews.');
        }
        if (!genresResponse.ok) {
          throw new Error('Failed to fetch genres.'); 
        }

        const reviewsData = await reviewsResponse.json();
        const genresData = await genresResponse.json();

        setMovies(reviewsData.reviews);
        setTotalPages(reviewsData.totalPages);
        setCurrentPage(reviewsData.currentPage);
        setGenres(genresData);
      } catch (e) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [currentPage]);

  const renderPaginationItems = () => {
    let items = [];
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => setCurrentPage(number)} 
        >
          {number}
        </Pagination.Item>
      );
    }
    return items;
  };

  if (isLoading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>Loading Movies...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center mt-5">
        <p>Error fetching data: {error}</p>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-4">
      <HeroCarousel />

      <Container className="my-5">
        <Row>
          {/* Kolom KONTEN UTAMA */}
          <Col md={9} xs={12}>
            <h2 className="mb-4">All Movie Reviews</h2>
            {/* Tambahkan Row di sini untuk membuat grid */}
            <Row xs={2} sm={2} lg={3} xl={4} className="g-3">
              {isLoading ? (
                <div className="w-100 text-center">
                  <Spinner animation="border" />
                </div>
              ) : error ? (
                <p>Error: {error}</p>
              ) : movies.length > 0 ? (
                movies.map((movie) => (
                  <Col key={movie.id}>
                    <MovieCard movie={movie} />
                  </Col>
                ))
              ) : (
                <Col>
                  <p>No movies found. Be the first to add a review!</p>
                </Col>
              )}
            </Row>

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
              <div className="d-flex justify-content-center mt-5">
                <Pagination>{renderPaginationItems()}</Pagination>
              </div>
            )}
          </Col>

          {/* Kolom KANAN */}
          <Col md={3} xs={12} className="mt-4 mt-md-0">
            <TopRatedWidget />
            <AboutWidget />
            <GenreWidget genres={genres} />
            <ContributorsCard />
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default LandingPage;
