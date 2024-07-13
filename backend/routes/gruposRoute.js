const express = require('express');
const router = express.Router();
const gruposController = require('../controllers/gruposController');

router.get('/', gruposController.getAllGrupos);
router.get('/tipos', gruposController.getAllTiposGrupos);
router.get('/GruposEstudiantes', gruposController.getAllGruposEstudiantes);
router.get('/EstudiantesActivos/:Sede', gruposController.getEstudianteAdministrativo);
router.get('/PruebaEstudiantes/:GrupoId', gruposController.getprueba);
router.get('/GruposActivos/:Sede', gruposController.getGruposActivos);
router.get('/GruposEstudiantes/:Identificacion/:GrupoId', gruposController.getEstudiantePorGrupo);
router.get('/tipos/:CodigoProyecto', gruposController.getTipoGrupoPorCodigoMateria);
router.get('/GrupoEstudiante/:Identificacion', gruposController.getGrupoEstudianteporIdentificacion);
router.get('/GrupoEstudianteUsuario/:Identificacion', gruposController.getGrupoEstudianteporIdentificacionParaUsuario);
router.get('/Academicos/:Identificacion', gruposController.getGrupoPorIdentificacion);
router.get('/Conclusiones/:Identificacion', gruposController.getGrupoPorIdentificacionParaConclusion);
router.get('/ListaEstudiantes/:GrupoId', gruposController.getListaEstudiantes);
router.get('/:GrupoId', gruposController.getGrupoPorGrupoId);
router.post('/ConclusionesPorBusqueda', gruposController.getGrupoPorAnnoyCuatrimestreParaConclusion);
router.post('/crearOActualizarTipoGrupo', gruposController.crearOActualizarTipoGrupo);
router.post('/crearOActualizarGrupo', gruposController.crearOActualizarGrupo);
router.post('/crearOActualizarGrupoEstudiante', gruposController.crearOActualizarGrupoEstudiante);
router.post('/cargarGrupos', gruposController.cargarGrupos);
router.post('/cargarTipoGrupos', gruposController.cargarTipoGrupos);
router.post('/EstadoGrupo', gruposController.EstadoGrupo);
router.post('/FinalizarCuatrimestre/:GrupoId', gruposController.FinalizarCuatrimestre);

module.exports = router;