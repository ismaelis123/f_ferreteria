import React, { useState, useEffect } from 'react';
import TablaVentas from '../components/ventas/TablaVentas';
import ModalRegistroVenta from '../components/ventas/ModalRegistroVenta';
import { Container, Button, Form } from 'react-bootstrap';

const Ventas = () => {
  const [listaVentas, setListaVentas] = useState([]);
  const [ventasFiltradas, setVentasFiltradas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [filtroBusqueda, setFiltroBusqueda] = useState('');
  const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 3;

  const [nuevaVenta, setNuevaVenta] = useState({
    fecha_venta: '',
    cliente: '',
    empleado: '',
    producto: '',
    cantidad: 1,
    precio_unitario: 0,
  });

  useEffect(() => {
    const obtenerVentas = async () => {
      try {
        const respuesta = await fetch('http://localhost:3000/api/ventas');
        if (!respuesta.ok) {
          throw new Error('Error al cargar las ventas');
        }
        const datos = await respuesta.json();
        setListaVentas(datos);
        setVentasFiltradas(datos);
        setCargando(false);
      } catch (error) {
        setErrorCarga(error.message);
        setCargando(false);
      }
    };
    obtenerVentas();
  }, []);

  useEffect(() => {
    const resultados = listaVentas.filter(venta =>
      venta.nombre_cliente.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
      venta.nombre_empleado.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
      venta.nombre_producto.toLowerCase().includes(filtroBusqueda.toLowerCase())
    );
    setVentasFiltradas(resultados);
    establecerPaginaActual(1); // Resetea a la primera página al buscar
  }, [filtroBusqueda, listaVentas]);

  const manejarCambioInput = (event) => {
    const { name, value } = event.target;
    setNuevaVenta((prevVenta) => ({
      ...prevVenta,
      [name]: value,
    }));
  };

  const registrarVenta = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/registrarventa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevaVenta),
      });

      if (!respuesta.ok) {
        throw new Error('Error al registrar la venta');
      }

      const ventaRegistrada = await respuesta.json();
      setListaVentas((prevVentas) => [...prevVentas, ventaRegistrada]);
      setMostrarModal(false);
      setNuevaVenta({
        fecha_venta: '',
        cliente: '',
        empleado: '',
        producto: '',
        cantidad: 1,
        precio_unitario: 0,
      });
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  // Calcular ventas paginadas
  const ventasPaginadas = ventasFiltradas.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  return (
    <Container className="mt-5">
      <h4>Ventas con Detalles</h4>

      <Button variant="primary" onClick={() => setMostrarModal(true)}>
        Registrar Nueva Venta
      </Button>

      <Form.Group controlId="formBusqueda" className="mt-3 mb-3">
        <div className="input-group">
          <span className="input-group-text">
            <i className="fas fa-search"></i>
          </span>
          <Form.Control
            type="text"
            placeholder="Buscar por cliente, empleado o producto"
            value={filtroBusqueda}
            onChange={(e) => setFiltroBusqueda(e.target.value)}
          />
        </div>
      </Form.Group>

      <TablaVentas
        ventas={ventasPaginadas}
        cargando={cargando}
        error={errorCarga}
        totalElementos={ventasFiltradas.length}
        elementosPorPagina={elementosPorPagina}
        paginaActual={paginaActual}
        establecerPaginaActual={establecerPaginaActual}
      />

      <ModalRegistroVenta
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevaVenta={nuevaVenta}
        manejarCambioInput={manejarCambioInput}
        registrarVenta={registrarVenta}
        errorCarga={errorCarga}
      />
    </Container>
  );
};

export default Ventas;