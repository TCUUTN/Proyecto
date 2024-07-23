import "./App.css";
import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./ProtectedRoute.js";
import Login from "./pages/Login/Login.js";
import Footer from "./components/Footer";
import Inicio from "./pages/Inicio/Home.js";
import Acceso from "./pages/Denegado/Denegado.js";
import CambiarContrasena from "./pages/CambioContrasenna/CambiarClave.js";
import OlvidarContrasena from "./pages/OlvidarContrasenna/OlvidarClave.js";
import MantUser from "./pages/Usuarios/ManteminientoUs.js";
import MantMaterias from "./pages/Grupos/MantMaterias.js";
import MantGrupos from "./pages/Grupos/MantCreaGrupos.js";
import CompletarPerfil from "./pages/Login/CompletarPerfil.js";
import GruposAcademico from "./pages/Grupos/GruposAcademico.js";
import GruposConclusiones from "./pages/Conclusiones/GruposConclusiones.js";
import ListaEstudiantes from "./pages/Grupos/EstudiantesdeGrupo.js";
import VistaHorasEstudiantes from "./pages/HorasBitacora/VistaHorasEstudiante.js";
import VistaConclusionesGrupo from "./pages/Conclusiones/VistaConclusionesGrupo.js";
import RechazoHoras from "./pages/HorasBitacora/RechazoHoras.js";
import SocioComunitarios from "./pages/SociosComunitarios/ListSocioCom.js";
import SolicitudCartas from "./pages/SociosComunitarios/ListaSolicitudesCarta.js";
import VerSolicitudes from "./pages/SociosComunitarios/VerSolicitudes.js";
//Guias del aplicacion web
import GuiaIniciarSesion from "./pages/GuiasUsuarios/GuiaIniciarSesion.js"
import GuiaEstudiantes from "./pages/GuiasUsuarios/GuiaEstudiantes.js"
import GuiaAcademico from "./pages/GuiasUsuarios/GuiaAcademico.js"

//
import CrearActualizarUsuario from "./pages/Usuarios/CrearActualizarUsuario.js";
import CrearActuProyectos from "./pages/Grupos/CrearActuProyectos.js";
import CrearActuCreacionGrupos from "./pages/Grupos/CrearActuCreacionGrupos.js";
import CrearoActualizarHoras from "./pages/HorasBitacora/CrearoActualizarHoras.js";
import CrearActuSocioComunitarios from "./pages/SociosComunitarios/CrearActualizar.js";
import CrearActualizarSolicitudCartas from "./pages/SociosComunitarios/CrearActualizarSolicitudCartas.js";
import CrearActualizarConclusiones from "./pages/Conclusiones/CrearoActualizarConclusiones.js";
//
import "bootstrap/dist/css/bootstrap.min.css"; // Importa los estilos de Bootstrap
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Importa el archivo JavaScript de Bootstrap

function App() {
  useEffect(() => {
    const storedCorreo = sessionStorage.getItem("CorreoElectronico");
    const storedGenero = sessionStorage.getItem("Genero");
    const currentPath = window.location.pathname;

    if (
      (!storedCorreo || storedGenero === "Indefinido") &&
      currentPath !== "/" &&
      currentPath !== "/AccesoDenegado" &&
      currentPath !== "/CompletarPerfil"
    ) {
      window.location.href = "/AccesoDenegado";
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/Home" element={<Inicio />} />
            <Route path="/AccesoDenegado" element={<Acceso />} />
            <Route path="/CambiarClave" element={<CambiarContrasena />} />
            <Route path="/OlvidarClave" element={<OlvidarContrasena />} />
            <Route path="/CompletarPerfil" element={<CompletarPerfil />} />
            <Route
              path="/MantUser"
              element={
                <ProtectedRoute allowedRoles={["Administrativo"]}>
                  <MantUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="/GruposAcademico"
              element={
                <ProtectedRoute allowedRoles={["Académico"]}>
                  <GruposAcademico />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ListaEstudiantes"
              element={
                <ProtectedRoute allowedRoles={["Académico","Administrativo"]}>
                  <ListaEstudiantes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/MantMaterias"
              element={
                <ProtectedRoute allowedRoles={["Administrativo"]}>
                  <MantMaterias />
                </ProtectedRoute>
              }
            />
            <Route
              path="/MantGrupos"
              element={
                <ProtectedRoute allowedRoles={["Administrativo"]}>
                  <MantGrupos />
                </ProtectedRoute>
              }
            />
            <Route
              path="/CrearActualizarUsuario"
              element={
                <ProtectedRoute allowedRoles={["Administrativo"]}>
                  <CrearActualizarUsuario />
                </ProtectedRoute>
              }
            />
            <Route
              path="/CrearActuProyectos"
              element={
                <ProtectedRoute allowedRoles={["Administrativo"]}>
                  <CrearActuProyectos />
                </ProtectedRoute>
              }
            />
            <Route
              path="/CrearActuCreacionGrupos"
              element={
                <ProtectedRoute allowedRoles={["Administrativo"]}>
                  <CrearActuCreacionGrupos />
                </ProtectedRoute>
              }
            />
            <Route
              path="/VistaHorasEstudiantes"
              element={
                <ProtectedRoute allowedRoles={["Estudiante", "Académico","Administrativo"]}>
                  <VistaHorasEstudiantes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/VistaConclusionesGrupo"
              element={
                <ProtectedRoute allowedRoles={["Administrativo", "Académico"]}>
                  <VistaConclusionesGrupo/>
                </ProtectedRoute>
              }
            />
            <Route
              path="/GruposConclusiones"
              element={
                <ProtectedRoute allowedRoles={["Administrativo", "Académico"]}>
                  <GruposConclusiones/>
                </ProtectedRoute>
              }
            />
            <Route
              path="/RechazoHoras"
              element={
                <ProtectedRoute allowedRoles={["Académico"]}>
                  <RechazoHoras />
                </ProtectedRoute>
              }
            />
            <Route
              path="/CrearoActualizarHoras"
              element={
                <ProtectedRoute allowedRoles={["Estudiante", "Académico"]}>
                  <CrearoActualizarHoras />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/SocioComunitarios" 
              element={
                <ProtectedRoute allowedRoles={["Administrativo", "Académico"]}>
                  <SocioComunitarios />
                </ProtectedRoute>
              } 
            />
            <Route
              path="/CrearActuSocioComunitarios"
              element={
                <ProtectedRoute allowedRoles={["Administrativo", "Académico"]}>
                  <CrearActuSocioComunitarios />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/SolicitudCartas" 
              element={
                <ProtectedRoute allowedRoles={["Administrativo","Académico"]}>
                  <SolicitudCartas />
                </ProtectedRoute>
              } 
            />
            <Route
              path="/CrearActualizarSolicitudesCartas"
              element={
                <ProtectedRoute allowedRoles={["Académico"]}>
                  <CrearActualizarSolicitudCartas />
                </ProtectedRoute>
              }
            />
            <Route
              path="/VerSolicitudes"
              element={

                <ProtectedRoute allowedRoles={["Administrativo"]}>
                  <VerSolicitudes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/CrearActualizarConclusiones"
              element={

                <ProtectedRoute allowedRoles={["Administrativo","Académico","Estudiante"]}>
                  <CrearActualizarConclusiones />
                </ProtectedRoute>
              }
            />
            <Route 
             path="/GuiaIniciarSesion"
             element={
              <ProtectedRoute allowedRoles={["Administrativo","Académico","Estudiante"]}>
                <GuiaIniciarSesion />
              </ProtectedRoute>  
             }
            />
            <Route 
             path="/GuiaEstudiantes"
             element={
              <ProtectedRoute allowedRoles={["Administrativo","Estudiante"]}>
                <GuiaEstudiantes />
              </ProtectedRoute>  
             }
            />
            <Route 
            path="/GuiaAcademico"
            element={
              <ProtectedRoute allowedRoles={["Administrativo","Académico"]}>
                <GuiaAcademico />
              </ProtectedRoute>
            }
            />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
