import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const ModalRegistroUsuario = ({
  mostrarModal,
  setMostrarModal,
  nuevoUsuario,
  manejarCambioInput,
  agregarUsuario,
  actualizarUsuario,
  eliminarUsuario,
  errorCarga,
  esEdicion,
}) => {
  return (
    <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{esEdicion ? 'Actualizar Usuario' : 'Agregar Nuevo Usuario'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formUsuario">
            <Form.Label>Nombre de Usuario</Form.Label>
            <Form.Control
              type="text"
              name="usuario"
              value={nuevoUsuario.usuario}
              onChange={manejarCambioInput}
              placeholder="Ingresa el usuario"
              maxLength={20}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formContraseña">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              name="contraseña"
              value={nuevoUsuario.contraseña}
              onChange={manejarCambioInput}
              placeholder="Ingresa la contraseña"
              maxLength={20}
              required
            />
          </Form.Group>

          {errorCarga && <div className="text-danger mt-2">{errorCarga}</div>}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cancelar
        </Button>
        {esEdicion ? (
          <>
            <Button variant="warning" onClick={actualizarUsuario}>
              Actualizar Usuario
            </Button>
            <Button variant="danger" onClick={() => eliminarUsuario(nuevoUsuario.id_usuario)}>
              Eliminar Usuario
            </Button>
          </>
        ) : (
          <Button variant="primary" onClick={agregarUsuario}>
            Guardar Usuario
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroUsuario;