module.exports = function(sequelize, DataTypes) {
  return {
    ModelOne: sequelize.define("ModelOne", {
      name: DataTypes.STRING,
      description: DataTypes.TEXT
    })
  }
}