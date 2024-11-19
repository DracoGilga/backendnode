const bcrypt = require('bcrypt')
const { usuario, rol, Sequelize } = require('../models')
const { GeneraToken, TiempoRestanteToken } = require('../services/jwttoken.service')

let self = {}

//post api/auth
self.login = async function (req, res, next) {
    const { email, password } = req.body

    try {
        let data = await usuario.findOne({
            where: { email: email },
            raw: true,
            attributes: ['id', 'email', 'nombre', 'passwordhash', [Sequelize.col('rol.nombre'), 'rol']],
            include: { model: rol, attributes: [] }
        })

        if (data === null)
            return res.status(401).json({ mensaje: 'Usuario o contraseña incorrectos' })

        //se comparan las contraseñas vs el hassh almacenado
        const passwordMash = await bcrypt.compare(password, data.passwordhash)
        if (!passwordMash)
            return res.status(401).json({ mensaje: 'Usuario o contraseña incorrectos' })

        //utilizamos los nombres de claims estandar
        token = GeneraToken(data.email, data.nombre, data.rol)

        //bitacora
        req.bitacora("usuario.login", data.email)
        res.status(200).json({
            email: data.email,
            nombre: data.nombre,
            rol: data.rol,
            jwt: token
        })
    } catch (error) {
        next(error)
    }
}

//get api/auth/tiempo
self.tiempo = async function (req, res) {
    const tiempo = TiempoRestanteToken(req)
    if (tiempo == null) {
        res.status(404).send()
    }
    res.status(200).send()
}

module.exports = self
