import React, { useEffect } from "react";
import "./Guias.css";
import { TiArrowUpThick } from "react-icons/ti";
// Import para grupos a cargos
import GrupoCargoc from "../../Assets/Images/Guias/Academicos/Grupos a Cargo.png";
import ListaEstGrupoC from "../../Assets/Images/Guias/Academicos/ListaEstudiantes-Cargo.png";
import RechazarHGrupoC from "../../Assets/Images/Guias/Academicos/Rechazar horas.png";
import VistaHorasEstGrupoC from "../../Assets/Images/Guias/Academicos/VistaHorasEstudiantes.png";
//
import NavbAcade from "../../Assets/Images/Guias/Academicos/NavbarAca.png";
import paginaInciAc from "../../Assets/Images/Guias/Academicos/PaginaInicioAc.png";
//Socios Comunitarios
 //Lista Socios
import listSocios from "../../Assets/Images/Guias/Academicos/ListaSocios.png"
import CreacList_Inf from "../../Assets/Images/Guias/Academicos/CrearListSocios_Info.png"
import CreacList_Cont from "../../Assets/Images/Guias/Academicos/CrearListSocios_Contact.png"
import CreacList_Otr from "../../Assets/Images/Guias/Academicos/CrearListSocios_Otros.png"
 //Solicitud de cartas
import SolicitudCarta from "../../Assets/Images/Guias/Academicos/SolicitudCarta.png"
import CreacionSoli from "../../Assets/Images/Guias/Academicos/CreacionSolicitud.png"
//Boleta de conclusion

function GuiaAcademico(){
    useEffect(() => {
        const sections = document.querySelectorAll(".section");
        function checkScroll() {
          sections.forEach((section) => {
            const rect = section.getBoundingClientRect();
            const windowHeight = window.innerHeight;
    
            if (rect.top < windowHeight * 0.75) {
              section.classList.add("active");
            } else {
              section.classList.remove("active");
            }
          });
        }
        checkScroll();
        window.addEventListener("scroll", checkScroll);
    
        return () => {
          window.removeEventListener("scroll", checkScroll);
        };
      }, []);
      const handleScrollToTop = () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      };
return(
    <div className="contenedor-guias">
        <div className="guias-container">
            {/* Section explicacion de portada */}
            <div className="section section-portada">
          <h2 className="titulo-Portada">
            Guía del usuario para la aplicación TCU
          </h2>
          <p>
            Este manual es una guía para el uso del sistema de Bitácora para TCU
            de la UTN. La aplicación nos ayuda para el registro de horas y para
            hacer un rastreo de nuestro trabajo comunal universitario.
          </p>
          {/* Section explicacion del contenido */}
          <div className="section section-contenido">
            <h3 className="titulos-guiaIn">Contenido</h3>
            <div className="celes-divider" />
            <ul className="guiaIn-contenido-Ac">
              <li><a className="interlink-guiaIn" href="#paginaInicio"> Página de inicio</a></li>
              <li><a className="interlink-guiaIn" href="#grupC"> Grupos a cargo</a></li>
              <li><a className="interlink-guiaIn" href="#sociosC"> Socios Comunitarios</a></li>
              <li><a className="interlink-guiaIn" href="#boletaC"> Boleta de Conclusión</a></li>
              <li><a className="interlink-guiaIn" href="#informacionE"> Información</a></li>
            </ul>
          </div>
        </div>
        {/* Section explicacion del navegacion */}
        <div className="section-guias">
           <h3 className="titulos-guiaIn">Navegación</h3>
           <div className="naranja-divider" />
           <p>Lo que contiene:</p>
           <ul>
            <li><strong>Los logos de la UTN y el TCU:</strong> te redirigen al inicio de la página.</li>
            <li><strong>Grupos:</strong> Sección donde puedes ver tus grupos a cargo.</li>
            <li><strong>Socios Comunitarios</strong> Contiene la lista de socios y también se puede hacer las solicitudes los administrativo para la generación de las cartas de vinculación del estudiante al socio comunitario. </li>
            <li><strong>Boleta de Conclusión</strong> Sección donde puedes ver las boletas de conclusion completadas de tus grupos a cargo.</li>
            <li><strong>Información:</strong> Contiene varias secciones en las que podras encontrar la guía de usuario, aqui podras proporcionarle informacion a tus grupos a cargo e información de carácter general.</li>
           </ul>
           <img
            src={NavbAcade}
             alt="NavbAcade"
             className=" fade-in centered large-image"
            />
           </div>
           {/* Section explicacion de la Página de inicio */}
        <div className="section-guias " id="paginaInicio">
        <h3 className="titulos-guiaIn">Página de inicio</h3>
        <div className="celes-divider" />
        <p style={{ textAlign: 'center' }}>
        En la página de inicio encontrarás una lista de gráficos que te muestra en tiempo real el estado actual de tus estudiantes por grupo que tengas activo.
        </p>
            <img
             src={paginaInciAc}
             alt="paginaInciAc"
             className=" fade-in centered medium-image"
            />
        </div>
             {/* Section explicacion de Grupos a cargo */}
        <div className="section-guias" id="grupC">
           <h3 className="titulos-guiaIn">Grupos a cargo</h3>
           <div className="celes-divider" />
           <ol>
            <li>En esta sección, te permite gestionar  y filtrar a tus grupos. Accede a detalles del grupo, como la lista de estudiantes, ver las bitacoras del estudiante y rechazar horas.
            <img
            src={GrupoCargoc}
             alt="GrupoCargoc"
             className=" fade-in centered medium-image"
            />
            </li>
            <li> Gestión de grupos de estudiantes:
                <ul>
                    <li>Acceso a la lista: Haga clic en el botón "Ver grupo" para visualizar la lista completa de estudiantes pertenecientes a ese grupo específico.</li>
                    <li>Opciones de filtrado: La herramienta de búsqueda le permite encontrar rápidamente estudiantes por nombre completo o por identificación.</li>
                    <li>Descarga de información: Para guardar una copia de la lista de estudiantes, utilice el botón "Descargar lista de estudiantes". El formato disponible para la descarga es PDF.</li>
                </ul>
                <img
             src={ListaEstGrupoC}
             alt="ListaEstGrupoC"
             className=" fade-in centered medium-image"
            />
            </li>
           
            <li> Ver Bitácoras del Estudiante: 
            <ul>
                    <li>Visualice: Revise el registro completo de actividades del estudiante</li>
                    <li>Opciones de filtrado: La herramienta de búsqueda le permite encontrar rápidamente por fecha, tipo de actividad y descripción de la actividad.</li>
                    <li>Descargar reporte: se genera un informe en PDF que contenga el registro completo de las horas del estudiante. </li>
                    <li>Rechazar horas: darle al <strong>Icono de la equis (x)</strong> </li>
                </ul>
                <img
             src={VistaHorasEstGrupoC}
             alt="VistaHorasEstGrupoC"
             className=" fade-in centered medium-image"
            />
            </li>
            
            <li>
            Icono de la equis (x) en las bitácoras del estudiante
            <ul>
                <li>Haga clic en el icono de la equis (x) junto a la actividad que desea rechazar.</li>
                <li>Proporcione comentarios constructivos al estudiante explicando por qué se rechaza la actividad.</li>
                <li>Guarde los cambios.</li>
            </ul>
            <img
             src={RechazarHGrupoC}
             alt="RechazarHGrupoC"
             className=" fade-in centered medium-image"
            />
            </li>
           </ol>
           </div>
             {/* Section explicacion de los Socios Comunitarios */}
        <div className="section-guias" id="sociosC">
           <h3 className="titulos-guiaIn">Socios Comunitarios</h3>
           <div className="naranja-divider" />
          
           <img
          
             alt="navbarEst"
             className=" fade-in centered large-image"
            />
           </div>
               {/* Section explicacion de la Boleta de Conclusión */}
        <div className="section-guias" id="boletaC">
           <h3 className="titulos-guiaIn">Boleta de Conclusión</h3>
           <div className="celes-divider" />
           
           <img
          
             alt="navbarEst"
             className=" fade-in centered large-image"
            />
           </div>
             {/* Section explicacion de la Información*/}
          <div className="section-guias" id="informacionE">
           <h3 className="titulos-guiaIn">Información</h3>
           <div className="naranja-divider" />
           </div>

            {/* Botón flotante */}
            <button className="scroll-to-top" onClick={handleScrollToTop}>
                <TiArrowUpThick />
            </button>

        </div>
    </div>
);
}
export default GuiaAcademico;