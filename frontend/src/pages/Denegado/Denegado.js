import React from "react";
import "./Denegado.Css";

function AccesoDenegado() {
  const redirigirAInicio = () => {
    window.location.href = "/";
  };

  return (
    <div className="container">
      {" "}
      {/* Añade la clase 'container' aquí */}
      <h1>Acceso Denegado</h1>
      <p>No tienes acceso a este sitio hasta que ingreses tus credenciales.</p>
      <button onClick={redirigirAInicio} className="login-button">
        Ir a la página de inicio
      </button>
    </div>
  );
}

export default AccesoDenegado;
