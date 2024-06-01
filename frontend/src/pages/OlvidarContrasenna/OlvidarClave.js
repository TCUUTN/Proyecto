import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdEmail } from "react-icons/md";
import "./Olvidar.css";

function OlvidarClave() {
  const [CorreoElectronico, setCorreoElectronico] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Función para mostrar la notificación después de la redirección
    const showNotificationAfterRedirect = () => {
      const params = new URLSearchParams(window.location.search);
      const mensajeExitoso = params.get("mensajeExitoso");
      if (mensajeExitoso === "true") {
        toast.success(
          "Se ha enviado el correo electronico con la clave temporal correctamente"
        );
      }
    };

    showNotificationAfterRedirect(); // Llama a la función al cargar el componente
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("/usuarios/olvidoContrasenna", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ CorreoElectronico: CorreoElectronico }),
      });

      if (response.ok) {
        // Si las credenciales son correctas, redirige a la página Contact.js
        window.location.href = "/?mensajeExitoso=true";
      } else {
        // Si las credenciales son incorrectas, muestra una notificación
        setError("El correo ingresado no es válido, favor verificar.");
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
    }
  };
  return (
    <div className="olvidar-container">
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
                placeholder="Correo electronico"
                value={CorreoElectronico}
                onChange={(e) => setCorreoElectronico(e.target.value)}
              />
            </div>
          </div>
          <button type="submit" className="olvidar-button">
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
