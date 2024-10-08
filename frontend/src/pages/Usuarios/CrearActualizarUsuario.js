/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { FaSave } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa6";
import "react-toastify/dist/ReactToastify.css";
import "./CrearActuUsuario.modulo.css";
/**
 * CrearActualizarUsuario
 * 
 * Componente funcional para crear o actualizar un usuario. Este componente maneja el formulario
 * para ingresar los datos del usuario y realiza las validaciones necesarias.
 */
const CrearActualizarUsuario = () => {
  const navigate = useNavigate();
  // Estado inicial del formulario
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
    GrupoId: "",
  });
// Estados para manejar errores y validaciones del formulario
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [grupos, setGrupos] = useState([]);
  const [grupoEstudiante, setGrupoEstudiante] = useState(null);
  const identificacionUsuario = sessionStorage.getItem("IdentificacionUsuario");
 // Efecto para obtener datos del usuario si ya existe
  useEffect(() => {
    const fetchUserData = async () => {
      if (identificacionUsuario) {
        try {
          // Obtener grupo del estudiante
          const grupoResponse = await fetch(`/grupos/GrupoEstudianteUsuario/${identificacionUsuario}`);
          const grupoData = await grupoResponse.json();
          setGrupoEstudiante(grupoData);
            // Obtener datos del usuario
          const response = await fetch(`/usuarios/${identificacionUsuario}`);
          const data = await response.json();
          // Setear los datos del formulario con los datos obtenidos
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
            GrupoId: grupoData.GrupoId,
          });
        } catch (error) {
          toast.error("Error fetching user data:", error);
        }
      } else {
         // Si no hay identificación de usuario, limpiar el formulario
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
 // Efecto para validar el formulario cada vez que formData cambie
  useEffect(() => {
    validateForm();
  }, [formData]);
// Efecto para obtener los grupos activos según la sede y rol de estudiante
  useEffect(() => {
    const fetchGrupos = async () => {
      if (formData.sede && formData.roles.includes(3)) {
        try {
          const response = await fetch(
            `/grupos/GruposActivos/${formData.sede}`
          );
          if (!response.ok) {
            throw new Error(`Error fetching groups: ${response.statusText}`);
          }
          const data = await response.json();
          const gruposData = data.length ? data : [{
            GrupoId: "",
            Grupos_TipoGrupo: {
              NombreProyecto: `La Sede de ${formData.sede} no contiene grupos activos en este momento`,
            },
            Cuatrimestre: "",
            NumeroGrupo: "",
            Anno: "",
          }];
          setGrupos(gruposData);
        } catch (error) {
          toast.error(`La Sede de ${formData.sede} no contiene grupos activos en este momento`);
          
        }
      } else {
        setGrupos([]);
      }
    };
    fetchGrupos();
  }, [formData.sede, formData.roles, grupoEstudiante]);
 // Validar el formulario y setear errores si los hay
  const validateForm = () => {
    const newErrors = {};

    if (!formData.identificacion) {
      newErrors.identificacion = "Identificación es requerida";
    } else if (formData.identificacion.length < 3) {
      newErrors.identificacion =
        "La identificación debe tener al menos 3 caracteres";
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
    if (formData.roles.includes(3)) {
      if (!formData.carrera) {
        newErrors.carrera = "Carrera es requerida para el rol de Estudiante";
      }
      if (!formData.GrupoId) {
        newErrors.GrupoId = "Grupo es requerido para el rol de Estudiante";
      }
    }
    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  };
 // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  // Manejar cambios en los roles seleccionados
  const handleRoleChange = (role) => {
    const roles = formData.roles.includes(role)
      ? formData.roles.filter((r) => r !== role)
      : [...formData.roles, role];
    setFormData((prevFormData) => ({
      ...prevFormData,
      roles,
      carrera: roles.includes(3) ? prevFormData.carrera : "",
      grupo: roles.includes(3) ? prevFormData.grupo : "",
    }));
  };
 // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      toast.error("Por favor complete todos los campos correctamente");
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
      Estado: identificacionUsuario ? formData.estado : 1,
      Sede: formData.sede,
      Usuarios_Roles: mappedRoles.map((rolId) => ({
        Identificacion: formData.identificacion,
        RolId: rolId,
        UniversalUniqueIdentifier: "UUID",
        LastUpdate: new Date().toISOString(),
        LastUser: "-",
      })),
      ...(formData.roles.includes(3) && { GrupoId: formData.GrupoId }),
    };

    try {
      const response = await fetch("/usuarios/crearOActualizarUsuario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Usuario guardado con éxito");
        sessionStorage.setItem("userSaved", "true");
        sessionStorage.removeItem("IdentificacionUsuario");
        navigate(-1);
      } else {
        const errorData = await response.json();
        toast.error(`${errorData.error}`);
      }
    } catch (error) {
      toast.error("Error al guardar el usuario");
    }
  };

  const handleRegresar = () => {
    sessionStorage.removeItem("IdentificacionUsuario");
    navigate("/Usuarios");
  };

  return (
    <div className="creaediUsu-container">
      <ToastContainer position="bottom-right" />
      <h2 className="creaediUsu-titulo">
        {identificacionUsuario ? "Editar Usuario" : "Crear Usuario"}
      </h2>
      <div className="creaediUsu-line"></div>
      <form onSubmit={handleSubmit} className="creaediUsu-formUserEdit">
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
            <div
              className={`${"creaediUsu-error"} ${
                errors.identificacion && "active"
              }`}
            >
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
            <div
              className={`${"creaediUsu-error"} ${errors.nombre && "active"}`}
            >
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
            <div
              className={`${"creaediUsu-error"} ${
                errors.primerApellido && "active"
              }`}
            >
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
            <div
              className={`${"creaediUsu-error"} ${
                errors.primerApellido && "active"
              }`}
            >
              {errors.primerApellido}
            </div>
          )}
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
            <div
              className={`${"creaediUsu-error"} ${errors.correo && "active"}`}
            >
              {errors.correo}
            </div>
          )}
        </div>
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
            <div className={`${"creaediUsu-error"} ${errors.sede && "active"}`}>
              {errors.sede}
            </div>
          )}
        </div>

        {formData.roles.includes(3) && (
          <>
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
                <div
                  className={`${"creaediUsu-error"} ${
                    errors.carrera && "active"
                  }`}
                >
                  {errors.carrera}
                </div>
              )}
            </div>

            <div className="creaediUsu-formGroup">
              <select
                id="GrupoId"
                name="GrupoId"
                value={formData.GrupoId}
                onChange={handleChange}
                className="creaediUsu-select"
              >
                <option value="">Selecciona un grupo</option>
                {grupos.map((grupo) => (
                  <option key={grupo.GrupoId} value={grupo.GrupoId}>
                    {grupo.GrupoId
                      ? `${grupo.Grupos_TipoGrupo.NombreProyecto} - Cuatrimestre: ${grupo.Cuatrimestre} - Grupo# ${grupo.NumeroGrupo} - Año: ${grupo.Anno}`
                      : grupo.Grupos_TipoGrupo.NombreProyecto}
                  </option>
                ))}
              </select>
              {errors.GrupoId && (
                <div
                  className={`${"creaediUsu-error"} ${
                    errors.grupo && "active"
                  }`}
                >
                  {errors.grupo}
                </div>
              )}
            </div>
          </>
        )}

        {/* Div contiene genero, estado y carrera */}
        {identificacionUsuario && (
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
                <option value="Prefiero no Especificar">
                  Prefiero no Especificar
                </option>
              </select>
              {errors.genero && (
                <div
                  className={`${"creaediUsu-error"} ${
                    errors.genero && "active"
                  }`}
                >
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
                <div
                  className={`${"creaediUsu-error"} ${
                    errors.estado && "active"
                  }`}
                >
                  {errors.estado}
                </div>
              )}
            </div>
          </div>
        )}

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
            onClick={handleSubmit}
          >
            {identificacionUsuario ? "Actualizar" : "Guardar"} <FaSave />
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearActualizarUsuario;
