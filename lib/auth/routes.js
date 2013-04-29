var passport = require('passport');

exports.login = {
  get : function(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect(req.query.redir || '/');
    }

    res.render("login", {
      title : "Login",
      redir : req.query.redir,
      message : req.flash('error')
    });
  },

  post : function(req, res, next) {
    passport.authenticate('local', {
      failureRedirect: '/login?redir=' + req.query.redir,
      successRedirect: req.body.redir || '/',
      failureFlash: "login failed"
    })(req,res,next);
  }
};

exports.logout = {
  get : function(req, res, next) {
    req.logout();
    res.redirect(req.param('redir') || '/');
  }
};