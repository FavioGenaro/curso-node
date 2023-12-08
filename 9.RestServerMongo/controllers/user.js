
const { response, request } = require('express'); // añadimos response de express para que cuando escribamos res. VSC nos muestre los metodos de res, porque actualmente no sabe que es una variable de ese tipo
// anque en si hacer el res = response es redundante, pero lo hacemos para VSC lo detecte como tal

const bcryptjs = require('bcryptjs');

const Usuario = require ('../models/usuarios'); // colocamos la vaiable en mayuscula por que es parecido a un clase, vamos a crear instancias del modelo
// const { validationResult } = require('express-validator');

const usuariosGet = async(req, res = response) => {
    
    // const query = req.query;// la petición en este caso es con quey params
    // const {q, nombre='No name', apikey, list=1} = req.query;
    
    const { limite = 5, desde = 0 } = req.query; // destructuramos los argumentos que vienen en el enlace, si no viene entonces toman su valor por defecto
    const query = { estado: true }; // filtro en forma de objeto, para que solo retorne los que tienen estado en true

    // const usuario = await Usuario.find( query ) // retorna todos los usuarios, funciones skip nos sirve para hacer la paginación y el limit cogé una cantidad de registros
    //     .skip( Number( desde ) ) // comvertimos el desde y limite a entero porque en el enlace viene como string
    //     .limit(Number( limite ))

    // const total = await Usuario.countDocuments( query ) // cuenta la cantidad de registros del documento Usuarios en mongo.
    // destrunturamos las respuestas de cada una de las promesas
    const [ total, usuario ] = await Promise.all([ // Promise.all, ejecuta cada promesa de forma paralela
        Usuario.countDocuments(query), // colocamos cada promesa y la separamos por comas.
        Usuario.find(query)
            .skip( Number( desde ) )
            .limit(Number( limite ))
    ]);

    res.json({
        // msg:'get API - controlador',
        // q,
        // nombre, 
        // apikey,
        // list
        total,
        usuario
        // resp
    })
}

const usuariosPost = async (req, res = response) => {

    // const errors = validationResult(req) // recoge los errores de la request, 
    // if ( !errors.isEmpty() ){ // si existe
    //     return res.status(400).json(errors) // devuelve el error y no se realiza la petición
    // }

    // req es la petición de los usuarios, res es la respuesta 
    // const body = req.body;// recibe los datos del body (el middleware this.app.use(express.json()) ya lo serializa en formato json)
    // el body recibe la info, esta debe ser limpiada de scripts o inyecciones de cualquier tipo

    // extraemos los datos que nos interesan, pero si son por ejemplo 1000 datos, podemos solo exparsir la data ({abc,...resto } y resto tendria la data menos abc) 
    const {nombre, correo, password, rol} = req.body;
    const usuario = new Usuario( {nombre, correo, password, rol}) // el modelo Usuario va a tomar a body y cogerá todos los valores que coincidan con el modelo, si hay información que esta en body y no en el modelo, entonce se ignorará

    // VERIFICAMOS QUE EL CORREO EXISTE
    // verificamos si el correo ya esta dentro de la base de datos
    // const existeEmail = await Usuario.findOne({correo}) // es {correo: correo}, pero en javascript esto es redundante

    // if(existeEmail){ // si es true o existe, entonces no podemos registrarlo.
    //     return res.status(400).json({
    //         msg: 'Este correo ya está registrado'
    //     })
    // }

    // ENCRIPTAMOS LA CONTRASEÑA
    const salt = bcryptjs.genSaltSync(11) // colocamos un número dentro, para añadir mayor complejidad, por defecto es 10, 100 es más seguro pero tardara más en generarse por lo que buscamos un valor intermedio
    // usuario.password es lo que tiene el modelo de usuario
    usuario.password = bcryptjs.hashSync( password, salt ) // pide lo que vamos a encriptar y también el salt

    // GUARDAMOS
    await usuario.save() // guardamos la data en mongo, esta es una función asincrona porque esperamos la respues de una aplicación externa por la petición

    res.json({
        msg:'post API - controlador',
        // body // mandamos directamente el body, no parte por parte
        usuario // mostramos el usuario en formato json
    })
}
const usuariosPut = async (req, res = response) => {
    // los parametros de segmento vienen en la petición o request
    const {id}= req.params; // esta en el params de la request, incluso tambien no podriamos destructurarlo id = req.params.id

    // vamos a destructurar la información que no necesitamos que se actualice
    // el password si viene con un valor, entonces si se actualice. google y correo no los tocaremos por el momento
    const { _id,password, google, correo, ...resto } = req.body;

    // si viene el password, eso quiere decir que quiere actualizar la contraseña
    if ( password ) {
        // Encriptar la contraseña, volvemos a generar el hash
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt ); // añadimos password al resto para que se actualice
    }

    // actualizamos el registro, busca por el id y lo actualiza y le pasamos el resto como los valores que vamos a actualizar
    const usuario = await Usuario.findByIdAndUpdate( id, resto ); // no se usa useFindModefy en la configuración de la base de datos con findByIdAndUpdate

    res.json({ // aqui podemos mandar de frente el usuario res.json(usuario), para que muestre los datos directamente y no envueltos en otro objeto
        // msg:'Put API - controlador', // podemos quitar este mensaje
        // id
        usuario, // mostramos el usuario actualizado
    })
}

const usuariosDelete = async(req, res = response) => {

    const { id } = req.params; // recuperamos el id de los parámetros del enlace

    // const uid = req.uid; // extraemos al uid
    const usuarioAutenticado = req.usuario
    // borramos la data fisicamente
    // const usuario = await Usuario.findByIdAndDelete( id ); // pasamos el id 

    // Borramos logicamente la data
    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false } ); // pasamos el id y los datos que vamos a cambiar

    
    res.json({usuario, usuarioAutenticado}); // retornamos el usuario que acaba de ser borrado, tambien el uid del usuario
    // res.json({
    //     msg:'Delete API - controlador'
    // })
}
// exportamos un objeto para poder exportar varias funciones a la vez
module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete
}
