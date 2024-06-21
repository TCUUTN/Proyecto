import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdEmail } from "react-icons/md";
import "./Olvidar.modulo.css";

function OlvidarClave() {
  const [CorreoElectronico, setCorreoElectronico] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
        setError("El correo ingresado no es válido, favor verificar.");
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
        <h1 className="title">¿Olvidaste tu contraseña?</h1>
        <hr className="Title-linea" />
        <form onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <label htmlFor="currentPassword" className="input-label">
              Por favor, ingresa tu dirección de correo electrónico y te
              enviaremos instrucciones para restablecer tu contraseña.
            </label>
            <div className="input-container">
              <MdEmail className="icon" />
              <input
                type="text"
                id="email"
                name="email"
                placeholder="Correo electrónico"
                value={CorreoElectronico}
                onChange={(e) => setCorreoElectronico(e.target.value)}
              />
            </div>
          </div>
          <button type="submit" className="olvidar-button" disabled={loading}>
            Enviar
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
        <ToastContainer position="bottom-right" />
      </div>
    </div>
  );
}

export default OlvidarClave;
