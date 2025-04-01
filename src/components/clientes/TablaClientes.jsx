// Importaciones necesarias para el componente visual
import React from 'react';
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// Declaración del componente TablaClientes que recibe props
const TablaClientes = ({ clientes, cargando, error }) => {
  // Renderizado condicional según el estado recibido por props
  if (cargando) {
    return <div>Cargando clientes...</div>; // Muestra mensaje mientras carga
  }
  if (error) {
    return <div>Error: {error}</div>;         // Muestra error si ocurre
  }

  // Renderizado de la tabla con los datos recibidos
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>id_cliente</th>
          <th>primer_nombre</th>
          <th>segundo_nombre</th>
          <th>primer_apellido</th>
          <th>segundo_apellido</th>
          <th>celular</th>
          <th>direccion</th>
          <th>cedula</th>

        </tr>
      </thead>
      <tbody>
        {clientes.map((cliente) => (
          <tr key={cliente.id_cliente}>
             <td>{cliente.id_cliente}</td>
            <td>{cliente.primer_nombre}</td>
            <td>{cliente.segundo_nombre}</td>
            <td>{cliente.primer_apellido}</td>
            <td>{cliente.segundo_apellido}</td>
            <td>{cliente.celular}</td>
            <td>{cliente.direccion}</td>
            <td>{cliente.cedula}</td>
          
            
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

// Exportación del componente
export default TablaClientes;