const express = require('express');
const router = express.Router();
const conclusionesController = require('../controllers/ConclusionesController');

//Ruta para relleno de select
router.get('/Annos/:Rol', conclusionesController.getAllAnnosParaConclusion);

//Rutas para extraer registros desde la BD a el Frontend
router.get('/', conclusionesController.getAllConclusiones);
router.get('/ConclusionesPorGrupo/:GrupoId', conclusionesController.getConclusionPorGrupoId);
router.get('/ConclusionesAprobadas/:GrupoId', conclusionesController.getConclusionAprobadasPorGrupoId);
router.get('/:Identificacion/:GrupoId', conclusionesController.getConclusionPorIdentificacionyGrupoId);
router.get('/:ConclusionId', conclusionesController.getConclusionPorConclusionId);

//Rutas para postear registros desde el Frontend a la BD
router.post('/crearOActualizarConclusiones', conclusionesController.crearOActualizarConclusiones);
router.post('/rechazarConclusion', conclusionesController.rechazarConclusion);
router.post('/aprobarConclusion/:ConclusionId', conclusionesController.aprobarConclusion);

module.exports = router;