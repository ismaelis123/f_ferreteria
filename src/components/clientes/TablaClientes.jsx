import React from 'react';
import { Table, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// Declaración del componente TablaClientes que recibe props
const TablaClientes = ({ clientes, cargando, error, onActualizar, onEliminar }) => {
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
          <th>ID Cliente</th>
          <th>Primer Nombre</th>
          <th>Segundo Nombre</th>
          <th>Primer Apellido</th>
          <th>Segundo Apellido</th>
          <th>Celular</th>
          <th>Dirección</th>
          <th>Cédula</th>
          <th>Funcionalidades</th>
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
            <td>
              {/* Botón de actualizar con icono */}
              <Button 
                variant="warning" 
                size="sm" 
                onClick={() => onActualizar(cliente)}
              >
                <i className="fas fa-edit"></i> {/* Icono de editar */}
              </Button>{' '}
              
              {/* Botón de eliminar con icono */}
              <Button 
                variant="danger" 
                size="sm" 
                onClick={() => onEliminar(cliente.id_cliente)}
              >
                <i className="fas fa-trash"></i> {/* Icono de eliminar */}
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

// Exportación del componente
export default TablaClientes;
