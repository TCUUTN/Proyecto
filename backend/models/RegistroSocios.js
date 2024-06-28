const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 
const Usuario = require('./Usuario'); // Asegúrate de ajustar la ruta según la ubicación de tu modelo Usuario

// Definir el modelo de Socios_RegistroSocios
const RegistroSocios = sequelize.define('Socios_RegistroSocios', {
  SocioId: {
    type: DataTypes.MEDIUMINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
    comment: 'Llave primaria de la tabla'
  },
  NombreSocio: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: '-',
    comment: 'Nombre del socio Comunitario o Institucion'
  },
  CorreoElectronicoSocio: {
    type: DataTypes.STRING(250),
    allowNull: false,
    defaultValue: '-',
    comment: 'Correo electrónico Socio'
  },
  TelefonoSocio: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: '-',
    comment: 'Telefono del Socio'
  },
  TipoInstitucion: {
    type: DataTypes.STRING(250),
    allowNull: false,
    defaultValue: '-',
    comment: 'Tipo de Institucion'
  },
  DireccionSocio: {
    type: DataTypes.STRING(250),
    allowNull: false,
    defaultValue: '-',
    comment: 'Direccion del socio Comunitario o Institucion'
  },
  UbicacionGPS: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: '-',
    comment: 'Coordenadas del socio Comunitario o Institucion'
  },
  NombreCompletoContacto: {
    type: DataTypes.STRING(150),
    allowNull: false,
    defaultValue: '-',
    comment: 'Nombre completo del contacto'
  },
  Puesto: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: '-',
    comment: 'Puesto del contacto'
  },
  CorreoElectronicoContacto: {
    type: DataTypes.STRING(250),
    allowNull: false,
    defaultValue: '-',
    comment: 'Correo electrónico Contacto'
  },
  TelefonoContacto: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: '-',
    comment: 'Telefono del Socio'
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
  Estado: {
    type: DataTypes.TINYINT(1),
    allowNull: false,
    defaultValue: 1,
    comment: 'Estado del Socio'
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
  tableName: 'Socios_RegistroSocios', // Nombre de la tabla en la base de datos
  timestamps: false // Indica que Sequelize no manejará automáticamente las columnas de timestamps
});

// Relaciones
RegistroSocios.belongsTo(Usuario, {
  foreignKey: 'Identificacion',
  targetKey: 'Identificacion',
  onDelete: 'CASCADE'
});

// Exportar el modelo para poder utilizarlo en otras partes de la aplicación
module.exports = RegistroSocios;
