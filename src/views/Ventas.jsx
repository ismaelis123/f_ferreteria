// Importaciones necesarias para la vista
import React, { useState, useEffect } from 'react';
import TablaVentas from '../components/ventas/TablaVentas'; // Importa el componente de tabla
import { Container } from "react-bootstrap";

// Declaración del componente Ventas
const Ventas = () => {
  // Estados para manejar los datos, carga y errores
  const [listaVentas, setListaVentas] = useState([]); // Almacena los datos de la API
  const [cargando, setCargando] = useState(true);     // Controla el estado de carga
  const [errorCarga, setErrorCarga] = useState(null); // Maneja errores de la petición

  // Lógica de obtención de datos con useEffect
  useEffect(() => {
    const obtenerVentas = async () => {
      try {
        const respuesta = await fetch('http://localhost:3000/api/ventas'); // Ruta ajustada al controlador
        if (!respuesta.ok) {
          throw new Error('Error al cargar las ventas');
        }
        const datos = await respuesta.json();
        setListaVentas(datos);    // Actualiza el estado con los datos
        setCargando(false);       // Indica que la carga terminó
      } catch (error) {
        setErrorCarga(error.message); // Guarda el mensaje de error
        setCargando(false);       // Termina la carga aunque haya error
      }
    };
    obtenerVentas();            // Ejecuta la función al montar el componente
  }, []);                       // Array vacío para que solo se ejecute una vez

  // Renderizado de la vista
  return (
    <>
      <Container className="mt-5">
        <br />
        <h4>Ventas con Detalles</h4>

        {/* Pasa los estados como props al componente TablaVentas */}
        <TablaVentas
          ventas={listaVentas}
          cargando={cargando}
          error={errorCarga}
        />
      </Container>
    </>
  );
};

// Exportación del componente
export default Ventas;