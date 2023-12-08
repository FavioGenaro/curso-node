// destructramos la función router
const { Router } = require('express');
const { check } = require('express-validator');

// Importamos los controladores
const { login, googleSignin } = require('../controllers/auth');

// importamos un middleware
const { validarCampos } = require('../middlewares/validar-campos');
// const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router(); // llamamos la función

// Metodo post
router.post('/login',[
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos // para que recopile los errors de los check y los muestre si los hubiera
], login) // función establecida en auth.js de controllers


// Metodo post para el logeo con google
router.post('/google',[
    check('id_token', 'id_token es necesarios').not().isEmpty(), // por el método post recibimos el token de google
    validarCampos // para que recopile los errors de los check y los muestre si los hubiera
], googleSignin) // función establecida en auth.js de controllers

module.exports = router;