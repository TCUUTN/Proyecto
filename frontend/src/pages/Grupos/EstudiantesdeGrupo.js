import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import banderaCombinada from "../../Assets/Images/Bandera Combinada.png";
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

// Función para generar el reporte PDF
const handleGenerarReporte = async () => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'px', // Usar píxeles como unidad para conservar los tamaños originales
    format: 'letter' // Tamaño carta
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
    "Estado del Estudiante"
  ];
  const tableRows = [];

  filteredEstudiantes.forEach((estudiante) => {
    const estudianteData = [
      `${estudiante.Usuario.Nombre} ${estudiante.Usuario.Apellido1} ${estudiante.Usuario.Apellido2}`,
      estudiante.Usuario.CorreoElectronico,
      estudiante.Usuario.Identificacion,
      estudiante.HorasAprobadas,
      estudiante.Estado
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
    doc.rect(0, 0, pageWidth, imgHeight, 'F');

    doc.addImage(imgData, 'PNG', imgX, imgY, imgWidth, imgHeight);

    // Añadir títulos al cuerpo con espacios entre ellos
    const titleY = imgY + imgHeight + 20;
    doc.setFontSize(14);
    doc.setTextColor("#002b69"); // Color azul para el texto
    doc.text(titulo1, pageWidth / 2, titleY, { align: 'center' });
    doc.text(titulo2, pageWidth / 2, titleY + 20, { align: 'center' }); // Espacio adicional
    doc.text(titulo3, pageWidth / 2, titleY + 40, { align: 'center' }); // Espacio adicional

    // Añadir tabla
    const startY = titleY + 50;
    doc.autoTable({
      startY: startY,
      head: [tableColumn],
      body: tableRows,
      styles: {
        fontSize: 10,
        cellPadding: 3,
        halign: 'center' // Centrar datos de la tabla
      },
      headStyles: {
        fillColor: [0, 43, 105],
        textColor: [255, 255, 255],
        halign: 'center' // Centrar encabezados de la tabla
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
      margin: { bottom: 40 } // Espacio adicional para el pie de página
    });

    // Añadir footer en cada página
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 0; i < pageCount; i++) {
      doc.setPage(i + 1);
      const footerHeight = 35; // Incrementar la altura del pie de página

      // Dibujar fondo del pie de página
      doc.setFillColor("#002b69");
      doc.rect(0, pageHeight - footerHeight, pageWidth, footerHeight, 'F');

      // Añadir paginación y texto del pie de página
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255); // Letra blanca
      doc.text(
        `Página ${i + 1} de ${pageCount}`,
        pageWidth / 2,
        pageHeight - 25, // Ajustar para que quepa bien en el pie de página
        { align: 'center' }
      );
      doc.text(
        `© ${new Date().getFullYear()} Universidad Técnica Nacional.`,
        pageWidth / 2,
        pageHeight - 15, // Ajustar para que quepa bien en el pie de página
        { align: 'center' }
      );
      doc.text(
        "Todos los derechos reservados.",
        pageWidth / 2,
        pageHeight - 5, // Ajustar para que quepa bien en el pie de página
        { align: 'center' }
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
                <th>Cantidad de Horas Aprobadas</th>
                <th>Progreso del Estudiante</th>
                <th>Acciones</th>
                <th>Estado del Estudiante</th>
              </tr>
            </thead>
            <tbody className="mat-tbody">
              {currentEstudiantes.map((estudiante, index) => (
                <tr key={index}>
                  <td>{`${estudiante.Usuario.Nombre} ${estudiante.Usuario.Apellido1} ${estudiante.Usuario.Apellido2}`}</td>
                  <td>{estudiante.Usuario.CorreoElectronico}</td>
                  <td>{estudiante.Usuario.Identificacion}</td>
                  <td>{estudiante.HorasAprobadas}</td>
                  <td>{estudiante.Progreso}</td>
                  <td>{estudiante.Estado}</td>
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
          <div className="pagination-mat">
            <button
              onClick={handleGenerarReporte}
              className="finalizar-button-listest"
            >
              Generar Lista
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ListaEstudiantes;
