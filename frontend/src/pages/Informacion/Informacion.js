import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaInfoCircle } from "react-icons/fa";
import { FaListCheck } from "react-icons/fa6";
import { GrFormPreviousLink, GrFormNextLink } from "react-icons/gr";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Informacion.css"; // Usar la misma hoja de estilos de ListaEstudiantes

function VistaInformacion() {
  const navigate = useNavigate();
  const TipoInfoSeleccionado = localStorage.getItem("TipoInfoSeleccionado");
  const Sede = sessionStorage.getItem("Sede");
  const Identificacion = sessionStorage.getItem("Identificacion");
  const selectedRole = sessionStorage.getItem("SelectedRole");
  const [informacion, setInformacion] = useState([]);
  const [filteredInformacion, setFilteredInformacion] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [selectedGrupo, setSelectedGrupo] = useState("");
  const [fechaFilter, setFechaFilter] = useState("");
  const [descripcionFilter, setDescripcionFilter] = useState("");
  const [nombreArchivoFilter, setNombreArchivoFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const informacionPerPage = 10;

  useEffect(() => {
    if (
      TipoInfoSeleccionado === "General" ||
      TipoInfoSeleccionado === "Plantilla"
    ) {
      fetchInformacionPorSedeYTipo();
    } else if (TipoInfoSeleccionado === "Académico") {
      if (selectedRole === "Estudiante") {
        fetchInformacionPorGrupoId();
      } else if (selectedRole === "Académico") {
        fetchGruposPorAcademico();
      }
    }
  }, [selectedGrupo]);

  useEffect(() => {
    if (selectedGrupo !== "") {
      handletablaacademico(selectedGrupo);
    }
  }, [selectedGrupo]);

  const fetchInformacionPorSedeYTipo = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/informacion/getInformacionPorSedeyTipoInformacion`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({ TipoInformacion: TipoInfoSeleccionado, Sede }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setInformacion(data);
        setFilteredInformacion(data);
      } else {
        setInformacion([]);
        setFilteredInformacion([]);
      }
    } catch (error) {
      setInformacion([]);
      setFilteredInformacion([]);
      console.error("Error al obtener la información:", error);
      toast.error("Error al obtener la información");
    } finally {
      setLoading(false);
    }
  };

  const fetchInformacionPorGrupoId = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/informacion/getInformacionPorGrupoId`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          SelectedRole: selectedRole,
          GrupoId: localStorage.getItem("GrupoSeleccionado"),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setInformacion(data);
        setFilteredInformacion(data);
      } else {
        setInformacion([]);
        setFilteredInformacion([]);
      }
    } catch (error) {
      setInformacion([]);
      setFilteredInformacion([]);
      console.error("Error al obtener la información:", error);
      toast.error("Error al obtener la información");
    } finally {
      setLoading(false);
    }
  };

  const fetchGruposPorAcademico = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/grupos/Academicos/${Identificacion}`);

      if (response.ok) {
        const data = await response.json();
        setGrupos(data);
      } else {
        console.error("Error al obtener los grupos");
        toast.error("Error al obtener los grupos");
      }
    } catch (error) {
      console.error("Error al obtener los grupos:", error);
      toast.error("Error al obtener los grupos");
    } finally {
      setLoading(false);
    }
  };

  const handleFechaFilterChange = (e) => {
    const value = e.target.value;
    setFechaFilter(value);
    applyFilters(value, descripcionFilter, nombreArchivoFilter);
  };

  const handleDescripcionFilterChange = (e) => {
    const value = e.target.value;
    setDescripcionFilter(value);
    applyFilters(fechaFilter, value, nombreArchivoFilter);
  };

  const handleNombreArchivoFilterChange = (e) => {
    const value = e.target.value;
    setNombreArchivoFilter(value);
    applyFilters(fechaFilter, descripcionFilter, value);
  };

  const applyFilters = (fecha, descripcion, nombreArchivo) => {
    let filtered = informacion;

    if (fecha) {
      filtered = filtered.filter((info) =>
        info.Fecha.toLowerCase().includes(fecha.toLowerCase())
      );
    }

    if (descripcion) {
      filtered = filtered.filter((info) =>
        info.Descripcion.toLowerCase().includes(descripcion.toLowerCase())
      );
    }

    if (nombreArchivo) {
      filtered = filtered.filter((info) =>
        info.NombreArchivo.toLowerCase().includes(nombreArchivo.toLowerCase())
      );
    }

    setFilteredInformacion(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleFinalizarCuatrimestre = () => {
    // Logica para finalizar cuatrimestre
  };

  const indexOfLastInfo = currentPage * informacionPerPage;
  const indexOfFirstInfo = indexOfLastInfo - informacionPerPage;
  const currentInformacion = filteredInformacion.slice(
    indexOfFirstInfo,
    indexOfLastInfo
  );
  const totalPages = Math.ceil(filteredInformacion.length / informacionPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleViewDetails = (id) => {
    // Lógica para ver detalles de la información
  };

  const handletablaacademico = (grupoId) => {
    localStorage.setItem("GrupoSeleccionado", grupoId);
    fetchInformacionPorGrupoId();
  };

  const handleBack = () => {
    localStorage.removeItem("TipoInfoSeleccionado");

    navigate("/Home");
  };

  const getTitulo = (tipoInfo) => {
    switch (tipoInfo) {
      case "General":
        return "Información General";
      case "Académico":
        if (selectedRole === "Académico") {
          return "Información por grupo";
        } else {
          return "Información proporcionada por el Académico";
        }

      case "Plantilla":
        return "Plantillas del sistema";
      default:
        return "Vista de Información";
    }
  };

  const getButtonText = (tipoInfo) => {
    switch (tipoInfo) {
      case "General":
        return "Agregar Información General";
      case "Académico":
        return "Agregar Información al grupo";
      case "Plantilla":
        return "Agregar Plantilla";
      default:
        return "Agregar";
    }
  };

  return (
    <div className="container-info">
      {/*Para la carga */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
      <ToastContainer position="bottom-right" />
      {/* Filtros y botón */}
      <main>
        <div className="sliderlis-info">
          {/* Botón de regresar */}
          <div className="regred-action-listinfo">
            <button onClick={handleBack} className="back-button-listinfo">
              <FaChevronLeft />
              Regresar
            </button>
            <div className="info-divider-ver" />
            <h1 className="estt-titulo">{getTitulo(TipoInfoSeleccionado)}</h1>
            {(selectedRole === "Académico" ||
              selectedRole === "Administrativo") && (
              <>
                <div className="info-divider-ver" />
                <div className="buttFinalizar">
                  <button
                    onClick={handleFinalizarCuatrimestre}
                    className="finalizar-button-listinfo"
                    disabled
                  >
                    {getButtonText(TipoInfoSeleccionado)} <FaListCheck />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {selectedRole === "Académico" && (
          <>
            <div className="SelectorGrupo-info">
              <h3 className="tituleselect-Grupo">Seleccione un grupo:</h3>
              <div className="info-divider-hor" />
              <select
                className="info-select"
                onChange={(e) => setSelectedGrupo(e.target.value)}
                value={selectedGrupo || ""}
              >
                <option value="">Grupos a cargo</option>
                {grupos.map((grupo) => (
                  <option key={grupo.GrupoId} value={grupo.GrupoId}>
                    {`${grupo.Grupos_TipoGrupo.NombreProyecto} - ${grupo.NumeroGrupo}`}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        <div className="filters-info">
          {/* Filtros */}
          <div className="filter-group-info">
            <label className="filter-label-info" htmlFor="Fecha-Busqueda">
              Buscar por Fecha
            </label>
            <input
              id="Fecha-Busqueda"
              type="text"
              placeholder="Fecha"
              className="filter-input-info"
              value={fechaFilter}
              onChange={handleFechaFilterChange}
            />
          </div>

          <div className="filter-group-info">
            <label className="filter-label-info" htmlFor="Descripcion-Busqueda">
              Buscar por Descripción
            </label>
            <input
              id="Descripcion-Busqueda"
              type="text"
              placeholder="Descripción"
              className="filter-input-info"
              value={descripcionFilter}
              onChange={handleDescripcionFilterChange}
            />
          </div>

          <div className="filter-group-info">
            <label
              className="filter-label-info"
              htmlFor="NombreArchivo-Busqueda"
            >
              Buscar por Nombre de Archivo
            </label>
            <input
              id="NombreArchivo-Busqueda"
              type="text"
              placeholder="Nombre de Archivo"
              className="filter-input-info"
              value={nombreArchivoFilter}
              onChange={handleNombreArchivoFilterChange}
            />
          </div>
        </div>

        {/* Tabla */}
        <div className="table-container-mat">
          <table className="mat-table">
            <thead className="mat-thead">
              <tr>
                <th className="mat-th">Fecha</th>
                {TipoInfoSeleccionado !== "Plantilla" && (
                  <th className="mat-th">Descripción</th>
                )}
                <th className="mat-th">Nombre de Archivo</th>
                {TipoInfoSeleccionado !== "Plantilla" && (
                  <th className="mat-th">Acción</th>
                )}
              </tr>
            </thead>
            <tbody className="mat-tbody">
              {currentInformacion.length === 0 ? (
                <tr>
                  <td
                    colSpan={TipoInfoSeleccionado !== "Plantilla" ? "4" : "2"}
                  >
                    No se encontró información
                  </td>
                </tr>
              ) : (
                currentInformacion.map((info) => (
                  <tr key={info.Id}>
                    <td className="mat-td">{info.Fecha}</td>
                    {TipoInfoSeleccionado !== "Plantilla" && (
                      <td className="mat-td">{info.Descripcion}</td>
                    )}
                    <td className="mat-td">{info.NombreArchivo}</td>
                    {TipoInfoSeleccionado !== "Plantilla" && (
                      <td className="mat-td">
                        <OverlayTrigger
                          overlay={<Tooltip>Ver Detalles</Tooltip>}
                          placement="top"
                        >
                          <button
                            className="icon-btn-mat"
                            onClick={() => handleViewDetails(info.Id)}
                          >
                            <FaInfoCircle />
                          </button>
                        </OverlayTrigger>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Paginación */}
          <div className="pagination-mat">
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id="tooltip-edit">Anterior</Tooltip>}
            >
              <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                <GrFormPreviousLink />
              </button>
            </OverlayTrigger>

            <span className="pagination-info">
              {currentPage} de {totalPages}
            </span>
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id="tooltip-edit">Siguiente</Tooltip>}
            >
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <GrFormNextLink />
              </button>
            </OverlayTrigger>
          </div>
        </div>
      </main>
    </div>
  );
}

export default VistaInformacion;
