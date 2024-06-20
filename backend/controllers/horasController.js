const HorasBitacora = require('../models/HorasBitacora');

const getAllHoras = async (req, res) => {
  try {
    const Horas = await HorasBitacora.findAll();
    res.json(Horas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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
  
      res.status(200).json(horas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const getHorasPorIdentificacionyGrupoId = async (req, res) => {
    try {
      const { Identificacion, GrupoId } = req.params;
  
      const horas = await HorasBitacora.findAll({
        where: {
            Identificacion: Identificacion,
            GrupoId:GrupoId
        },
      });
  
      if (!horas) {
        return res.status(404).json({ error: "Registro no encontrado" });
      }
  
      res.status(200).json(horas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

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
            Evidencias, 
            EstadoHoras, 
            ComentariosRechazo = "-"  // Default to "-" if not provided
        } = req.body;

        if (!GrupoId || !Identificacion || !Fecha) {
            return res.status(400).json({ error: 'GrupoId, Identificacion, y Fecha son requeridos' });
        }

        if (BitacoraId) {
            // Verificar si existe un registro con el BitacoraId proporcionado
            let horaExistente = await HorasBitacora.findOne({ where: { BitacoraId } });

            if (!horaExistente) {
                // Si no existe un registro con el BitacoraId proporcionado, devolver un error
                return res.status(404).json({ error: 'Registro no encontrado' });
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
                EstadoHoras:"Aprobado",
                ComentariosRechazo
            };

            if (Evidencias === null) {
                // Borrar la evidencia existente si no se proporciona nueva evidencia
                updateData.Evidencias = null;
            } else {
                updateData.Evidencias = Evidencias;
            }

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
                Evidencias,  // Default to null if not provided
                EstadoHoras,
                ComentariosRechazo  // Will default to "-" if not provided
            });

            return res.status(201).json(nuevaHora);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const rechazarHoras = async (req, res) => {
    try {
        const { BitacoraId, ComentariosRechazo } = req.body;

        if (!BitacoraId || !ComentariosRechazo) {
            return res.status(400).json({ error: 'BitacoraId y ComentariosRechazo son requeridos' });
        }

        // Buscar el registro en HorasBitacora con el BitacoraId proporcionado
        let horaExistente = await HorasBitacora.findOne({ where: { BitacoraId } });

        if (!horaExistente) {
            // Si no se encuentra el registro, devolver un error
            return res.status(404).json({ error: 'Registro no encontrado' });
        }

        // Actualizar el registro con los comentarios de rechazo y cambiar el estado a Rechazado
        horaExistente.ComentariosRechazo = ComentariosRechazo;
        horaExistente.EstadoHoras = 'Rechazado';
        await horaExistente.save();

        return res.status(200).json({
            message: `El registro ${horaExistente.DescripcionActividad} ha sido rechazado exitosamente`
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
  getAllHoras,
  getHorasPorBitacoraId,
  getHorasPorIdentificacionyGrupoId,
  crearOActualizarHoras,
  rechazarHoras
};
