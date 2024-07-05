const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 3001;
const path = require('path')
require('dotenv').config();

app.use(express.json());
app.use(express.static(path.join(__dirname,'../backend/assets/dbAttachment')))

// Aumentar el límite del tamaño del cuerpo de la solicitud
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

const seguridadRoute = require('./routes/seguridadRoute');
app.use('/usuarios', seguridadRoute);
// Rutas para el modulo de Usuarios

const gruposRoute = require('./routes/gruposRoute');
app.use('/grupos', gruposRoute);
// Rutas para el modulo de Grupos

const horasRoute = require('./routes/horasRoute');
app.use('/horas', horasRoute);
// Rutas para el modulo de Horas

const sociosRoute = require('./routes/sociosRoute');
app.use('/socios', sociosRoute);
// Rutas para el modulo de Socios

const conclusionesRoute = require('./routes/conclusionesRoute');
app.use('/conclusiones', conclusionesRoute);
// Rutas para el modulo de Boletas de Conclusion

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});



