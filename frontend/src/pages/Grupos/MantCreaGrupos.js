import {  FaEdit,
    FaInfoCircle, FaFileDownload, FaFileUpload } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";

import "react-toastify/dist/ReactToastify.css";
import "./Materias.modulo.css";

function MantGrupos() {
  return (
    <div className="materia-container">
      <main>
      <aside className="sidebar-mater">
        <button className="add-mater">
          Agregar Grupos <IoMdAddCircle className="icon-addMater" />
        </button>
        <hr className="mater-divider" />
        <div>
          <h2 className="title-mater">Carga masiva</h2>
          <br></br>
          <div className="bulk-upload-mater">
            <div className="upload-option-mater">
              <FaFileDownload className="icon-othermat" /> Descargar Plantilla
            </div>
            <div className="upload-option-mater">
              <label htmlFor="file-upload" className="upload-label">
                <FaFileUpload className="icon-othermat" /> Subir Plantilla
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".xlsx"
                style={{ display: "none" }}
              />
                        
            </div>
          </div>
        </div>
      </aside>
      {/*
        Feltros de:
            Cuatrimestre
            Codigo de Materias
            Año
      */}
         <div className="filters-mat">
          <label className="filter-label-mat" htmlFor="identificacion">
            Buscar por Código de Materia
          </label>
          <input
            id="identificacion-Busqueda"
            type="text"
            placeholder="Código de Materia"
            className="filter-input-mat"
          />
          <select
            className="filter-select-mat"
            placeholder="Cuatimestre"
          >
            <option value="">Cuatrimestre</option>
          </select>

          <select
            className="filter-select-mat"
            placeholder= "Año"
           
          >
            <option value="">Año</option>
          </select>
        </div>

        {/* Toda la tabla */}
        <table className="mat-table">
          <thead className="mat-thead">
            <tr>
              <th>Materia</th>
              <th>Nombre Proyecto</th>
              <th>Tipo</th>
              <th>Grupo</th>
              <th>Horario</th>
              <th>Aula</th>
              <th>Académico</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody className="mat-tbody">
            
              <tr >
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>
                  <button className="icon-btn-mat" >
                    <FaEdit />
                  </button>
                  <button className="icon-btn-mat">
                    <FaInfoCircle />
                  </button>
                </td>
              </tr>

          </tbody>
        </table>


         {/* La paginacion */}
       <div className="pagination-mat">
       <button>
            Anterior
          </button>
          <button>
            Siguiente
          </button>
        </div>
        {/* Fin */}
      </main>
    </div>
  );
}

export default MantGrupos;