const User = require('../models/User');
const unique = require('uniqid');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');
require('dotenv').config();

const registerForm = (req, res) => {
   res.render('register', { mensajes: req.flash('mensajes') });
};

const registerUser = async (req, res) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      req.flash('mensajes', errors.array());
      return res.redirect('/auth/register');
   }

   try {
      const { userName, email, password } = req.body;
      let user = await User.findOne({ email: email });

      if (user) throw Error('El email ya está registrado.');

      user = new User({ userName, email, password, tokenConfirm: unique() });
      await user.save();

      const transport = nodemailer.createTransport({
         host: 'smtp.mailtrap.io',
         port: 2525,
         auth: {
            user: process.env.userEmail,
            pass: process.env.passEmail,
         },
      });

      await transport.sendMail({
         from: '"Fred Foo 👻" <foo@example.com>', // sender address
         to: user.email, // list of receivers
         subject: 'Verifica tu cuenta de correo.', // Subject line
         text: '<b>Verificación de cuenta.</b>', // plain text body
         html: `<a href="${process.env.PATHHEROKU || 'http://localhost:5000/'}auth/confirmar/${
            user.tokenConfirm
         }">Verifica tu cuenta aquí</a>`, // html body
      });

      req.flash('mensajes', [{ msg: 'Revisa tu correo electrónico y valida la cuenta.' }]);
      return res.redirect('/auth/login');
   } catch (err) {
      req.flash('mensajes', [{ msg: err.message }]);
      return res.redirect('/auth/register');
   }
};

const confirmarCuenta = async (req, res) => {
   const { token } = req.params;
   try {
      const user = await User.findOne({ tokenConfirm: token });
      if (!user) throw new Error('El usuario no existe...');

      user.cuentaConfirmada = true;
      user.tokenConfirm = null;
      await user.save();

      req.flash('mensajes', [{ msg: 'Cuenta verificada, puedes iniciar sesión.' }]);
      return res.redirect('/auth/login');
   } catch (err) {
      req.flash('mensajes', [{ msg: err.message }]);
      return res.redirect('/auth/login');
   }
};

const loginForm = (req, res) => {
   res.render('login', { mensajes: req.flash('mensajes') });
};

const loginUser = async (req, res) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      req.flash('mensajes', errors.array());
      return res.redirect('/auth/login');
   }

   const { email, password } = req.body;
   try {
      const user = await User.findOne({ email: email });
      if (!user) throw new Error('No existe el usuario.');

      if (!user.cuentaConfirmada) throw new Error('Falta confirmar la cuenta.');

      if (!(await user.comparePassword(password))) throw new Error('Contraseña incorrecta.');

      req.login(user, function (err) {
         if (err) throw new Error('Ocurrió un error con la sesión (Passport).');

         return res.redirect('/');
      });
   } catch (err) {
      req.flash('mensajes', [{ msg: err.message }]);
      return res.redirect('/auth/login');
   }
};

const cerrarSesion = (req, res) => {
   req.logout(null, function (err) {
      if (err) throw new Error('Ocurrió un error con la sesión (Passport).');

      return res.redirect('/auth/login');
   });
};

module.exports = {
   loginForm,
   registerForm,
   registerUser,
   confirmarCuenta,
   loginUser,
   cerrarSesion,
};
