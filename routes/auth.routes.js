const router = require('express').Router()
const auth = require('../controllers/auth.controller')
const Authorize = require ('../middlewares/auth.middleware')

router.post('/', auth.login)
router.get('/tiempo', Authorize('Usuario,Administrador'), auth.tiempo)

module.exports = router