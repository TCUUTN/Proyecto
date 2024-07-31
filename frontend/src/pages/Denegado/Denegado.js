import React, { useEffect } from "react";
import "./Denegado.css"; // Importa los estilos específicos para la página de acceso denegado
import { MdLogin } from "react-icons/md"; // Importa el ícono de inicio de sesión de Material Design
import { BsRobot } from "react-icons/bs"; // Importa el ícono de robot de Bootstrap
import { TbLockAccessOff } from "react-icons/tb"; // Importa el ícono de bloqueo de acceso de Tabler Icons

function AccesoDenegado() {
  // useEffect se ejecuta una vez al montar el componente
  useEffect(() => {
    // Limpia el almacenamiento de sesión y el almacenamiento local cuando el componente se monta
    sessionStorage.clear();
    localStorage.clear();
  }, []); // El array vacío indica que el efecto solo se ejecuta una vez

  // Función para redirigir al usuario a la página de inicio de sesión
  const redirigirAInicio = () => {
    window.location.href = "/";
  };

  return (
    <div className="container-denegado">
      {/* Contenedor principal para la página de acceso denegado */}
      <div className="content-denegado">
        <h1>Ooops!... Acceso Denegado</h1> {/* Título de la página */}
        <div className="denegado-divider" /> {/* Línea divisoria */}
        <div className="flex-container">
          {" "}
          {/* Contenedor flex para organizar el texto y los íconos */}
          <div className="text-container">
            {" "}
            {/* Contenedor de texto con el mensaje de acceso denegado */}
            <p>
              No tienes acceso a este sitio hasta que ingreses tus credenciales
            </p>
          </div>
          <div className="robot-container">
            {" "}
            {/* Contenedor de íconos con el ícono del robot y el ícono de bloqueo */}
            <div className="robot-icon">
              <BsRobot /> <TbLockAccessOff />
            </div>
          </div>
        </div>
        <button onClick={redirigirAInicio} className="denegado-button">
          {" "}
          {/* Botón para redirigir a la página de inicio de sesión */}
          Iniciar Sesión <MdLogin />
        </button>
      </div>
    </div>
  );
}

export default AccesoDenegado; // Exporta el componente para que pueda ser utilizado en otras partes de la aplicación
