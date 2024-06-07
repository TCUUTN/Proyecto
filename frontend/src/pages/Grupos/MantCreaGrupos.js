import React, { useState, useEffect } from "react";
import {
  FaEdit,
  FaInfoCircle,
  FaFileDownload,
  FaFileUpload,
} from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import * as XLSX from 'xlsx';
import "./Materias.modulo.css";

function MantGrupos() {
  const [grupos, setGrupos] = useState([]);
  const [filteredGrupos, setFilteredGrupos] = useState([]);
  const [codigoMateriaFilter, setCodigoMateriaFilter] = useState("");
  const [nombreProyectoFilter, setNombreProyectoFilter] = useState("");
  const [cuatrimestreFilter, setCuatrimestreFilter] = useState("");
  const [annoFilter, setAnnoFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const gruposPerPage = 10;
  const [uniqueYears, setUniqueYears] = useState([]);

  useEffect(() => {
    fetchGrupos();
  }, []);

  const fetchGrupos = async () => {
    try {
      const response = await fetch("/grupos");
      if (response.ok) {
        const data = await response.json();
        setGrupos(data);
        setFilteredGrupos(data);
        const years = [...new Set(data.map(grupo => grupo.Anno))];
        setUniqueYears(years.sort((a, b) => a - b));
      } else {
        console.error("Error al obtener la lista de grupos");
      }
    } catch (error) {
      console.error("Error al obtener la lista de grupos:", error);
    }
  };

  const handleCodigoMateriaFilterChange = (e) => {
    const value = e.target.value;
    setCodigoMateriaFilter(value);
    applyFilters(value, nombreProyectoFilter, cuatrimestreFilter, annoFilter);
  };

  const handleNombreProyectoFilterChange = (e) => {
    const value = e.target.value;
    setNombreProyectoFilter(value);
    applyFilters(codigoMateriaFilter, value, cuatrimestreFilter, annoFilter);
  };

  const handleCuatrimestreFilterChange = (e) => {
    const value = e.target.value;
    setCuatrimestreFilter(value);
    applyFilters(codigoMateriaFilter, nombreProyectoFilter, value, annoFilter);
  };

  const handleAnnoFilterChange = (e) => {
    const value = e.target.value;
    setAnnoFilter(value);
    applyFilters(codigoMateriaFilter, nombreProyectoFilter, cuatrimestreFilter, value);
  };

  const applyFilters = (codigoMateria, nombreProyecto, cuatrimestre, anno) => {
    let filtered = grupos;

    if (codigoMateria) {
      filtered = filtered.filter((grupo) =>
        grupo.CodigoMateria.toLowerCase().includes(codigoMateria.toLowerCase())
      );
    }

    if (nombreProyecto) {
      filtered = filtered.filter((grupo) =>
        grupo.Grupos_TipoGrupo.NombreProyecto.toLowerCase().includes(nombreProyecto.toLowerCase())
      );
    }

    if (cuatrimestre) {
      filtered = filtered.filter((grupo) => grupo.Cuatrimestre === parseInt(cuatrimestre));
    }

    if (anno) {
      filtered = filtered.filter((grupo) => grupo.Anno === parseInt(anno));
    }

    setFilteredGrupos(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const indexOfLastGrupo = currentPage * gruposPerPage;
  const indexOfFirstGrupo = indexOfLastGrupo - gruposPerPage;
  const currentGrupos = filteredGrupos.slice(indexOfFirstGrupo, indexOfLastGrupo);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredGrupos.length / gruposPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

      const [headers, ...rows] = worksheet;
      if (!headers.includes('CodigoMateria') || !headers.includes('NumeroGrupo') || !headers.includes('Horario') || !headers.includes('Aula') || !headers.includes('Cuatrimestre') || !headers.includes('Anno') || !headers.includes('Academico')) {
        console.error("El archivo no contiene las columnas requeridas");
        return;
      }

      const grupos = [];
      for (const row of rows) {
        const [
          CodigoMateria,
          NumeroGrupo,
          Horario,
          Aula,
          Cuatrimestre,
          Anno,
          Academico
        ] = row;

        const [Apellido1, Apellido2, ...nombreArray] = Academico.split(' ');

        const Nombre = nombreArray.join(' ');

        try {
          const response = await fetch(`/usuarios/nombre?Nombre=${Nombre}&Apellido1=${Apellido1}&Apellido2=${Apellido2}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });

          const data = await response.json();
          if (response.ok && data.Identificacion) {
            grupos.push({
              CodigoMateria,
              NumeroGrupo,
              Horario,
              Aula,
              Cuatrimestre,
              Anno,
              Identificacion: data.Identificacion
            });
          } else {
            console.error(`Error al obtener la identificación para ${Nombre} ${Apellido1} ${Apellido2}`);
          }
        } catch (error) {
          console.error("Error al procesar los datos del usuario:", error);
        }
      }

      try {
        const response = await fetch('/grupos/cargarGrupos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(grupos)
        });

        if (response.ok) {
          console.log('Datos cargados correctamente');
          fetchGrupos(); // Refresh table
        } else {
          console.error('Error al cargar los datos de los grupos');
        }
      } catch (error) {
        console.error('Error al cargar los datos de los grupos:', error);
      }
    };

    reader.readAsArrayBuffer(file);
  };

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
                  onChange={handleFileUpload}
                />
              </div>
            </div>
          </div>
        </aside>

        <div className="filters-mat">
          <label className="filter-label-mat" htmlFor="CodigoMateria">
            Buscar por Código de Materia
          </label>
          <input
            id="CodigoMateria-Busqueda"
            type="text"
            placeholder="Código de Materia"
            className="filter-input-mat"
            value={codigoMateriaFilter}
            onChange={handleCodigoMateriaFilterChange}
          />

          <label className="filter-label-mat" htmlFor="NombreProyecto">
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

          <select
            className="filter-select-mat"
            value={cuatrimestreFilter}
            onChange={handleCuatrimestreFilterChange}
          >
            <option value="">Cuatrimestre</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>

          <select
            className="filter-select-mat"
            value={annoFilter}
            onChange={handleAnnoFilterChange}
          >
            <option value="">Año</option>
            {uniqueYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

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
            {currentGrupos.map((grupo) => (
              <tr key={grupo.GrupoId}>
                <td>{grupo.CodigoMateria}</td>
                <td>{grupo.Grupos_TipoGrupo.NombreProyecto}</td>
                <td>{grupo.Grupos_TipoGrupo.TipoCurso}</td>
                <td>{grupo.NumeroGrupo}</td>
                <td>{grupo.Horario}</td>
                <td>{grupo.Aula}</td>
                <td>{`${grupo.Usuario.Nombre} ${grupo.Usuario.Apellido1} ${grupo.Usuario.Apellido2}`}</td>
                <td>
                  <button className="icon-btn-mat">
                    <FaEdit />
                  </button>
                  <button className="icon-btn-mat">
                    <FaInfoCircle />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination-mat">
          <button onClick={handlePreviousPage}>Anterior</button>
          <button onClick={handleNextPage}>Siguiente</button>
        </div>
      </main>
    </div>
  );
}

export default MantGrupos;
