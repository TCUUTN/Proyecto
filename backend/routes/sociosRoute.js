const express = require('express');
const router = express.Router();
const sociosController = require('../controllers/sociosController');
const multer = require('multer');
const path = require('path');


//Codigo para la lectura de archivos con Multer
const diskStorage = multer.diskStorage({
    destination: path.join(__dirname, '../assets/ServerAttachments'),
    filename:(req, file,cb)=>{
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const fileUpload = multer({
    storage:diskStorage
}).single('Carta')


//Rutas para extraer registros desde la BD a el Frontend
router.get('/', sociosController.getAllSocios);
router.get('/Activos', sociosController.getAllSociosActivos);
router.get('/Solicitudes', sociosController.getAllSolicitudes);
router.get('/EstudiantesCarta', sociosController.getAllEstudiantesCarta);
router.get('/descargarCarta/:SolicitudId',sociosController.descargarCarta);
router.get('/SolicitudesPorAcademico/:Identificacion', sociosController.getAllSolicitudesPorAcademico);
router.get('/SolicitudesPorSede/:Sede', sociosController.getAllSolicitudesPorSede);
router.get('/Solicitudes/:SolicitudId', sociosController.getSolicitudPorSolicitudId);
router.get('/:SocioId', sociosController.getSocioPorSocioId);

//Rutas para postear registros desde el Frontend a la BD
router.post('/crearOActualizarSocio', sociosController.crearOActualizarSocio);
router.post('/crearOActualizarSolicitudCarta', sociosController.crearOActualizarSolicitudCarta);
router.post('/GuardaryEnviarCarta', fileUpload, sociosController.GuardaryEnviarCarta);

// Ruta para eliminar el archivo adjunto de la memoria de la aplicación
router.delete('/eliminarCarta/:fileName', sociosController.eliminarCarta);

module.exports = router;