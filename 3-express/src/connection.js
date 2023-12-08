
// realizamos la coneción

const mysql = require('mysql'); // modulo necesario para la conexion
const {mysql_database} = require('./config'); // extraemos el objeto de la BD del archivo config

const connection = mysql.createConnection(mysql_database) // pasamos los datos de la conexión de la base de dato

connection.connect((err, conn) =>{ // connect recibe una función
    // recibe dos parametros, el error y la conexión establecida
    if(err){
        console.log('Error en la conexión')
        console.log(err)
    }else{
        console.log('conexión exitosa')
        return conn;
    }

})

module.exports = connection; // exportamos, lo llamaremos desde index.js