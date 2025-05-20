import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import VentasPorMes from '../components/graficos/VentasPorMes';

const Estadisticas = () => {
  const [meses, setMeses] = useState([]);
  const [totalesPorMes, setTotalesPorMes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargaVentas = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/totalVentasPorMes');
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json();
        console.log('API Response:', data); // Debug: Log the response

        // Handle different response structures
        let ventasArray = data;
        if (!Array.isArray(data)) {
          // Check if data contains an array in a property like 'data', 'result', or 'ventas'
          if (data.data && Array.isArray(data.data)) {
            ventasArray = data.data;
          } else if (data.result && Array.isArray(data.result)) {
            ventasArray = data.result;
          } else if (data.ventas && Array.isArray(data.ventas)) {
            ventasArray = data.ventas;
          } else {
            throw new Error('La respuesta de la API no contiene un arreglo válido');
          }
        }

        // Validate data structure
        if (ventasArray.length === 0) {
          setError('No hay datos de ventas disponibles');
          return;
        }

        // Ensure each item has required properties
        const hasValidStructure = ventasArray.every(item => 
          Object.prototype.hasOwnProperty.call(item, 'mes') && Object.prototype.hasOwnProperty.call(item, 'total_ventas')
        );
        if (!hasValidStructure) {
          throw new Error('Los datos no tienen la estructura esperada (mes, total_ventas)');
        }

        // Map the data
        setMeses(ventasArray.map(item => item.mes));
        setTotalesPorMes(ventasArray.map(item => item.total_ventas));
        setError(null); // Clear errors
      } catch (error) {
        console.error('Error al cargar ventas:', error);
        setError('Error al cargar ventas: ' + error.message);
      }
    };
    cargaVentas();
  }, []);
  

  return (
    <Container className="mt-5">
      <h4>Estadísticas</h4>
      {error && <div className="alert alert-danger">{error}</div>}
      <Row className="mt-4">
        <Col xs={12} sm={12} md={12} lg={6} className="mb-4">
          <VentasPorMes meses={meses} totales_por_mes={totalesPorMes} />
        </Col>
      </Row>
    </Container>
  );
};

export default Estadisticas;