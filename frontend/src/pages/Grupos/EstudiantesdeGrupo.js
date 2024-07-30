import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import banderaCombinada from "../../Assets/Images/Bandera Combinada.png";
import { FaListCheck } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa6";
import { FaInfoCircle } from "react-icons/fa";
import { FaFileDownload } from "react-icons/fa";
import { GrFormPreviousLink, GrFormNextLink } from "react-icons/gr";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./EstudiantesGrupo.css";
// Componente principal para mostrar la lista de estudiantes
function ListaEstudiantes() {
  const navigate = useNavigate();
  const grupoId = localStorage.getItem("GrupoSeleccionado"); // Obtiene el ID del grupo seleccionado del almacenamiento local
  const [estudiantes, setEstudiantes] = useState([]); // Estado para almacenar la lista de estudiantes
  const [isFinalizarDisabled, setIsFinalizarDisabled] = useState(false); // Estado para habilitar/deshabilitar la finalización del cuatrimestre
  const [filteredEstudiantes, setFilteredEstudiantes] = useState([]); // Estado para almacenar la lista filtrada de estudiantes
  const [nombreFilter, setNombreFilter] = useState(""); // Estado para el filtro de nombre
  const [identificacionFilter, setIdentificacionFilter] = useState(""); // Estado para el filtro de identificación
  const [estadoFilter, setEstadoFilter] = useState("Todos"); // Estado para el filtro de estado
  const [progresoFilter, setProgresoFilter] = useState("Todos"); // Estado para el filtro de progreso
  const [currentPage, setCurrentPage] = useState(1); // Estado para la paginación actual
  const [loading, setLoading] = useState(false); // Estado de carga
  const estudiantesPerPage = 10; // Cantidad de estudiantes por página

  // Efecto para obtener la lista de estudiantes y la bandera de finalización cuando el componente se monta
  useEffect(() => {
    fetchEstudiantes();
    fetchBandera();
  }, []);
 // Función para obtener la lista de estudiantes desde el backend
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
 // Función para obtener la bandera de finalización del cuatrimestre desde el backend
  const fetchBandera = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`/grupos/getBandera/${grupoId}`);

      if (response.ok) {
        const data = await response.json();
        if (data.BanderaFinalizarCuatrimestre===0) {
          setIsFinalizarDisabled(false)
        } else {
          setIsFinalizarDisabled(true)
        }
      } else if (response.status === 404) {
        console.error("No se encontró la bandera de activación");
        toast.error("No se encontró la bandera de activación");
      } else {
        console.error("Error al obtener la bandera de activación");
        toast.error("Error al obtener la bandera de activación");
      }
    } catch (error) {
      console.error("Error al obtener la bandera de activación:", error);
      toast.error("Error al obtener la bandera de activación");
    } finally {
      setLoading(false);
    }
  };
 // Manejo de cambios en el filtro de nombre
  const handleNombreFilterChange = (e) => {
    const value = e.target.value;
    setNombreFilter(value);
    applyFilters(value, identificacionFilter, estadoFilter, progresoFilter);
  };
  // Manejo de cambios en el filtro de identificación
  const handleIdentificacionFilterChange = (e) => {
    const value = e.target.value;
    setIdentificacionFilter(value);
    applyFilters(nombreFilter, value, estadoFilter, progresoFilter);
  };
 // Manejo de cambios en el filtro de estado
  const handleEstadoFilterChange = (e) => {
    const value = e.target.value;
    setEstadoFilter(value);
    applyFilters(nombreFilter, identificacionFilter, value, progresoFilter);
  };
// Manejo de cambios en el filtro de progreso
  const handleProgresoFilterChange = (e) => {
    const value = e.target.value;
    setProgresoFilter(value);
    applyFilters(nombreFilter, identificacionFilter, estadoFilter, value);
  };
 // Aplicación de filtros a la lista de estudiantes
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
    setCurrentPage(1); // Resetear a la primera página al cambiar los filtros
  };
 // Cálculo de los índices para la paginación
  const indexOfLastEstudiante = currentPage * estudiantesPerPage;
  const indexOfFirstEstudiante = indexOfLastEstudiante - estudiantesPerPage;
  const currentEstudiantes = filteredEstudiantes.slice(
    indexOfFirstEstudiante,
    indexOfLastEstudiante
  );
  const totalPages = Math.ceil(filteredEstudiantes.length / estudiantesPerPage);
  // Manejo de la navegación a la página siguiente
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
 // Manejo de la navegación a la página anterior
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  // Manejo de la visualización de detalles de un estudiante
  const handleViewDetails = (identificacion, estado) => {
    localStorage.setItem("IdentificacionHoras", identificacion);
    localStorage.setItem("EstadoHoras", estado);
    navigate("/VistaHorasEstudiantes");
  };
  // Manejo de la finalización del cuatrimestre
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
  // Manejo de la navegación hacia atrás
  const handleBack = () => {
    localStorage.removeItem("GrupoSeleccionado");

    if (selectedRole === "Académico") {
      navigate("/GruposAcademico");
    } else {
      navigate("/Home");
    }
  };

  // Función para generar el reporte PDF
  const handleGenerarReporte = async () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "px", // Usar píxeles como unidad para conservar los tamaños originales
      format: "letter", // Tamaño carta
    });

    // Obtener datos del grupo
    const grupoResponse = await fetch(`grupos/${grupoId}`);
    const grupoData = await grupoResponse.json();

    // Guardar títulos en variables
    const titulo1 = `${grupoData.Grupos_TipoGrupo.NombreProyecto} - ${grupoData.CodigoMateria}`;
    const titulo2 = `Lista del Grupo# ${grupoData.NumeroGrupo}, Cuatrimestre ${grupoData.Cuatrimestre} del año ${grupoData.Anno}`;
    const titulo3 = `Académico a cargo: ${grupoData.Usuario.Nombre} ${grupoData.Usuario.Apellido1} ${grupoData.Usuario.Apellido2}`;

    // Crear la tabla
    const tableColumn = [
      "Nombre Completo",
      "Correo Electrónico",
      "Identificación",
      "Cant. de horas Aprobadas",
      "Estado del Estudiante",
    ];
    const tableRows = [];

    filteredEstudiantes.forEach((estudiante) => {
      const estudianteData = [
        `${estudiante.Usuario.Nombre} ${estudiante.Usuario.Apellido1} ${estudiante.Usuario.Apellido2}`,
        estudiante.Usuario.CorreoElectronico,
        estudiante.Usuario.Identificacion,
        estudiante.HorasAprobadas,
        estudiante.Estado,
      ];
      tableRows.push(estudianteData);
    });

    // Añadir imagen como encabezado
    const imgData = banderaCombinada;

    // Crear un objeto de imagen para obtener las dimensiones originales
    const img = new Image();
    img.src = imgData;
    img.onload = () => {
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const imgWidth = pageWidth / 6;
      const imgHeight = imgWidth * (img.height / img.width); // Mantener proporción original
      const imgX = (pageWidth - imgWidth) / 2; // Centrar imagen
      const imgY = 0;

      // Dibujar fondo del encabezado
      doc.setFillColor("#002b69");
      doc.rect(0, 0, pageWidth, imgHeight, "F");

      doc.addImage(imgData, "PNG", imgX, imgY, imgWidth, imgHeight);

      // Añadir títulos al cuerpo con espacios entre ellos
      const titleY = imgY + imgHeight + 20;
      doc.setFontSize(14);
      doc.setTextColor("#002b69"); // Color azul para el texto
      doc.text(titulo1, pageWidth / 2, titleY, { align: "center" });
      doc.text(titulo2, pageWidth / 2, titleY + 20, { align: "center" }); // Espacio adicional
      doc.text(titulo3, pageWidth / 2, titleY + 40, { align: "center" }); // Espacio adicional

      // Añadir tabla
      const startY = titleY + 50;
      doc.autoTable({
        startY: startY,
        head: [tableColumn],
        body: tableRows,
        styles: {
          fontSize: 10,
          cellPadding: 3,
          halign: "center", // Centrar datos de la tabla
        },
        headStyles: {
          fillColor: [0, 43, 105],
          textColor: [255, 255, 255],
          halign: "center", // Centrar encabezados de la tabla
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240],
        },
        margin: { bottom: 40 }, // Espacio adicional para el pie de página
      });

      // Añadir footer en cada página
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 0; i < pageCount; i++) {
        doc.setPage(i + 1);
        const footerHeight = 35; // Incrementar la altura del pie de página

        // Dibujar fondo del pie de página
        doc.setFillColor("#002b69");
        doc.rect(0, pageHeight - footerHeight, pageWidth, footerHeight, "F");

        // Añadir paginación y texto del pie de página
        doc.setFontSize(10);
        doc.setTextColor(255, 255, 255); // Letra blanca
        doc.text(
          `Página ${i + 1} de ${pageCount}`,
          pageWidth / 2,
          pageHeight - 25, // Ajustar para que quepa bien en el pie de página
          { align: "center" }
        );
        doc.text(
          `© ${new Date().getFullYear()} Universidad Técnica Nacional.`,
          pageWidth / 2,
          pageHeight - 15, // Ajustar para que quepa bien en el pie de página
          { align: "center" }
        );
        doc.text(
          "Todos los derechos reservados.",
          pageWidth / 2,
          pageHeight - 5, // Ajustar para que quepa bien en el pie de página
          { align: "center" }
        );
      }

      // Guardar el documento PDF
      doc.save(grupoData.CodigoMateria + " - " + titulo2 + ".pdf");
    };
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
            <FaChevronLeft />
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
                  disabled={isFinalizarDisabled===false}
                >
                  Finalizar Cuatrimestre <FaListCheck />
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
                <th>Cantidad de Horas Aprobadas</th>
                <th>Progreso del Estudiante</th>
                <th>Estado del Estudiante</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="mat-tbody">
              {currentEstudiantes.map((estudiante, index) => (
                <tr key={index}>
                  <td>{`${estudiante.Usuario.Nombre} ${estudiante.Usuario.Apellido1} ${estudiante.Usuario.Apellido2}`}</td>
                  <td>{estudiante.Usuario.CorreoElectronico}</td>
                  <td>{estudiante.Usuario.Identificacion}</td>
                  <td>{`${Math.floor(estudiante.HorasAprobadas)} Hrs, ${Math.round((estudiante.HorasAprobadas - Math.floor(estudiante.HorasAprobadas)) * 60)} min`}</td>
                  <td>{estudiante.Progreso}</td>
                  <td>{estudiante.Estado}</td>
                  <td>
                    {estudiante.Estado !== "Reprobado" ? (
                      <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id="tooltip-edit">Ver Bitacora del Estudiante</Tooltip>}
                    >
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
                      </OverlayTrigger>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* La paginación */}
        </div>
        <div className="box-pagination-ListEst">
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
          <div className="Generar-List">
            <button
              onClick={handleGenerarReporte}
              className="finalizar-button-listest"
            >
              <FaFileDownload /> Descargar Lista
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ListaEstudiantes;
