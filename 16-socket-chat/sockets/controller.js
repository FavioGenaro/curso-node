const { Socket } = require('socket.io');
const { comprobarJWT } = require('../helpers');
const { ChatMensajes } = require('../models');

const chatMensajes = new ChatMensajes(); // creamos una instancia de chatMensajes

// hacemos el new Socket() para que el editor de codigo pueda detectar y sugerirme los metodos de socket
const socketController = async( socket = new Socket(), io) => {

    // console.log('cliente conectado', socket.id)
    // console.log(socket);

    const usuario = await comprobarJWT(socket.handshake.headers['x-token']); // si todo esta bien retorna el usuario, sino retorna un null
    if ( !usuario ) { // si no viene el usuario, entonces nos desconectamos
        return socket.disconnect();
    }
    // console.log('se conecto ' + usuario.nombre)

    // Agregar el usuario conectado, cuando el usuario se conecta debemos agregarmos al arreglo y emitimos el evento
    chatMensajes.conectarUsuario( usuario ); // agregamos el usuario al arreglo
    io.emit('usuarios-activos',    chatMensajes.usuariosArr ); // emitimos este evento, para que el resto de usuarios puedan ver al usuario

    // cuando se conecta la persona, recibe los ultimos 10 mensajes
    socket.emit('recibir-mensajes', chatMensajes.ultimos10 );

    // Conectamos al usuario a una sala más, que es generada por el usuario.id
    socket.join( usuario.id ); // en total esta conectada a 3 salas: global, socket.id, usuario.id
    

    // Limpiar cuando alguien se desconeta
    socket.on('disconnect', () => { // cuando el usuario se desconecta
        chatMensajes.desconectarUsuario( usuario.id ); // lo quitamos del arreglo
        io.emit('usuarios-activos', chatMensajes.usuariosArr ); // emitimos al resto de usuarios para que actualice la lista
    })

    //  escuchamos el enviar un mensaje, este se ejecuta cuando el usuarioo presione enter para enviar el mensaje a todos los usuarios
    socket.on('enviar-mensaje', ({ uid, mensaje }) => {
        
        if ( uid ) { // si el uid tiene un valor, quiere decir que es un mensaje privado
            // Mensaje privado, emitimos eso a la sala con el usuario.id
            socket.to( uid ).emit( 'mensaje-privado', { de: usuario.nombre, mensaje });
        } else { // si no 
            chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje ); // insertamos el mensaje en la lista de mensajes
            io.emit('recibir-mensajes', chatMensajes.ultimos10 ); // emitimos para todos los usuarios, el 'recibir-mensajes' y eviamos los ultimos 10 mensajes
        }

    })

}


module.exports = {
    socketController
}