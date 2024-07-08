const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Ajusta la ruta según tu configuración
const Grupo = require('./Grupo');
const Usuario = require('./Usuario'); // Asegúrate de tener este modelo definido

const Conclusion_Boleta = sequelize.define('Conclusion_Boleta', {
  ConclusionId: {
    type: DataTypes.MEDIUMINT.UNSIGNED,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    comment: 'Llave primaria de la tabla'
  },
  Identificacion: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: '-',
    comment: 'Identificacion del estudiante que completa el formulario',
    references: {
      model: Usuario,
      key: 'Identificacion'
    }
  },
  GrupoId: {
    type: DataTypes.MEDIUMINT.UNSIGNED,
    allowNull: false,
    comment: 'Identificador del Grupo',
    references: {
      model: Grupo,
      key: 'GrupoId'
    }
  },
  Labor1: {
    type: DataTypes.STRING(500),
    allowNull: false,
    defaultValue: '-',
    comment: 'Labor 1'
  },
  Labor2: {
    type: DataTypes.STRING(500),
    allowNull: false,
    defaultValue: '-',
    comment: 'Labor 2'
  },
  Labor3: {
    type: DataTypes.STRING(500),
    allowNull: false,
    defaultValue: '-',
    comment: 'Labor 3'
  },
  Labor4: {
    type: DataTypes.STRING(500),
    allowNull: false,
    defaultValue: '-',
    comment: 'Labor 4'
  },
  Labor5: {
    type: DataTypes.STRING(500),
    allowNull: false,
    defaultValue: '-',
    comment: 'Labor 5'
  },
  Labor6: {
    type: DataTypes.STRING(500),
    allowNull: false,
    defaultValue: '-',
    comment: 'Labor 6'
  },
  Comentarios: {
    type: DataTypes.STRING(500),
    allowNull: false,
    defaultValue: '-',
    comment: 'Comentarios'
  },
  EstadoBoleta: {
    type: DataTypes.ENUM('En Proceso', 'Aprobado', 'Rechazado'),
    allowNull: false,
    defaultValue: 'En Proceso',
    comment: 'Estado de la Boleta del Estudiante'
  },
  MotivoRechazo: {
    type: DataTypes.STRING(250),
    allowNull: false,
    defaultValue: '-',
    comment: 'Comentarios de Reprobado'
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
  tableName: 'Conclusion_Boleta',
  timestamps: false
});

// Relaciones
Conclusion_Boleta.belongsTo(Grupo, {
  foreignKey: 'GrupoId',
  targetKey: 'GrupoId',
  onDelete: 'CASCADE'
});

Conclusion_Boleta.belongsTo(Usuario, {
  foreignKey: 'Identificacion',
  targetKey: 'Identificacion',
  onDelete: 'CASCADE'
});

module.exports = Conclusion_Boleta;
