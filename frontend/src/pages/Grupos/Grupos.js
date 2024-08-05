import React, { useState, useEffect } from "react";
import { FaFileUpload } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import * as XLSX from "xlsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GrFormPreviousLink, GrFormNextLink } from "react-icons/gr";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import "./Proyectos.modulo.css";
import { GrEdit } from "react-icons/gr";
import { useNavigate } from "react-router-dom";

function Grupos() {
  const [grupos, setGrupos] = useState([]); // Estado para almacenar la lista de grupos
  const [filteredGrupos, setFilteredGrupos] = useState([]); // Estado para almacenar la lista de grupos filtrados
  const [codigoMateriaFilter, setCodigoMateriaFilter] = useState(""); // Estado para el filtro de código de materia
  const [nombreProyectoFilter, setNombreProyectoFilter] = useState(""); // Estado para el filtro de nombre de proyecto
  const [isFinalizarDisabled, setIsFinalizarDisabled] = useState(false); // Estado para desactivar el botón de finalizar
  const [cuatrimestreFilter, setCuatrimestreFilter] = useState(""); // Estado para el filtro de cuatrimestre
  const [annoFilter, setAnnoFilter] = useState(""); // Estado para el filtro de año
  const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual de la paginación
  const [loading, setLoading] = useState(false); // Estado para indicar si la carga está en progreso
  const gruposPerPage = 10; // Número de grupos por página para la paginación
  const [uniqueYears, setUniqueYears] = useState([]); // Estado para almacenar los años únicos en los grupos
  const sedeFilter = sessionStorage.getItem("Sede") || "Todas"; // Filtro de sede

  const navigate = useNavigate(); // Hook de navegación

  useEffect(() => {
    fetchGrupos(); // Llama a la función para obtener los grupos al cargar el componente
    fetchBandera(); // Llama a la función para obtener la bandera de activación al cargar el componente
  }, []);

  const fetchBandera = async () => {
    // Función para obtener la bandera de activación
    try {
      setLoading(true);

      const response = await fetch(`/grupos/getBanderaAdmin`);

      if (response.ok) {
        const data = await response.json();
        if (data.BanderaFinalizarCuatrimestre === 0) {
          setIsFinalizarDisabled(true);
        } else {
          setIsFinalizarDisabled(false);
        }
      } else if (response.status === 404) {
        toast.error("No se encontró la bandera de activación");
      }
    } catch (error) {
      toast.error("Error al obtener la bandera de activación: ", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGrupos = async () => {
    // Función para obtener la lista de grupos
    try {
      const response = await fetch("/grupos");
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
      }
    } catch (error) {
      toast.error("Error al obtener la lista de grupos: ", error);
    }
  };

  const handleClick = (grupoId) => {
    // Función para manejar el clic en un grupo específico
    localStorage.setItem("GrupoIdUpdate", grupoId);
    navigate("/CrearActuCreacionGrupos");
  };

  const handleCodigoMateriaFilterChange = (e) => {
    // Función para manejar el cambio en el filtro de código de materia
    const value = e.target.value;
    setCodigoMateriaFilter(value);
    applyFilters(value, nombreProyectoFilter, cuatrimestreFilter, annoFilter);
  };

  const handleNombreProyectoFilterChange = (e) => {
    // Función para manejar el cambio en el filtro de nombre de proyecto
    const value = e.target.value;
    setNombreProyectoFilter(value);
    applyFilters(codigoMateriaFilter, value, cuatrimestreFilter, annoFilter);
  };

  const handleCuatrimestreFilterChange = (e) => {
    // Función para manejar el cambio en el filtro de cuatrimestre
    const value = e.target.value;
    setCuatrimestreFilter(value);
    applyFilters(codigoMateriaFilter, nombreProyectoFilter, value, annoFilter);
  };

  const handleAnnoFilterChange = (e) => {
    // Función para manejar el cambio en el filtro de año
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
    // Función para aplicar los filtros a la lista de grupos
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
    setCurrentPage(1); // Restablece a la primera página al cambiar el filtro
  };

  const indexOfLastGrupo = currentPage * gruposPerPage; // Índice del último grupo en la página actual
  const indexOfFirstGrupo = indexOfLastGrupo - gruposPerPage; // Índice del primer grupo en la página actual
  const currentGrupos = filteredGrupos.slice(
    indexOfFirstGrupo,
    indexOfLastGrupo
  ); // Lista de grupos en la página actual
  const totalPages = Math.ceil(filteredGrupos.length / gruposPerPage); // Número total de páginas

  const handleNextPage = () => {
    // Función para manejar el cambio a la página siguiente
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    // Función para manejar el cambio a la página anterior
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleFileUpload = async (e) => {
    setLoading(true); // Inicia la carga
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = async (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
        header: 1,
      });

      // Verificar que haya al menos tres filas
      if (worksheet.length < 3) {
        toast.error("El archivo no contiene las filas requeridas");
        setLoading(false); // Termina la carga
        return;
      }

      // Obtener valores predeterminados de la primera fila
      const firstRow = worksheet[0];
      const defaultValues = {};
      for (let i = 0; i < firstRow.length; i += 2) {
        let key = firstRow[i];
        const value = firstRow[i + 1];

        // Transformar "Año" en "Anno"
        if (key === "Año") key = "Anno";

        defaultValues[key] = value;
      }

      // Verificar que los encabezados predeterminados sean "Cuatrimestre", "Anno" y "Sede"
      const requiredDefaultHeaders = ["Cuatrimestre", "Anno", "Sede"];
      for (const header of requiredDefaultHeaders) {
        if (!defaultValues.hasOwnProperty(header)) {
          toast.error(`El archivo no contiene la columna requerida: ${header}`);
          setLoading(false); // Termina la carga
          return;
        }
      }

      // Verificar encabezados en la segunda fila y aplicar las transformaciones
      let headers = worksheet[1];
      headers = headers.map((header) => {
        if (header === "Código de Proyecto") return "CodigoMateria";
        if (header === "Número de Grupo") return "NumeroGrupo";
        if (header === "Académico") return "Academico";
        return header;
      });

      if (
        !headers.includes("CodigoMateria") ||
        !headers.includes("NumeroGrupo") ||
        !headers.includes("Horario") ||
        !headers.includes("Aula") ||
        !headers.includes("Academico")
      ) {
        toast.error("El archivo no contiene las columnas requeridas");
        setLoading(false); // Termina la carga
        return;
      }

      const grupos = [];
      const rows = worksheet.slice(2); // Datos a partir de la tercera fila

      for (const row of rows) {
        // Verificar que la fila tenga al menos 5 valores
        if (row.length < 5) {
          continue; // Omitir la fila si no cumple con el criterio
        }

        const [CodigoMateria, NumeroGrupo, Horario, Aula, Academico] = row;

        const [Apellido1, Apellido2, ...nombreArray] = Academico.split(" ");
        const Nombre = nombreArray.join(" ");

        try {
          const response = await fetch(
            `/usuarios/nombre?Nombre=${Nombre}&Apellido1=${Apellido1}&Apellido2=${Apellido2}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const data = await response.json();
          if (response.ok && data.Identificacion) {
            const grupo = {
              CodigoMateria,
              NumeroGrupo,
              Horario,
              Aula,
              Identificacion: data.Identificacion,
            };

            // Agregar valores predeterminados si faltan
            for (const key in defaultValues) {
              if (!grupo[key]) {
                grupo[key] = defaultValues[key];
              }
            }

            grupos.push(grupo);
          } else {
            toast.error(
              `Error al obtener la identificación para ${Nombre} ${Apellido1} ${Apellido2}`
            );
          }
        } catch (error) {
          toast.error("Error al procesar los datos del usuario: ", error);
        }
      }

      try {
        const response = await fetch("/grupos/cargarGrupos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(grupos),
        });

        if (response.ok) {
          toast.success("Datos cargados correctamente");
          fetchGrupos(); // Refresh table
        }
      } catch (error) {
        toast.error("Error al cargar los datos de los grupos: ", error);
      } finally {
        setLoading(false); // Termina la carga
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleActivardessactivarCuatrimestre = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `/grupos/ActivarFinalizarCuatrimestre/${sedeFilter}`
      );

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);
        if (isFinalizarDisabled === false) {
          setIsFinalizarDisabled(true);
        } else {
          setIsFinalizarDisabled(false);
        }
      } else if (response.status === 404) {
        toast.error("No se encontró la bandera de activación");
      }
    } catch (error) {
      toast.error("Error al obtener la bandera de activación: ", error);
    } finally {
      setLoading(false);
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
        {/*Agregar usuario y la carga */}
        <div className="sidebar-mater">
          {/*Agregar usuario */}
          <div className="mater-action">
            <button
              className="add-mater"
              onClick={() => navigate("/CrearActuCreacionGrupos")}
            >
              Agregar Grupos <IoMdAddCircle className="icon-addMater" />
            </button>
          </div>
          <div className="mater-divider" />
          {/*Parte de las carga masiva*/}
          <div className="bulk-upload-section-Pro">
            <h2 className="title-mater">Carga masiva</h2>

            <div className="bulk-upload-group">
              <div className="upload-option-mater">
                <label htmlFor="file-upload" className="upload-label">
                  <FaFileUpload className="icon-othermat" /> Cargar Grupos
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept=".xlsx"
                  style={{ display: "none" }}
                  onChange={handleFileUpload}
                />
              </div>
            </div>
          </div>
          <div className="mater-divider" />
          <div className="buttFinalizar">
            <button
              onClick={handleActivardessactivarCuatrimestre}
              className="finalizar-button-listest"
            >
              {isFinalizarDisabled
                ? " Desactivar Finalizar Cuatrimestre"
                : "Activar Finalizar Cuatrimestre"}
            </button>
          </div>
        </div>
        {/* Filtros */}
        <div className="filters-mat">
          <div className="filter-group-mat">
            <label
              className="filter-label-mat"
              htmlFor="CodigoMateria-Busqueda"
            >
              Buscar por Código de Proyecto
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
        {/*Tabla*/}
        <div className="table-container-mat">
          <table className="mat-table">
            <thead className="mat-thead">
              <tr>
                <th>Proyecto</th>
                <th>Nombre Proyecto</th>
                <th>Tipo</th>
                <th>Grupo</th>
                <th>Horario</th>
                <th>Sede</th>
                <th>Aula</th>
                <th>Académico</th>
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
                  <td>{`${grupo.Usuario.Nombre} ${grupo.Usuario.Apellido1} ${grupo.Usuario.Apellido2}`}</td>
                  <td>
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id="tooltip-edit">Ver o Editar Grupo</Tooltip>
                      }
                    >
                      <button
                        className="icon-btn-mat"
                        onClick={() => handleClick(grupo.GrupoId)}
                      >
                        <GrEdit />
                      </button>
                    </OverlayTrigger>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* La paginacion */}
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
        {/**/}
      </main>
    </div>
  );
}

export default Grupos;
