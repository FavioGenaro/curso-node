const { response } = require('express');
const { Categoria } = require('../models');

const obtenerCategorias = async(req, res = response ) => {
    const { limite = 5, desde = 0 } = req.query; // destructuramos los argumentos que vienen en el enlace, si no viene entonces toman su valor por defecto
    const query = { estado: true }; // solo retorne los que tienen estado en true

    const [ total, categoria ] = await Promise.all([ // Promise.all, ejecuta cada promesa de forma paralela, colocamos cada promesa y la separamos por comas.
        Categoria.countDocuments(query), // contamos los registros y se almacena en total
        Categoria.find(query) // retornamos todos los que tiene estado true, se almacena en categoria
            .populate('usuario', 'nombre') // del usuario busca su id y trae su nombre
            .skip( Number( desde ) )
            .limit(Number( limite ))
    ]);

    res.json({
        total, // total de registros
        categoria // categorias en lista
    })

}

const obtenerCategoria = async(req, res = response ) => {
    const { id }= req.params; // recuperamos el id de los parámetros del enlace

    // const categoria = await Categoria.findById( id )
    //                         .populate('usuario', 'nombre');
    const categoriaDB = await Categoria.find({id, estado: true}) // trae la data, el id ya existe, porque el middleware lo comprueba antes, por eso aqui ya no validamos más
                        .populate('usuario', 'nombre');  // del usuario busca su id y trae su nombre

    res.json({
        categoriaDB // categoria encontrada
    })
    // res.json(categoriaDB) // podemos colocarlo así también
}

const crearCategoria = async(req, res = response ) => {

    const nombre = req.body.nombre.toUpperCase(); // tomamos el nombre y lo colocamos en mayuscula

    const categoriaDB = await Categoria.findOne({ nombre }); // buscamos una categoria con el mismo nombre

    if ( categoriaDB ) { // si ya existe la categoria, entonces mandamos el error
        return res.status(400).json({
            msg: `La categoria ${ categoriaDB.nombre }, ya existe`
        });
    }

    // Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id // mandamos el id del usuario que esta creando la categoria, este usuario es devuelto por el token
        // el estado se graba por defecto en true
    }

    const categoria = new Categoria( data ); // creamos el modelo

    // Guardamos en DB
    await categoria.save();

    res.status(201).json(categoria); // se creo correctamente

}

const actualizarCategoria = async(req, res = response ) => {
    
    const {id}= req.params; // esta en el params de la request, incluso tambien no podriamos destructurarlo id = req.params.id

    const { estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase(); // colocamos en nombre en mayuscula
    data.usuario = req.usuario._id; // establecemos el usuario, será el usuario que realiza esta modificación

    // actualizamos el registro, busca por el id, le pasamos el resto como los valores que vamos a actualizar
    const categoria = await Categoria.findByIdAndUpdate( id, data, {new: true} ); // {new: true} para que se mire la información almacenada

    res.json({
        categoria, // mostramos la categoria
    })

}

const borrarCategoria = async(req, res = response ) => {
    const { id } = req.params; // obtenemos el id
    const categoriaBorrada = await Categoria.findByIdAndUpdate( id, { estado: false }, {new: true }); // cambiamos el estaod

    res.json( categoriaBorrada ); // mostramos la categoria
}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}