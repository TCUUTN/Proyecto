import React, { useState, useEffect } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { GrFormPreviousLink, GrFormNextLink } from "react-icons/gr";
import { FaFileUpload } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import * as XLSX from "xlsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Proyectos.modulo.css";
import { TiArrowUpThick } from "react-icons/ti"; // Importar el icono de flecha
import { LuFileEdit } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

function MantMaterias() {
  // Estados para almacenar y gestionar datos de materias y filtros
  const [materias, setMaterias] = useState([]);
  const [filteredMaterias, setFilteredMaterias] = useState([]);
  const [codigoMateriaFilter, setCodigoMateriaFilter] = useState("");
  const [nombreProyectoFilter, setNombreProyectoFilter] = useState("");
  const [tipoFilter, setTipoFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const materiasPerPage = 10;

  // Verifica si el proyecto fue guardado en la sesión anterior
  const banderaProyecto = sessionStorage.getItem("proyectoGuardado");

  const navigate = useNavigate();

  // Estado para manejar la visibilidad del botón de scroll
  const [showScrollButton, setShowScrollButton] = useState(false);

// Maneja el evento de desplazamiento para mostrar/ocultar el botón de scroll y activar secciones
useEffect(() => {
  const sections = document.querySelectorAll("section"); // Suponiendo que las secciones están marcadas con <section>

  function checkScroll() {
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.top < windowHeight * 0.75) {
        section.classList.add("active");
      } else {
        section.classList.remove("active");
      }
    });

    if (window.pageYOffset > 300) {
      setShowScrollButton(true);
    } else {
      setShowScrollButton(false);
    }
  }

  checkScroll();
  window.addEventListener("scroll", checkScroll);

  return () => {
    window.removeEventListener("scroll", checkScroll);
  };
}, []);

// Función para volver al inicio de la página
const handleScrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

  // Función para obtener la lista de materias desde el servidor
  const fetchMaterias = async () => {
    try {
      const response = await fetch("/grupos/tipos");
      if (response.ok) {
        const data = await response.json();
        setMaterias(data);
        setFilteredMaterias(data);
      } else {
        toast.error("Error al obtener la lista de materias");
      }
    } catch (error) {
      toast.error("Error al obtener la lista de proyectos: ", error);
    }
  };
  // useEffect para cargar la lista de materias al montar el componente
  useEffect(() => {
    fetchMaterias();
    // Mostrar mensaje de éxito si el proyecto fue guardado
    if (banderaProyecto === "true") {
      toast.success("El proyecto fue guardado con éxito.");
      sessionStorage.removeItem("proyectoGuardado");
    }
  }, []);
  // Manejadores de cambios en los filtrosa
  const handleCodigoMateriaFilterChange = (e) => {
    const value = e.target.value;
    setCodigoMateriaFilter(value);
    applyFilters(value, nombreProyectoFilter, tipoFilter);
  };

  const handleNombreProyectoFilterChange = (e) => {
    const value = e.target.value;
    setNombreProyectoFilter(value);
    applyFilters(codigoMateriaFilter, value, tipoFilter);
  };

  const handleTipoFilterChange = (e) => {
    const value = e.target.value;
    setTipoFilter(value);
    applyFilters(codigoMateriaFilter, nombreProyectoFilter, value);
  };
  // Función para aplicar los filtros a la lista de materias
  const applyFilters = (CodigoMateria, NombreProyecto, TipoCurso) => {
    let filtered = materias;

    if (CodigoMateria) {
      filtered = filtered.filter((materia) =>
        materia.CodigoMateria?.toLowerCase().includes(
          CodigoMateria.toLowerCase()
        )
      );
    }

    if (NombreProyecto) {
      filtered = filtered.filter((materia) =>
        materia.NombreProyecto?.toLowerCase().includes(
          NombreProyecto.toLowerCase()
        )
      );
    }

    if (TipoCurso) {
      filtered = filtered.filter((materia) => materia.TipoCurso === TipoCurso);
    }

    setFilteredMaterias(filtered);
    setCurrentPage(1); // Reiniciar a la primera página al cambiar los filtros
  };

  // Variables para la paginación
  const indexOfLastMateria = currentPage * materiasPerPage;
  const indexOfFirstMateria = indexOfLastMateria - materiasPerPage;
  const currentMaterias = filteredMaterias.slice(
    indexOfFirstMateria,
    indexOfLastMateria
  );
  // Manejadores de cambio de página
  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredMaterias.length / materiasPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  // Manejador de subida de archivos
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = XLSX.utils.sheet_to_json(
          workbook.Sheets[firstSheetName],
          { header: 1 }
        );

        const expectedHeaders = [
          "Código del Proyecto",
          "Nombre del Proyecto",
          "Modalidad del Proyecto",
        ];

        if (worksheet[0].join(",") === expectedHeaders.join(",")) {
          const jsonData = worksheet.slice(1).map((row) => {
            const [CodigoMateria, NombreProyecto, TipoCurso] = row;

            return {
              CodigoMateria,
              NombreProyecto,
              TipoCurso,
            };
          });
          // Función para subir los datos en formato JSON al servidor
          uploadJsonData(jsonData);
        } else {
          toast.error("Formato de archivo inválido");
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      toast.error("Por favor, suba un archivo Excel válido");
    }
  };

  const uploadJsonData = async (data) => {
    setLoading(true);
    try {
      const response = await fetch("/grupos/cargarTipoGrupos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("Datos cargados exitosamente");
        fetchMaterias();
      }
    } catch (error) {
      toast.error("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
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
        <div className="sidebar-mater">
          <div className="mater-action">
            <button
              className="add-mater"
              onClick={() => navigate("/CrearActuProyectos")}
            >
              Agregar Proyecto <IoMdAddCircle className="icon-addMater" />
            </button>
          </div>
          <div className="mater-divider" />
          <div className="bulk-upload-section-Pro">
            <h2 className="title-mater">Carga masiva</h2>

            <div className="bulk-upload-mater">
              <div className="upload-option-mater">
                <label htmlFor="file-upload" className="upload-label">
                  <FaFileUpload className="icon-othermat" /> Cargar Proyectos
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
        </div>

        <div className="filters-mat">
          <div className="filter-group-mat">
            <label className="filter-label-mat" htmlFor="CodigoMateria">
              Buscar por Código de Proyecto
            </label>
            <input
              id="CodigoMateria-Busqueda"
              type="text"
              placeholder="Código de Proyecto"
              className="filter-input-mat"
              value={codigoMateriaFilter}
              onChange={handleCodigoMateriaFilterChange}
            />
          </div>
          <div className="filter-group-mat">
            <label className="filter-label-mat" htmlFor="Proyecto">
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
            <label className="filter-label-mat" htmlFor="Modalidad">
              Seleccione Modalidad
            </label>
            <select
              className="filter-select-mat"
              value={tipoFilter}
              onChange={handleTipoFilterChange}
            >
              <option value="">Modalidad</option>
              <option value="Presencial">Presencial</option>
              <option value="Hibrido">Híbrido</option>
              <option value="Virtual">Virtual</option>
            </select>
          </div>
        </div>

        <div className="table-container-mat">
          <table className="mat-table">
            <thead className="mat-thead">
              <tr>
                <th>Código de Proyecto</th>
                <th>Nombre del Proyecto</th>
                <th>Tipo</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="mat-tbody">
              {currentMaterias.map((materia) => (
                <tr key={materia.CodigoMateria}>
                  <td>{materia.CodigoMateria}</td>
                  <td>{materia.NombreProyecto}</td>
                  <td>{materia.TipoCurso}</td>
                  <td>
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id="tooltip-edit">Editar proyecto</Tooltip>
                      }
                    >
                      <button
                        className="icon-btn-mat"
                        onClick={() => {
                          sessionStorage.setItem(
                            "CodigoProyecto",
                            materia.CodigoMateria
                          );
                          navigate("/CrearActuProyectos");
                        }}
                      >
                        <LuFileEdit />
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
              <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                <GrFormPreviousLink />
              </button>
            </OverlayTrigger>
            <span>
              {currentPage} de{" "}
              {Math.ceil(filteredMaterias.length / materiasPerPage)}
            </span>
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id="tooltip-edit">Siguiente</Tooltip>}
            >
              <button
                onClick={handleNextPage}
                disabled={
                  currentPage ===
                  Math.ceil(filteredMaterias.length / materiasPerPage)
                }
              >
                <GrFormNextLink />
              </button>
            </OverlayTrigger>
          </div>
        </div>
      </main>
       {/* Botón flotante de scroll */}
       {showScrollButton && (
        <button className="scroll-to-top" onClick={handleScrollToTop}>
          <TiArrowUpThick />
        </button>
      )}
    </div>
  );
}

export default MantMaterias;
