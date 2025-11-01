import React, { useState, useEffect } from 'react';
import { Carousel, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './HeroCarousel.css'; // Kita akan perbarui CSS-nya

const HeroCarousel = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        // Kita gunakan API yang sudah ada
        const response = await fetch('/api/reviews/latest');
        if (!response.ok) throw new Error('Failed to fetch hero reviews.');
        const data = await response.json();
        setReviews(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLatest();
  }, []);

  if (isLoading) {
    // Tampilkan placeholder yang tinggi saat loading
    return <div className="hero-placeholder" />;
  }

  if (error || reviews.length === 0) {
    // Jangan tampilkan apa-apa jika error atau kosong
    return null; 
  }

  return (
    <Carousel fade interval={5000} className="hero-carousel">
      {reviews.map(review => (
        <Carousel.Item key={review.id}>
          <Link to={`/movie/${review.id}`}>
            <img
              className="d-block w-100 hero-image"
              src={review.backdrop_url}
              alt={review.title}
            />
            {/* Overlay untuk menggelapkan gambar agar teks terbaca */}
            <div className="hero-overlay" />
            
            <Carousel.Caption className="hero-caption">
              <h3>{review.title}</h3>
              <p>Read our full review</p>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default HeroCarousel;