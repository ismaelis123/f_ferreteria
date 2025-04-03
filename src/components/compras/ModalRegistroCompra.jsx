import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

// Componente de modal para registro de nueva compra
const ModalRegistroCompra = ({
  mostrarModal,
  setMostrarModal,
  nuevaCompra,
  manejarCambioInput,
  registrarCompra,
  errorCarga,
}) => {
  // Función para manejar el cierre del modal
  const manejarCerrarModal = () => {
    setMostrarModal(false); // Cierra el modal
  };

  // Función para manejar el envío del formulario (registro de la compra)
  const manejarRegistrarCompra = () => {
    // Validación de campos requeridos
    if (
      !nuevaCompra.fecha_compra ||
      !nuevaCompra.empleado ||
      !nuevaCompra.producto ||
      !nuevaCompra.cantidad ||
      !nuevaCompra.precio_unitario
    ) {
      alert('Por favor complete todos los campos.');
      return;
    }

    // Llamar a la función para registrar la compra si todos los campos son válidos
    registrarCompra();
  };

  return (
    <Modal show={mostrarModal} onHide={manejarCerrarModal}>
      <Modal.Header closeButton>
        <Modal.Title>Registrar Nueva Compra</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Si hay error, muestra el mensaje */}
        {errorCarga && <div className="alert alert-danger">{errorCarga}</div>}

        {/* Formulario para registrar la compra */}
        <Form>
          <Form.Group controlId="fechaCompra">
            <Form.Label>Fecha de Compra</Form.Label>
            <Form.Control
              type="date"
              name="fecha_compra"
              value={nuevaCompra.fecha_compra}
              onChange={manejarCambioInput}
              required
            />
          </Form.Group>

          <Form.Group controlId="empleado">
            <Form.Label>Empleado</Form.Label>
            <Form.Control
              type="text"
              name="empleado"
              value={nuevaCompra.empleado}
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
              value={nuevaCompra.producto}
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
              value={nuevaCompra.cantidad}
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
              value={nuevaCompra.precio_unitario}
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
        <Button
          variant="primary"
          onClick={manejarRegistrarCompra} // Llama la función para registrar la compra
        >
          Registrar Compra
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroCompra;
