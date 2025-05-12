import React from 'react';
import { Modal, Table, Button } from 'react-bootstrap';

const ModalDetallesCompra = ({ mostrarModal, setMostrarModal, detalles, cargandoDetalles, errorDetalles }) => {
  return (
    <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Detalles de la Compra</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {cargandoDetalles && <div>Cargando detalles...</div>}
        {errorDetalles && <div className="text-danger">Error: {errorDetalles}</div>}
        {!cargandoDetalles && !errorDetalles && detalles.length > 0 && (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {detalles.map((detalle, index) => (
                <tr key={index}>
                  <td>{detalle.nombre_producto}</td>
                  <td>{detalle.cantidad}</td>
                  <td>{detalle.precio_unitario.toFixed(2)}</td>
                  <td>{(detalle.cantidad * detalle.precio_unitario).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        {!cargandoDetalles && !errorDetalles && detalles.length === 0 && (
          <div>No hay detalles para esta compra.</div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalDetallesCompra;