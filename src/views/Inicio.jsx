// src/components/inicio/Inicio.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Image } from "react-bootstrap";
import Portada from "../assets/portada.jpg";
import Proposito from "../components/inicio/Proposito";

const Inicio = () => {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const navegar = useNavigate();

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (!usuarioGuardado) {
      navegar("/login");
    } else {
      setNombreUsuario(usuarioGuardado);
    }
  }, [navegar]);

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("contrasena");
    navegar("/login");
  };

  return (
    <Container>
      <h1 className="text-center m-4">¡Bienvenido, {nombreUsuario}!</h1>
      <Image src={Portada} fluid rounded />
      <p>Estás en la página de inicio.</p>
      <Proposito />
      <button onClick={cerrarSesion} className="btn btn-danger">
        Cerrar Sesión
      </button>
    </Container>
  );
};

export default Inicio;