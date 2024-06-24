// Importar Sequelize y la conexión a la base de datos
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 
const Usuario = require('./Usuario'); 
const Grupo = require('./Grupo'); 

// Definir el modelo de Horas_Bitacora
const HorasBitacora = sequelize.define('Horas_Bitacora', {
  BitacoraId: {
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
    comment: 'Identificación del Estudiante que está subiendo las horas'
  },
  GrupoId: {
    type: DataTypes.MEDIUMINT.UNSIGNED,
    allowNull: false,
    comment: 'Llave foránea hacia Grupos_Grupo'
  },
  Fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: '0000-00-00',
    comment: 'Fecha de ejecución'
  },
  DescripcionActividad: {
    type: DataTypes.STRING(500),
    allowNull: false,
    defaultValue: '-',
    comment: 'Estado de Estudiante en el grupo'
  },
  TipoActividad: {
    type: DataTypes.ENUM('Planificacion', 'Ejecucion', 'Gira'),
    allowNull: false,
    defaultValue: 'Ejecucion',
    comment: 'Tipo de horas a registrar'
  },
  HoraInicio: {
    type: DataTypes.TIME,
    allowNull: false,
    defaultValue: '00:00:00',
    comment: 'Hora de Inicio'
  },
  HoraFinal: {
    type: DataTypes.TIME,
    allowNull: false,
    defaultValue: '00:00:00',
    comment: 'Hora de Finalización'
  },
  Evidencias: {
    type: DataTypes.BLOB('long'),
    allowNull: true,
    comment: 'Archivos de Evidencias'
  },
  EstadoHoras: {
    type: DataTypes.ENUM('Aprobado', 'Rechazado'),
    allowNull: false,
    defaultValue: 'Aprobado',
    comment: 'Estado de las horas'
  },
  ComentariosRechazo: {
    type: DataTypes.STRING(250),
    allowNull: false,
    defaultValue: '-',
    comment: 'Comentarios de Rechazo'
  },
  NombreEvidencia: {
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: '-',
    comment: 'Comentarios de Rechazo'
  },
  UniversalUniqueIdentifier: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    defaultValue: sequelize.fn('UUID'),
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
  tableName: 'Horas_Bitacora', // Nombre de la tabla en la base de datos (si difiere del nombre del modelo)
  timestamps: false // Indica que Sequelize no manejará automáticamente las columnas de timestamps
  
});

// Relaciones
HorasBitacora.belongsTo(Grupo, {
  foreignKey: 'GrupoId',
  targetKey: 'GrupoId',
  onDelete: 'CASCADE'
});

HorasBitacora.belongsTo(Usuario, {
  foreignKey: 'Identificacion',
  targetKey: 'Identificacion',
  onDelete: 'CASCADE'
});

// Exportar el modelo para poder utilizarlo en otras partes de la aplicación
module.exports = HorasBitacora;
