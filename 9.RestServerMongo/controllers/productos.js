
const { response } = require('express');
const { Producto } = require('../models');

const obtenerProductos = async(req, res = response ) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, productos ] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip( Number( desde ) )
            .limit(Number( limite ))
    ]);

    res.json({
        total,
        productos
    });
}

const obtenerProducto = async(req, res = response ) => {

    const { id } = req.params;
    // console.log(id)
    const producto = await Producto.findById( id )
                            .populate('usuario', 'nombre')
                            .populate('categoria', 'nombre');
    // console.log(producto)
    res.json( producto );

}

const crearProducto = async(req, res = response ) => {

    const { estado, usuario, ...body } = req.body; // extraemos el usuario (actualmente autenticado) y el estado(por defecto será true)

    const productoDB = await Producto.findOne({ nombre: body.nombre }); // buscamos al producto si existe en la base de datos

    if ( productoDB ) { // si ya existe, entonces mandamos un error
        return res.status(400).json({
            msg: `El producto ${ productoDB.nombre }, ya existe`
        });
    }

    // Generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(), // nombre en mayuscula
        usuario: req.usuario._id // id del usuario
    }

    const producto = new Producto( data ); // creamos un producto

    // Guardar en la DB
    await producto.save();

    res.status(201).json(producto);

}

const actualizarProducto = async( req, res = response ) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;
    
    if( data.nombre ) {
        data.nombre  = data.nombre.toUpperCase(); // colocamos el nombre en mayuscula
    }

    data.usuario = req.usuario._id; // cambiamos al usuario

    const producto = await Producto.findByIdAndUpdate(id, data, { new: true }); // actualizamos la data
    // console.log(producto)
    res.json( producto );

}

const borrarProducto = async(req, res = response ) => {

    const { id } = req.params;
    const productoBorrado = await Producto.findByIdAndUpdate( id, { estado: false }, {new: true });

    res.json( productoBorrado );
}

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}

