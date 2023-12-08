const { response } = require('express');
const bcryptjs = require('bcryptjs')

const Usuario = require('../models/usuarios'); // modelo del usuario
const { generarJWT } = require('../helpers/generar-jwt'); // importamos la función para obtener el token
const { googleVerify } = require('../helpers/google-verify');

const login = async(req, res = response) => { // esta controlador es de un metodo post

    const { correo, password } = req.body; // destructuramos la data del body

    try {

        // Verificar si el email existe, buscamos el correo en la base de datos
        const usuario = await Usuario.findOne({ correo });
        if ( !usuario ) {
            return res.status(400).json({ // estatus 400, porque es un error de correo o contraseña, no es error del servidor
                msg: 'Usuario / Password no son correctos - correo' // error en el correo
            });
        }

        // SI el usuario está activo, es decir, tiene que tener un estado en true
        if ( !usuario.estado ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            });
        }

        // Verificar la contraseña, si esta es igual a la de la base de datos
        const validPassword = bcryptjs.compareSync( password, usuario.password ); // comparamos las contraseñas, que nos pasa y el de la base de datos, regresa un booleano
        if ( !validPassword ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password' // error en el password
            });
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario, // mostramos el usuario logeado
            token // mostramos el token generado
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({ // estatus 500, porque normalmente será un error interno del servidor.
            msg: 'Hable con el administrador'
        });
    }   

    // res.json({
    //     msg: 'login OK'
    // })
}

// Logeo con google
const googleSignin = async(req, res = response) => {

    const { id_token } = req.body; // extraemos el id_token, que debe ser manando por el body
    
    // try {
    //     const googleUser = await googleVerify( id_token );
    //     console.log(googleUser) // tiene el nombre, img y correo del usuario

    //     res.json ({
    //         msg: 'Todo bien!',
    //         id_token // mostramos el token
    //     })
    // } catch (error) {
    //     res.status(400).json({
    //         msg: 'Token de Google no es válido'
    //     })
    // }

    try {
        const { correo, nombre, img } = await googleVerify( id_token ); // destructuramos la data
        // console.log(correo, nombre, img)

        let usuario = await Usuario.findOne({ correo }); // buscamos el usuario con ese correo
        
        if ( !usuario ) { // el usuario no existe en la base de datos, entonces tengo que crearlo o registrarlo
            // Tengo que crearlo
            const data = {
                nombre,
                correo,
                password: ':P', // el password 
                img,
                google: true,
                rol: "USER_ROLE"
            };

            usuario = new Usuario( data ); // creamos un nuevo modelo de usuario
            console.log(usuario)
            await usuario.save(); // guardamos en la base de datos
            
        } // podiamos añadir un else por si ya existia
        
        // Si el usuario de google, que se esta logiando esta en DB, tiene el estado en false, el usuario ya esta eliminado o bloquedado
        if ( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        // Generar el JWT para el usuario
        const token = await generarJWT( usuario.id );
        
        res.json({
            usuario, // respuesta del backend es el usuario
            token
        });
        
    } catch (error) {
        // console.log(error)
        res.status(400).json({
            msg: 'Token de Google no es válido'
        })
    }
}


module.exports = {
    login,
    googleSignin
}
