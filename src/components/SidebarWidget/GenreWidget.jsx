import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './SidebarWidget.css';

const GenreWidget = ({ genres }) => {

  const renderContent = () => {
    if (!genres) {
      return <p className="text-muted p-3">Loading genres...</p>;
    }
    if (genres.length === 0) {
      return <p className="text-muted p-3">No genres available.</p>;
    }

    return (
      <Card.Body className="genre-widget-body">
        {genres.map(genre => (
          <Link to={`/search?query=${genre}`} key={genre}>
            <Badge pill bg="light" text="dark" className="genre-badge">
              {genre}
            </Badge>
          </Link>
        ))}
      </Card.Body>
    );
  };

  return (
    <Card className="widget-card mb-4">
      <Card.Header as="h5">Browse by Genre</Card.Header>
      {renderContent()}
    </Card>
  );
};

export default GenreWidget;