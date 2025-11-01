import React from "react";
import { Card, ListGroup } from "react-bootstrap";
import { format } from "date-fns";

const CommentList = ({ comments }) => {
  if (comments.length === 0) {
    return <p className="text-muted">No comments yet. Be the first!</p>;
  }

  return (
    <ListGroup variant="flush">
      {comments.map((comment) => (
        <ListGroup.Item key={comment.id} className="px-0">
          <div className="d-flex w-100 justify-content-between">
            <h6 className="mb-1 fw-bold">{comment.users.name}</h6>
            <small className="text-muted">
              {format(new Date(comment.created_at), "d MMM yyyy")}
            </small>
          </div>
          <p className="mb-1">{comment.body}</p>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default CommentList;
