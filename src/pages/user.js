import React, { useEffect, useState } from 'react';
import { createUser, getAllUsers, updateUser, getUser } from '../services/userService'; // Importamos los servicios correspondientes
import { Spinner, Alert, Button, Card, Row, Col, ButtonGroup, Navbar, Nav, Container, Modal, Form } from 'react-bootstrap';
import { format } from 'date-fns';
import ReCAPTCHA from 'react-google-recaptcha';

const User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [editUser, setEditUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [recaptchaToken, setRecaptchaToken] = useState(null);

  const handleCreateUser = async () => {
    if (!name || !email || !password) {
      setError("Por favor, complete todos los campos.");
      return;
    }

    if (!recaptchaToken) {
      setError("Por favor, completa el reCAPTCHA.");
      return;
    }

    try {
      const newUser = await createUser({
        name,
        email,
        password,
        registrationDate: new Date().toISOString()
      });

      // Añadir el nuevo usuario a la lista
      setUsers(prevUsers => [...prevUsers, newUser]);
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error("Error al crear el usuario:", error);
      setError("Fallo la creación del usuario. Por favor, inténtelo de nuevo.");
    }
  };

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
    setError(null); // Restablecer el error cuando se completa el reCAPTCHA
  };

  const handleEditUser = (user) => {
    setName(user.name);
    setEmail(user.email);
    setPassword(user.password);
    setEditUser(user);
    setShowModal(true);
  };

  const handleUpdateUser = async () => {
    if (!name || !email || !password) {
      setError("Por favor, complete todos los campos.");
      return;
    }

    if (!recaptchaToken) {
      setError("Por favor, completa el reCAPTCHA.");
      return;
    }

    try {
      const updatedUser = {
        name,
        email,
        password,
        registrationDate: new Date().toISOString()
      };

      await updateUser(editUser.id, updatedUser);

      // Actualizar el usuario editado en la lista
      setUsers(prevUsers => prevUsers.map(user =>
        user.id === editUser.id ? { ...user, ...updatedUser } : user
      ));
      setShowModal(false);
      setEditUser(null);
      resetForm();
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      setError("Fallo la actualización del usuario. Por favor, inténtelo de nuevo.");
    }
  };

  const handleShowUserDetails = async (id) => {
    try {
      const details = await getUser(id);
      setUserDetails(details);
      setShowDetailsModal(true);
    } catch (error) {
      console.error("Error al obtener los detalles del usuario:", error);
      setError("Fallo la carga de los detalles del usuario.");
    }
  };

  const formatDate = (date) => {
    return format(new Date(date), 'dd/MM/yyyy HH:mm:ss');
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setEditUser(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") setName(value);
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);

    setError(null); // Restablecer el error al cambiar cualquier campo del formulario
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error("Error al cargar los usuarios:", error);
        setError("Fallo la carga de los usuarios. Por favor reinicia.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <>
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

      <div className="d-flex flex-column min-vh-100">
        <div className="container mt-4 flex-grow-1">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Lista de Usuarios</h2>
            <Button variant="success" size="sm" onClick={() => { resetForm(); setShowModal(true); }}>
              Crear Usuario
            </Button>
          </div>

          {loading && (
            <div className="text-center">
              <Spinner animation="border" role="status" />
              <span> Cargando...</span>
            </div>
          )}

          {!loading && !error && users.length === 0 && (
            <Alert variant="info">
              No hay usuarios registrados en estos momentos.
            </Alert>
          )}

          {!loading && !error && users.length > 0 && (
            <Row>
              {users.map((user) => (
                <Col key={user.id} md={4} className="mb-4">
                  <Card className="shadow-sm">
                    <Card.Body>
                      <Card.Title>{user.name}</Card.Title>
                      <div className="d-flex justify-content-start">
                        <ButtonGroup className="d-flex gap-2">
                          <Button variant="primary" size="sm" onClick={() => handleEditUser(user)}>
                            Editar
                          </Button>
                          <Button variant="info" size="sm" onClick={() => handleShowUserDetails(user.id)}>
                            +Info
                          </Button>
                        </ButtonGroup>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>

        {/* Modal de confirmación de eliminación */}
        <Modal show={showDeleteConfirmModal} onHide={() => setShowDeleteConfirmModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmación de Eliminación</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            ¿Estás seguro de que deseas eliminar este usuario?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteConfirmModal(false)}>
              Cancelar
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal para mostrar los detalles del usuario */}
        <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Detalles del Usuario</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {userDetails ? (
              <>
                <h5>{userDetails.name}</h5>
                <p><strong>Email:</strong> {userDetails.email}</p>
                <p><strong>Fecha de registro:</strong> {formatDate(userDetails.registrationDate)}</p>
                <h5>Productos:</h5>
                {userDetails.products && userDetails.products.length > 0 ? (
                  <ul>
                    {userDetails.products.map((product) => (
                      <li key={product.id}>
                        <strong>{product.name}</strong><br />
                        <p>{product.description}</p>
                        <p><strong>Estado:</strong> {product.status}</p>
                        <p><strong>Fecha de adquisición:</strong> {formatDate(product.acquisitionDate)}</p>
                        <hr />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No hay productos disponibles para este usuario.</p>
                )}
              </>
            ) : (
              <Spinner animation="border" />
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal para crear o editar usuarios */}
        <Modal show={showModal} onHide={() => { setShowModal(false); resetForm(); }}>
          <Modal.Header closeButton>
            <Modal.Title>{editUser ? "Editar Usuario" : "Crear Usuario"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {error && (
              <Alert variant="danger">
                <strong>Error:</strong> {error}
              </Alert>
            )}
            <Form>
              <Form.Group>
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={name}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={password}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mt-3">
                <ReCAPTCHA
                  sitekey="6Ld39bEqAAAAAGlsA9WBZRY1dRCxcx7E0pVYB45h"
                  onChange={handleRecaptchaChange}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => { setShowModal(false); resetForm(); }}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={editUser ? handleUpdateUser : handleCreateUser}
            >
              {editUser ? "Actualizar Usuario" : "Crear Usuario"}
            </Button>
          </Modal.Footer>
        </Modal>
        <footer className="bg-dark text-white text-center py-3 mt-auto">
        <p>2025 Sysne.</p>
      </footer>
      </div>
    </>
  );
}

export default User;
