import React, { useState, useEffect } from 'react';
import TablaVentas from '../components/ventas/TablaVentas';
import { Container, Button, Form } from 'react-bootstrap';
import ModalDetallesVenta from '../components/detalles_ventas/ModalDetallesVenta';

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

  // Cargar las ventas al montar el componente
  useEffect(() => {
    obtenerVentas();
  }, []);

  return (
    <Container>
      <h1 className="my-4">Listado de Ventas</h1>
      
      <TablaVentas
        ventas={listaVentas}
        cargando={cargando}
        error={errorCarga}
        obtenerDetalles={obtenerDetalles}
      />
      
      <ModalDetallesVenta
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        detalles={detallesVenta}
        cargandoDetalles={cargandoDetalles}
        errorDetalles={errorDetalles}
      />
    </Container>
  );
};

export default Ventas;