const express = require('express');
const router = express.Router();
const informacionController = require('../controllers/informacionController');
const multer = require('multer');
const path = require('path');

const diskStorage = multer.diskStorage({
    destination: path.join(__dirname, '../assets/ServerAttachments'),
    filename:(req, file,cb)=>{
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const fileUpload = multer({
    storage:diskStorage
}).single('Archivo')



router.get('/descargarAdjunto/:InformacionId',informacionController.descargarArchivo);
router.get('/:InformacionId', informacionController.getinfoPorInformacionId);
router.post('/getInformacionPorGrupoId',informacionController.getInformacionPorGrupoId);
router.post('/getInformacionPorSedeyTipoInformacion',informacionController.getInformacionPorSedeyTipoInformacion);
router.post('/crearOActualizarInformacion', informacionController.crearOActualizarInformacion);
router.post('/subirAdjunto', fileUpload, informacionController.subirArchivo);

// Ruta para eliminar el archivo adjunto
router.delete('/eliminarAdjunto/:fileName', informacionController.eliminarArchivo);


module.exports = router;