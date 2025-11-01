import React, { useState, useEffect } from "react";
import { Container, Form, Button, Card, Spinner, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import StarRatingInput from "../components/common/StarRatingInput";
import { toast } from "react-toastify";

const EditReviewPage = () => {
  const { reviewId } = useParams(); // 1. Ambil ID dari URL
  const navigate = useNavigate();

  // State untuk form
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [movieTitle, setMovieTitle] = useState("");
  const [genre, setGenre] = useState("");

  // State untuk loading/error
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // 2. Ambil data review yang ada saat halaman dimuat
  useEffect(() => {
    const fetchReviewData = async () => {
      try {
        const response = await fetch(
          `/api/reviews/${reviewId}`
        );
        if (!response.ok) throw new Error("Could not fetch review data.");

        const data = await response.json();

        setReviewText(data.review_text);
        setRating(data.rating);
        setMovieTitle(data.title);
        setGenre(data.genre);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviewData();
  }, [reviewId]);

  // 4. Fungsi untuk mengirim perubahan
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `/api/reviews/${reviewId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
          body: JSON.stringify({
            review_text: reviewText,
            rating: rating,
            genre: genre,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update review.");
      }
      
      toast.success('Review updated successfully!');
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditorChange = (content, editor) => {
    setReviewText(content);
  };

  if (isLoading) {
    return (
      <Container className="text-center mt-5">
        <Spinner />
      </Container>
    );
  }

  return (
    <Container className="my-5" style={{ maxWidth: "800px" }}>
      <Card>
        <Card.Header as="h2">Edit Review for: {movieTitle}</Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Your Rating (1-5)</Form.Label>
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
                onEditorChange={handleEditorChange}
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
                  toolbar:
                    "undo redo | formatselect | bold italic | " +
                    "alignleft aligncenter alignright alignjustify | " +
                    "bullist numlist outdent indent | removeformat | help",
                }}
              />
            </Form.Group>

            {error && <Alert variant="danger">{error}</Alert>}

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Spinner size="sm" /> : "Save Changes"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate("/dashboard")}
              className="ms-2"
            >
              Cancel
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EditReviewPage;
