var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  firstName : String,
  lastName  : String,
  username  : String,
  password  : String
});

exports = module.exports = mongoose.model('User', UserSchema);
