import React, { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa6";
import { IoMdAddCircle } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./VistaHorasEstudiante.modulo.css";

function VistaHorasEstudiante() {
  const navigate = useNavigate();
  const [materias, setMaterias] = useState([]);
  const [filteredApprovedMaterias, setFilteredApprovedMaterias] = useState([]);
  const [filteredRejectedMaterias, setFilteredRejectedMaterias] = useState([]);
  const [descripcionActividadFilter, setDescripcionActividadFilter] =
    useState("");
  const [tipoFilter, setTipoFilter] = useState("");
  const [
    descripcionActividadFilterRejected,
    setDescripcionActividadFilterRejected,
  ] = useState("");
  const [tipoFilterRejected, setTipoFilterRejected] = useState("");
  const [fechaFilter, setFechaFilter] = useState("");
  const [fechaFilterRejected, setFechaFilterRejected] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const materiasPerPage = 10;
  const identificacion = localStorage.getItem("IdentificacionHoras");
  console.log(identificacion)
  const selectedRole = sessionStorage.getItem("SelectedRole");
  useEffect(() => {
    if (identificacion) {
      fetchHoras();
    }
  }, [identificacion]);

  const fetchGrupoId = async () => {
    try {
      const response = await fetch(`/grupos/GrupoEstudiante/${identificacion}`);
      if (response.ok) {
        const data = await response.json();
        return data.GrupoId;
      } else {
        console.error("Error al obtener el GrupoId");
        toast.error("Error al obtener el GrupoId");
      }
    } catch (error) {
      console.error("Error al obtener el GrupoId:", error);
      toast.error("Error al obtener el GrupoId");
    }
  };

  const fetchHoras = async () => {
    try {
      const grupoId = await fetchGrupoId(identificacion);
      if (grupoId) {
        const response = await fetch(
          `/horas/Estudiante/${identificacion}/${grupoId}`
        );
        if (response.ok) {
          const data = await response.json();
          setMaterias(data);
          setFilteredApprovedMaterias(
            data.filter((m) => m.EstadoHoras === "Aprobado")
          );
          setFilteredRejectedMaterias(
            data.filter((m) => m.EstadoHoras === "Rechazado")
          );
        } else {
          console.error("Error al obtener la lista de actividades");
          toast.error("Error al obtener la lista de actividades");
        }
      }
    } catch (error) {
      console.error("Error al obtener la lista de actividades:", error);
      toast.error("Error al obtener la lista de actividades");
    }
  };

  const handleDescripcionActividadFilterChange = (e) => {
    const value = e.target.value;
    setDescripcionActividadFilter(value);
    applyFilters(
      value,
      tipoFilter,
      fechaFilter,
      "Aprobado",
      setFilteredApprovedMaterias
    );
  };

  const handleTipoFilterChange = (e) => {
    const value = e.target.value;
    setTipoFilter(value);
    applyFilters(
      descripcionActividadFilter,
      value,
      fechaFilter,
      "Aprobado",
      setFilteredApprovedMaterias
    );
  };

  const handleFechaFilterChange = (e) => {
    const value = e.target.value;
    setFechaFilter(value);
    applyFilters(
      descripcionActividadFilter,
      tipoFilter,
      value,
      "Aprobado",
      setFilteredApprovedMaterias
    );
  };

  const handleDescripcionActividadFilterRejectedChange = (e) => {
    const value = e.target.value;
    setDescripcionActividadFilterRejected(value);
    applyFilters(
      value,
      tipoFilterRejected,
      fechaFilterRejected,
      "Rechazado",
      setFilteredRejectedMaterias
    );
  };

  const handleTipoFilterRejectedChange = (e) => {
    const value = e.target.value;
    setTipoFilterRejected(value);
    applyFilters(
      descripcionActividadFilterRejected,
      value,
      fechaFilterRejected,
      "Rechazado",
      setFilteredRejectedMaterias
    );
  };

  const handleFechaFilterRejectedChange = (e) => {
    const value = e.target.value;
    setFechaFilterRejected(value);
    applyFilters(
      descripcionActividadFilterRejected,
      tipoFilterRejected,
      value,
      "Rechazado",
      setFilteredRejectedMaterias
    );
  };

  const applyFilters = (
    DescripcionActividad,
    TipoCurso,
    Fecha,
    status,
    setFilteredMaterias
  ) => {
    let filtered = materias.filter((m) => m.EstadoHoras === status);

    if (DescripcionActividad) {
      filtered = filtered.filter((materia) =>
        materia.DescripcionActividad?.toLowerCase().includes(
          DescripcionActividad.toLowerCase()
        )
      );
    }

    if (TipoCurso) {
      filtered = filtered.filter(
        (materia) => materia.TipoActividad === TipoCurso
      );
    }

    if (Fecha) {
      filtered = filtered.filter((materia) => materia.Fecha.includes(Fecha));
    }

    setFilteredMaterias(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const indexOfLastMateria = currentPage * materiasPerPage;
  const indexOfFirstMateria = indexOfLastMateria - materiasPerPage;
  const currentApprovedMaterias = filteredApprovedMaterias.slice(
    indexOfFirstMateria,
    indexOfLastMateria
  );
  const currentRejectedMaterias = filteredRejectedMaterias.slice(
    indexOfFirstMateria,
    indexOfLastMateria
  );

  const handleNextPage = () => {
    if (
      currentPage <
        Math.ceil(filteredApprovedMaterias.length / materiasPerPage) ||
      currentPage < Math.ceil(filteredRejectedMaterias.length / materiasPerPage)
    ) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleViewDetails = () => {
    navigate("/ListaEstudiantes");
  };

  const handleEditClick = (bitacoraId) => {
    sessionStorage.setItem("BitacoraId", bitacoraId);
    window.location.href = "/RechazoHoras";
  };

  const handleEditClick2 = (bitacoraId) => {
    sessionStorage.setItem("BitacoraId", bitacoraId);
    window.location.href = "/CrearoActualizarHoras";
  };

  const handleButtonClick = () => {
    navigate("/CrearoActualizarHoras");
  };

  return (
    <div className="horasi-container">
      {/* */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
      <ToastContainer position="bottom-right" />
      {/* */}
      <main>
        {/* */}
        <div className="horasi-botton">
          {selectedRole === "Académico" && (
            <button className="add-horasiRegresar" onClick={handleViewDetails}>
              <FaChevronLeft className="icon-horasiRegresar" /> Regresar
            </button>
          )}
          {selectedRole === "Estudiante" && (
            <button className="add-horasi" onClick={handleButtonClick}>
              Agregar Actividades <IoMdAddCircle className="icon-horasi" />
            </button>
          )}
        </div>
        {/* */}
        {filteredApprovedMaterias.length === 0 &&
        filteredRejectedMaterias.length === 0 ? (
          <div className="no-data-message">
            Inserte actividades para verlas aquí
          </div>
        ) : (
          <>
            {/* */}
            <div className="container-tableapro">
              <h2 className="apro-titl">Actividades Aprobadas</h2>
              <hr className="apro-divider"></hr>
              {/* Filtros*/}
              <div className="filter-apro">
                {/* Fecha*/}
                <div className="filter-group-apro">
                  <label className="filter-label-apro">Fecha</label>
                  <input
                    className="filter-select-apro"
                    type="date"
                    value={fechaFilter}
                    onChange={handleFechaFilterChange}
                    placeholder="Buscar por fecha"
                  />
                </div>
                {/*  Descripcion actividades*/}
                <div className="filter-group-apro">
                  <label className="filter-label-apro">
                    Descripción de la Actividad
                  </label>
                  <input
                    className="filter-input-apro"
                    type="text"
                    value={descripcionActividadFilter}
                    onChange={handleDescripcionActividadFilterChange}
                    placeholder="Buscar por descripción"
                  />
                </div>
                {/*  Tipo de Actividad*/}
                <div className="filter-group-apro">
                  <label className="filter-label-apro">
                    Tipo de Actividad:
                  </label>
                  <select
                    className="filter-select-apro"
                    value={tipoFilter}
                    onChange={handleTipoFilterChange}
                  >
                    <option value="">Tipo de Actividad</option>
                    <option value="Planificacion">Planificación</option>
                    <option value="Ejecucion">Ejecución</option>
                    <option value="Gira">Gira</option>
                  </select>
                </div>
              </div>
              {/* */}
              {currentApprovedMaterias.length > 0 ? (
                <>
                  {/*Tabla */}
                  <table className="apro-table">
                    <thead className="apro-thead">
                      <tr>
                        <th>Fecha</th>
                        <th>Descripción de la Actividad</th>
                        <th>Tipo de Actividad</th>
                        <th>Hora de Inicio</th>
                        <th>Hora Final</th>
                        <th>Evidencia</th>
                        {selectedRole === "Académico" && <th>Acciones</th>}
                      </tr>
                    </thead>
                    <tbody className="apro-tbody">
                      {currentApprovedMaterias.map((materia) => (
                        <tr key={materia.BitacoraId}>
                          <td>{materia.Fecha}</td>
                          <td>{materia.DescripcionActividad}</td>
                          <td>{materia.TipoActividad}</td>
                          <td>{materia.HoraInicio}</td>
                          <td>{materia.HoraFinal}</td>
                          <td>
                            {materia.Evidencias
                              ? materia.Evidencias
                              : "No se presentó ninguna evidencia"}
                          </td>
                          {selectedRole === "Académico" && (
                            <td>
                              <button
                                className="icon-btn-acade"
                                onClick={() =>
                                  handleEditClick(materia.BitacoraId)
                                }
                              >
                                <FaEdit />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {/* La paginacion */}
                  <div className="pagination-apro">
                    <button
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </button>
                    <span>
                      Página {currentPage} de{" "}
                      {Math.ceil(
                        filteredApprovedMaterias.length / materiasPerPage
                      )}
                    </span>
                    <button
                      onClick={handleNextPage}
                      disabled={
                        currentPage ===
                        Math.ceil(
                          filteredApprovedMaterias.length / materiasPerPage
                        )
                      }
                    >
                      Siguiente
                    </button>
                  </div>
                </>
              ) : (
                <div className="no-data-message">
                  No hay actividades aprobadas que coincidan con los filtros.
                </div>
              )}
            </div>
            {/*Tabla de rechazo horas estudiante*/}

            <div className="container-tablerecha">
              <h2 className="apro-titl">Actividades Rechazadas</h2>
              <hr className="apro-divider"></hr>
              {/* Filtros*/}
              <div className="filter-apro">
                {/* Fecha*/}
                <div className="filter-group-apro">
                  <label className="filter-label-apro">Fecha</label>
                  <input
                    className="filter-select-apro"
                    type="date"
                    value={fechaFilterRejected}
                    onChange={handleFechaFilterRejectedChange}
                    placeholder="Buscar por fecha"
                  />
                </div>

                {/*  Descripcion actividades*/}
                <div className="filter-group-apro">
                  <label className="filter-label-apro">
                    Descripción de la Actividad
                  </label>
                  <input
                    className="filter-input-apro"
                    type="text"
                    value={descripcionActividadFilterRejected}
                    onChange={handleDescripcionActividadFilterRejectedChange}
                    placeholder="Buscar por descripción"
                  />
                </div>

                {/*  Tipo de Actividad*/}
                <div className="filter-group-apro">
                  <label className="filter-label-apro">
                    Tipo de Actividad:
                  </label>
                  <select
                    className="filter-select-acad"
                    value={tipoFilterRejected}
                    onChange={handleTipoFilterRejectedChange}
                  >
                    <option value="">Modalidad</option>
                    <option value="Planificacion">Planificación</option>
                    <option value="Ejecucion">Ejecución</option>
                    <option value="Gira">Gira</option>
                  </select>
                </div>
              </div>
              {/* */}
              {currentRejectedMaterias.length > 0 ? (
                <>
                  {/*Tabla */}
                  <table className="apro-table">
                    <thead className="apro-thead">
                      <tr>
                        <th>Fecha</th>
                        <th>Descripción de la Actividad</th>
                        <th>Tipo de Actividad</th>
                        <th>Comentarios de Rechazo</th>
                        {selectedRole === "Estudiante" && <th>Acciones</th>}
                      </tr>
                    </thead>
                    <tbody className="apro-tbody">
                      {currentRejectedMaterias.map((materia) => (
                        <tr key={materia.BitacoraId}>
                          <td>{materia.Fecha}</td>
                          <td>{materia.DescripcionActividad}</td>
                          <td>{materia.TipoActividad}</td>
                          <td>{materia.ComentariosRechazo}</td>
                          {selectedRole === "Estudiante" && (
                            <td>
                              <button
                                className="icon-btn-acade"
                                onClick={() =>
                                  handleEditClick2(materia.BitacoraId)
                                }
                              >
                                <FaEdit />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {/* La paginacion */}
                  <div className="pagination-apro">
                    <button
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </button>
                    <span>
                      Página {currentPage} de{" "}
                      {Math.ceil(
                        filteredRejectedMaterias.length / materiasPerPage
                      )}
                    </span>
                    <button
                      onClick={handleNextPage}
                      disabled={
                        currentPage ===
                        Math.ceil(
                          filteredRejectedMaterias.length / materiasPerPage
                        )
                      }
                    >
                      Siguiente
                    </button>
                  </div>
                </>
              ) : (
                <div className="no-data-message">
                  No hay actividades rechazadas que coincidan con los filtros.
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default VistaHorasEstudiante;
