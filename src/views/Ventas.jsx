import React, { useState, useEffect } from 'react';
import TablaVentas from '../components/ventas/TablaVentas';
import { Container, Button, Form, Row, Col } from 'react-bootstrap';
import ModalDetallesVenta from '../components/detalles_ventas/ModalDetallesVenta';
import ModalEliminacionVenta from '../components/ventas/ModalEliminacionVenta'; // New import
import ModalRegistroVenta from '../components/ventas/ModalRegistroVenta'; // New import

const Ventas = () => {
  // Estados para la lista de ventas
  const [listaVentas, setListaVentas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [errorCarga, setErrorCarga] = useState(null);
  
  // Estados para el modal de detalles
  const [mostrarModal, setMostrarModal] = useState(false);
  const [detallesVenta, setDetallesVenta] = useState([]);
  const [cargandoDetalles, setCargandoDetalles] = useState(false);
  const [errorDetalles, setErrorDetalles] = useState(null);

  // New states for deletion and registration
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [ventaAEliminar, setVentaAEliminar] = useState(null);
  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [productos, setProductos] = useState([]);
  const [nuevaVenta, setNuevaVenta] = useState({
    id_cliente: '',
    id_empleado: '',
    fecha_venta: new Date(),
    total_venta: 0,
  });
  const [detallesNuevos, setDetallesNuevos] = useState([]);

  // Función para obtener la lista de ventas
  const obtenerVentas = async () => {
    setCargando(true);
    setErrorCarga(null);
    try {
      const respuesta = await fetch('http://localhost:3000/api/obtenerventas');
      if (!respuesta.ok) {
        throw new Error('Error al cargar las ventas');
      }
      const datos = await respuesta.json();
      setListaVentas(datos);
      setCargando(false);
    } catch (error) {
      setErrorCarga(error.message);
      setCargando(false);
    }
  };

  // Función para obtener detalles de una venta
  const obtenerDetalles = async (id_venta) => {
    setCargandoDetalles(true);
    setErrorDetalles(null);
    try {
      const respuesta = await fetch(`http://localhost:3000/api/obtenerdetallesventa/${id_venta}`);
      if (!respuesta.ok) {
        throw new Error('Error al cargar los detalles de la venta');
      }
      const datos = await respuesta.json();
      setDetallesVenta(datos);
      setCargandoDetalles(false);
      setMostrarModal(true); // Abre el modal
    } catch (error) {
      setErrorDetalles(error.message);
      setCargandoDetalles(false);
    }
  };

  // New functions for deletion and registration
  const eliminarVenta = async () => {
    if (!ventaAEliminar) return;

    try {
      const respuesta = await fetch(`http://localhost:3000/api/eliminarventa/${ventaAEliminar.id_venta}`, {
        method: 'DELETE',
      });

      if (!respuesta.ok) {
        throw new Error('Error al eliminar la venta');
      }

      setMostrarModalEliminacion(false);
      await obtenerVentas();
      setVentaAEliminar(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const abrirModalEliminacion = (venta) => {
    setVentaAEliminar(venta);
    setMostrarModalEliminacion(true);
  };

  const obtenerClientes = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/clientes');
      if (!respuesta.ok) throw new Error('Error al cargar los clientes');
      const datos = await respuesta.json();
      setClientes(datos);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const obtenerEmpleados = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/empleados');
      if (!respuesta.ok) throw new Error('Error al cargar los empleados');
      const datos = await respuesta.json();
      setEmpleados(datos);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const obtenerProductos = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/productos');
      if (!respuesta.ok) throw new Error('Error al cargar los productos');
      const datos = await respuesta.json();
      setProductos(datos);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const agregarDetalle = (detalle) => {
    setDetallesNuevos((prev) => [...prev, detalle]);
    setNuevaVenta((prev) => ({
      ...prev,
      total_venta: prev.total_venta + detalle.cantidad * detalle.precio_unitario,
    }));
  };

  const agregarVenta = async () => {
    if (!nuevaVenta.id_cliente || !nuevaVenta.id_empleado || !nuevaVenta.fecha_venta || detallesNuevos.length === 0) {
      setErrorCarga('Por favor, completa todos los campos y agrega al menos un detalle.');
      return;
    }

    try {
      const ventaData = {
        id_cliente: nuevaVenta.id_cliente,
        id_empleado: nuevaVenta.id_empleado,
        fecha_venta: nuevaVenta.fecha_venta.toISOString(),
        total_venta: detallesNuevos.reduce((sum, d) => sum + d.cantidad * d.precio_unitario, 0),
        detalles: detallesNuevos,
      };

      const respuesta = await fetch('http://localhost:3000/api/registrarventa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ventaData),
      });

      if (!respuesta.ok) throw new Error('Error al registrar la venta');

      await obtenerVentas();
      setNuevaVenta({ id_cliente: '', id_empleado: '', fecha_venta: new Date(), total_venta: 0 });
      setDetallesNuevos([]);
      setMostrarModalRegistro(false);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  // Cargar las ventas al montar el componente
  useEffect(() => {
    obtenerVentas();
    obtenerClientes();
    obtenerEmpleados();
    obtenerProductos();
  }, []);

  return (
    <Container>
      <h1 className="my-4">Listado de Ventas</h1>
      
      {/* New "Nueva Venta" button */}
      <Row>
        <Col lg={2} md={4} sm={4} xs={5}>
          <Button variant="primary" onClick={() => setMostrarModalRegistro(true)} style={{ width: '100%' }}>
            Nueva Venta
          </Button>
        </Col>
      </Row>
      <br />

      <TablaVentas
        ventas={listaVentas}
        cargando={cargando}
        error={errorCarga}
        obtenerDetalles={obtenerDetalles}
        abrirModalEliminacion={abrirModalEliminacion} // New prop
      />
      
      <ModalDetallesVenta
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        detalles={detallesVenta}
        cargandoDetalles={cargandoDetalles}
        errorDetalles={errorDetalles}
      />

      {/* New ModalEliminacionVenta */}
      <ModalEliminacionVenta
        mostrar={mostrarModalEliminacion}
        onHide={() => setMostrarModalEliminacion(false)}
        onConfirm={eliminarVenta}
        venta={ventaAEliminar}
      />

      {/* New ModalRegistroVenta */}
      <ModalRegistroVenta
        mostrarModal={mostrarModalRegistro}
        setMostrarModal={setMostrarModalRegistro}
        nuevaVenta={nuevaVenta}
        setNuevaVenta={setNuevaVenta}
        detallesVenta={detallesNuevos}
        setDetallesVenta={setDetallesNuevos}
        agregarDetalle={agregarDetalle}
        agregarVenta={agregarVenta}
        errorCarga={errorCarga}
        clientes={clientes}
        empleados={empleados}
        productos={productos}
      />
    </Container>
  );
};

export default Ventas;