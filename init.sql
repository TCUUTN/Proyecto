-- Creación de la base de datos si no existe y uso de la misma
CREATE DATABASE IF NOT EXISTS bitacora_tcu CHARACTER SET utf8 COLLATE utf8_spanish_ci;
USE bitacora_tcu;

-- Creación de la tabla Usuarios
CREATE TABLE IF NOT EXISTS Usuarios (
  `Identificacion` VARCHAR(20) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Llave primaria de la tabla',
  `Nombre` VARCHAR(50) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Nombre',
  `Apellido1` VARCHAR(50) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Primer apellido',
  `Apellido2` VARCHAR(50) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Segundo apellido',
  `CarreraEstudiante` VARCHAR(100) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Carrera del Estudiante',
  `Genero` ENUM('Masculino', 'Femenino','Prefiero no Especificar', 'Indefinido') COLLATE utf8_spanish_ci NOT NULL DEFAULT 'Indefinido' COMMENT 'Género de la persona',
  `CorreoElectronico` VARCHAR(250) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Correo electrónico',
  `Contrasenna` VARCHAR(60) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Contraseña',
  `Estado` TINYINT(1) NOT NULL DEFAULT '1' COMMENT 'Estado de Usuario',
  `Sede` ENUM('Central', 'Atenas', 'Guanacaste','Pacífico','San Carlos', 'C.F.P.T.E.', 'Todas') COLLATE utf8_spanish_ci NOT NULL DEFAULT 'Central' COMMENT 'Sede del Usuario',
  `UniversalUniqueIdentifier` CHAR(36) COLLATE utf8_spanish_ci NOT NULL DEFAULT 'UUID' COMMENT 'Identificador único universal. En este campo se debe almacenar el resultado de UUID()',
  `LastUpdate` TIMESTAMP(4) NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP() COMMENT 'Fecha de la última actualización de la fila',
  `LastUser` VARCHAR(200) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Último usuario que modificó la fila',
  PRIMARY KEY (`Identificacion`)
);

-- Creación de la tabla Roles
CREATE TABLE IF NOT EXISTS Roles (
    `RolId` MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `NombreRol` VARCHAR(50) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Nombre del Rol',
    `UniversalUniqueIdentifier` CHAR(36) COLLATE utf8_spanish_ci NOT NULL DEFAULT 'UUID' COMMENT 'Identificador único universal. En este campo se debe almacenar el resultado de UUID()',
    `LastUpdate` TIMESTAMP(4) NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP() COMMENT 'Fecha de la última actualización de la fila',
    `LastUser` VARCHAR(200) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Último usuario que modificó la fila',
    PRIMARY KEY (`RolId`)
);

-- Inserción de roles iniciales
INSERT INTO Roles (NombreRol) VALUES
('Administrativo'),
('Académico'),
('Estudiante')
ON DUPLICATE KEY UPDATE NombreRol=VALUES(NombreRol);

-- Creación de la tabla Usuarios_Roles
CREATE TABLE IF NOT EXISTS Usuarios_Roles (
  `Identificacion` VARCHAR(20) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Usuario al que se le va a asignar el Rol',
  `RolId` MEDIUMINT UNSIGNED NOT NULL,
  `UniversalUniqueIdentifier` CHAR(36) COLLATE utf8_spanish_ci NOT NULL DEFAULT 'UUID' COMMENT 'Identificador único universal. En este campo se debe almacenar el resultado de UUID()',
  `LastUpdate` TIMESTAMP(4) NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP() COMMENT 'Fecha de la última actualización de la fila',
  `LastUser` VARCHAR(200) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Último usuario que modificó la fila',
  PRIMARY KEY (`Identificacion`, `RolId`),
  CONSTRAINT `Usuarios_Roles_Roles_RolId` FOREIGN KEY (`RolId`) REFERENCES `Roles` (`RolId`),
  CONSTRAINT `Usuarios_Roles_Usuarios_Identificacion` FOREIGN KEY (`Identificacion`) REFERENCES `Usuarios` (`Identificacion`)
);


-- Creación de la tabla Grupos_TipoGrupo
CREATE TABLE IF NOT EXISTS Grupos_TipoGrupo (
    `CodigoMateria` VARCHAR(10) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Llave primaria de la tabla',
    `NombreProyecto` VARCHAR(100) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Nombre del proyecto',
    `TipoCurso` ENUM('Presencial', 'Virtual', 'Hibrido') COLLATE utf8_spanish_ci NOT NULL DEFAULT 'Presencial' COMMENT 'Modalidad del curso',
    `UniversalUniqueIdentifier` CHAR(36) COLLATE utf8_spanish_ci NOT NULL DEFAULT 'UUID' COMMENT 'Identificador único universal. En este campo se debe almacenar el resultado de UUID()',
    `LastUpdate` TIMESTAMP(4) NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP() COMMENT 'Fecha de la última actualización de la fila',
    `LastUser` VARCHAR(200) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Último usuario que modificó la fila',
    PRIMARY KEY (`CodigoMateria`)
);

-- Creación de la tabla Grupos_Grupo
CREATE TABLE IF NOT EXISTS Grupos_Grupo (
    `GrupoId` MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `CodigoMateria` VARCHAR(10) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Código de la materia, llave foránea',
    `NumeroGrupo` SMALLINT NOT NULL DEFAULT '0' COMMENT 'Número de Grupo',
    `Horario` VARCHAR(30) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Horario del Curso',
    `Aula` VARCHAR(15) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Aula del Curso',
    `Sede` ENUM('Central', 'Atenas', 'Guanacaste','Pacífico','San Carlos', 'C.F.P.T.E.', 'Todas') COLLATE utf8_spanish_ci NOT NULL DEFAULT 'Central' COMMENT 'Sede en la que se imparte el curso',
    `Cuatrimestre` SMALLINT NOT NULL DEFAULT '0' COMMENT 'Cuatrimestre del Curso',
    `Anno` SMALLINT NOT NULL DEFAULT '0' COMMENT 'Año del curso',
    `Identificacion` VARCHAR(20) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Identificación del Académico a cargo del grupo, llave foránea',
    `Estado` TINYINT(1) NOT NULL DEFAULT '1' COMMENT 'Estado de Grupo',
    `BanderaFinalizarCuatrimestre` TINYINT(1) NOT NULL DEFAULT '0' COMMENT 'Bandera para activar Finalización del Cuatrimestre',
    `UniversalUniqueIdentifier` CHAR(36) COLLATE utf8_spanish_ci NOT NULL DEFAULT 'UUID' COMMENT 'Identificador único universal. En este campo se debe almacenar el resultado de UUID()',
    `LastUpdate` TIMESTAMP(4) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de la última actualización de la fila',
    `LastUser` VARCHAR(200) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Último usuario que modificó la fila',
    PRIMARY KEY (`GrupoId`),
    CONSTRAINT `Usuarios_Grupos_Grupo_Identificacion` FOREIGN KEY (`Identificacion`) REFERENCES `Usuarios` (`Identificacion`),
    CONSTRAINT `Grupos_TipoGrupo_Grupos_Grupo_CodigoMateria` FOREIGN KEY (`CodigoMateria`) REFERENCES `Grupos_TipoGrupo` (`CodigoMateria`)
);

-- Creación de la tabla Grupos_Estudiantes_Grupo
CREATE TABLE IF NOT EXISTS Grupos_Estudiantes_Grupo (
    `Identificacion` VARCHAR(20) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Identificación del Estudiante, llave foránea',
    `GrupoId` MEDIUMINT UNSIGNED NOT NULL COMMENT 'Identificador del Grupo, llave foránea',
    `Estado` ENUM('En Curso', 'Aprobado', 'Reprobado') COLLATE utf8_spanish_ci NOT NULL DEFAULT 'En Curso' COMMENT 'Estado del Estudiante en el grupo',
    `Progreso` ENUM('Nuevo', 'Continuidad', 'Prórroga') COLLATE utf8_spanish_ci NOT NULL DEFAULT 'Nuevo' COMMENT 'Progreso del Estudiante en el grupo',
    `ComentariosReprobado` VARCHAR(250) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Comentarios de Reprobado',
    `UniversalUniqueIdentifier` CHAR(36) COLLATE utf8_spanish_ci NOT NULL DEFAULT 'UUID' COMMENT 'Identificador único universal. En este campo se debe almacenar el resultado de UUID()',
    `LastUpdate` TIMESTAMP(4) NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP() COMMENT 'Fecha de la última actualización de la fila',
    `LastUser` VARCHAR(200) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Último usuario que modificó la fila',
    PRIMARY KEY (`Identificacion`, `GrupoId`),
    CONSTRAINT `Usuarios_Grupos_Estudiantes_Grupo_Identificacion` FOREIGN KEY (`Identificacion`) REFERENCES `Usuarios` (`Identificacion`),
    CONSTRAINT `Grupos_Grupo_Grupos_Estudiantes_Grupo_GrupoId` FOREIGN KEY (`GrupoId`) REFERENCES `Grupos_Grupo` (`GrupoId`)
);


-- Creación de la tabla Horas_Bitacora
CREATE TABLE IF NOT EXISTS Horas_Bitacora (
    `BitacoraId` MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `Identificacion` VARCHAR(20) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Identificación del Estudiante que está subiendo las horas',
    `GrupoId` MEDIUMINT UNSIGNED NOT NULL COMMENT 'Identificador del Grupo, llave foránea',
    `Fecha` DATE NOT NULL DEFAULT '0000-00-00' COMMENT 'Fecha de ejecución',
    `DescripcionActividad` VARCHAR(500) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Descripción de la actividad realizada',
    `TipoActividad` ENUM('Planificacion', 'Ejecucion', 'Gira') COLLATE utf8_spanish_ci NOT NULL DEFAULT 'Ejecucion' COMMENT 'Tipo de horas a registrar',
    `HoraInicio` TIME NOT NULL DEFAULT '00:00:00' COMMENT 'Hora de Inicio',
    `HoraFinal` TIME NOT NULL DEFAULT '00:00:00' COMMENT 'Hora de Finalización',
    `Evidencias` LONGBLOB NULL COMMENT 'Archivos de Evidencias',
    `NombreEvidencia` VARCHAR(255) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Nombre de la Evidencia',
    `EstadoHoras` ENUM('Aprobado', 'Rechazado') COLLATE utf8_spanish_ci NOT NULL DEFAULT 'Aprobado' COMMENT 'Estado de las horas',
    `ComentariosRechazo` VARCHAR(250) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Comentarios de Rechazo',
    `UniversalUniqueIdentifier` CHAR(36) COLLATE utf8_spanish_ci NOT NULL DEFAULT 'UUID' COMMENT 'Identificador único universal. En este campo se debe almacenar el resultado de UUID()',
    `LastUpdate` TIMESTAMP(4) NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP() COMMENT 'Fecha de la última actualización de la fila',
    `LastUser` VARCHAR(200) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Último usuario que modificó la fila',
    PRIMARY KEY (`BitacoraId`),
    CONSTRAINT `Horas_Bitacora_Grupos_Grupo_GrupoId` FOREIGN KEY (`GrupoId`) REFERENCES `Grupos_Grupo` (`GrupoId`),
    CONSTRAINT `Usuarios_Horas_Bitacora_Identificacion` FOREIGN KEY (`Identificacion`) REFERENCES `Usuarios` (`Identificacion`)
);

-- Creación de la tabla Socios_RegistroSocios
CREATE TABLE IF NOT EXISTS Socios_RegistroSocios (
    `SocioId` MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `NombreSocio` VARCHAR(100) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Nombre del socio Comunitario o Institución',
    `CorreoElectronicoSocio` VARCHAR(250) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Correo electrónico del socio',
    `TelefonoSocio` VARCHAR(20) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Teléfono del socio',
    `TipoInstitucion` VARCHAR(250) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Tipo de Institución',
    `DireccionSocio` VARCHAR(250) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Dirección del socio Comunitario o Institución',
    `UbicacionGPS` VARCHAR(100) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Coordenadas del socio Comunitario o Institución',
    `NombreCompletoContacto` VARCHAR(150) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Nombre completo del contacto',
    `Puesto` VARCHAR(50) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Puesto del contacto',
    `CorreoElectronicoContacto` VARCHAR(250) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Correo electrónico del contacto',
    `TelefonoContacto` VARCHAR(20) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Teléfono del contacto',
    `Estado` TINYINT(1) COLLATE utf8_spanish_ci NOT NULL DEFAULT '1' COMMENT 'Estado del Socio',
    `UniversalUniqueIdentifier` CHAR(36) COLLATE utf8_spanish_ci NOT NULL DEFAULT 'UUID' COMMENT 'Identificador único universal. En este campo se debe almacenar el resultado de UUID()',
    `LastUpdate` TIMESTAMP(4) NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP() COMMENT 'Fecha de la última actualización de la fila',
    `LastUser` VARCHAR(200) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Último usuario que modificó la fila',
    PRIMARY KEY (`SocioId`)
);

-- Creación de la tabla Socios_SolicitudCarta
CREATE TABLE IF NOT EXISTS Socios_SolicitudCarta (
    `SolicitudId` MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `SocioId` MEDIUMINT UNSIGNED NOT NULL COMMENT 'Identificador del Socio, llave foránea',
    `Carta` LONGBLOB NULL COMMENT 'Archivo de la carta',
    `NombreCarta` VARCHAR(255) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Nombre de la Carta',
    `Sede` ENUM('Central', 'Atenas', 'Guanacaste', 'Pacífico', 'San Carlos', 'C.F.P.T.E.', 'Todas') COLLATE utf8_spanish_ci NOT NULL DEFAULT 'Central' COMMENT 'Sede del Usuario',
    `Identificacion` VARCHAR(20) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Identificación del académico, llave foránea',
    `UniversalUniqueIdentifier` CHAR(36) COLLATE utf8_spanish_ci NOT NULL DEFAULT 'UUID' COMMENT 'Identificador único universal. En este campo se debe almacenar el resultado de UUID()',
    `LastUpdate` TIMESTAMP(4) NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP() COMMENT 'Fecha de la última actualización de la fila',
    `LastUser` VARCHAR(200) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Último usuario que modificó la fila',
    PRIMARY KEY (`SolicitudId`),
    CONSTRAINT `Usuarios_Socios_SolicitudCarta_Identificacion` FOREIGN KEY (`Identificacion`) REFERENCES `Usuarios` (`Identificacion`),
    CONSTRAINT `Socios_RegistroSocios_Socios_SolicitudCarta_SocioId` FOREIGN KEY (`SocioId`) REFERENCES `Socios_RegistroSocios` (`SocioId`)
);



-- Creación de la tabla Socios_EstudiantesCarta
CREATE TABLE IF NOT EXISTS Socios_EstudiantesCarta (
    `SolicitudId` MEDIUMINT UNSIGNED NOT NULL,
    `Identificacion` VARCHAR(20) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Identificación del estudiante que solicita la carta',
    `UniversalUniqueIdentifier` CHAR(36) COLLATE utf8_spanish_ci NOT NULL DEFAULT 'UUID' COMMENT 'Identificador único universal. En este campo se debe almacenar el resultado de UUID()',
    `LastUpdate` TIMESTAMP(4) NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP() COMMENT 'Fecha de la última actualización de la fila',
    `LastUser` VARCHAR(200) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Último usuario que modificó la fila',
    PRIMARY KEY (`Identificacion`, `SolicitudId`),
    CONSTRAINT `Socios_SolicitudCarta_Socios_EstudiantesCarta_SolicitudId` FOREIGN KEY (`SolicitudId`) REFERENCES `Socios_SolicitudCarta` (`SolicitudId`),
    CONSTRAINT `Usuarios_Socios_EstudiantesCarta_Identificacion` FOREIGN KEY (`Identificacion`) REFERENCES `Usuarios` (`Identificacion`)
);

-- Creación de la tabla Conclusion_Boleta
CREATE TABLE IF NOT EXISTS Conclusion_Boleta (
    `ConclusionId` MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `Identificacion` VARCHAR(20) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Identificación del estudiante que completa el formulario',
    `GrupoId` MEDIUMINT UNSIGNED NOT NULL COMMENT 'Identificador del Grupo, llave foránea',
    `Labor1` VARCHAR(500) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Labor 1',
    `Labor2` VARCHAR(500) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Labor 2',
    `Labor3` VARCHAR(500) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Labor 3',
    `Labor4` VARCHAR(500) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Labor 4',
    `Labor5` VARCHAR(500) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Labor 5',
    `Labor6` VARCHAR(500) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Labor 6',
    `Comentarios` VARCHAR(500) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Comentarios',
    `EstadoBoleta` ENUM('En Proceso', 'Aprobado', 'Rechazado') COLLATE utf8_spanish_ci NOT NULL DEFAULT 'En Proceso' COMMENT 'Estado de la Boleta del Estudiante',
    `MotivoRechazo` VARCHAR(250) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Comentarios de Reprobado',
    `UniversalUniqueIdentifier` CHAR(36) COLLATE utf8_spanish_ci NOT NULL DEFAULT 'UUID' COMMENT 'Identificador único universal. En este campo se debe almacenar el resultado de UUID()',
    `LastUpdate` TIMESTAMP(4) NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP() COMMENT 'Fecha de la última actualización de la fila',
    `LastUser` VARCHAR(200) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Último usuario que modificó la fila',
    PRIMARY KEY (`ConclusionId`),
    CONSTRAINT `Conclusion_Boleta_Grupos_Grupo_GrupoId` FOREIGN KEY (`GrupoId`) REFERENCES `Grupos_Grupo` (`GrupoId`),
    CONSTRAINT `Usuarios_Conclusion_Boleta_Identificacion` FOREIGN KEY (`Identificacion`) REFERENCES `Usuarios` (`Identificacion`)
);

-- Creación de la tabla Informacion
CREATE TABLE IF NOT EXISTS Informacion (
    `InformacionId` MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `Archivo` LONGBLOB NULL COMMENT 'Archivo',
    `NombreArchivo` VARCHAR(255) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Nombre del Archivo',
    `Identificacion` VARCHAR(20) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Identificación de quien sube la información',
    `Descripcion` VARCHAR(500) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Descripción',
    `TipoInformacion` ENUM('General', 'Académico', 'Plantilla') COLLATE utf8_spanish_ci NOT NULL DEFAULT 'Académico' COMMENT 'Tipo de información',
    `Fecha` DATE NOT NULL DEFAULT '0000-00-00' COMMENT 'Fecha de ejecución',
    `Sede` ENUM('Central', 'Atenas', 'Guanacaste', 'Pacífico', 'San Carlos', 'C.F.P.T.E.', 'Todas') COLLATE utf8_spanish_ci NOT NULL DEFAULT 'Central' COMMENT 'Sede del Usuario',
    `GrupoId` MEDIUMINT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Identificador del Grupo, llave foránea',
    `Estado` TINYINT(1) COLLATE utf8_spanish_ci NOT NULL DEFAULT '1' COMMENT 'Estado de la Información',
    `UniversalUniqueIdentifier` CHAR(36) COLLATE utf8_spanish_ci NOT NULL DEFAULT 'UUID' COMMENT 'Identificador único universal. En este campo se debe almacenar el resultado de UUID()',
    `LastUpdate` TIMESTAMP(4) NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP() COMMENT 'Fecha de la última actualización de la fila',
    `LastUser` VARCHAR(200) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Último usuario que modificó la fila',
    PRIMARY KEY (`InformacionId`),
    CONSTRAINT `Usuarios_Informacion_Identificacion` FOREIGN KEY (`Identificacion`) REFERENCES `Usuarios` (`Identificacion`)
);

-- Inserción de un usuario maestro
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

-- Asignación de roles al usuario maestro
INSERT INTO Usuarios_Roles (
    Identificacion,
    RolId
) VALUES
    ('001002003', 1),
    ('001002003', 2),
    ('001002003', 3);
