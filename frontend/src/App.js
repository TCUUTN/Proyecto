import './App.css';
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';

import Login from './pages/Login/Login.js';
import Footer from './components/Footer';
import Inicio from './pages/Inicio/Home.js';
import Acceso from './pages/Denegado/Denegado.js';
import CambiarContrasena from './pages/CambioContrasenna/CambiarClave.js';
import OlvidarContrasena from './pages/OlvidarContrasenna/OlvidarClave.js';
import MantUser from './pages/Usuarios/ManteminientoUs.js';
import MantMaterias from './pages/Grupos/MantMaterias.js';
import MantGrupos from './pages/Grupos/MantCreaGrupos.js';
import CompletarPerfil from './pages/Login/CompletarPerfil.js';
import GruposAcademico from './pages/Grupos/GruposAcademico.js';
import ListaEstudiantes from './pages/Grupos/EstudiantesdeGrupo.js';
import VistaHorasEstudiantes from './pages/HorasBitacora/VistaHorasEstudiante.js';
import RechazoHoras from './pages/HorasBitacora/RechazoHoras.js';
import SocioComunitarios from './pages/SociosComunitarios/ListSocioCom.js';
import SolicitudCartas from "./pages/SociosComunitarios/ListaSolicitudesCarta.js";


//
import CrearActualizarUsuario from './pages/Usuarios/CrearActualizarUsuario.js';
import CrearActuProyectos from './pages/Grupos/CrearActuProyectos.js';
import CrearActuCreacionGrupos from './pages/Grupos/CrearActuCreacionGrupos.js';
import CrearoActualizarHoras from './pages/HorasBitacora/CrearoActualizarHoras.js';
import CrearActuSocioComunitarios from './pages/SociosComunitarios/CrearActualizar.js'
import CrearActualizarSolicitudCartas from "./pages/SociosComunitarios/CrearActualizarSolicitudCartas.js";
//
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa los estilos de Bootstrap
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Importa el archivo JavaScript de Bootstrap

//import CustomScrollbars from './CustomScrollbars';

function App() {
  useEffect(() => {
    const storedCorreo = sessionStorage.getItem('CorreoElectronico');
    const storedGenero = sessionStorage.getItem('Genero');
    const currentPath = window.location.pathname;

    // Si no hay información en el sessionStorage o el género es "Indefinido"
    // y la ruta no es '/' ni '/AccesoDenegado' ni '/CompletarPerfil'
    if (
      (!storedCorreo || storedGenero === 'Indefinido') &&
      currentPath !== '/' &&
      currentPath !== '/AccesoDenegado' &&
      currentPath !== '/CompletarPerfil'
    ) {
      // Redirigir a la página de acceso denegado
      window.location.href = '/AccesoDenegado';
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Navbar />
       {/* <CustomScrollbars style={{ height: 'calc(100vh - 60px)' }}>*/}
        <div className="content">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/Home" element={<Inicio />} />
            <Route path="/AccesoDenegado" element={<Acceso />} />
            <Route path="/CambiarClave" element={<CambiarContrasena />} />
            <Route path="/OlvidarClave" element={<OlvidarContrasena />} />
            <Route path="/MantUser" element={<MantUser />} />
            <Route path="/GruposAcademico" element={<GruposAcademico />} />
            <Route path="/ListaEstudiantes" element={<ListaEstudiantes />} />
            <Route path="/MantMaterias" element={<MantMaterias />} />
            <Route path="/MantGrupos" element={<MantGrupos />} />
            <Route path="/CompletarPerfil" element={<CompletarPerfil />} />
            <Route path="/CrearActualizarUsuario" element={<CrearActualizarUsuario />} />
            <Route path="/CrearActuProyectos" element={<CrearActuProyectos />} />
            <Route path="/CrearActuCreacionGrupos" element={<CrearActuCreacionGrupos />} />
            <Route path="/VistaHorasEstudiantes" element={<VistaHorasEstudiantes />} />
            <Route path="/RechazoHoras" element={<RechazoHoras />} />
            <Route path="/CrearoActualizarHoras" element={<CrearoActualizarHoras />} />
            <Route path="/SocioComunitarios" element={<SocioComunitarios/>}/>
            <Route path="/CrearActuSocioComunitarios" element={<CrearActuSocioComunitarios/>}/>
            <Route path="/SolicitudCartas" element={<SolicitudCartas/>}/>
            <Route path="/CrearActualizarSolicitudesCartas" element={<CrearActualizarSolicitudCartas/>}/>
          </Routes>
        </div>
        {/*</CustomScrollbars>*/}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
