import React from "react";
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Proposito = () => {
  return (
    <Container className="mt-4">
      <Row className="align-items-center mb-4">

        {/* Objetivos */}
        <Col sm={12} lg={4} className="text-center">
          <i className="bi bi-bullseye" style={{ fontSize: "2rem", color: "#dc3545" }}></i>
          <h5>Objetivos</h5>
          <p>Promover en Ferretería Bangtan el uso de herramientas y materiales de calidad, destacar la importancia de los productos locales y fomentar prácticas sostenibles en la construcción y mantenimiento.</p>
        </Col>

        {/* Misión */}
        <Col sm={12} lg={4} className="text-center">
          <i className="bi bi-flag-fill" style={{ fontSize: "2rem", color: "#0d6efd" }}></i>
          <h5>Misión</h5>
          <p>Ofrecer y promover en Ferretería Bangtan  soluciones integrales de ferretería en Chontales, brindando productos de calidad que inspiren confianza y satisfacción en cada proyecto.</p>
        </Col>

        {/* Visión */}
        <Col sm={12} lg={4} className="text-center">
          <i className="bi bi-eye-fill" style={{ fontSize: "2rem", color: "#198754" }}></i>
          <h5>Visión</h5>
          <p>Ser en Ferretería Bangtan el principal referente en ferretería en Chontales, inspirando a nuestros clientes a construir y mantener sus espacios con productos confiables y duraderos.</p>
        </Col>

      </Row>
    </Container>
  );
};

export default Proposito;