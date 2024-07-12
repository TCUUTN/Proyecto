import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdEmail } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa6";
import "./Olvidar.modulo.css";

function OlvidarClave() {
  const [CorreoElectronico, setCorreoElectronico] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const showNotificationAfterRedirect = () => {
      const params = new URLSearchParams(window.location.search);
      const mensajeExitoso = params.get("mensajeExitoso");
      if (mensajeExitoso === "true") {
        toast.success(
          "Se ha enviado el correo electrónico con la clave temporal correctamente"
        );
      }
    };

    showNotificationAfterRedirect();
  }, []);

  const handleRegresar = () => {
    sessionStorage.removeItem("IdentificacionUsuario");
    navigate("/");
  };



  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Show loading screen

    try {
      const response = await fetch("/usuarios/olvidoContrasenna", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ CorreoElectronico: CorreoElectronico }),
      });

      if (response.ok) {
        window.location.href = "/?mensajeExitoso=true";
      } else {
        setError("El correo ingresado no es válido o se encuentra desactivado, favor verificar.");
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      setError("Error al enviar la solicitud, por favor intenta de nuevo.");
    } finally {
      setLoading(false); // Hide loading screen
    }
  };

  return (
    <div className="olvidar-container">
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
      <div className="olvidar-form">
        <h1 className="olvidar-title">¿Olvidaste tu contraseña?</h1>
        <div className="olvidar-Title-linea" />
        <form onSubmit={handleSubmit}>
          <div className="olvidar-input-wrapper">
            <label htmlFor="currentPassword" className="olvidar-input-label">
              Por favor, ingresa tu dirección de correo electrónico y te
              enviaremos instrucciones para restablecer tu contraseña.
            </label>
            <div className="olvidar-input-container">
              <MdEmail className="icon-olvidar" />
              <input
                type="text"
                id="email"
                name="email"
                placeholder="Correo electrónico"
                value={CorreoElectronico}
                onChange={(e) => setCorreoElectronico(e.target.value)}
                className="olvidar-input"
              />
              
            </div>{error && <p className="error-message">{error}</p>}
          </div>
          <div className="olvi-button"> 
          <button
            type="button"
            className="olvidar-button" 
            onClick={handleRegresar}
          >
              <FaChevronLeft />
            Regresar
          </button>
          <button type="submit" className="olvidar-button" disabled={loading}>
            Enviar
          </button>
          </div>
          



        </form>
        
        <ToastContainer position="bottom-right" />
      </div>
    </div>
  );
}

export default OlvidarClave;
