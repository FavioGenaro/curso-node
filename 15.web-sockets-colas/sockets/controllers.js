
const TicketControl = require('../models/ticket-control');

const ticketControl = new TicketControl(); // creamos la instancia de la clase 


// el parametro que recibe es el socket, como lo recibia en el server
const socketController = (socket) => { // est se ejecuta cuando un usuario se conecta
    
    // console.log('Cliente conectado',socket.id)

    // socket.on('disconnect', () => { // se ejecuta si el usuario se desconeecta
    //     console.log('Cliente desconectado', socket.id);
    // });

    // el callback es la refencia al 3er argumento emit( 'enviar-mensaje') del cliente
    // socket.on('enviar-mensaje', ( payload , callback ) => { // listener personalizado, cuando el evento 'enviar-mensaje' sea escuchado,se ejecuta el codigo
    //     // console.log(payload)
    //     // console.log('Mensaje enviado')

    //     // usamos el mismo this.io para emitir el mensaje a todos los usuarios.
    //     // el 1er parametro es el evento que se va a disparar y el 2do es la información que se va a enviar
    //     // this.io.emit('enviar-mensaje', payload) // el mismo 'enviar-mensaje', pero el this.io es cuando el servidor lo envia

    //     const id = 123456789;
    //     callback( id ); // mandamos el id, como lo definimos en el cliente

    //     // para que se emita el mensaje a todo los usuarios, antes usabamos el this.io, que ahora no recibimos,
    //     // pero podemos usar el socket.broadcast que emite el mensaje al resto de usuarios, pero no lo emite a si mismo
    //     // si solo colocamos socket.emit, se envia el mensaje hacia si mismo
    //     socket.broadcast.emit('enviar-mensaje', payload );

    // })


    // Cuando un cliente se conecta, automaticamente se realiza el emit, emite este listener al front
    socket.emit( 'ultimo-ticket', ticketControl.ultimo ); // recibe como parametro o payload el ultimo ticket creado, este en si es el codigo de ese ultimo ticket

    //  debemos emitir este evento, para que se vean los ultimos 4 tickets y para que la pagina donde se muestran tenga actualizada la data.
    socket.emit( 'estado-actual', ticketControl.ultimos4 ); // el payload son los ultimos4 

    // esto para mandar los tickets pendientes al front y que pueda mostrarlos en pantalla
    socket.emit( 'tickets-pendientes', ticketControl.tickets.length);


    // creamos el evento para crear un ticket y sumarlo a la cola
    // usamos el callback para enviar el ticket que se va a mostrar en pantalla, este callback esta definido en el frontend, en nuevo-ticket
    socket.on('siguiente-ticket', ( payload, callback ) => {
        
        const siguiente = ticketControl.siguiente(); // llamamos a uno de los metodos definidos en la clase TicketControl, este retorna un string del nuevo ticket creado
        callback( siguiente ); // madamos ese string como respuesta del server al front

        // aqui hacemos la emisión, aqui generamos un nuevo ticket, por lo que necesitamos actualizar la cantidad de tickets pendientes
        socket.broadcast.emit( 'tickets-pendientes', ticketControl.tickets.length);
    });

    // atendemos el ticket, este evento es envido por el front
    // en el payload viene el escritorio, aqui lo destructuramos
    socket.on('atender-ticket', ({ escritorio }, callback) => {
        
        if ( !escritorio ) { // si el escritorio no viene como parametro
            return callback({ // el callback retorna un error
                ok: false,
                msg: 'Es escritorio es obligatorio'
            });
        }

        const ticket = ticketControl.atenderTicket( escritorio ); // extraemos el 1er ticket del arreglo principal y le añadimos un escritorio, en señal de que va a ser antentido

        // al atender un ticket debemos actualizar la data de la pagina que muestra los ultimos4,para que tenga la data actualizada
        // usamos un broadcast, para que esta emisión actualice la data en todos los usuarios, para que la pagina de publico.js de otro usuario se actualice sin recargar la pagina
        socket.broadcast.emit( 'estado-actual', ticketControl.ultimos4 ); // el payload son los ultimos4 

        // al atender un ticket actualizamos la cantidad tickets pendientes
        // usamos un broadcast, para que esta emisión actualice la data en todos los usuarios
        socket.broadcast.emit( 'tickets-pendientes', ticketControl.tickets.length);

        // hacemos un emit, sin broadcast para que se emita tambien en este usuario, ya que el broadcast lo emitio para el resto menos el mismo usuario
        socket.emit( 'tickets-pendientes', ticketControl.tickets.length);

        if ( !ticket ) { // si no regresa un ticket, es decir, que no hay tickets en la cola
            callback({
                ok: false,
                msg: 'Ya no hay tickets pendientes'
            });
        } else { // si hay ticket, entonces este ticket fue atendido con exito
            callback({
                ok: true,
                ticket // retorna ese ticket que se esta atendiendo, para que el front (el callback lo retorna al front) lo pueda coger y mostrar en pantalla
            })
        }
    })
}



module.exports = {
    socketController
}