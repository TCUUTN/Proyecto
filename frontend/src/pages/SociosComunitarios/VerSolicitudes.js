import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa6";
import { RiMailSendLine } from "react-icons/ri";
import "./VerSolicitud.css";
import { BsUpload } from "react-icons/bs";
import { toast, ToastContainer } from "react-toastify";
/**
 * Componente para ver las solicitudes y gestionar la subida de cartas.
 */
function VerSolicitudes() {
   // Hook para la navegación programática
  const navigate = useNavigate();
  // Estados del componente
  const [socioNombre, setSocioNombre] = useState("");
  const [estudiantes, setEstudiantes] = useState([]);
  const [file, setFile] = useState(null);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [fileName, setFileName] = useState(""); // Estado para manejar el nombre del archivo
  const [isLoading, setIsLoading] = useState(false); // Estado para manejar la pantalla de carga
// Hook para obtener los datos de la solicitud cuando el componente se monta
  useEffect(() => {
    const fetchData = async () => {
      const solicitudId = localStorage.getItem("SolicitudIdSeleccionada");
      if (!solicitudId) {
        navigate("/SolicitudCartas");
        return;
      }

      try {
        const response = await fetch(`/socios/Solicitudes/${solicitudId}`);
        if (!response.ok) {
          throw new Error("Error fetching data");
        }
        const data = await response.json();
        setSocioNombre(data.Socios_RegistroSocio.NombreSocio);
        setEstudiantes(data.estudiantesCarta);
      } catch (error) {
        toast.error("Error obteniendo la solicitud: ", error);
      }
    };

    fetchData();
  }, [navigate]);
 /**
   * Maneja el clic en el botón de regreso.
   * Elimina la solicitud seleccionada del almacenamiento local y navega a la página de solicitudes.
   */
  const handleBackClick = () => {
    localStorage.removeItem("SolicitudIdSeleccionada");
    navigate("/SolicitudCartas");
  };
  /**
   * Maneja el cambio de archivo en el input de tipo file.
   * @param {Object} event - El evento de cambio.
   */
  const handleFileChange = (event) => {
    setIsLoading(true); // Mostrar pantalla de carga
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile ? selectedFile.name : ""); // Guardar el nombre del archivo
    setIsLoading(false); // Ocultar pantalla de carga
    setIsFileSelected(!!selectedFile);
  };
/**
   * Maneja el envío del formulario.
   * @param {Object} event - El evento de envío del formulario.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true); // Mostrar pantalla de carga
    if (!file) return;

    const solicitudId = localStorage.getItem("SolicitudIdSeleccionada");
    const formData = new FormData();
    formData.append("Carta", file);
    formData.append("SolicitudId", solicitudId);

    try {
      const response = await fetch("/socios/GuardaryEnviarCarta", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        localStorage.removeItem("SolicitudIdSeleccionada");
        sessionStorage.setItem("BanderaEnviado", "true");
        navigate("/SolicitudCartas");
      } else {
        toast.error("Error cargando el archivo");
      }
    } catch (error) {
      toast.error("Error uploading file: ", error);
    }finally{
      setIsLoading(false);
    }
  };

  return (
    <div className="versolicart-container">
          <ToastContainer position="bottom-right" />

      {/*Para la carga */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
      {/**/}
      <div className="solicitud-socio-seleccionado">
        <h3 className="title-versolicart">
          Socio Seleccionado:
        </h3>
        <h3 className="title-versolicart" id="NombreSocioSeleccionadoVer">
          {socioNombre}
        </h3>
      </div>
      <div className="versolicart-divider" />
      <div className="content-versolicart">
        <div className="left-versolicart">
          <h2 className="subtitle-versolicart">Estudiantes Seleccionados</h2>
          <table className="table-versolicart">
            <thead className="thead-versolicart">
              <tr>
                <th>Nombre Completo</th>
              </tr>
            </thead>
            <tbody className="tbody-versolicart">
              {estudiantes.map((estudiante, index) => (
                <tr key={index}>
                  <td>
                    {`${estudiante.Usuario.Identificacion} - ${estudiante.Usuario.Nombre} ${estudiante.Usuario.Apellido1} ${estudiante.Usuario.Apellido2}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="versolicart-divider-vertical"></div>
        <div className="right-versolicart">
          <h2 className="subtitle-versolicart">Adjuntar Carta</h2>
          <form className="form-versolicart" onSubmit={handleSubmit}>
            <div className="SubirCartas-Soli">
              <label htmlFor="fileinput" className="solicar-upload-label">
                <BsUpload className="icon-cartSolicitud" /> Subir carta
              </label>
              <input
                id="fileinput"
                className="fileinput-versolicart"
                type="file"
                onChange={handleFileChange}
              />
              <div className="filename-container-versoli">
                {fileName && (
                  <span className="file-name-versoli">{fileName}</span>
                )}
              </div>
            </div>
            <div className="buttons-versolicart">
              <button
                className="back-button-versolicart"
                type="button"
                onClick={handleBackClick}
              >
                <FaChevronLeft />
                Regresar
              </button>
              <button
                className="submit-button-versolicart"
                type="submit"
                disabled={!isFileSelected}
              >
                Enviar Carta &nbsp;
                <RiMailSendLine />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default VerSolicitudes;
