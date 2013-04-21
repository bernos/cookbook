var sequelize = require('../../mysql');
//  , models = sequelize.import(__dirname + '/models');
var models = require('./models');

models(sequelize.sequelize, sequelize.DataTypes);
console.log(sequelize)