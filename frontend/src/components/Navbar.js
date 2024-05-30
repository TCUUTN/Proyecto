import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaBars } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="./assets/images/Banderautn.jpg" alt="UTN Logo" />
      </div>
      <div className="navbar-toggle" onClick={toggleMenu}>
        <FaBars />
      </div>
      <ul className={`navbar-links ${isOpen ? 'active' : ''}`}>
        <li>
          {location.pathname === '/' ? (
            <Link to="/contact">Contacto</Link>
          ) : (
            <Link to="/">Inicio</Link>
          )}
        </li>
        {/* Agrega más elementos del menú aquí si es necesario */}
      </ul>
      <div className="navbar-user">
        <FaUser className="user-icon" />
      </div>
    </nav>
  );
}

export default Navbar;
