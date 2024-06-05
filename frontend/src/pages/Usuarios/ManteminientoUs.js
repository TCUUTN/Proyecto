import React, { useState, useEffect } from "react";
import {
  FaEdit,
  FaInfoCircle,
  FaFileDownload,
  FaFileUpload,
} from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import "./Usuario.modulo.css";
import CrearActualizarUsuario from './CrearActualizarUsuario';
import * as XLSX from "xlsx";

function MantenimientoUs() {
  const [usuarios, setUsuarios] = useState([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [identificacionFilter, setIdentificacionFilter] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");
  const [rolFilter, setRolFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usuariosPerPage = 10;

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsuarios = async () => {
    try {
      const response = await fetch("/usuarios");
      if (response.ok) {
        const data = await response.json();
        setUsuarios(data);
        setFilteredUsuarios(data);
      } else {
        console.error("Error al obtener la lista de usuarios");
      }
    } catch (error) {
      console.error("Error al obtener la lista de usuarios:", error);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleIdentificacionFilterChange = (e) => {
    const value = e.target.value;
    setIdentificacionFilter(value);
    applyFilters(value, estadoFilter, rolFilter);
  };

  const handleEstadoFilterChange = (e) => {
    const value = e.target.value;
    setEstadoFilter(value);
    applyFilters(identificacionFilter, value, rolFilter);
  };

  const handleRolFilterChange = (e) => {
    const value = e.target.value;
    setRolFilter(value);
    applyFilters(identificacionFilter, estadoFilter, value);
  };

  const applyFilters = (identificacion, estado, rol) => {
    let filtered = usuarios;

    if (identificacion) {
      filtered = filtered.filter((usuario) =>
        usuario.Identificacion.includes(identificacion)
      );
    }

    if (estado) {
      const estadoBool = estado === "true";
      filtered = filtered.filter((usuario) => usuario.Estado === estadoBool);
    }

    if (rol) {
      filtered = filtered.filter((usuario) => usuario.RolUsuario === rol);
    }

    setFilteredUsuarios(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const indexOfLastUsuario = currentPage * usuariosPerPage;
  const indexOfFirstUsuario = indexOfLastUsuario - usuariosPerPage;
  const currentUsuarios = filteredUsuarios.slice(
    indexOfFirstUsuario,
    indexOfLastUsuario
  );

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredUsuarios.length / usuariosPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const handleEditUser = (usuario) => {
    setEditingUser(usuario);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    fetchUsuarios();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName], { header: 1 });

        if (worksheet[0].join(",") === "Identificacion,Nombre Completo,Genero,CorreoElectronico") {
          const jsonData = worksheet.slice(1).map(row => {
            const [Identificacion, NombreCompleto, Genero, CorreoElectronico] = row;
            const nombres = NombreCompleto.split(' ');
            const Apellido1 = nombres[0];
            const Apellido2 = nombres[1] || '';
            const Nombre = nombres.slice(2).join(' ');

            return {
              Identificacion,
              Nombre,
              Apellido1,
              Apellido2,
              Genero,
              CorreoElectronico,
              RolUsuario: "Estudiante",
              Contrasenna: generateRandomPassword(),
              Estado: true,
              TipoIdentificacion: "Cedula",
            };
          });
          uploadJsonData(jsonData);
        } else {
          console.error("Formato de archivo inválido");
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      console.error("Por favor, suba un archivo Excel válido");
    }
  };

  const generateRandomPassword = () => {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+";
    const allChars = upper + lower + numbers + symbols;
    let password = "";
    password += upper[Math.floor(Math.random() * upper.length)];
    password += lower[Math.floor(Math.random() * lower.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    for (let i = 4; i < 8; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    return password.split('').sort(() => 0.5 - Math.random()).join('');
  };

  const uploadJsonData = async (data) => {
    try {
      const response = await fetch("/usuarios/cargaUsuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log("Usuarios cargados exitosamente");
        fetchUsuarios();
      } else {
        console.error("Error al cargar los usuarios");
      }
    } catch (error) {
      console.error("Error al cargar los usuarios:", error);
    }
  };

  return (
    <div className="user-container">
      

      <main>
      <aside className="sidebar-user">
        <button className="add-user" onClick={handleAddUser}>
          Agregar Usuario <IoMdAddCircle className="icon-add" />
        </button>
        <hr className="user-divider" />
        <div>
        <h2 className="title-user">Carga masiva</h2>
        <br></br>
        <div className="bulk-upload">
        <div className="upload-option">
            <FaFileDownload className="icon-other" /> Descargar Plantilla
          </div>
          <div className="upload-option">
            <label htmlFor="file-upload" className="upload-label">
              <FaFileUpload className="icon-other" /> Subir Plantilla
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
      
        <div className="filters">
          <label className="filter-label" htmlFor="identificacion">
            Buscar por Identificación
          </label>
          <input
            id="identificacion-Busqueda"
            type="text"
            placeholder="Identificación"
            className="filter-input"
            value={identificacionFilter}
            onChange={handleIdentificacionFilterChange}
          />
          <select
            className="filter-select"
            value={estadoFilter}
            onChange={handleEstadoFilterChange}
          >
            <option value="">Todos</option>
            <option value="true">Activos</option>
            <option value="false">Inactivos</option>
          </select>

          <select
            className="filter-select"
            value={rolFilter}
            onChange={handleRolFilterChange}
          >
            <option value="">Todos</option>
            <option value="Academico">Académico</option>
            <option value="Estudiante">Estudiante</option>
            <option value="Administrativo">Administrativo</option>
          </select>
        </div>
        <table>
          <thead>
            <tr>
              <th>Identificación</th>
              <th>Nombre Completo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentUsuarios.map((usuario) => (
              <tr key={usuario.Identificacion}>
                <td>{usuario.Identificacion}</td>
                <td>{`${usuario.Nombre} ${usuario.Apellido1} ${usuario.Apellido2}`}</td>
                <td>{usuario.Estado ? "Activo" : "Inactivo"}</td>
                <td>
                  <button className="icon-btn" onClick={() => handleEditUser(usuario)}>
                    <FaEdit />
                  </button>
                  <button className="icon-btn">
                    <FaInfoCircle />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <button onClick={handlePreviousPage} disabled={currentPage === 1}>
            Anterior
          </button>
          <button
            onClick={handleNextPage}
            disabled={
              currentPage === Math.ceil(filteredUsuarios.length / usuariosPerPage)
            }
          >
            Siguiente
          </button>
        </div>
      </main>

      {modalOpen && (
        <CrearActualizarUsuario
          usuario={editingUser}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}

export default MantenimientoUs;
