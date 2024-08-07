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
import banderaCombinada from "../../Assets/Images/Bandera Combinada.png";
import { toast, ToastContainer } from "react-toastify";

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

  const handleDownloadPDF = async () => {
    const sections = document.querySelectorAll(".section");
    const scrollToTopButton = document.querySelector(".scroll-to-top");
    const downloadButton = document.querySelector(".download-button");

    // Hide the buttons before capturing
    scrollToTopButton.style.display = "none";
    downloadButton.style.display = "none";

    const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "letter",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const marginw = 20;
    const headerHeight = 35; // Adjust header height
    const footerHeight = 35; // Adjust footer height
    const spaceBetweenImages = 5; // 5px space between images
    const fixedWidth = 1200; // Fixed width for a computer screen
    const headerFooterSpacing = -10; // Space between header/footer and content

    try {
        // Load header image
        const headerImg = new Image();
        headerImg.src = banderaCombinada;

        headerImg.onload = async () => {
            const headerImgWidth = pageWidth / 6;
            const headerImgHeight = headerImgWidth * (headerImg.height / headerImg.width); // Maintain aspect ratio

            const headerY = 0;
            const contentStartY = headerHeight + headerFooterSpacing;
            const footerY = pageHeight - footerHeight;
            let y = 0;

            for (let i = 0; i < sections.length; i++) {
                const section = sections[i];

                // Store original styles
                const originalStyles = {
                    width: section.style.width,
                    height: section.style.height,
                    maxWidth: section.style.maxWidth,
                    minWidth: section.style.minWidth,
                };

                // Apply fixed size
                section.style.width = `${fixedWidth}px`;
                section.style.height = "auto"; // Adjust height automatically
                section.style.maxWidth = "none";
                section.style.minWidth = "none";

                const canvas = await html2canvas(section, { scale: 2 });
                const imgData = canvas.toDataURL("image/png", 0.5); // Reduce image quality to make the PDF lighter
                const imgProps = pdf.getImageProperties(imgData);
                const imgWidth = pageWidth - 2 * marginw;
                const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

                // Restore original styles
                section.style.width = originalStyles.width;
                section.style.height = originalStyles.height;
                section.style.maxWidth = originalStyles.maxWidth;
                section.style.minWidth = originalStyles.minWidth;

                // Add header if starting a new page
                if (y === 0 || y + imgHeight > footerY) {
                    if (y !== 0) {
                        pdf.addPage();
                    }
                    y = contentStartY;

                    // Add header for new page
                    pdf.setFillColor("#002b69");
                    pdf.rect(0, 0, pageWidth, headerHeight, "F");
                    pdf.addImage(headerImg, "PNG", (pageWidth - headerImgWidth) / 2, headerY, headerImgWidth, headerImgHeight);
                    y += contentStartY;
                }

                // Calculate the remaining height on the current page
                let remainingPageHeight = footerY - y;

                // Add content image
                if (imgHeight <= remainingPageHeight) {
                    pdf.addImage(imgData, "PNG", marginw, y, imgWidth, imgHeight, undefined, "FAST");
                    y += imgHeight + spaceBetweenImages;
                } else {
                    let imgY = 0;

                    while (imgY < imgHeight) {
                        const imgRemainingHeight = imgHeight - imgY;
                        const imgHeightForPage = Math.min(imgRemainingHeight, remainingPageHeight);

                        pdf.addImage(
                            imgData,
                            "PNG",
                            marginw,
                            y,
                            imgWidth,
                            imgHeightForPage,
                            undefined,
                            "FAST",
                            "SLOW",
                            0,
                            0,
                            imgProps.width,
                            imgHeightForPage / imgWidth * imgProps.width,
                            0,
                            imgY / imgHeight * 100,
                            imgHeightForPage / imgHeight * 100
                        );

                        imgY += imgHeightForPage;
                        y += imgHeightForPage + spaceBetweenImages;

                        if (imgY < imgHeight) {
                            pdf.addPage();
                            y = contentStartY;
                            remainingPageHeight = footerY - y;

                            // Add header for new page
                            pdf.setFillColor("#002b69");
                            pdf.rect(0, 0, pageWidth, headerHeight, "F");
                            pdf.addImage(headerImg, "PNG", (pageWidth - headerImgWidth) / 2, headerY, headerImgWidth, headerImgHeight);
                            y += contentStartY;
                        }
                    }
                }

                // Add footer
                pdf.setFillColor("#002b69");
                pdf.rect(0, footerY, pageWidth, footerHeight, "F");
                pdf.setFontSize(10);
                pdf.setTextColor(255, 255, 255);
                pdf.text(`Página ${pdf.internal.getNumberOfPages()}`, pageWidth / 2, footerY + 10, { align: "center" });
                pdf.text(`© ${new Date().getFullYear()} Universidad Técnica Nacional.`, pageWidth / 2, footerY + 20, { align: "center" });
                pdf.text("Todos los derechos reservados.", pageWidth / 2, footerY + 30, { align: "center" });

                // Move to the next section
                remainingPageHeight = footerY - y;
            }

            // Save the PDF
            pdf.save("Guía de Inicio de Sesión.pdf");

            // Show the buttons after capturing
            scrollToTopButton.style.display = "block";
            downloadButton.style.display = "block";
        };
    } catch (error) {
        toast.error("Error al generar el PDF. Por favor, intente de nuevo.");
    }
};





  return (
    <div className="contenedor-guias">
          <ToastContainer position="bottom-right" />
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
          <div className="section-contenido">
            <h3 className="titulos-guiaIn">Contenido</h3>
            <div className="celes-divider" />
            <ul className="guiaIn-contenido  ">
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
                Restablecer Contraseña
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
              temporal para ingresar.
            </li>
            <img
              src={ImageEmailTClaveTemporal}
              alt="Correo con Clave Temporal"
              className="fade-in centered medium-image"
            />
          </ol>
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
              className="fade-in centered extra-small-image"
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
            className="centered medium-image"
          />
        </div>
        {/* Botón flotante */}
        <button className="scroll-to-top" onClick={handleScrollToTop}>
          <TiArrowUpThick />
        </button>
        <button className="download-button" onClick={handleDownloadPDF}>
          Descargar Guía
        </button>
      </div>
    </div>
  );
}

export default GuiaIniciarSesion;
