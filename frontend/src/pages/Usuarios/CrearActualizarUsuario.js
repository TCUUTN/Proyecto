// CrearActualizarUsuario.js
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./CrearActualizarUsuario.module.css";

function CrearActualizarUsuario({ usuario, onClose }) {
  const [formData, setFormData] = useState({
    Identificacion: "",
    Nombre: "",
    Apellido1: "",
    Apellido2: "",
    Genero: "",
    CorreoElectronico: "",
    RolUsuario: "",
    Contrasenna: "",
    Estado: "",
    TipoIdentificacion: "",
  });

  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (usuario) {
      setFormData({
        Identificacion: usuario.Identificacion,
        Nombre: usuario.Nombre,
        Apellido1: usuario.Apellido1,
        Apellido2: usuario.Apellido2,
        Genero: usuario.Genero,
        CorreoElectronico: usuario.CorreoElectronico,
        RolUsuario: usuario.RolUsuario,
        Contrasenna: "",
        Estado: usuario.Estado,
        TipoIdentificacion: usuario.TipoIdentificacion,
      });
    } else {
      setFormData({
        Identificacion: "",
        Nombre: "",
        Apellido1: "",
        Apellido2: "",
        Genero: "",
        CorreoElectronico: "",
        RolUsuario: "",
        Contrasenna: "",
        Estado: "",
        TipoIdentificacion: "",
      });
    }
  }, [usuario]);

  useEffect(() => {
    validateForm();
  }, [formData]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.Identificacion)
      newErrors.Identificacion = "Identificación es requerida";
    if (!formData.Nombre) newErrors.Nombre = "Nombre es requerido";
    if (!formData.Apellido1)
      newErrors.Apellido1 = "Primer apellido es requerido";
    if (!formData.Apellido2)
      newErrors.Apellido2 = "Segundo apellido es requerido";
    if (!formData.Genero) newErrors.Genero = "Género es requerido";
    if (!formData.CorreoElectronico)
      newErrors.CorreoElectronico = "Correo electrónico es requerido";
    if (!formData.RolUsuario)
      newErrors.RolUsuario = "Rol de usuario es requerido";
    if (!formData.TipoIdentificacion)
      newErrors.TipoIdentificacion = "Tipo de identificación es requerido";
    if (!formData.Contrasenna) {
      newErrors.Contrasenna = "Contraseña es requerida";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        formData.Contrasenna
      )
    ) {
      newErrors.Contrasenna =
        "Contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial";
    }

    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      console.log("Por favor complete todos los campos correctamente");
      return;
    }

    try {
      const response = await fetch("/usuarios/crearOActualizarUsuario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("Usuario guardado con éxito");
        onClose();
      } else {
        console.log("Error al guardar el usuario");
      }
    } catch (error) {
      console.log("Error al guardar el usuario");
    }
  };

  return ReactDOM.createPortal(
    <div className="modal">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>{usuario ? "Editar Usuario" : "Crear Usuario"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tipo de Identificación:</label>
            <select
              name="TipoIdentificacion"
              value={formData.TipoIdentificacion}
              onChange={handleChange}
            >
              <option value="">Seleccione Tipo</option>
              <option value="Cedula">Cédula</option>
              <option value="Dimex">Dimex</option>
              <option value="Pasaporte">Pasaporte</option>
            </select>
          </div>
          {errors.TipoIdentificacion && (
            <p className="error">{errors.TipoIdentificacion}</p>
          )}

          <div className="form-group">
            <label>Identificación:</label>
            <input
              type="text"
              name="Identificacion"
              value={formData.Identificacion}
              onChange={handleChange}
              disabled={!!usuario}
            />
          </div>
          {errors.Identificacion && (
            <p className="error">{errors.Identificacion}</p>
          )}

          <div className="form-group">
            <label>Nombre:</label>
            <input
              type="text"
              name="Nombre"
              value={formData.Nombre}
              onChange={handleChange}
            />
          </div>
          {errors.Nombre && <p className="error">{errors.Nombre}</p>}

          <div className="form-group">
            <label>Apellido1:</label>
            <input
              type="text"
              name="Apellido1"
              value={formData.Apellido1}
              onChange={handleChange}
            />
          </div>
          {errors.Apellido1 && <p className="error">{errors.Apellido1}</p>}

          <div className="form-group">
            <label>Apellido2:</label>
            <input
              type="text"
              name="Apellido2"
              value={formData.Apellido2}
              onChange={handleChange}
            />
          </div>
          {errors.Apellido2 && <p className="error">{errors.Apellido2}</p>}

          <div className="form-group">
            <label>Género:</label>
            <select
              name="Genero"
              value={formData.Genero}
              onChange={handleChange}
            >
              <option value="">Seleccione Género</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          {errors.Genero && <p className="error">{errors.Genero}</p>}

          <div className="form-group">
            <label>Correo Electrónico:</label>
            <input
              type="email"
              name="CorreoElectronico"
              value={formData.CorreoElectronico}
              onChange={handleChange}
            />
          </div>
          {errors.CorreoElectronico && (
            <p className="error">{errors.CorreoElectronico}</p>
          )}

          <div className="form-group">
            <label>Rol Usuario:</label>
            <select
              name="RolUsuario"
              value={formData.RolUsuario}
              onChange={handleChange}
            >
              <option value="">Seleccione Rol</option>
              <option value="Administrador">Administrador</option>
              <option value="Usuario">Usuario</option>
            </select>
          </div>
          {errors.RolUsuario && <p className="error">{errors.RolUsuario}</p>}

          {!usuario && (
            <div className="form-group">
              <label>Contraseña:</label>
              <input
                type="password"
                name="Contrasenna"
                value={formData.Contrasenna}
                onChange={handleChange}
              />
            </div>
          )}
          {errors.Contrasenna && <p className="error">{errors.Contrasenna}</p>}

          <div className="form-group">
            <label>Estado:</label>
            <select
              name="Estado"
              value={formData.Estado}
              onChange={handleChange}
            >
              <option value="">Seleccione Estado</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
          {errors.Estado && <p className="error">{errors.Estado}</p>}

          <div className="modal-actions">
            <button type="submit">{usuario ? "Actualizar" : "Crear"}</button>
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

export default CrearActualizarUsuario;
