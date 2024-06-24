import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-time-picker/dist/TimePicker.css";
import TimePicker from "react-time-picker";
import "./CrearoActualizarHoras.css"
import { FaChevronLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

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
        .then((data) => {
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
            console.error("Error al obtener el grupo:", error);
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
      const start = new Date(`1970-01-01T${HoraInicio}:00`);
      let maxHours = TipoActividad === "Gira" ? 12 : 8;
      const end = new Date(start.getTime() + maxHours * 60 * 60 * 1000);

      setHoraFinalLimits({
        min: HoraInicio,
        max: end.toTimeString().split(" ")[0].substring(0, 5),
      });
    }
  };

  const validateForm = (data) => {
    const { TipoActividad, HoraInicio, HoraFinal } = data;
    if (HoraInicio && HoraFinal) {
      const start = new Date(`1970-01-01T${HoraInicio}`);
      const end = new Date(`1970-01-01T${HoraFinal}`);
      const difference = (end - start) / (1000 * 60 * 60);

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
          formDataToSend.append('BitacoraId', newBitacoraId);
          console.log(formData.Evidencias);
          formDataToSend.append('Evidencias', formData.Evidencias);
  
          const evidenceResponse = await fetch("horas/subirAdjunto", {
            method: "POST",
            body: formDataToSend,
          });
          
          if (evidenceResponse.ok) {
            console.log("Archivo subido exitosamente")
          }else{
            setError("Error al subir las evidencias. Por favor, inténtelo de nuevo.");
            return;
          }
        }
  
        toast.success("La actividad se ha registrado correctamente");
        sessionStorage.removeItem("BitacoraId");
        navigate("/VistaHorasEstudiantes");
      } else {
        setError("Error al registrar la actividad. Por favor, inténtelo de nuevo.");
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      setError("Error al enviar la solicitud. Por favor, inténtelo de nuevo.");
    }
  };
  

  const handleBackClick = () => {
    sessionStorage.removeItem("BitacoraId");
    navigate("/VistaHorasEstudiantes");
  };

  const minDate = new Date();
  minDate.setMonth(minDate.getMonth() - 6);
  const maxDate = new Date();

  return (
    <div className="crehoras-container">
      <div className="crehoras-content">
        <h1 className="crehoras-title">Registro de Horas</h1>
        <hr className="crehoras-divider" />
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
          <div className="perfil-input-container">
            <input
              type="date"
              id="Fecha"
              name="Fecha"
              value={formData.Fecha}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              className="crehoras-input-date"
              placeholder="Ingrese la fecha"
              min={minDate.toISOString().split("T")[0]}
              max={maxDate.toISOString().split("T")[0]}
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
            />
          </div>
          <div className="crehoras-input-container">
            <input
              type="file"
              id="Evidencias"
              name="Evidencias"
              onChange={(e) => handleChange(e.target.name, e.target.files[0])}
              className="crehoras-file"
            />
          </div>
          <div className="crehoras-input-container">
            <button onClick={handleBackClick} className="crehoras-button">
              <FaChevronLeft />
              Regresar
            </button>
            <button
              type="submit"
              className="crehoras-button"
              disabled={isSubmitDisabled}
            >
              Guardar
            </button>
          </div>
          {error && <div className="error-message">{error}</div>}
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default CrearoActualizarHoras;
