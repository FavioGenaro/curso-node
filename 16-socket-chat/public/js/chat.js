
const url = ( window.location.hostname.includes('localhost') )
? 'http://localhost:8080/api/auth/'
: 'https://restserver-curso-fher.herokuapp.com/api/auth/';

let usuario = null;
let socket  = null; // creamos la variable del socket antes, luego lo conectaremos = io() 

// Referencias HTML
const txtUid     = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir   = document.querySelector('#btnSalir');



// Validar el token del localstorage
const validarJWT = async() => {

    const token = localStorage.getItem('token') || ''; // extraemos el token del localstorege

    if ( token.length <= 10 ) { // si el token es menor de 10 letras, es un error
        window.location = 'index.html'; // nos retornamos al index.html
        throw new Error('No hay token en el servidor');
    }

    // el fetch retorna la respuesta del server
    const resp = await fetch( url, { // hacemos una petición fetch, por defecto es del tipo get
        headers: { 'x-token': token } // en el header mandamos el token
    });

    const { usuario: userDB, token: tokenDB } = await resp.json(); // de la respuesta extraemos el usuario y token
    localStorage.setItem('token', tokenDB ); // en el localStorage guardamos el nuevo token generado
    usuario = userDB; // a la variable usuario le pasamos los datos del usuario de la respuesta
    document.title = usuario.nombre; // la pestaña tendra el nombre del usuario

    // console.log({usuario, tokenDB})
    await conectarSocket(); // ejecutamos esta función
}

const conectarSocket = async() => {

    socket = io({ // realizamos la conexión al server por medio de socket
        'extraHeaders': { // en el extraHeaders de esta conexión mandamos el token, para que el backend ya lo valide y sepa que usuario esta conectado
            'x-token': localStorage.getItem('token')
        }
    });

    // creamos los eventos
    socket.on('connect', () =>{
        console.log('Sockets online')
    });

    socket.on('disconnect', () =>{
        console.log('Sockets offline')
    });

    // este evento va a permitir escuchar cuando un usuario envia el mensaje, vamos a recibirlo
    socket.on('recibir-mensajes', dibujarMensajes );

    // Para escuchar los mensajes activos y actualizarlos en pantalla
    socket.on('usuarios-activos', dibujarUsuarios );

    // escuchamos cuando un usuario nos manda un mensaje privado
    socket.on('mensaje-privado', (payload) => {
        console.log('Privado:', payload )
    });
}

const dibujarUsuarios = ( usuarios = []) => {

    // console.log(usuarios) // mostramos por consola los usuarios
    let usersHtml = '';
    usuarios.forEach( ({ nombre, uid }) => { // recorremos el arreglo
        // mostramos los usuarios
        usersHtml += `
            <li>
                <p>
                    <h5 class="text-success"> ${ nombre } </h5>
                    <span class="fs-6 text-muted">${ uid }</span>
                </p>
            </li>
            `;
    });

    ulUsuarios.innerHTML = usersHtml; // insertamos la lista en el HTML
}


const dibujarMensajes = ( mensajes = []) => {

    // console.log(mensajes)
    let mensajesHTML = '';
    mensajes.forEach( ({ nombre, mensaje }) => {
    // mostramos la lista de mensajes, con el nombre del usuario al que pertenece
    mensajesHTML += `
                    <li>
                        <p>
                            <span class="text-primary">${ nombre }: </span>
                            <span>${ mensaje }</span>
                        </p>
                    </li>
                    `;
    });

    ulMensajes.innerHTML = mensajesHTML;
}


// evento 'keyup', para que detecte la techa a presionar
txtMensaje.addEventListener('keyup', ({ keyCode }) => { // del evento destruturamos el keyCode, para saber el codigo de la tecla que estamos presionando

    // cogemos los valores del formulario
    const mensaje = txtMensaje.value;
    const uid     = txtUid.value;

    // si el keyCode del enter es 13
    if( keyCode !== 13 ){ return; } // si es diferente de 13 retorna nada
    if( mensaje.length === 0 ){ return; } // si no hay nada en el mensaje no retornamos nada

    socket.emit('enviar-mensaje', { mensaje, uid }); // emitimos para este usuario el 'enviar-mensaje' (lo mandamos al backend), enviando el mensaje y el id

    txtMensaje.value = ''; // borramos el campo de mensaje

})

// cerramos sesión
btnSalir.addEventListener('click', ()=> {

    localStorage.removeItem('token');

    const auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then( () => {
        console.log('User signed out.');
        window.location = 'index.html';
        });
});

const main = async() => {
    // Validadamos el JWT
    await validarJWT();
}
main(); // se ejecuta el main

// (()=>{
//     gapi.load('auth2', () => {
//     gapi.auth2.init();
//     main();
//     });
// })();

