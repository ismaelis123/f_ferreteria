import React from "react";
import { Form, InputGroup } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const CuadroBusquedas = ({ textoBusqueda, manejarCambioBusqueda  }) => {
  return (
    <InputGroup className="mb-3" style={{ width: "100%" }}>
      <InputGroup.Text>
        <i className="bi bi-search"></i>
      </InputGroup.Text>
      <Form.Control
        type="text"
        placeholder="Buscar por nombre o descripción..."
        value={textoBusqueda}
        onChange={manejarCambioBusqueda}
      />
    </InputGroup>
  );
};

export default CuadroBusquedas;