import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import styles from "./CrearActualizarUsuario.module.css";

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
    <div className={styles["creaediUsu-container"]}>
      <ToastContainer position="bottom-right" />
      <h2 className={styles["creaediUsu-titulo"]}>
        {identificacionUsuario ? "Editar Usuario" : "Crear Usuario"}
      </h2>
      <div className={styles["creaediUsu-line"]}></div> {/* Línea bajo el título */}
      <form
        onSubmit={handleSubmit}
        className={styles["creaediUsu-formUserEdit"]}
      >
        {/* Identificacion */}
        <div className={styles["creaediUsu-formGroup"]}>
          <input
            type="text"
            id="identificacion"
            name="identificacion"
            value={formData.identificacion}
            onChange={handleChange}
            className={styles["creaediUsu-input"]}
            placeholder="Identificación"
            disabled={!!identificacionUsuario}
          />
        </div>
        {/* Nombre */}
        <div className={styles["creaediUsu-formGroup"]}>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className={styles["creaediUsu-input"]}
            placeholder="Nombre"
          />
        </div>
        {/* Primer Apellido */}
        <div className={styles["creaediUsu-formGroup"]}>
          <input
            type="text"
            id="primerApellido"
            name="primerApellido"
            value={formData.primerApellido}
            onChange={handleChange}
            className={styles["creaediUsu-input"]}
            placeholder="Primer Apellido"
          />
        </div>
        {/* Segundo Apellido */}
        <div className={styles["creaediUsu-formGroup"]}>
          <input
            type="text"
            id="segundoApellido"
            name="segundoApellido"
            value={formData.segundoApellido}
            onChange={handleChange}
            className={styles["creaediUsu-input"]}
            placeholder="Segundo Apellido"
          />
        </div>
        {/* Roles */}
        <div className={styles["creaediUsu-formGroupRoles"]}>
          <span>Roles:</span>
          <div className={styles["creaediUsu-roles"]}>
            <label>
              <input
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
        <div className={styles["creaediUsu-formGroup"]}>
          <input
            type="email"
            id="correo"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            className={styles["creaediUsu-input"]}
            placeholder="Correo electrónico"
          />
        </div>
        {/* Sedes */}
        <div className={styles["creaediUsu-formGroup"]}>
          <select
            id="sede"
            name="sede"
            value={formData.sede}
            onChange={handleChange}
            className={styles["creaediUsu-select"]}
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
        </div>
        {/* Div contiene genero, estado y carrera */}
        {identificacionUsuario && (
          <div className={styles["creaediUsu-otros"]}>
            <div className={styles["creaediUsu-genero-estado"]}>
              {/* Genero */}
              <div className={styles["creaediUsu-formGroup"]}>
                <select
                  id="genero"
                  name="genero"
                  value={formData.genero}
                  onChange={handleChange}
                  className={styles["creaediUsu-select"]}
                >
                  <option value="">Género</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Prefiero no Especificar">Prefiero no Especificar</option>
                </select>
              </div>
              {/* Estado */}
              <div className={styles["creaediUsu-formGroup"]}>
                <select
                  id="estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  className={styles["creaediUsu-select"]}
                >
                  <option value="1">Activo</option>
                  <option value="0">Inactivo</option>
                </select>
              </div>
            </div>
            {/* Carrera */}
            {formData.roles.includes(3) && (
              <div className={styles["creaediUsu-formGroup"]}>
                <input
                  type="text"
                  id="carrera"
                  name="carrera"
                  value={formData.carrera}
                  onChange={handleChange}
                  className={styles["creaediUsu-input"]}
                  placeholder="Carrera"
                />
              </div>
            )}
          </div>
        )}

        {/* Mensajes de error al final */}
        {Object.keys(errors).length > 0 && (
          <div className={styles["creaediUsu-errors"]}>
            <ul className={styles["creaediUsu-error-list"]}>
              {Object.values(errors).map((error, index) => (
                <li key={index} className={styles["creaediUsu-error"]}>
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* Botones */}
        <div className={styles["creaediUsu-formButtons"]}>
          <button
            type="button"
            className={styles["creaediUsu-btnRegresar"]}
            onClick={handleRegresar}
          >
            Regresar
          </button>
          <button
            type="submit"
            className={styles["creaediUsu-btnGuardar"]}
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
