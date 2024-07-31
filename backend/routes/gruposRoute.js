const express = require('express');
const router = express.Router();
const gruposController = require('../controllers/gruposController');

//Rutas para extraer registros desde la BD a el Frontend - Proyectos
router.get('/tipos', gruposController.getAllTiposGrupos);

//Rutas para extraer registros desde la BD a el Frontend - GruposEstudiantes
router.get('/GruposEstudiantes', gruposController.getAllGruposEstudiantes);
router.get('/EstudiantesActivos/:Sede', gruposController.getEstudianteAdministrativo);
router.get('/GruposEstudiantes/:Identificacion/:GrupoId', gruposController.getEstudiantePorGrupo);
router.get('/GrupoEstudiante/:Identificacion', gruposController.getGrupoEstudianteporIdentificacion);
router.get('/GrupoEstudianteUsuario/:Identificacion', gruposController.getGrupoEstudianteporIdentificacionParaUsuario);
router.get('/ListaEstudiantes/:GrupoId', gruposController.getListaEstudiantes);

//Ruta para rellenar Select
router.get('/Annos', gruposController.getAllAnnosParaReporte);

//Ruta para la funcion de Finalizar cuatrimestre
router.get('/getBanderaAdmin', gruposController.getBanderaFinalizarCuatrimestreOne);
router.get('/ActivarFinalizarCuatrimestre/:Sede', gruposController.ActivarFinalizarCuatrimestre);
router.get('/getBandera/:GrupoId', gruposController.getBanderaFinalizarCuatrimestre);
router.post('/FinalizarCuatrimestre/:GrupoId', gruposController.FinalizarCuatrimestre);

//Ruta para extraer lista de grupos para el modulo de conclusiones
router.get('/Conclusiones/:Identificacion', gruposController.getGrupoPorIdentificacionParaConclusion);
router.post('/ConclusionesPorBusqueda', gruposController.getGrupoPorAnnoyCuatrimestreParaConclusion);

//Ruta para dashboard de Admin
router.post('/ReporteGeneroPorBusqueda', gruposController.getGrupoPorAnnoyCuatrimestreParaGenero);

//Rutas para extraer registros desde la BD a el Frontend - Grupos
router.get('/', gruposController.getAllGrupos);
router.get('/GruposActivos/:Sede', gruposController.getGruposActivos);
router.get('/tipos/:CodigoProyecto', gruposController.getTipoGrupoPorCodigoMateria);
router.get('/Academicos/:Identificacion', gruposController.getGrupoPorIdentificacion);
router.get('/:GrupoId', gruposController.getGrupoPorGrupoId);


//Rutas para postear registros desde el Frontend a la BD
router.post('/crearOActualizarTipoGrupo', gruposController.crearOActualizarTipoGrupo);
router.post('/crearOActualizarGrupo', gruposController.crearOActualizarGrupo);
router.post('/crearOActualizarGrupoEstudiante', gruposController.crearOActualizarGrupoEstudiante);

//Rutas de Carga masiva de datos
router.post('/cargarGrupos', gruposController.cargarGrupos);
router.post('/cargarTipoGrupos', gruposController.cargarTipoGrupos);

//Ruta para carga de registros masivos
router.post('/EstadoGrupo', gruposController.EstadoGrupo);

module.exports = router;