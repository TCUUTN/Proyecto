import React, { useEffect } from "react";
import "./Denegado.css";
import { MdLogin } from "react-icons/md";
import { BsRobot } from "react-icons/bs";
import { TbLockAccessOff } from "react-icons/tb";


function AccesoDenegado() {
  useEffect(() => {
    sessionStorage.clear();
    localStorage.clear();
  }, []);

  const redirigirAInicio = () => {
    window.location.href = "/";
  };

  return (
    <div className="container-denegado">
      <div className="content-denegado">
        <h1>Ooops!... Acceso Denegado</h1>
        <div className="denegado-divider" />
        <div className="flex-container">
          <div className="text-container">
            <p>No tienes acceso a este sitio hasta que ingreses tus credenciales</p>
          </div>
          <div className="robot-container">
            <div className="robot-icon"><BsRobot /> <TbLockAccessOff /></div>
          </div>
        </div>
        <button onClick={redirigirAInicio} className="denegado-button">
          Iniciar Sesión <MdLogin />
        </button>
      </div>
    </div>
  );
}

export default AccesoDenegado;
