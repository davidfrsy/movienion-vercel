import React from 'react';
import { Card } from 'react-bootstrap';
import './SidebarWidget.css'; 

const AboutWidget = () => {
  return (
    <Card className="widget-card">
      <Card.Header as="h5">Welcome to Movienion</Card.Header>
      
      <p className="widget-about-text">
        Movienion is your personal movie and TV series review platform. We provide honest and in-depth reviews, written by true fans for true fans. Whether you're looking for your next binge-worthy series or a classic film to revisit, Movienion has got you covered.
      </p>
    </Card>
  );
};

export default AboutWidget;