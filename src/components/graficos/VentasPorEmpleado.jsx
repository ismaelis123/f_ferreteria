
import React from 'react';
import { Card } from 'react-bootstrap';
import { PolarArea } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Register Chart.js components and datalabels plugin
ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend, ChartDataLabels);

const VentasPorEmpleado = ({ empleados, totales_por_empleado }) => {
  // Validate inputs
  const validEmpleados = Array.isArray(empleados) && empleados.length > 0 ? empleados : ['Sin datos'];
  const validTotales = Array.isArray(totales_por_empleado) && totales_por_empleado.length > 0
    ? totales_por_empleado.map(val => (typeof val === 'number' && val >= 0 ? val : 0))
    : [0];

  // Ensure lengths match to avoid chart rendering issues
  const maxLength = Math.min(validEmpleados.length, validTotales.length);
  const labels = validEmpleados.slice(0, maxLength);
  const dataValues = validTotales.slice(0, maxLength);

  // Define chart data
  const data = {
    labels,
    datasets: [
      {
        label: 'Ventas (C$)',
        data: dataValues,
        backgroundColor: [
          'rgba(255, 51, 153, 0.7)', // Neon Pink
          'rgba(51, 255, 255, 0.7)', // Neon Cyan
          'rgba(255, 204, 0, 0.7)',  // Neon Yellow
          'rgba(0, 255, 128, 0.7)',  // Neon Green
          'rgba(204, 51, 255, 0.7)', // Neon Purple
          'rgba(255, 102, 51, 0.7)', // Neon Orange
          'rgba(102, 255, 204, 0.7)', // Neon Teal
          'rgba(255, 51, 51, 0.7)',  // Neon Red
        ],
        borderColor: [
          '#FF3399', // Bright Pink
          '#33FFFF', // Bright Cyan
          '#FFCC00', // Bright Yellow
          '#00FF80', // Bright Green
          '#CC33FF', // Bright Purple
          '#FF6633', // Bright Orange
          '#66FFCC', // Bright Teal
          '#FF3333', // Bright Red
        ],
        borderWidth: 2,
        hoverOffset: 30, // Strong hover effect
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowBlur: 15,
        shadowColor: 'rgba(255, 255, 255, 0.5)', // Glow effect
      },
    ],
  };

  // Define chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 25,
          padding: 25,
          font: {
            size: 15,
            weight: 'bold',
            family: "'Roboto', 'Helvetica Neue', 'Arial', sans-serif",
          },
          color: '#E0E0E0', // Light gray for dark theme
          generateLabels: (chart) => {
            const { data } = chart;
            if (data.labels.length && data.datasets.length) {
              const total = data.datasets[0].data.reduce((sum, val) => sum + val, 0);
              return data.labels.map((label, i) => ({
                text: `${label}: ${total > 0 ? ((data.datasets[0].data[i] / total) * 100).toFixed(1) : 0}%`,
                fillStyle: data.datasets[0].backgroundColor[i],
                strokeStyle: data.datasets[0].borderColor[i],
                lineWidth: 2,
              }));
            }
            return [];
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleFont: { size: 16, weight: 'bold' },
        bodyFont: { size: 14 },
        padding: 12,
        cornerRadius: 6,
        borderColor: '#33FFFF', // Neon Cyan border
        borderWidth: 2,
        callbacks: {
          label: (context) => `${context.label}: C$${context.raw.toFixed(2)}`,
        },
      },
      datalabels: {
        color: '#fff',
        font: {
          size: 13,
          weight: 'bold',
          family: "'Roboto', 'Helvetica Neue', 'Arial', sans-serif",
        },
        formatter: (value, context) => {
          const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
          const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
          return percentage > 3 ? `${percentage}%\nC$${value.toFixed(2)}` : ''; // Show both % and value
        },
        textShadow: '0 0 6px rgba(0, 0, 0, 0.5)', // Stronger shadow for neon effect
        align: 'end',
        anchor: 'end',
        offset: 10,
      },
    },
    scales: {
      r: {
        ticks: {
          display: false, // Hide radial ticks for cleaner look
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.2)', // Subtle grid for dark theme
        },
        pointLabels: {
          font: {
            size: 14,
            weight: 'bold',
          },
          color: '#E0E0E0', // Light gray for readability
        },
      },
    },
    animation: {
      animateScale: true,
      animateRotate: true,
      easing: 'easeOutBounce', // Bounce effect for fun
      duration: 1500,
    },
  };

  return (
    <Card
      className="shadow-lg border-0"
      style={{
        borderRadius: '20px',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 100%)', // Dark gradient
        border: '2px solid #33FFFF', // Neon Cyan border
      }}
    >
      <Card.Body>
        <Card.Title
          className="text-center mb-4"
          style={{
            fontSize: '1.8rem',
            fontWeight: '700',
            color: '#33FFFF', // Neon Cyan title
            textShadow: '0 0 10px rgba(51, 255, 255, 0.5)', // Glow effect
            fontFamily: "'Roboto', 'Helvetica Neue', 'Arial', sans-serif",
          }}
        >
          Ventas por Empleado
        </Card.Title>
        {validEmpleados[0] === 'Sin datos' || dataValues.every(val => val === 0) ? (
          <div
            className="text-center"
            style={{
              fontSize: '1.3rem',
              color: '#E0E0E0',
              padding: '30px',
              textShadow: '0 0 5px rgba(255, 255, 255, 0.3)',
            }}
          >
            No hay datos disponibles
          </div>
        ) : (
          <div style={{ height: '400px', maxWidth: '500px', margin: '0 auto' }}>
            <PolarArea data={data} options={options} />
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default VentasPorEmpleado;
