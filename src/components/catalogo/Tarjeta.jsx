import React from "react";
import { Card, Badge, Stack } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Zoom } from "react-awesome-reveal";

// eslint-disable-next-line no-unused-vars
const Tarjeta = ({ indice, nombre_producto, descripcion_producto, precio_unitario, stock, id_categoria, imagen }) => {
  return (
    <Zoom triggerOnce>
      <Card border="light" className="h-100 shadow-sm" style={{ fontSize: '0.95rem', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ position: 'relative', width: '100%', height: '200px' }}>
          <Card.Img
            variant="top"
            src={`data:image/png;base64,${imagen}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '12px 12px 0 0',
              transition: 'transform 0.3s ease-in-out',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />
        </div>
        <Card.Body className="d-flex flex-column p-3">
          <Card.Title className="mb-1" style={{ fontSize: '1.1rem', fontWeight: '600' }}>
            {nombre_producto}
          </Card.Title>
          <Card.Text className="text-muted mb-2" style={{ fontSize: '0.9rem', flex: '1 0 auto' }}>
            {descripcion_producto || 'Sin descripción'}
          </Card.Text>
          <Stack direction="vertical" gap={1}>
            <Badge pill bg="primary" className="py-1" style={{ fontSize: '0.85rem' }}>
              <i className="bi bi-currency-dollar"></i> {precio_unitario.toFixed(2)}
            </Badge>
            <Badge pill bg="secondary" className="py-1" style={{ fontSize: '0.85rem' }}>
              <i className="bi bi-box"></i> Stock: {stock}
            </Badge>
            <Badge pill bg="info" className="py-1" style={{ fontSize: '0.85rem' }}>
              <i className="bi bi-tag"></i> Categoría: {id_categoria}
            </Badge>
          </Stack>
        </Card.Body>
      </Card>
    </Zoom>
  );
};

export default Tarjeta;