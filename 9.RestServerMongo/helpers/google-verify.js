const { OAuth2Client } = require('google-auth-library'); // importamos la dependencia

const client = new OAuth2Client( process.env.GOOGLE_CLIENT_ID ); // sacacmos el id de cliente de las variables de entorno

const googleVerify = async( idToken = '' ) => { // función que recibe el token

    const ticket = await client.verifyIdToken({ // usa el client para verificar el token
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,  // mandamos la audiencia
        // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });

    // const payload = ticket.getPayload(); // payload que regresa el ticket
    // console.log(payload)
    const { name: nombre, // cambiamos los nombres, de name a nombre, de picture a img, de email a correo
            picture: img, 
            email: correo
            } = ticket.getPayload(); // este es el payload, extraemos el nombre, img y correo
    // console.log(nombre, img, correo)
    return { nombre, img, correo }; // retornamos los valores
}

module.exports = {
    googleVerify
}