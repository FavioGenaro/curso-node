
// destructramos la función router
const { Router } = require('express');
const {usuariosGet, usuariosPost,usuariosPut, usuariosDelete} = require('../controllers/user')

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
router.put('/:id', usuariosPut)
router.post('/', usuariosPost)
router.delete('/', usuariosDelete)

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

