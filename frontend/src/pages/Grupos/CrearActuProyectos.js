import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styles from "./CrearActualizar.module.css";

function CrearActuProyectos() {
    const navigate = useNavigate();

    return (
        <div className={styles["container-projcreaed"]}>
            <h1 className={styles["projcreaed-tit"]}>Aquí va el título de agregar o editar</h1>
            <hr className={styles["diver-projcreaed"]}/>
            <div className={styles["formgroup-projcreaed"]}>
                <label className={styles["label-projcreaed"]}>Códiglo de materia:</label>
                <input type="text" className={styles["imput-projcreaed"]} placeholder="Código de materia" />
            </div>
            <div className={styles["formgroup-projcreaed"]}>
                <label className={styles["label-projcreaed"]}>Nombre del Proyecto:</label>
                <input type="text" className={styles["imput-projcreaed"]} placeholder="Nombre Proyecto" />
            </div>
            <div className={styles["formgroup-projcreaed"]}>
                <label className={styles["label-projcreaed"]}>Tipo de curso:</label>
                <select className={styles["sele-projcreaed"]}>
                    <option value="todos">Todos </option>
                    <option value="presensial">Presencial</option>
                    <option value="virtual">Virtual</option>
                    <option value="hibrido">Híbrido</option>
                </select>
            </div>
            <div className={styles["buttongroup-projcreaed"]}>
                <button className={styles["button-projcreaed"]} onClick={() => navigate("/MantMaterias")} >Regresar</button>
                <button className={styles["button-projcreaed"]} >Guardar</button>
            </div>
        </div>
    );
}

export default CrearActuProyectos;
