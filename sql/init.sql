CREATE DATABASE IF NOT EXISTS bitacora_tcu;
USE bitacora_tcu;

CREATE TABLE Usuarios(
  `Identificacion` VARCHAR(20) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Llave primaria de la tabla',
  `Nombre` VARCHAR(50) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Nombre',
  `Apellido1` VARCHAR(50) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Primer apellido',
  `Apellido2` VARCHAR(50) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Segundo apellido',
  `CarreraEstudiante` VARCHAR(100) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Carrera del Estudiante',
  `Genero` ENUM('Masculino', 'Femenino','Prefiero no Especificar', 'Indefinido') COLLATE utf8_spanish_ci NOT NULL DEFAULT 'Indefinido' COMMENT 'Género de la persona',
  `CorreoElectronico` VARCHAR(250) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Correo electrónico',
  `Contrasenna` VARCHAR(60) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Contrasena',
  `Estado` TinyInt(1) COLLATE utf8_spanish_ci NOT NULL DEFAULT '1' COMMENT 'Estado de Usuario',
  `Sede` ENUM('Central', 'Atenas', 'Guanacaste','Pacífico','San Carlos', 'C.F.P.T.E.', 'Todas') COLLATE utf8_spanish_ci NOT NULL DEFAULT 'Central' COMMENT 'Sede del Usuario',
  `UniversalUniqueIdentifier` CHAR(36) COLLATE utf8_spanish_ci NOT NULL DEFAULT 'UUID' COMMENT 'Identificador único universal. En este campo se debe almacenar el resultado de UUID()',
  `LastUpdate` TIMESTAMP(4) NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP() COMMENT 'Fecha de la última actualización de la fila',
  `LastUser` VARCHAR(200) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Último usuario que modificó la fila',
  PRIMARY KEY (`Identificacion`)
);

CREATE TABLE Roles (
    `RolId` MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `NombreRol` VARCHAR(50) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Nombre',
	`UniversalUniqueIdentifier` CHAR(36) COLLATE utf8_spanish_ci NOT NULL DEFAULT 'UUID' COMMENT 'Identificador único universal. En este campo se debe almacenar el resultado de UUID()',
	`LastUpdate` TIMESTAMP(4) NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP() COMMENT 'Fecha de la última actualización de la fila',
	`LastUser` VARCHAR(200) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Último usuario que modificó la fila',
    PRIMARY KEY (`RolId`)
);

INSERT INTO Roles (NombreRol) VALUES
('Administrativo'),
('Académico'),
('Estudiante');

CREATE TABLE Usuarios_Roles (
	`Identificacion` VARCHAR(20) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Usuario al que se le va a asignar el Rol',
    `RolId` MEDIUMINT UNSIGNED NOT NULL,
    `UniversalUniqueIdentifier` CHAR(36) COLLATE utf8_spanish_ci NOT NULL DEFAULT 'UUID' COMMENT 'Identificador único universal. En este campo se debe almacenar el resultado de UUID()',
	`LastUpdate` TIMESTAMP(4) NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP() COMMENT 'Fecha de la última actualización de la fila',
	`LastUser` VARCHAR(200) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Último usuario que modificó la fila',
	PRIMARY KEY (Identificacion, RolId),
	CONSTRAINT `Usuarios_Roles_Roles_RolId` FOREIGN KEY (`RolId`) REFERENCES `bitacora_TCU`.`Roles` (`RolId`),
	CONSTRAINT `Usuarios_Roles_Usuarios_Identificacion` FOREIGN KEY (`Identificacion`) REFERENCES `bitacora_TCU`.`Usuarios` (`Identificacion`)
);


create table Grupos_TipoGrupo(
`CodigoMateria` VARCHAR(10) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Llave primaria de la tabla',
`NombreProyecto` VARCHAR(100) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Nombre del proyecto',
`TipoCurso` ENUM('Presencial', 'Virtual', 'Hibrido') COLLATE utf8_spanish_ci NOT NULL DEFAULT 'Presencial' COMMENT 'Modalidad del curso',
`UniversalUniqueIdentifier` CHAR(36) COLLATE utf8_spanish_ci NOT NULL DEFAULT 'UUID' COMMENT 'Identificador único universal. En este campo se debe almacenar el resultado de UUID()',
`LastUpdate` TIMESTAMP(4) NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP() COMMENT 'Fecha de la última actualización de la fila',
`LastUser` VARCHAR(200) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Último usuario que modificó la fila',
PRIMARY KEY (`CodigoMateria`)
);

CREATE TABLE Grupos_Grupo (
    `GrupoId` MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `CodigoMateria` VARCHAR(10) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Llave primaria de la tabla',
    `NumeroGrupo` SMALLINT NOT NULL DEFAULT '0' COMMENT 'Numero de Grupo',
    `Horario` VARCHAR(30) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Horario del Curso',
    `Aula` VARCHAR(15) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Aula del Curso',
	`Sede` ENUM('Central', 'Atenas', 'Guanacaste','Pacífico','San Carlos', 'C.F.P.T.E.', 'Todas') COLLATE utf8_spanish_ci NOT NULL DEFAULT 'Central' COMMENT 'Sede en la que se imparte el curso',
    `Cuatrimestre` smallint COLLATE utf8_spanish_ci NOT NULL DEFAULT '0' COMMENT 'Cuatrimesre del Curso',
    `Anno` smallint COLLATE utf8_spanish_ci NOT NULL DEFAULT '0' COMMENT 'Año del curso',
    `Identificacion` VARCHAR(20) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Identicacion del Academico a cargo del grupo',
    `Estado` TinyInt(1) COLLATE utf8_spanish_ci NOT NULL DEFAULT '1' COMMENT 'Estado de Grupo',
    `BanderaFinalizarCuatrimestre` TinyInt(1) COLLATE utf8_spanish_ci NOT NULL DEFAULT '0' COMMENT 'Bandera para activar Finalizacion del Cuatrimestre',
    `UniversalUniqueIdentifier` CHAR(36) COLLATE utf8_spanish_ci NOT NULL DEFAULT 'UUID' COMMENT 'Identificador único universal. En este campo se debe almacenar el resultado de UUID()',
    `LastUpdate` TIMESTAMP(4) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de la última actualización de la fila',
    `LastUser` VARCHAR(200) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Último usuario que modificó la fila',
    PRIMARY KEY (`GrupoId`),
    CONSTRAINT `Usuarios_Grupos_Grupo_Identificacion` FOREIGN KEY (`Identificacion`) REFERENCES `bitacora_TCU`.`Usuarios` (`Identificacion`),
    CONSTRAINT `Grupos_TipoGrupo_Grupos_Grupo_CodigoMateria` FOREIGN KEY (`CodigoMateria`) REFERENCES `bitacora_TCU`.`Grupos_TipoGrupo` (`CodigoMateria`)
);

CREATE TABLE Grupos_Estudiantes_Grupo (
    `Identificacion` VARCHAR(20) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Llave primaria de la tabla',
    `GrupoId` MEDIUMINT UNSIGNED NOT NULL,
	`Estado` ENUM('En Curso', 'Aprobado', 'Reprobado') COLLATE utf8_spanish_ci NOT NULL DEFAULT 'En Curso' COMMENT 'Estado de Estudiante en el grupo',
    `Progreso` ENUM('Nuevo', 'Continuidad', 'Prórroga') COLLATE utf8_spanish_ci NOT NULL DEFAULT 'Nuevo' COMMENT 'Progreso del Estudiante en el grupo',
	`ComentariosReprobado` Varchar(250) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Comentarios de Reprobado',
    `UniversalUniqueIdentifier` CHAR(36) COLLATE utf8_spanish_ci NOT NULL DEFAULT 'UUID' COMMENT 'Identificador único universal. En este campo se debe almacenar el resultado de UUID()',
	`LastUpdate` TIMESTAMP(4) NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP() COMMENT 'Fecha de la última actualización de la fila',
	`LastUser` VARCHAR(200) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Último usuario que modificó la fila',
    CONSTRAINT `Usuarios_Grupos_Estudiantes_Grupo_Identificacion` FOREIGN KEY (`Identificacion`) REFERENCES `bitacora_TCU`.`Usuarios` (`Identificacion`),
	CONSTRAINT `Grupos_Grupo_Grupos_Estudiantes_Grupo_GrupoId` FOREIGN KEY (`GrupoId`) REFERENCES `bitacora_TCU`.`Grupos_Grupo` (`GrupoId`)
);

CREATE TABLE Horas_Bitacora (
	`BitacoraId` MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `Identificacion` VARCHAR(20) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Identificacion del Estudiante que esta subiendo las horas',
    `GrupoId` MEDIUMINT UNSIGNED NOT NULL,
    `Fecha` DATE NOT NULL DEFAULT '0000-00-00' COMMENT 'Fecha de ejecucion',
    `DescripcionActividad` Varchar(500) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Estado de Estudiante en el grupo',
    `TipoActividad` ENUM('Planificacion', 'Ejecucion', 'Gira') COLLATE utf8_spanish_ci NOT NULL DEFAULT 'Ejecucion' COMMENT 'Tipo de horas a registrar',
    `HoraInicio` Time NOT NULL DEFAULT '00:00:00' COMMENT 'Hora de Inicio',
    `HoraFinal` Time NOT NULL DEFAULT '00:00:00' COMMENT 'Hora de Finalizacion',
    `Evidencias` longblob NULL COMMENT 'Archivos de Evidencias',
	`NombreEvidencia` VARCHAR(255) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Nombre de la Evidencia',
    `EstadoHoras` ENUM('Aprobado', 'Rechazado') COLLATE utf8_spanish_ci NOT NULL DEFAULT 'Aprobado' COMMENT 'Estado de las horas',
	`ComentariosRechazo` Varchar(250) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Comentarios de Rechazo',
	`UniversalUniqueIdentifier` CHAR(36) COLLATE utf8_spanish_ci NOT NULL DEFAULT 'UUID' COMMENT 'Identificador único universal. En este campo se debe almacenar el resultado de UUID()',
	`LastUpdate` TIMESTAMP(4) NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP() COMMENT 'Fecha de la última actualización de la fila',
	`LastUser` VARCHAR(200) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Último usuario que modificó la fila',
	PRIMARY KEY (`BitacoraId`),
    CONSTRAINT `Horas_Bitacora_Grupos_Grupo_GrupoId` FOREIGN KEY (`GrupoId`) REFERENCES `bitacora_TCU`.`Grupos_Grupo` (`GrupoId`),
    CONSTRAINT `Usuarios_Horas_Bitacora_Identificacion` FOREIGN KEY (`Identificacion`) REFERENCES `bitacora_TCU`.`Usuarios` (`Identificacion`)
);

CREATE TABLE Socios_RegistroSocios (
`SocioId` MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,
`NombreSocio` VARCHAR(100) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Nombre del socio Comunitario o Institucion',
`CorreoElectronicoSocio` VARCHAR(250) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Correo electrónico Socio',
`TelefonoSocio` VARCHAR(20) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Telefono del Socio',
`TipoInstitucion` VARCHAR(250) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Tipo de Institucion',
`DireccionSocio` VARCHAR(250) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Direccion del socio Comunitario o Institucion',
`UbicacionGPS` VARCHAR(100) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Coordenadas del socio Comunitario o Institucion',
`NombreCompletoContacto` VARCHAR(150) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Nombre completo del contacto',
`Puesto` VARCHAR(50) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Puesto del contacto',
`CorreoElectronicoContacto` VARCHAR(250) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Correo electrónico Contacto',
`TelefonoContacto` VARCHAR(20) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Telefono del Socio',
`Estado` TinyInt(1) COLLATE utf8_spanish_ci NOT NULL DEFAULT '1' COMMENT 'Estado del Socio',
`UniversalUniqueIdentifier` CHAR(36) COLLATE utf8_spanish_ci NOT NULL DEFAULT 'UUID' COMMENT 'Identificador único universal. En este campo se debe almacenar el resultado de UUID()',
`LastUpdate` TIMESTAMP(4) NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP() COMMENT 'Fecha de la última actualización de la fila',
`LastUser` VARCHAR(200) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Último usuario que modificó la fila',
PRIMARY KEY (`SocioId`)
);

CREATE TABLE Socios_SolicitudCarta (
`SolicitudId` MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,
`SocioId` MEDIUMINT UNSIGNED NOT NULL,
`Carta` longblob NULL COMMENT 'Archivo de la carta',
`NombreCarta` VARCHAR(255) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Nombre de la Carta',
`Sede` ENUM('Central', 'Atenas', 'Guanacaste','Pacífico','San Carlos', 'C.F.P.T.E.', 'Todas') COLLATE utf8_spanish_ci NOT NULL DEFAULT 'Central' COMMENT 'Sede del Usuario',
`Identificacion` VARCHAR(20) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Identificacion del academico',
`UniversalUniqueIdentifier` CHAR(36) COLLATE utf8_spanish_ci NOT NULL DEFAULT 'UUID' COMMENT 'Identificador único universal. En este campo se debe almacenar el resultado de UUID()',
`LastUpdate` TIMESTAMP(4) NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP() COMMENT 'Fecha de la última actualización de la fila',
`LastUser` VARCHAR(200) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Último usuario que modificó la fila',
PRIMARY KEY (`SolicitudId`),
CONSTRAINT `Usuarios_Socios_SolicitudCarta_Identificacion` FOREIGN KEY (`Identificacion`) REFERENCES `bitacora_TCU`.`Usuarios` (`Identificacion`),
CONSTRAINT `Socios_RegistroSocios_Socios_SolicitudCarta_SocioId` FOREIGN KEY (`SocioId`) REFERENCES `bitacora_TCU`.`Socios_RegistroSocios` (`SocioId`)
);

CREATE TABLE Socios_EstudiantesCarta (
`SolicitudId` MEDIUMINT UNSIGNED NOT NULL,
`Identificacion` VARCHAR(20) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Identificacion del estudiante que solicita la carta',
`UniversalUniqueIdentifier` CHAR(36) COLLATE utf8_spanish_ci NOT NULL DEFAULT 'UUID' COMMENT 'Identificador único universal. En este campo se debe almacenar el resultado de UUID()',
`LastUpdate` TIMESTAMP(4) NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP() COMMENT 'Fecha de la última actualización de la fila',
`LastUser` VARCHAR(200) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Último usuario que modificó la fila',
PRIMARY KEY (Identificacion, SolicitudId),
CONSTRAINT `Socios_SolicitudCarta_Socios_EstudiantesCarta_SolicitudId` FOREIGN KEY (`SolicitudId`) REFERENCES `bitacora_TCU`.`Socios_SolicitudCarta` (`SolicitudId`),
CONSTRAINT `Usuarios_Socios_EstudiantesCarta_Identificacion` FOREIGN KEY (`Identificacion`) REFERENCES `bitacora_TCU`.`Usuarios` (`Identificacion`)
);

CREATE TABLE Conclusion_Boleta (
`ConclusionId` MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,
`Identificacion` VARCHAR(20) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Identificacion del estudiante que completa el formulario',
`GrupoId` MEDIUMINT UNSIGNED NOT NULL,
`Labor1` VARCHAR(500) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Labor 1',
`Labor2` VARCHAR(500) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Labor 2',
`Labor3` VARCHAR(500) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Labor 3',
`Labor4` VARCHAR(500) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Labor 4',
`Labor5` VARCHAR(500) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Labor 5',
`Labor6` VARCHAR(500) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Labor 6',
`Comentarios` VARCHAR(500) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Comentarios',
`EstadoBoleta` ENUM('En Proceso', 'Aprobado', 'Rechazado') COLLATE utf8_spanish_ci NOT NULL DEFAULT 'En Proceso' COMMENT 'Estado de la Boleta del Estudiante',
`MotivoRechazo` Varchar(250) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Comentarios de Reprobado',
`UniversalUniqueIdentifier` CHAR(36) COLLATE utf8_spanish_ci NOT NULL DEFAULT 'UUID' COMMENT 'Identificador único universal. En este campo se debe almacenar el resultado de UUID()',
`LastUpdate` TIMESTAMP(4) NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP() COMMENT 'Fecha de la última actualización de la fila',
`LastUser` VARCHAR(200) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Último usuario que modificó la fila',
PRIMARY KEY (`ConclusionId`),
CONSTRAINT `Conclusion_Boleta_Grupos_Grupo_GrupoId` FOREIGN KEY (`GrupoId`) REFERENCES `bitacora_TCU`.`Grupos_Grupo` (`GrupoId`),
CONSTRAINT `Usuarios_Conclusion_Boleta_Identificacion` FOREIGN KEY (`Identificacion`) REFERENCES `bitacora_TCU`.`Usuarios` (`Identificacion`)
);

CREATE TABLE Informacion (
    `InformacionId` MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `Archivo` LONGBLOB NULL COMMENT 'Archivo',
    `NombreArchivo` VARCHAR(255) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Nombre del Archivo',
    `Identificacion` VARCHAR(20) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Identificacion de quien sube la informacion',
    `Descripcion` VARCHAR(500) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Descripcion',
    `TipoInformacion` ENUM('General', 'Académico', 'Plantilla') COLLATE utf8_spanish_ci NOT NULL DEFAULT 'Académico' COMMENT 'Tipo de informacion',
    `Fecha` DATE NOT NULL DEFAULT '0000-00-00' COMMENT 'Fecha de ejecucion',
    `Sede` ENUM('Central', 'Atenas', 'Guanacaste', 'Pacífico', 'San Carlos', 'C.F.P.T.E.', 'Todas') COLLATE utf8_spanish_ci NOT NULL DEFAULT 'Central' COMMENT 'Sede del Usuario',
    `GrupoId` MEDIUMINT UNSIGNED NOT NULL DEFAULT 0,
    `Estado` TINYINT(1) COLLATE utf8_spanish_ci NOT NULL DEFAULT '1' COMMENT 'Estado de Informacion',
    `UniversalUniqueIdentifier` CHAR(36) COLLATE utf8_spanish_ci NOT NULL DEFAULT 'UUID' COMMENT 'Identificador único universal. En este campo se debe almacenar el resultado de UUID()',
    `LastUpdate` TIMESTAMP(4) NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP() COMMENT 'Fecha de la última actualización de la fila',
    `LastUser` VARCHAR(200) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Último usuario que modificó la fila',
    PRIMARY KEY (`InformacionId`),
    CONSTRAINT `Usuarios_Informacion_Identificacion` FOREIGN KEY (`Identificacion`) REFERENCES `bitacora_TCU`.`Usuarios` (`Identificacion`)
);

INSERT INTO Usuarios (
    Identificacion,
    Nombre,
    Apellido1,
    Apellido2,
    Genero,
    CorreoElectronico,
    Contrasenna,
    Estado,
    Sede
) VALUES (
    '001002003',
    'Admin',
    'Pruebas',
    'Total',
    'Prefiero no Especificar',
    'bitacoratcuutn@gmail.com',
    '-',
    1,
    'Todas'
);



INSERT INTO Usuarios_Roles (
	Identificacion,
    RolId)
    VALUES
    ('001002003',1),('001002003',2),('001002003',3);

