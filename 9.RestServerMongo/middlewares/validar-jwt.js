
const { response, request } = require('express');
const jwt = require('jsonwebtoken'); // requerimos el paquete

const Usuario = require('../models/usuarios');

const validarJWT = async( req = request, res = response, next ) => { // función next para que continue con el siguiente middleware

    const token = req.header('x-token'); // en la petición delete el token esta almacenado en el header

    // console.log(token); // retorna el token del header. si no existe retorna underfined

    if ( !token ) { // no viene el token entonces mandamos el error.
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {
        // { uid }
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY ); // verifica el token y retorna el payload, del payload extraigo el uid

        // console.log(uid)
        req.uid = uid // colocamos el uid en la request, que va a pasar al resto de lo validadores.

        // leer el usuario que corresponde al uid
        const usuario = await Usuario.findById( uid ); // buscamos el usuario a travez del id

        if( !usuario ) { // error en el id que regreso el token
            return res.status(401).json({
                msg: 'Token no válido - usuario no existe DB'
            })
        }

        // Verificar si el uid tiene estado true
        if ( !usuario.estado ) { // el usuario debe tener un estado en true, si el false es un error
            return res.status(401).json({
                msg: 'Token no válido - usuario con estado: false'
            })
        }

        req.usuario = usuario; // pasamos a la request el usuario, este es el usuario autenticado, a esta usuario van a poder acceder el resto de middlewares
        next();

    } catch (error) {

        console.log(error);
        res.status(401).json({ // error del token
            msg: 'Token no válido'
        })
    }

}

module.exports = {
    validarJWT
}