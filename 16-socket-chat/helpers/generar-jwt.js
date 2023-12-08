const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

const generarJWT = ( uid = '' ) => {

    return new Promise( (resolve, reject) => {

        const payload = { uid };

        jwt.sign( payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '4h'
        }, ( err, token ) => {

            if ( err ) {
                console.log(err);
                reject( 'No se pudo generar el token' )
            } else {
                resolve( token );
            }
        })

    })
}


const comprobarJWT = async( token = '') => {

    try {
        
        if(  token.length < 10 ) { // si es menor a 10 letra, el token no es valido
            return null;
        }

        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY ); // veirificamos el token con la clave secreta para extraer la data del token, en este caso el id
        const usuario = await Usuario.findById( uid ); // con el id buscamos en la base de datos y extraemos la data del usuario

        if ( usuario ) { // si existe usuario
            if ( usuario.estado ) { // si el estado es true
                return usuario;
            } else {
                return null;
            }
        } else { // si no existe
            return null;
        }

    } catch (error) {
        return null;
    }

}


module.exports = {
    generarJWT,
    comprobarJWT
}

