
// destructramos la función router
const { Router } = require('express');
const { check } = require('express-validator');
// const Role = require('../models/role');

const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');

const {usuariosGet, usuariosPost,usuariosPut, usuariosDelete} = require('../controllers/user');

// middleware
// const { validarCampos} = require('../middlewares/validar-campos');
// const { validarJWT } = require('../middlewares/validar-jwt');
// const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');
const {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole
} = require('../middlewares');


const router = Router(); // llamamos la función

// router es donde voy a configurar la rutas
// las rutas las podemos dejar en /, porque en server.js ya se definio en '/api/usuarios'
// si aqui en get colocamos /api, en postman o en el navegador debemos ir a '/api/usuarios/api', se suma a la ruta ya definida
// router.get('/', (req, res) => {
//     res.json({
//         msg:'get API'
//     })
// })
router.get('/', usuariosGet) // función establecida en user.js de controllers
router.put('/:id',[
    check('id', 'No es un ID válido').isMongoId(), // verifica si es un id que tiene el formato de mongo
    check('id').custom( existeUsuarioPorId ), // verifica si el id existe en la base de datos
    check('rol').custom( esRoleValido ), // validación para el rol
    validarCampos // verifica si los checks tienen errores y según eso los muestra o pasa a ejecutar usuariosPut
], usuariosPut)

// mandamos varios middlewares
router.post('/',[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),// not().isEmpty(): no tiene que estar vacio
    check('password', 'El password debe de ser más de 6 letras').isLength({ min: 6 }), // minimo de 6 letras
    check('correo','El correo no es válido').isEmail(), // check es un middleware al que podemos mandar el campo que va a revisar y el mensaje por si no es valido
    check('correo').custom( emailExiste ),
    // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),// debe ser uno de eso valores
    // aqui hacemos la verificación con la base de datos
    check('rol').custom(esRoleValido), // puede ser asi ( (rol) => (esRoleValido(rol)), pero al ser el mismo parámreto podemos colocarlo de frente
    validarCampos // después de los checks se ejecuta este middleware, si es valido, se ejecuta el controlador usuariosPost
], usuariosPost) // el middleware se define como segundo argumento (al ser 3 argumentos, toma al middleware como segundo)

router.delete('/:id',[
    validarJWT, // validamos el token
    // esAdminRole,
    tieneRole('ADMIN_ROLE','VENTAS_ROLE'), // verifica si se tienen esos roles del usuario Autentificado, para realizar la eliminación del usuario
    check('id', 'No es un ID válido').isMongoId(), // verifica si es un id que tiene el formato de mongo
    check('id').custom( existeUsuarioPorId ), // verifica si el id existe en la base de datos
    validarCampos // verifica si los checks tienen errores y según eso los muestra o pasa a ejecutar usuariosPut
],usuariosDelete)

// router.put('/', (req, res) => {
//     res.json({
//         msg:'put API'
//     })
// })
// router.post('/', (req, res) => {
//     res.json({
//         msg:'post API'
//     })
// })
// router.delete('/', (req, res) => {
//     res.json({
//         msg:'delete API'
//     })
// })

module.exports = router;

