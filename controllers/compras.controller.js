const { compraproducto, compra, usuario, Sequelize, rol, producto } = require('../models');
const { body, param, validationResult } = require('express-validator');
const Op = Sequelize.Op; 
const ClaimTypes = require('../config/claimtypes');
const db = require('../models/index');
const sequelize = db.sequelize;

let self = {};

self.compraIDValidator = [
    param('idCompra', 'Es obligatorio un ID numérico').not().isEmpty().isInt()
];

self.compraValidator = [
    body('productos')
        .custom((value, { req }) => {
            if (!Array.isArray(req.body.productos) || req.body.productos.length === 0) {
                throw new Error('Debe contener al menos un producto');
            }
            req.body.productos.forEach((producto, index) => {
                if (!producto.productoid || !producto.cantidad) {
                    throw new Error(`Debe tener producto y cantidad validos`);
                }
                if (!Number.isInteger(producto.productoid) || producto.productoid < 1) {
                    throw new Error(`Debe tener un idproducto un número entero mayor o igual a 1`);
                }
                if (!Number.isInteger(producto.cantidad) || producto.cantidad < 1) {
                    throw new Error(`Debe tener una cantidad número entero mayor o igual a 1`);
                }
            });
            return true;
        })
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

self.create = async function (req, res, next) {
    let transaccion;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) throw new Error(JSON.stringify(errors));
        let decodedToken = req.decodedToken;
        if (decodedToken == null || decodedToken[ClaimTypes.Name] == null) {
            throw new Error();
        }
        const usuarioRecuperado = await usuario.findOne({
            where: { email: decodedToken[ClaimTypes.Name] },
            raw: true,
            attributes: ['id', 'email']
        });
        if (usuarioRecuperado == null) {
            res.status(404).send();
        }
        transaccion = await sequelize.transaction();
        for (let productos of req.body.productos) {
            let productoRecuperado = await producto.findOne({
                where: { id: productos.productoid },
                raw: true,
                attributes: ['id', 'precio', 'cantidadDisponible']
            });
            let nuevaCantidadDisponible = productoRecuperado.cantidadDisponible - productos.cantidad;
            if (nuevaCantidadDisponible >= 0) {
                let actualizarProducto = await producto.update(
                    { cantidadDisponible: nuevaCantidadDisponible },
                    { where: { id: productos.productoid } },
                    { transaction: transaccion }
                );
                if (actualizarProducto == null) {
                    throw new Error();
                }
            } else {
                return res.status(409).send("Sin stock");
            }
        }

        let compraCreada = await compra.create({
            fechapedido: new Date(),
            usuarioid: usuarioRecuperado.id
        }, { transaction: transaccion });
        if (compraCreada == null) {
            await transaccion.rollback();
            throw new Error();
        }
        for (let productos of req.body.productos) {
            if (isNaN(productos.productoid) || productos.productoid == null) {
                throw new Error();
            }
            let productoRecuperado = await producto.findOne({
                where: { id: productos.productoid },
                raw: true,
                attributes: ['id', 'precio', 'cantidadDisponible']
            });
            let compraproductoCreado = await compraproducto.create({
                productoid: productoRecuperado.id,
                compraid: compraCreada.id,
                cantidad: productos.cantidad,
                precio: productoRecuperado.precio,
            }, { transaction: transaccion });
            if (compraproductoCreado == null) {
                throw new Error();
            }
        }
        await transaccion.commit();
        return res.status(201).json("Funciono");
    } catch (error) {
        if (transaccion && !transaccion.finished) {
            await transaccion.rollback();
        }
        next(error);
    }
};

module.exports = self;