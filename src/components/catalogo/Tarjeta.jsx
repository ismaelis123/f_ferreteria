import React from "react";
import { Col, Card, Badge, Stack } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is included

const Tarjeta = ({ indice, nombre_producto, descripcion_producto, precio_unitario, stock, id_categoria, imagen }) => {
  return (
    <Col xs={12} sm={6} md={4} lg={3} className="mb-3">
      <Card border="light" className="h-100 content" style={{ fontSize: '0.95rem' }}>
        <Card.Img
          variant="top"
          src={`data:image/png;base64,${imagen}`}
          style={{ height: '200px', objectFit: 'cover', borderRadius: '12px 12px 0 0' }}
        />
        <Card.Body className="d-flex flex-column p-2">
          <Card.Title className="mb-1" style={{ fontSize: '1rem', fontWeight: '600' }}>
            {nombre_producto}
          </Card.Title>
          <Card.Text className="text-muted mb-2" style={{ fontSize: '0.85rem', flex: '1 0 auto' }}>
            {descripcion_producto || 'Sin descripción'}
          </Card.Text>
          <Stack direction="vertical" gap={1}>
            <Badge pill bg="primary" className="py-1" style={{ fontSize: '0.8rem' }}>
              <i className="bi bi-currency-dollar"></i> {precio_unitario.toFixed(2)}
            </Badge>
            <Badge pill bg="secondary" className="py-1" style={{ fontSize: '0.8rem' }}>
              <i className="bi bi-box"></i> Stock: {stock}
            </Badge>
            <Badge pill bg="info" className="py-1" style={{ fontSize: '0.8rem' }}>
              <i className="bi bi-tag"></i> Categoría: {id_categoria}
            </Badge>
          </Stack>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default Tarjeta;