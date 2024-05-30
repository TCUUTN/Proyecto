import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaBars} from 'react-icons/fa';
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
        <Link to="/"><img src="./assets/images/Banderautn.jpg" alt="UTN Logo" /></Link>
      </div>

      <div className="navbar-right">
        <ul className={`navbar-links ${isOpen? 'active' : ''}`}>
          {location.pathname!== '/contact' && (
            <li>
             
            </li>
          )}
          {location.pathname!== '/home_login' && (
            <li>
              {location.pathname === '/contact'? (
                <Link to="/"> Inicio</Link>
              ) : (
                <Link to="/contact"> Contacto</Link>
              )}
            </li>
          )}
        </ul>

        <div className="navbar-user">
          <FaUser className="user-icon" />
        </div>
      </div>

      <div className="navbar-toggle" onClick={toggleMenu}>
        <FaBars />
      </div>
    </nav>
  );
}
export default Navbar;