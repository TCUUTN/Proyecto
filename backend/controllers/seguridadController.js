const pool = require('../config/db');

const getAllUsuarios = async (req, res) => {
    try {
      const rows = await pool.query('SELECT * FROM usuarios');
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  module.exports = {
    getAllUsuarios
  };