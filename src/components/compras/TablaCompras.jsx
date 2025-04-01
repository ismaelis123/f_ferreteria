// Importaciones necesarias para el componente visual
import React from 'react';
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const TablaCompras = ({ compras, cargando, error }) => {
  if (cargando) {
    return <div>Cargando compras...</div>; // Muestra mensaje mientras carga
  }
  if (error) {
    return <div>Error: {error}</div>;     // Muestra error si ocurre
  }

  // Renderizado de la tabla con los datos recibidos
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>ID Compra</th>
          <th>ID Detalle Compra</th>
          <th>Fecha Compra</th>
          <th>Empleado</th>
          <th>Producto</th>
          <th>Cantidad</th>
          <th>Precio Unitario</th>
          <th>Subtotal</th>
        </tr>
      </thead>
      <tbody>
        {compras.map((compra) => (
          <tr key={`${compra.id_compra}-${compra.id_detalle_compra}`}> {/* Clave única combinada */}
            <td>{compra.id_compra}</td>
            <td>{compra.id_detalle_compra}</td>
            <td>{compra.fecha_compra}</td>
            <td>{compra.nombre_empleado}</td>
            <td>{compra.nombre_producto}</td>
            <td>{compra.cantidad}</td>
            <td>C$ {compra.precio_unitario.toFixed(2)}</td>
            <td>C$ {compra.subtotal.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

// Exportación del componente
export default TablaCompras;