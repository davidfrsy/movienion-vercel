import React, { useState } from 'react';
import { Form, Button, Spinner, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext.jsx';
import { Link } from 'react-router-dom';

const CommentForm = ({ reviewId, onCommentPosted }) => {
  const { isLoggedIn, user } = useAuth();
  const [body, setBody] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!body.trim()) return;

    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ body: body, review_id: reviewId })
      });

      const newComment = await response.json();
      if (!response.ok) throw new Error(newComment.error || 'Failed to post comment.');

      onCommentPosted(newComment); // Kirim komentar baru ke parent
      setBody(''); // Kosongkan form

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Tampilan jika user belum login
  if (!isLoggedIn) {
    return (
      <Alert variant="secondary" className="text-center">
        You must be <Link to="/login">logged in</Link> to post a comment.
      </Alert>
    );
  }

  return (
    <Form onSubmit={handleSubmit} className="mb-4">
      <Form.Group className="mb-2" controlId="commentBody">
        <Form.Label className="fw-bold">Leave a Comment (as {user.name})</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What are your thoughts on this review?"
          required
        />
      </Form.Group>
      {error && <Alert variant="danger" size="sm">{error}</Alert>}
      <Button variant="primary" type="submit" disabled={isLoading}>
        {isLoading ? <Spinner as="span" animation="border" size="sm" /> : 'Post Comment'}
      </Button>
    </Form>
  );
};

export default CommentForm;