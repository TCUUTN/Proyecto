import React, { useEffect } from "react";
import "./Guias.css";
import { TiArrowUpThick } from "react-icons/ti";
import { toast, ToastContainer } from "react-toastify";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import banderaCombinada from "../../Assets/Images/Bandera Combinada.png";
import NavbarAdm from "../../Assets/Images/Guias/Administrativo/Navbar.png";
//Usuario

//Grupos

//Socios Comunitarios

//Boleta de Conclusion

//Pagina de Inicio

//Informacion

function GuiaAdmininistrativo() {
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
        const headerImgHeight =
          headerImgWidth * (headerImg.height / headerImg.width); // Maintain aspect ratio

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
            pdf.addImage(
              headerImg,
              "PNG",
              (pageWidth - headerImgWidth) / 2,
              headerY,
              headerImgWidth,
              headerImgHeight
            );
            y += contentStartY;
          }

          // Calculate the remaining height on the current page
          let remainingPageHeight = footerY - y;

          // Add content image
          if (imgHeight <= remainingPageHeight) {
            pdf.addImage(
              imgData,
              "PNG",
              marginw,
              y,
              imgWidth,
              imgHeight,
              undefined,
              "FAST"
            );
            y += imgHeight + spaceBetweenImages;
          } else {
            let imgY = 0;

            while (imgY < imgHeight) {
              const imgRemainingHeight = imgHeight - imgY;
              const imgHeightForPage = Math.min(
                imgRemainingHeight,
                remainingPageHeight
              );

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
                (imgHeightForPage / imgWidth) * imgProps.width,
                0,
                (imgY / imgHeight) * 100,
                (imgHeightForPage / imgHeight) * 100
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
                pdf.addImage(
                  headerImg,
                  "PNG",
                  (pageWidth - headerImgWidth) / 2,
                  headerY,
                  headerImgWidth,
                  headerImgHeight
                );
                y += contentStartY;
              }
            }
          }

          // Add footer
          pdf.setFillColor("#002b69");
          pdf.rect(0, footerY, pageWidth, footerHeight, "F");
          pdf.setFontSize(10);
          pdf.setTextColor(255, 255, 255);
          pdf.text(
            `Página ${pdf.internal.getNumberOfPages()}`,
            pageWidth / 2,
            footerY + 10,
            { align: "center" }
          );
          pdf.text(
            `© ${new Date().getFullYear()} Universidad Técnica Nacional.`,
            pageWidth / 2,
            footerY + 20,
            { align: "center" }
          );
          pdf.text(
            "Todos los derechos reservados.",
            pageWidth / 2,
            footerY + 30,
            { align: "center" }
          );

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
      toast.error("Error al generar el PDF. Por favor, intente de nuevo: ",error);
    }
  };

  return (
    <div className="contenedor-guias">
    <ToastContainer position="bottom-right" />
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
          <div className=" section-contenido">
            <h3 className="titulos-guiaIn">Contenido</h3>
            <div className="celes-divider" />
            <ul className="guiaIn-contenido-Ac ">
              <li>
                <a className="interlink-guiaIn" href="#paginaInicio">
                  Página de inicio
                </a>
              </li>
              <li>
                <a className="interlink-guiaIn" href="#usuarios">
                  Usuario
                </a>
              </li>
              <li>
                <a className="interlink-guiaIn" href="#grupos">
                  Grupos
                </a>
              </li>
              <li>
                <a className="interlink-guiaIn" href="#sociosC">
                  Socios Comunitarios
                </a>
              </li>
              <li>
                <a className="interlink-guiaIn" href="#boletaC">
                  Boletas de conclusión
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
              <strong>Usuario:</strong> Contiene la lista de los usuarios del TCU.
            </li>
            <li>
              <strong>Grupos:</strong> Sección se divide en dos partes que seria
              por proyectos y la creacion de grupos.
            </li>
            <li>
              <strong>Socios Comunitarios:</strong> Contiene la lista de socios y
              también puedes hacer las revisiones de las solicitudes de las
              cartas y enviarlas.
            </li>
            <li>
              <strong>Boleta de Conclusión:</strong> Sección donde puedes filtrar
              las boletas de conclusion completadas.
            </li>
            <li>
              <strong>Información:</strong> Contiene varias secciones en las que
              podras encontrar las guías de usuarios, aqui podras proporcionar
              informacion general.
            </li>
          </ul>
          <img
            src={NavbarAdm}
            alt="NavbarAdm"
            className=" fade-in centered large-image"
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
export default GuiaAdmininistrativo;
