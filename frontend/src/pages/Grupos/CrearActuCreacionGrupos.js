import styles from "./CrearActualizar.module.css";

function CrearActuCreacionGrupos() {
    return (
        <div className={styles["creagrup-container"]}>
            <h2 className={styles["creagrup-tit"]}>Aqui va el título de agregar o editar</h2>
            <hr className={styles["creagrup-diver"]} />
            <form className={styles["creagrup-formcontainer"]}>
                <div className={styles["creagrup-formrow"]}>
                    <select className={styles["creagrup-select"]}>
                        <option value="">Código Materia</option>
                        {/* Add more options here */}
                    </select>
                    <input type="text" placeholder="Número de Grupos" className={styles["creagrup-inputfield"]} />
                </div>
                <div className={styles["creagrup-formrow"]}>
                    <input type="text" placeholder="Horario" className={styles["creagrup-inputfield"]} />
                    <input type="text" placeholder="Aula" className={styles["creagrup-inputfield"]} />
                </div>
                <div className={styles["creagrup-formrow"]}>
                    <select className={styles["creagrup-select"]}>
                        <option value="">Sedes</option>
                        {/* Add more options here */}
                    </select>
                    <select className={styles["creagrup-select"]}>
                        <option value="">Cuatrimestre</option>
                        {/* Add more options here */}
                    </select>
                </div>
                <div className={styles["creagrup-formrow"]}>
                    <input type="text" placeholder="Año" className={styles["creagrup-inputfield"]} />
                    <select className={styles["creagrup-select"]}>
                        <option value="">Estados</option>
                        {/* Add more options here */}
                    </select>
                </div>
                <div className={styles["creagrup-formrow"]}>
                    <input type="text" placeholder="Nombre Completo Académico" className={styles["creagrup-inputfield"]} />
                </div>
                <div className={styles["creagrup-buttonrow"]}>
                    <button type="button" className={styles["creagrup-button"]}>Regresar</button>
                    <button type="submit" className={styles["creagrup-button"]}>Guardar</button>
                </div>
            </form>
        </div>
    );
}

export default CrearActuCreacionGrupos;
