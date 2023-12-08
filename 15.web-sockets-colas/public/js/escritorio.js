
// Referencias HTML
const lblEscritorio = document.querySelector('h1'); // seleccionamos el titulo
const btnAtender    = document.querySelector('button'); // boton de atender
const lblTicket     = document.querySelector('small');
const divAlerta     = document.querySelector('.alert');
const lblPendientes = document.querySelector('#lblPendientes'); // muestra los tickets pendientes


// vamos a extraer el nombre desde la url, esta función solo existe en firefox y chrome
const searchParams = new URLSearchParams( window.location.search );

if ( !searchParams.has('escritorio') ) { // buscamos el parametro de escritorio y si no exite
    window.location = 'index.html'; // retornamos al index.html
    throw new Error('El escritorio es obligatorio'); // mandamos un error
}

// si existe el parametro de escritorio
const escritorio = searchParams.get('escritorio'); // extraemos el valor de la variable escritorio de la url
lblEscritorio.innerText = escritorio; // cambiamos el h1 por el nombre del escritorio


divAlerta.style.display = 'none';

const socket = io();

socket.on('connect', () => { // habilitamos el boton
    btnAtender.disabled = false;
});

socket.on('disconnect', () => { // deshabilitamos el boton
    btnAtender.disabled = true;
});


// si escucha este evento, entonces tiene que actulizar la cantidad de tickets pendientes
socket.on('tickets-pendientes', ( pendientes ) => {
    if ( pendientes === 0 ) { // si ya no hay tickest pendientes
        lblPendientes.style.display = 'none'; // no mostramos el label, el mensaje de aparecera
    } else { // si hay tickets pendientes
        lblPendientes.style.display = ''; // mostramos el label
        lblPendientes.innerText = pendientes; // colocamos la cantidad de tickets
    }
})

btnAtender.addEventListener( 'click', () => {
    
    // Cuando hagamos click, vamos a emitir un evento
    // mandamos el escritorio como un objeto y luego tenemos callback, que ya es ejecutado por el backend
    socket.emit( 'atender-ticket', { escritorio }, ( { ok, ticket, msg } ) => {
        
        if ( !ok ) { // si el false
            lblTicket.innerText = 'Nadie.'; // no hay ticket
            return divAlerta.style.display = ''; // retornamos haciendo que la alerta se muestre (no es necesario el return para hacer mostrar la alerta, solo hacemos un return para que salga de esta función y no ejecute lo siguiente)
        }

        // si ok = true, entonces mostramos el ticket que se esta atendiendo
        lblTicket.innerText = 'Ticket ' + ticket.numero;

    });


    // socket.emit( 'siguiente-ticket', null, ( ticket ) => {
    //     lblNuevoTicket.innerText = ticket;
    // });

});
