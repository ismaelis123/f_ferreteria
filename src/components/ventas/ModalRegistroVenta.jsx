import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ModalRegistroVenta = ({
  mostrarModal,
  setMostrarModal,
  nuevaVenta,
  manejarCambioInput,
  registrarVenta,
  errorCarga,
}) => {
  const manejarCerrarModal = () => {
    setMostrarModal(false);
  };

  const manejarRegistrarVenta = () => {
    if (
      !nuevaVenta.fecha_venta ||
      !nuevaVenta.cliente ||
      !nuevaVenta.empleado ||
      !nuevaVenta.producto ||
      !nuevaVenta.cantidad ||
      !nuevaVenta.precio_unitario
    ) {
      alert('Por favor complete todos los campos.');
      return;
    }

    registrarVenta();
  };

  return (
    <Modal show={mostrarModal} onHide={manejarCerrarModal}>
      <Modal.Header closeButton>
        <Modal.Title>Registrar Nueva Venta</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorCarga && <div className="alert alert-danger">{errorCarga}</div>}

        <Form>
          <Form.Group controlId="fechaVenta">
            <Form.Label>Fecha de Venta</Form.Label>
            <Form.Control
              type="date"
              name="fecha_venta"
              value={nuevaVenta.fecha_venta}
              onChange={manejarCambioInput}
              required
            />
          </Form.Group>

          <Form.Group controlId="cliente">
            <Form.Label>Cliente</Form.Label>
            <Form.Control
              type="text"
              name="cliente"
              value={nuevaVenta.cliente}
              onChange={manejarCambioInput}
              placeholder="Ingrese nombre del cliente"
              required
            />
          </Form.Group>

          <Form.Group controlId="empleado">
            <Form.Label>Empleado</Form.Label>
            <Form.Control
              type="text"
              name="empleado"
              value={nuevaVenta.empleado}
              onChange={manejarCambioInput}
              placeholder="Ingrese nombre del empleado"
              required
            />
          </Form.Group>

          <Form.Group controlId="producto">
            <Form.Label>Producto</Form.Label>
            <Form.Control
              type="text"
              name="producto"
              value={nuevaVenta.producto}
              onChange={manejarCambioInput}
              placeholder="Ingrese nombre del producto"
              required
            />
          </Form.Group>

          <Form.Group controlId="cantidad">
            <Form.Label>Cantidad</Form.Label>
            <Form.Control
              type="number"
              name="cantidad"
              value={nuevaVenta.cantidad}
              onChange={manejarCambioInput}
              min="1"
              required
            />
          </Form.Group>

          <Form.Group controlId="precioUnitario">
            <Form.Label>Precio Unitario</Form.Label>
            <Form.Control
              type="number"
              name="precio_unitario"
              value={nuevaVenta.precio_unitario}
              onChange={manejarCambioInput}
              min="0.01"
              step="0.01"
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={manejarCerrarModal}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={manejarRegistrarVenta}>
          Registrar Venta
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroVenta;