import React, { useState, useEffect } from 'react';
import TablaCompras from '../components/compras/TablaCompras';
import ModalRegistroCompra from '../components/compras/ModalRegistroCompra';
import { Container, Button, Form } from 'react-bootstrap';

const Compras = () => {
  const [listaCompras, setListaCompras] = useState([]);
  const [comprasFiltradas, setComprasFiltradas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [filtroBusqueda, setFiltroBusqueda] = useState('');
  const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 3;

  const [nuevaCompra, setNuevaCompra] = useState({
    fecha_compra: '',
    empleado: '',
    producto: '',
    cantidad: 1,
    precio_unitario: 0,
  });

  useEffect(() => {
    const obtenerCompras = async () => {
      try {
        const respuesta = await fetch('http://localhost:3000/api/compras');
        if (!respuesta.ok) {
          throw new Error('Error al cargar las compras');
        }
        const datos = await respuesta.json();
        setListaCompras(datos);
        setComprasFiltradas(datos);
        setCargando(false);
      } catch (error) {
        setErrorCarga(error.message);
        setCargando(false);
      }
    };
    obtenerCompras();
  }, []);

  useEffect(() => {
    const resultados = listaCompras.filter(compra =>
      compra.nombre_empleado.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
      compra.nombre_producto.toLowerCase().includes(filtroBusqueda.toLowerCase())
    );
    setComprasFiltradas(resultados);
    establecerPaginaActual(1); // Resetea a la primera página al buscar
  }, [filtroBusqueda, listaCompras]);

  const manejarCambioInput = (event) => {
    const { name, value } = event.target;
    setNuevaCompra((prevCompra) => ({
      ...prevCompra,
      [name]: value,
    }));
  };

  const registrarCompra = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/registrarcompra', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevaCompra),
      });

      if (!respuesta.ok) {
        throw new Error('Error al registrar la compra');
      }

      const compraRegistrada = await respuesta.json();
      setListaCompras((prevCompras) => [...prevCompras, compraRegistrada]);
      setMostrarModal(false);
      setNuevaCompra({
        fecha_compra: '',
        empleado: '',
        producto: '',
        cantidad: 1,
        precio_unitario: 0,
      });
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  // Calcular compras paginadas
  const comprasPaginadas = comprasFiltradas.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  return (
    <>
      <Container className="mt-5">
        <h4>Compras con Detalles</h4>

        <Button variant="primary" onClick={() => setMostrarModal(true)}>
          Registrar Nueva Compra
        </Button>

        <Form.Group controlId="formBusqueda" className="mt-3 mb-3">
          <div className="input-group">
            <span className="input-group-text">
              <i className="fas fa-search"></i>
            </span>
            <Form.Control
              type="text"
              placeholder="Buscar por empleado o producto"
              value={filtroBusqueda}
              onChange={(e) => setFiltroBusqueda(e.target.value)}
            />
          </div>
        </Form.Group>

        <TablaCompras
          compras={comprasPaginadas}
          cargando={cargando}
          error={errorCarga}
          totalElementos={comprasFiltradas.length}
          elementosPorPagina={elementosPorPagina}
          paginaActual={paginaActual}
          establecerPaginaActual={establecerPaginaActual}
        />
      </Container>

      <ModalRegistroCompra
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevaCompra={nuevaCompra}
        manejarCambioInput={manejarCambioInput}
        registrarCompra={registrarCompra}
        errorCarga={errorCarga}
      />
    </>
  );
};

export default Compras;