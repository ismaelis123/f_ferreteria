import React from "react";
import { Modal, Button } from "react-bootstrap";
import 'bootstrap-icons/font/bootstrap-icons.css';

const ModalEliminacionVenta = ({ mostrar, onHide, onConfirm, venta }) => {
  return (
    <Modal show={mostrar} onHide={onHide} centered backdrop="static">
      <Modal.Header closeButton className="bg-danger text-white">
        <Modal.Title>
          <i className="bi bi-exclamation-triangle me-2"></i>
          Confirmar Eliminación
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>¿Está seguro que desea eliminar la siguiente venta?</p>
        <div className="alert alert-warning">
          <p className="mb-1"><strong>ID Venta:</strong> {venta?.id_venta}</p>
          <p className="mb-1"><strong>Cliente:</strong> {venta?.nombre_cliente}</p>
          <p className="mb-1"><strong>Total:</strong> C$ {venta?.total_venta?.toFixed(2)}</p>
        </div>
        <p className="text-danger fw-bold">
          <i className="bi bi-exclamation-circle-fill me-2"></i>
          Esta acción no se puede deshacer
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          <i className="bi bi-x-circle me-2"></i>
          Cancelar
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          <i className="bi bi-trash-fill me-2"></i>
          Confirmar Eliminación
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEliminacionVenta;