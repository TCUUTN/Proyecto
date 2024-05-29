// Importar Sequelize y la conexión a la base de datos
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Ajusta la ruta según la ubicación de tu archivo de configuración de la base de datos

// Definir el modelo de Usuarios
const Usuario = sequelize.define('Usuario', {
  Identificacion: {
    type: DataTypes.STRING(20),
    allowNull: false,
    primaryKey: true,
    defaultValue: '-',
    comment: 'Llave primaria de la tabla'
  },
  Nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: '-',
    comment: 'Nombre'
  },
  Apellido1: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: '-',
    comment: 'Primer apellido'
  },
  Apellido2: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: '-',
    comment: 'Segundo apellido'
  },
  Genero: {
    type: DataTypes.ENUM('Masculino', 'Femenino', 'Indefinido'),
    allowNull: false,
    defaultValue: 'Indefinido',
    comment: 'Género de la persona'
  },
  CorreoElectronico: {
    type: DataTypes.STRING(250),
    allowNull: false,
    defaultValue: '-',
    comment: 'Correo electrónico'
  },
  RolUsuario: {
    type: DataTypes.ENUM('Academico', 'Administrativo', 'Estudiante'),
    allowNull: false,
    defaultValue: 'Estudiante',
    comment: 'Rol de usuario'
  },
  Contrasenna: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: '-',
    comment: 'Contraseña'
  },
  Estado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: 'Estado de Usuario'
  },
  TipoIdentificacion: {
    type: DataTypes.ENUM('Cedula', 'Dimex', 'Pasaporte'),
    allowNull: false,
    defaultValue: 'Cedula',
    comment: 'Tipo de identificación'
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
  tableName: 'Usuarios', // Nombre de la tabla en la base de datos (si difiere del nombre del modelo)
  timestamps: false // Indica que Sequelize no manejará automáticamente las columnas de timestamps
});

// Exportar el modelo para poder utilizarlo en otras partes de la aplicación
module.exports = Usuario;
