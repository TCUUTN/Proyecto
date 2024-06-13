// Importar Sequelize y la conexión a la base de datos
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
 

// Definir el modelo de Usuarios
const Usuario = sequelize.define('Usuarios', {
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
  CarreraEstudiante: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: '-',
    comment: 'Carrera del Estudiante'
  },
  Genero: {
    type: DataTypes.ENUM('Masculino', 'Femenino', 'Prefiero no Especificar', 'Indefinido'),
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
  Contrasenna: {
    type: DataTypes.STRING(60),
    allowNull: false,
    defaultValue: '-',
    comment: 'Contraseña'
  },
  Estado: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 1,
    comment: 'Estado de Usuario'
  },
  Sede: {
    type: DataTypes.ENUM('Central', 'Atenas', 'Guanacaste', 'Pacífico', 'San Carlos', 'C.F.P.T.E.', 'Todas'),
    allowNull: false,
    defaultValue: 'Central',
    comment: 'Sede del Usuario'
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
  tableName: 'Usuarios', // Nombre de la tabla en la base de datos
  timestamps: false // Indica que Sequelize no manejará automáticamente las columnas de timestamps
});


// Exportar el modelo para poder utilizarlo en otras partes de la aplicación
module.exports = Usuario;