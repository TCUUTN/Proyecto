import './App.css';
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Contact from './pages/Grupos/Grupos.js';
import Login from './pages/Login/Login.js';
import Footer from './components/Footer';
import Inicio from './pages/Inicio/Home.js';
import Acceso from './pages/Denegado/Denegado.js';
import CambiarContrasena from './pages/CambioContrasenna/CambiarClave.js';
import OlvidarContrasena from './pages/OlvidarContrasenna/OlvidarClave.js'
import MantUser from './pages/Usuarios/ManteminientoUs.js'

import 'bootstrap/dist/css/bootstrap.min.css'; // Importa los estilos de Bootstrap
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Importa el archivo JavaScript de Bootstrap

function App() {
  useEffect(() => {
    const storedCorreo = sessionStorage.getItem('CorreoElectronico');
    const currentPath = window.location.pathname;

    // Si no hay información en el sessionStorage y la ruta no es '/' ni '/AccesoDenegado'
    if (!storedCorreo && currentPath !== '/' && currentPath !== '/AccesoDenegado') {
      // Redirigir a la página de acceso denegado
      window.location.href = '/AccesoDenegado';
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/Home" element={<Inicio />} />
          <Route path="/AccesoDenegado" element={<Acceso />} />
          <Route path="/CambiarClave" element={<CambiarContrasena />} />
          <Route path="/OlvidarClave" element={<OlvidarContrasena />} />
          <Route path="/MantUser" element={<MantUser />} />
          
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
