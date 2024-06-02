const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
require('dotenv').config();

app.use(express.json());

const seguridadRoute = require('./routes/seguridadRoute');
app.use('/usuarios', seguridadRoute);
// Ruta para crear o actualizar un usuario


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});



