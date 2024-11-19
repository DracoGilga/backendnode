const { producto, categoria, Sequelize, archivo } = require('../models')
const { body, param, validationResult } = require('express-validator')
const Op = Sequelize.Op

let self = {}

self.productoGetValidator = [
    param('id', 'Es obligatorio un ID numérico').not().isEmpty().isInt()
]

self.productoValidator = [
    body('titulo', `El campo titulo es obligatorio`).not().isEmpty().isLength({ max: 255 }),
    body('descripcion', 'El campo descripcion es obligatorio').not().isEmpty().isLength({ max: 65535 }),
    body('precio', 'El campo precio es obligatorio').not().isEmpty().isDecimal({ force_decimal: false }),
    body('archivoId')
        .optional()
        .isInt().withMessage("El campo archivoId no es válido")
]

self.productoPutValidator = [
    param('id', 'Es obligatorio un ID numérico').not().isEmpty().isInt(),
    body('titulo', `El campo titulo es obligatorio`).not().isEmpty().isLength({ max: 255 }),
    body('descripcion', 'El campo descripcion es obligatorio').not().isEmpty().isLength({ max: 65535 }),
    body('precio', 'El campo precio es obligatorio').not().isEmpty().isDecimal({ force_decimal: false }),
    body('archivoId')
        .optional()
        .isInt().withMessage("El campo archivoId no es válido")
]

self.productoCategoriaPostValidator = [
    param('id', 'Es obligatorio un ID numérico').not().isEmpty().isInt(),
    body('categoriaid', `El campo categoriaid es obligatorio`).not().isEmpty().isInt()
]

self.productoCategoriaDeleteValidator = [
    param('id', 'Es obligatorio un ID numérico').not().isEmpty().isInt(),
    param('categoriaid', `El campo categoriaid es obligatorio`).not().isEmpty().isInt()
]

self.getAll = async function (req, res, next) {
    try {
        const { s } = req.query

        const filters = {}
        if (s) {
            filters.titulo = {
                [Op.like]: `%${s}`
            }
        }

        let data = await producto.findAll({
            where: filters,
            attributes: [['id', 'productoId'], 'titulo', 'descripcion', 'precio', 'archivoid'],
            include: {
                model: categoria,
                as: 'categorias',
                attributes: [['id', 'categoriaId'], 'nombre', 'protegida'],
                through: { attributes: [] }
            },
            subQuery: false
        })

        return res.status(200).json(data)

    } catch (error) {
        next(error)
    }
}

self.get = async function (req, res, next) {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) throw new Error(JSON.stringify(errors))

        let id = req.params.id
        let data = await producto.findByPk(id, {
            attributes: [['id', 'productoId'], 'titulo', 'descripcion', 'precio', 'archivoid'],
            include: {
                model: categoria,
                as: 'categorias',
                attributes: [['id', 'categoriaId'], 'nombre', 'protegida'],
                through: { attributes: [] }
            }
        })

        if (data)
            res.status(200).json(data)
        else
            res.status(404).send()

    } catch (error) {
        next(error)
    }
}

self.create = async function (req, res, next) {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) throw new Error(JSON.stringify(errors))

        const archivoid = req.body.archivoId
        if (archivoid) {
            let archivodata = await archivo.findByPk(archivoid)
            if (!archivodata)
                return res.status(404).send()
        }

        let data = await producto.create({
            titulo: req.body.titulo,
            descripcion: req.body.descripcion,
            precio: req.body.precio,
            archivoid: archivoid
        })

        req.bitacora("producto.crear", data.id)
        res.status(201).json(data)

    } catch (error) {
        next(error)
    }
}

self.update = async function (req, res, next) {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) throw new Error(JSON.stringify(errors))

        const archivoid = req.body.archivoId
        if (archivoid != null) {
            let archivodata = await archivo.findByPk(archivoid)
            console.log(archivodata)
            if (!archivodata)
                return res.status(404).send()
        }

        let id = req.params.id
        let data = await producto.update(
            {
                titulo: req.body.titulo, descripcion: req.body.descripcion,
                precio: req.body.precio, archivoid: archivoid
            },
            { where: { id: id } })

        if (data[0] === 0)
            return res.status(404).send()

        req.bitacora("producto.editar", id)
        res.status(204).send()

    } catch (error) {
        next(error)
    }
}

self.delete = async function (req, res, next) {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) throw new Error(JSON.stringify(errors))

        let id = req.params.id
        let data = await producto.findByPk(id)
        if (!data)
            return res.status(404).send()

        data = await producto.destroy({ where: { id: id } })
        if (data === 1) {
            req.bitacora("producto.eliminar", id)
            return res.status(204).send()
        }
        res.status(404).send()
    } catch (error) {
        next(error)
    }
}

self.asignaCategoria = async function (req, res, next) {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) throw new Error(JSON.stringify(errors))

        let itemToAssign = await categoria.findByPk(req.body.categoriaid)
        if (!itemToAssign) return res.status(404).send()

        let item = await producto.findByPk(req.params.id)
        if (!item) return res.status(404).send()

        await item.addCategoria(itemToAssign)

        req.bitacora("productocategoria.agregar", `${req.params.id}:${req.body.categoriaid}`)
        res.status(204).send()

    } catch (error) {
        next(error)
    }
}

self.eliminaCategoria = async function (req, res, next) {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) throw new Error(JSON.stringify(errors))

        let itemToRemove = await categoria.findByPk(req.params.categoriaid)
        if (!itemToRemove) return res.status(404).send()

        let item = await producto.findByPk(req.params.id)
        if (!item) return res.status(404).send()

        await item.removeCategoria(itemToRemove)

        req.bitacora("productocategoria.remover", `${req.params.id}:${req.body.categoriaid}`)
        res.status(204).send()

    } catch (error) {
        next(error)
    }
}

module.exports = self