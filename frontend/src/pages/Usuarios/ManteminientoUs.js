import React, { useState, useEffect } from "react";
import { FaFileDownload, FaFileUpload } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import "./Usuario.modulo.css";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TbUserEdit } from "react-icons/tb";

function MantenimientoUs() {
  const [usuarios, setUsuarios] = useState([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [identificacionFilter, setIdentificacionFilter] = useState("");
  const [nombreCompletoFilter, setNombreCompletoFilter] = useState(""); // Nuevo estado
  const [estadoFilter, setEstadoFilter] = useState("");
  const [rolFilter, setRolFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usuariosPerPage = 10;

  const [isLoading, setIsLoading] = useState(false); // Estado para manejar la pantalla de carga

  const fetchUsuarios = async () => {
    try {
      const response = await fetch("/usuarios");
      if (response.ok) {
        const data = await response.json();
        const sede = sessionStorage.getItem("Sede");
        const UserSaved = sessionStorage.getItem("userSaved");

        if (UserSaved === "true") {
          toast.success("Usuario guardado con éxito");
          sessionStorage.removeItem("userSaved");
        }
        if (sede && sede !== "Todas") {
          const filteredBySede = data.filter(
            (usuario) => usuario.Sede === sede
          );
          setUsuarios(filteredBySede);
          setFilteredUsuarios(filteredBySede);
        } else {
          setUsuarios(data);
          setFilteredUsuarios(data);
        }
      } else {
        toast.error("Error al obtener la lista de usuarios");
      }
    } catch (error) {
      toast.error("Error al obtener la lista de usuarios:", error);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleIdentificacionFilterChange = (e) => {
    const value = e.target.value;
    setIdentificacionFilter(value);
    applyFilters(value, nombreCompletoFilter, estadoFilter, rolFilter);
  };

  const handleNombreCompletoFilterChange = (e) => {
    const value = e.target.value;
    setNombreCompletoFilter(value);
    applyFilters(identificacionFilter, value, estadoFilter, rolFilter);
  };

  const handleEstadoFilterChange = (e) => {
    const value = e.target.value;
    setEstadoFilter(value);
    applyFilters(identificacionFilter, nombreCompletoFilter, value, rolFilter);
  };

  const handleRolFilterChange = (e) => {
    const value = e.target.value;
    setRolFilter(value);
    applyFilters(
      identificacionFilter,
      nombreCompletoFilter,
      estadoFilter,
      value
    );
  };

  const applyFilters = (identificacion, nombreCompleto, estado, rol) => {
    let filtered = usuarios;

    if (identificacion) {
      filtered = filtered.filter((usuario) =>
        usuario.Identificacion.includes(identificacion)
      );
    }

    if (nombreCompleto) {
      filtered = filtered.filter((usuario) =>
        `${usuario.Nombre} ${usuario.Apellido1} ${usuario.Apellido2}`
          .toLowerCase()
          .includes(nombreCompleto.toLowerCase())
      );
    }
    if (estado) {
      const estadoNum = estado === "1" ? 1 : 0;
      filtered = filtered.filter((usuario) => usuario.Estado === estadoNum);
    }

    if (rol) {
      filtered = filtered.filter((usuario) =>
        usuario.Usuarios_Roles.some((ur) => ur.Rol.NombreRol === rol)
      );
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
  const navigate = useNavigate();

  const handleAddUser = () => {
    navigate("/CrearActualizarUsuario");
  };

  const handleEditUser = (Identificacion) => {
    sessionStorage.setItem("IdentificacionUsuario", Identificacion);
    navigate("/CrearActualizarUsuario");
  };

  const headerMappings = {
    Estudiante: {
      "Código de Proyecto": "CodigoMateria",
      "Grupo#": "Grupo",
      "Cuatrimestre": "Cuatrimestre",
      "Año": "Anno",
      "Sede": "Sede",
      "Identificación": "Identificacion",
      "Nombre Completo": "NombreCompleto",
      "Correo Electrónico": "CorreoElectronico",
    },
    Académico: {
      "Identificación": "Identificacion",
      "Nombre Completo": "NombreCompleto",
      "Correo Electrónico": "CorreoElectronico",
      "Sede": "Sede",
    },
  };
  
  const handleFileUpload = (e, role) => {
    const file = e.target.files[0];
    if (
      file &&
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      setIsLoading(true); // Mostrar pantalla de carga
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = XLSX.utils.sheet_to_json(
          workbook.Sheets[firstSheetName],
          { header: 1 }
        );
  
        const mapHeaders = (row, mappings, headerRow) => {
          return row.reduce((acc, value, index) => {
            const header = headerRow[index]; // Usar la fila de encabezados correcta
            const mappedHeader = mappings[header];
            if (mappedHeader) {
              acc[mappedHeader] = value;
            }
            return acc;
          }, {});
        };
  
        if (role === "Académico") {
          const headerRow = worksheet[0];
          const dataRows = worksheet.slice(1);
          const jsonData = dataRows.map((row) => {
            const mappedRow = mapHeaders(row, headerMappings.Académico, headerRow);
            const nombres = mappedRow.NombreCompleto?.split(" ") || [];
            const Apellido1 = nombres[0] || "";
            const Apellido2 = nombres[1] || "";
            const Nombre = nombres.slice(2).join(" ") || "";
  
            return {
              Identificacion: mappedRow.Identificacion,
              Nombre,
              Apellido1,
              Apellido2,
              Genero: "Indefinido",
              CorreoElectronico: mappedRow.CorreoElectronico,
              RolUsuario: role,
              Contrasenna: generateRandomPassword(),
              Estado: true,
              Sede: mappedRow.Sede,
            };
          });
  
          uploadJsonData(jsonData, role);
        } else if (role === "Estudiante") {
          if (worksheet.length > 2) {
            const generalData = worksheet[0].reduce((acc, value, index) => {
              if (index % 2 === 0) {
                const header = worksheet[0][index];
                const mappedHeader = headerMappings.Estudiante[header];
                if (mappedHeader) {
                  acc[mappedHeader] = worksheet[0][index + 1];
                }
              }
              return acc;
            }, {});
  
            const headerRow = worksheet[1];
            const dataRows = worksheet.slice(2);
            const jsonData = dataRows.map((row) => {
              const mappedRow = mapHeaders(row, headerMappings.Estudiante, headerRow);
              const nombres = mappedRow.NombreCompleto?.split(" ") || [];
              const Apellido1 = nombres[0] || "";
              const Apellido2 = nombres[1] || "";
              const Nombre = nombres.slice(2).join(" ") || "";
  
              const user = {
                Identificacion: mappedRow.Identificacion,
                Nombre,
                Apellido1,
                Apellido2,
                Genero: "Indefinido",
                CorreoElectronico: mappedRow.CorreoElectronico,
                RolUsuario: role,
                Contrasenna: generateRandomPassword(),
                Estado: true,
                ...generalData,
              };
  
              return user;
            });
            uploadJsonData(jsonData, role);
          } else {
            toast.error("Formato de archivo inválido");
          }
        } else {
          toast.error("Rol de usuario no reconocido");
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      toast.error("Por favor, suba un archivo Excel válido");
    }
  };
  
  
  

  const handleCarrerasUplaod = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      setIsLoading(true); // Mostrar pantalla de carga
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = XLSX.utils.sheet_to_json(
          workbook.Sheets[firstSheetName],
          { header: 1 }
        );
  
        // eslint-disable-next-line no-unused-vars
        const dataRows = worksheet.slice(1); // Omitir la primera fila (encabezados)
  
        const jsonData = dataRows.map((row) => {
          const [Identificación, Carrera] = row;
  
          return {
            Identificacion: Identificación,
            CarreraEstudiante: Carrera
          };
        });
        uploadJsonDataSinRol(jsonData);
      };
      reader.readAsArrayBuffer(file);
    } else {
      toast.error("Por favor, suba un archivo Excel válido");
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
    return password
      .split("")
      .sort(() => 0.5 - Math.random())
      .join("");
  };

  const uploadJsonData = async (data, role) => {
    try {
      const response = await fetch("/usuarios/cargaUsuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success(`${role}s cargados exitosamente`);
        fetchUsuarios();
      } else {
        toast.error("Error al cargar los usuarios");
      }
    } catch (error) {
      toast.error("Error al cargar los usuarios");
    } finally {
      setIsLoading(false); // Ocultar pantalla de carga
    }
  };

  const uploadJsonDataSinRol = async (data) => {
    try {
      const response = await fetch("/usuarios/cargaCarreras", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success(`Carreras cargadas exitosamente`);
        fetchUsuarios();
      } else {
        toast.error("Error al cargar las carreras");
      }
    } catch (error) {
      toast.error("Error al cargar las carreras", error);
    } finally {
      setIsLoading(false); // Ocultar pantalla de carga
    }
  };

  return (
    <div className="user-container">
      {/*Para la carga */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
      {/**/}
      <main>
        {/*Agregar usuario y la carga */}
        <div className="sidebar-user">
          <div className="user-action">
            <button className="add-user" onClick={handleAddUser}>
              Agregar Usuario <IoMdAddCircle className="icon-add" />
            </button>
          </div>
          <div className="user-divider" />
          {/*Parte de las carga masiva*/}
          <div className="bulk-upload-section">
            <h2 className="title-user">Carga masiva</h2>

            <div className="bulk-upload">
              <div className="upload-option">
                <FaFileDownload className="icon-other" /> Descargar Plantilla
              </div>
              <div className="upload-option">
                <label
                  htmlFor="file-upload-estudiante"
                  className="upload-label"
                >
                  <FaFileUpload className="icon-other" /> Subir Estudiantes
                </label>
                <input
                  id="file-upload-estudiante"
                  type="file"
                  accept=".xlsx"
                  style={{ display: "none" }}
                  onChange={(e) => handleFileUpload(e, "Estudiante")}
                />
              </div>
              <div className="upload-option">
                <label htmlFor="file-upload-academico" className="upload-label">
                  <FaFileUpload className="icon-other" /> Cargar Académicos
                </label>
                <input
                  id="file-upload-academico"
                  type="file"
                  accept=".xlsx"
                  style={{ display: "none" }}
                  onChange={(e) => handleFileUpload(e, "Académico")}
                />
              </div>
              <div className="upload-option">
                <label htmlFor="file-upload-carreras" className="upload-label">
                  <FaFileUpload className="icon-other" /> Cargar Carreras
                </label>
                <input
                  id="file-upload-carreras"
                  type="file"
                  accept=".xlsx"
                  style={{ display: "none" }}
                  onChange={(e) => handleCarrerasUplaod(e)}
                />
              </div>
            </div>
          </div>
        </div>
        {/*Filtros*/}
        <div className="filters-user">
          <div className="filter-group-user">
            <label
              className="filter-label-user"
              htmlFor="identificacion-Busqueda"
            >
              Buscar por Identificación
            </label>
            <input
              id="identificacion-Busqueda"
              type="text"
              placeholder="Identificación"
              className="filter-input-user"
              value={identificacionFilter}
              onChange={handleIdentificacionFilterChange}
            />
          </div>
          <div className="filter-group-user">
            <label
              className="filter-label-user"
              htmlFor="nombre-completo-busqueda"
            >
              Buscar por Nombre Completo
            </label>
            <input
              id="nombre-completo-busqueda"
              type="text"
              placeholder="Nombre Completo"
              className="filter-input-user"
              value={nombreCompletoFilter}
              onChange={handleNombreCompletoFilterChange}
            />
          </div>
          <div className="filter-group-user">
            <label className="filter-label-user" htmlFor="estado-filter">
              Estado
            </label>
            <select
              id="estado-filter"
              className="filter-select-user"
              value={estadoFilter}
              onChange={handleEstadoFilterChange}
            >
              <option value="">Todos</option>
              <option value="1">Activos</option>
              <option value="0">Inactivos</option>
            </select>
          </div>
          <div className="filter-group-user">
            <label className="filter-label-user" htmlFor="rol-filter">
              Rol
            </label>
            <select
              id="rol-filter"
              className="filter-select-user"
              value={rolFilter}
              onChange={handleRolFilterChange}
            >
              <option value="">Todos</option>
              <option value="Administrativo">Administrativo</option>
              <option value="Académico">Académico</option>
              <option value="Estudiante">Estudiante</option>
            </select>
          </div>
        </div>

        {/*Tabla*/}
        <div className="table-container">
          <table className="user-table">
            <thead className="user-thead">
              <tr>
                <th>Identificación</th>
                <th>Nombre Completo</th>
                <th>Estado</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody className="user-tbody">
              {currentUsuarios.map((usuario) => (
                <tr key={usuario.Identificacion}>
                  <td>{usuario.Identificacion}</td>
                  <td>{`${usuario.Nombre} ${usuario.Apellido1} ${usuario.Apellido2}`}</td>
                  <td>{usuario.Estado ? "Activo" : "Inactivo"}</td>
                  <td>
                    {usuario.Usuarios_Roles.map((ur) => ur.Rol.NombreRol).join(
                      ", "
                    )}
                  </td>
                  <td>
                    <button
                      className="icon-btn-user"
                      onClick={() => handleEditUser(usuario.Identificacion)}
                    >
                      <TbUserEdit />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* La paginacion */}
          <div className="pagination-user">
            <button onClick={handlePreviousPage} disabled={currentPage === 1}>
              Anterior
            </button>
            <span>
              Página {currentPage} de{" "}
              {Math.ceil(filteredUsuarios.length / usuariosPerPage)}
            </span>
            <button
              onClick={handleNextPage}
              disabled={
                currentPage ===
                Math.ceil(filteredUsuarios.length / usuariosPerPage)
              }
            >
              Siguiente
            </button>
          </div>
        </div>

        {/**/}
      </main>

      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default MantenimientoUs;
