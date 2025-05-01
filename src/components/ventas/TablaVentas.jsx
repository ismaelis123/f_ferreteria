import React from 'react';
import { Table, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const TablaVentas = ({ ventas, cargando, error, obtenerDetalles, abrirModalEliminacion }) => {
  if (cargando) {
    return <div>Cargando ventas...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>ID Venta</th>
          <th>Fecha Venta</th>
          <th>Cliente</th>
          <th>Empleado</th>
          <th>Total</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {ventas.map((venta) => (
          <tr key={`${venta.id_venta}`}>
            <td>{venta.id_venta}</td>
            <td>{venta.fecha_venta}</td>
            <td>{venta.nombre_cliente}</td>
            <td>{venta.nombre_empleado}</td>
            <td>C$ {venta.total_venta.toFixed(2)}</td>
            <td>
              <Button
                variant="outline-success"
                size="sm"
                onClick={() => obtenerDetalles(venta.id_venta)}
              >
                <i className="bi bi-list-ul"></i> Detalles
              </Button>
              {/* New delete button */}
              <Button
                variant="outline-danger"
                size="sm"
                className="ms-2"
                onClick={() => abrirModalEliminacion(venta)}
              >
                <i className="bi bi-trash"></i> Eliminar
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TablaVentas;