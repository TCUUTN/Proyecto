import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.modulo.css";

function CompletarPerfil() {
  const [genero, setGenero] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!genero) {
      setError("Por favor, seleccione un género.");
      return;
    }

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
        // Actualizar el SessionStorage
        sessionStorage.setItem("Genero", genero);

        // Redirigir a la página Home con el parámetro de éxito
        window.location.href = "/Home?perfilCompletado=true";
      } else {
        setError("Error al actualizar el género. Por favor, inténtelo de nuevo.");
      }
    } catch (error) {
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
