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

  module.exports = {
    getAllUsuarios
  };