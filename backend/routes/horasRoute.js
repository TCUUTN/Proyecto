const express = require('express');
const router = express.Router();
const horasController = require('../controllers/horasController');
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
}).single('Evidencias')


//Rutas para extraer registros desde la BD a el Frontend
router.get('/', horasController.getAllHoras);
router.get('/descargarAdjunto/:BitacoraId',horasController.descargarArchivo);
router.get('/Estudiante/:Identificacion/:GrupoId', horasController.getHorasPorIdentificacionyGrupoId);
router.get('/EstudianteAprobado/:Identificacion/:GrupoId', horasController.getHorasPorIdentificacionyGrupoIdAprobadas);
router.get('/:BitacoraId', horasController.getHorasPorBitacoraId);
router.post('/horasporFecha',horasController.getHorasPorFecha);

//Rutas para postear registros desde el Frontend a la BD
router.post('/crearOActualizarHoras', horasController.crearOActualizarHoras);
router.post('/subirAdjunto', fileUpload, horasController.subirArchivo);
router.post('/rechazarHoras', horasController.rechazarHoras);

// Ruta para eliminar el archivo adjunto
router.delete('/eliminarAdjunto/:fileName', horasController.eliminarArchivo);


module.exports = router;