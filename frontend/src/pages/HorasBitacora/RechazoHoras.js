import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./RechazoHoras.modulo.css";
import { FaChevronLeft } from "react-icons/fa6";
import { FaSave } from "react-icons/fa";
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
        setError(
          "Error al rechazar la actividad. Por favor, inténtelo de nuevo."
        );
      }
    } catch (error) {
      setError("Error al enviar la solicitud. Por favor, inténtelo de nuevo.");
    }
  };

  const handleBackClick = () => {
    sessionStorage.removeItem("BitacoraId");
    navigate("/VistaHorasEstudiantes");
  };

  return (
    <div className="rechazo-container">
      <div className="rechazo-content">
        <h1 className="rechazo-title">Rechazo de Horas</h1>
        <div className="rechazo-divider" />
        <form onSubmit={handleSubmit}>
          <div className="rechazo-inputcontainer">
            <textarea
              type="text"
              id="comentariosRechazo"
              name="comentariosRechazo"
              value={comentariosRechazo}
              onChange={(e) => setComentariosRechazo(e.target.value)}
              className="rechazo-input"
              placeholder="Ingrese los comentarios de rechazo"
            />
          </div>
          <div className="rechazo-buttons-container">
            <button onClick={handleBackClick} className="rechazo-button">
              <FaChevronLeft />
              Regresar
            </button>
            &nbsp;
            <button type="submit" className="rechazo-button">
              Guardar <FaSave />
            </button>
          </div>
        </form>
        {error && <p className="error-message">{error}</p>}
        <ToastContainer position="bottom-right" />
      </div>
    </div>
  );
}

export default RechazoHoras;
