const express = require('express');
const router = express.Router();
const conclusionesController = require('../controllers/ConclusionesController');

router.get('/', conclusionesController.getAllConclusiones);
router.get('/Conclusiones/:GrupoId', conclusionesController.getConclusionPorGrupoId);
router.get('/ConclusionesAprobadas/:GrupoId', conclusionesController.getConclusionAprobadasPorGrupoId);
router.get('/:Identificacion/:GrupoId', conclusionesController.getConclusionPorIdentificacionyGrupoId);
router.get('/:ConclusionId', conclusionesController.getConclusionPorConclusionId);
router.post('/crearOActualizarConclusiones', conclusionesController.crearOActualizarConclusiones);
router.post('/rechazarConclusion', conclusionesController.rechazarConclusion);
router.post('/aprobarConclusion/:ConclusionId', conclusionesController.rechazarConclusion);

module.exports = router;