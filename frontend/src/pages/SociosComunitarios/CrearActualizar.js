import React from "react";
import { FaChevronLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import "./SocioCom.css";

function CrearActuSocioComunitarios() {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/SocioComunitarios");
  };

  return (
    <div className="creaedsocio-container">
      <div className="creaedsocio-content">
        <h1 className="creaedsocio-title">
          Aquí va el título de agregar o editar
        </h1>
        <div className="creaedsocio-divider" />
        <form>
          {/* Información de la Institución */}
          <div className="creaedsocio-section">
            <h3 className="creaedsocio-subt">Información de la Institución:</h3>
            <div className="creaedsocio-group">
              <input
                type="text"
                id="nombreInstitucion"
                name="nombreInstitucion"
                placeholder="Nombre Institución"
                className="creaedsocio-input"
              />
            </div>
            <div className="creaedsocio-group">
              <input
                type="email"
                id="correoInstitucion"
                name="correoInstitucion"
                placeholder="Correo Electrónico Institución"
                className="creaedsocio-input"
              />
            </div>
            <div className="creaedsocio-group">
              <input
                type="text"
                id="tipoInstitucion"
                name="tipoInstitucion"
                placeholder="Tipo de institución"
                className="creaedsocio-input"
              />
            </div>
            <div className="creaedsocio-group">
              <input
                type="tel"
                id="telefonoInstitucion"
                name="telefonoInstitucion"
                placeholder="Teléfono"
                className="creaedsocio-input"
              />
            </div>
            <div className="creaedsocio-group">
              <input
                type="text"
                id="direccionExacta"
                name="direccionExacta"
                placeholder="Dirección exacta"
                className="creaedsocio-input"
              />
            </div>
            <div className="creaedsocio-group">
              <input
                type="text"
                id="ubicacionGps"
                name="ubicacionGps"
                placeholder="Ubicación GPS"
                className="creaedsocio-input"
              />
            </div>
          </div>
          {/* Contacto del Socio */}
          <div className="creaedsocio-section">
            <h3 className="creaedsocio-subt">Contacto del Socio:</h3>
            <div className="creaedsocio-group">
              <input
                type="text"
                id="nombreCompleto"
                name="nombreCompleto"
                placeholder="Nombre Completo"
                className="creaedsocio-input"
              />
            </div>
            <div className="creaedsocio-group">
              <input
                type="text"
                id="puesto"
                name="puesto"
                placeholder="Puesto"
                className="creaedsocio-input"
              />
            </div>
            <div className="creaedsocio-group">
              <input
                type="email"
                id="correoPersonal"
                name="correoPersonal"
                placeholder="Correo Electrónico Personal"
                className="creaedsocio-input"
              />
            </div>
            <div className="creaedsocio-group">
              <input
                type="tel"
                id="telefonoPersonal"
                name="telefonoPersonal"
                placeholder="Teléfono Personal"
                className="creaedsocio-input"
              />
            </div>
          </div>
          {/* Información Otros */}
          <div className="creaedsocio-section">
            <h3 className="creaedsocio-subt">Información Otros:</h3>
            <div className="creaedsocio-group">
              <select id="estado" name="estado" className="creaedsocio-input">
                <option value="">Seleccione Estado</option>
                {/* Opciones adicionales */}
              </select>
            </div>
          </div>
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
            <button type="submit" className="creaedsocio-button">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CrearActuSocioComunitarios;
