// src/components/chat/ChatIA.jsx
import React, { useState } from 'react';
import { Modal, Button, Form, ListGroup, Spinner, Table } from 'react-bootstrap';

const ChatIA = ({ mostrarChatModal, setMostrarChatModal }) => {
  const [mensaje, setMensaje] = useState('');
  const [respuesta, setRespuesta] = useState(null);
  const [cargando, setCargando] = useState(false);

  const enviarMensaje = async () => {
    if (!mensaje.trim()) return;
    setCargando(true);
    setRespuesta(null);
    setMensaje('');

    try {
      const prompt = `Genera una consulta SQL válida para un Data Mart con las siguientes tablas y relaciones: 
      - Dim_Tiempo (fecha, año, mes, dia, trimestre, nombre_mes, dia_semana) 
      - Dim_Clientes (id_cliente, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, nombre_completo, cedula) 
      - Dim_Empleados (id_empleado, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, nombre_completo, cargo, fecha_contratacion) 
      - Dim_Productos (id_producto, nombre_producto, nombre_categoria, precio_unitario, stock) 
      - Hecho_Ventas (id_venta, id_detalle_venta, id_cliente, id_empleado, id_producto, fecha, cantidad, precio_unitario, total_linea) 
      Relaciones: 
      - Hecho_Ventas.id_cliente -> Dim_Clientes.id_cliente 
      - Hecho_Ventas.id_empleado -> Dim_Empleados.id_empleado 
      - Hecho_Ventas.id_producto -> Dim_Productos.id_producto 
      - Hecho_Ventas.fecha -> Dim_Tiempo.fecha 
      Instrucciones: 
      - Toma en cuenta que son consultas SQL para MySQL. 
      - Usa solo las columnas listadas en cada tabla. 
      - Asegúrate de que los JOINs sean correctos y utilicen las claves foráneas especificadas. 
      - Si se solicita información de múltiples tablas, usa JOINs explícitos. 
      - No generes subconsultas complejas ni funciones avanzadas a menos que sean explícitamente solicitadas. 
      - Devuelve la consulta SQL en una sola línea, sin saltos de línea, comillas triples, ni formato adicional. 
      Pregunta del usuario: "${mensaje}"`;

      const apiKey = import.meta.env.VITE_API_KEY;
      const respuestaGemini = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { response_mime_type: 'text/plain' },
          }),
        }
      );

      if (!respuestaGemini.ok) {
        throw new Error('Error en la respuesta de Gemini API');
      }

      const datosGemini = await respuestaGemini.json();
      const consultaSQL = datosGemini.candidates?.[0]?.content?.parts?.[0]?.text || '';

      if (
        !consultaSQL.trim().startsWith('SELECT') ||
        consultaSQL.includes('DROP') ||
        consultaSQL.includes('DELETE') ||
        consultaSQL.includes('UPDATE')
      ) {
        throw new Error('Consulta SQL generada inválida o insegura. SOLO SE PUEDEN REALIZAR CONSULTAS SELECT.');
      }

      const response = await fetch('http://localhost:3000/ia/consultarConIA', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consultaSQL }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error en la respuesta del backend: ${errorText}`);
      }

      const resultado = await response.json();
      setRespuesta({
        usuario: mensaje,
        ia: resultado.resultados || 'No se encontraron resultados.',
      });
    } catch (error) {
      console.error('Error:', error);
      setRespuesta({ usuario: mensaje, ia: `Error: ${error.message}` });
    } finally {
      setCargando(false);
    }
  };

  return (
    <Modal show={mostrarChatModal} onHide={() => setMostrarChatModal(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Consulta la Data Mart con IA</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {respuesta && (
          <ListGroup className="mb-3">
            <ListGroup.Item>
              <strong>Tu:</strong> {respuesta.usuario}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>IA:</strong>{' '}
              {Array.isArray(respuesta.ia) && respuesta.ia.length > 0 ? (
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      {Object.keys(respuesta.ia[0]).map((key) => (
                        <th key={key}>{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {respuesta.ia.map((row, index) => (
                      <tr key={index}>
                        {Object.values(row).map((value, i) => (
                          <td key={i}>{value !== null ? value : ''}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                respuesta.ia
              )}
            </ListGroup.Item>
          </ListGroup>
        )}
        <Form.Group>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Ingresa tu consulta en lenguaje natural..."
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && enviarMensaje()}
            disabled={cargando}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarChatModal(false)}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={enviarMensaje} disabled={cargando}>
          {cargando ? <Spinner animation="border" size="sm" /> : 'Enviar'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChatIA;