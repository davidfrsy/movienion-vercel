import React from 'react';
import { Card } from 'react-bootstrap';

const contributors = [
  {
    id: 1,
    name: 'Muhammad David Firmansyah',
    imageUrl: 'https://placehold.co/50x50/EFEFEF/333?text=DF',
  },
  {
    id: 2,
    name: 'Ananda Rafli Pramudya',
    imageUrl: 'https://placehold.co/50x50/EFEFEF/333?text=RP',
  },
];

const ContributorsCard = () => {
  return (
    <Card className="widget-card">
      <Card.Header as="h5">Contributors</Card.Header>
      <Card.Body className='genre-widget-body'>
        {contributors.map((contributor) => (
          <div key={contributor.id} className="contributor-item">
            <img
              src={contributor.imageUrl}
              alt={`Profile of ${contributor.name}`}
              className="contributor-avatar"
            />
            <span className="contributor-name">{contributor.name}</span>
          </div>
        ))}
      </Card.Body>
    </Card>
  );
};

export default ContributorsCard;