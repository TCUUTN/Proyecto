/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import { FaChevronLeft} from "react-icons/fa";
import { MdOutlinePostAdd } from "react-icons/md";
import { GrFormPreviousLink, GrFormNextLink } from "react-icons/gr";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Informacion.css"; // Usar la misma hoja de estilos de ListaEstudiantes

function VistaInformacion() {
  const navigate = useNavigate();
  const TipoInfoSeleccionado = localStorage.getItem("TipoInfoSeleccionado");
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
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

// Hook que se ejecuta al montar el componente o cambiar el grupo seleccionado.
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

  // Hook que se ejecuta al cambiar el grupo seleccionado para actualizar la tabla.
  useEffect(() => {
    if (selectedGrupo !== "") {
      handletablaacademico(selectedGrupo);
    }
  }, [selectedGrupo]);
 // Función para obtener la información por sede y tipo de información.
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
      toast.error("Error al obtener la información: ",error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

  }, []);
 // Función para obtener la información por ID de grupo.
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
          GrupoId: sessionStorage.getItem("GrupoId"),
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
      toast.error("Error al obtener la información: ",error);
    } finally {
      setLoading(false);
    }
  };
// Función para obtener los grupos por académico.
  const fetchGruposPorAcademico = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/grupos/Academicos/${Identificacion}`);

      if (response.ok) {
        const data = await response.json();
        setGrupos(data);
      } else {
        toast.error("Error al obtener los grupos");
      }
    } catch (error) {
      toast.error("Error al obtener los grupos");
    } finally {
      setLoading(false);
    }
  };
  // Función para manejar el cambio en el filtro de fecha.
  const handleFechaFilterChange = (e) => {
    const value = e.target.value;
    setFechaFilter(value);
    applyFilters(value, descripcionFilter, nombreArchivoFilter);
  };
  // Función para manejar el cambio en el filtro de descripción.
  const handleDescripcionFilterChange = (e) => {
    const value = e.target.value;
    setDescripcionFilter(value);
    applyFilters(fechaFilter, value, nombreArchivoFilter);
  };
  // Función para manejar el cambio en el filtro de nombre de archivo.
  const handleNombreArchivoFilterChange = (e) => {
    const value = e.target.value;
    setNombreArchivoFilter(value);
    applyFilters(fechaFilter, descripcionFilter, value);
  };
 // Función para aplicar los filtros a la información.
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

  
  // Calcular la información actual a mostrar en la página.
  const indexOfLastInfo = currentPage * informacionPerPage;
  const indexOfFirstInfo = indexOfLastInfo - informacionPerPage;
  const currentInformacion = filteredInformacion.slice(
    indexOfFirstInfo,
    indexOfLastInfo
  );
  const totalPages = Math.ceil(filteredInformacion.length / informacionPerPage);
  // Función para manejar la página siguiente.
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  // Función para manejar la página anterior.
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Función para manejar la tabla académico.
  const handletablaacademico = (grupoId) => {
    sessionStorage.setItem("GrupoId", grupoId);
    fetchInformacionPorGrupoId();
  };
  // Función para manejar el regreso a la página de inicio.
  const handleBack = () => {
    localStorage.removeItem("TipoInfoSeleccionado");

    navigate("/Home");
  };
 // Función para manejar la navegación a la página de registro de información.
  const handleAgregar = () => {
    navigate("/RegistroInformacion");
  };
 // Función para manejar la edición de una información específica.
  const handleEditar = (InformacionId) => {
    sessionStorage.setItem("InformacionId",InformacionId);
    navigate("/RegistroInformacion");
  };
  // Función para manejar la descarga de un archivo.
  const handleDescargaArchivo = async (InformacionId) => {
    try {
      const response = await fetch(`/informacion/descargarAdjunto/${InformacionId}`);
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
            fetch(`/informacion/eliminarAdjunto/${fileName}`, {
              method: "DELETE",
            });
          }, 100); // 100 milisegundos de retraso para asegurar que la descarga haya comenzado
        } else {
          toast.error("Fallo al descargar el archivo");
        }
      } else {
        toast.error("Fallo al extraer imagen");
      }
    } catch (error) {
      toast.error("Error al manejar la descarga del archivo:", error);
    }
  };
// Función para obtener el título basado en el tipo de información.
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

// Función para obtener el texto del botón basado en el tipo de información.
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

   // Función para validar si se debe habilitar el botón de agregar.
  const validacionAgregar = () => {
    switch (selectedRole) {
      case "Estudiante":
        return false;
      case "Académico":
        if (TipoInfoSeleccionado==="Académico") {
          return true
        } else {
          return false
        }
      case "Administrativo":
        if (TipoInfoSeleccionado!=="Académico") {
          return true
        } else {
          return false
        }
      default:
        return false;
    }
  };

  const validacionAgregar2 = () => {
    switch (selectedRole) {
      case "Estudiante":
        return false;
      case "Académico":
        if (TipoInfoSeleccionado==="Académico") {
          return true
        } else {
          return false
        }
      case "Administrativo":
        if (TipoInfoSeleccionado==="General") {
          return true
        } else {
          return false
        }
      default:
        return false;
    }
  };

   // Función para formatear la fecha en formato dd/mm/yyyy.
  const formatDate = (date) => {
    const [yyyy, mm, dd] = date.split("-");
    return `${dd}/${mm}/${yyyy}`;
  };

// Hook que se ejecuta para verificar las condiciones para habilitar el botón.
  useEffect(() => {
    // Verificar las condiciones para habilitar el botón
    if (TipoInfoSeleccionado !== 'Académico' || (selectedGrupo && TipoInfoSeleccionado === 'Académico')) {
      setIsButtonEnabled(true);
    } else {
      setIsButtonEnabled(false);
    }
  }, [selectedGrupo, TipoInfoSeleccionado]);
// Retorno del componente, renderizando la vista de información.
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
            {(validacionAgregar()) && (
              <>
                <div className="info-divider-ver" />
                <div className="buttFinalizar">
                  <button
                    onClick={handleAgregar}
                    className="finalizar-button-listinfo"
                    disabled={!isButtonEnabled}
                  >
                    {getButtonText(TipoInfoSeleccionado)} <MdOutlinePostAdd />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {selectedRole === "Académico" && TipoInfoSeleccionado==="Académico"&& (
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
              type="date"
              placeholder="Fecha"
              className="filter-input-info"
              value={fechaFilter}
              onChange={handleFechaFilterChange}
            />
          </div>
          {TipoInfoSeleccionado !== "Plantilla" && (
          <>
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
            </>
          )}
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
                <th className="mat-th">Archivo Adjuntado</th>
                {validacionAgregar2() && (
                  <th className="mat-th"></th>
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
                  <tr key={info.InformacionId}>
                    <td className="mat-td">{formatDate(info.Fecha)}</td>
                    {TipoInfoSeleccionado !== "Plantilla" && (
                      <td className="mat-td">{info.Descripcion}</td>
                    )}
                    <td className="mat-td">
                    {info.NombreArchivo &&
                            info.NombreArchivo !== "-" ? (
                              <button
                                className="btn-link"
                                onClick={() =>
                                  handleDescargaArchivo(
                                    info.InformacionId
                                  )
                                }
                              >
                                {info.NombreArchivo}
                              </button>
                            ) : (
                              "No hay Archivo Adjunto"
                            )}



                    </td>
                    {validacionAgregar2() && (
                      <td className="mat-td">
                        <OverlayTrigger
                          overlay={<Tooltip>Editar Información</Tooltip>}
                          placement="top"
                        >
                          <button
                            className="icon-btn-mat"
                            onClick={() => handleEditar(info.InformacionId)}
                          >
                          <MdEdit />
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
