import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { RiEdit2Fill } from "react-icons/ri";
import { IoMdAddCircle } from "react-icons/io";
import { SlEnvolopeLetter } from "react-icons/sl";
import { TiArrowUpThick } from "react-icons/ti"; // Importar el icono de flecha
import { ToastContainer, toast } from "react-toastify";
import { GrFormPreviousLink, GrFormNextLink } from "react-icons/gr";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import { TiArrowDownThick } from "react-icons/ti";
import "./ListaSocios.css";
// Componente principal para manejar las solicitudes de cartas
function SolicitudesCarta() {
  // Estados para manejar la paginación y las listas de solicitudes
  const [currentPagePending, setCurrentPagePending] = useState(1);
  const [currentPageCompleted, setCurrentPageCompleted] = useState(1);
  const [solicitudesPendientes, setSolicitudesPendientes] = useState([]);
  const [solicitudesCompletadas, setSolicitudesCompletadas] = useState([]);
  const [searchSocioPendientes, setSearchSocioPendientes] = useState("");
  const [searchEstudiantePendientes, setSearchEstudiantePendientes] =
    useState("");
  const [searchSocioCompletadas, setSearchSocioCompletadas] = useState("");
  const [searchEstudianteCompletadas, setSearchEstudianteCompletadas] =
    useState("");
  const [searchCartaCompletadas, setSearchCartaCompletadas] = useState("");
  const navigate = useNavigate();

  // Estado para manejar la visibilidad del botón de scroll
  const [showScrollButton, setShowScrollButton] = useState(false);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

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

  // useEffect para obtener los datos de las solicitudes al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      const role = sessionStorage.getItem("SelectedRole");
      let url = "";
      // Determinar la URL de la API en función del rol del usuario
      if (role === "Académico") {
        const identificacion = sessionStorage.getItem("Identificacion");
        url = `/socios/SolicitudesPorAcademico/${identificacion}`;
      } else if (role === "Administrativo") {
        const sede = sessionStorage.getItem("Sede");
        if (sede === "Todas") {
          url = `/socios/Solicitudes`;
        } else {
          url = `/socios/SolicitudesPorSede/${sede}`;
        }
      }
      // Fetch de datos y actualización de estados
      try {
        const response = await fetch(url);
        const data = await response.json();
        const pendientes = data.filter((item) => item.NombreCarta === "-");
        const completadas = data.filter((item) => item.NombreCarta !== "-");
        setSolicitudesPendientes(pendientes);
        setSolicitudesCompletadas(completadas);
        // Mostrar mensaje de éxito si la bandera está activada
        const banderaEnviado = sessionStorage.getItem("BanderaEnviado");
        if (banderaEnviado === "true") {
          toast.success(
            "La carta se cargó al sistema y ha sido enviada con éxito"
          );
          sessionStorage.removeItem("BanderaEnviado");
        }
      } catch (error) {
        toast.error("Error obteniendo la bandera: ", error);
      }
    };

    fetchData();
  }, []);
  // Función para manejar la navegación a la página de creación/edición de solicitudes
  const handleAddSolicitud = () => {
    navigate("/CrearActualizarSolicitudesCartas");
  };
  // Funciones para manejar la paginación de solicitudes pendientes
  const handleNextPagePending = () => {
    setCurrentPagePending((prevPage) => prevPage + 1);
  };

  const handlePreviousPagePending = () => {
    setCurrentPagePending((prevPage) =>
      prevPage > 1 ? prevPage - 1 : prevPage
    );
  };
  // Funciones para manejar la paginación de solicitudes completadas
  const handleNextPageCompleted = () => {
    setCurrentPageCompleted((prevPage) => prevPage + 1);
  };

  const handlePreviousPageCompleted = () => {
    setCurrentPageCompleted((prevPage) =>
      prevPage > 1 ? prevPage - 1 : prevPage
    );
  };
  // Filtrar las solicitudes pendientes en función de los criterios de búsqueda
  const filteredPendientes = solicitudesPendientes.filter(
    (item) =>
      item.Socios_RegistroSocio.NombreSocio &&
      item.Socios_RegistroSocio.NombreSocio.toLowerCase().includes(
        searchSocioPendientes.toLowerCase()
      ) &&
      (item.EstudiantesCarta.length === 0 ||
        item.EstudiantesCarta.some((estudiante) =>
          `${estudiante.Usuario.Nombre} ${estudiante.Usuario.Apellido1} ${estudiante.Usuario.Apellido2}`
            .toLowerCase()
            .includes(searchEstudiantePendientes.toLowerCase())
        ))
  );
  // Filtrar las solicitudes completadas en función de los criterios de búsqueda
  const filteredCompletadas = solicitudesCompletadas.filter(
    (item) =>
      item.Socios_RegistroSocio.NombreSocio &&
      item.Socios_RegistroSocio.NombreSocio.toLowerCase().includes(
        searchSocioCompletadas.toLowerCase()
      ) &&
      item.EstudiantesCarta.some((estudiante) =>
        `${estudiante.Usuario.Nombre} ${estudiante.Usuario.Apellido1} ${estudiante.Usuario.Apellido2}`
          .toLowerCase()
          .includes(searchEstudianteCompletadas.toLowerCase())
      ) &&
      item.NombreCarta &&
      item.NombreCarta.toLowerCase().includes(
        searchCartaCompletadas.toLowerCase()
      )
  );
  // Manejar la descarga de cartas
  const handleDescargaCarta = async (SolicitudId) => {
    try {
      const response = await fetch(`/socios/descargarCarta/${SolicitudId}`);
      if (response.ok) {
        const data = await response.json();
        const fileName = encodeURIComponent(data);

        const fileResponse = await fetch(`/${fileName}`);
        if (fileResponse.ok) {
          const blob = await fileResponse.blob();
          const url = window.URL.createObjectURL(blob);

          const a = document.createElement("a");
          a.href = url;
          a.download = data;
          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            fetch(`/socios/eliminarCarta/${fileName}`, {
              method: "DELETE",
            });
          }, 100);
        } else {
          toast.error("Fallo al descargar el archivo");
        }
      }
    } catch (error) {
      toast.error("Error al manejar la descarga del archivo:", error);
    }
  };
  // Manejar la edición de solicitudes
  const handleEditSolicitud = (SolicitudId) => {
    localStorage.setItem("SolicitudIdSeleccionada", SolicitudId);
    navigate("/CrearActualizarSolicitudesCartas");
  };
  // Manejar el envío de cartas
  const handleSendLetter = (SolicitudId) => {
    localStorage.setItem("SolicitudIdSeleccionada", SolicitudId);
    navigate("/VerSolicitudes");
  };
  // Lógica para ordenar solicitudes pendientes
  const sortedPendientes = useMemo(() => {
    let sortable = [...filteredPendientes];
    if (sortConfig.key) {
      sortable.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

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
  }, [filteredPendientes, sortConfig]);

  // Lógica para ordenar solicitudes completadas
  const sortedCompletadas = useMemo(() => {
    let sortable = [...filteredCompletadas];
    if (sortConfig.key) {
      sortable.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

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
  }, [filteredCompletadas, sortConfig]);

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

  // Constantes para la paginación
  const role = sessionStorage.getItem("SelectedRole");
  const ITEMS_PER_PAGE = 10;
  const pendingPages = Math.ceil(filteredPendientes.length / ITEMS_PER_PAGE);
  const completedPages = Math.ceil(filteredCompletadas.length / ITEMS_PER_PAGE);
  const pendingStartIndex = (currentPagePending - 1) * ITEMS_PER_PAGE;
  const completedStartIndex = (currentPageCompleted - 1) * ITEMS_PER_PAGE;

  return (
    <div className="sociocomunitario-container">
      <main>
        <div className="sociocomu-sidebar">
          <div className="action-sociocomu">
            {role === "Académico" && (
              <button className="add-sociocomu" onClick={handleAddSolicitud}>
                Agregar <IoMdAddCircle className="icon-socio" />
              </button>
            )}
            {role === "Académico" && <div className="socio-divider" />}
            <h1 className="sociocomu-titulo">Solicitudes de Carta</h1>
          </div>
        </div>

        <div className="solicitud-section">
          <h2 className="solicitud-title">Solicitudes Pendientes</h2>
          <div className="socios-divider" />
          <div className="filters-sociocomu">
            <div className="filter-group-sociocomu">
              <label className="filter-label-sociocomu">
                Búsqueda por Nombre de Socio
              </label>
              <input
                type="text"
                placeholder="Nombre del Socio"
                className="filter-control-sociocomu filter-input-sociocomu"
                value={searchSocioPendientes}
                onChange={(e) => setSearchSocioPendientes(e.target.value)}
              />
            </div>
            <div className="filter-group-sociocomu">
              <label className="filter-label-sociocomu">
                Búsqueda por Nombre del Estudiante
              </label>
              <input
                type="text"
                placeholder="Nombre Completo"
                className="filter-control-sociocomu filter-input-sociocomu"
                value={searchEstudiantePendientes}
                onChange={(e) => setSearchEstudiantePendientes(e.target.value)}
              />
            </div>
          </div>
          {filteredPendientes.length > 0 ? (
            <div className="table-container-socioc">
              <table className="table-socioc">
                <thead className="thead-socioc">
                  <tr>
                    <th
                      onClick={() =>
                        requestSort("solicitud.Socios_RegistroSocio.NombreSocio")
                      }
                    >
                      Socio
                      {getClassNamesFor("solicitud.Socios_RegistroSocio.NombreSocio") ===
                        "ascending" && <TiArrowUpThick className="icon-up" />}
                      {getClassNamesFor("solicitud.Socios_RegistroSocio.NombreSocio") ===
                        "descending" && (
                        <TiArrowDownThick className="icon-down" />
                      )}
                    </th>
                    <th onClick={() => requestSort("EstudiantesCarta")}>
                      Estudiante
                      {getClassNamesFor("EstudiantesCarta") === "ascending" && (
                        <TiArrowUpThick className="icon-up" />
                      )}
                      {getClassNamesFor("EstudiantesCarta") ===
                        "descending" && (
                        <TiArrowDownThick className="icon-down" />
                      )}
                    </th>
                    <th></th>
                  </tr>
                </thead>
                <tbody className="tbody-socioc">
                  {sortedPendientes
                    .slice(
                      pendingStartIndex,
                      pendingStartIndex + ITEMS_PER_PAGE
                    )
                    .map((solicitud, index) => (
                      <tr key={index}>
                        <td>{solicitud.Socios_RegistroSocio.NombreSocio}</td>
                        <td>
                          {solicitud.EstudiantesCarta.map((estudiante) => (
                            <div key={estudiante.Usuario.Nombre}>
                              {`${estudiante.Usuario.Nombre} ${estudiante.Usuario.Apellido1} ${estudiante.Usuario.Apellido2}`}
                            </div>
                          ))}
                        </td>
                        <td>
                          {role === "Académico" && (
                            <OverlayTrigger
                              placement="top"
                              overlay={
                                <Tooltip id="tooltip-edit">
                                  Editar Solicitud
                                </Tooltip>
                              }
                            >
                              <button
                                className="icon-btn--sociocomu"
                                onClick={() =>
                                  handleEditSolicitud(solicitud.SolicitudId)
                                }
                              >
                                <RiEdit2Fill />
                              </button>
                            </OverlayTrigger>
                          )}
                          {role === "Administrativo" && (
                            <OverlayTrigger
                              placement="top"
                              overlay={
                                <Tooltip id="tooltip-edit">
                                  Revisar Solicitud
                                </Tooltip>
                              }
                            >
                              <button
                                className="icon-btn--sociocomu"
                                onClick={() =>
                                  handleSendLetter(solicitud.SolicitudId)
                                }
                              >
                                <SlEnvolopeLetter />
                              </button>
                            </OverlayTrigger>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-results-sociocomu">No se encontraron resultados</p>
          )}
          <div className="pagination-sociocomu">
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id="tooltip-edit">Anterior</Tooltip>}
            >
              <button
                onClick={handlePreviousPagePending}
                disabled={currentPagePending === 1}
              >
                <GrFormPreviousLink />
              </button>
            </OverlayTrigger>
            <span className="pagination-info-sociocomu">
              {currentPagePending} de {pendingPages}
            </span>
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id="tooltip-edit">Siguiente</Tooltip>}
            >
              <button
                onClick={handleNextPagePending}
                disabled={currentPagePending === pendingPages}
              >
                <GrFormNextLink />
              </button>
            </OverlayTrigger>
          </div>
        </div>

        <div className="solicitud-section">
          <h2 className="solicitud-title">Solicitudes Completadas</h2>
          <div className="socios-divider" />
          <div className="filters-sociocomu">
            <div className="filter-group-sociocomu">
              <label className="filter-label-sociocomu">
                Búsqueda por Nombre de Socio
              </label>
              <input
                type="text"
                placeholder="Nombre del Socio"
                className="filter-control-sociocomu filter-input-sociocomu"
                value={searchSocioCompletadas}
                onChange={(e) => setSearchSocioCompletadas(e.target.value)}
              />
            </div>
            <div className="filter-group-sociocomu">
              <label className="filter-label-sociocomu">
                Búsqueda por Nombre del Estudiante
              </label>
              <input
                type="text"
                placeholder="Nombre Completo"
                className="filter-control-sociocomu filter-input-sociocomu"
                value={searchEstudianteCompletadas}
                onChange={(e) => setSearchEstudianteCompletadas(e.target.value)}
              />
            </div>
            <div className="filter-group-sociocomu">
              <label className="filter-label-sociocomu">
                Búsqueda por Nombre de Carta
              </label>
              <input
                type="text"
                placeholder="Nombre de la Carta"
                className="filter-control-sociocomu filter-input-sociocomu"
                value={searchCartaCompletadas}
                onChange={(e) => setSearchCartaCompletadas(e.target.value)}
              />
            </div>
          </div>
          {filteredCompletadas.length > 0 ? (
            <div className="table-container-socioc">
              <table className="table-socioc">
                <thead className="thead-socioc">
                  <tr>
                    <th
                      onClick={() =>
                        requestSort("NombreSocio")
                      }
                    >
                      Socio
                      {getClassNamesFor("NombreSocio") ===
                        "ascending" && <TiArrowUpThick className="icon-up" />}
                      {getClassNamesFor("NombreSocio") ===
                        "descending" && (
                        <TiArrowDownThick className="icon-down" />
                      )}
                    </th>
                    <th onClick={() => requestSort("EstudiantesCarta")}>
                      Estudiantes
                      {getClassNamesFor("EstudiantesCarta") === "ascending" && (
                        <TiArrowUpThick className="icon-up" />
                      )}
                      {getClassNamesFor("EstudiantesCarta") ===
                        "descending" && (
                        <TiArrowDownThick className="icon-down" />
                      )}
                    </th>
                    <th onClick={() => requestSort("NombreCarta")}>
                      Carta
                      {getClassNamesFor("NombreCarta") === "ascending" && (
                        <TiArrowUpThick className="icon-up" />
                      )}
                      {getClassNamesFor("NombreCarta") === "descending" && (
                        <TiArrowDownThick className="icon-down" />
                      )}
                    </th>
                  </tr>
                </thead>
                <tbody className="tbody-socioc">
                  {sortedCompletadas
                    .slice(
                      completedStartIndex,
                      completedStartIndex + ITEMS_PER_PAGE
                    )
                    .map((solicitud, index) => (
                      <tr key={index}>
                        <td>{solicitud.Socios_RegistroSocio.NombreSocio}</td>
                        <td>
                          {solicitud.EstudiantesCarta.map((estudiante) => (
                            <div key={estudiante.Usuario.Nombre}>
                              {`${estudiante.Usuario.Nombre} ${estudiante.Usuario.Apellido1} ${estudiante.Usuario.Apellido2}`}
                            </div>
                          ))}
                        </td>
                        <td>
                          <button
                            className="btn-link-carta"
                            onClick={() =>
                              handleDescargaCarta(solicitud.SolicitudId)
                            }
                          >
                            {solicitud.NombreCarta}
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-results-sociocomu">No se encontraron resultados</p>
          )}
          <div className="pagination-sociocomu">
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id="tooltip-edit">Anterior</Tooltip>}
            >
              <button
                onClick={handlePreviousPageCompleted}
                disabled={currentPageCompleted === 1}
              >
                <GrFormPreviousLink />
              </button>
            </OverlayTrigger>
            <span className="pagination-info-sociocomu">
              {currentPageCompleted} de {completedPages}
            </span>
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id="tooltip-edit">Siguiente</Tooltip>}
            >
              <button
                onClick={handleNextPageCompleted}
                disabled={
                  currentPageCompleted === completedPages ||
                  completedPages === 0
                }
              >
                <GrFormNextLink />
              </button>
            </OverlayTrigger>
          </div>
        </div>
        <ToastContainer position="bottom-right" />
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

export default SolicitudesCarta;
