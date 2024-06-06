// models/Grupos_Estudiantes_Grupo.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Ajusta la ruta según tu configuración
const Grupo = require('./Grupo');
const Usuario = require('./Usuario'); // Asegúrate de tener este modelo definido

const Grupos_Estudiantes_Grupo = sequelize.define('Grupos_Estudiantes_Grupo', {
  Identificacion: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: '-',
    primaryKey: true,
    comment: 'Llave primaria de la tabla'
  },
  GrupoId: {
    type: DataTypes.MEDIUMINT.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    comment: 'Identificador del Grupo'
  },
  Estado: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 1,
    comment: 'Estado de Estudiante en el grupo'
  },
  UniversalUniqueIdentifier: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    defaultValue: 'UUID',
    comment: 'Identificador único universal. En este campo se debe almacenar el resultado de UUID()'
  },
  LastUpdate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    onUpdate: DataTypes.NOW,
    comment: 'Fecha de la última actualización de la fila'
  },
  LastUser: {
    type: DataTypes.STRING(200),
    allowNull: false,
    defaultValue: '-',
    comment: 'Último usuario que modificó la fila'
  }
}, {
  tableName: 'Grupos_Estudiantes_Grupo',
  timestamps: false
});
// Relaciones
Grupos_Estudiantes_Grupo.belongsTo(Grupo, {
  foreignKey: 'GrupoId',
  targetKey: 'GrupoId',
  onDelete: 'CASCADE'
});

Grupos_Estudiantes_Grupo.belongsTo(Usuario, {
  foreignKey: 'Identificacion',
  targetKey: 'Identificacion',
  onDelete: 'CASCADE'
});

module.exports = Grupos_Estudiantes_Grupo;
