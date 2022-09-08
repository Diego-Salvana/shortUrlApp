const formidable = require('formidable');
const path = require('path');
//const Jimp = require('jimp');
const fs = require('fs');
const User = require('../models/User');

module.exports.formPerfil = async (req, res) => {
   const user = await User.findById(req.user.id);
   res.render('perfil', { imagen: user.imagen, mensajes: req.flash('mensajes') });
};

module.exports.editarFotoPerfil = (req, res) => {
   const form = new formidable.IncomingForm();
   form.maxFileSize = 50 * 1024 * 1024;

   form.parse(req, async (err, fields, files) => {
      try {
         if (err) throw new Error('Falló al subir la imagen.');

         const file = files.myFile;
         if (file.originalFilename === '') throw new Error('Por favor agrega una imagen.');

         if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png')
            throw new Error('Por favor agrega una imagen .jpeg o .png');

         //const extension = file.mimetype.split('/')[1];
         const dirFile = path.join(__dirname, `../public/assets/perfiles/${req.user.id}.png`);

         fs.copyFile(file.filepath, dirFile, (err) => {
            if (err) throw err;
         });

         // Revisar en caso de necesitar subir imágenes...
         // const imagenRedimencionada = await Jimp.read(dirFile);
         // imagenRedimencionada.resize(200, 200).quality(90).writeAsync(dirFile);

         const user = await User.findById(req.user.id);
         await user.updateOne({ imagen: `${req.user.id}.` });

         req.flash('mensajes', [{ msg: 'Imagen subida.' }]);
      } catch (err) {
         req.flash('mensajes', [{ msg: err.message }]);
      } finally {
         return res.redirect('/perfil');
      }
   });
};
