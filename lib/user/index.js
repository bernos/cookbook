var express = require('express')
  , models  = require("./models")
  , routes  = require("./routes")
  , auth = require('../auth');

module.exports.models = models;

module.exports.createApplication = function(settings) {
  var app = express();

  app.set('views', __dirname + '/views');

  app.get("/", routes.index.get);
  app.get("/create", routes.create.get);
  app.post("/create", routes.create.post);
  app.get("/register", routes.register);
  app.post("/register", routes.register);
  return app;
}

module.exports.syncdb = function(options) {
  models.Role.create({
    name : "admin"
  })
  .success(function(role) {
    models.User.create({
      username: "admin",
      password: auth.createPasswordHash("admin")
    })
    .success(function(user) {
      user.addRole(role);
    });      
  });
}

module.exports.validateUser = function(username, password, done) {
  models.User.find({ 
    where: { 
      username:username 
    } 
  })
  .success(function(user) {
    if (user == null) {
      done(null, false);
    } else {
      if (auth.validatePassword(password, user.password)) {
        done(null, user);
      } else {
        done(null, false);
      }      
    }
  });
}