// Importaciones necesarias para el componente visual
import React from 'react';
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// Declaración del componente TablaCategorias que recibe props
const TablaProductos = ({ Productos, cargando, error }) => {
  // Renderizado condicional según el estado recibido por props
  if (cargando) {
    return <div>Cargando Usuarios...</div>; // Muestra mensaje mientras carga
  }
  if (error) {
    return <div>Error: {error}</div>;         // Muestra error si ocurre
  }

  // Renderizado de la tabla con los datos recibidos
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>id_producto</th>
          <th>nombre_producto</th>
          <th>descripcion</th>
          <th>categoria</th>
          <th>precio_unitario</th>
          <th>stock</th>
          <th>imagen</th>
        </tr>
      </thead>
      <tbody>
        {Productos.map((Productos) => (
          <tr key={Productos.id_producto}>
            <td>{Productos.id_producto}</td>
            <td>{Productos.nombre_producto}</td>
            <td>{Productos.descripcion_producto}</td>
            <td>{Productos.id_categoria}</td>
            <td>{Productos.precio_unitario}</td>
            <td>{Productos.stock}</td>
            <td>{Productos.imagen}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

// Exportación del componente
export default TablaProductos;
