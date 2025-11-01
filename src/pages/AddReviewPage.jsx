import React, { useState } from "react";
import {
  Container,
  Form,
  Button,
  Card,
  Spinner,
  ListGroup,
  Image,
  Alert,
  Row,
  Col,
  InputGroup,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import StarRatingInput from "../components/common/StarRatingInput";
import { toast } from "react-toastify";

const AddReviewPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [searchYear, setSearchYear] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [genre, setGenre] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fungsi untuk mencari film
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    setIsLoading(true);
    setError(null);
    setSearchResults([]);
    
    try {
      const params = new URLSearchParams({ query: searchQuery });
      
      if (searchYear) {
        params.append("year", searchYear);
      }

      const response = await fetch(
        `/api/tmdb/search?${params.toString()}`
      );

      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      setError("Failed to search movies.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectMovie = async (movie) => {
    setIsLoading(true);
    setError(null);
    setSearchResults([]);

    try {
      const response = await fetch(
        `/api/tmdb/details?id=${movie.id}&type=${movie.media_type}`
      );

      if (!response.ok) throw new Error("Failed to fetch movie details.");

      const fullDetails = await response.json();

      setSelectedMovie(fullDetails);
      setGenre(fullDetails.genre);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi untuk submit review akhir
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem("token");

    const newReview = {
      tmdb_id: selectedMovie.id,
      title: selectedMovie.title,
      poster_url: selectedMovie.poster_url,
      backdrop_url: selectedMovie.backdrop_url,
      release_year: selectedMovie.release_year,
      review_text: reviewText,
      rating: rating,
      genre: genre,
      media_type: selectedMovie.media_type,
    };

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify(newReview),
      });
      if (!response.ok) throw new Error("Failed to submit review.");
      toast.success("Review added!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditorChange = (content, editor) => {
    setReviewText(content);
  };

  return (
    <Container className="my-5" style={{ maxWidth: "800px" }}>
      {!selectedMovie ? (
        <Card>
          <Card.Header as="h2">Find a Movie to Review</Card.Header>
          <Card.Body>
            <Form onSubmit={handleSearch} className="mb-3">
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Search movie or TV show by title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  required
                />
                <Form.Control
                  type="number"
                  placeholder="Year (Optional)"
                  value={searchYear}
                  onChange={(e) => setSearchYear(e.target.value)}
                  style={{ maxWidth: "120px" }} // Buat input tahun lebih kecil
                />
                <Button variant="primary" type="submit" disabled={isLoading}>
                  Search
                </Button>
              </InputGroup>
            </Form>
            {searchResults.length > 0 && (
              <ListGroup className="mt-4">
                {searchResults.map((movie) => (
                  <ListGroup.Item
                    key={movie.id}
                    action
                    onClick={() => handleSelectMovie(movie)}
                    className="d-flex align-items-center"
                  >
                    <Image
                      src={movie.poster_url}
                      rounded
                      width={50}
                      className="me-3"
                    />
                    <div>
                      <strong>{movie.title}</strong> ({movie.release_year})
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Card.Body>
        </Card>
      ) : (
        // Tampilan Kedua: FORM REVIEW
        <Card>
          <Card.Header as="h2">
            Write a Review for: {selectedMovie.title}
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmitReview}>
              <Form.Group className="mb-3">
                <StarRatingInput rating={rating} onRatingChange={setRating} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Genre</Form.Label>
                <Form.Control
                  type="text"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  placeholder="e.g., Action, Sci-Fi"
                  required
                  readOnly
                  disabled
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Your Review</Form.Label>
                <Editor
                  apiKey="bpdbhxsf4jhk0hcwbi7ueooc7w7sgljtm9yisj3qz8pjqucm"
                  value={reviewText}
                  onEditorChange={handleEditorChange} // Gunakan handler ini
                  init={{
                    height: 300,
                    menubar: false,
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "image",
                      "charmap",
                      "preview",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "code",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                      "code",
                      "help",
                      "wordcount",
                    ],
                    // Tentukan tombol-tombolnya, termasuk alignment
                    toolbar:
                      "undo redo | formatselect | bold italic | " +
                      "alignleft aligncenter alignright alignjustify | " +
                      "bullist numlist outdent indent | removeformat | help",
                  }}
                />
              </Form.Group>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Spinner size="sm" /> : "Submit Review"}
              </Button>
              <Button
                variant="secondary"
                onClick={() => setSelectedMovie(null)}
                className="ms-2"
              >
                Choose a different movie
              </Button>
            </Form>
          </Card.Body>
        </Card>
      )}
      {error && (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      )}
    </Container>
  );
};

export default AddReviewPage;
