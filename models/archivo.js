'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class archivo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      archivo.hasMany(models.producto, {foreignKey: 'id'})
    }
  }
  archivo.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    mime: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    size:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    indb:{
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    datos: {
      type: DataTypes.BLOB('long'),
      allowNull: true
    }
  }, {
    sequelize,
    freezeTableName: true,
    modelName: 'archivo',
  });
  return archivo;
};