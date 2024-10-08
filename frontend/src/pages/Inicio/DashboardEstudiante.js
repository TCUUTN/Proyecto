/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ProgressBar } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./DashboardEstudiante.css";

// Componente que muestra el dashboard para el estudiante
function DashboardEstudiante() {
  // Estados para almacenar datos del grupo y horas
  const [grupoId, setGrupoId] = useState(null);
  const [grupoData, setGrupoData] = useState(null);
  const [horasPlanificacion, setHorasPlanificacion] = useState([]);
  const [horasGira, setHorasGira] = useState([]);
  const [horasTotal, setHorasTotal] = useState(0);
  const [horasPlanificacionTotal, setHorasPlanificacionTotal] = useState(0);
  const [horasGiraTotal, setHorasGiraTotal] = useState(0);
  const cambioExitoso = localStorage.getItem("cambioExitoso");
  const perfilExitoso = localStorage.getItem("perfilExitoso");

  // Obtiene la identificación del estudiante desde sessionStorage y la guarda en localStorage
  useEffect(() => {
    if (cambioExitoso === "true") {
      toast.success("¡La contraseña ha sido actualizada correctamente!");
      localStorage.removeItem("cambioExitoso");
    }

    if (perfilExitoso === "true") {
      toast.success("¡El perfil se ha completado correctamente!");
      localStorage.removeItem("perfilExitoso");
    }
    const identificacion = sessionStorage.getItem("Identificacion");
    localStorage.setItem("IdentificacionHoras",identificacion);
     // Muestra un error si la identificación no está en sessionStorage
    if (!identificacion) {
      toast.error("Identificación no encontrada");
      return;
    }
// Fetch para obtener el grupo del estudiante basado en la identificación
    fetch(`/grupos/GrupoEstudiante/${identificacion}`)
      .then((response) => response.json())
      .then((data) => {
        if (!data || !data.GrupoId) {
          toast.error("El Estudiante no posee un grupo activo asignado");
        } else {
          // Establece el grupoId y obtiene las horas y datos del grupo
          setGrupoId(data.GrupoId);
          sessionStorage.setItem("GrupoId",data.GrupoId)
          fetchHoras(identificacion, data.GrupoId);
          fetchGrupoData(data.GrupoId);
        }
      })
      .catch((error) => {
        toast.error("Error al buscar el grupo del estudiante");
      });
  }, [cambioExitoso, perfilExitoso]);
// Función para obtener los datos del grupo
  const fetchGrupoData = (grupoId) => {
    fetch(`/grupos/${grupoId}`)
      .then((response) => response.json())
      .then((data) => {
        setGrupoData(data);
      })
      .catch((error) => {
        toast.error("Error al buscar la información del grupo");
      });
  };
  // Función para obtener las horas del estudiante
  const fetchHoras = (identificacion, grupoId) => {
    fetch(`/horas/EstudianteAprobado/${identificacion}/${grupoId}`)
      .then((response) => response.json())
      .then((data) => {
        const planificacion = [];
        const gira = [];
        let totalHoras = 0;
        let totalHorasPlanificacion = 0;
        let totalHorasGira = 0;

         // Calcula las horas totales, de planificación y de ejecución
        data.forEach((item) => {
          const horaInicio = new Date(`1970-01-01T${item.HoraInicio}Z`);
          const horaFinal = new Date(`1970-01-01T${item.HoraFinal}Z`);
          const horas = (horaFinal - horaInicio) / (1000 * 60 * 60);

          totalHoras += horas;

          if (item.TipoActividad === "Planificacion") {
            planificacion.push(item);
            totalHorasPlanificacion += horas;
          } else if (
            item.TipoActividad === "Ejecucion" ||
            item.TipoActividad === "Gira"
          ) {
            gira.push(item);
            totalHorasGira += horas;
          }
        });

        setHorasTotal(totalHoras);
        setHorasPlanificacionTotal(totalHorasPlanificacion);
        setHorasGiraTotal(totalHorasGira);
        setHorasPlanificacion(planificacion);
        setHorasGira(gira);

        // Calcula los valores máximos y los guarda en localStorage
        const minHorasPlanificacion = 10;
        const maxHorasPlanificacion = Math.min(
          30,
          Math.max(minHorasPlanificacion, totalHorasPlanificacion)
        );
        const maxHorasTotal = 150;
        const maxHorasEjecucion = maxHorasTotal - maxHorasPlanificacion;

        localStorage.setItem('horasPlanificacionTotal', totalHorasPlanificacion);
        localStorage.setItem('horasGiraTotal', totalHorasGira);
        localStorage.setItem('maxHorasPlanificacion', maxHorasPlanificacion);
        localStorage.setItem('maxHorasEjecucion', maxHorasEjecucion);
      })
      .catch((error) => {
        toast.error("El estudiante no posee horas registradas");
      });
  };
 // Calcula el progreso como un porcentaje
  const calculateProgress = (total, max) => (total / max) * 100;

  return (
    <div className="mainDash-container">
      {grupoData && (
        <div className="dashboard-container-Est">
          <h3 className="dashEstudiante-title">
            Proyecto:{" "}
            {`${grupoData.CodigoMateria} - ${grupoData.Grupos_TipoGrupo.NombreProyecto}`}
          </h3>
          <div className="dashEstudiante-divider"></div>
          <p className="dashEstudiante-horas">
            Grupo# {`${grupoData.NumeroGrupo}`} - Cuatrimestre: {`${grupoData.Cuatrimestre}`} - Año:{" "}
            {`${grupoData.Anno}`} {`//`} Horario: {`${grupoData.Horario}`} - {`${grupoData.Aula}`}
          </p>
          <p className="dashEstudiante-horas">
            Académico a Cargo:{" "}
            {`${grupoData.Usuario.Nombre} ${grupoData.Usuario.Apellido1} ${grupoData.Usuario.Apellido2}`}{" "}
            - Correo Electrónico:{" "}
            <a href={`mailto:${grupoData.Usuario.CorreoElectronico}`}>
              {grupoData.Usuario.CorreoElectronico}
            </a>
          </p>
        </div>
      )}

      <div className="dashboard-container-Est">
        <h3 className="dashEstudiante-title">Cantidad total de horas</h3>
        <div className="dashEstudiante-divider"></div>
        <ProgressBar
          now={calculateProgress(horasTotal, 150)}
          label={`${calculateProgress(horasTotal, 150).toFixed(2)}%`}
          className="custom-progress-bar"
        />
        <p className="dashEstudiante-horas">{`${horasTotal.toFixed(0)} horas completadas de 150 horas`}</p>
      </div>

      <div className="progress-sections">
        <div className="dashboard-container-Est">
          <h3 className="dashEstudiante-title">Total de horas de planificación</h3>
          <div className="dashEstudiante-divider"></div>
          <ProgressBar
            now={calculateProgress(
              horasPlanificacionTotal,
              Math.min(30, Math.max(10, horasPlanificacionTotal))
            )}
            label={`${calculateProgress(
              horasPlanificacionTotal,
              Math.min(30, Math.max(10, horasPlanificacionTotal))
            ).toFixed(2)}%`}
            className="custom-progress-bar"
          />
          <p className="dashEstudiante-horas">{`${horasPlanificacionTotal.toFixed(
            0
          )} horas completadas de ${Math.min(30, Math.max(10, horasPlanificacionTotal))} horas`}</p>
        </div>

        <div className="dashboard-container-Est">
          <h3 className="dashEstudiante-title">Total de horas de ejecución</h3>
          <div className="dashEstudiante-divider"></div>
          <ProgressBar
            now={calculateProgress(horasGiraTotal, 150 - Math.min(30, Math.max(10, horasPlanificacionTotal)))}
            label={`${calculateProgress(horasGiraTotal, 150 - Math.min(30, Math.max(10, horasPlanificacionTotal))).toFixed(
              2
            )}%`}
            className="custom-progress-bar"
          />
          <p className="dashEstudiante-horas">{`${horasGiraTotal.toFixed(0)} horas completadas de ${150 - Math.min(30, Math.max(10, horasPlanificacionTotal))} horas`}</p>
        </div>
      </div>

      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default DashboardEstudiante;
