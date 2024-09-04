/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from "react";
import { FaEdit } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa6";
import { IoMdAddCircle } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaFileDownload } from "react-icons/fa";
import { GrFormPreviousLink, GrFormNextLink } from "react-icons/gr";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import { TiArrowDownThick } from "react-icons/ti";
import banderaCombinada from "../../Assets/Images/Bandera Combinada.png";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { TiArrowUpThick } from "react-icons/ti"; // Importar el icono de flecha
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
  const [currentPageApro, setCurrentPageApro] = useState(1);
  const [currentPageRejected, setCurrentPageRejected] = useState(1);
  const [loading, setLoading] = useState(false);
  const [identificacion, setIdentificacion] = useState(
    localStorage.getItem("IdentificacionHoras")
  );
  const materiasPerPage = 10;

  const estado = localStorage.getItem("EstadoHoras");
  const selectedRole = sessionStorage.getItem("SelectedRole");

  // Nuevos estados para el ordenamiento
  const [sortConfig, setSortConfig] = useState({
    key: null, // Columna actual por la que estamos ordenando
    direction: "ascending", // Dirección del ordenamiento: 'asc' o 'desc'
  });

   // Nuevos estados para el ordenamiento
   const [sortConfig2, setSortConfig2] = useState({
    key: null, // Columna actual por la que estamos ordenando
    direction: "ascending", // Dirección del ordenamiento: 'asc' o 'desc'
  });

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

  useEffect(() => {
    if (identificacion) {
      fetchHoras();
    }
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
          toast.error("Fallo al descargar el archivo");
        }
      } else {
        toast.error("Fallo al descargar el archivo");
      }
    } catch (error) {
      toast.error("Error al manejar la descarga del archivo:", error);
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
          toast.error("El Estudiante no posee horas registradas");
        }
      }
    } catch (error) {
      toast.error("El Estudiante no posee horas registradas");
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
    setCurrentPageApro(1); // Reset to first page on filter change
    setCurrentPageRejected(1); // Reset to first page on filter change
  };

  // Función para manejar el ordenamiento
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getClassNamesFor = (key) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === key ? sortConfig.direction : undefined;
  };
  // Lógica para ordenar horas aprobadas
  const sortedAprobados = useMemo(() => {
    let sortable = [...filteredApprovedMaterias];
    if (sortConfig.key) {
      sortable.sort((a, b) => {
        const aValue = sortConfig.key
          .split(".")
          .reduce((obj, key) => obj[key], a);
        const bValue = sortConfig.key
          .split(".")
          .reduce((obj, key) => obj[key], b);

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortable;
  }, [filteredApprovedMaterias, sortConfig]);




  // Función para manejar el ordenamiento rechazo
  const requestSortRecha = (key) => {
    let direction = "ascending";
    if (sortConfig2.key === key && sortConfig2.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig2({ key, direction });
  };

  const getClassNamesForRecha = (key) => {
    if (!sortConfig2) {
      return;
    }
    return sortConfig2.key === key ? sortConfig2.direction : undefined;
  };






  // Lógica para ordenar horas rechazadas
  const sortedRechazados = useMemo(() => {
    let sortable = [...filteredRejectedMaterias];
    if (sortConfig2.key) {
      sortable.sort((a, b) => {
        const aValue = sortConfig2.key
          .split(".")
          .reduce((obj, key) => obj[key], a);
        const bValue = sortConfig2.key
          .split(".")
          .reduce((obj, key) => obj[key], b);

        if (aValue < bValue) {
          return sortConfig2.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig2.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortable;
  }, [filteredRejectedMaterias, sortConfig2]);

  const indexOfLastHoraApro = currentPageApro * materiasPerPage;
  const indexOfFirstHoraApro = indexOfLastHoraApro - materiasPerPage;
  const indexOfLastHoraRejected = currentPageRejected * materiasPerPage;
  const indexOfFirstHoraRejected = indexOfLastHoraRejected - materiasPerPage;
  const currentApprovedMaterias = sortedAprobados.slice(
    indexOfFirstHoraApro,
    indexOfLastHoraApro
  );
  const currentRejectedMaterias = sortedRechazados.slice(
    indexOfFirstHoraRejected,
    indexOfLastHoraRejected
  );

  const handleNextPageApro = () => {
    if (
      currentPageApro <
        Math.ceil(filteredApprovedMaterias.length / materiasPerPage) ||
      currentPageApro <
        Math.ceil(filteredRejectedMaterias.length / materiasPerPage)
    ) {
      setCurrentPageApro(currentPageApro + 1);
    }
  };

  const handlePreviousPageApro = () => {
    if (currentPageApro > 1) {
      setCurrentPageApro(currentPageApro - 1);
    }
  };

  const handleNextPageRejected = () => {
    if (
      currentPageRejected <
        Math.ceil(filteredApprovedMaterias.length / materiasPerPage) ||
      currentPageRejected <
        Math.ceil(filteredRejectedMaterias.length / materiasPerPage)
    ) {
      setCurrentPageRejected(currentPageRejected + 1);
    }
  };

  const handlePreviousPageRejected = () => {
    if (currentPageRejected > 1) {
      setCurrentPageRejected(currentPageRejected - 1);
    }
  };

  const handleViewDetails = () => {
    localStorage.removeItem("EstadoHoras");
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
    navigate("/CrearoActualizarHoras");
  };

  const handleGenerarReporte = async () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "px", // Usar píxeles como unidad para conservar los tamaños originales
      format: "letter", // Tamaño carta
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
      doc.rect(0, 0, pageWidth, imgHeight, "F"); // Ajustar la altura del fondo

      doc.addImage(imgData, "PNG", imgX, imgY, imgWidth, imgHeight);
      const titleY = imgY + imgHeight + 15; // Ajustar el espacio entre la imagen y el título

      // Añadir títulos al cuerpo con espacios entre ellos
      doc.setFontSize(14);
      doc.setTextColor("#002b69"); // Color azul para el texto
      doc.text(titulo1, pageWidth / 2, titleY, { align: "center" });
      doc.text(titulo2, pageWidth / 2, titleY + 20, { align: "center" }); // Espacio adicional
      const startYApproved = titleY + 30; // Más espacio para el próximo título

      // Función para convertir horas a formato de 12 horas
      const formatTime = (time) => {
        let [hours, minutes] = time.split(":").map(Number);
        const ampm = hours >= 12 ? "pm" : "am";
        hours = hours % 12 || 12; // Convertir 0 a 12
        return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
      };

      // Función para convertir fecha a formato dd/mm/aaaa
      const formatDate = (date) => {
        const [yyyy, mm, dd] = date.split("-");
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
        materia.NombreEvidencia && materia.NombreEvidencia !== "-"
          ? "Sí"
          : "No",
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
          margin: { bottom: 30 }, // Margen inferior para el pie de página
          didDrawPage: (data) => {
            const footerHeight = 35; // Incrementar la altura del pie de página

            // Dibujar fondo del pie de página
            doc.setFillColor("#002b69");
            doc.rect(
              0,
              pageHeight - footerHeight,
              pageWidth,
              footerHeight,
              "F"
            );

            // Añadir paginación y texto del pie de página
            doc.setFontSize(10);
            doc.setTextColor(255, 255, 255); // Letra blanca
            doc.text(
              `Página ${data.pageNumber} de ${doc.internal.getNumberOfPages()}`,
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
          },
        });
        startY = doc.lastAutoTable.finalY + 20; // Actualizar startY para la siguiente tabla con más espacio
      }

      // Añadir tabla de actividades rechazadas si hay registros
      if (tableRowsRejected.length > 0) {
        doc.text(titulo3, pageWidth / 2, startY, { align: "center" });
        startY += 10;
        doc.autoTable({
          startY: startY,
          head: [tableColumnRejected],
          body: tableRowsRejected,
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
          margin: { bottom: 30 }, // Margen inferior para el pie de página
          didDrawPage: (data) => {
            const footerHeight = 30; // Incrementar la altura del pie de página

            // Dibujar fondo del pie de página
            doc.setFillColor("#002b69");
            doc.rect(
              0,
              pageHeight - footerHeight,
              pageWidth,
              footerHeight,
              "F"
            );

            // Añadir paginación y texto del pie de página
            doc.setFontSize(10);
            doc.setTextColor(255, 255, 255); // Letra blanca
            doc.text(
              `Página ${data.pageNumber} de ${doc.internal.getNumberOfPages()}`,
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
          },
        });
      }

      doc.save(
        `Reporte de horas ${usuarioData.Nombre} ${usuarioData.Apellido1} ${usuarioData.Apellido2}.pdf`
      );
    };
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "pm" : "am";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, "0");
    return `${formattedHours}:${formattedMinutes} ${period}`;
  };

  const formatDate = (date) => {
    const [yyyy, mm, dd] = date.split("-");
    return `${dd}/${mm}/${yyyy}`;
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
          <div className="button-action-horasi">
            {(selectedRole === "Académico" ||
              selectedRole === "Administrativo") && (
              <button
                className="add-horasiRegresar"
                onClick={handleViewDetails}
              >
                <FaChevronLeft className="icon-horasiRegresar" /> Regresar
              </button>
            )}
            {selectedRole === "Estudiante" && estado !== "Aprobado" && (
              <button className="add-horasi" onClick={handleButtonClick}>
                Agregar Actividades <IoMdAddCircle className="icon-horasi" />
              </button>
            )}

            <div className="horasies-divider" />
            <h1 className="horasies-titulo"> Bitácora de horas </h1>
            <div className="horasies-divider" />
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id="tooltip-edit">
                  Bitácora de Horas del Estudiante
                </Tooltip>
              }
            >
              <button
                onClick={handleGenerarReporte}
                className="desRep-botton-horasi"
              >
                Descargar Reporte <FaFileDownload />
              </button>
            </OverlayTrigger>
          </div>
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
                        <th
                          onClick={() => requestSort("Fecha")}>
                          Fecha
                          {getClassNamesFor("Fecha") === "ascending" && (
                            <TiArrowUpThick className="icon-up" />
                          )}
                          {getClassNamesFor("Fecha") === "descending" && (
                            <TiArrowDownThick className="icon-down" />
                          )}
                        </th>
                        <th
                          onClick={() => requestSort("DescripcionActividad")}>
                          Descripción de la Actividad
                          {getClassNamesFor("DescripcionActividad") === "ascending" && (
                            <TiArrowUpThick className="icon-up" />
                          )}
                          {getClassNamesFor("DescripcionActividad") === "descending" && (
                            <TiArrowDownThick className="icon-down" />
                          )}
                        </th>
                        <th
                          onClick={() => requestSort("TipoActividad")}>
                          Tipo de Actividad
                          {getClassNamesFor("TipoActividad") === "ascending" && (
                            <TiArrowUpThick className="icon-up" />
                          )}
                          {getClassNamesFor("TipoActividad") === "descending" && (
                            <TiArrowDownThick className="icon-down" />
                          )}
                        </th>
                        <th
                          onClick={() => requestSort("HoraInicio")}>
                          Hora de Inicio
                          {getClassNamesFor("HoraInicio") === "ascending" && (
                            <TiArrowUpThick className="icon-up" />
                          )}
                          {getClassNamesFor("HoraInicio") === "descending" && (
                            <TiArrowDownThick className="icon-down" />
                          )}
                        </th>
                        <th
                          onClick={() => requestSort("HoraFinal")}>
                          Hora Final
                          {getClassNamesFor("HoraFinal") === "ascending" && (
                            <TiArrowUpThick className="icon-up" />
                          )}
                          {getClassNamesFor("HoraFinal") === "descending" && (
                            <TiArrowDownThick className="icon-down" />
                          )}
                        </th>
                        <th onClick={() => requestSort("NombreEvidencia")}>
                          Evidencia
                          {getClassNamesFor("NombreEvidencia") === "ascending" && (
                            <TiArrowUpThick className="icon-up" />
                          )}
                          {getClassNamesFor("NombreEvidencia") === "descending" && (
                            <TiArrowDownThick className="icon-down" />
                          )}
                        </th>
                        {selectedRole === "Académico" &&
                          estado !== "Aprobado" && <th></th>}
                      </tr>
                    </thead>
                    <tbody className="apro-tbody">
                      {currentApprovedMaterias.map((materia) => (
                        <tr key={materia.BitacoraId}>
                          <td>{formatDate(materia.Fecha)}</td>
                          <td>{materia.DescripcionActividad}</td>
                          <td>{materia.TipoActividad}</td>
                          <td>{formatTime(materia.HoraInicio)}</td>
                          <td>{formatTime(materia.HoraFinal)}</td>
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
                                <OverlayTrigger
                                  placement="top"
                                  overlay={
                                    <Tooltip id="tooltip-edit">
                                      Rechazar Horas
                                    </Tooltip>
                                  }
                                >
                                  <button
                                    className="icon-btn-acade"
                                    onClick={() =>
                                      handleEditClick(materia.BitacoraId)
                                    }
                                  >
                                    <BiSolidCommentX />
                                  </button>
                                </OverlayTrigger>
                              </td>
                            )}
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
                      <button
                        onClick={handlePreviousPageApro}
                        disabled={currentPageApro === 1}
                      >
                        <GrFormPreviousLink />
                      </button>
                    </OverlayTrigger>

                    <span>
                      {currentPageApro} de{" "}
                      {Math.ceil(
                        filteredApprovedMaterias.length / materiasPerPage
                      )}
                    </span>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id="tooltip-edit">Siguiente</Tooltip>}
                    >
                      <button
                        onClick={handleNextPageApro}
                        disabled={
                          currentPageApro ===
                          Math.ceil(
                            filteredApprovedMaterias.length / materiasPerPage
                          )
                        }
                      >
                        <GrFormNextLink />
                      </button>
                    </OverlayTrigger>
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
                        <th onClick={() => requestSortRecha("Fecha")}>
                          Fecha
                          {getClassNamesForRecha("Fecha") === "ascending" && (
                            <TiArrowUpThick className="icon-up" />
                          )}
                          {getClassNamesForRecha("Fecha") === "descending" && (
                            <TiArrowDownThick className="icon-down" />
                          )}
                        </th>
                        <th
                          onClick={() => requestSortRecha("DescripcionActividad")}>
                          Descripción de la Actividad
                          {getClassNamesForRecha("DescripcionActividad") === "ascending" && (
                            <TiArrowUpThick className="icon-up" />
                          )}
                          {getClassNamesForRecha("DescripcionActividad") === "descending" && (
                            <TiArrowDownThick className="icon-down" />
                          )}
                        </th>
                        <th
                          onClick={() => requestSortRecha("TipoActividad")}>
                          Tipo de Actividad
                          {getClassNamesForRecha("TipoActividad") === "ascending" && (
                            <TiArrowUpThick className="icon-up" />
                          )}
                          {getClassNamesForRecha("TipoActividad") === "descending" && (
                            <TiArrowDownThick className="icon-down" />
                          )}
                        </th>
                        <th onClick={() => requestSortRecha("ComentariosRechazo")}>
                          Comentarios de Rechazo
                          {getClassNamesForRecha("ComentariosRechazo") === "ascending" && (
                            <TiArrowUpThick className="icon-up" />
                          )}
                          {getClassNamesForRecha("ComentariosRechazo") === "descending" && (
                            <TiArrowDownThick className="icon-down" />
                          )}
                        </th>
                        {selectedRole === "Estudiante" &&
                          estado !== "Aprobado" && <th></th>}
                      </tr>
                    </thead>
                    <tbody className="apro-tbody">
                      {currentRejectedMaterias.map((materia) => (
                        <tr key={materia.BitacoraId}>
                          <td>{formatDate(materia.Fecha)}</td>
                          <td>{materia.DescripcionActividad}</td>
                          <td>{materia.TipoActividad}</td>
                          <td>{materia.ComentariosRechazo}</td>
                          {selectedRole === "Estudiante" &&
                            estado !== "Aprobado" && (
                              <td>
                                <OverlayTrigger
                                  placement="top"
                                  overlay={
                                    <Tooltip id="tooltip-edit">
                                      Modificar Registro
                                    </Tooltip>
                                  }
                                >
                                  <button
                                    className="icon-btn-acade"
                                    onClick={() =>
                                      handleEditClick2(materia.BitacoraId)
                                    }
                                  >
                                    <FaEdit />
                                  </button>
                                </OverlayTrigger>
                              </td>
                            )}
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
                      <button
                        onClick={handlePreviousPageRejected}
                        disabled={currentPageRejected === 1}
                      >
                        <GrFormPreviousLink />
                      </button>
                    </OverlayTrigger>
                    <span>
                      {currentPageRejected} de{" "}
                      {Math.ceil(
                        filteredRejectedMaterias.length / materiasPerPage
                      )}
                    </span>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id="tooltip-edit">Siguiente</Tooltip>}
                    >
                      <button
                        onClick={handleNextPageRejected}
                        disabled={
                          currentPageRejected ===
                          Math.ceil(
                            filteredRejectedMaterias.length / materiasPerPage
                          )
                        }
                      >
                        <GrFormNextLink />
                      </button>
                    </OverlayTrigger>
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
      {/* Botón flotante de scroll */}
      {showScrollButton && (
        <button className="scroll-to-top" onClick={handleScrollToTop}>
          <TiArrowUpThick />
        </button>
      )}
    </div>
  );
}

export default VistaHorasEstudiante;
