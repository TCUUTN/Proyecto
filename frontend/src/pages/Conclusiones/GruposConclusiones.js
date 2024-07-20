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
  const [grupos, setGrupos] = useState([]);
  const [filteredGrupos, setFilteredGrupos] = useState([]);
  const [cuatrimestreFilter, setCuatrimestreFilter] = useState("");
  const [annoFilter, setAnnoFilter] = useState("");
  const [yearsOptions, setYearsOptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [noGroupsMessage, setNoGroupsMessage] = useState(false);

  const gruposPerPage = 4;
  const sedeFilter = sessionStorage.getItem("Sede") || "Todas";
  const identificacion = sessionStorage.getItem("Identificacion");
  const selectedRole = sessionStorage.getItem("SelectedRole");
  let currentGrupos = filteredGrupos.slice(
    (currentPage - 1) * gruposPerPage,
    currentPage * gruposPerPage
  );

  useEffect(() => {
    fetchYearsOptions();
    if (selectedRole === "Administrativo") {
      // Para administrativo, solo buscar grupos al hacer clic en Buscar
    } else {
      fetchGrupos();
    }
  }, []);

  useEffect(() => {
    if (selectedRole !== "Administrativo") {
      applyFilters(cuatrimestreFilter, annoFilter);
    }
  }, [cuatrimestreFilter, annoFilter]);

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

  const handleCuatrimestreFilterChange = (e) => {
    const value = e.target.value;
    setCuatrimestreFilter(value);
  };

  const handleAnnoFilterChange = (e) => {
    const value = e.target.value;
    setAnnoFilter(value);
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
    setNoGroupsMessage(filtered.length === 0);
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(filteredGrupos.length / gruposPerPage);
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
    navigate("/VistaConclusionesGrupo");
  };

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
