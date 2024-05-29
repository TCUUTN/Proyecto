const pool = require('../config/db');
const Usuario = require('../models/Usuario');

const getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUsuarioPorCredenciales = async (req, res) => {
  try {
    const { CorreoElectronico, Contrasenna } = req.body; // Suponiendo que estás enviando los parámetros en el cuerpo de la solicitud

    // Buscar un usuario que coincida con el correo electrónico y la contraseña proporcionados
    const usuario = await Usuario.findOne({
      where: {
        CorreoElectronico: CorreoElectronico,
        Contrasenna: Contrasenna
      }
    });

    // Si se encuentra un usuario, devolverlo en la respuesta
    if (usuario) {
      res.json(usuario);
    } else {
      // Si no se encuentra ningún usuario que coincida, devolver un mensaje de error
      res.status(401).json({ error: 'Usuario o contraseña inválida' });
    }
  } catch (err) {
    // Manejo de errores
    res.status(500).json({ error: err.message });
  }
};

  module.exports = {
    getAllUsuarios,
    getUsuarioPorCredenciales
  };