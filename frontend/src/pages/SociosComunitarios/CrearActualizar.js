import React, { useState, useEffect } from "react";
import { FaChevronLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import "./CrearActuSocioCom.css";

function CrearActuSocioComunitarios() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    NombreSocio: "",
    CorreoElectronicoSocio: "",
    TipoInstitucion: "",
    TelefonoSocio: "",
    DireccionSocio: "",
    UbicacionGPS: "",
    NombreCompletoContacto: "",
    Puesto: "",
    CorreoElectronicoContacto: "",
    TelefonoContacto: "",
    Estado: "1", // Default to "Activo"
  });
  const [formErrors, setFormErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [title, setTitle] = useState("Crear Socio Comunitario");
  const [isCreating, setIsCreating] = useState(true);

  useEffect(() => {
    const socioIdSeleccionado = localStorage.getItem("SocioIdSeleccionado");
    if (socioIdSeleccionado) {
      setTitle("Editar Socio Comunitario");
      setIsCreating(false);
      fetch(`/socios/${socioIdSeleccionado}`)
        .then((response) => response.json())
        .then((data) => {
          setFormData({
            NombreSocio: data.NombreSocio,
            CorreoElectronicoSocio: data.CorreoElectronicoSocio,
            TipoInstitucion: data.TipoInstitucion,
            TelefonoSocio: data.TelefonoSocio,
            DireccionSocio: data.DireccionSocio,
            UbicacionGPS: data.UbicacionGPS,
            NombreCompletoContacto: data.NombreCompletoContacto,
            Puesto: data.Puesto,
            CorreoElectronicoContacto: data.CorreoElectronicoContacto,
            TelefonoContacto: data.TelefonoContacto,
            Estado: data.Estado,
          });
        })
        .catch((error) => {
          console.error("Error fetching socio data:", error);
        });
    } else {
      setFormData((prevFormData) => ({ ...prevFormData, Estado: "1" }));
    }
  }, []);

  useEffect(() => {
    validateForm();
  }, [formData]);

  const validateForm = () => {
    const errors = {};
    if (!formData.NombreSocio || formData.NombreSocio.length < 3) {
      errors.NombreSocio = "Nombre de socio es requerido y debe tener al menos 3 caracteres";
    }
    if (!formData.CorreoElectronicoSocio || !/\S+@\S+\.\S+/.test(formData.CorreoElectronicoSocio)) {
      errors.CorreoElectronicoSocio = "Correo electrónico de socio es requerido y debe ser válido";
    }
    if (!formData.TipoInstitucion || formData.TipoInstitucion.length < 3) {
      errors.TipoInstitucion = "Tipo de institución es requerido y debe tener al menos 3 caracteres";
    }
    if (!formData.TelefonoSocio || formData.TelefonoSocio.length < 3) {
      errors.TelefonoSocio = "Teléfono de socio es requerido y debe tener al menos 3 caracteres";
    }
    if (!formData.DireccionSocio || formData.DireccionSocio.length < 3) {
      errors.DireccionSocio = "Dirección exacta es requerida y debe tener al menos 3 caracteres";
    }
    if (!formData.UbicacionGPS || formData.UbicacionGPS.length < 3) {
      errors.UbicacionGPS = "Ubicación GPS es requerida y debe tener al menos 3 caracteres";
    }
    if (!formData.NombreCompletoContacto || formData.NombreCompletoContacto.length < 3) {
      errors.NombreCompletoContacto = "Nombre completo es requerido y debe tener al menos 3 caracteres";
    }
    if (!formData.Puesto || formData.Puesto.length < 3) {
      errors.Puesto = "Puesto es requerido y debe tener al menos 3 caracteres";
    }
    if (!formData.CorreoElectronicoContacto || !/\S+@\S+\.\S+/.test(formData.CorreoElectronicoContacto)) {
      errors.CorreoElectronicoContacto = "Correo electrónico personal es requerido y debe ser válido";
    }
    if (!formData.TelefonoContacto || formData.TelefonoContacto.length < 3) {
      errors.TelefonoContacto = "Teléfono personal es requerido y debe tener al menos 3 caracteres";
    }
    if (!formData.Estado) {
      errors.Estado = "Estado es requerido";
    }

    setFormErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0);
  };

  const handleBackClick = () => {
    localStorage.removeItem("SocioIdSeleccionado");
    navigate("/SocioComunitarios");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) {
      return;
    }

    const socioIdSeleccionado = localStorage.getItem("SocioIdSeleccionado");
    const url = `/socios/crearOActualizarSocio`;
    const payload = {
      ...formData,
      ...(socioIdSeleccionado && { SocioId: socioIdSeleccionado }),
    };

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (response.ok) {
          localStorage.removeItem("SocioIdSeleccionado");
          localStorage.setItem("SocioGuardado", "true");
          navigate("/SocioComunitarios");
        } else {
          return response.text().then((text) => {
            throw new Error(text);
          });
        }
      })
      .catch((error) => {
        console.error("Error saving socio:", error);
        // Show toast notification here
      });
  };

  return (
    <div className="creaedsocio-container">
      <div className="creaedsocio-content">
        <h1 className="creaedsocio-title">{title}</h1>
        <div className="creaedsocio-divider" />
        <form onSubmit={handleSubmit}>
          {/* Información de la Institución */}
          <div className="creaedsocio-section">
            <h3 className="creaedsocio-subt">Información de la Institución:</h3>
            <div className="creaedsocio-group">
              <input
                type="text"
                id="NombreSocio"
                name="NombreSocio"
                placeholder="Nombre Socio"
                className="creaedsocio-input"
                value={formData.NombreSocio}
                onChange={handleChange}
              />
                 <br></br>
              {formErrors.NombreSocio && (
                <span className="error-creaedsocio">{formErrors.NombreSocio}</span>
              )}
            </div>
            <div className="creaedsocio-group">
              <input
                type="email"
                id="CorreoElectronicoSocio"
                name="CorreoElectronicoSocio"
                placeholder="Correo Electrónico de la Institución"
                className="creaedsocio-input"
                value={formData.CorreoElectronicoSocio}
                onChange={handleChange}
              />
                 <br></br>
              {formErrors.CorreoElectronicoSocio && (
                <span className="error-creaedsocio">{formErrors.CorreoElectronicoSocio}</span>
              )}
            </div>
            <div className="creaedsocio-group">
              <input
                type="text"
                id="TipoInstitucion"
                name="TipoInstitucion"
                placeholder="Tipo de institución"
                className="creaedsocio-input"
                value={formData.TipoInstitucion}
                onChange={handleChange}
              />
             <br></br>
              {formErrors.TipoInstitucion && (
                <span className="error-creaedsocio">{formErrors.TipoInstitucion}</span>
              )}
            </div>
            <div className="creaedsocio-group">
              <input
                type="tel"
                id="TelefonoSocio"
                name="TelefonoSocio"
                placeholder="Teléfono de la institución"
                className="creaedsocio-input"
                value={formData.TelefonoSocio}
                onChange={handleChange}
              />
                 <br></br>
              {formErrors.TelefonoSocio && (
                <span className="error-creaedsocio">{formErrors.TelefonoSocio}</span>
              )}
            </div>
            <div className="creaedsocio-group">
              <input
                type="text"
                id="DireccionSocio"
                name="DireccionSocio"
                placeholder="Dirección exacta de la institución"
                className="creaedsocio-input"
                value={formData.DireccionSocio}
                onChange={handleChange}
              />
                 <br></br>
              {formErrors.DireccionSocio && (
                <span className="error-creaedsocio">{formErrors.DireccionSocio}</span>
              )}
            </div>
            <div className="creaedsocio-group">
              <input
                type="text"
                id="UbicacionGPS"
                name="UbicacionGPS"
                placeholder="Ubicación GPS"
                className="creaedsocio-input"
                value={formData.UbicacionGPS}
                onChange={handleChange}
              />
                 <br></br>
              {formErrors.UbicacionGPS && (
                <span className="error-creaedsocio">{formErrors.UbicacionGPS}</span>
              )}
            </div>
          </div>
          {/* Contacto del Socio */}
          <div className="creaedsocio-section">
            <h3 className="creaedsocio-subt">Contacto del Socio:</h3>
            <div className="creaedsocio-group">
              <input
                type="text"
                id="NombreCompletoContacto"
                name="NombreCompletoContacto"
                placeholder="Nombre Completo del contacto"
                className="creaedsocio-input"
                value={formData.NombreCompletoContacto}
                onChange={handleChange}
              />
                 <br></br>
              {formErrors.NombreCompletoContacto && (
                <span className="error-creaedsocio">{formErrors.NombreCompletoContacto}</span>
              )}
            </div>
            <div className="creaedsocio-group">
              <input
                type="text"
                id="Puesto"
                name="Puesto"
                placeholder="Puesto del contacto"
                className="creaedsocio-input"
                value={formData.Puesto}
                onChange={handleChange}
              />
                 <br></br>
              {formErrors.Puesto && (
                <span className="error-creaedsocio">{formErrors.Puesto}</span>
              )}
            </div>
            <div className="creaedsocio-group">
              <input
                type="email"
                id="CorreoElectronicoContacto"
                name="CorreoElectronicoContacto"
                placeholder="Correo Electrónico del contacto"
                className="creaedsocio-input"
                value={formData.CorreoElectronicoContacto}
                onChange={handleChange}
              />
                 <br></br>
              {formErrors.CorreoElectronicoContacto && (
                <span className="error-creaedsocio">{formErrors.CorreoElectronicoContacto}</span>
              )}
            </div>
            <div className="creaedsocio-group">
              <input
                type="tel"
                id="TelefonoContacto"
                name="TelefonoContacto"
                placeholder="Teléfono del Contacto"
                className="creaedsocio-input"
                value={formData.TelefonoContacto}
                onChange={handleChange}
              />
                 <br></br>
              {formErrors.TelefonoContacto && (
                <span className="error-creaedsocio">{formErrors.TelefonoContacto}</span>
              )}
            </div>
          </div>
          {/* Información Otros */}
          {!isCreating && (
            <div className="creaedsocio-section">
              <h3 className="creaedsocio-subt">Información Otros:</h3>
              <div className="creaedsocio-group">
                <select
                  id="Estado"
                  name="Estado"
                  className="creaedsocio-input"
                  value={formData.Estado}
                  onChange={handleChange}
                >
                  <option value="">Todos</option>
                  <option value="1">Activo</option>
                  <option value="0">Inactivo</option>
                </select>
                <br></br>
                {formErrors.Estado && (
                  <span className="error-creaedsocio">{formErrors.Estado}</span>
                )}
              </div>
            </div>
          )}
          {/* Botones */}
          <div className="creaedsocio-buttons">
            <button
              type="button"
              className="creaedsocio-button"
              onClick={handleBackClick}
            >
              <FaChevronLeft />
              Regresar
            </button>
            <button
              type="submit"
              className="creaedsocio-button"
              disabled={!isFormValid}
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CrearActuSocioComunitarios;
