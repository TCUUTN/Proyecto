import React, { useEffect } from "react";
import "./Guias.css";
import { TiArrowUpThick } from "react-icons/ti";
import { toast, ToastContainer } from "react-toastify";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import banderaCombinada from "../../Assets/Images/Bandera Combinada.png";
import NavbarAdm from "../../Assets/Images/Guias/Administrativo/Navbar.png";
//Usuario
import Usuarios from "../../Assets/Images/Guias/Administrativo/Usuarios.png";
import CrearUsuario from "../../Assets/Images/Guias/Administrativo/CrearUsuario.png";
import SeleccionarRol from "../../Assets/Images/Guias/Administrativo/SeleccionarRolUsuario.png";
//Grupos
import CrearProyectos from "../../Assets/Images/Guias/Administrativo/CrearProyectos.png";
import Proyectos from "../../Assets/Images/Guias/Administrativo/Proyectos.png";
import Grupos from "../../Assets/Images/Guias/Administrativo/Grupos.png";
import CrearGrupos from "../../Assets/Images/Guias/Administrativo/CrearGrupos.png";
//Socios Comunitarios
import SocioEnviar from "../../Assets/Images/Guias/Administrativo/SocioSolicitudEnviar.png";
//Boleta de Conclusion
import SeleccionarBol from "../../Assets/Images/Guias/Administrativo/BoletaSeleccionar.png";
import MuestraGrupos from "../../Assets/Images/Guias/Administrativo/BoletaGrupos.png";
import VerGrupos from "../../Assets/Images/Guias/Administrativo/BoletaGrupoVer.png";
import VerBoleta from "../../Assets/Images/Guias/Administrativo/VerBoletaConclusion.png";
//Pagina de Inicio
import Pagn1 from "../../Assets/Images/Guias/Administrativo/1_PaginaInicio.png";
import Pagn2 from "../../Assets/Images/Guias/Administrativo/2_PaginaInicio.png";
import Pagn3 from "../../Assets/Images/Guias/Administrativo/3_PaginaInicio.png";
//Informacion
import InfoG from "../../Assets/Images/Guias/Administrativo/Informacion_General.png";
import infoCrea from "../../Assets/Images/Guias/Administrativo/informacion_General_Admin.png";
import Plantilla from "../../Assets/Images/Guias/Administrativo/Plantillas_Admin.png";
import PlantillaCrear from "../../Assets/Images/Guias/Administrativo/Plantillas_Crear.png";

function GuiaAdmininistrativo() {
  useEffect(() => {
    const sections = document.querySelectorAll(".section");
    //Funcion del boton flotante
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

  // Descargar pdf
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
      toast.error(
        "Error al generar el PDF. Por favor, intente de nuevo: ",
        error
      );
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
            <ul className="guiaIn-contenido-A ">
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
                <a className="interlink-guiaIn" href="#cargaMa">
                  Carga masiva
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
              <strong>Usuario:</strong> Contiene la lista de los usuarios del
              TCU.
            </li>
            <li>
              <strong>Grupos:</strong> Sección se divide en dos partes que seria
              por proyectos y la creacion de grupos.
            </li>
            <li>
              <strong>Socios Comunitarios:</strong> Contiene la lista de socios
              y también puedes hacer las revisiones de las solicitudes de las
              cartas y enviarlas.
            </li>
            <li>
              <strong>Boleta de Conclusión:</strong> Sección donde puedes
              filtrar las boletas de conclusion completadas.
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
        {/* Section explicacion de la Página de inicio */}
        <div className="section-guias " id="paginaInicio">
          <h3 className="titulos-guiaIn">Página de inicio</h3>
          <div className="celes-divider" />
          <ul>
            <li>
              Esta pantalla te brinda una visión general de los proyectos en
              curso y el avance de los estudiantes. A la izquierda, un gráfico
              circular muestra la distribución de los estudiantes en cada
              proyecto, detallando cuántos están activos, en proceso de
              continuidad, en prórroga o son nuevos. Adicionalmente, indica el
              cuatrimestre en el que se encuentra el proyecto. En la sección
              derecha, encontrarás una lista de todos los proyectos activos. Al
              hacer clic en el ícono de la puerta, accederás a un listado
              detallado de los estudiantes participantes en ese proyecto
              específico.
            </li>
            <img
              src={Pagn1}
              alt="Pagn1 "
              className=" fade-in centered large-image"
            />
            <li>
              En esta sección de reporte de género se personaliza según el
              periodo académico seleccionado. Una vez indicados el año y el
              cuatrimestre, y al hacer clic en 'Buscar', se presentará un
              gráfico circular que representa visualmente la proporción de
              estudiantes por género. Adicionalmente, se mostrará una tabla con
              los datos numéricos correspondientes.
            </li>
            <img
              src={Pagn2}
              alt="Pagn2 "
              className=" fade-in centered large-image"
            />
            <li>
              Para obtener una versión imprimible del reporte de género,
              simplemente haz clic en el botón de descarga. El sistema generará
              un archivo PDF que podrás guardar en tu dispositivo y compartir
              con otros usuarios autorizados
            </li>
            <img
              src={Pagn3}
              alt="Pagn3 "
              className=" fade-in centered large-image"
            />
          </ul>
        </div>
        {/* Section explicacion de usuarios */}

        <div className="section-guias" id="usuarios">
          <h3 className="titulos-guiaIn">Usuarios</h3>
          <div className="naranja-divider" />
          <p>
            Esta sección te permite gestionar de forma eficiente a todos los
            usuarios del sistema. Podrás realizar cargas masivas de datos a
            través de plantillas, buscar usuarios por identificación o nombre,
            filtrar por estado (activo o inactivo) y rol (académico,
            administrativo, estudiante). Además, podrás agregar nuevos usuarios
            haciendo clic en el botón <strong> + </strong> y editar la
            información de los usuarios existentes haciendo clic en el
            <strong> icono del lápiz </strong> ubicado en la columna de acciones
          </p>
          <img
            src={Usuarios}
            alt="Usuarios "
            className=" fade-in centered medium-image"
          />
          <p>Para agregar un nuevo usuario, sigue estos pasos:</p>
          <ol>
            <li>
              Haz clic en el botón <strong> Agregar usuario </strong>.
            </li>
            <li>Se abrirá un formulario.</li>
            <li>Completa todos los campos requeridos.</li>
            <li>Haz clic en 'Guardar' para finalizar el proceso.</li>
          </ol>
          <img
            src={CrearUsuario}
            alt="CrearUsuario "
            className=" fade-in centered small-image"
          />
          <p>
            Al seleccionar el rol de <strong> Estudiante</strong>, se activarán
            dos campos adicionales: <strong> Carrera</strong> y{" "}
            <strong> Selecciona un grupo</strong>. Estos campos son obligatorios
            para completar el registro de un estudiante. Por favor, especifica
            la carrera que cursa y el grupo al que pertenece
          </p>
          <img
            src={SeleccionarRol}
            alt="SeleccionarRol "
            className=" fade-in centered small-image"
          />
        </div>

        {/* Section explicacion de grupos */}
        <div className="section-guias" id="grupos">
          <h3 className="titulos-guiaIn">Grupos</h3>
          <div className="celes-divider " />
          <p>En esta sección se divide es dos partes:</p>
          <ol>
            <li>
              <strong>Proyectos: </strong>
              <ul>
                <li>
                  Esta sección te permite gestionar todos tus proyectos de
                  manera eficiente. Puedes buscar proyectos específicos por su
                  código, nombre o modalidad (presencial, virtual o híbrida).
                  Además, puedes agregar nuevos proyectos con un simple clic en
                  el botón <strong> + </strong> o editar los existentes haciendo
                  clic en el <strong> icono del lápiz </strong>. Para cargar
                  varios proyectos a la vez, utiliza la opción 'Carga Masiva'
                </li>
                <img
                  src={Proyectos}
                  alt="Proyectos"
                  className=" fade-in centered large-image"
                />
                <li>
                  Al hacer clic en <strong>Agregar proyectos</strong> accederás
                  a un formulario. En este formulario te pedirá que ingreses
                  ciertos datos esenciales y es importante que completes todos
                  los campos obligatorios antes de guardar. Una vez que hayas
                  llenado toda la información, haz clic en el botón{" "}
                  <strong> Guardar</strong> para agregar el proyecto a la lista.
                </li>
                <img
                  src={CrearProyectos}
                  alt="CrearProyectos"
                  className=" fade-in centered small-image"
                />
              </ul>
            </li>
            <li>
              <strong> Creación de grupos: </strong>
              <ul>
                <li>
                  Esta sección encontrarás un listado completo de todos los
                  grupos. Puedes buscar grupos por código o nombre de proyectos
                  , por cuatrimestre y año. Para agregar nuevos grupos, haz clic
                  en 'Agregar Grupos' y para editar los grupos existentes con el
                  icono del lápiz. Tambien, puedes cargar múltiples grupos a la
                  vez usando la opción 'Carga Masiva' y ademas puedes activar o
                  desahilitar el boton de finalizar los cuatrimestres para que
                  los academicos puedan finalizar el cuatrimestre de sus grupos.
                </li>
                <img
                  src={Grupos}
                  alt="Grupos"
                  className=" fade-in centered large-image"
                />
                <li>
                  Cuando desees crear un nuevo grupo, haz clic en el botón
                  <strong> Agregar Creación de Grupos</strong>. Aparecerá un
                  formulario donde deberás ingresar toda la información
                  solicitada. Una vez que hayas completado todos los campos
                  obligatorios, el botón 'Guardar' se habilitará y podrás
                  registrar el nuevo grupo.
                </li>
                <img
                  src={CrearGrupos}
                  alt="CrearGrupos"
                  className=" fade-in centered small-image"
                />
              </ul>
            </li>
          </ol>
        </div>

        {/* Section explicacion de la carga Masiva */}
        <div className="section-guias " id="cargaMa">
          <h3 className="titulos-guiaIn">Carga Masiva</h3>
          <div className="celes-divider" />
          <p>Sigue estos pasos:</p>
          <ol>
            <li>
              <strong>Obtener las Plantillas: </strong>
              <ul>
                <li>Dirígete a la sección "Información".</li>
                <li>Busca y descarga las plantillas</li>
              </ul>
            </li>
            <li>
              <strong> Revisa el formato:</strong> Asegúrate de comprender el
              formato de cada columna en las plantillas.
            </li>
            <li>
              <strong> Ingresa los datos:</strong> Llena cada plantilla con la
              información requerida
            </li>
            <li>
              <strong> Asegúrate de la precisión:</strong> Verifica que todos
              los datos sean correctos
            </li>
            <li>
              <strong>Académicos:</strong> Ve a la sección "Usuarios" y utiliza
              la opción de carga masiva.
            </li>
            <li>
              <strong>Proyectos:</strong> Dirígete a la sección "Proyectos" y
              carga la plantilla correspondiente.
            </li>
            <li>
              <strong> Grupos:</strong> Accede a la sección "Creación de Grupos"
              y sube la plantilla de grupos.
            </li>
            <li>
              <strong> Estudiantes:</strong> Vuelve a la sección "Usuarios" y
              utiliza la opción de carga masiva de estudiantes.
            </li>
            <li>
              <strong> Carreras:</strong> En la sección "Usuarios", busca la
              opción de carga masiva de carreras.
            </li>
          </ol>
        </div>

        {/* Botón flotante */}
        <button className="scroll-to-top" onClick={handleScrollToTop}>
          <TiArrowUpThick />
        </button>
        {/* Boton de descarga*/}
        <button className="download-button" onClick={handleDownloadPDF}>
          Descargar Guía
        </button>
      </div>
    </div>
  );
}
export default GuiaAdmininistrativo;
