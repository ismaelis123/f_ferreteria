import React, { useState, useEffect } from 'react';
import TablaCompras from '../components/compras/TablaCompras';
import ModalDetalleCompra from '../detalles_compras/ModalDetallesCompra';
import ModalActualizacionCompra from '../components/compras/ModalActualizacionCompra';
import ModalEliminacionCompra from '../components/compras/ModalEliminacionCompra';
import ModalRegistroCompra from '../components/compras/ModalRegistroCompra';
import { Container, Button, Row, Col } from "react-bootstrap";

// Declaración del componente Compras
const Compras = () => {
  // Estados para manejar los datos, carga y errores
  const [listaCompras, setListaCompras] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [detallesCompra, setDetallesCompra] = useState([]);
  const [cargandoDetalles, setCargandoDetalles] = useState(false);
  const [errorDetalles, setErrorDetalles] = useState(null);

  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [compraAEliminar, setCompraAEliminar] = useState(null);

  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);
  const [mostrarModalActualizacion, setMostrarModalActualizacion] = useState(false);
  const [compraAEditar, setCompraAEditar] = useState(null);
  const [detallesEditados, setDetallesEditados] = useState([]);

  const [empleados, setEmpleados] = useState([]);
  const [productos, setProductos] = useState([]);
  const [nuevaCompra, setNuevaCompra] = useState({
    id_empleado: '',
    fecha_compra: new Date(),
    total_compra: 0
  });
  const [detallesNuevos, setDetallesNuevos] = useState([]);

  // Función para abrir el modal de actualización
  const abrirModalActualizacion = async (compra) => {
    setCompraAEditar({
      id_compra: compra.id_compra,
      id_empleado: compra.id_empleado || '',
      fecha_compra: compra.fecha_compra ? new Date(compra.fecha_compra.split('/').reverse().join('-')) : new Date(),
      total_compra: parseFloat(compra.total_compra) || 0
    });
    setCargandoDetalles(true);
    try {
      const respuesta = await fetch(`http://localhost:3000/api/obtenerdetallescompra/${compra.id_compra}`);
      if (!respuesta.ok) throw new Error('Error al cargar los detalles de la compra');
      const datos = await respuesta.json();
      setDetallesEditados(datos);
      setCargandoDetalles(false);
      setMostrarModalActualizacion(true);
    } catch (error) {
      setErrorDetalles(error.message);
      setCargandoDetalles(false);
    }
  };

  // Función para actualizar una compra
  const actualizarCompra = async (compraActualizada, detalles) => {
    if (!compraActualizada.id_empleado || !compraActualizada.fecha_compra || detalles.length === 0) {
      setErrorCarga("Por favor, completa todos los campos y agrega al menos un detalle.");
      return;
    }
    try {
      const compraData = {
        id_compra: compraActualizada.id_compra,
        id_empleado: compraActualizada.id_empleado,
        fecha_compra: compraActualizada.fecha_compra.toISOString(),
        total_compra: detalles.reduce((sum, d) => sum + (d.cantidad * d.precio_unitario), 0),
        detalles
      };
      const respuesta = await fetch(`http://localhost:3000/api/actualizarcompra/${compraActualizada.id_compra}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(compraData)
      });
      if (!respuesta.ok) throw new Error('Error al actualizar la compra');
      await obtenerCompras();
      setMostrarModalActualizacion(false);
      setCompraAEditar(null);
      setDetallesEditados([]);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  // Función para eliminar una compra
  const eliminarCompra = async () => {
    if (!compraAEliminar) return;

    try {
      const respuesta = await fetch(`http://localhost:3000/api/eliminarcompra/${compraAEliminar.id_compra}`, {
        method: 'DELETE',
      });

      if (!respuesta.ok) {
        throw new Error('Error al eliminar la compra');
      }
      
      setMostrarModalEliminacion(false);
      await obtenerCompras();
      setCompraAEliminar(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  // Función para abrir el modal de eliminación
  const abrirModalEliminacion = (compra) => {
    setCompraAEliminar(compra);
    setMostrarModalEliminacion(true);
  };

  // Función para agregar un detalle a la nueva compra
  const agregarDetalle = (detalle) => {
    setDetallesNuevos(prev => [...prev, detalle]);
    setNuevaCompra(prev => ({
      ...prev,
      total_compra: prev.total_compra + (detalle.cantidad * detalle.precio_unitario)
    }));
  };

  // Función para agregar una nueva compra
  const agregarCompra = async () => {
    if (!nuevaCompra.id_empleado || !nuevaCompra.fecha_compra || detallesNuevos.length === 0) {
      setErrorCarga("Por favor, completa todos los campos y agrega al menos un detalle.");
      return;
    }

    try {
      const compraData = {
        id_empleado: Number(nuevaCompra.id_empleado),
        fecha_compra: nuevaCompra.fecha_compra.toISOString(),
        total_compra: detallesNuevos.reduce((sum, d) => sum + (d.cantidad * d.precio_unitario), 0),
        detalles: detallesNuevos
      };

      const respuesta = await fetch('http://localhost:3000/api/registrarcompra', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(compraData)
      });

      if (!respuesta.ok) {
        const errorData = await respuesta.json();
        throw new Error(errorData.message || 'Error al registrar la compra');
      }

      await obtenerCompras();
      setNuevaCompra({ id_empleado: '', fecha_compra: new Date(), total_compra: 0 });
      setDetallesNuevos([]);
      setMostrarModalRegistro(false);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  // Función para obtener empleados
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

  // Función para obtener productos
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

  // Función para obtener detalles de una compra
  const obtenerDetalles = async (id_compra) => {
    setCargandoDetalles(true);
    setErrorDetalles(null);
    try {
      const respuesta = await fetch(`http://localhost:3000/api/obtenerdetallescompra/${id_compra}`);
      if (!respuesta.ok) {
        throw new Error('Error al cargar los detalles de la compra');
      }
      const datos = await respuesta.json();
      setDetallesCompra(datos);
      setCargandoDetalles(false);
      setMostrarModal(true);
    } catch (error) {
      setErrorDetalles(error.message);
      setCargandoDetalles(false);
    }
  };

  // Función para obtener todas las compras
  const obtenerCompras = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/obtenercompras');
      if (!respuesta.ok) {
        throw new Error('Error al cargar las compras');
      }
      const datos = await respuesta.json();
      setListaCompras(datos);
      setCargando(false);
    } catch (error) {
      setErrorCarga(error.message);
      setCargando(false);
    }
  };

  // Lógica de obtención de datos con useEffect
  useEffect(() => {
    obtenerCompras();
    obtenerEmpleados();
    obtenerProductos();
  }, []);

  // Renderizado de la vista
  return (
    <>
      <Container className="mt-5">
        <br />
        <h4>Compras con Detalles</h4>
        <Row>
          <Col lg={2} md={4} sm={4} xs={5}>
            <Button variant="primary" onClick={() => setMostrarModalRegistro(true)} style={{ width: "100%" }}>
              Nueva Compra
            </Button>
          </Col>
        </Row>
        <br />

        <TablaCompras
          compras={listaCompras}
          cargando={cargando}
          error={errorCarga}
          obtenerDetalles={obtenerDetalles}
          abrirModalEliminacion={abrirModalEliminacion}
          abrirModalActualizacion={abrirModalActualizacion}
        />

        <ModalDetalleCompra
          mostrarModal={mostrarModal}
          setMostrarModal={setMostrarModal}
          detalles={detallesCompra}
          cargandoDetalles={cargandoDetalles}
          errorDetalles={errorDetalles}
        />

        <ModalEliminacionCompra
          mostrarModalEliminacion={mostrarModalEliminacion}
          setMostrarModalEliminacion={setMostrarModalEliminacion}
          eliminarCompra={eliminarCompra}
        />

        <ModalRegistroCompra
          mostrarModal={mostrarModalRegistro}
          setMostrarModal={setMostrarModalRegistro}
          nuevaCompra={nuevaCompra}
          setNuevaCompra={setNuevaCompra}
          detallesCompra={detallesNuevos}
          setDetallesCompra={setDetallesNuevos}
          agregarDetalle={agregarDetalle}
          agregarCompra={agregarCompra}
          errorCarga={errorCarga}
          empleados={empleados}
          productos={productos}
        />

        <ModalActualizacionCompra
          mostrarModal={mostrarModalActualizacion}
          setMostrarModal={setMostrarModalActualizacion}
          compra={compraAEditar}
          detallesCompra={detallesEditados}
          setDetallesCompra={setDetallesEditados}
          actualizarCompra={actualizarCompra}
          errorCarga={errorCarga}
          empleados={empleados}
          productos={productos}
        />
      </Container>
    </>
  );
};

// Exportación del componente
export default Compras;