import React, { useEffect, useState } from 'react';
import { createProduct, deleteProduct, getAllProducts, updateProduct, getProduct } from '../services/productService.js';
import { Spinner, Alert, Button, Card, Row, Col, ButtonGroup, Navbar, Nav, Container, Modal, Form } from 'react-bootstrap';
import { format } from 'date-fns';
import ReCAPTCHA from 'react-google-recaptcha';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false); 
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [userId, setUserId] = useState("");
  const [editProduct, setEditProduct] = useState(null);
  const [productDetails, setProductDetails] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null); 
  const [recaptchaToken, setRecaptchaToken] = useState(null);

  const statusInSpanish = {
    "new": "Nuevo",
    "used": "Usado",
    "defective": "Deteriorado"
  };

  const statusInEnglish = {
    "Nuevo": "new",
    "Usado": "used",
    "Deteriorado": "defective"
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error al cargar los productos:", error);
        setError("Fallo la carga de los productos. Por favor reinicia.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleCreateProduct = async () => {
    const userIdNumber = parseInt(userId, 10);

    if (!name || !description || !status || !userId) {
      setError("Por favor, complete todos los campos.");
      return;
    }

    if (isNaN(userIdNumber)) {
      setError("El ID del usuario debe ser un número válido.");
      return;
    }

    if (!recaptchaToken) {
      setError("Por favor, completa el reCAPTCHA.");
      return;
    }

    try {
      const newProduct = await createProduct({
        name,
        description,
        status: statusInEnglish[status], 
        userId: userIdNumber,
        recaptchaToken
      });

      // Solo actualizamos los productos si la creación fue exitosa
      setProducts(prevProducts => [...prevProducts, newProduct]); // Añadir el nuevo producto a la lista
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error("Error al crear el producto:", error);
      setError("Fallo la creación del producto. Por favor, inténtelo de nuevo.");
    }
  };

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);  
    setError(null); // Restablecer el error cuando se completa el reCAPTCHA
  };

  const handleDeleteProduct = async () => {
    try {
      if (productToDelete) {
        await deleteProduct(productToDelete.id);
        const data = await getAllProducts();
        setProducts(data);
        setShowDeleteConfirmModal(false); 
        setProductToDelete(null); 
      }
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      setError("Fallo la eliminación del producto. Por favor, inténtelo de nuevo.");
    }
  };

  const handleEditProduct = (product) => {
    setName(product.name);
    setDescription(product.description);
    setStatus(statusInSpanish[product.status]); 
    setUserId(product.userId.toString());
    setEditProduct(product);
    setShowModal(true);
  };

  const handleShowDeleteConfirm = (product) => {
    setProductToDelete(product); 
    setShowDeleteConfirmModal(true); 
  };

  const handleUpdateProduct = async () => {
    const userIdNumber = parseInt(userId, 10);
    if (isNaN(userIdNumber)) {
      setError("El ID del usuario debe ser un número válido.");
      return;
    }

    if (!recaptchaToken) {
      setError("Por favor, completa el reCAPTCHA.");
      return;
    }

    try {
      const updatedProduct = {
        name,
        description,
        status: statusInEnglish[status], 
        userId: userIdNumber
      };

      await updateProduct(editProduct.id, updatedProduct);

      // Actualizar el producto editado en la lista de productos
      setProducts(prevProducts => prevProducts.map(product =>
        product.id === editProduct.id ? { ...product, ...updatedProduct } : product
      ));
      setShowModal(false);
      setEditProduct(null);
      resetForm();
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      setError("Fallo la actualización del producto. Por favor, inténtelo de nuevo.");
    }
  };

  const handleShowProductDetails = async (id) => {
    try {
      const details = await getProduct(id);
      setProductDetails(details);
      setShowDetailsModal(true);
    } catch (error) {
      console.error("Error al obtener los detalles del producto:", error);
      setError("Fallo la carga de los detalles del producto.");
    }
  };

  const formatDate = (date) => {
    return format(new Date(date), 'dd/MM/yyyy HH:mm:ss');
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setStatus("");
    setUserId("");
    setEditProduct(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") setName(value);
    if (name === "description") setDescription(value);
    if (name === "status") setStatus(value);
    if (name === "userId") setUserId(value);
    
    setError(null); // Restablecer el error al cambiar cualquier campo del formulario
  };

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
            <h2>Lista de productos</h2>
            <Button variant="success" size="sm" onClick={() => { resetForm(); setShowModal(true); }}>
              Crear Producto
            </Button>
          </div>

          {loading && (
            <div className="text-center">
              <Spinner animation="border" role="status" />
              <span> Cargando...</span>
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <Alert variant="info">
              No hay productos en estos momentos
            </Alert>
          )}

          {!loading && !error && products.length > 0 && (
            <Row>
              {products.map((product) => (
                <Col key={product.id} md={4} className="mb-4">
                  <Card className="shadow-sm">
                    <Card.Body>
                      <Card.Title>{product.name}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">
                        {product.acquisitionDate ? formatDate(product.acquisitionDate) : 'Fecha no disponible'}
                      </Card.Subtitle>
                      <Card.Text>
                        {product.user && product.user.name ? `Usuario: ${product.user.name}` : 'Usuario cargando'}
                      </Card.Text>
                      <div className="d-flex justify-content-start">
                        <ButtonGroup className="d-flex gap-2">
                          <Button variant="primary" size="sm" onClick={() => handleEditProduct(product)}>
                            Editar
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleShowDeleteConfirm(product)}
                          >
                            Eliminar
                          </Button>
                          <Button variant="info" size="sm" onClick={() => handleShowProductDetails(product.id)}>
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
            ¿Estás seguro de que deseas eliminar este producto?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteConfirmModal(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDeleteProduct}>
              Eliminar
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal para mostrar los detalles del producto */}
        <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Detalles del Producto</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {productDetails ? (
              <>
                <h5>{productDetails.name}</h5>
                <p><strong>Descripción:</strong> {productDetails.description}</p>
                <p><strong>Estado:</strong> {statusInSpanish[productDetails.status]}</p>
                <p><strong>Fecha de adquisición:</strong> {formatDate(productDetails.acquisitionDate)}</p>
                <p><strong>Usuario:</strong> {productDetails.user?.name}</p>
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

        {/* Modal para crear o editar productos */}
        <Modal show={showModal} onHide={() => { setShowModal(false); resetForm(); }}>
          <Modal.Header closeButton>
            <Modal.Title>{editProduct ? "Editar Producto" : "Crear Producto"}</Modal.Title>
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
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  value={description}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Estado</Form.Label>
                <Form.Control
                  as="select"
                  name="status"
                  value={status}
                  onChange={handleInputChange}
                >
                  <option value="Nuevo">Nuevo</option>
                  <option value="Usado">Usado</option>
                  <option value="Deteriorado">Deteriorado</option>
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>ID de Usuario</Form.Label>
                <Form.Control
                  type="text"
                  name="userId"
                  value={userId}
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
              onClick={editProduct ? handleUpdateProduct : handleCreateProduct}
            >
              {editProduct ? "Actualizar Producto" : "Crear Producto"}
            </Button>
          </Modal.Footer>
        </Modal>
        {/* Pie de página */}
      <footer className="bg-dark text-white text-center py-3 mt-auto">
        <p>2025 Sysne.</p>
      </footer>
      </div>
    </>
  );
};

export default Product;
