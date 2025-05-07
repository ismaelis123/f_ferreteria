// ModalActualizacionVenta.jsx
import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Table, Row, Col, FormControl } from "react-bootstrap";
import AsyncSelect from 'react-select/async';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const ModalActualizacionVenta = ({
  mostrarModal,
  setMostrarModal,
  venta,
  detallesVenta,
  setDetallesVenta,
  actualizarVenta,
  errorCarga,
  clientes,
  empleados,
  productos
}) => {
  const [ventaActualizada, setVentaActualizada] = useState({
    id_venta: venta?.id_venta || '',
    id_cliente: venta?.id_cliente || '',
    id_empleado: venta?.id_empleado || '',
    fecha_venta: venta?.fecha_venta ? new Date(venta.fecha_venta) : new Date(),
    total_venta: venta?.total_venta || 0
  });
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [nuevoDetalle, setNuevoDetalle] = useState({ id_producto: '', cantidad: '', precio_unitario: '' });
  const [editandoDetalle, setEditandoDetalle] = useState(null);

  // Calcular total de la venta
  const totalVenta = detallesVenta.reduce((sum, detalle) => sum + (detalle.cantidad * detalle.precio_unitario), 0);

  useEffect(() => {
    if (venta && clientes.length > 0 && empleados.length > 0) {
      const cliente = clientes.find(c => c.id_cliente === parseInt(venta.id_cliente));
      const empleado = empleados.find(e => e.id_empleado === parseInt(venta.id_empleado));
      if (cliente) {
        setClienteSeleccionado({ value: cliente.id_cliente, label: `${cliente.primer_nombre} ${cliente.primer_apellido}` });
        setVentaActualizada(prev => ({ ...prev, id_cliente: cliente.id_cliente }));
      }
      if (empleado) {
        setEmpleadoSeleccionado({ value: empleado.id_empleado, label: `${empleado.primer_nombre} ${empleado.primer_apellido}` });
        setVentaActualizada(prev => ({ ...prev, id_empleado: empleado.id_empleado }));
      }
      let fechaParsed = new Date(venta.fecha_venta);
      if (isNaN(fechaParsed) && typeof venta.fecha_venta === 'string') {
        const [day, month, year] = venta.fecha_venta.split('/');
        fechaParsed = new Date(`${year}-${month}-${day}`);
      }
      setVentaActualizada(prev => ({
        ...prev,
        id_venta: venta.id_venta || '',
        fecha_venta: isNaN(fechaParsed) ? new Date() : fechaParsed,
        total_venta: parseFloat(venta.total_venta) || 0
      }));
    }
  }, [venta, clientes, empleados]);


  // Cargar opciones para AsyncSelect
  const cargarClientes = (inputValue, callback) => {
    const filtrados = clientes.filter(cliente =>
      `${cliente.primer_nombre} ${cliente.primer_apellido}`.toLowerCase().includes(inputValue.toLowerCase())
    );
    callback(filtrados.map(cliente => ({
      value: cliente.id_cliente,
      label: `${cliente.primer_nombre} ${cliente.primer_apellido}`
    })));
  };

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

  // Manejar cambios en los selectores
  const manejarCambioCliente = (seleccionado) => {
    setClienteSeleccionado(seleccionado);
    setVentaActualizada(prev => ({ ...prev, id_cliente: seleccionado ? seleccionado.value : '' }));
  };

  const manejarCambioEmpleado = (seleccionado) => {
    setEmpleadoSeleccionado(seleccionado);
    setVentaActualizada(prev => ({ ...prev, id_empleado: seleccionado ? seleccionado.value : '' }));
  };

  const manejarCambioProducto = (seleccionado) => {
    setProductoSeleccionado(seleccionado);
    setNuevoDetalle(prev => ({
      ...prev,
      id_producto: seleccionado ? seleccionado.value : '',
      precio_unitario: seleccionado ? seleccionado.precio : ''
    }));
  };

  // Manejar cambios en el detalle
  const manejarCambioDetalle = (e) => {
    const { name, value } = e.target;
    setNuevoDetalle(prev => ({ ...prev, [name]: value }));
  };

  // Agregar detalle a la lista
  const manejarAgregarDetalle = () => {
    if (!nuevoDetalle.id_producto || !nuevoDetalle.cantidad || nuevoDetalle.cantidad <= 0) {
      alert("Por favor, selecciona un producto y una cantidad válida.");
      return;
    }
    const producto = productos.find(p => p.id_producto === nuevoDetalle.id_producto);
    if (producto && nuevoDetalle.cantidad > producto.stock) {
      alert(`Stock insuficiente de ${producto.nombre_producto}. Unidades disponibles: ${producto.stock}`);
      return;
    }
    setDetallesVenta(prev => [...prev, {
      id_producto: nuevoDetalle.id_producto,
      nombre_producto: productoSeleccionado.label,
      cantidad: parseInt(nuevoDetalle.cantidad),
      precio_unitario: parseFloat(nuevoDetalle.precio_unitario)
    }]);
    setNuevoDetalle({ id_producto: '', cantidad: '', precio_unitario: '' });
    setProductoSeleccionado(null);
  };

  // Eliminar detalle
  const eliminarDetalle = (index) => {
    setDetallesVenta(prev => prev.filter((_, i) => i !== index));
  };

  // Iniciar edición de detalle
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

  // Guardar detalle editado
  const guardarEdicionDetalle = () => {
    if (!editandoDetalle) return;
    if (!nuevoDetalle.id_producto || !nuevoDetalle.cantidad || nuevoDetalle.cantidad <= 0) {
      alert("Por favor, selecciona un producto y una cantidad válida.");
      return;
    }
    const producto = productos.find(p => p.id_producto === nuevoDetalle.id_producto);
    if (producto && nuevoDetalle.cantidad > producto.stock) {
      alert(`Stock insuficiente de ${producto.nombre_producto}. Unidades disponibles: ${producto.stock}`);
      return;
    }
    const nuevosDetalles = [...detallesVenta];
    nuevosDetalles[editandoDetalle.index] = {
      id_producto: nuevoDetalle.id_producto,
      nombre_producto: productoSeleccionado.label,
      cantidad: parseInt(nuevoDetalle.cantidad),
      precio_unitario: parseFloat(nuevoDetalle.precio_unitario)
    };
    setDetallesVenta(nuevosDetalles);
    setEditandoDetalle(null);
    setNuevoDetalle({ id_producto: '', cantidad: '', precio_unitario: '' });
    setProductoSeleccionado(null);
  };

  return (
    <Modal
      show={mostrarModal}
      onHide={() => {
        setMostrarModal(false);
        setNuevoDetalle({ id_producto: '', cantidad: '', precio_unitario: '' });
        setProductoSeleccionado(null);
        setEditandoDetalle(null);
      }}
      fullscreen={true}
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header closeButton>
        <Modal.Title>Actualizar Venta</Modal.Title>
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
                  selected={ventaActualizada.fecha_venta}
                  onChange={(date) => setVentaActualizada(prev => ({ ...prev, fecha_venta: date }))}
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
          <h5>{editandoDetalle ? "Editar Detalle de Venta" : "Agregar Detalle de Venta"}</h5>
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
                  disabled
                  placeholder="Automático"
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
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {detallesVenta.map((detalle, index) => (
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
                    <td><strong>{totalVenta.toFixed(2)}</strong></td>
                  </tr>
                </tfoot>
              </Table>
            </>
          )}

          {errorCarga && (
            <div className="text-danger mt-2">{errorCarga}</div>
          )}
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
        <Button variant="primary" onClick={() => actualizarVenta(ventaActualizada, detallesVenta)}>
          Actualizar Venta
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalActualizacionVenta;