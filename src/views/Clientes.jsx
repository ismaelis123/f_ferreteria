// Importaciones necesarias para la vista
import React, { useState, useEffect } from 'react';
import TablaClientes from '../components/clientes/TablaClientes'; 
import ModalRegistroCliente from '../components/clientes/ModalRegistroCliente';
import { Container, Button, Alert } from "react-bootstrap";

// Declaración del componente Clientes
const Clientes = () => {
  // Estados principales
  const [listaClientes, setListaClientes] = useState([]); 
  const [cargando, setCargando] = useState(true);            
  const [errorCarga, setErrorCarga] = useState(null);        
  const [mostrarModal, setMostrarModal] = useState(false);

  // Estado inicial del nuevo cliente
  const estadoInicialCliente = {
    primer_nombre: '',
    segundo_nombre: '',
    primer_apellido: '',
    segundo_apellido: '',
    celular: '',
    direccion: '',
    cedula: ''
  };

  const [nuevoCliente, setNuevoCliente] = useState(estadoInicialCliente);

  // Función para obtener clientes desde la API
  const obtenerClientes = async () => { 
    try {
      const respuesta = await fetch('http://localhost:3000/api/clientes');
      if (!respuesta.ok) throw new Error('Error al cargar los clientes');
      
      const datos = await respuesta.json();
      setListaClientes(datos);
    } catch (error) {
      setErrorCarga(error.message);
    } finally {
      setCargando(false);
    }
  };

  // Ejecutar la obtención de clientes al montar el componente
  useEffect(() => {
    obtenerClientes();
  }, []);

  // Maneja los cambios en los inputs del modal
  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoCliente(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejo de inserción de un nuevo cliente
  const agregarCliente = async () => {
    // Validación de campos obligatorios
    if (!nuevoCliente.primer_nombre || !nuevoCliente.primer_apellido || 
        !nuevoCliente.celular || !nuevoCliente.direccion || !nuevoCliente.cedula) {
      setErrorCarga("Todos los campos obligatorios deben completarse.");
      return;
    }

    try {
      const respuesta = await fetch('http://localhost:3000/api/registrarcliente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoCliente),
      });

      if (!respuesta.ok) throw new Error('Error al agregar el cliente');

      await obtenerClientes(); // Refrescar la lista
      setNuevoCliente(estadoInicialCliente); // Reiniciar formulario
      setMostrarModal(false);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  // Renderizado de la vista
  return (
    <Container className="mt-5">
      <h4>Clientes</h4>
      
      <Button variant="primary" onClick={() => setMostrarModal(true)}>
        Nuevo Cliente
      </Button>

      {errorCarga && <Alert variant="danger" className="mt-3">{errorCarga}</Alert>}

      <TablaClientes clientes={listaClientes} cargando={cargando} error={errorCarga} />

      <ModalRegistroCliente
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoCliente={nuevoCliente}
        manejarCambioInput={manejarCambioInput}
        agregarCliente={agregarCliente}
        errorCarga={errorCarga}
      />
    </Container>
  );
};

export default Clientes;
