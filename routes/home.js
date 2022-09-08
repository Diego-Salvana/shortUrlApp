const express = require('express');
const { leerUrls, agregarUrl, eliminarUrl, editarUrl, editarUrlForm, redireccionamiento } = require('../controllers/homeController');
const { formPerfil, editarFotoPerfil } = require('../controllers/perfilController');
const validarUrl = require('../middlewares/urlValidar');
const { usuarioAutenticado } = require('../middlewares/verificarUser');
const router = express.Router();

router.get('/', usuarioAutenticado, leerUrls);
router.post('/', usuarioAutenticado, validarUrl, agregarUrl);
router.get('/eliminar/:id', usuarioAutenticado, eliminarUrl);
router.get('/editar/:id', usuarioAutenticado, editarUrlForm);
router.post('/editar/:id', usuarioAutenticado, validarUrl, editarUrl);
router.get('/short/:shortURL', redireccionamiento);

router.get('/perfil', usuarioAutenticado, formPerfil);
router.post('/perfil', usuarioAutenticado, editarFotoPerfil);

module.exports = router;
