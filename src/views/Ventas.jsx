// Importaciones necesarias para la vista
import React, { useState, useEffect } from 'react';
import TablaVentas from '../components/ventas/TablaVentas';
import ModalDetallesVenta from '../components/detalles_ventas/ModalDetallesVenta'; // Corrección de la ruta
import ModalActualizacionVenta from '../components/ventas/ModalActualizacionVenta';
import ModalEliminacionVenta from '../components/ventas/ModalEliminacionVenta';
import ModalRegistroVenta from '../components/ventas/ModalRegistroVenta';
import { Container, Button, Row, Col } from "react-bootstrap";

// Declaración del componente Ventas
const Ventas = () => {
  // Estados para manejar los datos, carga y errores
  const [listaVentas, setListaVentas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [detallesVenta, setDetallesVenta] = useState([]);
  const [cargandoDetalles, setCargandoDetalles] = useState(false);
  const [errorDetalles, setErrorDetalles] = useState(null);
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
    total_venta: 0
  });
  const [detallesNuevos, setDetallesNuevos] = useState([]);
  const [mostrarModalActualizacion, setMostrarModalActualizacion] = useState(false);
  const [ventaAEditar, setVentaAEditar] = useState(null);
  const [detallesEditados, setDetallesEditados] = useState([]);

  const abrirModalActualizacion = async (venta) => {
    setVentaAEditar({
      id_venta: venta.id_venta,
      id_cliente: venta.id_cliente || '',
      id_empleado: venta.id_empleado || '',
      fecha_venta: venta.fecha_venta ? new Date(venta.fecha_venta.split('/').reverse().join('-')) : new Date(),
      total_venta: parseFloat(venta.total_venta) || 0
    });
    setCargandoDetalles(true);
    try {
      const respuesta = await fetch(`http://localhost:3000/api/obtenerdetallesventa/${venta.id_venta}`);
      if (!respuesta.ok) throw new Error('Error al cargar los detalles de la venta');
      const datos = await respuesta.json();
      setDetallesEditados(datos);
      setCargandoDetalles(false);
      setMostrarModalActualizacion(true);
    } catch (error) {
      setErrorDetalles(error.message);
      setCargandoDetalles(false);
    }
  };

  const actualizarVenta = async (ventaActualizada, detalles) => {
    if (!ventaActualizada.id_cliente || !ventaActualizada.id_empleado || !ventaActualizada.fecha_venta || detalles.length === 0) {
      setErrorCarga("Por favor, completa todos los campos y agrega al menos un detalle.");
      return;
    }
    try {
      const ventaData = {
        id_venta: ventaActualizada.id_venta,
        id_cliente: ventaActualizada.id_cliente,
        id_empleado: ventaActualizada.id_empleado,
        fecha_venta: ventaActualizada.fecha_venta.toISOString(),
        total_venta: detalles.reduce((sum, d) => sum + (d.cantidad * d.precio_unitario), 0),
        detalles
      };
      console.log(`Enviando ID venta: ${ventaActualizada.id_venta}`, JSON.stringify(ventaData));
      const respuesta = await fetch(`http://localhost:3000/api/actualizarventa/${ventaActualizada.id_venta}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ventaData)
      });
      if (!respuesta.ok) throw new Error('Error al actualizar la venta');
      await obtenerVentas();
      setMostrarModalActualizacion(false);
      setVentaAEditar(null);
      setDetallesEditados([]);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

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
  
  const agregarDetalle = (detalle) => {
    setDetallesNuevos(prev => [...prev, detalle]);
    setNuevaVenta(prev => ({
      ...prev,
      total_venta: prev.total_venta + (detalle.cantidad * detalle.precio_unitario)
    }));
  };
  
  const agregarVenta = async () => {
    if (!nuevaVenta.id_cliente || !nuevaVenta.id_empleado || !nuevaVenta.fecha_venta || detallesNuevos.length === 0) {
      setErrorCarga("Por favor, completa todos los campos y agrega al menos un detalle.");
      return;
    }
  
    try {
      const ventaData = {
        id_cliente: nuevaVenta.id_cliente,
        id_empleado: nuevaVenta.id_empleado,
        fecha_venta: nuevaVenta.fecha_venta.toISOString(),
        total_venta: detallesNuevos.reduce((sum, d) => sum + (d.cantidad * d.precio_unitario), 0),
        detalles: detallesNuevos
      };
  
      const respuesta = await fetch('http://localhost:3000/api/registrarventa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ventaData)
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
      setMostrarModal(true);
    } catch (error) {
      setErrorDetalles(error.message);
      setCargandoDetalles(false);
    }
  };

  const obtenerVentas = async () => {
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

  useEffect(() => {
    obtenerVentas();
    obtenerClientes();
    obtenerEmpleados();
    obtenerProductos();
  }, []);

  return (
    <>
      <Container className="mt-5">
        <br />
        <h4>Ventas con Detalles</h4>
        <Row>
          <Col lg={2} md={4} sm={4} xs={5}>
            <Button variant="primary" onClick={() => setMostrarModalRegistro(true)} style={{ width: "100%" }}>
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
          abrirModalEliminacion={abrirModalEliminacion}
          abrirModalActualizacion={abrirModalActualizacion}
        />

        <ModalDetallesVenta
          mostrarModal={mostrarModal}
          setMostrarModal={setMostrarModal}
          detalles={detallesVenta}
          cargandoDetalles={cargandoDetalles}
          errorDetalles={errorDetalles}
        />

        <ModalEliminacionVenta
          mostrarModalEliminacion={mostrarModalEliminacion}
          setMostrarModalEliminacion={setMostrarModalEliminacion}
          eliminarVenta={eliminarVenta}
        />

        <ModalRegistroVenta
          mostrarModal={mostrarModalRegistro}
          setMostrarModal={setMostrarModalRegistro}
          nuevaVenta={nuevaVenta}
          setNuevaVenta={setNuevaVenta}
          detallesVenta={detallesNuevos}
          setDetallesVenta={setDetallesNuevos} // Puedes usar setDetallesNuevos en lugar de setDetallesVenta.setDetallesVenta(detallesNuevos)
          agregarDetalle={agregarDetalle}
          agregarVenta={agregarVenta}
          errorCarga={errorCarga}
          clientes={clientes}
          empleados={empleados}
          productos={productos}
        />

        <ModalActualizacionVenta
          mostrarModal={mostrarModalActualizacion}
          setMostrarModal={setMostrarModalActualizacion}
          venta={ventaAEditar}
          detallesVenta={detallesEditados}
          setDetallesVenta={setDetallesEditados}
          actualizarVenta={actualizarVenta}
          errorCarga={errorCarga}
          clientes={clientes}
          empleados={empleados}
          productos={productos}
        />
      </Container>
    </>
  );
}

export default Ventas;