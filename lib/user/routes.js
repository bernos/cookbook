var models = require('./models')
  , auth = require('../auth');

exports.index = {
  get: function(req, res, next) {
    models.User.findAll().success(function(users) {
      return res.render("index", { 
        title:"users",
        users:users 
      });
    });    
  }
}

exports.create = {
  get: function(req, res, next) {
    res.render("create", {
      title:"create user"
    });
  },
  post: function(req, res, next) {
    models.User.create(req.body).success(function(user) {
      res.redirect("/");
    });    
  }
}

exports.register = function(req, res, next) {
  var message = "";
  var username = "";

  if (req.body.username != null) {
    // Check whether passwords match
    if (req.body.password != null && req.body.password == req.body.confirm_password) {
      // Check if username is already in use
      return models.User.find({ 
        where: { 
          username: req.body.username 
        } 
      }).success(function(user) {
        if (user == null) {
          // Create a new user, then redirect
          models.User.create({
            username: req.body.username,
            password: auth.createPasswordHash(req.body.password)
          }).success(function(user) {
            // Log em in, and redirect
            req.login(user, function(err) {
              if (err) { 
                return next(err); 
              }

              return res.redirect('/recipes');
            });
          });
        } else {
          return res.render("register", {
            title: "Register",
            message: "Username is already in use",
            username: ""
          });
        }
      });
    }
    username = req.body.username;
    message = "Passwords must match";  
  }

  res.locals.hideAccountLinks = true;

  return res.render("register", {
    title: "Register",
    message: message,
    username: username
  });  
}