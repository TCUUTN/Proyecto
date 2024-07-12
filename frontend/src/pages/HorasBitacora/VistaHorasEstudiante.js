import React, { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa6";
import { IoMdAddCircle } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { BiSolidCommentCheck } from "react-icons/bi";
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
  const estado = localStorage.getItem("EstadoHoras");
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
      }
    } catch (error) {
      toast.error("Error al obtener el GrupoId");
    }
  };

  const handleDescargaArchivo = async (BitacoraId) => {
    try {
      const response = await fetch(`/horas/descargarAdjunto/${BitacoraId}`);
      if (response.ok) {
        const data = await response.json();
        const fileName = encodeURIComponent(data);

        // Obtener el contenido del archivo
        const fileResponse = await fetch(`/${fileName}`);
        if (fileResponse.ok) {
          const blob = await fileResponse.blob();
          const url = window.URL.createObjectURL(blob);

          // Crear un enlace temporal para la descarga del archivo
          const a = document.createElement("a");
          a.href = url;
          a.download = data;

          // Agregar el enlace al DOM y hacer clic en él
          document.body.appendChild(a);
          a.click();

          // Eliminar el enlace del DOM y revocar el objeto URL
          setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            // Solicitar la eliminación del archivo del servidor
            fetch(`/horas/eliminarAdjunto/${fileName}`, {
              method: "DELETE",
            });
          }, 100); // 100 milisegundos de retraso para asegurar que la descarga haya comenzado
        } else {
          console.log("Fallo al descargar el archivo");
        }
      } else {
        console.log("Fallo al extraer imagen");
      }
    } catch (error) {
      console.error("Error al manejar la descarga del archivo:", error);
    }
  };

  // Función para obtener las horas del estudiante
  const fetchHoras = async () => {
    try {
      const grupoId = await fetchGrupoId(identificacion);
      if (grupoId) {
        const response = await fetch(
          `/horas/Estudiante/${identificacion}/${grupoId}`
        );
        if (response.ok) {
          const data = await response.json();

          // Ordenar las materias de manera que las más recientes aparezcan primero
          data.sort((a, b) => new Date(b.Fecha) - new Date(a.Fecha));

          setMaterias(data);
          setFilteredApprovedMaterias(
            data.filter((m) => m.EstadoHoras === "Aprobado")
          );
          setFilteredRejectedMaterias(
            data.filter((m) => m.EstadoHoras === "Rechazado")
          );
        } else {
          toast.error("Error al obtener la lista de actividades");
        }
      }
    } catch (error) {
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
    localStorage.removeItem("EstadoHoras");
    localStorage.removeItem("IdentificacionHoras");
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
          {(selectedRole === "Académico"||selectedRole === "Administrativo") && (
            <button className="add-horasiRegresar" onClick={handleViewDetails}>
              <FaChevronLeft className="icon-horasiRegresar" /> Regresar
            </button>
          )}
          {selectedRole === "Estudiante" && estado !== "Aprobado" && (
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
              <div className="apro-divider"></div>
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
                        {selectedRole === "Académico" &&
                          estado !== "Aprobado" && <th>Rechazar Horas</th>}
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
                            {materia.NombreEvidencia &&
                            materia.NombreEvidencia !== "-" ? (
                              <button
                                className="btn-link"
                                onClick={() =>
                                  handleDescargaArchivo(
                                    materia.BitacoraId,
                                    materia.NombreEvidencia
                                  )
                                }
                              >
                                {materia.NombreEvidencia}
                              </button>
                            ) : (
                              "No se presentó ninguna evidencia"
                            )}
                          </td>
                          {selectedRole === "Académico" &&
                            estado !== "Aprobado" && (
                              <td>
                                <button
                                  className="icon-btn-acade"
                                  onClick={() =>
                                    handleEditClick(materia.BitacoraId)
                                  }
                                >
                                  <BiSolidCommentCheck />
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
              <div className="apro-divider"></div>
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
                    className="filter-select-apro"
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
                        {selectedRole === "Estudiante" &&
                          estado !== "Aprobado" && <th>Modificar</th>}
                      </tr>
                    </thead>
                    <tbody className="apro-tbody">
                      {currentRejectedMaterias.map((materia) => (
                        <tr key={materia.BitacoraId}>
                          <td>{materia.Fecha}</td>
                          <td>{materia.DescripcionActividad}</td>
                          <td>{materia.TipoActividad}</td>
                          <td>{materia.ComentariosRechazo}</td>
                          {selectedRole === "Estudiante" &&
                            estado !== "Aprobado" && (
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
