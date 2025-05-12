import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Table, Row, Col, FormControl } from 'react-bootstrap';
import AsyncSelect from 'react-select/async';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ModalActualizacionCompra = ({
  mostrarModal,
  setMostrarModal,
  compra,
  detallesCompra,
  setDetallesCompra,
  actualizarCompra,
  errorCarga,
  empleados,
  productos
}) => {
  const [compraActualizada, setCompraActualizada] = useState({
    id_compra: compra?.id_compra || '',
    id_empleado: compra?.id_empleado || '',
    fecha_compra: compra?.fecha_compra ? new Date(compra.fecha_compra) : new Date(),
    total_compra: compra?.total_compra || 0
  });
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [nuevoDetalle, setNuevoDetalle] = useState({ id_producto: '', cantidad: '', precio_unitario: '' });
  const [editandoDetalle, setEditandoDetalle] = useState(null);

  const totalCompra = detallesCompra.reduce((sum, detalle) => sum + (detalle.cantidad * detalle.precio_unitario), 0);

  useEffect(() => {
    if (compra && empleados.length > 0) {
      setEmpleadoSeleccionado({ value: compra.id_empleado, label: compra.nombre_empleado });
      setCompraActualizada({
        id_compra: compra.id_compra || '',
        id_empleado: compra.id_empleado || '',
        fecha_compra: compra?.fecha_compra ? new Date(compra.fecha_compra) : new Date(),
        total_compra: parseFloat(compra.total_compra) || 0
      });
    }
  }, [compra, empleados]);

  const cargarEmpleados = (inputValue, callback) => {
    const filtrados = empleados.filter(empleado =>
      `${empleado.primer_nombre} ${empleado.primer_apellido}`.toLowerCase().includes(inputValue.toLowerCase())
    );
    callback(filtrados.map(empleado => ({
      value: empleado.id_empleado,
      label: `${empleado.primer_nombre} ${empleado.primer_apellido}`
    })));
  };

  const cargarProductos = (inputValue, callback) => {
    const filtrados = productos.filter(producto =>
      producto.nombre_producto.toLowerCase().includes(inputValue.toLowerCase())
    );
    callback(filtrados.map(producto => ({
      value: producto.id_producto,
      label: producto.nombre_producto,
      precio: producto.precio_unitario
    })));
  };

  const manejarCambioEmpleado = (seleccionado) => {
    setEmpleadoSeleccionado(seleccionado);
    setCompraActualizada(prev => ({ ...prev, id_empleado: seleccionado ? seleccionado.value : '' }));
  };

  const manejarCambioProducto = (seleccionado) => {
    setProductoSeleccionado(seleccionado);
    setNuevoDetalle(prev => ({
      ...prev,
      id_producto: seleccionado ? seleccionado.value : '',
      precio_unitario: seleccionado ? seleccionado.precio : ''
    }));
  };

  const manejarCambioDetalle = (e) => {
    const { name, value } = e.target;
    setNuevoDetalle(prev => ({ ...prev, [name]: value }));
  };

  const manejarAgregarDetalle = () => {
    if (!nuevoDetalle.id_producto || !nuevoDetalle.cantidad || nuevoDetalle.cantidad <= 0) {
      alert('Por favor, selecciona un producto y una cantidad válida.');
      return;
    }
    setDetallesCompra(prev => [...prev, {
      id_producto: nuevoDetalle.id_producto,
      nombre_producto: productoSeleccionado.label,
      cantidad: parseInt(nuevoDetalle.cantidad),
      precio_unitario: parseFloat(nuevoDetalle.precio_unitario)
    }]);
    setNuevoDetalle({ id_producto: '', cantidad: '', precio_unitario: '' });
    setProductoSeleccionado(null);
  };

  const eliminarDetalle = (index) => {
    setDetallesCompra(prev => prev.filter((_, i) => i !== index));
  };

  const iniciarEdicionDetalle = (index, detalle) => {
    setEditandoDetalle({ index, detalle });
    setNuevoDetalle({
      id_producto: detalle.id_producto,
      cantidad: detalle.cantidad.toString(),
      precio_unitario: detalle.precio_unitario.toString()
    });
    setProductoSeleccionado({
      value: detalle.id_producto,
      label: detalle.nombre_producto,
      precio: detalle.precio_unitario
    });
  };

  const guardarEdicionDetalle = () => {
    if (!editandoDetalle) return;
    if (!nuevoDetalle.id_producto || !nuevoDetalle.cantidad || nuevoDetalle.cantidad <= 0) {
      alert('Por favor, selecciona un producto y una cantidad válida.');
      return;
    }
    const nuevosDetalles = [...detallesCompra];
    nuevosDetalles[editandoDetalle.index] = {
      id_producto: nuevoDetalle.id_producto,
      nombre_producto: productoSeleccionado.label,
      cantidad: parseInt(nuevoDetalle.cantidad),
      precio_unitario: parseFloat(nuevoDetalle.precio_unitario)
    };
    setDetallesCompra(nuevosDetalles);
    setEditandoDetalle(null);
    setNuevoDetalle({ id_producto: '', cantidad: '', precio_unitario: '' });
    setProductoSeleccionado(null);
  };

  return (
    <Modal show={mostrarModal} onHide={() => {
      setMostrarModal(false);
      setNuevoDetalle({ id_producto: '', cantidad: '', precio_unitario: '' });
      setProductoSeleccionado(null);
      setEditandoDetalle(null);
    }} fullscreen={true}>
      <Modal.Header closeButton>
        <Modal.Title>Actualizar Compra</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col xs={12} sm={12} md={6} lg={6}>
              <Form.Group className="mb-3" controlId="formEmpleado">
                <Form.Label>Empleado</Form.Label>
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  loadOptions={cargarEmpleados}
                  onChange={manejarCambioEmpleado}
                  value={empleadoSeleccionado}
                  placeholder="Buscar empleado..."
                  isClearable
                />
              </Form.Group>
            </Col>
            <Col xs={12} sm={12} md={6} lg={6}>
              <Form.Group className="mb-3" controlId="formFechaCompra">
                <Form.Label>Fecha de Compra</Form.Label>
                <br />
                <DatePicker
                  selected={compraActualizada.fecha_compra}
                  onChange={(date) => setCompraActualizada(prev => ({ ...prev, fecha_compra: date }))}
                  className="form-control"
                  dateFormat="dd/MM/yyyy HH:mm"
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={1}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <hr />
          <h5>{editandoDetalle ? 'Editar Detalle de Compra' : 'Agregar Detalle de Compra'}</h5>
          <Row>
            <Col xs={12} sm={12} md={4} lg={4}>
              <Form.Group className="mb-3" controlId="formProducto">
                <Form.Label>Producto</Form.Label>
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  loadOptions={cargarProductos}
                  onChange={manejarCambioProducto}
                  value={productoSeleccionado}
                  placeholder="Buscar producto..."
                  isClearable
                  isDisabled={editandoDetalle !== null}
                />
              </Form.Group>
            </Col>
            <Col xs={12} sm={12} md={3} lg={3}>
              <Form.Group className="mb-3" controlId="formCantidad">
                <Form.Label>Cantidad</Form.Label>
                <FormControl
                  type="number"
                  name="cantidad"
                  value={nuevoDetalle.cantidad}
                  onChange={manejarCambioDetalle}
                  placeholder="Cantidad"
                  min="1"
                  required
                />
              </Form.Group>
            </Col>
            <Col xs={7} sm={8} md={3} lg={3}>
              <Form.Group className="mb-3" controlId="formPrecioUnitario">
                <Form.Label>Precio Unitario</Form.Label>
                <FormControl
                  type="number"
                  name="precio_unitario"
                  value={nuevoDetalle.precio_unitario}
                  onChange={manejarCambioDetalle}
                  placeholder="Precio"
                  required
                />
              </Form.Group>
            </Col>
            <Col xs={5} sm={4} md={2} lg={2} className="d-flex align-items-center mt-3">
              {editandoDetalle ? (
                <Button style={{ width: '100%' }} variant="primary" onClick={guardarEdicionDetalle}>
                  Guardar Cambios
                </Button>
              ) : (
                <Button style={{ width: '100%' }} variant="success" onClick={manejarAgregarDetalle}>
                  Agregar Producto
                </Button>
              )}
            </Col>
          </Row>
          {detallesCompra.length > 0 && (
            <>
              <h5 className="mt-4">Detalles Agregados</h5>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Subtotal</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {detallesCompra.map((detalle, index) => (
                    <tr key={index}>
                      <td>{detalle.nombre_producto}</td>
                      <td>{detalle.cantidad}</td>
                      <td>{detalle.precio_unitario.toFixed(2)}</td>
                      <td>{(detalle.cantidad * detalle.precio_unitario).toFixed(2)}</td>
                      <td>
                        <Button variant="warning" size="sm" onClick={() => iniciarEdicionDetalle(index, detalle)} className="me-2">
                          Editar
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => eliminarDetalle(index)}>
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="4" className="text-end"><strong>Total:</strong></td>
                    <td><strong>{totalCompra.toFixed(2)}</strong></td>
                  </tr>
                </tfoot>
              </Table>
            </>
          )}
          {errorCarga && <div className="text-danger mt-2">{errorCarga}</div>}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => {
          setMostrarModal(false);
          setNuevoDetalle({ id_producto: '', cantidad: '', precio_unitario: '' });
          setProductoSeleccionado(null);
          setEditandoDetalle(null);
        }}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={() => actualizarCompra(compraActualizada, detallesCompra)}>
          Actualizar Compra
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalActualizacionCompra;