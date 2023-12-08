
const jwt = require('jsonwebtoken'); // paquere jwt

const generarJWT = ( uid = '' ) => { // id del usuario como parámetro

    return new Promise( (resolve, reject) => { // retornamos una promesa

        const payload = { uid }; // pasamos el id en el payload, el payload podemos guardar más data

        // sign, para firmar un nuevo token, pide el payload y luego pide la llave privada (si alguien la conoce puede firmar token como si yo los hubiera hecho)
        // sacamos la llave privada desde las variables de entorno
        // tercero: recibe las opciones, como la fecha o tiempo de expiración
        jwt.sign( payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '4h' // expira en 4 horas
        }, ( err, token ) => { // por último, recibe un callback final, que puede disparar un error o si sale bien tenemos el token

            if ( err ) {
                console.log(err); // mostramos el error del backend
                reject( 'No se pudo generar el token' )
            } else {
                resolve( token ); // ejecutamos el resolve mandando el token
            }
        })

    })
}

module.exports = {
    generarJWT
}