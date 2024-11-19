'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class compraproducto extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      compraproducto.belongsTo(models.compra)
      compraproducto.belongsTo(models.producto)
    }
  }
  compraproducto.init({
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    precio: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    compraid:{
      primaryKey: true,
      type: DataTypes.INTEGER,
      allowNull: true
    },
    productoid:{
      primaryKey: true,
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    freezeTableName: true,
    modelName: 'compraproducto',
  });
  return compraproducto;
};