import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Encabezado = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is logged in on component mount
  useEffect(() => {
    const usuario = localStorage.getItem('usuario');
    const contraseña = localStorage.getItem('contraseña');
    if (!usuario || !contraseña) {
      // Redirect to login page if not logged in, except if already on login page
      if (location.pathname !== '/') {
        navigate('/');
      }
    }
  }, [navigate, location.pathname]);

  // Handle logout
  const cerrarSesion = () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('contraseña');
    navigate('/');
  };

  // Check if user is logged in
  const isLoggedIn = () => {
    return localStorage.getItem('usuario') && localStorage.getItem('contraseña');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
      <Container>
        <Navbar.Brand as={Link} to={isLoggedIn() ? '/inicio' : '/'}>
          FERRETERIA YUSSI
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" disabled={!isLoggedIn()} />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {/* Menú Button with Dropdown */}
            <Dropdown show={showDropdown} onToggle={() => setShowDropdown(!showDropdown)} disabled={!isLoggedIn()}>
              <Dropdown.Toggle variant="primary" id="dropdown-menu" disabled={!isLoggedIn()}>
                Menú
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {/* Navigation Links */}
                <Dropdown.Item as={Link} to="/inicio" disabled={!isLoggedIn()}>
                  Inicio
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/productos" disabled={!isLoggedIn()}>
                  Productos
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/categorias" disabled={!isLoggedIn()}>
                  Categorías
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/clientes" disabled={!isLoggedIn()}>
                  Clientes
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/ventas" disabled={!isLoggedIn()}>
                  Ventas
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/compras" disabled={!isLoggedIn()}>
                  Compras
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/usuarios" disabled={!isLoggedIn()}>
                  Usuarios
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/empleados" disabled={!isLoggedIn()}>
                  Empleados
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/catalogoProductos" disabled={!isLoggedIn()}>
                  Catálogo
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/estadisticas" disabled={!isLoggedIn()}>
                  Estadísticas
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/Dashboard" disabled={!isLoggedIn()}>
                  Dashboard
                </Dropdown.Item>

                <Dropdown.Divider />

                {/* Logout Option */}
                <Dropdown.Item onClick={cerrarSesion} disabled={!isLoggedIn()}>
                  Cerrar Sesión
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Encabezado;