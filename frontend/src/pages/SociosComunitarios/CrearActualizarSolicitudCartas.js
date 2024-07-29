import React, { useState, useEffect } from "react"; // Importación de React y hooks
import "react-toastify/dist/ReactToastify.css"; // Importación de estilos para las notificaciones
import { ToastContainer, toast } from "react-toastify"; // Importación de componentes para notificaciones
import { FaChevronLeft } from "react-icons/fa6"; // Importación de icono de flecha
import { OverlayTrigger, Tooltip } from "react-bootstrap"; // Importación de componentes de Bootstrap
import { TiUserDelete, TiUserAdd } from "react-icons/ti"; // Importación de iconos de usuario
import { useNavigate } from "react-router-dom"; // Importación de hook para navegación
import { BsFillSendPlusFill } from "react-icons/bs"; // Importación de icono de envío
import "./CrearActualizarSolicitudCartas.css"; // Importación de estilos CSS específicos

function SolicitudCartas() {
   // Declaración de estados para el componente
   const [loading, setLoading] = useState(false); // Estado para mostrar pantalla de carga
   const [socios, setSocios] = useState([]); // Estado para almacenar la lista de socios
   const [grupos, setGrupos] = useState([]); // Estado para almacenar la lista de grupos
   const [IdentificacionAcademico] = useState(
     sessionStorage.getItem("Identificacion") // Estado para la identificación del académico
  );
  const [SedeAcademico] = useState(sessionStorage.getItem("Sede")); // Estado para la sede del académico
  const [estudiantes, setEstudiantes] = useState([]); // Estado para almacenar la lista de estudiantes
  const [selectedSocio, setSelectedSocio] = useState(null); // Estado para el socio seleccionado
  const [selectedGrupo, setSelectedGrupo] = useState(null); // Estado para el grupo seleccionado
  const [selectedEstudiante, setSelectedEstudiante] = useState(null); // Estado para el estudiante seleccionado
  const [selectedEstudiantes, setSelectedEstudiantes] = useState([]); // Estado para la lista de estudiantes seleccionados
  const navigate = useNavigate(); // Hook para redirigir al usuario

   // useEffect para cargar datos iniciales
   useEffect(() => {
    // Fetch para obtener la lista de socios activos
    fetch("/socios/Activos")
      .then((response) => response.json())
      .then((data) => setSocios(data)); // Actualiza el estado con la lista de socios

      const solicitudId = localStorage.getItem("SolicitudIdSeleccionada"); // Obtiene el ID de la solicitud seleccionada del localStorage
      // Fetch para obtener los grupos del académico
      fetch(`/grupos/Academicos/${IdentificacionAcademico}`)
        .then((response) => response.json())
        .then((data) => {
          setGrupos(Array.isArray(data) ? data : []); // Actualiza el estado con la lista de grupos
          setSelectedGrupo(null); // Resetea el grupo seleccionado
          setEstudiantes([]); // Resetea la lista de estudiantes
        });
// Si existe un ID de solicitud, obtiene los datos de la solicitud
if (solicitudId) {
  fetch(`/socios/Solicitudes/${solicitudId}`)
    .then((response) => response.json())
    .then((data) => {
      if (data && data.estudiantesCarta) {
        // Si hay datos, actualiza el estado con el socio y los estudiantes seleccionados
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
 // useEffect para cargar la lista de estudiantes cuando se selecciona un grupo
 useEffect(() => {
  if (selectedGrupo) {
    // Fetch para obtener la lista de estudiantes del grupo seleccionado
    fetch(`/grupos/ListaEstudiantes/${selectedGrupo}`)
      .then((response) => response.json())
      .then((data) => {
        setEstudiantes(data); // Actualiza el estado con la lista de estudiantes
        setSelectedEstudiante(null); // Resetea el estudiante seleccionado
      });
  }
}, [selectedGrupo]);
 // Función para manejar el clic en el botón de regresar
 const handleBackClick = () => {
  localStorage.removeItem("SolicitudIdSeleccionada"); // Elimina el ID de solicitud seleccionada del localStorage
  navigate("/SolicitudCartas"); // Navega a la página de SolicitudCartas
};
  // Función para añadir un estudiante a la lista de estudiantes seleccionados
  const handleAddEstudiante = () => {
    setLoading(true); // Muestra pantalla de carga
    const estudianteId = selectedEstudiante.Usuario.Identificacion; // Obtiene la identificación del estudiante seleccionado
    // Verifica si el estudiante ya está añadido a la lista
    if (selectedEstudiantes.some((est) => est.id === estudianteId)) {
      toast.error("El estudiante ya se encuentra añadido en la solicitud."); // Muestra un mensaje de error
    } else {
      // Añade el estudiante a la lista de estudiantes seleccionados
      setSelectedEstudiantes((prev) => [
        ...prev,
        {
          id: selectedEstudiante.Usuario.Identificacion,
          name: `${selectedEstudiante.Usuario.Nombre} ${selectedEstudiante.Usuario.Apellido1} ${selectedEstudiante.Usuario.Apellido2}`,
        },
      ]);
    }
    setSelectedGrupo(null); // Resetea el grupo seleccionado
    setSelectedEstudiante(null); // Resetea el estudiante seleccionado
    setEstudiantes([]); // Resetea la lista de estudiantes
    setLoading(false); // Oculta la pantalla de carga
  };

  // Función para remover un estudiante de la lista de estudiantes seleccionados
  const handleRemoveEstudiante = (id) => {
    setSelectedEstudiantes((prev) => prev.filter((est) => est.id !== id)); // Filtra la lista para remover el estudiante por ID
  };
 // Función para guardar la solicitud
 const handleGuardar = () => {
  setLoading(true); // Muestra pantalla de carga
  const solicitudId = localStorage.getItem("SolicitudIdSeleccionada"); // Obtiene el ID de la solicitud seleccionada del localStorage
  const data = {
    // Datos para enviar en la solicitud
    SocioId: selectedSocio,
    Sede: SedeAcademico,
    Identificacion: IdentificacionAcademico,
    IdentificacionesEstudiantes: selectedEstudiantes.map((est) => est.id), // Obtiene las identificaciones de los estudiantes seleccionados
  };
    if (solicitudId) {
      data.SolicitudId = solicitudId;
    }
  // Fetch para crear o actualizar la solicitud
  fetch("/socios/crearOActualizarSolicitudCarta", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data), // Convierte los datos a JSON
  })
      .then((response) => response.json())
      .then(() => {
        localStorage.removeItem("SolicitudIdSeleccionada"); // Elimina el ID de solicitud seleccionada del localStorage
        localStorage.setItem("SolicitudGuardada", true); // Guarda un indicador de que la solicitud fue guardada
        setLoading(false); // Oculta la pantalla de carga
        navigate("/SolicitudCartas"); // Navega a la página de SolicitudCartas
      });
  };
 // useEffect para actualizar el nombre del socio seleccionado en el DOM
 useEffect(() => {
  const socioId = parseInt(selectedSocio); // Convierte el socio seleccionado a número si es necesario
  const socioSeleccionado = socios.find((s) => s.SocioId === socioId); // Busca el socio seleccionado en la lista de socios
  const nombreSocio = socioSeleccionado ? socioSeleccionado.NombreSocio : ""; // Obtiene el nombre del socio seleccionado
  const element = document.getElementById("NombreSocioSeleccionado"); // Obtiene el elemento del DOM para mostrar el nombre del socio
  if (element) {
    element.textContent = selectedSocio ? `${nombreSocio}` : ""; // Actualiza el contenido del elemento con el nombre del socio
  }
}, [selectedSocio, socios]);
  // Renderiza el componente
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

export default SolicitudCartas;// Exporta el componente para su uso en otras partes de la aplicación
