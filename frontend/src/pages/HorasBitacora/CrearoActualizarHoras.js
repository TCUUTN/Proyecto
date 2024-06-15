import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-time-picker/dist/TimePicker.css";
import TimePicker from "react-time-picker";
import "./RechazoHoras.module.css";
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
          setFormData((prevFormData) => ({
            ...prevFormData,
            Identificacion: data.Identificacion || "",
            GrupoId: data.GrupoId || "",
            Fecha: data.Fecha || "",
            DescripcionActividad: data.DescripcionActividad || "",
            TipoActividad: data.TipoActividad || "Ejecucion",
            HoraInicio: data.HoraInicio || "",
            HoraFinal: data.HoraFinal || "",
          }));
          updateHoraFinalLimits(data);
          validateForm(data);
        })
        .catch((error) => {
          console.error("Error al obtener los datos:", error);
          setError("Error al obtener los datos. Por favor, inténtelo de nuevo.");
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
            setError("Error al obtener el grupo. Por favor, inténtelo de nuevo.");
          });
      }
    }
  }, []);

  const handleChange = (name, value) => {
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    console.log(newFormData)
    if (name === "HoraInicio" || name === "TipoActividad") {
      updateHoraFinalLimits(newFormData);
    }
    if (name === "HoraInicio" || name === "HoraFinal" || name === "TipoActividad") {
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
          setError("La duración de Planificación o Ejecución no puede exceder 8 horas.");
          isValid = false;
        }
      } else if (TipoActividad === "Gira") {
        if (difference > 12) {
          setError("La duración de Gira no puede exceder 12 horas.");
          isValid = false;
        }
      }

      if (end <= start) {
        setError("La hora de finalización no puede ser menor o igual que la hora de inicio.");
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
      console.log(formData)
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
    <div className="perfil-container">
      <div className="perfil-content">
        <div className="regred-action">
          <button onClick={handleBackClick} className="back-button">
            <FaChevronLeft />
            Regresar
          </button>
        </div>
        <h1 className="home-title">Registro de Horas</h1>
        <hr className="perfil-divider" />
        <form onSubmit={handleSubmit}>
          <input
            type="hidden"
            id="Identificacion"
            name="Identificacion"
            value={formData.Identificacion}
            onChange={(e) => handleChange(e.target.name, e.target.value)}
          />
          <input
            type="hidden"
            id="GrupoId"
            name="GrupoId"
            value={formData.GrupoId}
            onChange={(e) => handleChange(e.target.name, e.target.value)}
          />
          <div className="perfil-input-container">
            <input
              type="date"
              id="Fecha"
              name="Fecha"
              value={formData.Fecha}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              className="perfil-input"
              placeholder="Ingrese la fecha"
              min={minDate.toISOString().split("T")[0]}
              max={maxDate.toISOString().split("T")[0]}
            />
          </div>
          <div className="perfil-input-container">
            <input
              type="text"
              id="DescripcionActividad"
              name="DescripcionActividad"
              value={formData.DescripcionActividad}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              className="perfil-input"
              placeholder="Ingrese la descripción de la actividad"
            />
          </div>
          <div className="perfil-input-container">
            <select
              id="TipoActividad"
              name="TipoActividad"
              value={formData.TipoActividad}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              className="perfil-input"
            >
              <option value="Planificacion">Planificación</option>
              <option value="Ejecucion">Ejecución</option>
              <option value="Gira">Gira</option>
            </select>
          </div>
          <div className="perfil-input-container">
            <TimePicker
              onChange={(value) => handleChange("HoraInicio", value)}
              value={formData.HoraInicio}
              disableClock={true}
              format="h:mm a"
              className="perfil-input"
            />
          </div>
          <div className="perfil-input-container">
            <TimePicker
              onChange={(value) => handleChange("HoraFinal", value)}
              value={formData.HoraFinal}
              disableClock={true}
              format="h:mm a"
              className="perfil-input"
              minTime={horaFinalLimits.min}
              maxTime={horaFinalLimits.max}
            />
          </div>
          <div className="perfil-input-container">
            <input
              type="file"
              id="Evidencias"
              name="Evidencias"
              onChange={(e) => handleChange(e.target.name, e.target.files[0])}
              className="perfil-input"
              placeholder="Suba las evidencias"
            />
          </div>
          <button type="submit" className="perfil-button" disabled={isSubmitDisabled}>
            Enviar
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
        <ToastContainer position="bottom-right" />
      </div>
    </div>
  );
}

export default CrearoActualizarHoras;
