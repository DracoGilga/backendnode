const fs = require('fs')
const requestIp = require('request-ip')
const ClaimTypes = require('../config/claimtypes')

const errorHandler = (err, req, res, next) => {
    let mensaje = 'No se ha podido procesar la petición. Inténtelo nuevamente más tarde.'
    const statusCode = err.statusCode || 500
    //optiene la ip de laa peticion 
    const ip = requestIp.getClientIp(req)

    //se obtiene el mail del usuario actual
    let email = "Anónimo"
    if (req.decodedToken) {
        email = req.decodedToken[ClaimTypes.Name];
    }

    //se guarda en un archivo de texto
    fs.appendFile('log/log.txt', new Date() + ` - ${statusCode} - ${ip} - ${email} - ${err.message || mensaje}\n`, err => {
        if (err) {
            console.error(err);
        }
    })

    //se envia el mensaje apropiado al usuario
    if (process.env.NODE_ENV === 'development') {
        mensaje = err.message || mensaje
        res.status(statusCode).json({
            status: statusCode,
            mensaje: mensaje,
            stack: err.stack
        })
    } else {
        res.status(statusCode).send({ mensaje: mensaje })
    }
}

module.exports = errorHandler