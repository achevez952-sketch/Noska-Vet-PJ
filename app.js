const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

app.use(express.json());

const mongoUri = process.env.MONGO_URL || 'mongodb://localhost:27017/proyecto2_db';
mongoose.connect(mongoUri)
  .then(() => console.log("Mongo conectado (Proyecto 2)"))
  .catch(console.error);

app.use('/api/appointments', require('../routes/appointments'));
app.use('/api/adoptions', require('../routes/adoptions'));
app.use('/scores', require('../routes/scores'));

app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en puerto ${PORT}`);
});
