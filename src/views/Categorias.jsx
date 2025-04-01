// Importaciones necesarias para la vista
import React, { useState, useEffect } from 'react';
import TablaCategorias from '../components/categorias/TablaCategorias'; // Importa el componente de tabla
import ModalRegistroCategoria from '../components/categorias/ModalRegistroCategoria';
import { Container, Button } from "react-bootstrap";


// Declaración del componente Categorias
const Categorias = () => {
  // Estados para manejar los datos, carga y errores
  const [listaCategorias, setListaCategorias] = useState([]); // Almacena los datos de la API
  const [cargando, setCargando] = useState(true);            // Controla el estado de carga
  const [errorCarga, setErrorCarga] = useState(null);        // Maneja errores de la petición
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState({
    nombre_categoria: '',
    descripcion_categoria: ''
  });

   const obtenerCategorias = async () => { // Método renombrado a español
      try {
        const respuesta = await fetch('http://localhost:3000/api/categorias');
        if (!respuesta.ok) {
          throw new Error('Error al cargar las categorías');
        }
        const datos = await respuesta.json();
        setListaCategorias(datos);    // Actualiza el estado con los datos
        setCargando(false);           // Indica que la carga terminó
      } catch (error) {
        setErrorCarga(error.message); // Guarda el mensaje de error
        setCargando(false);           // Termina la carga aunque haya error
      }
    };

  // Lógica de obtención de datos con useEffect
  useEffect(() => {
    obtenerCategorias();            // Ejecuta la función al montar el componente
  }, []);                           // Array vacío para que solo se ejecute una vez

  // Maneja los cambios en los inputs del modal
  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevaCategoria(prev => ({
      ...prev,
      [name]: value
    }));
  };

// Manejo la inserción de una nueva categoría
const agregarCategoria = async () => {

  if (!nuevaCategoria.nombre_categoria || !nuevaCategoria.descripcion_categoria) {
  setErrorCarga("Por favor, completa todos los campos antes de guardar.");
  return;
  }

  try {
    const respuesta = await fetch('http://localhost:3000/api/registrarcategoria', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nuevaCategoria),
    });

    if (!respuesta.ok) {
      throw new Error('Error al agregar la categoría');
    }

    await obtenerCategorias(); // Refresca toda la lista desde el servidor
    setNuevaCategoria({ nombre_categoria: '', descripcion_categoria: '' });
    setMostrarModal(false);
    setErrorCarga(null);
  } catch (error) {
    setErrorCarga(error.message);
  }
};

  // Renderizado de la vista
  return (
    <>
      <Container className="mt-5">
        <br />
        <h4>Categorías</h4>

        <Button variant="primary" onClick={() => setMostrarModal(true)}>
          Nueva Categoría
        </Button>
        <br/><br/>

        {/* Pasa los estados como props al componente TablaCategorias */}
        <TablaCategorias 
          categorias={listaCategorias} 
          cargando={cargando} 
          error={errorCarga} 
        />
               <ModalRegistroCategoria
          mostrarModal={mostrarModal}
          setMostrarModal={setMostrarModal}
          nuevaCategoria={nuevaCategoria}
          manejarCambioInput={manejarCambioInput}
          agregarCategoria={agregarCategoria}
          errorCarga={errorCarga}
        />

      </Container>
    </>
  );
};

// Exportación del componente
export default Categorias;