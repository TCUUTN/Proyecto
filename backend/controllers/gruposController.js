const pool = require("../config/db");
const Grupo = require("../models/Grupo");
const TipoGrupo = require("../models/TipoGrupo");
const GruposEstudiantes = require("../models/GruposEstudiantes");
const Horas = require("../models/HorasBitacora")
const Usuario = require('../models/Usuario');
const BoletaConclusion = require('../models/ConclusionBoleta');
const { Op } = require('sequelize');


const getAllGrupos = async (req, res) => {
  try {
    const grupos = await Grupo.findAll({
      include: [
        { model: TipoGrupo, attributes: ['NombreProyecto', 'TipoCurso'] },
        { model: Usuario, attributes: ['Nombre', 'Apellido1', 'Apellido2'] }
      ],
    });
    res.json(grupos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllTiposGrupos = async (req, res) => {
  try {
    const tiposGrupos  = await TipoGrupo.findAll();
    res.json(tiposGrupos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllGruposEstudiantes = async (req, res) => {
  try {
    const gruposEstudiantes = await GruposEstudiantes.findAll();
    res.json(gruposEstudiantes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getGrupoPorGrupoId = async (req, res) => {
  try {
    const { GrupoId } = req.params;

    const grupo = await Grupo.findOne({
      where: {
        GrupoId: GrupoId,
      },
      include: [
        { model: TipoGrupo, attributes: ['NombreProyecto', 'TipoCurso'] },
        { model: Usuario, attributes: ['Nombre', 'Apellido1', 'Apellido2','CorreoElectronico'] }
      ],
    });

    if (!grupo) {
      return res.status(404).json({ error: "Grupo no encontrado" });
    }

    res.status(200).json(grupo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getGrupoPorIdentificacion = async (req, res) => {
  try {
    const { Identificacion } = req.params;

    const grupo = await Grupo.findAll({
      where: {
        Identificacion: Identificacion,
        
      },
      include: [
        { model: TipoGrupo, attributes: ['NombreProyecto', 'TipoCurso'] },
      ],
    });

    if (grupo.length === 0) {
      return res.status(404).json({ error: "El Académico no tiene grupos a cargo" });
    }

    res.status(200).json(grupo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getTipoGrupoPorCodigoMateria = async (req, res) => {
  try {
    const {CodigoProyecto} = req.params;

    const tipoGrupo = await TipoGrupo.findOne({
      where: {
        CodigoMateria: CodigoProyecto,
      },
      attributes: ['CodigoMateria','NombreProyecto', 'TipoCurso']

    });

    if (!tipoGrupo) {
      return res.status(404).json({ error: "Tipo de Grupo no encontrado" });
    }

    res.status(200).json(tipoGrupo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEstudiantePorGrupo = async (req, res) => {
  try {
    const { Identificacion, GrupoId } = req.params;

    const estudianteGrupo = await GruposEstudiantes.findOne({
      where: {
        Identificacion: Identificacion,
        GrupoId: GrupoId,
      },
    });

    if (!estudianteGrupo) {
      return res.status(404).json({ error: "Estudiante en el Grupo no encontrado" });
    }

    res.status(200).json(estudianteGrupo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getGrupoEstudianteporIdentificacion = async (req, res) => {
  try {
    const { Identificacion } = req.params;

    const estudianteGrupo = await GruposEstudiantes.findOne({
      where: {
        Identificacion: Identificacion,
        Estado: {
          [Op.or]: ["En Curso", "Aprobado"],
        },
      },
    });

    if (!estudianteGrupo) {
      return res.status(404).json({ error: "Estudiante en el Grupo no encontrado" });
    }

    res.status(200).json(estudianteGrupo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getListaEstudiantes = async (req, res) => {
  try {
    const {GrupoId } = req.params;

    const estudianteGrupo = await GruposEstudiantes.findAll({
      where: {
        GrupoId: GrupoId,
      },
      attributes: ['Estado','Progreso'],
      include: [
        { model: Usuario, attributes: ['Nombre', 'Apellido1', 'Apellido2', 'CorreoElectronico', 'Identificacion'] },
      ],
    });

    if (!estudianteGrupo) {
      return res.status(404).json({ error: "Estudiante en el Grupo no encontrado" });
    }

    res.status(200).json(estudianteGrupo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Crear o actualizar TipoGrupo
const crearOActualizarTipoGrupo = async (req, res) => {
  try {
    const { CodigoMateria, NombreProyecto, TipoCurso} = req.body;

    let tipoGrupoExistente = await TipoGrupo.findOne({ where: { CodigoMateria } });

    if (tipoGrupoExistente) {
      tipoGrupoExistente = await tipoGrupoExistente.update({
        NombreProyecto,
        TipoCurso
      });

      return res.status(200).json(tipoGrupoExistente);
    }

    const nuevoTipoGrupo = await TipoGrupo.create({
      CodigoMateria,
      NombreProyecto,
      TipoCurso
    });

    res.status(201).json(nuevoTipoGrupo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const crearOActualizarGrupo = async (req, res) => {
  try {
    const { GrupoId, CodigoMateria, NumeroGrupo, Horario, Aula, Cuatrimestre, Anno, Identificacion, Estado} = req.body;

    if (!GrupoId) {
      // Si no se proporciona un GrupoId, crear un nuevo grupo
      const nuevoGrupo = await Grupo.create({
        CodigoMateria,
        NumeroGrupo,
        Horario,
        Aula,
        Cuatrimestre,
        Anno,
        Identificacion,
        Estado
      });

      return res.status(201).json(nuevoGrupo);
    }

    // Verificar si existe un grupo con el GrupoId proporcionado
    let grupoExistente = await Grupo.findOne({ where: { GrupoId } });

    if (!grupoExistente) {
      // Si no existe un grupo con el GrupoId proporcionado, crear uno nuevo
      const nuevoGrupo = await Grupo.create({
        GrupoId,
        CodigoMateria,
        NumeroGrupo,
        Horario,
        Aula,
        Cuatrimestre,
        Anno,
        Identificacion,
        Estado
      });

      return res.status(201).json(nuevoGrupo);
    }

    // Si existe un grupo con el GrupoId proporcionado, actualizarlo
    grupoExistente = await grupoExistente.update({
      CodigoMateria,
      NumeroGrupo,
      Horario,
      Aula,
      Cuatrimestre,
      Anno,
      Identificacion,
      Estado
    });

    return res.status(200).json(grupoExistente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Crear o actualizar Estudiante en Grupo
const crearOActualizarGrupoEstudiante = async (req, res) => {
  try {
    const { Identificacion, GrupoId, Estado} = req.body;

    let estudianteGrupoExistente = await GruposEstudiantes.findOne({ where: { Identificacion, GrupoId } });

    if (estudianteGrupoExistente) {
      estudianteGrupoExistente = await estudianteGrupoExistente.update({
        Estado,
      });

      return res.status(200).json(estudianteGrupoExistente);
    }

    const nuevoEstudianteGrupo = await GruposEstudiantes.create({
      Identificacion,
      GrupoId,
      Estado
    });

    res.status(201).json(nuevoEstudianteGrupo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const cargarGrupos = async (req, res) => {
  const grupos = req.body;
  console.log(grupos);
  try {
    for (let grupoData of grupos) {
      // Buscar el grupo existente por Anno, Sede, Cuatrimestre, NumeroGrupo, y CodigoMateria
      let grupoExistente = await Grupo.findOne({
        where: {
          Anno: grupoData.Anno,
          Sede: grupoData.Sede,
          Cuatrimestre: grupoData.Cuatrimestre,
          NumeroGrupo: grupoData.NumeroGrupo,
          CodigoMateria: grupoData.CodigoMateria
        },
      });

      if (!grupoExistente) {
        // Si no existe un grupo con los criterios proporcionados, crear un nuevo grupo
        await Grupo.create({
          CodigoMateria: grupoData.CodigoMateria,
          NumeroGrupo: grupoData.NumeroGrupo,
          Horario: grupoData.Horario,
          Sede: grupoData.Sede,
          Aula: grupoData.Aula,
          Cuatrimestre: grupoData.Cuatrimestre,
          Anno: grupoData.Anno,
          Identificacion: grupoData.Identificacion,
          Estado: grupoData.Estado
        });
      } else {
        // Si el grupo existe, actualizarlo
        await grupoExistente.update({
          CodigoMateria: grupoData.CodigoMateria,
          NumeroGrupo: grupoData.NumeroGrupo,
          Horario: grupoData.Horario,
          Sede: grupoData.Sede,
          Aula: grupoData.Aula,
          Cuatrimestre: grupoData.Cuatrimestre,
          Anno: grupoData.Anno,
          Identificacion: grupoData.Identificacion,
          Estado: grupoData.Estado
        });
      }
    }

    res.status(200).send('Grupos cargados/actualizados exitosamente');
  } catch (error) {
    console.error('Error al cargar/actualizar los grupos:', error);
    res.status(500).send('Error al cargar/actualizar los grupos');
  }
};


const cargarTipoGrupos = async (req, res) => {
  const tipoGrupos = req.body;

  try {
    for (let tipoGrupoData of tipoGrupos) {
      // Check if a TipoGrupo with the provided CodigoMateria already exists
      let tipoGrupoExistente = await TipoGrupo.findOne({
        where: {
          CodigoMateria: tipoGrupoData.CodigoMateria,
        },
      });

      if (!tipoGrupoExistente) {
        // If it doesn't exist, create a new TipoGrupo
        await TipoGrupo.create({
          CodigoMateria: tipoGrupoData.CodigoMateria,
          NombreProyecto: tipoGrupoData.NombreProyecto,
          TipoCurso: tipoGrupoData.TipoCurso
        });
      } else {
        // If it exists, update the existing TipoGrupo
        await tipoGrupoExistente.update({
          NombreProyecto: tipoGrupoData.NombreProyecto,
          TipoCurso: tipoGrupoData.TipoCurso
        });
      }
    }

    res.status(200).send('TipoGrupos cargados/actualizados exitosamente');
  } catch (error) {
    console.error('Error al cargar/actualizar los TipoGrupos:', error);
    res.status(500).send('Error al cargar/actualizar los TipoGrupos');
  }
};



const EstadoGrupo = async (req, res) => {
  try {
    const { GrupoId } = req.body;

    // Buscar el grupo por su ID
    const grupo = await Grupo.findOne({
      where: {
        GrupoId: GrupoId,
      },
    });

    if (!grupo) {
      return res.status(404).json({ error: "Grupo no encontrado" });
    }

    // Cambiar el estado del grupo
    grupo.Estado = !grupo.Estado;

    // Guardar los cambios en la base de datos
    await grupo.save();

    res.status(200).json(grupo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getGrupoPorIdentificacionParaConclusion = async (req, res) => {
  try {
    const { Identificacion } = req.params;

    const grupos = await Grupo.findAll({
      where: {
        Identificacion: Identificacion,
      },
      include: [
        { model: TipoGrupo, attributes: ['NombreProyecto', 'TipoCurso'] },
      ],
    });

    if (grupos.length === 0) {
      return res.status(404).json({ error: "El Académico no tiene grupos a cargo" });
    }

    const grupoIds = grupos.map(grupo => grupo.GrupoId);

    const boletas = await BoletaConclusion.findAll({
      where: {
        GrupoId: {
          [Op.in]: grupoIds,
        },
      },
      attributes: ['GrupoId'],
    });

    const grupoIdsConBoleta = boletas.map(boleta => boleta.GrupoId);

    const gruposConBoleta = grupos.filter(grupo => grupoIdsConBoleta.includes(grupo.GrupoId));

    if (gruposConBoleta.length === 0) {
      return res.status(404).json({ error: "El Académico no tiene grupos a cargo con boletas de conclusión" });
    }

    res.status(200).json(gruposConBoleta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getGrupoPorAnnoyCuatrimestreParaConclusion = async (req, res) => {
  try {
    const { Anno, Cuatrimestre, Sede } = req.body;
    const whereClause = {
      Anno: Anno,
      Cuatrimestre: Cuatrimestre,
    };

    if (Sede !== 'Todas') {
      whereClause.Sede = Sede;
    }

    const grupos = await Grupo.findAll({
      where: whereClause,
      include: [
        { model: TipoGrupo, attributes: ['NombreProyecto', 'TipoCurso'] },
      ],
    });

    if (grupos.length === 0) {
      return res.status(404).json({ error: "No hay grupos para este periodo" });
    }

    const grupoIds = grupos.map(grupo => grupo.GrupoId);

    const boletas = await BoletaConclusion.findAll({
      where: {
        EstadoBoleta: "Aprobado",
        GrupoId: {
          [Op.in]: grupoIds,
        },
      },
      attributes: ['GrupoId'],
    });

    const grupoIdsConBoleta = boletas.map(boleta => boleta.GrupoId);

    const gruposAprobadosConBoleta = grupos.filter(grupo =>
      grupoIdsConBoleta.includes(grupo.GrupoId)
    );

    if (gruposAprobadosConBoleta.length === 0) {
      return res.status(404).json({ error: "No hay Boletas de conclusion para este periodo" });
    }

    res.status(200).json(gruposAprobadosConBoleta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const FinalizarCuatrimestre = async (req, res) => {
  try {
    const { GrupoId } = req.params;

    // Traer todos los GruposEstudiantes relacionados a ese grupo
    const estudiantesGrupo = await GruposEstudiantes.findAll({
      where: { GrupoId: GrupoId }
    });

    if (!estudiantesGrupo || estudiantesGrupo.length === 0) {
      return res.status(404).json({ error: "No se encontraron estudiantes en el grupo" });
    }

    for (const estudiante of estudiantesGrupo) {
      if (estudiante.Estado === "En Curso") {
        const horasAprobadas = await Horas.findAll({
          where: {
            Identificacion: estudiante.Identificacion,
            EstadoHoras: "Aprobado"
          },
          attributes: [
            'TipoActividad',
            'HoraInicio',
            'HoraFinal',
          ]
        });

        // Si no hay registros de horas, marcar como reprobado
        if (!horasAprobadas || horasAprobadas.length === 0) {
          await estudiante.update({
            Estado: "Reprobado",
            ComentariosReprobado: "El estudiante no subió registro alguno de actividades, por lo tanto no cumplió con los mínimos establecidos de horas completadas y aprobadas para poder optar por el cuatrimestre de Continuidad"
          });
          continue;
        }

        const totalHoras = horasAprobadas.reduce((total, hora) => {
          const horaInicio = new Date(`1970-01-01T${hora.dataValues.HoraInicio}`);
          const horaFinal = new Date(`1970-01-01T${hora.dataValues.HoraFinal}`);
          const diff = (horaFinal - horaInicio) / (1000 * 60 * 60); // Diferencia en horas
          return total + diff;
        }, 0);

        let estadoFinal = "Aprobado";
        let comentarioReprobado = "";
        switch (estudiante.Progreso) {
          case "Nuevo":
            if (totalHoras < 40) {
              estadoFinal = "Reprobado";
              comentarioReprobado = "El estudiante no cumplió con los mínimos establecidos de horas completadas y aprobadas para poder optar por el cuatrimestre de Continuidad";
            } else {
              await estudiante.update({
                Progreso: "Continuidad"
              });
            }
            break;
          case "Continuidad":
            if (totalHoras < 80) {
              estadoFinal = "Reprobado";
              comentarioReprobado = "El estudiante no cumplió con los mínimos establecidos de horas completadas y aprobadas para poder optar por el cuatrimestre de Prórroga";
            } else {
              await estudiante.update({
                Progreso: "Prórroga"
              });
            }
            break;
          case "Prórroga":
            if (totalHoras < 150) {
              estadoFinal = "Reprobado";
              comentarioReprobado = "El estudiante no cumplió con los mínimos establecidos de horas completadas y aprobadas durante el tiempo máximo para realizar el TCU";
            } else {
              await estudiante.update({
                Estado: "Aprobado"
              });
            }
            break;
          default:
            break;
        }

        if (estadoFinal === "Reprobado") {
          await estudiante.update({
            Estado: estadoFinal,
            ComentariosReprobado: comentarioReprobado
          });
        }
      }
    }

    // Verificar si algún estudiante sigue en curso
    const estudiantesEnCurso = await GruposEstudiantes.findAll({
      where: {
        GrupoId: GrupoId,
        Estado: "En Curso"
      }
    });

    if (estudiantesEnCurso.length === 0) {
      const grupo = await Grupo.findOne({
        where: { GrupoId: GrupoId }
      });

      if (grupo) {
        await grupo.update({ Estado: 1 });
      }
    }

    res.status(200).json({ message: "Solicitud realizada con éxito" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  getAllGrupos,
  getAllTiposGrupos,
  getAllGruposEstudiantes,
  getGrupoPorGrupoId,
  getTipoGrupoPorCodigoMateria,
  getEstudiantePorGrupo,
  crearOActualizarTipoGrupo,
  crearOActualizarGrupo,
  crearOActualizarGrupoEstudiante,
  EstadoGrupo,
  cargarGrupos,
  getGrupoPorIdentificacion,
  cargarTipoGrupos,
  getListaEstudiantes,
  getGrupoEstudianteporIdentificacion,
  getGrupoPorIdentificacionParaConclusion,
  getGrupoPorAnnoyCuatrimestreParaConclusion,
  FinalizarCuatrimestre
};
