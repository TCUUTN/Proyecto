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
import { Link } from "react-router-dom";

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
        <Link to="/ModeU">Model</Link>
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
