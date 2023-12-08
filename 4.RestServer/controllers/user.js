
const { response } = require('express'); // añadimos response de express para que cuando escribamos res. VSC nos muestre los metodos de res, porque actualmente no sabe que es una variable de ese tipo
// anque en si hacer el res = response es redundante, pero lo hacemos para VSC lo detecte como tal
const usuariosGet = (req, res = response) => {
    
    // const query = req.query;// la petición en este caso es con quey params
    const {q, nombre='No name', apikey, list=1} = req.query;
    
    res.json({
        msg:'get API - controlador',
        q,
        nombre, 
        apikey,
        list
    })
}

const usuariosPost = (req, res = response) => {
    // req es la petición de los ususrios, res es la respuesta 
    const body = req.body;// recibe los datos del body (el middleware this.app.use(express.json()) ya lo serializa en formato json)
    // el body recibe la info, esta debe ser limpiada de script o inyecciones de cualquier tipo

    res.json({
        msg:'post API - controlador',
        body
    })
}
const usuariosPut = (req, res = response) => {
    // los parametros de segmento vienen en la petición o request
    const id = req.params.id; // esta en el params de la request
    // incluso tambien podriamos destructurar
    res.json({
        msg:'Put API - controlador',
        id
    })
}

const usuariosDelete = (req, res = response) => {
    res.json({
        msg:'Delete API - controlador'
    })
}
// exportamos un objeto para poder exportar varias funciones a la vez
module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete
}
