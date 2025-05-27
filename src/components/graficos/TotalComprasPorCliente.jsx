import React, { useRef } from 'react'; // Added useRef
import { Card, Button } from 'react-bootstrap'; // Added Button
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import jsPDF from 'jspdf'; // Added jsPDF
import autoTable from 'jspdf-autotable'; // Added autoTable

// Register Chart.js components and datalabels plugin
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const TotalComprasPorCliente = ({ clientes, totales_por_cliente }) => {
  // Added chart reference
  const chartRef = useRef(null);

  // Added PDF generation function
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text("Total Compras por Cliente Report", 14, 20);

    // Add chart image to PDF
    const chart = chartRef.current;
    if (chart) {
      const canvas = chart.canvas;
      const imgData = canvas.toDataURL('image/png');
      doc.addImage(imgData, 'PNG', 10, 30, 190, 100); // Adjusted dimensions
    }

    // Add table with autoTable
    autoTable(doc, {
      startY: 140,
      head: [['Cliente', 'Compras (C$)']],
      body: clientes.map((cliente, index) => [cliente, totales_por_cliente[index]?.toFixed(2) || '0.00']),
    });

    // Save the PDF
    doc.save('total_compras_por_cliente.pdf');
  };

  // Validate inputs
  const validClientes = Array.isArray(clientes) && clientes.length > 0 ? clientes : ['Sin datos'];
  const validTotales = Array.isArray(totales_por_cliente) && totales_por_cliente.length > 0
    ? totales_por_cliente.map(val => (typeof val === 'number' && val >= 0 ? val : 0))
    : [0];

  // Ensure lengths match to avoid chart rendering issues
  const maxLength = Math.min(validClientes.length, validTotales.length);
  const labels = validClientes.slice(0, maxLength);
  const dataValues = validTotales.slice(0, maxLength);

  // Define chart data
  const data = {
    labels,
    datasets: [
      {
        label: 'Compras (C$)',
        data: dataValues,
        backgroundColor: [
          '#FF6B6B', // Vibrant Red
          '#4ECDC4', // Teal
          '#FFD93D', // Bright Yellow
          '#6B728E', // Slate Blue
          '#FF8C8C', // Soft Coral
          '#A8DADC', // Light Cyan
          '#FFAB76', // Peach
          '#98DDCA', // Mint Green
        ],
        borderColor: [
          '#D53F3F',
          '#3BA8A1',
          '#D4A017',
          '#4B5EAA',
          '#D96666',
          '#7AB8BA',
          '#D9773F',
          '#6AB6A3',
        ],
        borderWidth: 2,
        hoverOffset: 20, // Larger offset for hover animation
      },
    ],
  };

  // Define chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%', // Doughnut chart with a larger center hole
    plugins: {
      legend: {
        position: 'bottom', // Move legend to bottom for better layout
        labels: {
          boxWidth: 20,
          padding: 20,
          font: {
            size: 14,
            family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
          },
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
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
        padding: 10,
        cornerRadius: 4,
        callbacks: {
          label: (context) => `${context.label}: C$${context.raw.toFixed(2)}`,
        },
      },
      datalabels: {
        color: '#fff',
        font: {
          size: 12,
          weight: 'bold',
        },
        formatter: (value, context) => {
          const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
          const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
          return percentage > 5 ? `${percentage}%` : ''; // Only show labels for segments > 5%
        },
        textShadow: '0 0 4px rgba(0, 0, 0, 0.3)', // Add subtle shadow for readability
      },
    },
    animation: {
      animateScale: true,
      animateRotate: true,
    },
  };

  return (
    <Card className="shadow-sm border-0" style={{ borderRadius: '15px', background: '#f8f9fa' }}>
      <Card.Body>
        <Card.Title className="text-center mb-4" style={{ fontSize: '1.5rem', fontWeight: '600', color: '#333' }}>
          Total de Compras por Cliente
        </Card.Title>
        {validClientes[0] === 'Sin datos' || dataValues.every(val => val === 0) ? (
          <div className="text-center text-muted" style={{ fontSize: '1.2rem', padding: '20px' }}>
            No hay datos disponibles
          </div>
        ) : (
          <div style={{ height: '350px', maxWidth: '450px', margin: '0 auto' }}>
            <Doughnut data={data} options={options} ref={chartRef} /> {/* Added ref */}
            <Button
              variant="primary"
              onClick={generatePDF}
              style={{ marginTop: '15px', width: '100%' }}
            >
              Generar PDF
            </Button> {/* Added button */}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default TotalComprasPorCliente;