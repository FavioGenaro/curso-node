const { Router } = require('express');
const { buscar } = require('../controllers/buscar');

const router = Router();

// las peticiones de busqueda son tipo get,
// va a necesitar la colección donde se va a buscar y el término que se busca.
// el controlador es buscar
router.get('/:coleccion/:termino', buscar )


module.exports = router;