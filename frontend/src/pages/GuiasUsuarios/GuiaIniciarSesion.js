import React from "react";
import "./Guias.css";
import CompletarPerfil from "../Assets/Images/CompletarPerfil.svg";
import ImageEmailTClaveTemporal from "../Assets/Images/ImageEmail.svg";
import ImageIniciarS from "../Assets/Images/ImageIniciarS.svg";
import ImageOlvidar from "../Assets/Images/ImageOlvidar.svg";
import ImageNavbar from "../Assets/Images/navbar-icono-usuario.svg";
import RestablecerClave from "../Assets/Images/RestablecerClave.svg";

function GuiaIniciarSesion() {
  return (
    <div className="guiaIni-container">
    {/* Section explicacion de portada */}
    <div className="section-portada">
      <h2>Guía del usuario para la aplicación TCU</h2>
      <p>
        Este manual es una guía para el uso del sistema de Bitácora para TCU
        de la UTN. La aplicación nos ayuda para el registro de horas y para
        hacer un rastreo de nuestro trabajo comunal universitario.
      </p>
    </div>
    {/* Section explicacion de texto */}
    <div className="section-texto">
      <h3>Contenido</h3>
      <hr />
      <ul>
        <li>Iniciar sesión</li>
        <li>Olvidar Contraseña</li>
        <li>Cambiar Contraseña</li>
        <li>Completar Perfil</li>
      </ul>
    </div>
    {/* Section explicacion de contenido */}
    <div className="section-contenido">
      <h3>Iniciar sesión</h3>
      <hr />
      <p>Sigue estos pasos:</p>
      <ol>
        <li>Introduce tu correo institucional y tu contraseña.</li>
        <li>Haz clic en el botón "Acceder".</li>
      </ol>
      <img src={ImageIniciarS} alt="Iniciar Sesión" className="fade-in centered" />
      <p className="alert">
        Si has olvidado tu contraseña, puedes hacer clic en el enlace "¿Olvidó su
        contraseña?" para restablecerla.
      </p>
    </div>
    {/* Section explicacion de Olvidar Contraseña */}
    <div className="section-iniciarS">
      <h3>Olvidar Contraseña</h3>
      <hr />
      <p>Sigue estos pasos:</p>
      <ol>
        <li>Introduce su dirección de correo institucional.</li>
        <li>Haga clic en el botón "Enviar".</li>
        <img src={ImageOlvidar} alt="Olvidar Contraseña" className="fade-in centered" />
        <li>
          Revise su correo institucional, donde le llegará su contraseña temporal.
        </li>
      </ol>
      <img src={ImageEmailTClaveTemporal} alt="Contraseña Temporal" className="fade-in centered" />
    </div>
    {/* Section explicacion de Restablecer Contraseña */}
    <div className="section-olvidarC">
      <h3>Restablecer Contraseña</h3>
      <hr />
      <div className="restablecer-container">
        <div>
          <p>Sigue estos pasos:</p>
          <ol>
            <li>Toca el icono usuario del menú en la barra de navegación.</li>
            <li>Selecciona la opción "Cambio de contraseña".</li>
            <img src={ImageNavbar} alt="ImageNavbar" className="fade-in centered" />
            <li>
              Ingresa los datos pedidos en el formulario para cambiar la
              contraseña. La nueva contraseña debe contener al menos una letra
              mayúscula, una letra minúscula, un número y un carácter especial y
              debe ser mínimo 8 caracteres.
            </li>
          </ol>
        </div>
        <img src={RestablecerClave} alt="Restablecer Contraseña" className="fade-in centered" />
      </div>
      <h4>Consejos para crear una contraseña segura:</h4>
      <ul className="consejos">
        <li>Usa una contraseña diferente para cada cuenta.</li>
        <li>No compartas tu contraseña con nadie.</li>
        <li>Cambia tu contraseña regularmente.</li>
      </ul>
    </div>
    {/* Section explicacion de Completar Perfil */}
    <div className="section-restablecer">
      <h3>Completar Perfil</h3>
      <hr />
      <p>
        Esta pantalla va a aparecer una única vez cuando inicies sesión por
        primera vez. En esta se debe completar la selección de género para que
        escojas con el cual te sientas más apropiado a la hora de
        identificarte o simplemente para que no lo indiques.
      </p>
      <img src={CompletarPerfil} alt="Completar Perfil" className="fade-in centered" />
    </div>
  </div>
  );
}

export default GuiaIniciarSesion;
