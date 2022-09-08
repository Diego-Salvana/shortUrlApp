const { URL } = require('url');

const validarUrl = (req, res, next) => {
   try {
      const { origin } = req.body;
      const urlFrontend = new URL(origin);

      if (urlFrontend.origin !== 'null') {
         if (urlFrontend.protocol === 'http:' || urlFrontend.protocol === 'https:') {
            return next();
         }
         
         throw new Error('Url tiene que tener https://');
      }

      throw new Error('Url no válida...');
   } catch (err) {
      if (err.message === 'Invalid URL') req.flash('mensajes', [{ msg: 'La URL no es válida.' }]);
      else req.flash('mensajes', [{ msg: err.message }]);

      return res.redirect('/');
   }
};

module.exports = validarUrl;
