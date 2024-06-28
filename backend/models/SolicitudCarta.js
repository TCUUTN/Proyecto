const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 
const RegistroSocios = require('./RegistroSocios'); 
const Usuario = require('./Usuario');

// Definir el modelo de Socios_SolicitudCarta
const SolicitudCarta = sequelize.define('Socios_SolicitudCarta', {
  SolicitudId: {
    type: DataTypes.MEDIUMINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
    comment: 'Llave primaria de la tabla'
  },
  SocioId: {
    type: DataTypes.MEDIUMINT.UNSIGNED,
    allowNull: false,
    comment: 'Llave foránea hacia Socios_RegistroSocios'
  },
  Carta: {
    type: DataTypes.BLOB('long'),
    allowNull: true,
    comment: 'Archivo de la carta'
  },
  NombreCarta: {
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: '-',
    comment: 'Nombre de la Carta'
  },
  Sede: {
    type: DataTypes.ENUM('Central', 'Atenas', 'Guanacaste','Pacífico','San Carlos', 'C.F.P.T.E.', 'Todas'),
    allowNull: false,
    defaultValue: 'Central',
    comment: 'Sede del Usuario'
  },
  Identificacion: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: '-',
    comment: 'Identificacion del academico'
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
  tableName: 'Socios_SolicitudCarta', // Nombre de la tabla en la base de datos
  timestamps: false // Indica que Sequelize no manejará automáticamente las columnas de timestamps
});

// Relaciones
SolicitudCarta.belongsTo(RegistroSocios, {
  foreignKey: 'SocioId',
  targetKey: 'SocioId',
  onDelete: 'CASCADE'
});

SolicitudCarta.belongsTo(Usuario, {
    foreignKey: 'Identificacion',
    targetKey: 'Identificacion',
    onDelete: 'CASCADE'
  });

// Exportar el modelo para poder utilizarlo en otras partes de la aplicación
module.exports = SolicitudCarta;
