const router = require('express').Router()
const bitacora = require('../controllers/bitacora.controller')
const Authorize = require ('../middlewares/auth.middleware')

router.get('/', Authorize('Administrador'), bitacora.getAll)

module.exports = router