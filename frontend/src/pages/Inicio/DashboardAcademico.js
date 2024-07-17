import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import "./DashboardAcademico.css";

// Register the required components
ChartJS.register(ArcElement, Tooltip, Legend);

function DashboardAcademico() {
  const [grupos, setGrupos] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [fetchError, setFetchError] = useState(false);
  const [carouselKey, setCarouselKey] = useState(0);
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchGrupos = async () => {
      const identificacion = sessionStorage.getItem("Identificacion");
      try {
        const response = await fetch(`/grupos/Academicos/${identificacion}`);
        const data = await response.json();
        setGrupos(data);
        if (data.length > 0) {
          fetchEstudiantesForGrupos(data);
          setFetchError(false);
        } else {
          setFetchError(true);
        }
      } catch (error) {
        setFetchError(true);
        toast.error("Error fetching grupos");
      }
    };

    fetchGrupos();
  }, []);

  const fetchEstudiantesForGrupos = async (grupos) => {
    const chartDataPromises = grupos.map(async (grupo) => {
      try {
        const response = await fetch(
          `/grupos/ListaEstudiantes/${grupo.GrupoId}`
        );
        const data = await response.json();
        return {
          grupo,
          data: processChartData(data)
        };
      } catch (error) {
        toast.error("Error fetching estudiantes");
        return {
          grupo,
          data: null
        };
      }
    });

    const chartDataArray = await Promise.all(chartDataPromises);
    setChartData(chartDataArray);
    setCarouselKey(carouselKey + 1); // Update the key to force re-render
  };

  const processChartData = (data) => {
    const estados = { Aprobado: 0, Reprobado: 0, "En Curso": 0 };
    data.forEach((estudiante) => {
      if (estudiante.Estado in estados) {
        estados[estudiante.Estado]++;
      }
    });

    const filteredEstados = Object.keys(estados).filter(
      (key) => estados[key] > 0
    );

    return {
      labels: filteredEstados,
      datasets: [
        {
          data: filteredEstados.map((key) => estados[key]),
          backgroundColor: filteredEstados.map((key) => {
            switch (key) {
              case "Aprobado":
                return "#04ff00";
              case "Reprobado":
                return "#ff0000";
              case "En Curso":
                return "#ff6600";
              default:
                return "#000000";
            }
          }),
        },
      ],
    };
  };

  return (
    <div className="dashAca-container">
      <ToastContainer position="bottom-right" />
      {!fetchError ? (
        <>
          <div className="carousel-container-wrapper">
            <Carousel
              key={carouselKey} // Use the key to force re-render
              ref={carouselRef}
              showArrows={grupos.length > 1}
              showStatus={false}
              showThumbs={false}
              infiniteLoop
            >
              {chartData.map(({ grupo, data }, index) => (
                <div key={index} className="chart-slide-Aca">
                  <div className="chart-title-divider-container">
                    <h2 className="chart-container-title">
                      {`${grupo.CodigoMateria} - ${grupo.Grupos_TipoGrupo.NombreProyecto} - Grupo# ${grupo.NumeroGrupo} - Cuatrimestre ${grupo.Cuatrimestre} - ${grupo.Anno}`}
                    </h2>
                    <div className="dashAcademico-divider"></div>
                  </div>
                  <div className="chart-container-Aca">
                    {data ? (
                      <Doughnut
                        data={data}
                        options={{
                          plugins: {
                            legend: {
                              display: true,
                              position: "right",
                              labels: {
                                font: {
                                  size: 12, // Adjust the font size here
                                },
                              },
                            },
                            tooltip: {
                              callbacks: {
                                label: (context) => {
                                  const label = context.label || "";
                                  const value = context.raw || 0;
                                  const total = context.chart.data.datasets[0].data.reduce(
                                    (acc, val) => acc + val,
                                    0
                                  );
                                  const percentage = ((value / total) * 100).toFixed(0);
                                  return `${label}: ${value} (${percentage}%)`;
                                },
                              },
                            },
                            datalabels: {
                              display: false,
                            },
                          },
                          maintainAspectRatio: false,
                          responsive: true,
                          layout: {
                            padding: 20,
                          },
                          // Adjust aspect ratio based on the container width
                          aspectRatio: 1, // Set to 1 for square aspect ratio
                        }}
                      />
                    ) : (
                      <p className="dashboard-container">
                        El grupo aún no posee estudiantes.
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        </>
      ) : (
        <p className="dashboard-container">
          El académico no posee grupos para ver.
        </p>
      )}
    </div>
  );
}

export default DashboardAcademico;
