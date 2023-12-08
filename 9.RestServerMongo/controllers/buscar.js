const { response } = require('express');
const { ObjectId } = require('mongoose').Types;

const { Usuario, Categoria, Producto } = require('../models');

const coleccionesPermitidas = [ // arreglo en las que se pueden realizar busqueda
    'usuarios',
    'categorias',
    'productos',
    'roles'
];

const buscarUsuarios = async( termino = '', res = response ) => {
    // el termino puede ser el nombre del usuario o su id
    const esMongoID = ObjectId.isValid( termino ); // valida si el id es del formato de mongo 

    if ( esMongoID ) { // si es id de mongo, entonces realiza la busqueda por id en la base de datos
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: ( usuario ) ? [ usuario ] : [] // si usuario exite manda el arreglo con el usuario, si no existe manda un arreglo vacio
        });
    }
    
    // si no es por el id, entonces buscamos por el nombre o correo
    const regex = new RegExp( termino, 'i' ); // la expresión regular en js, 'i', quiere decir que busca sea minuscula o mayuscula
    const usuarios = await Usuario.find({ // busca el o los usuarios, usamos la sentencia or y and
        $or: [{ nombre: regex }, { correo: regex }], // busca en el nombre o el correo que coincidan
        $and: [{ estado: true }] // además estos si o si deben tener un estado en true
    });

    res.json({
        results: usuarios
    });

}

const buscarCategorias = async( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino ); // TRUE 

    if ( esMongoID ) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: ( categoria ) ? [ categoria ] : []
        });
    }

    const regex = new RegExp( termino, 'i' );
    const categorias = await Categoria.find({ nombre: regex, estado: true }); // solo por nombre y estado

    res.json({
        results: categorias
    });

}

const buscarProductos = async( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino ); // TRUE 

    if ( esMongoID ) {
        const producto = await Producto.findById(termino) // busca el id
                            .populate('categoria','nombre');// despeja los datos de la categoria
        return res.json({
            results: ( producto ) ? [ producto ] : []
        });
    }

    const regex = new RegExp( termino, 'i' );
    const productos = await Producto.find({ nombre: regex, estado: true }) // busca por el nombre y estado
                            .populate('categoria','nombre') // despeja los datos de la categoria

    res.json({
        results: productos
    });

}


const buscar = ( req, res = response ) => {

    // vamos a desestructurar del enlace la colección y termino.
    const { coleccion, termino  } = req.params;
    
    if ( !coleccionesPermitidas.includes( coleccion ) ) { // la colecion de los params debe estar includo en el arreglo
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${ coleccionesPermitidas }`
        })
    }
    
    switch (coleccion) { // realizamos la busqueda según la collección
        case 'usuarios':
            buscarUsuarios(termino, res); // pasamos el termino y el res, pues esa función es la que va a retorna la respuesta del backend
            break;
        case 'categorias':
            buscarCategorias(termino, res);
            break;
        case 'productos':
            buscarProductos(termino, res);
            break;
            
        default: // si no es ninguna coleccion
            res.status(500).json({ 
                msg: 'Se le olvido hacer esta búsquda'
            })
        }
            
}
                    
    // res.json ({
    //     msg: 'Buscar ...',
    //     coleccion,
    //     termino
    // })
module.exports = {
    buscar
}