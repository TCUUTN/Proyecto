const express = require('express');
const router = express.Router();
const horasController = require('../controllers/horasController');

router.get('/', horasController.getAllHoras);
router.get('/Estudiante/:Identificacion/:GrupoId', horasController.getHorasPorIdentificacionyGrupoId);
router.get('/:BitacoraId', horasController.getHorasPorBitacoraId);
router.post('/crearOActualizarHoras', horasController.crearOActualizarHoras);
router.post('/rechazarHoras', horasController.rechazarHoras);

router.get('/test', (req, res) => {
    res.send('Hello from exampleRoute!');
});


module.exports = router;