const express = require('express');
const router = express.Router();
const seguridadController = require('../controllers/seguridadController');

router.get('/', seguridadController.getAllUsuarios);
router.post('/credenciales', seguridadController.getUsuarioPorCredenciales);

router.get('/test', (req, res) => {
    res.send('Hello from exampleRoute!');
});


module.exports = router;