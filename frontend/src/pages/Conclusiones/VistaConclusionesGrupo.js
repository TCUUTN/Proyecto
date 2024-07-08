import React, { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./VistaConclusionesGrupo.css";
import { FaChevronLeft } from "react-icons/fa6";

function VistaConclusionesGrupo() {
  const navigate = useNavigate();
  const [conclusiones, setConclusiones] = useState([]);
  const [filteredConclusiones, setFilteredConclusiones] = useState([]);
  const [identificacionFilter, setIdentificacionFilter] = useState("");
  const [nombreFilter, setNombreFilter] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const conclusionesPerPage = 10;
  const selectedRole = sessionStorage.getItem("SelectedRole");
  const grupoId = localStorage.getItem("GrupoSeleccionado");

  useEffect(() => {
    if (selectedRole && grupoId) {
      fetchConclusiones();
    }
  }, [selectedRole, grupoId]);

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

  const handleIdentificacionFilterChange = (e) => {
    const value = e.target.value;
    setIdentificacionFilter(value);
    applyFilters(value, nombreFilter, estadoFilter);
  };

  const handleNombreFilterChange = (e) => {
    const value = e.target.value;
    setNombreFilter(value);
    applyFilters(identificacionFilter, value, estadoFilter);
  };

  const handleEstadoFilterChange = (e) => {
    const value = e.target.value;
    setEstadoFilter(value);
    applyFilters(identificacionFilter, nombreFilter, value);
  };

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
    setCurrentPage(1); // Reset to first page on filter change
  };

  const indexOfLastConclusion = currentPage * conclusionesPerPage;
  const indexOfFirstConclusion = indexOfLastConclusion - conclusionesPerPage;
  const currentConclusiones = filteredConclusiones.slice(
    indexOfFirstConclusion,
    indexOfLastConclusion
  );

  const handleNextPage = () => {
    if (
      currentPage < Math.ceil(filteredConclusiones.length / conclusionesPerPage)
    ) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleEditClick = (conclusionId) => {
    localStorage.setItem("ConclusionIdSeleccionado", conclusionId);
    navigate("/CrearActualizarConclusiones");
  };

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
      {/* Filtros y boton de regreso*/}

            <div className="vistconclgrup-filter">
              {/* Boton de regresar */}
              <div className="regred-vistconclgrup">
                <button className="back-button-vistconclgrup" onClick={handlebackClick}>
                  <FaChevronLeft />
                  Regresar
                </button>
              </div>
              {/*linea*/}
              <div className="vistconclgrup-divider" />
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
                <label className="filter-label-vistconclgrup">Nombre Completo</label>
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
                        
                        <button
                          className="icon-btn-mat"
                          onClick={() =>
                            handleEditClick(conclusion.ConclusionId)
                          }
                        >
                          <FaEdit />
                        </button>
                      </td>
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
                  {Math.ceil(filteredConclusiones.length / conclusionesPerPage)}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={
                    currentPage ===
                    Math.ceil(filteredConclusiones.length / conclusionesPerPage)
                  }
                >
                  Siguiente
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default VistaConclusionesGrupo;
