const router = require('express').Router()
const carrito = require('../controllers/carritos.controller')
const Authorize = require('../middlewares/auth.middleware')

router.get('/', Authorize('Usuario'), carrito.get)
router.get('/:idProducto', Authorize('Usuario'), carrito.carritoIDProductoValidator, carrito.getDetails)
router.post('/', Authorize('Usuario'), carrito.carritoBodyValidator, carrito.createProducto)
router.put('/:idProducto', Authorize('Usuario'), carrito.carritoPutValidator, carrito.updateProducto)
router.delete('/:idProducto', Authorize('Usuario'), carrito.carritoIDProductoValidator, carrito.deleteProducto)

module.exports = routerw