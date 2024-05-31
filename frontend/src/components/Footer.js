import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      &copy; {new Date().getFullYear()} Universidad Técnica Nacional. Todos los derechos reservados.
    </footer>
  );
}

export default Footer;
