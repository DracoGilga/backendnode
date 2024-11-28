const jwt = require('jsonwebtoken')
const jwtSecret = process.env.JWT_SECRET
const ClaimTypes = require('../config/claimtypes')
const { GeneraToken } = require('../services/jwttoken.service')

const Authorize = (rol) => {
    return async (req, res, next) => {
        try {
            const authHeader = req.header('Authorization');
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                const error = new Error('acceso denegado');
                error.statusCode = 401;
                return next(error);
            }

            // Obtiene el token de la solicitud
            const token = authHeader.split(' ')[1];
            const decodedToken = jwt.verify(token, jwtSecret);

            // Verifica si el rol del token está permitido
            if (!rol.split(',').includes(decodedToken[ClaimTypes.Role])) {
                const error = new Error('acceso denegado');
                error.statusCode = 401;
                return next(error);
            }

            req.decodedToken = decodedToken;

            const minutosRestantes = (decodedToken.exp - (Date.now() / 1000)) / 60;

            if (minutosRestantes < 5) {
                const nuevoToken = GeneraToken(
                    decodedToken[ClaimTypes.Name],
                    decodedToken[ClaimTypes.GivenName],
                    decodedToken[ClaimTypes.Role]
                );
                res.header("Set-Authorization", nuevoToken);
            }

            // Continua con el flujo
            next();
        } catch (err) {
            const error = new Error('acceso denegado');
            error.statusCode = 401;
            next(error); // Envía el error personalizado al middleware de manejo de errores
        }
    };
};

module.exports = Authorize