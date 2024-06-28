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

  const handleAddSolicitud = () => {
    navigate("/CrearActualizarSolicitudesCartas");
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
            <button className="add-sociocomu" onClick={handleAddSolicitud}>
              Agregar <IoMdAddCircle className="icon-socio" />
            </button>
            <div className="socio-divider" />
            <h1 className="sociocomu-titulo">Solicitudes de Carta</h1>
          </div>
        </div>

        {/* Solicitud Pendientes */}
        <div className="solicitud-section">
          <h2 className="solicitud-title">Solicitud Pendientes</h2>
          <div className="socios-divider" />
          <div className="filters-sociocomu">
            <div className="filter-group-sociocomu">
              <label className="filter-label-sociocomu">
                Busqueda por Nombre de Socio
              </label>
              <input
                type="text"
                id="institucion-pendientes"
                placeholder="Nombre del Socio"
                className="filter-control-sociocomu filter-input-sociocomu"
              />
            </div>
            <div className="filter-group-sociocomu">
              <label className="filter-label-sociocomu">
                Busqueda por Nombre del Estudiante
              </label>
              <input
                type="text"
                id="contacto-pendientes"
                placeholder="Nombre Completo"
                className="filter-control-sociocomu filter-input-sociocomu"
              />
            </div>
          </div>
          <div className="table-container-sociocomu">
            <table className="table-sociocomu">
              <thead className="thead-sociocomu">
                <tr>
                  <th>Socio</th>
                  <th>Estudiante</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody className="tbody-sociocomu">
                <td></td>
                <td></td>
                <td>
                  <button className="icon-btn--sociocomu">
                    <RiEdit2Fill />
                  </button>
                  <button className="icon-btn--sociocomu">
                    <SlEnvolopeLetter />
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

        {/* Solicitud Completadas */}
        <div className="solicitud-section">
          <h2 className="solicitud-title">Solicitud Completadas</h2>
          <div className="socios-divider" />
          <div className="filters-sociocomu">
            <div className="filter-group-sociocomu">
              <label className="filter-label-sociocomu">
                Busqueda por Nombre de Socio
              </label>
              <input
                type="text"
                id="institucion-pendientes"
                placeholder="Nombre del Socio"
                className="filter-control-sociocomu filter-input-sociocomu"
              />
            </div>
            <div className="filter-group-sociocomu">
              <label className="filter-label-sociocomu">
                Busqueda por Nombre del Estudiante
              </label>
              <input
                type="text"
                id="contacto-pendientes"
                placeholder="Nombre Completo"
                className="filter-control-sociocomu filter-input-sociocomu"
              />
            </div>
            <div className="filter-group-sociocomu">
              <label className="filter-label-sociocomu">
                Busqueda por Nombre de la Carta
              </label>
              <input
                type="text"
                id="contacto-pendientes"
                placeholder="Nombre del Archivo"
                className="filter-control-sociocomu filter-input-sociocomu"
              />
            </div>
          </div>
          <div className="table-container-sociocomu">
            <table className="table-sociocomu">
              <thead className="thead-sociocomu">
                <tr>
                  <th>Socio</th>
                  <th>Estudiante</th>
                  <th>Carta</th>
                </tr>
              </thead>
              <tbody className="tbody-sociocomu">
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
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
