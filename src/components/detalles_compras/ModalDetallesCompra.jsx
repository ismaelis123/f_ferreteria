import React from 'react';
import { Modal, Table, Button } from 'react-bootstrap';

const ModalDetallesCompra = ({ mostrarModal, setMostrarModal, detalles, cargandoDetalles, errorDetalles }) => {
  return (
    <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Detalles de la Compra</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {cargandoDetalles && <div className="text-center">Cargando detalles...</div>}
        {errorDetalles && <div className="text-danger text-center">Error: {errorDetalles}</div>}
        {!cargandoDetalles && !errorDetalles && detalles?.length > 0 && (
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
                  <td>{detalle.nombre_producto || 'N/A'}</td>
                  <td>{detalle.cantidad || 0}</td>
                  <td>{detalle.precio_unitario?.toFixed(2) || '0.00'}</td>
                  <td>{((detalle.cantidad || 0) * (detalle.precio_unitario || 0)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        {!cargandoDetalles && !errorDetalles && (!detalles || detalles.length === 0) && (
          <div className="text-center">No hay detalles para esta compra.</div>
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