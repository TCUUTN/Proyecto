const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 3001;
require('dotenv').config();

app.use(express.json());
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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});



