const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');

const { validarArchivoSubir } = require('../middlewares/validar-archivo');
const { validarCampos } = require('../middlewares/validar-campos');


// const { login, googleSignin } = require('../controllers/auth');


const router = Router();

router.post( '/', cargarArchivo)

router.put('/:coleccion/:id', [ // actualizar imagan del producto o usuario
    validarArchivoSubir, // de los middleware para verificar que los files vienen en el body
    check('id','El id debe de ser de mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios','productos'] ) ), // c = colección que recibimos en la ruta y [] es la lista de colecciones permitidas
    validarCampos
], actualizarImagenCloudinary)


router.get('/:coleccion/:id', [
    check('id','El id debe de ser de mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios','productos'] ) ),
    validarCampos
], mostrarImagen) // obtenemos la imagen

// router.post('/login',[
//     check('correo', 'El correo es obligatorio').isEmail(),
//     check('password', 'La contraseña es obligatoria').not().isEmpty(),
//     validarCampos
// ],login );

// router.post('/google',[
//     check('id_token', 'El id_token es necesario').not().isEmpty(),
//     validarCampos
// ], googleSignin );



module.exports = router;