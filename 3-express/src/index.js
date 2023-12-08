
const express = require('express'); // importamos el modulo express

const app = express(); // creamos la aplicacion 
// const port = 3000;

// importamos el modulo de manejo de rutas
const user = require('./router/users')

const path = require('path'); // para el manejo de rutas

const connection = require ('./connection') // importamos el modulo de conexión
// SETTINGS
app.set('title','Aplicación hecha en node'); // configuración llamada title, con un valor igual a Aplicación hecha en node
app.set('port',4000); // creamos una configuración port con valor puerto

// configuración del motor de plantilla(es añadir funcionalidad a los html, como incustrar JS)
app.set('view engine', 'ejs'); // ejs es el tipo de plantilla que va a usar
app.set('views',path.join(__dirname, 'views'));// con views establecemos la ruta de nuestra carpeta views


// creamos un middleware
// const my_middleware = (req, res, next) =>{ // petición, respuesta y next
//     console.log('Ejecutando middleware');
//     next(); // va dar paso a que se ejecute la respuesta del servidor, recodemos que se ejecuta depues de la petición y antes de que se mande la respuesta
// }

// app.use(my_middleware); // con esto ya se estaria ejecutando el middleware


// const isLogged = (req, res, next)=>{ // petición, respuesta y next
//     let logged = false;
//     if(logged){ // si es true, da paso a la respuesta de la petición
//         next(); // va dar paso a que se ejecute la respuesta del servidor, recodemos que se ejecuta depues de la petición y antes de que se mande la respuesta
//     }else{ // si no esta logiado, debe enviar un mensaje
//         res.send('No puede acceder, debe logiarse')
//     }

// }

// app.use(isLogged); // con esto ya se estaria ejecutando el middleware

const loggedMiddleware = require('./middlewares/looged') // importamos


// MIDDLEWARE
app.use(loggedMiddleware.isLogged); // usamos la variabla isLogged, que en si es una función anónima

// app.use(express.static(__dirname + '/public'));
// console.log(__dirname);
app.use(express.static(path.join(__dirname, 'public'))); // mostramos la carpeta public
app.use(express.urlencoded({extended:false})); // tiene de parametro un objeto

// creamos RUTAS
// app.get('/',(req, res)=>{ // va a ser una ruta del tipo get. cuando se realice una petición se ejecuta la función
//     res.send('Bienvenido') // la respuesta es mostrar un mensaje, este se muestra como HTML
// })

app.get('/',(req, res)=>{ // 
    // res.send('Bienvenido');
    res.render('index');// index.ejs
})

// ruta de usuarios, ahora se maneja en otro archivo
// app.get('/users',(req, res)=>{ // va a ser una ruta del tipo get. cuando se realice una petición se ejecuta la función
//     res.send('Mostrando todos los usuarios') // la respuesta es mostrar un mensaje
// })

// la aplicación va usar todas las rutas que se crean en el router user
app.use('/users',user); 

// funcionalidad para que nuestro servido escuche por un puerto
app.listen(app.get('port'), ()=>{
    // mediante get y el nombre de la configuración accedo al valor de la configuración.
    console.log('Mi ' + app.get('title') +' esta corriendo en mi puerto ' +app.get('port') )
})
