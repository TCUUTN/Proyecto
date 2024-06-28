import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CrearActualizar.css";
import { FaChevronLeft } from "react-icons/fa6";

function CrearActuCreacionGrupos() {
  const [codigosMateria, setCodigosMateria] = useState([]);
  const [isFormValid, setIsFormValid] = useState(false);

  const [sedes, setSedes] = useState([
    "Central",
    "Atenas",
    "Guanacaste",
    "Pacífico",
    "San Carlos",
    "C. F. P. T. E.",
  ]);
  const [usuarios, setUsuarios] = useState([]);
  const [allUsuarios, setAllUsuarios] = useState([]); // Nuevo estado para almacenar todos los usuarios
  const [annos, setAnnos] = useState([]);
  const [formValues, setFormValues] = useState({
    CodigoMateria: "",
    NumeroGrupo: "",
    Horario: "",
    Aula: "",
    Sede: sessionStorage.getItem("Sede") || "", // Default value from sessionStorage
    Cuatrimestre: "",
    Anno: "",
    Estado: "1", // Default to "Activo"
    Identificacion: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { GrupoId } = useParams();
  const currentYear = new Date().getFullYear();
  const cuatrimestres = [1, 2, 3];

  useEffect(() => {
    fetchCodigosMateria();
    fetchUsuarios();
    if (GrupoId) {
      fetchGrupo(GrupoId);
    } else {
      setAnnos([currentYear, currentYear + 1]);
    }
  }, [GrupoId]);

  useEffect(() => {
    const GrupoIdUpdate = localStorage.getItem("GrupoIdUpdate");
    if (GrupoIdUpdate) {
      fetchGrupo(GrupoIdUpdate);
    }
  }, []);

  useEffect(() => {
    filterUsuariosBySede(formValues.Sede);
  }, [formValues.Sede]);

  const fetchCodigosMateria = async () => {
    try {
      const response = await fetch("/grupos/tipos");
      const data = await response.json();
      setCodigosMateria(data);
    } catch (error) {
      console.error("Error fetching codigos de materia:", error);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const response = await fetch("/usuarios/RolesAcademicos");
      const data = await response.json();
      setUsuarios(data);
      setAllUsuarios(data); // Almacenar todos los usuarios en allUsuarios
      filterUsuariosBySede(formValues.Sede, data);
    } catch (error) {
      console.error("Error fetching usuarios:", error);
    }
  };

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
      console.error("Error fetching grupo:", error);
    }
  };

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "NumeroGrupo" && isNaN(value)) return; // Ensure NumeroGrupo is a number

    setFormValues({
      ...formValues,
      [name]: value,
    });

    if (name === "Sede") {
      filterUsuariosBySede(value);
    }
    validateForm();
  };

  const validateForm = () => {
    const requiredFields = [
      "CodigoMateria",
      "NumeroGrupo",
      "Horario",
      "Aula",
      "Cuatrimestre",
      "Anno",
      "Identificacion",
    ];
    let validationErrors = {};

    requiredFields.forEach((field) => {
      if (!formValues[field]) {
        validationErrors[field] = `Por favor, complete el campo: ${field}`;
      }
    });

    if (!sessionStorage.getItem("Sede")) {
      if (!formValues.Sede) {
        validationErrors["Sede"] = "Por favor, complete el campo: Sede";
      }
    }

    if (!localStorage.getItem("GrupoIdUpdate")) {
      if (!formValues.Estado) {
        validationErrors["Estado"] = "Por favor, complete el campo: Estado";
      }
    }

    setErrors(validationErrors);
    setIsFormValid(Object.keys(validationErrors).length === 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const GrupoIdUpdate = localStorage.getItem("GrupoIdUpdate");
      const payload = { ...formValues };
      if (GrupoIdUpdate) {
        payload.GrupoId = GrupoIdUpdate;
      }
      console.log(JSON.stringify(payload));
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
      navigate("/MantGrupos");
    } catch (error) {
      toast.error("Error al guardar el grupo");
      console.error("Error:", error);
    }
  };

  const handleRegresar = () => {
    localStorage.removeItem("GrupoIdUpdate");
    navigate("/MantGrupos");
  };

  const sedeSession = sessionStorage.getItem("Sede");

  const romanNumerals = ["I", "II", "III"];

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
        </div>
        <div className="creagrup-formrow">
          {/* Numero de grupo */}
          <input
            type="text"
            name="NumeroGrupo"
            value={formValues.NumeroGrupo}
            onChange={handleInputChange}
            placeholder="Número de Grupos"
            className="creagrup-inputfield"
          />
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
                  usuario.Nombre.slice(1)}{" "}
                {usuario.Apellido1.charAt(0).toUpperCase() +
                  usuario.Apellido1.slice(1)}{" "}
                {usuario.Apellido2.charAt(0).toUpperCase() +
                  usuario.Apellido2.slice(1)}{" "}
                {usuario.Sede === "Todas" && "(Multisede)"}
              </option>
            ))}
          </select>
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
        </div>
        <div className="creagrup-formrow">
          {/* Año */}
          <select
            name="Anno"
            value={formValues.Anno}
            onChange={handleInputChange}
            className="creagrup-select"
          >
            <option value="">Año</option>
            {annos.map((anno) => (
              <option key={anno} value={anno}>
                {anno}
              </option>
            ))}
          </select>
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
        </div>
        {/*  */}
        <div className="">
          {/* Mensajes de error al final */}
          {Object.keys(errors).length > 0 && (
            <div className="creagrup-errors">
              <ul className="creagrup-error-list">
                {Object.values(errors).map((error, index) => (
                  <li key={index} className="creagrup-error">
                    {error}
                  </li>
                ))}
              </ul>
            </div>
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
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}

export default CrearActuCreacionGrupos;
