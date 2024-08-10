/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CrearActualizar.css";
import { FaChevronLeft } from "react-icons/fa6";
import { FaSave } from "react-icons/fa";
// Componente principal para crear o actualizar proyectos
function CrearActuProyectos() {
  const navigate = useNavigate(); // Hook para la navegación
  const [CodigoMateria, setCodigoMateria] = useState(""); // Estado para el código de la materia
  const [NombreProyecto, setNombreProyecto] = useState(""); // Estado para el nombre del proyecto
  const [TipoCurso, setTipoCurso] = useState("todos"); // Estado para el tipo de curso

  // Estado para manejar errores en los campos del formulario
  const [errors, setErrors] = useState({
    CodigoMateria: "",
    NombreProyecto: "",
    TipoCurso: "",
  });
  // Efecto para cargar datos del proyecto si existe en la sesión
  useEffect(() => {
    const codigoProyecto = sessionStorage.getItem("CodigoProyecto");
    if (codigoProyecto) {
      fetch(`grupos/tipos/${codigoProyecto}`)
        .then((response) => response.json())
        .then((data) => {
          const { CodigoMateria, NombreProyecto, TipoCurso } = data;
          setCodigoMateria(CodigoMateria);
          setNombreProyecto(NombreProyecto);
          setTipoCurso(TipoCurso);
        })
        .catch((error) => {
          toast.error("Error obtiendo los proyectos:", error);
        });
    }
  }, []);
  // Efecto para validar el formulario cada vez que cambian los valores de los campos
  useEffect(() => {
    validateForm();
  }, [CodigoMateria, NombreProyecto, TipoCurso]);
  // Función para validar el formulario
  const validateForm = () => {
    const newErrors = {};
    if (!CodigoMateria.trim())
      newErrors.CodigoMateria = "El código de materia es obligatorio.";
    if (!NombreProyecto.trim())
      newErrors.NombreProyecto = "El nombre del proyecto es obligatorio.";
    if (TipoCurso === "todos")
      newErrors.TipoCurso = "Por favor, seleccione un tipo de curso válido.";
    setErrors(newErrors);
  };
  // Función para manejar la navegación de regreso
  const handleRegresar = () => {
    navigate("/Proyectos");
    sessionStorage.removeItem("CodigoProyecto");
  };
  // Función para manejar el guardado del proyecto
  const handleGuardar = () => {
    if (TipoCurso === "todos") {
      toast.error("Por favor, seleccione un tipo de curso válido.");
      return;
    }

    validateForm();
    if (Object.keys(errors).length === 0) {
      const proyectoData = {
        CodigoMateria,
        NombreProyecto,
        TipoCurso,
      };

      fetch("/grupos/crearOActualizarTipoGrupo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(proyectoData),
      })
        .then((response) => response.json())
        .then((data) => {
          sessionStorage.removeItem("CodigoProyecto");
          sessionStorage.setItem("proyectoGuardado", "true");
          navigate("/Proyectos");
        })
        .catch((error) => {
          toast.error("Error al guardar el proyecto.", error);
        });
    } else {
      toast.error("Por favor, complete todos los campos correctamente.");
    }
  };
  // Render del componente
  return (
    <div className="container-projcreaed">
      <ToastContainer position="bottom-right" />
      <h1 className="projcreaed-tit">
        {CodigoMateria ? "Editar Proyecto" : "Agregar Proyecto"}
      </h1>
      <div className="diver-projcreaed" />
      <div className="formgroup-projcreaed">
        <input
          type="text"
          className="imput-projcreaed"
          placeholder="Código de materia"
          value={CodigoMateria}
          onChange={(e) => setCodigoMateria(e.target.value)}
        />
        {errors.CodigoMateria && (
          <span className="error-projcreaed">{errors.CodigoMateria}</span>
        )}
      </div>
      <div className="formgroup-projcreaed">
        <input
          type="text"
          className="imput-projcreaed"
          placeholder="Nombre Proyecto"
          value={NombreProyecto}
          onChange={(e) => setNombreProyecto(e.target.value)}
        />
        {errors.NombreProyecto && (
          <span className="error-projcreaed">{errors.NombreProyecto}</span>
        )}
      </div>
      <div className="formgroup-projcreaed">
        <select
          className="sele-projcreaed"
          value={TipoCurso}
          onChange={(e) => setTipoCurso(e.target.value)}
          placeholder="Tipo de curso"
        >
          <option className="option-projcreaed" value="">
            Tipo de curso
          </option>
          <option value="todos">Todos</option>
          <option value="Presencial">Presencial</option>
          <option value="Virtual">Virtual</option>
          <option value="Hibrido">Híbrido</option>
        </select>
        {errors.TipoCurso && (
          <span className="error-projcreaed">{errors.TipoCurso}</span>
        )}
      </div>
      <div className="buttongroup-projcreaed">
        <button className="button-projcreaed" onClick={handleRegresar}>
          <FaChevronLeft />
          Regresar
        </button>
        &nbsp;&nbsp;&nbsp;
        <button
          className="button-projcreaed"
          onClick={handleGuardar}
          disabled={Object.keys(errors).length > 0}
        >
          {CodigoMateria ? "Actualizar" : "Guardar"} <FaSave />
        </button>
      </div>
    </div>
  );
}

export default CrearActuProyectos;
