import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styles from "./CrearActualizarUsuario.module.css";

const CrearActualizarUsuario = () => {
  const location = useLocation();
  const usuario = location.state?.usuario;
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

  const navigate = useNavigate();
  const { id } = useParams();
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
    if (!formData.Contrasenna && !usuario) {
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
        navigate(-1); // Regresar a la página anterior
      } else {
        console.log("Error al guardar el usuario");
      }
    } catch (error) {
      console.log("Error al guardar el usuario");
    }
  };

  return (
    <div className={styles["creaediUsu-container"]}>
      <h2 className={styles["creaediUsu-titulo"]}>
        {usuario ? "Editar Usuario" : "Crear Usuario"}
      </h2>
      <div className={styles["creaediUsu-line"]}></div>{" "}
      {/* Línea bajo el título */}
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
                onChange={() => handleRoleChange("Administrador")}
              />
              Administrador
            </label>
            <label>
              <input
                type="checkbox"
                name="roles"
                value="Estudiante"
                onChange={() => handleRoleChange("Estudiante")}
              />
              Estudiante
            </label>
            <label>
              <input
                type="checkbox"
                name="roles"
                value="Académico"
                onChange={() => handleRoleChange("Académico")}
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
            <option value="Todas">Todas.</option>
          </select>
        </div>
        {/* Div contiene genero, estado y carrera  */}
        {usuario && (
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
                  <option value="Otro">Otro</option>
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
                  <option value="">Estados</option>
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
            </div>
            {/* Carrera */}
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
          </div>
        )}
        {/* Botones */}
        <div className={styles["creaediUsu-formButtons"]}>
          <button
            type="button"
            className={styles["creaediUsu-btnRegresar"]}
            onClick={() => navigate("/MantUser")}
          >
            Regresar
          </button>
          <button
            type="submit"
            className={styles["creaediUsu-btnGuardar"]}
            disabled={!isFormValid}
          >
            {id ? "Actualizar" : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearActualizarUsuario;
