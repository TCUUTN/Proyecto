const HorasBitacora = require('../models/HorasBitacora');
const Informacion = require('../models/Informacion');
const fs =require('fs');
const path = require('path')
const iconv = require('iconv-lite');

const descargarArchivo = async (req, res) => {
  try {
      const { InformacionId } = req.params;
      const info = await Informacion.findOne({
          where: {
            InformacionId: InformacionId,
          },
          attributes: [
              'Archivo',
              'NombreArchivo'
          ]
      });

      if (!info) {
          return res.status(404).json({ error: "Registro no encontrado" });
      }
      const filePath = path.join(__dirname, '../assets/dbAttachment/', info.NombreArchivo);

      fs.writeFileSync(filePath, info.Archivo);

      res.status(200).json(info.NombreArchivo);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

const getinfoPorInformacionId = async (req, res) => {
  try {
    const { InformacionId } = req.params;

    const info = await Informacion.findOne({
      where: {
        InformacionId: InformacionId,
      },
      attributes: [
        'InformacionId',
        'NombreArchivo',
        'Descripcion',
        'Fecha',
        'Estado'
      ]
    });

    if (!info) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }

    res.status(200).json(info);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getInformacionPorGrupoId = async (req, res) => {
  try {
    const { GrupoId, SelectedRole } = req.body;

    // Construye el objeto 'where'
    const whereClause = {
      GrupoId: GrupoId,
      TipoInformacion: "Académico"
    };

    // Si el rol es 'Estudiante', agrega la condición 'Estado: 1'
    if (SelectedRole === "Estudiante") {
      whereClause.Estado = 1;
    }

    const info = await Informacion.findAll({
      where: whereClause,
      attributes: [
        'InformacionId',
        'NombreArchivo',
        'Descripcion',
        'Fecha',
        'Estado'
      ]
    });

    if (!info || info.length === 0) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }

    res.status(200).json(info);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getInformacionPorSedeyTipoInformacion = async (req, res) => {
  try {
    const { Sede, TipoInformacion } = req.body;
    console.log(Sede)
    console.log(TipoInformacion)
    // Definimos el filtro para la Sede
    let sedeFilter = Sede === 'Todas' ? Sede : [Sede, 'Todas'];

    const info = await Informacion.findAll({
      where: {
        Sede: sedeFilter,
        TipoInformacion: TipoInformacion,
      },
      attributes: [
        'InformacionId',
        'NombreArchivo',
        'Descripcion',
        'Fecha',
        'Estado'
      ]
    });

    if (!info || info.length === 0) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }

    res.status(200).json(info);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


  const crearOActualizarInformacion = async (req, res) => {
    try {
        const {
            InformacionId,
            Identificacion,
            GrupoId,
            Fecha,
            Descripcion,
            TipoInformacion,
            Sede,
            Estado
        } = req.body;

        if (!Identificacion || !Fecha) {
            return res.status(400).json({ error: 'Identificacion, y Fecha son requeridos' });
        }

        const Archivo = null;
        const NombreArchivo = "-";

        if (InformacionId) {
            // Verificar si existe un registro con el BitacoraId proporcionado
            let infoExistente = await Informacion.findOne({ where: { InformacionId } });

            if (!infoExistente) {
                // Si no existe un registro con el BitacoraId proporcionado, devolver un error
                return res.status(404).json({ error: 'Registro no encontrado' });
            }

            // Si existe un registro con el BitacoraId proporcionado, actualizarlo
            const updateData = {
              InformacionId,
              Identificacion,
              GrupoId,
              Fecha,
              Descripcion,
              TipoInformacion,
              Sede,
              Estado
            };

            infoExistente = await infoExistente.update(updateData);

            return res.status(200).json(infoExistente);
        } else {
            // Crear un nuevo registro de horas
            const nuevaInfo = await Informacion.create({
              Identificacion,
              GrupoId,
              Fecha,
              Descripcion,
              TipoInformacion,
              Sede,
              Archivo,
              NombreArchivo,
              Estado:1
            });

            return res.status(201).json(nuevaInfo);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const subirArchivo = async (req, res) => {
  try {
    const { InformacionId } = req.body;

    if (!InformacionId) {
      return res.status(400).json({ error: 'Fallo al procesar el archivo' });
    }

    // Buscar el registro en HorasBitacora con el BitacoraId proporcionado
    let infoExistente = await Informacion.findOne({ where: { InformacionId } });
    if (!infoExistente) {
      // Si no se encuentra el registro, devolver un error
      return res.status(404).json({ error: 'Registro no encontrado' });
    }

        // Decodificar el nombre del archivo usando iconv-lite
        const decodedFileName = iconv.decode(Buffer.from(req.file.originalname, 'binary'), 'utf8');

    const filePath = path.join(__dirname, '../assets/ServerAttachments', req.file.filename);
    const fileContent = fs.readFileSync(filePath);
    infoExistente.Archivo = fileContent;
    infoExistente.NombreArchivo = decodedFileName;

    await infoExistente.save();

    // Borrar el archivo del servidor
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Error al eliminar el archivo: ${err}`);
      } else {
        console.log(`Archivo ${filePath} eliminado exitosamente`);
      }
    });

    return res.status(200).json({
      message: `El archivo ${req.file.originalname} ha sido guardado exitosamente`
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const eliminarArchivo = async (req, res) => {
  try {
    const { fileName } = req.params;
    const filePath = path.join(__dirname, '../assets/dbAttachment', fileName);
  
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error al eliminar el archivo:", err);
        return res.status(500).json({ message: "Error al eliminar el archivo" });
      }
      res.status(200).json({ message: "Archivo eliminado exitosamente" });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getinfoPorInformacionId,
  getInformacionPorGrupoId,
  getInformacionPorSedeyTipoInformacion,
  crearOActualizarInformacion,
  subirArchivo, 
  descargarArchivo,
  eliminarArchivo,
};
