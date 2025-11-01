import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert, Pagination } from 'react-bootstrap';
import { useSearchParams, Link } from 'react-router-dom';
import MovieCard from '../components/LandingPage/MovieCard';

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 1. State untuk Paginasi
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');

  // State untuk melacak jika query berubah (untuk mereset halaman)
  const [lastQuery, setLastQuery] = useState(query);

  // 2. useEffect yang diperbarui (lebih kompleks)
  useEffect(() => {
    if (!query) {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }

    let pageToFetch = currentPage;

    // 3. Logika Reset Halaman
    // Jika query-nya baru (bukan cuma ganti halaman), reset ke page 1
    if (query !== lastQuery) {
      pageToFetch = 1;
      setCurrentPage(1);
      setLastQuery(query);
    }

    const fetchSearchResults = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // 4. Perbarui URL Fetch
        const response = await fetch(
          `/api/search?query=${query}&page=${pageToFetch}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch search results.');
        }
        const data = await response.json();
        
        // 5. Set state baru dari objek data
        setSearchResults(data.reviews);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, currentPage, lastQuery]); // <-- Dependensi yang diperbarui

  // 6. Fungsi helper untuk render tombol paginasi
  const renderPaginationItems = () => {
    let items = [];
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item 
          key={number} 
          active={number === currentPage} 
          onClick={() => setCurrentPage(number)} // Ganti state saat diklik
        >
          {number}
        </Pagination.Item>,
      );
    }
    return items;
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={9}>
        <Link to="/" className="back-link mb-3 d-inline-block">
              &larr; Back to All Reviews
            </Link>
          <h2 className="mb-4">Search Results for: "{query}"</h2>
          
          {isLoading && <div className="text-center"><Spinner animation="border" /></div>}
          {error && <Alert variant="danger">{error}</Alert>}
          
          {!isLoading && !error && (
            searchResults.length > 0 ? (
              <>
                <Row xs={2} sm={2} lg={3} xl={4} className="g-3">
                  {searchResults.map(movie => (
                    <Col key={movie.id}>
                      <MovieCard movie={movie} />
                    </Col>
                  ))}
                </Row>
                
                {/* 7. Tambahkan komponen Pagination di bawah grid */}
                {totalPages > 1 && (
                  <div className="d-flex justify-content-center mt-5">
                    <Pagination>{renderPaginationItems()}</Pagination>
                  </div>
                )}
              </>
            ) : (
              <p>No reviews found matching your search.</p>
            )
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default SearchPage;