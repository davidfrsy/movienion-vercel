import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaArrowUp, FaLinkedin, FaLaptop, FaGlobe, FaGlobeAsia } from "react-icons/fa";
import "./Footer.css"; // Import file CSS kustom kita

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Fungsi untuk menampilkan tombol saat scroll ke bawah sejauh 300px
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Fungsi untuk scroll ke atas halaman
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <footer className="footer bg-dark text-white mt-5">
      <Container className="py-4">
        <Row>
          {/* Kolom 1: Tentang Movienion */}
          <Col md={4} className="mb-3 mb-md-0">
            <h5 className="footer-brand">Movienion</h5>
            <p className="footer-brand-text">
              The best platform to discover and discuss your favorite movies and TV series.
            </p>
          </Col>

          {/* Kolom 2: Quick Links */}
          <Col md={4} className="mb-3 mb-md-0">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/" className="footer-link">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/movies" className="footer-link">
                  Movies
                </Link>
              </li>
              <li>
                <Link to="/tv-shows" className="footer-link">
                  TV Shows
                </Link>
              </li>
            </ul>
          </Col>

          {/* Kolom 3: Media Sosial */}
          <Col md={4}>
            <h5>Follow Us</h5>
            <div className="social-icons">
              <a
                href="https://instagram.com/davidfrsy"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
              >
                <FaInstagram />
              </a>
              <a
                href="https://linkedin.com/in/davidfrsy"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
              >
                <FaLinkedin />
              </a>
              <a
                href="https://davidfr.my.id"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
              >
                <FaGlobeAsia />
              </a>
            </div>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col className="text-center border-top border-secondary pt-3">
            <p className="copyright-text">
              &copy; {new Date().getFullYear()} Movienion. All Rights Reserved.
            </p>
          </Col>
        </Row>
      </Container>

      {/* Tombol Interaktif "Back to Top" */}
      {isVisible && (
        <Button onClick={scrollToTop} className="scroll-to-top">
          <FaArrowUp />
        </Button>
      )}
    </footer>
  );
};

export default Footer;
