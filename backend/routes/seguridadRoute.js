const express = require('express');
const router = express.Router();
const seguridadController = require('../controllers/seguridadController');

//Rutas para extraer registros desde la BD a el Frontend
router.get('/', seguridadController.getAllUsuarios);
router.get('/RolesUsuarios', seguridadController.getAllUsuarioRol);
router.get('/RolesAcademicos', seguridadController.getAllAcademicos);
router.get('/nombre', seguridadController.getUsuarioPorNombre);
router.get('/RolesUsuarios/:Identificacion', seguridadController.getRolesPorIdentificacion);
router.get('/nombres/:Identificacion', seguridadController.getNombrePorIdentificacion);
router.get('/:Identificacion', seguridadController.getUsuarioPorIdentificacion);

//Ruta para la validacion de credenciacles (Iniciar Sesión)
router.post('/credenciales', seguridadController.getUsuarioPorCredenciales);

//Rutas para postear registros desde el Frontend a la BD
router.post('/actualizarContrasenna', seguridadController.actualizarContrasenna);
router.post('/actualizarGenero', seguridadController.actualizarGenero);
router.post('/olvidoContrasenna', seguridadController.olvidoContrasenna);
router.post('/crearOActualizarUsuario', seguridadController.crearOActualizarUsuario);

//Rutas de Carga masiva de datos
router.post('/cargaUsuarios', seguridadController.cargarUsuario);
router.post('/cargaCarreras', seguridadController.cargaCarreras);

//Ruta para activar/desactivar Usuario
router.post('/EstadoUsuario', seguridadController.EstadoUsuario);






module.exports = router;