// Importar Sequelize y la conexión a la base de datos
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 
const Usuario = require('./Usuario'); 
const TipoGrupo = require('./TipoGrupo'); 

// Definir el modelo de Grupos_Grupo
const Grupo = sequelize.define('Grupo', {
  GrupoId: {
    type: DataTypes.MEDIUMINT.UNSIGNED,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    comment: 'Llave primaria de la tabla'
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
  Sede: {
    type: DataTypes.ENUM('Central', 'Atenas', 'Guanacaste', 'Pacífico', 'San Carlos', 'C.F.P.T.E.', 'Todas'),
    allowNull: false,
    defaultValue: 'Central',
    comment: 'Sede en la que se imparte el curso'
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
    comment: 'Identificación del Académico a cargo del grupo'
  },
  Estado: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 1,
    comment: 'Estado de Grupo'
  },
  BanderaFinalizarCuatrimestre : {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0,
    comment: 'Bandera para activar Finalizacion del Cuatrimestre'
  },
  UniversalUniqueIdentifier: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    defaultValue: 'UUID',
    comment: 'Identificador único universal. En este campo se debe almacenar el resultado de UUID()'
  },
  LastUpdate: {
    type: DataTypes.DATE(4),
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
  tableName: 'Grupos_Grupo', // Nombre de la tabla en la base de datos (si difiere del nombre del modelo)
  timestamps: false // Indica que Sequelize no manejará automáticamente las columnas de timestamps
});



// Relaciones
Grupo.belongsTo(TipoGrupo, {
  foreignKey: 'CodigoMateria',
  targetKey: 'CodigoMateria',
  onDelete: 'CASCADE'
});

Grupo.belongsTo(Usuario, {
    foreignKey: 'Identificacion',
    targetKey: 'Identificacion',
    onDelete: 'CASCADE'
  });

// Exportar el modelo para poder utilizarlo en otras partes de la aplicación
module.exports = Grupo;
