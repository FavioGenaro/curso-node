// archivo barril
const validaCampos = require('../middlewares/validar-campos');
const validarJWT = require('../middlewares/validar-jwt');
const validaRoles = require('../middlewares/validar-roles');
const validarArchivo = require('../middlewares/validar-archivo');

module.exports = {
    ...validaCampos, // exparcimos, todos lo que exporte validaCampos
    ...validarJWT,
    ...validaRoles,
    ...validarArchivo
}