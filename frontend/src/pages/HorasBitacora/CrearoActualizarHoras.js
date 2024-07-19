import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-time-picker/dist/TimePicker.css";
import TimePicker from "react-time-picker";
import "./CrearoActualizarHoras.css";
import { FaChevronLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import moment from "moment-timezone";
import { TbFileUpload } from "react-icons/tb";

function CrearoActualizarHoras() {
  const [formData, setFormData] = useState({
    Identificacion: "",
    GrupoId: "",
    Fecha: "",
    DescripcionActividad: "",
    TipoActividad: "Ejecucion",
    HoraInicio: "",
    HoraFinal: "",
    Evidencias: null,
    NombreEvidencia: "",
  });

  const [error, setError] = useState("");
  const [bitacoraId, setBitacoraId] = useState(null);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [horaFinalLimits, setHoraFinalLimits] = useState({ min: "", max: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const storedBitacoraId = sessionStorage.getItem("BitacoraId");
    setBitacoraId(storedBitacoraId);
    if (storedBitacoraId) {
      fetch(`horas/${storedBitacoraId}`)
        .then((response) => response.json())
        .then(async (data) => {
          const formattedHoraInicio = formatTime(data.HoraInicio);
          const formattedHoraFinal = formatTime(data.HoraFinal);

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
            NombreEvidencia: data.NombreEvidencia || "",
          }));
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
          console.error("Error al obtener los datos:", error);
          setError(
            "Error al obtener los datos. Por favor, inténtelo de nuevo."
          );
        });
    } else {
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

  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
  };

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

  const handleSubmit = async (event) => {
    event.preventDefault();
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
      const fechaCheckResponse = await fetch("horas/horasporFecha", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Fecha: formData.Fecha }),
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

  const minDate = moment().subtract(6, "months").tz("America/Costa_Rica");
  const maxDate = moment().tz("America/Costa_Rica");
  return (
    <div className="crehoras-container">
      <div className="crehoras-content">
        <h1 className="crehoras-title">Registro de Horas</h1>
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
            <div className="custom-file-upload">
              <label htmlFor="Evidencias" className="crehoras-upload-label">
                <TbFileUpload className="icon-crehoraso" /> Subir Evidencias
              </label>
              <input
                type="file"
                id="Evidencias"
                name="Evidencias"
                onChange={(e) => handleChange(e.target.name, e.target.files[0])}
                className="crehoras-file"
              />
              <div className="file-name-container">
                {formData.NombreEvidencia && (
                  <span className="file-name">{formData.NombreEvidencia}</span>
                )}
              </div>
            </div>
          </div>

          <div className="crehoras-input-container">
            <button onClick={handleBackClick} className="crehoras-button">
              <FaChevronLeft />
              Regresar
            </button>
            &nbsp;&nbsp;&nbsp;
            <button
              type="submit"
              className="crehoras-button"
              disabled={isSubmitDisabled}
            >
              {bitacoraId ? "Actualizar" : "Guardar"}
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
