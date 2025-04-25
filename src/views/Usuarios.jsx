import React, { useState, useEffect } from 'react';
import TablaUsuarios from '../components/usuarios/TablaUsuarios.jsx';
import ModalRegistroUsuario from '../components/usuarios/ModalRegistroUsuario.jsx';
import { Container, Button, Alert, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// Declaración del componente Usuarios
const Usuarios = () => {
  const [listaUsuarios, setListaUsuarios] = useState([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const estadoInicialUsuario = { id_usuario: null, usuario: '', contraseña: '' };
  const [usuarioActual, setUsuarioActual] = useState(estadoInicialUsuario);
  const [filtroBusqueda, setFiltroBusqueda] = useState('');
  const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 3;

  // Obtener usuarios desde la API
  const obtenerUsuarios = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/usuarios');
      if (!respuesta.ok) throw new Error('Error al cargar los usuarios');
      const datos = await respuesta.json();
      setListaUsuarios(datos);
      setUsuariosFiltrados(datos);
    } catch (error) {
      setErrorCarga(error.message);
    } finally {
      setCargando(false);
    }
  };

  // Cargar usuarios al montar el componente
  useEffect(() => {
    obtenerUsuarios();
  }, []);

  // Filtrar usuarios según el texto de búsqueda
  useEffect(() => {
    const resultados = listaUsuarios.filter((usuario) =>
      usuario.usuario.toLowerCase().includes(filtroBusqueda.toLowerCase())
    );
    setUsuariosFiltrados(resultados);
    establecerPaginaActual(1); // Resetea a la primera página al buscar
  }, [filtroBusqueda, listaUsuarios]);

  // Manejar cambios en los inputs del modal
  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setUsuarioActual((prev) => ({ ...prev, [name]: value }));
  };

  // Agregar un nuevo usuario
  const agregarUsuario = async () => {
    if (!usuarioActual.usuario || !usuarioActual.contraseña) {
      setErrorCarga('Todos los campos obligatorios deben completarse.');
      return;
    }

    try {
      const respuesta = await fetch('http://localhost:3000/api/registrarusuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuarioActual),
      });

      if (!respuesta.ok) throw new Error('Error al agregar el usuario');
      await obtenerUsuarios();
      setUsuarioActual(estadoInicialUsuario);
      setMostrarModal(false);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  // Actualizar un usuario existente
  const actualizarUsuario = async () => {
    try {
      const respuesta = await fetch(`http://localhost:3000/api/actualizarusuario/${usuarioActual.id_usuario}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuarioActual),
      });
      if (!respuesta.ok) throw new Error('Error al actualizar el usuario');
      await obtenerUsuarios();
      setModoEdicion(false);
      setMostrarModal(false);
      setUsuarioActual(estadoInicialUsuario);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  // Eliminar un usuario
  const eliminarUsuario = async (id) => {
    const confirmar = window.confirm('¿Estás seguro de que quieres eliminar este usuario?');
    if (confirmar) {
      try {
        const respuesta = await fetch(`http://localhost:3000/api/eliminarusuario/${id}`, {
          method: 'DELETE',
        });
        if (!respuesta.ok) throw new Error('Error al eliminar el usuario');
        await obtenerUsuarios();
        setErrorCarga(null);
      } catch (error) {
        setErrorCarga(error.message);
      }
    }
  };

  // Preparar el modal para actualizar un usuario
  const manejarActualizar = (usuario) => {
    setUsuarioActual(usuario);
    setModoEdicion(true);
    setMostrarModal(true);
  };

  // Calcular usuarios paginados
  const usuariosPaginados = usuariosFiltrados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  // Renderizado de la vista
  return (
    <Container className="mt-5">
      <h4>Usuarios</h4>

      <Button
        variant="primary"
        onClick={() => {
          setUsuarioActual(estadoInicialUsuario);
          setModoEdicion(false);
          setMostrarModal(true);
        }}
      >
        Nuevo Usuario
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

      <TablaUsuarios
        usuarios={usuariosPaginados}
        cargando={cargando}
        error={errorCarga}
        onActualizar={manejarActualizar}
        onEliminar={eliminarUsuario}
        totalElementos={usuariosFiltrados.length}
        elementosPorPagina={elementosPorPagina}
        paginaActual={paginaActual}
        establecerPaginaActual={establecerPaginaActual}
      />

      <ModalRegistroUsuario
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoUsuario={usuarioActual}
        manejarCambioInput={manejarCambioInput}
        agregarUsuario={modoEdicion ? actualizarUsuario : agregarUsuario}
        actualizarUsuario={actualizarUsuario}
        eliminarUsuario={eliminarUsuario}
        errorCarga={errorCarga}
        esEdicion={modoEdicion}
      />
    </Container>
  );
};

// Exportación del componente
export default Usuarios;