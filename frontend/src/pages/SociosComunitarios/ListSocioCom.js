import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdAddCircle } from "react-icons/io";
import banderaCombinada from "../../Assets/Images/Bandera Combinada.png";
import { FaMapMarkedAlt, FaWaze, FaShareAlt } from "react-icons/fa";
import { RiEdit2Fill } from "react-icons/ri";
import { Dropdown } from "react-bootstrap";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./ListaSocios.css";

function SocioComunitarios() {
  const [currentPage, setCurrentPage] = useState(1);
  const [socios, setSocios] = useState([]);
  const [filteredSocios, setFilteredSocios] = useState([]);
  const [filters, setFilters] = useState({
    institucion: "",
    contacto: "",
    tipoInstitucion: "",
    estado: ""
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetch("/socios/")
      .then(response => response.json())
      .then(data => {
        setSocios(data);
        setFilteredSocios(data);
      });
  }, []);

  const handleAddUser = () => {
    navigate("/CrearActuSocioComunitarios");
  };

  const handleEditUser = (socioId) => {
    localStorage.setItem("SocioIdSeleccionado", socioId);
    navigate("/CrearActuSocioComunitarios");
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value
    }));
  };

  useEffect(() => {
    const applyFilters = () => {
      let filtered = socios;

      if (filters.institucion) {
        filtered = filtered.filter(socio =>
          socio.NombreSocio.toLowerCase().includes(filters.institucion.toLowerCase())
        );
      }

      if (filters.contacto) {
        filtered = filtered.filter(socio =>
          socio.NombreCompletoContacto.toLowerCase().includes(filters.contacto.toLowerCase())
        );
      }

      if (filters.tipoInstitucion) {
        filtered = filtered.filter(socio =>
          socio.TipoInstitucion.toLowerCase().includes(filters.tipoInstitucion.toLowerCase())
        );
      }

      if (filters.estado !== "") {
        filtered = filtered.filter(socio =>
          String(socio.Estado) === filters.estado
        );
      }

      setFilteredSocios(filtered);
    };

    applyFilters();
  }, [filters, socios]);

  const generateMapsLink = (gps) => {
    const [latitude, longitude] = gps.split(",");
    return `https://www.google.com/maps?q=${latitude},${longitude}`;
  };

  const generateWazeLink = (gps) => {
    const [latitude, longitude] = gps.split(",");
    return `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`;
  };

  const handleGenerarReporte = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'px', // Usar píxeles como unidad para conservar los tamaños originales
      format: 'letter' // Tamaño carta
    });
  
    // Guardar título en variable
    const titulo = `Lista de Socios Comunitarios`;
  
    // Añadir imagen como encabezado (ajusta la fuente de la imagen según tu necesidad)
    const imgData = banderaCombinada;
  
    // Crear un objeto de imagen para obtener las dimensiones originales
    const img = new Image();
    img.src = imgData;
    img.onload = () => {
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const imgWidth = pageWidth / 6;
      const imgHeight = imgWidth * (img.height / img.width); // Mantener proporción original
      const imgX = (pageWidth - imgWidth) / 2; // Centrar imagen
      const imgY = 0; // Ajustar la coordenada Y para que no esté en el borde superior
  
      // Dibujar fondo del encabezado
      doc.setFillColor("#002b69");
      doc.rect(0, 0, pageWidth, imgHeight, 'F'); // Ajustar la altura del fondo
  
      doc.addImage(imgData, 'PNG', imgX, imgY, imgWidth, imgHeight);
      const titleY = imgY + imgHeight + 15; // Ajustar el espacio entre la imagen y el título
  
      // Añadir título al cuerpo
      doc.setFontSize(14);
      doc.setTextColor("#002b69"); // Color azul para el texto
      doc.text(titulo, pageWidth / 2, titleY, { align: 'center' });
  
      // Datos de los socios
      const sociosData = filteredSocios.map((socio) => [
        socio.NombreSocio,
        `${socio.CorreoElectronicoSocio}\n${socio.TelefonoSocio}`,
        socio.TipoInstitucion,
        socio.NombreCompletoContacto,
        `${socio.CorreoElectronicoContacto}\n${socio.TelefonoContacto}`,
        socio.DireccionSocio,
      ]);
  
      const tableColumnSocios = [
        'Nombre', 
        'Contacto', 
        'Tipo de Institución', 
        'Nombre del Encargado', 
        'Contacto del Encargado', 
        'Dirección'
      ];
  
      let startY = titleY + 10;
  
      // Añadir tabla de socios
      if (sociosData.length > 0) {
        doc.autoTable({
          startY: startY,
          head: [tableColumnSocios],
          body: sociosData,
          styles: {
            fontSize: 10,
            cellPadding: 3,
            halign: 'center' // Centrar datos de la tabla
          },
          headStyles: {
            fillColor: [0, 43, 105],
            textColor: [255, 255, 255],
            halign: 'center' // Centrar encabezados de la tabla
          },
          alternateRowStyles: {
            fillColor: [240, 240, 240],
          },
          margin: { bottom: 40 }, // Margen inferior para el pie de página
          didDrawPage: (data) => {
            const footerHeight = 35; // Incrementar la altura del pie de página
  
            // Dibujar fondo del pie de página
            doc.setFillColor("#002b69");
            doc.rect(0, pageHeight - footerHeight, pageWidth, footerHeight, 'F');
  
            // Añadir paginación y texto del pie de página
            doc.setFontSize(10);
            doc.setTextColor(255, 255, 255); // Letra blanca
            doc.text(
              `Página ${data.pageNumber} de ${doc.internal.getNumberOfPages()}`,
              pageWidth / 2,
              pageHeight - 25, // Ajustar para que quepa bien en el pie de página
              { align: 'center' }
            );
            doc.text(
              `© ${new Date().getFullYear()} Universidad Técnica Nacional.`,
              pageWidth / 2,
              pageHeight - 15, // Ajustar para que quepa bien en el pie de página
              { align: 'center' }
            );
            doc.text(
              "Todos los derechos reservados.",
              pageWidth / 2,
              pageHeight - 5, // Ajustar para que quepa bien en el pie de página
              { align: 'center' }
            );
          }
        });
      }
  
      doc.save('Lista de Socios Comunitarios.pdf');
    };
  };
  
  

  return (
    <div className="sociocomunitario-container">
      <main>
        <div className="sociocomu-sidebar">
          <div className="action-sociocomu">
            <button className="add-sociocomu" onClick={handleAddUser}>
              Agregar <IoMdAddCircle className="icon-socio" />
            </button>
            <button
              onClick={handleGenerarReporte}
              className="finalizar-button-listest"
            >
              Reporte de horas
            </button>
            <div className="socio-divider" />
            <h1 className="sociocomu-titulo">Socios Comunitarios</h1>
          </div>
        </div>

        <div className="solicitud-section">
          <div className="filters-sociocomu">
            <div className="filter-group-sociocomu">
              <label className="filter-label-sociocomu">Buscar Nombre Institución</label>
              <input
                type="text"
                name="institucion"
                placeholder="Nombre Institución"
                className="filter-control-sociocomu filter-input-sociocomu"
                value={filters.institucion}
                onChange={handleFilterChange}
              />
            </div>
            <div className="filter-group-sociocomu">
              <label className="filter-label-sociocomu">Buscar Contacto</label>
              <input
                type="text"
                name="contacto"
                placeholder="Nombre Completo"
                className="filter-control-sociocomu filter-input-sociocomu"
                value={filters.contacto}
                onChange={handleFilterChange}
              />
            </div>
            <div className="filter-group-sociocomu">
              <label className="filter-label-sociocomu">Tipo de Institución</label>
              <input
                type="text"
                name="tipoInstitucion"
                placeholder="Tipo de Institución"
                className="filter-control-sociocomu filter-input-sociocomu"
                value={filters.tipoInstitucion}
                onChange={handleFilterChange}
              />
            </div>
            <div className="filter-group-sociocomu">
              <label className="filter-label-sociocomu">Estado</label>
              <select
                name="estado"
                className="filter-control-sociocomu filter-select-sociocomu"
                value={filters.estado}
                onChange={handleFilterChange}
              >
                <option value="">Todos</option>
                <option value="1">Activos</option>
                <option value="0">Inactivos</option>
              </select>
            </div>
          </div>

          <div className="table-container-socioc">
            <table className="table-socioc">
              <thead className="thead-socioc">
                <tr>
                  <th>Nombre</th>
                  <th>Contacto</th>
                  <th>Tipo de Institucion</th>
                  <th>Nombre del Encargado</th>
                  <th>Contacto del Encargado</th>
                  <th>Dirección</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody className="tbody-socioc">
                {filteredSocios.slice((currentPage - 1) * 10, currentPage * 10).map((socio) => (
                  <tr key={socio.SocioId}>
                    <td>{socio.NombreSocio}</td>
                    <td>
                      <a href={`mailto:${socio.CorreoElectronicoSocio}`}>{socio.CorreoElectronicoSocio}</a>
                      <br />
                      {socio.TelefonoSocio}
                    </td>
                    
                    <td>{socio.TipoInstitucion}</td>
                    <td>{socio.NombreCompletoContacto}</td>
                    <td>
                      <a href={`mailto:${socio.CorreoElectronicoContacto}`}>{socio.CorreoElectronicoContacto}</a>
                      <br />
                      {socio.TelefonoContacto}
                    </td>
                    <td>{socio.DireccionSocio}</td>
                    <td>
                      <button className="icon-btn--sociocomu" onClick={() => handleEditUser(socio.SocioId)}>
                        <RiEdit2Fill />
                      </button>
                      <Dropdown>
                        <Dropdown.Toggle variant="link" id="dropdown-basic" className="icon-btn--sociocomu">
                          <FaShareAlt />
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="dropdown-menu-custom">
                          <Dropdown.Item
                            href={generateMapsLink(socio.UbicacionGPS)}
                            target="_blank"
                            className="dropdown-item-custom"
                          >
                            <FaMapMarkedAlt /> Google Maps
                          </Dropdown.Item>
                          <Dropdown.Item
                            href={generateWazeLink(socio.UbicacionGPS)}
                            target="_blank"
                            className="dropdown-item-custom"
                          >
                            <FaWaze /> Waze
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination-sociocomu">
              <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                Anterior
              </button>
              <span>Página {currentPage} de {Math.ceil(filteredSocios.length / 10)}</span>
              <button onClick={handleNextPage} disabled={filteredSocios.length <= currentPage * 10}>
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SocioComunitarios;
