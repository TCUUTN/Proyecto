const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Ajusta la ruta según tu configuración
const Grupo = require('./Grupo');
const Usuario = require('./Usuario'); // Asegúrate de tener este modelo definido

const Informacion = sequelize.define('Informacion', {
  InformacionId: {
    type: DataTypes.MEDIUMINT.UNSIGNED,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    comment: 'Llave primaria de la tabla'
  },
  Archivo: {
    type: DataTypes.BLOB('long'),
    allowNull: true,
    comment: 'Archivo'
  },
  NombreArchivo: {
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: '-',
    comment: 'Nombre del Archivo',
    collate: 'utf8_spanish_ci'
  },
  Identificacion: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: '-',
    comment: 'Identificacion de quien sube la informacion',
    references: {
      model: Usuario,
      key: 'Identificacion'
    },
    collate: 'utf8_spanish_ci'
  },
  Descripcion: {
    type: DataTypes.STRING(500),
    allowNull: false,
    defaultValue: '-',
    comment: 'Descripcion',
    collate: 'utf8_spanish_ci'
  },
  TipoInformacion: {
    type: DataTypes.ENUM('General', 'Académico', 'Plantilla'),
    allowNull: false,
    defaultValue: 'Académico',
    comment: 'Tipo de informacion',
    collate: 'utf8_spanish_ci'
  },
  Fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: '0000-00-00',
    comment: 'Fecha de ejecucion'
  },
  Sede: {
    type: DataTypes.ENUM('Central', 'Atenas', 'Guanacaste', 'Pacífico', 'San Carlos', 'C.F.P.T.E.', 'Todas'),
    allowNull: false,
    defaultValue: 'Central',
    comment: 'Sede del Usuario',
    collate: 'utf8_spanish_ci'
  },
  GrupoId: {
    type: DataTypes.MEDIUMINT.UNSIGNED,
    allowNull: false,
    defaultValue: 0

  },
  Estado: {
    type: DataTypes.TINYINT(1),
    allowNull: false,
    defaultValue: 1,
    comment: 'Estado de Informacion',
    collate: 'utf8_spanish_ci'
  },
  UniversalUniqueIdentifier: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
    comment: 'Identificador único universal. En este campo se debe almacenar el resultado de UUID()',
    collate: 'utf8_spanish_ci'
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
    comment: 'Último usuario que modificó la fila',
    collate: 'utf8_spanish_ci'
  }
}, {
  tableName: 'Informacion',
  timestamps: false
});


Informacion.belongsTo(Usuario, {
  foreignKey: 'Identificacion',
  targetKey: 'Identificacion',
  onDelete: 'CASCADE'
});

module.exports = Informacion;
