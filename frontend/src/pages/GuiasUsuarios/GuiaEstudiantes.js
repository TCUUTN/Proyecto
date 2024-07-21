import React, { useEffect } from "react";
import "./Guias.css";
import { TiArrowUpThick } from "react-icons/ti";
import paginaInciEst from "../../Assets/Images/Guias/Estudiante/PaginaInicioEst.png";
import registrarhoras from "../../Assets/Images/Guias/Estudiante/RegistrarHoras.jpeg";
import navbarEst from "../../Assets/Images/Guias/Estudiante/navbarEstudiante.png";
import ingresarH from "../../Assets/Images/Guias/Estudiante/IngresarHoras.png";
import ingresarHCompl from "../../Assets/Images/Guias/Estudiante/IngresarHorasCompl.png";
import tablaRechazada from "../../Assets/Images/Guias/Estudiante/tablaRechazada.png";
import modificarHoras from "../../Assets/Images/Guias/Estudiante/ModificarRegistarHoras.png";


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
            <li><strong>Los logos de la UTN y el TCU:</strong> te redirigen al inicio de la página.</li>
            <li><strong>Ingresar horas:</strong> Donde puedes ver la bitácora y agregar actividades.</li>
            <li><strong>Información:</strong> Contiene varias secciones en las que podras encontrar  la guía de usuario, información proporcionada por el académico e información de carácter general.</li>
           </ul>
           <img
             src={navbarEst}
             alt="navbarEst"
             className=" fade-in centered large-image"
            />
           </div>
        {/* Section explicacion de la Página de inicio */}
        <div className="section-guias " id="paginaInicio">
        <h3 className="titulos-guiaIn">Página de inicio</h3>
        <div className="celes-divider" />
        <p>La primera es una sección de información en la cual podrás encontrar todo lo relacionado al grupo al cual te encuentras inscrito. 
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
            <p>Así es como se muestra el ingresar horas</p>
            <img
             src={ingresarH}
             alt="ingresarH"
             className=" fade-in centered large-image"
            />
             <p>Sigue estos pasos:</p>
         <ol>
            <li>Agregue la actividad en el siguiente formulario:</li>
            <img
             src={registrarhoras}
             alt="registrarhoras"
             className=" fade-in centered medium-image"
            />
             <p><strong>Nota: Subir archivos es opcional.</strong></p>  
             <br></br>
             <p>
             Una vez completados los datos, presiona en guardar. Si el proceso muestra un mensaje de error en las horas o en la fecha, corrígelo y vuelve a presionar en guardar.
            </p> 

             <li>
             Una vez que el registro haya sido guardado exitosamente, te devolverá a la pantalla de la bitácora.
             </li>
             <img
             src={ingresarHCompl}
             alt="ingresarHCompl"
             className=" fade-in centered large-image"
            />
            <p><strong>Nota: Con el botón de generar reportes, podrás descargar un PDF con el registro de tus horas. </strong></p>  
         </ol>
         </div>
          {/* Section explicacion de Como modificar horas rechazadas */}
          <div className="section-guias" id="modificarHoraRec">
          <h3 className="titulos-guiaIn">Modificar horas rechazadas</h3>
          <div className="celes-divider" />
          <p>Si su académico le rechazó horas, siga los siguientes pasos:</p>
          <img
             src={tablaRechazada}
             alt="tablaRechazada"
             className=" fade-in centered large-image"
            />
            <ol>
                <li>
                Presione el botón de editar que encontrará a la par de los registros rechazados.
                </li>
                <img
             src={modificarHoras}
             alt="modificarHoras"
             className=" fade-in centered medium-image"
            />
                
            </ol>
          
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
export default GuiaEstudiantes;