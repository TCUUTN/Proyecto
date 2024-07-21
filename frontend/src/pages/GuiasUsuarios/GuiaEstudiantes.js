import React, { useEffect } from "react";
import "./Guias.css";
import { TiArrowUpThick } from "react-icons/ti";
import paginaInciEst from "../../Assets/Images/ImagesGuiasEstudiante/PaginaInicioEst.png";
import registrarhoras from "../../Assets/Images/ImagesGuiasEstudiante/RegistrarHoras.jpeg";
import navbarEst from "../../Assets/Images/ImagesGuiasEstudiante/navbarEstudiante.png";
import ingresarH from "../../Assets/Images/ImagesGuiasEstudiante/IngresarHoras.png"


function GuiaEstudiantes() {
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
            <ul className="guiaIn-contenido">
              <li><a className="interlink-guiaIn" href="#paginaInicio"> Página de inicio</a></li>
              <li><a className="interlink-guiaIn" href="#registrarHoras"> Ingresar horas</a></li>
              <li><a className="interlink-guiaIn" href="#modificarHoraRec"> Como modificar horas rechazadas</a></li>
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
            <li><strong>Los logos de la UTN y el TCU:</strong> te redirigen al inicio de la pagina.</li>
            <li><strong>Ingresar horas:</strong> Donde puedes ver la bitacora y agregar actividades.</li>
            <li><strong>Información:</strong> Contiene varias secciones en las que podras encontrar la guia de usuario, Información proporcionada por el académico e información de carácter general.</li>
           </ul>
           <img
             src={navbarEst}
             alt="paginaInciEst"
             className=" fade-in centered large-image"
            />
           </div>
        {/* Section explicacion de la Página de inicio */}
        <div className="section-guias " id="paginaInicio">
        <h3 className="titulos-guiaIn">Página de inicio</h3>
        <div className="celes-divider" />
        <p>La primera es una sección de información en la cual podrás encontrar todo lo relacionado al grupo al cual se encuentra inscrito. 
        <br></br>
        En la segunda sección vas a encontrar tres barras de progreso las cuales representan tu progreso de las horas subidas y aprobadas en total y por tipo.
        </p>
            <img
             src={paginaInciEst}
             alt="paginaInciEst"
             className=" fade-in centered large-image"
            />
        </div>
         {/* Section explicacion de Registrar horas */}
         <div className="section-guias" id="registrarHoras">
         <h3 className="titulos-guiaIn">Ingresar horas</h3>
         <div className="naranja-divider" />
            <p>
                
            </p>
         </div>
          {/* Section explicacion de Como modificar horas rechazadas */}
          <div className="section-guias" id="modificarHoraRec"></div>
           {/* Section explicacion de la Información*/}
           <div className="section-guias" id="informacionE"></div>

 {/* Botón flotante */}
 <button className="scroll-to-top" onClick={handleScrollToTop}>
        <TiArrowUpThick />
        </button>
        </div>
        </div>
    );
}
export default GuiaEstudiantes;