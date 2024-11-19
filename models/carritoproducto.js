'use strict';
const {
  Model
} = require('sequelize');
const carrito = require('./carrito');
module.exports = (sequelize, DataTypes) => {
  class carritoproducto extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      carritoproducto.belongsTo(models.carrito)
      carritoproducto.belongsTo(models.producto)
    }
  }
  carritoproducto.init({
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    carritoid:{
      primaryKey: true,
      type: DataTypes.INTEGER,
      allowNull: true
    },
    productoid:{
      primaryKey: true,
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, 
  {
    sequelize,
    freezeTableName: true,
    modelName: 'carritoproducto',
  });
  return carritoproducto;
};