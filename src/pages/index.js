import React from 'react';
import { Navbar, Nav, Container, Button, Card, Row, Col } from 'react-bootstrap';

const Index = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Barra de navegación */}
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">Sysne</Navbar.Brand>
          <Nav className="ml-auto">
            <Nav.Link href="/">Inicio</Nav.Link>
            <Nav.Link href="/product">Productos</Nav.Link>
            <Nav.Link href="/user">Usuarios</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      {/* Presentación principal */}
      <Container className="mt-5">
        <Card className="text-center bg-light p-5">
          <Card.Body>
            <Card.Title className="display-4">Bienvenido a Sysne</Card.Title>
            <Card.Text>
              Una plataforma para gestionar productos y usuarios de manera eficiente.
            </Card.Text>
            <Button variant="primary" size="lg" href="/product">
              Ver Productos
            </Button>
          </Card.Body>
        </Card>
      </Container>

      {/* Sección de características */}
      <Container className="mt-5">
        <h2 className="text-center">Características principales</h2>
        <Row className="mt-4">
          <Col xs={12} md={4} className="mb-4">
            <div className="card shadow-sm p-4">
              <h4>Gestión de productos</h4>
              <p>Agrega, edita y elimina productos fácilmente. Mantén tu inventario actualizado al instante.</p>
            </div>
          </Col>
          <Col xs={12} md={4} className="mb-4">
            <div className="card shadow-sm p-4">
              <h4>Gestión de usuarios</h4>
              <p>Crea y gestiona usuarios para el sistema. De una manera rapida</p>
            </div>
          </Col>
          <Col xs={12} md={4} className="mb-4">
            <div className="card shadow-sm p-4">
              <h4>Fácil de usar</h4>
              <p>Una interfaz intuitiva y fácil de usar para que puedas gestionar todo sin complicaciones.</p>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Pie de página */}
      <footer className="bg-dark text-white text-center py-3 mt-auto">
        <p>2025 Sysne.</p>
      </footer>
    </div>
  );
};

export default Index;
