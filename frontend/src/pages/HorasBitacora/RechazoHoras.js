import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./RechazoHoras.module.css";
import { FaChevronLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

function RechazoHoras() {
  const [comentariosRechazo, setComentariosRechazo] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!comentariosRechazo) {
      setError("Por favor, ingrese los comentarios de rechazo.");
      return;
    }

    const bitacoraId = sessionStorage.getItem("BitacoraId");

    console.log(bitacoraId);
    if (!bitacoraId) {
      setError("No se encontró el ID de la bitácora.");
      return;
    }

    try {
      const response = await fetch("horas/rechazarHoras", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BitacoraId: bitacoraId,
          ComentariosRechazo: comentariosRechazo,
        }),
      });

      if (response.ok) {
        // Mostrar notificación de éxito
        toast.success("La actividad se ha rechazado correctamente");

        // Borrar el BitacoraId del sessionStorage
        sessionStorage.removeItem("BitacoraId");

        // Redirigir a la página VistaHorasEstudiantes
        window.location.href = "/VistaHorasEstudiantes";
      } else {
        setError("Error al rechazar la actividad. Por favor, inténtelo de nuevo.");
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      setError("Error al enviar la solicitud. Por favor, inténtelo de nuevo.");
    }
  };

  const handleBackClick = () => {
    sessionStorage.removeItem("BitacoraId");
    navigate("/VistaHorasEstudiantes");
  };

  return (
    <div className="perfil-container">
      
      <div className="perfil-content">
      <div className="regred-action">
            <button onClick={handleBackClick}
              className="back-button" >
              <FaChevronLeft />
              Regresar
            </button>
          </div>
        <h1 className="home-title">Rechazo de Horas</h1>
        <hr className="perfil-divider" />
        <form onSubmit={handleSubmit}>
          <div className="perfil-input-container">
            <input
              type="text"
              id="comentariosRechazo"
              name="comentariosRechazo"
              value={comentariosRechazo}
              onChange={(e) => setComentariosRechazo(e.target.value)}
              className="perfil-input"
              placeholder="Ingrese los comentarios de rechazo"
            />
          </div>
          <button type="submit" className="perfil-button">
            Enviar
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
        <ToastContainer position="bottom-right" />
      </div>
    </div>
  );
}

export default RechazoHoras;
