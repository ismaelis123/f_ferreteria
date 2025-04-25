import React, { useState, useEffect } from 'react';
import TablaCategorias from '../components/categorias/TablaCategorias';
import ModalRegistroCategoria from '../components/categorias/ModalRegistroCategoria';
import { Container, Button, Alert, Form } from 'react-bootstrap';

const Categorias = () => {
  const [listaCategorias, setListaCategorias] = useState([]);
  const [categoriasFiltradas, setCategoriasFiltradas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const estadoInicialCategoria = { id_categoria: null, nombre_categoria: '', descripcion_categoria: '' };
  const [categoriaActual, setCategoriaActual] = useState(estadoInicialCategoria);
  const [filtroBusqueda, setFiltroBusqueda] = useState('');
  const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 3;

  const obtenerCategorias = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/categorias');
      if (!respuesta.ok) throw new Error('Error al cargar las categorías');
      
      const datos = await respuesta.json();
      setListaCategorias(datos);
      setCategoriasFiltradas(datos);
    } catch (error) {
      setErrorCarga(error.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerCategorias();
  }, []);

  useEffect(() => {
    const resultados = listaCategorias.filter(categoria => 
      categoria.nombre_categoria.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
      categoria.descripcion_categoria.toLowerCase().includes(filtroBusqueda.toLowerCase())
    );
    setCategoriasFiltradas(resultados);
    establecerPaginaActual(1); // Resetea a la primera página al buscar
  }, [filtroBusqueda, listaCategorias]);

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setCategoriaActual(prev => ({ ...prev, [name]: value }));
  };

  const agregarCategoria = async () => {
    if (!categoriaActual.nombre_categoria) {
      setErrorCarga('El nombre de la categoría es obligatorio.');
      return;
    }

    try {
      const respuesta = await fetch('http://localhost:3000/api/registrarcategoria', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoriaActual),
      });

      if (!respuesta.ok) throw new Error('Error al agregar la categoría');
      obtenerCategorias();
      setCategoriaActual(estadoInicialCategoria);
      setMostrarModal(false);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const eliminarCategoria = async (id) => {
    const confirmar = window.confirm('¿Estás seguro de que quieres eliminar esta categoría?');
    
    if (confirmar) {
      try {
        const respuesta = await fetch(`http://localhost:3000/api/eliminarcategoria/${id}`, {
          method: 'DELETE',
        });
        if (!respuesta.ok) throw new Error('Error al eliminar la categoría');
        obtenerCategorias();
      } catch (error) {
        setErrorCarga(error.message);
      }
    }
  };

  const actualizarCategoria = async () => {
    try {
      const respuesta = await fetch(`http://localhost:3000/api/actualizarcategoria/${categoriaActual.id_categoria}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoriaActual),
      });
      if (!respuesta.ok) throw new Error('Error al actualizar la categoría');
      obtenerCategorias();
      setModoEdicion(false);
      setMostrarModal(false);
      setCategoriaActual(estadoInicialCategoria);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const manejarActualizar = (categoria) => {
    setCategoriaActual(categoria);
    setModoEdicion(true);
    setMostrarModal(true);
  };

  // Calcular categorías paginadas
  const categoriasPaginadas = categoriasFiltradas.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  return (
    <Container className="mt-5">
      <h4>Categorías</h4>
      
      <Button 
        variant="primary" 
        onClick={() => {
          setMostrarModal(true); 
          setModoEdicion(false);
          setCategoriaActual(estadoInicialCategoria);
        }}
      >
        Nueva Categoría
      </Button>

      <Form.Group controlId="formBusqueda" className="mt-3 mb-3">
        <div className="input-group">
          <span className="input-group-text">
            <i className="fas fa-search"></i>
          </span>
          <Form.Control
            type="text"
            placeholder="Buscar"
            value={filtroBusqueda}
            onChange={(e) => setFiltroBusqueda(e.target.value)}
          />
        </div>
      </Form.Group>

      {errorCarga && <Alert variant="danger" className="mt-3">{errorCarga}</Alert>}

      <TablaCategorias 
        categorias={categoriasPaginadas} 
        cargando={cargando} 
        error={errorCarga} 
        onActualizar={manejarActualizar} 
        onEliminar={eliminarCategoria}
        totalElementos={categoriasFiltradas.length}
        elementosPorPagina={elementosPorPagina}
        paginaActual={paginaActual}
        establecerPaginaActual={establecerPaginaActual}
      />

      <ModalRegistroCategoria
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevaCategoria={categoriaActual}
        manejarCambioInput={manejarCambioInput}
        agregarCategoria={agregarCategoria}
        actualizarCategoria={actualizarCategoria}
        errorCarga={errorCarga}
        esEdicion={modoEdicion}
      />
    </Container>
  );
};

export default Categorias;