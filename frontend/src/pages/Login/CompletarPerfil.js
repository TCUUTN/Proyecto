import React, { useState } from "react";
import { ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.modulo.css";
/**
 * Componente `CompletarPerfil` que permite al usuario seleccionar su género para completar su perfil.
 * 
 * @returns {JSX.Element} El componente `CompletarPerfil`.
 */
function CompletarPerfil() {
  // Estado para manejar el género seleccionado por el usuario
  const [genero, setGenero] = useState("");
  // Estado para manejar mensajes de error
  const [error, setError] = useState("");

  /**
   * Maneja el envío del formulario de completar perfil.
   * Realiza una solicitud POST al servidor para actualizar el género del usuario.
   * 
   * @param {React.FormEvent<HTMLFormElement>} event - El evento de envío del formulario.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
  // Verifica si se ha seleccionado un género
    if (!genero) {
      setError("Por favor, seleccione un género.");
      return;
    }
 // Obtiene la identificación del usuario desde sessionStorage
    const identificacion = sessionStorage.getItem("Identificacion");
    if (!identificacion) {
      setError("No se encontró la identificación del usuario.");
      return;
    }

    try {
      const response = await fetch("/usuarios/actualizarGenero", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Identificacion: identificacion,
          Genero: genero,
        }),
      });

      if (response.ok) {
      // Actualiza el SessionStorage con el género seleccionado
        sessionStorage.setItem("Genero", genero);

       // Redirige a la página Home con el parámetro de éxito
        window.location.href = "/Home?perfilCompletado=true";
      } else {
         // Muestra un mensaje de error si la actualización falla
        setError("Error al actualizar el género. Por favor, inténtelo de nuevo.");
      }
    } catch (error) {
      // Maneja errores de la solicitud y muestra un mensaje de error
      console.error("Error al enviar la solicitud:", error);
      setError("Error al enviar la solicitud. Por favor, inténtelo de nuevo.");
    }
  };

  return (
    <div className="perfil-container">
      <div className="perfil-content">
        <h1 className="home-title">Completar Perfil</h1>
        <hr className="perfil-divider" />
        <form onSubmit={handleSubmit}>
          <div className="perfil-input-container">
            <select
              id="genero"
              name="genero"
              value={genero}
              onChange={(e) => setGenero(e.target.value)}
              className="perfil-dropdown"
            >
              <option value="">Seleccione un género</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Prefiero no Especificar">Prefiero no Especificar</option>
            </select>
          </div>
          <button type="submit" className="perfil-button">
            Guardar
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
        <ToastContainer position="bottom-right" />
      </div>
    </div>
  );
}

export default CompletarPerfil;
