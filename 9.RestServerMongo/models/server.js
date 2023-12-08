
const express = require('express')
const cors = require('cors');
const { dbConnection } = require('../database/config');
const fileUpload = require('express-fileupload'); // importamos el paquete

class Server{
    constructor(){
        // creamos el servidor como propiedad de la clase Server
        this.app = express(); 
        this.port = process.env.PORT

        // this.usuariosPath = '/api/usuarios'; // colocamos la ruta como variable
        // this.authPath = '/api/auth' // creamos una nueva ruta 
        this.paths = { // creamos un objeto con todas las rutas
            auth:       '/api/auth',
            buscar:     '/api/buscar',
            categorias: '/api/categorias',
            productos:  '/api/productos',
            usuarios:   '/api/usuarios',
            uploads:    '/api/uploads',
        }
        // Luego ejecuta estos metodos ni bien se crea el objeto(sirviendo y creando las rutas)

        // Conectar a la base de datos
        this.conectarDB();

        // middlewares, funcion que siempre se ejecuta al leventar el server
        this.middlewares();

        // definimos las rutas de la aplicación
        this.routes();

        // this.listen(); // podemos añadir esto aqui o llamarlo desde app.js con el objeto ya creado, que seria lo mejor
    }

    async conectarDB () { // creamos la función para conectar a la base de datos
        await dbConnection();
    }

    middlewares(){
        // use - es el termino que dice que este es un middleware
        //cors
        this.app.use(cors())
        
        //Lectura y parseo del body
        this.app.use(express.json());// cualquier información que venga de POST, PUT o DELETE (incluso GET)se va a serializar en formato JSON, normalmenmte estan en texto plano(String)

        // directorio publico
        this.app.use(express.static('public'));// servimos el index.html en el ruta /, en / de routes  no se mostrará por tener menor peso
        
        // Fileupload - Carga de archivos
        this.app.use( fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true // crea la carpeta si la ruta tiene una carpeta que no existe
        }));
    }

    routes(){// metodo para el manejo de las clases 
        // this.app.get('/', (req, res) => {
        //     res.send('Hello World')
        // })

        // aqui hacemos una petición get a la ruta /api y devuelve el texto plano Hello World
        // this.app.get('/api', (req, res) => {
        //     res.status(403).json({
        //         msg:'get API'
        //     })
        // })

        // this.app.put('/api', (req, res) => {
        //     res.status(403).json({
        //         msg:'put API'
        //     })
        // })
        // this.app.post('/api', (req, res) => {
        //     res.status(403).json({
        //         msg:'post API'
        //     })
        // })
        // this.app.delete('/api', (req, res) => {
        //     res.status(403).json({
        //         msg:'delete API'
        //     })
        // })

        // aplicamos un middleware, pero para la ruta, es como un condicional para que solo aplicaque en esa ruta
        // lo que carga en esa ruta es el archivo de ruta user (ruta de los usuarios)
        // this.app.use(this.usuariosPath,require('../routes/user'))
        // this.app.use(this.authPath,require('../routes/auth')) // mostrará lo del archivo auth.js de routes

        // establecemos las rutas, las sub rutas de cada ruta
        this.app.use( this.paths.auth, require('../routes/auth'));
        this.app.use( this.paths.usuarios, require('../routes/user'));
        this.app.use( this.paths.categorias, require('../routes/categorias'));
        this.app.use( this.paths.productos, require('../routes/productos'));
        this.app.use( this.paths.buscar, require('../routes/buscar'));
        this.app.use( this.paths.uploads, require('../routes/uploads'));
    }

    listen(){
        this.app.listen(this.port, ()=>{
            console.log('Servidor en el puerto ', this.port)
        })
    }

}

module.exports = Server;