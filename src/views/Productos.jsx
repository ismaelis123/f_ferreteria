import React, { useState, useEffect } from 'react';
import TablaProductos from '../components/producto/TablaProductos';
import ModalRegistroProducto from '../components/producto/ModalRegistroProducto';
import { Container, Button, Alert, Form } from 'react-bootstrap';

const Productos = () => {
  const [listaProductos, setListaProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [listaCategorias, setListaCategorias] = useState([]);
  const [filtroBusqueda, setFiltroBusqueda] = useState('');
  const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 3;

  const estadoInicialProducto = {
    id_producto: null,
    nombre_producto: '',
    descripcion_producto: '',
    id_categoria: '',
    precio_unitario: '',
    stock: '',
    imagen: ''
  };
  const [productoActual, setProductoActual] = useState(estadoInicialProducto);

  const obtenerProductos = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/productos');
      if (!respuesta.ok) throw new Error('Error al cargar los productos');
      const datos = await respuesta.json();
      setListaProductos(datos);
      setProductosFiltrados(datos);
      setCargando(false);
    } catch (error) {
      setErrorCarga(error.message);
      setCargando(false);
    }
  };

  const obtenerCategorias = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/categorias');
      if (!respuesta.ok) throw new Error('Error al cargar las categorías');
      const datos = await respuesta.json();
      setListaCategorias(datos);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  useEffect(() => {
    obtenerProductos();
    obtenerCategorias();
  }, []);

  useEffect(() => {
    const resultados = listaProductos.filter(producto =>
      producto.nombre_producto.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
      producto.descripcion_producto?.toLowerCase().includes(filtroBusqueda.toLowerCase())
    );
    setProductosFiltrados(resultados);
    establecerPaginaActual(1); // Resetea a la primera página al buscar
  }, [filtroBusqueda, listaProductos]);

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setProductoActual(prev => ({ ...prev, [name]: value }));
  };

  const agregarProducto = async () => {
    if (
      !productoActual.nombre_producto ||
      !productoActual.id_categoria ||
      !productoActual.precio_unitario ||
      !productoActual.stock
    ) {
      setErrorCarga('Por favor, completa todos los campos requeridos.');
      return;
    }

    try {
      const respuesta = await fetch('http://localhost:3000/api/registrarproductos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productoActual),
      });

      if (!respuesta.ok) throw new Error('Error al agregar el producto');
      await obtenerProductos();
      setProductoActual(estadoInicialProducto);
      setMostrarModal(false);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const actualizarProducto = async () => {
    try {
      const respuesta = await fetch(`http://localhost:3000/api/actualizarproducto/${productoActual.id_producto}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productoActual),
      });
      if (!respuesta.ok) throw new Error('Error al actualizar el producto');
      await obtenerProductos();
      setModoEdicion(false);
      setMostrarModal(false);
      setProductoActual(estadoInicialProducto);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const eliminarProducto = async (id) => {
    const confirmar = window.confirm('¿Estás seguro de que quieres eliminar este producto?');
    if (confirmar) {
      try {
        const respuesta = await fetch(`http://localhost:3000/api/eliminarproducto/${id}`, {
          method: 'DELETE',
        });
        if (!respuesta.ok) throw new Error('Error al eliminar el producto');
        await obtenerProductos();
        setErrorCarga(null);
      } catch (error) {
        setErrorCarga(error.message);
      }
    }
  };

  const manejarActualizar = (producto) => {
    setProductoActual(producto);
    setModoEdicion(true);
    setMostrarModal(true);
  };

  // Calcular productos paginados
  const productosPaginados = productosFiltrados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  return (
    <Container className="mt-5">
      <h4>Productos</h4>

      <Button
        variant="primary"
        onClick={() => {
          setMostrarModal(true);
          setModoEdicion(false);
          setProductoActual(estadoInicialProducto);
        }}
      >
        Nuevo Producto
      </Button>

      <Form.Group controlId="formBusqueda" className="mt-3 mb-3">
        <div className="input-group">
          <span className="input-group-text">
            <i className="fas fa-search"></i>
          </span>
          <Form.Control
            type="text"
            placeholder="Buscar por nombre o descripción"
            value={filtroBusqueda}
            onChange={(e) => setFiltroBusqueda(e.target.value)}
          />
        </div>
      </Form.Group>

      {errorCarga && <Alert variant="danger" className="mt-3">{errorCarga}</Alert>}

      <TablaProductos
        productos={productosPaginados}
        cargando={cargando}
        error={errorCarga}
        onActualizar={manejarActualizar}
        onEliminar={eliminarProducto}
        totalElementos={productosFiltrados.length}
        elementosPorPagina={elementosPorPagina}
        paginaActual={paginaActual}
        establecerPaginaActual={establecerPaginaActual}
      />

      <ModalRegistroProducto
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoProducto={productoActual}
        manejarCambioInput={manejarCambioInput}
        agregarProducto={modoEdicion ? actualizarProducto : agregarProducto}
        actualizarProducto={actualizarProducto}
        errorCarga={errorCarga}
        categorias={listaCategorias}
        esEdicion={modoEdicion}
      />
    </Container>
  );
};

export default Productos;