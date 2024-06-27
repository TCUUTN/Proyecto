import React from "react";
import { FaChevronLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import "./SocioCom.css";

function CrearActuSocioComunitarios() {
  const navigate = useNavigate();

  //Rutas
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
          {/* Nombre Institución */}
          <div className="creaedsocio-group">
            <input
              type="text"
              id="nombreInstitucion"
              name="nombreInstitucion"
              placeholder="Nombre Institución"
              className="creaedsocio-input"
            />
          </div>
          {/* Correo Electrónico Institución */}
          <div className="creaedsocio-group">
            <input
              type="email"
              id="correoInstitucion"
              name="correoInstitucion"
              placeholder="Correo Electrónico Institución"
              className="creaedsocio-input"
            />
          </div>
          {/* Tipo de institución */}
          <div className="creaedsocio-group">
            <input
              id="tipoInstitucion"
              name="tipoInstitucion"
              placeholder="Tipo de institución"
              className="creaedsocio-input"
            />
          </div>
          {/* Contacto del Socio */}
          <h3 className="creaedsocio-subt">Contacto del Socio:</h3>
          {/* Nombre Completo */}
          <div className="creaedsocio-group">
            <input
              type="text"
              id="nombreCompleto"
              name="nombreCompleto"
              placeholder="Nombre Completo"
              className="creaedsocio-input"
            />
          </div>
          {/* Puesto */}
          <div className="creaedsocio-group">
            <input
              type="text"
              id="puesto"
              name="puesto"
              placeholder="Puesto"
              className="creaedsocio-input"
            />
          </div>
          {/* Correo Electrónico Personal */}
          <div className="creaedsocio-group">
            <input
              type="email"
              id="correoPersonal"
              name="correoPersonal"
              placeholder="Correo Electrónico Personal"
              className="creaedsocio-input"
            />
          </div>
          {/* Teléfono */}
          <div className="creaedsocio-group">
            <input
              type="tel"
              id="telefono"
              name="telefono"
              placeholder="Teléfono"
              className="creaedsocio-input"
            />
          </div>
          {/* Botones */}
          <div className="creaedsocio-buttons">
            <button type="button" className="creaedsocio-button" onClick={handleBackClick}>
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
