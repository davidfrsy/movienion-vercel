import React from "react";
import { Card, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { format } from "date-fns"; //
import "./MovieCard.css";

const MovieCard = ({ movie }) => {
  const reviewDate = format(new Date(movie.created_at), "d MMM yyyy");
  const authorName = movie.users ? movie.users.name : "Anonymous";

  const genres = movie.genre
    ? movie.genre
        .split(",")
        .map((g) => g.trim())
        .slice(0, 2)
    : [];

  return (
    <Card className="movie-card-grid h-100">
      <Link to={`/movie/${movie.slug || movie.id}`} className="card-link">
        <div className="card-img-container">
          <Card.Img
            variant="top"
            src={movie.poster_url}
            className="movie-card-poster"
          />
          <div className="card-rating-badge">
            <FaStar color="#ffc107" className="me-1" />
            {parseFloat(movie.rating).toFixed(1)}
          </div>
        </div>
      </Link>

      <Card.Body className="d-flex flex-column">
        {/* Tampilkan Genre sebagai Badge */}
        {movie.genre && (
          <div className="genre-badge-container mb-2">
          {genres.map((genre, index) => (
            <Badge 
              key={index} 
              bg="secondary" 
              className="genre-badge-item"
            >
              {genre}
            </Badge>
          ))}
        </div>
        )}

        <Card.Title className="card-movie-title">
          <Link to={`/movie/${movie.slug || movie.id}`} className="card-link">
            {movie.title}
          </Link>
        </Card.Title>

        {/* Tampilkan info Penulis dan Tanggal di bagian bawah */}
        <div className="card-meta-info mt-auto">
          <span>By {authorName}</span>
          <span className="meta-dot">·</span>
          <span>{reviewDate}</span>
        </div>
      </Card.Body>
    </Card>
  );
};

export default MovieCard;
