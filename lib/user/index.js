var express = require('express')
  , models = require("./models");

module.exports.models = models;

module.exports.createApplication = function(settings) {
  var app = express();

  app.set('views', __dirname + '/views');

  app.get("/", function(req, res, next) {
    models.User.findAll().success(function(users) {
      return res.render("index", { 
        title:"users",
        users:users 
      });
    });    
  });

  app.get("/create", function(req, res, next) {
    res.render("create", {
      title:"create user"
    });
  });

  app.post("/create", function(req, res, next) {
    models.User.create(req.body).success(function(user) {
      res.redirect("/");
    });    
  });

  return app;
}

module.exports.syncdb = function(options) {
  models.Role.create({
    name : "admin"
  })
  .success(function(role) {
    models.User.create({
      username: "admin",
      password: "admin"
    })
    .success(function(user) {
      user.addRole(role);
    });      
  });
}

module.exports.validateUser = function(username, password, done) {
  models.User.find({ 
    where: { 
      username:username, 
      password:password 
    } 
  })
  .success(function(user) {
    if (user == null) {
      done(null, false);
    } else {
      done(null, user);
    }
  });
}