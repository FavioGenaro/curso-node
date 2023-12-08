// const hola_mundo = require('hola-mundo')
// // console.log('Hola Mundo');
// console.log(hola_mundo.mensaje());

const http = require('http') // importamos el modulo
const server = http.createServer(onRequest) // creamos el servidor, pasamos la función para que cuando se cree el server cada vez que se detecte una petición se ejecuta la función
const port = 3000;
const fs = require('fs'); // importamos este modulo para leer archivos, es parte de node
const qs = require('querystring') // modulo para convertir el tipo de dato

server.listen(port, () => {
    console.log('Mi servidor esta corriendo en localhost:3000')// mostramos por consola, el server corre localmente
}); // asignamos el puerto, pasamos el numero de puerto por el que va a escuchar nuestro servidor

// si lo abrimos en navegador, no pasa nada, porque solo lo estamos creando
// solo estamos mostrando por consola, más no por el navegador. La pagina no obtiene respuesta desde el servidor
// al entrar a la pagina enviamos una peticion al server, pero aun no configuramos la respuesta

// function onRequest(req, res){// dos parametros, el primero es la petición y la segunda es la respuesta
//     console.log('Se ha detectado una nueva petición');
    // request: contiene toda la información de la petición
    // console.log(request);
    // console.log(request.headers.host) // retorna el serve a donde se dirige la petición: localhost:3000
    // console.log(request.url); // retorna la ruta de la url: / ó /users
    // console.log(request.method); // tipo de petición que estamos recibiendo: GET, POST,..

    // response: contiene la respuesta a la petición
    // res.setHeader('content-type', 'text/plain'); // enviamos una cabecera a la petición, el primer parametro es tipo de contenido y el segundo es texto plano(el tipo de contenido en sí)
    // res.write('Bienvenidos al curso de node.js'); // contenido a enviar
    // res.end();// finalizamos 

    // HTML
    // res.setHeader('content-type', 'text/html'); // enviamos HTML
    // res.write('<h1>Bienvenidos al curso de node.js</h1>'); // Podemos colocar etiquetas HTML
    // res.write('<h2>Pagina de prueba</h2>'); // se escribe debajo del anterior
    // res.end();// finalizamos 

    // fs.readFile('index.html', (err, content) => { // el primer parametro es el archivo, el segundo es una función
    //     // en la función optamos por una anonima, recibe como parametros el error (por si no encontro el archivo) y el contenido del archivo
        
    //     if(err){ // si hay un error
            
    //         // console.log(err) // mostramos el error
    //         if(err.code == 'ENOENT'){
    //             res.setStatus = 404; // error de no se encontro el archivo
    //             console.log('No se ha encontrado el archivo');
    //         }else{
    //             res.setStatus = 500; // error de servido
    //             console.log('Ha ocurrodo un error en el servidor');
    //         }

    //     }else {
    //         res.setStatus = 202; // si todo esta correcto
    //         res.setHeader('content-type', 'text/html'); // enviamos HTML
    //         res.write(content); // escribe el contenido del html 
    //         res.end();
    //     }    
    // })
// } 

function onRequest(req, res){// dos parametros, el primero es la petición y la segunda es la respuesta
    console.log('Se ha detectado una nueva petición');

    if(req.url =='/' ){ // si estamos en el inicio
        fs.readFile('index.html', (err, content) => { // el primer parametro es el archivo, el segundo es una función
            // en la función optamos por una anonima, recibe como parametros el error (por si no encontro el archivo) y el contenido del archivo
            
            if(err){ // si hay un error
                
                // console.log(err) // mostramos el error
                if(err.code == 'ENOENT'){
                    res.setStatus = 404; // error de no se encontro el archivo
                    console.log('No se ha encontrado el archivo');
                }else{
                    res.setStatus = 500; // error de servido
                    console.log('Ha ocurrodo un error en el servidor');
                }
    
            }else {
                res.setStatus = 202; // si todo esta correcto
                res.setHeader('content-type', 'text/html'); // enviamos HTML
                res.write(content); // escribe el contenido del html 
                res.end();
            }    
        })
    } else if (req.url == '/users'){ // pagina de users
        if(req.method == 'GET'){
            res.setStatus = 200; // si todo esta correcto
            res.setHeader('content-type', 'text/html'); // enviamos HTML
            res.write('Accediendo a usuarios'); // escribe el contenido del html 
            res.end();
        }else if (req.method == 'POST'){
            // res.setStatus = 200; // si todo esta correcto
            // res.setHeader('content-type', 'text/html'); // enviamos HTML
            // res.write('Insertar usuarios'); // escribe el contenido del html 
            var datos = '';
            req.on('data',(d)=>{// vamos a detectar un evento de tipo data, es decir, se detecta si se recibe datos y la segunda función es un callback
                datos += d; // d alamacena los datos
            }); 
            req.on('end', () => { // al terminar el envio
                var post = qs.parse(datos); // convertimos los datos recibidos
                res.end('Datos recibido: ' + post.nombre); // una vez convertidos los podemos mostrar. Debemo colocar el .nombre porque es el key del dato
            })

        }else if (req.method == 'PUT'){
            // res.setStatus = 200; // si todo esta correcto
            // res.setHeader('content-type', 'text/html'); // enviamos HTML
            // res.write('Modificando usuarios'); // escribe el contenido del html 
            // res.end();

            var datos = '';
            req.on('data',(d)=>{// vamos a detectar un evento de tipo data, es decir, se detecta si se recibe datos y la segunda función es un callback
                datos += d; // d alamacena los datos
            }); 
            req.on('end', () => { // al terminar el envio
                var post = qs.parse(datos); // convertimos los datos recibidos
                res.end('Datos recibido: ' + post.nombre); // una vez convertidos los podemos mostrar. Debemo colocar el .nombre porque es el key del dato
            })
        }else if (req.method == 'DELETE'){
            // res.setStatus = 200; // si todo esta correcto
            // res.setHeader('content-type', 'text/html'); // enviamos HTML
            // res.write('Eliminando usuarios'); // escribe el contenido del html 
            // res.end();

            var datos = '';
            req.on('data',(d)=>{// vamos a detectar un evento de tipo data, es decir, se detecta si se recibe datos y la segunda función es un callback
                datos += d; // d alamacena los datos
            }); 
            req.on('end', () => { // al terminar el envio
                var post = qs.parse(datos); // convertimos los datos recibidos
                res.end('Datos recibido: ' + post.nombre); // una vez convertidos los podemos mostrar. Debemo colocar el .nombre porque es el key del dato
            })
        }
        
    }
}


