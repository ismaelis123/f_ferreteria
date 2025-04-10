import React from "react";
import { Row, Col, Pagination } from "react-bootstrap";

const Paginacion = ({
  elementosPorPagina,
  totalElementos,
  paginaActual,
  establecerPaginaActual,
}) => {
  const totalPaginas = Math.ceil(totalElementos / elementosPorPagina);

  const cambiarPagina = (pagina) => {
    if (pagina >= 1 && pagina <= totalPaginas) {
      establecerPaginaActual(pagina);
    }
  };

  // Generar los ítems de paginación
  const itemsPaginacion = [];
  const maxPaginasVisibles = 3; // Máximo de páginas visibles a la vez
  let paginaInicio = Math.max(1, paginaActual - Math.floor(maxPaginasVisibles / 2));
  let paginaFin = Math.min(totalPaginas, paginaInicio + maxPaginasVisibles - 1);

  if (paginaFin - paginaInicio + 1 < maxPaginasVisibles) {
    paginaInicio = Math.max(1, paginaFin - maxPaginasVisibles + 1);
  }

  for (let pagina = paginaInicio; pagina <= paginaFin; pagina++) {
    itemsPaginacion.push(
      <Pagination.Item
        key={pagina}
        active={pagina === paginaActual}
        onClick={() => cambiarPagina(pagina)}
      >
        {pagina}
      </Pagination.Item>
    );
  }

  return (
    <Row className="mt-3">
      <Col className="d-flex justify-content-center">
        <Pagination>
          <Pagination.First
            onClick={() => cambiarPagina(1)}
            disabled={paginaActual === 1}
          />
          <Pagination.Prev
            onClick={() => cambiarPagina(paginaActual - 1)}
            disabled={paginaActual === 1}
          />
          {paginaInicio > 1 && <Pagination.Ellipsis />}
          {itemsPaginacion}
          {paginaFin < totalPaginas && <Pagination.Ellipsis />}
          <Pagination.Next
            onClick={() => cambiarPagina(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
          />
          <Pagination.Last
            onClick={() => cambiarPagina(totalPaginas)}
            disabled={paginaActual === totalPaginas}
          />
        </Pagination>
      </Col>
    </Row>
  );
};

export default Paginacion;