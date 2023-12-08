class Mensaje { 
    constructor( uid, nombre, mensaje ) { // modelo del mensaje
        this.uid     = uid;
        this.nombre  = nombre;
        this.mensaje = mensaje;
    }
}

class ChatMensajes {

    constructor() {
        this.mensajes = []; // mensajes como un arreglo, los ultimos 10 mensajes
        this.usuarios = {}; // usuarios conectados como un objeto, con los id de los usuarios y con eso vamos a mostrar la data del usuario
    }

    get ultimos10() { // nos va a retronar los ultimos 10 mensajes
        this.mensajes = this.mensajes.splice(0,10); // cogemos los ultimos 10 mensajes
        return this.mensajes;
    }

    get usuariosArr() { // retornamos los usuarios 
        return Object.values( this.usuarios ); // los retorna como un arreglo de objetos[ {}, {}, {}]
    }

    enviarMensaje( uid, nombre, mensaje ) { // necesitamos el uid y nombre de la persona que envia el mensaje,
        this.mensajes.unshift( // insertamos el mensaje al principio de la lista de mensajes
            new Mensaje(uid, nombre, mensaje) // creamos el mensaje
        );
    }

    conectarUsuario( usuario ) { // agregamos usuario conectado a la lista
        this.usuarios[usuario.id] = usuario // el id va a ser el identificador del usuario
    }

    desconectarUsuario( id ) { // quitamos un usuario cuando se desconecta
        delete this.usuarios[id]; // borramos de la lista
    }

}

module.exports = ChatMensajes;