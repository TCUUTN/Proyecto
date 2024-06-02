import React, { useState, useEffect } from "react";
import ModalAdd from "./ModelAdd";
import {
  FaEdit,
  FaInfoCircle,
  FaFileDownload,
  FaFileUpload,
} from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import Modal from "react-modal";
import "./Usuario.modulo.css";

// Configurar el elemento raíz para el modal
Modal.setAppElement("#root");

function MantenimientoUs() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    Identificacion: "",
    Nombre: "",
    Apellido1: "",
    Apellido2: "",
    Genero: "",
    CorreoElectronico: "",
    RolUsuario: "",
    Contrasenna: "",
    Estado: "",
    TipoIdentificacion: "",
  });
  const [usuarios, setUsuarios] = useState([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [identificacionFilter, setIdentificacionFilter] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");
  const [rolFilter, setRolFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usuariosPerPage = 10;

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

  const openModal = () => {
    console.log("Opening modal...");
    setModalIsOpen(true);
  };

  const closeModal = () => {
    console.log("Closing modal...");
    setModalIsOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoUsuario((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevoUsuario),
      });

      if (response.ok) {
        const data = await response.json();
        setUsuarios((prevUsuarios) => [...prevUsuarios, data]);
        closeModal();
      } else {
        console.error("Error al agregar el usuario");
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
    }
  };

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

  return (
    <div className="user-container">

      <aside className="sidebar-user">
        <button className="add-user" onClick={openModal}>
          Agregar Usuario <IoMdAddCircle className="icon-add" />
        </button>
        <hr className="user-divider" />
        <h2 className="title-user">Carga masiva</h2>
        <br></br>
        <div className="bulk-upload">
          <div className="upload-option">
            <FaFileDownload className="icon-other" /> Descargar Plantilla
          </div>
          <div className="upload-option">
            <FaFileUpload className="icon-other" /> Subir Plantilla
          </div>
        </div>
      </aside>

      <main>
        <h1 className="main-title">Título</h1>
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
                  <button className="icon-btn">
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
      {/* Modal de Agregar Usuario */}
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modal" overlayClassName="modal-overlay">
        <h2>Agregar Nuevo Usuario</h2>
        <ModalAdd
          nuevoUsuario={nuevoUsuario}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          closeModal={closeModal}
        />

      </Modal>
    </div>
  );
}

export default MantenimientoUs;
