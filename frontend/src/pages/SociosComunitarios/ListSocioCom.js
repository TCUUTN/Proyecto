import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { RiEdit2Fill } from "react-icons/ri";
import { IoMdAddCircle } from "react-icons/io";
import { SlEnvolopeLetter } from "react-icons/sl";
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
      <main>
        {/*Agregar usuario y el titulo*/}
        <div className="sociocomu-sidebar">
          <div className="action-sociocomu">
            <button className="add-sociocomu" onClick={handleAddUser}>
              Agregar <IoMdAddCircle className="icon-socio" />
            </button>
            <div className="socio-divider" />
            <h1 className="sociocomu-titulo">Socios Comunitarios</h1>
          </div>
        </div>

        {/* Lista de Socios */}
        <div className="solicitud-section">
          <div className="filters-sociocomu">
            <div className="filter-group-sociocomu">
            <label className="filter-label-sociocomu" >
            Buscar Nombre Socio
             </label>
              <input
                type="text"
                id="institucion-pendientes"
                placeholder="Nombre Institución"
                className="filter-control-sociocomu filter-input-sociocomu"
              />
            </div>
            <div className="filter-group-sociocomu">
            <label className="filter-label-sociocomu" >
            Buscar Contacto
             </label>
              <input
                type="text"
                id="contacto-pendientes"
                placeholder="Nombre Completo"
                className="filter-control-sociocomu filter-input-sociocomu"
              />
            </div>
            <div className="filter-group-sociocomu">
            <label className="filter-label-sociocomu" >
            Tipo de Institución
             </label>
              <input
                type="text"
                id="tipo-pendientes"
                placeholder="Tipo de Institución"
                className="filter-control-sociocomu filter-input-sociocomu"
              />
            </div>
            <div className="filter-group-sociocomu">
            <label className="filter-label-sociocomu" >
             Estado
             </label>
              <select id="estado-pendientes" 
              className="filter-control-sociocomu filter-select-sociocomu">
                <option value="">Todos</option>
              <option value="1">Activos</option>
              <option value="0">Inactivos</option>
              </select>
            </div>
          </div>
          <div className="table-container-sociocomu">
            <table className="table-sociocomu">
              <thead className="thead-sociocomu">
                <tr>
                  <th>Nombre del Socio</th>
                  <th>Informacion del Socio</th>
                  <th>Direccion</th>
                  <th>Tipo de Institucion</th>
                  <th>Nombre del Contacto</th>
                  <th>Informacion del Contacto</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody className="tbody-sociocomu">
              <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>
                  <button className="icon-btn--sociocomu">
                  <RiEdit2Fill />
                  </button>
                  </td>
              </tbody>
            </table>
            <div className="pagination-sociocomu">
              <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                Anterior
              </button>
              <span>Página {currentPage}</span>
              <button onClick={handleNextPage}>Siguiente</button>
            </div>
          </div>
        </div>

       
      </main>
    </div>
  );
}

export default SocioComunitarios;
