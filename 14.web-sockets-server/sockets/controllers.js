
// el parametro que recibe es el socket, como lo recibia en el server
const socketController = (socket) => { // est se ejecuta cuando un usuario se conecta
    
    console.log('Cliente conectado',socket.id)

    socket.on('disconnect', () => { // se ejecuta si el usuario se desconeecta
        console.log('Cliente desconectado', socket.id);
    });

    // el callback es la refencia al 3er argumento emit( 'enviar-mensaje') del cliente
    socket.on('enviar-mensaje', ( payload , callback ) => { // listener personalizado, cuando el evento 'enviar-mensaje' sea escuchado,se ejecuta el codigo
        // console.log(payload)
        // console.log('Mensaje enviado')

        // usamos el mismo this.io para emitir el mensaje a todos los usuarios.
        // el 1er parametro es el evento que se va a disparar y el 2do es la información que se va a enviar
        // this.io.emit('enviar-mensaje', payload) // el mismo 'enviar-mensaje', pero el this.io es cuando el servidor lo envia

        const id = 123456789;
        callback( id ); // mandamos el id, como lo definimos en el cliente

        // para que se emita el mensaje a todo los usuarios, antes usabamos el this.io, que ahora no recibimos,
        // pero podemos usar el socket.broadcast que emite el mensaje al resto de usuarios, pero no lo emite a si mismo
        // si solo colocamos socket.emit, se envia el mensaje hacia si mismo
        socket.broadcast.emit('enviar-mensaje', payload );

    })
}



module.exports = {
    socketController
}