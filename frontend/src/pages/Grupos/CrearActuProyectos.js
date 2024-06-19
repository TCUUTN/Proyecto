import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./CrearActualizar.module.css";

function CrearActuProyectos() {
    const navigate = useNavigate();
    const [CodigoMateria, setCodigoMateria] = useState("");
    const [NombreProyecto, setNombreProyecto] = useState("");
    const [TipoCurso, setTipoCurso] = useState("todos");
    const [titulo, setTitulo] = useState("Crear Proyecto");

    useEffect(() => {
        const codigoProyecto = sessionStorage.getItem("CodigoProyecto");
        if (codigoProyecto) {
            console.log(codigoProyecto)
            fetch(`grupos/tipos/${codigoProyecto}`)
                .then(response => response.json())
                .then(data => {
                    const { CodigoMateria, NombreProyecto, TipoCurso } = data;
                    setCodigoMateria(CodigoMateria);
                    setNombreProyecto(NombreProyecto);
                    setTipoCurso(TipoCurso);
                    setTitulo("Actualizar Proyecto");
                })
                .catch(error => {
                    console.error("Error fetching project data:", error);
                });
        }
    }, []);

    const handleGuardar = () => {
        if (TipoCurso === "todos") {
            toast.error("Por favor, seleccione un tipo de curso válido.");
            return;
        }

        const proyectoData = {
            CodigoMateria,
            NombreProyecto,
            TipoCurso
        };

        fetch('/grupos/crearOActualizarTipoGrupo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(proyectoData)
        })
            .then(response => response.json())
            .then(data => {
                sessionStorage.removeItem("CodigoProyecto");
                sessionStorage.setItem("proyectoGuardado", "true");
                navigate("/MantMaterias");
            })
            .catch(error => {
                console.error("Error saving project data:", error);
                toast.error("Error al guardar el proyecto.");
            });
    };

    return (
        <div className={styles["container-projcreaed"]}>
            <ToastContainer position="bottom-right" />
            <h1 className={styles["projcreaed-tit"]}>{titulo}</h1>
            <hr className={styles["diver-projcreaed"]}/>
            <div className={styles["formgroup-projcreaed"]}>
                <label className={styles["label-projcreaed"]}>Código de materia:</label>
                <input
                    type="text"
                    className={styles["imput-projcreaed"]}
                    placeholder="Código de materia"
                    value={CodigoMateria}
                    onChange={(e) => setCodigoMateria(e.target.value)}
                />
            </div>
            <div className={styles["formgroup-projcreaed"]}>
                <label className={styles["label-projcreaed"]}>Nombre del Proyecto:</label>
                <input
                    type="text"
                    className={styles["imput-projcreaed"]}
                    placeholder="Nombre Proyecto"
                    value={NombreProyecto}
                    onChange={(e) => setNombreProyecto(e.target.value)}
                />
            </div>
            <div className={styles["formgroup-projcreaed"]}>
                <label className={styles["label-projcreaed"]}>Tipo de curso:</label>
                <select
                    className={styles["sele-projcreaed"]}
                    value={TipoCurso}
                    onChange={(e) => setTipoCurso(e.target.value)}
                >
                    <option value="todos">Todos </option>
                    <option value="Presencial">Presencial</option>
                    <option value="Virtual">Virtual</option>
                    <option value="Hibrido">Híbrido</option>
                </select>
            </div>
            <div className={styles["buttongroup-projcreaed"]}>
                <button className={styles["button-projcreaed"]} onClick={() => navigate("/MantMaterias")}>Regresar</button>
                <button className={styles["button-projcreaed"]} onClick={handleGuardar}>Guardar</button>
            </div>
        </div>
    );
}

export default CrearActuProyectos;
