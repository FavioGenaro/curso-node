
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// recibe directamente los files, lista de extensiones permitidas y una carpeta donde queremos que 
const subirArchivo = ( files, extensionesValidas = ['png','jpg','jpeg','gif'], carpeta = '' ) => {

    return new Promise( (resolve, reject) => { // lo manejamos a través de promesas, el req = reject y res = resolve

        const { archivo } = files;
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[ nombreCortado.length - 1 ];

        // Validar la extension
        if ( !extensionesValidas.includes( extension ) ) { // si no esta dentro de la lista, retorna un error
            return reject(`La extensión ${ extension } no es permitida - ${ extensionesValidas }`);
        }

        // establecemos el nombre del archivo como un id, para que los nombres no se crucen
        const nombreTemp = uuidv4() + '.' + extension;
        // path donde se va a colocar el archivo, en la carpeta upload de este proyecto
        // el nombre del archivo es archivo.name
        const uploadPath = path.join( __dirname, '../uploads/', carpeta, nombreTemp );

        // ejecutamos la función de mover a la ruta
        archivo.mv(uploadPath, (err) => {
            if (err) {
                reject(err); // respondemos con un error
            }

            resolve( nombreTemp ); // como respuesta mostramos el nombre
        });
    });
}

module.exports = {
    subirArchivo
}
