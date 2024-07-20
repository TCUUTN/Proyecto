import React, { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { FaChevronLeft } from "react-icons/fa6";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { TiUserDelete, TiUserAdd } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import { BsFillSendPlusFill } from "react-icons/bs";
import "./CrearActualizarSolicitudCartas.css";

function SolicitudCartas() {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [socios, setSocios] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [IdentificacionAcademico] = useState(
    sessionStorage.getItem("Identificacion")
  );
  const [SedeAcademico] = useState(sessionStorage.getItem("Sede"));
  const [estudiantes, setEstudiantes] = useState([]);
  const [selectedSocio, setSelectedSocio] = useState(null);
  const [selectedGrupo, setSelectedGrupo] = useState(null);
  const [selectedEstudiante, setSelectedEstudiante] = useState(null);
  const [selectedEstudiantes, setSelectedEstudiantes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/socios/Activos")
      .then((response) => response.json())
      .then((data) => setSocios(data));

    const solicitudId = localStorage.getItem("SolicitudIdSeleccionada");
    fetch(`/grupos/Academicos/${IdentificacionAcademico}`)
      .then((response) => response.json())
      .then((data) => {
        setGrupos(Array.isArray(data) ? data : []);
        setSelectedGrupo(null);
        setEstudiantes([]);
      });

    if (solicitudId) {
      fetch(`/socios/Solicitudes/${solicitudId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data && data.estudiantesCarta) {
            setSelectedSocio(data.SocioId);
            setSelectedEstudiantes(
              data.estudiantesCarta.map((est) => ({
                id: est.Usuario.Identificacion,
                name: `${est.Usuario.Nombre} ${est.Usuario.Apellido1} ${est.Usuario.Apellido2}`,
              }))
            );
          }
        });
    }
  }, []);

  useEffect(() => {
    if (selectedGrupo) {
      fetch(`/grupos/ListaEstudiantes/${selectedGrupo}`)
        .then((response) => response.json())
        .then((data) => {
          setEstudiantes(data);
          setSelectedEstudiante(null); // Reset the third dropdown to the empty value
        });
    }
  }, [selectedGrupo]);

  const handleBackClick = () => {
    localStorage.removeItem("SolicitudIdSeleccionada");
    navigate("/SolicitudCartas");
  };

  const handleAddEstudiante = () => {
    setLoading(true); // Show loading screen
    const estudianteId = selectedEstudiante.Usuario.Identificacion;
    if (selectedEstudiantes.some((est) => est.id === estudianteId)) {
      toast.error("El estudiante ya se encuentra añadido en la solicitud.");
    } else {
      setSelectedEstudiantes((prev) => [
        ...prev,
        {
          id: selectedEstudiante.Usuario.Identificacion,
          name: `${selectedEstudiante.Usuario.Nombre} ${selectedEstudiante.Usuario.Apellido1} ${selectedEstudiante.Usuario.Apellido2}`,
        },
      ]);
    }
    setSelectedGrupo(null);
    setSelectedEstudiante(null);
    setEstudiantes([]);
    setLoading(false); // Show loading screen
  };

  const handleRemoveEstudiante = (id) => {
    setSelectedEstudiantes((prev) => prev.filter((est) => est.id !== id));
  };

  const handleGuardar = () => {
    setLoading(true); // Show loading screen
    const solicitudId = localStorage.getItem("SolicitudIdSeleccionada");
    const data = {
      SocioId: selectedSocio,
      Sede: SedeAcademico,
      Identificacion: IdentificacionAcademico,
      IdentificacionesEstudiantes: selectedEstudiantes.map((est) => est.id),
    };
    if (solicitudId) {
      data.SolicitudId = solicitudId;
    }
    fetch("/socios/crearOActualizarSolicitudCarta", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then(() => {
        localStorage.removeItem("SolicitudIdSeleccionada");
        localStorage.setItem("SolicitudGuardada", true);
        setLoading(false); // Show loading screen
        navigate("/SolicitudCartas");
      });
  };

  useEffect(() => {
    const socioId = parseInt(selectedSocio); // Convertir selectedSocio a número si es necesario
    const socioSeleccionado = socios.find((s) => s.SocioId === socioId);
    const nombreSocio = socioSeleccionado ? socioSeleccionado.NombreSocio : "";
    const element = document.getElementById("NombreSocioSeleccionado");
    if (element) {
      element.textContent = selectedSocio ? `${nombreSocio}` : "";
    }
  }, [selectedSocio, socios]);

  return (
    <div className="solici-container">
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
      <div className="solici-title">Creación de Solicitud</div>
      <div className="solici-divider" />
      <div className="solici-content">
        <div className="solici-left">
          <select
            className="solici-select"
            onChange={(e) => setSelectedSocio(e.target.value)}
            value={selectedSocio || ""}
          >
            <option value="">Socios</option>
            {socios.map((socio) => (
              <option key={socio.SocioId} value={socio.SocioId}>
                {socio.NombreSocio}
              </option>
            ))}
          </select>
          <div className="solici-filtros">
            <h3 className="titulesolici-filt">Filtros:</h3>
            <select
              className="solici-select"
              onChange={(e) => setSelectedGrupo(e.target.value)}
              value={selectedGrupo || ""}
              disabled={!selectedSocio}
            >
              <option value="">Grupos del Académicos</option>
              {grupos.map((grupo) => (
                <option key={grupo.GrupoId} value={grupo.GrupoId}>
                  {`${grupo.Grupos_TipoGrupo.NombreProyecto} - ${grupo.NumeroGrupo}`}
                </option>
              ))}
            </select>
            <select
              className="solici-select"
              onChange={(e) =>
                setSelectedEstudiante(
                  estudiantes.find(
                    (est) => est.Usuario.Identificacion === e.target.value
                  )
                )
              }
              value={selectedEstudiante?.Usuario.Identificacion || ""}
              disabled={!selectedGrupo}
            >
              <option value="">Lista de Estudiantes</option>
              {estudiantes.map((est) => (
                <option
                  key={est.Usuario.Identificacion}
                  value={est.Usuario.Identificacion}
                >
                  {`${est.Usuario.Nombre} ${est.Usuario.Apellido1} ${est.Usuario.Apellido2}`}
                </option>
              ))}
            </select>
          </div>
          <button
            className="solici-button"
            onClick={handleAddEstudiante}
            disabled={!selectedSocio || !selectedGrupo || !selectedEstudiante}
          >
            <TiUserAdd /> Añadir Estudiante
          </button>
        </div>
        <div className="solici-divider-vertical"></div>
        <div className="solicitud-right">
          <div className="solicitud-socio-seleccionado">
            <h3 className="medTitule-solici">Socio Seleccionado:</h3>
            <h3 className="medTitule-solici" id="NombreSocioSeleccionado"></h3>
          </div>
          <div className="solicitud-estudiantes-seleccionados">
            <h3 className="subtitule-solici">Estudiantes Seleccionados</h3>
            <table className="solici-table">
              <thead className="solici-thead">
                <tr>
                  <th>Nombre Completo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody className="solici-tbody">
                {selectedEstudiantes.map((est) => (
                  <tr key={est.id}>
                    <td>{est.name}</td>
                    <td>
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip id="tooltip-edit">
                            Eliminar Estudiante de la Solicitud
                          </Tooltip>
                        }
                      >
                        <button
                          className="icon-removeEst-button"
                          onClick={() => handleRemoveEstudiante(est.id)}
                        >
                          <TiUserDelete />
                        </button>
                      </OverlayTrigger>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="solicitud-buttons">
            <button
              type="button"
              className="solicitud-button"
              onClick={handleBackClick}
            >
              <FaChevronLeft /> Regresar
            </button>
            <button
              className="solicitud-button"
              onClick={handleGuardar}
              disabled={!selectedSocio || selectedEstudiantes.length === 0}
            >
              Enviar &nbsp; <BsFillSendPlusFill />
            </button>
          </div>
        </div>
        <ToastContainer position="bottom-right" />
      </div>
    </div>
  );
}

export default SolicitudCartas;
