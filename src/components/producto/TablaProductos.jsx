import React from 'react';
import { Table, Button } from 'react-bootstrap';
import Paginacion from '../ordenamiento/Paginacion';
import 'bootstrap/dist/css/bootstrap.min.css';

// Declaración del componente TablaProductos que recibe props
const TablaProductos = ({
  productos,
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
    return <div>Cargando productos...</div>;
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
            <th>ID Producto</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Categoría</th>
            <th>Precio Unitario</th>
            <th>Stock</th>
            <th>Imagen</th>
            <th>Funcionalidades</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id_producto}>
              <td>{producto.id_producto}</td>
              <td>{producto.nombre_producto}</td>
              <td>{producto.descripcion_producto}</td>
              <td>{producto.id_categoria}</td>
              <td>{producto.precio_unitario}</td>
              <td>{producto.stock}</td>
              <td>
                {producto.imagen ? (
                  <img
                    src={producto.imagen}
                    alt={producto.nombre_producto}
                    style={{ maxWidth: '50px', maxHeight: '50px' }}
                  />
                ) : (
                  'Sin imagen'
                )}
              </td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => onActualizar(producto)}
                >
                  <i className="fas fa-edit"></i>
                </Button>{' '}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onEliminar(producto.id_producto)}
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
export default TablaProductos;