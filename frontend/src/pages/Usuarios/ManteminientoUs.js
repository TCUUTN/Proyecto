import React, { useState, useEffect } from "react";
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
    setModalIsOpen(true);
  };

  const closeModal = () => {
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

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Agregar Usuario"
        className="modal"
      >
        <h2>Agregar Usuario</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="identificacion">Identificación:</label>
          <input
            id="identificacion"
            name="Identificacion"
            type="text"
            value={nuevoUsuario.Identificacion}
            onChange={handleChange}
            required
          />

          <label htmlFor="nombre">Nombre:</label>
          <input
            id="nombre"
            name="Nombre"
            type="text"
            value={nuevoUsuario.Nombre}
            onChange={handleChange}
            required
          />

          <label htmlFor="apellido1">Apellido1:</label>
          <input
            id="apellido1"
            name="Apellido1"
            type="text"
            value={nuevoUsuario.Apellido1}
            onChange={handleChange}
            required
          />

          <label htmlFor="apellido2">Apellido2:</label>
          <input
            id="apellido2"
            name="Apellido2"
            type="text"
            value={nuevoUsuario.Apellido2}
            onChange={handleChange}
            required
          />

          <label htmlFor="genero">Género:</label>
          <select
            id="genero"
            name="Genero"
            value={nuevoUsuario.Genero}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione</option>
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
            <option value="otro">Otro</option>
          </select>

          <label htmlFor="correo">Correo Electrónico:</label>
          <input
            id="correo"
            name="CorreoElectronico"
            type="email"
            value={nuevoUsuario.CorreoElectronico}
            onChange={handleChange}
            required
          />

          <label htmlFor="rol">Rol Usuario:</label>
          <input
            id="rol"
            name="RolUsuario"
            type="text"
            value={nuevoUsuario.RolUsuario}
            onChange={handleChange}
            required
          />

          <label htmlFor="contrasenna">Contraseña:</label>
          <input
            id="contrasenna"
            name="Contrasenna"
            type="password"
            value={nuevoUsuario.Contrasenna}
            onChange={handleChange}
            required
          />

          <label htmlFor="estado">Estado:</label>
          <select
            id="estado"
            name="Estado"
            value={nuevoUsuario.Estado}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>

          <label htmlFor="tipo-identificacion">Tipo Identificación:</label>
          <input
            id="tipo-identificacion"
            name="TipoIdentificacion"
            type="text"
            value={nuevoUsuario.TipoIdentificacion}
            onChange={handleChange}
            required
          />

          <button type="submit">Guardar</button>
          <button type="button" onClick={closeModal}>
            Cancelar
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default MantenimientoUs;
