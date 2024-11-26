const { compraproducto, compra, usuario, Sequelize, rol, producto } = require('../models');
const { body, param, validationResult } = require('express-validator');
const Op = Sequelize.Op;

let self = {};

self.compraIDValidator = [
    param('idCompra', 'Es obligatorio un ID numérico').not().isEmpty().isInt()
];

self.get = async function (req, res, next) {
    try {
        let data = await compra.findAll({
            attributes: [['id', 'compraId']],
            include: [
                {
                    model: usuario,
                    as: 'usuario',
                    raw: true,
                    attributes: ['id', 'email', 'nombre'],
                    include: {
                        model: rol,
                        as: 'rol',
                        attributes: ['nombre']
                    }
                },
                {
                    model: compraproducto,
                    as: 'compraproducto',
                    attributes: ['cantidad', 'precio']
                }
            ]
        });

        if (data && data.length) {
            data.forEach(item => {
                if (item.dataValues != null && item.dataValues.compraproducto != null) {
                    item.dataValues.totalProductos = 0;
                    item.dataValues.totalCosto = 0;

                    let compraproductositem = item.dataValues.compraproducto;
                    compraproductositem.forEach(element => {
                        if (element != null && element.cantidad != null && element.precio != null) {
                            let cantidadelement = parseInt(element.cantidad);
                            let precioelement = parseFloat(element.precio);
                            if (!isNaN(cantidadelement) && !isNaN(precioelement))
                                item.dataValues.totalProductos += cantidadelement;
                            item.dataValues.totalCosto += (cantidadelement * precioelement);
                        }
                    });
                }

                if (
                    item.dataValues != null &&
                    item.dataValues.usuario != null &&
                    item.dataValues.usuario.dataValues.rol != null &&
                    item.dataValues.usuario.dataValues.rol.dataValues != null
                )
                    item.dataValues.usuario.dataValues.rol = item.dataValues.usuario.dataValues.rol.dataValues.nombre;
            });

            res.status(200).json(data);
        } else
            res.status(404).send();
    } catch (error) {
        next(error);
    }
};

self.getDetails = async function (req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) throw new Error(JSON.stringify(errors));

        let idCompra = req.params.idCompra;

        let data = await compra.findOne({
            where: { id: idCompra },
            attributes: [['id', 'compraId']],
            include: [
                {
                    model: usuario,
                    as: 'usuario',
                    raw: true,
                    attributes: ['id', 'email', 'nombre'],
                    include: {
                        model: rol,
                        as: 'rol',
                        attributes: ['nombre']
                    }
                },
                {
                    model: compraproducto,
                    as: 'compraproducto',
                    attributes: ['productoid', 'cantidad', 'precio']
                }
            ]
        });

        if (data && data.dataValues != null) {
            data.dataValues.totalProductos = 0;
            data.dataValues.totalCosto = 0;

            if (
                data.dataValues.usuario != null &&
                data.dataValues.usuario.dataValues.rol != null &&
                data.dataValues.usuario.dataValues.rol.dataValues != null
            )
                data.dataValues.usuario.dataValues.rol = data.dataValues.usuario.dataValues.rol.dataValues.nombre;

            for (let i = 0; i < data.dataValues.compraproducto.length; i++) {
                let item = data.dataValues.compraproducto[i];

                if (item != null && item.dataValues.cantidad != null && item.dataValues.precio != null) {
                    let cantidadelement = parseInt(item.dataValues.cantidad);
                    let precioelement = parseFloat(item.dataValues.precio);
                    if (!isNaN(cantidadelement) && !isNaN(precioelement)) {
                        data.dataValues.totalProductos += cantidadelement;
                        data.dataValues.totalCosto += (cantidadelement * precioelement);
                    }
                }

                let productoitem = await obtenerproducto(item);
                if (productoitem != null)
                    data.dataValues.compraproducto[i].dataValues.producto = productoitem;
            }
            res.status(200).json(data);
        } else {
            res.status(404).send();
        }
    } catch (error) {
        next(error);
    }
};

async function obtenerproducto(item) {
    if (item.productoid != null) {
        let productoItem = await producto.findOne({
            attributes: ['titulo', 'descripcion'],
            where: { id: item.productoid }
        });
        return productoItem;
    }
}

module.exports = self;