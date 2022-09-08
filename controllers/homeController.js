const Url = require('../models/Url');
const unique = require('uniqid');

const leerUrls = async (req, res) => {
   try {
      const urls = await Url.find({ user: req.user.id }).lean();
      res.render('home', { urls: urls, mensajes: req.flash('mensajes') }); //Asignación del contenido a mostrar en main.hbs
   } catch (err) {
      req.flash('mensajes', [{ msg: err.message }]);
      return res.redirect('/');
   }
};

const agregarUrl = async (req, res) => {
   try {
      const { origin } = req.body;
      const url = new Url({ origin: origin, shortURL: unique(), user: req.user.id });

      await url.save();
      req.flash('mensajes', [{ msg: 'URL agregada!' }]);
      res.redirect('/');
   } catch (err) {
      req.flash('mensajes', [{ msg: err.message }]);
      return res.redirect('/');
   }
};

const eliminarUrl = async (req, res) => {
   const { id } = req.params;
   try {
      const url = await Url.findById(id);
      if (!url.user.equals(req.user.id)) throw new Error('No es tu URL!');

      await url.remove();
      req.flash('mensajes', [{ msg: 'URL eliminada.' }]);

      return res.redirect('/');
   } catch (err) {
      req.flash('mensajes', [{ msg: err.message }]);
      return res.redirect('/');
   }
};

const editarUrlForm = async (req, res) => {
   try {
      const { id } = req.params;
      const urlObj = await Url.findById(id).lean();
      if (!urlObj.user.equals(req.user.id)) throw new Error('No es tu URL!');

      res.render('home', { urlObj });
   } catch (err) {
      req.flash('mensajes', [{ msg: err.message }]);
      return res.redirect('/');
   }
};

const editarUrl = async (req, res) => {
   const { id } = req.params;
   try {
      const url = await Url.findById(id);
      if (!url.user.equals(req.user.id)) throw new Error('No es tu URL!');
      
      const newOrigin = req.body.origin;
      await url.updateOne({ origin: newOrigin });
      req.flash('mensajes', [{ msg: 'URL modificada.' }]);

      res.redirect('/');
   } catch (err) {
      req.flash('mensajes', [{ msg: err.message }]);
      return res.redirect('/');
   }
};

const redireccionamiento = async (req, res) => {
   const { shortURL } = req.params;
   try {
      const urlObj = await Url.findOne({ shortURL: shortURL });

      res.redirect(urlObj.origin);
   } catch (err) {
      req.flash('mensajes', [{ msg: 'No existe esta URL configurada.' }]);
      return res.redirect('/');
   }
};

module.exports = {
   leerUrls,
   agregarUrl,
   eliminarUrl,
   editarUrlForm,
   editarUrl,
   redireccionamiento,
};
