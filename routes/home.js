const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
   const urls = [
      { origin: 'www.google.com/pepe', shortUrl: 'sasa' },
      { origin: 'www.google.com/oeeoeeo', shortUrl: 'tete' },
      { origin: 'www.google.com/pepe/lista', shortUrl: 'lele' },
      { origin: 'www.google.com/pepe/lista/unamas', shortUrl: 'masasa' },
   ];
   res.render('home', { urls: urls }); //Asignación del contenido a mostrar en main.hbs
});

module.exports = router;
