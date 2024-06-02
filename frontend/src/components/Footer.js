import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <p className="p">&copy; {new Date().getFullYear()} Universidad Técnica Nacional. </p>
      <p className="p">Todos los derechos reservados.</p>
    </footer>
  );
}

export default Footer;
