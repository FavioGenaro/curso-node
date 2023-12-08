
const { Categoria,Usuario, Producto } = require('../models');
const Role = require('../models/role'); // modelo de rol
// const Usuario = require('../models/usuarios');

const esRoleValido = async(rol = '') => { // validamos el rol, custom para hacer una verificación personalizada, recibe el valor del body que es rol y es vacio por fecto =''
    const existeRol = await Role.findOne({ rol }); // buscamos un registro que tenga el mismo valor que el rol que me pasan por el body, verifica en la base de datos
    if ( !existeRol ) { // si el rol no exite
        throw new Error(`El rol ${ rol } no está registrado en la BD`); // rol no esta en la BD, aparece en formato json
    }
}

const emailExiste = async( correo = '' ) => {

    // Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo })// es {correo: correo}, pero en javascript esto es redundante
    if ( existeEmail ) { // si es true o existe, entonces no podemos registrarlo.
        throw new Error(`El correo: ${ correo }, ya está registrado`); // el mensaje aparece en formato json
    }
}

const existeUsuarioPorId = async( id ) => { // el id ya viene en formato de id de mongo

    // Verificar si el correo existe
    const existeUsuario = await Usuario.findById(id); // buscamos el id, retorna true o false
    if ( !existeUsuario ) { // si no existe, tira el error
        throw new Error(`El id no existe ${ id }`);
    }
}


/**
 * Categorias
 */
const existeCategoriaPorId = async( id ) => {

    // Verificar si el correo existe
    const existeCategoria = await Categoria.findById(id);
    if ( !existeCategoria ) {
        throw new Error(`El id no existe ${ id }`);
    }
}

/**
 * Productos
 */
const existeProductoPorId = async( id ) => {

    // Verificar si el correo existe
    const existeProducto = await Producto.findById(id);
    
    if ( !existeProducto ) {
        throw new Error(`El id no existe ${ id }`);
    }
}

/**
 * Validar colecciones permitidas
 */
// va a recibir la colección de argumento en el enlace y colecciones que es la lista de colección
const coleccionesPermitidas = ( coleccion = '', colecciones = []) => {

    const incluida = colecciones.includes( coleccion ); // verificamos si esta incluido en la lista o arregle
    if ( !incluida ) { // si no esta incluida retorna un error
        throw new Error(`La colección ${ coleccion } no es permitida, ${ colecciones }`);
    }
    return true; // retorna un true
}


module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas
}