import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { GrFormPreviousLink, GrFormNextLink } from "react-icons/gr";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import "./VistaConclusionesGrupo.css";
import { FaChevronLeft } from "react-icons/fa6";
import { MdFindInPage } from "react-icons/md";

function VistaConclusionesGrupo() {
  const navigate = useNavigate();
  // Estados para manejar los datos y filtros
  const [conclusiones, setConclusiones] = useState([]); // Lista completa de conclusiones
  const [filteredConclusiones, setFilteredConclusiones] = useState([]); // Lista filtrada de conclusiones
  const [identificacionFilter, setIdentificacionFilter] = useState(""); // Filtro de identificación
  const [nombreFilter, setNombreFilter] = useState(""); // Filtro de nombre completo
  const [estadoFilter, setEstadoFilter] = useState(""); // Filtro de estado de la boleta
  const [currentPage, setCurrentPage] = useState(1); // Página actual para la paginación
  const conclusionesPerPage = 10; // Número de conclusiones por página
  // Datos del usuario y grupo almacenados en el almacenamiento local y de sesión
  const selectedRole = sessionStorage.getItem("SelectedRole"); // Rol del usuario
  const grupoId = localStorage.getItem("GrupoSeleccionado"); // ID del grupo seleccionado

  // Efecto para cargar las conclusiones cuando cambian el rol o el ID del grupo
  useEffect(() => {
    if (selectedRole && grupoId) {
      fetchConclusiones();
    }
  }, [selectedRole, grupoId]);

  // Función para obtener las conclusiones desde el servidor
  const fetchConclusiones = async () => {
    try {
      const url =
        selectedRole === "Académico"
          ? `/conclusiones/ConclusionesPorGrupo/${grupoId}`
          : `/conclusiones/ConclusionesAprobadas/${grupoId}`;

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        if (data.length === 0) {
          toast.info(
            "Este grupo aún no tiene estudiantes que hayan subido una boleta de conclusión"
          );
        } else {
          setConclusiones(data);
          setFilteredConclusiones(data);
        }
      } else {
        toast.error("Error al obtener las conclusiones");
      }
    } catch (error) {
      toast.error("Error al obtener las conclusiones");
    }
  };

  // Función para manejar el cambio en el filtro de identificación
  const handleIdentificacionFilterChange = (e) => {
    const value = e.target.value;
    setIdentificacionFilter(value);
    applyFilters(value, nombreFilter, estadoFilter);
  };

  // Función para manejar el cambio en el filtro de nombre
  const handleNombreFilterChange = (e) => {
    const value = e.target.value;
    setNombreFilter(value);
    applyFilters(identificacionFilter, value, estadoFilter);
  };

  // Función para manejar el cambio en el filtro de estado
  const handleEstadoFilterChange = (e) => {
    const value = e.target.value;
    setEstadoFilter(value);
    applyFilters(identificacionFilter, nombreFilter, value);
  };
  // Función para aplicar los filtros a la lista de conclusiones
  const applyFilters = (identificacion, nombre, estado) => {
    let filtered = conclusiones;

    if (identificacion) {
      filtered = filtered.filter((conclusion) =>
        conclusion.Identificacion.toLowerCase().includes(
          identificacion.toLowerCase()
        )
      );
    }

    if (nombre) {
      filtered = filtered.filter((conclusion) =>
        `${conclusion.Usuario.Nombre} ${conclusion.Usuario.Apellido1} ${conclusion.Usuario.Apellido2}`
          .toLowerCase()
          .includes(nombre.toLowerCase())
      );
    }

    if (selectedRole === "Académico" && estado) {
      filtered = filtered.filter(
        (conclusion) => conclusion.EstadoBoleta === estado
      );
    }

    setFilteredConclusiones(filtered);
    setCurrentPage(1); // Restablecer a la primera página al cambiar los filtros
  };

  // Cálculo de las conclusiones a mostrar en la página actual
  const indexOfLastConclusion = currentPage * conclusionesPerPage;
  const indexOfFirstConclusion = indexOfLastConclusion - conclusionesPerPage;
  const currentConclusiones = filteredConclusiones.slice(
    indexOfFirstConclusion,
    indexOfLastConclusion
  );
  // Función para ir a la siguiente página en la paginación
  const handleNextPage = () => {
    if (
      currentPage < Math.ceil(filteredConclusiones.length / conclusionesPerPage)
    ) {
      setCurrentPage(currentPage + 1);
    }
  };
  // Función para ir a la página anterior en la paginación
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  // Función para manejar el clic en el botón de editar
  const handleEditClick = (conclusionId) => {
    localStorage.setItem("ConclusionIdSeleccionado", conclusionId);
    navigate("/CrearActualizarConclusiones");
  };
  // Función para manejar el clic en el botón de regreso
  const handlebackClick = (conclusionId) => {
    localStorage.removeItem("GrupoSeleccionado");
    navigate("/GruposConclusiones");
  };

  return (
    <div className="vistconclgrup-container ">
      <ToastContainer position="bottom-right" />
      <main className="vistconclgrup-main">
        {conclusiones.length === 0 ? (
          <div className="vistconclgrup-no-data-message">
            Este grupo aún no tiene estudiantes que hayan subido una boleta de
            conclusión.
          </div>
        ) : (
          <>
            {/* boton de regreso y titulo*/}

            <div className="vistconclgrup-action">
              {/* Boton de regresar */}
              <div className="regred-vistconclgrup">
                <button
                  className="back-button-vistconclgrup"
                  onClick={handlebackClick}
                >
                  <FaChevronLeft />
                  Regresar
                </button>
                {/*linea*/}
                <div className="vistconclgrup-divider" />
                <h1 className="vistconclgrup-titulo"> Conclusión de Grupo</h1>
              </div>
            </div>

            <div className="vistconclgrup-filter">
              {/*Filtros*/}
              <div className="vistconclgrup-filter-group">
                <label
                  className="filter-label-vistconclgrup"
                  htmlFor="Identificacion-Busqueda"
                >
                  Buscar por Identificación
                </label>
                <input
                  type="text"
                  value={identificacionFilter}
                  onChange={handleIdentificacionFilterChange}
                  placeholder="Buscar por identificación"
                  className="vistconclgrup-filter-input"
                />
              </div>
              <div className="vistconclgrup-filter-group">
                <label className="filter-label-vistconclgrup">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={nombreFilter}
                  onChange={handleNombreFilterChange}
                  placeholder="Buscar por nombre completo"
                  className="vistconclgrup-filter-input"
                />
              </div>
              {selectedRole === "Académico" && (
                <div className="vistconclgrup-filter-group">
                  <label className="filter-label-vistconclgrup">
                    Estado de la Boleta
                  </label>
                  <select
                    value={estadoFilter}
                    onChange={handleEstadoFilterChange}
                    className="vistconclgrup-filter-select"
                  >
                    <option value="">Todos</option>
                    <option value="En Proceso">En Proceso</option>
                    <option value="Aprobado">Aprobado</option>
                    <option value="Rechazado">Rechazado</option>
                  </select>
                </div>
              )}
            </div>

            {/* Tabla */}
            <div className="table-container-mat">
              <table className="mat-table">
                <thead className="mat-thead">
                  <tr>
                    <th>Identificación</th>
                    <th>Nombre Completo</th>
                    {selectedRole === "Académico" && (
                      <th>Estado de la Boleta</th>
                    )}
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody className="mat-tbody">
                  {currentConclusiones.map((conclusion) => (
                    <tr key={conclusion.ConclusionId}>
                      <td>{conclusion.Identificacion}</td>
                      <td>{`${conclusion.Usuario.Nombre} ${conclusion.Usuario.Apellido1} ${conclusion.Usuario.Apellido2}`}</td>
                      {selectedRole === "Académico" && (
                        <td>{conclusion.EstadoBoleta}</td>
                      )}
                      <td>
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip id="tooltip-edit">
                              Ver boleta de conclusión
                            </Tooltip>
                          }
                        >
                          <button
                            className="icon-btn-mat"
                            onClick={() =>
                              handleEditClick(conclusion.ConclusionId)
                            }
                          >
                            <MdFindInPage />
                          </button>
                        </OverlayTrigger>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="pagination-mat">
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id="tooltip-edit">Anterior</Tooltip>}
                >
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                  >
                    <GrFormPreviousLink />
                  </button>
                </OverlayTrigger>
                <span>
                  {currentPage} de{" "}
                  {Math.ceil(filteredConclusiones.length / conclusionesPerPage)}
                </span>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id="tooltip-edit">Siguiente</Tooltip>}
                >
                  <button
                    onClick={handleNextPage}
                    disabled={
                      currentPage ===
                      Math.ceil(
                        filteredConclusiones.length / conclusionesPerPage
                      )
                    }
                  >
                    <GrFormNextLink />
                  </button>
                </OverlayTrigger>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default VistaConclusionesGrupo;
