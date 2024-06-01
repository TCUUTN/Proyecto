import React, { useEffect } from 'react';
import { Link} from 'react-router-dom';
import { FaCircleUser } from "react-icons/fa6";
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
              <Link className="nav-link" aria-current="page" to="#">Usuarios</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="#">Grupos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="#">Ingresar horas</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="#">Socios Comunitarios</Link>
            </li>
            <li className="nav-item dropdown">
              <Link className="nav-link dropdown-toggle"  role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Reportes
              </Link>
              <ul className="dropdown-menu bg-blue">
                <li><Link className="dropdown-item dropdown-style" to="#">Reporte #1</Link></li>
                <li><Link className="dropdown-item dropdown-style" to="#">Reporte #2</Link></li>
                {/* <li><hr className="dropdown-divider" /></li> */}
                <li><Link className="dropdown-item dropdown-style" to="#">Reporte #3</Link></li>
              </ul>
            </li>
            <li className="nav-item">
              <Link className="nav-link " aria-disabled="true">Información</Link>
            </li>
          </ul>

          <ul className="nav-item dropdown">
              <Link className="nav-link dropdown-toggle"  role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <FaCircleUser className="user-icon" />
              </Link>
              <ul className="dropdown-menu dropdown-menu-end bg-lightblue">
                <li><Link className="dropdown-item dropdown-style2" to="/CambiarClave">Cambio de contraseña</Link></li>
                <li><hr className="dropdown-divider" /></li> 
                <li><Link className="dropdown-item dropdown-style2" to="#">Cerrar Sesión</Link></li>

              </ul>
            </ul>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
