import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { FaChevronLeft } from "react-icons/fa6";
import { TiUserDelete } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import { TiUserAdd } from "react-icons/ti";

import "./SolicitudCarta.css";

function SolicitudCartas() {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/SocioComunitarios");
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
  };

  return (
    <div className="solici-container">
    <div className="solici-title">Creación de Solicitud</div>
    <div className="solici-divider" />
    <div className="solici-content">
        {/* Filtros */}
        <div className="solici-left">
            <select className="solici-select">
                <option value="">Socios</option>
                {/* Opciones de socios */}
            </select>
            <div className="solici-filtros">
                {/* Titulo de filtros pero no centrado */}
                <h3 className="titulesolici-filt">Filtros:</h3>
                {/* Grupos del Académicos */}
                <select className="solici-select">
                    <option value="">Grupos del Académicos</option>
                    {/* Opciones de grupos */}
                </select>
                {/*Lista de Estudiantes */}
                <select className="solici-select">
                    <option value="">Lista de Estudiantes</option>
                    {/* Opciones de estudiantes */}
                </select>
            </div>
            {/*Boton de Añadir Estudiantes */}
            <button className="solici-button">
                <TiUserAdd /> Añadir Estudiantes
            </button>
        </div>

        {/* Línea divisoria central */}
        <div className="solici-divider-vertical"></div>

        <div className="solicitud-right">
            {/*Titulo de socio seleccionado */}
            <div className="solicitud-socio-seleccionado">
                <h3 className="medTitule-solici">Socio Seleccionado:</h3>
            </div>
            {/**/}
            <div className="solicitud-estudiantes-seleccionados">
                {/*Titulo de seleccionar estudiante */}
                <h3 className="subtitule-solici">Estudiantes Seleccionados</h3>

                {/*Tabla */}
                <table className="solici-table">
                    <thead className="solici-thead">
                        <tr>
                            <th>Nombre Completo</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="solici-tbody">
                        <tr>
                            <td></td>
                            <td>
                                <button className="icon-removeEst-button">
                                    <TiUserDelete />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                {/*Paginacion */}
                <div className="pagination-solici">
                    <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                        Anterior
                    </button>
                    <span>Página {currentPage}</span>
                    <button onClick={handleNextPage}>Siguiente</button>
                </div>
            </div>
            {/*Botones */}
            <div className="solicitud-buttons">
                <button
                    type="button"
                    className="solicitud-button"
                    onClick={handleBackClick}
                >
                    <FaChevronLeft /> Regresar
                </button>
                <button className="solicitud-button">Enviar</button>
            </div>
        </div>
    </div>
</div>
  );
}

export default SolicitudCartas;
