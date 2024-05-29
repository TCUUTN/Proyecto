
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="path/to/logo.png" alt="UTN Logo" />
      </div>
      <ul className="navbar-links">
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/contact">Contacto</Link></li>
      </ul>
      <div className="navbar-user">
        <i className="fas fa-user"></i>
      </div>
    </nav>
  );
}

export default Navbar;