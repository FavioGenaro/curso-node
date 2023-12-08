const { Router } = require('express');
const { check } = require('express-validator');
const { crearCategoria, obtenerCategoria, obtenerCategorias, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators');

const {validarCampos, validarJWT, esAdminRole} = require('../middlewares');

// const { crearCategoria,
//         obtenerCategorias,
//         obtenerCategoria,
//         actualizarCategoria, 
//         borrarCategoria } = require('../controllers/categorias');
// const { existeCategoriaPorId } = require('../helpers/db-validators');

const router = Router();

/**
 * {{url}}/api/categorias // esta es la url base
 */

//  Obtener todas las categorias - publico (todos pueden realizarlo)
router.get('/', obtenerCategorias);

// Obtener una categoria por id - publico (todos pueden realizarlo)
router.get('/:id',[
    check('id', 'No es un ID válido').isMongoId(), // verifica si es un id que tiene el formato de mongo
    check('id').custom( existeCategoriaPorId ), // verifica si el id existe en la base de datos
    validarCampos // muestra los errors si no se cumple algun middleware
], obtenerCategoria);

// Crear categoria - privado - cualquier persona con un token válido
router.post('/', [
    validarJWT, // validamos el token
    check('nombre','El nombre es obligatorio').not().isEmpty(), // el nombre es obligatorio, como lo definimos en el modelo
    validarCampos // muestra los errors si no se cumple algun middleware
], crearCategoria);

// Actualizar - privado - cualquiera con token válido
router.put('/:id', [
    validarJWT, // validamos el token
    check('id', 'No es un ID válido').isMongoId(), // verifica si es un id que tiene el formato de mongo
    check('id').custom( existeCategoriaPorId ), // verifica si el id existe en la base de datos
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos // muestra los errors si no se cumple algun middleware
], actualizarCategoria);

// Borrar una categoria - Admin
// aqui cambiamos el estado de true a false
router.delete('/:id', [
    validarJWT, // validamos el token
    esAdminRole, // middleware para verificar su rol de admin
    check('id', 'No es un ID válido').isMongoId(), // verifica si es un id que tiene el formato de mongo
    check('id').custom( existeCategoriaPorId ), // verifica si el id existe en la base de datos
    validarCampos // muestra los errors si no se cumple algun middleware
],borrarCategoria);



module.exports = router;