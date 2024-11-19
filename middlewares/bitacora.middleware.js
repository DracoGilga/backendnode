const requestIp = require('request-ip')
const ClaimTypes = require('../config/claimtypes')
const { bitacora } = require('../models')

const bitacoraLogger = (req, res, next) => {
    //obtiene la ip de la petición
    const ip = requestIp.getClientIp(req)
    let email = 'invitado'

    req.bitacora = async (accion, id) => {
        if (req.decodedToken) {
            //se obtiene el mail del usuario actual
            email = req.decodedToken[ClaimTypes.Name]
        }

        //guarda la operacion en la bitacora
        await bitacora.create({
            accion: accion, elementoid: id, ip: ip, usuario: email, fecha: new Date()
        })
    }
    next()
}

module.exports = bitacoraLogger