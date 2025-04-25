import React from 'react';
import { Table, Button } from 'react-bootstrap';
import Paginacion from '../ordenamiento/Paginacion';
import 'bootstrap/dist/css/bootstrap.min.css';

// Declaración del componente TablaEmpleados que recibe props
const TablaEmpleados = ({
  empleados,
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
    return <div>Cargando empleados...</div>; // Muestra mensaje mientras carga
  }
  if (error) {
    return <div>Error: {error}</div>; // Muestra error si ocurre
  }

  // Renderizado de la tabla con los datos recibidos
  return (
    <>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID Empleado</th>
            <th>Primer Nombre</th>
            <th>Segundo Nombre</th>
            <th>Primer Apellido</th>
            <th>Segundo Apellido</th>
            <th>Celular</th>
            <th>Cargo</th>
            <th>Fecha Contratación</th>
            <th>Funcionalidades</th>
          </tr>
        </thead>
        <tbody>
          {empleados.map((empleado) => (
            <tr key={empleado.id_empleado}>
              <td>{empleado.id_empleado}</td>
              <td>{empleado.primer_nombre}</td>
              <td>{empleado.segundo_nombre}</td>
              <td>{empleado.primer_apellido}</td>
              <td>{empleado.segundo_apellido}</td>
              <td>{empleado.celular}</td>
              <td>{empleado.cargo}</td>
              <td>{new Date(empleado.fecha_contratacion).toLocaleDateString()}</td>
              <td>
                {/* Botón de actualizar con icono */}
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => onActualizar(empleado)}
                >
                  <i className="fas fa-edit"></i> {/* Icono de editar */}
                </Button>{' '}
                {/* Botón de eliminar con icono */}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onEliminar(empleado.id_empleado)}
                >
                  <i className="fas fa-trash"></i> {/* Icono de eliminar */}
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
export default TablaEmpleados;