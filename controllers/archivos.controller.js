const { body, param, validationResult } = require('express-validator')
const { archivo } = require('../models')
const fs = require('fs')

let self = {}

self.validarArchivoID = [
    param('id', 'Es obligatorio ID').not().isEmpty().isInt()
]

self.validarDatosArchivo = [
    body('file', 'El archivo es obligatorio')
        .custom((value, { req }) => {
            if (!req.file) {
                throw new Error('El archivo es obligatorio');
            }
            if (req.file.size === 0) {
                throw new Error('El archivo no debe estar vacío');
            }
            if (req.file.originalname.length > 186) {
                throw new Error('El nombre del archivo es inválido');
            }
            return true;
        })
]

self.validarDatosIDArchivo = [
    param('id', 'Es obligatorio ID').not().isEmpty().isInt(),
    body('file', 'El archivo es obligatorio')
        .custom((value, { req }) => {
            if (!req.file) {
                throw new Error('El archivo es obligatorio');
            }
            if (req.file.size === 0) {
                throw new Error('El archivo no debe estar vacío');
            }
            if (req.file.originalname.length > 186) {
                throw new Error('El nombre del archivo es inválido');
            }
            return true;
        })
]

self.getAll = async function (req, res, next) {
    try {
        let data = await archivo.findAll({ attributes: [['id', 'archivoId'], 'mime', 'indb', 'nombre', 'size'] })
        res.status(200).json(data)
    } catch (error) {
        next(error)
    }
}

self.getDetalle = async function (req, res, next) {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) throw new Error(JSON.stringify(errors));

        let id = req.params.id
        let data = await archivo.findByPk(id, { attributes: [['id', 'archivoId'], 'mime', 'indb', 'nombre', 'size'] })
        if (data)
            res.status(200).json(data)
        else
            res.status(404).send()
    } catch (error) {
        next(error)
    }
}

self.get = async function (req, res, next) {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) throw new Error(JSON.stringify(errors));

        let id = req.params.id
        let data = await archivo.findByPk(id)
        if (!data)
            return res.status(404).send()

        let imagen = data.datos
        if (!data.indb) {
            imagen = fs.readFileSync("uploads/" + data.nombre)
        }

        res.status(200).contentType(data.mime).send(imagen)
    } catch (error) {
        next(error)
    }
}

self.create = async function (req, res, next) {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) throw new Error(JSON.stringify(errors));

        console.log(req.file)
        if (req.file == undefined) return res.status(400).json('El archivo es obligatorio');

        let binario = null;
        let indb = false;

        if (process.env.FILES_IN_BD == "true") {
            binario = fs.readFileSync("uploads/" + req.file.filename)
            fs.existsSync("uploads/" + req.file.filename) && fs.unlinkSync("uploads/" + req.file.filename)
            indb = true
        }

        let data = await archivo.create({
            mime: req.file.mimetype,
            indb: indb,
            nombre: req.file.filename,
            size: req.file.size,
            datos: binario
        })
        req.bitacora("archivos.crear", data.id)
        res.status(201).json({
            id: data.id,
            mime: req.file.mimetype,
            indb: indb,
            nombre: req.file.filename
        })

    } catch (error) {
        next(error)
    }
}

self.update = async function (req, res, next) {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) throw new Error(JSON.stringify(errors));

        if (req.file == undefined) return res.status(400).json('El archivo es obligatorio');

        let id = req.params.id
        let image = await archivo.findByPk(id)
        if (!image) {
            fs.existsSync("uploads/" + req.file.filename) && fs.unlinkSync("uploads/" + req.file.filename)
            return res.status(404).send()
        }

        let binario = null;
        let indb = false;
        if (process.env.FILES_IN_DB == "true") {
            binario = fs.readFileSync("uploads/" + req.file.filename)
            fs.existsSync("uploads/" + req.file.filename) && fs.unlinkSync("uploads/" + req.file.filename)
            indb = true
        }

        let data = await archivo.update({
            mime: req.file.mimetype,
            indb: indb,
            nombre: req.file.filename,
            size: req.file.size,
            datos: binario
        }, { where: { id: id } })
        req.bitacora("archivos.editar", data.id)

        if (data[0] === 0)
            return res.status(404).send()

        if (!image.indb)
            fs.existsSync("uploads/" + image.nombre) && fs.unlinkSync("uploads/" + image.nombre)

        res.status(204).send()

    } catch (error) {
        next(error)
    }
}

self.delete = async function (req, res, next) {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) throw new Error(JSON.stringify(errors));

        const id = req.params.id
        let imagen = await archivo.findByPk(id)
        if (!imagen) {
            return res.status(404).send()
        }

        let data = await archivo.destroy({ where: { id: id } })
        if (data === 1) {
            req.bitacora("archivos.eliminar", id)
            if (!imagen.indb) {
                fs.existsSync("uploads/" + imagen.nombre) && fs.unlinkSync("uploads/" + imagen.nombre)
            }

            res.status(204).send()
        }

        res.status(404).send()

    } catch (error) {
        next(error)
    }
}

module.exports = self