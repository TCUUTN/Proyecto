import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { FaChevronLeft } from "react-icons/fa6";
import 'react-toastify/dist/ReactToastify.css';
import "./CrearActuUsuario.modulo.css";


const CrearActualizarUsuario = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identificacion: "",
    nombre: "",
    primerApellido: "",
    segundoApellido: "",
    genero: "",
    carrera: "",
    roles: [],
    sede: "",
    estado: "",
    correo: "",
    contrasena: "",
  });

  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const identificacionUsuario = sessionStorage.getItem("IdentificacionUsuario");

  useEffect(() => {
    const fetchUserData = async () => {
      if (identificacionUsuario) {
        try {
          const response = await fetch(`/usuarios/${identificacionUsuario}`);
          const data = await response.json();
          setFormData({
            identificacion: data.Identificacion,
            nombre: data.Nombre,
            primerApellido: data.Apellido1,
            segundoApellido: data.Apellido2,
            genero: data.Genero,
            correo: data.CorreoElectronico,
            roles: data.Usuarios_Roles.map((role) => role.RolId),
            sede: data.Sede,
            estado: data.Estado === 1 ? 1 : 0,
            carrera:
              data.CarreraEstudiante !== "-" ? data.CarreraEstudiante : "",
            contrasena: "",
          });
        } catch (error) {
          console.log("Error fetching user data:", error);
        }
      } else {
        setFormData({
          identificacion: "",
          nombre: "",
          primerApellido: "",
          segundoApellido: "",
          genero: "",
          carrera: "",
          roles: [],
          sede: "",
          estado: "",
          correo: "",
          contrasena: "",
        });
      }
    };

    fetchUserData();
  }, [identificacionUsuario]);

  useEffect(() => {
    validateForm();
  }, [formData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.identificacion) {
      newErrors.identificacion = "Identificación es requerida";
    } else if (formData.identificacion.length < 3) {
      newErrors.identificacion = "La identificación debe tener al menos 3 caracteres";
    }

    if (!formData.nombre) {
      newErrors.nombre = "Nombre es requerido";
    } else if (formData.nombre.length < 3) {
      newErrors.nombre = "El nombre debe tener al menos 3 caracteres";
    }

    if (!formData.primerApellido) {
      newErrors.primerApellido = "Primer apellido es requerido";
    } else if (formData.primerApellido.length < 3) {
      newErrors.primerApellido =
        "El primer apellido debe tener al menos 3 caracteres";
    }

    if (!formData.segundoApellido) {
      newErrors.segundoApellido = "Segundo apellido es requerido";
    } else if (formData.segundoApellido.length < 3) {
      newErrors.segundoApellido =
        "El segundo apellido debe tener al menos 3 caracteres";
    }

    if (identificacionUsuario) {
      if (!formData.genero) {
        newErrors.genero = "Género es requerido";
      }
      if (!formData.estado) {
        newErrors.estado = "Estado es requerido";
      }
    }

    if (!formData.sede || formData.sede === "") {
      newErrors.sede = "Sede es requerida";
    }

    if (!formData.correo) {
      newErrors.correo = "Correo electrónico es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.correo)) {
      newErrors.correo = "Correo electrónico no tiene un formato válido";
    }

    if (!formData.roles.length) {
      newErrors.roles = "Al menos un rol es requerido";
    }

    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRoleChange = (role) => {
    const roles = formData.roles.includes(role)
      ? formData.roles.filter((r) => r !== role)
      : [...formData.roles, role];
    setFormData({ ...formData, roles });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      console.log("Por favor complete todos los campos correctamente");
      return;
    }

    const mappedRoles = formData.roles.map((role) =>
      role === "Administrador"
        ? 1
        : role === "Académico"
        ? 2
        : role === "Estudiante"
        ? 3
        : role
    );

    const payload = {
      Identificacion: formData.identificacion,
      Nombre: formData.nombre,
      Apellido1: formData.primerApellido,
      Apellido2: formData.segundoApellido,
      CarreraEstudiante: formData.roles.includes(3) ? formData.carrera : "-",
      Genero: formData.genero,
      CorreoElectronico: formData.correo,
      Contrasenna: formData.contrasena,
      Estado: identificacionUsuario ? formData.estado : 1, // Valor predeterminado de 1 si identificacionUsuario no existe
      Sede: formData.sede,
      Usuarios_Roles: mappedRoles.map((rolId) => ({
        Identificacion: formData.identificacion,
        RolId: rolId,
        UniversalUniqueIdentifier: "UUID",
        LastUpdate: new Date().toISOString(),
        LastUser: "-",
      })),
    };

    console.log("Form Data to be submitted:", payload);

    try {
      const response = await fetch("/usuarios/crearOActualizarUsuario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log("Usuario guardado con éxito");
        sessionStorage.setItem("userSaved", "true");
        sessionStorage.removeItem("IdentificacionUsuario");
        navigate(-1); // Regresar a la página anterior
      } else {
        const errorData = await response.json();
        console.log("Error al guardar el usuario", errorData);
        toast.error(`${errorData.error}`);
      }
    } catch (error) {
      console.log("Error al guardar el usuario", error);
      toast.error("Error al guardar el usuario");
    }
  };

  const handleRegresar = () => {
    sessionStorage.removeItem("IdentificacionUsuario");
    navigate("/MantUser");
  };

  return (
    <div className="creaediUsu-container">
      <ToastContainer position="bottom-right" />
      <h2 className="creaediUsu-titulo">
        {identificacionUsuario ? "Editar Usuario" : "Crear Usuario"}
      </h2>
      <div className="creaediUsu-line"></div> {/* Línea bajo el título */}
      <form
        onSubmit={handleSubmit}
        className="creaediUsu-formUserEdit"
      >
        {/* Identificacion */}
        <div className="creaediUsu-formGroup">
          <input
            type="text"
            id="identificacion"
            name="identificacion"
            value={formData.identificacion}
            onChange={handleChange}
            className="creaediUsu-input"
            placeholder="Identificación"
            disabled={!!identificacionUsuario}
          />
          {errors.identificacion && (
        <div className={`${"creaediUsu-error"} ${errors.identificacion && 'active'}`}>
          {errors.identificacion}
        </div>
      )}
        </div>
        {/* Nombre */}
        <div className="creaediUsu-formGroup">
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="creaediUsu-input"
            placeholder="Nombre"
          />
          {errors.nombre && (
        <div className={`${"creaediUsu-error"} ${errors.nombre && 'active'}`}>
          {errors.nombre}
        </div>
      )}
        </div>
        {/* Primer Apellido */}
        <div className="creaediUsu-formGroup">
          <input
            type="text"
            id="primerApellido"
            name="primerApellido"
            value={formData.primerApellido}
            onChange={handleChange}
            className="creaediUsu-input"
            placeholder="Primer Apellido"
          />
          {errors.primerApellido && (
        <div className={`${"creaediUsu-error"} ${errors.primerApellido && 'active'}`}>
          {errors.primerApellido}
        </div>
      )}
        </div>
        {/* Segundo Apellido */}
        <div className="creaediUsu-formGroup">
          <input
            type="text"
            id="segundoApellido"
            name="segundoApellido"
            value={formData.segundoApellido}
            onChange={handleChange}
            className="creaediUsu-input"
            placeholder="Segundo Apellido"
          />
          {errors.primerApellido && (
        <div className={`${"creaediUsu-error"} ${errors.primerApellido && 'active'}`}>
          {errors.primerApellido}
        </div>
      )}
        </div>
        {/* Roles */}
        <div className="creaediUsu-formGroupRoles">
          <span>Roles:</span>
          <div className="creaediUsu-roles">
            <label>
              <input
              className="creaediUsu-check"
                type="checkbox"
                name="roles"
                value="Administrador"
                checked={formData.roles.includes(1)}
                onChange={() => handleRoleChange(1)}
              />
              Administrador
            </label>
            <label>
              <input
                 className="creaediUsu-check"
                type="checkbox"
                name="roles"
                value="Estudiante"
                checked={formData.roles.includes(3)}
                onChange={() => handleRoleChange(3)}
              />
              Estudiante
            </label>
            <label>
              <input
                 className="creaediUsu-check"
                type="checkbox"
                name="roles"
                value="Académico"
                checked={formData.roles.includes(2)}
                onChange={() => handleRoleChange(2)}
              />
              Académico
            </label>
          </div>
        </div>
        {/* Correo */}
        <div className="creaediUsu-formGroup">
          <input
            type="email"
            id="correo"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            className="creaediUsu-input"
            placeholder="Correo electrónico"
          />
               {errors.correo && (
        <div className={`${"creaediUsu-error"} ${errors.correo && 'active'}`}>
          {errors.correo}
        </div>
      )}
        </div>
        {/* Sedes */}
        <div className="creaediUsu-formGroup">
          <select
            id="sede"
            name="sede"
            value={formData.sede}
            onChange={handleChange}
            className="creaediUsu-select"
          >
            <option value="">Sedes</option>
            <option value="Central">Central</option>
            <option value="Atenas">Atenas</option>
            <option value="Guanacaste">Guanacaste</option>
            <option value="Pacífico">Pacífico</option>
            <option value="San Carlos">San Carlos</option>
            <option value="C. F. P. T. E.">C. F. P. T. E.</option>
            <option value="Todas">Todas</option>
          </select>
          {errors.sede && (
        <div className={`${"creaediUsu-error"} ${errors.sede && 'active'}`}>
          {errors.sede}
        </div>
      )}
        </div>
        {/* Div contiene genero, estado y carrera */}
        {identificacionUsuario && (
          <div className="creaediUsu-otros">
            <div className="creaediUsu-genero-estado">
              {/* Genero */}
              <div className="creaediUsu-formGroup">
                <select
                  id="genero"
                  name="genero"
                  value={formData.genero}
                  onChange={handleChange}
                  className="creaediUsu-select"
                >
                  <option value="">Género</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Prefiero no Especificar">Prefiero no Especificar</option>
                </select>
                {errors.genero && (
              <div className={`${"creaediUsu-error"} ${errors.genero && 'active'}`}>
                {errors.genero}
              </div>
            )}
              </div>
              {/* Estado */}
              <div className="creaediUsu-formGroup">
                <select
                  id="estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  className="creaediUsu-select"
                >
                  <option value="1">Activo</option>
                  <option value="0">Inactivo</option>
                </select>

                {errors.estado && (
              <div className={`${"creaediUsu-error"} ${errors.estado && 'active'}`}>
                {errors.estado}
              </div>
            )}
              </div>
            </div>
            {/* Carrera */}
            {formData.roles.includes(3) && (
              <div className="creaediUsu-formGroup">
                <input
                  type="text"
                  id="carrera"
                  name="carrera"
                  value={formData.carrera}
                  onChange={handleChange}
                  className="creaediUsu-input"
                  placeholder="Carrera"
                />
                {errors.carrera && (
              <div className={`${"creaediUsu-error"} ${errors.carrera && 'active'}`}>
                {errors.carrera}
              </div>
            )}
              </div>
            )}
          </div>
        )}

       
        {/* Botones */}
        <div className="creaediUsu-formButtons">
          <button
            type="button"
            className="creaediUsu-btnRegresar"
            onClick={handleRegresar}
          >
              <FaChevronLeft />
            Regresar
          </button>
          <button
            type="submit"
            className="creaediUsu-btnGuardar"
            disabled={!isFormValid}
          >
            {identificacionUsuario ? "Actualizar" : "Guardar"}
          </button>
        </div>
        
      </form>
    </div>
  );
};

export default CrearActualizarUsuario;
