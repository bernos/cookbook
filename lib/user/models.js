var db = require('../db');

exports.User = db.sequelize.define('User', {
  username: db.DataTypes.STRING,
  firstName: db.DataTypes.STRING,
  lastName: db.DataTypes.STRING,
  password: db.DataTypes.STRING
});

exports.Role = db.sequelize.define('Role', {
  name: db.DataTypes.STRING
});

exports.User.hasMany(exports.Role);
exports.Role.hasMany(exports.User);