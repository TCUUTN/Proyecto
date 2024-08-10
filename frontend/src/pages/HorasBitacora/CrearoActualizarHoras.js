/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-time-picker/dist/TimePicker.css";
import { FaSave } from "react-icons/fa";
import TimePicker from "react-time-picker";
import { MdDeleteForever } from "react-icons/md";
import "./CrearoActualizarHoras.css";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { FaChevronLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import moment from "moment-timezone";
import { TbFileUpload } from "react-icons/tb";

function CrearoActualizarHoras() {
   // Estado para almacenar los datos del formulario
  const [formData, setFormData] = useState({
    Identificacion: "",
    GrupoId: "",
    Fecha: "",
    DescripcionActividad: "",
    TipoActividad: "Ejecucion",
    HoraInicio: "",
    HoraFinal: "",
    Evidencias: null,
    NombreEvidencia: "-",
  });

  // Estado para manejar errores
  const [error, setError] = useState("");

  // Estado para almacenar el ID de la bitácora
  const [bitacoraId, setBitacoraId] = useState(null);

  // Estado para habilitar o deshabilitar el botón de envío
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  // Estado para los límites de la hora final
  const [horaFinalLimits, setHoraFinalLimits] = useState({ min: "", max: "" });

  // Hook para navegación
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener el ID de la bitácora desde sessionStorage
    const storedBitacoraId = sessionStorage.getItem("BitacoraId");
    setBitacoraId(storedBitacoraId);

    if (storedBitacoraId) {
      // Si hay un ID de bitácora, obtener los datos de la bitácora
      fetch(`horas/${storedBitacoraId}`)
        .then((response) => response.json())
        .then(async (data) => {
          // Formatear las horas de inicio y fin
          const formattedHoraInicio = formatTime(data.HoraInicio);
          const formattedHoraFinal = formatTime(data.HoraFinal);

          // Actualizar el estado del formulario con los datos obtenidos
          setFormData((prevFormData) => ({
            ...prevFormData,
            Identificacion: data.Identificacion || "",
            GrupoId: data.GrupoId || "",
            Fecha: data.Fecha || "",
            DescripcionActividad: data.DescripcionActividad || "",
            TipoActividad: data.TipoActividad || "Ejecucion",
            HoraInicio: formattedHoraInicio || "",
            HoraFinal: formattedHoraFinal || "",
            Evidencias: null,
            NombreEvidencia: data.NombreEvidencia || "-",
          }));
           // Actualizar los límites de la hora final y validar el formulario
          updateHoraFinalLimits({
            ...data,
            HoraInicio: formattedHoraInicio,
            HoraFinal: formattedHoraFinal,
          });
          validateForm({
            ...data,
            HoraInicio: formattedHoraInicio,
            HoraFinal: formattedHoraFinal,
          });
        })
        .catch((error) => {
          toast.error(
            "Error al obtener los datos. Por favor, inténtelo de nuevo: ",error
          );
        });
    } else {
      // Si no hay ID de bitácora, obtener el grupo del estudiante
      const identificacion = sessionStorage.getItem("Identificacion");
      if (identificacion) {
        fetch(`grupos/GrupoEstudiante/${identificacion}`)
          .then((response) => response.json())
          .then((grupoData) => {
            setFormData((prevFormData) => ({
              ...prevFormData,
              Identificacion: identificacion,
              GrupoId: grupoData.GrupoId,
            }));
          })
          .catch((error) => {
            setError(
              "Error al obtener el grupo. Por favor, inténtelo de nuevo."
            );
          });
      }
    }
  }, []);
// Función para formatear las horas en formato HH:mm
  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
  };
// Función para manejar los cambios en el formulario
  const handleChange = (name, value) => {
    const newFormData = { ...formData, [name]: value };
    if (name === "Evidencias" && value) {
      newFormData.NombreEvidencia = value.name;
    }
    setFormData(newFormData);
    if (name === "HoraInicio" || name === "TipoActividad") {
      updateHoraFinalLimits(newFormData);
    }
    if (
      name === "HoraInicio" ||
      name === "HoraFinal" ||
      name === "TipoActividad"
    ) {
      validateForm(newFormData);
    }
  };
  // Función para actualizar los límites de la hora final
  const updateHoraFinalLimits = (data) => {
    const { HoraInicio, TipoActividad } = data;
    if (HoraInicio) {
      const start = moment.tz(HoraInicio, "HH:mm", "America/Costa_Rica");
      let maxHours = TipoActividad === "Gira" ? 12 : 8;
      const end = start.clone().add(maxHours, "hours");

      setHoraFinalLimits({
        min: HoraInicio,
        max: end.format("HH:mm"),
      });
    }
  };
  // Función para validar el formulario
  const validateForm = (data) => {
    const { TipoActividad, HoraInicio, HoraFinal } = data;
    if (HoraInicio && HoraFinal) {
      const start = moment.tz(HoraInicio, "HH:mm", "America/Costa_Rica");
      const end = moment.tz(HoraFinal, "HH:mm", "America/Costa_Rica");
      const difference = end.diff(start, "hours", true);

      let isValid = true;

      if (TipoActividad === "Planificacion" || TipoActividad === "Ejecucion") {
        if (difference > 8) {
          setError(
            "La duración de Planificación o Ejecución no puede exceder 8 horas."
          );
          isValid = false;
        }
      } else if (TipoActividad === "Gira") {
        if (difference > 12) {
          setError("La duración de Gira no puede exceder 12 horas.");
          isValid = false;
        }
      }

      if (end <= start) {
        setError(
          "La hora de finalización no puede ser menor o igual que la hora de inicio."
        );
        isValid = false;
      }

      setIsSubmitDisabled(!isValid);
      if (isValid) setError("");
    }
  };
// Función para manejar el envío del formulario
const handleSubmit = async (event) => {
  event.preventDefault();
  // Verificar que todos los campos obligatorios están llenos
    const requiredFields = [
      "Fecha",
      "DescripcionActividad",
      "TipoActividad",
      "HoraInicio",
      "HoraFinal",
    ];
    for (let field of requiredFields) {
      if (!formData[field]) {
        setError(`Por favor, ingrese ${field}.`);
        setIsSubmitDisabled(true);
        return;
      }
    }
    try {
      // Verificar si ya se han registrado horas en la fecha seleccionada
      const fechaCheckResponse = await fetch("horas/horasporFecha", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Fecha: formData.Fecha,Identificacion: formData.Identificacion,GrupoId:formData.GrupoId }),
      });

      if (!fechaCheckResponse.ok) {
        toast.error(
          "Error al guardar horas debido a que ya se han registrado horas en la fecha seleccionada. Por favor, seleccione otra fecha."
        );
        return;
      }
    } catch (error) {
      setError("Error al verificar la fecha. Por favor, inténtelo de nuevo.");
      return;
    }
// Obtener horas totales de planificación y ejecución del almacenamiento local
    const horasPlanificacionTotal =
      parseFloat(localStorage.getItem("horasPlanificacionTotal")) || 0;
    const horasGiraTotal =
      parseFloat(localStorage.getItem("horasGiraTotal")) || 0;
    const maxHorasPlanificacion =
      parseFloat(localStorage.getItem("maxHorasPlanificacion")) || 30;
    const maxHorasEjecucion =
      parseFloat(localStorage.getItem("maxHorasEjecucion")) || 120;

    const { HoraInicio, HoraFinal, TipoActividad } = formData;
    const start = moment.tz(HoraInicio, "HH:mm", "America/Costa_Rica");
    const end = moment.tz(HoraFinal, "HH:mm", "America/Costa_Rica");
    const horasIngresadas = end.diff(start, "hours", true);

    let newHorasPlanificacionTotal = horasPlanificacionTotal;
    let newHorasGiraTotal = horasGiraTotal;
    let horasTotalesEstudiante =
      parseFloat(localStorage.getItem("horasTotalesEstudiante")) || 0;

    if (TipoActividad === "Planificacion") {
      newHorasPlanificacionTotal += horasIngresadas;

      if (newHorasPlanificacionTotal <= 10) {
        localStorage.setItem(
          "horasPlanificacionTotal",
          newHorasPlanificacionTotal
        );
      } else if (newHorasPlanificacionTotal <= 30) {
        localStorage.setItem(
          "horasPlanificacionTotal",
          newHorasPlanificacionTotal
        );
        localStorage.setItem(
          "maxHorasPlanificacion",
          newHorasPlanificacionTotal
        );
        localStorage.setItem(
          "maxHorasEjecucion",
          150 - newHorasPlanificacionTotal
        );
      } else {
        const horasExcedentes = newHorasPlanificacionTotal - 30;
        const horasRestantes = 30 - horasPlanificacionTotal;
        toast.error(
          `No se pueden subir las horas porque excede el máximo de horas de planificación permitidas. Puedes subir un máximo de ${horasRestantes.toFixed(
            2
          )} horas.`
        );
        return;
      }
      horasTotalesEstudiante += horasIngresadas;
      localStorage.setItem("horasTotalesEstudiante", horasTotalesEstudiante);
    } else {
      newHorasGiraTotal += horasIngresadas;

      if (newHorasGiraTotal <= maxHorasEjecucion) {
        localStorage.setItem("horasGiraTotal", newHorasGiraTotal);
      } else {
        const horasExcedentes = newHorasGiraTotal - maxHorasEjecucion;
        const horasRestantes = maxHorasEjecucion - horasGiraTotal;
        toast.error(
          `No se pueden subir las horas porque excede el máximo de horas de ejecución permitidas. Puedes subir un máximo de ${horasRestantes.toFixed(
            2
          )} horas.`
        );
        return;
      }
      horasTotalesEstudiante += horasIngresadas;
      localStorage.setItem("horasTotalesEstudiante", horasTotalesEstudiante);
    }
    const dataToSend = { ...formData, BitacoraId: bitacoraId };
    try {
      const response = await fetch("horas/crearOActualizarHoras", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        const responseData = await response.json();
        const { BitacoraId: newBitacoraId } = responseData;

        if (formData.Evidencias) {
          const formDataToSend = new FormData();
          formDataToSend.append("BitacoraId", newBitacoraId);
          formDataToSend.append("Evidencias", formData.Evidencias);

          const evidenceResponse = await fetch("horas/subirAdjunto", {
            method: "POST",
            body: formDataToSend,
          });

          if (!evidenceResponse.ok) {
            setError(
              "Error al subir las evidencias. Por favor, inténtelo de nuevo."
            );
            return;
          }
        }

        toast.success("La actividad se ha registrado correctamente");
        sessionStorage.removeItem("BitacoraId");
        navigate("/VistaHorasEstudiantes");
      } else {
        setError(
          "Error al registrar la actividad. Por favor, inténtelo de nuevo."
        );
      }
    } catch (error) {
      setError("Error al enviar la solicitud. Por favor, inténtelo de nuevo.");
    }
  };
  const handleBackClick = () => {
    sessionStorage.removeItem("BitacoraId");
    navigate("/VistaHorasEstudiantes");
  };

  const handleDelete = () => {
    setFormData({
      ...formData,
      NombreEvidencia: "-",
    });
    document.getElementById("Evidencias").value = ""; // Reset the file input
  };

  const minDate = moment().subtract(6, "months").tz("America/Costa_Rica");
  const maxDate = moment().tz("America/Costa_Rica");
  return (
    <div className="crehoras-container">
      <div className="crehoras-content">
        <h1 className="crehoras-title"> {bitacoraId ? "Modificar registrar horas" : "Crear registro horas"}

        </h1>
        <div className="crehoras-divider" />
        <form onSubmit={handleSubmit}>
          <input
            type="hidden"
            id="Identificacion"
            name="Identificacion"
            value={formData.Identificacion}
          />
          <input
            type="hidden"
            id="GrupoId"
            name="GrupoId"
            value={formData.GrupoId}
          />
          <div className="crehoras-input-container">
            <input
              type="date"
              id="Fecha"
              name="Fecha"
              value={formData.Fecha}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              className="crehoras-input-date"
              placeholder="Ingrese la fecha"
              min={minDate.format("YYYY-MM-DD")}
              max={maxDate.format("YYYY-MM-DD")}
            />
          </div>
          <div className="crehoras-input-container">
            <textarea
              id="DescripcionActividad"
              name="DescripcionActividad"
              value={formData.DescripcionActividad}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              className="crehoras-textarea"
              placeholder="Descripción de la actividad"
            />
          </div>
          <div className="crehoras-input-container">
            <select
              id="TipoActividad"
              name="TipoActividad"
              value={formData.TipoActividad}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              className="crehoras-dropdown"
            >
              <option value="Ejecucion">Ejecución</option>
              <option value="Planificacion">Planificación</option>
              <option value="Gira">Gira</option>
            </select>
          </div>
          <div className="crehoras-input-container">
            <TimePicker
              id="HoraInicio"
              name="HoraInicio"
              value={formData.HoraInicio}
              onChange={(value) =>
                handleChange("HoraInicio", formatTime(value))
              }
              className="crehoras-input-time"
              disableClock={true}
              placeholder="Hora de Inicio"
            />
          </div>
          <div className="crehoras-input-container">
            <TimePicker
              id="HoraFinal"
              name="HoraFinal"
              value={formData.HoraFinal}
              onChange={(value) => handleChange("HoraFinal", formatTime(value))}
              className="crehoras-input-time"
              disableClock={true}
              minTime={horaFinalLimits.min}
              maxTime={horaFinalLimits.max}
              placeholder="Hora Final"
            />
          </div>
          <div className="crehoras-input-container">
            <label htmlFor="Evidencias" className="crehoras-label">
              <TbFileUpload /> Subir Evidencias
            </label>
            <input
              type="file"
              id="Evidencias"
              name="Evidencias"
              onChange={(e) => handleChange(e.target.name, e.target.files[0])}
              className="crehoras-file"
            />

            <div className="crehoras-section">
              {formData.NombreEvidencia !== "-" ? (
                <>
                  <div className="crehoras-section-title">
                    {formData.NombreEvidencia}
                  </div>
                  <div className="delete-button">
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id="tooltip-edit">Eliminar Archivo</Tooltip>
                      }
                    >
                      <button onClick={handleDelete}>
                        <MdDeleteForever />
                      </button>
                    </OverlayTrigger>
                  </div>
                </>
              ) : (
                <div className="crehoras-section-title">
                  Nombre del Archivo Seleccionado
                </div>
              )}
            </div>
          </div>

          <div className="crehoras-buttons-container">
            <button onClick={handleBackClick} className="crehoras-button">
              <FaChevronLeft />
              Regresar
            </button>

            <button
              type="submit"
              className="crehoras-button"
              disabled={isSubmitDisabled}
            >
              {bitacoraId ? "Actualizar" : "Guardar"} <FaSave />
            </button>
          </div>
          {error && <div className="error-message">{error}</div>}
        </form>
        <ToastContainer position="bottom-right" />
      </div>
    </div>
  );
}

export default CrearoActualizarHoras;
