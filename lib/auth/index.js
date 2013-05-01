/**
 * The auth module is a wrapper around the passport module which adds a basic
 * login route and view, as well as some basic middleware to make it straight
 * forward to set up privileged routes (ie. routes which require login)
 * elsewhere in the app
 */
var express       = require('express'),
    routes        = require('./routes'),
    user          = require('../user'),
    passport      = require('passport'),
    localStrategy = require('passport-local'),
    crypto        = require('crypto');

var HASH_ITERATIONS = 1000;
var SALT_LENGTH     = 24;
var HASH_KEYLENGTH  = 24; 

/**
 * Initialize the passport module
 */
passport.use(new localStrategy.Strategy(function(username, password, done) {
  user.validateUser(username, password, done);
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  user.models.User.find(id).success(function(user) {
    if(user == null) {
      done("User "+ id +" not found")
    } else {
      done(false, user);
    }
  });
});

module.exports.createApplication = function(settings) {
  var app = express();

  app.set('views', __dirname + '/views');

  app.use(function(req, res, next) {
    res.locals.isLoggedIn = req.user != null;
    res.locals.user = req.user;
    res.locals.hideAccountLinks = false;
    next();
  });

  app.get('/login',   routes.login.get);
  app.get('/logout',  routes.logout.get);

  app.post('/login',  routes.login.post);

  return app;
}

/**
 * Convienience middleware that can be used to add authentication checks to your
 * routes. If the user has not logged in they will be redirected to the '/login'
 * route, which is also handled by the auth module.
 *
 * Options:
 *    - `successRedirect` URL to redirect to after login, defaults to the url of
 *                        the original request
 *    - `loginUrl`        URL of the login page, defaults to /login
 *
 * Examples:
 *
 *    app.get('/protected', auth.requiresLogin(), function(req, res) {
 *      // Your code here...
 *    });
 *
 * @return {Function}
 */
module.exports.requiresLogin = function(options) {
  options = options || {};
  options.loginUrl = options.loginUrl || '/login';

  return function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect(options.loginUrl + '?redir=' + (options.successRedirect || req.originalUrl));
    }
  };
};

module.exports.createPasswordHash = function(password) {  
  var salt = crypto.randomBytes(SALT_LENGTH).toString('base64');
  var hash = crypto.pbkdf2Sync(password, salt, HASH_ITERATIONS, HASH_KEYLENGTH).toString('base64');

  return HASH_ITERATIONS + ":" + salt + ":" + hash;
}

module.exports.validatePassword = function(password, goodHash) {
  var parts = goodHash.split(":");
  var iterations = parseInt(parts[0]);
  var salt = parts[1];

  var hash = crypto.pbkdf2Sync(password, salt, iterations, HASH_KEYLENGTH).toString('base64');

  console.log("hash is ", hash)

  return hash == parts[2];
  return password == goodHash;
}