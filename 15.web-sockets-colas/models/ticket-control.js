const path = require('path');
const fs   = require('fs');

class Ticket { // creamos una pequeña clase para ver como van a lucir los tickets
    constructor( numero, escritorio ) { // vamos a recibir sus propiedades como argumento
        this.numero = numero; // numero de ticket
        this.escritorio = escritorio; // para saber a que escritorio se le establece
    }
}



class TicketControl  {
    constructor(  ) {
        // datos por defecto
        this.ultimo = 0; // ultimo ticket que estamos atendiendo
        this.hoy = new Date().getDate(); // dia de hoy, solo el dia
        this.tickets  = []; // tickest pendientes, aún no estan atendidos
        this.ultimos4 = []; // ultimos 4 tickets, que los estaremos mostrando en la pagina pantalla publica, son tickets que estan siendo atendidos

        this.init(); // se ejecuta esta función para que lea el json y actulice las propiedades
    }

    // Vamos a generar un objeto con la data que quiero guardar en el json.
    get toJson() {
        return { // va a ser un return de las propiedades que quiero grabar.
            ultimo: this.ultimo, // este objeto tiene los valores de las propiedades de esta clase
            hoy: this.hoy,
            tickets: this.tickets,
            ultimos4: this.ultimos4,
        }
    }

    // Para inicializar la clase, va a leer el json y va a actulizar las propiedades
    init() {
        const { hoy, tickets, ultimo, ultimos4 } = require('../db/data.json'); // leemos el archivo json y desestructuramos sus campos
        if ( hoy === this.hoy ) { // si el dia coincide, entonces el json tiene la info del dia de hoy, por lo que guarda la data del json en las propiedades de la clase
            this.tickets  = tickets; // el valor de tickets de la instancia de la clase es igual al del archivo .json
            this.ultimo   = ultimo;
            this.ultimos4 = ultimos4;
        } else {
            // Es otro dia, entonces reiniciamos la data con los valores por defecto
            this.guardarDB();
        }
    }

    // guardar la data que tiene la clase dentro del archivo json
    guardarDB() {
        const dbPath = path.join( __dirname, '../db/data.json' ); // ruta del json
        fs.writeFileSync( dbPath, JSON.stringify( this.toJson ) ); // grabamos la data que genera el this.toJson (retorna un json con las propiedades de la clase) en el json

    }
    

    // siguiente ticket, creamos el siguiente ticket y lo agregamos al .json
    siguiente() {
        this.ultimo += 1; // sumamos 1, para que el nuevo ticket tenga eso como su número asigando
        const ticket = new Ticket( this.ultimo, null ); // creamos el ticket, tiene el escritorio como null, porque no tiene a nadie que lo este trabajando en este momento
        this.tickets.push( ticket ); // insertamos ese ticket en el arreglo de tickets

        this.guardarDB(); // guardamos la data con el nuevo ticket en el .json
        return 'Ticket ' + ticket.numero; // regresamos el ticket el número asignado
    }

    // atendemos el ticket, quitamos el ticket del arreglo principal y lo agregamos a los ultimos4 para que se muestre en pantalla
    atenderTicket( escritorio ) {

        // No tenemos tickets, ya despachamos todos
        if ( this.tickets.length === 0 ) {
            return null;
        }

        const ticket = this.tickets.shift(); // this.tickets[0]; quitamos el 1er ticket del arreglo y lo almacenamos en una variable aparte
        ticket.escritorio = escritorio; // le asignamos el ticket al escritorio

        this.ultimos4.unshift( ticket ); // añadimos el ticket al inicio del arreglo de ultimos 4 (se muestran en la pagina)

        if ( this.ultimos4.length > 4 ) { // 
            this.ultimos4.splice(-1,1); // borramos el último  
        }

        this.guardarDB(); // guardamos en el .json, editamos solo el arreglo de ultimos4

        return ticket; // retorna el ticket, que esta en la cola, que es un ticket independiente del arreglo principal
    }
}

module.exports = TicketControl;