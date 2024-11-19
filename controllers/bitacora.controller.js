const { bitacora } = require('../models')

let self = {}

self.getAll = async function (req, res, next) {
    let data = await bitacora.findAll({
        attributes: [['id', 'bitacoraId'], 'accion', 'elementoid', 'ip', 'usuario', 'fecha'],
        order: [['id', 'DESC']]
    })
    res.status(200).json(data)
}

module.exports = self