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
import boletac from "../../Assets/Images/Guias/Estudiante/BoletaConclu_Est.png";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import banderaCombinada from "../../Assets/Images/Bandera Combinada.png";

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
      behavior: "smooth",
    });
  };

  const handleDownloadPDF = async () => {
    const sections = document.querySelectorAll(".section-guias");
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

                // Skip the "Contenido" section
                if (section.classList.contains("section-contenido")) continue;

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
            pdf.save("Guía de Estudiantes.pdf");

            // Show the buttons after capturing
            scrollToTopButton.style.display = "block";
            downloadButton.style.display = "block";
        };
    } catch (error) {
        console.error("Error generating PDF:", error);
        alert("Error al generar el PDF. Por favor, intente de nuevo.");
    }
};
  return (
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
          <div className="section-guias section-contenido">
            <h3 className="titulos-guiaIn">Contenido</h3>
            <div className="celes-divider" />
            <ul className="guiaIn-contenido-Ac ">
              <li>
                <a className="interlink-guiaIn" href="#paginaInicio">
                  {" "}
                  Página de inicio
                </a>
              </li>
              <li>
                <a className="interlink-guiaIn" href="#registrarHoras">
                  {" "}
                  Ingresar horas
                </a>
              </li>
              <li>
                <a className="interlink-guiaIn" href="#modificarHoraRec">
                  {" "}
                  Como modificar horas rechazadas
                </a>
              </li>
              <li>
                <a className="interlink-guiaIn" href="#boletaC">
                  {" "}
                  Boletas de conclusión
                </a>
              </li>
              <li>
                <a className="interlink-guiaIn" href="#informacionE">
                  {" "}
                  Información
                </a>
              </li>
            </ul>
          </div>
        </div>
        {/* Section explicacion del navegacion */}
        <div className="section-guias">
          <h3 className="titulos-guiaIn">Navegación</h3>
          <div className="naranja-divider" />
          <p>Lo que contiene:</p>
          <ul>
            <li>
              <strong>Los logos de la UTN y el TCU:</strong> te redirigen al
              inicio de la página.
            </li>
            <li>
              <strong>Ingresar horas:</strong> Donde puedes ver la bitácora y
              agregar actividades.
            </li>
            <li>
              <strong>Información:</strong> Contiene varias secciones en las que
              podras encontrar la guía de usuario, información proporcionada por
              el académico e información de carácter general.
            </li>
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
          <p>
            La primera es una sección de información en la cual podrás encontrar
            todo lo relacionado al grupo al cual te encuentras inscrito.
            <br></br>
            En la segunda sección vas a encontrar tres barras de progreso las
            cuales representan tu progreso de las horas subidas y aprobadas en
            total y por tipo.
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
            <p>
              <strong>Nota: Subir archivos es opcional.</strong>
            </p>
            <br></br>
            <p>
              Una vez completados los datos, presiona en guardar. Si el proceso
              muestra un mensaje de error en las horas o en la fecha, corrígelo
              y vuelve a presionar en guardar.
            </p>

            <li>
              Una vez que el registro haya sido guardado exitosamente, te
              devolverá a la pantalla de la bitácora.
            </li>
            <img
              src={ingresarHCompl}
              alt="ingresarHCompl"
              className=" fade-in centered large-image"
            />
            <p>
              <strong>
                Nota: Con el botón de generar reportes, podrás descargar un PDF
                con el registro de tus horas.{" "}
              </strong>
            </p>
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
              Presione el botón de editar que encontrará a la par de los
              registros rechazados.
            </li>
            <img
              src={modificarHoras}
              alt="modificarHoras"
              className=" fade-in centered medium-image"
            />
          </ol>
        </div>
        {/*Seccion explicacion de la boleta C*/}
        <div className="section-guias" id="boletaC">
          <h3 className="titulos-guiaIn">Boletas de conclusión</h3>
          <div className="naranja-divider" />
          <p>
            Para acceder a esta sección, necesitarás haber cumplido con el
            requisito de las 150 horas aprobadas en la bitacora TCU. Una vez
            cumplido esto, la opción se habilitará en la barra de navegación. Al
            seleccionarla, se mostrará un formulario. Por favor, complétalo con
            la información solicitada.
          </p>
          <img
            src={boletac}
            alt="boletac"
            className=" fade-in centered small-image"
          />
          <p>
            En caso de que el Académico rechace su boleta, el sistema te va a
            dejar volverla a editar para que la puedas subir nuevamente, una vez
            que el académico te apruebe la boleta, te va a llegar un correo
            electrónico con la aprobación del TCU.
          </p>
        </div>
        {/* Section explicacion de la Información*/}
        <div className="section-guias" id="informacionE">
          <h3 className="titulos-guiaIn">Información</h3>
          <div className="celes-divider" />
            
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
export default GuiaEstudiantes;
