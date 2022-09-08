const usuarioAutenticado = (req, res, next) => {
   if (req.isAuthenticated()) return next();

   return res.redirect('/auth/login');
};

const noAutenticado = (req, res, next) => {
   if (!req.isAuthenticated()) return next();

   return res.redirect(`${req.rawHeaders[25]}`);
};

module.exports = { usuarioAutenticado, noAutenticado };
