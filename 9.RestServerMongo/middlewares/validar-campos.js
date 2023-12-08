const { validationResult } = require('express-validator');

const validarCampos = ( req, res, next ) => { // al ser un middleware se le añade un tercer parámetro llamado next

    // obtenmos los errors, y si estan vacios retornan un status 400 con los errores de validación
    const errors = validationResult(req);
    if( !errors.isEmpty() ){
        // console.log(req.params)
        return res.status(400).json(errors);
    }

    // next es una función que se ejecuta después del middleware, esta función puede ser otro middleware o un controlador
    next();
}


module.exports = {
    validarCampos
}