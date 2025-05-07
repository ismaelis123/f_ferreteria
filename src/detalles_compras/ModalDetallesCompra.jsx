import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Table, Container } from 'react-bootstrap';

const ModalDetallesCompra = ({ mostrarModal, setMostrarModal, detalles, cargandoDetalles, errorDetalles }) => {
  return (
    <Modal
      show={mostrarModal}
      onHide={() => setMostrarModal(false)}
      fullscreen={true}
      aria-labelledby="detalles-compra-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="detalles-compra-modal">Detalles de la Compra</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {cargandoDetalles && <div>Cargando detalles...</div>}
        {!cargandoDetalles && !errorDetalles && detalles.length > 0 && (
          <Container>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID Detalle</th>
                  <th>Producto</th>
                  <th>Descripción</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {detalles.map((detalle) => (
                  <tr key={detalle.id_detalle_compra}>
                    <td>{detalle.id_detalle_compra}</td>
                    <td>{detalle.nombre_producto}</td>
                    <td>{detalle.descripcion_producto}</td>
                    <td>{detalle.cantidad}</td>
                    <td>C$ {detalle.precio_unitario.toFixed(2)}</td>
                    <td>C$ {detalle.subtotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Container>
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