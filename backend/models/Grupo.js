// Importar Sequelize y la conexión a la base de datos
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Ajusta la ruta según la ubicación de tu archivo de configuración de la base de datos
const TipoGrupo = require('./TipoGrupo');
const Usuario = require('./Usuario'); // Asegúrate de tener este modelo definido

const Grupos_Grupo = sequelize.define('Grupos_Grupo', {
  GrupoId: {
    type: DataTypes.MEDIUMINT.UNSIGNED,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  CodigoMateria: {
    type: DataTypes.STRING(10),
    allowNull: false,
    defaultValue: '-',
    comment: 'Llave primaria de la tabla'
  },
  NumeroGrupo: {
    type: DataTypes.SMALLINT,
    allowNull: false,
    defaultValue: 0,
    comment: 'Numero de Grupo'
  },
  Horario: {
    type: DataTypes.STRING(30),
    allowNull: false,
    defaultValue: '-',
    comment: 'Horario del Curso'
  },
  Aula: {
    type: DataTypes.STRING(15),
    allowNull: false,
    defaultValue: '-',
    comment: 'Aula del Curso'
  },
  Cuatrimestre: {
    type: DataTypes.SMALLINT,
    allowNull: false,
    defaultValue: 0,
    comment: 'Cuatrimestre del Curso'
  },
  Anno: {
    type: DataTypes.SMALLINT,
    allowNull: false,
    defaultValue: 0,
    comment: 'Año del curso'
  },
  Identificacion: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: '-',
    comment: 'Llave primaria de la tabla'
  },
  Estado: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 1,
    comment: 'Estado de Grupo'
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
  tableName: 'Grupos_Grupo',
  timestamps: false
});

// Relaciones
Grupos_Grupo.belongsTo(TipoGrupo, {
  foreignKey: 'CodigoMateria',
  targetKey: 'CodigoMateria',
  onDelete: 'CASCADE'
});

Grupos_Grupo.belongsTo(Usuario, {
    foreignKey: 'Identificacion',
    targetKey: 'Identificacion',
    onDelete: 'CASCADE'
  });

module.exports = Grupos_Grupo;
