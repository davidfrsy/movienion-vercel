import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Image, Spinner, Alert } from "react-bootstrap";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import DOMPurify from "dompurify";

import "./MovieDetailPage.css";

import CommentForm from "../components/MovieDetail/CommentForm.jsx";
import CommentList from "../components/MovieDetail/CommentList.jsx";
import RelatedPosts from "../components/MovieDetail/RelatedPosts.jsx";

const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<FaStar key={i} color="#ffc107" />);
    } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
      stars.push(<FaStarHalfAlt key={i} color="#ffc107" />);
    } else {
      stars.push(<FaRegStar key={i} color="#e4e5e9" />);
    }
  }
  return <div className="star-rating">{stars}</div>;
};

const MovieDetailPage = () => {
  const { slug } = useParams();
  const [movie, setMovie] = useState(null);

  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [errorComments, setErrorComments] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        const response = await fetch(
          `/api/reviews/${slug}`
        );
        if (!response.ok) {
          throw new Error("Movie not found");
        }
        const data = await response.json();
        setMovie(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovieDetail();
  }, [slug]);

  useEffect(() => {
    if (!movie) return;

    const fetchComments = async () => {
      setLoadingComments(true);
      setErrorComments(null);
      try {
        const response = await fetch(
          `/api/comments/review/${movie.id}`
        );
        if (!response.ok) throw new Error("Failed to load comments.");
        const data = await response.json();
        setComments(data);
      } catch (err) {
        setErrorComments(err.message);
      } finally {
        setLoadingComments(false);
      }
    };

    fetchComments();
  }, [movie]);

  const handleNewComment = (newComment) => {
    setComments([newComment, ...comments]);
  };

  if (isLoading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error || !movie) {
    return (
      <Container className="text-center mt-5">
        <h2>404 - {error || "Movie Not Found"}</h2>
        <p>We couldn't find the movie you were looking for.</p>
        <Link to="/">Go back to Home</Link>
      </Container>
    );
  }

  const timeAgo = formatDistanceToNow(new Date(movie.created_at), {
    addSuffix: true,
  });

  return (
    <>
      <Container className="movie-detail-container my-5">
        <Row className="justify-content-center">
          <Col md={8}>
            <article>
              <Link to="/" className="back-link">
                &larr; Back to all reviews
              </Link>
              <header className="mb-4">
                <p className="eyebrow-text">REVIEWS</p>
                <h1 className="movie-title">{movie.title}</h1>
                <div className="meta-info">
                  <span>
                    <StarRating rating={parseFloat(movie.rating)} />
                  </span>
                  <span className="meta-separator">|</span>
                  <span>{movie.release_year}</span>
                </div>
                <div className="author-info">
                  By{" "}
                  <span className="author-name">
                    {movie.users ? movie.users.name : "Anonymous"}
                  </span>{" "}
                  | Posted {timeAgo}
                </div>
              </header>

              <div className="text-center my-4">
                <Image
                  src={movie.poster_url}
                  rounded
                  className="movie-detail-poster"
                />
              </div>

              <div
                className="blog-content"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(movie.review_text),
                }}
              />
            </article>
          </Col>
        </Row>

        <Row className="justify-content-center mt-5">
          <Col md={8}>
            <hr />
            <h3 className="mb-4">Comments ({comments.length})</h3>

            <CommentForm
              reviewId={movie.id}
              onCommentPosted={handleNewComment}
            />

            {loadingComments && (
              <div className="text-center">
                <Spinner animation="border" size="sm" />
              </div>
            )}
            {errorComments && <Alert variant="danger">{errorComments}</Alert>}
            {!loadingComments && !errorComments && (
              <CommentList comments={comments} />
            )}
          </Col>
        </Row>
      </Container>
      {movie && (
        <RelatedPosts currentSlug={movie.slug} />
      )}
    </>
  );
};

export default MovieDetailPage;
