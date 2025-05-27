import React, { useRef } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ChartDataLabels);

const VentasPorMes = ({ meses, totales_por_mes }) => {
  const chartRef = useRef(null);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text("Ventas por Mes Report", 14, 20);

    const chart = chartRef.current;
    if (chart) {
      const canvas = chart.canvas;
      const imgData = canvas.toDataURL('image/png');
      doc.addImage(imgData, 'PNG', 10, 30, 190, 100);
    }

    autoTable(doc, {
      startY: 140,
      head: [['Mes', 'Ventas (C$)']],
      body: meses.map((mes, index) => [mes, totales_por_mes[index]?.toFixed(2) || '0.00']),
    });

    doc.save('ventas_por_mes.pdf');
  };

  const validMeses = Array.isArray(meses) && meses.length > 0 ? meses : ['Sin datos'];
  const validTotales = Array.isArray(totales_por_mes) && totales_por_mes.length > 0
    ? totales_por_mes.map(val => (typeof val === 'number' && val >= 0 ? val : 0))
    : [0];

  const maxLength = Math.min(validMeses.length, validTotales.length);
  const labels = validMeses.slice(0, maxLength);
  const dataValues = validTotales.slice(0, maxLength);

  const data = {
    labels,
    datasets: [
      {
        label: 'Ventas (C$)',
        data: dataValues,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, 'rgba(66, 133, 244, 0.9)');
          gradient.addColorStop(1, 'rgba(66, 133, 244, 0.5)');
          return gradient;
        },
        borderColor: '#4285F4',
        borderWidth: 2,
        borderRadius: 4,
        barThickness: 20,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#2D3748', font: { size: 14, weight: '500' } } },
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
        align: 'top',
        offset: 5,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0, 0, 0, 0.1)', drawBorder: false },
        ticks: { color: '#718096', font: { size: 12 } },
        title: { display: true, text: 'Córdobas (C$)', color: '#2D3748', font: { size: 14, weight: '500' } },
      },
      x: {
        grid: { display: false },
        ticks: { color: '#718096', font: { size: 12 } },
        title: { display: true, text: 'Meses', color: '#2D3748', font: { size: 14, weight: '500' } },
      },
    },
    animation: {
      duration: 1500,
      easing: 'easeOutBounce',
    },
  };

  return (
    <Card className="shadow-lg" style={{ borderRadius: '12px', background: '#F9FAFB', border: '1px solid rgba(66, 133, 244, 0.3)', marginBottom: '30px', padding: '15px' }}>
      <Card.Body>
        <Card.Title className="text-center mb-4" style={{ fontSize: '1.6rem', fontWeight: '600', color: '#2D3748', fontFamily: "'Roboto', sans-serif" }}>Ventas por Mes</Card.Title>
        {validMeses[0] === 'Sin datos' || dataValues.every(val => val === 0) ? (
          <div className="text-center" style={{ fontSize: '1.2rem', color: '#718096', padding: '25px', fontFamily: "'Roboto', sans-serif" }}>No hay datos disponibles</div>
        ) : (
          <div style={{ height: '350px', maxWidth: '650px', margin: '0 auto 20px' }}>
            <Bar data={data} options={options} ref={chartRef} />
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

export default VentasPorMes;