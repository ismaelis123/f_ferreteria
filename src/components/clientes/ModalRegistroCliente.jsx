import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalRegistroCliente = ({
  mostrarModal,
  setMostrarModal,
  nuevoCliente: nuevoClienteProp,
  manejarCambioInput,
  agregarCliente,
  errorCarga,
}) => {
  // Estado para manejar errores en el componente
  const [hasError, setHasError] = useState(false);

  // Estado local para asegurar que nuevoCliente siempre tenga las propiedades esperadas
  const [nuevoCliente, setNuevoCliente] = useState({
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    celular: "",
    direccion: "",
    cedula: "",
  });

  // Sincronizar nuevoClienteProp con el estado local
  useEffect(() => {
    if (nuevoClienteProp && typeof nuevoClienteProp === "object") {
      setNuevoCliente({
        primer_nombre: nuevoClienteProp.primer_nombre || "",
        segundo_nombre: nuevoClienteProp.segundo_nombre || "",
        primer_apellido: nuevoClienteProp.primer_apellido || "",
        segundo_apellido: nuevoClienteProp.segundo_apellido || "",
        celular: nuevoClienteProp.celular || "",
        direccion: nuevoClienteProp.direccion || "",
        cedula: nuevoClienteProp.cedula || "",
      });
    }
  }, [nuevoClienteProp]);

  // Validación para solo letras (nombres y apellidos)
  const validarLetras = (e) => {
    const charCode = e.which || e.keyCode;
    if (
      !(charCode >= 65 && charCode <= 90) && // Letras mayúsculas
      !(charCode >= 97 && charCode <= 122) && // Letras minúsculas
      charCode !== 8 && // Retroceso
      charCode !== 46 && // Borrar
      charCode !== 9 // Tab
    ) {
      e.preventDefault();
    }
  };

  // Validación para solo números (celular y cédula)
  const validarNumeros = (e) => {
    const charCode = e.which || e.keyCode;
    if (
      !(charCode >= 48 && charCode <= 57) && // Números 0-9
      charCode !== 8 && // Retroceso
      charCode !== 46 && // Borrar
      charCode !== 9 // Tab
    ) {
      e.preventDefault();
    }
  };

  // Validación del formulario para habilitar/deshabilitar el botón
  const validacionFormulario = () => {
    return (
      nuevoCliente.primer_nombre.trim() !== "" &&
      nuevoCliente.primer_apellido.trim() !== "" &&
      nuevoCliente.celular.trim() !== "" &&
      nuevoCliente.cedula.trim() !== ""
    );
  };

  // Manejo seguro del cambio de input
  const manejarCambioInputLocal = (e) => {
    try {
      const { name, value } = e.target;
      setNuevoCliente((prev) => ({ ...prev, [name]: value }));
      if (manejarCambioInput) {
        manejarCambioInput(e);
      }
    } catch (error) {
      console.error("Error en manejarCambioInput:", error);
      setHasError(true);
    }
  };

  // Manejo seguro del clic en Guardar Cliente
  const manejarAgregarCliente = () => {
    try {
      if (agregarCliente) {
        agregarCliente();
      }
    } catch (error) {
      console.error("Error en agregarCliente:", error);
      setHasError(true);
    }
  };

  // Si hay un error, mostramos un mensaje en lugar de romper el componente
  if (hasError) {
    return (
      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-danger">
            Ocurrió un error al cargar el formulario. Por favor, intenta de nuevo o contacta al soporte.
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  return (
    <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Nuevo Cliente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formPrimerNombre">
            <Form.Label>Primer Nombre</Form.Label>
            <Form.Control
              type="text"
              name="primer_nombre"
              value={nuevoCliente.primer_nombre}
              onChange={manejarCambioInputLocal}
              onKeyDown={validarLetras}
              placeholder="Ingresa el primer nombre (máx. 20 caracteres)"
              maxLength={20}
              required
            />
          </Form.Group>

          <Form.Label>Segundo Nombre</Form.Label>
          <Form.Control
            type="text"
            name="segundo_nombre"
            value={nuevoCliente.segundo_nombre}
            // eslint-disable-next-line no-undef
            onChange={(e) => Ascender(e)} // Define the Ascender function or replace it with a valid function reference
            onKeyDown={validarLetras}
            placeholder="Ingresa el segundo nombre (máx. 20 caracteres)"
            maxLength={20}
          />

          <Form.Group className="mb-3" controlId="formPrimerApellido">
            <Form.Label>Primer Apellido</Form.Label>
            <Form.Control
              type="text"
              name="primer_apellido"
              value={nuevoCliente.primer_apellido}
              onChange={manejarCambioInputLocal}
              onKeyDown={validarLetras}
              placeholder="Ingresa el primer apellido (máx. 20 caracteres)"
              maxLength={20}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formSegundoApellido">
            <Form.Label>Segundo Apellido</Form.Label>
            <Form.Control
              type="text"
              name="segundo_apellido"
              value={nuevoCliente.segundo_apellido}
              onChange={manejarCambioInputLocal}
              onKeyDown={validarLetras}
              placeholder="Ingresa el segundo apellido (máx. 20 caracteres)"
              maxLength={20}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formCelular">
            <Form.Label>Celular</Form.Label>
            <Form.Control
              type="text"
              name="celular"
              value={nuevoCliente.celular}
              onChange={manejarCambioInputLocal}
              onKeyDown={validarNumeros}
              placeholder="Ingresa el número celular (8 dígitos)"
              maxLength={8}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formDireccion">
            <Form.Label>Dirección</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="direccion"
              value={nuevoCliente.direccion}
              onChange={manejarCambioInputLocal}
              placeholder="Ingresa la dirección (máx. 150 caracteres)"
              maxLength={150}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formCedula">
            <Form.Label>Cédula</Form.Label>
            <Form.Control
              type="text"
              name="cedula"
              value={nuevoCliente.cedula}
              onChange={manejarCambioInputLocal}
              onKeyDown={validarNumeros}
              placeholder="Ingresa la cédula (máx. 14 caracteres)"
              maxLength={14}
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
        <Button
          variant="primary"
          onClick={manejarAgregarCliente}
          disabled={!validacionFormulario()}
        >
          Guardar Cliente
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroCliente;