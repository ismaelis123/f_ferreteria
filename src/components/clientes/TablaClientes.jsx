import React from 'react';
import { Table, Button } from 'react-bootstrap';
import Paginacion from '../ordenamiento/Paginacion';
import 'bootstrap/dist/css/bootstrap.min.css';

// Declaración del componente TablaClientes que recibe props
const TablaClientes = ({
  clientes,
  cargando,
  error,
  onActualizar,
  onEliminar,
  totalElementos,
  elementosPorPagina,
  paginaActual,
  establecerPaginaActual
}) => {
  // Renderizado condicional según el estado recibido por props
  if (cargando) {
    return <div>Cargando clientes...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Renderizado de la tabla con los datos recibidos
  return (
    <>
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
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => onActualizar(cliente)}
                >
                  <i className="fas fa-edit"></i>
                </Button>{' '}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onEliminar(cliente.id_cliente)}
                >
                  <i className="fas fa-trash"></i>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Paginacion
        elementosPorPagina={elementosPorPagina}
        totalElementos={totalElementos}
        paginaActual={paginaActual}
        establecerPaginaActual={establecerPaginaActual}
      />
    </>
  );
};

// Exportación del componente
export default TablaClientes;