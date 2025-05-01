import React, { useState } from 'react';
import { Modal, Form, Button, Table, Row, Col, FormControl } from 'react-bootstrap';
import AsyncSelect from 'react-select/async';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ModalRegistroVenta = ({
  mostrarModal,
  setMostrarModal,
  nuevaVenta,
  setNuevaVenta,
  detallesVenta,
  setDetallesVenta,
  agregarDetalle,
  agregarVenta,
  errorCarga,
  clientes,
  empleados,
  productos,
}) => {
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [nuevoDetalle, setNuevoDetalle] = useState({ id_producto: '', cantidad: '', precio_unitario: '' });

  const totalVenta = detallesVenta.reduce((sum, detalle) => sum + detalle.cantidad * detalle.precio_unitario, 0);

  const cargarClientes = (inputValue, callback) => {
    const filtrados = clientes.filter((cliente) =>
      `${cliente.primer_nombre} ${cliente.primer_apellido}`.toLowerCase().includes(inputValue.toLowerCase())
    );
    callback(
      filtrados.map((cliente) => ({
        value: cliente.id_cliente,
        label: `${cliente.primer_nombre} ${cliente.primer_apellido}`,
      }))
    );
  };

  const cargarEmpleados = (inputValue, callback) => {
    const filtrados = empleados.filter((empleado) =>
      `${empleado.primer_nombre} ${empleado.primer_apellido}`.toLowerCase().includes(inputValue.toLowerCase())
    );
    callback(
      filtrados.map((empleado) => ({
        value: empleado.id_empleado,
        label: `${empleado.primer_nombre} ${empleado.primer_apellido}`,
      }))
    );
  };

  const cargarProductos = (inputValue, callback) => {
    const filtrados = productos.filter((producto) =>
      producto.nombre_producto.toLowerCase().includes(inputValue.toLowerCase())
    );
    callback(
      filtrados.map((producto) => ({
        value: producto.id_producto,
        label: producto.nombre_producto,
        precio: producto.precio_unitario,
      }))
    );
  };

  const manejarCambioCliente = (seleccionado) => {
    setClienteSeleccionado(seleccionado);
    setNuevaVenta((prev) => ({ ...prev, id_cliente: seleccionado ? seleccionado.value : '' }));
  };

  const manejarCambioEmpleado = (seleccionado) => {
    setEmpleadoSeleccionado(seleccionado);
    setNuevaVenta((prev) => ({ ...prev, id_empleado: seleccionado ? seleccionado.value : '' }));
  };

  const manejarCambioProducto = (seleccionado) => {
    setProductoSeleccionado(seleccionado);
    setNuevoDetalle((prev) => ({
      ...prev,
      id_producto: seleccionado ? seleccionado.value : '',
      precio_unitario: seleccionado ? seleccionado.precio : '',
    }));
  };

  const manejarCambioDetalle = (e) => {
    const { name, value } = e.target;
    setNuevoDetalle((prev) => ({ ...prev, [name]: value }));
  };

  const manejarAgregarDetalle = () => {
    if (!nuevoDetalle.id_producto || !nuevoDetalle.cantidad || nuevoDetalle.cantidad <= 0) {
      alert('Por favor, selecciona un producto y una cantidad válida.');
      return;
    }

    const producto = productos.find((p) => p.id_producto === nuevoDetalle.id_producto);
    if (producto && nuevoDetalle.cantidad > producto.stock) {
      alert(`Stock insuficiente de ${producto.nombre_producto}. Unidades disponibles: ${producto.stock}`);
      return;
    }

    agregarDetalle({
      id_producto: nuevoDetalle.id_producto,
      nombre_producto: productoSeleccionado.label,
      cantidad: parseInt(nuevoDetalle.cantidad),
      precio_unitario: parseFloat(nuevoDetalle.precio_unitario),
    });
    setNuevoDetalle({ id_producto: '', cantidad: '', precio_unitario: '' });
    setProductoSeleccionado(null);
  };

  return (
    <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} fullscreen={true}>
      <Modal.Header closeButton>
        <Modal.Title>Registrar Nueva Venta</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col xs={12} sm={12} md={4} lg={4}>
              <Form.Group className="mb-3" controlId="formCliente">
                <Form.Label>Cliente</Form.Label>
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  loadOptions={cargarClientes}
                  onChange={manejarCambioCliente}
                  value={clienteSeleccionado}
                  placeholder="Buscar cliente..."
                  isClearable
                />
              </Form.Group>
            </Col>
            <Col xs={12} sm={12} md={4} lg={4}>
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
            <Col xs={12} sm={12} md={4} lg={4}>
              <Form.Group className="mb-3" controlId="formFechaVenta">
                <Form.Label>Fecha de Venta</Form.Label>
                <br />
                <DatePicker
                  selected={nuevaVenta.fecha_venta}
                  onChange={(date) => setNuevaVenta((prev) => ({ ...prev, fecha_venta: date }))}
                  className="form-control"
                  dateFormat="dd/MM/yyyy HH:mm"
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <hr />
          <h5>Agregar Detalle de Venta</h5>
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
                  disabled
                  placeholder="Automático"
                />
              </Form.Group>
            </Col>
            <Col xs={5} sm={4} md={2} lg={2} className="d-flex align-items-center mt-3">
              <Button style={{ width: '100%' }} variant="success" onClick={manejarAgregarDetalle}>
                Agregar Producto
              </Button>
            </Col>
          </Row>

          {detallesVenta.length > 0 && (
            <>
              <h5 className="mt-4">Detalles Agregados</h5>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {detallesVenta.map((detalle, index) => (
                    <tr key={index}>
                      <td>{detalle.nombre_producto}</td>
                      <td>{detalle.cantidad}</td>
                      <td>{detalle.precio_unitario.toFixed(2)}</td>
                      <td>{(detalle.cantidad * detalle.precio_unitario).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" className="text-end">
                      <strong>Total:</strong>
                    </td>
                    <td>
                      <strong>{totalVenta.toFixed(2)}</strong>
                    </td>
                  </tr>
                </tfoot>
              </Table>
            </>
          )}

          {errorCarga && <div className="text-danger mt-2">{errorCarga}</div>}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={agregarVenta}>
          Crear Venta
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroVenta;