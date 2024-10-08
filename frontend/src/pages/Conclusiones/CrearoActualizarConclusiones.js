import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import { CSSTransition } from "react-transition-group";
import "react-toastify/dist/ReactToastify.css";
import { FaSave } from "react-icons/fa";
import "./CrearoActualizarConclusiones.css";
import { FaChevronLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

// Componente principal para crear o actualizar conclusiones
function CrearoActualizarConclusiones() {
  // Definición de los estados locales
  const [formData, setFormData] = useState({
    ConclusionId: "",
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
  const [selectedRole, setSelectedRole] = useState("");
  const [horasTotalesEstudiante, setHorasTotalesEstudiante] = useState(0);
  const [motivoRechazo, setMotivoRechazo] = useState("");
  const [isMotivoRechazoValid, setIsMotivoRechazoValid] = useState(false);
  const [isRejectionVisible, setIsRejectionVisible] = useState(false);
  const [isApproveDisabled, setIsApproveDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Estado para manejar la pantalla de carga
  const navigate = useNavigate();
  const nodeRef = useRef(null);

  // useEffect para cargar datos del rol y conclusión desde el almacenamiento
  useEffect(() => {
    const role = sessionStorage.getItem("SelectedRole");
    setSelectedRole(role);

    const storedConclusionId = localStorage.getItem("ConclusionIdSeleccionado");
    setConclusionId(storedConclusionId);

    if (role === "Estudiante") {
      const horas = localStorage.getItem("horasTotalesEstudiante");
      setHorasTotalesEstudiante(parseInt(horas, 10) || 0);
    }
  }, []);

  // useEffect para cargar datos del formulario basados en el rol
  useEffect(() => {
    const role = sessionStorage.getItem("SelectedRole");
    if (role === "Estudiante") {
      const identificacion = sessionStorage.getItem("Identificacion");
      const grupoId = sessionStorage.getItem("GrupoId");
      if (identificacion && grupoId) {
        fetch(`conclusiones/${identificacion}/${grupoId}`)
          .then((response) => response.json())
          .then((data) => {
            if (data) {
              setConclusionId(data.ConclusionId);
              setFormData((prevFormData) => ({
                ...prevFormData,
                ConclusionId: data.ConclusionId,
                Identificacion: data.Identificacion,
                GrupoId: data.GrupoId,
                Labor1: data.Labor1,
                Labor2: data.Labor2,
                Labor3: data.Labor3,
                Labor4: data.Labor4,
                Labor5: data.Labor5,
                Labor6: data.Labor6,
                Comentarios: data.Comentarios,
                EstadoBoleta: data.EstadoBoleta || "En Proceso",
                MotivoRechazo: data.MotivoRechazo,
                LastUser: data.LastUser || "",
              }));
              validateForm(data);
            }
          })
          .catch((error) => {
            toast.error(
              "Error al obtener los datos. Por favor, inténtelo de nuevo:",
              error
            );
          });
      }
    } else if (role === "Académico" || role === "Administrativo") {
      if (conclusionId) {
        fetch(`conclusiones/${conclusionId}`)
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
            toast.error(
              "Error al obtener los datos. Por favor, inténtelo de nuevo:",
              error
            );
          });
      }
    }
  }, [conclusionId]);

  // Ajuste del padding dinámico del contenedor basado en la altura del contenido
  useEffect(() => {
    const container = document.querySelector(".creconclusiones-container");
    const content = document.querySelector(".creconclusiones-content");

    function adjustPadding() {
      const contentHeight = content.offsetHeight;
      const windowHeight = window.innerHeight;

      const padding = Math.max((windowHeight - contentHeight) / 2, 20);

      container.style.paddingTop = `${padding}px`;
      container.style.paddingBottom = `${padding}px`;
    }

    adjustPadding();
    window.addEventListener("resize", adjustPadding);

    return () => {
      window.removeEventListener("resize", adjustPadding);
    };
  }, []);
  // Maneja los cambios en los inputs del formulario
  const handleChange = (name, value) => {
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    validateForm(newFormData);
  };

  // Validación del formulario
  const validateForm = (data) => {
    const { Labor1, Labor2, Labor3, Labor4, Labor5, Labor6, Comentarios } =
      data;
    const isValid =
      Labor1 && Labor2 && Labor3 && Labor4 && Labor5 && Labor6 && Comentarios;
    setIsSubmitDisabled(!isValid);
  };

  // Maneja el envío del formulario
  const handleSubmit = async (event) => {
    setIsLoading(true); // Mostrar pantalla de carga
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
    formData.Identificacion = sessionStorage.getItem("Identificacion");
    formData.GrupoId = sessionStorage.getItem("GrupoId");
    formData.ConclusionId = conclusionId;
    const dataToSend = { ...formData, ConclusionId: conclusionId };

    try {
      const response = await fetch(
        "conclusiones/crearOActualizarConclusiones",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        }
      );

      if (response.ok) {
        toast.success("La conclusión se ha registrado correctamente");
        sessionStorage.removeItem("ConclusionIdSeleccionado");
        setIsLoading(false); // Ocultar pantalla de carga
        if (selectedRole !== "Estudiante") {
          navigate("/VistaConclusionesGrupo");
        } else {
          navigate("/Home");
        }
      } else {
        setError(
          "Error al registrar la conclusión. Por favor, inténtelo de nuevo."
        );
      }
    } catch (error) {
      setError("Error al enviar la solicitud. Por favor, inténtelo de nuevo.");
      setIsLoading(false); // Ocultar pantalla de carga
    }
  };
  // Maneja el evento de retroceso (volver a la vista anterior)
  const handleBackClick = () => {
    sessionStorage.removeItem("ConclusionIdSeleccionado");
    if (selectedRole !== "Estudiante") {
      navigate("/VistaConclusionesGrupo");
    } else {
      navigate("/Home");
    }
  };
  // Maneja la aprobación de la conclusión
  const handleApprove = async () => {
    try {
      setIsLoading(true); // Mostrar pantalla de carga
      const response = await fetch(
        `conclusiones/aprobarConclusion/${conclusionId}`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        localStorage.removeItem("ConclusionIdSeleccionado");
        localStorage.setItem("BanderaAprobado", "true");
        setIsLoading(false); // Ocultar pantalla de carga
        navigate("/VistaConclusionesGrupo");
      } else {
        setError(
          "Error al aprobar la conclusión. Por favor, inténtelo de nuevo."
        );
      }
    } catch (error) {
      setError("Error al enviar la solicitud. Por favor, inténtelo de nuevo.");
      setIsLoading(false); // Ocultar pantalla de carga
    }
  };

  const handleCancelarRechazar = async () => {
    if (isRejectionVisible) {
      setIsRejectionVisible(false);
      setIsApproveDisabled(false);
      setMotivoRechazo("");
      return;
    }

    setIsRejectionVisible(true);
    setIsApproveDisabled(true);
  };
  // Maneja el rechazo de la conclusión
  const handleReject = async () => {
    setIsLoading(true); // Mostrar pantalla de carga
    if (!isMotivoRechazoValid) {
      setError("El motivo del rechazo debe tener al menos 5 palabras.");
      setIsLoading(false); // Ocultar pantalla de carga
      return;
    }

    try {
      const response = await fetch("conclusiones/rechazarConclusion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ConclusionId: conclusionId,
          MotivoRechazo: motivoRechazo,
        }),
      });

      if (response.ok) {
        localStorage.removeItem("ConclusionIdSeleccionado");
        localStorage.setItem("BanderaRechazado", "true");
        setIsLoading(false); // Ocultar pantalla de carga
        navigate("/VistaConclusionesGrupo");
      } else {
        setError(
          "Error al rechazar la conclusión. Por favor, inténtelo de nuevo."
        );
      }
    } catch (error) {
      setError("Error al enviar la solicitud. Por favor, inténtelo de nuevo.");
      setIsLoading(false); // Ocultar pantalla de carga
    }
  };

  useEffect(() => {
    const words = motivoRechazo.trim().split(/\s+/);
    setIsMotivoRechazoValid(words.length >= 5);
  }, [motivoRechazo]);

  if (selectedRole === "Estudiante") {
    if (horasTotalesEstudiante < 150) {
      return (
        <div className="creconclusiones-container">
          {/*Para la carga */}
          {isLoading && (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
            </div>
          )}
          <div className="creconclusiones-content">
            <h1 className="creconclusiones-title">Registro de Conclusiones</h1>
            <div className="creconclusiones-divider" />
            <p>
              Aún no posee las horas suficientes para poder llenar la boleta de
              conclusión.
            </p>
            <button
              onClick={handleBackClick}
              className="creconclusiones-button"
            >
              <FaChevronLeft />
              Regresar
            </button>
          </div>
        </div>
      );
    }
  }

  if (
    (selectedRole === "Académico" || selectedRole === "Administrativo") &&
    !conclusionId
  ) {
    return (
      <div className="creconclusiones-container">
        <div className="creconclusiones-content">
          <h1 className="creconclusiones-title">Registro de Conclusiones</h1>
          <div className="creconclusiones-divider" />
          <p>Debe seleccionar un estudiante para poder ver su formulario.</p>
          <button onClick={handleBackClick} className="creconclusiones-button">
            <FaChevronLeft />
            Regresar
          </button>
        </div>
      </div>
    );
  }
  // Renderiza del formulario y los botones de acción
  return (
    <div className="creconclusiones-container">
      <div className="creconclusiones-content">
        <h1 className="creconclusiones-title">Registro de Conclusiones</h1>
        <div className="creconclusiones-divider" />
        <button onClick={handleBackClick} className="creconclusiones-button">
          <FaChevronLeft />
          Regresar
        </button>
        {selectedRole === "Académico" ||
        selectedRole === "Administrativo" ||
        (selectedRole === "Estudiante" &&
          formData.EstadoBoleta === "Aprobado") ? (
          <div>
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
            {["Labor1", "Labor2", "Labor3", "Labor4", "Labor5", "Labor6"].map(
              (labor, index) => (
                <div key={index} className="creconclusiones-input-container">
                  <textarea
                    id={labor}
                    name={labor}
                    value={formData[labor]}
                    readOnly
                    className="creconclusiones-textarea"
                    placeholder={`Descripción de ${labor}`}
                  />
                </div>
              )
            )}
            <div className="creconclusiones-input-container">
              <textarea
                id="Comentarios"
                name="Comentarios"
                value={formData.Comentarios}
                readOnly
                className="creconclusiones-textarea"
                placeholder="Comentarios"
              />
            </div>
            {selectedRole === "Académico" &&
              formData.EstadoBoleta === "En Proceso" && (
                <div className="creconclusiones-input-container">
                  <button
                    onClick={handleApprove}
                    className="creconclusiones-button"
                    disabled={isApproveDisabled}
                  >
                    Aprobar
                  </button>
                  &nbsp;&nbsp;&nbsp;
                  <button
                    onClick={handleCancelarRechazar}
                    className="creconclusiones-button"
                  >
                    {isRejectionVisible ? "Cancelar" : "Rechazar"}
                  </button>
                </div>
              )}
            <CSSTransition
              in={isRejectionVisible}
              timeout={300}
              classNames="rejection-form"
              unmountOnExit
              nodeRef={nodeRef} // Pasar la referencia aquí
            >
              <div className="creconclusiones-input-container">
                <textarea
                  id="MotivoRechazo"
                  name="MotivoRechazo"
                  value={motivoRechazo}
                  onChange={(e) => setMotivoRechazo(e.target.value)}
                  className="creconclusiones-textarea"
                  placeholder="Motivo del rechazo"
                />
                <button
                  onClick={handleReject}
                  className="creconclusiones-button"
                  disabled={!isMotivoRechazoValid}
                >
                  Enviar Rechazo
                </button>
                {motivoRechazo && !isMotivoRechazoValid && (
                  <div className="error-message">
                    El motivo del rechazo debe tener al menos 5 palabras.
                  </div>
                )}
              </div>
            </CSSTransition>
          </div>
        ) : (
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
            {["Labor1", "Labor2", "Labor3", "Labor4", "Labor5", "Labor6"].map(
              (labor, index) => (
                <div key={index} className="creconclusiones-input-container">
                  <textarea
                    id={labor}
                    name={labor}
                    value={formData[labor]}
                    onChange={(e) =>
                      handleChange(e.target.name, e.target.value)
                    }
                    className="creconclusiones-textarea"
                    placeholder={`Descripción de ${labor}`}
                  />
                </div>
              )
            )}
            <div ref={nodeRef} className="creconclusiones-input-container">
              <textarea
                id="Comentarios"
                name="Comentarios"
                value={formData.Comentarios}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                className="creconclusiones-textarea"
                placeholder="Comentarios"
              />
            </div>
            {formData.EstadoBoleta !== "Aprobado" &&
              selectedRole === "Estudiante" && (
                <div className="creconclusiones-input-container">
                  <button
                    type="submit"
                    className="creconclusiones-button"
                    disabled={isSubmitDisabled}
                  >
                    {conclusionId ? "Actualizar" : "Guardar"} <FaSave />
                  </button>
                </div>
              )}
            {error && <div className="error-message">{error}</div>}
          </form>
        )}
        <ToastContainer position="bottom-right" />
      </div>
    </div>
  );
}

export default CrearoActualizarConclusiones;
