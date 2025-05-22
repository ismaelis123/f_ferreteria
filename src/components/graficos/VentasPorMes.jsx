import React from 'react';
import { Card } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Register Chart.js components and datalabels plugin
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ChartDataLabels);

const VentasPorMes = ({ meses, totales_por_mes }) => {
  // Validate inputs
  const validMeses = Array.isArray(meses) && meses.length > 0 ? meses : ['Sin datos'];
  const validTotales = Array.isArray(totales_por_mes) && totales_por_mes.length > 0
    ? totales_por_mes.map(val => (typeof val === 'number' && val >= 0 ? val : 0))
    : [0];

  // Ensure lengths match
  const maxLength = Math.min(validMeses.length, validTotales.length);
  const labels = validMeses.slice(0, maxLength);
  const dataValues = validTotales.slice(0, maxLength);

  // Define chart data
  const data = {
    labels,
    datasets: [
      {
        label: 'Ventas (C$)',
        data: dataValues,
        backgroundColor: 'rgba(66, 133, 244, 0.7)', // Google Blue for vibrant contrast
        borderColor: '#4285F4', // Solid Google Blue
        borderWidth: 2,
        hoverBackgroundColor: 'rgba(66, 133, 244, 0.9)', // Brighter on hover
        hoverBorderColor: '#3267D6',
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowBlur: 10,
        shadowColor: 'rgba(66, 133, 244, 0.3)', // Subtle blue glow
      },
    ],
  };

  // Define chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 25,
          padding: 20,
          font: {
            size: 14,
            weight: 'bold',
            family: "'Roboto', 'Helvetica Neue', 'Arial', sans-serif",
          },
          color: '#333333', // Dark gray for white theme
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleFont: { size: 15, weight: 'bold' },
        bodyFont: { size: 13 },
        padding: 10,
        cornerRadius: 6,
        borderColor: '#4285F4', // Blue border
        borderWidth: 1,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        callbacks: {
          label: (context) => `${context.label}: C$${context.raw.toFixed(2)}`,
        },
      },
      datalabels: {
        color: '#ffffff',
        font: {
          size: 12,
          weight: 'bold',
          family: "'Roboto', 'Helvetica Neue', 'Arial', sans-serif",
        },
        formatter: (value) => (value > 0 ? `C$${value.toFixed(2)}` : ''),
        textShadow: '0 0 4px rgba(0, 0, 0, 0.3)', // Subtle shadow for contrast
        anchor: 'end',
        align: 'top',
        offset: 5,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)', // Very light grid for white theme
        },
        ticks: {
          color: '#555555', // Medium gray ticks
          font: {
            size: 12,
            family: "'Roboto', 'Helvetica Neue', 'Arial', sans-serif",
          },
        },
        title: {
          display: true,
          text: 'Córdobas (C$)',
          color: '#333333',
          font: {
            size: 14,
            weight: 'bold',
            family: "'Roboto', 'Helvetica Neue', 'Arial', sans-serif",
          },
        },
      },
      x: {
        grid: {
          display: false, // Hide x-axis grid for clean look
        },
        ticks: {
          color: '#555555',
          font: {
            size: 12,
            family: "'Roboto', 'Helvetica Neue', 'Arial', sans-serif",
          },
        },
        title: {
          display: true,
          text: 'Meses',
          color: '#333333',
          font: {
            size: 14,
            weight: 'bold',
            family: "'Roboto', 'Helvetica Neue', 'Arial', sans-serif",
          },
        },
      },
    },
    animation: {
      duration: 1500,
      easing: 'easeOutBounce', // Bounce effect for engagement
    },
    hover: {
      animationDuration: 400,
    },
  };

  return (
    <Card
      className="shadow-sm border-0"
      style={{
        borderRadius: '15px',
        background: '#FFFFFF', // Pure white background
        border: '1px solid rgba(66, 133, 244, 0.3)', // Subtle blue border
      }}
    >
      <Card.Body>
        <Card.Title
          className="text-center mb-4"
          style={{
            fontSize: '1.7rem',
            fontWeight: '700',
            color: '#333333', // Dark gray title
            textShadow: '0 0 5px rgba(66, 133, 244, 0.2)', // Subtle blue glow
            fontFamily: "'Roboto', 'Helvetica Neue', 'Arial', sans-serif",
          }}
        >
          Ventas por Mes
        </Card.Title>
        {validMeses[0] === 'Sin datos' || dataValues.every(val => val === 0) ? (
          <div
            className="text-center"
            style={{
              fontSize: '1.2rem',
              color: '#888888',
              padding: '25px',
              fontFamily: "'Roboto', 'Helvetica Neue', 'Arial', sans-serif",
            }}
          >
            No hay datos disponibles
          </div>
        ) : (
          <div style={{ height: '400px', maxWidth: '500px', margin: '0 auto' }}>
            <Bar data={data} options={options} />
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default VentasPorMes;