import React, { useRef } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const VentasPorEmpleado = ({ empleados, totales_por_empleado }) => {
  const chartRef = useRef(null);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text("Ventas por Empleado Report", 14, 20);

    const chart = chartRef.current;
    if (chart) {
      const canvas = chart.canvas;
      const imgData = canvas.toDataURL('image/png');
      doc.addImage(imgData, 'PNG', 10, 30, 190, 100);
    }

    autoTable(doc, {
      startY: 140,
      head: [['Empleado', 'Ventas (C$)']],
      body: empleados.map((empleado, index) => [empleado, totales_por_empleado[index]?.toFixed(2) || '0.00']),
    });

    doc.save('ventas_por_empleado.pdf');
  };

  const validEmpleados = Array.isArray(empleados) && empleados.length > 0 ? empleados : ['Sin datos'];
  const validTotales = Array.isArray(totales_por_empleado) && totales_por_empleado.length > 0
    ? totales_por_empleado.map(val => (typeof val === 'number' && val >= 0 ? val : 0))
    : [0];

  const maxLength = Math.min(validEmpleados.length, validTotales.length);
  const labels = validEmpleados.slice(0, maxLength);
  const dataValues = validTotales.slice(0, maxLength);

  const data = {
    labels,
    datasets: [
      {
        label: 'Ventas (C$)',
        data: dataValues,
        backgroundColor: [
          'rgba(66, 133, 244, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
        ],
        borderColor: [
          'rgba(66, 133, 244, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 2,
        hoverOffset: 20,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 15,
          padding: 15,
          font: { size: 13, weight: '500', family: "'Roboto', sans-serif" },
          color: '#555',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 12 },
        padding: 10,
        borderColor: '#4285F4',
        borderWidth: 1,
        callbacks: {
          label: (context) => `${context.label}: C$${context.raw.toFixed(2)}`,
        },
      },
      datalabels: {
        color: '#333',
        font: { size: 12, weight: 'bold', family: "'Roboto', sans-serif" },
        formatter: (value) => (value > 0 ? `C$${value.toFixed(2)}` : ''),
        anchor: 'end',
        align: 'end',
        offset: 10,
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1200,
    },
  };

  return (
    <Card className="shadow-lg" style={{ borderRadius: '12px', background: '#F9FAFB', border: '1px solid rgba(66, 133, 244, 0.3)', marginBottom: '30px', padding: '15px' }}>
      <Card.Body>
        <Card.Title className="text-center mb-4" style={{ fontSize: '1.6rem', fontWeight: '600', color: '#2D3748', fontFamily: "'Roboto', sans-serif" }}>Ventas por Empleado</Card.Title>
        {validEmpleados[0] === 'Sin datos' || dataValues.every(val => val === 0) ? (
          <div className="text-center" style={{ fontSize: '1.2rem', color: '#718096', padding: '25px', fontFamily: "'Roboto', sans-serif" }}>No hay datos disponibles</div>
        ) : (
          <div style={{ height: '350px', maxWidth: '450px', margin: '0 auto 20px' }}>
            <Pie data={data} options={options} ref={chartRef} />
            <Button
              variant="primary"
              onClick={generatePDF}
              style={{ marginTop: '20px', width: '100%', backgroundColor: '#4285F4', borderColor: '#4285F4', borderRadius: '8px', padding: '10px', fontSize: '1rem', fontFamily: "'Roboto', sans-serif" }}
            >
              Generar PDF
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default VentasPorEmpleado;