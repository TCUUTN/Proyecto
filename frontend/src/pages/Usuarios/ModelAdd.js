// ModalForm.js
import React from 'react';
import "./Usuario.modulo.css";

function ModalAdd({ nuevoUsuario, handleChange, handleSubmit, closeModal }) {
  return (
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

      <label htmlFor="tipoIdentificacion">Tipo Identificación:</label>
      <select
        id="tipoIdentificacion"
        name="TipoIdentificacion"
        value={nuevoUsuario.TipoIdentificacion}
        onChange={handleChange}
        required
      >
        <option value="">Seleccione</option>
        <option value="cedula">Cédula</option>
        <option value="pasaporte">Pasaporte</option>
      </select>

      <button type="submit">Guardar</button>
      <button type="button" onClick={closeModal}>Cancelar</button>
    </form>
  );
}

export default ModalAdd;
