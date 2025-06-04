import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Tarjeta from '../components/catalogo/Tarjeta';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Zoom } from 'react-awesome-reveal';

const CatalogoProductos = () => {
  const [listaProductos, setListaProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);

  const obtenerProductos = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/productos');
      if (!respuesta.ok) throw new Error('Error al cargar los productos');
      const datos = await respuesta.json();
      setListaProductos(datos);
      setCargando(false);
    } catch (error) {
      setErrorCarga(error.message);
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  if (cargando) return <div className="text-center my-5">Cargando...</div>;
  if (errorCarga) return <div className="alert alert-danger text-center my-5">{errorCarga}</div>;

  return (
    <Container className="my-5">
      <h4 className="text-center mb-4">Catálogo de Productos</h4>
      <Row className="g-4 justify-content-center">
        {listaProductos.map((producto, indice) => (
          <Col key={producto.id_producto} xs={12} sm={6} md={4} lg={3}>
            <Tarjeta
              indice={indice}
              nombre_producto={producto.nombre_producto}
              descripcion_producto={producto.descripcion_producto}
              precio_unitario={producto.precio_unitario}
              stock={producto.stock}
              id_categoria={producto.id_categoria}
              imagen={producto.imagen}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default CatalogoProductos;