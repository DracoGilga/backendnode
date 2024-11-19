const router = require('express').Router()
const roles = require('../controllers/roles.controller')
const Authorize = require ('../middlewares/auth.middleware')

router.get('/', Authorize('Administrador'), roles.getAll)

module.exports = router