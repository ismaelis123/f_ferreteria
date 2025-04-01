// Importaciones necesarias para el componente visual
import React from 'react';
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const TablaVentas = ({ ventas, cargando, error }) => {
  if (cargando) {
    return <div>Cargando ventas...</div>; // Muestra mensaje mientras carga
  }
  if (error) {
    return <div>Error: {error}</div>;     // Muestra error si ocurre
  }

  // Renderizado de la tabla con los datos recibidos
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>ID Venta</th>
          <th>ID Detalle</th>
          <th>Fecha Venta</th>
          <th>Cliente</th>
          <th>Empleado</th>
          <th>Producto</th>
          <th>Cantidad</th>
          <th>Precio Unitario</th>
          <th>Subtotal</th>
        </tr>
      </thead>
      <tbody>
        {ventas.map((venta) => (
          <tr key={`${venta.id_venta}-${venta.id_detalle_venta}`}> {/* Clave única combinada */}
            <td>{venta.id_venta}</td>
            <td>{venta.id_detalle_venta}</td>
            <td>{venta.fecha_venta}</td>
            <td>{venta.nombre_cliente}</td>
            <td>{venta.nombre_empleado}</td>
            <td>{venta.nombre_producto}</td>
            <td>{venta.cantidad}</td>
            <td>C$ {venta.precio_unitario.toFixed(2)}</td>
            <td>C$ {venta.subtotal.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

// Exportación del componente
export default TablaVentas;