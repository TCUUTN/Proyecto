import "./App.css";
import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.js"; // Importa el componente de ruta protegida
// Importa los componentes de la aplicación
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
// Páginas relacionadas con el login
import Login from "./pages/Login/Login.js";
import CompletarPerfil from "./pages/Login/CompletarPerfil.js";
// Página de inicio
import Inicio from "./pages/Inicio/Home.js";
// Páginas para cambiar y olvidar contraseñas
import CambiarContrasena from "./pages/CambioContrasenna/CambiarClave.js";
import OlvidarContrasena from "./pages/OlvidarContrasenna/OlvidarClave.js";
// Página de acceso denegado
import Acceso from "./pages/Denegado/Denegado.js";
// Páginas para la gestión de horas
import CrearoActualizarHoras from "./pages/HorasBitacora/CrearoActualizarHoras.js";
import RechazoHoras from "./pages/HorasBitacora/RechazoHoras.js";
import VistaHorasEstudiantes from "./pages/HorasBitacora/VistaHorasEstudiante.js";
// Páginas para la gestión de grupos
import Proyectos from "./pages/Grupos/Proyectos.js";
import Grupos from "./pages/Grupos/Grupos.js";
import GruposAcademico from "./pages/Grupos/GruposAcademico.js";
import ListaEstudiantes from "./pages/Grupos/EstudiantesdeGrupo.js";
import CrearActuProyectos from "./pages/Grupos/CrearActuProyectos.js";
import CrearActuCreacionGrupos from "./pages/Grupos/CrearActuCreacionGrupos.js";
// Páginas para la gestión de usuarios
import Usuarios from "./pages/Usuarios/Usuarios.js";
import CrearActualizarUsuario from "./pages/Usuarios/CrearActualizarUsuario.js";
// Páginas para la gestión de boleta de conclusio
import GruposConclusiones from "./pages/Conclusiones/GruposConclusiones.js";
import VistaConclusionesGrupo from "./pages/Conclusiones/VistaConclusionesGrupo.js";
import CrearActualizarConclusiones from "./pages/Conclusiones/CrearoActualizarConclusiones.js";
// Páginas para la gestión de socios comunitarios
import SocioComunitarios from "./pages/SociosComunitarios/ListSocioCom.js";
import SolicitudCartas from "./pages/SociosComunitarios/ListaSolicitudesCarta.js";
import VerSolicitudes from "./pages/SociosComunitarios/VerSolicitudes.js";
import CrearActuSocioComunitarios from "./pages/SociosComunitarios/CrearActualizar.js";
import CrearActualizarSolicitudCartas from "./pages/SociosComunitarios/CrearActualizarSolicitudCartas.js";
// Páginas para la información
import Informacion from "./pages/Informacion/Informacion.js";
import RegistroInformacion from "./pages/Informacion/CrearActualizarInfo.js";
// Páginas para las guías de la aplicación web
import GuiaIniciarSesion from "./pages/GuiasUsuarios/GuiaIniciarSesion.js";
import GuiaEstudiantes from "./pages/GuiasUsuarios/GuiaEstudiantes.js";
import GuiaAcademico from "./pages/GuiasUsuarios/GuiaAcademico.js";
import GuiaAdmininistrativo from "./pages/GuiasUsuarios/GuiaAdministrativo.js";
// Importa los estilos y el JavaScript de Bootstrap para el diseño y componentes
import "bootstrap/dist/css/bootstrap.min.css"; 
import "bootstrap/dist/js/bootstrap.bundle.min.js"; 

function App() {
  useEffect(() => {
    // Efecto para redirigir al usuario a la página de acceso denegado si no está autenticado
    const storedCorreo = sessionStorage.getItem("CorreoElectronico");
    const storedGenero = sessionStorage.getItem("Genero");
    const currentPath = window.location.pathname;

     // Redirige a la página de acceso denegado si no se encuentra un correo electrónico o el género es indefinido
    // y la ruta actual no es una de las permitidas
    if (
      (!storedCorreo || storedGenero === "Indefinido") &&
      currentPath !== "/" &&
      currentPath !== "/AccesoDenegado" &&
      currentPath !== "/CompletarPerfil"
    ) {
      window.location.href = "/AccesoDenegado";
    }
  }, []); // El efecto se ejecuta solo una vez al montar el componente

  return (
    <Router>
      <div className="App">
        {/* Renderiza el componente de la barra de navegación */}
        <Navbar />
        <div className="content">
           {/* Configura las rutas y los componentes asociados */}
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/Home" element={<Inicio />} />
            <Route path="/AccesoDenegado" element={<Acceso />} />
            <Route path="/CambiarClave" element={<CambiarContrasena />} />
            <Route path="/OlvidarClave" element={<OlvidarContrasena />} />
            <Route path="/CompletarPerfil" element={<CompletarPerfil />} />
             {/* Rutas protegidas según el rol del usuario */}
            <Route
              path="/Usuarios"
              element={
                <ProtectedRoute allowedRoles={["Administrativo"]}>
                  <Usuarios />
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
              path="/Proyectos"
              element={
                <ProtectedRoute allowedRoles={["Administrativo"]}>
                  <Proyectos />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Grupos"
              element={
                <ProtectedRoute allowedRoles={["Administrativo"]}>
                  <Grupos />
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
              path="/Informacion"
              element={
                <ProtectedRoute allowedRoles={["Estudiante", "Académico","Administrativo"]}>
                  <Informacion />
                </ProtectedRoute>
              }
            />
            <Route
              path="/RegistroInformacion"
              element={
                <ProtectedRoute allowedRoles={["Estudiante", "Académico","Administrativo"]}>
                  <RegistroInformacion />
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
            
            <Route 
            path="/GuiaAdmininistrativo"
            element={
              <ProtectedRoute allowedRoles={["Administrativo"]}>
                <GuiaAdmininistrativo />
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
