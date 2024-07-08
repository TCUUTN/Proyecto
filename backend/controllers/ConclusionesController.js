const BoletaConclusion = require("../models/ConclusionBoleta");
const GruposEstudiantes = require("../models/GruposEstudiantes");
const Usuario = require('../models/Usuario');
const getAllConclusiones = async (req, res) => {
  try {
    const Conclusiones = await BoletaConclusion.findAll({
      attributes: [
        `ConclusionId`,
        `Identificacion`,
        `GrupoId`,
        `Labor1`,
        `Labor2`,
        `Labor3`,
        `Labor4`,
        `Labor5`,
        `Labor6`,
        `Comentarios`,
        `EstadoBoleta`,
        `MotivoRechazo`
      ],
    });
    res.json(Conclusiones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getConclusionPorConclusionId = async (req, res) => {
  try {
    const { ConclusionId } = req.params;

    const Conclusion = await BoletaConclusion.findOne({
      where: {
        ConclusionId: ConclusionId,
      },
      attributes: [
        `ConclusionId`,
        `Identificacion`,
        `GrupoId`,
        `Labor1`,
        `Labor2`,
        `Labor3`,
        `Labor4`,
        `Labor5`,
        `Labor6`,
        `Comentarios`,
        `EstadoBoleta`,
        `MotivoRechazo`
      ],
    });

    if (!Conclusion) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }
    res.status(200).json(Conclusion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getConclusionPorIdentificacionyGrupoId = async (req, res) => {
  try {
    const { Identificacion, GrupoId } = req.params;

    const Conclusion = await BoletaConclusion.findOne({
      where: {
        Identificacion: Identificacion,
        GrupoId: GrupoId,
      },
      attributes: [
        `ConclusionId`,
        `Identificacion`,
        `GrupoId`,
        `Labor1`,
        `Labor2`,
        `Labor3`,
        `Labor4`,
        `Labor5`,
        `Labor6`,
        `Comentarios`,
        `EstadoBoleta`,
        `MotivoRechazo`
      ],
    });

    if (!Conclusion) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }

    res.status(200).json(Conclusion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getConclusionPorGrupoId = async (req, res) => {
  try {
    const { GrupoId } = req.params;

    const Conclusion = await BoletaConclusion.findAll({
      where: {
        GrupoId: GrupoId,
      },
      attributes: [
        `ConclusionId`,
        `Identificacion`,
        `EstadoBoleta`,
      ],
      include: [
        { model: Usuario, attributes: ['Nombre', 'Apellido1', 'Apellido2'] }
      ],
    });

    if (!Conclusion) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }

    res.status(200).json(Conclusion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getConclusionAprobadasPorGrupoId = async (req, res) => {
  try {
    const { GrupoId } = req.params;

    const Conclusion = await BoletaConclusion.findAll({
      where: {
        GrupoId: GrupoId,
        EstadoBoleta: "Aprobado",
      },
      attributes: [
        `ConclusionId`,
        `Identificacion`,
        `EstadoBoleta`,
      ],
      include: [
        { model: Usuario, attributes: ['Nombre', 'Apellido1', 'Apellido2'] }
      ],
    });

    if (!Conclusion) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }

    res.status(200).json(Conclusion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const crearOActualizarConclusiones = async (req, res) => {
  try {
    const {
      ConclusionId,
      Identificacion,
      GrupoId,
      Labor1,
      Labor2,
      Labor3,
      Labor4,
      Labor5,
      Labor6,
      Comentarios = "-",
    } = req.body;

    if (
      !GrupoId ||
      !Identificacion ||
      !Labor1 ||
      !Labor2 ||
      !Labor3 ||
      !Labor4 ||
      !Labor5 ||
      !Labor6
    ) {
      return res.status(400).json({ error: "Faltan valores son requeridos" });
    }

    if (ConclusionId) {
      // Verificar si existe un registro con el BitacoraId proporcionado
      let conclusionExistente = await BoletaConclusion.findOne({
        where: { conclusionExistente },
      });

      if (!conclusionExistente) {
        // Si no existe un registro con el BitacoraId proporcionado, devolver un error
        return res.status(404).json({ error: "Registro no encontrado" });
      }

      // Si existe un registro con el BitacoraId proporcionado, actualizarlo
      const updateData = {
        ConclusionId,
        Identificacion,
        GrupoId,
        Labor1,
        Labor2,
        Labor3,
        Labor4,
        Labor5,
        Labor6,
        Comentarios,
        EstadoBoleta: "En Proceso",
      };

      conclusionExistente = await conclusionExistente.update(updateData);

      return res.status(200).json(conclusionExistente);
    } else {
      // Crear un nuevo registro de horas
      const nuevaConclusion = await BoletaConclusion.create({
        ConclusionId,
        Identificacion,
        GrupoId,
        Labor1,
        Labor2,
        Labor3,
        Labor4,
        Labor5,
        Labor6,
        Comentarios,
        EstadoBoleta: "En Proceso",
      });

      return res.status(201).json(nuevaConclusion);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const rechazarConclusion = async (req, res) => {
  try {
    const { ConclusionId, MotivoRechazo } = req.body;

    if (!ConclusionId || !MotivoRechazo) {
      return res
        .status(400)
        .json({ error: "ConclusionId y MotivoRechazo son requeridos" });
    }

    // Buscar el registro en HorasBitacora con el BitacoraId proporcionado
    let conclusionExistente = await BoletaConclusion.findOne({
      where: { ConclusionId },
    });

    if (!conclusionExistente) {
      // Si no se encuentra el registro, devolver un error
      return res.status(404).json({ error: "Registro no encontrado" });
    }

    // Actualizar el registro con los comentarios de rechazo y cambiar el estado a Rechazado
    conclusionExistente.MotivoRechazo = MotivoRechazo;
    conclusionExistente.EstadoBoleta = "Rechazado";
    await conclusionExistente.save();

    return res.status(200).json({
      message: `La conclusion ha sido rechazada exitosamente`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const aprobarConclusion = async (req, res) => {
  try {
    const { ConclusionId } = req.params;

    if (!ConclusionId) {
      return res.status(400).json({ error: "ConclusionId es requerido" });
    }

    // Buscar el registro en HorasBitacora con el BitacoraId proporcionado
    let conclusionExistente = await BoletaConclusion.findOne({
      where: { ConclusionId },
    });

    if (!conclusionExistente) {
      // Si no se encuentra el registro, devolver un error
      return res.status(404).json({ error: "Registro no encontrado" });
    }

    // Actualizar el registro con los comentarios de rechazo y cambiar el estado a Rechazado
    conclusionExistente.EstadoBoleta = "Aprobado";
    await conclusionExistente.save();
    IdentificacionaAprobar = conclusionExistente.Identificacion;

    let grupoEstudianteExistente = await GruposEstudiantes.findOne({
      where: { Identificacion: IdentificacionaAprobar, Estado: "En Curso" },
    });

    if (!grupoEstudianteExistente) {
      // Si no se encuentra el registro, devolver un error
      return res.status(404).json({ error: "Registro no encontrado" });
    }

    grupoEstudianteExistente.Estado = "Aprobado";
    await grupoEstudianteExistente.save();

    return res.status(200).json({
      message: `La conclusion ha sido aprobada exitosamente`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllConclusiones,
  getConclusionPorConclusionId,
  getConclusionPorIdentificacionyGrupoId,
  getConclusionPorGrupoId,
  getConclusionAprobadasPorGrupoId,
  crearOActualizarConclusiones,
  rechazarConclusion,
  aprobarConclusion,
};
