import React from "react";
import { Row, Col, Form, Button, Card, Alert } from "react-bootstrap";
import "../../app.css";

const LoginForm = ({ email, password, error, setEmail, setPassword, manejarEnvio }) => {
  return (
    <Row className="w-100 justify-content-center">
      <Col md={6} lg={5} xl={4}>
        <Card className="p-4 shadow-lg">
          <Card.Body>
            <h3 className="text-center mb-4">Iniciar Sesión</h3>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={manejarEnvio}>
              <Form.Group className="mb-3" controlId="usuario">
                <Form.Label>Usuario</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingresa tu usuario"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="contraseñaUsuario">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100">
                Iniciar Sesión
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default LoginForm;