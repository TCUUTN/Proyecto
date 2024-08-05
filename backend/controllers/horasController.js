const HorasBitacora = require("../models/HorasBitacora");
const fs = require("fs");
const path = require("path");
const iconv = require("iconv-lite");

//Extrae todos los registros de horas
const getAllHoras = async (req, res) => {
  try {
    const Horas = await HorasBitacora.findAll({
      attributes: [
        "BitacoraId",
        "Identificacion",
        "Fecha",
        "GrupoId",
        "DescripcionActividad",
        "TipoActividad",
        "HoraInicio",
        "HoraFinal",
        "NombreEvidencia",
        "ComentariosRechazo",
        "EstadoHoras",
      ],
    });
    res.json(Horas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Proceso para descargar un archivo desde la base de datos por medio del BitacoraId
const descargarArchivo = async (req, res) => {
  try {
    const { BitacoraId } = req.params;
    const horas = await HorasBitacora.findOne({
      where: {
        BitacoraId: BitacoraId,
      },
      attributes: ["Evidencias", "NombreEvidencia"],
    });

    if (!horas) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }
    const filePath = path.join(
      __dirname,
      "../assets/dbAttachment/",
      horas.NombreEvidencia
    );

    fs.writeFileSync(filePath, horas.Evidencias);

    res.status(200).json(horas.NombreEvidencia);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Obtiene el registro de Bitacora relacionado con el BitacoraId
const getHorasPorBitacoraId = async (req, res) => {
  try {
    const { BitacoraId } = req.params;

    const horas = await HorasBitacora.findOne({
      where: {
        BitacoraId: BitacoraId,
      },
    });

    if (!horas) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }

    // Decodificar el nombre del archivo usando iconv-lite
    const decodedFileName = iconv.decode(
      Buffer.from(horas.NombreEvidencia, "binary"),
      "utf8"
    );

    const filePath = path.join(
      __dirname,
      "../assets/dbAttachment/",
      decodedFileName
    );

    // Escribe el archivo de evidencia en el sistema de archivos
    if (horas.Evidencias) {
      fs.writeFileSync(filePath, horas.Evidencias);
    }

    // Selecciona solo los campos requeridos para la respuesta
    const responseData = {
      BitacoraId: horas.BitacoraId,
      Identificacion: horas.Identificacion,
      GrupoId: horas.GrupoId,
      Fecha: horas.Fecha,
      DescripcionActividad: horas.DescripcionActividad,
      TipoActividad: horas.TipoActividad,
      HoraInicio: horas.HoraInicio,
      HoraFinal: horas.HoraFinal,
      NombreEvidencia: horas.NombreEvidencia,
      EstadoHoras: horas.EstadoHoras,
    };

    res.status(200).json(responseData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Proceso para verificar si un usuario ya puso horas en un determinado día
const getHorasPorFecha = async (req, res) => {
  try {
    const { Fecha, Identificacion, GrupoId } = req.body;
    const horas = await HorasBitacora.findOne({
      where: {
        Fecha: Fecha,
        EstadoHoras: "Aprobado",
        Identificacion: Identificacion,
        GrupoId: GrupoId,
      },
      attributes: ["Fecha"],
    });

    if (!horas) {
      return res.status(200).json({ message: "No hay horas en este dia" });
    } else {
      return res.status(400).json({ error: "Este dia ya posee horas" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Obtiene los registros de un usuario que se encuentren aprobados
const getHorasPorIdentificacionyGrupoIdAprobadas = async (req, res) => {
  try {
    const { Identificacion, GrupoId } = req.params;

    const horas = await HorasBitacora.findAll({
      where: {
        Identificacion: Identificacion,
        GrupoId: GrupoId,
        EstadoHoras: "Aprobado",
      },
      attributes: ["TipoActividad", "HoraInicio", "HoraFinal"],
    });

    if (!horas || horas.length === 0) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }

    res.status(200).json(horas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Obtiene los registos de un usuario
const getHorasPorIdentificacionyGrupoId = async (req, res) => {
  try {
    const { Identificacion, GrupoId } = req.params;

    const horas = await HorasBitacora.findAll({
      where: {
        Identificacion: Identificacion,
        GrupoId: GrupoId,
      },
      attributes: [
        "BitacoraId",
        "Fecha",
        "DescripcionActividad",
        "TipoActividad",
        "HoraInicio",
        "HoraFinal",
        "NombreEvidencia",
        "ComentariosRechazo",
        "EstadoHoras",
      ],
    });

    if (!horas || horas.length === 0) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }

    res.status(200).json(horas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Proceso para crear o actualizar un registro de Horas
const crearOActualizarHoras = async (req, res) => {
  try {
    const {
      BitacoraId,
      Identificacion,
      GrupoId,
      Fecha,
      DescripcionActividad,
      TipoActividad,
      HoraInicio,
      HoraFinal,
      EstadoHoras,
      ComentariosRechazo = "-", // Default to "-" if not provided
    } = req.body;

    if (!GrupoId || !Identificacion || !Fecha) {
      return res
        .status(400)
        .json({ error: "GrupoId, Identificacion, y Fecha son requeridos" });
    }

    const Evidencias = null;
    const NombreEvidencia = "-";
    const FormatoEvidencia = "-";

    if (BitacoraId) {
      // Verificar si existe un registro con el BitacoraId proporcionado
      let horaExistente = await HorasBitacora.findOne({
        where: { BitacoraId },
      });

      if (!horaExistente) {
        // Si no existe un registro con el BitacoraId proporcionado, devolver un error
        return res.status(404).json({ error: "Registro no encontrado" });
      }

      // Si existe un registro con el BitacoraId proporcionado, actualizarlo
      const updateData = {
        Identificacion,
        GrupoId,
        Fecha,
        DescripcionActividad,
        TipoActividad,
        HoraInicio,
        HoraFinal,
        Evidencias,
        NombreEvidencia,
        FormatoEvidencia,
        EstadoHoras: "Aprobado",
        ComentariosRechazo,
      };

      horaExistente = await horaExistente.update(updateData);

      return res.status(200).json(horaExistente);
    } else {
      // Crear un nuevo registro de horas
      const nuevaHora = await HorasBitacora.create({
        Identificacion,
        GrupoId,
        Fecha,
        DescripcionActividad,
        TipoActividad,
        HoraInicio,
        HoraFinal,
        Evidencias,
        NombreEvidencia,
        FormatoEvidencia,
        EstadoHoras,
        ComentariosRechazo, // Will default to "-" if not provided
      });

      return res.status(201).json(nuevaHora);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Proceso para subir un archivo a un determinado BitacoraId
const subirArchivo = async (req, res) => {
  try {
    const { BitacoraId } = req.body;

    if (!BitacoraId) {
      return res.status(400).json({ error: "Fallo al procesar el archivo" });
    }

    // Buscar el registro en HorasBitacora con el BitacoraId proporcionado
    let horaExistente = await HorasBitacora.findOne({ where: { BitacoraId } });
    if (!horaExistente) {
      // Si no se encuentra el registro, devolver un error
      return res.status(404).json({ error: "Registro no encontrado" });
    }

    // Decodificar el nombre del archivo usando iconv-lite
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
    horaExistente.Evidencias = fileContent;
    horaExistente.NombreEvidencia = decodedFileName;

    await horaExistente.save();

    // Eliminar el archivo de la carpeta ServerAttachments
    fs.unlinkSync(filePath);

    return res.status(200).json({
      message: `El archivo ${req.file.originalname} ha sido guardado exitosamente y eliminado del servidor`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//Elimina el archivo de la memoria local
const eliminarArchivo = async (req, res) => {
  try {
    const { fileName } = req.params;
    const filePath = path.join(__dirname, "../assets/dbAttachment", fileName);

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error al eliminar el archivo:", err);
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

//Proceso para rechazar un registro de horas
const rechazarHoras = async (req, res) => {
  try {
    const { BitacoraId, ComentariosRechazo } = req.body;

    if (!BitacoraId || !ComentariosRechazo) {
      return res
        .status(400)
        .json({ error: "BitacoraId y ComentariosRechazo son requeridos" });
    }

    // Buscar el registro en HorasBitacora con el BitacoraId proporcionado
    let horaExistente = await HorasBitacora.findOne({ where: { BitacoraId } });

    if (!horaExistente) {
      // Si no se encuentra el registro, devolver un error
      return res.status(404).json({ error: "Registro no encontrado" });
    }

    // Actualizar el registro con los comentarios de rechazo y cambiar el estado a Rechazado
    horaExistente.ComentariosRechazo = ComentariosRechazo;
    horaExistente.EstadoHoras = "Rechazado";
    await horaExistente.save();

    return res.status(200).json({
      message: `El registro ${horaExistente.DescripcionActividad} ha sido rechazado exitosamente`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllHoras,
  getHorasPorBitacoraId,
  getHorasPorIdentificacionyGrupoId,
  getHorasPorIdentificacionyGrupoIdAprobadas,
  crearOActualizarHoras,
  rechazarHoras,
  subirArchivo,
  descargarArchivo,
  eliminarArchivo,
  getHorasPorFecha,
};
