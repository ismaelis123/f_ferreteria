import React, { useState, useEffect } from 'react';
import TablaClientes from '../components/clientes/TablaClientes'; 
import ModalRegistroCliente from '../components/clientes/ModalRegistroCliente';
import { Container, Button, Alert, Form } from "react-bootstrap";

const Clientes = () => {
  const [listaClientes, setListaClientes] = useState([]); 
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [cargando, setCargando] = useState(true);            
  const [errorCarga, setErrorCarga] = useState(null);        
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const estadoInicialCliente = { id_cliente: null, primer_nombre: '', celular: '', cedula: '' };
  const [clienteActual, setClienteActual] = useState(estadoInicialCliente);
  const [filtroBusqueda, setFiltroBusqueda] = useState("");

  const obtenerClientes = async () => { 
    try {
      const respuesta = await fetch('http://localhost:3000/api/clientes');
      if (!respuesta.ok) throw new Error('Error al cargar los clientes');
      
      const datos = await respuesta.json();
      setListaClientes(datos);
      setClientesFiltrados(datos);
    } catch (error) {
      setErrorCarga(error.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerClientes();
  }, []);

  useEffect(() => {
    const resultados = listaClientes.filter(cliente => 
      cliente.primer_nombre.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
      cliente.cedula.toLowerCase().includes(filtroBusqueda.toLowerCase())
    );
    setClientesFiltrados(resultados);
  }, [filtroBusqueda, listaClientes]);

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setClienteActual(prev => ({ ...prev, [name]: value }));
  };

  const agregarCliente = async () => {
    if (!clienteActual.primer_nombre || !clienteActual.celular || !clienteActual.cedula) {
      setErrorCarga("Todos los campos obligatorios deben completarse.");
      return;
    }

    try {
      const respuesta = await fetch('http://localhost:3000/api/registrarcliente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clienteActual),
      });

      if (!respuesta.ok) throw new Error('Error al agregar el cliente');
      obtenerClientes();
      setClienteActual(estadoInicialCliente);
      setMostrarModal(false);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const eliminarCliente = async (id) => {
    // Mostrar un cuadro de confirmación
    const confirmar = window.confirm("¿Estás seguro de que quieres eliminar este cliente?");
    
    if (confirmar) {
      try {
        const respuesta = await fetch(`http://localhost:3000/api/eliminarcliente/${id}`, {
          method: 'DELETE',
        });
        if (!respuesta.ok) throw new Error('Error al eliminar el cliente');
        obtenerClientes();
      } catch (error) {
        setErrorCarga(error.message);
      }
    }
  };
  

  const actualizarCliente = async () => {
    try {
      const respuesta = await fetch(`http://localhost:3000/api/actualizarcliente/${clienteActual.id_cliente}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clienteActual),
      });
      if (!respuesta.ok) throw new Error('Error al actualizar el cliente');
      obtenerClientes();
      setModoEdicion(false);
      setMostrarModal(false);
      setClienteActual(estadoInicialCliente);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const manejarActualizar = (cliente) => {
    setClienteActual(cliente);
    setModoEdicion(true);
    setMostrarModal(true);
  };

  return (
    <Container className="mt-5">
      <h4>Clientes</h4>
      
      <Button variant="primary" onClick={() => {setMostrarModal(true); setModoEdicion(false);}}>
        Nuevo Cliente
      </Button>
      <Form.Group controlId="formBusqueda" className="mt-3 mb-3">
  <div className="input-group">
    <span className="input-group-text">
      <i className="fas fa-search"></i> {/* Icono de búsqueda */}
    </span>
    <Form.Control
      type="text"
      placeholder="Buscar"
      value={filtroBusqueda}
      onChange={(e) => setFiltroBusqueda(e.target.value)}
    />
  </div>
</Form.Group>


      {errorCarga && <Alert variant="danger" className="mt-3">{errorCarga}</Alert>}

      <TablaClientes 
        clientes={clientesFiltrados} 
        cargando={cargando} 
        error={errorCarga} 
        onActualizar={manejarActualizar} 
        onEliminar={eliminarCliente} 
      />

      <ModalRegistroCliente
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoCliente={clienteActual}
        manejarCambioInput={manejarCambioInput}
        agregarCliente={modoEdicion ? actualizarCliente : agregarCliente}
        eliminarCliente={eliminarCliente}
        errorCarga={errorCarga}
      />
    </Container>
  );
};

export default Clientes;
