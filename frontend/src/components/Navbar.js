import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaUser, FaBars } from 'react-icons/fa';
import './Navbar.css';

function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/"><img src="./assets/images/Banderautn.jpg" alt="UTN Logo" /></Link>
        </div>

        <div className="navbar-right">
          <ul className={`navbar-links ${isOpen ? 'active' : ''}`}>
            <li className={location.pathname === '/contact' ? 'active' : ''}>
              <Link to="/contact" onClick={() => setIsOpen(false)}>Contacto</Link>
            </li>
          </ul>

          <div className="navbar-icons">
            <div className="navbar-user">
              <FaUser className="user-icon" />
            </div>
            <div className="navbar-toggle" onClick={toggleMenu}>
              <FaBars />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
