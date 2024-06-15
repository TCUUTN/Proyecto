import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  const navigate = useNavigate();

  useEffect(() => {
    const bitacoraId = sessionStorage.getItem("BitacoraId");
    if (bitacoraId) {
      fetch(`horas/${bitacoraId}`)
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
        })
        .catch((error) => {
          console.error("Error al obtener los datos:", error);
          setError("Error al obtener los datos. Por favor, inténtelo de nuevo.");
        });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate required fields
    const requiredFields = [
      "Identificacion",
      "GrupoId",
      "Fecha",
      "DescripcionActividad",
      "TipoActividad",
      "HoraInicio",
      "HoraFinal",
    ];

    for (let field of requiredFields) {
      if (!formData[field]) {
        setError(`Por favor, ingrese ${field}.`);
        return;
      }
    }

    const bitacoraId = sessionStorage.getItem("BitacoraId");
    
    const dataToSend = { ...formData };
    if (bitacoraId) {
      dataToSend.BitacoraId = bitacoraId;
    }

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
          <div className="perfil-input-container">
            <input
              type="text"
              id="Identificacion"
              name="Identificacion"
              value={formData.Identificacion}
              onChange={handleChange}
              className="perfil-input"
              placeholder="Ingrese la identificación"
            />
          </div>
          <div className="perfil-input-container">
            <input
              type="number"
              id="GrupoId"
              name="GrupoId"
              value={formData.GrupoId}
              onChange={handleChange}
              className="perfil-input"
              placeholder="Ingrese el ID del grupo"
            />
          </div>
          <div className="perfil-input-container">
            <input
              type="date"
              id="Fecha"
              name="Fecha"
              value={formData.Fecha}
              onChange={handleChange}
              className="perfil-input"
              placeholder="Ingrese la fecha"
            />
          </div>
          <div className="perfil-input-container">
            <input
              type="text"
              id="DescripcionActividad"
              name="DescripcionActividad"
              value={formData.DescripcionActividad}
              onChange={handleChange}
              className="perfil-input"
              placeholder="Ingrese la descripción de la actividad"
            />
          </div>
          <div className="perfil-input-container">
            <select
              id="TipoActividad"
              name="TipoActividad"
              value={formData.TipoActividad}
              onChange={handleChange}
              className="perfil-input"
            >
              <option value="Planificacion">Planificación</option>
              <option value="Ejecucion">Ejecución</option>
              <option value="Gira">Gira</option>
            </select>
          </div>
          <div className="perfil-input-container">
            <input
              type="time"
              id="HoraInicio"
              name="HoraInicio"
              value={formData.HoraInicio}
              onChange={handleChange}
              className="perfil-input"
              placeholder="Ingrese la hora de inicio"
            />
          </div>
          <div className="perfil-input-container">
            <input
              type="time"
              id="HoraFinal"
              name="HoraFinal"
              value={formData.HoraFinal}
              onChange={handleChange}
              className="perfil-input"
              placeholder="Ingrese la hora de finalización"
            />
          </div>
          <div className="perfil-input-container">
            <input
              type="file"
              id="Evidencias"
              name="Evidencias"
              onChange={handleChange}
              className="perfil-input"
              placeholder="Suba las evidencias"
            />
          </div>
          <button type="submit" className="perfil-button">
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
