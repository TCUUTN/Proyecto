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
import listSocios from "../../Assets/Images/Guias/Academicos/ListaSocios.png";
import CreacList_Inf from "../../Assets/Images/Guias/Academicos/CrearListSocios_Info.png";
import CreacList_Cont from "../../Assets/Images/Guias/Academicos/CrearListSocios_Contact.png";
import CreacList_Otr from "../../Assets/Images/Guias/Academicos/CrearListSocios_Otros.png";
//Solicitud de cartas
import SolicitudCarta from "../../Assets/Images/Guias/Academicos/SolicitudCarta.png";
import CreacionSoli from "../../Assets/Images/Guias/Academicos/CreacionSolicitud.png";
//Boleta de conclusion
import boletaC from "../../Assets/Images/Guias/Academicos/BoletaAcademico.png";
import conclus from "../../Assets/Images/Guias/Academicos/ConclusionGrupo_Acade.png";
import formBole from "../../Assets/Images/Guias/Academicos/BoletaConclu_Acade.png";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import banderaCombinada from "../../Assets/Images/Bandera Combinada.png";

import rechazoBoleta from "../../Assets/Images/Guias/Academicos/RechazoBoletaConclu_Acade.png";
function GuiaAcademico() {
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
            pdf.save("Guía de Académicos.pdf");

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
            <ul className="guiaIn-contenido-Ac">
              <li>
                <a className="interlink-guiaIn" href="#paginaInicio">
                  Página de inicio
                </a>
              </li>
              <li>
                <a className="interlink-guiaIn" href="#grupC">
                  Grupos a cargo
                </a>
              </li>
              <li>
                <a className="interlink-guiaIn" href="#sociosC">
                  Socios Comunitarios
                </a>
              </li>
              <li>
                <a className="interlink-guiaIn" href="#boletaC">
                  Boleta de Conclusión
                </a>
              </li>
              <li>
                <a className="interlink-guiaIn" href="#informacionE">
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
              <strong>Grupos:</strong> Sección donde puedes ver tus grupos a
              cargo.
            </li>
            <li>
              <strong>Socios Comunitarios</strong> Contiene la lista de socios y
              también se puede hacer las solicitudes los administrativo para la
              generación de las cartas de vinculación del estudiante al socio
              comunitario.
            </li>
            <li>
              <strong>Boleta de Conclusión</strong> Sección donde puedes ver las
              boletas de conclusion completadas de tus grupos a cargo.
            </li>
            <li>
              <strong>Información:</strong> Contiene varias secciones en las que
              podras encontrar la guía de usuario, aqui podras proporcionarle
              informacion a tus grupos a cargo e información de carácter
              general.
            </li>
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
          <p style={{ textAlign: "center" }}>
            En la página de inicio encontrarás una lista de gráficos que te
            muestra en tiempo real el estado actual de tus estudiantes por grupo
            que tengas activo.
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
            <li>
              En esta sección, te permite gestionar y filtrar a tus grupos.
              Accede a detalles del grupo, como la lista de estudiantes, ver las
              bitacoras del estudiante y rechazar horas.
              <img
                src={GrupoCargoc}
                alt="GrupoCargoc"
                className=" fade-in centered medium-image"
              />
            </li>
            <li>
              Gestión de grupos de estudiantes:
              <ul>
                <li>
                  Acceso a la lista: Haga clic en el botón "Ver grupo" para
                  visualizar la lista completa de estudiantes pertenecientes a
                  ese grupo específico.
                </li>
                <li>
                  Opciones de filtrado: La herramienta de búsqueda le permite
                  encontrar rápidamente estudiantes por nombre completo o por
                  identificación.
                </li>
                <li>
                  Descarga de información: Para guardar una copia de la lista de
                  estudiantes, utilice el botón "Descargar lista de
                  estudiantes". El formato disponible para la descarga es PDF.
                </li>
              </ul>
              <img
                src={ListaEstGrupoC}
                alt="ListaEstGrupoC"
                className=" fade-in centered medium-image"
              />
            </li>

            <li>
              Ver Bitácoras del Estudiante:
              <ul>
                <li>
                  Visualice: Revise el registro completo de actividades del
                  estudiante
                </li>
                <li>
                  Opciones de filtrado: La herramienta de búsqueda le permite
                  encontrar rápidamente por fecha, tipo de actividad y
                  descripción de la actividad.
                </li>
                <li>
                  Descargar reporte: se genera un informe en PDF que contenga el
                  registro completo de las horas del estudiante.
                </li>
                <li>
                  Rechazar horas: darle al
                  <strong>Icono de la equis (x)</strong>
                </li>
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
                <li>
                  Haga clic en el icono de la equis (x) junto a la actividad que
                  desea rechazar.
                </li>
                <li>
                  Proporcione comentarios constructivos al estudiante explicando
                  por qué se rechaza la actividad.
                </li>
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
          <p>Los socios comunitarios tiene dos opciones</p>
          <ol>
            <li>
              <h5>
                <strong>Lista de Socios:</strong>{" "}
              </h5>
              <ul>
                <li>
                  Filtros de busqueda: Traer rápidamente a los socios
                  comunitarios por nombre, tipo de institución o estado.
                </li>
                <li>
                  Descarga de información: Genera un informe en PDF con la
                  información completa de los socios comunitarios.
                </li>
                <li>
                  Ubicación a tu alcance: El ícono de compartir te redirigirá a
                  la ubicación del socio comunitario seleccionado.
                </li>
                <img
                  src={listSocios}
                  alt="listSocios"
                  className=" fade-in centered medium-image"
                />
                <br></br>
                <li>
                  Le damos clic <strong>agregar socios</strong> y ahi nos va
                  aparecer un formulario que se divide en 2 partes
                  <ol>
                    <li>
                      En esta parte se agrega la información de la institución.
                      <img
                        src={CreacList_Inf}
                        alt="CreacList_Inf"
                        className=" fade-in centered medium-image"
                      />
                    </li>
                    <li>
                      En esta parte se agrega la información del contacto del
                      socio.
                      <img
                        src={CreacList_Cont}
                        alt="CreacList_Cont"
                        className=" fade-in centered medium-image"
                      />
                    </li>
                    <li>Darle al boton guardar.</li>
                  </ol>
                </li>
                <br></br>
                <li>
                  Al hacer clic en el lápiz, podemos editar la información del
                  socio. También podemos cambiar su estado a activo o inactivo.
                  <img
                    src={CreacList_Otr}
                    alt="CreacList_Otr"
                    className=" fade-in centered medium-image"
                  />
                  <p>
                    <strong>No se olvide darle al botón actualizar.</strong>
                  </p>
                </li>
              </ul>
            </li>
            <br></br>
            <li>
              <h5>
                <strong>Solicitud de Socios:</strong>
              </h5>
              <ul>
                <li>
                  Solicitudes Pendientes: Esta sección muestra una lista de las
                  solicitudes de cartas que aún no se han completado. La lista
                  se puede filtrar por nombre del socio o nombre del estudiante.
                  Cada solicitud en la lista muestra el nombre del socio, el
                  nombre completo del estudiante y las acciones disponibles (en
                  este caso, solo una acción: "Editar").
                </li>
                <li>
                  Solicitudes Completadas: Ver una lista de las solicitudes de
                  cartas que se han completado y ya se han enviado. La lista se
                  puede filtrar por nombre del socio, nombre del estudiante o
                  nombre de la carta.
                </li>
                <img
                  src={SolicitudCarta}
                  alt="SolicitudCarta"
                  className=" fade-in centered medium-image"
                />
                <br></br>
                <li>
                  Creación de una solicitud:
                  <ol>
                    <li>
                      Puedes encontrar una lista completa de socios comunitarios
                      que estan activos
                    </li>
                    <li>Busca en tus grupos a cargo.</li>
                    <li>
                      Agrega a los estudiantes: Busca en la lista disponible y
                      selecciona a cada uno de ellos. Un clic en el botón
                      "Añadir estudiante" los agregará a la tabla. ¡No te
                      preocupes si te equivocas! Un icono de acción te permitirá
                      eliminar a cualquier estudiante que hayas seleccionado por
                      error.
                    </li>
                    <li>
                      Una vez que hayas completado los pasos anteriores. Haz
                      clic en el botón "Enviar"
                    </li>
                    <img
                      src={CreacionSoli}
                      alt="CreacionSoli"
                      className=" fade-in centered medium-image"
                    />
                  </ol>
                </li>
              </ul>
            </li>
          </ol>
        </div>
        {/* Section explicacion de la Boleta de Conclusión */}
        <div className="section-guias" id="boletaC">
          <h3 className="titulos-guiaIn">Boleta de Conclusión</h3>
          <div className="celes-divider" />
          <p>
            Cuando entras al modulo de conclusiones vas a ver una lista de los
            grupos activo y por lo menos que un estudiante haya enviado una
            boleta de conclusion.
          </p>

          <img
            src={boletaC}
            alt="boletaC"
            className=" fade-in centered medium-image"
          />
          <ul>
            <li>
              Cunado entres al grupo vas encontrar una lista de los estudiantes
              que ya llenaron la boleta de conclusion y preciona el boton de ver
              boleta de conclusión.
            </li>
            <img
              src={conclus}
              alt="conclus"
              className=" fade-in centered large-image"
            />
            <li>
              Cuando se accede a la sección 'Ver boleta de conclusión', se
              presenta un formulario diseñado para registrar las conclusiones de
              las labores asignadas a los estudiantes. En este registro, se
              visualiza la información que cada estudiante ha ingresado al
              finalizar cada labor y su comentario. Una vez revisados los
              detalles de cada labor, hay dos opciones: aprobarla o rechazarla.
            </li>
            <img
              src={formBole}
              alt="formBole"
              className=" fade-in centered small-image"
            />
            <li>
              Al seleccionar 'Rechazar', se despliega un campo de texto donde
              debes ingresar el motivo de rechazo de la boleta de conclusion. Al
              hacer clic en el botón 'Enviar Rechazo' se confirma la acción y el
              estudiante podrá editar la boleta.
            </li>
            <img
              src={rechazoBoleta}
              alt="rechazoBoleta"
              className=" fade-in centered small-image"
            />
          </ul>
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
        <button className="download-button" onClick={handleDownloadPDF}>
          Descargar Guía
        </button>
      </div>
    </div>
  );
}
export default GuiaAcademico;
