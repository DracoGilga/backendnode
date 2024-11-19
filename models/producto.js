'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class producto extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      producto.belongsToMany(models.categoria, { as: 'categorias', through: 'categoriaproducto', foreignKey: 'productoid'})
      producto.belongsTo(models.archivo)
      producto.hasMany(models.carritoproducto, { as: 'carritoproducto', foreignKey: 'productoid'});
      producto.hasMany(models.compraproducto, { as: 'compraproducto', foreignKey: 'productoid'})
    }
  }
  producto.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    titulo: {
      type: DataTypes.STRING,
      defaultValue: "Sin titulo"
    },
    descripcion: {
      type: DataTypes.TEXT,
      defaultValue: "Sin descripcion"
    },
    precio: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    archivoid: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    freezeTableName: true,
    modelName: 'producto',
  });
  return producto;
};