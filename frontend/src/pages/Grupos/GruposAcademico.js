/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GrFormPreviousLink, GrFormNextLink } from "react-icons/gr";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./GruposAcademico.css";

function GruposAcademico() {
  const navigate = useNavigate(); // Hook para navegación
  const [grupos, setGrupos] = useState([]); // Estado para almacenar todos los grupos
  const [filteredGrupos, setFilteredGrupos] = useState([]); // Estado para almacenar los grupos filtrados
  const [codigoMateriaFilter, setCodigoMateriaFilter] = useState(""); // Filtro de código de materia
  const [nombreProyectoFilter, setNombreProyectoFilter] = useState(""); // Filtro de nombre de proyecto
  const [cuatrimestreFilter, setCuatrimestreFilter] = useState(""); // Filtro de cuatrimestre
  const [annoFilter, setAnnoFilter] = useState(""); // Filtro de año
  const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual de la paginación
  const [loading, setLoading] = useState(false); // Estado de carga
  const gruposPerPage = 4; // Número de grupos por página
  const [uniqueYears, setUniqueYears] = useState([]); // Estado para almacenar los años únicos en los grupos
  const sedeFilter = sessionStorage.getItem("Sede") || "Todas"; // Filtro de sede
  const identificacion = sessionStorage.getItem("Identificacion"); // Identificación del académico

  useEffect(() => {
    fetchGrupos(); // Llama a la función para obtener los grupos al cargar el componente
  }, []);

  // Función para obtener la lista de grupos del académico
  const fetchGrupos = async () => {
    try {
      const response = await fetch(`/grupos/Academicos/${identificacion}`);

      if (response.ok) {
        const data = await response.json();
        const filteredData =
          sedeFilter === "Todas"
            ? data
            : data.filter((grupo) => grupo.Sede === sedeFilter);

        setGrupos(filteredData);
        setFilteredGrupos(filteredData);
        const years = [...new Set(filteredData.map((grupo) => grupo.Anno))];
        setUniqueYears(years.sort((a, b) => a - b));
      } else if (response.status === 404) {
        toast.error("El Académico no tiene grupos a cargo");
      } else {
        toast.error("Error al obtener la lista de grupos");
      }
    } catch (error) {
      toast.error("Error al obtener la lista de grupos: ", error);
    }
  };
  // Función para manejar el cambio en el filtro de código de materia
  const handleCodigoMateriaFilterChange = (e) => {
    const value = e.target.value;
    setCodigoMateriaFilter(value);
    applyFilters(value, nombreProyectoFilter, cuatrimestreFilter, annoFilter);
  };
  // Función para manejar el cambio en el filtro de nombre de proyecto
  const handleNombreProyectoFilterChange = (e) => {
    const value = e.target.value;
    setNombreProyectoFilter(value);
    applyFilters(codigoMateriaFilter, value, cuatrimestreFilter, annoFilter);
  };
  // Función para manejar el cambio en el filtro de cuatrimestre
  const handleCuatrimestreFilterChange = (e) => {
    const value = e.target.value;
    setCuatrimestreFilter(value);
    applyFilters(codigoMateriaFilter, nombreProyectoFilter, value, annoFilter);
  };
  // Función para manejar el cambio en el filtro de año
  const handleAnnoFilterChange = (e) => {
    const value = e.target.value;
    setAnnoFilter(value);
    applyFilters(
      codigoMateriaFilter,
      nombreProyectoFilter,
      cuatrimestreFilter,
      value
    );
  };
  // Función para aplicar los filtros a la lista de grupos
  const applyFilters = (codigoMateria, nombreProyecto, cuatrimestre, anno) => {
    let filtered = grupos;

    if (codigoMateria) {
      filtered = filtered.filter((grupo) =>
        grupo.CodigoMateria.toLowerCase().includes(codigoMateria.toLowerCase())
      );
    }

    if (nombreProyecto) {
      filtered = filtered.filter((grupo) =>
        grupo.Grupos_TipoGrupo.NombreProyecto.toLowerCase().includes(
          nombreProyecto.toLowerCase()
        )
      );
    }

    if (cuatrimestre) {
      filtered = filtered.filter(
        (grupo) => grupo.Cuatrimestre === parseInt(cuatrimestre)
      );
    }

    if (anno) {
      filtered = filtered.filter((grupo) => grupo.Anno === parseInt(anno));
    }

    setFilteredGrupos(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Índice del último grupo en la página actual
  const indexOfLastGrupo = currentPage * gruposPerPage;
  // Índice del primer grupo en la página actual
  const indexOfFirstGrupo = indexOfLastGrupo - gruposPerPage;
  // Lista de grupos en la página actual
  const currentGrupos = filteredGrupos.slice(
    indexOfFirstGrupo,
    indexOfLastGrupo
  );
  // Número total de páginas
  const totalPages = Math.ceil(filteredGrupos.length / gruposPerPage);

  // Función para manejar el cambio a la página siguiente
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  // Función para manejar el cambio a la página anterior
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  // Función para manejar la selección de un grupo específico
  const handleLista = (grupoId) => {
    localStorage.setItem("GrupoSeleccionado", grupoId);
    navigate("/ListaEstudiantes");
  };

  return (
    <div className="materia-container-card">
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
      <ToastContainer position="bottom-right" />
      <main>
        <div className="filters-acad">
          <div className="filter-group-acad">
            <label
              className="filter-label-acad"
              htmlFor="CodigoMateria-Busqueda"
            >
              Buscar por Código de Materia
            </label>
            <input
              id="CodigoMateria-Busqueda"
              type="text"
              placeholder="Código de Materia"
              className="filter-input-acad"
              value={codigoMateriaFilter}
              onChange={handleCodigoMateriaFilterChange}
            />
          </div>

          <div className="filter-group-acad">
            <label
              className="filter-label-acad"
              htmlFor="NombreProyecto-Busqueda"
            >
              Buscar por Nombre de Proyecto
            </label>
            <input
              id="NombreProyecto-Busqueda"
              type="text"
              placeholder="Nombre de Proyecto"
              className="filter-input-acad"
              value={nombreProyectoFilter}
              onChange={handleNombreProyectoFilterChange}
            />
          </div>

          <div className="filter-group-acad">
            <label
              className="filter-label-acad"
              htmlFor="Cuatrimestre-Busqueda"
            >
              Cuatrimestre
            </label>
            <select
              id="Cuatrimestre-Busqueda"
              className="filter-select-acad"
              value={cuatrimestreFilter}
              onChange={handleCuatrimestreFilterChange}
            >
              <option value="">Cuatrimestre</option>
              <option value="1">I</option>
              <option value="2">II</option>
              <option value="3">III</option>
            </select>
          </div>

          <div className="filter-group-acad">
            <label className="filter-label-acad" htmlFor="Anno-Busqueda">
              Año
            </label>
            <select
              id="Anno-Busqueda"
              className="filter-select-acad"
              value={annoFilter}
              onChange={handleAnnoFilterChange}
            >
              <option value="">Año</option>
              {uniqueYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="card-container">
          {currentGrupos.map((grupo) => (
            <div className="card" key={grupo.GrupoId}>
              <div className="card-header">{grupo.CodigoMateria}</div>
              <div className="card-title">
                {grupo.Grupos_TipoGrupo.NombreProyecto}
              </div>
              <div className="card-content">
                <p>
                  <strong>Tipo:</strong> {grupo.Grupos_TipoGrupo.TipoCurso}{" "}
                </p>
                <p>
                  <strong>Grupo:</strong> {grupo.NumeroGrupo}
                </p>
                <p>
                  <strong>Horario:</strong> {grupo.Horario}
                </p>
                <p>
                  <strong>Sede: </strong>
                  {grupo.Sede} &nbsp;&nbsp;&nbsp; <strong>Aula: </strong>
                  {grupo.Aula}
                </p>
              </div>
              <div className="card-footer">
                <button
                  className="btn-view-group"
                  onClick={() => handleLista(grupo.GrupoId)}
                >
                  Ver Grupo
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="box-pagination-grupEst">
          <div className="pagination-mat">
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id="tooltip-edit">Anterior</Tooltip>}
            >
              <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                <GrFormPreviousLink />
              </button>
            </OverlayTrigger>

            <span>
              {currentPage} de {totalPages}
            </span>
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id="tooltip-edit">Siguiente</Tooltip>}
            >
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
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

export default GruposAcademico;
