var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/recipes');

var Sequelize = require("sequelize");

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
*/
exports = module.exports = function(settings) {
  exports.DataTypes = Sequelize;
  exports.sequelize = new Sequelize(settings.database, settings.username, settings.password, settings.options);
};
