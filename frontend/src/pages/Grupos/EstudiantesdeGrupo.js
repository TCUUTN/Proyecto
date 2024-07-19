import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaInfoCircle } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./EstudiantesGrupo.css";
import { FaChevronLeft } from "react-icons/fa6";

function ListaEstudiantes() {
  const navigate = useNavigate();
  const grupoId = localStorage.getItem("GrupoSeleccionado");
  const [estudiantes, setEstudiantes] = useState([]);
  const [filteredEstudiantes, setFilteredEstudiantes] = useState([]);
  const [nombreFilter, setNombreFilter] = useState("");
  const [identificacionFilter, setIdentificacionFilter] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("Todos");
  const [progresoFilter, setProgresoFilter] = useState("Todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false); // Estado de carga
  const estudiantesPerPage = 10;

  useEffect(() => {
    fetchEstudiantes();
  }, []);

  const fetchEstudiantes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/grupos/ListaEstudiantes/${grupoId}`);

      if (response.ok) {
        const data = await response.json();
        setEstudiantes(data);
        setFilteredEstudiantes(data);
      } else if (response.status === 404) {
        console.error("No se encontraron estudiantes para el grupo");
        toast.error("No se encontraron estudiantes para el grupo");
      } else {
        console.error("Error al obtener la lista de estudiantes");
        toast.error("Error al obtener la lista de estudiantes");
      }
    } catch (error) {
      console.error("Error al obtener la lista de estudiantes:", error);
      toast.error("Error al obtener la lista de estudiantes");
    } finally {
      setLoading(false);
    }
  };

  const handleNombreFilterChange = (e) => {
    const value = e.target.value;
    setNombreFilter(value);
    applyFilters(value, identificacionFilter, estadoFilter, progresoFilter);
  };

  const handleIdentificacionFilterChange = (e) => {
    const value = e.target.value;
    setIdentificacionFilter(value);
    applyFilters(nombreFilter, value, estadoFilter, progresoFilter);
  };

  const handleEstadoFilterChange = (e) => {
    const value = e.target.value;
    setEstadoFilter(value);
    applyFilters(nombreFilter, identificacionFilter, value, progresoFilter);
  };

  const handleProgresoFilterChange = (e) => {
    const value = e.target.value;
    setProgresoFilter(value);
    applyFilters(nombreFilter, identificacionFilter, estadoFilter, value);
  };

  const applyFilters = (nombre, identificacion, estado, progreso) => {
    let filtered = estudiantes;

    if (nombre) {
      filtered = filtered.filter((estudiante) =>
        `${estudiante.Usuario.Nombre} ${estudiante.Usuario.Apellido1} ${estudiante.Usuario.Apellido2}`
          .toLowerCase()
          .includes(nombre.toLowerCase())
      );
    }

    if (identificacion) {
      filtered = filtered.filter((estudiante) =>
        estudiante.Usuario.Identificacion.toLowerCase().includes(
          identificacion.toLowerCase()
        )
      );
    }

    if (estado !== "Todos") {
      filtered = filtered.filter((estudiante) => estudiante.Estado === estado);
    }

    if (progreso !== "Todos") {
      filtered = filtered.filter(
        (estudiante) => estudiante.Progreso === progreso
      );
    }

    setFilteredEstudiantes(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const indexOfLastEstudiante = currentPage * estudiantesPerPage;
  const indexOfFirstEstudiante = indexOfLastEstudiante - estudiantesPerPage;
  const currentEstudiantes = filteredEstudiantes.slice(
    indexOfFirstEstudiante,
    indexOfLastEstudiante
  );
  const totalPages = Math.ceil(filteredEstudiantes.length / estudiantesPerPage);

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

  const handleViewDetails = (identificacion, estado) => {
    localStorage.setItem("IdentificacionHoras", identificacion);
    localStorage.setItem("EstadoHoras", estado);
    navigate("/VistaHorasEstudiantes");
  };

  const handleFinalizarCuatrimestre = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/grupos/FinalizarCuatrimestre/${grupoId}`, {
        method: "POST",
      });

      if (response.ok) {
        toast.success(
          "El cuatrimestre ha cerrado correctamente y los estados de los estudiantes han sido ajustados de acuerdo a lo establecido por el reglamento de TCU."
        );
        fetchEstudiantes(); // Refresh the list
        setLoading(false);
      } else {
        toast.error("Error al finalizar el cuatrimestre", response);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error al finalizar el cuatrimestre:", error);
      toast.error("Error al finalizar el cuatrimestre");
      setLoading(false);
    }
  };

  const selectedRole = sessionStorage.getItem("SelectedRole");

  const handleBack = () => {
    localStorage.removeItem("GrupoSeleccionado");

    if (selectedRole === "Académico") {
      navigate("/GruposAcademico");
    } else {
      navigate("/Home");
    }
  };

  return (
    <div className="materia-container-est">
      {/*Para la carga */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
      <ToastContainer position="bottom-right" />
      {/* Filtros y botón */}
      <main>
      <div className="sliderlis-est">
    {/* Botón de regresar */}
    <div className="regred-action-listest">
      <button onClick={handleBack} className="back-button-listest">
        Regresar
      </button>
      <div className="estt-divider" />
      <h1 className="estt-titulo">Lista de Estudiantes</h1>
      <div className="estt-divider" />
      <div className="buttFinalizar">
        {selectedRole === "Académico" && (
          <button
            onClick={handleFinalizarCuatrimestre}
            className="finalizar-button-listest"
            disabled
          >
            Finalizar Cuatrimestre
          </button>
        )}
      </div>
    </div>
  </div>

        <div className="filters-est">
          {/* Filtros */}
          <div className="filter-group-est">
            <label className="filter-label-est" htmlFor="Nombre-Busqueda">
              Buscar por Nombre Completo
            </label>
            <input
              id="Nombre-Busqueda"
              type="text"
              placeholder="Nombre Completo"
              className="filter-input-est"
              value={nombreFilter}
              onChange={handleNombreFilterChange}
            />
          </div>

          <div className="filter-group-est">
            <label
              className="filter-label-est"
              htmlFor="Identificacion-Busqueda"
            >
              Buscar por Identificación
            </label>
            <input
              id="Identificacion-Busqueda"
              type="text"
              placeholder="Identificación"
              className="filter-input-est"
              value={identificacionFilter}
              onChange={handleIdentificacionFilterChange}
            />
          </div>

          <div className="filter-group-est">
            <label className="filter-label-est" htmlFor="Estado-Filtro">
              Filtrar por Estado
            </label>
            <select
              id="Estado-Filtro"
              className="filter-input-est"
              value={estadoFilter}
              onChange={handleEstadoFilterChange}
            >
              <option value="Todos">Todos</option>
              <option value="En Curso">En Curso</option>
              <option value="Aprobado">Aprobado</option>
              <option value="Reprobado">Reprobado</option>
            </select>
          </div>

          <div className="filter-group-est">
            <label className="filter-label-est" htmlFor="Progreso-Filtro">
              Filtrar por Progreso
            </label>
            <select
              id="Progreso-Filtro"
              className="filter-input-est"
              value={progresoFilter}
              onChange={handleProgresoFilterChange}
            >
              <option value="Todos">Todos</option>
              <option value="Nuevo">Nuevo</option>
              <option value="Continuidad">Continuidad</option>
              <option value="Prórroga">Prórroga</option>
            </select>
          </div>
        </div>

        {/* Tabla */}
        <div className="table-container-mat">
          <table className="mat-table">
            <thead className="mat-thead">
              <tr>
                <th>Nombre Completo</th>
                <th>Correo Electrónico</th>
                <th>Identificación</th>
                <th>Estado del Estudiante</th>
                <th>Progreso del Estudiante</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody className="mat-tbody">
              {currentEstudiantes.map((estudiante, index) => (
                <tr key={index}>
                  <td>{`${estudiante.Usuario.Nombre} ${estudiante.Usuario.Apellido1} ${estudiante.Usuario.Apellido2}`}</td>
                  <td>{estudiante.Usuario.CorreoElectronico}</td>
                  <td>{estudiante.Usuario.Identificacion}</td>
                  <td>{estudiante.Estado}</td>
                  <td>{estudiante.Progreso}</td>
                  <td>
                    {estudiante.Estado !== "Reprobado" ? (
                      <button
                        className="icon-btn-mat"
                        onClick={() =>
                          handleViewDetails(
                            estudiante.Usuario.Identificacion,
                            estudiante.Estado
                          )
                        }
                      >
                        <FaInfoCircle />
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* La paginación */}
          <div className="pagination-mat">
            <button onClick={handlePreviousPage}>Anterior</button>
            <span>
              Página {currentPage} de {totalPages}
            </span>
            <button onClick={handleNextPage}>Siguiente</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ListaEstudiantes;
