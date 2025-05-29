// src/views/Estadisticas.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Button } from 'react-bootstrap'; // Añadimos Button
import VentasPorMes from '../components/graficos/VentasPorMes';
import VentasPorEmpleado from '../components/graficos/VentasPorEmpleado';
import TotalComprasPorCliente from '../components/graficos/TotalComprasPorCliente';
import ChatIA from '../components/chat/ChatIA'; // Importamos ChatIA

const Estadisticas = () => {
  const [meses, setMeses] = useState([]);
  const [totalesPorMes, setTotalesPorMes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [totalesPorEmpleado, setTotalesPorEmpleado] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [totalesPorCliente, setTotalesPorCliente] = useState([]);
  const [error, setError] = useState(null);
  const [mostrarChatModal, setMostrarChatModal] = useState(false); // Estado para el modal

  useEffect(() => {
    const cargaVentas = async () => {
      try {
        // Fetch sales by month
        const responseMeses = await fetch('http://localhost:3000/api/totalVentasPorMes');
        if (!responseMeses.ok) {
          throw new Error(`Error HTTP (Ventas por Mes): ${responseMeses.status}`);
        }
        const dataMeses = await responseMeses.json();
        console.log('API Response (Meses):', dataMeses);

        let ventasMesesArray = Array.isArray(dataMeses.data) ? dataMeses.data : Array.isArray(dataMeses) ? dataMeses : [];
        if (!ventasMesesArray.length) {
          setMeses([]);
          setTotalesPorMes([]);
          setError('No hay datos de ventas por mes disponibles');
        } else {
          const hasValidMesesStructure = ventasMesesArray.every(item =>
            item.mes != null && item.total_ventas != null
          );
          if (!hasValidMesesStructure) {
            throw new Error('Los datos de meses no tienen la estructura esperada (mes, total_ventas)');
          }

          const monthMap = {
            '01': 'Enero', '02': 'Febrero', '03': 'Marzo', '04': 'Abril',
            '05': 'Mayo', '06': 'Junio', '07': 'Julio', '08': 'Agosto',
            '09': 'Septiembre', '10': 'Octubre', '11': 'Noviembre', '12': 'Diciembre'
          };

          setMeses(ventasMesesArray.map(item => monthMap[item.mes] || item.mes));
          setTotalesPorMes(ventasMesesArray.map(item => Number(item.total_ventas) || 0));
        }

        // Fetch sales by employee
        const responseEmpleados = await fetch('http://localhost:3000/api/totalVentasPorEmpleado');
        if (!responseEmpleados.ok) {
          throw new Error(`Error HTTP (Ventas por Empleado): ${responseEmpleados.status}`);
        }
        const dataEmpleados = await responseEmpleados.json();
        console.log('API Response (Empleados):', dataEmpleados);

        let ventasEmpleadosArray = Array.isArray(dataEmpleados.data) ? dataEmpleados.data : Array.isArray(dataEmpleados) ? dataEmpleados : [];
        if (!ventasEmpleadosArray.length) {
          setEmpleados([]);
          setTotalesPorEmpleado([]);
          setError(prev => prev ? `${prev}; No hay datos de ventas por empleado disponibles` : 'No hay datos de ventas por empleado disponibles');
        } else {
          const hasValidEmpleadosStructure = ventasEmpleadosArray.every(item =>
            item.primer_nombre != null && item.primer_apellido != null && item.total_ventas != null
          );
          if (!hasValidEmpleadosStructure) {
            throw new Error('Los datos de empleados no tienen la estructura esperada (primer_nombre, primer_apellido, total_ventas)');
          }

          setEmpleados(ventasEmpleadosArray.map(item =>
            `${item.primer_nombre} ${item.segundo_nombre || ''} ${item.primer_apellido}`.trim()
          ));
          setTotalesPorEmpleado(ventasEmpleadosArray.map(item => Number(item.total_ventas) || 0));
        }

        // Fetch purchases by client
        const responseClientes = await fetch('http://localhost:3000/api/totalComprasPorCliente');
        if (!responseClientes.ok) {
          throw new Error(`Error HTTP (Compras por Cliente): ${responseClientes.status}`);
        }
        const dataClientes = await responseClientes.json();
        console.log('API Response (Clientes):', dataClientes);

        let comprasClientesArray = Array.isArray(dataClientes.data) ? dataClientes.data : Array.isArray(dataClientes) ? dataClientes : [];
        if (!comprasClientesArray.length) {
          setClientes([]);
          setTotalesPorCliente([]);
          setError(prev => prev ? `${prev}; No hay datos de compras por cliente disponibles` : 'No hay datos de compras por cliente disponibles');
        } else {
          const hasValidClientesStructure = comprasClientesArray.every(item =>
            item.primer_nombre != null && item.primer_apellido != null && item.total_compras != null
          );
          if (!hasValidClientesStructure) {
            throw new Error('Los datos de clientes no tienen la estructura esperada (primer_nombre, primer_apellido, total_compras)');
          }

          setClientes(comprasClientesArray.map(item =>
            `${item.primer_nombre} ${item.segundo_nombre || ''} ${item.primer_apellido}`.trim()
          ));
          setTotalesPorCliente(comprasClientesArray.map(item => Number(item.total_compras) || 0));
        }

        // Set error only if all API calls return no data
        if (!ventasMesesArray.length && !ventasEmpleadosArray.length && !comprasClientesArray.length) {
          setError('No hay datos disponibles para mostrar');
        } else {
          setError(null);
        }
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
        setError('Error al cargar estadísticas: ' + error.message);
        setMeses([]);
        setTotalesPorMes([]);
        setEmpleados([]);
        setTotalesPorEmpleado([]);
        setClientes([]);
        setTotalesPorCliente([]);
      }
    };
    cargaVentas();
  }, []);

  return (
    <Container className="mt-5">
      <h4>Estadísticas</h4>
      <Button variant="primary" onClick={() => setMostrarChatModal(true)}>
        Consultar con IA
      </Button>
      {error && <Alert variant="danger">{error}</Alert>}
      <Row className="mt-4">
        <Col xs={12} md={6} lg={4} className="mb-4">
          <VentasPorMes meses={meses} totales_por_mes={totalesPorMes} />
        </Col>
        <Col xs={12} md={6} lg={4} className="mb-4">
          <VentasPorEmpleado empleados={empleados} totales_por_empleado={totalesPorEmpleado} />
        </Col>
        <Col xs={12} md={6} lg={4} className="mb-4">
          <TotalComprasPorCliente clientes={clientes} totales_por_cliente={totalesPorCliente} />
        </Col>
      </Row>
      <ChatIA
        mostrarChatModal={mostrarChatModal}
        setMostrarChatModal={setMostrarChatModal}
      />
    </Container>
  );
};

export default Estadisticas;