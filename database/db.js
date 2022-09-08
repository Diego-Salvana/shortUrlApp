const mongoose = require('mongoose');
require('dotenv').config();

const clientDB = mongoose
   .connect(process.env.URI)
   .then((r) => {
      console.log('Conectado a db 📖');
      return r.connection.getClient();
   })
   .catch((err) => console.log('Falló la conexión: ' + err));

module.exports = clientDB;
