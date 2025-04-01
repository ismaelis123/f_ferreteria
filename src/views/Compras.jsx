// Importaciones necesarias para la vista
import React, { useState, useEffect } from 'react';
import TablaCompras from '../components/compras/TablaCompras'; // Importa el componente de tabla para compras
import { Container } from "react-bootstrap";

// Declaración del componente Compras
const Compras = () => {
  // Estados para manejar los datos, carga y errores
  const [listaCompras, setListaCompras] = useState([]); // Almacena los datos de la API
  const [cargando, setCargando] = useState(true);       // Controla el estado de carga
  const [errorCarga, setErrorCarga] = useState(null);   // Maneja errores de la petición

  // Lógica de obtención de datos con useEffect
  useEffect(() => {
    const obtenerCompras = async () => {
      try {
        const respuesta = await fetch('http://localhost:3000/api/compras'); // Ruta ajustada para compras
        if (!respuesta.ok) {
          throw new Error('Error al cargar las compras');
        }
        const datos = await respuesta.json();
        setListaCompras(datos);    // Actualiza el estado con los datos
        setCargando(false);        // Indica que la carga terminó
      } catch (error) {
        setErrorCarga(error.message); // Guarda el mensaje de error
        setCargando(false);        // Termina la carga aunque haya error
      }
    };
    obtenerCompras();            // Ejecuta la función al montar el componente
  }, []);                        // Array vacío para que solo se ejecute una vez

  // Renderizado de la vista
  return (
    <>
      <Container className="mt-5">
        <br />
        <h4>Compras con Detalles</h4>

        {/* Pasa los estados como props al componente TablaCompras */}
        <TablaCompras
          compras={listaCompras}
          cargando={cargando}
          error={errorCarga}
        />
      </Container>
    </>
  );
};

// Exportación del componente
export default Compras;