const express = require('express');
const router = express.Router();
const gruposController = require('../controllers/gruposController');

router.get('/', gruposController.getAllGrupos);
router.get('/tipos', gruposController.getAllTiposGrupos);
router.get('/GruposEstudiantes', gruposController.getAllGruposEstudiantes);
router.get('/:GrupoId', gruposController.getGrupoPorGrupoId);
router.get('/tipos/:CodigoMateria', gruposController.getTipoGrupoPorCodigoMateria);
router.get('/GruposEstudiantes/:Identificacion/:GrupoId', gruposController.getEstudiantePorGrupo);
router.post('/crearOActualizarTipoGrupo', gruposController.crearOActualizarTipoGrupo);
router.post('/crearOActualizarGrupo', gruposController.crearOActualizarGrupo);
router.post('/crearOActualizarGrupoEstudiante', gruposController.crearOActualizarGrupoEstudiante);
router.post('/cargarGrupos', gruposController.cargarGrupos);
router.post('/cargarTipoGrupos', gruposController.cargarTipoGrupos);
router.post('/EstadoGrupo', gruposController.EstadoGrupo);

router.get('/test', (req, res) => {
    res.send('Hello from exampleRoute!');
});


module.exports = router;