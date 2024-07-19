import React, { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa6";
import { IoMdAddCircle } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import banderaCombinada from "../../Assets/Images/Bandera Combinada.png";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import "./VistaHorasEstudiante.modulo.css";
import { BiSolidCommentX } from "react-icons/bi";

function VistaHorasEstudiante() {
  const navigate = useNavigate();
  const [materias, setMaterias] = useState([]);
  const [filteredApprovedMaterias, setFilteredApprovedMaterias] = useState([]);
  const [filteredRejectedMaterias, setFilteredRejectedMaterias] = useState([]);
  const [descripcionActividadFilter, setDescripcionActividadFilter] =
    useState("");
  const [tipoFilter, setTipoFilter] = useState("");
  const [
    descripcionActividadFilterRejected,
    setDescripcionActividadFilterRejected,
  ] = useState("");
  const [tipoFilterRejected, setTipoFilterRejected] = useState("");
  const [fechaFilter, setFechaFilter] = useState("");
  const [fechaFilterRejected, setFechaFilterRejected] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [identificacion, setIdentificacion] = useState(localStorage.getItem("IdentificacionHoras"));
  const materiasPerPage = 10;
  
  const estado = localStorage.getItem("EstadoHoras");
  const selectedRole = sessionStorage.getItem("SelectedRole");
  useEffect(() => {
    if (identificacion) {
      fetchHoras();
    }
    localStorage.removeItem("IdentificacionHoras");
  }, []);

  const fetchGrupoId = async () => {
    try {
      const response = await fetch(`/grupos/GrupoEstudiante/${identificacion}`);
      if (response.ok) {
        const data = await response.json();
        return data.GrupoId;
      }
    } catch (error) {
      toast.error("Error al obtener el GrupoId");
    }
  };

  const handleDescargaArchivo = async (BitacoraId) => {
    try {
      const response = await fetch(`/horas/descargarAdjunto/${BitacoraId}`);
      if (response.ok) {
        const data = await response.json();
        const fileName = encodeURIComponent(data);

        // Obtener el contenido del archivo
        const fileResponse = await fetch(`/${fileName}`);
        if (fileResponse.ok) {
          const blob = await fileResponse.blob();
          const url = window.URL.createObjectURL(blob);

          // Crear un enlace temporal para la descarga del archivo
          const a = document.createElement("a");
          a.href = url;
          a.download = data;

          // Agregar el enlace al DOM y hacer clic en él
          document.body.appendChild(a);
          a.click();

          // Eliminar el enlace del DOM y revocar el objeto URL
          setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            // Solicitar la eliminación del archivo del servidor
            fetch(`/horas/eliminarAdjunto/${fileName}`, {
              method: "DELETE",
            });
          }, 100); // 100 milisegundos de retraso para asegurar que la descarga haya comenzado
        } else {
          console.log("Fallo al descargar el archivo");
        }
      } else {
        console.log("Fallo al extraer imagen");
      }
    } catch (error) {
      console.error("Error al manejar la descarga del archivo:", error);
    }
  };

  // Función para obtener las horas del estudiante
  const fetchHoras = async () => {
    try {
      const grupoId = await fetchGrupoId(identificacion);
      if (grupoId) {
        const response = await fetch(
          `/horas/Estudiante/${identificacion}/${grupoId}`
        );
        if (response.ok) {
          const data = await response.json();

          // Ordenar las materias de manera que las más recientes aparezcan primero
          data.sort((a, b) => new Date(b.Fecha) - new Date(a.Fecha));

          setMaterias(data);
          setFilteredApprovedMaterias(
            data.filter((m) => m.EstadoHoras === "Aprobado")
          );
          setFilteredRejectedMaterias(
            data.filter((m) => m.EstadoHoras === "Rechazado")
          );
        } else {
          toast.error("Error al obtener la lista de actividades");
        }
      }
    } catch (error) {
      toast.error("Error al obtener la lista de actividades");
    }
  };

  const handleDescripcionActividadFilterChange = (e) => {
    const value = e.target.value;
    setDescripcionActividadFilter(value);
    applyFilters(
      value,
      tipoFilter,
      fechaFilter,
      "Aprobado",
      setFilteredApprovedMaterias
    );
  };

  const handleTipoFilterChange = (e) => {
    const value = e.target.value;
    setTipoFilter(value);
    applyFilters(
      descripcionActividadFilter,
      value,
      fechaFilter,
      "Aprobado",
      setFilteredApprovedMaterias
    );
  };

  const handleFechaFilterChange = (e) => {
    const value = e.target.value;
    setFechaFilter(value);
    applyFilters(
      descripcionActividadFilter,
      tipoFilter,
      value,
      "Aprobado",
      setFilteredApprovedMaterias
    );
  };

  const handleDescripcionActividadFilterRejectedChange = (e) => {
    const value = e.target.value;
    setDescripcionActividadFilterRejected(value);
    applyFilters(
      value,
      tipoFilterRejected,
      fechaFilterRejected,
      "Rechazado",
      setFilteredRejectedMaterias
    );
  };

  const handleTipoFilterRejectedChange = (e) => {
    const value = e.target.value;
    setTipoFilterRejected(value);
    applyFilters(
      descripcionActividadFilterRejected,
      value,
      fechaFilterRejected,
      "Rechazado",
      setFilteredRejectedMaterias
    );
  };

  const handleFechaFilterRejectedChange = (e) => {
    const value = e.target.value;
    setFechaFilterRejected(value);
    applyFilters(
      descripcionActividadFilterRejected,
      tipoFilterRejected,
      value,
      "Rechazado",
      setFilteredRejectedMaterias
    );
  };

  const applyFilters = (
    DescripcionActividad,
    TipoCurso,
    Fecha,
    status,
    setFilteredMaterias
  ) => {
    let filtered = materias.filter((m) => m.EstadoHoras === status);

    if (DescripcionActividad) {
      filtered = filtered.filter((materia) =>
        materia.DescripcionActividad?.toLowerCase().includes(
          DescripcionActividad.toLowerCase()
        )
      );
    }

    if (TipoCurso) {
      filtered = filtered.filter(
        (materia) => materia.TipoActividad === TipoCurso
      );
    }

    if (Fecha) {
      filtered = filtered.filter((materia) => materia.Fecha.includes(Fecha));
    }

    setFilteredMaterias(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const indexOfLastMateria = currentPage * materiasPerPage;
  const indexOfFirstMateria = indexOfLastMateria - materiasPerPage;
  const currentApprovedMaterias = filteredApprovedMaterias.slice(
    indexOfFirstMateria,
    indexOfLastMateria
  );
  const currentRejectedMaterias = filteredRejectedMaterias.slice(
    indexOfFirstMateria,
    indexOfLastMateria
  );

  const handleNextPage = () => {
    if (
      currentPage <
        Math.ceil(filteredApprovedMaterias.length / materiasPerPage) ||
      currentPage < Math.ceil(filteredRejectedMaterias.length / materiasPerPage)
    ) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleViewDetails = () => {
    localStorage.removeItem("EstadoHoras");
    localStorage.removeItem("IdentificacionHoras");
    navigate("/ListaEstudiantes");
  };

  const handleEditClick = (bitacoraId) => {
    sessionStorage.setItem("BitacoraId", bitacoraId);
    window.location.href = "/RechazoHoras";
  };

  const handleEditClick2 = (bitacoraId) => {
    sessionStorage.setItem("BitacoraId", bitacoraId);
    window.location.href = "/CrearoActualizarHoras";
  };

  const handleButtonClick = () => {
    localStorage.removeItem("IdentificacionHoras");
    navigate("/CrearoActualizarHoras");
  };

  const handleGenerarReporte = async () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'px', // Usar píxeles como unidad para conservar los tamaños originales
      format: 'letter' // Tamaño carta
    });
  
    // Obtener datos del grupo
    const usuarioResponse = await fetch(`usuarios/nombres/${identificacion}`);
    const usuarioData = await usuarioResponse.json();
  
    // Guardar títulos en variables
    const titulo1 = `Reporte de horas del Estudiante ${usuarioData.Nombre} ${usuarioData.Apellido1} ${usuarioData.Apellido2}`;
    const titulo2 = `Horas Aprobadas`;
    const titulo3 = `Horas Rechazadas`;
  
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
      const imgY = 0; // Ajustar la coordenada Y para que no esté en el borde superior
  
      // Dibujar fondo del encabezado
      doc.setFillColor("#002b69");
      doc.rect(0, 0, pageWidth, imgHeight, 'F'); // Ajustar la altura del fondo
  
      doc.addImage(imgData, 'PNG', imgX, imgY, imgWidth, imgHeight);
      const titleY = imgY + imgHeight + 15; // Ajustar el espacio entre la imagen y el título
  
      // Añadir títulos al cuerpo con espacios entre ellos
      doc.setFontSize(14);
      doc.setTextColor("#002b69"); // Color azul para el texto
      doc.text(titulo1, pageWidth / 2, titleY, { align: 'center' });
      doc.text(titulo2, pageWidth / 2, titleY + 20, { align: 'center' }); // Espacio adicional
      const startYApproved = titleY + 30; // Más espacio para el próximo título
  
      // Función para convertir horas a formato de 12 horas
      const formatTime = (time) => {
        let [hours, minutes] = time.split(':').map(Number);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Convertir 0 a 12
        return `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
      };
  
      // Función para convertir fecha a formato dd/mm/aaaa
      const formatDate = (date) => {
        const [yyyy, mm, dd] = date.split('-');
        return `${dd}/${mm}/${yyyy}`;
      };
  
      // Datos de las actividades aprobadas
      const tableColumnApproved = [
        "Fecha",
        "Descripción de la Actividad",
        "Tipo de Actividad",
        "Hora de Inicio",
        "Hora Final",
        "Evidencia",
      ];
      const tableRowsApproved = filteredApprovedMaterias.map((materia) => [
        formatDate(materia.Fecha),
        materia.DescripcionActividad,
        materia.TipoActividad,
        formatTime(materia.HoraInicio),
        formatTime(materia.HoraFinal),
        materia.NombreEvidencia && materia.NombreEvidencia !== "-" ? "Sí" : "No",
      ]);
  
      // Datos de las actividades rechazadas
      const tableColumnRejected = [
        "Fecha",
        "Descripción de la Actividad",
        "Tipo de Actividad",
        "Comentarios de Rechazo",
      ];
      const tableRowsRejected = filteredRejectedMaterias.map((materia) => [
        formatDate(materia.Fecha),
        materia.DescripcionActividad,
        materia.TipoActividad,
        materia.ComentariosRechazo,
      ]);
  
      let startY = startYApproved;
  
      // Añadir tabla de actividades aprobadas si hay registros
      if (tableRowsApproved.length > 0) {
        doc.autoTable({
          startY: startY,
          head: [tableColumnApproved],
          body: tableRowsApproved,
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
          margin: { bottom: 30 }, // Margen inferior para el pie de página
          didDrawPage: (data) => {
            const footerHeight = 35; // Incrementar la altura del pie de página
  
            // Dibujar fondo del pie de página
            doc.setFillColor("#002b69");
            doc.rect(0, pageHeight - footerHeight, pageWidth, footerHeight, 'F');
  
            // Añadir paginación y texto del pie de página
            doc.setFontSize(10);
            doc.setTextColor(255, 255, 255); // Letra blanca
            doc.text(
              `Página ${data.pageNumber} de ${doc.internal.getNumberOfPages()}`,
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
        });
        startY = doc.lastAutoTable.finalY + 20; // Actualizar startY para la siguiente tabla con más espacio
      }
  
      // Añadir tabla de actividades rechazadas si hay registros
      if (tableRowsRejected.length > 0) {
        doc.text(titulo3, pageWidth / 2, startY, { align: 'center' });
        startY += 10;
        doc.autoTable({
          startY: startY,
          head: [tableColumnRejected],
          body: tableRowsRejected,
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
          margin: { bottom: 30 }, // Margen inferior para el pie de página
          didDrawPage: (data) => {
            const footerHeight = 30; // Incrementar la altura del pie de página
  
            // Dibujar fondo del pie de página
            doc.setFillColor("#002b69");
            doc.rect(0, pageHeight - footerHeight, pageWidth, footerHeight, 'F');
  
            // Añadir paginación y texto del pie de página
            doc.setFontSize(10);
            doc.setTextColor(255, 255, 255); // Letra blanca
            doc.text(
              `Página ${data.pageNumber} de ${doc.internal.getNumberOfPages()}`,
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
        });
      }
  
      doc.save(`Reporte de horas ${usuarioData.Nombre} ${usuarioData.Apellido1} ${usuarioData.Apellido2}.pdf`);
    };
  };
  

  return (
    <div className="horasi-container">
      {/* */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
      <ToastContainer position="bottom-right" />
      {/* */}
      <main>
        {/* */}
        <div className="horasi-botton">
          {(selectedRole === "Académico"||selectedRole === "Administrativo") && (
            <button className="add-horasiRegresar" onClick={handleViewDetails}>
              <FaChevronLeft className="icon-horasiRegresar" /> Regresar
            </button>
          )}
          {selectedRole === "Estudiante" && estado !== "Aprobado" && (
            <button className="add-horasi" onClick={handleButtonClick}>
              Agregar Actividades <IoMdAddCircle className="icon-horasi" />
            </button>
            
          )}
          <button
              onClick={handleGenerarReporte}
              className="finalizar-button-listest"
            >
              Reporte de horas
            </button>
        </div>
        {/* */}
        {filteredApprovedMaterias.length === 0 &&
        filteredRejectedMaterias.length === 0 ? (
          <div className="no-data-message">
            Inserte actividades para verlas aquí
          </div>
        ) : (
          <>
            {/* */}
            <div className="container-tableapro">
              <h2 className="apro-titl">Actividades Aprobadas</h2>
              <div className="apro-divider"></div>
              {/* Filtros*/}
              <div className="filter-apro">
                {/* Fecha*/}
                <div className="filter-group-apro">
                  <label className="filter-label-apro">Fecha</label>
                  <input
                    className="filter-select-apro"
                    type="date"
                    value={fechaFilter}
                    onChange={handleFechaFilterChange}
                    placeholder="Buscar por fecha"
                  />
                </div>
                {/*  Descripcion actividades*/}
                <div className="filter-group-apro">
                  <label className="filter-label-apro">
                    Descripción de la Actividad
                  </label>
                  <input
                    className="filter-input-apro"
                    type="text"
                    value={descripcionActividadFilter}
                    onChange={handleDescripcionActividadFilterChange}
                    placeholder="Buscar por descripción"
                  />
                </div>
                {/*  Tipo de Actividad*/}
                <div className="filter-group-apro">
                  <label className="filter-label-apro">
                    Tipo de Actividad:
                  </label>
                  <select
                    className="filter-select-apro"
                    value={tipoFilter}
                    onChange={handleTipoFilterChange}
                  >
                    <option value="">Tipo de Actividad</option>
                    <option value="Planificacion">Planificación</option>
                    <option value="Ejecucion">Ejecución</option>
                    <option value="Gira">Gira</option>
                  </select>
                </div>
              </div>
              {/* */}
              {currentApprovedMaterias.length > 0 ? (
                <>
                  {/*Tabla */}
                  <table className="apro-table">
                    <thead className="apro-thead">
                      <tr>
                        <th>Fecha</th>
                        <th>Descripción de la Actividad</th>
                        <th>Tipo de Actividad</th>
                        <th>Hora de Inicio</th>
                        <th>Hora Final</th>
                        <th>Evidencia</th>
                        {selectedRole === "Académico" &&
                          estado !== "Aprobado" && <th>Rechazar Horas</th>}
                      </tr>
                    </thead>
                    <tbody className="apro-tbody">
                      {currentApprovedMaterias.map((materia) => (
                        <tr key={materia.BitacoraId}>
                          <td>{materia.Fecha}</td>
                          <td>{materia.DescripcionActividad}</td>
                          <td>{materia.TipoActividad}</td>
                          <td>{materia.HoraInicio}</td>
                          <td>{materia.HoraFinal}</td>
                          <td>
                            {materia.NombreEvidencia &&
                            materia.NombreEvidencia !== "-" ? (
                              <button
                                className="btn-link"
                                onClick={() =>
                                  handleDescargaArchivo(
                                    materia.BitacoraId,
                                    materia.NombreEvidencia
                                  )
                                }
                              >
                                {materia.NombreEvidencia}
                              </button>
                            ) : (
                              "No se presentó ninguna evidencia"
                            )}
                          </td>
                          {selectedRole === "Académico" &&
                            estado !== "Aprobado" && (
                              <td>
                                <button
                                  className="icon-btn-acade"
                                  onClick={() =>
                                    handleEditClick(materia.BitacoraId)
                                  }
                                >
                          <BiSolidCommentX />
                                </button>
                              </td>
                            )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {/* La paginacion */}
                  <div className="pagination-apro">
                    <button
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </button>
                    <span>
                      Página {currentPage} de{" "}
                      {Math.ceil(
                        filteredApprovedMaterias.length / materiasPerPage
                      )}
                    </span>
                    <button
                      onClick={handleNextPage}
                      disabled={
                        currentPage ===
                        Math.ceil(
                          filteredApprovedMaterias.length / materiasPerPage
                        )
                      }
                    >
                      Siguiente
                    </button>
                  </div>
                </>
              ) : (
                <div className="no-data-message">
                  No hay actividades aprobadas que coincidan con los filtros.
                </div>
              )}
            </div>
            {/*Tabla de rechazo horas estudiante*/}

            <div className="container-tablerecha">
              <h2 className="apro-titl">Actividades Rechazadas</h2>
              <div className="apro-divider"></div>
              {/* Filtros*/}
              <div className="filter-apro">
                {/* Fecha*/}
                <div className="filter-group-apro">
                  <label className="filter-label-apro">Fecha</label>
                  <input
                    className="filter-select-apro"
                    type="date"
                    value={fechaFilterRejected}
                    onChange={handleFechaFilterRejectedChange}
                    placeholder="Buscar por fecha"
                  />
                </div>

                {/*  Descripcion actividades*/}
                <div className="filter-group-apro">
                  <label className="filter-label-apro">
                    Descripción de la Actividad
                  </label>
                  <input
                    className="filter-input-apro"
                    type="text"
                    value={descripcionActividadFilterRejected}
                    onChange={handleDescripcionActividadFilterRejectedChange}
                    placeholder="Buscar por descripción"
                  />
                </div>

                {/*  Tipo de Actividad*/}
                <div className="filter-group-apro">
                  <label className="filter-label-apro">
                    Tipo de Actividad:
                  </label>
                  <select
                    className="filter-select-apro"
                    value={tipoFilterRejected}
                    onChange={handleTipoFilterRejectedChange}
                  >
                    <option value="">Modalidad</option>
                    <option value="Planificacion">Planificación</option>
                    <option value="Ejecucion">Ejecución</option>
                    <option value="Gira">Gira</option>
                  </select>
                </div>
              </div>
              {/* */}
              {currentRejectedMaterias.length > 0 ? (
                <>
                  {/*Tabla */}
                  <table className="apro-table">
                    <thead className="apro-thead">
                      <tr>
                        <th>Fecha</th>
                        <th>Descripción de la Actividad</th>
                        <th>Tipo de Actividad</th>
                        <th>Comentarios de Rechazo</th>
                        {selectedRole === "Estudiante" &&
                          estado !== "Aprobado" && <th>Modificar</th>}
                      </tr>
                    </thead>
                    <tbody className="apro-tbody">
                      {currentRejectedMaterias.map((materia) => (
                        <tr key={materia.BitacoraId}>
                          <td>{materia.Fecha}</td>
                          <td>{materia.DescripcionActividad}</td>
                          <td>{materia.TipoActividad}</td>
                          <td>{materia.ComentariosRechazo}</td>
                          {selectedRole === "Estudiante" &&
                            estado !== "Aprobado" && (
                              <td>
                                <button
                                  className="icon-btn-acade"
                                  onClick={() =>
                                    handleEditClick2(materia.BitacoraId)
                                  }
                                >
                                  <FaEdit />
                                </button>
                              </td>
                            )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {/* La paginacion */}
                  <div className="pagination-apro">
                    <button
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </button>
                    <span>
                      Página {currentPage} de{" "}
                      {Math.ceil(
                        filteredRejectedMaterias.length / materiasPerPage
                      )}
                    </span>
                    <button
                      onClick={handleNextPage}
                      disabled={
                        currentPage ===
                        Math.ceil(
                          filteredRejectedMaterias.length / materiasPerPage
                        )
                      }
                    >
                      Siguiente
                    </button>
                  </div>
                </>
              ) : (
                <div className="no-data-message">
                  No hay actividades rechazadas que coincidan con los filtros.
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default VistaHorasEstudiante;
