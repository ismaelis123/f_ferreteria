import React, { useState, useEffect } from 'react';
import TablaProductos from '../components/producto/TablaProductos';
import ModalRegistroProducto from '../components/producto/ModalRegistroProducto';
import { Container, Button, Alert, Form } from 'react-bootstrap';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Importación explícita
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const Productos = () => {
  const [listaProductos, setListaProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [listaCategorias, setListaCategorias] = useState([]);
  const [filtroBusqueda, setFiltroBusqueda] = useState('');
  const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 3;

  const estadoInicialProducto = {
    id_producto: null,
    nombre_producto: '',
    descripcion_producto: '',
    id_categoria: '',
    precio_unitario: '',
    stock: '',
    imagen: ''
  };
  const [productoActual, setProductoActual] = useState(estadoInicialProducto);

  const obtenerProductos = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/productos');
      if (!respuesta.ok) throw new Error('Error al cargar los productos');
      const datos = await respuesta.json();
      console.log('Datos obtenidos de la API:', datos);
      setListaProductos(datos);
      setProductosFiltrados(datos);
      setCargando(false);
    } catch (error) {
      setErrorCarga(error.message);
      setCargando(false);
    }
  };

  const obtenerCategorias = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/categorias');
      if (!respuesta.ok) throw new Error('Error al cargar las categorías');
      const datos = await respuesta.json();
      setListaCategorias(datos);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  useEffect(() => {
    obtenerProductos();
    obtenerCategorias();
  }, []);

  useEffect(() => {
    const resultados = listaProductos.filter(producto =>
      producto.nombre_producto.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
      producto.descripcion_producto?.toLowerCase().includes(filtroBusqueda.toLowerCase())
    );
    console.log('Productos filtrados después de búsqueda:', resultados);
    setProductosFiltrados(resultados);
    establecerPaginaActual(1);
  }, [filtroBusqueda, listaProductos]);

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setProductoActual(prev => ({ ...prev, [name]: value }));
  };

  const agregarProducto = async () => {
    if (
      !productoActual.nombre_producto ||
      !productoActual.id_categoria ||
      !productoActual.precio_unitario ||
      !productoActual.stock
    ) {
      setErrorCarga('Por favor, completa todos los campos requeridos.');
      return;
    }

    try {
      const respuesta = await fetch('http://localhost:3000/api/registrarproductos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productoActual),
      });

      if (!respuesta.ok) throw new Error('Error al agregar el producto');
      await obtenerProductos();
      setProductoActual(estadoInicialProducto);
      setMostrarModal(false);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const actualizarProducto = async () => {
    try {
      const respuesta = await fetch(`http://localhost:3000/api/actualizarproducto/${productoActual.id_producto}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productoActual),
      });
      if (!respuesta.ok) throw new Error('Error al actualizar el producto');
      await obtenerProductos();
      setModoEdicion(false);
      setMostrarModal(false);
      setProductoActual(estadoInicialProducto);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const eliminarProducto = async (id) => {
    const confirmar = window.confirm('¿Estás seguro de que quieres eliminar este producto?');
    if (confirmar) {
      try {
        const respuesta = await fetch(`http://localhost:3000/api/eliminarproducto/${id}`, {
          method: 'DELETE',
        });
        if (!respuesta.ok) throw new Error('Error al eliminar el producto');
        await obtenerProductos();
        setErrorCarga(null);
      } catch (error) {
        setErrorCarga(error.message);
      }
    }
  };

  const manejarActualizar = (producto) => {
    setProductoActual(producto);
    setModoEdicion(true);
    setMostrarModal(true);
  };

  const generarPDFProductos = () => {
    try {
      console.log('Iniciando generación de PDF. Productos filtrados:', productosFiltrados);
      if (!productosFiltrados || productosFiltrados.length === 0) {
        alert('No hay productos para generar el PDF.');
        return;
      }
      const doc = new jsPDF();
      console.log('jsPDF inicializado:', doc);
      console.log('autoTable disponible:', typeof doc.autoTable === 'function');
      
      doc.setFillColor(0, 51, 102);
      doc.rect(0, 0, 210, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(28);
      doc.text('Reporte de Productos', 105, 25, null, null, 'center');

      const encabezados = [['ID', 'Nombre', 'Descripción', 'Categoría', 'Precio', 'Stock']];
      const datos = productosFiltrados.map(producto => [
        producto.id_producto || 'N/A',
        producto.nombre_producto || 'N/A',
        producto.descripcion_producto || 'N/A',
        producto.id_categoria || 'N/A',
        producto.precio_unitario || 'N/A',
        producto.stock || 'N/A'
      ]);
      console.log('Datos para la tabla:', datos);

      autoTable(doc, {
        head: encabezados,
        body: datos,
        startY: 50,
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 2 },
        headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255] },
        margin: { top: 50 }
      });

      const totalPaginas = doc.internal.getNumberOfPages();
      console.log('Total de páginas:', totalPaginas);
      const fecha = new Date().toISOString().slice(0, 10);
      doc.save(`Productos_${fecha}.pdf`);
      console.log('PDF generado y descargado.');
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      alert('Error al generar el PDF: ' + error.message);
    }
  };

  const generarPDFDetalleProducto = (producto) => {
    try {
      console.log('Generando PDF para producto:', producto);
      if (!producto) {
        alert('No se proporcionó un producto válido.');
        return;
      }
      const doc = new jsPDF();
      console.log('jsPDF inicializado:', doc);
      console.log('autoTable disponible:', typeof doc.autoTable === 'function');
      
      doc.setFillColor(0, 51, 102);
      doc.rect(0, 0, 210, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(28);
      doc.text(`Detalle de Producto: ${producto.nombre_producto || 'N/A'}`, 105, 25, null, null, 'center');

      if (producto.imagen) {
        try {
          console.log('Intentando agregar imagen:', producto.imagen.substring(0, 50));
          doc.addImage(`data:image/png;base64,${producto.imagen}`, 'PNG', 10, 50, 50, 50);
        } catch (error) {
          console.error('Error al agregar la imagen:', error);
        }
      } else {
        console.log('No hay imagen para este producto.');
      }

      const datos = [
        ['ID', producto.id_producto || 'N/A'],
        ['Nombre', producto.nombre_producto || 'N/A'],
        ['Descripción', producto.descripcion_producto || 'N/A'],
        ['Categoría', producto.id_categoria || 'N/A'],
        ['Precio', producto.precio_unitario || 'N/A'],
        ['Stock', producto.stock || 'N/A']
      ];
      console.log('Datos para la tabla de detalle:', datos);

      autoTable(doc, {
        body: datos,
        startY: producto.imagen ? 110 : 50,
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 2 },
        headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255] }
      });

      const fecha = new Date().toISOString().slice(0, 10);
      doc.save(`Producto_${producto.nombre_producto || 'SinNombre'}_${fecha}.pdf`);
      console.log('PDF de detalle generado y descargado.');
    } catch (error) {
      console.error('Error al generar el PDF de detalle:', error);
      alert('Error al generar el PDF de detalle: ' + error.message);
    }
  };

  const exportarExcelProductos = () => {
    try {
      console.log('Productos filtrados para Excel:', productosFiltrados);
      if (!productosFiltrados || productosFiltrados.length === 0) {
        alert('No hay productos para generar el Excel.');
        return;
      }
      const datos = productosFiltrados.map(producto => ({
        ID: producto.id_producto || 'N/A',
        Nombre: producto.nombre_producto || 'N/A',
        Descripción: producto.descripcion_producto || 'N/A',
        Categoría: producto.id_categoria || 'N/A',
        Precio: producto.precio_unitario || 'N/A',
        Stock: producto.stock || 'N/A'
      }));

      const worksheet = XLSX.utils.json_to_sheet(datos);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Productos');

      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const nombreArchivo = `Productos_${new Date().toISOString().slice(0, 10)}.xlsx`;
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      saveAs(blob, nombreArchivo);
      console.log('Excel generado y descargado.');
    } catch (error) {
      console.error('Error al generar el Excel:', error);
      alert('Error al generar el Excel: ' + error.message);
    }
  };

  // Calcular productos paginados
  const productosPaginados = productosFiltrados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  return (
    <Container className="mt-5">
      <h4>Productos</h4>

      <Button
        variant="primary"
        onClick={() => {
          setMostrarModal(true);
          setModoEdicion(false);
          setProductoActual(estadoInicialProducto);
        }}
      >
        Nuevo Producto
      </Button>
      <Button
        variant="secondary"
        className="ms-2"
        onClick={generarPDFProductos}
        style={{ width: '150px' }}
      >
        Generar reporte PDF
      </Button>
      <Button
        variant="secondary"
        className="ms-2"
        onClick={exportarExcelProductos}
        style={{ width: '150px' }}
      >
        Generar Excel
      </Button>

      <Form.Group controlId="formBusqueda" className="mt-3 mb-3">
        <div className="input-group">
          <span className="input-group-text">
            <i className="fas fa-search"></i>
          </span>
          <Form.Control
            type="text"
            placeholder="Buscar por nombre o descripción"
            value={filtroBusqueda}
            onChange={(e) => setFiltroBusqueda(e.target.value)}
          />
        </div>
      </Form.Group>

      {errorCarga && <Alert variant="danger" className="mt-3">{errorCarga}</Alert>}

      <TablaProductos
        productos={productosPaginados}
        cargando={cargando}
        error={errorCarga}
        onActualizar={manejarActualizar}
        onEliminar={eliminarProducto}
        totalElementos={productosFiltrados.length}
        elementosPorPagina={elementosPorPagina}
        paginaActual={paginaActual}
        establecerPaginaActual={establecerPaginaActual}
        generarPDFDetalleProducto={generarPDFDetalleProducto}
      />

      <ModalRegistroProducto
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoProducto={productoActual}
        manejarCambioInput={manejarCambioInput}
        agregarProducto={modoEdicion ? actualizarProducto : agregarProducto}
        actualizarProducto={actualizarProducto}
        errorCarga={errorCarga}
        categorias={listaCategorias}
        esEdicion={modoEdicion}
      />
    </Container>
  );
};

export default Productos;
