import React, { useState, useEffect } from 'react';
import { Container, Row, Form, Alert } from 'react-bootstrap';
import Tarjeta from '../components/catalogo/Tarjeta';
import Paginacion from '../components/ordenamiento/Paginacion'; // Assuming this component exists

const CatalogoProductos = () => {
  const [listaProductos, setListaProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [filtroBusqueda, setFiltroBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 4; // Display 4 products per page

  const obtenerProductos = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/productos');
      if (!respuesta.ok) throw new Error('Error al cargar los productos');
      const datos = await respuesta.json();
      setListaProductos(datos);
      setProductosFiltrados(datos); // Initialize filtered products
      setCargando(false);
    } catch (error) {
      setErrorCarga(error.message);
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  // Filter products based on search input
  useEffect(() => {
    const resultados = listaProductos.filter((producto) =>
      producto.nombre_producto.toLowerCase().includes(filtroBusqueda.toLowerCase())
    );
    setProductosFiltrados(resultados);
    setPaginaActual(1); // Reset to first page when search changes
  }, [filtroBusqueda, listaProductos]);

  // Calculate paginated products
  const productosPaginados = productosFiltrados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  if (cargando) return <div>Cargando...</div>;
  if (errorCarga) return <Alert variant="danger">{errorCarga}</Alert>;

  return (
    <Container className="mt-5">
      <h4>Catálogo de Productos</h4>

      {/* Search Input */}
      <Form.Group controlId="formBusqueda" className="mt-3 mb-3">
        <div className="input-group">
          <span className="input-group-text">
            <i className="fas fa-search"></i>
          </span>
          <Form.Control
            type="text"
            placeholder="Buscar producto"
            value={filtroBusqueda}
            onChange={(e) => setFiltroBusqueda(e.target.value)}
          />
        </div>
      </Form.Group>

      {/* Product Grid */}
      <Row>
        {productosPaginados.map((producto, indice) => (
          <Tarjeta
            key={producto.id_producto}
            indice={indice}
            nombre_producto={producto.nombre_producto}
            descripcion_producto={producto.descripcion_producto}
            precio_unitario={producto.precio_unitario}
            stock={producto.stock}
            id_categoria={producto.id_categoria}
            imagen={producto.imagen}
          />
        ))}
      </Row>

      {/* Pagination */}
      <Paginacion
        elementosPorPagina={elementosPorPagina}
        totalElementos={productosFiltrados.length}
        paginaActual={paginaActual}
        establecerPaginaActual={setPaginaActual}
      />
    </Container>
  );
};

export default CatalogoProductos;