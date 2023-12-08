const url = 'http://localhost:8080/api/auth/' // url base para realizar la peticiones

// AUTENTICACIÓN CON USUARIO Y CONTRASEÑA
const miFormulario = document.querySelector('form');

miFormulario.addEventListener('submit', ev => { // del formulario definimos el evento submit
    ev.preventDefault();
    const formData = {}; // almacena la data que vamos a enviar al servidor

    for( let el of miFormulario.elements ) { // leemos los elementos del formulario
        if ( el.name.length > 0 )  // si el name de los inputs es mayor a cero, porque el boton no tiene name
            formData[el.name] = el.value // colocamos el name como indice y le asigamos su value
    }

    // console.log(formData) // ya tenemos la data del formulario

    fetch( url + 'login', { // hacemos una petición post al /login, este metodo ya esta definido en el rest-server
        method: 'POST',
        body: JSON.stringify( formData ),
        headers: { 'Content-Type': 'application/json' }
    })
    .then( resp => resp.json() )
    .then( ({ msg, token }) => { // destrucutamos el msg y token, en este caso viene el msg si ocurre un error y el token si todo esta bien, según se definio en el controlador de esa petición
        if( msg ){
            return console.error( msg ); // si hay un msg, es un error
        }

        localStorage.setItem('token', token); // guardamos el token en el localStorage
        window.location = 'chat.html'; // nos colocamos en el chat.html
    })
    .catch( err => {
        console.log(err)
    })
    
});

// AUTENTICACIÓN CON GOOGLE
// Gracias a esta función podemos controlar el token
// la función decodeJwtResponse es una función que debemos definir, pero no la haremos por le momento
function handleCredentialResponse(response) {
    // mostramos el token que nos retorna google
    // console.log('id_token', response.credential)

    const body = { id_token: response.credential } // almacenamos el token
    fetch( url + 'google',{ // diparamos un petición tipo post a este enlace
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify( body ) // pasamos el token en el body
    })
        .then( resp => resp.json())
        .then( ({ token, usuario }) =>{ // destructuramos el token
            // console.log(resp) // mostramos la respuesta de nuestro backend, esta definida en el controlador
            localStorage.setItem('token', token) // guardamos el token en localStorage
            localStorage.setItem('email', usuario.correo ) // guardamos el correo en el localStorage
            window.location = 'chat.html'; // nos colocamos en el chat.html
        })
        .catch( console.warn ) // mostramos el error
}

const button = document.getElementById('g_id_signout');
button.onclick = async() => {

    // console.log(google.accounts.id)//permite el acceso a diversa funciones
    google.accounts.id.disableAutoSelect()
    google.accounts.id.revoke(localStorage.getItem('email'), done => { // mandamos el correo del localStorage
        // console.log('consent revoked');
        localStorage.clear() // limpiamos el localStorage
        location.reload() // recarga la pagina y vaciar cualquier cosa que tengamos en el esado de la palicación
    });
}