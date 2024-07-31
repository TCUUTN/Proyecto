import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSave, FaChevronLeft } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { TbFileUpload } from "react-icons/tb";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import moment from "moment-timezone";
import "./CrearActualizarInfo.css";

function CrearActualizarInfo() {
    // Estado para almacenar los datos del formulario
  const [formData, setFormData] = useState({
    Identificacion: "",
    NombreArchivo: "-",
    Descripcion: "",
    TipoInformacion: "",
    Fecha: "",
    Sede: "",
    GrupoId: 0,
    Archivo: null,
  });

// Estado para almacenar mensajes de error
const [error, setError] = useState("");
// Estado para almacenar el ID de la información (si se está editando)
const [informacionId, setInformacionId] = useState(null);
// Estado para habilitar o deshabilitar el botón de envío
const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
// Hook para navegar entre rutas
const navigate = useNavigate();

// Hook para cargar datos iniciales y configurar el formulario
  useEffect(() => {
    // Cargar datos de la información existente
    const storedInformacionId = sessionStorage.getItem("InformacionId");
    setInformacionId(storedInformacionId);

    const tipoInfoSeleccionado = localStorage.getItem("TipoInfoSeleccionado");
    const identificacion = sessionStorage.getItem("Identificacion");
    const sede = sessionStorage.getItem("Sede");
    const fechaActual = moment().format("YYYY-MM-DD");

    if (storedInformacionId) {
      fetch(`informacion/${storedInformacionId}`)
        .then((response) => response.json())
        .then((data) => {
          setFormData((prevFormData) => ({
            ...prevFormData,
            Identificacion: identificacion,
            NombreArchivo: data.NombreArchivo || "-",
            Descripcion: data.Descripcion || "",
            TipoInformacion: tipoInfoSeleccionado,
            Fecha: fechaActual,
            Sede: sede,
            GrupoId: data.GrupoId || 0,
            Archivo: null,
          }));
          validateForm({
            ...data,
            TipoInformacion: tipoInfoSeleccionado,
            Fecha: fechaActual,
            Sede: sede,
          });
        })
        .catch((error) => {
          toast.error(
            "Error al obtener los datos. Por favor, inténtelo de nuevo: ",error
          );
        });
    } else {
      // Configurar datos iniciales para un nuevo formulario
      setFormData((prevFormData) => ({
        ...prevFormData,
        Identificacion: identificacion,
        TipoInformacion: tipoInfoSeleccionado,
        Fecha: fechaActual,
        Sede: sede,
        GrupoId:
          tipoInfoSeleccionado === "Académico"
            ? localStorage.getItem("GrupoSeleccionado")
            : 0,
      }));
      validateForm({
        Identificacion: identificacion,
        TipoInformacion: tipoInfoSeleccionado,
        Fecha: fechaActual,
        Sede: sede,
        GrupoId:
          tipoInfoSeleccionado === "Académico"
            ? localStorage.getItem("GrupoSeleccionado")
            : 0,
      });
    }
  }, []);
// Manejar cambios en los campos del formulario
  const handleChange = (name, value) => {
    const newFormData = { ...formData, [name]: value };
    if (name === "Archivo" && value) {
      newFormData.NombreArchivo = value.name;
    }
    setFormData(newFormData);
    validateForm(newFormData);
  };
// Validar los datos del formulario
  const validateForm = (data) => {
    const { Descripcion, TipoInformacion, Archivo } = data;
    let isValid = true;
// Validaciones basadas en el tipo de información
    if (TipoInformacion === "General" || TipoInformacion === "Académico") {
      if (!Descripcion) {
        isValid = false;
        setError("La descripción es obligatoria.");
      }
    } else if (TipoInformacion === "Plantilla") {
      if (!Archivo) {
        isValid = false;
        setError("El archivo es obligatorio.");
      }
    }

    setIsSubmitDisabled(!isValid);
    if (isValid) setError("");
  };
// Manejar el envío del formulario
  const handleSubmit = async (event) => {
    event.preventDefault();
    const requiredFields = ["Descripcion"];
    for (let field of requiredFields) {
      if (!formData[field] && formData.TipoInformacion !== "Plantilla") {
        setError(`Por favor, ingrese ${field}.`);
        setIsSubmitDisabled(true);
        return;
      }
    }
 // Si se está editando una información existente, agregar el ID
    if (informacionId!=null) {
      formData.InformacionId=informacionId
    }

    const dataToSend = {
      ...formData,
    };
  // Agregar el ID del grupo si es del tipo "Académico"
    if (formData.TipoInformacion === "Académico") {
      dataToSend.GrupoId = localStorage.getItem("GrupoSeleccionado");
    }

    try {
      const response = await fetch("informacion/crearOActualizarInformacion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        const responseData = await response.json();
        const { InformacionId: newInformacionId } = responseData;
// Subir el archivo si se ha seleccionado
        if (formData.Archivo) {
          const formDataToSend = new FormData();
          formDataToSend.append("InformacionId", newInformacionId);
          formDataToSend.append("Archivo", formData.Archivo);

          const evidenceResponse = await fetch("informacion/subirAdjunto", {
            method: "POST",
            body: formDataToSend,
          });

          if (!evidenceResponse.ok) {
            setError(
              "Error al subir el archivo. Por favor, inténtelo de nuevo."
            );
            return;
          }
        }

        toast.success("La información se ha registrado correctamente");
        sessionStorage.removeItem("InformacionId");
        navigate("/Informacion");
      } else {
        setError(
          "Error al registrar la información. Por favor, inténtelo de nuevo."
        );
      }
    } catch (error) {
      setError("Error al enviar la solicitud. Por favor, inténtelo de nuevo.");
    }
  };
  // Manejar el clic en el botón de regreso
  const handleBackClick = () => {
    sessionStorage.removeItem("InformacionId");
    navigate("/Informacion");
  };
 // Manejar la eliminación del archivo
  const handleDelete = () => {
    setFormData({
      ...formData,
      NombreArchivo: "-",
      Archivo: null,
    });
    document.getElementById("Archivo").value = ""; // Reset the file input
  };
// Obtener el título del formulario basado en el tipo de información y si se está editando
  const getTitulo = () => {
    switch (localStorage.getItem("TipoInfoSeleccionado")) {
      case "General":
        if (informacionId) {
          return "Actualizar Información General";
        } else {
          return "Añadir nueva Información General";
        }
      case "Académico":
        if (informacionId) {
          return "Actualizar Información al grupo";
        } else {
          return "Añadir nueva Información al grupo";
        }
        
      case "Plantilla":
        if (informacionId) {
          return "Actualizar Plantilla";
        } else {
          return "Añadir nueva Plantilla";
        }
      default:
        return "Agregar";
    }
  };

  return (
    <div className="creinfo-container">
      <div className="creinfo-content">
        <h1 className="creinfo-title">{getTitulo()}</h1>
        <div className="creinfo-divider" />
        <form onSubmit={handleSubmit}>
          <input
            type="hidden"
            id="Identificacion"
            name="Identificacion"
            value={formData.Identificacion}
          />
          <input
            type="hidden"
            id="TipoInformacion"
            name="TipoInformacion"
            value={formData.TipoInformacion}
          />
          <input type="hidden" id="Fecha" name="Fecha" value={formData.Fecha} />
          <input type="hidden" id="Sede" name="Sede" value={formData.Sede} />

          {/* Mostrar Descripción solo si TipoInformacion no es 'Plantilla' */}
          {formData.TipoInformacion !== "Plantilla" && (
            <div className="creinfo-input-container">
              <textarea
                id="Descripcion"
                name="Descripcion"
                value={formData.Descripcion}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                className="creinfo-textarea"
                placeholder="Descripción"
                disabled={formData.TipoInformacion === "Plantilla"}
              />
            </div>
          )}

          <div className="creinfo-input-container">
            <label htmlFor="Archivo" className="creinfo-label">
              <TbFileUpload /> Subir Archivo
            </label>
            <input
              type="file"
              id="Archivo"
              name="Archivo"
              onChange={(e) => handleChange(e.target.name, e.target.files[0])}
              className="creinfo-file"
              required={formData.TipoInformacion === "Plantilla"}
            />

            <div className="creinfo-section">
              {formData.NombreArchivo !== "-" ? (
                <>
                  <div className="creinfo-section-title">
                    {formData.NombreArchivo}
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
                <div className="creinfo-section-title">
                  Nombre del Archivo Seleccionado
                </div>
              )}
            </div>
          </div>

          <div className="creinfo-buttons-container">
            <button onClick={handleBackClick} className="creinfo-button">
              <FaChevronLeft />
              Regresar
            </button>

            <button
              type="submit"
              className="creinfo-button"
              disabled={isSubmitDisabled}
            >
              {informacionId ? "Actualizar" : "Añadir"}
              <FaSave />
            </button>
          </div>
        </form>
        {error && <div className="error-message">{error}</div>}
        <ToastContainer />
      </div>
    </div>
  );
}

export default CrearActualizarInfo;
