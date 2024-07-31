import React, { useState, useEffect } from "react";
import { IoMdSearch } from "react-icons/io";
import { GrFormPreviousLink, GrFormNextLink } from "react-icons/gr";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "./GruposConclusiones.css";

function GruposAcademico() {
  const navigate = useNavigate();
  const [grupos, setGrupos] = useState([]); // Estado para almacenar todos los grupos
  const [filteredGrupos, setFilteredGrupos] = useState([]); // Estado para almacenar los grupos filtrados
  const [cuatrimestreFilter, setCuatrimestreFilter] = useState(""); // Estado para el filtro de cuatrimestre
  const [annoFilter, setAnnoFilter] = useState(""); // Estado para el filtro de año
  const [yearsOptions, setYearsOptions] = useState([]); // Estado para almacenar las opciones de años disponibles
  const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual de la paginación
  const [loading, setLoading] = useState(false); // Estado para manejar la pantalla de carga
  const [noGroupsMessage, setNoGroupsMessage] = useState(false); // Estado para mostrar un mensaje si no hay grupos

  const gruposPerPage = 4; // Número de grupos por página
  const sedeFilter = sessionStorage.getItem("Sede") || "Todas"; // Filtro de sede
  const identificacion = sessionStorage.getItem("Identificacion"); // Identificación del usuario
  const selectedRole = sessionStorage.getItem("SelectedRole"); // Rol seleccionado por el usuario
  // Cálculo de los grupos actuales a mostrar en la página actual
  let currentGrupos = filteredGrupos.slice(
    (currentPage - 1) * gruposPerPage,
    currentPage * gruposPerPage
  );
  // Cálculo de los grupos actuales a mostrar en la página actual
  useEffect(() => {
    fetchYearsOptions();
    if (selectedRole === "Administrativo") {
      // Para administrativo, solo buscar grupos al hacer clic en Buscar
    } else {
      fetchGrupos();
    }
  }, []);
  // useEffect para aplicar filtros cuando los valores de cuatrimestre o año cambian
  useEffect(() => {
    if (selectedRole !== "Administrativo") {
      applyFilters(cuatrimestreFilter, annoFilter);
    }
  }, [cuatrimestreFilter, annoFilter]);
  // Función para obtener las opciones de años disponibles
  const fetchYearsOptions = async () => {
    try {
      const response = await fetch(`/conclusiones/Annos/${selectedRole}`);
      if (response.ok) {
        const data = await response.json();
        setYearsOptions(data);
      } else {
        toast.error("Error al obtener los años disponibles");
      }
    } catch (error) {
      toast.error("Error al obtener los años disponibles");
    }
  };
  // Función para obtener los grupos del usuario
  const fetchGrupos = async () => {
    try {
      const response = await fetch(`/grupos/Conclusiones/${identificacion}`);

      if (response.ok) {
        const data = await response.json();
        const filteredData =
          sedeFilter === "Todas"
            ? data
            : data.filter((grupo) => grupo.Sede === sedeFilter);

        setGrupos(filteredData);
        setFilteredGrupos(filteredData);
        setNoGroupsMessage(filteredData.length === 0);
      } else {
        setNoGroupsMessage(true);
        setGrupos([]);
        setFilteredGrupos([]);
        if (response.status === 404) {
          toast.error("El Académico no tiene grupos a cargo");
        } else {
          toast.error("Error al obtener la lista de grupos");
        }
      }
    } catch (error) {
      setNoGroupsMessage(true);
      setGrupos([]);
      setFilteredGrupos([]);
      toast.error("Error al obtener la lista de grupos");
    }
  };
  // Función para manejar el cambio en el filtro de cuatrimestre
  const handleCuatrimestreFilterChange = (e) => {
    const value = e.target.value;
    setCuatrimestreFilter(value);
  };
  // Función para manejar el cambio en el filtro de año
  const handleAnnoFilterChange = (e) => {
    const value = e.target.value;
    setAnnoFilter(value);
  };
  // Función para aplicar los filtros de búsqueda
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
    setCurrentPage(1); // Resetear a la primera página al cambiar los filtros
    setNoGroupsMessage(filtered.length === 0);
  };

  // Función para manejar la paginación a la página siguiente
  const handleNextPage = () => {
    const totalPages = Math.ceil(filteredGrupos.length / gruposPerPage);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  // Función para manejar la paginación a la página anterior
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  // Función para manejar la selección de un grupo específico
  const handleLista = (grupoId) => {
    localStorage.setItem("GrupoSeleccionado", grupoId);
    navigate("/VistaConclusionesGrupo");
  };
  // Función para manejar el clic en el botón de buscar
  const handleBuscarClick = async () => {
    try {
      const requestBody = JSON.stringify({
        Anno: annoFilter,
        Cuatrimestre: cuatrimestreFilter,
        Sede: sedeFilter,
      });

      const response = await fetch("/grupos/ConclusionesPorBusqueda", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
      });

      if (response.ok) {
        const data = await response.json();
        setGrupos(data);
        setFilteredGrupos(data);
        setNoGroupsMessage(data.length === 0);
      } else {
        setNoGroupsMessage(true);
        setGrupos([]);
        setFilteredGrupos([]);
      }
    } catch (error) {
      setNoGroupsMessage(true);
      setGrupos([]);
      setFilteredGrupos([]);
    }
  };

  const isBuscarButtonDisabled = cuatrimestreFilter === "" || annoFilter === "";

  return (
    <div className="grupClu-container">
      {/*Para la carga */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
      <ToastContainer position="bottom-right" />
      <main>
        <div className="filters-grupClu">
          {selectedRole === "Administrativo" ? (
            <>
              <div className="filter-group-grupClu">
                <label
                  className="filter-label-grupClu"
                  htmlFor="Cuatrimestre-Busqueda"
                >
                  Seleccionar por Año
                </label>
                <select
                  id="Anno-Busqueda"
                  className="filter-select-grupClu"
                  value={annoFilter}
                  onChange={handleAnnoFilterChange}
                >
                  <option value="">Año</option>
                  {yearsOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group-grupClu">
                <label
                  className="filter-label-grupClu"
                  htmlFor="Cuatrimestre-Busqueda"
                >
                  Seleccionar por Cuatrimestre
                </label>
                <select
                  id="Cuatrimestre-Busqueda"
                  className="filter-select-grupClu"
                  value={cuatrimestreFilter}
                  onChange={handleCuatrimestreFilterChange}
                >
                  <option value="">Cuatrimestre</option>
                  <option value="1">I Cuatrimestre</option>
                  <option value="2">II Cuatrimestre</option>
                  <option value="3">III Cuatrimestre</option>
                </select>
              </div>
              <div className="filter-group-grupClu">
                <div className="butBuscar-grupClu">
                  <div className="grupClu-divider " />
                  <button
                    className="buscar-button-grupClu"
                    onClick={handleBuscarClick}
                    disabled={isBuscarButtonDisabled}
                  >
                    Buscar <IoMdSearch />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="filter-group-grupClu">
                <label
                  className="filter-label-grupClu"
                  htmlFor="Cuatrimestre-Busqueda"
                >
                  Buscar por año
                </label>
                <select
                  id="Anno-Filtro"
                  className="filter-select-grupClu"
                  value={annoFilter}
                  onChange={handleAnnoFilterChange}
                >
                  <option value="">Año</option>
                  {yearsOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group-grupClu">
                <label
                  className="filter-label-grupClu"
                  htmlFor="Cuatrimestre-Busqueda"
                >
                  Buscar por cuatrimestre
                </label>
                <select
                  id="Cuatrimestre-Filtro"
                  className="filter-select-grupClu"
                  value={cuatrimestreFilter}
                  onChange={handleCuatrimestreFilterChange}
                >
                  <option value="">Cuatrimestre</option>
                  <option value="1">I Cuatrimestre</option>
                  <option value="2">II Cuatrimestre</option>
                  <option value="3">III Cuatrimestre</option>
                </select>
              </div>
            </>
          )}
        </div>

        <div className="card-container-grupClu">
          {noGroupsMessage ? (
            <div className="no-groups-message">
              Para ese periodo de tiempo no hay grupos que contengan estudiantes
              con boletas de conclusión aprobadas.
            </div>
          ) : (
            currentGrupos.map((grupo) => (
              <div className="card-grupClu" key={grupo.GrupoId}>
                <div className="card-header-grupClu">{grupo.CodigoMateria}</div>
                <div className="card-title-grupClu">
                  {grupo.Grupos_TipoGrupo.NombreProyecto}
                </div>
                <div className="card-content-grupClu">
                  <p>
                    <strong>Tipo:</strong> {grupo.Grupos_TipoGrupo.TipoCurso}
                  </p>
                  <p>
                    <strong>Grupo:</strong> {grupo.NumeroGrupo}
                  </p>
                  <p>
                    <strong>Horario:</strong> {grupo.Horario}
                  </p>
                  <p>
                    <strong>Sede:</strong> {grupo.Sede} &nbsp;&nbsp;&nbsp;{" "}
                    <strong>Aula:</strong> {grupo.Aula}
                  </p>
                </div>
                <div className="card-footer-grupClu">
                  <button
                    className="btn-view-group-grupClu"
                    onClick={() => handleLista(grupo.GrupoId)}
                  >
                    Ver Grupo
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {(selectedRole === "Académico" ||
          (selectedRole === "Administrativo" && grupos.length > 0)) && (
          <div className="box-pagination-grupClu">
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
                {Math.ceil(filteredGrupos.length / gruposPerPage)}
              </span>
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="tooltip-edit">Siguiente</Tooltip>}
              >
                <button
                  onClick={handleNextPage}
                  disabled={
                    currentPage ===
                    Math.ceil(filteredGrupos.length / gruposPerPage)
                  }
                >
                  <GrFormNextLink />
                </button>
              </OverlayTrigger>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default GruposAcademico;
