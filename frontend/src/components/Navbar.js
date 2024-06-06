import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import imagen from '../Assets/Images/Banderautn.jpg';
import { FaCircleUser } from "react-icons/fa6";
import './Navbar.css';

function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [nombre, setNombre] = useState('');
  const [rolUsuario, setRolUsuario] = useState('');

  useEffect(() => {
    const storedNombre = sessionStorage.getItem('Nombre');
    const storedRolUsuario = sessionStorage.getItem('RolUsuario');
    if (storedNombre && storedRolUsuario) {
      setIsAuthenticated(true);
      setNombre(storedNombre);
      setRolUsuario(storedRolUsuario);
    }

    const navbarCollapse = document.getElementById('navbarSupportedContent');
    const dropdownMenuEnd = document.querySelector('.dropdown-menu-end');

    const handleNavbarCollapse = () => {
      if (navbarCollapse?.classList.contains('show') && dropdownMenuEnd?.classList.contains('dropdown-menu-end')) {
        dropdownMenuEnd.classList.remove('dropdown-menu-end');
      }
    };

    const handleNavbarHidden = () => {
      if (!navbarCollapse?.classList.contains('show')) {
        dropdownMenuEnd?.classList.add('dropdown-menu-end');
      }
    };

    navbarCollapse?.addEventListener('shown.bs.collapse', handleNavbarCollapse);
    navbarCollapse?.addEventListener('hidden.bs.collapse', handleNavbarHidden);

    return () => {
      navbarCollapse?.removeEventListener('shown.bs.collapse', handleNavbarCollapse);
      navbarCollapse?.removeEventListener('hidden.bs.collapse', handleNavbarHidden);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    setIsAuthenticated(false);
    window.location.href = '/'; // Redirige a la página de inicio de sesión
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <div className="navbar-logo">
          {nombre ? (
            <Link to="/Home"><img src={imagen} alt="UTN Logo" /></Link>
          ) : (
            <img src={imagen} alt="UTN Logo" />
          )}
        </div>
        {isAuthenticated && (
          <>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                {rolUsuario === 'Administrativo' && (
                  <li className="nav-item">
                    <Link className="nav-link" aria-current="page" to="/MantUser">Usuarios</Link>
                  </li>
                )}
                {(rolUsuario === 'Academico' || rolUsuario === 'Administrativo') && (
                  <li className="nav-item dropdown">
                    <Link className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      Grupos
                    </Link>
                    <ul className="dropdown-menu bg-blue">
                    <li><Link className="dropdown-item dropdown-style" to="/MantMaterias">Materias</Link></li>
                    <li><Link className="dropdown-item dropdown-style" to="/MantGrupos">Creación de grupos</Link></li>
                  </ul>
                  </li>
                )}
                {(rolUsuario === 'Estudiante' || rolUsuario === 'Administrativo') && (
                  <li className="nav-item">
                    <Link className="nav-link" to="#">Ingresar horas</Link>
                  </li>
                )}
                {(rolUsuario === 'Academico' || rolUsuario === 'Administrativo') && (
                  <li className="nav-item">
                    <Link className="nav-link" to="#">Socios Comunitarios</Link>
                  </li>
                )}
                <li className="nav-item dropdown">
                  <Link className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Reportes
                  </Link>
                  <ul className="dropdown-menu bg-blue">
                    <li><Link className="dropdown-item dropdown-style" to="#">Reporte #1</Link></li>
                    <li><Link className="dropdown-item dropdown-style" to="#">Reporte #2</Link></li>
                    <li><Link className="dropdown-item dropdown-style" to="#">Reporte #3</Link></li>
                  </ul>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" aria-disabled="true">Información</Link>
                </li>
              </ul>
              <span className="navbar-link">
                {nombre}: {rolUsuario}
              </span>
              <ul className="nav-item dropdown">
                <Link className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <FaCircleUser className="user-icon" />
                </Link>
                <ul className="dropdown-menu dropdown-menu-end bg-lightblue">
                  <li><Link className="dropdown-item dropdown-style2" to="/CambiarClave">Cambio de contraseña</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><Link className="dropdown-item dropdown-style2" onClick={handleLogout}>Cerrar Sesión</Link></li>
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
