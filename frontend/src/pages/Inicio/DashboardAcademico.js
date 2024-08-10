/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import "./DashboardAcademico.css";

// Registro de los componentes necesarios para ChartJS
ChartJS.register(ArcElement, Tooltip, Legend);

function DashboardAcademico() {
   // Definición de los estados locales
  const [grupos, setGrupos] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [fetchError, setFetchError] = useState(false);
  const [carouselKey, setCarouselKey] = useState(0);
  const carouselRef = useRef(null);
  const cambioExitoso = localStorage.getItem("cambioExitoso");
  const perfilExitoso = localStorage.getItem("perfilExitoso");

  // useEffect se usa para hacer la llamada a la API al cargar el componente
  useEffect(() => {
    if (cambioExitoso === "true") {
      toast.success("¡La contraseña ha sido actualizada correctamente!");
      localStorage.removeItem("cambioExitoso");
    }

    if (perfilExitoso === "true") {
      toast.success("¡El perfil se ha completado correctamente!");
      localStorage.removeItem("perfilExitoso");
    }
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
  }, [cambioExitoso, perfilExitoso]);
  // Función para obtener los datos de los estudiantes de cada grupo
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
    setCarouselKey(carouselKey + 1);// Actualiza la clave para forzar un re-renderizado
  };
// Función para procesar los datos de los estudiantes y formatearlos para el gráfico
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
    <div className="dashAcad-container">
      <ToastContainer position="bottom-right" />
      {!fetchError ? (
        <>
          <div className="carousel-container-wrapper-Acade">
            <Carousel
              key={carouselKey} // Use the key to force re-render
              ref={carouselRef}
              showArrows={grupos.length > 1}
              showStatus={false}
              showThumbs={false}
              infiniteLoop
            >
              {chartData.map(({ grupo, data }, index) => (
                <div key={index} className="chart-slide-Acade">
                  <div className="chart-title-divider-container-Acad ">
                    <h2 className="chart-container-title-Acad ">
                      {`${grupo.CodigoMateria} - ${grupo.Grupos_TipoGrupo.NombreProyecto} - Grupo# ${grupo.NumeroGrupo} - Cuatrimestre ${grupo.Cuatrimestre} - ${grupo.Anno}`}
                    </h2>
                    <div className="dashAcademico-divider-Acad "></div>
                  </div>
                  <div className="chart-container-Acad">
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
                      <p className="dashboard-container-Acade">
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
        <p className="dashboard-container-Acade">
          El académico no posee grupos para ver.
        </p>
      )}
    </div>
  );
}

export default DashboardAcademico;
