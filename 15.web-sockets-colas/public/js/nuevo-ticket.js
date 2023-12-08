
// console.log('Nuevo Ticket HTML');

// Referencias HTML
const lblNuevoTicket = document.querySelector('#lblNuevoTicket'); // label que inicalmente muestra Cargando...
const btnCrear = document.querySelector('button'); // boton


const socket = io(); // inicializamos socket.io


socket.on('connect', () => {
    btnCrear.disabled = false; // si esa conectado, entonces habilitamos el botón
});

socket.on('disconnect', () => {
    btnCrear.disabled = true; // si esta conectado al server, el boton se deshabilita
});


// un nuevo listener o evento
socket.on('ultimo-ticket', (ultimo) => {
    lblNuevoTicket.innerText = 'Ticket ' + ultimo; // el label muestra el ultimo ticket y su codiog (ultimo)
})


btnCrear.addEventListener( 'click', () => { // evento al dar clic al botón
    
    // en el payload no hay nada, asi que mandamos un null
    // en el tercer argumento, es el callback (lo ejecuta el server como si fuera una repuesta de la petición que hacemos desde aqui, el front), que va a recibir el ticket
    socket.emit( 'siguiente-ticket', null, ( ticket ) => {
        // console.log('Desde el server ', ticket)
        lblNuevoTicket.innerText = ticket; // cambiamos el texto del label por el del ticket
    });

});