import React, { useEffect } from "react";
import "./Guias.css";
import CompletarPerfil from "../../Assets/Images/Guias/Iniciar S/CompletarPerfil.png";
import ImageEmailTClaveTemporal from "../../Assets/Images/Guias/Iniciar S/ImageEmail.png";
import ImageIniciarS from "../../Assets/Images/Guias/Iniciar S/ImageIniciarS.png";
import ImageOlvidar from "../../Assets/Images/Guias/Iniciar S/ImageOlvidar.png";
import ImageNavbar from "../../Assets/Images/Guias/Iniciar S/navbar icono usuario.png";
import RestablecerClave from "../../Assets/Images/Guias/Iniciar S/RestablecerClave.png";
import { TiArrowUpThick } from "react-icons/ti";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function GuiaIniciarSesion() {
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
      behavior: "smooth",
    });
  };

  const handleDownloadPDF = () => {
    const input = document.getElementById("pdfContent");
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("guia_iniciar_sesion.pdf");
    });
  };

  return (
    <div className="contenedor-guias">
      <div id="pdfContent" className="guias-container">
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
              <li>
                <a className="interlink-guiaIn" href="#iniciarSesion">
                  Iniciar sesión
                </a>
              </li>
              <li>
                <a className="interlink-guiaIn" href="#olvidarContraseña">
                  Olvidar Contraseña
                </a>
              </li>
              <li>
                <a className="interlink-guiaIn" href="#cambiarContraseña">
                  Cambiar Contraseña
                </a>
              </li>
              <li>
                <a className="interlink-guiaIn" href="#completarPerfil">
                  Completar Perfil
                </a>
              </li>
            </ul>
          </div>
        </div>
        {/* Section explicacion de Iniciar S */}
        <div className="section section-guias " id="iniciarSesion">
          <h3 className="titulos-guiaIn">Iniciar sesión</h3>
          <div className="naranja-divider" />
          <p className="text-InS">Sigue estos pasos:</p>
          <ol>
            <li>Introduce tu correo institucional y tu contraseña.</li>
            <li>Haz clic en el botón "Acceder".</li>
          </ol>
          <img
            src={ImageIniciarS}
            alt="Iniciar Sesión"
            className="fade-in centered large-image"
          />
          <p className="alert">
            Si has olvidado tu contraseña, puedes hacer clic en el enlace
            "¿Olvidó su contraseña?" para restablecerla.
          </p>
        </div>
        {/* Section explicacion de Olvidar Contraseña */}
        <div className="section section-guias " id="olvidarContraseña">
          <h3 className="titulos-guiaIn">Olvidar Contraseña</h3>
          <div className="celes-divider" />
          <p>Sigue estos pasos:</p>
          <ol>
            <li>Introduce su dirección de correo institucional.</li>
            <li>Haga clic en el botón "Enviar".</li>
            <img
              src={ImageOlvidar}
              alt="Olvidar Contraseña"
              className="fade-in centered small-image"
            />
            <li>
              Revise su correo institucional, donde le llegará su contraseña
              temporal.
            </li>
          </ol>
          <img
            src={ImageEmailTClaveTemporal}
            alt="Contraseña Temporal"
            className="fade-in centered small-image"
          />
        </div>
        {/* Section explicacion de Restablecer Contraseña */}
        <div className="section section-guias " id="cambiarContraseña">
          <h3 className="titulos-guiaIn">Restablecer Contraseña</h3>
          <div className="naranja-divider" />
          <p>Sigue estos pasos:</p>
          <ol>
            <li>Toca el icono usuario del menú en la barra de navegación.</li>
            <li>
              Selecciona la opción <strong>"Cambio de contraseña"</strong>.
            </li>
            <img
              src={ImageNavbar}
              alt="ImageNavbar"
              className="fade-in centered"
            />
            <li>
              Ingresa los datos pedidos en el formulario para cambiar la
              contraseña. La nueva contraseña debe contener al menos una letra
              mayúscula, una letra minúscula, un número y un carácter especial y
              debe ser mínimo 8 caracteres.
            </li>
          </ol>
          <div className="restablecer-container">
            <div className="ima-resta">
              <img
                src={RestablecerClave}
                alt="Restablecer Contraseña"
                className="fade-in small-image"
              />
            </div>

            <div className="consejos">
              <h4 className="titu-res">
                Consejos para crear una contraseña segura:
              </h4>
              <ul className="conse-puntos">
                <li>Usa una contraseña diferente para cada cuenta.</li>
                <li>No compartas tu contraseña con nadie.</li>
                <li>Cambia tu contraseña regularmente.</li>
              </ul>
            </div>
          </div>
        </div>
        {/* Section explicacion de Completar Perfil */}
        <div className="section section-guias" id="completarPerfil">
          <h3 className="titulos-guiaIn">Completar Perfil</h3>
          <div className="celes-divider" />
          <p>
            Esta pantalla va a aparecer una única vez cuando inicies sesión por
            primera vez. En esta se debe completar la selección de género para
            que escojas con el cual te sientas más apropiado a la hora de
            identificarte o simplemente para que no lo indiques.
          </p>
          <img
            src={CompletarPerfil}
            alt="Completar Perfil"
            className="centered"
          />
        </div>
        {/* Botón flotante */}
        <button className="scroll-to-top" onClick={handleScrollToTop}>
          <TiArrowUpThick />
        </button>
      </div>
      <button className="download-button" onClick={handleDownloadPDF}>
        Descargar PDF
      </button>
    </div>
  );
}

export default GuiaIniciarSesion;
