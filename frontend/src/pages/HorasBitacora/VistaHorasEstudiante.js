import React, { useState, useEffect } from "react";
import {
  FaEdit,
} from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa6";
import { IoMdAddCircle } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./VistaHorasEstudiante.module.CSS";

function VistaHorasEstudiante() {
    const navigate = useNavigate();
  const [materias, setMaterias] = useState([]);
  const [filteredApprovedMaterias, setFilteredApprovedMaterias] = useState([]);
  const [filteredRejectedMaterias, setFilteredRejectedMaterias] = useState([]);
  const [descripcionActividadFilter, setDescripcionActividadFilter] = useState("");
  const [tipoFilter, setTipoFilter] = useState("");
  const [descripcionActividadFilterRejected, setDescripcionActividadFilterRejected] = useState("");
  const [tipoFilterRejected, setTipoFilterRejected] = useState("");
  const [fechaFilter, setFechaFilter] = useState("");
  const [fechaFilterRejected, setFechaFilterRejected] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const materiasPerPage = 10;

  const identificacion = localStorage.getItem("IdentificacionHoras");
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
          setFilteredApprovedMaterias(data.filter(m => m.EstadoHoras === "Aprobado"));
          setFilteredRejectedMaterias(data.filter(m => m.EstadoHoras === "Rechazado"));
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
    applyFilters(value, tipoFilter, fechaFilter, "Aprobado", setFilteredApprovedMaterias);
  };

  const handleTipoFilterChange = (e) => {
    const value = e.target.value;
    setTipoFilter(value);
    applyFilters(descripcionActividadFilter, value, fechaFilter, "Aprobado", setFilteredApprovedMaterias);
  };

  const handleFechaFilterChange = (e) => {
    const value = e.target.value;
    setFechaFilter(value);
    applyFilters(descripcionActividadFilter, tipoFilter, value, "Aprobado", setFilteredApprovedMaterias);
  };

  const handleDescripcionActividadFilterRejectedChange = (e) => {
    const value = e.target.value;
    setDescripcionActividadFilterRejected(value);
    applyFilters(value, tipoFilterRejected, fechaFilterRejected, "Rechazado", setFilteredRejectedMaterias);
  };

  const handleTipoFilterRejectedChange = (e) => {
    const value = e.target.value;
    setTipoFilterRejected(value);
    applyFilters(descripcionActividadFilterRejected, value, fechaFilterRejected, "Rechazado", setFilteredRejectedMaterias);
  };

  const handleFechaFilterRejectedChange = (e) => {
    const value = e.target.value;
    setFechaFilterRejected(value);
    applyFilters(descripcionActividadFilterRejected, tipoFilterRejected, value, "Rechazado", setFilteredRejectedMaterias);
  };

  const applyFilters = (DescripcionActividad, TipoCurso, Fecha, status, setFilteredMaterias) => {
    let filtered = materias.filter(m => m.EstadoHoras === status);

    if (DescripcionActividad) {
      filtered = filtered.filter((materia) =>
        materia.DescripcionActividad?.toLowerCase().includes(DescripcionActividad.toLowerCase())
      );
    }

    if (TipoCurso) {
      filtered = filtered.filter((materia) => materia.TipoActividad === TipoCurso);
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
    if (currentPage < Math.ceil(filteredApprovedMaterias.length / materiasPerPage) || 
        currentPage < Math.ceil(filteredRejectedMaterias.length / materiasPerPage)) {
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
    navigate('/CrearoActualizarHoras');
};

  return (
    <div className="materia-container">
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
      <ToastContainer position="bottom-right" />
      <main>
        <div className="sidebar-mater">
        {selectedRole === "Académico" && 
            <button className="add-mater" onClick={() => handleViewDetails()}>
              <FaChevronLeft className="icon-addMater"/> Regresar
            </button>}
            {selectedRole === "Estudiante" && 
            <button className="add-mater" onClick={handleButtonClick}>
            Agregar Actividades <IoMdAddCircle className="icon-addMater" />
        </button>}
        </div>

        {filteredApprovedMaterias.length === 0 && filteredRejectedMaterias.length === 0 ? (
          <div className="no-data-message">
            Inserte actividades para verlas aquí
          </div>
        ) : (
          <>
            <div className="table-container-mat">
              <h2>Actividades Aprobadas</h2>
              <div className="filter-group">
                <label>
                  <span>Fecha:</span>
                  <input
                  className="filter-select-acad"
                    type="date"
                    value={fechaFilter}
                    onChange={handleFechaFilterChange}
                    placeholder="Buscar por fecha"
                  />
                </label>
                <label>
                  <span>Descripción de la Actividad:</span>
                  <input
                    type="text"
                    value={descripcionActividadFilter}
                    onChange={handleDescripcionActividadFilterChange}
                    placeholder="Buscar por descripción"
                  />
                </label>
                <label>
                  <span>Tipo de Actividad:</span>
                  <select
                    className="filter-select-acad"
                    value={tipoFilter}
                    onChange={handleTipoFilterChange}
                  >
                    <option value="">Modalidad</option>
                    <option value="Planificacion">Planificación</option>
                    <option value="Ejecucion">Ejecución</option>
                    <option value="Gira">Gira</option>
                  </select>
                </label>
              </div>
              {currentApprovedMaterias.length > 0 ? (
                <>
                  <table className="mat-table">
                    <thead className="mat-thead">
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
                    <tbody className="mat-tbody">
                      {currentApprovedMaterias.map((materia) => (
                        <tr key={materia.BitacoraId}>
                          <td>{materia.Fecha}</td>
                          <td>{materia.DescripcionActividad}</td>
                          <td>{materia.TipoActividad}</td>
                          <td>{materia.HoraInicio}</td>
                          <td>{materia.HoraFinal}</td>
                          <td>{materia.Evidencias ? materia.Evidencias : "No se presentó ninguna evidencia"}</td>
                          {selectedRole === "Académico" && (
                            <td>
                              <button className="icon-btn-mat" onClick={() => handleEditClick(materia.BitacoraId)}>
                                <FaEdit />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="pagination-mat">
                    <button
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </button>
                    <span>
                      Página {currentPage} de{" "}
                      {Math.ceil(filteredApprovedMaterias.length / materiasPerPage)}
                    </span>
                    <button
                      onClick={handleNextPage}
                      disabled={
                        currentPage ===
                        Math.ceil(filteredApprovedMaterias.length / materiasPerPage)
                      }
                    >
                      Siguiente
                    </button>
                  </div>
                </>
              ) : (
                <div className="no-data-message">No hay actividades aprobadas que coincidan con los filtros.</div>
              )}
            </div>

            <div className="table-container-mat">
              <h2>Actividades Rechazadas</h2>
              <div className="filter-group">
                <label>
                  <span>Fecha:</span>
                  <input
                  className="filter-select-acad"
                    type="date"
                    value={fechaFilterRejected}
                    onChange={handleFechaFilterRejectedChange}
                    placeholder="Buscar por fecha"
                  />
                </label>
                <label>
                  <span>Descripción de la Actividad:</span>
                  <input
                    type="text"
                    value={descripcionActividadFilterRejected}
                    onChange={handleDescripcionActividadFilterRejectedChange}
                    placeholder="Buscar por descripción"
                  />
                </label>
                <label>
                  <span>Tipo de Actividad:</span>
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
                </label>
              </div>
              {currentRejectedMaterias.length > 0 ? (
                <>
                  <table className="mat-table">
                    <thead className="mat-thead">
                      <tr>
                        <th>Fecha</th>
                        <th>Descripción de la Actividad</th>
                        <th>Tipo de Actividad</th>
                        <th>Comentarios de Rechazo</th>
                        {selectedRole === "Estudiante" && <th>Acciones</th>}
                      </tr>
                    </thead>
                    <tbody className="mat-tbody">
                      {currentRejectedMaterias.map((materia) => (
                        <tr key={materia.BitacoraId}>
                          <td>{materia.Fecha}</td>
                          <td>{materia.DescripcionActividad}</td>
                          <td>{materia.TipoActividad}</td>
                          <td>{materia.ComentariosRechazo}</td>
                          {selectedRole === "Estudiante" && (
                            <td>
                              <button className="icon-btn-mat" onClick={() => handleEditClick2(materia.BitacoraId)}>
                                <FaEdit />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="pagination-mat">
                    <button
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </button>
                    <span>
                      Página {currentPage} de{" "}
                      {Math.ceil(filteredRejectedMaterias.length / materiasPerPage)}
                    </span>
                    <button
                      onClick={handleNextPage}
                      disabled={
                        currentPage ===
                        Math.ceil(filteredRejectedMaterias.length / materiasPerPage)
                      }
                    >
                      Siguiente
                    </button>
                  </div>
                </>
              ) : (
                <div className="no-data-message">No hay actividades rechazadas que coincidan con los filtros.</div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default VistaHorasEstudiante;
