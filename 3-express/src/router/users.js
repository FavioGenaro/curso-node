// Desde aqui manejamos la ruta de usuarios

const express = require('express'); // importamos el modulo express
const router = express.Router(); // creamos una variable que almacena la función router, este es el reemplazo de app

const userController = require('../controllers/users') // importamos el archivo con las funciones

// ruta 1
// router.get('/users',(req, res)=>{ // va a ser una ruta del tipo get. cuando se realice una petición se ejecuta la función
//     res.send('Mostrando todos los usuarios') // la respuesta es mostrar un mensaje
// })
router.get('/all',userController.getUsers) // muestra todos los usuarios


// segunda ruta
// router.get('/create',(req, res)=>{ 
//     res.send('Crear usuario') 
// })
// router.get('/create', userController.createUsers)
router.get('/create', userController.getCreateUsers)


// tercera ruta
// router.get('/update',(req, res)=>{ 
//     res.send('Modificar usuario') 
// })
// router.get('/update', userController.updateUsers)
router.get('/update/:id', userController.getUpdateUsers)

// cuarta ruta
// router.get('/delete',(req, res)=>{ 
//     res.send('Eliminar usuario') 
// })
// router.get('/delete', userController.deleteUsers)
router.get('/delete/:id', userController.getDeleteUsers)

//hacemos uso de los otros metodos, post, put y delete 
router.post('/create',userController.createUsers)
// router.put('/update',userController.updateUsers)

// para modificar y eliminar añadimos un parametro en la url, que es el id para ubicar al dato
router.post('/update/:id',userController.updateUsers)// cuando se accede a esa ruta, se ejecuta la función
router.post('/delete/:id',userController.deleteUsers)// ejecuta deleteUsers


// exportamos
module.exports = router;
