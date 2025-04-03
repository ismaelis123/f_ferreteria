import React, { useState, useEffect } from 'react';
import TablaCompras from '../components/compras/TablaCompras'; // Importa el componente de tabla para compras
import ModalRegistroCompra from '../components/compras/ModalRegistroCompra'; // Importa el componente de modal para registro de compra
import { Container, Button } from 'react-bootstrap';

const Compras = () => {
  // Estados para manejar los datos, carga, errores y la visibilidad del modal
  const [listaCompras, setListaCompras] = useState([]);  // Almacena los datos de la API
  const [cargando, setCargando] = useState(true);        // Controla el estado de carga
  const [errorCarga, setErrorCarga] = useState(null);    // Maneja errores de la petición
  const [mostrarModal, setMostrarModal] = useState(false); // Controla la visibilidad del modal
  const [nuevaCompra, setNuevaCompra] = useState({
    fecha_compra: '',
    empleado: '',
    producto: '',
    cantidad: 1,
    precio_unitario: 0,
  }); // Estado para manejar los datos de la nueva compra

  // Lógica de obtención de datos con useEffect
  useEffect(() => {
    const obtenerCompras = async () => {
      try {
        const respuesta = await fetch('http://localhost:3000/api/compras'); // Ruta ajustada para compras
        if (!respuesta.ok) {
          throw new Error('Error al cargar las compras');
        }
        const datos = await respuesta.json();
        setListaCompras(datos);   // Actualiza el estado con los datos
        setCargando(false);       // Indica que la carga terminó
      } catch (error) {
        setErrorCarga(error.message); // Guarda el mensaje de error
        setCargando(false);           // Termina la carga aunque haya error
      }
    };
    obtenerCompras();            // Ejecuta la función al montar el componente
  }, []);                        // Array vacío para que solo se ejecute una vez

  // Maneja el cambio de los inputs en el formulario de nueva compra
  const manejarCambioInput = (event) => {
    const { name, value } = event.target;
    setNuevaCompra((prevCompra) => ({
      ...prevCompra,
      [name]: value,
    }));
  };

  // Maneja el registro de la compra
  const registrarCompra = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/registrarcompra', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Se asegura de que el cuerpo sea JSON
        },
        body: JSON.stringify(nuevaCompra),  // Envia los datos como JSON
      });

      if (!respuesta.ok) {
        throw new Error('Error al registrar la compra');
      }

      const compraRegistrada = await respuesta.json();
      setListaCompras((prevCompras) => [...prevCompras, compraRegistrada]); // Actualiza la lista de compras
      setMostrarModal(false);  // Cierra el modal
      setNuevaCompra({
        fecha_compra: '',
        empleado: '',
        producto: '',
        cantidad: 1,
        precio_unitario: 0,
      }); // Resetea los valores del formulario
    } catch (error) {
      setErrorCarga(error.message); // Guarda el mensaje de error
    }
  };

  // Renderizado de la vista
  return (
    <>
      <Container className="mt-5">
        <h4>Compras con Detalles</h4>

        {/* Botón para abrir el modal de registro de compra */}
        <Button variant="primary" onClick={() => setMostrarModal(true)}>
          Registrar Nueva Compra
        </Button>

        {/* Tabla de compras */}
        <TablaCompras
          compras={listaCompras}
          cargando={cargando}
          error={errorCarga}
        />
      </Container>

      {/* Modal para registrar una nueva compra */}
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
