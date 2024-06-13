import React, { useState, useEffect } from "react";
import {
  FaInfoCircle,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';
import "./Materias.modulo.css";

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
        console.log(identificacion)
      const response = await fetch(`/grupos/Academicos/${identificacion}`);
      
      if (response.ok) {
        const data = await response.json();
        const filteredData = sedeFilter === "Todas"
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
    navigate('/ListaEstudiantes', { state: { grupoId } });
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
        <div className="filters-mat">
          <div className="filter-group-mat">
            <label
              className="filter-label-mat"
              htmlFor="CodigoMateria-Busqueda"
            >
              Buscar por Código de Materia
            </label>
            <input
              id="CodigoMateria-Busqueda"
              type="text"
              placeholder="Código de Materia"
              className="filter-input-mat"
              value={codigoMateriaFilter}
              onChange={handleCodigoMateriaFilterChange}
            />
          </div>

          <div className="filter-group-mat">
            <label
              className="filter-label-mat"
              htmlFor="NombreProyecto-Busqueda"
            >
              Buscar por Nombre de Proyecto
            </label>
            <input
              id="NombreProyecto-Busqueda"
              type="text"
              placeholder="Nombre de Proyecto"
              className="filter-input-mat"
              value={nombreProyectoFilter}
              onChange={handleNombreProyectoFilterChange}
            />
          </div>

          <div className="filter-group-mat">
            <label className="filter-label-mat" htmlFor="Cuatrimestre-Busqueda">
              Cuatrimestre
            </label>
            <select
              id="Cuatrimestre-Busqueda"
              className="filter-select-mat"
              value={cuatrimestreFilter}
              onChange={handleCuatrimestreFilterChange}
            >
              <option value="">Cuatrimestre</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>

          <div className="filter-group-mat">
            <label className="filter-label-mat" htmlFor="Anno-Busqueda">
              Año
            </label>
            <select
              id="Anno-Busqueda"
              className="filter-select-mat"
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

        <table className="mat-table">
          <thead className="mat-thead">
            <tr>
              <th>Materia</th>
              <th>Nombre Proyecto</th>
              <th>Tipo</th>
              <th>Grupo</th>
              <th>Horario</th>
              <th>Sede</th>
              <th>Aula</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody className="mat-tbody">
            {currentGrupos.map((grupo) => (
              <tr key={grupo.GrupoId}>
                <td>{grupo.CodigoMateria}</td>
                <td>{grupo.Grupos_TipoGrupo.NombreProyecto}</td>
                <td>{grupo.Grupos_TipoGrupo.TipoCurso}</td>
                <td>{grupo.NumeroGrupo}</td>
                <td>{grupo.Horario}</td>
                <td>{grupo.Sede}</td>
                <td>{grupo.Aula}</td>
                <td>
                <button
                    className="icon-btn-user"
                    onClick={() => handleLista(grupo.GrupoId)}
                  >
                    <FaInfoCircle />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination-mat">
          <button onClick={handlePreviousPage}>Anterior</button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <button onClick={handleNextPage}>Siguiente</button>
        </div>
      </main>
    </div>
  );
}

export default GruposAcademico;
