var db = require('../db');

exports.User = db.sequelize.define('UserTron', {
  username: db.DataTypes.STRING,
  firstName: db.DataTypes.STRING,
  lastName: db.DataTypes.STRING,
  password: db.DataTypes.STRING
});