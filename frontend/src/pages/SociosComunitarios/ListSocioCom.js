import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaInfoCircle } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import "./SocioCom.css";

function SocioComunitarios() {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const handleAddUser = () => {
    navigate("/CrearActuSocioComunitarios");
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
  };

  return (
    <div className="sociocomunitario-container">
      {/**/}
      <main>
        {/*Agregar usuario y el titulo*/}
        <div className="sociocomu-sidebar">
          <div className="action-sociocomu">
            <button className="add-sociocomu" onClick={handleAddUser}>
              Agregar <IoMdAddCircle className="icon-socio" />
            </button>
            {/*linea*/}
            <div className="socio-divider" />
            {/*Titulo*/}
            <h1 className="sociocomu-titulo">Socios Comunitarios</h1>
          </div>
        </div>
        {/*Filtros*/}
        <div className="filters-sociocomu">
          {/*Nombre Institución*/}
          <div className="filter-group-sociocomu">
            <label className="filter-label-sociocomu" htmlFor="institucion">
              Buscar Nombre Institución
            </label>
            <input
              type="text"
              id="institucion"
              placeholder="Nombre Institución"
              className="filter-input-sociocomu"
            />
          </div>
          {/*Buscar Contacto*/}
          <div className="filter-group-sociocomu">
            <label className="filter-label-sociocomu" htmlFor="contacto">
              Buscar Contacto
            </label>
            <input
              type="text"
              id="contacto"
              placeholder="Nombre Completo"
              className="filter-input-sociocomu"
            />
          </div>
          {/*Tipo de Institución*/}
          <div className="filter-group-sociocomu">
            <label className="filter-label-sociocomu" htmlFor="tipo">
              Tipo de Institución
            </label>
            <select
              id="tipo"
              className="filter-select-sociocomu"
              placeholder="Tipo de Institución"
            >
              <option value="">Tipo de Institución</option>
            </select>
          </div>
        </div>
        {/*Tabla*/}
        <div className="table-container-sociocomu">
          <table className="table-sociocomu">
            <thead className="thead-sociocomu">
              <tr>
                <th>Nombre Institución</th>
                <th>Nombre Contacto</th>
                <th>Tipo de Institución</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody className="tbody-sociocomu">
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>
                  <button className="icon-btn--sociocomu">
                    <FaEdit />
                  </button>
                  <button className="icon-btn--sociocomu">
                    <FaInfoCircle />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          {/* La paginacion */}
          <div className="pagination">
            <button onClick={handlePreviousPage} disabled={currentPage === 1}>
              Anterior
            </button>
            <span>Página {currentPage}</span>
            <button onClick={handleNextPage}>Siguiente</button>
          </div>
        </div>
        {/**/}
      </main>
      {/**/}
    </div>
  );
}

export default SocioComunitarios;
