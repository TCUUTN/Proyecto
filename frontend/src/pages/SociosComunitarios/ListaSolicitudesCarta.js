import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RiEdit2Fill } from "react-icons/ri";
import { IoMdAddCircle } from "react-icons/io";
import { SlEnvolopeLetter } from "react-icons/sl";
import { ToastContainer, toast } from "react-toastify";
import { GrFormPreviousLink, GrFormNextLink } from "react-icons/gr";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import "./ListaSocios.css";

function SolicitudesCarta() {
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

  useEffect(() => {
    const fetchData = async () => {
      const role = sessionStorage.getItem("SelectedRole");
      let url = "";
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

      try {
        const response = await fetch(url);
        const data = await response.json();
        const pendientes = data.filter((item) => item.NombreCarta === "-");
        const completadas = data.filter((item) => item.NombreCarta !== "-");
        setSolicitudesPendientes(pendientes);
        setSolicitudesCompletadas(completadas);
        const banderaEnviado = sessionStorage.getItem("BanderaEnviado");
        if (banderaEnviado === "true") {
          toast.success(
            "La carta se cargó al sistema y ha sido enviada con éxito"
          );
          sessionStorage.removeItem("BanderaEnviado");
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  const handleAddSolicitud = () => {
    navigate("/CrearActualizarSolicitudesCartas");
  };

  const handleNextPagePending = () => {
    setCurrentPagePending((prevPage) => prevPage + 1);
  };

  const handlePreviousPagePending = () => {
    setCurrentPagePending((prevPage) =>
      prevPage > 1 ? prevPage - 1 : prevPage
    );
  };

  const handleNextPageCompleted = () => {
    setCurrentPageCompleted((prevPage) => prevPage + 1);
  };

  const handlePreviousPageCompleted = () => {
    setCurrentPageCompleted((prevPage) =>
      prevPage > 1 ? prevPage - 1 : prevPage
    );
  };

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
          console.log("Fallo al descargar el archivo");
        }
      } else {
        console.log("Fallo al extraer imagen");
      }
    } catch (error) {
      console.error("Error al manejar la descarga del archivo:", error);
    }
  };

  const handleEditSolicitud = (SolicitudId) => {
    localStorage.setItem("SolicitudIdSeleccionada", SolicitudId);
    navigate("/CrearActualizarSolicitudesCartas");
  };

  const handleSendLetter = (SolicitudId) => {
    localStorage.setItem("SolicitudIdSeleccionada", SolicitudId);
    navigate("/VerSolicitudes");
  };

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
                    <th>Socio</th>
                    <th>Estudiante</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody className="tbody-socioc">
                  {filteredPendientes
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
                    <th>Socio</th>
                    <th>Estudiantes</th>
                    <th>Carta</th>
                  </tr>
                </thead>
                <tbody className="tbody-socioc">
                  {filteredCompletadas
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
    </div>
  );
}

export default SolicitudesCarta;
