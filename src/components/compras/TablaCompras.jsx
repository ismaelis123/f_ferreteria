import React from 'react';
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const TablaCompras = ({ compras, cargando, error }) => {
  // Si está cargando, muestra un mensaje de carga
  if (cargando) {
    return <div>Cargando compras...</div>;
  }

  // Si hay un error, muestra un mensaje de error
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Si no hay compras, muestra un mensaje indicativo
  if (compras.length === 0) {
    return <div>No se encontraron compras.</div>;
  }

  // Renderiza la tabla con los datos de las compras
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
        {/* Recorre las compras y las renderiza fila por fila */}
        {compras.map((compra) => (
          <tr key={`${compra.id_compra}-${compra.id_detalle_compra}`}> {/* Clave única combinada */}
            <td>{compra.id_compra}</td>
            <td>{compra.id_detalle_compra}</td>
            <td>{compra.fecha_compra}</td>
            <td>{compra.nombre_empleado}</td>
            <td>{compra.nombre_producto}</td>
            <td>{compra.cantidad}</td>
            {/* Asegúrate de que los valores numéricos estén bien formateados */}
            <td>C$ {parseFloat(compra.precio_unitario).toFixed(2)}</td>
            <td>C$ {parseFloat(compra.subtotal).toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TablaCompras;
