import React, { useState, useEffect } from 'react';
import { Card, Spinner, Alert, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import './SidebarWidget.css'; 

const TopRatedWidget = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopRated = async () => {
      try {
        const response = await fetch('/api/reviews/top-rated');
        if (!response.ok) throw new Error('Failed to fetch top reviews.');
        const data = await response.json();
        setReviews(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTopRated();
  }, []);

  const renderContent = () => {
    if (isLoading) 
    if (error) 
    if (reviews.length === 0) { }

    return (
      <div>
        {reviews.map(review => (
          <Link 
            to={`/movie/${review.slug || review.id}`} 
            key={review.id} 
            className="widget-item-link"
          >
            <Image src={review.poster_url} className="widget-poster" />
            <div className="widget-info">
              <h6 className="widget-title">{review.title}</h6>
              <span className="widget-rating">
                <FaStar color="#ffc107" /> {parseFloat(review.rating).toFixed(1)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <Card className="widget-card">
      <Card.Header as="h5">Top Rated Reviews</Card.Header>
      {renderContent()}
    </Card>
  );
};

export default TopRatedWidget;