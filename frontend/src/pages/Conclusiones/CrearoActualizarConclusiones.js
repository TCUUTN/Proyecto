import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CrearoActualizarConclusiones.css";
import { FaChevronLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

function CrearoActualizarConclusiones() {
  const [formData, setFormData] = useState({
    Identificacion: "",
    GrupoId: "",
    Labor1: "",
    Labor2: "",
    Labor3: "",
    Labor4: "",
    Labor5: "",
    Labor6: "",
    Comentarios: "",
    EstadoBoleta: "En Proceso",
    MotivoRechazo: "",
    LastUser: "",
  });

  const [error, setError] = useState("");
  const [conclusionId, setConclusionId] = useState(null);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedConclusionId = localStorage.getItem("ConclusionIdSeleccionado");
    setConclusionId(storedConclusionId);
    if (storedConclusionId) {
      fetch(`conclusiones/${storedConclusionId}`)
        .then((response) => response.json())
        .then((data) => {
          setFormData((prevFormData) => ({
            ...prevFormData,
            Identificacion: data.Identificacion || "",
            GrupoId: data.GrupoId || "",
            Labor1: data.Labor1 || "",
            Labor2: data.Labor2 || "",
            Labor3: data.Labor3 || "",
            Labor4: data.Labor4 || "",
            Labor5: data.Labor5 || "",
            Labor6: data.Labor6 || "",
            Comentarios: data.Comentarios || "",
            EstadoBoleta: data.EstadoBoleta || "En Proceso",
            MotivoRechazo: data.MotivoRechazo || "",
            LastUser: data.LastUser || "",
          }));
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
            setError("Error al obtener el grupo. Por favor, inténtelo de nuevo.");
          });
      }
    }
  }, []);

  useEffect(() => {
    const container = document.querySelector('.creconclusiones-container');
    const content = document.querySelector('.creconclusiones-content');

    function adjustPadding() {
      const contentHeight = content.offsetHeight;
      const windowHeight = window.innerHeight;

      // Calcula el padding necesario para centrar el contenido
      const padding = Math.max((windowHeight - contentHeight) / 2, 20); // Mínimo padding de 20px

      container.style.paddingTop = `${padding}px`;
      container.style.paddingBottom = `${padding}px`;
    }

    adjustPadding();
    window.addEventListener('resize', adjustPadding);

    return () => {
      window.removeEventListener('resize', adjustPadding);
    };
  }, []);

  const handleChange = (name, value) => {
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    validateForm(newFormData);
  };

  const validateForm = (data) => {
    const { Labor1, Labor2, Labor3, Labor4, Labor5, Labor6, Comentarios } = data;
    const isValid =
      Labor1 && Labor2 && Labor3 && Labor4 && Labor5 && Labor6 && Comentarios;
    setIsSubmitDisabled(!isValid);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const requiredFields = [
      "Labor1",
      "Labor2",
      "Labor3",
      "Labor4",
      "Labor5",
      "Labor6",
      "Comentarios",
    ];

    for (let field of requiredFields) {
      if (!formData[field]) {
        setError(`Por favor, ingrese ${field}.`);
        setIsSubmitDisabled(true);
        return;
      }
    }

    const dataToSend = { ...formData, ConclusionId: conclusionId };

    try {
      const response = await fetch("conclusiones/crearOActualizarConclusiones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        toast.success("La conclusión se ha registrado correctamente");
        sessionStorage.removeItem("ConclusionIdSeleccionado");
        navigate("/VistaConclusionesGrupo");
      } else {
        setError("Error al registrar la conclusión. Por favor, inténtelo de nuevo.");
      }
    } catch (error) {
      setError("Error al enviar la solicitud. Por favor, inténtelo de nuevo.");
    }
  };

  const handleBackClick = () => {
    sessionStorage.removeItem("ConclusionIdSeleccionado");
    navigate("/VistaConclusionesGrupo");
  };

  return (
    <div className="creconclusiones-container">
      <div className="creconclusiones-content">
        <h1 className="creconclusiones-title">Registro de Conclusiones</h1>
        <div className="creconclusiones-divider" />
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
          {["Labor1", "Labor2", "Labor3", "Labor4", "Labor5", "Labor6"].map((labor, index) => (
            <div key={index} className="creconclusiones-input-container">
              <textarea
                id={labor}
                name={labor}
                value={formData[labor]}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                className="creconclusiones-textarea"
                placeholder={`Descripción de ${labor}`}
              />
            </div>
          ))}
          <div className="creconclusiones-input-container">
            <textarea
              id="Comentarios"
              name="Comentarios"
              value={formData.Comentarios}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              className="creconclusiones-textarea"
              placeholder="Comentarios"
            />
          </div>
          <div className="creconclusiones-input-container">
            <button onClick={handleBackClick} className="creconclusiones-button">
              <FaChevronLeft />
              Regresar
            </button>
            &nbsp;&nbsp;&nbsp;
            <button
              type="submit"
              className="creconclusiones-button"
              disabled={isSubmitDisabled}
            >
              {conclusionId ? "Actualizar" : "Guardar"}
            </button>
          </div>
          {error && <div className="error-message">{error}</div>}
        </form>
        <ToastContainer position="bottom-right" />
      </div>
    </div>
  );
}

export default CrearoActualizarConclusiones;
