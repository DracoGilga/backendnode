const { categoria } = require('../models')
const { body, param, validationResult } = require('express-validator')

let self = {}

self.categoriaValidator = [
    body('nombre', 'El campo {0} es obligatorio').not().isEmpty().isLength({ max: 255 })
]

self.categoriaIdValidator = [
    param('id', 'Es obligatorio ID').not().isEmpty().isInt()
]

self.getAll = async function (req, res, next) {
    try {
        let data = await categoria.findAll({ attributes: [['id', 'categoriaId'], 'nombre', 'protegida'] })
        res.status(200).json(data)
    } catch (error) {
        next(error)
    }
}

self.get = async function (req, res, next) {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) throw new Error(JSON.stringify(errors));

        let id = req.params.id
        let data = await categoria.findByPk(id, { attributes: [['id', 'categoriaId'], 'nombre', 'protegida'] })
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
        if (!errors.isEmpty()) throw new Error(JSON.stringify(errors));

        let data = await categoria.create({
            nombre: req.body.nombre
        })
        req.bitacora("categoria.crear", data.id)
        res.status(201).json(data)
    } catch (error) {
        next(error)
    }
}

self.update = async function (req, res, next) {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) throw new Error(JSON.stringify(errors));

        let id = req.params.id
        let body = req.body
        let data = await categoria.update(body, { where: { id: id } })
        if (data[0] === 0)
            return res.status(404).send()

        req.bitacora("categoria.editar", id)
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
        let data = await categoria.findByPk(id)
        if (!data)
            return res.status(404).send()

        if (data.protegida)
            return res.status(400).send()

        data = await categoria.destroy({ where: { id: id } })
        if (data === 1) {
            req.bitacora("categoria.eliminar", id)
            return res.status(204).send()
        }
        res.status(404).send()
    } catch (error) {
        next(error)
    }
}

module.exports = self