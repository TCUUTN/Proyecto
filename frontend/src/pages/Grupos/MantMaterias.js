import React, { useState, useEffect } from "react";
import {
  FaFileDownload,
  FaFileUpload,
} from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import * as XLSX from "xlsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Materias.modulo.css";

import { LuFileEdit } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

function MantMaterias() {
  const [materias, setMaterias] = useState([]);
  const [filteredMaterias, setFilteredMaterias] = useState([]);
  const [codigoMateriaFilter, setCodigoMateriaFilter] = useState("");
  const [nombreProyectoFilter, setNombreProyectoFilter] = useState("");
  const [tipoFilter, setTipoFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const materiasPerPage = 10;

  const banderaProyecto = sessionStorage.getItem("proyectoGuardado")
    console.log(banderaProyecto)

  const navigate = useNavigate();

  const fetchMaterias = async () => {
    try {
      const response = await fetch("/grupos/tipos");
      if (response.ok) {
        const data = await response.json();
        setMaterias(data);
        setFilteredMaterias(data);
      } else {
        console.error("Error al obtener la lista de materias");
        toast.error("Error al obtener la lista de materias");
      }
    } catch (error) {
      console.error("Error al obtener la lista de materias:", error);
      toast.error("Error al obtener la lista de materias");
    }
  };

  useEffect(() => {
    fetchMaterias();
    
    if (banderaProyecto==="true") {
      toast.success("El proyecto fue guardado con éxito.");
      sessionStorage.removeItem("proyectoGuardado");
    }
  }, []);

  const handleCodigoMateriaFilterChange = (e) => {
    const value = e.target.value;
    setCodigoMateriaFilter(value);
    applyFilters(value, nombreProyectoFilter, tipoFilter);
  };

  const handleNombreProyectoFilterChange = (e) => {
    const value = e.target.value;
    setNombreProyectoFilter(value);
    applyFilters(codigoMateriaFilter, value, tipoFilter);
  };

  const handleTipoFilterChange = (e) => {
    const value = e.target.value;
    setTipoFilter(value);
    applyFilters(codigoMateriaFilter, nombreProyectoFilter, value);
  };

  const applyFilters = (CodigoMateria, NombreProyecto, TipoCurso) => {
    let filtered = materias;

    if (CodigoMateria) {
      filtered = filtered.filter((materia) =>
        materia.CodigoMateria?.toLowerCase().includes(
          CodigoMateria.toLowerCase()
        )
      );
    }

    if (NombreProyecto) {
      filtered = filtered.filter((materia) =>
        materia.NombreProyecto?.toLowerCase().includes(
          NombreProyecto.toLowerCase()
        )
      );
    }

    if (TipoCurso) {
      filtered = filtered.filter((materia) => materia.TipoCurso === TipoCurso);
    }

    setFilteredMaterias(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const indexOfLastMateria = currentPage * materiasPerPage;
  const indexOfFirstMateria = indexOfLastMateria - materiasPerPage;
  const currentMaterias = filteredMaterias.slice(
    indexOfFirstMateria,
    indexOfLastMateria
  );

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredMaterias.length / materiasPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = XLSX.utils.sheet_to_json(
          workbook.Sheets[firstSheetName],
          { header: 1 }
        );

        if (
          worksheet[0].join(",") === "CodigoMateria,NombreProyecto,TipoCurso"
        ) {
          const jsonData = worksheet.slice(1).map((row) => {
            const [CodigoMateria, NombreProyecto, TipoCurso] = row;
            return {
              CodigoMateria,
              NombreProyecto,
              TipoCurso,
            };
          });
          uploadJsonData(jsonData);
        } else {
          console.error("Formato de archivo inválido");
          toast.error("Formato de archivo inválido");
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      console.error("Por favor, suba un archivo Excel válido");
      toast.error("Por favor, suba un archivo Excel válido");
    }
  };

  const uploadJsonData = async (data) => {
    setLoading(true);
    try {
      const response = await fetch("/grupos/cargarTipoGrupos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log("Datos cargados exitosamente");
        toast.success("Datos cargados exitosamente");
        fetchMaterias();
      } else {
        console.error("Error al cargar los datos");
        toast.error("Error al cargar los datos");
      }
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      toast.error("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="materia-container">
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
      <ToastContainer position="bottom-right" />
      <main>
        <div className="sidebar-mater">
          <div className="mater-action">
            <button
              className="add-mater"
              onClick={() => navigate("/CrearActuProyectos")}
            >
              Agregar Proyectos <IoMdAddCircle className="icon-addMater" />
            </button>
          </div>
          <div className="mater-divider" />
          <div className="bulk-upload-section">
            <h2 className="title-mater">Carga masiva</h2>

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
                  onChange={handleFileUpload}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="filters-mat">
          <div className="filter-group-mat">
            <label className="filter-label-mat" htmlFor="CodigoMateria">
              Buscar por Código de Proyecto
            </label>
            <input
              id="CodigoMateria-Busqueda"
              type="text"
              placeholder="Código de Proyecto"
              className="filter-input-mat"
              value={codigoMateriaFilter}
              onChange={handleCodigoMateriaFilterChange}
            />
          </div>
          <div className="filter-group-mat">
            <label className="filter-label-mat" htmlFor="Proyecto">
              Buscar por Nombre de Proyecto
            </label>
            <input
              id="NombreProyecto-Busqueda"
              type="text"
              placeholder="Nombre de Proyecto"
              className="filter-input-mat"
              value={nombreProyectoFilter}
              onChange={handleNombreProyectoFilterChange}
            />
          </div>
          <div className="filter-group-mat">
            <label className="filter-label-mat" htmlFor="Modalidad">
              Seleccione Modalidad
            </label>
            <select
              className="filter-select-mat"
              value={tipoFilter}
              onChange={handleTipoFilterChange}
            >
              <option value="">Modalidad</option>
              <option value="Presencial">Presencial</option>
              <option value="Hibrido">Híbrido</option>
              <option value="Virtual">Virtual</option>
            </select>
          </div>
        </div>

        <div className="table-container-mat">
          <table className="mat-table">
            <thead className="mat-thead">
              <tr>
                <th>Código de Materia</th>
                <th>Nombre del Proyecto</th>
                <th>Tipo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody className="mat-tbody">
              {currentMaterias.map((materia) => (
                <tr key={materia.CodigoMateria}>
                  <td>{materia.CodigoMateria}</td>
                  <td>{materia.NombreProyecto}</td>
                  <td>{materia.TipoCurso}</td>
                  <td>
                    <button
                      className="icon-btn-mat"
                      onClick={() => {
                        sessionStorage.setItem(
                          "CodigoProyecto",
                          materia.CodigoMateria
                        );
                        navigate("/CrearActuProyectos");
                      }}
                    >
               <LuFileEdit />
                    </button>
                   
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination-mat">
            <button onClick={handlePreviousPage} disabled={currentPage === 1}>
              Anterior
            </button>
            <span>
              Página {currentPage} de{" "}
              {Math.ceil(filteredMaterias.length / materiasPerPage)}
            </span>
            <button
              onClick={handleNextPage}
              disabled={
                currentPage ===
                Math.ceil(filteredMaterias.length / materiasPerPage)
              }
            >
              Siguiente
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MantMaterias;
