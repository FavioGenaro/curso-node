
// console.log('Público HTML')

// Referencias HTML
const lblTicket1 = document.querySelector('#lblTicket1');
const lblEscritorio1 = document.querySelector('#lblEscritorio1');
const lblTicket2 = document.querySelector('#lblTicket2');
const lblEscritorio2 = document.querySelector('#lblEscritorio2');
const lblTicket3 = document.querySelector('#lblTicket3');
const lblEscritorio3 = document.querySelector('#lblEscritorio3');
const lblTicket4 = document.querySelector('#lblTicket4');
const lblEscritorio4 = document.querySelector('#lblEscritorio4');

const socket = io();

// escuchamos este evento
socket.on('estado-actual', ( payload ) => { // el payload es el arreglo con los ultimos 4 tickets atendidos

    const audio = new Audio('./audio/new-ticket.mp3');
    audio.play(); // activamos el auido cada vez que el se atiende un ticket, porque es cuando los ultimos4 se actualizan

    const [ ticket1, ticket2, ticket3, ticket4 ] = payload; // destructuramos cada ticket

    if( ticket1 ){ // si el ticket existe, entonce los muestro en los label
        lblTicket1.innerText = 'Ticket ' + ticket1.numero;
        lblEscritorio1.innerText = ticket1.escritorio;
    }
    
    if( ticket2 ){ // si el ticket existe, entonce los muestro en los label
        lblTicket2.innerText = 'Ticket ' + ticket2.numero;
        lblEscritorio2.innerText = ticket2.escritorio;
    }
    
    if( ticket3 ){ // si el ticket existe, entonce los muestro en los label
        lblTicket3.innerText = 'Ticket ' + ticket3.numero;
        lblEscritorio3.innerText = ticket3.escritorio;
    }
    
    if( ticket4 ){ // si el ticket existe, entonce los muestro en los label
        lblTicket4.innerText = 'Ticket ' + ticket4.numero;
        lblEscritorio4.innerText = ticket4.escritorio;
    }
    


});