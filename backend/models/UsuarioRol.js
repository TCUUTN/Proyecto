// Importar Sequelize y la conexión a la base de datos
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Rol = require('./Rol');
const Usuario = require('./Usuario')

// Definir el modelo de Usuarios_Roles
const UsuarioRoles = sequelize.define('Usuarios_Roles', {
  Identificacion: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: '-',
    primaryKey: true,
    comment: 'Usuario al que se le va a asignar el Rol'
  },
  RolId: {
    type: DataTypes.MEDIUMINT.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    comment: 'Identificador del Rol'
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
  timestamps: false // Indica que Sequelize no manejará automáticamente las columnas de timestamps
});


// Definir las asociaciones después de definir los modelos
Rol.hasMany(UsuarioRoles, { foreignKey: 'RolId' });
UsuarioRoles.belongsTo(Rol, { foreignKey: 'RolId' });

// Definir las asociaciones después de definir los modelos
Usuario.hasMany(UsuarioRoles, { foreignKey: 'Identificacion' });
UsuarioRoles.belongsTo(Usuario, { foreignKey: 'Identificacion' });

// Exportar el modelo para poder utilizarlo en otras partes de la aplicación
module.exports = UsuarioRoles;
