const pool = require("../config/db");
const Grupo = require("../models/Grupo");
const TipoGrupo = require("../models/TipoGrupo");
const GruposEstudiantes = require("../models/GruposEstudiantes");
const Usuario = require('../models/Usuario');


const getAllGrupos = async (req, res) => {
  try {
    const grupos = await Grupo.findAll();
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
    });

    if (!grupo) {
      return res.status(404).json({ error: "Grupo no encontrado" });
    }

    res.status(200).json(grupo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTipoGrupoPorCodigoMateria = async (req, res) => {
  try {
    const { CodigoMateria } = req.params;

    const tipoGrupo = await TipoGrupo.findOne({
      where: {
        CodigoMateria: CodigoMateria,
      },
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

  try {
    for (let grupoData of grupos) {
      if (!grupoData.GrupoId) {
        // If GrupoId is not provided, create a new group immediately
        await Grupo.create({
          CodigoMateria: grupoData.CodigoMateria,
          NumeroGrupo: grupoData.NumeroGrupo,
          Horario: grupoData.Horario,
          Aula: grupoData.Aula,
          Cuatrimestre: grupoData.Cuatrimestre,
          Anno: grupoData.Anno,
          Identificacion: grupoData.Identificacion,
          Estado: grupoData.Estado
        });
      } else {
        // If GrupoId is provided, check if the group exists
        let grupoExistente = await Grupo.findOne({
          where: {
            GrupoId: grupoData.GrupoId,
          },
        });

        if (!grupoExistente) {
          // If the group with provided GrupoId doesn't exist, create a new group
          await Grupo.create({
            GrupoId: grupoData.GrupoId,
            CodigoMateria: grupoData.CodigoMateria,
            NumeroGrupo: grupoData.NumeroGrupo,
            Horario: grupoData.Horario,
            Aula: grupoData.Aula,
            Cuatrimestre: grupoData.Cuatrimestre,
            Anno: grupoData.Anno,
            Identificacion: grupoData.Identificacion,
            Estado: grupoData.Estado
          });
        } else {
          // If the group exists, update it
          await grupoExistente.update({
            CodigoMateria: grupoData.CodigoMateria,
            NumeroGrupo: grupoData.NumeroGrupo,
            Horario: grupoData.Horario,
            Aula: grupoData.Aula,
            Cuatrimestre: grupoData.Cuatrimestre,
            Anno: grupoData.Anno,
            Identificacion: grupoData.Identificacion,
            Estado: grupoData.Estado
          });
        }
      }
    }

    res.status(200).send('Grupos cargados/actualizados exitosamente');
  } catch (error) {
    console.error('Error al cargar/actualizar los grupos:', error);
    res.status(500).send('Error al cargar/actualizar los grupos');
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
  cargarGrupos
};
