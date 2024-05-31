import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Contact from './pages/Grupos/Grupos.js';
import Home from './pages/Login/Home_Login.js';
import Footer from './components/Footer';
import InicioAdmin  from './pages/Inicio/Home_Admin.js';
import CambiarContrasena from './pages/CambioContrasenna/CambiarClave.js';
import OlvidarContrasena from './pages/OlvidarContrasenna/OlvidarClave.js'


import 'bootstrap/dist/css/bootstrap.min.css'; // Importa los estilos de Bootstrap
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Importa el archivo JavaScript de Bootstrap

  function App() {
  
    return (
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/Home_Admin" element={<InicioAdmin/>} />
            <Route path="/CambiarClave" element={<CambiarContrasena/>} />
            <Route path="/OlvidarClave" element={<OlvidarContrasena/>} />
          </Routes>
          <Footer />
      </div>
      </Router>

      
    );
  }
  
  export default App;
