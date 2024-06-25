import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaEye, FaEyeSlash, FaUser } from "react-icons/fa";
import "./Login.modulo.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cambioExitoso = params.get("mensajeExitoso");

    if (cambioExitoso === "true") {
      toast.success(
        "Se ha enviado el correo electronico con la clave temporal correctamente"
      );
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Show loading screen

    try {
      const response = await fetch("/usuarios/credenciales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          CorreoElectronico: username,
          Contrasenna: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Guardar en sessionStorage
        sessionStorage.setItem("Identificacion", data.Identificacion);
        sessionStorage.setItem("Nombre", data.Nombre);
        sessionStorage.setItem("RolUsuario", data.RolUsuario);
        sessionStorage.setItem("CorreoElectronico", data.CorreoElectronico);
        sessionStorage.setItem("Genero", data.Genero);
        sessionStorage.setItem("Sede", data.Sede);

        // Redirigir según el género del usuario
        if (data.Genero === "Indefinido" || !data.Genero) {
          window.location.href = "/CompletarPerfil";
        } else {
          window.location.href = "/Home";
        }
      } else {
        // Si las credenciales son incorrectas, muestra una notificación
        setError("Usuario o contraseña incorrectos");
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
    } finally {
      setLoading(false); // Hide loading screen
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="home-container">
      {loading && <div className="loading-overlay"><div className="loading-spinner"></div></div>}
      <div className="home-content">
        <h1 className="home-title">
          Bitacora Virtual para Trabajo Comunal Universitario
        </h1>
        <div className="title-divider" />
        <p className="home-texto">
          Monitorea, controla y da seguimiento a las actividades, tareas y
          productos de los estudiantes en sus proyectos de TCU de manera
          detallada y eficiente.
        </p>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/a1pYECqzJZM?si=7U-9XKJwWzn7XARW"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </div>

      <div className="login-form">
        <h2 className="login-title">Iniciar Sesión</h2>
        <div className="login-divider" />
        <form onSubmit={handleSubmit}>
          <div className="input-container-login">
            <FaUser className="icon-login" />
            <input
              type="text"
              id="username"
              name="username"
               className="login-input"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-container-login">
            <RiLockPasswordFill className="icon-login" />
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              className="login-input"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="icon2-login" onClick={toggleShowPassword}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <Link className="forgot-password" to="/OlvidarClave">
            ¿Olvidó su contraseña?
          </Link>

          <br />
          <button type="submit" className="login-button">
            Acceder
          </button>
        </form>
        {error && <p className="error-message-login">{error}</p>}
        <ToastContainer position="bottom-right" />
      </div>
    </div>
  );
}

export default Login;
