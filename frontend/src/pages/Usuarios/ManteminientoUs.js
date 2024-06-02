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

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await fetch("/usuarios");
        if (response.ok) {
          const data = await response.json();
          setUsuarios(data);
        } else {
          console.error("Error al obtener la lista de usuarios");
        }
      } catch (error) {
        console.error("Error al obtener la lista de usuarios:", error);
      }
    };

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
        setUsuarios([...usuarios, data]);
        closeModal();
      } else {
        console.error("Error al agregar el usuario");
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
    }
  };

  const handleToggle = async (identificacion, estadoActual) => {
    const nuevoEstado = !estadoActual;

    try {
      const response = await fetch("/usuarios/EstadoUsuario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Identificacion: identificacion,
          Estado: nuevoEstado ? true : false,
        }),
      });

      if (response.ok) {
        setUsuarios(
          usuarios.map((usuario) =>
            usuario.Identificacion === identificacion
              ? { ...usuario, Estado: nuevoEstado ? true : false }
              : usuario
          )
        );
      } else {
        console.error("Error al actualizar el estado del usuario");
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
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
          />
          <select className="filter-select">
            <option value="activo-inactivo">Estatus de Usuario</option>
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
            {usuarios.map((usuario) => (
              <tr key={usuario.Identificacion}>
                <td>{usuario.Identificacion}</td>
                <td>{`${usuario.Nombre} ${usuario.Apellido1} ${usuario.Apellido2}`}</td>
                <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={usuario.Estado === true}
                      onChange={() =>
                        handleToggle(
                          usuario.Identificacion,
                          usuario.Estado === true
                        )
                      }
                    />
                    <span className="slider round"></span>
                  </label>
                </td>
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
          <button>&lt;</button>
          <button>&gt;</button>
        </div>
      </main>

      {/* Modal de Agregar Usuario */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Agregar Usuario"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Agregar Usuario</h2>
        <form className="add-user-form" onSubmit={handleSubmit}>
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
