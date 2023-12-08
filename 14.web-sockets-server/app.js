require('dotenv').config(); // para que haga las configuraciones y corra en el puerto de las variables de entorno 8080

const Server = require('./models/server'); // importamos el server

const server = new Server();

server.listen();
