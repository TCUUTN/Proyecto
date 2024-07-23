import React, { useEffect, useState } from "react";
import { Link, useLocation } from 'react-router-dom';
import imagen from "../Assets/Images/Bandera Combinada.png";
import { FaFileDownload } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import { LiaReadme } from "react-icons/lia";
import "./Navbar.css";

function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [nombre, setNombre] = useState("");
  const [identificacion, setIdentificacion] = useState("");
  const [rolUsuario, setRolUsuario] = useState("");
  const [genero, setGenero] = useState("");
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [showBoletaConclusion, setShowBoletaConclusion] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    const storedNombre = sessionStorage.getItem("Nombre");
    const storedRolUsuario = sessionStorage.getItem("RolUsuario");
    const storedGenero = sessionStorage.getItem("Genero");
    const storedSelectedRole = sessionStorage.getItem("SelectedRole");
    const storedIdentificacion = sessionStorage.getItem("Identificacion");
    if (
      storedIdentificacion &&
      storedNombre &&
      storedRolUsuario &&
      storedGenero &&
      storedGenero !== "Indefinido"
    ) {
      setIsAuthenticated(true);
      setNombre(storedNombre);
      setRolUsuario(storedRolUsuario);
      const rolesArray = storedRolUsuario.split(",");
      setRoles(rolesArray);
      setSelectedRole(storedSelectedRole || rolesArray[0]);
      sessionStorage.setItem(
        "SelectedRole",
        storedSelectedRole || rolesArray[0]
      );
      setIdentificacion(storedIdentificacion);
    }

    

    const navbarCollapse = document.getElementById("navbarSupportedContent");
    const dropdownMenuEnd = document.querySelector(".dropdown-menu-end");

    const handleNavbarCollapse = () => {
      if (
        navbarCollapse?.classList.contains("show") &&
        dropdownMenuEnd?.classList.contains("dropdown-menu-end")
      ) {
        dropdownMenuEnd.classList.remove("dropdown-menu-end");
      }
    };

    const handleNavbarHidden = () => {
      if (!navbarCollapse?.classList.contains("show")) {
        dropdownMenuEnd?.classList.add("dropdown-menu-end");
      }
    };

    navbarCollapse?.addEventListener("shown.bs.collapse", handleNavbarCollapse);
    navbarCollapse?.addEventListener("hidden.bs.collapse", handleNavbarHidden);

    return () => {
      navbarCollapse?.removeEventListener(
        "shown.bs.collapse",
        handleNavbarCollapse
      );
      navbarCollapse?.removeEventListener(
        "hidden.bs.collapse",
        handleNavbarHidden
      );
    };
  }, []);

  useEffect(() => {
    const fetchHorasTotales = async () => {
      if (selectedRole === "Estudiante" && identificacion) {
        try {
          const grupoResponse = await fetch(
            `/grupos/GrupoEstudiante/${identificacion}`
          );
          const grupoData = await grupoResponse.json();
          const { GrupoId } = grupoData;

          const horasResponse = await fetch(
            `/horas/EstudianteAprobado/${identificacion}/${GrupoId}`
          );
          const horasData = await horasResponse.json();

          const parseHora = (hora) => {
            const [hours, minutes, seconds] = hora.split(':').map(Number);
            return hours * 60 + minutes + seconds / 60;
        };
        
        const horasTotales = horasData.reduce((total, hora) => {
            const horaInicio = parseHora(hora.HoraInicio);
            const horaFinal = parseHora(hora.HoraFinal);
            const diff = horaFinal - horaInicio;
            return total + diff / 60; // Convertir minutos a horas
        }, 0);

          // Guarda horasTotales en localStorage
          localStorage.setItem("horasTotalesEstudiante", horasTotales);
          if (horasTotales >= 150) {
            setShowBoletaConclusion(true);
          }
        } catch (error) {
          console.error("Error fetching horas totales:", error);
        }
      } else if (
        selectedRole === "Académico" ||
        selectedRole === "Administrativo"
      ) {
        setShowBoletaConclusion(true);
      }
    };

    fetchHorasTotales();
  }, [selectedRole, identificacion]);

  const handleLinkClick = (tipo, linkPath) => {
    localStorage.setItem('TipoInfoSeleccionado', tipo);
    if (currentPath === linkPath) {
      window.location.reload();
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    setIsAuthenticated(false);
    window.location.href = "/"; // Redirige a la página de inicio de sesión
  };

  const handleRoleChange = (event) => {
    const newRole = event.target.value;
    setSelectedRole(newRole);
    sessionStorage.setItem("SelectedRole", newRole);
    window.location.href = "/Home";
  };

  const renderLinkText = () => {
    if (selectedRole === 'Estudiante') {
      return 'Del Grupo';
    } else if (selectedRole === 'Académico') {
      return 'Grupos a Cargo';
    }
    return '';
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <div className="navbar-logo">
          {nombre ? (
            <Link to="/Home">
              <img src={imagen} alt="UTN Logo" />
            </Link>
          ) : (
            <img src={imagen} alt="UTN Logo" />
          )}
        </div>
        {isAuthenticated && (
          <>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                {selectedRole === "Administrativo" && (
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      aria-current="page"
                      to="/MantUser"
                    >
                      Usuarios
                    </Link>
                  </li>
                )}
                {(selectedRole === "Académico" ||
                  selectedRole === "Administrativo") && (
                  <li className="nav-item dropdown">
                    <Link
                      className="nav-link dropdown-toggle"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Grupos
                    </Link>
                    <ul className="dropdown-menu bg-blue">
                      {selectedRole === "Administrativo" && (
                        <>
                          <li>
                            <Link
                              className="dropdown-item dropdown-style"
                              to="/MantMaterias"
                            >
                              Proyectos
                            </Link>
                          </li>
                          <li>
                            <Link
                              className="dropdown-item dropdown-style"
                              to="/MantGrupos"
                            >
                              Creación de grupos
                            </Link>
                          </li>
                        </>
                      )}
                      {selectedRole === "Académico" && (
                        <li>
                          <Link
                            className="dropdown-item dropdown-style"
                            to="/GruposAcademico"
                          >
                            Grupos a cargo
                          </Link>
                        </li>
                      )}
                    </ul>
                  </li>
                )}
                {selectedRole === "Estudiante" && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/VistaHorasEstudiantes">
                      Ingresar horas
                    </Link>
                  </li>
                )}

                {(selectedRole === "Académico" ||
                  selectedRole === "Administrativo") && (
                  <li className="nav-item dropdown">
                    <Link
                      className="nav-link dropdown-toggle"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Socios Comunitarios
                    </Link>
                    <ul className="dropdown-menu bg-blue">
                      <li>
                        <Link
                          className="dropdown-item dropdown-style"
                          to="/SocioComunitarios"
                        >
                          Lista de Socios
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item dropdown-style"
                          to="/SolicitudCartas"
                        >
                          Solicitud de carta
                        </Link>
                      </li>
                    </ul>
                  </li>
                )}

                {showBoletaConclusion && (
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to={
                        selectedRole === "Estudiante"
                          ? "/CrearActualizarConclusiones"
                          : "/GruposConclusiones"
                      }
                    >
                      Boleta de Conclusión
                    </Link>
                  </li>
                )}
                {/*Información*/}
                <li className="nav-item dropdown">
                  <Link
                    className="nav-link dropdown-toggle"
                    aria-disabled="true"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Información
                  </Link>
                  <ul className="dropdown-menu bg-blue">
                    <li className="dropdown-submenu">
                      <Link
                        className="dropdown-item dropdown-style dropdown-toggle"
                        to="#"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <LiaReadme /> Guías
                      </Link>
                      {/*Aqui va el otro dopdown*/}
                      <ul className="dropdown-menu bg-blue">
                        <li>
                          <Link
                            className="dropdown-item dropdown-style"
                            to="GuiaIniciarSesion"
                          >
                            Guia de Iniciar Sesión
                          </Link>
                        </li>
                        {(selectedRole === "Estudiante" ||
                          selectedRole === "Administrativo") && (
                          <li>
                            <Link
                              className="dropdown-item dropdown-style"
                              to="GuiaEstudiantes"
                            >
                              Guia para Estudiantes
                            </Link>
                          </li>
                        )}
                      </ul>
                    </li>
                    {(selectedRole === "Estudiante" ||
                          selectedRole === "Académico"||
                          selectedRole === "Administrativo") && (
                    <li className="dropdown-submenu">
                      <Link
                        className="dropdown-item dropdown-style dropdown-toggle"
                        to="#"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <LiaReadme /> Información
                      </Link>
                      {/*Aqui va el otro dopdown*/}
                      <ul className="dropdown-menu bg-blue">
                        
                      <li>
                      <Link
                        className="dropdown-item dropdown-style"
                        to="/Informacion"
                        onClick={() => handleLinkClick('General', '/Informacion')}
                      >
                        General
                      </Link>
                    </li>
                    {(selectedRole === "Estudiante" ||
                      selectedRole === "Académico") && (
                    <li>
                      <Link
                        className="dropdown-item dropdown-style"
                        to="/Informacion"
                        onClick={() => handleLinkClick('Académico', '/Informacion')}
                      >
                        {renderLinkText()}
                      </Link>
                    </li>
                    )}
                      </ul>
                    </li>
                    )}
                    {(selectedRole === "Administrativo") && (
                    <li>
                      <Link
                        className="dropdown-item dropdown-style"
                        to="/Informacion"
                        onClick={() => handleLinkClick('Plantilla', '/Informacion')}
                      >
                        <FaFileDownload /> Plantillas
                      </Link>
                    </li>
                    )}
                  </ul>
                </li>
              </ul>
              {/* Icono Usuario */}
              <div className="navbar-link">
                {roles.length > 1 ? (
                  <select
                    className="navbar-select"
                    value={selectedRole}
                    onChange={handleRoleChange}
                  >
                    {roles.map((role, index) => (
                      <option key={index} value={role}>
                        {nombre}: {role}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="navbar-select">
                    {nombre}: {roles[0]}
                  </span>
                )}
              </div>

              <ul className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <FaCircleUser className="user-icon-nav" />
                </Link>
                <ul className="dropdown-menu dropdown-menu-end bg-lightblue">
                  <li className="dropdown-item dropdown-style2"></li>
                  <li>
                    <Link
                      className="dropdown-item dropdown-style2"
                      to="/CambiarClave"
                    >
                      Cambio de contraseña
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item dropdown-style2"
                      onClick={handleLogout}
                    >
                      Cerrar Sesión
                    </button>
                  </li>
                </ul>
              </ul>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
