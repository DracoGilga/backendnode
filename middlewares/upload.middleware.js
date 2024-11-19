const multer = require("multer")
var size = 1000 * 100 //1000 * 100  = 100 KB

//filtro para recibir unicamente imagenes con extensión jpg
const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/jpeg") && file.originalname.endsWith(".jpg")) {
        cb(null, true)
    } else {
        cb("Solo se permiten imágenes con extensión JPG", false)
    }
}
//se configura el almacenamiento para los archivos subditos
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/")
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})
//se crea el objeto para subir archivos
var uploadFile = multer({ storage: storage, fileFilter: imageFilter, limits: { fileSize: size } })
module.exports = uploadFile