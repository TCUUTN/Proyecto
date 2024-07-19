import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Pie } from "react-chartjs-2";
import banderaCombinada from "../../Assets/Images/Bandera Combinada.png";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { LuDoorOpen } from "react-icons/lu";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./DashboardAdministrativo.css";

// Register the required components
ChartJS.register(ArcElement, Tooltip, Legend);

function DashboardAdministrativo() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [generos, setGeneros] = useState({});
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
      },
    ],
  });
  const [genderChartData, setGenderChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0"],
      },
    ],
  });
  const [fetchError, setFetchError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [cuatrimestreFilter, setCuatrimestreFilter] = useState("");
  const [annoFilter, setAnnoFilter] = useState("");
  const [yearsOptions, setYearsOptions] = useState([]);
  const isBuscarButtonDisabled = cuatrimestreFilter === "" || annoFilter === "";
  const sedeFilter = sessionStorage.getItem("Sede") || "Todas";
  const itemsPerPage = 5;

  const chartRef = useRef(null);
  const tableRef = useRef(null);

  useEffect(() => {
    fetchYearsOptions();
    const fetchData = async () => {
      const sede = sessionStorage.getItem("Sede");
      try {
        const [estudiantesResponse, gruposResponse] = await Promise.all([
          fetch(`/grupos/EstudiantesActivos/${sede}`),
          fetch(`/grupos/GruposActivos/${sede}`),
        ]);

        const estudiantesData = await estudiantesResponse.json();
        const gruposData = await gruposResponse.json();

        setEstudiantes(estudiantesData);
        setGrupos(gruposData);

        if (estudiantesData.length > 0) {
          setChartData(processChartData(estudiantesData));
          setFetchError(false);
        } else {
          setFetchError(true);
        }
      } catch (error) {
        setFetchError(true);
        toast.error("Error fetching data");
      }
    };

    fetchData();
  }, []);

  const fetchYearsOptions = async () => {
    try {
      const response = await fetch(`/grupos/Annos`);
      if (response.ok) {
        const data = await response.json();
        setYearsOptions(data);
      } else {
        toast.error("Error al obtener los años disponibles");
      }
    } catch (error) {
      toast.error("Error al obtener los años disponibles");
    }
  };

  const handleCuatrimestreFilterChange = (e) => {
    const value = e.target.value;
    setCuatrimestreFilter(value);
  };

  const handleAnnoFilterChange = (e) => {
    const value = e.target.value;
    setAnnoFilter(value);
  };

  const handleBuscarClick = async () => {
    try {
      const requestBody = JSON.stringify({
        Anno: annoFilter,
        Cuatrimestre: cuatrimestreFilter,
        Sede: sedeFilter,
      });
  
      const response = await fetch("/grupos/ReporteGeneroPorBusqueda", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
      });
  
      if (response.ok) {
        const data = await response.json();
        setGeneros(data);
  
        const labels = Object.keys(data);
        const values = Object.values(data);
  
        setGenderChartData({
          labels: labels,
          datasets: [
            {
              data: values,
              backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0"],
            },
          ],
        });
      } else {
        setGeneros([]);  // Limpia los datos en caso de error
        toast.error("No se poseen estudiantes matriculados para el periodo de tiempo consultado");
      }
    } catch (error) {
      setGeneros([]);  // Limpia los datos en caso de error
      toast.error("No se poseen estudiantes matriculados para el periodo de tiempo consultado");
    }
  };
  

  const handleGenerarClick = async () => {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px', // Usar píxeles como unidad para conservar los tamaños originales
      format: 'letter' // Tamaño carta
    });

    const chartElement = chartRef.current;
    const tableElement = tableRef.current;

    if (chartElement && tableElement) {
      try {
        // Captura el gráfico
        const chartCanvas = await html2canvas(chartElement, { scale: 2 });
        const chartDataUrl = chartCanvas.toDataURL("image/png");
        const chartImgProps = pdf.getImageProperties(chartDataUrl);
        const chartPdfWidth = pdf.internal.pageSize.getWidth() - 40; // Ancho con margen
        const chartPdfHeight = (chartImgProps.height * chartPdfWidth) / chartImgProps.width;

        // Añadir encabezado
        const imgData = banderaCombinada;

        // Crear un objeto de imagen para obtener las dimensiones originales
        const img = new Image();
        img.src = imgData;
        img.onload = async () => {
          const pageWidth = pdf.internal.pageSize.getWidth();
          const imgWidth = pageWidth / 6;
          const imgHeight = imgWidth * (img.height / img.width); // Mantener proporción original
          const imgX = (pageWidth - imgWidth) / 2; // Centrar imagen
          const imgY = 0;

          // Dibujar fondo del encabezado
          pdf.setFillColor("#002b69");
          pdf.rect(0, 0, pageWidth, imgHeight, 'F');

          pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth, imgHeight);

          // Añadir títulos al cuerpo con espacios entre ellos
          const titleY = imgY + imgHeight;
          pdf.setFontSize(14);
          pdf.setTextColor("#002b69"); // Color azul para el texto
        

          // Agrega el gráfico al PDF
          const chartY = titleY + 25;
          pdf.addImage(chartDataUrl, "PNG", 20, chartY, chartPdfWidth, chartPdfHeight);

          // Captura la tabla
          const tableCanvas = await html2canvas(tableElement, { scale: 2 });
          const tableDataUrl = tableCanvas.toDataURL("image/png");
          const tableImgProps = pdf.getImageProperties(tableDataUrl);
          const tablePdfWidth = pdf.internal.pageSize.getWidth() - 40; // Ancho con margen
          const tablePdfHeight = (tableImgProps.height * tablePdfWidth) / tableImgProps.width;

          // Comprueba si la tabla cabe en la página actual, si no, agrega una nueva página
          const currentYPosition = chartY + chartPdfHeight + 20;
          const spaceLeft = pdf.internal.pageSize.getHeight() - currentYPosition;

          if (spaceLeft < tablePdfHeight) {
            pdf.addPage();
            pdf.addImage(tableDataUrl, "PNG", 20, 20, tablePdfWidth, tablePdfHeight);
          } else {
            pdf.addImage(tableDataUrl, "PNG", 20, currentYPosition, tablePdfWidth, tablePdfHeight);
          }

          // Añadir footer en cada página
          const pageCount = pdf.internal.getNumberOfPages();
          for (let i = 0; i < pageCount; i++) {
            pdf.setPage(i + 1);
            const pageHeight = pdf.internal.pageSize.getHeight();
            const footerHeight = 35; // Incrementar la altura del pie de página

            // Dibujar fondo del pie de página
            pdf.setFillColor("#002b69");
            pdf.rect(0, pageHeight - footerHeight, pageWidth, footerHeight, 'F');

            // Añadir paginación y texto del pie de página
            pdf.setFontSize(10);
            pdf.setTextColor(255, 255, 255); // Letra blanca
            pdf.text(
              `Página ${i + 1} de ${pageCount}`,
              pageWidth / 2,
              pageHeight - 25, // Ajustar para que quepa bien en el pie de página
              { align: 'center' }
            );
            pdf.text(
              `© ${new Date().getFullYear()} Universidad Técnica Nacional.`,
              pageWidth / 2,
              pageHeight - 15, // Ajustar para que quepa bien en el pie de página
              { align: 'center' }
            );
            pdf.text(
              "Todos los derechos reservados.",
              pageWidth / 2,
              pageHeight - 5, // Ajustar para que quepa bien en el pie de página
              { align: 'center' }
            );
          }

          // Guardar el PDF
          pdf.save("Reporte de Géneros del cuatrimestre #"+cuatrimestreFilter+", año "+annoFilter+".pdf");
        };
      } catch (error) {
        toast.error("Error al generar el reporte PDF");
      }
    }
  };



  const processChartData = (data) => {
    const progresoEstados = { Nuevo: 0, Continuidad: 0, Prórroga: 0 };
    data.forEach((estudiante) => {
      if (estudiante.Progreso in progresoEstados) {
        progresoEstados[estudiante.Progreso]++;
      }
    });

    const filteredProgresoEstados = Object.keys(progresoEstados).filter(
      (key) => progresoEstados[key] > 0
    );

    return {
      labels: filteredProgresoEstados,
      datasets: [
        {
          data: filteredProgresoEstados.map((key) => progresoEstados[key]),
          backgroundColor: filteredProgresoEstados.map((key) => {
            switch (key) {
              case "Nuevo":
                return "#04ff00";
              case "Continuidad":
                return "#ff6600";
              case "Prórroga":
                return "#ff0000";
              default:
                return "#000000";
            }
          }),
        },
      ],
    };
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const currentGrupos = grupos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(grupos.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="dashAca-container">
      <ToastContainer position="bottom-right" />
      <div className="content-container">
        <div className="table-container-dashAdmin">
          <div className="chart-header">
            <h2 className="chart-container-title">
              Gráfico de los estudiantes activos
            </h2>
            <div className="dashAdmin-divider"></div>
          </div>
          <div className="chart-body">
            {fetchError || chartData.labels.length === 0 ? (
              <p>No hay estudiantes activos.</p>
            ) : (
              <Pie
                data={chartData}
                options={{
                  plugins: {
                    legend: {
                      display: true,
                      position: "right",
                      labels: {
                        font: {
                          size: 12,
                        },
                      },
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          const label = context.label || "";
                          const value = context.raw || 0;
                          const total =
                            context.chart.data.datasets[0].data.reduce(
                              (acc, val) => acc + val,
                              0
                            );
                          const percentage = ((value / total) * 100).toFixed(0);
                          return `${label}: ${value} (${percentage}%)`;
                        },
                      },
                    },
                  },
                  maintainAspectRatio: false,
                  responsive: true,
                  layout: {
                    padding: 20,
                  },
                  aspectRatio: 1,
                }}
              />
            )}
          </div>
        </div>
        <div className="table-container-dashAdmin">
          {grupos.length === 0 ? (
            <p>No hay grupos activos.</p>
          ) : (
            <>
              <table className="DashAdmin-table">
                <thead className="DashAdmin-thead">
                  <tr>
                    <th>Proyecto</th>
                    <th>Ver</th>
                  </tr>
                </thead>
                <tbody className="DashAdmin-tbody">
                  {currentGrupos.map((grupo, index) => (
                    <tr key={index}>
                      <td>
                        {`${grupo.Grupos_TipoGrupo.NombreProyecto} - ${grupo.NumeroGrupo} - Cuatrimestre ${grupo.Cuatrimestre} - ${grupo.Anno}`}
                      </td>
                      <td>
                        <button
                          className="icon-btn-Dash"
                          onClick={() => {
                            localStorage.setItem(
                              "GrupoSeleccionado",
                              grupo.GrupoId
                            );
                            window.location.href = "/ListaEstudiantes";
                          }}
                        >
                          <LuDoorOpen />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="pagination-mat">
                <button onClick={handlePreviousPage}>Anterior</button>
                <span>
                  Página {currentPage} de {totalPages}
                </span>
                <button onClick={handleNextPage}>Siguiente</button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="Reportes-DashAdmin">
      <div className="Reportes-header">
              <h2 className="Reportes-container-title">
                Reporte de Generos de Estudiante Por periodo de matricula
              </h2>
              <div className="dashAdmin-divider"></div>
      </div>
      </div>
      <div className="filters-DashAdmin">
        <div className="filter-group-DashAdmin">
          <label
            className="filter-label-DashAdmin"
            htmlFor="Cuatrimestre-Busqueda"
          >
            Seleccionar Año
          </label>
          <select
            id="Anno-Busqueda"
            className="filter-select-DashAdmin"
            value={annoFilter}
            onChange={handleAnnoFilterChange}
          >
            <option value="">Año</option>
            {yearsOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group-DashAdmin">
          <label
            className="filter-label-DashAdmin"
            htmlFor="Cuatrimestre-Busqueda"
          >
            Seleccionar Cuatrimestre
          </label>
          <select
            id="Cuatrimestre-Busqueda"
            className="filter-select-DashAdmin"
            value={cuatrimestreFilter}
            onChange={handleCuatrimestreFilterChange}
          >
            <option value="">Cuatrimestre</option>
            <option value="1">I Cuatrimestre</option>
            <option value="2">II Cuatrimestre</option>
            <option value="3">III Cuatrimestre</option>
          </select>
        </div>
        <div className="filter-group-DashAdmin">
          <div className="butBuscar-DashAdmin">
            <div className="DashAdmin-divider " />
            <button
              className="buscar-button-DashAdmin"
              onClick={handleBuscarClick}
              disabled={isBuscarButtonDisabled}
            >
              Buscar
            </button>
          </div>
        </div>
      </div>

      {Object.keys(generos).length > 0 && (
        <div className="content-container">
          <div className="table-container-dashAdmin" ref={chartRef}>
            <div className="chart-header">
              <h2 className="chart-container-title">
                Gráfico de Género de los estudiantes matriculados en el{" "}
                {cuatrimestreFilter} Cuatrimestre, {annoFilter}
              </h2>
              <div className="dashAdmin-divider"></div>
            </div>
            <div className="chart-body">
              <Pie
                data={genderChartData}
                options={{
                  plugins: {
                    legend: {
                      display: true,
                      position: "right",
                      labels: {
                        font: {
                          size: 12,
                        },
                      },
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          const label = context.label || "";
                          const value = context.raw || 0;
                          const total =
                            context.chart.data.datasets[0].data.reduce(
                              (acc, val) => acc + val,
                              0
                            );
                          const percentage = ((value / total) * 100).toFixed(0);
                          return `${label}: ${value} (${percentage}%)`;
                        },
                      },
                    },
                  },
                  maintainAspectRatio: false,
                  responsive: true,
                  layout: {
                    padding: 20,
                  },
                  aspectRatio: 1,
                }}
              />
            </div>
          </div>

          <div className="table-container-dashAdmin" ref={tableRef}>
            <div className="chart-header">
              <h2 className="chart-container-title">
                Género de los estudiantes matriculados en el{" "}
                {cuatrimestreFilter} Cuatrimestre, {annoFilter}
              </h2>
              <div className="dashAdmin-divider"></div>
              <p></p>
            </div>
            <table className="DashAdmin-table">
              <thead className="DashAdmin-thead">
                <tr>
                  <th>Género</th>
                  <th>Cantidad</th>
                </tr>
              </thead>
              <tbody className="DashAdmin-tbody">
                {Object.entries(generos).map(([genero, cantidad], index) => (
                  <tr key={index}>
                    <td>{genero}</td>
                    <td>{cantidad}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="Generar-DashAdmin">
            <div className="butGenerar-DashAdmin">
              <button
                className="Generar-button-DashAdmin"
                onClick={handleGenerarClick}
              >
                Generar Reporte
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardAdministrativo;
