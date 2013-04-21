var mongoose = require('mongoose')
  , Sequelize = require("sequelize")
  , settings = require("../../settings");

exports.sequelize = new Sequelize(settings.db.database, settings.db.username, settings.db.password, settings.db.options);
exports.DataTypes = Sequelize;




//mongoose.connect('mongodb://localhost/recipes');

/*
var sequelize = new Sequelize('recipes', 'root'); 


var Project = sequelize.define('Project', {
  title: Sequelize.STRING,
  description: Sequelize.TEXT
});

var Task = sequelize.define('Task', {
  title: Sequelize.STRING,
  descriptions: Sequelize.TEXT,
  deadline: Sequelize.DATE
});

exports = module.exports = function(settings) {
  exports.DataTypes = Sequelize;
  exports.sequelize = new Sequelize(settings.database, settings.username, settings.password, settings.options);
};
*/