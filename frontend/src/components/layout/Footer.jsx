import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white py-5 mt-auto">
      <Container>
        <Row>
          <Col md={4} className="mb-4 mb-md-0">
            <h5 className="fw-bold mb-3"><img
              src={"/favicon.png"}
              alt="Rentora Logo"
              style={{ height: "40px", width: "auto" }}
            />Rentora</h5>
            <p className="text-white-50 text-decoration-none">
              Your trusted partner for vehicle rentals.
            </p>
          </Col>

          <Col md={4} className="mb-4 mb-md-0">
            <h6 className="fw-bold mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-white-50 text-decoration-none">
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/search"
                  className="text-white-50 text-decoration-none"
                >
                  Search
                </Link>
              </li>
            </ul>
          </Col>

          <Col md={4}>
            <h6 className="fw-bold mb-3">Contact</h6>
            <p className="text-white-50 text-decoration-none small">
              Contact us at <a href="mailto:info@rentora.com">info@rentora.com</a>
              <br />
              Phone: +20 100 123 4567
            </p>
          </Col>
        </Row>

        <hr className="my-4 border-secondary" />

        <Row>
          <Col className="text-center text-muted">
            <p className="text-white-50 text-decoration-none">© {currentYear} Renato. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
