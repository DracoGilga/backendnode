const router = require('express').Router()
const productos = require('../controllers/productos.controller')
const Authorize = require ('../middlewares/auth.middleware')

router.get('/', Authorize('Usuario,Administrador'), productos.getAll)
router.get('/:id', Authorize('Usuario,Administrador'), productos.productoGetValidator, productos.get)
router.post('/', Authorize('Administrador'), productos.productoValidator, productos.create)
router.put('/:id', Authorize('Administrador'), productos.productoPutValidator, productos.update)
router.delete('/:id', Authorize('Administrador'), productos.productoGetValidator, productos.delete)
router.post('/:id/categoria', Authorize('Administrador'), productos.productoCategoriaPostValidator, productos.asignaCategoria)
router.delete('/:id/categoria/:categoriaid', Authorize('Administrador'), productos.productoCategoriaDeleteValidator, productos.eliminaCategoria)

module.exports = router