import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CrearActualizar.css";
import { FaChevronLeft } from "react-icons/fa6";
import { FaSave } from "react-icons/fa";

function CrearActuProyectos() {
  const navigate = useNavigate();
  const [CodigoMateria, setCodigoMateria] = useState("");
  const [NombreProyecto, setNombreProyecto] = useState("");
  const [TipoCurso, setTipoCurso] = useState("todos");

  const [errors, setErrors] = useState({
    CodigoMateria: '',
    NombreProyecto: '',
    TipoCurso: ''
  });

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
          console.error("Error fetching project data:", error);
        });
    }
  }, []);

  useEffect(() => {
    validateForm();
  }, [CodigoMateria, NombreProyecto, TipoCurso]);

  const validateForm = () => {
    const newErrors = {};
    if (!CodigoMateria.trim()) newErrors.CodigoMateria = "El código de materia es obligatorio.";
    if (!NombreProyecto.trim()) newErrors.NombreProyecto = "El nombre del proyecto es obligatorio.";
    if (TipoCurso === "todos") newErrors.TipoCurso = "Por favor, seleccione un tipo de curso válido.";
    setErrors(newErrors);
  };

  const handleRegresar = () => {
    navigate("/MantMaterias");
    sessionStorage.removeItem("CodigoProyecto");
  }

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
          navigate("/MantMaterias");
        })
        .catch((error) => {
          console.error("Error saving project data:", error);
          toast.error("Error al guardar el proyecto.");
        });
    } else {
      toast.error("Por favor, complete todos los campos correctamente.");
    }
  };

  return (
    <div className="container-projcreaed">
      <ToastContainer position="bottom-right" />
      <h1 className="projcreaed-tit">{CodigoMateria ? "Editar Proyecto" : "Agregar Proyecto"}</h1>
      <div className="diver-projcreaed" />
      <div className="formgroup-projcreaed">
        <input
          type="text"
          className="imput-projcreaed"
          placeholder="Código de materia"
          value={CodigoMateria}
          onChange={(e) => setCodigoMateria(e.target.value)}
        />
        {errors.CodigoMateria && <span className="error-projcreaed">{errors.CodigoMateria}</span>}
      </div>
      <div className="formgroup-projcreaed">
        <input
          type="text"
          className="imput-projcreaed"
          placeholder="Nombre Proyecto"
          value={NombreProyecto}
          onChange={(e) => setNombreProyecto(e.target.value)}
        />
        {errors.NombreProyecto && <span className="error-projcreaed">{errors.NombreProyecto}</span>}
      </div>
      <div className="formgroup-projcreaed">
        <select
          className="sele-projcreaed"
          value={TipoCurso}
          onChange={(e) => setTipoCurso(e.target.value)}
          placeholder="Tipo de curso"
        >
          <option className="option-projcreaed" value="">Tipo de curso</option>
          <option value="todos">Todos</option>
          <option value="Presencial">Presencial</option>
          <option value="Virtual">Virtual</option>
          <option value="Hibrido">Híbrido</option>
        </select>
        {errors.TipoCurso && <span className="error-projcreaed">{errors.TipoCurso}</span>}
      </div>
      <div className="buttongroup-projcreaed">
        <button
          className="button-projcreaed"
          onClick={handleRegresar}
        >
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
