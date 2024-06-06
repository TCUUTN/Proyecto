// Importar Sequelize y la conexión a la base de datos
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Ajusta la ruta según la ubicación de tu archivo de configuración de la base de datos

const Grupos_TipoGrupo = sequelize.define('Grupos_TipoGrupo', {
  CodigoMateria: {
    type: DataTypes.STRING(10),
    allowNull: false,
    defaultValue: '-',
    primaryKey: true,
    comment: 'Llave primaria de la tabla'
  },
  NombreProyecto: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: '-',
    comment: 'Nombre del proyecto'
  },
  TipoCurso: {
    type: DataTypes.ENUM('Presencial', 'Vitual', 'Hibrido'),
    allowNull: false,
    defaultValue: 'Presencial',
    comment: 'Modalidad del curso'
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
  tableName: 'Grupos_TipoGrupo',
  timestamps: false
});

module.exports = Grupos_TipoGrupo;
