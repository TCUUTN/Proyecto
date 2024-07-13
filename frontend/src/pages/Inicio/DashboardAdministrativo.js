import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { LuDoorOpen } from "react-icons/lu";
import "./DashboardAdministrativo.css";

// Register the required components
ChartJS.register(ArcElement, Tooltip, Legend);

function DashboardAdministrativo() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [],
    }]
  });
  const [fetchError, setFetchError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      const sede = sessionStorage.getItem("Sede");
      try {
        const [estudiantesResponse, gruposResponse] = await Promise.all([
          fetch(`/grupos/EstudiantesActivos/${sede}`),
          fetch(`/grupos/GruposActivos/${sede}`)
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
      {!fetchError ? (
        <>
          <div className="content-container">
            <div className="table-container-dashAdmin">
              <div className="chart-header">
                <h2 className="chart-container-title">Gráfico de los estudiantes activos</h2>
                <div className="dashAdmin-divider"></div>
              </div>
              <div className="chart-body">
                {chartData.labels.length > 0 && (
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
                              const total = context.chart.data.datasets[0].data.reduce(
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
              <table className="mat-table">
                <thead className="mat-thead">
                  <tr>
                    <th>Proyecto</th>
                    <th>Ver</th>
                  </tr>
                </thead>
                <tbody className="mat-tbody">
                  {currentGrupos.map((grupo, index) => (
                    <tr key={index}>
                      <td>
                        {`${grupo.Grupos_TipoGrupo.NombreProyecto} - ${grupo.NumeroGrupo} - Cuatrimestre ${grupo.Cuatrimestre} - ${grupo.Anno}`}
                      </td>
                      <td>
                        <button
                          className="icon-btn-Dash"
                          onClick={() => {
                            localStorage.setItem("GrupoSeleccionado", grupo.GrupoId);
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
            </div>
          </div>
        </>
      ) : (
        <p className="dashboard-container">El académico no posee grupos para ver.</p>
      )}
    </div>
  );
}

export default DashboardAdministrativo;
