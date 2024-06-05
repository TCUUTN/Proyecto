const express = require('express');
const router = express.Router();
const seguridadController = require('../controllers/seguridadController');

router.get('/', seguridadController.getAllUsuarios);
router.post('/credenciales', seguridadController.getUsuarioPorCredenciales);
router.post('/actualizarContrasenna', seguridadController.actualizarContrasenna);
router.post('/olvidoContrasenna', seguridadController.olvidoContrasenna);
router.post('/crearOActualizarUsuario', seguridadController.crearOActualizarUsuario);
router.post('/cargaUsuarios', seguridadController.cargarUsuario);
router.post('/EstadoUsuario', seguridadController.EstadoUsuario);
router.get('/:Identificacion', seguridadController.getUsuarioPorIdentificacion);

router.get('/test', (req, res) => {
    res.send('Hello from exampleRoute!');
});


module.exports = router;