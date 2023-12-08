// vamos a crear una variable que almacene las funciones de cada una de las rutas

// const path = require ('path'); //importamos path
// const root = path.join(__dirname,'../public') // ruta donde se ubican los archivos
const connection = require('../connection');// importamos la conexion

const users = [
    {id:1,nombre:'Pablo', edad: 25},
    {id:2,nombre:'Luis', edad: 23},
    {id:3,nombre:'José', edad: 22}
]

// users
const getUsers = (req, res)=>{ // va a ser una ruta del tipo get. cuando se realice una petición se ejecuta la función
    const sql = 'select * from users'// consulta
    connection.query(sql,(err,result) =>{ // ejecutamos la consulta
        // primer parametro es la sentencia y segundo una función callback
        // el callback recibe un parametro para el error y otro para el resultado que entrega en caso sea exitosa
        if(err){
            console.log('Ha ocurrodo un error')
        }else{
            // console.log(result); // en este caso result retorna un arreglo, con los datos
            res.render('users',{users:result}); // colocamos resulta para que muestr los datos de la base de datos
        }

    });
    // res.send('Mostrando todos los usuarios') // la respuesta es mostrar un mensaje
    // res.sendFile('users.html',{ root: root}); // nombre del archivo, ruta del archivo
    // res.render('users',{users:users}); // enviamos información a la plantilla mediante un objeto, que tiene el parametro users y un arreglo de objetos con los datos que deseamos pasar..
}

// create
const getCreateUsers = (req, res)=>{ 

    // res.send('Crear usuario')
    // res.sendFile('create-user.html',{ root: root}); // nombre del archivo, ruta del archivo
    res.render('create-user'); // nombre del archivo, ruta del archivo
}
// update
const getUpdateUsers = (req, res)=>{ 
    const param = req.params.id; // alamacenamos el parametro id
    console.log(param)

    const sql = 'select * from users where id=?'
    connection.query(sql,param,(err,result)=>{ // realizamos la consulta
        if(err){
            console.log('Ha ocurrido un error')
        }else{
            console.log(result) // devuelve el dato encontrado, devulve [] si no lo encuentra
            res.render('update-user', {user:result}); // nombre del archivo, ruta del archivo
        }
    })

    // res.send('Modificar usuario')
    // res.sendFile('update-user.html',{ root: root}); // nombre del archivo, ruta del archivo
    

}
// delete
const getDeleteUsers = (req, res)=>{ 
    // res.send('Eliminar usuario') 
    // res.sendFile('delete-user.html',{ root: root}); // nombre del archivo, ruta del archivo
    // res.render('delete-user'); // nombre del archivo, ruta del archivo
    const param = req.params.id; // alamacenamos el parametro id
    console.log(param)

    const sql = 'select * from users where id=?'
    connection.query(sql,param,(err,result)=>{ // realizamos la consulta
        if(err){
            console.log('Ha ocurrido un error')
        }else{
            console.log(result) // devuelve el dato encontrado, devulve [] si no lo encuentra
            res.render('delete-user', {user:result}); // nombre del archivo, ruta del archivo, pasamos los datos del usuario
        }
    })
}

// vamos a crear estas variables para pasar datos
// Aqui comprobamos el pase de los datos
const createUsers = (req,res) =>{
    const sql = 'insert into users SET ?' // con ? podemos pasar un parametro de tipo objeto
    const data = req.body;// arreglo de datos
    connection.query(sql, data,(err, result)=>{
        if(err){
            console.log('Ha ocurrido un error')
        }else{
            console.log('usuario registrado'); // en este caso result retorna un arreglo, con los datos
            res.redirect('/users/all'); // en vez de render, podemos colocar en redirec la url a la que queremos redirigir
        }
    })

    // console.log(req.body) // con esto podemos acceder a los datos enviados desde un formulario
    // almacenamos los datos de body en la variable users
    // users.push(req.body); 
    // nuevamente renderizamos, con los datos de users actualizados con el nuevo dato
    // res.render('users',{users:users});// la repuesta es el renderizado
}
const updateUsers = (req,res) =>{
    // desde la url vamos a recibir el id como parametro, para obtenerlo
    // const param = req.params.id;
    // // el for recorre la variable users y actualiza el objeto con ese id
    // for(let i = 0; i< users.length; i++){
    //     if(param == users[i].id){
    //         // actualizamos el nombre y la edad
    //         users[i].nombre = req.body.nombre;
    //         users[i].edad = req.body.edad;
    //         break;
    //     }
    // }
    // res.render('users',{users:users}); // mostramos nuevamente con los datos actualizados

    const param = req.params.id;
    const sql = `update users SET name='${req.body.name}', age=${req.body.age} where id=${param}`
    connection.query(sql,(err,result) =>{
        if(err){
            console.log('Ha ocurrido un error')
        }else{
            console.log('Usuario actualizado')
            res.redirect('/users/all') 
        }
    })

}
const deleteUsers = (req,res) =>{
    // desde la url vamos a recibir el id como parametro, para obtenerlo
    // const param = req.params.id;
    // // el for recorre la variable users y actualiza el objeto con ese id
    // for(let i = 0; i< users.length; i++){
    //     if(param == users[i].id){
    //         // eliminamos
    //         users.splice(i,1) // elimina el dato en el que esta, el i, y solo 1
    //         break;
    //     }
    // }
    // res.render('users',{users:users}); // mostramos nuevamente con los datos actualizados
    const param = req.params.id;
    const sql = `delete from users where id=${param}`
    connection.query(sql,(err,result) =>{
        if(err){
            console.log('Ha ocurrido un error')
        }else{
            console.log('Usuario eliminado')
            res.redirect('/users/all') 
        }
    })

}

// exportamos las funciones
module.exports = {
    getUsers,
    getCreateUsers,
    getUpdateUsers,
    getDeleteUsers,
    createUsers,
    updateUsers,
    deleteUsers
}

