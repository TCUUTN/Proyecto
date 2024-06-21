import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CrearActualizar.css";

function CrearActuCreacionGrupos() {
    const [codigosMateria, setCodigosMateria] = useState([]);
    const [sedes, setSedes] = useState(["Central", "Atenas", "Guanacaste", "Pacífico", "San Carlos", "C. F. P. T. E.", "Todas"]);
    const [cuatrimestres, setCuatrimestres] = useState(["I", "II", "III"]);
    const [formValues, setFormValues] = useState({
      CodigoMateria: "",
      NumeroGrupo: "",
      Horario: "",
      Aula: "",
      Sede: "",
      Cuatrimestre: "",
      Anno: "",
      Estado: "",
      Identificacion: "",
    });
    const navigate = useNavigate();
  const { GrupoId } = useParams();

  useEffect(() => {
    fetchCodigosMateria();
    if (GrupoId) {
      fetchGrupo(GrupoId);
    }
  }, [GrupoId]);
  const fetchCodigosMateria = async () => {
    try {
      const response = await fetch("/tipos");
      const data = await response.json();
      setCodigosMateria(data);
    } catch (error) {
      console.error("Error fetching codigos de materia:", error);
    }
  };

  const fetchGrupo = async (GrupoId) => {
    try {
      const response = await fetch(`/${GrupoId}`);
      const data = await response.json();
      setFormValues(data);
    } catch (error) {
      console.error("Error fetching grupo:", error);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/crearOActualizarGrupo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });

      if (!response.ok) {
        throw new Error("Error en la creación o actualización del grupo");
      }

      const data = await response.json();
      toast.success("Grupo guardado con éxito!");
      navigate("/MantGrupos");
    } catch (error) {
      toast.error("Error al guardar el grupo");
      console.error("Error:", error);
    }
  };

  const handleRegresar = () => {
    navigate("/MantGrupos");
  };
  /* */
  return (
    <div className="creagrup-container">
      <ToastContainer position="bottom-right" />
      <h2 className="creagrup-tit">
      {GrupoId ? "Editar Grupo" : "Agregar Grupo"}
        </h2>
      <hr className="creagrup-diver" />
      <form className="creagrup-formcontainer" onSubmit={handleSubmit}>
        <div className="creagrup-formrow">
             {/*Codigo de materia*/}
          <select  name="CodigoMateria"
            value={formValues.CodigoMateria}
            onChange={handleInputChange}
            className="creagrup-select">
           <option value="">Código Materia</option>
            {codigosMateria.map((materia) => (
              <option key={materia.CodigoMateria} value={materia.CodigoMateria}>
                {materia.CodigoMateria}
              </option>
               ))}
          </select>
          &nbsp;&nbsp;&nbsp;
           {/*Numero de grupo*/}
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
             {/*Horario*/}
          <input
            type="text"
            name="Horario"
            value={formValues.Horario}
            onChange={handleInputChange}
            placeholder="Horario"
            className="creagrup-inputfield"
          />
          &nbsp;&nbsp;&nbsp;
           {/*Aula*/}
          <input
            type="text"
            name="Aula"
            value={formValues.Aula}
            onChange={handleInputChange}
            placeholder="Aula"
            className="creagrup-inputfield"
          />
        </div>
         {/*Sede*/}
        <div className="creagrup-formrow">
          <select  name="Sede"
            value={formValues.Sede}
            onChange={handleInputChange}
            className="creagrup-select">
            <option value="">Sedes</option>
            {sedes.map((sede) => (
              <option key={sede} value={sede}>
                {sede}
              </option>
            ))}
          </select>
          &nbsp;&nbsp;&nbsp;
          {/*Cuatrimestre*/}
          <select name="Cuatrimestre"
            value={formValues.Cuatrimestre}
            onChange={handleInputChange}
            className="creagrup-select">
           <option value="">Cuatrimestre</option>
            {cuatrimestres.map((cuatrimestre) => (
              <option key={cuatrimestre} value={cuatrimestre}>
                {cuatrimestre}
              </option>
            ))}
          </select>
        </div>
        <div className="creagrup-formrow">
             {/*Año*/}
             <input
            type="text"
            name="Anno"
            value={formValues.Anno}
            onChange={handleInputChange}
            placeholder="Año"
            className="creagrup-inputfield"
          />
          &nbsp;&nbsp;&nbsp;
          {/*Estado*/}
          <select name="Estado"
            value={formValues.Estado}
            onChange={handleInputChange}
            className="creagrup-select">
            <option value="">Estados</option>
            <option value="1">Activo</option>
            <option value="0">Inactivo</option>
          </select>
        </div>
        <div className="creagrup-formrow">
          <input
            type="text"
            placeholder="Nombre Completo Académico"
            className="creagrup-inputfield"
          />
        </div>
        <div className="creagrup-buttonrow">
          <button
            type="button"
            className="creagrup-button"
            onClick={handleRegresar}
          >
            Regresar
          </button>
          &nbsp;&nbsp;&nbsp;
          <button type="submit" className="creagrup-button">
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}

export default CrearActuCreacionGrupos;
