import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa6";
import { RiMailSendLine } from "react-icons/ri";
import "./VerSolicitud.css";
import { BsUpload } from "react-icons/bs";

function VerSolicitudes() {
  const navigate = useNavigate();
  const [socioNombre, setSocioNombre] = useState("");
  const [estudiantes, setEstudiantes] = useState([]);
  const [file, setFile] = useState(null);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Estado para manejar la pantalla de carga

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
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, [navigate]);

  const handleBackClick = () => {
    localStorage.removeItem("SolicitudIdSeleccionada");
    navigate("/SolicitudCartas");
  };

  const handleFileChange = (event) => {
    setIsLoading(true); // Mostrar pantalla de carga
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setIsLoading(false); // Ocultar pantalla de carga
    setIsFileSelected(!!selectedFile);
    
  };

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
        setIsLoading(false); // Ocultar pantalla de carga
        navigate("/SolicitudCartas");
      } else {
        console.error("Error uploading file");
        setIsLoading(false); // Ocultar pantalla de carga
      }
    } catch (error) {
      console.error("Error uploading file: ", error);
    }
  };

  return (
    <div className="versolicart-container">
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
            <label className="solicar-upload-label">
            <BsUpload className="icon-cartSolicitud"/> Subir carta
            </label>
            <input
              className="fileinput-versolicart"
              type="file"
              onChange={handleFileChange}
            />
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
