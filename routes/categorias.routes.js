const router = require('express').Router()
const categorias = require('../controllers/categorias.controller')
const Authorize = require ('../middlewares/auth.middleware')

router.get('/', Authorize('Usuario,Administrador'), categorias.getAll)
router.get('/:id', Authorize('Usuario,Administrador'), categorias.categoriaIdValidator, categorias.get)
router.post('/', Authorize('Administrador'), categorias.categoriaValidator, categorias.create)
router.put('/:id', Authorize('Administrador'), categorias.categoriaValidator, categorias.update)
router.delete('/:id', Authorize('Administrador'), categorias.categoriaIdValidator, categorias.delete)

module.exports = router