/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { FaSave } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import "./CrearActualizar.css";
import { FaChevronLeft } from "react-icons/fa6";

// Componente principal para crear o actualizar la creación de grupos
function CrearActuCreacionGrupos() {
  // Definición de estados
  const [codigosMateria, setCodigosMateria] = useState([]); // Estado para almacenar los códigos de materia
  const [isFormValid, setIsFormValid] = useState(false); // Estado para validar el formulario
  const [sedes, setSedes] = useState([
    "Central",
    "Atenas",
    "Guanacaste",
    "Pacífico",
    "San Carlos",
    "C. F. P. T. E.",
  ]); // Estado para almacenar las sedes
  const [usuarios, setUsuarios] = useState([]); // Estado para almacenar los usuarios filtrados
  const [allUsuarios, setAllUsuarios] = useState([]); // Estado para almacenar todos los usuarios
  const [annos, setAnnos] = useState([]); // Estado para almacenar los años
  const [formValues, setFormValues] = useState({
    CodigoMateria: "",
    NumeroGrupo: "",
    Horario: "",
    Aula: "",
    Sede:
      sessionStorage.getItem("Sede") === "Todas"
        ? ""
        : sessionStorage.getItem("Sede") || "", // Ajuste aquí
    Cuatrimestre: "",
    Anno: "",
    Estado: "1", // Estado predeterminado "Activo"
    Identificacion: "",
  }); // Estado para almacenar los valores del formulario
  const [errors, setErrors] = useState({}); // Estado para almacenar los errores del formulario
  const navigate = useNavigate(); // Hook para la navegación
  const { GrupoId } = useParams(); // Hook para obtener los parámetros de la URL
  const currentYear = new Date().getFullYear(); // Obtención del año actual
  const cuatrimestres = [1, 2, 3]; // Array de cuatrimestres
  // Efecto para cargar los códigos de materia, usuarios y datos del grupo (si existe)
  useEffect(() => {
    fetchCodigosMateria();
    fetchUsuarios();
    if (GrupoId) {
      fetchGrupo(GrupoId);
    } else {
      setAnnos([currentYear, currentYear + 1]);
    }
  }, [GrupoId]);
  // Efecto para cargar los datos del grupo si existe en el localStorage
  useEffect(() => {
    const GrupoIdUpdate = localStorage.getItem("GrupoIdUpdate");
    if (GrupoIdUpdate) {
      fetchGrupo(GrupoIdUpdate);
    }
  }, []);
  // Efecto para filtrar usuarios por sede cada vez que cambia la sede
  useEffect(() => {
    filterUsuariosBySede(formValues.Sede);
  }, [formValues.Sede]);
  // Efecto para validar el formulario cada vez que cambian los valores del formulario
  useEffect(() => {
    validateForm();
  }, [formValues]);
  // Función para obtener los códigos de materia de la API
  const fetchCodigosMateria = async () => {
    try {
      const response = await fetch("/grupos/tipos");
      const data = await response.json();
      setCodigosMateria(data);
    } catch (error) {
      toast.error("Error obteniendo codigos de proyecto:", error);
    }
  };
  // Función para obtener los usuarios de la API
  const fetchUsuarios = async () => {
    try {
      const response = await fetch("/usuarios/RolesAcademicos");
      const data = await response.json();
      setUsuarios(data);
      setAllUsuarios(data); // Almacenar todos los usuarios en allUsuarios
      filterUsuariosBySede(formValues.Sede, data);
    } catch (error) {
      toast.error("Error obteniendo los datos de usuarios:", error);
    }
  };
  // Función para obtener los datos de un grupo específico de la API
  const fetchGrupo = async (GrupoId) => {
    try {
      const response = await fetch(`/grupos/${GrupoId}`);
      const data = await response.json();
      setFormValues(data);

      if (data.Anno) {
        const fetchedYear = data.Anno;
        if (fetchedYear === currentYear) {
          setAnnos([fetchedYear, fetchedYear + 1]);
        } else {
          setAnnos([fetchedYear, currentYear, currentYear + 1]);
        }
      }
    } catch (error) {
      toast.error("Error obteniendo los datos de grupo:", error);
    }
  };
  // Función para filtrar usuarios por sede
  const filterUsuariosBySede = (sede, usuariosData = allUsuarios) => {
    sede = String(sede); // Convertir sede a cadena de texto
    if (sede === "") {
      setUsuarios(usuariosData); // Mostrar todos los usuarios si la sede es una cadena vacía
    } else {
      const filteredUsuarios = usuariosData.filter(
        (usuario) => usuario.Sede === sede || usuario.Sede === "Todas"
      );
      setUsuarios(filteredUsuarios);
    }
  };
  // Función para manejar los cambios en los inputs del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "NumeroGrupo" && isNaN(value)) return; // Asegurarse de que NumeroGrupo sea un número

    setFormValues({
      ...formValues,
      [name]: value,
    });

    if (name === "Sede") {
      filterUsuariosBySede(value);
    }
  };
  // Función para validar el formulario
  const validateForm = () => {
    const requiredFields = {
      CodigoMateria: "Proyecto",
      NumeroGrupo: "Número de Grupo",
      Horario: "Horario",
      Aula: "Aula",
      Cuatrimestre: "Cuatrimestre",
      Anno: "Año",
      Identificacion: "Académico",
      Sede: "Sede",
      Estado: "Estado",
    };
    let validationErrors = {};

    Object.keys(requiredFields).forEach((field) => {
      if (!formValues[field]) {
        validationErrors[
          field
        ] = `Por favor, complete el campo: ${requiredFields[field]}`;
      }
    });

    if (!sessionStorage.getItem("Sede") && !formValues.Sede) {
      validationErrors["Sede"] = "Por favor, complete el campo: Sede";
    }
    if (!localStorage.getItem("GrupoIdUpdate") && !formValues.Estado) {
      validationErrors["Estado"] = "Por favor, complete el campo: Estado";
    }

    setErrors(validationErrors);
    setIsFormValid(Object.keys(validationErrors).length === 0);
  };
  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      return;
    }

    try {
      const GrupoIdUpdate = localStorage.getItem("GrupoIdUpdate");
      const payload = { ...formValues };
      if (GrupoIdUpdate) {
        payload.GrupoId = GrupoIdUpdate;
      }
      const response = await fetch("/grupos/crearOActualizarGrupo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Error en la creación o actualización del grupo");
      }

      toast.success("Grupo guardado con éxito!");
      localStorage.setItem("GrupoGuardado", "true");
      localStorage.removeItem("GrupoIdUpdate");
      navigate("/Grupos");
    } catch (error) {
      toast.error("Error al guardar el grupo", error);
    }
  };

  const handleRegresar = () => {
    localStorage.removeItem("GrupoIdUpdate");
    navigate("/Grupos");
  };

  const sedeSession = sessionStorage.getItem("Sede");

  const romanNumerals = ["I", "II", "III"]; // Array de números romanos para los cuatrimestres

  // Render del componente
  return (
    <div className="creagrup-container">
      <ToastContainer position="bottom-right" />
      <h2 className="creagrup-tit">
        {GrupoId ? "Editar Grupo" : "Agregar Grupo"}
      </h2>
      <div className="creagrup-diver" />
      <form className="creagrup-formcontainer" onSubmit={handleSubmit}>
        <div className="creagrup-formrow">
          {/* Seleccionar Proyectos */}
          <select
            name="CodigoMateria"
            value={formValues.CodigoMateria}
            onChange={handleInputChange}
            className="creagrup-select creagrup-select-large"
          >
            <option value="">Seleccionar Proyectos</option>
            {codigosMateria.map((materia) => (
              <option key={materia.CodigoMateria} value={materia.CodigoMateria}>
                {materia.NombreProyecto}
              </option>
            ))}
          </select>
          {errors.CodigoMateria && (
            <div className="creagrup-error">{errors.CodigoMateria}</div>
          )}
        </div>
        <div className="creagrup-formrow">
          {/* Numero de grupo */}
          <input
            type="text"
            name="NumeroGrupo"
            value={formValues.NumeroGrupo}
            onChange={handleInputChange}
            placeholder="Número de Grupo"
            className="creagrup-inputfield"
          />
          {errors.NumeroGrupo && (
            <div className="creagrup-error">{errors.NumeroGrupo}</div>
          )}
        </div>
        <div className="creagrup-formrow">
          {/* Aula */}
          <input
            type="text"
            name="Aula"
            value={formValues.Aula}
            onChange={handleInputChange}
            placeholder="Aula"
            className="creagrup-inputfield"
          />
          {errors.Aula && <div className="creagrup-error">{errors.Aula}</div>}
        </div>
        <div className="creagrup-formrow ">
          {/* Horario */}
          <input
            type="text"
            name="Horario"
            value={formValues.Horario}
            onChange={handleInputChange}
            placeholder="Horario"
            className="creagrup-inputfield"
          />
          {errors.Horario && (
            <div className="creagrup-error">{errors.Horario}</div>
          )}
        </div>
        <div className="creagrup-formrow">
          {/* Cuatrimestre */}
          <select
            name="Cuatrimestre"
            value={formValues.Cuatrimestre}
            onChange={handleInputChange}
            className="creagrup-select"
          >
            <option value="">Cuatrimestre</option>
            {cuatrimestres.map((cuatrimestre) => (
              <option key={cuatrimestre} value={cuatrimestre}>
                {romanNumerals[cuatrimestre - 1]}
              </option>
            ))}
          </select>
          {errors.Cuatrimestre && (
            <div className="creagrup-error">{errors.Cuatrimestre}</div>
          )}
        </div>
        <div className="creagrup-formrow">
          {/* Año */}
          <select
            name="Anno"
            value={formValues.Anno}
            onChange={handleInputChange}
            className="creagrup-select"
          >
            <option value="">Años</option>
            {annos.map((anno) => (
              <option key={anno} value={anno}>
                {anno}
              </option>
            ))}
          </select>
          {errors.Anno && <div className="creagrup-error">{errors.Anno}</div>}
        </div>
        <div className="creagrup-formrow">
          {/* Sede */}
          {sedeSession === "Todas" && (
            <select
              name="Sede"
              value={formValues.Sede}
              onChange={handleInputChange}
              className="creagrup-select"
            >
              <option value="">Sedes</option>
              {sedes.map((sede) => (
                <option key={sede} value={sede}>
                  {sede}
                </option>
              ))}
            </select>
          )}
          {errors.Sede && <div className="creagrup-error">{errors.Sede}</div>}
        </div>
        <div className="creagrup-formrow">
          {/* Seleccionar Académico */}
          <select
            name="Identificacion"
            value={formValues.Identificacion}
            onChange={handleInputChange}
            className="creagrup-select creagrup-select-large"
          >
            <option value="">Seleccionar Académico</option>
            {usuarios.map((usuario) => (
              <option
                key={usuario.Identificacion}
                value={usuario.Identificacion}
              >
                {usuario.Nombre.charAt(0).toUpperCase() +
                  usuario.Nombre.slice(1).toLowerCase()}{" "}
                {usuario.Apellido1.charAt(0).toUpperCase() +
                  usuario.Apellido1.slice(1).toLowerCase()}{" "}
                {usuario.Apellido2.charAt(0).toUpperCase() +
                  usuario.Apellido2.slice(1).toLowerCase()}{" "}
                {usuario.Sede === "Todas" && "(Multisede)"}
              </option>
            ))}
          </select>
          {errors.Identificacion && (
            <div className="creagrup-error">{errors.Identificacion}</div>
          )}
        </div>
        <div className="creagrup-formrow">
          {/* Estado */}
          {localStorage.getItem("GrupoIdUpdate") ? (
            <select
              name="Estado"
              value={formValues.Estado}
              onChange={handleInputChange}
              className="creagrup-select"
            >
              <option value="">Estados</option>
              <option value="1">Activo</option>
              <option value="0">Inactivo</option>
            </select>
          ) : (
            <input type="hidden" name="Estado" value="1" />
          )}
          {errors.Estado && (
            <div className="creagrup-error">{errors.Estado}</div>
          )}
        </div>
        <div className="creagrup-buttonrow">
          <button
            type="button"
            className="creagrup-button"
            onClick={handleRegresar}
          >
            <FaChevronLeft />
            Regresar
          </button>
          &nbsp;&nbsp;&nbsp;
          <button
            type="submit"
            className="creagrup-button"
            disabled={!isFormValid}
          >
            {GrupoId ? "Actualizar" : "Guardar"} <FaSave />
          </button>
        </div>
      </form>
    </div>
  );
}

export default CrearActuCreacionGrupos;
