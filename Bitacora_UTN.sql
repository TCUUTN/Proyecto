/* Borrado y creacion*/

/*use sys;

drop database Bitacora_TCU;


create database Bitacora_TCU;*/

use Bitacora_TCU;

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
	`Estado` TinyInt(1) COLLATE utf8_spanish_ci NOT NULL DEFAULT '1' COMMENT 'Estado de Estudiante en el grupo',
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
`Nombre` VARCHAR(50) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Nombre',
`Apellido1` VARCHAR(50) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Primer apellido',
`Apellido2` VARCHAR(50) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Segundo apellido',
`Puesto` VARCHAR(50) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Puesto del Socio',
`CorreoElectronicoSocio` VARCHAR(250) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Correo electrónico Socio',
`CorreoElectronicoPersona` VARCHAR(250) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Correo electrónico Persona',
`Telefono` VARCHAR(20) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Telefono del Socio',
`TipoInstitucion` VARCHAR(250) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Tipo de Institucion',
`UniversalUniqueIdentifier` CHAR(36) COLLATE utf8_spanish_ci NOT NULL DEFAULT 'UUID' COMMENT 'Identificador único universal. En este campo se debe almacenar el resultado de UUID()',
`LastUpdate` TIMESTAMP(4) NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP() COMMENT 'Fecha de la última actualización de la fila',
`LastUser` VARCHAR(200) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Último usuario que modificó la fila',
PRIMARY KEY (`SocioId`)
);

CREATE TABLE Socios_SolicitudCarta (
`SolicitudId` MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,
`SocioId` MEDIUMINT UNSIGNED NOT NULL,
`UniversalUniqueIdentifier` CHAR(36) COLLATE utf8_spanish_ci NOT NULL DEFAULT 'UUID' COMMENT 'Identificador único universal. En este campo se debe almacenar el resultado de UUID()',
`LastUpdate` TIMESTAMP(4) NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP() COMMENT 'Fecha de la última actualización de la fila',
`LastUser` VARCHAR(200) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Último usuario que modificó la fila',
PRIMARY KEY (`SolicitudId`),
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
`Labor1` VARCHAR(500) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Labor 1',
`Labor2` VARCHAR(500) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Labor 2',
`Labor3` VARCHAR(500) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Labor 3',
`Labor4` VARCHAR(500) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Labor 4',
`Labor5` VARCHAR(500) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Labor 5',
`Labor6` VARCHAR(500) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Labor 6',
`Comentarios` VARCHAR(500) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Comentarios',
`UniversalUniqueIdentifier` CHAR(36) COLLATE utf8_spanish_ci NOT NULL DEFAULT 'UUID' COMMENT 'Identificador único universal. En este campo se debe almacenar el resultado de UUID()',
`LastUpdate` TIMESTAMP(4) NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP() COMMENT 'Fecha de la última actualización de la fila',
`LastUser` VARCHAR(200) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Último usuario que modificó la fila',
PRIMARY KEY (`ConclusionId`),
CONSTRAINT `Usuarios_Conclusion_Boleta_Identificacion` FOREIGN KEY (`Identificacion`) REFERENCES `bitacora_TCU`.`Usuarios` (`Identificacion`)
);

CREATE TABLE Informacion (
`InformacionId` MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,
`Archivo` blob NULL COMMENT 'Archivo',
`Identificacion` VARCHAR(20) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Identificacion de quien sube la informacion',
`Descripcion` VARCHAR(500) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Descripcion',
`TipoInformacion` ENUM('Noticia', 'Archivo') COLLATE utf8_spanish_ci NOT NULL DEFAULT 'Noticia' COMMENT 'Tipo de informacion',
`Estado` TinyInt(1) COLLATE utf8_spanish_ci NOT NULL DEFAULT '1' COMMENT 'Estado de Informacion',
`UniversalUniqueIdentifier` CHAR(36) COLLATE utf8_spanish_ci NOT NULL DEFAULT 'UUID' COMMENT 'Identificador único universal. En este campo se debe almacenar el resultado de UUID()',
`LastUpdate` TIMESTAMP(4) NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP() COMMENT 'Fecha de la última actualización de la fila',
`LastUser` VARCHAR(200) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Último usuario que modificó la fila',
PRIMARY KEY (`InformacionId`),
CONSTRAINT `Usuarios_Informacion_Identificacion` FOREIGN KEY (`Identificacion`) REFERENCES `bitacora_TCU`.`Usuarios` (`Identificacion`)
);


/*Inserts y Updates

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
    '123456789',
    'Juan',
    'Perez',
    'Gomez',
    'Masculino',
    'juan.perez@example.com',
    'password123',
    1,
    'Central'
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
    '117960190',
    'Israel',
    'Calvo',
    'Morera',
    'Masculino',
    'cmisra2407@gmail.com',
    '$2a$10$IOgU92oPOUMkOm5ly63tcuS01c4wpb.V/YzQxWbQsdYEpW1yznw56',
    1,
    'Todas'
);

INSERT INTO Usuarios_Roles (
	Identificacion,
    RolId)
    VALUES
    ('117960190',1),('117960190',3),('123456789',3);


INSERT INTO Usuarios_Roles (
	Identificacion,
    RolId)
    VALUES
    ('117960190',2);

Select * from Roles;

INSERT INTO Grupos_TipoGrupo (CodigoMateria, NombreProyecto, TipoCurso)
VALUES ('MAT123', 'Proyecto A', 'Presencial');

INSERT INTO Grupos_Grupo (CodigoMateria, NumeroGrupo, Horario, Aula, Sede, Cuatrimestre, Anno, Identificacion, Estado)
VALUES ('MAT123', 1, 'Lunes 9-11', 'Aula 101', 'Central', 1, 2024, '117960190', 1);

INSERT INTO Grupos_Estudiantes_Grupo (Identificacion, GrupoId, Estado)
VALUES ('123456789', 1, 1);

SET SQL_SAFE_UPDATES = 0;
DELETE FROM Grupos_Estudiantes_Grupo
WHERE GrupoId = '6';


DELETE FROM Usuarios
WHERE Identificacion <> '117960190';

SET SQL_SAFE_UPDATES = 1;

UPDATE Usuarios
SET CorreoElectronico = 'isracmldausa@gmail.com'
WHERE Identificacion = 645678901;

select * from Usuarios;

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
    '225522556',
    'Prueba Pacifico',
    'Test',
    'UTN',
    'Prefiero no Especificar',
    'isracmlda18@gmail.com',
    '$2a$10$IOgU92oPOUMkOm5ly63tcuS01c4wpb.V/YzQxWbQsdYEpW1yznw56',
    1,
    'Pacífico'
);

INSERT INTO Usuarios_Roles (
	Identificacion,
    RolId)
    VALUES
    ('225522556',1);
    
    
    select * from Grupos_Estudiantes_Grupo;
    
-- Paso 1: Añadir la columna GrupoId a la tabla Horas_Bitacora
ALTER TABLE Horas_Bitacora
ADD COLUMN GrupoId MEDIUMINT UNSIGNED NOT NULL;

-- Paso 2: Añadir la llave foránea
ALTER TABLE Horas_Bitacora
ADD CONSTRAINT `Horas_Bitacora_Grupos_Grupo_GrupoId` FOREIGN KEY (`GrupoId`) REFERENCES `bitacora_TCU`.`Grupos_Grupo` (`GrupoId`);



INSERT INTO Horas_Bitacora (
    Identificacion,
    GrupoId,
    Fecha,
    DescripcionActividad,
    TipoActividad,
    HoraInicio,
    HoraFinal,
    EstadoHoras
) VALUES (
    '112233445',          -- Identificacion del Estudiante
    4,                    -- GrupoId (Ejemplo de GrupoId)
    '2024-06-14',         -- Fecha de ejecución
    'Participación en proyecto de desarrollo de software.', -- Descripción de la actividad
    'Ejecucion',          -- Tipo de actividad
    '08:00:00',           -- Hora de inicio
    '12:00:00',           -- Hora de finalización
    'Aprobado'            -- Estado de las horas
);

INSERT INTO Horas_Bitacora (
    Identificacion,
    GrupoId,
    Fecha,
    DescripcionActividad,
    TipoActividad,
    HoraInicio,
    HoraFinal,
    Evidencias,
    EstadoHoras
) VALUES (
    '112233445',          -- Identificacion del Estudiante
    4,                    -- GrupoId (Ejemplo de GrupoId)
    '2024-06-13',         -- Fecha de ejecución
    'Asistencia a la gira educativa en la planta de reciclaje.', -- Descripción de la actividad
    'Gira',               -- Tipo de actividad
    '09:00:00',           -- Hora de inicio
    '15:00:00',           -- Hora de finalización
    NULL,                 -- Evidencias (NULL en este ejemplo)
    'Aprobado'           -- Estado de las horas
);

UPDATE usuarios
SET correoElectronico = 'asomamecoasistencia@gmail.com'
WHERE Identificacion = 112233445;


Actualizacion tabla de horas
ALTER TABLE `Horas_Bitacora` MODIFY `Evidencias` LONGBLOB;
ALTER TABLE Horas_Bitacora
ADD COLUMN NombreEvidencia VARCHAR(255) COLLATE utf8_spanish_ci NOT NULL DEFAULT '-' COMMENT 'Nombre de la Evidencia';

*/
