const { usuario, rol, Sequelize } = require('../models')
const bcrypt = require('bcrypt')
const crypto = require('crypto')

let self = {}

self.getAll = async function (req, res, next) {
    try {
        const data = await usuario.findAll({
            raw: true,
            attributes: ['id', 'email', 'nombre', [Sequelize.col('rol.nombre'), 'rol']],
            include: { model: rol, attributes: [] }
        })
        res.status(200).json(data)
    } catch (error) {
        next(error)
    }
}

self.get = async function (req, res, next) {
    try {
        const email = req.params.email
        const data = await usuario.findOne({
            where: { email: email },
            raw: true,
            attributes: ['id', 'email', 'nombre', [Sequelize.col('rol.nombre'), 'rol']],
            include: { model: rol, attributes: [] }
        })
        if (data) {
            return res.status(200).json(data)
        }
        res.status(404).send()
    } catch (error) {
        next(error)
    }
}

self.create = async function (req, res, next) {
    try {
        console.log(req.body)
        const rolusuario = await rol.findOne({ where: { nombre: req.body.rol } })
        const data = await usuario.create({
            id: crypto.randomUUID(),
            email: req.body.email,
            passwordhash: await bcrypt.hash(req.body.password, 10),
            nombre: req.body.nombre,
            rolid: rolusuario.id,
            protegido: 0
        })

        req.bitacora("usuarios.crear", data.email)
        res.status(201).json({
            id: data.id,
            email: data.email,
            nombre: data.nombre,
            rolid: rolusuario.nombre
        })
    } catch (error) {
        next(error)
    }
}

self.update = async function (req, res, next) {
    try {
        const email = req.params.email
        const rolusuario = await rol.findOne({ where: { nombre: req.body.rol } })
        req.body.rolid = rolusuario.id

        const data = await usuario.update(req.body, {
            where: { email: email },
        })
        if (data[0] === 0) {
            return res.status(404).send()
        }

        req.bitacora("usuarios.editar", email)
        res.status(204).send()
    } catch (error) {
        next(error)
    }
}

self.delete = async function (req, res, next) {
    try {
        const email = req.params.email
        const data = await usuario.findOne({ where: { email: email } })
        if (data.protegido) {
            return res.status(403).send()
        }
        data = await usuario.destroy({ where: { email: email } })

        if (data === 1) {
            req.bitacora("usuarios.eliminar", email)
            return res.status(204).send()
        }
        res.status(403).send()
    } catch (error) {
        next(error)
    }
}

module.exports = self