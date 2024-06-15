const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 3001;
require('dotenv').config();

app.use(express.json());
app.use(bodyParser.json());

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



