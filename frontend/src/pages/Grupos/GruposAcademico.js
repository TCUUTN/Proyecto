import React, { useState, useEffect } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "./GruposAcademico.css";

function GruposAcademico() {
  const navigate = useNavigate();
  const [grupos, setGrupos] = useState([]);
  const [filteredGrupos, setFilteredGrupos] = useState([]);
  const [codigoMateriaFilter, setCodigoMateriaFilter] = useState("");
  const [nombreProyectoFilter, setNombreProyectoFilter] = useState("");
  const [cuatrimestreFilter, setCuatrimestreFilter] = useState("");
  const [annoFilter, setAnnoFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false); // Estado de carga
  const gruposPerPage = 10;
  const [uniqueYears, setUniqueYears] = useState([]);
  const sedeFilter = sessionStorage.getItem("Sede") || "Todas";
  const identificacion = sessionStorage.getItem("Identificacion");

  useEffect(() => {
    fetchGrupos();
  }, []);

  const fetchGrupos = async () => {
    try {
      console.log(identificacion);
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
        console.error("El Académico no tiene grupos a cargo");
        toast.error("El Académico no tiene grupos a cargo");
      } else {
        console.error("Error al obtener la lista de grupos");
        toast.error("Error al obtener la lista de grupos");
      }
    } catch (error) {
      console.error("Error al obtener la lista de grupos:", error);
      toast.error("Error al obtener la lista de grupos");
    }
  };

  const handleCodigoMateriaFilterChange = (e) => {
    const value = e.target.value;
    setCodigoMateriaFilter(value);
    applyFilters(value, nombreProyectoFilter, cuatrimestreFilter, annoFilter);
  };

  const handleNombreProyectoFilterChange = (e) => {
    const value = e.target.value;
    setNombreProyectoFilter(value);
    applyFilters(codigoMateriaFilter, value, cuatrimestreFilter, annoFilter);
  };

  const handleCuatrimestreFilterChange = (e) => {
    const value = e.target.value;
    setCuatrimestreFilter(value);
    applyFilters(codigoMateriaFilter, nombreProyectoFilter, value, annoFilter);
  };

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

  const indexOfLastGrupo = currentPage * gruposPerPage;
  const indexOfFirstGrupo = indexOfLastGrupo - gruposPerPage;
  const currentGrupos = filteredGrupos.slice(
    indexOfFirstGrupo,
    indexOfLastGrupo
  );
  const totalPages = Math.ceil(filteredGrupos.length / gruposPerPage);

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

  const handleLista = (grupoId) => {
    localStorage.setItem("GrupoSeleccionado", grupoId);
    navigate("/ListaEstudiantes");
  };

  return (
    <div className="materia-container-card">
      {/*Para la carga */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
      <ToastContainer position="bottom-right" />
      {/**/}
      <main>
        {/* Filtros */}
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
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
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
        {/*Tarjetitas */}
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

        {/* La paginacion */}
        <div className="pagination-acad">
          <button onClick={handlePreviousPage}>Anterior</button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <button onClick={handleNextPage}>Siguiente</button>
        </div>
        {/**/}
      </main>
    </div>
  );
}

export default GruposAcademico;
