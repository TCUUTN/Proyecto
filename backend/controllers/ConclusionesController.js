const BoletaConclusion = require("../models/ConclusionBoleta");
const GruposEstudiantes = require("../models/GruposEstudiantes");
const TipoGrupo = require("../models/TipoGrupo");
const Usuario = require("../models/Usuario");
const Grupo = require("../models/Grupo");
const { enviarCorreo } = require("../helpers/CorreoHelper"); // Importa el helper

//Obtiene un listado de todas las conclusiones
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
        `MotivoRechazo`,
      ],
    });
    res.json(Conclusiones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Obtiene un listado de los años para filtrar las conclusiones
const getAllAnnosParaConclusion = async (req, res) => {
  try {
    const { Rol } = req.params;
    let whereClause = {};
    if (Rol === "Administrativo") {
      whereClause.EstadoBoleta = "Aprobado";
    }
    const conclusiones = await BoletaConclusion.findAll({
      where: whereClause,
      attributes: [],
      include: [{ model: Grupo, attributes: ["Anno"] }],
    });

    // Extraer los años y eliminar duplicados
    const anos = [
      ...new Set(conclusiones.map((conclusion) => conclusion.Grupo.Anno)),
    ];

    res.json(anos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Obtiene una conclusion por su ConclusionId
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
        `MotivoRechazo`,
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

//Obtiene las conclusiones por el Grupo y la identificacion del Estudiante
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
        `MotivoRechazo`,
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

// Obtiene un listado de las conclusiones que pertenecen a un determinado GrupoId
const getConclusionPorGrupoId = async (req, res) => {
  try {
    const { GrupoId } = req.params;

    const Conclusion = await BoletaConclusion.findAll({
      where: {
        GrupoId: GrupoId,
      },
      attributes: [`ConclusionId`, `Identificacion`, `EstadoBoleta`],
      include: [
        { model: Usuario, attributes: ["Nombre", "Apellido1", "Apellido2"] },
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

// Obtiene un listado de las conclusiones aprobadas que pertenecen a un determinado GrupoId
const getConclusionAprobadasPorGrupoId = async (req, res) => {
  try {
    const { GrupoId } = req.params;

    const Conclusion = await BoletaConclusion.findAll({
      where: {
        GrupoId: GrupoId,
        EstadoBoleta: "Aprobado",
      },
      attributes: [`ConclusionId`, `Identificacion`, `EstadoBoleta`],
      include: [
        { model: Usuario, attributes: ["Nombre", "Apellido1", "Apellido2"] },
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

//Proceso para crear o actualizar una conclusion
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
        where: { ConclusionId },
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

//Proceso para rechazar una conclusion
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

//Proceso para rechazar una conclusion
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
      return res
        .status(404)
        .json({ error: "Registro no encontrado" + ConclusionId });
    }

    // Actualizar el registro con los comentarios de rechazo y cambiar el estado a Rechazado
    conclusionExistente.EstadoBoleta = "Aprobado";
    await conclusionExistente.save();
    IdentificacionaAprobar = conclusionExistente.Identificacion;

    let grupoEstudianteExistente = await GruposEstudiantes.findOne({
      where: { Identificacion: IdentificacionaAprobar, Estado: "En Curso" },
      include: [
        {
          model: Grupo,
          attributes: ["CodigoMateria", "Cuatrimestre", "Anno", "NumeroGrupo"],
          include: [
            {
              model: TipoGrupo,
              attributes: ["NombreProyecto"],
            },
            {
              model: Usuario,
              attributes: [
                "Nombre",
                "Apellido1",
                "Apellido2",
                "CorreoElectronico",
              ],
            },
          ],
        },
        {
          model: Usuario,
          attributes: ["Nombre", "Apellido1", "Apellido2", "CorreoElectronico"],
        },
      ],
      attributes: [
        "GrupoId",
        "Identificacion",
        "ComentariosReprobado",
        "Estado",
        "Progreso",
      ],
    });

    if (!grupoEstudianteExistente) {
      // Si no se encuentra el registro, devolver un error
      return res
        .status(404)
        .json({ error: "Registro no encontrado " + IdentificacionaAprobar });
    }

    grupoEstudianteExistente.Estado = "Aprobado";
    await grupoEstudianteExistente.save();
    const estudianteJson = grupoEstudianteExistente.toJSON();
    const asunto =
      "Aprobación del TCU del Estudiante " +
      estudianteJson.Usuario.Nombre +
      " " +
      estudianteJson.Usuario.Apellido1 +
      " " +
      estudianteJson.Usuario.Apellido2;
    const mensajeHtml = generarAprobadoHtml(estudianteJson);
    await enviarCorreo(
      estudianteJson.Usuario.CorreoElectronico,
      asunto,
      mensajeHtml
    );

    return res.status(200).json({
      message: `La conclusion ha sido aprobada exitosamente`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Genera el correo de aprobacion del TCU
const generarAprobadoHtml = (estudiante) => {
  const year = new Date().getFullYear();
  const textColor = "#002c6b"; // Color de texto para el contenido principal
  return `
    <div style="font-family: 'Century Gothic', sans-serif; color: ${textColor};">
      <header style="background-color: #002c6b; color: white; text-align: center; padding: 10px;">
        <h1 style="margin: 0;">Aprobación del TCU UTN</h1>
      </header>
      <div style="padding: 20px;">
        <p>Estimado(a): ${estudiante.Usuario.Nombre} ${estudiante.Usuario.Apellido1} ${estudiante.Usuario.Apellido2}</p>
        <p>Es de nuestro agrado informarle que su TCU de ${estudiante.Grupo.CodigoMateria}-${estudiante.Grupo.Grupos_TipoGrupo.NombreProyecto}, Grupo# ${estudiante.Grupo.NumeroGrupo}, matriculado el cuatrimestre ${estudiante.Grupo.Cuatrimestre} del año ${estudiante.Grupo.Anno}, <strong>ha sido aprobado</strong>, al finalizar el cuatrimestre, esto se vera reflejado en el sistema de calificaciones</p> 
        <p></p>
        <p>Esperamos que tenga mucho éxito en la finalización de su carrera universitaria</p>
        <p></p>
        <p>Saludos Cordiales</p>
        <p></p>
        <p><strong>Departamento de Coordinación TCU</strong></p>
        </div>
        <footer style="background-color: #002c6b; color: white; text-align: center; padding: 10px; margin-top: 20px;">
        <p>Bitácora TCU - Derechos Reservados © ${year}</p>
      </footer>
    </div>
  `;
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
  getAllAnnosParaConclusion,
};
