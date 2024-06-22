const express = require('express');
const router = express.Router();
const horasController = require('../controllers/horasController');
const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage });

router.get('/', horasController.getAllHoras);
router.get('/Estudiante/:Identificacion/:GrupoId', horasController.getHorasPorIdentificacionyGrupoId);
router.get('/:BitacoraId', horasController.getHorasPorBitacoraId);
router.post('/crearOActualizarHoras', upload.single('Evidencias'), horasController.crearOActualizarHoras);
router.post('/rechazarHoras', horasController.rechazarHoras);

router.get('/test', (req, res) => {
    res.send('Hello from exampleRoute!');
});


module.exports = router;