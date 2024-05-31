import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaUser, FaBars } from 'react-icons/fa';
import './Navbar.css';

function Navbar() {
  useEffect(() => {
    const navbarCollapse = document.getElementById('navbarSupportedContent');
    const dropdownMenuEnd = document.querySelector('.dropdown-menu-end');

    const handleNavbarCollapse = () => {
      if (navbarCollapse.classList.contains('show') && dropdownMenuEnd.classList.contains('dropdown-menu-end')) {
        dropdownMenuEnd.classList.remove('dropdown-menu-end');
      }
    };

    const handleNavbarHidden = () => {
      if (!navbarCollapse.classList.contains('show')) {
        dropdownMenuEnd.classList.add('dropdown-menu-end');
      }
    };

    navbarCollapse.addEventListener('shown.bs.collapse', handleNavbarCollapse);
    navbarCollapse.addEventListener('hidden.bs.collapse', handleNavbarHidden);

    return () => {
      navbarCollapse.removeEventListener('shown.bs.collapse', handleNavbarCollapse);
      navbarCollapse.removeEventListener('hidden.bs.collapse', handleNavbarHidden);
    };
  }, []);
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
      <div className="navbar-logo">
          <Link to="/"><img src="./assets/images/Banderautn.jpg" alt="UTN Logo" /></Link>
        </div>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link" aria-current="page" href="#">Usuarios</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Grupos</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Carga de horas</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Socios Comunitarios</a>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle"  role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Reportes
              </a>
              <ul className="dropdown-menu bg-blue">
                <li><a className="dropdown-item dropdown-style" href="#">Reporte #1</a></li>
                <li><a className="dropdown-item dropdown-style" href="#">Reporte #2</a></li>
                {/* <li><hr className="dropdown-divider" /></li> */}
                <li><a className="dropdown-item dropdown-style" href="#">Reporte #3</a></li>
              </ul>
            </li>
            <li className="nav-item">
              <a className="nav-link " aria-disabled="true">Información</a>
            </li>
          </ul>

          <ul className="nav-item dropdown">
              <a className="nav-link dropdown-toggle"  role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <FaUser className="user-icon" />
              </a>
              <ul className="dropdown-menu dropdown-menu-end bg-lightblue">
                <li><a className="dropdown-item dropdown-style2" href="#">Cambio de contraseña</a></li>
                <li><hr className="dropdown-divider" /></li> 
                <li><a className="dropdown-item dropdown-style2" href="#">Cerrar Sesión</a></li>

              </ul>
            </ul>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
