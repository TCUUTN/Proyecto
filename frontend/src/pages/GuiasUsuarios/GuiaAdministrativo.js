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
//Lista Socios
import listSocios from "../../Assets/Images/Guias/Academicos/ListaSocios.png";
import CreacList_Inf from "../../Assets/Images/Guias/Academicos/CrearListSocios_Info.png";
import CreacList_Cont from "../../Assets/Images/Guias/Academicos/CrearListSocios_Contact.png";
import CreacList_Otr from "../../Assets/Images/Guias/Academicos/CrearListSocios_Otros.png";
//Solicitud de cartas
import SolicitudCarta from "../../Assets/Images/Guias/Administrativo/Socio.png";
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
              continuidad, en prórroga o son nuevos. En la sección derecha,
              encontrarás una lista de todos los proyectos activos junto con el
              cuetrimestre y al año al que pertenecen. Al hacer clic en el ícono
              de la puerta, accederás a un listado detallado de los estudiantes
              participantes en ese proyecto específico.
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
              un archivo PDF que podrás guardar en tu dispositivo.
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
            Esta sección te permite gestionar a todos los usuarios del sistema.
            Podrás realizar cargas masivas de datos a través de plantillas,
            buscar usuarios por identificación o nombre, filtrar por estado
            (activo o inactivo) y rol (académico, administrativo, estudiante).
            Además, podrás agregar nuevos usuarios haciendo clic en el botón
            <strong> + </strong> y editar la información de los usuarios
            existentes haciendo clic en el
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
            dos campos adicionales: <strong> Carrera</strong> y
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
                  Esta sección te permite gestionar todos tus proyectos. Puedes
                  buscar proyectos específicos por su código, nombre o modalidad
                  (presencial, virtual o híbrida). Además, puedes agregar nuevos
                  proyectos con un simple clic en el botón <strong> + </strong>o
                  editar los existentes haciendo clic en el
                  <strong> icono del lápiz </strong>. Para cargar varios
                  proyectos a la vez, utiliza la opción 'Carga Masiva'
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
                  llenado toda la información, haz clic en el botón
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
                  en <strong>'Agregar Grupos'</strong> y para editar los grupos
                  existentes con el
                  <strong>icono del lápiz</strong>. Tambien, puedes cargar
                  múltiples grupos a la vez usando la opción
                  <strong>Carga Masiva</strong> y ademas puedes activar o
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
          <p>
            <strong>Nota:</strong> Esta opcion solo se encuentra disponible para
            Cargar Usuarios de tipo Académico o estudiante, Proyectos, Grupos y
            las carreras de los estudiantes.
          </p>
          <p>
            Para cargar varios registros en una única vez sin tener que ir
            registro por registro, sigue estos pasos:
          </p>
          <ol>
            <li>
              <strong>Obtener las Plantillas: </strong>
              <ul>
                <li>Dirígete a la sección "Información".</li>
                <li>Busca y descarga las plantillas que necesites.</li>
              </ul>
            </li>
            <li>
              <strong> Revisa el formato:</strong> Asegúrate de cumplir con el
              formato de cada columna en las plantilla.
            </li>
            <li>
              <strong> Ingresa los datos:</strong> Llena cada plantilla con la
              información requerida.
            </li>
            <li>
              <strong> Verifica tus datos:</strong> Valida que todos los datos
              sean correctos.
            </li>

            <li>
              <strong>Sube tu Plantilla: </strong>
              <ul>
                <li>
                  <strong>Académicos:</strong> Ve a la sección de
                  <strong>Usuarios</strong> y utiliza la opción de
                  <strong>Cargar Académicos</strong>.
                </li>
                <li>
                  <strong>Proyectos:</strong> Dirígete a la sección de
                  <strong>Proyectos</strong>y ustiliza la opción
                  <strong>Cargar Proyectos</strong>.
                </li>
                <li>
                  <strong> Grupos:</strong> Accede a la sección de
                  <strong>Creación de Grupos</strong> y usa la opción
                  <strong>Cargar Grupos</strong>. Antes de enviar esta
                  plantilla, asegurate de que los académicos y los proyectos que
                  estan agregando a tus grupos, se encuentren agregados
                  previamente al sistema.
                </li>
                <li>
                  <strong> Estudiantes:</strong> Vuelve a la sección de
                  <strong>Usuarios</strong>y utiliza la opción
                  <strong>Subir Estudiantes</strong>. Antes de enviar esta
                  plantilla, asegurate de que las informacion del grupo al que
                  estas añadiendo estos estudiantes, se encuentre añadida al
                  sistema previamente.
                </li>
                <li>
                  <strong> Carreras:</strong> En la sección de
                  <strong>Usuarios</strong>, busca la opción de
                  <strong>Cargar Carreras</strong>.
                </li>
              </ul>
            </li>
          </ol>
          <p>
            <strong>Nota:</strong> Sigue la anterior secuencia de pasos
            correctamente, para el sistema no te muestre ningún error a la hora
            de cargar alguno de los archivos. Adémas revisa antes de subir cada
            uno de los archivos que vayan con la informacion correcta y que sea
            el archivo correcto para cada opción, de lo contrario también el
            sistema te puede reflejar algún error.
          </p>
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
                  <strong> Filtros de busqueda:</strong> Permite buscar rápidamente a los
                  socios comunitarios por nombre, tipo de institución o estado.
                </li>
                <li>
                  <strong> Descarga de información:</strong> Genera un informe
                  en PDF con la información completa de los socios comunitarios.
                </li>
                <li>
                  <strong> Ubicación a tu alcance:</strong> El ícono de
                  compartir te redirigirá a la ubicación del socio comunitario
                  seleccionado.
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
                  <strong>Solicitudes Pendientes:</strong> Esta sección muestra
                  una lista de las solicitudes de cartas que aún no se han
                  completado. La lista se puede filtrar por nombre del socio o
                  nombre del estudiante. Cada solicitud en la lista muestra el
                  nombre del socio, el nombre completo del estudiante y ofrece
                  una acción directa: al hacer clic en el ícono de la carta, se
                  accede a un formulario de revisión y envío detallado de la
                  solicitud.
                </li>
                <li>
                  <strong>Solicitudes Completadas:</strong> Ver una lista de las
                  solicitudes de cartas que se han completado y ya se han
                  enviado. La lista se puede filtrar por nombre del socio,
                  nombre del estudiante o nombre de la carta.
                </li>
                <img
                  src={SolicitudCarta}
                  alt="SolicitudCarta"
                  className=" fade-in centered medium-image"
                />
                <br></br>
                <li>
                  Al hacer clic en el ícono de la carta{" "}
                  <strong> Revisión Solicitada</strong>, accederás a una
                  pantalla donde podrás revisar los detalles de la solicitud.
                  Aquí verás el nombre del socio y una lista de los estudiantes
                  involucrados. Para finalizar el proceso, adjunta el archivo de
                  la carta correspondiente y haz clic en "Enviar". Una vez
                  enviada, el socio, los estudiantes y el académico recibirán
                  una notificación por correo electrónico confirmando la
                  solicitud
                  <img
                    src={SocioEnviar}
                    alt="SocioEnviar"
                    className=" fade-in centered medium-image"
                  />
                </li>
              </ul>
            </li>
          </ol>
        </div>

        {/* Section explicacion de la Boleta de Conclusión */}
        <div className="section-guias" id="boletaC">
          <h3 className="titulos-guiaIn">Boleta de Conclusión</h3>
          <div className="celes-divider" />
          <ul>
            <li>
              Cuando entras al modulo de boleta de conclusiones vas a ver unos
              filtros y debes seleccionar el año y el cuatrimestre para que te
              muestre la lista de los grupos activos y por lo menos que un
              estudiante haya enviado una boleta de conclusion.
            </li>
            <img
              src={SeleccionarBol}
              alt="SeleccionarBol "
              className=" fade-in centered medium-image"
            />
            <li>Luego, el sistema te mostrará los grupos listos.</li>
            <img
              src={MuestraGrupos}
              alt="MuestraGrupos "
              className=" fade-in centered medium-image"
            />
            <li>
              Cunado entres al grupo vas encontrar una lista de los estudiantes
              que ya llenaron la boleta de conclusion y preciona el boton de ver
              boleta de conclusión.
            </li>
            <img
              src={VerGrupos}
              alt="VerGrupos  "
              className=" fade-in centered medium-image"
            />
            <li>
              Cuando se accede a la sección{" "}
              <strong> Ver boleta de conclusión</strong>, se presenta un
              formulario diseñado para registrar las conclusiones de las labores
              asignadas a los estudiantes. En este registro, se visualiza la
              información que cada estudiante ha ingresado al finalizar cada
              labor y su comentario.
            </li>
            <img
              src={VerBoleta}
              alt="VerBoleta  "
              className=" fade-in centered small-image"
            />
          </ul>
        </div>
        {/* Section explicacion de la Información*/}
        <div className="section-guias" id="informacionE">
          <h3 className="titulos-guiaIn">Información</h3>
          <div className="naranja-divider" />
          <ol>
            Esta sección tiene dos partes:
            <li>
              <strong> Información General: </strong>
              En este módulo, tendrás acceso a toda la información general del
              TCU. Localiza rápidamente los documentos que necesitas utilizando
              los filtros de fecha, descripción y nombre de archivo. Una vez
              encontrado, podrás descargarlo de manera sencilla. Además, tienes
              la posibilidad de añadir nueva información general al sistema
              haciendo clic en el botón correspondiente, o bien, editar la
              información existente utilizando el icono del lápiz.
              <img
                src={InfoG}
                alt="InfoG "
                className=" fade-in centered medium-image"
              />
              <ul>
                <strong>Agregar Información General: </strong>
                <li>
                  En esta sección podrás añadir nueva información al sistema.
                  Simplemente completa la descripción del contenido y adjunta el
                  archivo correspondiente. Una vez hecho esto, haz clic en
                  <strong> Añadir</strong> para guardar los cambios.
                </li>
                <img
                  src={infoCrea}
                  alt="infoCrea  "
                  className=" fade-in centered medium-image"
                />
              </ul>
            </li>
            <br></br>
            <li>
              <strong> Plantillas para la carga masiva </strong>
              Esta sección es tu centro de gestión de plantillas para cargas
              masivas. Para encontrar la plantilla que buscas, aplica los
              filtros de fecha o nombre de archivo. Al localizarla, descárgala
              para comenzar a utilizarla. Si necesitas añadir una nueva
              plantilla al sistema, haz clic en el botón{" "}
              <strong>Agregar Plantilla</strong> y sigue las instrucciones.
              <img
                src={Plantilla}
                alt="Plantilla  "
                className=" fade-in centered medium-image"
              />
              <ul>
                <strong>Agregar Plantilla: </strong>
                <li>
                  En esta sección podrás añadir nuevas plantillas al sistema.
                  Para hacerlo, debes darle clic en
                  <strong> Subir Archivo</strong>y solo debes seleccionar la
                  plantilla que deseas. Una vez seleccionada, confirma la acción
                  haciendo clic en
                  <strong> Añadir</strong>.
                </li>
                <img
                  src={PlantillaCrear}
                  alt="PlantillaCrear  "
                  className=" fade-in centered medium-image"
                />
              </ul>
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
