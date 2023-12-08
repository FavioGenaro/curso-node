
// archivo barril
const dbValidators = require('./db-validators');
const generarJWT   = require('./generar-jwt');
const googleVerify = require('./google-verify');
const subirArchivo = require('./subir-archivo');


module.exports = { // exparsimos todas las propiedades
    ...dbValidators,
    ...generarJWT,
    ...googleVerify,
    ...subirArchivo,
}