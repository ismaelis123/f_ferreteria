import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalRegistroProducto = ({
  mostrarModal,
  setMostrarModal,
  nuevoProducto,
  manejarCambioInput,
  agregarProducto,
  errorCarga,
  categorias // Lista de categorías obtenidas
}) => {
  return (
    <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Nuevo Producto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formNombreProducto">
            <Form.Label>Nombre del Producto</Form.Label>
            <Form.Control
              type="text"
              name="nombre_producto"
              value={nuevoProducto.nombre_producto}
              onChange={manejarCambioInput}
              placeholder="Ingresa el nombre (máx. 20 caracteres)"
              maxLength={20}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formDescripcionProducto">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="descripcion_producto"
              value={nuevoProducto.descripcion_producto}
              onChange={manejarCambioInput}
              placeholder="Ingresa la descripción (máx. 100 caracteres)"
              maxLength={100}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formCategoriaProducto">
            <Form.Label>Categoría</Form.Label>
            <Form.Select
              name="id_categoria"
              value={nuevoProducto.id_categoria}
              onChange={manejarCambioInput}
              required
            >
              <option value="">Selecciona una categoría</option>
              {categorias.map((categoria) => (
                <option key={categoria.id_categoria} value={categoria.id_categoria}>
                  {categoria.nombre_categoria}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPrecioProducto">
            <Form.Label>Precio Unitario</Form.Label>
            <Form.Control
              type="number"
              name="precio_unitario"
              value={nuevoProducto.precio_unitario}
              onChange={manejarCambioInput}
              placeholder="Ingresa el precio"
              step="0.01"
              min="0"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formStockProducto">
            <Form.Label>Stock</Form.Label>
            <Form.Control
              type="number"
              name="stock"
              value={nuevoProducto.stock}
              onChange={manejarCambioInput}
              placeholder="Ingresa la cantidad en stock"
              min="0"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formImagenProducto">
            <Form.Label>Imagen (URL)</Form.Label>
            <Form.Control
              type="text"
              name="imagen"
              value={nuevoProducto.imagen}
              onChange={manejarCambioInput}
              placeholder="Ingresa la URL de la imagen (opcional)"
            />
          </Form.Group>

          {errorCarga && (
            <div className="text-danger mt-2">{errorCarga}</div>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={agregarProducto}>
          Guardar Producto
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroProducto;