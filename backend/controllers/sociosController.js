const RegistroSocios = require("../models/RegistroSocios");
const SolicitudCarta = require("../models/SolicitudCarta");
const Usuario = require("../models/Usuario");
const EstudiantesCarta = require("../models/EstudiantesCarta");
const { enviarCorreoConAdjunto } = require("../helpers/CorreoHelper"); // Importa el helper
const fs = require("fs");
const path = require("path");
const iconv = require("iconv-lite");

//Extrae todos los socios comunitarios
const getAllSocios = async (req, res) => {
  try {
    const Socios = await RegistroSocios.findAll();
    res.json(Socios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Extrae todos los socios comunitarios activos
const getAllSociosActivos = async (req, res) => {
  try {
    const Socios = await RegistroSocios.findAll({
      where: {
        Estado: 1,
      },
    });
    res.json(Socios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Extrae todas las solicitudes de carta
const getAllSolicitudes = async (req, res) => {
  try {
    // Obtener todas las solicitudes con RegistroSocios
    const solicitudes = await SolicitudCarta.findAll({
      attributes: [
        "SolicitudId",
        "SocioId",
        "NombreCarta",
        "Identificacion",
        "Sede",
      ],
      include: [
        {
          model: RegistroSocios,
          attributes: ["NombreSocio"],
        },
      ],
    });

    // Para cada solicitud, obtener los EstudiantesCarta y Usuarios correspondientes
    const solicitudesConEstudiantes = await Promise.all(
      solicitudes.map(async (solicitud) => {
        const estudiantesCarta = await EstudiantesCarta.findAll({
          where: { SolicitudId: solicitud.SolicitudId },
          attributes: [],
          include: [
            {
              model: Usuario,
              attributes: ["Nombre", "Apellido1", "Apellido2"],
            },
          ],
        });

        // Agregar los estudiantesCarta a la solicitud
        solicitud.dataValues.EstudiantesCarta = estudiantesCarta;
        return solicitud;
      })
    );

    res.json(solicitudesConEstudiantes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Extrae todas las interconexiones entre estudiantes y las cartas
const getAllEstudiantesCarta = async (req, res) => {
  try {
    const Estudiantes = await EstudiantesCarta.findAll();
    res.json(Estudiantes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Extrae todas la solicitudes relacionadas a un académico
const getAllSolicitudesPorAcademico = async (req, res) => {
  try {
    const { Identificacion } = req.params;
    const solicitudes = await SolicitudCarta.findAll({
      where: {
        Identificacion: Identificacion,
      },
      attributes: [
        "SolicitudId",
        "SocioId",
        "NombreCarta",
        "Sede",
        "Identificacion",
      ],
      include: [
        {
          model: RegistroSocios,
          attributes: ["NombreSocio"],
        },
      ],
    });
    // Para cada solicitud, obtener los EstudiantesCarta y Usuarios correspondientes
    const solicitudesConEstudiantes = await Promise.all(
      solicitudes.map(async (solicitud) => {
        const estudiantesCarta = await EstudiantesCarta.findAll({
          where: { SolicitudId: solicitud.SolicitudId },
          attributes: [],
          include: [
            {
              model: Usuario,
              attributes: ["Nombre", "Apellido1", "Apellido2"],
            },
          ],
        });

        // Agregar los estudiantesCarta a la solicitud
        solicitud.dataValues.EstudiantesCarta = estudiantesCarta;
        return solicitud;
      })
    );

    res.json(solicitudesConEstudiantes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Extrae todas las solicitudes por Sede
const getAllSolicitudesPorSede = async (req, res) => {
  try {
    const { Sede } = req.params;
    const solicitudes = await SolicitudCarta.findAll({
      where: {
        Sede: Sede,
      },
      attributes: [
        "SolicitudId",
        "SocioId",
        "NombreCarta",
        "Sede",
        "Identificacion",
      ],
      include: [
        {
          model: RegistroSocios,
          attributes: ["NombreSocio"],
        },
      ],
    });

    // Para cada solicitud, obtener los EstudiantesCarta y Usuarios correspondientes
    const solicitudesConEstudiantes = await Promise.all(
      solicitudes.map(async (solicitud) => {
        const estudiantesCarta = await EstudiantesCarta.findAll({
          where: { SolicitudId: solicitud.SolicitudId },
          attributes: [],
          include: [
            {
              model: Usuario,
              attributes: ["Nombre", "Apellido1", "Apellido2"],
            },
          ],
        });

        // Agregar los estudiantesCarta a la solicitud
        solicitud.dataValues.EstudiantesCarta = estudiantesCarta;
        return solicitud;
      })
    );

    res.json(solicitudesConEstudiantes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Extrae el Socio por el ID del Socio
const getSocioPorSocioId = async (req, res) => {
  try {
    const { SocioId } = req.params;

    const socio = await RegistroSocios.findOne({
      where: {
        SocioId: SocioId,
      },
    });

    if (!socio) {
      return res.status(404).json({ error: "Socio no encontrado" });
    }

    res.status(200).json(socio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Extrae una solicitud de carta por el ID de la solicitud
const getSolicitudPorSolicitudId = async (req, res) => {
  try {
    const { SolicitudId } = req.params;

    const solicitud = await SolicitudCarta.findOne({
      where: {
        SolicitudId: SolicitudId,
      },
      attributes: [
        "SolicitudId",
        "SocioId",
        "NombreCarta",
        "Sede",
        "Identificacion",
      ],
      include: {
        model: RegistroSocios,
        attributes: ["NombreSocio"], // Ajusta los atributos según sea necesario
      },
    });

    if (!solicitud) {
      return res.status(404).json({ error: "Solicitud no encontrada" });
    }

    const estudiantesCarta = await EstudiantesCarta.findAll({
      where: {
        SolicitudId: SolicitudId,
      },
      attributes: [],
      include: {
        model: Usuario,
        attributes: ["Identificacion", "Nombre", "Apellido1", "Apellido2"], // Ajusta los atributos según sea necesario
      },
    });

    // Añadir los registros de EstudiantesCarta al objeto solicitud
    solicitud.dataValues.estudiantesCarta = estudiantesCarta;

    res.status(200).json(solicitud);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Proceso para Crear o Actualizar un Socio Comunitario
const crearOActualizarSocio = async (req, res) => {
  try {
    const {
      SocioId,
      NombreSocio,
      CorreoElectronicoSocio,
      TelefonoSocio,
      TipoInstitucion,
      DireccionSocio,
      UbicacionGPS,
      NombreCompletoContacto,
      Puesto,
      CorreoElectronicoContacto,
      TelefonoContacto,
      Estado,
    } = req.body;

    if (!SocioId) {
      // Si no se proporciona un SocioId, crear un nuevo socio con Estado por defecto 1
      const nuevoSocio = await RegistroSocios.create({
        NombreSocio,
        CorreoElectronicoSocio,
        TelefonoSocio,
        TipoInstitucion,
        DireccionSocio,
        UbicacionGPS,
        NombreCompletoContacto,
        Puesto,
        CorreoElectronicoContacto,
        TelefonoContacto,
        Estado: 1, // Estado por defecto 1 al crear nuevo socio
      });

      return res.status(201).json(nuevoSocio);
    }

    // Verificar si existe un socio con el SocioId proporcionado
    let socioExistente = await RegistroSocios.findOne({ where: { SocioId } });

    if (!socioExistente) {
      // Si no existe un socio con el SocioId proporcionado, crear uno nuevo con Estado por defecto 1
      const nuevoSocio = await RegistroSocios.create({
        SocioId,
        NombreSocio,
        CorreoElectronicoSocio,
        TelefonoSocio,
        TipoInstitucion,
        DireccionSocio,
        UbicacionGPS,
        NombreCompletoContacto,
        Puesto,
        CorreoElectronicoContacto,
        TelefonoContacto,
        Estado: 1, // Estado por defecto 1 al crear nuevo socio
      });

      return res.status(201).json(nuevoSocio);
    }

    // Si existe un socio con el SocioId proporcionado, actualizarlo
    socioExistente = await socioExistente.update({
      NombreSocio,
      CorreoElectronicoSocio,
      TelefonoSocio,
      TipoInstitucion,
      DireccionSocio,
      UbicacionGPS,
      NombreCompletoContacto,
      Puesto,
      CorreoElectronicoContacto,
      TelefonoContacto,
      Estado,
    });

    return res.status(200).json(socioExistente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Proceso para Crear o Actualizar una solicitud de carta
const crearOActualizarSolicitudCarta = async (req, res) => {
  try {
    const {
      SolicitudId,
      SocioId,
      Sede,
      Identificacion,
      IdentificacionesEstudiantes, // Incluimos IdentificacionesEstudiantes en el body
    } = req.body;

    if (!SolicitudId) {
      // Si no se proporciona un SolicitudId, crear una nueva solicitud de carta
      const nuevaSolicitud = await SolicitudCarta.create({
        SocioId,
        Sede,
        Identificacion,
      });

      // Procesar IdentificacionesEstudiantes
      await procesarIdentificacionesEstudiantes(
        nuevaSolicitud.SolicitudId,
        IdentificacionesEstudiantes
      );

      return res.status(201).json(nuevaSolicitud);
    }

    // Verificar si existe una solicitud de carta con el SolicitudId proporcionado
    let solicitudExistente = await SolicitudCarta.findOne({
      where: { SolicitudId },
    });

    if (!solicitudExistente) {
      // Si no existe una solicitud con el SolicitudId proporcionado, crear una nueva
      const nuevaSolicitud = await SolicitudCarta.create({
        SolicitudId,
        SocioId,
        Carta: null, // Asegurar que Carta sea null al crear
        NombreCarta: "-", // Establecer NombreCarta como "-"
        Sede,
        Identificacion,
      });

      // Procesar IdentificacionesEstudiantes
      await procesarIdentificacionesEstudiantes(
        nuevaSolicitud.SolicitudId,
        IdentificacionesEstudiantes
      );

      return res.status(201).json(nuevaSolicitud);
    }

    // Si existe una solicitud con el SolicitudId proporcionado, actualizarla
    solicitudExistente = await solicitudExistente.update({
      SocioId,
      Carta: null, // Establecer Carta a null si no se proporciona
      NombreCarta: "-", // Establecer NombreCarta a "-" si no se proporciona
      Sede,
      Identificacion,
    });

    // Procesar IdentificacionesEstudiantes
    await procesarIdentificacionesEstudiantes(
      solicitudExistente.SolicitudId,
      IdentificacionesEstudiantes
    );

    return res.status(200).json(solicitudExistente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Crea los registros de la tabla intermedia de EstudiantesCarta
const procesarIdentificacionesEstudiantes = async (
  SolicitudId,
  IdentificacionesEstudiantes
) => {
  if (IdentificacionesEstudiantes && IdentificacionesEstudiantes.length > 0) {
    for (const estudiante of IdentificacionesEstudiantes) {
      await CrearOActualizarEstudiantesCarta(SolicitudId, estudiante);
    }
  }
};

//Proceso para Crear o Actualizar un EstudiantesCarta
const CrearOActualizarEstudiantesCarta = async (
  SolicitudId,
  Identificacion
) => {
  try {
    // Verificar si existe un registro con el SolicitudId e Identificacion proporcionados
    let estudianteExistente = await EstudiantesCarta.findOne({
      where: { SolicitudId, Identificacion },
    });

    if (!estudianteExistente) {
      // Si no existe, crear un nuevo registro
      await EstudiantesCarta.create({
        SolicitudId,
        Identificacion,
      });
    } else {
      // Si existe, actualizar el registro
      await estudianteExistente.update({
        LastUpdate: DataTypes.NOW,
        LastUser: "-", // Aquí puedes ajustar el valor de LastUser según corresponda
      });
    }
  } catch (error) {
    console.error(
      `Error en CrearOActualizarEstudiantesCarta: ${error.message}`
    );
  }
};

//Proceso de Envio de la Carta Solicitada
const GuardaryEnviarCarta = async (req, res) => {
  try {
    const { SolicitudId } = req.body;
    if (!SolicitudId) {
      return res.status(400).json({ error: "Fallo al procesar el archivo" });
    }

    // Buscar el registro en SolicitudCarta con el SolicitudId proporcionado
    let solicitudExistente = await SolicitudCarta.findOne({
      where: { SolicitudId },
      include: [
        {
          model: RegistroSocios,
        },
      ],
    });

    if (!solicitudExistente) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }

    const decodedFileName = iconv.decode(
      Buffer.from(req.file.originalname, "binary"),
      "utf8"
    );

    const filePath = path.join(
      __dirname,
      "../assets/ServerAttachments",
      req.file.filename
    );
    const fileContent = fs.readFileSync(filePath);
    solicitudExistente.Carta = fileContent;
    solicitudExistente.NombreCarta = decodedFileName;

    await solicitudExistente.save();

    const estudiantes = await EstudiantesCarta.findAll({
      where: { SolicitudId },
      include: [
        {
          model: Usuario,
          attributes: ["Nombre", "Apellido1", "Apellido2", "CorreoElectronico"],
        },
      ],
    });

    const NombreSocio = solicitudExistente.Socios_RegistroSocio.NombreSocio;
    const correosEstudiantes = estudiantes.map(
      (est) => est.Usuario.CorreoElectronico
    );
    const correoSocio =
      solicitudExistente.Socios_RegistroSocio.CorreoElectronicoContacto;

    // Buscar el correo del usuario en copia
    const usuarioCopia = await Usuario.findOne({
      where: { Identificacion: solicitudExistente.Identificacion },
      attributes: ["CorreoElectronico"],
    });
    const correoCopia = usuarioCopia ? usuarioCopia.CorreoElectronico : null;

    const asunto = "Carta de Aceptacion de Estudiantes TCU UTN";
    const mensajeHtml = generarMensajeHtml(estudiantes, NombreSocio);

    const destinatarios = [...correosEstudiantes, correoSocio].filter(Boolean);
    const copia = correoCopia ? [correoCopia] : [];

    await enviarCorreoConAdjunto(
      destinatarios,
      asunto,
      mensajeHtml,
      filePath,
      decodedFileName,
      copia
    );

        // Eliminar el archivo de la carpeta ServerAttachments
        fs.unlinkSync(filePath);

    return res.status(200).json({
      message: `El archivo ${req.file.originalname} ha sido guardado exitosamente`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Genera el mensaje HTML que se va a enviar al helper
const generarMensajeHtml = (estudiantes, NombreSocio) => {
  const year = new Date().getFullYear();
  const textColor = "#002c6b";
  const estudiantesHtml = estudiantes
    .map(
      (est) =>
        `<p><strong>${est.Usuario.Nombre} ${est.Usuario.Apellido1} ${est.Usuario.Apellido2}</strong></p>`
    )
    .join("");

  return `
      <div style="font-family: 'Century Gothic', sans-serif; color: ${textColor};">
        <header style="background-color: #002c6b; color: white; text-align: center; padding: 10px;">
          <h1 style="margin: 0;">Carta de Socios Comunitarios</h1>
        </header>
        <div style="padding: 20px;">
          <p>Estimado(a): ${NombreSocio}</p>
          <p>Adjuntamos la carta en la cual se deja en pie la colaboracion de los siguientes Estudiantes dentro de su institucion como parte de su Trabajo Comunal Universitario:</p> 
          ${estudiantesHtml}
          <p>Quedamos atentos ante cualquier duda o consulta</p>
        </div>
        <footer style="background-color: #002c6b; color: white; text-align: center; padding: 10px; margin-top: 20px;">
          <p>Bitácora TCU - Derechos Reservados © ${year}</p>
        </footer>
      </div>
    `;
};

//Elimina el adjunto de la memoria local
const eliminarCarta = async (req, res) => {
  try {
    const { fileName } = req.params;
    const filePath = path.join(__dirname, "../assets/dbAttachment", fileName);

    fs.unlink(filePath, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error al eliminar el archivo" });
      }
      res.status(200).json({ message: "Archivo eliminado exitosamente" });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Extrae la carta del servidor para que el usuario la pueda descargar
const descargarCarta = async (req, res) => {
  try {
    const { SolicitudId } = req.params;
    const solicitud = await SolicitudCarta.findOne({
      where: {
        SolicitudId: SolicitudId,
      },
      attributes: ["Carta", "NombreCarta"],
    });

    if (!solicitud) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }

    const assetsDir = path.join(__dirname, "../assets");
    const dbAttachmentDir = path.join(assetsDir, "dbAttachment");

    // Crear las carpetas si no existen
    if (!fs.existsSync(assetsDir)) {
      fs.mkdirSync(assetsDir);
    }
    if (!fs.existsSync(dbAttachmentDir)) {
      fs.mkdirSync(dbAttachmentDir);
    }

    const filePath = path.join(dbAttachmentDir, solicitud.NombreCarta);

    fs.writeFileSync(filePath, solicitud.Carta);

    res.status(200).json(solicitud.NombreCarta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  getAllSocios,
  getAllSolicitudes,
  getAllEstudiantesCarta,
  getAllSolicitudesPorAcademico,
  getAllSolicitudesPorSede,
  getAllSociosActivos,
  getSocioPorSocioId,
  getSolicitudPorSolicitudId,
  crearOActualizarSocio,
  crearOActualizarSolicitudCarta,
  GuardaryEnviarCarta,
  eliminarCarta,
  descargarCarta,
};
