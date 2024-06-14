import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaInfoCircle } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";
import "./Materias.modulo.css";
import { FaChevronLeft } from "react-icons/fa6";

function ListaEstudiantes() {
  const navigate = useNavigate();
  const location = useLocation();
  const { grupoId } = location.state;
  console.log(grupoId);

  const [estudiantes, setEstudiantes] = useState([]);
  const [filteredEstudiantes, setFilteredEstudiantes] = useState([]);
  const [nombreFilter, setNombreFilter] = useState("");
  const [identificacionFilter, setIdentificacionFilter] = useState("");
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
    applyFilters(value, identificacionFilter);
  };

  const handleIdentificacionFilterChange = (e) => {
    const value = e.target.value;
    setIdentificacionFilter(value);
    applyFilters(nombreFilter, value);
  };

  const applyFilters = (nombre, identificacion) => {
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

  return (
    <div className="materia-container">
      {/*Para la carga */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
      <ToastContainer position="bottom-right" />
      {/**/}
      <main>
        {/* Filtros y boton */}
        <div className="filters-est">
          {/* Boton de regresar */}
          <div className="regred-action">
            <button onClick={() => navigate("/GruposAcademico")}
              className="back-button" >
              <FaChevronLeft />
              Regresar
            </button>
          </div>
          <hr className="estt-divider" />
             {/*Filtros*/}
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
        </div>

        {/* Tabla */}
        <div className="table-container-mat">
        <table className="mat-table">
          <thead className="mat-thead">
            <tr>
              <th>Nombre Completo</th>
              <th>Correo Electrónico</th>
              <th>Identificación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody className="mat-tbody">
            {currentEstudiantes.map((estudiante, index) => (
              <tr key={index}>
                <td>{`${estudiante.Usuario.Nombre} ${estudiante.Usuario.Apellido1} ${estudiante.Usuario.Apellido2}`}</td>
                <td>{estudiante.Usuario.CorreoElectronico}</td>
                <td>{estudiante.Usuario.Identificacion}</td>
                <td>
                  <button className="icon-btn-mat">
                    <FaInfoCircle />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* La paginacion */}
        <div className="pagination-mat">
          <button onClick={handlePreviousPage}>Anterior</button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <button onClick={handleNextPage}>Siguiente</button>
        </div>
        </div>
         {/**/}
      </main>
    </div>
  );
}

export default ListaEstudiantes;
