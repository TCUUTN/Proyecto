CREATE DATABASE IF NOT EXISTS bitacora_tcu;
USE bitacora_tcu;

CREATE TABLE Usuarios(
  `Identificacion` VARCHAR(20) COLLATE utf8_spanish_ci NOT NULL COMMENT 'Llave primaria de la tabla',
  `Nombre` VARCHAR(50) COLLATE utf8_spanish_ci NOT NULL COMMENT 'Nombre',
  `Apellido1` VARCHAR(50) COLLATE utf8_spanish_ci NOT NULL COMMENT 'Primer apellido',
  `Apellido2` VARCHAR(50) COLLATE utf8_spanish_ci NOT NULL COMMENT 'Segundo apellido',
  `CarreraEstudiante` VARCHAR(100) COLLATE utf8_spanish_ci NOT NULL COMMENT 'Carrera del Estudiante',
  `Genero` ENUM('Masculino', 'Femenino','Prefiero no Especificar', 'Indefinido') COLLATE utf8_spanish_ci NOT NULL DEFAULT 'Indefinido' COMMENT 'Género de la persona',
  `CorreoElectronico` VARCHAR(250) COLLATE utf8_spanish_ci NOT NULL COMMENT 'Correo electrónico',
  `Contrasenna` VARCHAR(60) COLLATE utf8_spanish_ci NOT NULL COMMENT 'Contrasena',
  `Estado` TinyInt(1) NOT NULL DEFAULT '1' COMMENT 'Estado de Usuario',
  `Sede` ENUM('Central', 'Atenas', 'Guanacaste','Pacífico','San Carlos', 'C.F.P.T.E.', 'Todas') COLLATE utf8_spanish_ci NOT NULL DEFAULT 'Central' COMMENT 'Sede del Usuario',
  `UniversalUniqueIdentifier` CHAR(36) COLLATE utf8_spanish_ci NOT NULL DEFAULT UUID() COMMENT 'Identificador único universal. En este campo se debe almacenar el resultado de UUID()',
  `LastUpdate` TIMESTAMP(4) NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP() COMMENT 'Fecha de la última actualización de la fila',
  `LastUser` VARCHAR(200) COLLATE utf8_spanish_ci NOT NULL COMMENT 'Último usuario que modificó la fila',
  PRIMARY KEY (`Identificacion`)
);

CREATE TABLE Roles (
    `RolId` MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `NombreRol` VARCHAR(50) COLLATE utf8_spanish_ci NOT NULL COMMENT 'Nombre',
    `UniversalUniqueIdentifier` CHAR(36) COLLATE utf8_spanish_ci NOT NULL DEFAULT UUID() COMMENT 'Identificador único universal. En este campo se debe almacenar el resultado de UUID()',
    `LastUpdate` TIMESTAMP(4) NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP() COMMENT 'Fecha de la última actualización de la fila',
    `LastUser` VARCHAR(200) COLLATE utf8_spanish_ci NOT NULL COMMENT 'Último usuario que modificó la fila',
    PRIMARY KEY (`RolId`)
);

INSERT INTO Roles (NombreRol) VALUES
('Administrativo'),
('Académico'),
('Estudiante');

CREATE TABLE Usuarios_Roles (
    `Identificacion` VARCHAR(20) COLLATE utf8_spanish_ci NOT NULL COMMENT 'Usuario al que se le va a asignar el Rol',
    `RolId` MEDIUMINT UNSIGNED NOT NULL,
    `UniversalUniqueIdentifier` CHAR(36) COLLATE utf8_spanish_ci NOT NULL DEFAULT UUID() COMMENT 'Identificador único universal. En este campo se debe almacenar el resultado de UUID()',
    `LastUpdate` TIMESTAMP(4) NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP() COMMENT 'Fecha de la última actualización de la fila',
    `LastUser` VARCHAR(200) COLLATE utf8_spanish_ci NOT NULL COMMENT 'Último usuario que modificó la fila',
    PRIMARY KEY (`Identificacion`, `RolId`),
    CONSTRAINT `Usuarios_Roles_Roles_RolId` FOREIGN KEY (`RolId`) REFERENCES `Roles` (`RolId`),
    CONSTRAINT `Usuarios_Roles_Usuarios_Identificacion` FOREIGN KEY (`Identificacion`) REFERENCES `Usuarios` (`Identificacion`)
);

CREATE TABLE Grupos_TipoGrupo(
    `CodigoMateria` VARCHAR(10) COLLATE utf8_spanish_ci NOT NULL COMMENT 'Llave primaria de la tabla',
    `NombreProyecto` VARCHAR(100) COLLATE utf8_spanish_ci NOT NULL COMMENT 'Nombre del proyecto',
    `TipoCurso` ENUM('Presencial', 'Virtual', 'Hibrido') COLLATE utf8_spanish_ci NOT NULL DEFAULT 'Presencial' COMMENT 'Modalidad del curso',
    `UniversalUniqueIdentifier` CHAR(36) COLLATE utf8_spanish_ci NOT NULL DEFAULT UUID() COMMENT 'Identificador único universal. En este campo se debe almacenar el resultado de UUID()',
    `LastUpdate` TIMESTAMP(4) NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP() COMMENT 'Fecha de la última actualización de la fila',
    `LastUser` VARCHAR(200) COLLATE utf8_spanish_ci NOT NULL COMMENT 'Último usuario que modificó la fila',
    PRIMARY KEY (`CodigoMateria`)
);

CREATE TABLE Grupos_Grupo (
    `GrupoId` MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `CodigoMateria` VARCHAR(10) COLLATE utf8_spanish_ci NOT NULL COMMENT 'Llave primaria de la tabla',
    `NumeroGrupo` SMALLINT NOT NULL COMMENT 'Numero de Grupo',
    `Horario` VARCHAR(30) COLLATE utf8_spanish_ci NOT NULL COMMENT 'Horario del Curso',
    `Aula` VARCHAR(15) COLLATE utf8_spanish_ci NOT NULL COMMENT 'Aula del Curso',
    `Sede` ENUM('Central', 'Atenas', 'Guanacaste','Pacífico','San Carlos', 'C.F.P.T.E.', 'Todas') COLLATE utf8_spanish_ci NOT NULL DEFAULT 'Central' COMMENT 'Sede en la que se imparte el curso',
    `Cuatrimestre` SMALLINT NOT NULL COMMENT 'Cuatrimestre del Curso',
    `Anno` SMALLINT NOT NULL COMMENT 'Año del curso',
    `Identificacion` VARCHAR(20) COLLATE utf8_spanish_ci NOT NULL COMMENT 'Identificacion del Academico a cargo del grupo',
    `Estado` TinyInt(1) NOT NULL DEFAULT '1' COMMENT 'Estado de Grupo',
    `BanderaFinalizarCuatrimestre` TinyInt(1) NOT NULL DEFAULT '0' COMMENT 'Bandera para activar Finalizacion del Cuatrimestre',
    `UniversalUniqueIdentifier` CHAR(36) COLLATE utf8_spanish_ci NOT NULL DEFAULT UUID() COMMENT 'Identificador único universal. En este campo se debe almacenar el resultado de UUID()',
    `LastUpdate` TIMESTAMP(4) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de la última actualización de la fila',
    `LastUser` VARCHAR(200) COLLATE utf8_spanish_ci NOT NULL COMMENT 'Último usuario que modificó la fila',
    PRIMARY KEY (`GrupoId`),
    CONSTRAINT `Usuarios_Grupos_Grupo_Identificacion` FOREIGN KEY (`Identificacion`) REFERENCES `Usuarios` (`Identificacion`),
    CONSTRAINT `Grupos_TipoGrupo_Grupos_Grupo_CodigoMateria` FOREIGN KEY (`CodigoMateria`) REFERENCES `Grupos_TipoGrupo` (`CodigoMateria`)
);

CREATE TABLE Grupos_Estudiantes_Grupo (
    `Identificacion` VARCHAR(20) COLLATE utf8_spanish_ci NOT NULL COMMENT 'Llave primaria de la tabla',
    `GrupoId` MEDIUMINT UNSIGNED NOT NULL,
    `Estado` ENUM('En Curso', 'Aprobado', 'Reprobado') COLLATE utf8_spanish_ci NOT NULL DEFAULT 'En Curso' COMMENT 'Estado de Estudiante en el grupo',
    `Progreso` ENUM('Nuevo', 'Continuidad', 'Prórroga') COLLATE utf8_spanish_ci NOT NULL DEFAULT 'Nuevo' COMMENT 'Progreso del Estudiante en el grupo',
    `ComentariosReprobado` VARCHAR(250) COLLATE utf8_spanish_ci NOT NULL COMMENT 'Comentarios de Reprobado',
    `UniversalUniqueIdentifier` CHAR(36) COLLATE utf8_spanish_ci NOT NULL DEFAULT UUID() COMMENT 'Identificador único universal. En este campo se debe almacenar el resultado de UUID()',
    `LastUpdate` TIMESTAMP(4) NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP() COMMENT 'Fecha de la última actualización de la fila',
    `LastUser` VARCHAR(200) COLLATE utf8_spanish_ci NOT NULL COMMENT 'Último usuario que modificó la fila',
    PRIMARY KEY (`Identificacion`, `GrupoId`),
    CONSTRAINT `Usuarios_Grupos_Estudiantes_Grupo_Identificacion` FOREIGN KEY (`Identificacion`) REFERENCES `Usuarios` (`Identificacion`),
    CONSTRAINT `Grupos_Grupo_Grupos_Estudiantes_Grupo_GrupoId` FOREIGN KEY (`GrupoId`) REFERENCES `Grupos_Grupo` (`GrupoId`)
);

CREATE TABLE Horas_Bitacora (
    `BitacoraId` MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `Identificacion` VARCHAR(20) COLLATE utf8_spanish_ci NOT NULL COMMENT 'Identificacion del Estudiante que esta subiendo las horas',
    `GrupoId` MEDIUMINT UNSIGNED NOT NULL,
    `Fecha` DATE NOT NULL COMMENT 'Fecha de ejecucion',
    `DescripcionActividad` VARCHAR(250) COLLATE utf8_spanish_ci NOT NULL COMMENT 'Descripcion de la actividad realizada',
    `CantidadHorasInvertidas` SMALLINT NOT NULL COMMENT 'Cantidad de horas que se estan subiendo',
    `CantidadHorasAprobadas` SMALLINT NOT NULL COMMENT 'Cantidad de horas que fueron aprobadas por el Academico',
    `Estado` ENUM('Aprobado', 'Rechazado','En Proceso') COLLATE utf8_spanish_ci NOT NULL DEFAULT 'En Proceso' COMMENT 'Estado de horas subidas',
    `UniversalUniqueIdentifier` CHAR(36) COLLATE utf8_spanish_ci NOT NULL DEFAULT UUID() COMMENT 'Identificador único universal. En este campo se debe almacenar el resultado de UUID()',
    `LastUpdate` TIMESTAMP(4) NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP() COMMENT 'Fecha de la última actualización de la fila',
    `LastUser` VARCHAR(200) COLLATE utf8_spanish_ci NOT NULL COMMENT 'Último usuario que modificó la fila',
    PRIMARY KEY (`BitacoraId`),
    CONSTRAINT `Usuarios_Horas_Bitacora_Identificacion` FOREIGN KEY (`Identificacion`) REFERENCES `Usuarios` (`Identificacion`),
    CONSTRAINT `Grupos_Grupo_Horas_Bitacora_GrupoId` FOREIGN KEY (`GrupoId`) REFERENCES `Grupos_Grupo` (`GrupoId`)
);

CREATE TABLE Conclusiones_Boleta(
    `BoletaId` MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `Identificacion` VARCHAR(20) COLLATE utf8_spanish_ci NOT NULL COMMENT 'Identificacion del Estudiante',
    `GrupoId` MEDIUMINT UNSIGNED NOT NULL COMMENT 'Grupo del Estudiante',
    `Labor1` VARCHAR(500) COLLATE utf8_spanish_ci NOT NULL COMMENT 'Descripcion de la labor 1',
    `Labor2` VARCHAR(500) COLLATE utf8_spanish_ci NOT NULL COMMENT 'Descripcion de la labor 2',
    `Labor3` VARCHAR(500) COLLATE utf8_spanish_ci NOT NULL COMMENT 'Descripcion de la labor 3',
    `ComentarioAdicional` VARCHAR(500) COLLATE utf8_spanish_ci NOT NULL COMMENT 'Comentarios Adicionales',
    `Estado` ENUM('Aprobado', 'Rechazado','En Proceso') COLLATE utf8_spanish_ci NOT NULL DEFAULT 'En Proceso' COMMENT 'Estado de Conclusión',
    `UniversalUniqueIdentifier` CHAR(36) COLLATE utf8_spanish_ci NOT NULL DEFAULT UUID() COMMENT 'Identificador único universal. En este campo se debe almacenar el resultado de UUID()',
    `LastUpdate` TIMESTAMP(4) NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP() COMMENT 'Fecha de la última actualización de la fila',
    `LastUser` VARCHAR(200) COLLATE utf8_spanish_ci NOT NULL COMMENT 'Último usuario que modificó la fila',
    PRIMARY KEY (`BoletaId`),
    CONSTRAINT `Usuarios_Conclusiones_Boleta_Identificacion` FOREIGN KEY (`Identificacion`) REFERENCES `Usuarios` (`Identificacion`),
    CONSTRAINT `Grupos_Grupo_Conclusiones_Boleta_GrupoId` FOREIGN KEY (`GrupoId`) REFERENCES `Grupos_Grupo` (`GrupoId`)
);

CREATE TABLE Informacion(
    `Identificacion` VARCHAR(20) COLLATE utf8_spanish_ci NOT NULL COMMENT 'Llave primaria de la tabla',
    `FirmaBase64` TEXT COLLATE utf8_spanish_ci NOT NULL COMMENT 'Firma del estudiante en Base64',
    `ImagenBase64` TEXT COLLATE utf8_spanish_ci NOT NULL COMMENT 'Imagen de la cedula en Base64',
    `Telefono` VARCHAR(20) COLLATE utf8_spanish_ci NOT NULL COMMENT 'Numero de telefono',
    `Direccion` VARCHAR(500) COLLATE utf8_spanish_ci NOT NULL COMMENT 'Direccion de residencia',
    `UniversalUniqueIdentifier` CHAR(36) COLLATE utf8_spanish_ci NOT NULL DEFAULT UUID() COMMENT 'Identificador único universal. En este campo se debe almacenar el resultado de UUID()',
    `LastUpdate` TIMESTAMP(4) NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP() COMMENT 'Fecha de la última actualización de la fila',
    `LastUser` VARCHAR(200) COLLATE utf8_spanish_ci NOT NULL COMMENT 'Último usuario que modificó la fila',
    PRIMARY KEY (`Identificacion`),
    CONSTRAINT `Usuarios_Informacion_Identificacion` FOREIGN KEY (`Identificacion`) REFERENCES `Usuarios` (`Identificacion`)
);

-- Insertar usuario de prueba
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

-- Asignar roles al usuario de prueba
INSERT INTO Usuarios_Roles (
    Identificacion,
    RolId
) VALUES
('001002003',1),
('001002003',2),
('001002003',3);


