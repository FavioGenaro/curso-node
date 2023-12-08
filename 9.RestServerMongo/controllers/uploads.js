const path = require('path');
const { v4: uuid4 } = require('uuid')
const fs   = require('fs');

const cloudinary = require('cloudinary').v2 // importamos el paquete
cloudinary.config( process.env.CLOUDINARY_URL ); // configuramos cloudinary, para que sepa que usuario lo usa, nos autenticamos

// const { subirArchivo } = require('../helpers');
const { response } = require('express');

const { Usuario, Producto } = require('../models');
const { subirArchivo } = require('../helpers');


const cargarArchivo = async(req, res = response) => {

    // verificamos si viene el files
    // if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    //     res.status(400).json({msg:'No hay archivo que subir.'});
    //     return;
    // }

    
    try {
        // imagenes, solo mandamos el file, por defecto recibe las extensionesValidas para imagenes y una ruta de carpeta vacia
        const pathCompleto = await subirArchivo( req.files, ['txt', 'md'], 'textos')
        res.json({ pathCompleto })
        
    } catch (msg) {
        res.status(400).json({ msg });
    }

    // const { archivo } = req.files; // destructuramos el archivo

    // const nombreCortado = archivo.name.split('.');
    // const extension = nombreCortado[ nombreCortado.length -1 ]

    // // Validar la extensión
    // const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'] // lista de extensiones permitidas
    // if ( !extensionesValidas.includes( extension ) ){ // si no esta dentro de la lista, retorna un error
    //     return res.status(400).json ({ 
    //         msg: `La extensión ${extension} no es permitida, ${extensionesValidas}`
    //     })
    // }

    // // establecemos el nombre del archivo como un id, para que los nombres no se crucen
    // const nombreTemp = uuid4() + '.' + extension

    // // path donde se va a colocar el archivo, en la carpeta upload de este proyecto
    // // el nombre del archivo es archivo.name
    // uploadPath = path.join( __dirname, '../uploads/', nombreTemp);

    // // ejecutamos la función de mover a la ruta
    // archivo.mv(uploadPath, (err) => {
    //     if (err) {
    //         console.log(err)
    //         return res.status(500).send(err);
    //     }
    //     res.json({msg:'File uploaded to ' +  uploadPath})
    // });
}


const actualizarImagen = async(req, res = response ) => {

    const { id, coleccion } = req.params; // recibimos los parametros

    let modelo; // va a ser let, porque vamos a establecer su valor de forma condicional

    switch ( coleccion ) {
        case 'usuarios': // si la coleccion son los usuarios
            modelo = await Usuario.findById(id); // buscamos el id del usuarios
            if ( !modelo ) { // si no existe lanzamos el error
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }
            break;
        case 'productos': // si es un producto
            modelo = await Producto.findById(id); // buscamos el producto en la bd
            if ( !modelo ) { // si no existe retorna un error
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }
            break;
        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto'});
    }


    // Limpiar imágenes previas, la imagen que puede tener un usuario antes.
    if ( modelo.img ) { // si el la propiedad imagen existe 
        // Hay que borrar la imagen del servidor
        const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img ); // ruta de la imagen, colección sea producto o usuario
        if ( fs.existsSync( pathImagen ) ) { // verificamos la existencia de la imagen
            fs.unlinkSync( pathImagen ); // si existe se elimina
        }
    }

    // undefined, para que tome la lista que tiene por defecto y la coleccion para que se almacena en esa carpeta
    const nombre = await subirArchivo( req.files, undefined, coleccion );
    modelo.img = nombre; // la imagen en el producto o usuario se guarda con el nombre que tiene la imagen

    await modelo.save(); // guardamos en la base de datos

    res.json( modelo );
    // res.json( {id, coleccion} );
}

// vamos actualizar imagen con cloudinary
const actualizarImagenCloudinary = async(req, res = response ) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch ( coleccion ) { // verificamos la colección
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }      
            break;
        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto'});
    }

    // Limpiar imágenes previas
    if ( modelo.img ) { // verificamos si el modelo tiene la propiedad img.
        const nombreArr = modelo.img.split('/'); // partimos el enlace por el slash (es una url de cloudinary)
        const nombre    = nombreArr[ nombreArr.length - 1 ]; // obtenemos la ultima parte
        const [ public_id ] = nombre.split('.'); // separamos por el punto para tener solo el id, separado del jpg o png, etc y solo obtenemos el id
        cloudinary.uploader.destroy( public_id ); // elimina la imagen anterior
    }

    const { tempFilePath } = req.files.archivo // del objeto destrucnturamos la ruta temporal, para enviarlo a cloudinary
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath ); // subimos la imagen a cloudinary
    modelo.img = secure_url; // secure_url es el enlace que retorna al subir la imagen (podemos no destructurar y ver toda la info que retorna cloudinary)

    await modelo.save(); // guardamos el modelo con la modificación, sea producto o usuarios

    res.json( modelo );
}

const mostrarImagen = async(req, res = response ) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch ( coleccion ) { // lo mismo que el contrador de actualizar
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }
        
        break;

        case 'productos':
            modelo = await Producto.findById(id);
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }
        
        break;
    
        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto'});
    }


    // Limpiar imágenes previas
    if ( modelo.img ) {
        // Hay que borrar la imagen del servidor
        const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );
        if ( fs.existsSync( pathImagen ) ) { // si la imagen existe nosotros mandamos la imagen
            return res.sendFile( pathImagen ) // mandamos la imagen
        }
    }

    // res.json({msg: 'falta placeholder'}) // no hay imagen
    // retornamos un imagen por defecto, cuando no hay imagen
    const pathImagen = path.join( __dirname, '../assets/not-found.jpg');
    res.sendFile( pathImagen );
}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}