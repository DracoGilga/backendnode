const router = require('express').Router()
const archivos = require('../controllers/archivos.controller')
const Authorize = require('../middlewares/auth.middleware')
const upload = require('../middlewares/upload.middleware')

router.get('/', Authorize('Administrador'), archivos.getAll)
router.get('/:id', archivos.validarArchivoID, archivos.get)
router.get('/:id/detalle', Authorize('Administrador'), archivos.validarArchivoID, archivos.getDetalle)
router.post('/', upload.single('file'), Authorize('Administrador'), archivos.validarDatosArchivo, archivos.create)
router.put('/:id', upload.single("file"), Authorize('Administrador'), archivos.validarDatosIDArchivo, archivos.update)
router.delete("/:id", Authorize('Administrador'), archivos.validarArchivoID, archivos.delete)

module.exports = router