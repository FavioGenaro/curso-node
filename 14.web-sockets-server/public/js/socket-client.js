// configuración de lo web socket con el servidor

// Referencias del HTML
const lblOnline  = document.querySelector('#lblOnline');
const lblOffline = document.querySelector('#lblOffline');

const txtMensaje = document.querySelector('#txtMensaje');  // caja de texto
const btnEnviar  = document.querySelector('#btnEnviar'); // boton


// Colocamos la función que hace que el usuario se conecte, este io viene de socket.io.js
const socket = io()


// on: es para escuchar eventos
socket.on('connect', () => { // se dispara cuando tenemos una conexión
    console.log('Conectado');

    lblOffline.style.display = 'none'; // el desconectado ya no se ver
    lblOnline.style.display  = ''; // este si se ve

});

socket.on('disconnect', () => { // se dispara cuando nos deconectamos
    console.log('Desconectado del servidor');

    // hacemos el proceso inverso
    lblOnline.style.display  = 'none'; // no se ve el conectado
    lblOffline.style.display = ''; // mostramos el desconectado
});

// declaramos el listen que el cliente va a escuchar, esto lo envia el server
socket.on('enviar-mensaje', (payload) => {
    console.log( payload )
    // console.log( '!!!' )

})

// cuando hagamos click en el boton vamos a enviar la data
btnEnviar.addEventListener( 'click', () => {

    const mensaje = txtMensaje.value;
    const payload = { // creamos un objeto que va a ser la información que vamos a enviar, en vez de solo el mensaje
        mensaje,
        id: '123ABC',
        fecha: new Date().getTime()
    }
    
    // vamos a emitir el evento, este evento debe ser definido como un on de lado del servidor para que pueda escucharlo
    // socket.emit( 'enviar-mensaje', payload);

    // cuando enviamos la info, el 3er argumento es un callback que recibe lo que mandamos en el backend, como el id
    // este callback lo va a ejecutar el server cuando el envio de la información fue el correcto
    socket.emit( 'enviar-mensaje', payload, ( id ) => { 
        console.log('Desde el server', id ); 
    });

});