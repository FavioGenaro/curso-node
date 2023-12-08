const { response } = require('express')

const esAdminRole = ( req, res = response, next ) => {

    if ( !req.usuario ) { // validación, por si el usuario retornado no existe
        return res.status(500).json({
            msg: 'Se quiere verificar el role sin validar el token primero'
        });
    }

    const { rol, nombre } = req.usuario;// obtenemos al usuario desde la request, el usuario es obtenido en validarJWT

    if ( rol !== 'ADMIN_ROLE' ) { // verificamos que sea ADMIN
        return res.status(401).json({
            msg: `${ nombre } no es administrador - No puede hacer esto`
        });
    }

    next(); // damos paso al siguente middleware
}

// tieneRole, recibe en sí la req y res, pero nosotros vamos a recibir otros argumentos
const tieneRole = ( ...roles  ) => { // recibimos un objeto, llamado roles, como es parte del argumento roles acumula todos los argumentos en un arreglo

    return (req, res = response, next) => { // debemos retornar una función, que estos si recibe el req y res

        if ( !req.usuario ) { // verificamos si el usuario existe
            return res.status(500).json({
                msg: 'Se quiere verificar el role sin validar el token primero'
            });
        }

        if ( !roles.includes( req.usuario.rol ) ) { // si roles tiene dentro al rol del usuario.
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles ${ roles }`
            });
        }

        next();
    }
}

module.exports = {
    esAdminRole,
    tieneRole
}