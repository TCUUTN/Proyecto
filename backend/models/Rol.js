// Importar Sequelize y la conexión a la base de datos
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Ajusta la ruta según la ubicación de tu archivo de configuración de la base de datos



// Definir el modelo de Roles
const Rol = sequelize.define('Rol', {
  RolId: {
    type: DataTypes.MEDIUMINT.UNSIGNED,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    comment: 'Llave primaria de la tabla'
  },
  NombreRol: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: '-',
    comment: 'Nombre'
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
  tableName: 'Roles', // Nombre de la tabla en la base de datos (si difiere del nombre del modelo)
  timestamps: false // Indica que Sequelize no manejará automáticamente las columnas de timestamps
});



// Exportar el modelo para poder utilizarlo en otras partes de la aplicación
module.exports = Rol;
