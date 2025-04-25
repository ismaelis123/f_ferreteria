import React, { useState, useEffect } from 'react';
import TablaEmpleados from '../components/empleados/TablaEmpleados';
import ModalRegistroEmpleado from '../components/empleados/ModalRegistroEmpleado';
import CuadroBusquedas from '../components/busquedas/CuadroBusquedas';
import { Container, Button, Alert, Row, Col } from 'react-bootstrap';

const Empleados = () => {
  const [listaEmpleados, setListaEmpleados] = useState([]);
  const [empleadosFiltrados, setEmpleadosFiltrados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [textoBusqueda, setTextoBusqueda] = useState('');
  const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 3;

  const estadoInicialEmpleado = {
    id_empleado: null,
    primer_nombre: '',
    segundo_nombre: '',
    primer_apellido: '',
    segundo_apellido: '',
    celular: '',
    cargo: '',
    fecha_contratacion: ''
  };
  const [empleadoActual, setEmpleadoActual] = useState(estadoInicialEmpleado);

  const obtenerEmpleados = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/empleados');
      if (!respuesta.ok) throw new Error('Error al cargar los empleados');
      const datos = await respuesta.json();
      setListaEmpleados(datos);
      setEmpleadosFiltrados(datos);
      setCargando(false);
    } catch (error) {
      setErrorCarga(error.message);
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerEmpleados();
  }, []);

  useEffect(() => {
    const resultados = listaEmpleados.filter(
      (empleado) =>
        empleado.primer_nombre.toLowerCase().includes(textoBusqueda.toLowerCase()) ||
        (empleado.segundo_nombre && empleado.segundo_nombre.toLowerCase().includes(textoBusqueda.toLowerCase())) ||
        empleado.primer_apellido.toLowerCase().includes(textoBusqueda.toLowerCase()) ||
        (empleado.segundo_apellido && empleado.segundo_apellido.toLowerCase().includes(textoBusqueda.toLowerCase())) ||
        empleado.celular.toLowerCase().includes(textoBusqueda.toLowerCase()) ||
        empleado.cargo.toLowerCase().includes(textoBusqueda.toLowerCase()) ||
        empleado.fecha_contratacion.toLowerCase().includes(textoBusqueda.toLowerCase())
    );
    setEmpleadosFiltrados(resultados);
    establecerPaginaActual(1); // Resetea a la primera página al buscar
  }, [textoBusqueda, listaEmpleados]);

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setEmpleadoActual(prev => ({ ...prev, [name]: value }));
  };

  const agregarEmpleado = async () => {
    if (
      !empleadoActual.primer_nombre ||
      !empleadoActual.primer_apellido ||
      !empleadoActual.celular ||
      !empleadoActual.cargo ||
      !empleadoActual.fecha_contratacion
    ) {
      setErrorCarga('Por favor, completa todos los campos obligatorios antes de guardar.');
      return;
    }

    try {
      const respuesta = await fetch('http://localhost:3000/api/registrarempleado', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(empleadoActual),
      });

      if (!respuesta.ok) throw new Error('Error al agregar el empleado');
      await obtenerEmpleados();
      setEmpleadoActual(estadoInicialEmpleado);
      setMostrarModal(false);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const actualizarEmpleado = async () => {
    try {
      const respuesta = await fetch(`http://localhost:3000/api/actualizarempleado/${empleadoActual.id_empleado}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(empleadoActual),
      });
      if (!respuesta.ok) throw new Error('Error al actualizar el empleado');
      await obtenerEmpleados();
      setModoEdicion(false);
      setMostrarModal(false);
      setEmpleadoActual(estadoInicialEmpleado);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const eliminarEmpleado = async (id) => {
    const confirmar = window.confirm('¿Estás seguro de que quieres eliminar este empleado?');
    if (confirmar) {
      try {
        const respuesta = await fetch(`http://localhost:3000/api/eliminarempleado/${id}`, {
          method: 'DELETE',
        });
        if (!respuesta.ok) throw new Error('Error al eliminar el empleado');
        await obtenerEmpleados();
        setErrorCarga(null);
      } catch (error) {
        setErrorCarga(error.message);
      }
    }
  };

  const manejarActualizar = (empleado) => {
    setEmpleadoActual(empleado);
    setModoEdicion(true);
    setMostrarModal(true);
  };

  const manejarCambioBusqueda = (e) => {
    setTextoBusqueda(e.target.value);
  };

  // Calcular elementos paginados
  const empleadosPaginados = empleadosFiltrados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  return (
    <Container className="mt-5">
      <h4>Empleados</h4>

      <Row>
        <Col lg={2} md={4} sm={4} xs={5}>
          <Button
            variant="primary"
            onClick={() => {
              setMostrarModal(true);
              setModoEdicion(false);
              setEmpleadoActual(estadoInicialEmpleado);
            }}
            style={{ width: '100%' }}
          >
            Nuevo Empleado
          </Button>
        </Col>
        <Col lg={5} md={8} sm={8} xs={7}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarCambioBusqueda}
          />
        </Col>
      </Row>

      {errorCarga && <Alert variant="danger" className="mt-3">{errorCarga}</Alert>}

      <TablaEmpleados
        empleados={empleadosPaginados}
        cargando={cargando}
        error={errorCarga}
        onActualizar={manejarActualizar}
        onEliminar={eliminarEmpleado}
        totalElementos={empleadosFiltrados.length}
        elementosPorPagina={elementosPorPagina}
        paginaActual={paginaActual}
        establecerPaginaActual={establecerPaginaActual}
      />

      <ModalRegistroEmpleado
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoEmpleado={empleadoActual}
        manejarCambioInput={manejarCambioInput}
        agregarEmpleado={modoEdicion ? actualizarEmpleado : agregarEmpleado}
        actualizarEmpleado={actualizarEmpleado}
        errorCarga={errorCarga}
        esEdicion={modoEdicion}
      />
    </Container>
  );
};

export default Empleados;