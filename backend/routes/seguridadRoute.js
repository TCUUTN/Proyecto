const express = require('express');
const router = express.Router();
const seguridadController = require('../controllers/seguridadController');

router.get('/', seguridadController.getAllUsuarios);
router.get('/RolesUsuarios', seguridadController.getAllUsuarioRol);
router.get('/RolesAcademicos', seguridadController.getAllAcademicos);
router.post('/credenciales', seguridadController.getUsuarioPorCredenciales);
router.post('/actualizarContrasenna', seguridadController.actualizarContrasenna);
router.post('/actualizarGenero', seguridadController.actualizarGenero);
router.post('/olvidoContrasenna', seguridadController.olvidoContrasenna);
router.post('/crearOActualizarUsuario', seguridadController.crearOActualizarUsuario);
router.post('/cargaUsuarios', seguridadController.cargarUsuario);
router.post('/cargaCarreras', seguridadController.cargaCarreras);
router.post('/EstadoUsuario', seguridadController.EstadoUsuario);
router.get('/nombre', seguridadController.getUsuarioPorNombre);
router.get('/RolesUsuarios/:Identificacion', seguridadController.getRolesPorIdentificacion);
router.get('/:Identificacion', seguridadController.getUsuarioPorIdentificacion);
router.get('/nombres/:Identificacion', seguridadController.getNombrePorIdentificacion);





module.exports = router;