import React from 'react';
import { Table } from 'react-bootstrap';
import Paginacion from '../ordenamiento/Paginacion';
import 'bootstrap/dist/css/bootstrap.min.css';

const TablaCompras = ({
  compras,
  cargando,
  error,
  totalElementos,
  elementosPorPagina,
  paginaActual,
  establecerPaginaActual
}) => {
  if (cargando) {
    return <div>Cargando compras...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (compras.length === 0) {
    return <div>No se encontraron compras.</div>;
  }

  return (
    <>
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
            <tr key={`${compra.id_compra}-${compra.id_detalle_compra}`}>
              <td>{compra.id_compra}</td>
              <td>{compra.id_detalle_compra}</td>
              <td>{compra.fecha_compra}</td>
              <td>{compra.nombre_empleado}</td>
              <td>{compra.nombre_producto}</td>
              <td>{compra.cantidad}</td>
              <td>C$ {parseFloat(compra.precio_unitario).toFixed(2)}</td>
              <td>C$ {parseFloat(compra.subtotal).toFixed(2)}</td>
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

export default TablaCompras;