const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 
const SolicitudCarta = require('./SolicitudCarta'); // Asegúrate de ajustar la ruta según la ubicación de tu modelo SolicitudCarta
const Usuario = require('./Usuario'); // Asegúrate de ajustar la ruta según la ubicación de tu modelo Usuario

// Definir el modelo de Socios_EstudiantesCarta
const EstudiantesCarta = sequelize.define('Socios_EstudiantesCarta', {
  SolicitudId: {
    type: DataTypes.MEDIUMINT.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    comment: 'Llave foránea hacia Socios_SolicitudCarta'
  },
  Identificacion: {
    type: DataTypes.STRING(20),
    allowNull: false,
    primaryKey: true,
    defaultValue: '-',
    comment: 'Identificación del estudiante que solicita la carta'
  },
  UniversalUniqueIdentifier: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
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
  tableName: 'Socios_EstudiantesCarta', // Nombre de la tabla en la base de datos
  timestamps: false // Indica que Sequelize no manejará automáticamente las columnas de timestamps
});

// Relaciones
EstudiantesCarta.belongsTo(SolicitudCarta, {
  foreignKey: 'SolicitudId',
  targetKey: 'SolicitudId',
  onDelete: 'CASCADE'
});

EstudiantesCarta.belongsTo(Usuario, {
  foreignKey: 'Identificacion',
  targetKey: 'Identificacion',
  onDelete: 'CASCADE'
});

// Exportar el modelo para poder utilizarlo en otras partes de la aplicación
module.exports = EstudiantesCarta;
